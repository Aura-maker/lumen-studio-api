// ✅ API ESAMI - Routes per simulazioni Maturità
const express = require('express');
const router = express.Router();
const GeneratoreEsamiMatematica = require('../services/esami-matematica-generator');
const GeneratoreEsamiMatematicaAvanzato = require('../services/esami-matematica-avanzato');
const GeneratoreEsamiItaliano = require('../services/esami-italiano-generator');
const GeneratoreEsamiItalianoAvanzato = require('../services/esami-italiano-avanzato');

// Inizializza i generatori
const generatoreMatematica = new GeneratoreEsamiMatematica();
const generatoreMatematicaAvanzato = new GeneratoreEsamiMatematicaAvanzato();
const generatoreItaliano = new GeneratoreEsamiItaliano();
const generatoreItalianoAvanzato = new GeneratoreEsamiItalianoAvanzato();

// Genera esami base e avanzati
generatoreMatematica.genera(100); // 100 esami base
generatoreMatematicaAvanzato.genera(100); // 100 esami avanzati
generatoreItaliano.genera(100); // 100 esami base  
generatoreItalianoAvanzato.genera(100); // 100 esami avanzati
console.log('✅ 400 esami maturità pronti! (200 Matematica + 200 Italiano)');

// ========================================
// MATEMATICA - Seconda Prova
// ========================================

// GET /api/esami/matematica - Lista tutti gli esami matematica
router.get('/matematica', (req, res) => {
  // Combina esami base e avanzati
  const esamiBase = generatoreMatematica.esami.map(e => ({...e, livello: 'base'}));
  const esamiAvanzati = generatoreMatematicaAvanzato.esami.map(e => ({...e, livello: 'avanzato'}));
  const tuttiEsami = [...esamiBase, ...esamiAvanzati];
  
  const esami = tuttiEsami.map(e => ({
    id: e.id,
    titolo: e.titolo,
    sottotitolo: e.sottotitolo,
    durata: e.durata,
    struttura: e.struttura,
    livello: e.livello,
    difficolta: e.metadata?.difficolta || 'standard'
  }));
  
  res.json({
    totale: esami.length,
    esami
  });
});

// GET /api/esami/matematica/casuale - Esame casuale (PRIMA di /:id)
router.get('/matematica/casuale', (req, res) => {
  // Scegli casualmente tra base e avanzato
  const useAvanzato = Math.random() > 0.5;
  const esame = useAvanzato ? 
    generatoreMatematicaAvanzato.getEsameCasuale() : 
    generatoreMatematica.getEsameCasuale();
  res.json(esame);
});

// GET /api/esami/matematica/:id - Ottieni esame specifico
router.get('/matematica/:id', (req, res) => {
  // Cerca prima negli esami base, poi in quelli avanzati
  let esame = generatoreMatematica.getEsame(req.params.id);
  if (!esame) {
    esame = generatoreMatematicaAvanzato.getEsame(req.params.id);
  }
  
  if (!esame) {
    return res.status(404).json({ error: 'Esame non trovato' });
  }
  
  res.json(esame);
});

// POST /api/esami/matematica/genera - Genera nuovi esami
router.post('/matematica/genera', (req, res) => {
  const { numero = 10 } = req.body;
  const nuoviEsami = generatoreMatematica.genera(numero);
  
  res.json({
    generati: numero,
    totale: generatoreMatematica.esami.length,
    nuoviEsami: nuoviEsami.slice(-numero).map(e => ({
      id: e.id,
      titolo: e.titolo
    }))
  });
});

// ========================================
// ITALIANO - Prima Prova
// ========================================

// GET /api/esami/italiano - Lista tutti gli esami italiano
router.get('/italiano', (req, res) => {
  // Combina esami base e avanzati
  const esamiBase = generatoreItaliano.esami.map(e => ({...e, livello: 'base'}));
  const esamiAvanzati = generatoreItalianoAvanzato.esami.map(e => ({...e, livello: 'avanzato'}));
  const tuttiEsami = [...esamiBase, ...esamiAvanzati];
  
  const esami = tuttiEsami.map(e => ({
    id: e.id,
    titolo: e.titolo,
    sottotitolo: e.sottotitolo,
    durata: e.durata,
    livello: e.livello,
    difficolta: e.metadata?.difficolta || 'standard',
    tracce: e.tracce.map(t => ({
      tipologia: t.tipologia,
      titolo: t.titolo
    }))
  }));
  
  res.json({
    totale: esami.length,
    esami
  });
});

// GET /api/esami/italiano/casuale - Esame casuale (PRIMA di /:id)
router.get('/italiano/casuale', (req, res) => {
  // Scegli casualmente tra base e avanzato
  const useAvanzato = Math.random() > 0.5;
  const esame = useAvanzato ? 
    generatoreItalianoAvanzato.getEsameCasuale() : 
    generatoreItaliano.getEsameCasuale();
  res.json(esame);
});

// GET /api/esami/italiano/:id - Ottieni esame specifico
router.get('/italiano/:id', (req, res) => {
  // Cerca prima negli esami base, poi in quelli avanzati
  let esame = generatoreItaliano.getEsame(req.params.id);
  if (!esame) {
    esame = generatoreItalianoAvanzato.getEsame(req.params.id);
  }
  
  if (!esame) {
    return res.status(404).json({ error: 'Esame non trovato' });
  }
  
  res.json(esame);
});

// POST /api/esami/italiano/genera - Genera nuovi esami
router.post('/italiano/genera', (req, res) => {
  const { numero = 10 } = req.body;
  const nuoviEsami = generatoreItaliano.genera(numero);
  
  res.json({
    generati: numero,
    totale: generatoreItaliano.esami.length,
    nuoviEsami: nuoviEsami.slice(-numero).map(e => ({
      id: e.id,
      titolo: e.titolo
    }))
  });
});

// ========================================
// STATISTICHE GENERALI
// ========================================

// GET /api/esami/stats - Statistiche complete
router.get('/stats', (req, res) => {
  res.json({
    matematica: {
      totale: generatoreMatematica.esami.length,
      durata: '6 ore',
      struttura: '1 problema (su 2) + 4 quesiti (su 8)'
    },
    italiano: {
      totale: generatoreItaliano.esami.length,
      durata: '6 ore',
      struttura: '1 traccia (A1, A2, B, C)'
    },
    totaleEsami: generatoreMatematica.esami.length + generatoreItaliano.esami.length
  });
});

module.exports = router;
