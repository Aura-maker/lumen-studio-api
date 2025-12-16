/**
 * 🤖 AI TUTOR CONVERSAZIONALE - Assistente Studio Personalizzato
 * Un vero compagno di studio che conversa, motiva e insegna
 * 
 * Caratteristiche:
 * - Memoria conversazionale (mantiene contesto)
 * - Personalità adattiva (formale/amichevole)
 * - Metodo Socratico (domande guidate)
 * - Emotional intelligence
 * - Multi-lingua
 * - Voice support ready
 */

class ConversationalAITutor {
  constructor(options = {}) {
    // Configurazione personalità
    this.personalita = {
      nome: options.nome || 'Sofia',
      ruolo: options.ruolo || 'Tutor AI',
      stile: options.stile || 'amichevole', // formale, amichevole, motivazionale, socratico
      lingua: options.lingua || 'italiano',
      avatar: options.avatar || '🎓',
      voce: options.voce || 'femminile-giovane'
    };

    // Memoria conversazionale
    this.memoria = {
      conversazioni: new Map(), // userId -> conversazione
      contestoMax: 15,         // Messaggi da ricordare
      summaryAfter: 30        // Riassumi dopo N messaggi
    };

    // Stato emotivo e pedagogico
    this.statoStudente = new Map(); // userId -> stato

    // Template risposte per personalità
    this.templates = this.inizializzaTemplates();

    // Strategie pedagogiche
    this.strategiePedagogiche = {
      SOCRATICO: 'guida con domande',
      DIRETTO: 'spiega direttamente', 
      ESEMPI: 'usa molti esempi',
      ANALOGIE: 'usa metafore e analogie',
      VISUALE: 'suggerisci diagrammi',
      PRATICO: 'focus su esercizi'
    };

    console.log(`🤖 ${this.personalita.nome} il ${this.personalita.ruolo} inizializzato`);
  }

  // ==================== CONVERSAZIONE ====================

  /**
   * 💬 Gestisci messaggio utente
   */
  async rispondi(userId, messaggio, contesto = {}) {
    // Recupera o crea conversazione
    const conversazione = this.getConversazione(userId);
    
    // Aggiungi messaggio utente
    conversazione.messaggi.push({
      ruolo: 'utente',
      contenuto: messaggio,
      timestamp: Date.now()
    });

    // Analizza stato emotivo e intent
    const analisi = this.analizzaMessaggio(messaggio, conversazione);
    
    // Aggiorna stato studente
    this.aggiornaStatoStudente(userId, analisi);

    // Genera risposta appropriata
    const risposta = await this.generaRisposta(
      messaggio,
      conversazione,
      analisi,
      contesto
    );

    // Aggiungi risposta alla conversazione
    conversazione.messaggi.push({
      ruolo: 'assistente',
      contenuto: risposta.testo,
      timestamp: Date.now(),
      metadata: risposta.metadata
    });

    // Mantieni memoria limitata
    this.limitaMemoria(conversazione);

    return risposta;
  }

  /**
   * 🧠 Analizza messaggio per intent ed emozioni
   */
  analizzaMessaggio(messaggio, conversazione) {
    const messaggioLower = messaggio.toLowerCase();
    const analisi = {
      intent: null,
      emozione: null,
      argomento: null,
      difficolta: null,
      domandaSpecifica: false
    };

    // Detect intent
    if (messaggioLower.includes('?')) {
      analisi.domandaSpecifica = true;
    }

    // Intent patterns
    const intents = {
      AIUTO: ['aiuto', 'help', 'non capisco', 'non ho capito', 'non riesco'],
      SPIEGAZIONE: ['spiega', 'cos\'è', 'cosa significa', 'che vuol dire'],
      ESEMPIO: ['esempio', 'esempi', 'mostra', 'fammi vedere'],
      ESERCIZIO: ['esercizio', 'esercizi', 'problema', 'quiz'],
      RIPASSO: ['ripasso', 'ripassare', 'rivedere', 'ricordo'],
      MOTIVAZIONE: ['non ce la faccio', 'è difficile', 'impossibile', 'stanco'],
      PROGRESSO: ['come sto andando', 'progressi', 'migliorato'],
      STRATEGIA: ['come studio', 'metodo', 'strategia', 'consigli']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(k => messaggioLower.includes(k))) {
        analisi.intent = intent;
        break;
      }
    }

    // Detect emozione
    const emozioni = {
      FRUSTRAZIONE: ['non riesco', 'impossibile', 'difficile', 'basta', 'odio'],
      CONFUSIONE: ['confuso', 'non capisco', 'non chiaro', 'complicato'],
      MOTIVATO: ['voglio', 'pronto', 'facciamo', 'andiamo', 'proviamo'],
      STANCO: ['stanco', 'basta per oggi', 'pausa', 'dopo', 'domani'],
      FELICE: ['capito', 'facile', 'bene', 'ottimo', 'perfetto', 'grazie']
    };

    for (const [emozione, keywords] of Object.entries(emozioni)) {
      if (keywords.some(k => messaggioLower.includes(k))) {
        analisi.emozione = emozione;
        break;
      }
    }

    // Extract argomento (semplificato - in produzione usa NLP)
    const argomenti = [
      'foscolo', 'leopardi', 'manzoni', 'verga', 'dante',
      'matematica', 'fisica', 'storia', 'filosofia', 'inglese'
    ];

    for (const arg of argomenti) {
      if (messaggioLower.includes(arg)) {
        analisi.argomento = arg;
        break;
      }
    }

    return analisi;
  }

  /**
   * 💭 Genera risposta appropriata
   */
  async generaRisposta(messaggio, conversazione, analisi, contesto) {
    const stato = this.statoStudente.get(conversazione.userId) || this.creaStatoDefault();
    
    // Scegli strategia pedagogica
    const strategia = this.scegliStrategia(analisi, stato);
    
    // Genera risposta base in base a intent
    let testoRisposta = '';
    let suggerimenti = [];
    let azioni = [];

    switch (analisi.intent) {
      case 'AIUTO':
        testoRisposta = this.generaAiuto(messaggio, analisi, stato);
        suggerimenti = this.suggerisciRisorse(analisi.argomento);
        break;
        
      case 'SPIEGAZIONE':
        testoRisposta = this.generaSpiegazione(messaggio, analisi, strategia);
        azioni.push({ tipo: 'quiz', label: 'Prova un quiz' });
        break;
        
      case 'ESEMPIO':
        testoRisposta = this.generaEsempi(messaggio, analisi);
        break;
        
      case 'ESERCIZIO':
        testoRisposta = this.suggerisciEsercizi(analisi);
        azioni.push({ tipo: 'inizia_quiz', label: 'Inizia subito' });
        break;
        
      case 'MOTIVAZIONE':
        testoRisposta = this.generaMotivazione(stato);
        break;
        
      case 'PROGRESSO':
        testoRisposta = this.descriviProgresso(stato);
        break;
        
      default:
        testoRisposta = this.generaRispostaGenerica(messaggio, analisi);
    }

    // Aggiungi tocco personale basato su emozione
    testoRisposta = this.aggiungiToccoEmotivo(testoRisposta, analisi.emozione);

    // Aggiungi call-to-action se appropriato
    if (stato.messaggiConsecutivi > 5 && !azioni.length) {
      azioni.push({ 
        tipo: 'pausa',
        label: 'Facciamo una pausa?'
      });
    }

    return {
      testo: testoRisposta,
      metadata: {
        strategia,
        intent: analisi.intent,
        emozione: analisi.emozione,
        suggerimenti,
        azioni
      },
      voce: this.shouldUseVoice(analisi) 
    };
  }

  // ==================== GENERATORI RISPOSTE ====================

  /**
   * 🆘 Genera risposta di aiuto
   */
  generaAiuto(messaggio, analisi, stato) {
    const templates = this.templates[this.personalita.stile];
    let risposta = templates.aiuto.intro;

    if (analisi.argomento) {
      risposta += `\n\nPer ${analisi.argomento}, ecco cosa posso fare:\n`;
      risposta += `• Spiegarti i concetti chiave\n`;
      risposta += `• Mostrarti esempi pratici\n`;
      risposta += `• Proporti quiz mirati\n`;
      risposta += `• Guidarti passo passo\n`;
    }

    if (stato.puntiDeboli.length > 0) {
      risposta += `\n💡 Ho notato che hai difficoltà con: ${stato.puntiDeboli.join(', ')}. `;
      risposta += `Vuoi che ci concentriamo su questi?`;
    }

    return risposta;
  }

  /**
   * 📚 Genera spiegazione
   */
  generaSpiegazione(messaggio, analisi, strategia) {
    const intro = this.personalita.stile === 'amichevole' ? 
      'Ok, te lo spiego in modo semplice! 😊\n\n' :
      'Certamente, ecco la spiegazione:\n\n';

    let spiegazione = intro;

    // Strategia Socratica - domande guidate
    if (strategia === 'SOCRATICO') {
      spiegazione += 'Prima di spiegarti, dimmi:\n';
      spiegazione += '• Cosa sai già su questo argomento?\n';
      spiegazione += '• Dove hai incontrato difficoltà?\n';
      spiegazione += '• Hai provato a ragionarci? Come?\n\n';
      spiegazione += 'Partiamo da quello che sai già e costruiamo insieme! 🤝';
      
    } else {
      // Spiegazione diretta semplificata
      spiegazione += this.getSpiegazioneBase(analisi.argomento);
      
      if (strategia === 'ESEMPI') {
        spiegazione += '\n\n📝 **Esempio pratico:**\n';
        spiegazione += this.getEsempio(analisi.argomento);
      }
      
      if (strategia === 'ANALOGIE') {
        spiegazione += '\n\n🎯 **È come se:**\n';
        spiegazione += this.getAnalogia(analisi.argomento);
      }
    }

    return spiegazione;
  }

  /**
   * 💪 Genera motivazione
   */
  generaMotivazione(stato) {
    const frasi = [
      "Non mollare! So che è difficile, ma ce la puoi fare! 💪",
      "Ogni grande studente ha avuto momenti così. È normale e passerà! 🌟",
      "Ricorda: non devi essere perfetto, solo migliorare un po' ogni giorno 📈",
      "Facciamo una pausa di 5 minuti e poi riproviamo con calma? ☕",
      "Hai già fatto progressi incredibili! Guarda quanto sei migliorato 🎯"
    ];

    let risposta = frasi[Math.floor(Math.random() * frasi.length)];

    if (stato.streak > 3) {
      risposta += `\n\n🔥 Sei in streak da ${stato.streak} giorni! Non spezzare la catena!`;
    }

    if (stato.punteggioMedio > 7) {
      risposta += `\n\n📊 Il tuo punteggio medio è ${stato.punteggioMedio}/10. Sei bravissimo!`;
    }

    return risposta;
  }

  /**
   * 📊 Descrivi progresso
   */
  descriviProgresso(stato) {
    let risposta = '📈 **I tuoi progressi:**\n\n';
    
    risposta += `• Quiz completati: ${stato.quizCompletati}\n`;
    risposta += `• Accuratezza media: ${(stato.accuratezza * 100).toFixed(1)}%\n`;
    risposta += `• Streak attuale: ${stato.streak} giorni\n`;
    risposta += `• Livello: ${stato.livello}\n\n`;

    if (stato.miglioramenti.length > 0) {
      risposta += '✨ **Miglioramenti recenti:**\n';
      stato.miglioramenti.forEach(m => {
        risposta += `• ${m}\n`;
      });
    }

    if (stato.puntiDeboli.length > 0) {
      risposta += '\n⚠️ **Da migliorare:**\n';
      stato.puntiDeboli.forEach(p => {
        risposta += `• ${p}\n`;
      });
    }

    return risposta;
  }

  // ==================== PERSONALIZZAZIONE ====================

  /**
   * 🎨 Inizializza template per personalità
   */
  inizializzaTemplates() {
    return {
      amichevole: {
        saluto: 'Ciao! Come stai oggi? Pronto per studiare insieme? 😊',
        aiuto: {
          intro: 'Nessun problema, sono qui per aiutarti! 🤝'
        },
        incoraggiamento: [
          'Ottimo lavoro! 🌟',
          'Sei un grande! 💪',
          'Wow, stai migliorando tantissimo! 🚀'
        ],
        correzione: [
          'Quasi! Proviamo di nuovo 😊',
          'Non proprio, ma ci sei vicino!',
          'Mmm, non è corretto ma non ti preoccupare!'
        ]
      },
      formale: {
        saluto: 'Buongiorno. Come posso assisterla nello studio?',
        aiuto: {
          intro: 'Certamente, sono a sua disposizione.'
        },
        incoraggiamento: [
          'Eccellente.',
          'Risposta corretta.',
          'Molto bene.'
        ],
        correzione: [
          'Non corretto. Riproviamo.',
          'La risposta non è esatta.',
          'Si richiede maggiore attenzione.'
        ]
      },
      motivazionale: {
        saluto: 'Campione! Oggi spacchiamo tutto! 🔥',
        aiuto: {
          intro: 'Niente paura, superiamo questo ostacolo insieme! 💪'
        },
        incoraggiamento: [
          'SEI UN FENOMENO! 🏆',
          'INCREDIBILE! Continua così! 🚀',
          'Sei inarrestabile! 🌟'
        ],
        correzione: [
          'Non mollare! Riproviamo! 💪',
          'È solo un piccolo inciampo! Su!',
          'Gli errori sono trampolini verso il successo!'
        ]
      },
      socratico: {
        saluto: 'Benvenuto. Che domande ti poni oggi?',
        aiuto: {
          intro: 'Interessante. Cosa ne pensi tu?'
        },
        incoraggiamento: [
          'Hai ragionato bene.',
          'Il tuo percorso logico è valido.',
          'Ottima deduzione.'
        ],
        correzione: [
          'Cosa ti fa pensare sia così?',
          'Proviamo a ragionarci: se fosse vero, cosa implicherebbe?',
          'Interessante. Come verificheresti questa ipotesi?'
        ]
      }
    };
  }

  /**
   * 🎭 Aggiungi tocco emotivo alla risposta
   */
  aggiungiToccoEmotivo(testo, emozione) {
    if (!emozione) return testo;

    const tocchi = {
      FRUSTRAZIONE: '\n\n💭 So che è frustrante, ma sei più vicino di quanto pensi!',
      CONFUSIONE: '\n\n🤔 È normale essere confusi all\'inizio. Chiariamo insieme!',
      MOTIVATO: '\n\n🚀 Adoro la tua energia! Sfruttiamola!',
      STANCO: '\n\n😴 Capisco che sei stanco. Ultimo sforzo o pausa?',
      FELICE: '\n\n😊 Fantastico! Continua con questo spirito!'
    };

    return testo + (tocchi[emozione] || '');
  }

  // ==================== GESTIONE STATO ====================

  /**
   * 👤 Aggiorna stato studente
   */
  aggiornaStatoStudente(userId, analisi) {
    if (!this.statoStudente.has(userId)) {
      this.statoStudente.set(userId, this.creaStatoDefault());
    }

    const stato = this.statoStudente.get(userId);
    stato.ultimaInterazione = Date.now();
    stato.messaggiConsecutivi++;

    if (analisi.emozione) {
      stato.emotivoStoria.push(analisi.emozione);
      if (stato.emotivoStoria.length > 10) {
        stato.emotivoStoria.shift();
      }
    }

    if (analisi.argomento) {
      stato.argomentiToccati.add(analisi.argomento);
    }
  }

  /**
   * 🆕 Crea stato default
   */
  creaStatoDefault() {
    return {
      livello: 1,
      quizCompletati: 0,
      accuratezza: 0.7,
      streak: 0,
      punteggioMedio: 7,
      puntiDeboli: [],
      miglioramenti: [],
      emotivoStoria: [],
      argomentiToccati: new Set(),
      ultimaInterazione: Date.now(),
      messaggiConsecutivi: 0
    };
  }

  /**
   * 📚 Get/Create conversazione
   */
  getConversazione(userId) {
    if (!this.memoria.conversazioni.has(userId)) {
      this.memoria.conversazioni.set(userId, {
        userId,
        messaggi: [],
        iniziata: Date.now()
      });
    }
    return this.memoria.conversazioni.get(userId);
  }

  /**
   * 🧹 Limita memoria conversazione
   */
  limitaMemoria(conversazione) {
    if (conversazione.messaggi.length > this.memoria.contestoMax * 2) {
      // Mantieni solo ultimi N messaggi
      conversazione.messaggi = conversazione.messaggi.slice(-this.memoria.contestoMax);
    }
  }

  /**
   * 📖 Ottieni spiegazione base (mock - in prod usa knowledge base)
   */
  getSpiegazioneBase(argomento) {
    const spiegazioni = {
      foscolo: 'Ugo Foscolo (1778-1827) fu poeta e scrittore tra Neoclassicismo e Romanticismo. Famoso per "I Sepolcri" e "Le ultime lettere di Jacopo Ortis".',
      leopardi: 'Giacomo Leopardi (1798-1837), il poeta del pessimismo cosmico. Autore de "L\'Infinito" e delle "Operette morali".',
      default: 'Questo è un argomento importante che richiede attenzione. Analizziamolo insieme passo per passo.'
    };
    
    return spiegazioni[argomento] || spiegazioni.default;
  }

  /**
   * 📝 Ottieni esempio
   */
  getEsempio(argomento) {
    return 'Immagina di dover spiegare questo concetto a un amico. Come inizieresti?';
  }

  /**
   * 🎯 Ottieni analogia  
   */
  getAnalogia(argomento) {
    return 'Pensa a questo concetto come a un puzzle: ogni pezzo è importante per vedere l\'immagine completa.';
  }

  /**
   * 🎓 Scegli strategia pedagogica
   */
  scegliStrategia(analisi, stato) {
    if (analisi.emozione === 'FRUSTRAZIONE') {
      return 'ESEMPI'; // Più concreto quando frustrato
    }
    
    if (stato.livello > 3) {
      return 'SOCRATICO'; // Studenti avanzati
    }
    
    if (analisi.domandaSpecifica) {
      return 'DIRETTO'; // Risposte dirette a domande specifiche
    }
    
    return 'ANALOGIE'; // Default: usa metafore
  }

  /**
   * 💬 Suggerisci risorse
   */
  suggerisciRisorse(argomento) {
    return [
      { tipo: 'video', titolo: `Video su ${argomento}` },
      { tipo: 'quiz', titolo: `Quiz ${argomento}` },
      { tipo: 'flashcard', titolo: `Flashcard ${argomento}` }
    ];
  }

  /**
   * 📚 Suggerisci esercizi
   */
  suggerisciEsercizi(analisi) {
    return `Ecco alcuni esercizi perfetti per te:\n\n` +
           `1. Quiz veloce (5 domande) - 5 minuti\n` +
           `2. Test completo (20 domande) - 20 minuti\n` +
           `3. Flashcards ripasso - 10 minuti\n\n` +
           `Quale preferisci?`;
  }

  /**
   * 💬 Risposta generica
   */
  generaRispostaGenerica(messaggio, analisi) {
    if (messaggio.length < 5) {
      return 'Non ho capito bene. Puoi essere più specifico?';
    }
    
    return 'Interessante! Dimmi di più su cosa vorresti approfondire.';
  }

  /**
   * 🔊 Decide se usare voce
   */
  shouldUseVoice(analisi) {
    return analisi.emozione === 'STANCO' || analisi.emozione === 'FRUSTRAZIONE';
  }
}

module.exports = ConversationalAITutor;
