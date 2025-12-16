// Script per rigenerare le simulazioni italiano con tracce B e C diverse
const fs = require('fs');
const path = require('path');

const simulazioniDir = path.join(__dirname, 'src/data/simulazioni-esame/italiano');

// Database testi argomentativi per tipologia B
const testiB = [
  {
    autore: 'Umberto Eco',
    opera: 'Cinque scritti morali',
    anno: '1997',
    tema: 'Il fascismo eterno',
    testo: 'Il fascismo eterno è ancora intorno a noi, talvolta in abiti civili. Sarebbe così confortevole, per noi, se qualcuno si affacciasse sulla scena del mondo e dicesse: "Voglio riaprire Auschwitz". Ahimè, la vita non è così facile. Il fascismo può ancora tornare sotto le spoglie più innocenti.'
  },
  {
    autore: 'Zygmunt Bauman',
    opera: 'Modernità liquida',
    anno: '2000',
    tema: 'La fragilità dei legami',
    testo: 'Nella modernità liquida l\'individuo deve agire in condizioni di incertezza permanente. La fragilità dei legami umani è percepita come una condizione sia di ansia che di libertà.'
  },
  {
    autore: 'Norberto Bobbio',
    opera: 'Il futuro della democrazia',
    anno: '1984',
    tema: 'Democrazia e partecipazione',
    testo: 'La democrazia non consiste soltanto nel diritto di partecipare alle decisioni collettive, ma anche nel dovere di informarsi, di discutere, di confrontarsi con gli altri.'
  },
  {
    autore: 'Hannah Arendt',
    opera: 'La banalità del male',
    anno: '1963',
    tema: 'La responsabilità individuale',
    testo: 'Il male può essere commesso da persone ordinarie che accettano le premesse del loro stato e quindi partecipano con la coscienza pulita a azioni terribili.'
  },
  {
    autore: 'Pier Paolo Pasolini',
    opera: 'Scritti corsari',
    anno: '1975',
    tema: 'Consumismo e omologazione',
    testo: 'Il consumismo ha realizzato una mutazione antropologica degli italiani. Ha distrutto le culture particolari, ha imposto una cultura di massa omologante.'
  },
  {
    autore: 'Italo Calvino',
    opera: 'Lezioni americane',
    anno: '1988',
    tema: 'Leggerezza e profondità',
    testo: 'La leggerezza per me si associa con la precisione e la determinazione, non con la vaghezza e l\'abbandono al caso.'
  },
  {
    autore: 'Edgar Morin',
    opera: 'I sette saperi necessari',
    anno: '2000',
    tema: 'Educazione e complessità',
    testo: 'L\'educazione deve promuovere un\'intelligenza generale capace di riferirsi al complesso, al contesto, in modo multidimensionale e globale.'
  },
  {
    autore: 'Martha Nussbaum',
    opera: 'Non per profitto',
    anno: '2010',
    tema: 'Cultura umanistica',
    testo: 'Le discipline umanistiche sono essenziali per formare cittadini capaci di pensiero critico e di empatia verso gli altri.'
  },
  {
    autore: 'Amartya Sen',
    opera: 'L\'idea di giustizia',
    anno: '2009',
    tema: 'Giustizia e sviluppo',
    testo: 'Lo sviluppo può essere visto come un processo di espansione delle libertà reali godute dagli esseri umani.'
  },
  {
    autore: 'Byung-Chul Han',
    opera: 'La società della stanchezza',
    anno: '2010',
    tema: 'Prestazione e burnout',
    testo: 'La società del XXI secolo non è più una società disciplinare, ma una società della prestazione. L\'uomo contemporaneo è imprenditore di se stesso.'
  }
];

// Database temi per tipologia C
const temiC = [
  { argomento: 'Il valore della memoria', citazione: 'Chi non ricorda il passato è condannato a ripeterlo', autore: 'George Santayana' },
  { argomento: 'L\'importanza del viaggio', citazione: 'Il vero viaggio di scoperta non consiste nel cercare nuove terre, ma nell\'avere nuovi occhi', autore: 'Marcel Proust' },
  { argomento: 'La solitudine nell\'era digitale', citazione: 'La solitudine è per lo spirito ciò che il cibo è per il corpo', autore: 'Seneca' },
  { argomento: 'Il rapporto con la natura', citazione: 'In ogni passeggiata nella natura l\'uomo riceve molto di più di ciò che cerca', autore: 'John Muir' },
  { argomento: 'Il valore del silenzio', citazione: 'Il silenzio è un vero amico che non tradisce mai', autore: 'Confucio' },
  { argomento: 'L\'arte come necessità', citazione: 'L\'arte lava via dall\'anima la polvere della vita quotidiana', autore: 'Pablo Picasso' },
  { argomento: 'La lettura come formazione', citazione: 'Un lettore vive mille vite prima di morire. Chi non legge ne vive una sola', autore: 'George R.R. Martin' },
  { argomento: 'Il coraggio di cambiare', citazione: 'Il segreto del cambiamento è concentrare tutta la tua energia non nel combattere il vecchio, ma nel costruire il nuovo', autore: 'Socrate' },
  { argomento: 'La gentilezza come virtù', citazione: 'La gentilezza è una lingua che i sordi possono sentire e i ciechi possono vedere', autore: 'Mark Twain' },
  { argomento: 'Il tempo e la felicità', citazione: 'Il tempo che ti piace perdere non è tempo perso', autore: 'John Lennon' },
  { argomento: 'L\'importanza dell\'errore', citazione: 'Chi non ha mai commesso un errore non ha mai provato nulla di nuovo', autore: 'Albert Einstein' },
  { argomento: 'La diversità come ricchezza', citazione: 'La diversità è l\'unica cosa che tutti abbiamo in comune', autore: 'Winston Churchill' }
];

// Leggi tutti i file e aggiorna le tracce B e C
const files = fs.readdirSync(simulazioniDir).filter(f => f.endsWith('.json') && f.startsWith('ITA_'));

console.log(`Trovati ${files.length} file da aggiornare...`);

files.forEach((file, idx) => {
  const filepath = path.join(simulazioniDir, file);
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  
  // Seleziona testi diversi per ogni file
  const testoB1 = testiB[idx % testiB.length];
  const testoB2 = testiB[(idx + 3) % testiB.length];
  const testoB3 = testiB[(idx + 6) % testiB.length];
  const temaC1 = temiC[idx % temiC.length];
  const temaC2 = temiC[(idx + 4) % temiC.length];
  
  // Aggiorna tracce B
  if (data.tracce && data.tracce.length >= 5) {
    // B1
    data.tracce[2] = {
      tipologia: 'B',
      proposta: 'B1',
      titolo: 'ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
      testoCitato: {
        autore: testoB1.autore,
        trattoDa: testoB1.opera,
        anno: testoB1.anno,
        testo: testoB1.testo
      },
      comprensione_analisi: [
        'Riassumi le tesi principali sostenute nel testo.',
        'Su quali argomenti si fonda il ragionamento dell\'autore?',
        'Qual è la struttura argomentativa del testo?',
        'Individua almeno un esempio di connettivo testuale e spiegane la funzione.'
      ],
      produzione: `Condividi la riflessione dell'autore sul tema "${testoB1.tema}"? Argomenta il tuo punto di vista elaborando un testo coerente e coeso.`
    };
    
    // B2
    data.tracce[3] = {
      tipologia: 'B',
      proposta: 'B2',
      titolo: 'ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
      ambito: 'SOCIALE',
      testoCitato: {
        autore: testoB2.autore,
        trattoDa: testoB2.opera,
        anno: testoB2.anno,
        testo: testoB2.testo
      },
      comprensione_analisi: [
        'Sintetizza il contenuto del testo, mettendone in evidenza gli snodi argomentativi.',
        'Evidenzia la tesi principale dell\'autore.',
        'Quale funzione hanno gli esempi riportati nel testo?',
        'L\'autore adopera un registro formale o informale? Motiva la tua risposta.'
      ],
      produzione: `Sviluppa le tue argomentazioni sul tema "${testoB2.tema}" proposto dall'autore.`
    };
    
    // B3
    data.tracce[4] = {
      tipologia: 'B',
      proposta: 'B3',
      titolo: 'ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO',
      ambito: 'STORICO-CULTURALE',
      testoCitato: {
        autore: testoB3.autore,
        trattoDa: testoB3.opera,
        anno: testoB3.anno,
        testo: testoB3.testo
      },
      comprensione_analisi: [
        'Quali sono i punti chiave del ragionamento dell\'autore?',
        'Come si sviluppa l\'argomentazione nel testo?'
      ],
      produzione: `Rifletti sul tema "${testoB3.tema}" esprimendo il tuo punto di vista.`
    };
    
    // C1
    data.tracce[5] = {
      tipologia: 'C',
      proposta: 'C1',
      titolo: 'RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ',
      argomento: temaC1.argomento,
      citazione: temaC1.citazione,
      autore_citazione: temaC1.autore,
      consegna: `Rifletti sul tema "${temaC1.argomento}" partendo dalla citazione proposta. Puoi articolare il tuo elaborato in paragrafi opportunamente titolati.`
    };
    
    // C2
    data.tracce[6] = {
      tipologia: 'C',
      proposta: 'C2',
      titolo: 'RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ',
      argomento: temaC2.argomento,
      citazione: temaC2.citazione,
      autore_citazione: temaC2.autore,
      consegna: `A partire dalla citazione proposta, rifletti sul tema "${temaC2.argomento}" facendo riferimento alle tue esperienze e letture.`
    };
  }
  
  // Salva il file aggiornato
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
});

console.log(`✅ Aggiornati ${files.length} file con tracce B e C diverse!`);
