/**
 * 🚀 QUIZ SYSTEM INTEGRATED
 * Sistema quiz completo integrato con tutti i componenti
 * Include: Quiz 5000, Quiz ULTIMATE, Flashcards, Simulazioni
 */

const { getQuizSystem } = require('./quiz-system/index-ultimate');
const { getContentManager } = require('./content-manager');

class QuizSystemIntegrated {
  constructor() {
    this.contentManager = getContentManager();
    this.quizUltimate = getQuizSystem();
    this.quiz5000Database = [];
    this.simulazioni = this.initSimulazioni();
    
    console.log('🎯 QuizSystemIntegrated: Sistema completo inizializzato');
  }

  /**
   * 🏆 Genera quiz con sistema ULTIMATE
   */
  async generaQuizUltimate(materiaId, argomentoIndex, sottoargomentoIndex, opzioni = {}) {
    const sottoargomento = this.contentManager.getSottoargomento(
      materiaId, 
      argomentoIndex, 
      sottoargomentoIndex
    );
    
    if (!sottoargomento) {
      throw new Error('Sottoargomento non trovato');
    }
    
    return await this.quizUltimate.generaQuiz(sottoargomento, opzioni);
  }

  /**
   * 📚 Genera quiz rapidi (sistema 5000)
   */
  generaQuiz5000(materiaId, numero = 10) {
    // Implementazione semplificata per quiz rapidi
    const quiz = [];
    const materia = this.contentManager.getMateria(materiaId);
    
    if (!materia || !materia.argomenti) {
      return quiz;
    }
    
    for (let i = 0; i < numero && i < materia.argomenti.length; i++) {
      const argomento = materia.argomenti[i];
      if (argomento.sottoargomenti && argomento.sottoargomenti.length > 0) {
        const sotto = argomento.sottoargomenti[0];
        
        quiz.push({
          id: `q5000-${materiaId}-${i}`,
          tipo: 'multipla',
          testo: `Domanda su ${sotto.titolo || sotto.nome}?`,
          opzioni: [
            { testo: 'Risposta corretta', corretta: true },
            { testo: 'Risposta errata 1', corretta: false },
            { testo: 'Risposta errata 2', corretta: false },
            { testo: 'Risposta errata 3', corretta: false }
          ],
          rispostaCorretta: 0,
          spiegazione: sotto.riassunto ? sotto.riassunto.substring(0, 100) + '...' : 'Spiegazione',
          materia: materiaId,
          argomento: argomento.titolo || argomento.nome,
          difficolta: 'intermedio'
        });
      }
    }
    
    return quiz;
  }

  /**
   * 🎮 Ottieni simulazioni disponibili
   */
  getSimulazioni() {
    return this.simulazioni;
  }

  /**
   * 🚀 Avvia simulazione
   */
  avviaSimulazione(simulazioneId) {
    const sim = this.simulazioni.find(s => s.id === simulazioneId);
    if (!sim) {
      throw new Error('Simulazione non trovata');
    }
    
    // Genera quiz per la simulazione
    const quiz = [];
    const materieSimulazione = sim.materie.split(' ');
    const quizPerMateria = Math.floor(sim.numDomande / materieSimulazione.length);
    
    for (const materiaId of materieSimulazione) {
      const materia = this.contentManager.getMateria(materiaId);
      if (materia && materia.argomenti) {
        // Genera quiz usando il sistema ULTIMATE per qualità migliore
        const sotto = this.contentManager.getSottoargomentoRandom(materiaId);
        if (sotto) {
          // Qui potresti usare generaQuizUltimate in modo asincrono
          // Per ora uso quiz semplici
          const quizMateria = this.generaQuiz5000(materiaId, quizPerMateria);
          quiz.push(...quizMateria);
        }
      }
    }
    
    return {
      simulazione: sim,
      quiz: quiz.slice(0, sim.numDomande),
      tempoInizio: new Date().toISOString(),
      durata: sim.durata
    };
  }

  /**
   * 📊 Statistiche complete sistema
   */
  getStatistiche() {
    const stats = this.quizUltimate.getStatistiche();
    const materie = this.contentManager.getMaterieDisponibili();
    
    return {
      sistema: {
        versione: '5.0',
        componenti: {
          quizUltimate: true,
          quiz5000: true,
          simulazioni: true,
          flashcards: true
        }
      },
      contenuti: {
        materie: materie.length,
        totaleArgomenti: materie.reduce((tot, m) => tot + m.argomenti, 0),
        totaleSottoargomenti: materie.reduce((tot, m) => tot + m.sottoargomenti, 0)
      },
      quizUltimate: stats,
      simulazioni: {
        disponibili: this.simulazioni.length,
        tipi: [...new Set(this.simulazioni.map(s => s.tipo))]
      }
    };
  }

  /**
   * 🎯 Inizializza simulazioni
   */
  initSimulazioni() {
    return [
      {
        id: 'simulazione-maturita-completa',
        nome: 'Simulazione Maturità Completa',
        descrizione: 'Simulazione completa dell\'esame di maturità con domande da tutte le materie',
        durata: 180,
        numDomande: 60,
        materie: 'italiano storia filosofia matematica fisica scienze',
        difficolta: 'avanzato',
        tipo: 'maturita'
      },
      {
        id: 'simulazione-umanistica',
        nome: 'Simulazione Materie Umanistiche',
        descrizione: 'Focus su italiano, storia, filosofia, latino, arte',
        durata: 120,
        numDomande: 40,
        materie: 'italiano storia filosofia latino arte',
        difficolta: 'intermedio',
        tipo: 'tematica'
      },
      {
        id: 'simulazione-scientifica',
        nome: 'Simulazione Materie Scientifiche',
        descrizione: 'Focus su matematica, fisica, scienze',
        durata: 90,
        numDomande: 30,
        materie: 'matematica fisica scienze',
        difficolta: 'avanzato',
        tipo: 'tematica'
      },
      {
        id: 'simulazione-veloce',
        nome: 'Quiz Veloce Multi-Materia',
        descrizione: 'Quiz veloce per ripassare tutte le materie',
        durata: 30,
        numDomande: 20,
        materie: 'italiano storia filosofia matematica fisica scienze latino arte inglese religione',
        difficolta: 'facile',
        tipo: 'ripasso'
      }
    ];
  }
}

// Singleton
let instance = null;

function getQuizSystemIntegrated() {
  if (!instance) {
    instance = new QuizSystemIntegrated();
  }
  return instance;
}

module.exports = {
  QuizSystemIntegrated,
  getQuizSystemIntegrated
};
