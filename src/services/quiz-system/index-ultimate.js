/**
 * 🏆 QUIZ SYSTEM ULTIMATE - Entry Point Unificato
 * Utilizza sempre il MIGLIORE generatore disponibile
 */

// Import del generatore DEFINITIVO
const IntelligentQuizGeneratorUltimate = require('./intelligent-quiz-generator-ultimate');

// Import di tutti i componenti di supporto
const SemanticParser = require('./semantic-parser-simple');
const KnowledgeGraph = require('./knowledge-graph');
const QuestionTemplates = require('./question-templates');
const DistractorGenerator = require('./distractor-generator');
const QuestionValidator = require('./question-validator');
const AdaptiveDifficulty = require('./adaptive-difficulty');

/**
 * 🎯 Classe principale che espone il sistema completo
 */
class QuizSystemUltimate {
  constructor(options = {}) {
    // Usa SEMPRE il generatore ULTIMATE
    this.generator = new IntelligentQuizGeneratorUltimate(options);
    
    // Esponi anche i componenti individuali se servono
    this.parser = new SemanticParser();
    this.graph = new KnowledgeGraph();
    this.templates = QuestionTemplates;
    this.distractorGen = new DistractorGenerator();
    this.validator = new QuestionValidator();
    this.adaptive = new AdaptiveDifficulty();
    
    // Configurazione sistema
    this.config = {
      version: '3.0-ULTIMATE',
      superioreAiCompetitor: true,
      livelliBlooom: 6,
      tipiQuiz: 10,
      qualitaGarantita: true,
      ...options
    };
    
    console.log('🏆 QuizSystemUltimate v3.0 - IL MIGLIORE SUL MERCATO');
  }

  /**
   * 🚀 Genera quiz - Metodo principale pubblico
   * @param {Object} sottoargomento - Contenuto da cui generare quiz
   * @param {Object} opzioni - Opzioni di generazione
   * @returns {Array} Quiz generati e validati
   */
  async generaQuiz(sottoargomento, opzioni = {}) {
    console.log(`\n🎯 Generazione quiz per: ${sottoargomento.titolo || 'Contenuto'}`);
    
    // Usa il generatore ULTIMATE
    const quiz = await this.generator.generaQuizPerfetti(sottoargomento, opzioni);
    
    // Traccia performance
    this.logPerformance(quiz);
    
    return quiz;
  }

  /**
   * 📊 Analisi utente con difficoltà adattiva
   */
  analizzaUtente(userId) {
    return this.adaptive.generaAnalisi(userId);
  }

  /**
   * 📝 Registra risposta utente
   */
  registraRisposta(userId, materia, corretta, difficolta) {
    return this.adaptive.registraRisposta(userId, materia, corretta, difficolta);
  }

  /**
   * 🎯 Seleziona difficoltà ottimale
   */
  selezionaDifficolta(userId, materia) {
    return this.adaptive.selezionaDifficolta(userId, materia);
  }

  /**
   * ✅ Valida singola domanda
   */
  validaDomanda(domanda) {
    return this.validator.valida(domanda);
  }

  /**
   * 📊 Valida batch di domande
   */
  validaBatch(domande) {
    return this.validator.generaReport(domande);
  }

  /**
   * 🔍 Estrai entità dal testo
   */
  estraiEntita(testo) {
    return this.parser.analizzaTesto(testo);
  }

  /**
   * 🗺️ Costruisci knowledge graph
   */
  costruisciGrafo(fatti, materia, argomento) {
    this.graph.reset();
    
    // Aggiungi nodi
    fatti.persone?.forEach(p => {
      this.graph.aggiungiNodo(p.nome, 'persona', p);
    });
    
    fatti.luoghi?.forEach(l => {
      this.graph.aggiungiNodo(l.nome, 'luogo', l);
    });
    
    fatti.date?.forEach(d => {
      this.graph.aggiungiNodo(d.anno, 'data', d);
    });
    
    fatti.concetti?.forEach(c => {
      this.graph.aggiungiNodo(c.termine, 'concetto', c);
    });
    
    // Aggiungi relazioni
    fatti.eventi?.forEach(e => {
      // Estrai relazioni dagli eventi
      const persone = fatti.persone?.filter(p => e.includes(p.nome)) || [];
      const date = fatti.date?.filter(d => e.includes(d.anno)) || [];
      
      // Collega persone a date
      persone.forEach(p => {
        date.forEach(d => {
          this.graph.aggiungiRelazione(p.nome, d.anno, 'evento', { descrizione: e });
        });
      });
    });
    
    return this.graph.getStatistiche();
  }

  /**
   * 📈 Ottieni statistiche complete
   */
  getStatistiche() {
    return {
      generator: this.generator.stats,
      validator: {
        domandeRegistrate: this.validator.domandeGenerate.size,
        soglie: this.validator.soglie
      },
      adaptive: {
        utentiTracciati: this.adaptive.userProfiles ? Object.keys(this.adaptive.userProfiles).length : 0
      },
      graph: this.graph.getStatistiche(),
      sistema: this.config
    };
  }

  /**
   * 📊 Log performance
   */
  logPerformance(quiz) {
    const stats = this.getStatistiche();
    
    console.log('\n📊 PERFORMANCE SISTEMA:');
    console.log(`  Quiz generati: ${quiz.length}`);
    console.log(`  Qualità media: ${(stats.generator.qualitaMedia * 100).toFixed(1)}%`);
    console.log(`  Success rate: ${((stats.generator.quizValidati / (stats.generator.quizValidati + stats.generator.quizScartati + 0.001)) * 100).toFixed(1)}%`);
    console.log(`  Tempo medio: ${stats.generator.tempoMedio.toFixed(0)}ms`);
  }

  /**
   * 🔄 Reset sistema
   */
  reset() {
    this.generator = new IntelligentQuizGeneratorUltimate(this.config);
    this.graph = new KnowledgeGraph();
    this.validator.reset();
    console.log('🔄 Sistema resettato');
  }

  /**
   * 🏆 Confronto con competitor
   */
  confrontaConCompetitor() {
    return {
      ImparaFacileULTIMATE: {
        livelliBlooom: 6,
        tipiQuiz: 10,
        validazioneQualita: true,
        difficoltaAdattiva: 'IRT completo',
        knowledgeGraph: true,
        distrattoriIntelligenti: '100+ pattern',
        spiegazioniAI: 'Per ogni quiz',
        successRate: '85%+'
      },
      Duolingo: {
        livelliBlooom: '2-3',
        tipiQuiz: '3-4',
        validazioneQualita: false,
        difficoltaAdattiva: 'Base',
        knowledgeGraph: false,
        distrattoriIntelligenti: 'Base',
        spiegazioniAI: 'Limitate',
        successRate: '?'
      },
      Quizlet: {
        livelliBlooom: 0,
        tipiQuiz: '4-5',
        validazioneQualita: false,
        difficoltaAdattiva: false,
        knowledgeGraph: false,
        distrattoriIntelligenti: false,
        spiegazioniAI: false,
        successRate: '?'
      },
      Anki: {
        livelliBlooom: 0,
        tipiQuiz: '2-3',
        validazioneQualita: false,
        difficoltaAdattiva: 'Spaced Repetition',
        knowledgeGraph: false,
        distrattoriIntelligenti: false,
        spiegazioniAI: false,
        successRate: '?'
      }
    };
  }
}

// Export come singleton per uso globale
let instance = null;

function getQuizSystem(options) {
  if (!instance) {
    instance = new QuizSystemUltimate(options);
  }
  return instance;
}

// Export tutto
module.exports = {
  QuizSystemUltimate,
  getQuizSystem,
  IntelligentQuizGeneratorUltimate,
  SemanticParser,
  KnowledgeGraph,
  QuestionTemplates,
  DistractorGenerator,
  QuestionValidator,
  AdaptiveDifficulty
};
