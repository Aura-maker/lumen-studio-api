// CONTROLLER PRINCIPALE "ESTRAI & CREA"
// Orchestra l'intera pipeline AI

const AIEstraiCrea = require('../services/ai-estrai-crea');
const AIContentGenerator = require('../services/ai-content-generator');
const AIValidator = require('../services/ai-validator');
const UserContentStorage = require('../services/user-content-storage');
const openaiService = require('../services/openai-service');
const multer = require('multer');
const path = require('path');

class AIEstraiCreaController {
  constructor() {
    this.aiExtractor = new AIEstraiCrea();
    this.contentGenerator = new AIContentGenerator();
    this.validator = new AIValidator();
    this.userStorage = new UserContentStorage();
    
    // Configurazione multer per upload
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Formato file non supportato. Usa JPEG o PNG.'), false);
        }
      }
    });
  }

  // ENDPOINT PRINCIPALE: PROCESSA INPUT
  async processInput(req, res) {
    try {
      const startTime = Date.now();
      
      // Estrai parametri
      const {
        user_id,
        language = 'italiano',
        subject_hint,
        privacy_opt_in = false,
        text_input
      } = req.body;

      if (!user_id) {
        return res.status(400).json({
          success: false,
          error: 'user_id è richiesto'
        });
      }

      let input;
      
      // Determina tipo di input
      if (req.file) {
        input = {
          type: 'image',
          data: req.file.buffer,
          metadata: {
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
          }
        };
      } else if (text_input) {
        input = {
          type: 'text',
          data: text_input,
          metadata: {}
        };
      } else {
        return res.status(400).json({
          success: false,
          error: 'Fornisci un\'immagine o del testo'
        });
      }

      // PIPELINE COMPLETA
      const result = await this.executeFullPipeline(input, {
        user_id,
        language,
        subject_hint,
        privacy_opt_in,
        timestamp: new Date().toISOString()
      });

      // Calcola metriche
      const processingTime = Date.now() - startTime;
      result.metrics = {
        processing_time_ms: processingTime,
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Errore in processInput:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        suggestion: this.getErrorSuggestion(error.message)
      });
    }
  }

  // PIPELINE COMPLETA
  async executeFullPipeline(input, metadata) {
    // FASE A: PREPROCESSING
    console.log('🔄 Fase A: Preprocessing...');
    const extractedData = await this.aiExtractor.preprocessInput(input);
    
    // FASE B: COMPRENSIONE E CLASSIFICAZIONE
    console.log('🧠 Fase B: Analisi e classificazione...');
    const analyzedContent = await this.aiExtractor.analyzeContent(extractedData);
    
    // Applica subject_hint se fornito
    if (metadata.subject_hint) {
      analyzedContent.classification.materia = this.parseSubjectHint(metadata.subject_hint);
    }
    
    // FASE C: GENERAZIONE CONTENUTI
    console.log('📝 Fase C: Generazione quiz e flashcards...');
    
    let generatedContent;
    
    // Prova prima con OpenAI se disponibile
    if (openaiService.isAvailable) {
      console.log('🤖 Usando OpenAI per generazione contenuti...');
      try {
        const aiResult = await openaiService.generateQuizAndFlashcards(
          extractedData.extractedText, 
          analyzedContent.classification.materia
        );
        
        generatedContent = {
          flashcards: aiResult.content.flashcards,
          quiz: aiResult.content.quiz
        };
        
        // Aggiorna anche la soluzione esercizi se disponibile
        if (aiResult.exercise_solution.hasExercise) {
          analyzedContent.exerciseSolution = aiResult.exercise_solution;
        }
        
        console.log('✅ Contenuti generati con OpenAI');
        
        // SALVATAGGIO AUTOMATICO NEI "MIEI QUIZ"
        if (metadata.user_id && (aiResult.content.quiz.length > 0 || aiResult.content.flashcards.length > 0)) {
          console.log('💾 Salvataggio automatico nei "Miei Quiz"...');
          
          const contentToSave = {
            classification: analyzedContent.classification,
            content: {
              quiz: aiResult.content.quiz,
              flashcards: aiResult.content.flashcards
            },
            quality: aiResult.quality || { overall_score: 75 },
            metadata: {
              source_reference: input.metadata.originalName || 'text_input',
              generated_at: new Date().toISOString(),
              ai_generated: true
            }
          };
          
          // Salva quiz se presenti
          if (aiResult.content.quiz.length > 0) {
            try {
              const quizSaveResult = await this.userStorage.saveUserQuiz(metadata.user_id, contentToSave);
              console.log('✅ Quiz salvato:', quizSaveResult.quiz_id);
            } catch (error) {
              console.warn('⚠️ Errore salvataggio quiz:', error.message);
            }
          }
          
          // Salva flashcards se presenti
          if (aiResult.content.flashcards.length > 0) {
            try {
              const flashcardsSaveResult = await this.userStorage.saveUserFlashcards(metadata.user_id, contentToSave);
              console.log('✅ Flashcards salvate:', flashcardsSaveResult.flashcards_id);
            } catch (error) {
              console.warn('⚠️ Errore salvataggio flashcards:', error.message);
            }
          }
        }
        
      } catch (error) {
        console.warn('⚠️ Fallback al generatore locale:', error.message);
        // Fallback al sistema locale
        const flashcards = await this.contentGenerator.generateFlashcards(analyzedContent);
        const quiz = await this.contentGenerator.generateQuiz(analyzedContent);
        generatedContent = { flashcards, quiz };
      }
    } else {
      // Sistema locale
      console.log('🔧 Usando generatore locale...');
      const flashcards = await this.contentGenerator.generateFlashcards(analyzedContent);
      const quiz = await this.contentGenerator.generateQuiz(analyzedContent);
      generatedContent = { flashcards, quiz };
    }
    
    // FASE D: VALIDAZIONE
    console.log('✅ Fase D: Validazione qualità...');
    const validation = await this.validator.validateContent(generatedContent);
    
    // Filtra contenuti non validi se quality score troppo basso
    const filteredContent = this.filterLowQualityContent(generatedContent, validation);
    
    // RISULTATO FINALE
    return {
      metadata: {
        ...metadata,
        source_reference: input.metadata.originalName || 'text_input',
        safety_status: validation.overallQuality >= 70 ? 'clean' : 'needs_review'
      },
      extracted_data: {
        text: extractedData.extractedText,
        confidence: extractedData.confidence,
        has_formulas: extractedData.hasFormulas,
        has_diagrams: extractedData.hasDiagrams
      },
      classification: analyzedContent.classification,
      exercise_solution: analyzedContent.exerciseSolution || null,
      ml_analysis: analyzedContent.mlAnalysis || null,
      adaptive_content: analyzedContent.adaptiveContent || null,
      content: {
        flashcards: filteredContent.flashcards,
        quiz: filteredContent.quiz,
        summary: analyzedContent.classification.sintesi
      },
      quality: {
        overall_score: validation.overallQuality,
        flashcard_count: filteredContent.flashcards.length,
        quiz_count: filteredContent.quiz.length,
        needs_review: validation.overallQuality < 70,
        issues: validation.issues,
        recommendations: validation.recommendations
      },
      links: {
        related_concepts: this.generateRelatedConcepts(analyzedContent.classification)
      }
    };
  }

  // FILTRA CONTENUTI DI BASSA QUALITÀ
  filterLowQualityContent(content, validation) {
    const validFlashcards = content.flashcards.filter((flashcard, index) => {
      const flashcardValidation = validation.flashcards[index];
      return flashcardValidation && flashcardValidation.isValid;
    });

    const validQuiz = content.quiz.filter((question, index) => {
      const quizValidation = validation.quiz[index];
      return quizValidation && quizValidation.isValid;
    });

    return {
      flashcards: validFlashcards,
      quiz: validQuiz
    };
  }

  // GENERA CONCETTI CORRELATI
  generateRelatedConcepts(classification) {
    const relatedConcepts = [];
    
    // Basato sulla materia
    const subjectConcepts = {
      'italiano': ['letteratura italiana', 'analisi del testo', 'storia letteraria'],
      'storia': ['cronologia', 'cause ed effetti', 'personaggi storici'],
      'filosofia': ['correnti filosofiche', 'pensatori', 'concetti etici'],
      'fisica': ['leggi fisiche', 'esperimenti', 'applicazioni pratiche'],
      'matematica': ['teoremi', 'dimostrazioni', 'problemi applicati']
    };
    
    const concepts = subjectConcepts[classification.materia] || ['approfondimenti', 'esercizi', 'teoria'];
    
    concepts.forEach(concept => {
      relatedConcepts.push({
        title: concept,
        subject: classification.materia,
        difficulty: classification.difficolta
      });
    });
    
    return relatedConcepts.slice(0, 6);
  }

  // ENDPOINT: ANTEPRIMA
  async getPreview(req, res) {
    try {
      const { session_id } = req.params;
      
      // In un'implementazione reale, recupereresti dalla cache/database
      // Per ora restituiamo un esempio
      res.json({
        success: true,
        preview: {
          title: 'Magnetismo — appunti pagina 45',
          subject: 'Fisica',
          topic: 'Elettromagnetismo',
          flashcard_count: 15,
          quiz_count: 25,
          quality_score: 87,
          sample_flashcards: [
            {
              front: 'Definisci flusso magnetico',
              back: 'Il flusso magnetico è la misura del campo magnetico che attraversa una superficie'
            }
          ],
          sample_quiz: [
            {
              question: 'Quale legge descrive l\'induzione elettromagnetica?',
              options: ['Legge di Faraday', 'Legge di Ohm', 'Legge di Coulomb', 'Legge di Ampère'],
              correct: 0
            }
          ]
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // NUOVO: GENERA QUIZ UNIVERSITARI
  async generateUniversityQuiz(req, res) {
    try {
      const { topic, subject, difficulty = 'avanzato', user_id } = req.body;
      
      if (!topic || !subject || !user_id) {
        return res.status(400).json({
          success: false,
          error: 'topic, subject e user_id sono richiesti'
        });
      }
      
      console.log(`🎓 Generazione quiz universitario: ${topic} (${subject})`);
      
      const quiz = await openaiService.generateUniversityQuiz(topic, subject, difficulty);
      
      res.json({
        success: true,
        data: {
          quiz: quiz.quiz || [],
          metadata: {
            topic,
            subject,
            difficulty,
            generated_at: new Date().toISOString(),
            type: 'university_quiz'
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Errore generazione quiz universitario:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // NUOVO: GENERA FLASHCARDS UNIVERSITARIE  
  async generateUniversityFlashcards(req, res) {
    try {
      const { topic, subject, user_id } = req.body;
      
      if (!topic || !subject || !user_id) {
        return res.status(400).json({
          success: false,
          error: 'topic, subject e user_id sono richiesti'
        });
      }
      
      console.log(`🎓 Generazione flashcards universitarie: ${topic} (${subject})`);
      
      const flashcards = await openaiService.generateUniversityFlashcards(topic, subject);
      
      res.json({
        success: true,
        data: {
          flashcards: flashcards.flashcards || [],
          metadata: {
            topic,
            subject,
            generated_at: new Date().toISOString(),
            type: 'university_flashcards'
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Errore generazione flashcards universitarie:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // ENDPOINT: SALVA NEL PROFILO UTENTE
  async saveToProfile(req, res) {
    try {
      const { user_id, content_data, action } = req.body;
      
      if (!user_id || !content_data || !action) {
        return res.status(400).json({
          success: false,
          error: 'user_id, content_data e action sono richiesti'
        });
      }

      let result;
      
      if (action === 'save_quiz') {
        result = await this.userStorage.saveUserQuiz(user_id, content_data);
      } else if (action === 'save_flashcards') {
        result = await this.userStorage.saveUserFlashcards(user_id, content_data);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Azione non valida. Usa save_quiz o save_flashcards'
        });
      }

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          id: result.quiz_id || result.flashcards_id,
          saved_to: {
            my_quizzes: action === 'save_quiz',
            my_flashcards: action === 'save_flashcards'
          }
        });
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // ENDPOINT: RIGENERA CON PARAMETRI DIVERSI
  async regenerateContent(req, res) {
    try {
      const {
        session_id,
        parameters = {}
      } = req.body;

      const {
        more_flashcards = false,
        fewer_flashcards = false,
        only_flashcards = false,
        only_quiz = false,
        difficulty_adjustment = 0
      } = parameters;

      // Qui implementeresti la rigenerazione
      // Per ora restituiamo un messaggio di successo
      
      res.json({
        success: true,
        message: 'Rigenerazione avviata con nuovi parametri',
        new_session_id: `regen_${Date.now()}`,
        parameters_applied: parameters
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // UTILITY METHODS
  parseSubjectHint(hint) {
    const hintLower = hint.toLowerCase();
    
    const subjectMap = {
      'fisica': 'fisica',
      'matematica': 'matematica',
      'italiano': 'italiano',
      'storia': 'storia',
      'filosofia': 'filosofia',
      'scienze': 'scienze',
      'latino': 'latino',
      'arte': 'arte',
      'inglese': 'inglese',
      'religione': 'religione'
    };
    
    for (const [key, value] of Object.entries(subjectMap)) {
      if (hintLower.includes(key)) {
        return value;
      }
    }
    
    return 'generale';
  }

  getErrorSuggestion(errorMessage) {
    if (errorMessage.includes('sfocata') || errorMessage.includes('leggibile')) {
      return 'Prova a scansionare meglio l\'immagine o caricare una foto più nitida.';
    }
    
    if (errorMessage.includes('formato')) {
      return 'Usa solo file JPEG o PNG per le immagini.';
    }
    
    if (errorMessage.includes('dimensione')) {
      return 'Il file è troppo grande. Massimo 10MB.';
    }
    
    return 'Riprova o contatta il supporto se il problema persiste.';
  }

  // MIDDLEWARE PER UPLOAD
  getUploadMiddleware() {
    return this.upload.single('image');
  }
}

module.exports = AIEstraiCreaController;
