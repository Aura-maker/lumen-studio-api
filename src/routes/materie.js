// CRUD per materie e sezioni anno (italiano)
const express = require('express');
const prisma = require('../prisma');
const { autentica } = require('../middleware/auth');
const { consenti } = require('../middleware/roles');
const tutteMaterie = require('../data/tutte-materie');

const router = express.Router();

/**
 * GET /api/materie - lista materie (con paginazione)
 */
router.get('/', async (req, res, next) => {
  try {
    const pagina = Math.max(1, parseInt(req.query.pagina || '1'));
    const limite = Math.min(100, parseInt(req.query.limite || '20'));
    const skip = (pagina - 1) * limite;
    const materie = await prisma.materia.findMany({ include: { sezioniAnno: true }, skip, take: limite });
    res.json({ materie, pagina, limite });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/materie/:id/argomenti - elenco argomenti della materia
 * Se la materia non ha argomenti, effettua un bootstrap automatico con 3 argomenti
 * completi di flashcard e un quiz con 2 domande.
 */
router.get('/:id/argomenti', async (req, res, next) => {
  try {
    const { id } = req.params;
    const materia = await prisma.materia.findUnique({ where: { id } });
    if (!materia) return res.status(404).json({ errore: 'Materia non trovata' });

    let argomenti = await prisma.argomento.findMany({ where: { materiaId: id }, include: { quiz: true, flashcard: true } });
    if (argomenti.length === 0) {
      console.log('🔍 Bootstrap argomenti per materia:', materia.nome);
      
      // Carica contenuti da tutte-materie.js
      const nomeMateria = materia.nome;
      let datiMateria = null;
      
      // Cerca la materia nei contenuti
      for (const [key, valore] of Object.entries(tutteMaterie)) {
        if (valore.materia && valore.materia.nome === nomeMateria) {
          datiMateria = valore;
          break;
        }
      }
      
      console.log('📦 Dati materia trovati:', datiMateria ? 'SI' : 'NO', 'per', nomeMateria);
      
      let contenuti = [];
      if (datiMateria && datiMateria.argomenti && datiMateria.argomenti.length > 0) {
        // Usa i contenuti completi da tutte-materie.js
        for (const argData of datiMateria.argomenti) {
          for (const sottoData of argData.sottoargomenti) {
            contenuti.push({
              titolo: sottoData.titolo,
              riassunto: sottoData.riassunto,
              domande: [] // Le domande sono in file separati
            });
          }
        }
      }
      
      console.log('📦 Contenuti trovati:', contenuti.length, 'per', materia.nome);
      
      // Nome senza emoji per fallback
      const nomeBase = materia.nome.replace(/[\p{Emoji}\s]+/gu, '').trim();
      
      if (contenuti.length === 0) {
        console.log('⚠️ Nessun contenuto completo, uso presets per', nomeBase);
        // Fallback a presets semplici se non trovato
        const presets = {
        'Arte': [
          { titolo: '🎨 Avanguardie storiche', descrizione: 'Dal **Futurismo** al **Surrealismo**: modernità, *astrazione*, *automatismo*.' },
          { titolo: '🖼️ Arte contemporanea', descrizione: 'Installazioni, *performance*, **concettuale** e nuovi media.' },
          { titolo: '🏛️ Critica d’arte', descrizione: 'Metodi e strumenti per analizzare le opere con linguaggio tecnico.' }
        ],
        'Filosofia': [
          { titolo: '🧠 Esistenzialismo', descrizione: 'Libertà, *assurdo*, **responsabilità** in Sartre e Camus.' },
          { titolo: '🧩 Analitica e linguaggio', descrizione: 'Verificazionismo, *giochi linguistici*, **Wittgenstein**.' },
          { titolo: '📚 Ermeneutica', descrizione: 'Interpretazione, *orizzonte di senso*, **Gadamer** e **Ricoeur**.' }
        ],
        'Fisica': [
          { titolo: '⚛️ Relatività ristretta', descrizione: 'Postulati, *dilatazione dei tempi*, **E=mc^2**.' },
          { titolo: '🧪 Meccanica quantistica', descrizione: 'Dualismo onda-particella, *principio di indeterminazione*.' },
          { titolo: '🌊 Onde e interferenza', descrizione: 'Diffrazione, *interferenza*, esperimenti di Young.' }
        ],
        'Inglese': [
          { titolo: '✍️ Modernismo', descrizione: 'Stream of consciousness, **Woolf**, **Eliot**.' },
          { titolo: '📖 Postmodernismo', descrizione: 'Metanarrazioni, *intertestualità*, **Pynchon**.' },
          { titolo: '🗣️ Language skills', descrizione: 'Writing, reading, listening, speaking — advanced.' }
        ],
        'Latino': [
          { titolo: '🏺 Retorica', descrizione: '*Inventio*, *dispositio*, **elocutio**; **Quintiliano**.' },
          { titolo: '📜 Storiografia', descrizione: '**Tacito**, **Svetonio**, metodi e stile.' },
          { titolo: '🗣️ Oratoria', descrizione: 'Scuole tardoantiche, declamazione e *imitatio*.' }
        ],
        'Matematica': [
          { titolo: '📈 Derivate', descrizione: 'Studio di funzione: *crescenza/decrescenza*, **massimi/minimi**.' },
          { titolo: '📉 Integrali', descrizione: 'Primitive, *aree*, integrazione per parti e sostituzione.' },
          { titolo: '🎲 Probabilità e statistica', descrizione: 'Variabili, *distribuzioni*, indicatori di sintesi.' }
        ],
        'Religione': [
          { titolo: '🤝 Etica sociale', descrizione: '**Bene comune**, *sussidiarietà*, *solidarietà*.' },
          { titolo: '🕊️ Dialogo interreligioso', descrizione: 'Incontro e rispetto, *pluralismo* contemporaneo.' },
          { titolo: '📜 Dottrina sociale', descrizione: 'Principi e applicazioni nel mondo del lavoro.' }
        ],
        'Scienze naturali': [
          { titolo: '🧬 Genetica mendeliana', descrizione: 'Leggi di **Mendel**, *genotipo* vs *fenotipo*.' },
          { titolo: '🌿 Evoluzione', descrizione: '**Selezione naturale**, adattamento e speciazione.' },
          { titolo: '🔬 Biologia molecolare', descrizione: 'DNA, *replicazione*, *trascrizione*, *traduzione*.' }
        ],
        'Storia': [
          { titolo: '🛰️ Guerra Fredda', descrizione: 'Blocchi **USA/URSS**, *détente*, 1989.' },
          { titolo: '🌍 Globalizzazione', descrizione: 'Interdipendenza economica, *ICT*, migrazioni.' },
          { titolo: '🇪🇺 Integrazione europea', descrizione: 'Da CECA a **UE**, trattati e allargamenti.' }
        ]
      };

        const base = presets[materia.nome] || presets[nomeBase] || [
          { titolo: 'Unità 1', descrizione: 'Introduzione ai concetti chiave.' },
          { titolo: 'Unità 2', descrizione: 'Approfondimento e casi studio.' }
        ];

        for (const a of base) {
          const arg = await prisma.argomento.create({ data: { titolo: a.titolo, descrizione: a.descrizione, materiaId: id } });
          await prisma.flashcard.createMany({ data: [
            { fronte: `${a.titolo}: concetto chiave`, retro: 'Definizione sintetica e applicazione.', argomentoId: arg.id },
            { fronte: `${a.titolo}: formula/principio`, retro: 'Uso pratico e note di metodo.', argomentoId: arg.id }
          ]});
          const quiz = await prisma.quiz.create({ data: { titolo: `Quiz — ${a.titolo}`, argomentoId: arg.id, pubblico: true, punteggioMax: 2, tempoLimite: 180 } });
          await prisma.domanda.createMany({ data: [
            { testo: `Concetto centrale di ${a.titolo}?`, tipo: 'multipla', scelte: [
              { testo: 'Definizione corretta', isCorrect: true }, { testo: 'Opzione distrattore', isCorrect: false }
            ], quizId: quiz.id, punti: 1 },
            { testo: `Applicazione di ${a.titolo}?`, tipo: 'multipla', scelte: [
              { testo: 'Esempio corretto', isCorrect: true }, { testo: 'Esempio scorretto', isCorrect: false }
            ], quizId: quiz.id, punti: 1 }
          ]});
        }
      } else {
        // Usa contenuti completi dal programma di quinta
        for (const a of contenuti) {
          const arg = await prisma.argomento.create({ data: { titolo: a.titolo, descrizione: a.riassunto, materiaId: id } });
          
          // Genera flashcard dalle prime frasi del riassunto
          const frasi = a.riassunto.split('.').filter(f => f.trim().length > 10).slice(0, 3);
          await prisma.flashcard.createMany({ data: frasi.map((f, i) => ({
            fronte: `${a.titolo} - Concetto ${i+1}`,
            retro: f.trim() + '.',
            argomentoId: arg.id
          }))});
          
          // Genera quiz con tutte le domande
          if (a.domande && a.domande.length > 0) {
            const punteggioMax = a.domande.length;
            const quiz = await prisma.quiz.create({ 
              data: { 
                titolo: `Quiz completo: ${a.titolo}`, 
                argomentoId: arg.id, 
                pubblico: true, 
                punteggioMax, 
                tempoLimite: Math.max(180, a.domande.length * 30)
              } 
            });
            
            for (const d of a.domande) {
              await prisma.domanda.create({ data: {
                testo: d.q,
                tipo: 'multipla',
                scelte: d.r.map((risposta, idx) => ({ testo: risposta, isCorrect: idx === d.c })),
                quizId: quiz.id,
                punti: 1
              }});
            }
          }
        }
      }

      argomenti = await prisma.argomento.findMany({ where: { materiaId: id }, include: { quiz: true, flashcard: true } });
    }

    res.json({ argomenti });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/materie - crea materia (DOCENTE/ADMIN)
 * body: { nome, descrizione, sezioni: [{ etichetta }] }
 */
router.post('/', autentica, consenti('ADMIN', 'DOCENTE'), async (req, res, next) => {
  try {
    const { nome, descrizione, sezioni } = req.body;
    const materia = await prisma.materia.create({
      data: {
        nome,
        descrizione,
        sezioniAnno: { create: sezioni || [] }
      },
      include: { sezioniAnno: true }
    });
    res.status(201).json({ materia });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/materie/:id - aggiorna una materia
 */
router.put('/:id', autentica, consenti('ADMIN', 'DOCENTE'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nome, descrizione } = req.body;
    const materia = await prisma.materia.update({ where: { id }, data: { nome, descrizione } });
    res.json({ materia });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/materie/:id - elimina materia (solo ADMIN)
 */
router.delete('/:id', autentica, consenti('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.argomento.deleteMany({ where: { materiaId: id } });
    await prisma.materia.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;