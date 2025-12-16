// Servizio per gestione quiz - ImparaFacile
const quizP1 = require('../data/quiz-italiano-p1');
const quizP2 = require('../data/quiz-italiano-p2');
const quizP3 = require('../data/quiz-italiano-p3');

class QuizService {
  constructor() {
    // Unisce tutti i quiz di Italiano (350+ quiz totali)
    this.quizItaliano = {
      ...quizP1,
      ...quizP2,
      ...quizP3
    };
    
    this.tuttiQuiz = [];
    this.inizializzaQuiz();
  }

  inizializzaQuiz() {
    // Converte la struttura in array flat
    for (const categoria in this.quizItaliano) {
      const quizCategoria = this.quizItaliano[categoria];
      quizCategoria.forEach(quiz => {
        this.tuttiQuiz.push({
          ...quiz,
          categoria,
          materia: 'Italiano'
        });
      });
    }
    
    console.log(`✅ Caricati ${this.tuttiQuiz.length} quiz di Italiano`);
  }

  // Ottiene quiz casuali
  getQuizCasuali(numero = 10, difficolta = null) {
    let pool = [...this.tuttiQuiz];
    
    if (difficolta) {
      pool = pool.filter(q => q.difficolta === difficolta);
    }
    
    // Shuffle array
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    return pool.slice(0, numero);
  }

  // Ottiene quiz per categoria
  getQuizPerCategoria(categoria) {
    return this.tuttiQuiz.filter(q => q.categoria === categoria);
  }

  // Verifica risposta
  verificaRisposta(quizId, rispostaUtente) {
    const quiz = this.tuttiQuiz.find(q => q.id === quizId);
    if (!quiz) return null;
    
    const corretta = quiz.rispostaCorretta === rispostaUtente;
    
    return {
      corretta,
      rispostaCorretta: quiz.rispostaCorretta,
      spiegazione: quiz.spiegazione,
      puntiXP: corretta ? quiz.puntiXP : 0
    };
  }

  // Genera simulazione esame
  generaSimulazioneEsame(numeroDomande = 30) {
    const simulazione = {
      facili: Math.floor(numeroDomande * 0.3),
      medie: Math.floor(numeroDomande * 0.5),
      difficili: Math.floor(numeroDomande * 0.2)
    };
    
    const domande = [
      ...this.getQuizCasuali(simulazione.facili, 'FACILE'),
      ...this.getQuizCasuali(simulazione.medie, 'MEDIO'),
      ...this.getQuizCasuali(simulazione.difficili, 'DIFFICILE')
    ];
    
    // Shuffle finale
    for (let i = domande.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [domande[i], domande[j]] = [domande[j], domande[i]];
    }
    
    return {
      id: Date.now().toString(),
      domande,
      tempoLimite: numeroDomande * 60, // 1 minuto per domanda
      punteggioMassimo: domande.reduce((acc, d) => acc + d.puntiXP, 0)
    };
  }

  // Statistiche quiz
  getStatistiche() {
    const stats = {
      totale: this.tuttiQuiz.length,
      perDifficolta: {
        FACILE: this.tuttiQuiz.filter(q => q.difficolta === 'FACILE').length,
        MEDIO: this.tuttiQuiz.filter(q => q.difficolta === 'MEDIO').length,
        DIFFICILE: this.tuttiQuiz.filter(q => q.difficolta === 'DIFFICILE').length
      },
      perTipo: {
        MULTIPLA: this.tuttiQuiz.filter(q => q.tipo === 'MULTIPLA').length,
        VERO_FALSO: this.tuttiQuiz.filter(q => q.tipo === 'VERO_FALSO').length
      },
      perCategoria: {}
    };
    
    for (const categoria in this.quizItaliano) {
      stats.perCategoria[categoria] = this.quizItaliano[categoria].length;
    }
    
    return stats;
  }
}

module.exports = new QuizService();
