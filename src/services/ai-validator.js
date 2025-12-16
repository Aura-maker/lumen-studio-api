// SISTEMA DI VALIDAZIONE E CONTROLLO QUALITÀ
// Fase D: Validazione automatica

class AIValidator {
  constructor() {
    this.qualityThreshold = 70;
    this.copyrightLimit = 90;
    
    // Pattern per contenuti sensibili
    this.sensitivePatterns = {
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      iban: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/g,
      address: /\bvia\s+[A-Za-z\s]+\d+/gi
    };
    
    // Filtri NSFW e contenuti inappropriati
    this.inappropriateContent = [
      'violenza', 'odio', 'discriminazione', 'razzismo', 'sessismo',
      'pornografia', 'droga', 'suicidio', 'autolesionismo'
    ];
  }

  // VALIDAZIONE COMPLETA
  async validateContent(generatedContent) {
    const validation = {
      flashcards: await this.validateFlashcards(generatedContent.flashcards),
      quiz: await this.validateQuiz(generatedContent.quiz),
      overallQuality: 0,
      issues: [],
      recommendations: []
    };

    // Calcola quality score complessivo
    validation.overallQuality = this.calculateOverallQuality(validation);
    
    // Genera raccomandazioni se necessario
    if (validation.overallQuality < this.qualityThreshold) {
      validation.recommendations = this.generateRecommendations(validation);
    }

    return validation;
  }

  // VALIDAZIONE FLASHCARDS
  async validateFlashcards(flashcards) {
    const results = [];
    
    for (const flashcard of flashcards) {
      const validation = {
        id: flashcard.id,
        qualityScore: 0,
        issues: [],
        isValid: true
      };

      // Controllo grammatica e ortografia
      validation.grammarScore = this.checkGrammar(flashcard.front + ' ' + flashcard.back);
      
      // Controllo lunghezza
      validation.lengthScore = this.checkLength(flashcard);
      
      // Controllo coerenza
      validation.coherenceScore = this.checkCoherence(flashcard);
      
      // Controllo contenuti sensibili
      validation.safetyScore = this.checkSafety(flashcard.front + ' ' + flashcard.back);
      
      // Controllo copyright
      validation.copyrightScore = this.checkCopyright(flashcard.back);
      
      // Calcola score totale
      validation.qualityScore = this.calculateFlashcardScore(validation);
      
      // Determina se è valida
      validation.isValid = validation.qualityScore >= this.qualityThreshold;
      
      results.push(validation);
    }
    
    return results;
  }

  // VALIDAZIONE QUIZ
  async validateQuiz(quiz) {
    const results = [];
    
    for (const question of quiz) {
      const validation = {
        id: question.id,
        qualityScore: 0,
        issues: [],
        isValid: true
      };

      // Controllo grammatica
      validation.grammarScore = this.checkGrammar(question.question_text);
      
      // Controllo ambiguità
      validation.ambiguityScore = this.checkAmbiguity(question);
      
      // Controllo opzioni (per MCQ)
      if (question.type === 'multiple_choice') {
        validation.optionsScore = this.checkOptions(question);
      }
      
      // Controllo spiegazione
      validation.explanationScore = this.checkExplanation(question);
      
      // Controllo contenuti sensibili
      validation.safetyScore = this.checkSafety(question.question_text);
      
      // Calcola score totale
      validation.qualityScore = this.calculateQuizScore(validation);
      
      // Determina se è valida
      validation.isValid = validation.qualityScore >= this.qualityThreshold;
      
      results.push(validation);
    }
    
    return results;
  }

  // CONTROLLI SPECIFICI
  checkGrammar(text) {
    let score = 100;
    
    // Controlli grammaticali di base
    const grammarIssues = [
      /\b(à|è|ì|ò|ù)\s+[a-z]/g, // Accenti seguiti da minuscola
      /[.!?]\s*[a-z]/g, // Minuscola dopo punto
      /\s{2,}/g, // Spazi multipli
      /[,;:]\s*[A-Z]/g // Maiuscola dopo virgola
    ];
    
    grammarIssues.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        score -= matches.length * 10;
      }
    });
    
    // Controllo ortografia di base
    const commonErrors = [
      { wrong: 'perchè', correct: 'perché' },
      { wrong: 'qual\'è', correct: 'qual è' },
      { wrong: 'un\'altro', correct: 'un altro' }
    ];
    
    commonErrors.forEach(error => {
      if (text.includes(error.wrong)) {
        score -= 15;
      }
    });
    
    return Math.max(0, score);
  }

  checkLength(flashcard) {
    let score = 100;
    
    // Front troppo lungo
    if (flashcard.front.length > 100) {
      score -= 20;
    }
    
    // Back troppo lungo o troppo corto
    if (flashcard.back.length > 500) {
      score -= 30;
    } else if (flashcard.back.length < 10) {
      score -= 40;
    }
    
    return Math.max(0, score);
  }

  checkCoherence(flashcard) {
    let score = 100;
    
    // Verifica che front e back siano correlati
    const frontWords = flashcard.front.toLowerCase().split(' ');
    const backWords = flashcard.back.toLowerCase().split(' ');
    
    const commonWords = frontWords.filter(word => 
      backWords.includes(word) && word.length > 3
    );
    
    if (commonWords.length === 0) {
      score -= 30;
    }
    
    return Math.max(0, score);
  }

  checkSafety(text) {
    let score = 100;
    
    // Controllo contenuti inappropriati
    this.inappropriateContent.forEach(term => {
      if (text.toLowerCase().includes(term)) {
        score = 0; // Contenuto inappropriato = score 0
      }
    });
    
    // Controllo dati sensibili
    Object.values(this.sensitivePatterns).forEach(pattern => {
      if (pattern.test(text)) {
        score -= 50;
      }
    });
    
    return Math.max(0, score);
  }

  checkCopyright(text) {
    let score = 100;
    
    // Se il testo è troppo lungo, potrebbe essere protetto da copyright
    if (text.length > this.copyrightLimit) {
      score -= 30;
    }
    
    // Controllo per citazioni dirette lunghe
    const quotationMarks = (text.match(/["'"]/g) || []).length;
    if (quotationMarks > 4) {
      score -= 20;
    }
    
    return Math.max(0, score);
  }

  checkAmbiguity(question) {
    let score = 100;
    
    // Parole che indicano ambiguità
    const ambiguousWords = [
      'forse', 'probabilmente', 'potrebbe', 'sembra', 'circa',
      'più o meno', 'generalmente', 'di solito'
    ];
    
    ambiguousWords.forEach(word => {
      if (question.question_text.toLowerCase().includes(word)) {
        score -= 15;
      }
    });
    
    return Math.max(0, score);
  }

  checkOptions(question) {
    let score = 100;
    
    if (!question.options || question.options.length !== 4) {
      score -= 50;
    } else {
      // Controllo lunghezza opzioni
      const lengths = question.options.map(opt => opt.length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      
      lengths.forEach(length => {
        if (Math.abs(length - avgLength) > avgLength * 0.5) {
          score -= 10; // Opzioni troppo diverse in lunghezza
        }
      });
      
      // Controllo similarità opzioni
      for (let i = 0; i < question.options.length; i++) {
        for (let j = i + 1; j < question.options.length; j++) {
          const similarity = this.calculateSimilarity(
            question.options[i], 
            question.options[j]
          );
          if (similarity > 0.8) {
            score -= 20; // Opzioni troppo simili
          }
        }
      }
    }
    
    return Math.max(0, score);
  }

  checkExplanation(question) {
    let score = 100;
    
    if (!question.explanation) {
      score = 0;
    } else {
      // Lunghezza spiegazione
      if (question.explanation.length < 20) {
        score -= 30;
      } else if (question.explanation.length > 200) {
        score -= 20;
      }
      
      // Controllo che la spiegazione sia informativa
      const informativeWords = [
        'perché', 'poiché', 'infatti', 'quindi', 'pertanto',
        'secondo', 'basato', 'dovuto', 'causato'
      ];
      
      const hasInformativeWords = informativeWords.some(word =>
        question.explanation.toLowerCase().includes(word)
      );
      
      if (!hasInformativeWords) {
        score -= 25;
      }
    }
    
    return Math.max(0, score);
  }

  // CALCOLO SCORES
  calculateFlashcardScore(validation) {
    const weights = {
      grammar: 0.3,
      length: 0.2,
      coherence: 0.2,
      safety: 0.2,
      copyright: 0.1
    };
    
    return Math.round(
      validation.grammarScore * weights.grammar +
      validation.lengthScore * weights.length +
      validation.coherenceScore * weights.coherence +
      validation.safetyScore * weights.safety +
      validation.copyrightScore * weights.copyright
    );
  }

  calculateQuizScore(validation) {
    const weights = {
      grammar: 0.25,
      ambiguity: 0.25,
      options: 0.2,
      explanation: 0.2,
      safety: 0.1
    };
    
    return Math.round(
      validation.grammarScore * weights.grammar +
      validation.ambiguityScore * weights.ambiguity +
      (validation.optionsScore || 100) * weights.options +
      validation.explanationScore * weights.explanation +
      validation.safetyScore * weights.safety
    );
  }

  calculateOverallQuality(validation) {
    const flashcardScores = validation.flashcards.map(f => f.qualityScore);
    const quizScores = validation.quiz.map(q => q.qualityScore);
    
    const allScores = [...flashcardScores, ...quizScores];
    
    if (allScores.length === 0) return 0;
    
    return Math.round(
      allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    );
  }

  // RACCOMANDAZIONI
  generateRecommendations(validation) {
    const recommendations = [];
    
    // Analizza problemi comuni
    const lowGrammarItems = [
      ...validation.flashcards.filter(f => f.grammarScore < 70),
      ...validation.quiz.filter(q => q.grammarScore < 70)
    ];
    
    if (lowGrammarItems.length > 0) {
      recommendations.push({
        type: 'grammar',
        message: 'Alcuni contenuti presentano errori grammaticali. Considera una revisione.',
        severity: 'medium',
        affectedItems: lowGrammarItems.length
      });
    }
    
    const unsafeItems = [
      ...validation.flashcards.filter(f => f.safetyScore < 50),
      ...validation.quiz.filter(q => q.safetyScore < 50)
    ];
    
    if (unsafeItems.length > 0) {
      recommendations.push({
        type: 'safety',
        message: 'Rilevati contenuti potenzialmente sensibili o inappropriati.',
        severity: 'high',
        affectedItems: unsafeItems.length
      });
    }
    
    return recommendations;
  }

  // UTILITY
  calculateSimilarity(str1, str2) {
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return commonWords.length / totalWords;
  }

  // RIMOZIONE DATI SENSIBILI
  removeSensitiveData(text) {
    let cleanText = text;
    
    Object.entries(this.sensitivePatterns).forEach(([type, pattern]) => {
      cleanText = cleanText.replace(pattern, `[${type.toUpperCase()}_RIMOSSO]`);
    });
    
    return cleanText;
  }
}

module.exports = AIValidator;
