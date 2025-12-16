const express = require('express');
const router = express.Router();
const flashcardGen = require('../services/flashcard-generator');

// GET /api/flashcards-completo/all - Tutte le flashcards
router.get('/all', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;
  
  const tutteFlashcards = flashcardGen.flashcards;
  const paginate = tutteFlashcards.slice(skip, skip + limit);
  
  res.json({
    flashcards: paginate,
    totale: tutteFlashcards.length,
    pagina: page,
    totalePagine: Math.ceil(tutteFlashcards.length / limit)
  });
});

// GET /api/flashcards-completo/materia/:nome - Flashcards per materia
router.get('/materia/:nome', (req, res) => {
  const { nome } = req.params;
  const limit = parseInt(req.query.limit) || 30;
  
  const flashcards = flashcardGen.getFlashcardsPerMateria(nome, limit);
  res.json({ flashcards, totale: flashcards.length });
});

// GET /api/flashcards-completo/argomento/:titolo - Flashcards per sottoargomento
router.get('/argomento/:titolo', (req, res) => {
  const { titolo } = req.params;
  const limit = parseInt(req.query.limit) || 30;
  
  const flashcards = flashcardGen.getFlashcardsPerSottoargomento(titolo, limit);
  res.json({ flashcards, totale: flashcards.length });
});

// GET /api/flashcards-completo/da-ripassare - Flashcards da ripassare oggi
router.get('/da-ripassare', (req, res) => {
  const utenteId = req.user?.id || 'guest';
  const flashcards = flashcardGen.getFlashcardsDaRipassare(utenteId);
  
  res.json({
    flashcards,
    totale: flashcards.length,
    messaggio: flashcards.length > 0 
      ? `Hai ${flashcards.length} flashcards da ripassare oggi!`
      : 'Nessuna flashcard da ripassare oggi. Ottimo lavoro!'
  });
});

// POST /api/flashcards-completo/revisione - Registra revisione flashcard
router.post('/revisione', (req, res) => {
  const { flashcardId, qualita, responseTime } = req.body;
  
  // qualita: 0-5 (0=dimenticato, 5=perfetto)
  if (qualita < 0 || qualita > 5) {
    return res.status(400).json({ errore: 'Qualità deve essere tra 0 e 5' });
  }
  
  const flashcard = flashcardGen.aggiornaFlashcard(flashcardId, qualita, responseTime || 5000);
  
  if (!flashcard) {
    return res.status(404).json({ errore: 'Flashcard non trovata' });
  }
  
  res.json({
    flashcard,
    prossimaRevisione: flashcard.nextReview,
    intervalloGiorni: flashcard.interval,
    messaggio: qualita >= 3 ? 'Ottimo! Continua così!' : 'Non ti preoccupare, ripassa ancora!'
  });
});

// GET /api/flashcards-completo/stats - Statistiche flashcards utente
router.get('/stats', (req, res) => {
  const utenteId = req.user?.id || 'guest';
  const stats = flashcardGen.getStatistiche(utenteId);
  
  res.json(stats);
});

// GET /api/flashcards-completo/random - Flashcard casuale
router.get('/random', (req, res) => {
  const flashcard = flashcardGen.flashcards[
    Math.floor(Math.random() * flashcardGen.flashcards.length)
  ];
  res.json({ flashcard });
});

// GET /api/flashcards-completo/sessione - Inizia sessione di ripasso
router.get('/sessione', (req, res) => {
  const utenteId = req.user?.id || 'guest';
  const limite = parseInt(req.query.limite) || 20;
  
  const daRipassare = flashcardGen.getFlashcardsDaRipassare(utenteId).slice(0, limite);
  
  res.json({
    sessione: {
      flashcards: daRipassare,
      totale: daRipassare.length,
      tempoPrevisto: daRipassare.length * 30, // 30 sec per flashcard
      inizio: new Date()
    }
  });
});

module.exports = router;
