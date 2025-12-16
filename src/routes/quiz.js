const express = require('express');
const prisma = require('../prisma');
const { autentica } = require('../middleware/auth');
const { consenti } = require('../middleware/roles');
const { aggiungiJob } = require('../services/queue');

const router = express.Router();

/**
 * GET /api/quiz/:id - Ottieni quiz con domande
 */
router.get('/:id', autentica, async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { 
        domande: true,
        argomento: {
          include: { materia: true }
        }
      }
    });
    if (!quiz) return res.status(404).json({ errore: 'Quiz non trovato' });
    res.json({ quiz });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/quiz/:id/invia - invio risposte studente
 * body: { risposte: [{ domandaId, risposta }], tempoUsato }
 * Logica: valuta automaticamente multiple/multi-selezione e registra progress
 */
router.post('/:id/invia', autentica, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { risposte, tempoUsato = 0 } = req.body;
    const quiz = await prisma.quiz.findUnique({ where: { id }, include: { domande: true } });
    if (!quiz) return res.status(404).json({ errore: 'Quiz non trovato' });

    let punteggio = 0;
    const punteggioMax = quiz.domande.reduce((s, q) => s + q.punti, 0);
    const mapRisposte = {};
    (risposte || []).forEach(r => (mapRisposte[r.domandaId] = r.risposta));
    const dettagli = [];

    for (const d of quiz.domande) {
      const dato = mapRisposte[d.id];
      let corretto = false;
      let punteggioDomanda = 0;
      if (d.tipo === 'aperta') {
        corretto = null; // valutazione manuale
      } else {
        const scelte = d.scelte || [];
        const corrette = (scelte.filter(c => c.isCorrect)).map(c => c.testo);
        if (d.tipo === 'multipla') {
          if (typeof dato === 'string' && corrette.includes(dato)) {
            corretto = true;
            punteggioDomanda = d.punti;
          }
        } else if (d.tipo === 'multi-selezione') {
          if (Array.isArray(dato)) {
            const datoSet = new Set(dato);
            const corretteSet = new Set(corrette);
            const isExact = datoSet.size === corretteSet.size && [...datoSet].every(v => corretteSet.has(v));
            if (isExact) {
              corretto = true;
              punteggioDomanda = d.punti;
            } else {
              const matched = [...datoSet].filter(x => corretteSet.has(x)).length;
              if (corretteSet.size > 0) {
                punteggioDomanda = Math.round((matched / corretteSet.size) * d.punti);
              }
            }
          }
        }
      }
      if (punteggioDomanda) punteggio += punteggioDomanda;
      
      // Include spiegazione e link lezione nel feedback
      dettagli.push({
        domandaId: d.id,
        dato,
        corretto,
        punteggioDomanda,
        spiegazione: d.spiegazione || null,
        linkLezione: d.linkLezione || null,
        rispostaCorretta: d.tipo === 'aperta' ? null : (d.scelte || []).filter(c => c.isCorrect).map(c => c.testo),
        testoDomanda: d.testo,
        tipo: d.tipo
      });
    }

    // Salva progresso
    const progresso = await prisma.progresso.create({
      data: {
        utenteId: req.utente.id,
        quizId: id,
        punteggio,
        punteggioMax,
        tempoUsato,
        risposte: dettagli
      }
    });

    // Aggiorna punti utente e livello (semplice)
    const utente = await prisma.utente.findUnique({ where: { id: req.utente.id } });
    const nuoviPunti = utente.punti + punteggio;
    const livelloGain = Math.floor(nuoviPunti / 100);
    await prisma.utente.update({ where: { id: req.utente.id }, data: { punti: nuoviPunti, livello: 1 + livelloGain } });

    // Enqueue job per valutare distintivi ed aggiornare analisi
    try {
      await aggiungiJob('valuta-distintivi', { progressoId: progresso.id });
      // Job analisi on_submit (leggero) — worker può decidere di eseguire solo una parte rapida
      await aggiungiJob('calcola-analisi', { tipo: 'on_submit', utenteId: req.utente.id, quizId: id });
    } catch (err) {
      console.warn('Impossibile accodare job:', err.message);
    }

    res.json({ progresso, dettagli, punteggio, punteggioMax });
  } catch (err) {
    next(err);
  }
});

module.exports = router;