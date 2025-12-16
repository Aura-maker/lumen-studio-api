// SERVIZIO OCR COMPLETO PER "ESTRAI & CREA"
// Implementa tutte le specifiche del prompt Claude-4

const Tesseract = require('tesseract.js');

class OCRService {
  constructor() {
    this.isInitialized = false;
    this.worker = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('🔍 Inizializzazione servizio OCR...');
      this.worker = await Tesseract.createWorker();
      await this.worker.loadLanguage('ita+eng');
      await this.worker.initialize('ita+eng');
      this.isInitialized = true;
      console.log('✅ Servizio OCR inizializzato');
    } catch (error) {
      console.error('❌ Errore inizializzazione OCR:', error);
      throw error;
    }
  }

  // METODO PRINCIPALE: ESTRAZIONE TESTO DA IMMAGINE
  async extractText(imageBuffer) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🔍 Avvio estrazione testo...');
      
      // Analizza qualità immagine
      const imageQuality = await this.analyzeImageQuality(imageBuffer);
      
      // Estrazione OCR
      const { data } = await this.worker.recognize(imageBuffer);
      
      // Analizza tipo contenuto
      const contentType = this.detectContentType(data.text);
      
      // Estrai formule matematiche
      const formulas = this.extractMathFormulas(data.text, data);
      
      // Calcola confidence complessiva
      const overallConfidence = this.calculateOverallConfidence(data, imageQuality);
      
      const result = {
        // Testo estratto
        extractedText: data.text.trim(),
        
        // Metadati OCR
        ocr_confidence: overallConfidence,
        handwriting_confidence: contentType.isHandwritten ? contentType.handwritingConfidence : null,
        
        // Qualità immagine
        image_quality: imageQuality,
        
        // Tipo contenuto
        content_type: contentType,
        
        // Formule matematiche
        detected_formulas: formulas,
        
        // Dati grezzi per debug
        raw_data: {
          confidence: data.confidence,
          word_count: data.words?.length || 0,
          line_count: data.lines?.length || 0,
          paragraph_count: data.paragraphs?.length || 0
        },
        
        // Avvisi e raccomandazioni
        warnings: this.generateWarnings(overallConfidence, imageQuality, data.text),
        
        // Timestamp
        processed_at: new Date().toISOString()
      };

      console.log(`✅ OCR completato - Confidence: ${overallConfidence.toFixed(2)}`);
      return result;

    } catch (error) {
      console.error('❌ Errore estrazione OCR:', error);
      throw new Error(`Errore OCR: ${error.message}`);
    }
  }

  // ANALISI QUALITÀ IMMAGINE
  async analyzeImageQuality(imageBuffer) {
    // Implementazione semplificata - in produzione usare librerie specializzate
    const size = imageBuffer.length;
    
    return {
      size_mb: (size / 1024 / 1024).toFixed(2),
      estimated_resolution: size > 2000000 ? 'alta' : size > 500000 ? 'media' : 'bassa',
      quality_score: size > 1000000 ? 0.9 : size > 300000 ? 0.7 : 0.5,
      recommendations: size < 300000 ? ['Usa immagine ad alta risoluzione per migliori risultati'] : []
    };
  }

  // RILEVAMENTO TIPO CONTENUTO
  detectContentType(text) {
    const indicators = {
      // Indicatori contenuto scritto a mano
      handwritten: {
        patterns: [
          /[a-z]{2,}\s+[A-Z]/g, // Inconsistenza maiuscole/minuscole
          /\w+\s{2,}\w+/g,      // Spaziature irregolari
          /[0-9]\s+[a-zA-Z]/g   // Numeri e lettere mescolati
        ],
        threshold: 0.3
      },
      
      // Indicatori contenuto digitale/stampato
      digital: {
        patterns: [
          /^\s*\d+\.\s/gm,      // Numerazione ordinata
          /[A-Z][a-z]+\s[A-Z][a-z]+/g, // Nomi propri formattati
          /\b(Capitolo|Sezione|Paragrafo)\s+\d+/gi // Struttura libro
        ],
        threshold: 0.2
      },
      
      // Indicatori materie specifiche
      math: {
        patterns: [
          /[\u222B\u2211\u220F\u221A\u00B1\u00D7\u00F7\u2264\u2265\u2260\u221E]/g,    // Simboli matematici
          /\b(sin|cos|tan|log|ln)\b/gi,
          /\b\d+[a-z]\s*[+\-*/=]\s*\d+/g,
          /\b(equazione|derivata|integrale|limite)\b/gi
        ]
      },
      
      physics: {
        patterns: [
          /\b(forza|velocità|accelerazione|energia|potenza)\b/gi,
          /\b[A-Z]\s*=\s*[^=]+/g, // Formule fisiche
          /\b(Newton|Joule|Watt|Volt|Ampere|kg|m\/s)\b/gi
        ]
      },
      
      literature: {
        patterns: [
          /\b(poeta|scrittore|romanzo|poesia|verso|strofa)\b/gi,
          /\b(Dante|Petrarca|Boccaccio|Manzoni|Leopardi)\b/gi,
          /[""][^""]+[""]/g // Citazioni
        ]
      }
    };

    const results = {};
    let totalMatches = 0;
    
    // Analizza ogni categoria
    Object.keys(indicators).forEach(category => {
      const categoryData = indicators[category];
      let matches = 0;
      
      categoryData.patterns.forEach(pattern => {
        const found = text.match(pattern) || [];
        matches += found.length;
      });
      
      results[category] = {
        matches,
        score: matches / Math.max(text.length / 100, 1) // Normalizza per lunghezza testo
      };
      
      totalMatches += matches;
    });

    // Determina tipo principale
    const isHandwritten = results.handwritten.score > indicators.handwritten.threshold;
    const isDigital = results.digital.score > indicators.digital.threshold;
    
    return {
      isHandwritten,
      isDigital: !isHandwritten && isDigital,
      handwritingConfidence: isHandwritten ? Math.min(results.handwritten.score, 0.95) : 0,
      
      // Materia probabile
      probable_subject: this.determineProbableSubject(results),
      subject_confidence: this.calculateSubjectConfidence(results),
      
      // Dettagli analisi
      analysis: results
    };
  }

  // ESTRAZIONE FORMULE MATEMATICHE
  extractMathFormulas(text, ocrData) {
    const formulas = [];
    
    // Pattern per formule matematiche comuni
    const mathPatterns = [
      {
        name: 'equation',
        pattern: /([a-zA-Z0-9\s+\-*/=()^√∫∑∏]+)\s*=\s*([a-zA-Z0-9\s+\-*/()^√∫∑∏]+)/g,
        type: 'equazione'
      },
      {
        name: 'fraction',
        pattern: /(\d+|\w+)\s*\/\s*(\d+|\w+)/g,
        type: 'frazione'
      },
      {
        name: 'power',
        pattern: /(\w+)\^(\d+|\w+)/g,
        type: 'potenza'
      },
      {
        name: 'function',
        pattern: /(sin|cos|tan|log|ln|sqrt)\s*\(\s*([^)]+)\s*\)/gi,
        type: 'funzione'
      },
      {
        name: 'integral',
        pattern: /∫\s*([^d]+)\s*d([a-zA-Z])/g,
        type: 'integrale'
      }
    ];

    mathPatterns.forEach(({ pattern, type, name }) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const formula = {
          id: `${name}_${formulas.length + 1}`,
          original: match[0],
          latex: this.convertToLaTeX(match[0], type),
          type: type,
          confidence: this.estimateFormulaConfidence(match[0]),
          position: {
            start: match.index,
            end: match.index + match[0].length
          }
        };
        
        formulas.push(formula);
      }
    });

    return formulas;
  }

  // CONVERSIONE A LATEX
  convertToLaTeX(formula, type) {
    let latex = formula;
    
    // Conversioni base
    const conversions = {
      // Frazioni
      '/(\\w+|\\d+)\\s*\\/\\s*(\\w+|\\d+)/g': '\\frac{$1}{$2}',
      
      // Potenze
      /(\w+)\^(\d+|\w+)/g: '$1^{$2}',
      
      // Radici
      /sqrt\(([^)]+)\)/gi: '\\sqrt{$1}',
      
      // Funzioni trigonometriche
      /sin\s*\(([^)]+)\)/gi: '\\sin($1)',
      /cos\s*\(([^)]+)\)/gi: '\\cos($1)',
      /tan\s*\(([^)]+)\)/gi: '\\tan($1)',
      
      // Logaritmi
      /log\s*\(([^)]+)\)/gi: '\\log($1)',
      /ln\s*\(([^)]+)\)/gi: '\\ln($1)',
      
      // Integrali
      /\u222B\s*([^d]+)\s*d([a-zA-Z])/g: '\\int $1 \\, d$2',
      
      // Simboli matematici
      /\u00B1/g: '\\pm',
      /\u221E/g: '\\infty',
      /\u2264/g: '\\leq',
      /\u2265/g: '\\geq',
      /\u2260/g: '\\neq',
      /\u00D7/g: '\\times',
      /\u00F7/g: '\\div'
    };

    Object.entries(conversions).forEach(([pattern, replacement]) => {
      latex = latex.replace(new RegExp(pattern, 'g'), replacement);
    });

    return `\\(${latex}\\)`;
  }

  // CALCOLO CONFIDENCE COMPLESSIVA
  calculateOverallConfidence(ocrData, imageQuality) {
    const baseConfidence = ocrData.confidence / 100;
    const qualityFactor = imageQuality.quality_score;
    const textLengthFactor = Math.min(ocrData.text.length / 100, 1);
    
    return Math.max(0.1, Math.min(0.99, 
      (baseConfidence * 0.6) + 
      (qualityFactor * 0.3) + 
      (textLengthFactor * 0.1)
    ));
  }

  // DETERMINAZIONE MATERIA PROBABILE
  determineProbableSubject(analysisResults) {
    const subjects = ['math', 'physics', 'literature'];
    let bestSubject = 'generale';
    let bestScore = 0;

    subjects.forEach(subject => {
      if (analysisResults[subject] && analysisResults[subject].score > bestScore) {
        bestScore = analysisResults[subject].score;
        bestSubject = subject;
      }
    });

    // Mappatura a nomi italiani
    const subjectMap = {
      'math': 'matematica',
      'physics': 'fisica', 
      'literature': 'italiano',
      'generale': 'generale'
    };

    return subjectMap[bestSubject] || 'generale';
  }

  // CALCOLO CONFIDENCE MATERIA
  calculateSubjectConfidence(analysisResults) {
    const subjects = ['math', 'physics', 'literature'];
    const scores = subjects.map(s => analysisResults[s]?.score || 0);
    const maxScore = Math.max(...scores);
    
    return Math.min(0.95, maxScore * 2); // Normalizza e limita
  }

  // STIMA CONFIDENCE FORMULA
  estimateFormulaConfidence(formula) {
    // Fattori che influenzano la confidence
    const factors = {
      hasEquals: /=/.test(formula) ? 0.2 : 0,
      hasNumbers: /\d/.test(formula) ? 0.15 : 0,
      hasVariables: /[a-zA-Z]/.test(formula) ? 0.15 : 0,
      hasOperators: /[+\-*/^]/.test(formula) ? 0.2 : 0,
      hasFunctions: /(sin|cos|tan|log|ln|sqrt)/i.test(formula) ? 0.2 : 0,
      length: Math.min(formula.length / 20, 0.1)
    };

    const totalScore = Object.values(factors).reduce((sum, val) => sum + val, 0);
    return Math.min(0.95, Math.max(0.3, totalScore));
  }

  // GENERAZIONE AVVISI
  generateWarnings(confidence, imageQuality, text) {
    const warnings = [];

    if (confidence < 0.75) {
      warnings.push('ocr_warning');
      warnings.push('low_confidence_ocr');
    }

    if (imageQuality.quality_score < 0.6) {
      warnings.push('low_image_quality');
    }

    if (text.length < 50) {
      warnings.push('short_text');
    }

    if (!/[a-zA-Z]/.test(text)) {
      warnings.push('no_text_detected');
    }

    return warnings;
  }

  // CLEANUP
  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      console.log('🧹 Servizio OCR terminato');
    }
  }

  // METODI UTILITY
  
  // Rilevamento dati sensibili
  detectSensitiveData(text) {
    const sensitivePatterns = [
      /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, // Carte di credito
      /\b[A-Z]{2}\d{2}\s?[A-Z]\d{3}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{3}\b/g, // IBAN
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Telefoni
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
      /\b\d{16}\b/g // Codici numerici lunghi
    ];

    const detected = [];
    sensitivePatterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        detected.push({
          type: ['carta_credito', 'iban', 'telefono', 'email', 'codice_numerico'][index],
          count: matches.length,
          examples: matches.slice(0, 2).map(m => m.substring(0, 4) + '***')
        });
      }
    });

    return detected;
  }

  // Mascheramento dati sensibili
  maskSensitiveData(text) {
    const patterns = [
      { pattern: /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, replacement: '[CARTA_CREDITO_RIMOSSA]' },
      { pattern: /\b[A-Z]{2}\d{2}\s?[A-Z]\d{3}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{3}\b/g, replacement: '[IBAN_RIMOSSO]' },
      { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: '[TELEFONO_RIMOSSO]' },
      { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL_RIMOSSA]' }
    ];

    let maskedText = text;
    patterns.forEach(({ pattern, replacement }) => {
      maskedText = maskedText.replace(pattern, replacement);
    });

    return maskedText;
  }
}

module.exports = OCRService;
