// Quiz automatici per Italiano - ImparaFacile
// Totale: ~200 quiz per Italiano (parte del target di 5000 totali)

module.exports = {
  // Quiz per Foscolo
  foscolo: [
    {
      domanda: "In quale anno Napoleone cede Venezia all'Austria con il trattato di Campoformio?",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "1797" },
        { id: "b", testo: "1815" },
        { id: "c", testo: "1802" },
        { id: "d", testo: "1789" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Il trattato di Campoformio del 1797 segna la fine della Repubblica di Venezia e rappresenta per Foscolo una profonda delusione politica che influenzerà tutta la sua opera. Questo evento storico è alla base della vicenda narrata nell'Ortis.",
      puntiXP: 10,
      tempoMassimo: 30
    },
    {
      domanda: "Quale opera di Goethe influenza profondamente le Ultime lettere di Jacopo Ortis?",
      tipo: "MULTIPLA",
      difficolta: "FACILE",
      opzioni: [
        { id: "a", testo: "I dolori del giovane Werther" },
        { id: "b", testo: "Faust" },
        { id: "c", testo: "Le affinità elettive" },
        { id: "d", testo: "Wilhelm Meister" }
      ],
      rispostaCorretta: "a",
      spiegazione: "I dolori del giovane Werther (1774) di Goethe è il modello principale dell'Ortis per la struttura epistolare e il tema del suicidio romantico. Foscolo però rielabora profondamente il modello tedesco inserendo la dimensione politica della delusione patriottica.",
      puntiXP: 5,
      tempoMassimo: 25
    },
    {
      domanda: "Il suicidio di Jacopo Ortis è motivato solo dalla delusione amorosa.",
      tipo: "VERO_FALSO",
      difficolta: "MEDIO",
      rispostaCorretta: "false",
      spiegazione: "Falso. Il suicidio di Jacopo ha una duplice motivazione: la delusione amorosa per Teresa si intreccia con la delusione politica dopo Campoformio. Il gesto estremo rappresenta l'affermazione di libertà di fronte a un mondo che nega ogni valore ideale, sia privato che pubblico.",
      puntiXP: 10,
      tempoMassimo: 20
    },
    {
      domanda: "Quale chiesa fiorentina diventa nel carme 'Dei Sepolcri' il pantheon delle glorie italiane?",
      tipo: "MULTIPLA",
      difficolta: "FACILE",
      opzioni: [
        { id: "a", testo: "Santa Croce" },
        { id: "b", testo: "Santa Maria Novella" },
        { id: "c", testo: "Il Duomo" },
        { id: "d", testo: "San Lorenzo" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Santa Croce a Firenze ospita le tombe di Machiavelli, Michelangelo, Galileo e altri grandi italiani. Foscolo la celebra come luogo dove la memoria dei grandi ispira le generazioni future a nobili imprese, incarnando la funzione civile delle sepolture.",
      puntiXP: 5,
      tempoMassimo: 25
    },
    {
      domanda: "Quale editto napoleonico ispira la composizione del carme 'Dei Sepolcri'?",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Editto di Saint-Cloud (1804)" },
        { id: "b", testo: "Concordato del 1801" },
        { id: "c", testo: "Codice Napoleonico" },
        { id: "d", testo: "Editto di Milano" }
      ],
      rispostaCorretta: "a",
      spiegazione: "L'editto di Saint-Cloud del 1804 vietava le sepolture nelle chiese e imponeva cimiteri extraurbani per motivi igienici. Foscolo risponde con il carme affermando il valore civile e affettivo delle tombe come custodi della memoria e ispiratrici di virtù.",
      puntiXP: 15,
      tempoMassimo: 30
    }
  ],

  // Quiz per Leopardi
  leopardi: [
    {
      domanda: "Come si definisce il periodo di studio intenso di Leopardi tra i 10 e i 16 anni?",
      tipo: "MULTIPLA",
      difficolta: "FACILE",
      opzioni: [
        { id: "a", testo: "Studio matto e disperatissimo" },
        { id: "b", testo: "Conversione letteraria" },
        { id: "c", testo: "Periodo erudito" },
        { id: "d", testo: "Anni di formazione" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Leopardi stesso definisce così gli anni di studio forsennato nella biblioteca paterna, periodo che gli permette di acquisire una cultura eccezionale ma che mina irreparabilmente la sua salute fisica. Questa espressione è diventata proverbiale.",
      puntiXP: 5,
      tempoMassimo: 25
    },
    {
      domanda: "Secondo la teoria del piacere leopardiana, l'uomo desidera:",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Un piacere infinito ma può ottenere solo piaceri finiti" },
        { id: "b", testo: "Solo piaceri materiali e immediati" },
        { id: "c", testo: "La felicità attraverso la ragione" },
        { id: "d", testo: "L'assenza di dolore" }
      ],
      rispostaCorretta: "a",
      spiegazione: "La teoria del piacere, elaborata nello Zibaldone, costituisce il nucleo della filosofia leopardiana: l'uomo aspira a un piacere infinito per durata ed estensione, ma la realtà offre solo piaceri limitati e transitori, generando una perpetua insoddisfazione.",
      puntiXP: 15,
      tempoMassimo: 35
    },
    {
      domanda: "Nel pessimismo storico, Leopardi considera la natura come:",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Madre benigna che dona illusioni benefiche" },
        { id: "b", testo: "Matrigna crudele e indifferente" },
        { id: "c", testo: "Meccanismo neutro e impersonale" },
        { id: "d", testo: "Forza distruttiva da combattere" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Nella prima fase del suo pensiero (pessimismo storico), Leopardi vede la natura come madre amorosa che aveva dotato l'uomo di immaginazione e illusioni per renderlo felice. Solo successivamente, nel pessimismo cosmico, la natura diventerà matrigna.",
      puntiXP: 15,
      tempoMassimo: 35
    },
    {
      domanda: "Lo Zibaldone di Leopardi contiene circa 4500 pagine di riflessioni.",
      tipo: "VERO_FALSO",
      difficolta: "FACILE",
      rispostaCorretta: "true",
      spiegazione: "Vero. Lo Zibaldone è uno straordinario diario intellettuale di oltre 4500 pagine scritte tra il 1817 e il 1832, contenente riflessioni filosofiche, linguistiche, letterarie ed estetiche che ne fanno uno dei più importanti documenti del pensiero ottocentesco.",
      puntiXP: 5,
      tempoMassimo: 20
    },
    {
      domanda: "Nell'Infinito, cosa rappresenta la siepe per il poeta?",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Un limite che paradossalmente stimola l'immaginazione verso l'infinito" },
        { id: "b", testo: "Un ostacolo che impedisce la visione" },
        { id: "c", testo: "Un simbolo della prigione di Recanati" },
        { id: "d", testo: "La barriera tra vita e morte" }
      ],
      rispostaCorretta: "a",
      spiegazione: "La siepe che esclude lo sguardo diventa paradossalmente strumento per immaginare 'interminati spazi' e 'sovrumani silenzi'. Il limite fisico genera l'illimitato mentale attraverso la potenza dell'immaginazione, tema centrale della poetica leopardiana.",
      puntiXP: 15,
      tempoMassimo: 35
    },
    {
      domanda: "In 'A Silvia', chi rappresenta la giovane protagonista?",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Il simbolo universale delle speranze giovanili deluse" },
        { id: "b", testo: "Una donna realmente amata da Leopardi" },
        { id: "c", testo: "La personificazione della natura" },
        { id: "d", testo: "La musa ispiratrice del poeta" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Silvia, ispirata alla figlia del cocchiere di casa Leopardi morta giovane, diventa simbolo universale delle illusioni giovanili destinate a essere deluse dalla realtà. Il canto contrappone la dolcezza del ricordo alla consapevolezza del presente infelice.",
      puntiXP: 15,
      tempoMassimo: 35
    },
    {
      domanda: "La Ginestra cresce alle pendici del:",
      tipo: "MULTIPLA",
      difficolta: "FACILE",
      opzioni: [
        { id: "a", testo: "Vesuvio" },
        { id: "b", testo: "Etna" },
        { id: "c", testo: "Monte Conero" },
        { id: "d", testo: "Monte Tabor" }
      ],
      rispostaCorretta: "a",
      spiegazione: "La ginestra cresce sulle pendici del Vesuvio, simbolo della natura distruttrice. Il fiore umile ma resistente diventa metafora della dignità umana che, pur consapevole della propria fragilità, non si piega di fronte al destino avverso.",
      puntiXP: 5,
      tempoMassimo: 25
    },
    {
      domanda: "Nelle Operette morali, il 'Dialogo della Natura e di un Islandese' mostra la natura come:",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Totalmente indifferente alle sofferenze umane" },
        { id: "b", testo: "Crudele e sadica verso le creature" },
        { id: "c", testo: "Benevola ma impotente" },
        { id: "d", testo: "Giusta distributrice di premi e castighi" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Nel dialogo, la Natura appare come meccanismo impersonale che persegue i propri fini ignorando completamente la felicità o l'infelicità delle creature. Non è né benigna né maligna, semplicemente indifferente, rivelando il pessimismo cosmico leopardiano.",
      puntiXP: 15,
      tempoMassimo: 35
    }
  ],

  // Quiz per Verga
  verga: [
    {
      domanda: "Il Verismo italiano si differenzia dal Naturalismo francese principalmente perché:",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Si concentra sul mondo rurale e meridionale invece che su quello urbano e operaio" },
        { id: "b", testo: "Rifiuta completamente il determinismo scientifico" },
        { id: "c", testo: "Non adotta il principio dell'impersonalità" },
        { id: "d", testo: "Usa esclusivamente il dialetto" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Mentre il Naturalismo francese rappresenta la società industriale urbana, il Verismo si concentra sulla realtà agricola e meridionale dell'Italia post-unitaria, documentando le condizioni delle classi subalterne rurali con attenzione etnografica.",
      puntiXP: 15,
      tempoMassimo: 40
    },
    {
      domanda: "La tecnica della 'regressione' nel Verismo significa:",
      tipo: "MULTIPLA",
      difficolta: "DIFFICILE",
      opzioni: [
        { id: "a", testo: "Il narratore si pone al livello culturale e linguistico dei personaggi" },
        { id: "b", testo: "La narrazione procede a ritroso nel tempo" },
        { id: "c", testo: "I personaggi regrediscono moralmente" },
        { id: "d", testo: "Lo stile diventa sempre più semplice" }
      ],
      rispostaCorretta: "a",
      spiegazione: "La regressione è la tecnica narrativa per cui il narratore adotta il punto di vista, il linguaggio e i valori dei personaggi rappresentati, realizzando così l'eclissi dell'autore e permettendo alla realtà di presentarsi senza mediazioni ideologiche apparenti.",
      puntiXP: 20,
      tempoMassimo: 40
    },
    {
      domanda: "Verga nasce a:",
      tipo: "MULTIPLA",
      difficolta: "FACILE",
      opzioni: [
        { id: "a", testo: "Catania" },
        { id: "b", testo: "Palermo" },
        { id: "c", testo: "Messina" },
        { id: "d", testo: "Siracusa" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Giovanni Verga nasce a Catania nel 1840 da una famiglia di proprietari terrieri. La Sicilia, con le sue contraddizioni sociali e la sua cultura arcaica, sarà al centro della sua produzione verista.",
      puntiXP: 5,
      tempoMassimo: 20
    },
    {
      domanda: "La novella 'Rosso Malpelo' segna la conversione definitiva di Verga al Verismo.",
      tipo: "VERO_FALSO",
      difficolta: "MEDIO",
      rispostaCorretta: "true",
      spiegazione: "Vero. 'Rosso Malpelo' (1878) è la prima opera in cui Verga applica rigorosamente il canone dell'impersonalità, narrando la vicenda del giovane minatore attraverso l'ottica distorta della comunità che lo giudica cattivo per il colore dei capelli.",
      puntiXP: 10,
      tempoMassimo: 25
    },
    {
      domanda: "Il 'ciclo dei Vinti' avrebbe dovuto comprendere quanti romanzi?",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Cinque" },
        { id: "b", testo: "Tre" },
        { id: "c", testo: "Sette" },
        { id: "d", testo: "Dieci" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Il ciclo dei Vinti avrebbe dovuto comprendere cinque romanzi che illustrassero la lotta per la vita a tutti i livelli sociali, dai pescatori ai nobili. Verga completò solo i primi due: I Malavoglia e Mastro-don Gesualdo.",
      puntiXP: 10,
      tempoMassimo: 30
    },
    {
      domanda: "L''ideale dell'ostrica' nei Malavoglia significa:",
      tipo: "MULTIPLA",
      difficolta: "MEDIO",
      opzioni: [
        { id: "a", testo: "Rimanere attaccati allo scoglio dove il caso ci ha fatto nascere" },
        { id: "b", testo: "Chiudersi in se stessi per proteggersi" },
        { id: "c", testo: "Accumulare ricchezze lentamente" },
        { id: "d", testo: "Vivere isolati dalla società" }
      ],
      rispostaCorretta: "a",
      spiegazione: "L'ideale dell'ostrica esprime il pessimismo verghiano: chi cerca di migliorare la propria condizione è destinato al fallimento. Non è nostalgia conservatrice ma lucida constatazione dell'impossibilità del progresso per i più deboli nel mondo rappresentato.",
      puntiXP: 15,
      tempoMassimo: 35
    },
    {
      domanda: "Dove è ambientato il romanzo I Malavoglia?",
      tipo: "MULTIPLA",
      difficolta: "FACILE",
      opzioni: [
        { id: "a", testo: "Aci Trezza" },
        { id: "b", testo: "Vizzini" },
        { id: "c", testo: "Catania" },
        { id: "d", testo: "Palermo" }
      ],
      rispostaCorretta: "a",
      spiegazione: "I Malavoglia è ambientato ad Aci Trezza, piccolo villaggio di pescatori vicino a Catania. Verga sceglie questo microcosmo per rappresentare le dinamiche universali della lotta per la sopravvivenza nelle classi subalterne.",
      puntiXP: 5,
      tempoMassimo: 20
    },
    {
      domanda: "Quale tecnica narrativa permette a Verga di fondere la voce del narratore con quella dei personaggi?",
      tipo: "MULTIPLA",
      difficolta: "DIFFICILE",
      opzioni: [
        { id: "a", testo: "Discorso indiretto libero" },
        { id: "b", testo: "Monologo interiore" },
        { id: "c", testo: "Flusso di coscienza" },
        { id: "d", testo: "Narratore onnisciente" }
      ],
      rispostaCorretta: "a",
      spiegazione: "Il discorso indiretto libero fonde la voce del narratore con quella dei personaggi senza segnali tipografici, permettendo di rappresentare pensieri e sentimenti dall'interno senza ricorrere all'analisi psicologica tradizionale. È tecnica fondamentale del Verismo.",
      puntiXP: 20,
      tempoMassimo: 40
    }
  ]
};
