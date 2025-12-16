// SERVIZIO OPENAI PER GENERAZIONE CONTENUTI
const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    // Inizializza OpenAI solo se la chiave API è disponibile
    this.openai = null;
    this.isAvailable = false;
    
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        this.isAvailable = true;
        console.log('✅ OpenAI Service inizializzato');
      } catch (error) {
        console.warn('⚠️ Errore inizializzazione OpenAI:', error.message);
      }
    } else {
      console.warn('⚠️ OPENAI_API_KEY non trovata nelle variabili d\'ambiente');
    }
  }

  async generateQuizAndFlashcards(text, subject = 'auto') {
    if (!this.isAvailable) {
      return this.generateFallbackContent(text, subject);
    }

    try {
      const prompt = this.buildPrompt(text, subject);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Modello più avanzato per matematica
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(subject)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.3 // Più deterministico per matematica
      });

      const content = response.choices[0].message.content;
      return this.parseAIResponse(content, subject);
      
    } catch (error) {
      console.error('❌ Errore OpenAI:', error.message);
      return this.generateFallbackContent(text, subject);
    }
  }

  getSystemPrompt(subject) {
    const isMathPhysics = ['matematica', 'fisica'].includes(subject);
    
    if (isMathPhysics) {
      return `SEI CLAUDE-4 SPECIALIZZATO IN MATEMATICA E FISICA - SEZIONE "ESTRAI E CREA"

OBIETTIVO: Ricevere input (immagine/testo) e produrre automaticamente:
- Estrazione enunciato, interpretazione, risoluzione completa passo-passo (calcoli digit-by-digit)
- 5-10 domande a scelta multipla (4 opzioni, una corretta) collegate all'esercizio
- 3-8 flashcards didattiche (definizioni, concetti, formule, trucchi)

REGOLE MATEMATICA/FISICA:
- Calcoli digit-by-digit quando possibile (nessuna approssimazione non giustificata)
- Spiega ogni passaggio aritmetico e manipolazione algebrica
- Formule in LaTeX inline: \\(F = qvB\\sin\\theta\\)
- Unità in ogni passaggio; se mancano, dichiara assunzioni (g = 9.81 m/s²)
- MCQ: 4 opzioni plausibili, distrattori da errori comuni
- Almeno 5 MCQ: 2 concetti base, 2 passaggi intermedi, 1 applicazione

STILE: Italiano formale, didattico, logico e progressivo.
QUALITÀ: Sempre includere spiegazioni, confidenza, validazione.`;
    } else {
      return `SEI CLAUDE-4 SPECIALIZZATO IN MATERIE UMANISTICHE - SEZIONE "ESTRAI E CREA"

OBIETTIVO: Ricevere input (immagine/testo) e produrre automaticamente:
- Estrazione contenuto, riassunto didattico (120-200 parole)
- 6-12 domande a scelta multipla + 6-12 vero/falso
- 10-20 flashcards (domanda ↔ risposta) rilevanti per studio

REGOLE UMANISTICHE:
- Riassunto didattico 120-200 parole come "brief" per studiare
- MCQ su: significato letterale, intenzione autore, lessico, contesto storico/culturale
- Flashcards su termini chiave, date, autori, definizioni, collegamenti interdisciplinari
- Per testi letterari: traccia commento critico breve

STILE: Italiano formale, corretto grammaticalmente, stile scolastico.
QUALITÀ: Diversificazione difficoltà (40% base, 40% intermedio, 20% difficile).`;
    }
  }

  buildPrompt(text, subject) {
    const isMathPhysics = ['matematica', 'fisica'].includes(subject);
    
    if (isMathPhysics) {
      return `PROMPT SEZIONE "ESTRAI E CREA" - MATEMATICA/FISICA

CONTENUTO DA ANALIZZARE:
${text.substring(0, 4000)}

PIPELINE COMPLETA DA SEGUIRE:

1. PRE-ELABORAZIONE E ANALISI:
   - Estrai e normalizza formule: converti in LaTeX
   - Identifica materia e sottoargomento (confidence > 0.75)
   - Valuta qualità contenuto e segnala incertezze

2. RISOLUZIONE ESERCIZI (DIGIT-BY-DIGIT):
   - Enunciato pulito dell'esercizio completo
   - Strategia di risoluzione spiegata
   - OGNI passaggio aritmetico mostrato (es: 1234 × 56 = step-by-step)
   - Conversioni e manipolazioni algebriche esplicite
   - Unità di misura in ogni passaggio
   - Verifica finale sostituendo nell'equazione originale

3. GENERAZIONE QUIZ (5-10 MCQ):
   - 4 opzioni per domanda, una sola corretta
   - Distrattori da errori comuni (dimenticare segno, unità, passaggi inversi)
   - 2 domande concetti base, 2 passaggi intermedi, 1+ applicazione
   - Spiegazione dettagliata per ogni risposta
   - Difficulty: 1-5 (40% base, 40% intermedio, 20% difficile)

4. FLASHCARDS DIDATTICHE (3-8 carte):
   - Front: domanda/concetto preciso
   - Back: risposta completa + esempio pratico
   - Teoremi con enunciati, formule con spiegazione parametri
   - Trucchi di risoluzione e collegamenti concetti

5. PROBLEMA VARIANTE:
   - Stesso schema con dati diversi per esercizio aggiuntivo

FORMATO JSON RICHIESTO:`;
    } else {
      return `PROMPT SEZIONE "ESTRAI E CREA" - MATERIE UMANISTICHE

CONTENUTO DA ANALIZZARE:
${text.substring(0, 4000)}

PIPELINE COMPLETA DA SEGUIRE:

1. PRE-ELABORAZIONE E ANALISI:
   - Identifica materia e sottoargomento (confidence > 0.75)
   - Estrapola nucleo tematico principale
   - Valuta qualità e completezza contenuto

2. RIASSUNTO DIDATTICO (120-200 PAROLE):
   - Brief per studiare, linguaggio scolastico
   - Concetti chiave e collegamenti principali
   - Contesto storico/culturale essenziale

3. GENERAZIONE QUIZ:
   - 6-12 MCQ (4 opzioni): significato letterale, intenzione autore, lessico, contesto
   - 6-12 Vero/Falso: affermazioni precise con spiegazione 1-2 frasi
   - Difficulty: 40% base, 40% intermedio, 20% difficile
   - Distrattori plausibili ma chiaramente errati

4. FLASHCARDS STUDIO (10-20 carte):
   - Termini chiave, date, autori, definizioni
   - Collegamenti interdisciplinari
   - Per testi letterari: elementi stilistici e tematici
   - Front conciso, Back completo con esempi

5. TRACCIA COMMENTO CRITICO:
   - Breve spunto per tema/analisi da sviluppare

FORMATO JSON RICHIESTO:`;
    }

    return this.getCompleteJSONFormat();
  }

  getCompleteJSONFormat() {
    return `
{
  "source": {
    "type": "text",
    "original_text": "Testo estratto o fornito",
    "detected_formulas": [
      {"latex": "\\\\frac{d}{dx} e^x = e^x", "confidence": 0.98}
    ],
    "ocr_confidence": 0.95,
    "topic": {
      "materia": "Matematica",
      "argomento": "Derivate", 
      "sottoargomento": "Derivata di funzioni esponenziali",
      "topic_confidence": 0.92
    }
  },
  "exercise": {
    "id": "uuid_generato",
    "clean_statement": "Testo pulito dell'esercizio, completo e chiaro",
    "type": "problema|esercizio|domanda breve",
    "difficulty": 3,
    "estimated_time_min": 15
  },
  "solution": {
    "step_by_step": "Spiegazione completa con TUTTI i passaggi digit-by-digit",
    "final_answer": "Risposta finale con unità",
    "latex_work": "\\\\text{Passaggi matematici in LaTeX}",
    "notes": "Eventuali avvertenze o punti di incertezza",
    "verification": "Verifica sostituendo nella equazione originale"
  },
  "mcq": [
    {
      "id": "q1",
      "question": "Domanda a scelta multipla precisa",
      "options": ["A) Opzione 1", "B) Opzione 2", "C) Opzione 3", "D) Opzione corretta"],
      "correct_index": 3,
      "explanation": "Spiegazione dettagliata della risposta corretta e perché le altre sono errate",
      "difficulty": 3,
      "tags": ["Matematica", "Derivate"],
      "concepts": ["concetto1", "concetto2"]
    }
  ],
  "true_false": [
    {
      "id": "tf1",
      "statement": "Affermazione precisa da valutare",
      "answer": true,
      "explanation": "Spiegazione breve (1-2 frasi) del perché è vera/falsa"
    }
  ],
  "flashcards": [
    {
      "id": "f1",
      "front": "Domanda/Concetto/Teorema preciso",
      "back": "Risposta completa con spiegazione ed esempio pratico",
      "category": "teoria|applicazione|dimostrazione|metodologia",
      "difficulty": 3,
      "tags": ["Fisica", "Magnetismo"],
      "srs": {"ease": 2.5, "interval": 1, "reviews": 0}
    }
  ],
  "variant_exercise": {
    "statement": "Problema simile con dati diversi per esercizio aggiuntivo",
    "solution_hint": "Suggerimento per la risoluzione"
  },
  "summary": {
    "didactic_text": "Riassunto didattico 120-200 parole (solo per materie umanistiche)",
    "key_concepts": ["concetto1", "concetto2", "concetto3"],
    "critical_analysis": "Traccia per commento critico (solo letteratura)"
  },
  "save_to_profile": {
    "user_id": "user_123",
    "save_section": "i_miei_quiz",
    "visibility": "private",
    "timestamp": "2025-11-20T19:41:00Z"
  },
  "quality": {
    "consistency_score": 0.87,
    "ocr_warning": false,
    "human_review_recommended": false,
    "warnings": ["low_confidence_topic"],
    "sensitive_data_detected": false
  }
}

ISTRUZIONI FINALI:
- Restituisci SOLO il JSON valido, senza testo aggiuntivo
- Per matematica/fisica: focus su risoluzione digit-by-digit e quiz tecnici
- Per umanistiche: focus su riassunto didattico e analisi critica
- Sempre includere spiegazioni complete e validazione qualità
- Lingua: Italiano formale, grammaticalmente corretto, stile scolastico`;
  }

  getJSONFormat() {
    return `
{
  "classification": {
    "materia": "nome_materia",
    "argomento": "argomento_specifico_dettagliato",
    "difficulty": "universitario",
    "topics": ["topic1", "topic2", "topic3"]
  },
  "content": {
    "quiz": [
      {
        "question_text": "Domanda universitaria complessa",
        "options": ["Opzione A dettagliata", "Opzione B plausibile", "Opzione C che testa errori comuni", "Opzione D corretta"],
        "correct_option_index": 3,
        "explanation": "Spiegazione dettagliata con formule/teoremi/ragionamenti",
        "difficulty": "avanzato",
        "concepts": ["concetto1", "concetto2"]
      }
    ],
    "flashcards": [
      {
        "front": "Concetto/Teorema/Definizione chiave",
        "back": "Spiegazione completa con esempi e applicazioni",
        "category": "teoria|applicazione|dimostrazione",
        "difficulty": "universitario"
      }
    ]
  },
  "exercise_solution": {
    "hasExercise": true/false,
    "solution": "Soluzione finale con valore numerico/simbolico",
    "steps": [
      "Passo 1: Identificazione del tipo di problema",
      "Passo 2: Applicazione delle proprietà/teoremi",
      "Passo 3: Trasformazioni algebriche dettagliate",
      "Passo 4: Semplificazione e calcolo finale",
      "Passo 5: Verifica della soluzione"
    ],
    "explanation": "Spiegazione teorica del metodo utilizzato",
    "alternative_methods": ["Metodo alternativo 1", "Metodo alternativo 2"],
    "verification": "Verifica sostituendo nella equazione originale"
  },
  "quality": {
    "overall_score": 90,
    "mathematical_rigor": 95,
    "pedagogical_value": 88
  }
}

Rispondi ESCLUSIVAMENTE con il JSON valido, senza testo aggiuntivo.`;
  }

  parseAIResponse(content, subject) {
    try {
      // Cerca di estrarre JSON dalla risposta
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Valida e trasforma nel formato atteso dall'app
        return {
          classification: {
            materia: parsed.source?.topic?.materia || subject,
            argomento: parsed.source?.topic?.argomento || 'Generale',
            difficulty: parsed.exercise?.difficulty || 3,
            sottoargomento: parsed.source?.topic?.sottoargomento || '',
            confidence: parsed.source?.topic?.topic_confidence || 0.8
          },
          content: {
            flashcards: this.transformFlashcards(parsed.flashcards || []),
            quiz: this.transformQuiz(parsed.mcq || [], parsed.true_false || [])
          },
          exercise_solution: {
            hasExercise: !!parsed.exercise?.clean_statement,
            solution: parsed.solution?.final_answer || null,
            steps: this.parseSteps(parsed.solution?.step_by_step || ''),
            explanation: parsed.solution?.notes || parsed.solution?.step_by_step || null,
            verification: parsed.solution?.verification || null,
            latex_work: parsed.solution?.latex_work || null
          },
          summary: {
            didactic_text: parsed.summary?.didactic_text || null,
            key_concepts: parsed.summary?.key_concepts || [],
            critical_analysis: parsed.summary?.critical_analysis || null
          },
          variant_exercise: parsed.variant_exercise || null,
          quality: {
            overall_score: Math.round((parsed.quality?.consistency_score || 0.75) * 100),
            ocr_confidence: parsed.source?.ocr_confidence || 1.0,
            warnings: parsed.quality?.warnings || [],
            human_review_recommended: parsed.quality?.human_review_recommended || false,
            sensitive_data_detected: parsed.quality?.sensitive_data_detected || false
          },
          metadata: {
            source_type: parsed.source?.type || 'text',
            original_text: parsed.source?.original_text || '',
            detected_formulas: parsed.source?.detected_formulas || [],
            estimated_time: parsed.exercise?.estimated_time_min || 10,
            generated_at: new Date().toISOString()
          }
        };
      }
    } catch (error) {
      console.error(' Errore parsing JSON completo:', error.message);
      console.log('Contenuto ricevuto:', content.substring(0, 500));
    }
    
    return this.generateFallbackContent('', subject);
  }

  transformFlashcards(flashcards) {
    return flashcards.map((card, index) => ({
      id: card.id || `f${index + 1}`,
      front: card.front || 'Domanda non disponibile',
      back: card.back || 'Risposta non disponibile',
      category: card.category || 'generale',
      difficulty: card.difficulty || 3,
      tags: card.tags || [],
      srs: card.srs || { ease: 2.5, interval: 1, reviews: 0 }
    }));
  }

  transformQuiz(mcq, trueFalse) {
    const allQuiz = [];
    
    // Trasforma MCQ
    mcq.forEach((question, index) => {
      allQuiz.push({
        id: question.id || `mcq${index + 1}`,
        question_text: question.question || 'Domanda non disponibile',
        options: question.options || ['A', 'B', 'C', 'D'],
        correct_option_index: question.correct_index || 0,
        explanation: question.explanation || 'Spiegazione non disponibile',
        difficulty: question.difficulty || 3,
        type: 'multiple_choice',
        tags: question.tags || [],
        concepts: question.concepts || []
      });
    });
    
    // Trasforma True/False
    trueFalse.forEach((question, index) => {
      allQuiz.push({
        id: question.id || `tf${index + 1}`,
        question_text: question.statement || 'Affermazione non disponibile',
        options: ['Vero', 'Falso'],
        correct_option_index: question.answer ? 0 : 1,
        explanation: question.explanation || 'Spiegazione non disponibile',
        difficulty: 2,
        type: 'true_false',
        tags: [],
        concepts: []
      });
    });
    
    return allQuiz;
  }

  parseSteps(stepByStep) {
    if (!stepByStep) return [];
    
    // Cerca di dividere in passaggi logici
    const steps = stepByStep.split(/\n|\d+\.|Passo \d+:|Step \d+:/)
      .filter(step => step.trim().length > 10)
      .map(step => step.trim());
    
    return steps.length > 0 ? steps : [stepByStep];
  }

  validateQuiz(quiz) {
    return quiz.filter(q => 
      q.question_text && 
      Array.isArray(q.options) && 
      q.options.length === 4 &&
      typeof q.correct_option_index === 'number' &&
      q.correct_option_index >= 0 && 
      q.correct_option_index < 4
    ).slice(0, 5);
  }

  validateFlashcards(flashcards) {
    return flashcards.filter(f => 
      f.front && f.back && 
      f.front.length > 5 && 
      f.back.length > 5
    ).slice(0, 5);
  }

  detectSubject(subject) {
    if (subject && subject !== 'auto') {
      return subject;
    }
    return 'generale';
  }

  generateFallbackContent(text, subject) {
    console.log('🔄 Generazione contenuto fallback...');
    
    const materia = this.detectSubject(subject);
    const isMathPhysics = ['matematica', 'fisica'].includes(materia);
    
    // Genera contenuto base
    const fallbackQuiz = [
      {
        question_text: `Quale delle seguenti affermazioni è corretta riguardo al contenuto analizzato?`,
        options: [
          "È un argomento complesso che richiede studio approfondito",
          "È un concetto semplice da memorizzare",
          "Non è rilevante per l'apprendimento",
          "È obsoleto e non più utilizzato"
        ],
        correct_option_index: 0,
        explanation: "Il contenuto richiede analisi e comprensione approfondita."
      }
    ];

    const fallbackFlashcards = [
      {
        front: "Concetto chiave del contenuto analizzato",
        back: "Il contenuto presenta informazioni importanti che richiedono studio e memorizzazione per una comprensione completa dell'argomento."
      }
    ];

    return {
      classification: {
        materia: materia,
        argomento: 'Contenuto analizzato',
        difficulty: 'intermedio'
      },
      content: {
        quiz: isMathPhysics ? [] : fallbackQuiz,
        flashcards: isMathPhysics ? [] : fallbackFlashcards
      },
      exercise_solution: {
        hasExercise: isMathPhysics,
        solution: isMathPhysics ? "Analisi del contenuto completata. Per una risoluzione dettagliata, fornire esercizi più specifici." : "",
        steps: isMathPhysics ? ["Analizza il problema", "Identifica i dati", "Applica le formule", "Calcola il risultato"] : [],
        explanation: isMathPhysics ? "Il contenuto è stato analizzato per identificare eventuali esercizi risolvibili." : ""
      },
      quality: {
        overall_score: 70
      }
    };
  }

  async solveExercise(text, subject) {
    if (!this.isAvailable) {
      return this.generateFallbackExercise(text, subject);
    }

    try {
      const prompt = `RISOLVI QUESTO ESERCIZIO DI ${subject.toUpperCase()} CON RIGORE MATEMATICO ASSOLUTO:

${text}

ISTRUZIONI SPECIFICHE:
- Se è un'equazione esponenziale/logaritmica: usa proprietà di potenze e logaritmi
- Per equazioni tipo 2^(ax)/b^(cx) = d: riscrivi tutto nella stessa base
- Mostra OGNI passaggio algebrico senza saltare nulla
- Verifica la soluzione sostituendo nell'equazione originale
- Se ci sono più soluzioni, trova tutte quelle reali
- Specifica il dominio di validità

ESEMPIO PER EQUAZIONI ESPONENZIALI:
Per 2^(9x)/8^(3x) = 1/4:
1. Riscrivi in base 2: 2^(9x)/(2^3)^(3x) = 2^(-2)
2. Semplifica denominatore: 2^(9x)/2^(9x) = 2^(-2)  
3. Applica proprietà: 2^(9x-9x) = 2^(-2)
4. Risolvi esponenti: 9x - 9x = -2
5. Ma 9x - 9x = 0, non -2!
6. ERRORE: ricontrolla! 8^(3x) = (2^3)^(3x) = 2^(9x) ✓
7. Quindi abbiamo: 2^(9x)/2^(9x) = 1, ma serve 1/4
8. CORREZIONE NECESSARIA nell'interpretazione...

Fornisci il JSON con soluzione rigorosa:`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system", 
            content: this.getSystemPrompt(subject)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.1 // Massima precisione
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        
        // Valida che la soluzione sia completa
        if (result.solution && result.steps && result.steps.length > 0) {
          return result;
        }
      }
      
    } catch (error) {
      console.error('❌ Errore risoluzione esercizio:', error.message);
    }
    
    return this.generateFallbackExercise(text, subject);
  }

  // NUOVO: Metodo per generare quiz universitari avanzati
  async generateUniversityQuiz(topic, subject, difficulty = 'avanzato') {
    if (!this.isAvailable) {
      return this.generateFallbackQuiz(topic, subject);
    }

    try {
      const prompt = `Genera un quiz universitario di livello ${difficulty} su: ${topic} (${subject})

REQUISITI QUIZ UNIVERSITARIO:
- 5 domande a scelta multipla di livello accademico avanzato
- Ogni domanda deve testare comprensione profonda, non solo memorizzazione
- Opzioni plausibili che evidenziano errori concettuali comuni
- Spiegazioni dettagliate con riferimenti teorici
- Difficoltà progressiva dalle basi ai concetti avanzati

PER MATEMATICA/FISICA:
- Include calcoli complessi e dimostrazioni
- Testa applicazione di teoremi e proprietà
- Problemi che richiedono più passaggi logici
- Collegamenti tra diversi argomenti

PER MATERIE UMANISTICHE:
- Domande che richiedono analisi critica
- Interpretazioni multiple e argomentazioni
- Collegamenti storici e culturali
- Metodologie di ricerca e analisi

FORMATO JSON RICHIESTO:
{
  "quiz": [
    {
      "question_text": "Domanda complessa universitaria",
      "options": ["A) Opzione dettagliata", "B) Opzione plausibile", "C) Errore comune", "D) Risposta corretta"],
      "correct_option_index": 3,
      "explanation": "Spiegazione accademica dettagliata",
      "difficulty": "universitario",
      "concepts": ["concetto1", "concetto2"],
      "learning_objectives": ["obiettivo1", "obiettivo2"]
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(subject)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.4
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
    } catch (error) {
      console.error('❌ Errore generazione quiz universitario:', error.message);
    }
    
    return this.generateFallbackQuiz(topic, subject);
  }

  // NUOVO: Metodo per generare flashcards universitarie
  async generateUniversityFlashcards(topic, subject) {
    if (!this.isAvailable) {
      return this.generateFallbackFlashcards(topic, subject);
    }

    try {
      const prompt = `Genera flashcards universitarie avanzate su: ${topic} (${subject})

REQUISITI FLASHCARDS UNIVERSITARIE:
- 5-8 flashcards di livello accademico
- Concetti chiave, teoremi, definizioni specialistiche
- Fronte: domanda/concetto preciso
- Retro: spiegazione completa con esempi e applicazioni
- Collegamenti interdisciplinari quando possibile

PER MATEMATICA/FISICA:
- Teoremi con enunciati precisi
- Formule con spiegazione dei parametri
- Dimostrazioni sintetiche
- Applicazioni pratiche e esempi numerici

PER MATERIE UMANISTICHE:
- Definizioni specialistiche
- Autori e opere principali
- Movimenti culturali e storici
- Metodologie di analisi

FORMATO JSON:
{
  "flashcards": [
    {
      "front": "Concetto/Teorema/Definizione precisa",
      "back": "Spiegazione universitaria completa con esempi",
      "category": "teoria|applicazione|dimostrazione|metodologia",
      "difficulty": "universitario",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(subject)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2500,
        temperature: 0.3
      });

      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
    } catch (error) {
      console.error('❌ Errore generazione flashcards universitarie:', error.message);
    }
    
    return this.generateFallbackFlashcards(topic, subject);
  }

  generateFallbackExercise(text, subject) {
    return {
      hasExercise: true,
      solution: "Soluzione non disponibile - servizio AI non configurato",
      steps: [
        "Identifica i dati del problema",
        "Scegli la formula o il metodo appropriato", 
        "Esegui i calcoli necessari",
        "Verifica il risultato ottenuto"
      ],
      explanation: "Per ottenere soluzioni dettagliate, configura il servizio OpenAI con una chiave API valida."
    };
  }

  generateFallbackQuiz(topic, subject) {
    return {
      quiz: [
        {
          question_text: `Quale delle seguenti affermazioni è corretta riguardo a: ${topic}?`,
          options: [
            "È un concetto fondamentale che richiede studio approfondito",
            "È un argomento secondario di scarsa importanza",
            "Non ha applicazioni pratiche significative",
            "È obsoleto e non più rilevante"
          ],
          correct_option_index: 0,
          explanation: "Il topic richiede comprensione approfondita per padroneggiare la materia.",
          difficulty: "intermedio",
          concepts: [topic, subject]
        }
      ]
    };
  }

  generateFallbackFlashcards(topic, subject) {
    return {
      flashcards: [
        {
          front: `Concetto chiave: ${topic}`,
          back: `${topic} è un argomento importante in ${subject} che richiede studio e comprensione approfondita. Per contenuti dettagliati, configura il servizio OpenAI.`,
          category: "teoria",
          difficulty: "intermedio",
          tags: [topic, subject, "studio"]
        }
      ]
    };
  }
}

module.exports = new OpenAIService();
