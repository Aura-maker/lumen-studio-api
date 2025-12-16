// ROUTES PER AI ESTRAI & CREA
const express = require('express');
const router = express.Router();
const AIEstraiCreaController = require('../controllers/ai-estrai-crea-controller');

const controller = new AIEstraiCreaController();

// ENDPOINT PRINCIPALE: Processa input (foto o testo)
router.post('/process', 
  controller.getUploadMiddleware(),
  async (req, res) => {
    await controller.processInput(req, res);
  }
);

// ENDPOINT: Ottieni anteprima risultati
router.get('/preview/:session_id', async (req, res) => {
  await controller.getPreview(req, res);
});

// ENDPOINT: Salva nel profilo utente
router.post('/save', async (req, res) => {
  await controller.saveToProfile(req, res);
});

// ENDPOINT: Rigenera con parametri diversi
router.post('/regenerate', async (req, res) => {
  await controller.regenerateContent(req, res);
});

// ENDPOINT: Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'AI Estrai & Crea',
    status: 'operational',
    version: '1.0.0',
    features: [
      'OCR robusto',
      'Classificazione automatica',
      'Generazione quiz intelligente',
      'Generazione flashcards',
      'Validazione qualità',
      'Controlli sicurezza'
    ]
  });
});

// ENDPOINT: Informazioni sui formati supportati
router.get('/formats', (req, res) => {
  res.json({
    success: true,
    supported_formats: {
      images: ['JPEG', 'JPG', 'PNG'],
      max_file_size: '10MB',
      text_input: 'Testo incollato direttamente'
    },
    languages: ['italiano', 'inglese'],
    subjects: [
      'Italiano', 'Storia', 'Filosofia', 'Latino', 'Fisica', 
      'Matematica', 'Scienze', 'Arte', 'Inglese', 'Religione'
    ]
  });
});

// ENDPOINT: I miei quiz
router.get('/my-quizzes/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const filters = req.query;
    
    const result = await controller.userStorage.getUserQuizzes(user_id, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ENDPOINT: Le mie flashcards
router.get('/my-flashcards/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const filters = req.query;
    
    const result = await controller.userStorage.getUserFlashcards(user_id, filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ENDPOINT: Singolo quiz
router.get('/quiz/:user_id/:quiz_id', async (req, res) => {
  try {
    const { user_id, quiz_id } = req.params;
    
    const result = await controller.userStorage.getQuizById(user_id, quiz_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ENDPOINT: Singole flashcards
router.get('/flashcards/:user_id/:flashcards_id', async (req, res) => {
  try {
    const { user_id, flashcards_id } = req.params;
    
    const result = await controller.userStorage.getFlashcardsById(user_id, flashcards_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ENDPOINT: Elimina quiz
router.delete('/quiz/:user_id/:quiz_id', async (req, res) => {
  try {
    const { user_id, quiz_id } = req.params;
    
    const result = await controller.userStorage.deleteQuiz(user_id, quiz_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ENDPOINT: Elimina flashcards
router.delete('/flashcards/:user_id/:flashcards_id', async (req, res) => {
  try {
    const { user_id, flashcards_id } = req.params;
    
    const result = await controller.userStorage.deleteFlashcards(user_id, flashcards_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ENDPOINT: Statistiche utente
router.get('/stats/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await controller.userStorage.getUserStats(user_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
