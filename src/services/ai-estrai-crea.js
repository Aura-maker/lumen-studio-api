// SERVIZIO AI "ESTRAI & CREA" - CLAUDE 4 INTEGRATION
// Pipeline completa: OCR → Classificazione → Generazione Quiz/Flashcards

const multer = require('multer');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const ExerciseSolver = require('./exercise-solver');
const AIMachineLearning = require('./ai-machine-learning');

class AIEstraiCrea {
  constructor() {
    this.supportedFormats = ['jpeg', 'jpg', 'png'];
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.qualityThreshold = 70;
    this.exerciseSolver = new ExerciseSolver();
    this.aiML = new AIMachineLearning();
    
    // Tassonomia materie
    this.tassonomiaMaterie = {
      'italiano': ['letteratura', 'grammatica', 'poesia', 'romanzo', 'teatro'],
      'storia': ['antica', 'medievale', 'moderna', 'contemporanea', 'guerra'],
      'filosofia': ['antica', 'medievale', 'moderna', 'contemporanea', 'etica'],
      'fisica': ['meccanica', 'termodinamica', 'elettromagnetismo', 'ottica'],
      'matematica': ['algebra', 'geometria', 'analisi', 'probabilità', 'statistica'],
      'scienze': ['biologia', 'chimica', 'anatomia', 'ecologia', 'genetica'],
      'latino': ['grammatica', 'letteratura', 'traduzione', 'cultura'],
      'arte': ['pittura', 'scultura', 'architettura', 'storia dell\'arte'],
      'inglese': ['grammatica', 'letteratura', 'conversazione', 'cultura'],
      'religione': ['teologia', 'etica', 'storia', 'dottrina']
    };
  }

  // FASE A: PREPROCESSING
  async preprocessInput(input) {
    try {
      if (input.type === 'image') {
        return await this.processImage(input.data);
      } else if (input.type === 'text') {
        return this.processText(input.data);
      }
      throw new Error('Tipo di input non supportato');
    } catch (error) {
      throw new Error(`Errore preprocessing: ${error.message}`);
    }
  }

  async processImage(imageBuffer) {
    try {
      // Pre-elaborazione immagine MIGLIORATA per OCR
      const processedImage = await sharp(imageBuffer)
        .resize(3000, null, { withoutEnlargement: true })
        .greyscale()
        .normalize()
        .sharpen({ sigma: 1.5 })
        .threshold(128)
        .toBuffer();

      console.log('🔍 Avvio OCR avanzato...');
      
      // OCR con configurazione ottimizzata
      const { data: { text, confidence } } = await Tesseract.recognize(
        processedImage,
        'eng+ita',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          },
          tessedit_pageseg_mode: Tesseract.PSM.AUTO,
          tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzàèéìíîòóùú()[]{}+-*/=.,;:!?° ',
        }
      );

      console.log(`📝 Testo estratto (confidence: ${confidence}%):`, text.substring(0, 200));

      if (confidence < 50) {
        throw new Error('L\'immagine è sfocata o il testo non è leggibile - prova a scansionare meglio o caricare una foto più nitida.');
      }

      const normalizedText = this.normalizeText(text);
      
      return {
        extractedText: normalizedText,
        confidence: confidence,
        hasFormulas: this.detectFormulas(normalizedText),
        hasDiagrams: this.detectDiagrams(normalizedText)
      };
    } catch (error) {
      console.error('Errore OCR:', error);
      throw new Error(`Errore nell'elaborazione dell'immagine: ${error.message}`);
    }
  }

  processText(text) {
    return {
      extractedText: this.normalizeText(text),
      confidence: 100,
      hasFormulas: this.detectFormulas(text),
      hasDiagrams: false
    };
  }

  normalizeText(text) {
    return text
      // Rimuovi caratteri di controllo e artefatti OCR
      .replace(/[^\w\s.,;:!?()\[\]{}""''àèéìíîòóùú+\-*/=°√∫∑∏πα-ωΑ-Ω]/g, '')
      // Correggi spazi multipli
      .replace(/\s+/g, ' ')
      // Correggi errori OCR comuni
      .replace(/\b0\b/g, 'o')  // Zero confuso con O
      .replace(/\bl\b/g, '1')  // L minuscola confusa con 1
      .replace(/\bO\b/g, '0')  // O maiuscola confusa con 0
      // Rimuovi linee vuote multiple
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  detectFormulas(text) {
    const formulaPatterns = [
      /[a-zA-Z]\s*=\s*[a-zA-Z0-9+\-*/()^]+/,
      /∫|∑|∏|√|π|α|β|γ|δ|ε|θ|λ|μ|σ|φ|ψ|ω/,
      /\b\d+\s*[+\-*/]\s*\d+/
    ];
    return formulaPatterns.some(pattern => pattern.test(text));
  }

  detectDiagrams(text) {
    const diagramKeywords = ['grafico', 'diagramma', 'schema', 'figura', 'tabella'];
    return diagramKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  // FASE B: COMPRENSIONE E CLASSIFICAZIONE CON AI/ML
  async analyzeContent(extractedData) {
    const text = extractedData.extractedText;
    
    // ANALISI TRADIZIONALE
    const basicClassification = {
      materia: this.classifySubject(text),
      argomento: this.identifyTopic(text),
      sottoargomento: this.identifySubtopic(text),
      livelloScolastico: this.estimateLevel(text),
      difficolta: this.estimateDifficulty(text),
      ideaChiave: this.extractKeyIdeas(text),
      sintesi: this.generateSummary(text)
    };

    // ANALISI AVANZATA CON MACHINE LEARNING
    console.log('🧠 Analisi AI/ML avanzata...');
    const mlAnalysis = await this.aiML.analyzeContentIntelligently(text, extractedData.imageFeatures);
    
    // COMBINAZIONE ANALISI TRADIZIONALE E ML
    const enhancedClassification = {
      ...basicClassification,
      // Override con risultati ML se più confidenti
      materia: mlAnalysis.confidence > 0.7 ? mlAnalysis.subject : basicClassification.materia,
      difficolta: mlAnalysis.difficulty,
      // Aggiungi insights ML
      mlInsights: mlAnalysis.insights,
      mlConfidence: mlAnalysis.confidence,
      mlProbabilities: mlAnalysis.probabilities,
      recommendedQuestionTypes: mlAnalysis.recommendedQuestionTypes,
      adaptiveParameters: mlAnalysis.adaptiveParameters
    };

    // RISOLUZIONE AUTOMATICA ESERCIZI
    console.log('🧮 Analizzando per esercizi...');
    const exerciseSolution = await this.exerciseSolver.solveExercise(text, enhancedClassification.materia);
    
    // GENERAZIONE CONTENUTI ADATTIVI
    console.log('🎯 Generazione contenuti adattivi...');
    const adaptiveContent = await this.aiML.generateAdaptiveContent(mlAnalysis);
    
    return {
      ...extractedData,
      classification: enhancedClassification,
      exerciseSolution,
      adaptiveContent,
      mlAnalysis
    };
  }

  classifySubject(text) {
    const textLower = text.toLowerCase();
    let bestMatch = { subject: 'generale', confidence: 0 };

    // PRIORITÀ ALTA: Riconoscimento matematica/fisica
    if (this.isMathOrPhysics(text)) {
      if (this.isPhysics(text)) {
        return 'fisica';
      } else {
        return 'matematica';
      }
    }

    for (const [materia, keywords] of Object.entries(this.tassonomiaMaterie)) {
      let score = 0;
      keywords.forEach(keyword => {
        if (textLower.includes(keyword)) {
          score += 1;
        }
      });
      
      // Parole chiave specifiche per materia
      const specificKeywords = this.getSpecificKeywords(materia);
      specificKeywords.forEach(keyword => {
        if (textLower.includes(keyword)) {
          score += 3; // Peso maggiore per parole specifiche
        }
      });

      if (score > bestMatch.confidence) {
        bestMatch = { subject: materia, confidence: score };
      }
    }

    return bestMatch.confidence > 0 ? bestMatch.subject : 'generale';
  }

  isMathOrPhysics(text) {
    const mathPhysicsPatterns = [
      /\b(equation|solve|find|calculate|log|sin|cos|tan)\b/i,
      /\b(equazione|risolvi|trova|calcola|logaritmo)\b/i,
      /[a-zA-Z]\s*=\s*[0-9+\-*/()^.]+/,
      /\b\d+\s*[+\-*/^]\s*\d+/,
      /\b(x|y|z|a|b|c)\s*[=<>]\s*\d+/,
      /\blog\s*\d+/i,
      /\b(velocity|force|energy|mass|acceleration)\b/i,
      /\b(velocità|forza|energia|massa|accelerazione)\b/i
    ];
    
    return mathPhysicsPatterns.some(pattern => pattern.test(text));
  }

  isPhysics(text) {
    const physicsKeywords = [
      'velocity', 'force', 'energy', 'mass', 'acceleration', 'momentum',
      'velocità', 'forza', 'energia', 'massa', 'accelerazione', 'quantità di moto',
      'newton', 'joule', 'watt', 'volt', 'ampere', 'ohm'
    ];
    
    const textLower = text.toLowerCase();
    return physicsKeywords.some(keyword => textLower.includes(keyword));
  }

  getSpecificKeywords(materia) {
    const keywords = {
      'italiano': ['dante', 'petrarca', 'manzoni', 'leopardi', 'verga', 'pirandello'],
      'storia': ['guerra', 'rivoluzione', 'impero', 'repubblica', 'fascismo', 'resistenza'],
      'filosofia': ['kant', 'hegel', 'nietzsche', 'esistenzialismo', 'idealismo'],
      'fisica': ['forza', 'energia', 'velocità', 'accelerazione', 'campo', 'onda'],
      'matematica': ['equazione', 'funzione', 'derivata', 'integrale', 'limite', 'logaritmo', 'log', 'solve', 'find', 'calculate', 'solution', 'soluzione', 'risolvi', 'trova', 'calcola'],
      'scienze': ['cellula', 'dna', 'evoluzione', 'ecosistema', 'molecola'],
      'latino': ['caesar', 'cicero', 'virgilio', 'ablativo', 'accusativo'],
      'arte': ['rinascimento', 'barocco', 'impressionismo', 'scultura'],
      'inglese': ['shakespeare', 'grammar', 'present', 'past', 'future'],
      'religione': ['dio', 'cristo', 'chiesa', 'vangelo', 'sacramento']
    };
    return keywords[materia] || [];
  }

  identifyTopic(text) {
    // Estrae il topic principale basandosi su titoli e parole chiave
    const sentences = text.split(/[.!?]+/);
    const firstSentence = sentences[0] || '';
    
    // Cerca pattern di titoli
    const titlePattern = /^[A-Z][^.!?]*$/;
    if (titlePattern.test(firstSentence.trim())) {
      return firstSentence.trim();
    }

    // Fallback: usa le prime parole significative
    const words = text.split(' ').filter(w => w.length > 3);
    return words.slice(0, 3).join(' ');
  }

  identifySubtopic(text) {
    // Identifica sottotemi basandosi su sottotitoli e struttura
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const subtopics = lines.filter(line => 
      line.length < 100 && 
      /^[A-Z]/.test(line.trim()) &&
      !line.includes('.')
    );
    
    return subtopics[1] || 'Concetti generali';
  }

  estimateLevel(text) {
    const complexity = this.calculateComplexity(text);
    if (complexity < 0.3) return '3ª superiore';
    if (complexity < 0.6) return '4ª superiore';
    return '5ª superiore';
  }

  estimateDifficulty(text) {
    const complexity = this.calculateComplexity(text);
    if (complexity < 0.3) return 'base';
    if (complexity < 0.7) return 'intermedio';
    return 'avanzato';
  }

  calculateComplexity(text) {
    const words = text.split(' ');
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const longWords = words.filter(word => word.length > 7).length / words.length;
    const sentences = text.split(/[.!?]+/).length;
    const avgSentenceLength = words.length / sentences;
    
    return (avgWordLength / 10 + longWords + avgSentenceLength / 20) / 3;
  }

  extractKeyIdeas(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyIdeas = [];
    
    sentences.forEach(sentence => {
      if (this.isKeyIdea(sentence)) {
        keyIdeas.push(sentence.trim());
      }
    });
    
    return keyIdeas.slice(0, 10);
  }

  isKeyIdea(sentence) {
    const keyPhrases = [
      'è importante', 'fondamentale', 'caratteristica principale',
      'si definisce', 'consiste nel', 'principio', 'legge',
      'teorema', 'formula', 'concetto'
    ];
    
    return keyPhrases.some(phrase => 
      sentence.toLowerCase().includes(phrase)
    );
  }

  generateSummary(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const importantSentences = sentences
      .filter(s => this.isKeyIdea(s))
      .slice(0, 3);
    
    let summary = importantSentences.join('. ');
    if (summary.length > 200) {
      summary = summary.substring(0, 197) + '...';
    }
    
    return summary || text.substring(0, 200) + '...';
  }
}

module.exports = AIEstraiCrea;
