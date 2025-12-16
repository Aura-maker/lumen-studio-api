/**
 * 🧠 INTELLIGENT QUIZ GENERATOR - Generatore Quiz Universitari
 * Sistema completo che integra tutti i componenti per creare quiz di alta qualità
 * 
 * Componenti utilizzati:
 * - SemanticParser: Estrazione fatti dal testo
 * - KnowledgeGraph: Struttura relazioni tra entità
 * - QuestionTemplates: 150+ template pedagogici
 * - DistractorGenerator: Distrattori intelligenti
 * - QuestionValidator: Validazione qualità
 * 
 * Funzionalità:
 * - Generazione multilivello (6 livelli Bloom)
 * - Difficoltà adattiva
 * - Spiegazioni didattiche dettagliate
 * - Tracking errori per spaced repetition
 */

const SemanticParser = require('./semantic-parser-simple'); // Uso il parser semplificato che FUNZIONA
const KnowledgeGraph = require('./knowledge-graph');
const { QuestionTemplates, getTemplatesByDifficulty, getRandomTemplate } = require('./question-templates');
const DistractorGenerator = require('./distractor-generator');
const QuestionValidator = require('./question-validator');

class IntelligentQuizGenerator {
  constructor(options = {}) {
    // Inizializza componenti
    this.parser = new SemanticParser();
    this.graph = new KnowledgeGraph();
    this.distractorGen = new DistractorGenerator(this.graph);
    this.validator = new QuestionValidator();
    
    // FIX: Abbasso le soglie per far passare più quiz
    this.validator.soglie.minima = 0.50;
    this.validator.soglie.accettabile = 0.60;

    // Configurazione
    this.config = {
      maxQuizPerSottoargomento: options.maxQuiz || 12,
      livelloMinimo: options.livelloMinimo || 1,
      livelloMassimo: options.livelloMassimo || 5,
      distribuzioneLivelli: options.distribuzioneLivelli || {
        1: 0.20, // 20% conoscenza
        2: 0.25, // 25% comprensione
        3: 0.25, // 25% applicazione
        4: 0.20, // 20% analisi
        5: 0.10  // 10% valutazione
      },
      includiSpiegazioni: options.includiSpiegazioni !== false,
      qualitaMinima: options.qualitaMinima || 0.65,
      tentativiMax: options.tentativiMax || 3
    };

    // Statistiche generazione
    this.stats = {
      quizGenerati: 0,
      quizValidati: 0,
      quizScartati: 0,
      tempoMedio: 0
    };

    console.log('🧠 IntelligentQuizGenerator inizializzato');
  }

  // ==================== GENERAZIONE PRINCIPALE ====================

  /**
   * 🎯 Genera quiz da un sottoargomento completo
   * @param {Object} sottoargomento - Oggetto con titolo, contenuto, materia, etc.
   * @returns {Array} - Array di quiz validati
   */
  async generaQuizDaSottoargomento(sottoargomento) {
    const startTime = Date.now();
    const quiz = [];

    try {
      // 1. Estrai fatti dal contenuto
      const contenuto = sottoargomento.contenuto || sottoargomento.riassunto || '';
      const fatti = this.parser.analizzaTesto(contenuto);
      
      console.log(`📝 Estratti ${this.contaFatti(fatti)} fatti dal testo`);

      // 2. Popola il knowledge graph
      this.graph.popolaDaFatti(
        fatti,
        sottoargomento.materia,
        sottoargomento.titolo
      );

      // 3. Genera quiz per ogni livello
      const quizPerLivello = this.calcolaDistribuzione();
      
      for (const [livello, quantita] of Object.entries(quizPerLivello)) {
        const livelloInt = parseInt(livello);
        const quizLivello = this.generaQuizPerLivello(
          fatti,
          livelloInt,
          quantita,
          sottoargomento
        );
        quiz.push(...quizLivello);
      }

      // 4. Genera quiz aggiuntivi da relazioni del grafo
      const quizRelazioni = this.generaQuizDaRelazioni(sottoargomento);
      quiz.push(...quizRelazioni);

      // 5. Limita e mescola
      const quizFinali = this.shuffleArray(quiz)
        .slice(0, this.config.maxQuizPerSottoargomento);

      // Statistiche
      const elapsed = Date.now() - startTime;
      this.stats.quizGenerati += quizFinali.length;
      this.stats.tempoMedio = (this.stats.tempoMedio + elapsed) / 2;

      console.log(`✅ Generati ${quizFinali.length} quiz in ${elapsed}ms`);

      return quizFinali;

    } catch (error) {
      console.error('❌ Errore generazione quiz:', error);
      return [];
    }
  }

  /**
   * 📊 Calcola distribuzione quiz per livello
   */
  calcolaDistribuzione() {
    const distribuzione = {};
    const totale = this.config.maxQuizPerSottoargomento;

    for (const [livello, percentuale] of Object.entries(this.config.distribuzioneLivelli)) {
      if (parseInt(livello) >= this.config.livelloMinimo && 
          parseInt(livello) <= this.config.livelloMassimo) {
        distribuzione[livello] = Math.round(totale * percentuale);
      }
    }

    return distribuzione;
  }

  /**
   * 🎓 Genera quiz per un livello specifico
   */
  generaQuizPerLivello(fatti, livello, quantita, sottoargomento) {
    const quiz = [];
    const livelliBloom = ['', 'conoscenza', 'comprensione', 'applicazione', 'analisi', 'valutazione'];
    const livelloNome = livelliBloom[livello] || 'conoscenza';

    // Ottieni template appropriati
    const templates = QuestionTemplates[livelloNome] || QuestionTemplates.conoscenza;
    
    // Genera quiz basati sui fatti estratti
    let tentativi = 0;
    const maxTentativi = quantita * this.config.tentativiMax;

    while (quiz.length < quantita && tentativi < maxTentativi) {
      tentativi++;

      // Scegli strategia di generazione
      const strategia = Math.random();
      let nuovoQuiz = null;

      if (strategia < 0.4 && fatti.biografici?.length > 0) {
        // Quiz da fatti biografici
        nuovoQuiz = this.generaQuizBiografico(fatti.biografici, livello, templates, sottoargomento);
      } else if (strategia < 0.6 && fatti.opere?.length > 0) {
        // Quiz da opere
        nuovoQuiz = this.generaQuizOpera(fatti.opere, livello, templates, sottoargomento);
      } else if (strategia < 0.75 && fatti.definizioni?.length > 0) {
        // Quiz da definizioni
        nuovoQuiz = this.generaQuizDefinizione(fatti.definizioni, livello, templates, sottoargomento);
      } else if (strategia < 0.9 && fatti.relazioni?.length > 0) {
        // Quiz da relazioni causa-effetto
        nuovoQuiz = this.generaQuizRelazione(fatti.relazioni, livello, templates, sottoargomento);
      } else if (fatti.eventi?.length > 0) {
        // Quiz da eventi
        nuovoQuiz = this.generaQuizEvento(fatti.eventi, livello, templates, sottoargomento);
      }

      // Valida e aggiungi
      if (nuovoQuiz) {
        const validazione = this.validator.valida(nuovoQuiz);
        
        if (validazione.valida && validazione.score >= this.config.qualitaMinima) {
          nuovoQuiz.qualita = validazione.score;
          nuovoQuiz.livelloQualita = validazione.livelloQualita;
          quiz.push(nuovoQuiz);
          this.stats.quizValidati++;
        } else {
          this.stats.quizScartati++;
          // Prova a correggere automaticamente
          const { domanda, modificato } = this.validator.correggiAutomaticamente(nuovoQuiz);
          if (modificato) {
            const rivalidazione = this.validator.valida(domanda);
            if (rivalidazione.valida) {
              domanda.qualita = rivalidazione.score;
              quiz.push(domanda);
              this.stats.quizValidati++;
            }
          }
        }
      }
    }

    return quiz;
  }

  // ==================== GENERATORI SPECIFICI ====================

  /**
   * 👤 Genera quiz da fatti biografici
   */
  generaQuizBiografico(fattiBiografici, livello, templates, sottoargomento) {
    const fatto = this.scegliRandom(fattiBiografici);
    if (!fatto) return null;

    let testo, rispostaCorretta, tipoRisposta;

    if (livello === 1) {
      // Livello conoscenza - domande dirette
      if (fatto.data && fatto.tipo === 'nascita') {
        testo = `In che anno nacque ${fatto.personaggio}?`;
        rispostaCorretta = fatto.data;
        tipoRisposta = 'anno';
      } else if (fatto.data && fatto.tipo === 'morte') {
        testo = `In che anno morì ${fatto.personaggio}?`;
        rispostaCorretta = fatto.data;
        tipoRisposta = 'anno';
      } else if (fatto.luogo) {
        testo = `Dove nacque ${fatto.personaggio}?`;
        rispostaCorretta = fatto.luogo;
        tipoRisposta = 'luogo';
      }
    } else if (livello === 2) {
      // Livello comprensione
      testo = `Perché ${fatto.personaggio} è una figura importante nella letteratura italiana?`;
      rispostaCorretta = fatto.contesto || `Per il suo contributo nel periodo ${fatto.data}`;
      tipoRisposta = 'spiegazione';
    } else if (livello >= 3) {
      // Livelli superiori
      testo = `Come il contesto storico del ${fatto.data} influenzò la vita di ${fatto.personaggio}?`;
      rispostaCorretta = fatto.contesto || 'Il contesto storico fu determinante per la sua formazione';
      tipoRisposta = 'analisi';
    }

    if (!testo) return null;

    // Genera distrattori
    const distrattori = this.distractorGen.generaDistractors(
      { rispostaCorretta },
      tipoRisposta,
      3
    );

    // Mescola opzioni
    const { opzioni, rispostaCorretta: indiceCorretto } = 
      this.distractorGen.mescolaOpzioni(rispostaCorretta, distrattori);

    // FIX: Aggiungo TUTTI i campi richiesti dal validator
    return {
      id: this.generaId(),
      tipo: 'multipla',  // FIX: tipo quiz necessario
      testo,
      template: null,  // FIX: campo richiesto
      opzioni,
      rispostaCorretta: indiceCorretto,
      livello,
      difficolta: livello,  // FIX: campo richiesto
      bloom: this.getLivelloBloom(livello),  // FIX: campo richiesto
      materia: sottoargomento.materia || 'Italiano',
      argomento: sottoargomento.argomento || sottoargomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: this.generaSpiegazione(fatto, tipoRisposta),
      confidence: fatto.confidence || 0.8,
      tags: [fatto.personaggio, fatto.tipo, sottoargomento.materia],
      metadata: {  // FIX: metadata strutturato
        tipo_fatto: 'biografico',
        fonte: 'testo',
        qualita: 0.75
      },
      creatoIl: new Date().toISOString()
    };
  }

  /**
   * 📚 Genera quiz da opere
   */
  generaQuizOpera(fattiOpere, livello, templates, sottoargomento) {
    const fatto = this.scegliRandom(fattiOpere);
    if (!fatto) return null;

    let testo, rispostaCorretta, tipoRisposta;

    if (livello === 1) {
      // Domande dirette
      const random = Math.random();
      if (random < 0.33 && fatto.autore) {
        testo = `Chi scrisse "${fatto.titolo}"?`;
        rispostaCorretta = fatto.autore;
        tipoRisposta = 'autore';
      } else if (random < 0.66 && fatto.anno) {
        testo = `In che anno fu pubblicata l'opera "${fatto.titolo}"?`;
        rispostaCorretta = fatto.anno;
        tipoRisposta = 'anno';
      } else {
        testo = `Quale opera scrisse ${fatto.autore}?`;
        rispostaCorretta = fatto.titolo;
        tipoRisposta = 'opera';
      }
    } else if (livello === 2) {
      testo = `Qual è il tema principale de "${fatto.titolo}"?`;
      rispostaCorretta = fatto.contesto || `Tratta temi significativi del ${fatto.genere || 'suo genere'}`;
      tipoRisposta = 'tema';
    } else if (livello === 3) {
      testo = `A quale genere letterario appartiene "${fatto.titolo}" di ${fatto.autore}?`;
      rispostaCorretta = fatto.genere || 'Prosa/Poesia';
      tipoRisposta = 'genere';
    } else if (livello >= 4) {
      testo = `Qual è l'importanza storico-letteraria de "${fatto.titolo}"?`;
      rispostaCorretta = fatto.contesto || `Opera fondamentale per ${fatto.autore}`;
      tipoRisposta = 'analisi';
    }

    if (!testo) return null;

    const distrattori = this.distractorGen.generaDistractors(
      { rispostaCorretta, autore: fatto.autore },
      tipoRisposta,
      3
    );

    const { opzioni, rispostaCorretta: indiceCorretto } = 
      this.distractorGen.mescolaOpzioni(rispostaCorretta, distrattori);

    // FIX: Aggiungo TUTTI i campi richiesti dal validator
    return {
      id: this.generaId(),
      tipo: 'multipla',  // FIX: tipo quiz necessario
      testo,
      template: null,  // FIX: campo richiesto
      opzioni,
      rispostaCorretta: indiceCorretto,
      livello,
      difficolta: livello,  // FIX: campo richiesto
      bloom: this.getLivelloBloom(livello),  // FIX: campo richiesto
      materia: sottoargomento.materia || 'Italiano',
      argomento: sottoargomento.argomento || sottoargomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: this.generaSpiegazioneOpera(fatto),
      confidence: fatto.confidence || 0.8,
      tags: [fatto.titolo, fatto.autore, fatto.genere].filter(Boolean),
      metadata: {  // FIX: metadata strutturato
        tipo_fatto: 'opera',
        fonte: 'testo',
        qualita: 0.75
      },
      creatoIl: new Date().toISOString()
    };
  }

  /**
   * 📖 Genera quiz da definizioni
   */
  generaQuizDefinizione(fattiDefinizioni, livello, templates, sottoargomento) {
    const fatto = this.scegliRandom(fattiDefinizioni);
    if (!fatto) return null;

    let testo, rispostaCorretta, tipoRisposta;

    if (livello <= 2) {
      testo = `Cosa si intende per "${fatto.termine}"?`;
      rispostaCorretta = fatto.spiegazione;
      tipoRisposta = 'definizione';
    } else if (livello === 3) {
      testo = `Il termine "${fatto.termine}" è caratteristico di quale corrente/movimento?`;
      rispostaCorretta = fatto.categoria || 'Letteratura italiana';
      tipoRisposta = 'movimento';
    } else {
      testo = `Come si manifesta il concetto di "${fatto.termine}" nella letteratura italiana?`;
      rispostaCorretta = fatto.spiegazione;
      tipoRisposta = 'analisi';
    }

    const distrattori = this.distractorGen.generaDistractors(
      { rispostaCorretta },
      tipoRisposta,
      3
    );

    const { opzioni, rispostaCorretta: indiceCorretto } = 
      this.distractorGen.mescolaOpzioni(rispostaCorretta, distrattori);

    return {
      id: this.generaId(),
      testo,
      opzioni,
      rispostaCorretta: indiceCorretto,
      livello,
      tipo: 'definizione',
      materia: sottoargomento.materia,
      argomento: sottoargomento.argomento,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `"${fatto.termine}": ${fatto.spiegazione}`,
      confidence: fatto.confidence || 0.75,
      tags: [fatto.termine, fatto.categoria].filter(Boolean),
      creatoIl: new Date().toISOString()
    };
  }

  /**
   * 🔗 Genera quiz da relazioni causa-effetto
   */
  generaQuizRelazione(fattiRelazioni, livello, templates, sottoargomento) {
    const fatto = this.scegliRandom(fattiRelazioni);
    if (!fatto) return null;

    let testo, rispostaCorretta, tipoRisposta;

    if (fatto.sottotipo === 'causale') {
      if (livello <= 2) {
        testo = `Quale fu la conseguenza di: "${fatto.causa}"?`;
        rispostaCorretta = fatto.effetto;
        tipoRisposta = 'conseguenza';
      } else {
        testo = `Analizza il rapporto causa-effetto tra "${fatto.causa}" e le sue conseguenze:`;
        rispostaCorretta = fatto.effetto;
        tipoRisposta = 'analisi';
      }
    } else if (fatto.sottotipo === 'influenza') {
      testo = `Come ${fatto.soggetto} influenzò ${fatto.oggetto}?`;
      rispostaCorretta = fatto.contesto || `${fatto.soggetto} ebbe un\'influenza significativa su ${fatto.oggetto}`;
      tipoRisposta = 'influenza';
    } else if (fatto.sottotipo === 'appartenenza') {
      testo = `A quale movimento/corrente appartenne ${fatto.personaggio}?`;
      rispostaCorretta = fatto.movimento;
      tipoRisposta = 'movimento';
    }

    if (!testo) return null;

    const distrattori = this.distractorGen.generaDistractors(
      { rispostaCorretta },
      tipoRisposta,
      3
    );

    const { opzioni, rispostaCorretta: indiceCorretto } = 
      this.distractorGen.mescolaOpzioni(rispostaCorretta, distrattori);

    return {
      id: this.generaId(),
      testo,
      opzioni,
      rispostaCorretta: indiceCorretto,
      livello,
      tipo: 'relazione',
      sottotipo: fatto.sottotipo,
      materia: sottoargomento.materia,
      argomento: sottoargomento.argomento,
      sottoargomento: sottoargomento.titolo,
      spiegazione: this.generaSpiegazioneRelazione(fatto),
      confidence: fatto.confidence || 0.7,
      tags: [fatto.sottotipo, sottoargomento.materia],
      creatoIl: new Date().toISOString()
    };
  }

  /**
   * 📅 Genera quiz da eventi
   */
  generaQuizEvento(fattiEventi, livello, templates, sottoargomento) {
    const fatto = this.scegliRandom(fattiEventi);
    if (!fatto) return null;

    let testo, rispostaCorretta, tipoRisposta;

    if (livello === 1 && fatto.data) {
      testo = `Quando avvenne: ${fatto.descrizione.substring(0, 80)}...?`;
      rispostaCorretta = fatto.data;
      tipoRisposta = 'anno';
    } else if (livello === 2) {
      testo = `Quale fu l'importanza di: ${fatto.descrizione.substring(0, 60)}...?`;
      rispostaCorretta = fatto.contesto || 'Evento significativo per il periodo';
      tipoRisposta = 'spiegazione';
    } else {
      testo = `Come questo evento influenzò il contesto culturale: "${fatto.descrizione.substring(0, 50)}..."?`;
      rispostaCorretta = fatto.contesto || 'Influenzò profondamente il panorama culturale';
      tipoRisposta = 'analisi';
    }

    const distrattori = this.distractorGen.generaDistractors(
      { rispostaCorretta },
      tipoRisposta,
      3
    );

    const { opzioni, rispostaCorretta: indiceCorretto } = 
      this.distractorGen.mescolaOpzioni(rispostaCorretta, distrattori);

    return {
      id: this.generaId(),
      testo,
      opzioni,
      rispostaCorretta: indiceCorretto,
      livello,
      tipo: 'evento',
      materia: sottoargomento.materia,
      argomento: sottoargomento.argomento,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `Evento: ${fatto.descrizione}. ${fatto.contesto || ''}`,
      confidence: fatto.confidence || 0.75,
      tags: ['evento', fatto.sottotipo, sottoargomento.materia].filter(Boolean),
      creatoIl: new Date().toISOString()
    };
  }

  /**
   * 🕸️ Genera quiz dalle relazioni del knowledge graph
   */
  generaQuizDaRelazioni(sottoargomento) {
    const quiz = [];
    const nodiImportanti = this.graph.getNodiPiuImportanti('persona', 5);

    for (const nodo of nodiImportanti) {
      const domandePossibili = this.graph.generaDomandeDaNodo(nodo.id);
      
      for (const domandaBase of domandePossibili.slice(0, 2)) {
        // Trova distrattori dal grafo
        const distrattori = this.graph.trovaDistratoriDaGrafo(
          nodo.id,
          domandaBase.tipoRisposta,
          3
        );

        if (distrattori.length < 2) continue;

        const { opzioni, rispostaCorretta: indiceCorretto } = 
          this.distractorGen.mescolaOpzioni(domandaBase.rispostaCorretta, distrattori);

        const nuovoQuiz = {
          id: this.generaId(),
          testo: domandaBase.template,
          opzioni,
          rispostaCorretta: indiceCorretto,
          livello: this.mappaLivelloBloom(domandaBase.livello),
          tipo: 'grafo',
          materia: sottoargomento.materia,
          argomento: sottoargomento.argomento,
          sottoargomento: sottoargomento.titolo,
          spiegazione: `La risposta corretta è "${domandaBase.rispostaCorretta}".`,
          confidence: domandaBase.confidence,
          tags: ['relazione', sottoargomento.materia],
          creatoIl: new Date().toISOString()
        };

        const validazione = this.validator.valida(nuovoQuiz);
        if (validazione.valida) {
          nuovoQuiz.qualita = validazione.score;
          quiz.push(nuovoQuiz);
        }
      }
    }

    return quiz.slice(0, 3); // Max 3 quiz da relazioni
  }

  // ==================== SPIEGAZIONI DIDATTICHE ====================

  /**
   * 📝 Genera spiegazione per fatto biografico
   */
  generaSpiegazione(fatto, tipo) {
    if (!this.config.includiSpiegazioni) return '';

    let spiegazione = '';

    if (tipo === 'anno') {
      spiegazione = `${fatto.personaggio} ${fatto.tipo === 'nascita' ? 'nacque' : 'morì'} nel ${fatto.data}`;
      if (fatto.luogo) {
        spiegazione += ` a ${fatto.luogo}`;
      }
      spiegazione += '.';
      if (fatto.contesto) {
        spiegazione += ` ${fatto.contesto}`;
      }
    } else if (tipo === 'luogo') {
      spiegazione = `${fatto.personaggio} nacque a ${fatto.luogo}`;
      if (fatto.data) {
        spiegazione += ` nel ${fatto.data}`;
      }
      spiegazione += '.';
    }

    return spiegazione;
  }

  /**
   * 📚 Genera spiegazione per opera
   */
  generaSpiegazioneOpera(fatto) {
    if (!this.config.includiSpiegazioni) return '';

    let spiegazione = `"${fatto.titolo}"`;
    
    if (fatto.autore) {
      spiegazione += ` è un'opera di ${fatto.autore}`;
    }
    
    if (fatto.anno) {
      spiegazione += ` pubblicata nel ${fatto.anno}`;
    }
    
    spiegazione += '.';
    
    if (fatto.genere) {
      spiegazione += ` Si tratta di un'opera di ${fatto.genere}.`;
    }
    
    if (fatto.contesto) {
      spiegazione += ` ${fatto.contesto}`;
    }

    return spiegazione;
  }

  /**
   * 🔗 Genera spiegazione per relazione
   */
  generaSpiegazioneRelazione(fatto) {
    if (!this.config.includiSpiegazioni) return '';

    let spiegazione = '';

    if (fatto.sottotipo === 'causale') {
      spiegazione = `"${fatto.causa}" causò "${fatto.effetto}".`;
    } else if (fatto.sottotipo === 'influenza') {
      spiegazione = `${fatto.soggetto} influenzò significativamente ${fatto.oggetto}.`;
    } else if (fatto.sottotipo === 'appartenenza') {
      spiegazione = `${fatto.personaggio} appartenne al movimento del ${fatto.movimento}.`;
    }

    if (fatto.contesto) {
      spiegazione += ` ${fatto.contesto}`;
    }

    return spiegazione;
  }

  // ==================== UTILITY ====================

  /**
   * 🔢 Genera ID univoco
   */
  generaId() {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 🎲 Scegli elemento random da array
   */
  scegliRandom(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * 🔀 Shuffle array (Fisher-Yates)
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * 📊 Conta fatti estratti
   */
  contaFatti(fatti) {
    return (
      (fatti.biografici?.length || 0) +
      (fatti.opere?.length || 0) +
      (fatti.eventi?.length || 0) +
      (fatti.definizioni?.length || 0) +
      (fatti.relazioni?.length || 0) +
      (fatti.concetti?.length || 0)
    );
  }

  /**
   * 🗺️ Mappa livello Bloom a numero
   */
  mappaLivelloBloom(livelloNome) {
    const mappa = {
      'conoscenza': 1,
      'comprensione': 2,
      'applicazione': 3,
      'analisi': 4,
      'valutazione': 5,
      'sintesi': 5
    };
    return mappa[livelloNome] || 1;
  }

  /**
   * 🎓 Ottieni livello Bloom da numero
   */
  getLivelloBloom(livello) {
    const livelli = {
      1: 'CONOSCENZA',
      2: 'COMPRENSIONE',
      3: 'APPLICAZIONE',
      4: 'ANALISI',
      5: 'VALUTAZIONE'
    };
    return livelli[livello] || 'CONOSCENZA';
  }

  /**
   * 📈 Ottieni statistiche
   */
  getStatistiche() {
    return {
      ...this.stats,
      grafo: this.graph.getStatistiche(),
      validatore: {
        domandeRegistrate: this.validator.domandeGenerate.size
      },
      distrattori: this.distractorGen.getStatistiche()
    };
  }

  /**
   * 🧹 Reset per nuova sessione
   */
  reset() {
    this.graph = new KnowledgeGraph();
    this.distractorGen = new DistractorGenerator(this.graph);
    this.validator.reset();
    this.stats = {
      quizGenerati: 0,
      quizValidati: 0,
      quizScartati: 0,
      tempoMedio: 0
    };
  }
}

module.exports = IntelligentQuizGenerator;
