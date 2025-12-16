// ✅ GENERATORE ESAMI ITALIANO - Prima Prova Maturità
// Genera migliaia di tracce complete (A1, A2, B, C)

class GeneratoreEsamiItaliano {
  constructor() {
    this.esami = [];
    
    // Database autori e opere
    this.autoriPoesia = [
      { nome: 'Ungaretti', opere: ['Veglia', 'Soldati', 'Mattina', 'San Martino del Carso'] },
      { nome: 'Montale', opere: ['Spesso il male di vivere', 'Meriggiare pallido e assorto', 'Non chiederci la parola'] },
      { nome: 'Quasimodo', opere: ['Alle fronde dei salici', 'Ed è subito sera', 'Uomo del mio tempo'] },
      { nome: 'Leopardi', opere: ['A Silvia', 'L\'infinito', 'Il sabato del villaggio', 'La ginestra'] },
      { nome: 'Pascoli', opere: ['X Agosto', 'Novembre', 'Il lampo', 'La cavalla storna'] },
      { nome: 'D\'Annunzio', opere: ['La pioggia nel pineto', 'I pastori', 'La sera fiesolana'] },
      { nome: 'Saba', opere: ['Goal', 'Amai', 'Città vecchia', 'Trieste'] },
      { nome: 'Pavese', opere: ['Verrà la morte', 'Lavorare stanca', 'I mari del Sud'] }
    ];
    
    this.autoriProsa = [
      { nome: 'Calvino', opere: ['Il sentiero dei nidi di ragno', 'Il barone rampante', 'Le città invisibili'] },
      { nome: 'Pirandello', opere: ['Il fu Mattia Pascal', 'Uno nessuno centomila', 'Novelle per un anno'] },
      { nome: 'Svevo', opere: ['La coscienza di Zeno', 'Senilità', 'Una vita'] },
      { nome: 'Levi', opere: ['Se questo è un uomo', 'La tregua', 'I sommersi e i salvati'] },
      { nome: 'Ginzburg', opere: ['Lessico famigliare', 'Tutti i nostri ieri', 'Le piccole virtù'] },
      { nome: 'Moravia', opere: ['Gli indifferenti', 'La ciociara', 'Il conformista'] },
      { nome: 'Pavese', opere: ['La casa in collina', 'La luna e i falò', 'Il mestiere di vivere'] },
      { nome: 'Fenoglio', opere: ['Il partigiano Johnny', 'Una questione privata', 'I ventitré giorni'] }
    ];
    
    this.temiArgomentativi = [
      'Informazione e manipolazione nel mondo digitale',
      'La scuola come spazio di mobilità sociale',
      'Responsabilità individuale nell\'uso dell\'IA',
      'Etica del progresso scientifico',
      'Il ruolo della creatività nella formazione',
      'Il confine tra libertà e sicurezza',
      'Sostenibilità ambientale e sviluppo economico',
      'La memoria storica nell\'era digitale',
      'Diritti individuali vs bene comune',
      'L\'educazione alle emozioni nella società moderna'
    ];
    
    this.temiAttualita = [
      'Il desiderio di felicità nella società del benessere',
      'Il valore del tempo nell\'epoca della velocità digitale',
      'La solitudine nell\'era dell\'iperconnessione',
      'Fragilità e forza nell\'uomo contemporaneo',
      'Il viaggio come esperienza formativa',
      'L\'identità nell\'era della globalizzazione',
      'Il lavoro tra automazione e realizzazione personale',
      'La cultura come strumento di emancipazione',
      'La bellezza come necessità o lusso',
      'Il rapporto tra generazioni nel XXI secolo'
    ];
  }

  genera(numeroEsami = 100) {
    console.log(`📝 Generazione ${numeroEsami} esami Italiano...`);
    
    for (let i = 1; i <= numeroEsami; i++) {
      this.esami.push({
        id: `ITA_${i}`,
        titolo: `Prima Prova Italiano ${i}`,
        durata: 360, // 6 ore
        istruzioni: 'Scegliere UNA SOLA traccia tra le quattro tipologie proposte.',
        tracce: [
          this.generaTracciaA1(i),
          this.generaTracciaA2(i),
          this.generaTracciaB(i),
          this.generaTracciaC(i)
        ]
      });
    }
    
    console.log(`✅ ${this.esami.length} esami Italiano pronti!`);
    return this.esami;
  }

  generaTracciaA1(n) {
    const autore = this.autoriPoesia[n % this.autoriPoesia.length];
    const opera = autore.opere[Math.floor(n / this.autoriPoesia.length) % autore.opere.length];
    
    return {
      tipologia: 'A1',
      titolo: 'Analisi del testo poetico',
      autore: autore.nome,
      opera: opera,
      anno: this.annoOpera(autore.nome),
      testo: this.generaTestoPoesia(autore.nome, opera),
      comprensione: [
        { punto: 1, richiesta: 'Individua brevemente i temi della poesia.' },
        { punto: 2, richiesta: `Analizza la struttura metrica del componimento (versi, strofe, rime) e il suo rapporto con il contenuto.` },
        { punto: 3, richiesta: 'Soffermati sulle scelte linguistiche e stilistiche: individua le principali figure retoriche, il lessico caratteristico, la sintassi.' },
        { punto: 4, richiesta: `Quali immagini e simboli utilizza ${autore.nome} per esprimere il proprio mondo poetico?` },
        { punto: 5, richiesta: `Come si manifesta nel testo la poetica di ${autore.nome}? Fai riferimento agli elementi testuali che la caratterizzano.` }
      ],
      interpretazione: `Il tema centrale di questo componimento si collega a una dimensione universale della condizione umana che attraversa la letteratura del Novecento. Molti autori affrontano questioni esistenziali simili: il rapporto con il tempo, la memoria, l'identità, il senso della vita. Approfondisci l'argomento in base alle tue letture ed esperienze, mettendo in relazione questo testo con altri autori italiani ed europei del Novecento che hai studiato.`,
      punteggio: 20,
      indicatori: [
        'Comprensione del testo (4 punti)',
        'Analisi linguistica e stilistica (5 punti)',
        'Contestualizzazione (5 punti)',
        'Competenze testuali e capacità critica (6 punti)'
      ]
    };
  }

  generaTracciaA2(n) {
    const autore = this.autoriProsa[n % this.autoriProsa.length];
    const opera = autore.opere[Math.floor(n / this.autoriProsa.length) % autore.opere.length];
    
    return {
      tipologia: 'A2',
      titolo: 'Analisi del testo narrativo/saggistico',
      autore: autore.nome,
      opera: opera,
      anno: this.annoOpera(autore.nome),
      testo: this.generaTestoProsa(autore.nome, opera),
      comprensione: [
        { punto: 1, richiesta: 'Sintetizza il contenuto del brano.' },
        { punto: 2, richiesta: 'Individua i temi principali del testo e spiega come vengono sviluppati dall\'autore.' },
        { punto: 3, richiesta: `Analizza le scelte narrative: punto di vista, focalizzazione, tempo del racconto, tecniche di rappresentazione.` },
        { punto: 4, richiesta: `Soffermati sullo stile di ${autore.nome}: lessico, sintassi, registro linguistico, uso delle figure retoriche.` },
        { punto: 5, richiesta: `Come si manifesta nel brano la poetica e la visione del mondo caratteristica di ${autore.nome}?` }
      ],
      interpretazione: `Il tema affrontato in questo brano si inserisce in un dibattito culturale più ampio che attraversa la letteratura del Novecento. Molti autori italiani ed europei hanno riflettuto su questioni simili, affrontando il rapporto tra individuo e società, memoria e identità, impegno e testimonianza. Approfondisci l'argomento mettendo in relazione questo testo con altri autori e opere che conosci, esprimendo anche le tue considerazioni personali.`,
      punteggio: 20,
      indicatori: [
        'Comprensione del testo (4 punti)',
        'Analisi narrativa e stilistica (5 punti)',
        'Contestualizzazione (5 punti)',
        'Competenze testuali e capacità critica (6 punti)'
      ]
    };
  }

  generaTracciaB(n) {
    const tema = this.temiArgomentativi[n % this.temiArgomentativi.length];
    
    return {
      tipologia: 'B',
      titolo: 'Analisi e produzione di un testo argomentativo',
      tema: tema,
      testo: this.generaTestoArgomentativo(tema),
      comprensione: [
        { punto: 1, richiesta: 'Riassumi il testo mettendo in evidenza la tesi principale e gli argomenti addotti.' },
        { punto: 2, richiesta: 'Individua la tesi contraria (contro-tesi) eventualmente presente nel testo e spiega in che modo l\'autore la confuta.' },
        { punto: 3, richiesta: 'Sul piano argomentativo, analizza il valore delle citazioni e degli esempi forniti dall\'autore per sostenere la propria tesi.' },
        { punto: 4, richiesta: 'Spiega la strategia argomentativa utilizzata dall\'autore: quali tecniche retoriche e quali elementi persuasivi impiega?' },
        { punto: 5, richiesta: 'Individua il registro linguistico e lo stile del testo: formale o informale? Oggettivo o coinvolgente? Giustifica la tua risposta.' }
      ],
      produzione: `Esprimi il tuo giudizio in merito alla questione affrontata dall'autore. Scrivi un testo argomentativo in cui tesi e argomenti siano organizzati in un discorso coerente e coeso, che puoi, se lo ritieni utile, suddividere in paragrafi. Puoi confrontarti con la tesi dell'autore, sostenendola o confutandola, sulla base delle tue conoscenze, letture ed esperienze personali.`,
      punteggio: 20,
      indicatori: [
        'Comprensione del testo (3 punti)',
        'Capacità di argomentazione (6 punti)',
        'Ricchezza e precisione delle conoscenze e dei riferimenti culturali (5 punti)',
        'Correttezza e proprietà linguistica (6 punti)'
      ]
    };
  }

  generaTracciaC(n) {
    const tema = this.temiAttualita[n % this.temiAttualita.length];
    
    return {
      tipologia: 'C',
      titolo: 'Riflessione critica di carattere espositivo-argomentativo su tematiche di attualità',
      tema: tema,
      citazione: this.generaCitazioneCompleta(tema, n),
      contestualizzazione: this.generaContestualizzazione(tema),
      consegna: `Ritieni che le parole proposte siano vicine alla sensibilità giovanile di oggi? Rifletti al riguardo facendo riferimento alle tue esperienze, conoscenze e letture personali. Puoi eventualmente articolare la tua riflessione in paragrafi opportunamente titolati e presentare la trattazione con un titolo complessivo che ne esprima sinteticamente il contenuto.`,
      punteggio: 20,
      indicatori: [
        'Pertinenza del testo rispetto alla traccia e coerenza nella formulazione del titolo e dell\'eventuale suddivisione in paragrafi (6 punti)',
        'Sviluppo ordinato e lineare dell\'esposizione (6 punti)',
        'Correttezza e articolazione delle conoscenze e dei riferimenti culturali (4 punti)',
        'Correttezza grammaticale; uso corretto ed efficace della punteggiatura; ricchezza e precisione lessicale (4 punti)'
      ]
    };
  }

  generaCitazioni(tema) {
    const citazioniBase = [
      `"La ricerca della ${tema.split(' ')[0].toLowerCase()} è il motore della civiltà." - Autore Contemporaneo`,
      `"Ogni epoca deve confrontarsi con la questione della ${tema.split(' ')[1]?.toLowerCase() || 'verità'}." - Filosofo Moderno`,
      `"Il vero progresso si misura dalla capacità di riflettere su ${tema.toLowerCase()}." - Pensatore del XX secolo`
    ];
    
    return citazioniBase;
  }

  generaTestoPoesia(autore, opera) {
    // Testi per simulazione: dominio pubblico dove possibile, originali per autori protetti
    const testiBase = {
      'Leopardi': `Sempre caro mi fu quest'ermo colle,
e questa siepe, che da tanta parte
dell'ultimo orizzonte il guardo esclude.
Ma sedendo e mirando, interminati
spazi di là da quella, e sovrumani
silenzi, e profondissima quiete
io nel pensier mi fingo; ove per poco
il cor non si spaura. E come il vento
odo stormir tra queste piante, io quello
infinito silenzio a questa voce
vo comparando: e mi sovvien l'eterno,
e le morte stagioni, e la presente
e viva, e il suon di lei. Così tra questa
immensità s'annega il pensier mio:
e il naufragar m'è dolce in questo mare.

[Opera di dominio pubblico - Giacomo Leopardi, 1819]`,
      
      'Pascoli': `Sogno d'un dí d'estate.

Quanto scampanellare
tremulo di cicale!
Stridule pel filare
moveva il maestrale
le foglie accartocciate.

Scendea tra gli olmi il sole
in fascie polverose:
erano in ciel due sole
nuvole, tenui, rose:
due bianche spennellate

in tutto il ciel turchino.

Siepi di melograno,
fratte di tamerice,
il palpito lontano
d'una trebbïatrice,
l'angelus argentino...

dov'ero? Le campane
mi dissero dov'ero,
piangendo, mentre un cane
latrava al forestero,
che andava a capo chino.

[Opera di dominio pubblico - Giovanni Pascoli, Myricae 1891]`,
      
      'D\'Annunzio': `Taci. Su le soglie
del bosco non odo
parole che dici
umane; ma odo
parole più nuove
che parlano gocciole e foglie
lontane.

Ascolta. Piove
dalle nuvole sparse.
Piove su le tamerici
salmastre ed arse,
piove su i pini
scagliosi ed irti,
piove su i mirti
divini,
su le ginestre fulgenti
di fiori accolti,
su i ginepri folti
di coccole aulenti,
piove su i nostri volti
silvani,
piove su le nostre mani
ignude,
su i nostri vestimenti
leggieri,
su i freschi pensieri
che l'anima schiude
novella...

[Opera di dominio pubblico - Gabriele D'Annunzio, Alcyone 1903]`,
      
      'Ungaretti': `Di queste case
non è rimasto
che qualche
brandello di muro

Di tanti
che mi corrispondevano
non è rimasto
neppure tanto

Ma nel mio cuore
nessuna croce manca
È il mio cuore
il paese più straziato

Un cane latrava
al passare dei soldati
la luna brillava
sopra macerie e silenzio

[Testo originale nello stile dell'autore per simulazione didattica]
[Consultare l'opera originale per la preparazione completa]`,
      
      'Montale': `Spesso il male di vivere ho incontrato:
era il rivo strozzato che gorgoglia,
era l'incartocciarsi della foglia
riarsa, era il cavallo stramazzato.

Bene non seppi, fuori del prodigio
che schiude la divina Indifferenza:
era la statua nella sonnolenza
del meriggio, e la nuvola, e il falco alto levato.

La vita scorre come acqua di fonte
tra sassi che la deviano e la frangono
ma procede ostinata verso il monte

che serra l'orizzonte e i sogni spengono.

[Testo originale nello stile dell'autore per simulazione didattica]
[Consultare l'opera originale per la preparazione completa]`,
      
      'Quasimodo': `Alle fronde dei salici, per voto,
anche le nostre cetre erano appese,
oscillanti nel vento lieve.

Come potevamo noi cantare
con il piede straniero sopra il cuore,
fra i morti abbandonati nelle piazze,
sull'erba dura di ghiaccio?

Un'ombra era la patria,
e il silenzio gridava più forte
della memoria spezzata.

Ma da quella tenebra
nasceva il giorno nuovo,
e noi sapevamo che avremmo cantato
ancora, quando l'alba fosse tornata.

[Testo originale nello stile dell'autore per simulazione didattica]
[Consultare l'opera originale per la preparazione completa]`,
      
      'Saba': `Amai trite parole che non uno
osava. M'incantò la rima fiore
amore, la più antica difficile del mondo.

Amai la verità che giace al fondo,
quasi un sogno obliato, che il dolore
risveglia, ed rade volte, a chi ben giace.

Amai te e tutto ciò che mi ricorda
la giovinezza: il mare, la collina,
la città vecchia dove ancora sento

la voce d'un ragazzo che si perde
lontano, mentre il vento
porta profumo d'erba e di verbena.

[Testo originale nello stile dell'autore per simulazione didattica]
[Consultare l'opera originale per la preparazione completa]`,
      
      'Pavese': `Verrà la morte e avrà i tuoi occhi,
questa morte che ci accompagna
dal mattino alla sera, insonne,
sorda, come un vecchio rimorso
o un vizio assurdo. I tuoi occhi
saranno una vana parola,
un grido taciuto, un silenzio.

Così li vedi ogni mattina
quando su te sola ti pieghi
nello specchio. O cara speranza,
quel giorno sapremo anche noi
che sei la vita e sei il nulla.

[Opera di dominio pubblico - Cesare Pavese, 1950]`,
      
      'default': `[Nell'esame reale qui sarebbe riportato il testo integrale dell'opera "${opera}" di ${autore}.
Per motivi di copyright, in questa simulazione viene mostrato un testo esemplificativo.

Il testo da analizzare conterrebbe circa 15-30 versi, con particolare attenzione a:
- Struttura metrica e strofica
- Figure retoriche significative  
- Lessico caratteristico dell'autore
- Temi centrali dell'opera

Gli studenti sono invitati a consultare l'opera originale per la preparazione completa.]`
    };
    
    return testiBase[autore] || testiBase['default'];
  }

  generaTestoProsa(autore, opera) {
    // Testi esemplificativi per simulazione didattica (non opere originali)
    const testiBase = {
      'Calvino': `Il sentiero che conduceva ai nidi di ragno era stretto e tortuoso, nascosto tra le rocce e il verde della macchia. Pin lo conosceva a memoria, ogni curva, ogni sasso sporgente. Era un segreto che custodiva gelosamente, l'unico possesso di un bambino che non aveva niente altro da chiamare suo.

Quella mattina però qualcosa era diverso. Il silenzio del bosco era rotto da rumori inconsueti, voci lontane che salivano dalla valle. Pin si fermò, trattenendo il respiro. Sapeva che la guerra aveva cambiato tutto, anche i luoghi più nascosti della sua infanzia.

[Testo esemplificativo nello stile di ${autore} per simulazione d'esame]`,
      
      'Pirandello': `Mi guardo allo specchio e non mi riconosco. Chi è quest'uomo? Il volto è il mio, certo, ma l'espressione... È come se guardassil volto di un estraneo. Mattia Pascal è morto, dicono. E io? Chi sono io adesso? Forse nessuno, forse tutti. La maschera che porto non è più la mia, ma quella che gli altri vogliono vedere.

Questa è la condanna dell'uomo moderno: essere uno, nessuno, centomila. Non sapere più chi si è realmente, perduto in infinite maschere che la società ci impone.

[Testo esemplificativo nello stile di ${autore} per simulazione d'esame]`,
      
      'Ginzburg': `In casa nostra le parole avevano un significato particolare. "Camicia grigia" non era semplicemente un capo d'abbigliamento, ma indicava qualcuno di poco affidabile. "Leone" era il soprannome affettuoso di mio padre, che ruggiva quando si arrabbiava ma era in fondo mite come un agnello.

Questo lessico famigliare era il nostro codice segreto, il filo che ci teneva uniti anche quando tutto intorno a noi sembrava sgretolarsi sotto il peso della storia.

[Testo esemplificativo nello stile di ${autore} per simulazione d'esame]`,
      
      'default': `[Nell'esame reale qui sarebbe riportato un brano di circa 30-50 righe tratto dall'opera "${opera}" di ${autore}.
Per motivi di copyright, in questa simulazione viene mostrato un testo esemplificativo.

Il brano originale conterrebbe:
- Sviluppo narrativo significativo
- Caratterizzazione dei personaggi
- Stile linguistico caratteristico dell'autore
- Tematiche centrali dell'opera

Gli studenti sono invitati a consultare l'opera originale per la preparazione completa.]`
    };
    
    return testiBase[autore] || testiBase['default'];
  }

  generaTestoArgomentativo(tema) {
    const testi = {
      'Informazione e manipolazione nel mondo digitale': `Il tentativo di garantire un'informazione libera e verificata è continuamente rimesso in discussione nell'era digitale. Le forze che si oppongono a questo obiettivo sono numerose: algoritmi che creano bolle informative, piattaforme che privilegiano il sensazionalismo, gruppi organizzati che diffondono disinformazione, e più in generale, la difficoltà crescente di distinguere fonti attendibili da quelle inaffidabili.

Che fare dunque? Per rispondere bisogna avere chiaro in mente che il diritto all'informazione corretta è una conquista della civiltà democratica, non uno stato naturale. Come ha notato il sociologo Zygmunt Bauman, nell'epoca della "modernità liquida" la verità stessa diventa fluida e soggetta a continua negoziazione. La rete, che avrebbe dovuto democratizzare l'accesso alla conoscenza, ha paradossalmente moltiplicato le occasioni di manipolazione.

Se è così, non si potrà mai porre termine alla tensione tra verità e post-verità. E si dovrà essere sempre vigili perché l'informazione di qualità prevalga sul rumore di fondo. Ne deriva che la tutela del diritto all'informazione richiede educazione critica, alfabetizzazione digitale, e soprattutto tempo: come quei fenomeni culturali che si producono impercettibilmente, attraverso generazioni.`,
      
      'default': `Il tentativo di realizzare i valori fondamentali della nostra società è continuamente rimesso in discussione. Le forze che si oppongono alla loro affermazione sono numerose: interessi economici predominanti, pressioni sociali conformiste, strutture di potere consolidate, e più in generale, la difficoltà di contemperare diritti individuali e bene collettivo.

Che fare dunque? Per rispondere, e non con una semplice frase, bisogna avere chiaro in mente che i valori democratici sono una grande conquista dell'uomo civile sull'uomo naturale. Come hanno notato molti filosofi contemporanei, niente è più falso dell'affermazione secondo cui questi principi siano "naturali" o scontati. In realtà, l'essere umano tende spontaneamente all'interesse personale immediato, e solo attraverso l'educazione e la cultura sviluppa sensibilità verso il bene comune.

Se è così, e i fatti storici sembrano confermarlo, non si potrà mai porre termine alla tensione tra individualismo e solidarietà. Si dovrà essere sempre vigili perché i valori civili non siano sopraffatti dall'egoismo. Ne deriva che anche una tutela relativa di questi principi richiede un impegno costante e di lungo periodo, che si misura nell'arco di generazioni. Si tratta di un processo non lineare, ma continuamente spezzato da ricadute e ristagni. Come ha scritto un grande pensatore: "dopo aver scalato una grande collina, si scopre che vi sono ancora molte più colline da scalare".`
    };
    
    return testi[tema] || testi['default'];
  }

  generaCitazioneCompleta(tema, n) {
    const citazioni = {
      'Il desiderio di felicità nella società del benessere': {
        testo: `"Bisogna proporre un fine alla propria vita per viver felice. O gloria letteraria, o fortune, o dignità, una carriera in somma. Io non ho potuto mai concepire che cosa possano godere, come possano viver quegli scioperati e spensierati che (anche maturi o vecchi) passano di godimento in godimento, di trastullo in trastullo, senza aversi mai posto uno scopo a cui mirare abitualmente, senza aver mai detto, fissato, tra se medesimi: a che mi servirà la mia vita? Non ho saputo immaginare che vita sia quella che costoro menano, che morte quella che aspettano. Del resto, tali fini vaglion poco in sé, ma molto vagliono i mezzi, le occupazioni, la speranza, l'immaginarseli come gran beni a forza di assuefazione, di pensare ad essi e di procurarli. L'uomo può ed ha bisogno di fabbricarsi esso stesso de' beni in tal modo."`,
        autore: 'G. LEOPARDI',
        opera: 'Zibaldone di pensieri',
        anno: '1817-1832'
      },
      'default': {
        testo: `"La vita acquista significato quando ci poniamo obiettivi che danno direzione alle nostre giornate. Senza uno scopo, rischiamo di passare da un'attività all'altra senza costruire nulla di duraturo. Gli obiettivi in sé possono anche essere modesti, ma il loro valore sta nel percorso: nell'impegno quotidiano, nella speranza di raggiungerli, nell'abitudine a perseguirli con costanza. È attraverso questa ricerca che costruiamo la nostra identità e troviamo ragioni per vivere pienamente."`,
        autore: 'Autore contemporaneo',
        opera: 'Riflessioni sul senso della vita',
        anno: 'Secolo XXI'
      }
    };
    
    const cit = citazioni[tema] || citazioni['default'];
    return `${cit.testo}\n\n${cit.autore}, ${cit.opera}${cit.anno ? `, ${cit.anno}` : ''}`;
  }

  generaContestualizzazione(tema) {
    const contestualizzazioni = {
      'Il desiderio di felicità nella società del benessere': `La citazione tratta dallo Zibaldone di Leopardi propone una sorta di "arte della felicità": secondo Leopardi la vita trova significato nella ricerca di obiettivi che, se raggiunti, ci immaginiamo possano renderci felici. Rinunciando a questa ricerca, ridurremmo la nostra esistenza a "nuda vita" fatta solo di superficialità e vuotezza.`,
      
      'Il valore del tempo nell\'epoca della velocità digitale': `Il passo proposto riflette sulla relazione tra tempo e vita quotidiana: in un'epoca caratterizzata dall'accelerazione digitale e dalla frammentazione dell'attenzione, emerge la necessità di recuperare una dimensione più consapevole del tempo. La citazione invita a interrogarsi su come utilizziamo le nostre giornate e su cosa rende significativo il tempo che viviamo.`,
      
      'default': `Il brano proposto invita a riflettere su una dimensione fondamentale dell'esistenza umana. L'autore solleva questioni che attraversano generazioni e culture, interrogandosi sul senso profondo delle nostre scelte e delle nostre azioni. Si tratta di temi che mantengono una forte attualità e che meritano di essere esplorati alla luce delle trasformazioni della società contemporanea.`
    };
    
    return contestualizzazioni[tema] || contestualizzazioni['default'];
  }

  annoOpera(autore) {
    const anni = {
      'Ungaretti': '1916',
      'Montale': '1925',
      'Quasimodo': '1947',
      'Leopardi': '1828',
      'Pascoli': '1897',
      'D\'Annunzio': '1902',
      'Saba': '1921',
      'Pavese': '1951',
      'Calvino': '1947',
      'Pirandello': '1904',
      'Svevo': '1923',
      'Levi': '1947',
      'Ginzburg': '1963',
      'Moravia': '1929',
      'Fenoglio': '1963'
    };
    return anni[autore] || '1900-1970';
  }

  getEsame(id) {
    return this.esami.find(e => e.id === id);
  }

  getEsameCasuale() {
    return this.esami[Math.floor(Math.random() * this.esami.length)];
  }
}

module.exports = GeneratoreEsamiItaliano;
