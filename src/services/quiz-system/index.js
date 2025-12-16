/**
 * 🎓 QUIZ SYSTEM - Sistema Completo di Generazione Quiz Universitari
 * 
 * Moduli inclusi:
 * - SemanticParser: Estrazione intelligente di fatti dai testi
 * - KnowledgeGraph: Grafo di conoscenza per relazioni tra entità
 * - QuestionTemplates: 150+ template pedagogici basati su Bloom
 * - DistractorGenerator: Generazione distrattori intelligenti
 * - QuestionValidator: Validazione qualità domande
 * - IntelligentQuizGenerator: Generatore principale integrato
 * - AdaptiveDifficulty: Sistema difficoltà adattiva e spaced repetition
 * 
 * @version 2.0.0
 * @author ImparaFacile Team
 */

const SemanticParser = require('./semantic-parser');
const KnowledgeGraph = require('./knowledge-graph');
const { 
  QuestionTemplates, 
  getTemplatesByLevel, 
  getRandomTemplate, 
  getTemplatesByDifficulty,
  contaTotaleTemplate 
} = require('./question-templates');
const DistractorGenerator = require('./distractor-generator');
const QuestionValidator = require('./question-validator');
const IntelligentQuizGenerator = require('./intelligent-quiz-generator');
const AdaptiveDifficulty = require('./adaptive-difficulty');

// ==================== FACTORY FUNCTIONS ====================

/**
 * 🏭 Crea un generatore di quiz configurato
 */
function createQuizGenerator(options = {}) {
  return new IntelligentQuizGenerator(options);
}

/**
 * 🏭 Crea un sistema di difficoltà adattiva
 */
function createAdaptiveSystem(options = {}) {
  return new AdaptiveDifficulty(options);
}

/**
 * 🏭 Crea un validatore di domande
 */
function createValidator() {
  return new QuestionValidator();
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * 🎯 Genera quiz rapido da testo
 * Funzione di utilità per generazione veloce
 */
async function generateQuickQuiz(testo, options = {}) {
  const generator = new IntelligentQuizGenerator({
    maxQuiz: options.maxQuiz || 5,
    livelloMinimo: options.livelloMinimo || 1,
    livelloMassimo: options.livelloMassimo || 3
  });

  const sottoargomento = {
    titolo: options.titolo || 'Quiz',
    contenuto: testo,
    materia: options.materia || 'Generale',
    argomento: options.argomento || 'Generale'
  };

  return generator.generaQuizDaSottoargomento(sottoargomento);
}

/**
 * 📊 Analizza qualità di un set di quiz
 */
function analyzeQuizQuality(quiz) {
  const validator = new QuestionValidator();
  return validator.generaReport(quiz);
}

/**
 * 📈 Ottieni raccomandazioni per utente
 */
function getStudyRecommendations(adaptiveSystem, userId) {
  return adaptiveSystem.generaAnalisi(userId);
}

// ==================== CONSTANTS ====================

const LIVELLI_BLOOM = {
  CONOSCENZA: 1,
  COMPRENSIONE: 2,
  APPLICAZIONE: 3,
  ANALISI: 4,
  SINTESI: 5,
  VALUTAZIONE: 6
};

const TIPI_DOMANDA = {
  MULTIPLA: 'multipla',
  VERO_FALSO: 'vero_falso',
  COMPLETAMENTO: 'completamento',
  ABBINAMENTO: 'abbinamento',
  ORDINAMENTO: 'ordinamento',
  APERTA: 'aperta'
};

const QUALITA_DOMANDA = {
  INSUFFICIENTE: 'insufficiente',
  SUFFICIENTE: 'sufficiente',
  ACCETTABILE: 'accettabile',
  BUONA: 'buona',
  ECCELLENTE: 'eccellente'
};

// ==================== EXPORTS ====================

module.exports = {
  // Classi principali
  SemanticParser,
  KnowledgeGraph,
  QuestionTemplates,
  DistractorGenerator,
  QuestionValidator,
  IntelligentQuizGenerator,
  AdaptiveDifficulty,

  // Factory functions
  createQuizGenerator,
  createAdaptiveSystem,
  createValidator,

  // Utility functions
  generateQuickQuiz,
  analyzeQuizQuality,
  getStudyRecommendations,

  // Template helpers
  getTemplatesByLevel,
  getRandomTemplate,
  getTemplatesByDifficulty,
  contaTotaleTemplate,

  // Constants
  LIVELLI_BLOOM,
  TIPI_DOMANDA,
  QUALITA_DOMANDA
};

// Log inizializzazione
console.log('🎓 Quiz System caricato');
console.log(`   📚 ${contaTotaleTemplate()} template disponibili`);
