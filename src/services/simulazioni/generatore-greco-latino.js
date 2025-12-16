/**
 * 🏛️ GENERATORE SIMULAZIONI GRECO E LATINO
 * Sistema per generare simulazioni d'esame di greco e latino formato maturità
 */

class GeneratoreGrecoLatinoSimulazioni {
  constructor() {
    this.struttura = {
      versione: true,
      quesiti_comprensione: 3,
      durata_greco: '6 ore',
      durata_latino: '4 ore'
    };

    this.autori = {
      greco: [
        'Omero', 'Esiodo', 'Pindaro', 'Eschilo', 'Sofocle', 'Euripide',
        'Aristofane', 'Erodoto', 'Tucidide', 'Senofonte', 'Platone',
        'Aristotele', 'Demostene', 'Isocrate', 'Plutarco'
      ],
      latino: [
        'Plauto', 'Terenzio', 'Cesare', 'Cicerone', 'Sallustio',
        'Virgilio', 'Orazio', 'Ovidio', 'Livio', 'Seneca',
        'Petronio', 'Quintiliano', 'Tacito', 'Svetonio', 'Apuleio'
      ]
    };
  }

  /**
   * Genera simulazione completa GRECO
   */
  generaSimulazioneGreco(numero = 1) {
    return {
      id: `GRE_SIM_${String(numero).padStart(3, '0')}`,
      materia: 'LINGUA E CULTURA GRECA',
      tipo: 'ESAME DI STATO - LICEO CLASSICO',
      numero: numero,
      data: new Date().toISOString().split('T')[0],
      durata: '6 ore',
      intestazione: this.generaIntestazioneGreco(),
      dizionari_ammessi: 'È consentito l\'uso del dizionario di greco.',
      struttura: {
        prima_parte: this.generaVersioneGreco(numero),
        seconda_parte: this.generaQuesitiGreco(numero)
      }
    };
  }

  /**
   * Genera simulazione completa LATINO
   */
  generaSimulazioneLatino(numero = 1) {
    return {
      id: `LAT_SIM_${String(numero).padStart(3, '0')}`,
      materia: 'LINGUA E CULTURA LATINA',
      tipo: 'ESAME DI STATO - LICEO CLASSICO/SCIENTIFICO',
      numero: numero,
      data: new Date().toISOString().split('T')[0],
      durata: '4 ore',
      intestazione: this.generaIntestazioneLatino(),
      dizionari_ammessi: 'È consentito l\'uso del dizionario di latino.',
      struttura: {
        prima_parte: this.generaVersioneLatino(numero),
        seconda_parte: this.generaQuesitiLatino(numero)
      }
    };
  }

  generaIntestazioneGreco() {
    return `Ministero dell'Istruzione e del Merito
ESAME DI STATO CONCLUSIVO DEL SECONDO CICLO DI ISTRUZIONE
Indirizzo: LI01 - CLASSICO
Disciplina: LINGUA E CULTURA GRECA`;
  }

  generaIntestazioneLatino() {
    return `Ministero dell'Istruzione e del Merito
ESAME DI STATO CONCLUSIVO DEL SECONDO CICLO DI ISTRUZIONE
Indirizzo: LI01 - EA01 - CLASSICO
(Testo valido anche per gli indirizzi LI02, LI21, LIC e LIQ1)
Disciplina: LINGUA E CULTURA LATINA`;
  }

  /**
   * VERSIONE GRECO
   */
  generaVersioneGreco(n) {
    const versioni = this.getBancaVersioniGreco();
    const versione = versioni[n % versioni.length];
    
    return {
      titolo: 'PRIMA PARTE: traduzione di un testo in lingua greca',
      titolo_brano: versione.titolo,
      pre_testo: versione.introduzione,
      testo_greco: versione.testo,
      post_testo: versione.post_testo || null,
      note_lessicali: versione.note,
      fonte: versione.fonte
    };
  }

  /**
   * VERSIONE LATINO
   */
  generaVersioneLatino(n) {
    const versioni = this.getBancaVersioniLatino();
    const versione = versioni[n % versioni.length];
    
    return {
      titolo: 'PRIMA PARTE: traduzione di un testo in lingua latina',
      titolo_brano: versione.titolo,
      pre_testo: versione.introduzione,
      testo_latino: versione.testo,
      post_testo: versione.post_testo || null,
      note_lessicali: versione.note,
      fonte: versione.fonte
    };
  }

  /**
   * QUESITI GRECO
   */
  generaQuesitiGreco(n) {
    const tipiQuesiti = this.getTipiQuesitiGreco();
    const quesiti = [];
    
    // Quesito 1: Comprensione/Interpretazione
    quesiti.push({
      numero: 1,
      tipo: 'comprensione',
      testo: tipiQuesiti.comprensione[n % tipiQuesiti.comprensione.length],
      punti_max: 5
    });
    
    // Quesito 2: Analisi linguistica/stilistica
    quesiti.push({
      numero: 2,
      tipo: 'analisi',
      testo: tipiQuesiti.analisi[n % tipiQuesiti.analisi.length],
      punti_max: 5
    });
    
    // Quesito 3: Approfondimento/Confronto
    quesiti.push({
      numero: 3,
      tipo: 'approfondimento',
      testo: tipiQuesiti.approfondimento[n % tipiQuesiti.approfondimento.length],
      punti_max: 10
    });
    
    return {
      titolo: 'SECONDA PARTE: risposta aperta a tre quesiti',
      istruzioni: 'Il candidato risponda ai seguenti quesiti in modo puntuale e circostanziato.',
      quesiti: quesiti
    };
  }

  /**
   * QUESITI LATINO
   */
  generaQuesitiLatino(n) {
    const tipiQuesiti = this.getTipiQuesitiLatino();
    const quesiti = [];
    
    quesiti.push({
      numero: 1,
      tipo: 'comprensione',
      testo: tipiQuesiti.comprensione[n % tipiQuesiti.comprensione.length],
      punti_max: 5
    });
    
    quesiti.push({
      numero: 2,
      tipo: 'analisi',
      testo: tipiQuesiti.analisi[n % tipiQuesiti.analisi.length],
      punti_max: 5
    });
    
    quesiti.push({
      numero: 3,
      tipo: 'approfondimento',
      testo: tipiQuesiti.approfondimento[n % tipiQuesiti.approfondimento.length],
      punti_max: 10
    });
    
    return {
      titolo: 'SECONDA PARTE: risposta aperta a tre quesiti',
      istruzioni: 'Il candidato risponda ai seguenti quesiti in modo puntuale e circostanziato.',
      quesiti: quesiti
    };
  }

  // ========== BANCHE DATI ==========

  getBancaVersioniGreco() {
    return [
      {
        titolo: 'L\'ideale dell\'educazione',
        autore: 'Platone',
        opera: 'Repubblica',
        introduzione: `Nel dialogo platonico sulla Repubblica, Socrate discute con Glaucone dell'importanza dell'educazione per la formazione del cittadino ideale e del filosofo-re.`,
        testo: `Οὐκοῦν, ἦν δ' ἐγώ, ὦ Γλαύκων, μουσικῇ τροφὴ τελευτᾷ εἰς τὰ τοῦ καλοῦ ἐρωτικά; 
Δεῖ γοῦν, ἔφη. 
Καὶ μὴν ἥ γε περὶ τὰ σώματα τέχνη, ἣν γυμναστικὴν εἴπομεν, κατὰ τὸν αὐτὸν τρόπον μετὰ τοῦτο θρεπτέα. 
Πῶς δή; 
Πρῶτον μὲν τοίνυν σκέψαι εἰ ἀρκεῖ ἡμῖν ὁ αὐτὸς οὗτος φύλαξ πρὸς τῷ μουσικῷ καὶ γυμναστικὸς εἶναι, ἢ προσδεῖ τινος ἄλλης τέχνης.`,
        note: {
          'μουσική': 'educazione delle Muse, formazione culturale',
          'ἐρωτικά': 'cose d\'amore, desiderio del bello',
          'γυμναστική': 'ginnastica, educazione fisica'
        },
        fonte: 'Platone, Repubblica, III, 403c-404a'
      },
      {
        titolo: 'La giustizia divina',
        autore: 'Sofocle',
        opera: 'Antigone',
        introduzione: `Antigone difende davanti a Creonte la sua decisione di seppellire il fratello Polinice, richiamandosi alle leggi non scritte degli dei.`,
        testo: `Οὐ γάρ τί μοι Ζεὺς ἦν ὁ κηρύξας τάδε, 
οὐδ' ἡ ξύνοικος τῶν κάτω θεῶν Δίκη 
τοιούσδ' ἐν ἀνθρώποισιν ὥρισεν νόμους· 
οὐδὲ σθένειν τοσοῦτον ᾠόμην τὰ σὰ 
κηρύγμαθ' ὥστ' ἄγραπτα κἀσφαλῆ θεῶν 
νόμιμα δύνασθαι θνητὸν ὄνθ' ὑπερδραμεῖν. 
Οὐ γάρ τι νῦν γε κἀχθές, ἀλλ' ἀεί ποτε 
ζῇ ταῦτα, κοὐδεὶς οἶδεν ἐξ ὅτου 'φάνη.`,
        note: {
          'κηρύξας': 'che ha proclamato',
          'ξύνοικος': 'che abita con',
          'ἄγραπτα': 'non scritte',
          'κἀσφαλῆ': 'e immutabili'
        },
        fonte: 'Sofocle, Antigone, vv. 450-457'
      },
      {
        titolo: 'Il valore della filosofia',
        autore: 'Aristotele',
        opera: 'Etica Nicomachea',
        introduzione: `Aristotele riflette sulla natura della felicità e sul ruolo della contemplazione filosofica nel raggiungimento del bene supremo.`,
        testo: `Εἰ δ' ἐστὶν ἡ εὐδαιμονία κατ' ἀρετὴν ἐνέργεια, εὔλογον κατὰ τὴν κρατίστην· αὕτη δ' ἂν εἴη τοῦ ἀρίστου. Εἴτε δὴ νοῦς τοῦτο εἴτε ἄλλο τι, ὃ δὴ κατὰ φύσιν δοκεῖ ἄρχειν καὶ ἡγεῖσθαι καὶ ἔννοιαν ἔχειν περὶ καλῶν καὶ θείων, εἴτε θεῖον ὂν καὶ αὐτὸ εἴτε τῶν ἐν ἡμῖν τὸ θειότατον, ἡ τούτου ἐνέργεια κατὰ τὴν οἰκείαν ἀρετὴν εἴη ἂν ἡ τελεία εὐδαιμονία.`,
        note: {
          'εὐδαιμονία': 'felicità, beatitudine',
          'κρατίστην': 'la più eccellente',
          'νοῦς': 'intelletto, mente'
        },
        fonte: 'Aristotele, Etica Nicomachea, X, 7, 1177a'
      }
    ];
  }

  getBancaVersioniLatino() {
    return [
      {
        titolo: 'Il valore dell\'amicizia',
        autore: 'Cicerone',
        opera: 'De amicitia',
        introduzione: `Cicerone, nel dialogo sull'amicizia, espone attraverso le parole di Lelio l'importanza fondamentale dell'amicizia nella vita umana.`,
        testo: `Ego vos hortari tantum possum, ut amicitiam omnibus rebus humanis anteponatis; nihil est enim tam naturae aptum, tam conveniens ad res vel secundas vel adversas. Sed hoc primum sentio, nisi in bonis amicitiam esse non posse; neque id ad vivum reseco, ut illi qui haec subtilius disserunt, fortasse vere, sed ad communem utilitatem parum; negant enim quemquam esse virum bonum nisi sapientem. Sit ita sane; sed eam sapientiam interpretantur quam adhuc mortalis nemo est consecutus.`,
        note: {
          'ad vivum reseco': 'esamino minuziosamente',
          'disserunt': 'discutono',
          'sit ita sane': 'sia pure così'
        },
        fonte: 'Cicerone, Laelius de amicitia, 17-18'
      },
      {
        titolo: 'La clemenza del principe',
        autore: 'Seneca',
        opera: 'De clementia',
        introduzione: `Seneca, precettore di Nerone, illustra al giovane imperatore l'importanza della clemenza come virtù fondamentale del buon sovrano.`,
        testo: `Clementia ergo non tantum honestiores sed tutiores praestat ornamentumque imperiorum est simul et certissima salus. Quid enim est cur reges consenuerint liberisque ac nepotibus tradiderint regna, tyrannorum exsecrabilis ac brevis potestas sit? Quid interest inter tyrannum ac regem - species enim ipsa fortunae ac licentia par est - nisi quod tyranni in voluptate saeviunt, reges non nisi ex causa ac necessitate?`,
        note: {
          'consenuerint': 'siano invecchiati (sul trono)',
          'exsecrabilis': 'esecrabile, odiosa',
          'licentia': 'libertà di azione, potere'
        },
        fonte: 'Seneca, De clementia, I, 11, 4'
      },
      {
        titolo: 'L\'importanza della storia',
        autore: 'Livio',
        opera: 'Ab Urbe condita',
        introduzione: `Nella prefazione alla sua monumentale opera storica, Livio espone le ragioni che lo hanno spinto a narrare la storia di Roma dalle origini.`,
        testo: `Hoc illud est praecipue in cognitione rerum salubre ac frugiferum, omnis te exempli documenta in inlustri posita monumento intueri; inde tibi tuaeque rei publicae quod imitere capias, inde foedum inceptu, foedum exitu, quod vites. Ceterum aut me amor negotii suscepti fallit, aut nulla umquam res publica nec maior nec sanctior nec bonis exemplis ditior fuit.`,
        note: {
          'salubre ac frugiferum': 'salutare e fruttuoso',
          'documenta': 'insegnamenti, esempi',
          'foedum inceptu': 'turpe nel principio'
        },
        fonte: 'Livio, Ab Urbe condita, Praefatio, 10'
      }
    ];
  }

  getTipiQuesitiGreco() {
    return {
      comprensione: [
        'Analizza e commenta il contenuto del brano proposto, evidenziandone i nuclei tematici fondamentali e le connessioni con il contesto storico-culturale.',
        'Riassumi il contenuto del passo e individua la tesi principale sostenuta dall\'autore, spiegando come viene argomentata.',
        'Illustra il contesto storico-culturale in cui si colloca il brano e la sua rilevanza nell\'opera complessiva dell\'autore.',
        'Delinea la struttura argomentativa del testo, individuando premesse, sviluppo e conclusioni, e valutane l\'efficacia persuasiva.',
        'Spiega il significato del brano nel contesto dell\'opera da cui è tratto, evidenziando i riferimenti impliciti ed espliciti.',
        'Individua i personaggi o le figure evocate nel testo e analizza il loro ruolo nella costruzione del messaggio.',
        'Analizza il rapporto tra forma e contenuto nel brano, mostrando come le scelte espressive supportino il messaggio.',
        'Contestualizza il brano nel dibattito culturale e filosofico dell\'epoca, identificando eventuali posizioni polemiche.'
      ],
      analisi: [
        'Analizza le principali caratteristiche stilistiche del brano, con particolare riferimento all\'uso delle figure retoriche e alla loro funzione.',
        'Individua e commenta i principali fenomeni morfosintattici presenti nel testo, spiegandone il valore espressivo.',
        'Esamina il lessico utilizzato dall\'autore, evidenziandone i campi semantici prevalenti e le scelte terminologiche significative.',
        'Analizza la costruzione del periodo e le scelte sintattiche dell\'autore in relazione all\'efficacia espressiva e al genere letterario.',
        'Individua le particolarità dialettali o stilistiche del testo e commentale in relazione alla tradizione letteraria.',
        'Analizza l\'uso dei tempi verbali e degli aspetti nel brano, spiegandone la funzione narrativa o argomentativa.',
        'Esamina la struttura metrica (se presente) e il suo rapporto con il contenuto semantico.',
        'Commenta l\'uso delle particelle e dei connettivi, evidenziandone la funzione nella costruzione del discorso.'
      ],
      approfondimento: [
        'Confronta il tema trattato nel brano con altri passi dello stesso autore o di autori diversi che conosci, evidenziando analogie e differenze.',
        'Sviluppa una riflessione personale sul tema proposto, collegandolo alla tua esperienza di studio della civiltà greca e alla sua eredità culturale.',
        'Illustra l\'influenza del pensiero espresso nel brano sulla cultura occidentale successiva, con riferimenti specifici.',
        'Confronta la concezione espressa nel testo con le posizioni di altri autori greci sullo stesso tema, valutandone l\'originalità.',
        'Rifletti sulla permanenza o sulla trasformazione del tema trattato nella cultura contemporanea.',
        'Analizza come il genere letterario del brano influenzi la trattazione del tema e confrontalo con altri generi.',
        'Discuti la ricezione del testo o dell\'autore nella tradizione letteraria successiva.',
        'Proponi un\'interpretazione personale del brano, argomentandola con riferimenti testuali precisi.'
      ]
    };
  }

  getTipiQuesitiLatino() {
    return {
      comprensione: [
        'Analizza il contenuto del brano, mettendone in evidenza i concetti chiave e il messaggio dell\'autore nel contesto dell\'opera.',
        'Sintetizza il contenuto del passo e spiega quale problema o tema viene affrontato, evidenziando la posizione dell\'autore.',
        'Contestualizza il brano nell\'opera e nel pensiero dell\'autore, spiegando la sua funzione nell\'economia del testo.',
        'Individua e spiega i passaggi logici fondamentali dell\'argomentazione, valutandone la coerenza.',
        'Spiega il rapporto tra il brano e il contesto storico-politico in cui fu composto.',
        'Analizza le figure o i personaggi menzionati nel testo e il loro significato simbolico o storico.',
        'Illustra come il brano si inserisce nel genere letterario di appartenenza.',
        'Individua eventuali riferimenti intertestuali e spiegane la funzione.'
      ],
      analisi: [
        'Esamina le scelte stilistiche e retoriche dell\'autore, evidenziandone la funzione espressiva e il rapporto con il genere letterario.',
        'Analizza la struttura sintattica del periodo latino e le sue peculiarità, commentando l\'uso dell\'ipotassi e della paratassi.',
        'Commenta il lessico utilizzato e la sua efficacia comunicativa, individuando eventuali tecnicismi o arcaismi.',
        'Individua e analizza le figure retoriche presenti nel testo, spiegandone la funzione argomentativa o espressiva.',
        'Analizza l\'uso dei modi e dei tempi verbali, spiegandone il valore stilistico.',
        'Esamina la struttura del periodo, individuando proposizioni principali e subordinate e commentandone i rapporti.',
        'Commenta le scelte foniche e ritmiche del testo (se pertinenti) in relazione al contenuto.',
        'Analizza l\'uso dei pronomi, dei dimostrativi e dei connettivi nella costruzione del discorso.'
      ],
      approfondimento: [
        'Confronta il tema del brano con altri testi latini che affrontano lo stesso argomento, evidenziando continuità e innovazioni.',
        'Rifletti sull\'attualità del messaggio proposto dall\'autore latino, argomentando con riferimenti alla contemporaneità.',
        'Illustra come il tema trattato si inserisce nel contesto culturale romano e nel dibattito intellettuale dell\'epoca.',
        'Approfondisci il tema del brano facendo riferimento ad altri autori latini o greci, costruendo un percorso tematico.',
        'Discuti la fortuna del testo o dell\'autore nella tradizione letteraria occidentale.',
        'Analizza il rapporto tra il pensiero espresso nel brano e la tradizione filosofica greca.',
        'Rifletti sul valore educativo o morale del testo nella prospettiva dell\'autore e in quella contemporanea.',
        'Proponi un\'interpretazione personale del brano, supportandola con argomentazioni testuali.'
      ]
    };
  }
}

module.exports = { GeneratoreGrecoLatinoSimulazioni };
