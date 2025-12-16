/**
 * 🎓 QUIZ SYSTEM API ROUTES
 * API per il sistema di generazione quiz intelligente
 */

const express = require('express');
const router = express.Router();
const {
  createQuizGenerator,
  createAdaptiveSystem,
  createValidator,
  generateQuickQuiz,
  analyzeQuizQuality,
  LIVELLI_BLOOM,
  TIPI_DOMANDA
} = require('../services/quiz-system');

// Istanze singleton (in produzione usare dependency injection)
let quizGenerator = null;
let adaptiveSystem = null;

// Inizializza i servizi
function getQuizGenerator() {
  if (!quizGenerator) {
    quizGenerator = createQuizGenerator({
      maxQuiz: 12,
      livelloMinimo: 1,
      livelloMassimo: 5,
      qualitaMinima: 0.65
    });
  }
  return quizGenerator;
}

function getAdaptiveSystem() {
  if (!adaptiveSystem) {
    adaptiveSystem = createAdaptiveSystem({
      velocitaAdattamento: 0.15,
      finestraAnalisi: 20
    });
  }
  return adaptiveSystem;
}

// ==================== GENERAZIONE QUIZ ====================

/**
 * POST /api/quiz-system/generate
 * Genera quiz da un sottoargomento
 */
router.post('/generate', async (req, res) => {
  try {
    const { 
      titolo, 
      contenuto, 
      materia, 
      argomento,
      maxQuiz = 10,
      livelloMinimo = 1,
      livelloMassimo = 5
    } = req.body;

    if (!contenuto || contenuto.length < 100) {
      return res.status(400).json({
        success: false,
        error: 'Contenuto insufficiente (minimo 100 caratteri)'
      });
    }

    const generator = getQuizGenerator();
    
    // Aggiorna config se necessario
    generator.config.maxQuizPerSottoargomento = maxQuiz;
    generator.config.livelloMinimo = livelloMinimo;
    generator.config.livelloMassimo = livelloMassimo;

    const quiz = await generator.generaQuizDaSottoargomento({
      titolo: titolo || 'Quiz Generato',
      contenuto,
      materia: materia || 'Generale',
      argomento: argomento || 'Generale'
    });

    res.json({
      success: true,
      quiz,
      statistiche: generator.getStatistiche()
    });

  } catch (error) {
    console.error('Errore generazione quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Errore durante la generazione dei quiz',
      details: error.message
    });
  }
});

/**
 * POST /api/quiz-system/generate-quick
 * Genera quiz rapido da testo semplice
 */
router.post('/generate-quick', async (req, res) => {
  try {
    const { testo, maxQuiz = 5, materia, argomento } = req.body;

    if (!testo || testo.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Testo insufficiente (minimo 50 caratteri)'
      });
    }

    const quiz = await generateQuickQuiz(testo, {
      maxQuiz,
      materia,
      argomento
    });

    res.json({
      success: true,
      quiz,
      totale: quiz.length
    });

  } catch (error) {
    console.error('Errore quick quiz:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== DIFFICOLTA ADATTIVA ====================

/**
 * POST /api/quiz-system/adaptive/risposta
 * Registra una risposta e aggiorna stato utente
 */
router.post('/adaptive/risposta', async (req, res) => {
  try {
    const {
      userId,
      questionId,
      corretta,
      tempoMs,
      difficolta,
      argomento,
      livelloBloom
    } = req.body;

    if (!userId || questionId === undefined || corretta === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Parametri mancanti: userId, questionId, corretta'
      });
    }

    const adaptive = getAdaptiveSystem();

    // Aggiorna stato
    const stato = adaptive.aggiornaStato(userId, {
      questionId,
      corretta,
      tempoMs: tempoMs || 10000,
      difficolta: difficolta || 3,
      argomento,
      livelloBloom
    });

    // Calcola prossima revisione (spaced repetition)
    const revisione = adaptive.calcolaProssimaRevisione(userId, questionId, {
      corretta,
      tempoMs: tempoMs || 10000,
      difficolta: difficolta || 3
    });

    res.json({
      success: true,
      stato: {
        livelloStimato: stato.livelloStimato,
        streak: stato.statistiche.streak,
        accuratezza: stato.statistiche.corrette / Math.max(stato.statistiche.totaleRisposte, 1)
      },
      revisione,
      prossimaDifficolta: adaptive.selezionaDifficolta(userId, argomento)
    });

  } catch (error) {
    console.error('Errore adaptive risposta:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/quiz-system/adaptive/analisi/:userId
 * Ottieni analisi dettagliata per utente
 */
router.get('/adaptive/analisi/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const adaptive = getAdaptiveSystem();
    
    const analisi = adaptive.generaAnalisi(userId);

    res.json({
      success: true,
      analisi
    });

  } catch (error) {
    console.error('Errore analisi:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/quiz-system/adaptive/difficolta/:userId
 * Ottieni difficoltà consigliata
 */
router.get('/adaptive/difficolta/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { argomento } = req.query;
    
    const adaptive = getAdaptiveSystem();
    const difficolta = adaptive.selezionaDifficolta(userId, argomento);

    res.json({
      success: true,
      ...difficolta
    });

  } catch (error) {
    console.error('Errore difficolta:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/quiz-system/adaptive/filtra
 * Filtra domande per difficoltà appropriata
 */
router.post('/adaptive/filtra', async (req, res) => {
  try {
    const { userId, domande, argomento } = req.body;

    if (!userId || !domande || !Array.isArray(domande)) {
      return res.status(400).json({
        success: false,
        error: 'Parametri mancanti: userId, domande (array)'
      });
    }

    const adaptive = getAdaptiveSystem();
    const filtrate = adaptive.filtraDomande(domande, userId, argomento);

    res.json({
      success: true,
      domande: filtrate,
      totaleOriginale: domande.length,
      totaleFiltrate: filtrate.length
    });

  } catch (error) {
    console.error('Errore filtra:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== VALIDAZIONE ====================

/**
 * POST /api/quiz-system/validate
 * Valida una singola domanda
 */
router.post('/validate', async (req, res) => {
  try {
    const { domanda } = req.body;

    if (!domanda) {
      return res.status(400).json({
        success: false,
        error: 'Domanda mancante'
      });
    }

    const validator = createValidator();
    const validazione = validator.valida(domanda);

    res.json({
      success: true,
      validazione
    });

  } catch (error) {
    console.error('Errore validazione:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/quiz-system/validate-batch
 * Valida un batch di domande e genera report
 */
router.post('/validate-batch', async (req, res) => {
  try {
    const { domande } = req.body;

    if (!domande || !Array.isArray(domande)) {
      return res.status(400).json({
        success: false,
        error: 'domande deve essere un array'
      });
    }

    const report = analyzeQuizQuality(domande);

    res.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Errore batch validation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== STATISTICHE ====================

/**
 * GET /api/quiz-system/stats
 * Ottieni statistiche del sistema
 */
router.get('/stats', async (req, res) => {
  try {
    const generator = getQuizGenerator();
    
    res.json({
      success: true,
      statistiche: generator.getStatistiche(),
      livelli: LIVELLI_BLOOM,
      tipiDomanda: TIPI_DOMANDA
    });

  } catch (error) {
    console.error('Errore stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/quiz-system/reset
 * Reset del generatore (per test)
 */
router.post('/reset', async (req, res) => {
  try {
    if (quizGenerator) {
      quizGenerator.reset();
    }
    
    res.json({
      success: true,
      message: 'Sistema resettato'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== PERSISTENZA STATO ====================

/**
 * GET /api/quiz-system/adaptive/export/:userId
 * Esporta stato utente per salvataggio
 */
router.get('/adaptive/export/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const adaptive = getAdaptiveSystem();
    
    const stato = adaptive.esportaStato(userId);

    res.json({
      success: true,
      stato
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/quiz-system/adaptive/import
 * Importa stato utente salvato
 */
router.post('/adaptive/import', async (req, res) => {
  try {
    const { stato } = req.body;

    if (!stato || !stato.userId) {
      return res.status(400).json({
        success: false,
        error: 'Stato utente mancante o invalido'
      });
    }

    const adaptive = getAdaptiveSystem();
    adaptive.importaStato(stato);

    res.json({
      success: true,
      message: `Stato importato per utente ${stato.userId}`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
