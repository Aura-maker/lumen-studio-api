/**
 * 🎓 GENERATORE SIMULAZIONI ITALIANO
 * Sistema per generare simulazioni d'esame di italiano formato maturità
 */

class GeneratoreItalianoSimulazioni {
  constructor() {
    this.tipologie = {
      A: { proposte: 2, tipo: 'analisi_testo' },
      B: { proposte: 3, tipo: 'argomentativo' },
      C: { proposte: 2, tipo: 'riflessione_critica' }
    };
    
    this.autori = {
      poesia: [
        'Giacomo Leopardi', 'Giovanni Pascoli', "Gabriele D'Annunzio",
        'Giuseppe Ungaretti', 'Eugenio Montale', 'Umberto Saba',
        'Salvatore Quasimodo', 'Mario Luzi', 'Giorgio Caproni'
      ],
      narrativa: [
        'Alessandro Manzoni', 'Giovanni Verga', 'Luigi Pirandello',
        'Italo Svevo', 'Alberto Moravia', 'Cesare Pavese',
        'Italo Calvino', 'Primo Levi', 'Leonardo Sciascia'
      ]
    };
  }

  /**
   * Genera simulazione completa italiano (7 tracce)
   */
  generaSimulazioneCompleta(numero = 1) {
    return {
      id: `ITA_SIM_${String(numero).padStart(3, '0')}`,
      materia: 'ITALIANO',
      tipo: 'ESAME DI STATO',
      numero: numero,
      data: new Date().toISOString().split('T')[0],
      durata: '6 ore',
      intestazione: this.generaIntestazione(),
      istruzioni: 'Svolgi la prova, scegliendo tra una delle seguenti proposte.',
      tracce: [
        this.generaTracciaA1(numero),
        this.generaTracciaA2(numero),
        this.generaTracciaB1(numero),
        this.generaTracciaB2(numero),
        this.generaTracciaB3(numero),
        this.generaTracciaC1(numero),
        this.generaTracciaC2(numero)
      ]
    };
  }

  generaIntestazione() {
    return `Ministero dell'Istruzione e del Merito
ESAMI DI STATO DI ISTRUZIONE SECONDARIA SUPERIORE
PROVA DI ITALIANO`;
  }

  /**
   * TIPOLOGIA A1 - Poesia
   */
  generaTracciaA1(n) {
    const poesie = this.getBancaDatiPoesie();
    const poesia = poesie[n % poesie.length];
    
    return {
      tipologia: 'A',
      proposta: 'A1',
      titolo: 'ANALISI E INTERPRETAZIONE DI UN TESTO LETTERARIO ITALIANO',
      autore: poesia.autore,
      opera: poesia.opera,
      titoloComponente: poesia.titolo,
      periodo: poesia.periodo,
      testo: poesia.testo,
      note: poesia.note,
      comprensione_analisi: {
        istruzioni: 'Puoi rispondere punto per punto oppure costruire un unico discorso che comprenda le risposte alle domande proposte.',
        domande: [
          `Sintetizza i principali temi della poesia.`,
          `Analizza la struttura metrica e le scelte formali del componimento.`,
          `Individua e commenta le principali figure retoriche presenti.`,
          `Quale rapporto si delinea tra l'io lirico e ${poesia.tema_centrale}?`,
          `Analizza il lessico utilizzato e i campi semantici prevalenti.`,
          `Come si caratterizza il tono del componimento?`
        ]
      },
      interpretazione: `Partendo dalla lirica proposta, elabora una tua riflessione sul tema ${poesia.tema_interpretazione}, facendo riferimento ad altri testi di ${poesia.autore.split(' ').pop()} o di altri autori del ${poesia.periodo} che conosci.`
    };
  }

  /**
   * TIPOLOGIA A2 - Prosa
   */
  generaTracciaA2(n) {
    const brani = this.getBancaDatiProsa();
    const brano = brani[n % brani.length];
    
    return {
      tipologia: 'A',
      proposta: 'A2',
      titolo: 'ANALISI E INTERPRETAZIONE DI UN TESTO LETTERARIO ITALIANO',
      autore: brano.autore,
      opera: brano.opera,
      anno: brano.anno,
      introduzione: brano.introduzione,
      testo: brano.testo,
      comprensione_analisi: {
        istruzioni: 'Puoi rispondere punto per punto oppure costruire un unico discorso che comprenda le risposte alle domande proposte.',
        domande: [
          `Sintetizza il contenuto del brano, individuandone i passaggi principali.`,
          `Analizza il punto di vista narrativo e la focalizzazione.`,
          `Come si caratterizzano i personaggi presenti nel brano?`,
          `Quali tecniche narrative utilizza l'autore?`,
          `Individua e commenta le scelte stilistiche e lessicali.`,
          `Quale atmosfera emerge dal testo e attraverso quali elementi viene costruita?`
        ]
      },
      interpretazione: brano.interpretazione
    };
  }

  /**
   * TIPOLOGIA B - Testi argomentativi
   */
  generaTracciaB1(n) {
    const articoli = this.getBancaDatiArticoliCultura();
    const articolo = articoli[n % articoli.length];
    
    return {
      tipologia: 'B',
      proposta: 'B1',
      titolo: 'ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
      testoCitato: {
        trattoDa: articolo.fonte,
        autore: articolo.autore,
        titoloArticolo: articolo.titolo,
        editore: articolo.editore,
        anno: articolo.anno,
        testo: articolo.testo
      },
      comprensione_analisi: [
        'Riassumi le tesi principali sostenute nel testo.',
        'Su quali argomenti si fonda il ragionamento dell\'autore?',
        'Qual è la struttura argomentativa del testo?',
        'Individua almeno un esempio di connettivo testuale e spiegane la funzione.',
        'Che cosa intende l\'autore con l\'espressione «' + articolo.espressione_chiave + '»?'
      ],
      produzione: `Condividi la riflessione di ${articolo.autore.split(' ').pop()} sul tema della ${articolo.tema}? 
      Argomenta il tuo punto di vista elaborando un testo in cui tesi e argomenti siano organizzati in un discorso coerente e coeso, 
      facendo riferimento alle tue conoscenze, alle tue letture e alle tue esperienze personali.`
    };
  }

  generaTracciaB2(n) {
    const saggi = this.getBancaDatiSaggiSociali();
    const saggio = saggi[n % saggi.length];
    
    return {
      tipologia: 'B',
      proposta: 'B2',
      titolo: 'ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
      ambito: saggio.ambito,
      testoCitato: {
        trattoDa: saggio.fonte,
        autore: saggio.autore,
        titoloSaggio: saggio.titolo,
        editore: saggio.editore,
        anno: saggio.anno,
        pagine: saggio.pagine,
        testo: saggio.testo
      },
      comprensione_analisi: [
        'Sintetizza il contenuto del testo, mettendone in evidenza gli snodi argomentativi.',
        'Evidenzia la tesi principale dell\'autore.',
        'Quale funzione hanno gli esempi riportati nel testo?',
        'L\'autore adopera un registro formale o informale? Motiva la tua risposta.',
        `Spiega il significato dell'affermazione: «${saggio.citazione_chiave}».`
      ],
      produzione: saggio.traccia_produzione
    };
  }

  generaTracciaB3(n) {
    const temi = this.getTemiStoriciContemporanei();
    const tema = temi[n % temi.length];
    
    return {
      tipologia: 'B',
      proposta: 'B3',
      titolo: 'ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
      ambito: 'STORICO',
      testoCitato: tema.documento,
      comprensione_analisi: tema.domande_comprensione,
      produzione: tema.traccia_produzione
    };
  }

  /**
   * TIPOLOGIA C - Riflessione critica
   */
  generaTracciaC1(n) {
    const temi = this.getTemiAttualita();
    const tema = temi[n % temi.length];
    
    return {
      tipologia: 'C',
      proposta: 'C1',
      titolo: 'RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ',
      argomento: tema.argomento,
      citazione: tema.citazione,
      autore_citazione: tema.autore_citazione,
      testo_introduttivo: tema.introduzione,
      consegna: `${tema.spunto_riflessione}

Puoi articolare il tuo elaborato in paragrafi opportunamente titolati e presentarlo con un titolo complessivo che ne esprima sinteticamente il contenuto.`
    };
  }

  generaTracciaC2(n) {
    const esperienze = this.getEsperienzeFormative();
    const esperienza = esperienze[n % esperienze.length];
    
    return {
      tipologia: 'C',
      proposta: 'C2',
      titolo: 'RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ',
      argomento: esperienza.argomento,
      testo_stimolo: esperienza.testo,
      consegna: `A partire dal testo proposto e traendo spunto dalle tue esperienze, dalle tue conoscenze e dalle tue letture, 
      rifletti sul tema ${esperienza.tema_centrale}.

${esperienza.domande_guida}

Puoi articolare il tuo elaborato in paragrafi opportunamente titolati e presentarlo con un titolo complessivo che ne esprima sinteticamente il contenuto.`
    };
  }

  // ========== BANCHE DATI ==========

  getBancaDatiPoesie() {
    return [
      {
        autore: 'Giacomo Leopardi',
        opera: 'Canti',
        titolo: 'La quiete dopo la tempesta',
        periodo: 'Romanticismo',
        testo: `Passata è la tempesta:
odo augelli far festa, e la gallina,
tornata in su la via,
che ripete il suo verso. Ecco il sereno
rompe là da ponente, alla montagna;
sgombrasi la campagna,
e chiaro nella valle il fiume appare.
Ogni cor si rallegra, in ogni lato
risorge il romorio,
torna il lavoro usato.`,
        note: 'vv. 1-10',
        tema_centrale: 'la natura',
        tema_interpretazione: 'del rapporto tra uomo e natura nella poesia leopardiana'
      },
      {
        autore: 'Eugenio Montale',
        opera: 'Le occasioni',
        titolo: 'Non recidere, forbice, quel volto',
        periodo: 'Novecento',
        testo: `Non recidere, forbice, quel volto,
solo nella memoria che si sfolla,
non far del grande suo viso in ascolto
la mia nebbia di sempre.

Un freddo cala... Duro il colpo svetta.
E l'acacia ferita da sé scrolla
il guscio di cicala
nella prima belletta di Novembre.`,
        note: '',
        tema_centrale: 'la memoria',
        tema_interpretazione: 'della memoria e del tempo nella lirica del Novecento'
      }
      // Aggiungerò altri 198 modelli variati
    ];
  }

  getBancaDatiProsa() {
    return [
      {
        autore: 'Italo Calvino',
        opera: 'Le città invisibili',
        anno: '1972',
        introduzione: 'Marco Polo descrive al Khan una delle città del suo impero.',
        testo: `La città di Leonia rifà se stessa tutti i giorni: ogni mattina la popolazione si risveglia tra lenzuola fresche, si lava con saponette appena sgusciate dall'involucro, indossa vestaglie nuove fiammanti, estrae dal più perfezionato frigorifero barattoli di latta ancora intonsi, ascoltando le ultime filastrocche dall'ultimo modello d'apparecchio.`,
        interpretazione: 'Il brano propone una riflessione sulla società dei consumi e sul rapporto tra progresso e sostenibilità. Elabora le tue considerazioni in merito, facendo riferimento ad altri autori o opere che hanno affrontato tematiche simili.'
      }
      // Altri modelli
    ];
  }

  getBancaDatiArticoliCultura() {
    return [
      {
        autore: 'Umberto Eco',
        titolo: 'Il fascismo eterno',
        fonte: 'Cinque scritti morali',
        editore: 'Bompiani',
        anno: '1997',
        testo: `Il fascismo eterno è ancora intorno a noi, talvolta in abiti civili. Sarebbe così confortevole, per noi, se qualcuno si affacciasse sulla scena del mondo e dicesse: "Voglio riaprire Auschwitz, voglio che le camicie nere sfilino ancora in parata sulle piazze italiane". Ahimè, la vita non è così facile. Il fascismo può ancora tornare sotto le spoglie più innocenti.`,
        tema: 'vigilanza democratica',
        espressione_chiave: 'fascismo eterno'
      }
    ];
  }

  getBancaDatiSaggiSociali() {
    return [
      {
        autore: 'Zygmunt Bauman',
        titolo: 'Amore liquido',
        fonte: 'Amore liquido. Sulla fragilità dei legami affettivi',
        editore: 'Laterza',
        anno: '2003',
        pagine: 'pp. 12-14',
        ambito: 'SOCIALE',
        testo: `Nella modernità liquida l'individuo deve agire in condizioni di incertezza permanente. La fragilità dei legami umani è percepita come una condizione sia di ansia che di libertà. Da un lato desideriamo relazioni, dall'altro temiamo che possano limitare la nostra libertà di movimento.`,
        citazione_chiave: 'modernità liquida',
        traccia_produzione: `La riflessione di Bauman sui "legami liquidi" descrive una condizione contemporanea. Sviluppa le tue argomentazioni sul tema dei rapporti interpersonali nell'era digitale.`
      }
    ];
  }

  getTemiStoriciContemporanei() {
    return [
      {
        documento: {
          autore: 'Eric Hobsbawm',
          titolo: 'Il secolo breve',
          testo: `Il ventesimo secolo è stato il più violento nella storia dell'umanità. Due guerre mondiali, genocidi, uso di armi atomiche: mai prima l'uomo aveva dimostrato tale capacità di autodistruzione.`
        },
        domande_comprensione: [
          'Quali eventi rendono il Novecento "il secolo più violento"?',
          'Cosa intende l\'autore con "capacità di autodistruzione"?'
        ],
        traccia_produzione: 'Rifletti sul rapporto tra progresso tecnologico e barbarie nel XX secolo.'
      }
    ];
  }

  getTemiAttualita() {
    return [
      {
        argomento: 'Il valore della memoria',
        citazione: 'Chi non ricorda il passato è condannato a ripeterlo',
        autore_citazione: 'George Santayana',
        introduzione: 'In un\'epoca di informazioni immediate e memorie digitali, il valore della memoria storica sembra affievolirsi.',
        spunto_riflessione: 'Rifletti sull\'importanza della memoria storica nella costruzione dell\'identità individuale e collettiva.'
      }
    ];
  }

  getEsperienzeFormative() {
    return [
      {
        argomento: 'L\'importanza del viaggio',
        tema_centrale: 'del viaggio come esperienza formativa',
        testo: `Il viaggio non è solo spostamento fisico ma esperienza di trasformazione. Viaggiare significa confrontarsi con l'altro, mettere in discussione le proprie certezze, ampliare i propri orizzonti mentali.`,
        domande_guida: 'In che modo il viaggio può contribuire alla crescita personale? Quali sono le differenze tra il viaggio fisico e quello virtuale?'
      }
    ];
  }
}

module.exports = { GeneratoreItalianoSimulazioni };
