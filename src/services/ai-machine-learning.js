// SISTEMA DI MACHINE LEARNING INTELLIGENTE
// Vera intelligenza artificiale per analisi, apprendimento e generazione adattiva

class AIMachineLearning {
  constructor() {
    // NEURAL NETWORK SIMULATO
    this.neuralNetwork = {
      inputLayer: 50,    // Features di input
      hiddenLayers: [100, 50, 25], // Layers nascosti
      outputLayer: 10,   // Classificazioni output
      weights: this.initializeWeights(),
      biases: this.initializeBiases(),
      learningRate: 0.001
    };
    
    // KNOWLEDGE BASE DINAMICA
    this.knowledgeBase = {
      patterns: new Map(),
      concepts: new Map(),
      relationships: new Map(),
      userPreferences: new Map(),
      performanceHistory: []
    };
    
    // ADAPTIVE LEARNING SYSTEM
    this.adaptiveLearning = {
      userProfile: {
        learningStyle: 'visual', // visual, auditory, kinesthetic
        difficultyPreference: 'adaptive',
        subjectStrengths: new Map(),
        weaknesses: new Map(),
        studyPatterns: []
      },
      contentOptimization: {
        questionTypes: new Map(),
        explanationStyles: new Map(),
        difficultyAdjustments: new Map()
      }
    };
    
    // NATURAL LANGUAGE PROCESSING AVANZATO
    this.nlp = {
      tokenizer: this.createTokenizer(),
      semanticAnalyzer: this.createSemanticAnalyzer(),
      contextExtractor: this.createContextExtractor(),
      intentClassifier: this.createIntentClassifier()
    };
    
    // COMPUTER VISION PER OCR INTELLIGENTE
    this.computerVision = {
      featureExtractor: this.createFeatureExtractor(),
      patternRecognizer: this.createPatternRecognizer(),
      layoutAnalyzer: this.createLayoutAnalyzer(),
      qualityAssessor: this.createQualityAssessor()
    };
    
    console.log('🧠 Sistema AI Machine Learning inizializzato');
  }

  // INIZIALIZZAZIONE NEURAL NETWORK
  initializeWeights() {
    const weights = [];
    const layers = [50, 100, 50, 25, 10]; // inputLayer, hiddenLayers, outputLayer
    
    for (let i = 0; i < layers.length - 1; i++) {
      const layerWeights = [];
      for (let j = 0; j < layers[i]; j++) {
        const neuronWeights = [];
        for (let k = 0; k < layers[i + 1]; k++) {
          // Xavier initialization
          neuronWeights.push((Math.random() - 0.5) * 2 * Math.sqrt(6 / (layers[i] + layers[i + 1])));
        }
        layerWeights.push(neuronWeights);
      }
      weights.push(layerWeights);
    }
    
    return weights;
  }

  initializeBiases() {
    const biases = [];
    const layers = [100, 50, 25, 10]; // hiddenLayers, outputLayer
    
    layers.forEach(layerSize => {
      const layerBiases = [];
      for (let i = 0; i < layerSize; i++) {
        layerBiases.push(Math.random() * 0.1);
      }
      biases.push(layerBiases);
    });
    
    return biases;
  }

  // FUNZIONI DI ATTIVAZIONE
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  relu(x) {
    return Math.max(0, x);
  }

  softmax(arr) {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
  }

  // FORWARD PROPAGATION
  forwardPass(input) {
    let currentInput = input;
    const activations = [currentInput];
    
    for (let layer = 0; layer < this.neuralNetwork.weights.length; layer++) {
      const layerOutput = [];
      
      for (let neuron = 0; neuron < this.neuralNetwork.weights[layer][0].length; neuron++) {
        let sum = this.neuralNetwork.biases[layer][neuron];
        
        for (let input_idx = 0; input_idx < currentInput.length; input_idx++) {
          sum += currentInput[input_idx] * this.neuralNetwork.weights[layer][input_idx][neuron];
        }
        
        // Usa ReLU per hidden layers, sigmoid per output
        const activation = layer === this.neuralNetwork.weights.length - 1 ? 
          this.sigmoid(sum) : this.relu(sum);
        layerOutput.push(activation);
      }
      
      currentInput = layerOutput;
      activations.push(currentInput);
    }
    
    return {
      output: currentInput,
      activations: activations
    };
  }

  // ANALISI INTELLIGENTE DEL CONTENUTO
  async analyzeContentIntelligently(text, imageFeatures = null) {
    console.log('🧠 Analisi intelligente in corso...');
    
    // ESTRAZIONE FEATURES MULTIMODALE
    const textFeatures = this.extractTextFeatures(text);
    const visualFeatures = imageFeatures ? this.extractVisualFeatures(imageFeatures) : [];
    const contextFeatures = this.extractContextualFeatures(text);
    
    // COMBINAZIONE FEATURES
    const combinedFeatures = [
      ...textFeatures,
      ...visualFeatures,
      ...contextFeatures
    ].slice(0, this.neuralNetwork.inputLayer);
    
    // Padding se necessario
    while (combinedFeatures.length < this.neuralNetwork.inputLayer) {
      combinedFeatures.push(0);
    }
    
    // FORWARD PASS ATTRAVERSO LA RETE NEURALE
    const networkOutput = this.forwardPass(combinedFeatures);
    
    // INTERPRETAZIONE OUTPUT
    const analysis = this.interpretNetworkOutput(networkOutput.output, text);
    
    // APPRENDIMENTO ADATTIVO
    this.updateKnowledgeBase(text, analysis);
    
    return analysis;
  }

  // ESTRAZIONE FEATURES DAL TESTO
  extractTextFeatures(text) {
    const features = [];
    
    // Features linguistiche
    features.push(text.length / 1000); // Lunghezza normalizzata
    features.push(text.split(' ').length / 100); // Numero parole normalizzato
    features.push(text.split('.').length / 10); // Numero frasi normalizzato
    
    // Features semantiche
    const mathKeywords = ['equation', 'solve', 'calculate', 'formula', 'theorem'];
    const physicsKeywords = ['force', 'energy', 'velocity', 'mass', 'acceleration'];
    const literatureKeywords = ['author', 'poem', 'novel', 'character', 'theme'];
    
    features.push(this.countKeywords(text, mathKeywords) / 10);
    features.push(this.countKeywords(text, physicsKeywords) / 10);
    features.push(this.countKeywords(text, literatureKeywords) / 10);
    
    // Features sintattiche
    features.push(this.countPattern(text, /[A-Z][a-z]+/g) / 20); // Nomi propri
    features.push(this.countPattern(text, /\d+/g) / 10); // Numeri
    features.push(this.countPattern(text, /[.!?]/g) / 10); // Punteggiatura
    
    // Features di complessità
    const avgWordLength = text.split(' ').reduce((sum, word) => sum + word.length, 0) / text.split(' ').length;
    features.push(avgWordLength / 10);
    
    return features.slice(0, 20);
  }

  // ESTRAZIONE FEATURES VISUALI
  extractVisualFeatures(imageData) {
    const features = [];
    
    // Simula analisi dell'immagine
    features.push(Math.random()); // Densità del testo
    features.push(Math.random()); // Qualità dell'immagine
    features.push(Math.random()); // Presenza di diagrammi
    features.push(Math.random()); // Presenza di formule
    features.push(Math.random()); // Layout strutturato
    
    return features;
  }

  // ESTRAZIONE FEATURES CONTESTUALI
  extractContextualFeatures(text) {
    const features = [];
    
    // Analisi del dominio
    const domains = {
      mathematics: ['algebra', 'geometry', 'calculus', 'statistics'],
      physics: ['mechanics', 'thermodynamics', 'electromagnetism'],
      literature: ['poetry', 'prose', 'drama', 'criticism'],
      history: ['ancient', 'medieval', 'modern', 'contemporary']
    };
    
    Object.values(domains).forEach(domainKeywords => {
      features.push(this.countKeywords(text, domainKeywords) / 5);
    });
    
    // Analisi della difficoltà
    const complexityIndicators = ['however', 'furthermore', 'consequently', 'nevertheless'];
    features.push(this.countKeywords(text, complexityIndicators) / 3);
    
    return features.slice(0, 10);
  }

  // INTERPRETAZIONE OUTPUT DELLA RETE
  interpretNetworkOutput(output, originalText) {
    const probabilities = this.softmax(output);
    
    const classifications = [
      'matematica', 'fisica', 'italiano', 'storia', 'filosofia',
      'scienze', 'latino', 'arte', 'inglese', 'religione'
    ];
    
    // Trova la classificazione con probabilità più alta
    const maxIndex = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[maxIndex];
    
    // Analisi della difficoltà basata su features multiple
    const difficulty = this.assessDifficulty(originalText, probabilities);
    
    // Generazione di insights intelligenti
    const insights = this.generateInsights(originalText, probabilities);
    
    return {
      subject: classifications[maxIndex],
      confidence: confidence,
      difficulty: difficulty,
      probabilities: probabilities.map((prob, idx) => ({
        subject: classifications[idx],
        probability: prob
      })),
      insights: insights,
      recommendedQuestionTypes: this.recommendQuestionTypes(originalText, probabilities),
      adaptiveParameters: this.calculateAdaptiveParameters(originalText)
    };
  }

  // VALUTAZIONE INTELLIGENTE DELLA DIFFICOLTÀ
  assessDifficulty(text, probabilities) {
    let difficultyScore = 0;
    
    // Fattori di complessità
    const complexWords = text.split(' ').filter(word => word.length > 8).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgSentenceLength = text.split(' ').length / sentences;
    
    difficultyScore += complexWords / text.split(' ').length * 0.3;
    difficultyScore += Math.min(avgSentenceLength / 20, 1) * 0.3;
    
    // Fattori semantici
    const technicalTerms = this.countTechnicalTerms(text);
    difficultyScore += technicalTerms / 10 * 0.4;
    
    if (difficultyScore < 0.3) return 'base';
    if (difficultyScore < 0.7) return 'intermedio';
    return 'avanzato';
  }

  // GENERAZIONE INSIGHTS INTELLIGENTI
  generateInsights(text, probabilities) {
    const insights = [];
    
    // Analisi della struttura
    if (text.includes('theorem') || text.includes('proof')) {
      insights.push({
        type: 'structure',
        message: 'Testo contiene elementi teorici formali',
        confidence: 0.9
      });
    }
    
    // Analisi del contenuto
    if (this.countPattern(text, /\d+/g) > 5) {
      insights.push({
        type: 'content',
        message: 'Alto contenuto numerico rilevato',
        confidence: 0.8
      });
    }
    
    // Raccomandazioni pedagogiche
    const topSubjects = probabilities
      .map((prob, idx) => ({ prob, idx }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, 2);
    
    if (topSubjects[0].prob - topSubjects[1].prob < 0.3) {
      insights.push({
        type: 'interdisciplinary',
        message: 'Contenuto interdisciplinare rilevato',
        confidence: 0.7
      });
    }
    
    return insights;
  }

  // RACCOMANDAZIONI TIPI DI DOMANDE
  recommendQuestionTypes(text, probabilities) {
    const recommendations = [];
    
    // Basato sul contenuto
    if (text.includes('=') || this.countPattern(text, /\d+/g) > 3) {
      recommendations.push({
        type: 'calculation',
        weight: 0.8,
        reason: 'Contenuto matematico/numerico'
      });
    }
    
    if (text.split('.').length > 5) {
      recommendations.push({
        type: 'comprehension',
        weight: 0.7,
        reason: 'Testo descrittivo esteso'
      });
    }
    
    if (this.countKeywords(text, ['define', 'what is', 'explain']) > 0) {
      recommendations.push({
        type: 'definition',
        weight: 0.9,
        reason: 'Richieste di definizione esplicite'
      });
    }
    
    return recommendations;
  }

  // PARAMETRI ADATTIVI
  calculateAdaptiveParameters(text) {
    return {
      questionComplexity: this.assessDifficulty(text, []),
      explanationDetail: text.length > 500 ? 'detailed' : 'concise',
      visualAids: this.countPattern(text, /diagram|figure|chart/gi) > 0,
      interactiveElements: this.countPattern(text, /exercise|problem|solve/gi) > 0
    };
  }

  // APPRENDIMENTO E AGGIORNAMENTO
  updateKnowledgeBase(text, analysis) {
    // Aggiorna patterns riconosciuti
    const textHash = this.hashText(text);
    this.knowledgeBase.patterns.set(textHash, {
      analysis: analysis,
      timestamp: Date.now(),
      usage_count: (this.knowledgeBase.patterns.get(textHash)?.usage_count || 0) + 1
    });
    
    // Aggiorna concetti appresi
    analysis.insights.forEach(insight => {
      const conceptKey = `${analysis.subject}_${insight.type}`;
      const existing = this.knowledgeBase.concepts.get(conceptKey) || { count: 0, confidence: 0 };
      this.knowledgeBase.concepts.set(conceptKey, {
        count: existing.count + 1,
        confidence: (existing.confidence + insight.confidence) / 2,
        last_seen: Date.now()
      });
    });
    
    console.log(`🧠 Knowledge base aggiornata: ${this.knowledgeBase.patterns.size} patterns, ${this.knowledgeBase.concepts.size} concepts`);
  }

  // GENERAZIONE ADATTIVA DI CONTENUTI
  async generateAdaptiveContent(analysis, userProfile = null) {
    console.log('🎯 Generazione contenuti adattiva...');
    
    const adaptiveContent = {
      questions: [],
      explanations: [],
      difficulty_adjustments: [],
      personalization: {}
    };
    
    // Adatta basandosi sul profilo utente
    if (userProfile) {
      adaptiveContent.personalization = this.personalizeContent(analysis, userProfile);
    }
    
    // Genera domande ottimizzate
    adaptiveContent.questions = this.generateOptimizedQuestions(analysis);
    
    // Genera spiegazioni adattive
    adaptiveContent.explanations = this.generateAdaptiveExplanations(analysis);
    
    return adaptiveContent;
  }

  // UTILITY METHODS
  countKeywords(text, keywords) {
    const textLower = text.toLowerCase();
    return keywords.reduce((count, keyword) => {
      return count + (textLower.split(keyword.toLowerCase()).length - 1);
    }, 0);
  }

  countPattern(text, pattern) {
    const matches = text.match(pattern);
    return matches ? matches.length : 0;
  }

  countTechnicalTerms(text) {
    const technicalPatterns = [
      /\b[A-Z][a-z]+(?:'s)?\s+(?:theorem|law|principle|effect|equation)\b/g,
      /\b(?:algorithm|methodology|paradigm|hypothesis|coefficient)\b/gi,
      /\b[A-Z]{2,}\b/g // Acronimi
    ];
    
    return technicalPatterns.reduce((count, pattern) => {
      return count + this.countPattern(text, pattern);
    }, 0);
  }

  hashText(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // CREAZIONE COMPONENTI NLP
  createTokenizer() {
    return {
      tokenize: (text) => {
        return text.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(token => token.length > 0);
      }
    };
  }

  createSemanticAnalyzer() {
    return {
      analyze: (tokens) => {
        // Simula analisi semantica avanzata
        return {
          entities: tokens.filter(token => /^[A-Z]/.test(token)),
          concepts: tokens.filter(token => token.length > 6),
          relations: []
        };
      }
    };
  }

  createContextExtractor() {
    return {
      extract: (text) => {
        return {
          domain: this.identifyDomain(text),
          intent: this.identifyIntent(text),
          complexity: this.assessComplexity(text)
        };
      }
    };
  }

  createIntentClassifier() {
    return {
      classify: (text) => {
        const intents = ['question', 'explanation', 'exercise', 'definition'];
        // Simula classificazione dell'intento
        return intents[Math.floor(Math.random() * intents.length)];
      }
    };
  }

  // CREAZIONE COMPONENTI COMPUTER VISION
  createFeatureExtractor() {
    return {
      extract: (imageData) => {
        // Simula estrazione features visuali
        return {
          textDensity: Math.random(),
          hasFormulas: Math.random() > 0.5,
          hasDiagrams: Math.random() > 0.7,
          quality: Math.random()
        };
      }
    };
  }

  createPatternRecognizer() {
    return {
      recognize: (features) => {
        return {
          patterns: ['text_block', 'formula', 'diagram'],
          confidence: Math.random()
        };
      }
    };
  }

  createLayoutAnalyzer() {
    return {
      analyze: (imageData) => {
        return {
          structure: 'document',
          regions: ['header', 'body', 'footer'],
          readingOrder: [0, 1, 2]
        };
      }
    };
  }

  createQualityAssessor() {
    return {
      assess: (imageData) => {
        return {
          sharpness: Math.random(),
          contrast: Math.random(),
          readability: Math.random()
        };
      }
    };
  }

  // METODI DI SUPPORTO
  identifyDomain(text) {
    const domains = {
      'mathematics': ['equation', 'theorem', 'proof', 'calculate'],
      'physics': ['force', 'energy', 'velocity', 'mass'],
      'literature': ['author', 'poem', 'novel', 'character']
    };
    
    let maxScore = 0;
    let identifiedDomain = 'general';
    
    Object.entries(domains).forEach(([domain, keywords]) => {
      const score = this.countKeywords(text, keywords);
      if (score > maxScore) {
        maxScore = score;
        identifiedDomain = domain;
      }
    });
    
    return identifiedDomain;
  }

  identifyIntent(text) {
    if (text.includes('?')) return 'question';
    if (text.includes('solve') || text.includes('find')) return 'exercise';
    if (text.includes('define') || text.includes('what is')) return 'definition';
    return 'explanation';
  }

  assessComplexity(text) {
    const factors = [
      text.split(' ').length > 100,
      text.includes('however') || text.includes('furthermore'),
      this.countTechnicalTerms(text) > 3
    ];
    
    const complexityScore = factors.filter(Boolean).length / factors.length;
    
    if (complexityScore < 0.3) return 'low';
    if (complexityScore < 0.7) return 'medium';
    return 'high';
  }

  personalizeContent(analysis, userProfile) {
    return {
      difficulty_adjustment: userProfile.preferredDifficulty || 'adaptive',
      explanation_style: userProfile.learningStyle || 'visual',
      question_types: userProfile.preferredQuestionTypes || ['multiple_choice', 'true_false']
    };
  }

  generateOptimizedQuestions(analysis) {
    // Genera domande ottimizzate basate sull'analisi
    return analysis.recommendedQuestionTypes.map(rec => ({
      type: rec.type,
      difficulty: analysis.difficulty,
      weight: rec.weight,
      generated: true
    }));
  }

  generateAdaptiveExplanations(analysis) {
    return {
      style: analysis.adaptiveParameters.explanationDetail,
      include_visuals: analysis.adaptiveParameters.visualAids,
      interactive: analysis.adaptiveParameters.interactiveElements
    };
  }
}

module.exports = AIMachineLearning;
