/**
 * 🏆 QUIZ ULTIMATE ROUTES V2
 * API endpoints con QuizGeneratorPro - Sistema Intelligente Definitivo
 */

const express = require('express');
const router = express.Router();
const { QuizGeneratorPro } = require('../services/quiz-generator-pro');
const { getContentManager } = require('../services/content-manager');

// Inizializza il nuovo sistema quiz PRO
const quizGeneratorPro = new QuizGeneratorPro();

// Ottieni Content Manager singleton
const contentManager = getContentManager();

console.log('🏆 Quiz Ultimate Routes V2: QuizGeneratorPro attivo');

/**
 * 🚀 POST /api/quiz-ultimate/genera
 * Genera quiz con il sistema PRO intelligente
 */
router.post('/genera', async (req, res) => {
  try {
    const { 
      materia = 'italiano',
      argomento,
      sottoargomento, 
      riassunto,
      numQuiz = 10
    } = req.body;

    if (!riassunto || !sottoargomento) {
      return res.status(400).json({ 
        success: false, 
        message: 'Riassunto e sottoargomento sono richiesti' 
      });
    }

    console.log(`\n🏆 QUIZ GENERATOR PRO - ${numQuiz} quiz per: ${sottoargomento}`);
    
    // Usa il nuovo QuizGeneratorPro
    let quiz = quizGeneratorPro.generaQuiz(riassunto, materia, sottoargomento, numQuiz);
    
    // Randomizza ordine
    quiz = quiz.sort(() => Math.random() - 0.5);
    
    // Randomizza opzioni di ogni quiz
    quiz.forEach(q => {
      if (q.opzioni) {
        q.opzioni = q.opzioni.sort(() => Math.random() - 0.5);
      }
    });
    
    // Calcola statistiche qualità
    const qualitaMedia = quiz.length > 0 
      ? quiz.reduce((sum, q) => sum + (q.qualita || 0.85), 0) / quiz.length 
      : 0;
    
    console.log(`✅ Generati ${quiz.length} quiz (qualità media: ${(qualitaMedia * 100).toFixed(0)}%)`);

    res.json({
      success: true,
      quiz,
      totale: quiz.length,
      qualita: {
        media: qualitaMedia
      },
      sottoargomento,
      materia
    });
  } catch (error) {
    console.error('❌ Errore generazione:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 🃏 POST /api/quiz-ultimate/flashcard
 * Genera flashcard con il sistema PRO
 */
router.post('/flashcard', async (req, res) => {
  try {
    const { 
      materia = 'italiano',
      sottoargomento, 
      riassunto
    } = req.body;

    if (!riassunto || !sottoargomento) {
      return res.status(400).json({ 
        success: false, 
        message: 'Riassunto e sottoargomento sono richiesti' 
      });
    }

    console.log(`\n🃏 Generazione flashcard per: ${sottoargomento}`);
    
    const flashcards = quizGeneratorPro.generaFlashcard(riassunto, materia, sottoargomento);
    
    console.log(`✅ Generate ${flashcards.length} flashcard`);

    res.json({
      success: true,
      flashcards,
      totale: flashcards.length,
      sottoargomento,
      materia
    });
  } catch (error) {
    console.error('❌ Errore generazione flashcard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * ⚡ GET /api/quiz-ultimate/veloce
 * Quiz veloce - 10 domande casuali da tutte le materie
 */
router.get('/veloce', async (req, res) => {
  try {
    const numDomande = parseInt(req.query.numDomande) || 10;
    
    // Carica tutti i quiz dai file JSON
    const fs = require('fs');
    const path = require('path');
    const quizDir = path.join(__dirname, '../data/quiz-generati');
    
    let tuttiQuiz = [];
    
    // Leggi tutti i file quiz-*.json
    const files = fs.readdirSync(quizDir).filter(f => f.startsWith('quiz-') && f.endsWith('.json') && !f.includes('nuovo'));
    
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(quizDir, file), 'utf8'));
        const quizzes = data.quiz || data;
        if (Array.isArray(quizzes)) {
          // Normalizza formato
          quizzes.forEach(q => {
            tuttiQuiz.push({
              id: q.id,
              domanda: q.domanda,
              opzioni: q.opzioni || [q.corretta ? 'Vero' : 'Falso', q.corretta ? 'Falso' : 'Vero'],
              rispostaCorretta: q.opzioni ? q.opzioni[q.corretta] : (q.corretta ? 'Vero' : 'Falso'),
              spiegazione: q.spiegazione,
              materia: q.materia || data.materia || file.replace('quiz-', '').replace('.json', ''),
              tipo: q.tipo,
              difficolta: q.difficolta
            });
          });
        }
      } catch (e) {
        console.log(`Errore lettura ${file}:`, e.message);
      }
    }
    
    // Randomizza e prendi N domande
    const quizSelezionati = tuttiQuiz
      .sort(() => Math.random() - 0.5)
      .slice(0, numDomande);
    
    console.log(`⚡ Quiz Veloce: ${quizSelezionati.length}/${tuttiQuiz.length} quiz selezionati`);
    
    res.json({
      success: true,
      quiz: quizSelezionati,
      totale: quizSelezionati.length,
      disponibili: tuttiQuiz.length
    });
  } catch (error) {
    console.error('❌ Errore quiz veloce:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 📚 GET /api/quiz-ultimate/materia/:materia
 * Quiz per una specifica materia
 */
router.get('/materia/:materia', async (req, res) => {
  try {
    const { materia } = req.params;
    const numDomande = parseInt(req.query.numDomande) || 10;
    
    const fs = require('fs');
    const path = require('path');
    const quizDir = path.join(__dirname, '../data/quiz-generati');
    
    // Mappa nomi materie
    const materiaMap = {
      'italiano': 'italiano',
      'storia': 'storia', 
      'filosofia': 'filosofia',
      'arte': 'arte',
      'matematica': 'matematica',
      'fisica': 'fisica',
      'scienze': 'scienze',
      'latino': 'latino',
      'inglese': 'inglese',
      'religione': 'religione'
    };
    
    const materiaFile = materiaMap[materia.toLowerCase()] || materia.toLowerCase();
    const filePath = path.join(quizDir, `quiz-${materiaFile}.json`);
    
    let quizMateria = [];
    
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const quizzes = data.quiz || data;
      if (Array.isArray(quizzes)) {
        quizzes.forEach(q => {
          quizMateria.push({
            id: q.id,
            domanda: q.domanda,
            opzioni: q.opzioni || [q.corretta ? 'Vero' : 'Falso', q.corretta ? 'Falso' : 'Vero'],
            rispostaCorretta: q.opzioni ? q.opzioni[q.corretta] : (q.corretta ? 'Vero' : 'Falso'),
            spiegazione: q.spiegazione,
            materia: data.materia || materiaFile,
            tipo: q.tipo,
            difficolta: q.difficolta
          });
        });
      }
    }
    
    // Randomizza e prendi N domande
    const quizSelezionati = quizMateria
      .sort(() => Math.random() - 0.5)
      .slice(0, numDomande);
    
    console.log(`📚 Quiz ${materia}: ${quizSelezionati.length}/${quizMateria.length} quiz selezionati`);
    
    res.json({
      success: true,
      quiz: quizSelezionati,
      totale: quizSelezionati.length,
      disponibili: quizMateria.length,
      materia
    });
  } catch (error) {
    console.error('❌ Errore quiz materia:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 🧪 GET /api/quiz-ultimate/test
 * Test veloce del sistema
 */
router.get('/test', async (req, res) => {
  try {
    const testoTest = `Martin Heidegger nacque nel 1889 a Meßkirch in Germania. Fu allievo di Edmund Husserl e divenne il principale esponente dell'esistenzialismo tedesco. La sua opera principale "Essere e Tempo" del 1927 analizza la struttura dell'esistenza umana. Heidegger introduce il concetto di Dasein, l'esserci, come modo di essere proprio dell'uomo. L'angoscia rivela il nulla e apre alla comprensione autentica. Heidegger morì nel 1976.`;
    
    const quiz = quizGeneratorPro.generaQuiz(testoTest, 'filosofia', 'Heidegger', 8);
    const flashcards = quizGeneratorPro.generaFlashcard(testoTest, 'filosofia', 'Heidegger');

    res.json({
      success: true,
      test: {
        quizGenerati: quiz.length,
        flashcardGenerate: flashcards.length,
        esempiQuiz: quiz.slice(0, 3).map(q => ({
          domanda: q.domanda,
          risposta: q.rispostaCorretta,
          opzioni: q.opzioni
        })),
        esempiFlashcard: flashcards.slice(0, 2)
      },
      messaggio: `✅ QuizGeneratorPro funziona! ${quiz.length} quiz, ${flashcards.length} flashcard`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 📊 GET /api/quiz-ultimate/info
 * Info sul sistema
 */
router.get('/info', (req, res) => {
  res.json({
    success: true,
    sistema: 'QuizGeneratorPro V2',
    caratteristiche: [
      'Estrazione fatti strutturati (nascita, morte, opera, relazione, concetto, definizione)',
      'Knowledge Base con 10+ autori italiani e 8+ filosofi',
      'Distrattori intelligenti basati su errori comuni',
      'Validazione multi-criterio',
      'Flashcard contestuali'
    ],
    materie_supportate: ['italiano', 'filosofia', 'storia', 'arte', 'latino'],
    versione: '2.0.0'
  });
});

module.exports = router;
