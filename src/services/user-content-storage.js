// SISTEMA DI SALVATAGGIO CONTENUTI UTENTE
// Gestisce "I miei quiz" e "Le mie flashcards"

class UserContentStorage {
  constructor() {
    // In produzione, questo sarebbe un database
    // Per ora usiamo storage in memoria
    this.userQuizzes = new Map();
    this.userFlashcards = new Map();
    this.contentMetadata = new Map();
  }

  // SALVA QUIZ GENERATI DALL'AI
  async saveUserQuiz(userId, quizData) {
    try {
      if (!this.userQuizzes.has(userId)) {
        this.userQuizzes.set(userId, []);
      }

      const userQuizzes = this.userQuizzes.get(userId);
      
      const quizPackage = {
        id: this.generateId(),
        title: this.generateTitle(quizData.classification, 'quiz'),
        created_at: new Date().toISOString(),
        materia: quizData.classification.materia,
        argomento: quizData.classification.argomento,
        sottoargomento: quizData.classification.sottoargomento,
        difficulty: quizData.classification.difficolta,
        quiz_count: quizData.content.quiz.length,
        quality_score: quizData.quality.overall_score,
        source: 'ai_generated',
        source_reference: quizData.metadata.source_reference,
        quiz: quizData.content.quiz,
        is_public: false,
        tags: this.generateTags(quizData.classification),
        stats: {
          times_played: 0,
          best_score: 0,
          last_played: null
        }
      };

      userQuizzes.push(quizPackage);
      
      // Salva metadata
      this.contentMetadata.set(quizPackage.id, {
        type: 'quiz',
        user_id: userId,
        ai_metadata: quizData.metadata
      });

      return {
        success: true,
        quiz_id: quizPackage.id,
        message: 'Quiz salvato in "I miei quiz"'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // SALVA FLASHCARDS GENERATE DALL'AI
  async saveUserFlashcards(userId, flashcardsData) {
    try {
      if (!this.userFlashcards.has(userId)) {
        this.userFlashcards.set(userId, []);
      }

      const userFlashcards = this.userFlashcards.get(userId);
      
      const flashcardsPackage = {
        id: this.generateId(),
        title: this.generateTitle(flashcardsData.classification, 'flashcards'),
        created_at: new Date().toISOString(),
        materia: flashcardsData.classification.materia,
        argomento: flashcardsData.classification.argomento,
        sottoargomento: flashcardsData.classification.sottoargomento,
        difficulty: flashcardsData.classification.difficolta,
        flashcards_count: flashcardsData.content.flashcards.length,
        quality_score: flashcardsData.quality.overall_score,
        source: 'ai_generated',
        source_reference: flashcardsData.metadata.source_reference,
        flashcards: flashcardsData.content.flashcards,
        is_public: false,
        tags: this.generateTags(flashcardsData.classification),
        stats: {
          times_studied: 0,
          mastered_cards: 0,
          last_studied: null
        }
      };

      userFlashcards.push(flashcardsPackage);
      
      // Salva metadata
      this.contentMetadata.set(flashcardsPackage.id, {
        type: 'flashcards',
        user_id: userId,
        ai_metadata: flashcardsData.metadata
      });

      return {
        success: true,
        flashcards_id: flashcardsPackage.id,
        message: 'Flashcards salvate in "Le mie flashcards"'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // RECUPERA QUIZ DELL'UTENTE
  async getUserQuizzes(userId, filters = {}) {
    try {
      const userQuizzes = this.userQuizzes.get(userId) || [];
      
      let filteredQuizzes = [...userQuizzes];
      
      // Applica filtri
      if (filters.materia) {
        filteredQuizzes = filteredQuizzes.filter(q => 
          q.materia.toLowerCase() === filters.materia.toLowerCase()
        );
      }
      
      if (filters.difficulty) {
        filteredQuizzes = filteredQuizzes.filter(q => 
          q.difficulty === filters.difficulty
        );
      }
      
      if (filters.source) {
        filteredQuizzes = filteredQuizzes.filter(q => 
          q.source === filters.source
        );
      }

      // Ordina per data di creazione (più recenti prima)
      filteredQuizzes.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      return {
        success: true,
        quizzes: filteredQuizzes.map(q => ({
          ...q,
          quiz: undefined // Non includere i quiz completi nella lista
        })),
        total: filteredQuizzes.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // RECUPERA FLASHCARDS DELL'UTENTE
  async getUserFlashcards(userId, filters = {}) {
    try {
      const userFlashcards = this.userFlashcards.get(userId) || [];
      
      let filteredFlashcards = [...userFlashcards];
      
      // Applica filtri
      if (filters.materia) {
        filteredFlashcards = filteredFlashcards.filter(f => 
          f.materia.toLowerCase() === filters.materia.toLowerCase()
        );
      }
      
      if (filters.difficulty) {
        filteredFlashcards = filteredFlashcards.filter(f => 
          f.difficulty === filters.difficulty
        );
      }

      // Ordina per data di creazione
      filteredFlashcards.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      return {
        success: true,
        flashcards: filteredFlashcards.map(f => ({
          ...f,
          flashcards: undefined // Non includere le flashcards complete nella lista
        })),
        total: filteredFlashcards.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // RECUPERA SINGOLO QUIZ
  async getQuizById(userId, quizId) {
    try {
      const userQuizzes = this.userQuizzes.get(userId) || [];
      const quiz = userQuizzes.find(q => q.id === quizId);
      
      if (!quiz) {
        return {
          success: false,
          error: 'Quiz non trovato'
        };
      }

      return {
        success: true,
        quiz: quiz
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // RECUPERA SINGOLE FLASHCARDS
  async getFlashcardsById(userId, flashcardsId) {
    try {
      const userFlashcards = this.userFlashcards.get(userId) || [];
      const flashcards = userFlashcards.find(f => f.id === flashcardsId);
      
      if (!flashcards) {
        return {
          success: false,
          error: 'Flashcards non trovate'
        };
      }

      return {
        success: true,
        flashcards: flashcards
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ELIMINA QUIZ
  async deleteQuiz(userId, quizId) {
    try {
      const userQuizzes = this.userQuizzes.get(userId) || [];
      const index = userQuizzes.findIndex(q => q.id === quizId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Quiz non trovato'
        };
      }

      userQuizzes.splice(index, 1);
      this.contentMetadata.delete(quizId);

      return {
        success: true,
        message: 'Quiz eliminato'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ELIMINA FLASHCARDS
  async deleteFlashcards(userId, flashcardsId) {
    try {
      const userFlashcards = this.userFlashcards.get(userId) || [];
      const index = userFlashcards.findIndex(f => f.id === flashcardsId);
      
      if (index === -1) {
        return {
          success: false,
          error: 'Flashcards non trovate'
        };
      }

      userFlashcards.splice(index, 1);
      this.contentMetadata.delete(flashcardsId);

      return {
        success: true,
        message: 'Flashcards eliminate'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // AGGIORNA STATISTICHE QUIZ
  async updateQuizStats(userId, quizId, stats) {
    try {
      const userQuizzes = this.userQuizzes.get(userId) || [];
      const quiz = userQuizzes.find(q => q.id === quizId);
      
      if (!quiz) {
        return { success: false, error: 'Quiz non trovato' };
      }

      quiz.stats.times_played += 1;
      quiz.stats.last_played = new Date().toISOString();
      
      if (stats.score > quiz.stats.best_score) {
        quiz.stats.best_score = stats.score;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // AGGIORNA STATISTICHE FLASHCARDS
  async updateFlashcardsStats(userId, flashcardsId, stats) {
    try {
      const userFlashcards = this.userFlashcards.get(userId) || [];
      const flashcards = userFlashcards.find(f => f.id === flashcardsId);
      
      if (!flashcards) {
        return { success: false, error: 'Flashcards non trovate' };
      }

      flashcards.stats.times_studied += 1;
      flashcards.stats.last_studied = new Date().toISOString();
      flashcards.stats.mastered_cards = stats.mastered_cards || 0;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // UTILITY METHODS
  generateTitle(classification, type) {
    const typeLabel = type === 'quiz' ? 'Quiz' : 'Flashcards';
    const materia = classification.materia || 'Generale';
    const argomento = classification.argomento || 'Contenuti';
    
    return `${typeLabel} ${materia} - ${argomento}`;
  }

  generateTags(classification) {
    const tags = [];
    
    if (classification.materia) tags.push(classification.materia);
    if (classification.difficolta) tags.push(classification.difficolta);
    if (classification.livelloScolastico) tags.push(classification.livelloScolastico);
    
    tags.push('ai_generated');
    
    return tags;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // STATISTICHE UTENTE
  async getUserStats(userId) {
    try {
      const userQuizzes = this.userQuizzes.get(userId) || [];
      const userFlashcards = this.userFlashcards.get(userId) || [];

      const stats = {
        total_quizzes: userQuizzes.length,
        total_flashcards: userFlashcards.length,
        total_quiz_questions: userQuizzes.reduce((sum, q) => sum + q.quiz_count, 0),
        total_flashcard_count: userFlashcards.reduce((sum, f) => sum + f.flashcards_count, 0),
        by_subject: {},
        recent_activity: []
      };

      // Statistiche per materia
      [...userQuizzes, ...userFlashcards].forEach(item => {
        if (!stats.by_subject[item.materia]) {
          stats.by_subject[item.materia] = {
            quizzes: 0,
            flashcards: 0
          };
        }
        
        if (item.quiz) {
          stats.by_subject[item.materia].quizzes++;
        } else {
          stats.by_subject[item.materia].flashcards++;
        }
      });

      // Attività recente
      const allContent = [...userQuizzes, ...userFlashcards]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);

      stats.recent_activity = allContent.map(item => ({
        id: item.id,
        title: item.title,
        type: item.quiz ? 'quiz' : 'flashcards',
        created_at: item.created_at,
        materia: item.materia
      }));

      return {
        success: true,
        stats: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = UserContentStorage;
