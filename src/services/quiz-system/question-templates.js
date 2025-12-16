/**
 * 📚 QUESTION TEMPLATES - 150+ Template Pedagogici Avanzati
 * Basati sulla Tassonomia di Bloom e standard universitari
 * 
 * Livelli:
 * 1. CONOSCENZA (Ricordare) - Domande dirette su fatti
 * 2. COMPRENSIONE (Capire) - Spiegare significati
 * 3. APPLICAZIONE (Applicare) - Usare in contesti nuovi
 * 4. ANALISI (Analizzare) - Scomporre e identificare relazioni
 * 5. SINTESI (Valutare) - Giudicare e argomentare
 * 6. VALUTAZIONE (Creare) - Produrre nuove idee
 */

const QuestionTemplates = {
  // ============================================================
  // LIVELLO 1: CONOSCENZA (Ricordare)
  // Domande che richiedono di richiamare informazioni
  // ============================================================
  conoscenza: {
    // --- DATE ---
    date: [
      {
        id: 'C_DATE_01',
        template: 'In che anno {soggetto} {azione}?',
        esempio: 'In che anno Foscolo nacque?',
        variabili: ['soggetto', 'azione'],
        tipoRisposta: 'anno',
        difficolta: 1
      },
      {
        id: 'C_DATE_02',
        template: 'Quando avvenne {evento}?',
        esempio: 'Quando avvenne il Trattato di Campoformio?',
        variabili: ['evento'],
        tipoRisposta: 'anno',
        difficolta: 1
      },
      {
        id: 'C_DATE_03',
        template: 'In quale periodo storico si colloca {evento}?',
        esempio: 'In quale periodo storico si colloca il Romanticismo italiano?',
        variabili: ['evento'],
        tipoRisposta: 'periodo',
        difficolta: 2
      },
      {
        id: 'C_DATE_04',
        template: '{evento} avvenne nel:',
        esempio: 'La pubblicazione dei "Sepolcri" avvenne nel:',
        variabili: ['evento'],
        tipoRisposta: 'anno',
        difficolta: 1
      },
      {
        id: 'C_DATE_05',
        template: 'L\'anno {anno} segna:',
        esempio: 'L\'anno 1861 segna:',
        variabili: ['anno'],
        tipoRisposta: 'evento',
        difficolta: 2
      },
      {
        id: 'C_DATE_06',
        template: 'Quale evento si verificò nel {anno}?',
        esempio: 'Quale evento si verificò nel 1789?',
        variabili: ['anno'],
        tipoRisposta: 'evento',
        difficolta: 2
      },
      {
        id: 'C_DATE_07',
        template: 'In che secolo visse {personaggio}?',
        esempio: 'In che secolo visse Leopardi?',
        variabili: ['personaggio'],
        tipoRisposta: 'secolo',
        difficolta: 1
      },
      {
        id: 'C_DATE_08',
        template: 'Qual è l\'anno di pubblicazione di "{opera}"?',
        esempio: 'Qual è l\'anno di pubblicazione de "I Promessi Sposi"?',
        variabili: ['opera'],
        tipoRisposta: 'anno',
        difficolta: 1
      }
    ],

    // --- PERSONAGGI ---
    personaggi: [
      {
        id: 'C_PERS_01',
        template: 'Chi scrisse "{opera}"?',
        esempio: 'Chi scrisse "I Sepolcri"?',
        variabili: ['opera'],
        tipoRisposta: 'autore',
        difficolta: 1
      },
      {
        id: 'C_PERS_02',
        template: 'Chi fu l\'autore di {opera}?',
        esempio: 'Chi fu l\'autore della "Coscienza di Zeno"?',
        variabili: ['opera'],
        tipoRisposta: 'autore',
        difficolta: 1
      },
      {
        id: 'C_PERS_03',
        template: 'Quale personaggio storico {azione}?',
        esempio: 'Quale personaggio storico firmò il Trattato di Campoformio?',
        variabili: ['azione'],
        tipoRisposta: 'persona',
        difficolta: 2
      },
      {
        id: 'C_PERS_04',
        template: 'Chi teorizzò {concetto}?',
        esempio: 'Chi teorizzò la teoria delle illusioni?',
        variabili: ['concetto'],
        tipoRisposta: 'persona',
        difficolta: 2
      },
      {
        id: 'C_PERS_05',
        template: 'A chi appartiene la frase: "{citazione}"?',
        esempio: 'A chi appartiene la frase: "Sempre caro mi fu quest\'ermo colle"?',
        variabili: ['citazione'],
        tipoRisposta: 'autore',
        difficolta: 2
      },
      {
        id: 'C_PERS_06',
        template: 'Chi compose {opera}?',
        esempio: 'Chi compose "All\'Italia"?',
        variabili: ['opera'],
        tipoRisposta: 'autore',
        difficolta: 1
      },
      {
        id: 'C_PERS_07',
        template: 'Di chi stiamo parlando: "{descrizione}"?',
        esempio: 'Di chi stiamo parlando: "Poeta nato a Zante, esule in Inghilterra"?',
        variabili: ['descrizione'],
        tipoRisposta: 'persona',
        difficolta: 2
      },
      {
        id: 'C_PERS_08',
        template: 'Chi fu maestro di {allievo}?',
        esempio: 'Chi fu maestro di Leopardi?',
        variabili: ['allievo'],
        tipoRisposta: 'persona',
        difficolta: 3
      }
    ],

    // --- LUOGHI ---
    luoghi: [
      {
        id: 'C_LUOG_01',
        template: 'Dove nacque {personaggio}?',
        esempio: 'Dove nacque Ugo Foscolo?',
        variabili: ['personaggio'],
        tipoRisposta: 'luogo',
        difficolta: 1
      },
      {
        id: 'C_LUOG_02',
        template: 'In quale città {personaggio} {azione}?',
        esempio: 'In quale città Dante compose la Commedia?',
        variabili: ['personaggio', 'azione'],
        tipoRisposta: 'luogo',
        difficolta: 2
      },
      {
        id: 'C_LUOG_03',
        template: 'Dove si svolge {opera}?',
        esempio: 'Dove si svolge "I Malavoglia"?',
        variabili: ['opera'],
        tipoRisposta: 'luogo',
        difficolta: 2
      },
      {
        id: 'C_LUOG_04',
        template: 'Dove morì {personaggio}?',
        esempio: 'Dove morì Foscolo?',
        variabili: ['personaggio'],
        tipoRisposta: 'luogo',
        difficolta: 2
      },
      {
        id: 'C_LUOG_05',
        template: 'Quale città è centrale in {opera}?',
        esempio: 'Quale città è centrale ne "I Promessi Sposi"?',
        variabili: ['opera'],
        tipoRisposta: 'luogo',
        difficolta: 2
      }
    ],

    // --- OPERE ---
    opere: [
      {
        id: 'C_OPER_01',
        template: 'Quale opera scrisse {autore} nel {anno}?',
        esempio: 'Quale opera scrisse Foscolo nel 1807?',
        variabili: ['autore', 'anno'],
        tipoRisposta: 'opera',
        difficolta: 2
      },
      {
        id: 'C_OPER_02',
        template: 'Qual è il titolo dell\'opera principale di {autore}?',
        esempio: 'Qual è il titolo dell\'opera principale di Manzoni?',
        variabili: ['autore'],
        tipoRisposta: 'opera',
        difficolta: 1
      },
      {
        id: 'C_OPER_03',
        template: 'Come si intitola il romanzo di {autore} su {tema}?',
        esempio: 'Come si intitola il romanzo di Verga sui pescatori siciliani?',
        variabili: ['autore', 'tema'],
        tipoRisposta: 'opera',
        difficolta: 2
      },
      {
        id: 'C_OPER_04',
        template: 'Quale raccolta poetica contiene "{poesia}"?',
        esempio: 'Quale raccolta poetica contiene "L\'Infinito"?',
        variabili: ['poesia'],
        tipoRisposta: 'opera',
        difficolta: 2
      },
      {
        id: 'C_OPER_05',
        template: 'Di che tipo di opera si tratta "{titolo}"?',
        esempio: 'Di che tipo di opera si tratta "I Sepolcri"?',
        variabili: ['titolo'],
        tipoRisposta: 'genere',
        difficolta: 2
      }
    ],

    // --- DEFINIZIONI ---
    definizioni: [
      {
        id: 'C_DEF_01',
        template: 'Cosa si intende per {termine}?',
        esempio: 'Cosa si intende per Romanticismo?',
        variabili: ['termine'],
        tipoRisposta: 'definizione',
        difficolta: 2
      },
      {
        id: 'C_DEF_02',
        template: 'Qual è la definizione corretta di {termine}?',
        esempio: 'Qual è la definizione corretta di Verismo?',
        variabili: ['termine'],
        tipoRisposta: 'definizione',
        difficolta: 2
      },
      {
        id: 'C_DEF_03',
        template: 'Il termine "{termine}" indica:',
        esempio: 'Il termine "Ermetismo" indica:',
        variabili: ['termine'],
        tipoRisposta: 'definizione',
        difficolta: 2
      },
      {
        id: 'C_DEF_04',
        template: 'Come viene definito {concetto} da {autore}?',
        esempio: 'Come viene definito il pessimismo da Leopardi?',
        variabili: ['concetto', 'autore'],
        tipoRisposta: 'definizione',
        difficolta: 3
      }
    ]
  },

  // ============================================================
  // LIVELLO 2: COMPRENSIONE (Capire)
  // Domande che richiedono di spiegare significati
  // ============================================================
  comprensione: {
    // --- SPIEGAZIONI ---
    spiegazioni: [
      {
        id: 'COMP_SPIEG_01',
        template: 'Perché {soggetto} {azione}?',
        esempio: 'Perché Foscolo andò in esilio?',
        variabili: ['soggetto', 'azione'],
        tipoRisposta: 'spiegazione',
        difficolta: 3
      },
      {
        id: 'COMP_SPIEG_02',
        template: 'Qual è il significato di {elemento} in {opera}?',
        esempio: 'Qual è il significato della siepe ne "L\'Infinito"?',
        variabili: ['elemento', 'opera'],
        tipoRisposta: 'spiegazione',
        difficolta: 3
      },
      {
        id: 'COMP_SPIEG_03',
        template: 'Cosa rappresenta {simbolo} nella poetica di {autore}?',
        esempio: 'Cosa rappresenta la sera nella poetica di Foscolo?',
        variabili: ['simbolo', 'autore'],
        tipoRisposta: 'spiegazione',
        difficolta: 3
      },
      {
        id: 'COMP_SPIEG_04',
        template: 'Spiega la funzione di {elemento} in {contesto}.',
        esempio: 'Spiega la funzione del coro nelle tragedie manzoniane.',
        variabili: ['elemento', 'contesto'],
        tipoRisposta: 'spiegazione',
        difficolta: 4
      },
      {
        id: 'COMP_SPIEG_05',
        template: 'Perché {opera} è considerata innovativa?',
        esempio: 'Perché "I Malavoglia" è considerato innovativo?',
        variabili: ['opera'],
        tipoRisposta: 'spiegazione',
        difficolta: 3
      }
    ],

    // --- PARAFRASI ---
    parafrasi: [
      {
        id: 'COMP_PARA_01',
        template: 'Qual è il significato della frase: "{citazione}"?',
        esempio: 'Qual è il significato della frase: "E naufragar m\'è dolce in questo mare"?',
        variabili: ['citazione'],
        tipoRisposta: 'parafrasi',
        difficolta: 3
      },
      {
        id: 'COMP_PARA_02',
        template: 'Come si può parafrasare: "{verso}"?',
        esempio: 'Come si può parafrasare: "Forse perché della fatal quiete"?',
        variabili: ['verso'],
        tipoRisposta: 'parafrasi',
        difficolta: 3
      },
      {
        id: 'COMP_PARA_03',
        template: 'Cosa intende l\'autore quando scrive: "{citazione}"?',
        esempio: 'Cosa intende Leopardi quando scrive: "A noi le fasce sparse"?',
        variabili: ['citazione'],
        tipoRisposta: 'spiegazione',
        difficolta: 4
      }
    ],

    // --- CONFRONTI ---
    confronti: [
      {
        id: 'COMP_CONF_01',
        template: 'Qual è la differenza tra {concetto1} e {concetto2}?',
        esempio: 'Qual è la differenza tra Romanticismo e Neoclassicismo?',
        variabili: ['concetto1', 'concetto2'],
        tipoRisposta: 'confronto',
        difficolta: 3
      },
      {
        id: 'COMP_CONF_02',
        template: 'In cosa {autore1} differisce da {autore2}?',
        esempio: 'In cosa Leopardi differisce da Foscolo?',
        variabili: ['autore1', 'autore2'],
        tipoRisposta: 'confronto',
        difficolta: 4
      },
      {
        id: 'COMP_CONF_03',
        template: 'Cosa accomuna {elemento1} e {elemento2}?',
        esempio: 'Cosa accomuna Verga e Capuana?',
        variabili: ['elemento1', 'elemento2'],
        tipoRisposta: 'confronto',
        difficolta: 3
      }
    ],

    // --- RIASSUNTI ---
    riassunti: [
      {
        id: 'COMP_RIAS_01',
        template: 'Qual è il tema principale di {opera}?',
        esempio: 'Qual è il tema principale de "I Sepolcri"?',
        variabili: ['opera'],
        tipoRisposta: 'tema',
        difficolta: 2
      },
      {
        id: 'COMP_RIAS_02',
        template: 'Di cosa tratta {opera}?',
        esempio: 'Di cosa tratta "Le ultime lettere di Jacopo Ortis"?',
        variabili: ['opera'],
        tipoRisposta: 'riassunto',
        difficolta: 2
      },
      {
        id: 'COMP_RIAS_03',
        template: 'Qual è l\'idea centrale di {testo/discorso}?',
        esempio: 'Qual è l\'idea centrale del "Discorso sopra lo stato presente..."?',
        variabili: ['testo/discorso'],
        tipoRisposta: 'idea',
        difficolta: 3
      }
    ]
  },

  // ============================================================
  // LIVELLO 3: APPLICAZIONE (Applicare)
  // Domande che richiedono di usare conoscenze in nuovi contesti
  // ============================================================
  applicazione: {
    // --- ESEMPI ---
    esempi: [
      {
        id: 'APPL_ES_01',
        template: 'Quale citazione esprime meglio {concetto}?',
        esempio: 'Quale citazione esprime meglio il pessimismo leopardiano?',
        variabili: ['concetto'],
        tipoRisposta: 'citazione',
        difficolta: 3
      },
      {
        id: 'APPL_ES_02',
        template: 'In quale opera si riscontra {elemento}?',
        esempio: 'In quale opera si riscontra il tema dell\'inetto?',
        variabili: ['elemento'],
        tipoRisposta: 'opera',
        difficolta: 3
      },
      {
        id: 'APPL_ES_03',
        template: 'Quale esempio dimostra {teoria/concetto}?',
        esempio: 'Quale esempio dimostra la teoria delle illusioni foscoliane?',
        variabili: ['teoria/concetto'],
        tipoRisposta: 'esempio',
        difficolta: 4
      },
      {
        id: 'APPL_ES_04',
        template: 'In quale brano {autore} applica {tecnica}?',
        esempio: 'In quale brano Verga applica il discorso indiretto libero?',
        variabili: ['autore', 'tecnica'],
        tipoRisposta: 'brano',
        difficolta: 4
      }
    ],

    // --- CONTESTI ---
    contesti: [
      {
        id: 'APPL_CONT_01',
        template: 'In quale contesto storico si colloca {opera/evento}?',
        esempio: 'In quale contesto storico si colloca "I Sepolcri"?',
        variabili: ['opera/evento'],
        tipoRisposta: 'contesto',
        difficolta: 3
      },
      {
        id: 'APPL_CONT_02',
        template: 'Come si manifesta {concetto} nell\'opera di {autore}?',
        esempio: 'Come si manifesta il materialismo nell\'opera di Foscolo?',
        variabili: ['concetto', 'autore'],
        tipoRisposta: 'spiegazione',
        difficolta: 4
      },
      {
        id: 'APPL_CONT_03',
        template: 'In quale situazione storica {autore} scrisse {opera}?',
        esempio: 'In quale situazione storica Manzoni scrisse "Marzo 1821"?',
        variabili: ['autore', 'opera'],
        tipoRisposta: 'contesto',
        difficolta: 3
      }
    ],

    // --- CLASSIFICAZIONI ---
    classificazioni: [
      {
        id: 'APPL_CLASS_01',
        template: 'A quale genere letterario appartiene {opera}?',
        esempio: 'A quale genere letterario appartiene "La coscienza di Zeno"?',
        variabili: ['opera'],
        tipoRisposta: 'genere',
        difficolta: 2
      },
      {
        id: 'APPL_CLASS_02',
        template: 'A quale corrente appartiene {autore}?',
        esempio: 'A quale corrente appartiene Giovanni Pascoli?',
        variabili: ['autore'],
        tipoRisposta: 'corrente',
        difficolta: 2
      },
      {
        id: 'APPL_CLASS_03',
        template: 'Quale figura retorica è presente in: "{verso}"?',
        esempio: 'Quale figura retorica è presente in: "E naufragar m\'è dolce"?',
        variabili: ['verso'],
        tipoRisposta: 'figura_retorica',
        difficolta: 3
      }
    ]
  },

  // ============================================================
  // LIVELLO 4: ANALISI (Analizzare)
  // Domande che richiedono di scomporre e identificare relazioni
  // ============================================================
  analisi: {
    // --- CAUSE ED EFFETTI ---
    causeEffetti: [
      {
        id: 'ANAL_CE_01',
        template: 'Quali fattori determinarono {evento/fenomeno}?',
        esempio: 'Quali fattori determinarono il pessimismo leopardiano?',
        variabili: ['evento/fenomeno'],
        tipoRisposta: 'analisi',
        difficolta: 4
      },
      {
        id: 'ANAL_CE_02',
        template: 'Quale fu la conseguenza di {evento}?',
        esempio: 'Quale fu la conseguenza del Trattato di Campoformio su Foscolo?',
        variabili: ['evento'],
        tipoRisposta: 'conseguenza',
        difficolta: 4
      },
      {
        id: 'ANAL_CE_03',
        template: 'Come {evento/influenza} determinò {risultato}?',
        esempio: 'Come la filosofia illuminista determinò il materialismo foscoliano?',
        variabili: ['evento/influenza', 'risultato'],
        tipoRisposta: 'analisi',
        difficolta: 5
      },
      {
        id: 'ANAL_CE_04',
        template: 'Perché {fenomeno} portò a {conseguenza}?',
        esempio: 'Perché il Verismo portò a una nuova rappresentazione della realtà?',
        variabili: ['fenomeno', 'conseguenza'],
        tipoRisposta: 'spiegazione',
        difficolta: 4
      }
    ],

    // --- STRUTTURA ---
    struttura: [
      {
        id: 'ANAL_STR_01',
        template: 'Come è strutturata {opera}?',
        esempio: 'Come è strutturata la Divina Commedia?',
        variabili: ['opera'],
        tipoRisposta: 'struttura',
        difficolta: 3
      },
      {
        id: 'ANAL_STR_02',
        template: 'Quali sono le parti principali di {opera}?',
        esempio: 'Quali sono le parti principali de "I Sepolcri"?',
        variabili: ['opera'],
        tipoRisposta: 'struttura',
        difficolta: 3
      },
      {
        id: 'ANAL_STR_03',
        template: 'Che metro usa {autore} in {opera}?',
        esempio: 'Che metro usa Foscolo nei Sepolcri?',
        variabili: ['autore', 'opera'],
        tipoRisposta: 'metro',
        difficolta: 3
      },
      {
        id: 'ANAL_STR_04',
        template: 'Quale schema rimico segue {poesia}?',
        esempio: 'Quale schema rimico segue il sonetto "Alla sera"?',
        variabili: ['poesia'],
        tipoRisposta: 'schema',
        difficolta: 3
      }
    ],

    // --- RELAZIONI ---
    relazioni: [
      {
        id: 'ANAL_REL_01',
        template: 'Qual è la relazione tra {elemento1} e {elemento2}?',
        esempio: 'Qual è la relazione tra Foscolo e Napoleone?',
        variabili: ['elemento1', 'elemento2'],
        tipoRisposta: 'relazione',
        difficolta: 4
      },
      {
        id: 'ANAL_REL_02',
        template: 'Come {autore1} influenzò {autore2}?',
        esempio: 'Come Rousseau influenzò Foscolo?',
        variabili: ['autore1', 'autore2'],
        tipoRisposta: 'influenza',
        difficolta: 4
      },
      {
        id: 'ANAL_REL_03',
        template: 'Che rapporto c\'è tra {opera1} e {opera2}?',
        esempio: 'Che rapporto c\'è tra "Ortis" e "Werther"?',
        variabili: ['opera1', 'opera2'],
        tipoRisposta: 'relazione',
        difficolta: 4
      },
      {
        id: 'ANAL_REL_04',
        template: 'Come si collega {concetto} a {movimento}?',
        esempio: 'Come si collega il titanismo al Romanticismo?',
        variabili: ['concetto', 'movimento'],
        tipoRisposta: 'collegamento',
        difficolta: 4
      }
    ],

    // --- IDENTIFICAZIONE ---
    identificazione: [
      {
        id: 'ANAL_ID_01',
        template: 'Identifica i temi principali di {opera}.',
        esempio: 'Identifica i temi principali de "I Promessi Sposi".',
        variabili: ['opera'],
        tipoRisposta: 'temi',
        difficolta: 4
      },
      {
        id: 'ANAL_ID_02',
        template: 'Quali elementi caratterizzano {poetica/stile}?',
        esempio: 'Quali elementi caratterizzano il Decadentismo?',
        variabili: ['poetica/stile'],
        tipoRisposta: 'elementi',
        difficolta: 4
      },
      {
        id: 'ANAL_ID_03',
        template: 'Cosa distingue {autore} dagli altri {movimento}?',
        esempio: 'Cosa distingue Leopardi dagli altri Romantici italiani?',
        variabili: ['autore', 'movimento'],
        tipoRisposta: 'distinzione',
        difficolta: 5
      }
    ]
  },

  // ============================================================
  // LIVELLO 5: SINTESI/VALUTAZIONE (Valutare)
  // Domande che richiedono giudizio critico
  // ============================================================
  valutazione: {
    // --- GIUDIZI ---
    giudizi: [
      {
        id: 'VAL_GIUD_01',
        template: 'Quale interpretazione di {opera/concetto} è più valida?',
        esempio: 'Quale interpretazione del pessimismo leopardiano è più valida?',
        variabili: ['opera/concetto'],
        tipoRisposta: 'valutazione',
        difficolta: 5
      },
      {
        id: 'VAL_GIUD_02',
        template: 'Valuta l\'importanza di {elemento} nel {contesto}.',
        esempio: 'Valuta l\'importanza dei Sepolcri nel Risorgimento.',
        variabili: ['elemento', 'contesto'],
        tipoRisposta: 'valutazione',
        difficolta: 5
      },
      {
        id: 'VAL_GIUD_03',
        template: 'Quale critica a {opera/autore} è più fondata?',
        esempio: 'Quale critica al Manzoni dei Promessi Sposi è più fondata?',
        variabili: ['opera/autore'],
        tipoRisposta: 'valutazione',
        difficolta: 5
      },
      {
        id: 'VAL_GIUD_04',
        template: 'Il contributo più significativo di {autore} fu:',
        esempio: 'Il contributo più significativo di Verga fu:',
        variabili: ['autore'],
        tipoRisposta: 'valutazione',
        difficolta: 4
      }
    ],

    // --- ARGOMENTAZIONI ---
    argomentazioni: [
      {
        id: 'VAL_ARG_01',
        template: 'Argomenta pro o contro: "{tesi}".',
        esempio: 'Argomenta pro o contro: "Leopardi fu un pessimista cosmico fin dall\'inizio".',
        variabili: ['tesi'],
        tipoRisposta: 'argomentazione',
        difficolta: 5
      },
      {
        id: 'VAL_ARG_02',
        template: 'Quali prove supportano {affermazione}?',
        esempio: 'Quali prove supportano l\'evoluzione del pessimismo leopardiano?',
        variabili: ['affermazione'],
        tipoRisposta: 'prove',
        difficolta: 5
      },
      {
        id: 'VAL_ARG_03',
        template: 'Come confuteresti {affermazione}?',
        esempio: 'Come confuteresti che Manzoni fu un autore solo religioso?',
        variabili: ['affermazione'],
        tipoRisposta: 'confutazione',
        difficolta: 5
      }
    ],

    // --- COLLEGAMENTI INTERDISCIPLINARI ---
    interdisciplinari: [
      {
        id: 'VAL_INTER_01',
        template: 'Come si collega {autore/opera} al contesto storico-filosofico del tempo?',
        esempio: 'Come si collega Leopardi al contesto filosofico del suo tempo?',
        variabili: ['autore/opera'],
        tipoRisposta: 'collegamento',
        difficolta: 5
      },
      {
        id: 'VAL_INTER_02',
        template: 'Quali paralleli esistono tra {italiano} e {straniero}?',
        esempio: 'Quali paralleli esistono tra Leopardi e Schopenhauer?',
        variabili: ['italiano', 'straniero'],
        tipoRisposta: 'paralleli',
        difficolta: 5
      },
      {
        id: 'VAL_INTER_03',
        template: 'Come {movimento_letterario} riflette {movimento_artistico/filosofico}?',
        esempio: 'Come il Decadentismo riflette la crisi dei valori positivisti?',
        variabili: ['movimento_letterario', 'movimento_artistico/filosofico'],
        tipoRisposta: 'riflessione',
        difficolta: 5
      }
    ]
  },

  // ============================================================
  // TIPI SPECIALI DI DOMANDE
  // ============================================================
  speciali: {
    // --- VERO/FALSO ---
    veroFalso: [
      {
        id: 'SPEC_VF_01',
        template: 'Vero o Falso: {affermazione}',
        esempio: 'Vero o Falso: Foscolo nacque a Venezia',
        variabili: ['affermazione'],
        tipoRisposta: 'booleano',
        difficolta: 1,
        richiedeGiustificazione: true
      },
      {
        id: 'SPEC_VF_02',
        template: 'È corretto affermare che {affermazione}?',
        esempio: 'È corretto affermare che Leopardi fu un poeta ottimista?',
        variabili: ['affermazione'],
        tipoRisposta: 'booleano',
        difficolta: 2,
        richiedeGiustificazione: true
      }
    ],

    // --- COMPLETAMENTO ---
    completamento: [
      {
        id: 'SPEC_COMP_01',
        template: 'Completa: "{frase_incompleta}"',
        esempio: 'Completa: "Foscolo nacque a ___"',
        variabili: ['frase_incompleta'],
        tipoRisposta: 'parola',
        difficolta: 1
      },
      {
        id: 'SPEC_COMP_02',
        template: 'Inserisci la parola mancante: "{frase}"',
        esempio: 'Inserisci la parola mancante: "I ___ sono un carme di Foscolo"',
        variabili: ['frase'],
        tipoRisposta: 'parola',
        difficolta: 2
      }
    ],

    // --- ABBINAMENTO ---
    abbinamento: [
      {
        id: 'SPEC_ABB_01',
        template: 'Abbina ogni autore alla sua opera principale',
        esempio: 'Foscolo → ?, Leopardi → ?, Manzoni → ?',
        variabili: ['lista_autori', 'lista_opere'],
        tipoRisposta: 'abbinamenti',
        difficolta: 2
      },
      {
        id: 'SPEC_ABB_02',
        template: 'Collega ogni concetto alla sua definizione',
        esempio: 'Verismo → ?, Decadentismo → ?',
        variabili: ['lista_concetti', 'lista_definizioni'],
        tipoRisposta: 'abbinamenti',
        difficolta: 3
      }
    ],

    // --- ORDINAMENTO ---
    ordinamento: [
      {
        id: 'SPEC_ORD_01',
        template: 'Ordina cronologicamente: {lista_eventi}',
        esempio: 'Ordina: Sepolcri, Ortis, Le Grazie',
        variabili: ['lista_eventi'],
        tipoRisposta: 'ordine',
        difficolta: 2
      },
      {
        id: 'SPEC_ORD_02',
        template: 'Metti in ordine di pubblicazione: {lista_opere}',
        esempio: 'Ordina: I Promessi Sposi, I Malavoglia, La coscienza di Zeno',
        variabili: ['lista_opere'],
        tipoRisposta: 'ordine',
        difficolta: 2
      }
    ],

    // --- CITAZIONE ---
    citazione: [
      {
        id: 'SPEC_CIT_01',
        template: 'Da quale opera è tratta questa citazione: "{citazione}"?',
        esempio: 'Da quale opera: "Sempre caro mi fu quest\'ermo colle"?',
        variabili: ['citazione'],
        tipoRisposta: 'opera',
        difficolta: 3
      },
      {
        id: 'SPEC_CIT_02',
        template: 'Riconosci l\'autore di: "{citazione}"',
        esempio: 'Chi scrisse: "Il naufragar m\'è dolce in questo mare"?',
        variabili: ['citazione'],
        tipoRisposta: 'autore',
        difficolta: 3
      }
    ],

    // --- ANALISI TESTO ---
    analisiTesto: [
      {
        id: 'SPEC_AT_01',
        template: 'Leggi il seguente brano e rispondi:\n\n"{brano}"\n\nQual è il tema principale?',
        esempio: '[Brano da L\'Infinito] Qual è il tema principale?',
        variabili: ['brano'],
        tipoRisposta: 'tema',
        difficolta: 4
      },
      {
        id: 'SPEC_AT_02',
        template: 'Analizza il seguente verso:\n\n"{verso}"\n\nQuali figure retoriche sono presenti?',
        esempio: 'Analizza: "e il naufragar m\'è dolce" - figure retoriche?',
        variabili: ['verso'],
        tipoRisposta: 'figure',
        difficolta: 4
      }
    ]
  }
};

/**
 * 🎯 Funzione per ottenere template per livello e categoria
 */
function getTemplatesByLevel(livello) {
  const livelloLower = livello.toLowerCase();
  return QuestionTemplates[livelloLower] || null;
}

/**
 * 📊 Conta totale template
 */
function contaTotaleTemplate() {
  let totale = 0;
  
  for (const livello of Object.values(QuestionTemplates)) {
    for (const categoria of Object.values(livello)) {
      if (Array.isArray(categoria)) {
        totale += categoria.length;
      }
    }
  }
  
  return totale;
}

/**
 * 🎲 Ottieni template casuale per livello
 */
function getRandomTemplate(livello, categoria = null) {
  const templates = QuestionTemplates[livello];
  if (!templates) return null;
  
  if (categoria && templates[categoria]) {
    const lista = templates[categoria];
    return lista[Math.floor(Math.random() * lista.length)];
  }
  
  // Categoria random
  const categorie = Object.keys(templates);
  const catRandom = categorie[Math.floor(Math.random() * categorie.length)];
  const lista = templates[catRandom];
  
  if (Array.isArray(lista)) {
    return lista[Math.floor(Math.random() * lista.length)];
  }
  
  return null;
}

/**
 * 📋 Ottieni tutti i template per una difficoltà specifica
 */
function getTemplatesByDifficulty(difficoltaMin, difficoltaMax) {
  const risultati = [];
  
  for (const [livello, categorie] of Object.entries(QuestionTemplates)) {
    for (const [categoria, templates] of Object.entries(categorie)) {
      if (Array.isArray(templates)) {
        for (const template of templates) {
          if (template.difficolta >= difficoltaMin && template.difficolta <= difficoltaMax) {
            risultati.push({
              ...template,
              livello,
              categoria
            });
          }
        }
      }
    }
  }
  
  return risultati;
}

// Statistiche
console.log(`📚 QuestionTemplates caricati: ${contaTotaleTemplate()} template totali`);

module.exports = {
  QuestionTemplates,
  getTemplatesByLevel,
  getRandomTemplate,
  getTemplatesByDifficulty,
  contaTotaleTemplate
};
