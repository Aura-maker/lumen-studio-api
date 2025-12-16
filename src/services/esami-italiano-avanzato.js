// 🎓 GENERATORE ESAMI ITALIANO AVANZATO - Livello Ministeriale
// Basato sui veri esami di Stato del Ministero dell'Istruzione

class GeneratoreEsamiItalianoAvanzato {
  constructor() {
    this.esami = [];
    this.autoriComplessi = this.inizializzaAutoriComplessi();
    this.temiAvanzati = this.inizializzaTemiAvanzati();
  }

  inizializzaAutoriComplessi() {
    return {
      // AUTORI MINISTERIALI CON COMPLESSITÀ REALE
      dante: {
        opere: ['Inferno', 'Purgatorio', 'Paradiso', 'Vita Nova', 'Convivio'],
        temi: ['viaggio ultraterreno', 'allegoria politica', 'teologia medievale', 'amor cortese', 'linguaggio poetico'],
        citazioni: [
          '"Nel mezzo del cammin di nostra vita / mi ritrovai per una selva oscura"',
          '"Amor che a nullo amato amar perdona"',
          '"E quindi uscimmo a riveder le stelle"'
        ]
      },
      leopardi: {
        opere: ['Canti', 'Operette morali', 'Zibaldone', 'Pensieri'],
        temi: ['pessimismo cosmico', 'teoria del piacere', 'natura matrigna', 'illusioni giovanili', 'infinito'],
        citazioni: [
          '"Sempre caro mi fu quest\'ermo colle"',
          '"Il naufragar m\'è dolce in questo mare"',
          '"Natura! o natura! / Perché non rendi poi / quel che prometti allor?"'
        ]
      },
      manzoni: {
        opere: ['I Promessi Sposi', 'Inni Sacri', 'Tragedie', 'Odi civili'],
        temi: ['Provvidenza divina', 'questione linguistica', 'romanzo storico', 'morale cattolica', 'umili'],
        citazioni: [
          '"Quel ramo del lago di Como"',
          '"AI posteri l\'ardua sentenza"',
          '"La storia è una guerra contro il tempo"'
        ]
      },
      verga: {
        opere: ['I Malavoglia', 'Mastro-don Gesualdo', 'Vita dei campi', 'Novelle rusticane'],
        temi: ['verismo', 'darwinismo sociale', 'regressione', 'impersonalità', 'ciclo dei vinti'],
        citazioni: [
          '"La fiumana del progresso"',
          '"Ogni cosa ha il suo prezzo"',
          '"Roba mia, vientene con me!"'
        ]
      },
      pirandello: {
        opere: ['Il fu Mattia Pascal', 'Uno, nessuno e centomila', 'Sei personaggi in cerca d\'autore'],
        temi: ['crisi dell\'identità', 'relativismo', 'umorismo', 'maschera e volto', 'teatro nel teatro'],
        citazioni: [
          '"Io sono colui che sono"',
          '"La vita è una molto triste buffonata"',
          '"Noi crediamo di conoscere noi stessi; ma è un\'illusione"'
        ]
      },
      montale: {
        opere: ['Ossi di seppia', 'Le occasioni', 'La bufera e altro', 'Satura'],
        temi: ['correlativo oggettivo', 'male di vivere', 'varco', 'donna salvifica', 'paesaggio ligure'],
        citazioni: [
          '"Spesso il male di vivere ho incontrato"',
          '"Non chiederci la parola che squadri da ogni lato"',
          '"Codesto solo oggi possiamo dirti, / ciò che non siamo, ciò che non vogliamo"'
        ]
      }
    };
  }

  inizializzaTemiAvanzati() {
    return {
      // TIPOLOGIE A - ANALISI DEL TESTO
      analisi_poetica: {
        difficolta: 'ministeriale',
        struttura: 'comprensione + analisi + interpretazione + approfondimento',
        competenze: ['analisi stilistica', 'contestualizzazione', 'interpretazione critica']
      },
      analisi_prosa: {
        difficolta: 'ministeriale', 
        struttura: 'comprensione + analisi + interpretazione + approfondimento',
        competenze: ['analisi narratologica', 'tecniche narrative', 'ideologia dell\'autore']
      },

      // TIPOLOGIE B - TESTO ARGOMENTATIVO
      saggio_breve: {
        difficolta: 'ministeriale',
        struttura: 'tesi + antitesi + sintesi + fonti',
        competenze: ['argomentazione', 'uso delle fonti', 'coerenza logica']
      },
      articolo_giornalistico: {
        difficolta: 'ministeriale',
        struttura: 'lead + corpo + conclusione + registro',
        competenze: ['scrittura giornalistica', 'attualità', 'pubblico target']
      },

      // TIPOLOGIE C - TEMA ESPOSITIVO-ARGOMENTATIVO
      tema_storico: {
        difficolta: 'ministeriale',
        struttura: 'contestualizzazione + analisi + valutazione',
        competenze: ['conoscenze storiche', 'collegamenti', 'giudizio critico']
      },
      tema_attualita: {
        difficolta: 'ministeriale',
        struttura: 'problematizzazione + argomentazione + proposte',
        competenze: ['attualità', 'senso critico', 'cittadinanza attiva']
      }
    };
  }

  genera(numeroEsami = 50) {
    console.log(`🎓 Generazione ${numeroEsami} esami Italiano AVANZATI (livello ministeriale)...`);
    
    for (let i = 1; i <= numeroEsami; i++) {
      this.esami.push({
        id: `ITA_ADV_${i}`,
        titolo: `Simulazione Italiano Avanzata ${i}`,
        sottotitolo: `Prima Prova Scritta - Sessione ${2024 + Math.floor(i/10)}`,
        durata: 360, // 6 ore come negli esami reali
        istruzioni: this.generaIstruzioniRealistiche(),
        struttura: {
          tipologie: 3,
          tracce: 7,
          daRisolvere: 1,
          punteggioTotale: 100
        },
        tracce: this.generaTracceComplete(i),
        metadata: {
          difficolta: 'ministeriale',
          tipologie: ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2'],
          competenze: this.getCompetenzeTestate(i)
        }
      });
    }
    
    console.log(`✅ ${this.esami.length} esami Italiano AVANZATI pronti!`);
    return this.esami;
  }

  generaIstruzioniRealistiche() {
    const istruzioni = [
      'Svolgi la prova, scegliendo tra una delle seguenti proposte. TIPOLOGIA A - ANALISI E INTERPRETAZIONE DI UN TESTO LETTERARIO ITALIANO. TIPOLOGIA B - ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO. TIPOLOGIA C - RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ.',
      'Durata massima della prova: 6 ore. È consentito l\'uso del dizionario italiano e del dizionario bilingue (italiano-lingua del paese di provenienza) per i candidati di madrelingua non italiana.',
      'Non è consentito lasciare l\'Istituto prima che siano trascorse 3 ore dalla consegna delle tracce.'
    ];
    return istruzioni[Math.floor(Math.random() * istruzioni.length)];
  }

  generaTracceComplete(n) {
    return [
      // TIPOLOGIA A1 - ANALISI POETICA
      this.generaAnalisiPoetica(n, 1),
      // TIPOLOGIA A2 - ANALISI PROSA  
      this.generaAnalisiProsa(n, 2),
      // TIPOLOGIA B1 - TESTO ARGOMENTATIVO
      this.generaSaggioBreveTecnologia(n, 3),
      // TIPOLOGIA B2 - TESTO ARGOMENTATIVO
      this.generaArticoloGiornalistico(n, 4),
      // TIPOLOGIA B3 - TESTO ARGOMENTATIVO
      this.generaTestoArgomentativo(n, 5),
      // TIPOLOGIA C1 - RIFLESSIONE CRITICA
      this.generaTemaStorico(n, 6),
      // TIPOLOGIA C2 - RIFLESSIONE CRITICA
      this.generaTemaAttualita(n, 7)
    ];
  }

  generaAnalisiPoetica(n, traccia) {
    const autoriReali = [
      {
        nome: 'Pier Paolo Pasolini',
        anni: '1922-1975',
        opera: 'Appendice I a «Dal diario» (1943-1944)',
        fonte: 'in Tutte le poesie, tomo I, a cura di Walter Siti, Mondadori, Milano, 2009',
        testo: `Mi ritrovo in questa stanza col volto di ragazzo, e adolescente, e ora uomo. Ma intorno a me non muta il silenzio e il biancore sopra i muri e l'acque; annotta da millenni un medesimo mondo. Ma è mutato il cuore; e dopo poche notti è stinta tutta quella luce che dal cielo riarde la campagna, e mille lune non son bastate a illudermi di un tempo che veramente fosse mio. Un breve arco segna in cielo la luna. Volgo il capo e la vedo discesa, e ferma, come inesistente nella stanca luce. E così la rispecchia la campagna scura e serena. Credo tutto esausto di quel perfetto inganno: ed ecco pare farsi nuova la luna, e – all'improvviso – cantare quieti i grilli il canto antico.`,
        contesto: 'La poesia proposta, priva di titolo, come sovente si riscontra nella vasta produzione poetica di Pier Paolo Pasolini (1922-1975), è testimonianza del complesso e ricco itinerario letterario che l\'autore ha percorso fin dagli anni della sua giovinezza. Questa poesia, composta nei primi anni \'40, rappresenta una riflessione profondamente intima e appare ancora molto lontana dai più noti componimenti civilmente impegnati dell\'autore.'
      },
      {
        nome: 'Giuseppe Ungaretti',
        anni: '1888-1970',
        opera: 'Soldati',
        fonte: 'da L\'Allegria, Mondadori, Milano, 1942',
        testo: `Si sta come d'autunno sugli alberi le foglie`,
        contesto: 'Questa brevissima poesia di Giuseppe Ungaretti, scritta nel 1918, rappresenta una delle vette della poesia italiana del Novecento. Composta durante la Prima Guerra Mondiale, esprime con estrema sintesi la precarietà della condizione umana in tempo di guerra.'
      },
      {
        nome: 'Eugenio Montale',
        anni: '1896-1981',
        opera: 'Spesso il male di vivere ho incontrato',
        fonte: 'da Ossi di seppia, Mondadori, Milano, 1925',
        testo: `Spesso il male di vivere ho incontrato: era il rivo strozzato che gorgoglia, era l'incartocciarsi della foglia riarsa, era il cavallo stramazzato. Bene non seppi, fuori del prodigio che schiude la divina Indifferenza: era la statua nella sonnolenza del meriggio, e la nuvola, e il falco alto levato.`,
        contesto: 'Questa lirica di Eugenio Montale, tratta dalla raccolta "Ossi di seppia" (1925), rappresenta una delle più significative espressioni del "male di vivere" montaliano, tema centrale della sua poetica giovanile.'
      }
    ];

    const autoreScelta = autoriReali[n % autoriReali.length];
    
    return {
      tipologia: 'A1',
      titolo: `ANALISI E INTERPRETAZIONE DI UN TESTO LETTERARIO ITALIANO`,
      sottotitolo: `PROPOSTA A1`,
      autore: autoreScelta.nome,
      anni: autoreScelta.anni,
      opera: autoreScelta.opera,
      fonte: autoreScelta.fonte,
      testo: autoreScelta.testo,
      contesto: autoreScelta.contesto,
      comprensione: [
        'Presenta sinteticamente il contenuto della poesia e individua le figure di stile ricorrenti.',
        'Individua, mediante riferimenti precisi al testo proposto, la relazione tra la vita della natura e la vita del poeta.',
        'Analizza la metafora centrale della poesia e il suo significato.',
        'Quale messaggio sulla condizione umana emerge da questa brevissima composizione?'
      ],
      interpretazione: `In questa poesia l'autore osserva la natura mettendola in relazione con la propria esistenza. Facendo riferimento alla produzione poetica di ${autoreScelta.nome} o di altri autori o ad altre forme d'arte a te noti, elabora una tua personale riflessione sulle modalità con cui la letteratura e/o altre arti trattano il tema del trascorrere del tempo e della relazione con la natura.`,
      istruzioni: 'Puoi rispondere punto per punto oppure costruire un unico discorso che comprenda le risposte a tutte le domande proposte.',
      punteggio: 20
    };
  }

  generaAnalisiProsa(n, traccia) {
    const autoriReali = [
      {
        nome: 'Giuseppe Tomasi di Lampedusa',
        anni: '1896-1957',
        opera: 'Il Gattopardo',
        fonte: 'prefazione di Giorgio Bassani, Feltrinelli, Milano, 1962, pp. 166-168',
        testo: `«La prima visita di Angelica alla famiglia Salina, da fidanzata, si era svolta regolata da una regía impeccabile. Il contegno della ragazza era stato perfetto a tal punto che sembrava suggerito parola per parola da Tancredi; ma le comunicazioni lente del tempo rendevano insostenibile questa eventualità e si fu costretti a ricorrere ad una ipotesi: a quella di suggerimenti anteriori allo stesso fidanzamento ufficiale: ipotesi arrischiata anche per chi meglio conoscesse la preveggenza del principino, ma non del tutto assurda. Angelica giunse alle sei di sera, in bianco e rosa; le soffici treccie nere ombreggiate da una grande paglia¹ ancora estiva sulla quale grappoli d'uva artificiali e spighe dorate evocavano discrete i vigneti di Gibildolce ed i granai di Settesoli. In sala d'ingresso piantò lí il padre; nello sventolio dell'ampia gonna salí leggera i non pochi scalini della scala interna e si gettò nelle braccia di don Fabrizio: gli diede, sulle basette, due bei bacioni che furono ricambiati con genuino affetto; il Principe si attardò forse un attimo piú del necessario a fiutare l'aroma di gardenia delle guancie adolescenti. Dopo di che Angelica arrossí, retrocedette di mezzo passo: "Sono tanto, tanto felice …" Si avvicinò di nuovo e, ritta sulla punta delle scarpine, gli sospirò all'orecchio: "Zione!": felicissimo gag […] e che, esplicito e segreto com'era, mandò in visibilio il cuore semplice del Principe e lo aggiogò definitivamente alla bella figliola. Don Calogero intanto saliva la scala e andava dicendo quanto dolente fosse sua moglie di non poter essere lí, ma ieri sera aveva inciampato in casa e si era prodotta una distorsione al piede sinistro, assai dolorosa. "Ha il collo del piede come una melanzana, Principe." Don Fabrizio esilarato dalla carezza verbale […] si passò il piacere di andare lui stesso subito dalla signora Sedàra, proposta che sbigottí don Calogero che fu costretto, per respingerla, ad appioppare un secondo malanno alla consorte, una emicrania questa volta, che costringeva la poveretta a stare nell'oscurità.»`,
        contesto: 'Il romanzo Il Gattopardo di Giuseppe Tomasi di Lampedusa (1896 – 1957), pubblicato postumo nel 1958, narra i mutamenti avvenuti in Sicilia a partire dallo sbarco di Garibaldi sull\'isola e il lento declino dell\'aristocrazia borbonica, attraverso le vicende della nobile famiglia del protagonista, don Fabrizio Corbera, principe di Salina.',
        note: '1. paglia: cappello a larghe tese, confezionato con steli di paglia intrecciati.'
      }
    ];

    const autoreScelta = autoriReali[n % autoriReali.length];
    
    return {
      tipologia: 'A2',
      titolo: 'ANALISI E INTERPRETAZIONE DI UN TESTO LETTERARIO ITALIANO',
      sottotitolo: `PROPOSTA A2`,
      autore: autoreScelta.nome,
      anni: autoreScelta.anni,
      opera: autoreScelta.opera,
      fonte: autoreScelta.fonte,
      testo: autoreScelta.testo,
      contesto: autoreScelta.contesto,
      note: autoreScelta.note,
      comprensione: [
        'Riassumi il contenuto del brano.',
        'Individua e analizza le differenti modalità attraverso le quali Tomasi di Lampedusa presenta i tre personaggi protagonisti di questa scena.',
        'Illustra con precisi riferimenti al testo i rispettivi atteggiamenti di Angelica e di don Calogero nei confronti del Principe di Salina.',
        'In quale punto del brano e con quale accorgimento linguistico l\'autore rende evidente che don Calogero sta mentendo sulle reali condizioni della moglie?'
      ],
      interpretazione: `Sulla base dell'analisi da te condotta, approfondisci l'interpretazione complessiva del brano, elaborando una tua riflessione più generale relativa ai contraddittori rapporti tra aristocrazia e borghesia e sulle inquietudini più profonde che vengono a determinarsi nei periodi di cambiamenti politici.`,
      istruzioni: 'Puoi rispondere punto per punto oppure costruire un unico discorso che comprenda le risposte a tutte le domande proposte.',
      punteggio: 20
    };
  }

  generaSaggioBreveTecnologia(n, traccia) {
    const testiReali = [
      {
        titolo: 'TIPOLOGIA B – ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
        sottotitolo: 'PROPOSTA B1',
        fonte: 'Testo tratto da: Piers Brendon, Gli anni trenta. Il decennio che sconvolse il mondo, Carocci editore, Roma, 2005, pp. 216-217.',
        testo: `«Nella messa in pratica del New Deal, la prima preoccupazione del presidente era di intervenire sul cuore finanziario dell'intera questione: salvare le banche e ricominciare nuovamente a pompare denaro nel circuito mediante le arterie nazionali. Fu indetta una seduta speciale del Congresso e venne proclamata una chiusura delle banche a livello nazionale. Per alcuni giorni gli americani dovettero vivere di titoli cartacei, monete emesse da privati, banconote e monete straniere, gettoni telefonici, francobolli, tagliandi di sigarette, baratti e prestiti. Nel frattempo, dal momento che una nazionalizzazione delle banche era fuori discussione, si preparò una legislazione di emergenza [...]. Si autorizzava il sostegno federale per le banche solide, mentre al contempo si autorizzavano gli ispettori governativi a controllare le altre banche e tenere chiuse quelle insolventi (un ulteriore provvedimento, firmato in giugno, garantiva i depositi bancari). Per contribuire al ripristino della fiducia, Roosevelt indisse una conferenza stampa (la prima delle circa 1.000 da lui tenute come presidente), impressionando a tal punto i giornalisti, grazie alla sua schiettezza e alla sua verve, che alla fine questi scoppiarono in un applauso. Tenne anche il primo dei suoi discorsi radiofonici alla nazione. Fu un tour de force, chiaro, disinvolto, diretto e condotto con una voce ipnotizzante esattamente al ritmo giusto. [...] Il presidente concluse il suo discorso con queste parole: «Insieme non possiamo fallire». Quando le banche riaprirono i battenti, i depositi furono superiori ai prelevamenti di fondi. In aprile l'anemia finanziaria era scongiurata: più di un miliardo di dollari aveva abbandonato le scorte private per fare ritorno nelle camere di sicurezza delle banche.»`,
        comprensione: [
          'Sintetizza il contenuto del brano proposto.',
          'Individua le motivazioni che indussero Roosevelt ad affrontare la situazione di emergenza e illustra le difficoltà affrontate dai cittadini sia pure solo per alcuni giorni.',
          'Quale ruolo svolsero gli ispettori governativi?',
          'In che modo il presidente statunitense riuscì a infondere nel popolo americano la speranza di superare la crisi economica e sociale che aveva messo in ginocchio la nazione?'
        ],
        produzione: 'Sulla base degli spunti di riflessione offerti dal testo proposto, delle tue letture, informazioni e conoscenze sull\'argomento e delle tue opinioni personali, elabora un testo centrato sul rapporto tra i leader politici e i cittadini attraverso i mezzi di comunicazione di massa attuali (radio, televisione, testate giornalistiche, social media). Sviluppa in modo organico le tue argomentazioni, elaborando un testo coerente e coeso.'
      }
    ];
    
    const testoScelta = testiReali[n % testiReali.length];
    
    return {
      tipologia: 'B1',
      titolo: testoScelta.titolo,
      sottotitolo: testoScelta.sottotitolo,
      fonte: testoScelta.fonte,
      testo: testoScelta.testo,
      comprensione: testoScelta.comprensione,
      produzione: testoScelta.produzione,
      istruzioni: 'Puoi rispondere punto per punto oppure costruire un unico discorso che comprenda le risposte a tutte le domande proposte.',
      punteggio: 20
    };
  }

  generaArticoloGiornalistico(n, traccia) {
    const testiReali = [
      {
        titolo: 'TIPOLOGIA B – ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
        sottotitolo: 'PROPOSTA B2',
        fonte: 'Testo tratto da: Riccardo Maccioni, "Rispetto" è la parola dell\'anno Treccani. E serve per respirare, in Avvenire, martedì 17 dicembre 2024.',
        testo: `«Una parola che esprime attenzione, gusto dell'incontro, stima. Che anche quando introduce un attacco verbale, non alza i toni del discorso, anzi sembra voler prendere le distanze da quanto sarà detto subito dopo. L'Istituto dell'Enciclopedia Italiana Treccani ha scelto "rispetto" come parola del 2024. Una decisione che sembra un auspicio, che porta con sé il desiderio di costruire, di usare il dizionario non per demolire chi abbiamo di fronte ma per provare a capirne le ricchezze, le potenzialità. Perché se è vero che le parole possono essere pietre, è altrettanto giusto sottolineare come siano in grado di diventare il cemento necessario a edificare case solide e confortevoli, la colla capace di tenere insieme una relazione a rischio di rottura. «Il termine rispetto, continuazione del latino respectus – spiegano Valeria Della Valle e Giuseppe Patota, condirettori del Vocabolario Treccani – va oggi rivalutato e usato in tutte le sue sfumature, proprio perché la mancanza di rispetto è alla base della violenza esercitata quotidianamente nei confronti delle donne, delle minoranze, delle istituzioni, della natura e del mondo animale». E la conferma arriva proprio dai termini che rimandano al significato opposto, tutti concetti orientati a distruggere le relazioni, a demolire gli altri: indifferenza (che spesso fa più male dell'odio), noncuranza, sufficienza fino ad arrivare all'insolenza, al disprezzo, allo spregio. […] Rispettare è tutt'altro, affonda le sue radici in respicere che, letteralmente significa guardare di nuovo, guardare indietro, cioè richiama il dovere di non cedere alla smania del giudizio immediato figlio dell'emotività, che non tiene conto delle storie delle persone, delle loro battaglie interiori. Occorre, invece, allenarsi alla bellezza del prendersi cura, del fare attenzione, del preoccuparsi per la vita altrui, così che la comunità possa crescere in armonia facendo assaporare in chi ne fa parte il gusto dell'appartenenza alla medesima famiglia umana.»`,
        comprensione: [
          'Riassumi il contenuto del testo nei suoi snodi tematici essenziali.',
          'Con quali argomenti l\'autore sostiene l\'importanza del \'rispetto\'?',
          'Il testo proposto si sofferma su parole e atteggiamenti che quotidianamente negano il rispetto: riportane gli esempi più significativi.',
          'Individua quali sono, a parere di Maccioni, gli atteggiamenti concreti per opporsi alla mancanza di rispetto.'
        ],
        produzione: 'Sulla base delle tue conoscenze, delle tue esperienze e della tua sensibilità, confrontati criticamente con il contenuto del brano proposto ed elabora un testo nel quale sviluppi il tuo punto di vista sulla tematica trattata, motivando le tue riflessioni. Organizza il tuo elaborato in modo tale che gli snodi della tua esposizione siano organizzati in un testo coerente e coeso.'
      }
    ];
    
    const testoScelta = testiReali[n % testiReali.length];
    
    return {
      tipologia: 'B2',
      titolo: testoScelta.titolo,
      sottotitolo: testoScelta.sottotitolo,
      fonte: testoScelta.fonte,
      testo: testoScelta.testo,
      comprensione: testoScelta.comprensione,
      produzione: testoScelta.produzione,
      istruzioni: 'Puoi rispondere punto per punto oppure costruire un unico discorso che comprenda le risposte a tutte le domande proposte.',
      punteggio: 20
    };
  }

  generaTestoArgomentativo(n, traccia) {
    const testiReali = [
      {
        titolo: 'TIPOLOGIA B – ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
        sottotitolo: 'PROPOSTA B3',
        fonte: 'Tratto da: Telmo Pievani, Un quarto d\'era (geologica) di celebrità, in Sotto il vulcano, Feltrinelli, Milano, 2022, pp. 30-31.',
        testo: `«I nostri successori studieranno l'Antropocene e capiranno il vicolo cieco in cui ci siamo infilati. […] Le firme sedimentarie dell'attività umana negli ultimi decenni del Novecento sono tali e tante che anche il più tonto dei geologi del futuro non potrà non vederle. […] Quanto pesano tutti gli oggetti del mondo? Sembra la domanda disarmante di un bambino e invece adesso è diventata, grazie ai big data, una curiosità scientifica piena di significati. […] Immaginate tutto ciò che l'umanità ha prodotto e costruito: tutti gli edifici sulla Terra, tutte le strade, treni aerei navi auto camion moto biciclette e ogni altro mezzo di trasporto, le fabbriche, le macchine. Ora aggiungete le suppellettili e gli arredi, gli strumenti, i telefonini, i computer, le stoviglie, i vetri, gli infissi, la carta di questa rivista. Insomma, prendete la tecnosfera materiale nella sua globalità, costituita da ogni artefatto umano distribuito sulla superficie terrestre, e mettetela su una bilancia. Vi verrà fuori un numero, stratosferico. L'unità di misura adatta all'impresa è la teratonnellata, cioè mille miliardi di tonnellate. Ed ecco il numero fatidico: tutte le cose umane, dai grattacieli agli apriscatole, ed esclusi i rifiuti, nel 2020 hanno raggiunto il ragguardevole peso di 1,1 teratonnellate, ovvero mille e cento miliardi di tonnellate. Questa è la dimensione dell'immane flusso materiale che sta alla base del metabolismo attraverso il quale l'umanità incessantemente trasforma in prodotti ed energia le materie prime presenti in natura. Se scomponiamo l'insieme di tutti i manufatti umani e vediamo di cosa sono fatti, scopriamo che il calcestruzzo e gli aggregati di ghiaie e sabbie la fanno da padrone, seguiti dai mattoni, poi dall'asfalto, dai metalli e infine da plastiche, vetro e legno usato in industria. I ricercatori hanno anche calcolato gli andamenti della massa antropogenica dall'anno 1900 in poi. La curva si impenna dopo la fine del Secondo conflitto mondiale, appunto, quando la "grande accelerazione" della ricostruzione gettò le basi del benessere dei paesi industrializzati, ma al prezzo di un enorme consumo di suolo e di risorse. […] Con tecniche analoghe si può calcolare anche la massa complessiva degli esseri viventi sulla Terra, cioè la biomassa. Ebbene, il valore complessivo di quest'ultima è 1,1 teratonnellate, millecento miliardi di tonnellate: esattamente come la massa antropogenica! Ciò significa che proprio nel 2020 la somma degli oggetti umani ha eguagliato tutto il resto della vita messo insieme. E pensare che agli inizi del Novecento le cose umane valevano il 3 per cento rispetto al peso degli esseri viventi. […] Quindi noi umani, che contribuiamo solo per lo 0,01 per cento alla biomassa globale, abbiamo riempito il mondo di 1,1 teratonnellate di cose. Questa è l'impronta schiacciante dell'Antropocene. Senza una rapida transizione del sistema economico mondiale verso modelli circolari, la massa antropogenica continuerà a raddoppiare ogni vent'anni, sfuggendo al controllo. Nel nostro geologico quarto d'ora di celebrità, ci siamo fatti notare.»`,
        comprensione: [
          'Sintetizza il brano evidenziando il punto di vista dell\'autore sull\'Antropocene e sul ruolo umano in questo periodo geologico.',
          'Illustra il significato dell\'espressione \'vicolo cieco in cui ci siamo infilati\'.',
          'Quali esempi l\'autore fornisce per descrivere l\'insieme della \'tecnosfera materiale\'?',
          'A cosa si riferisce l\'autore quando usa l\'espressione \'geologico quarto d\'ora di celebrità\'?'
        ],
        produzione: 'Elabora un testo in cui, a partire dal concetto di \'tecnosfera\', rifletti sull\'impatto ambientale ed economico della produzione e del consumo costante di oggetti, esprimendo la tua opinione al riguardo e proponendo possibili soluzioni per ridurre tale impatto. Sviluppa in modo organico e coerente le tue argomentazioni, facendo riferimento non solo alla tua esperienza, ma anche al tuo percorso di studi e alle tue letture.'
      }
    ];
    
    const testoScelta = testiReali[n % testiReali.length];
    
    return {
      tipologia: 'B3',
      titolo: testoScelta.titolo,
      sottotitolo: testoScelta.sottotitolo,
      fonte: testoScelta.fonte,
      testo: testoScelta.testo,
      comprensione: testoScelta.comprensione,
      produzione: testoScelta.produzione,
      istruzioni: 'Puoi rispondere punto per punto oppure costruire un unico discorso che comprenda le risposte a tutte le domande proposte.',
      punteggio: 20
    };
  }

  generaTemaStorico(n, traccia) {
    const testiReali = [
      {
        titolo: 'TIPOLOGIA C – RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ',
        sottotitolo: 'PROPOSTA C1',
        fonte: 'Testo tratto da: Paolo Borsellino, I giovani, la mia speranza, in Epoca, 14 ottobre 1992, pp. 125-126.',
        testo: `«Sono nato a Palermo e qui ho svolto la mia attività di magistrato. Palermo è una città che a poco a poco, negli anni, ha finito per perdere pressoché totalmente la propria identità, nel senso che gli abitanti di questa città, o la maggior parte di essi, hanno finito per non riconoscersi più come appartenenti a una comunità che ha esigenze e valori uguali per tutti. […] Sono stato più volte portato a considerare quali sono gli interessi e i ragionamenti dei miei tre figli, oggi tutti sui vent'anni, rispetto a quello che era il mio modo di pensare e di guardarmi intorno quando avevo quindici-sedici anni. A quell'età io vivevo nell'assoluta indifferenza del fenomeno mafioso, che allora era grave quanto oggi. […] Invece i ragazzi di oggi (per questo citavo i miei figli) sono perfettamente coscienti del gravissimo problema col quale noi conviviamo. E questa è la ragione per la quale, allorché mi si domanda qual è il mio atteggiamento, se cioè ci sono motivi di speranza nei confronti del futuro, io mi dichiaro sempre ottimista. E mi dichiaro ottimista nonostante gli esiti giudiziari tutto sommato non soddisfacenti del grosso lavoro che si è fatto. E mi dichiaro ottimista anche se so che oggi la mafia è estremamente potente, perché sono convinto che uno dei maggiori punti di forza dell'organizzazione mafiosa è il consenso. È il consenso che circonda queste organizzazioni che le contraddistingue da qualsiasi altra organizzazione criminale. Se i giovani oggi cominciano a crescere e a diventare adulti, non trovando naturale dare alla mafia questo consenso e ritenere che con essa si possa vivere, certo non vinceremo tra due-tre anni. Ma credo che, se questo atteggiamento dei giovani viene alimentato e incoraggiato, non sarà possibile per le organizzazioni mafiose, quando saranno questi giovani a regolare la società, trovare quel consenso che purtroppo la mia generazione diede e dà in misura notevolissima. È questo mi fa essere ottimista.»`,
        consegna: 'Rifletti, alla luce delle tue esperienze come studente e come cittadino, sul significato profondo di questo messaggio del giudice Paolo Borsellino (1940-1992) e sul valore che esso può avere per i giovani, in particolare per quelli della tua generazione. Puoi articolare il tuo elaborato in paragrafi opportunamente titolati e presentarlo con un titolo complessivo che ne esprima sinteticamente il contenuto.'
      }
    ];
    
    const testoScelta = testiReali[n % testiReali.length];
    
    return {
      tipologia: 'C1',
      titolo: testoScelta.titolo,
      sottotitolo: testoScelta.sottotitolo,
      fonte: testoScelta.fonte,
      testo: testoScelta.testo,
      consegna: testoScelta.consegna,
      punteggio: 20
    };
  }

  generaTemaAttualita(n, traccia) {
    const testiReali = [
      {
        titolo: 'TIPOLOGIA C – RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ',
        sottotitolo: 'PROPOSTA C2',
        fonte: 'Testo tratto da: Anna Meldolesi e Chiara Lalli, L\'indignazione è il motore del mondo social. Ma serve a qualcosa?, in 7-Sette - supplemento settimanale del \'Corriere della Sera\', 13 dicembre 2024, pag. 12.',
        testo: `«L'indignazione è il motore del mondo social. Ma serve a qualcosa? Una nuova ricerca, pubblicata su Science, dimostra che questa reazione emotiva accompagna spesso contenuti discutibili e che chi si scandalizza davanti a una presunta ingiustizia non perde tempo a cliccare sui link, per approfondire e verificare. Così, visto che la mente umana può esprimere giornalmente solo un tot di rabbioso disgusto, finiamo per sprecarlo su questioni irrilevanti per ignorare invece i temi che davvero meriterebbero la nostra irritazione.»`,
        consegna: 'A partire dai contenuti del testo proposto, traendo spunto dalle tue esperienze, dalle tue conoscenze e dalle tue letture, rifletti su questa rilevante caratteristica dei social. Puoi articolare il tuo elaborato in paragrafi opportunamente titolati e presentarlo con un titolo complessivo che ne esprima sinteticamente il contenuto.'
      }
    ];
    
    const testoScelta = testiReali[n % testiReali.length];
    
    return {
      tipologia: 'C2',
      titolo: testoScelta.titolo,
      sottotitolo: testoScelta.sottotitolo,
      fonte: testoScelta.fonte,
      testo: testoScelta.testo,
      consegna: testoScelta.consegna,
      punteggio: 20
    };
  }

  generaDocumenti(tema, n) {
    // Genera documenti fittizi ma realistici per ogni tema
    const documenti = [
      {
        autore: 'Esperto del settore',
        titolo: `Prospettive su: ${tema}`,
        estratto: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
      },
      {
        autore: 'Ricercatore universitario',
        titolo: `Analisi critica: ${tema}`,
        estratto: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...'
      }
    ];
    
    return documenti;
  }

  getCompetenzeTestate(n) {
    return [
      'Padronanza della lingua italiana',
      'Capacità di analisi e interpretazione',
      'Competenze argomentative',
      'Conoscenze culturali e letterarie',
      'Capacità di sintesi e rielaborazione critica'
    ];
  }

  // Metodi di utilità
  getEsame(id) {
    return this.esami.find(esame => esame.id === id);
  }

  getEsameCasuale() {
    if (this.esami.length === 0) return null;
    const indice = Math.floor(Math.random() * this.esami.length);
    return this.esami[indice];
  }
}

module.exports = GeneratoreEsamiItalianoAvanzato;
