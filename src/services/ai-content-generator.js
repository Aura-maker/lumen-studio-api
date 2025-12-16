// GENERATORE INTELLIGENTE QUIZ E FLASHCARDS
// Fase C: Generazione contenuti didattici

class AIContentGenerator {
  constructor() {
    this.flashcardTypes = ['definition', 'concept', 'formula', 'quick_question'];
    this.quizTypes = ['multiple_choice', 'true_false', 'cloze'];
    this.difficultyLevels = [1, 2, 3, 4, 5];
  }

  // GENERAZIONE FLASHCARDS
  async generateFlashcards(analyzedContent) {
    const { extractedText, classification } = analyzedContent;
    
    // MATEMATICA/FISICA: NON generare flashcards, solo spiegazioni
    if (classification.materia === 'matematica' || classification.materia === 'fisica') {
      console.log('📐 Matematica/Fisica: Flashcards disabilitate, solo spiegazioni esercizi');
      return [];
    }
    
    // Se il testo è troppo corto o malformato, non generare flashcards
    if (extractedText.length < 20 || this.isTextMalformed(extractedText)) {
      console.log('⚠️ Testo troppo corto o malformato per flashcards');
      return [];
    }
    
    const targetCount = this.calculateFlashcardCount(extractedText);
    const flashcards = [];
    
    // SOLO MATERIE UMANISTICHE: Genera flashcards
    // Genera flashcards per definizioni
    const definitions = this.extractDefinitions(extractedText);
    definitions.forEach(def => {
      flashcards.push(this.createDefinitionFlashcard(def, classification));
    });
    
    // Genera flashcards per concetti
    const concepts = this.extractConcepts(extractedText);
    concepts.forEach(concept => {
      flashcards.push(this.createConceptFlashcard(concept, classification));
    });
    
    // Genera flashcards per formule (se presenti e NON matematica/fisica)
    if (analyzedContent.hasFormulas) {
      const formulas = this.extractFormulas(extractedText);
      formulas.forEach(formula => {
        flashcards.push(this.createFormulaFlashcard(formula, classification));
      });
    }
    
    // Genera domande rapide solo se il testo è sensato
    if (!this.isTextMalformed(extractedText)) {
      const quickQuestions = this.generateQuickQuestions(extractedText, classification);
      flashcards.push(...quickQuestions);
    }
    
    // Filtra flashcards valide e calcola confidence
    return flashcards
      .filter(card => card && card.front && card.back)
      .slice(0, targetCount)
      .map(card => ({
        ...card,
        confidence: this.calculateConfidence(card, extractedText)
      }));
  }

  isTextMalformed(text) {
    // Controlla se il testo sembra essere OCR malformato
    const malformedPatterns = [
      /^[^a-zA-Z]*$/,  // Solo numeri e simboli
      /\b\d{3,}\s+\d{3,}\b/,  // Sequenze di numeri lunghe
      /[a-zA-Z]{1}\s+[a-zA-Z]{1}\s+[a-zA-Z]{1}/,  // Lettere singole separate
      /^\s*[0-9\s\(\)\[\]]{10,}\s*$/  // Solo numeri e parentesi
    ];
    
    return malformedPatterns.some(pattern => pattern.test(text)) || 
           text.split(' ').filter(word => word.length > 2).length < 3;
  }

  generateMathFlashcards(text, classification) {
    const flashcards = [];
    
    // Cerca equazioni
    const equations = text.match(/[a-zA-Z]\s*=\s*[^.!?\n]+/g) || [];
    equations.forEach(eq => {
      const parts = eq.split('=');
      if (parts.length === 2) {
        flashcards.push({
          id: this.generateId(),
          type: 'equation',
          front: `Risolvi: ${parts[0].trim()} = ?`,
          back: `${parts[0].trim()} = ${parts[1].trim()}`,
          tags: [classification.materia, 'equazioni', classification.livelloScolastico],
          difficulty: 3,
          media: null
        });
      }
    });
    
    // Cerca problemi matematici
    const problems = text.match(/find|solve|calculate|trova|risolvi|calcola[^.!?]*[.!?]/gi) || [];
    problems.forEach(problem => {
      flashcards.push({
        id: this.generateId(),
        type: 'problem',
        front: `Problema: ${problem.trim()}`,
        back: `Risoluzione basata sui dati del problema`,
        tags: [classification.materia, 'problemi', classification.livelloScolastico],
        difficulty: 4,
        media: null
      });
    });
    
    return flashcards.slice(0, 5);
  }

  calculateFlashcardCount(text) {
    const wordCount = text.split(' ').length;
    if (wordCount < 100) return 8;
    if (wordCount < 300) return 15;
    if (wordCount < 600) return 25;
    return 30;
  }

  extractDefinitions(text) {
    const definitions = [];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      // Pattern per definizioni
      const defPatterns = [
        /(.+?)\s+è\s+(.+)/,
        /(.+?)\s+si\s+definisce\s+(.+)/,
        /(.+?)\s+consiste\s+nel\s+(.+)/,
        /(.+?):\s*(.+)/
      ];
      
      defPatterns.forEach(pattern => {
        const match = sentence.match(pattern);
        if (match && match[1].length < 50 && match[2].length > 10) {
          definitions.push({
            term: match[1].trim(),
            definition: match[2].trim()
          });
        }
      });
    });
    
    return definitions.slice(0, 10);
  }

  createDefinitionFlashcard(definition, classification) {
    return {
      id: this.generateId(),
      type: 'definition',
      front: `Definisci: ${definition.term}`,
      back: definition.definition,
      tags: [
        classification.materia,
        classification.argomento,
        classification.sottoargomento,
        classification.livelloScolastico
      ],
      difficulty: this.mapDifficultyToNumber(classification.difficolta),
      media: null
    };
  }

  extractConcepts(text) {
    const concepts = [];
    const keyPhrases = [
      'principio', 'legge', 'teorema', 'concetto', 'caratteristica',
      'proprietà', 'fenomeno', 'processo', 'metodo', 'tecnica'
    ];
    
    const sentences = text.split(/[.!?]+/);
    sentences.forEach(sentence => {
      keyPhrases.forEach(phrase => {
        if (sentence.toLowerCase().includes(phrase) && sentence.length > 30) {
          concepts.push({
            concept: phrase,
            explanation: sentence.trim()
          });
        }
      });
    });
    
    return concepts.slice(0, 8);
  }

  createConceptFlashcard(concept, classification) {
    return {
      id: this.generateId(),
      type: 'concept',
      front: `Spiega il concetto di ${concept.concept}`,
      back: concept.explanation,
      tags: [
        classification.materia,
        classification.argomento,
        'concetti',
        classification.livelloScolastico
      ],
      difficulty: this.mapDifficultyToNumber(classification.difficolta),
      media: null
    };
  }

  extractFormulas(text) {
    const formulas = [];
    const formulaPatterns = [
      /([A-Z][a-z]*)\s*=\s*([^.!?]+)/g,
      /([a-zA-Z]+)\s*=\s*([0-9+\-*/()^√∫∑∏πα-ωΑ-Ω\s]+)/g
    ];
    
    formulaPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        formulas.push({
          variable: match[1],
          expression: match[2].trim()
        });
      }
    });
    
    return formulas.slice(0, 5);
  }

  createFormulaFlashcard(formula, classification) {
    return {
      id: this.generateId(),
      type: 'formula',
      front: `Formula per ${formula.variable}`,
      back: `$${formula.variable} = ${formula.expression}$\n\nSpiegazione: Formula utilizzata per calcolare ${formula.variable}`,
      tags: [
        classification.materia,
        classification.argomento,
        'formule',
        classification.livelloScolastico
      ],
      difficulty: this.mapDifficultyToNumber(classification.difficolta) + 1,
      media: null
    };
  }

  generateQuickQuestions(text, classification) {
    const questions = [];
    const sentences = text.split(/[.!?]+/);
    
    // Estrai date
    const dates = this.extractDates(text);
    dates.forEach(date => {
      questions.push({
        id: this.generateId(),
        type: 'quick_question',
        front: `In che anno...?`,
        back: date.year,
        tags: [classification.materia, 'date', classification.livelloScolastico],
        difficulty: 2,
        media: null
      });
    });
    
    // Estrai nomi propri
    const names = this.extractNames(text);
    names.forEach(name => {
      questions.push({
        id: this.generateId(),
        type: 'quick_question',
        front: `Chi è ${name}?`,
        back: `Figura importante nel contesto di ${classification.argomento}`,
        tags: [classification.materia, 'personaggi', classification.livelloScolastico],
        difficulty: 2,
        media: null
      });
    });
    
    return questions.slice(0, 5);
  }

  extractDates(text) {
    const dates = [];
    const datePattern = /\b(1[0-9]{3}|20[0-9]{2})\b/g;
    let match;
    
    while ((match = datePattern.exec(text)) !== null) {
      dates.push({ year: match[1] });
    }
    
    return dates.slice(0, 3);
  }

  extractNames(text) {
    const names = [];
    const namePattern = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g;
    let match;
    
    while ((match = namePattern.exec(text)) !== null) {
      if (!this.isCommonPhrase(match[0])) {
        names.push(match[0]);
      }
    }
    
    return [...new Set(names)].slice(0, 5);
  }

  isCommonPhrase(phrase) {
    const commonPhrases = [
      'Prima Guerra', 'Seconda Guerra', 'Stati Uniti', 'Unione Europea'
    ];
    return commonPhrases.includes(phrase);
  }

  // GENERAZIONE QUIZ
  async generateQuiz(analyzedContent) {
    const { extractedText, classification } = analyzedContent;
    
    // MATEMATICA/FISICA: NON generare quiz, solo spiegazioni
    if (classification.materia === 'matematica' || classification.materia === 'fisica') {
      console.log('📐 Matematica/Fisica: Quiz disabilitati, solo spiegazioni esercizi');
      return [];
    }
    
    // Se il testo è malformato, non generare quiz
    if (this.isTextMalformed(extractedText)) {
      console.log('⚠️ Testo malformato, genero quiz di fallback');
      return this.generateFallbackQuiz(extractedText, classification);
    }
    
    const targetCount = this.calculateQuizCount(extractedText);
    const quiz = [];
    
    // SOLO MATERIE UMANISTICHE: Quiz normali
    // Distribuzione tipologie per altre materie
    const mcqCount = Math.floor(targetCount * 0.65);
    const tfCount = Math.floor(targetCount * 0.25);
    const clozeCount = targetCount - mcqCount - tfCount;
    
    // Genera Multiple Choice Questions
    const mcqs = await this.generateMCQ(extractedText, classification, mcqCount);
    quiz.push(...mcqs);
    
    // Genera True/False
    const tfs = await this.generateTrueFalse(extractedText, classification, tfCount);
    quiz.push(...tfs);
    
    // Genera Cloze
    const clozes = await this.generateCloze(extractedText, classification, clozeCount);
    quiz.push(...clozes);
    
    // Filtra quiz validi
    const validQuiz = quiz.filter(q => q && q.question_text && q.question_text.length > 10);
    
    return validQuiz.map(q => ({
      ...q,
      id: this.generateId()
    }));
  }

  generateMathQuiz(text, classification) {
    const quiz = [];
    
    // Cerca equazioni nel testo
    const equations = text.match(/[a-zA-Z]\s*=\s*[^.!?\n]+/g) || [];
    
    if (equations.length > 0) {
      const eq = equations[0];
      const parts = eq.split('=');
      
      if (parts.length === 2) {
        quiz.push({
          type: 'multiple_choice',
          question_text: `Qual è il valore di ${parts[0].trim()}?`,
          options: [
            parts[1].trim(),
            `${parseFloat(parts[1]) + 1}`,
            `${parseFloat(parts[1]) - 1}`,
            `${parseFloat(parts[1]) * 2}`
          ],
          correct_option_index: 0,
          explanation: `Il valore corretto è ${parts[1].trim()} come mostrato nell'equazione.`,
          difficulty: 3,
          tags: [classification.materia, 'equazioni']
        });
      }
    }
    
    // Quiz su problemi matematici
    const problems = text.match(/(find|solve|calculate|trova|risolvi|calcola)[^.!?]*[.!?]/gi) || [];
    
    if (problems.length > 0) {
      quiz.push({
        type: 'true_false',
        question_text: `Il problema richiede di trovare una soluzione numerica specifica.`,
        correct_answer: true,
        explanation: 'VERO. I problemi matematici richiedono tipicamente soluzioni numeriche precise.',
        difficulty: 2,
        tags: [classification.materia, 'problemi']
      });
    }
    
    return quiz.slice(0, 3);
  }

  generateFallbackQuiz(text, classification) {
    // Quiz di fallback per testo malformato
    return [{
      type: 'multiple_choice',
      question_text: `Quale materia sembra essere trattata nel contenuto analizzato?`,
      options: [
        classification.materia || 'Matematica',
        'Storia',
        'Italiano',
        'Scienze'
      ],
      correct_option_index: 0,
      explanation: `Basandosi sull'analisi del contenuto, la materia identificata è ${classification.materia || 'Matematica'}.`,
      difficulty: 1,
      tags: [classification.materia || 'generale', 'classificazione']
    }];
  }

  calculateQuizCount(text) {
    const wordCount = text.split(' ').length;
    if (wordCount < 100) return 10;
    if (wordCount < 300) return 20;
    if (wordCount < 600) return 30;
    return 40;
  }

  async generateMCQ(text, classification, count) {
    const mcqs = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i];
      const mcq = this.createMCQFromSentence(sentence, classification);
      if (mcq) {
        mcqs.push(mcq);
      }
    }
    
    return mcqs;
  }

  createMCQFromSentence(sentence, classification) {
    // Estrai il soggetto principale
    const words = sentence.split(' ');
    const keyWord = words.find(word => word.length > 5 && /^[A-Z]/.test(word));
    
    if (!keyWord) return null;
    
    const question = `Quale delle seguenti affermazioni su ${keyWord} è corretta?`;
    
    const correctOption = sentence.trim();
    const incorrectOptions = this.generateIncorrectOptions(correctOption, classification);
    
    const options = this.shuffleArray([correctOption, ...incorrectOptions]);
    const correctIndex = options.indexOf(correctOption);
    
    return {
      type: 'multiple_choice',
      question_text: question,
      options: options,
      correct_option_index: correctIndex,
      explanation: `La risposta corretta è basata sul contenuto del testo studiato.`,
      difficulty: this.mapDifficultyToNumber(classification.difficolta),
      tags: [classification.materia, classification.argomento, 'comprensione']
    };
  }

  generateIncorrectOptions(correctOption, classification) {
    const templates = [
      `Questa informazione non è presente nel contesto di ${classification.argomento}`,
      `L'affermazione è parzialmente corretta ma manca di precisione`,
      `Questa teoria è stata superata dagli sviluppi più recenti`
    ];
    
    return templates;
  }

  async generateTrueFalse(text, classification, count) {
    const tfs = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i];
      const isTrue = Math.random() > 0.5;
      
      let statement = sentence.trim();
      if (!isTrue) {
        statement = this.makeStatementFalse(statement);
      }
      
      tfs.push({
        type: 'true_false',
        question_text: statement,
        correct_answer: isTrue,
        explanation: isTrue ? 
          'VERO. L\'affermazione è corretta secondo il testo studiato.' :
          'FALSO. L\'affermazione è stata modificata e non corrisponde al contenuto originale.',
        difficulty: this.mapDifficultyToNumber(classification.difficolta) - 1,
        tags: [classification.materia, classification.argomento, 'verifica']
      });
    }
    
    return tfs;
  }

  makeStatementFalse(statement) {
    const modifications = [
      { from: /\bè\b/g, to: 'non è' },
      { from: /\bsono\b/g, to: 'non sono' },
      { from: /\bimportante\b/g, to: 'marginale' },
      { from: /\bprincipale\b/g, to: 'secondario' },
      { from: /\bprimo\b/g, to: 'ultimo' }
    ];
    
    for (const mod of modifications) {
      if (mod.from.test(statement)) {
        return statement.replace(mod.from, mod.to);
      }
    }
    
    return `Non è vero che ${statement.toLowerCase()}`;
  }

  async generateCloze(text, classification, count) {
    const clozes = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i];
      const cloze = this.createClozeFromSentence(sentence, classification);
      if (cloze) {
        clozes.push(cloze);
      }
    }
    
    return clozes;
  }

  createClozeFromSentence(sentence, classification) {
    const words = sentence.split(' ');
    const importantWords = words.filter(word => 
      word.length > 4 && 
      /^[A-Z]/.test(word) &&
      !['Questo', 'Quello', 'Questi', 'Quelli'].includes(word)
    );
    
    if (importantWords.length === 0) return null;
    
    const wordToHide = importantWords[0];
    const clozeText = sentence.replace(wordToHide, '______');
    
    return {
      type: 'cloze',
      question_text: `Completa la frase: ${clozeText}`,
      correct_answer: wordToHide,
      explanation: `La parola mancante è "${wordToHide}"`,
      difficulty: this.mapDifficultyToNumber(classification.difficolta),
      tags: [classification.materia, classification.argomento, 'completamento']
    };
  }

  // UTILITY METHODS
  calculateConfidence(flashcard, originalText) {
    let confidence = 0.8; // Base confidence
    
    // Aumenta se il contenuto è presente nel testo
    if (originalText.includes(flashcard.front) || originalText.includes(flashcard.back)) {
      confidence += 0.1;
    }
    
    // Diminuisce per contenuti troppo corti
    if (flashcard.back.length < 20) {
      confidence -= 0.2;
    }
    
    return Math.min(1.0, Math.max(0.1, confidence));
  }

  mapDifficultyToNumber(difficulty) {
    const mapping = {
      'base': 2,
      'intermedio': 3,
      'avanzato': 4
    };
    return mapping[difficulty] || 3;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

module.exports = AIContentGenerator;
