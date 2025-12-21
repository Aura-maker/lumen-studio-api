const fs = require('fs');
const path = require('path');

const simDir = path.join(__dirname, 'src/data/simulazioni-esame/italiano');
const files = fs.readdirSync(simDir).filter(f => f.endsWith('.json'));

// Tracce B migliorate con testi più lunghi
const tracceB = [
  {
    tipologia: "B", proposta: "B1", titolo: "ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO", ambito: "ARTISTICO-LETTERARIO",
    testoCitato: {
      autore: "Italo Calvino", trattoDa: "Lezioni americane", anno: "1988",
      testo: "La leggerezza per me si associa con la precisione e la determinazione, non con la vaghezza e l'abbandono al caso. Paul Valéry ha detto: 'Il faut être léger comme l'oiseau, et non comme la plume'. Io ho cercato di togliere peso ora alle figure umane, ora ai corpi celesti, ora alle città; soprattutto ho cercato di togliere peso alla struttura del racconto e al linguaggio. In questa conferenza cercherò di spiegare - a me stesso e a voi - perché sono stato portato a considerare la leggerezza un valore anziché un difetto. La leggerezza è qualcosa che si crea nella scrittura, con i mezzi linguistici che sono quelli del poeta, indipendentemente dalla dottrina del filosofo che il poeta dichiara di voler seguire."
    },
    comprensione_analisi: ["Riassumi la tesi principale di Calvino sulla leggerezza.", "Qual è il significato della citazione di Valéry nel contesto del discorso?", "Come si sviluppa l'argomentazione nel brano?", "Individua le strategie retoriche utilizzate dall'autore."],
    produzione: "Rifletti sul concetto di 'leggerezza' proposto da Calvino. Ritieni che la leggerezza sia un valore nella letteratura e nella vita contemporanea? Argomenta la tua posizione con riferimenti culturali e personali, sviluppando un testo di almeno 3 colonne di foglio protocollo."
  },
  {
    tipologia: "B", proposta: "B2", titolo: "ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO", ambito: "SOCIALE",
    testoCitato: {
      autore: "Zygmunt Bauman", trattoDa: "Modernità liquida", anno: "2000",
      testo: "I legami umani sono diventati 'liquidi': fragili, temporanei, revocabili. La società contemporanea non offre più punti di riferimento stabili. Le relazioni sono vissute come investimenti: devono produrre gratificazione immediata, altrimenti vengono abbandonate. La paura dell'impegno definitivo pervade ogni aspetto della vita sociale. Paradossalmente, questa libertà assoluta genera ansia e solitudine. L'individuo, liberato dai vincoli tradizionali, si ritrova solo di fronte all'incertezza del futuro. La comunità, un tempo rifugio sicuro, è diventata un'entità minacciosa o inesistente."
    },
    comprensione_analisi: ["Sintetizza il concetto di 'modernità liquida' esposto da Bauman.", "Quali conseguenze ha, secondo l'autore, la fragilità dei legami umani?", "Analizza la struttura argomentativa del testo.", "Quale paradosso viene evidenziato nel brano?"],
    produzione: "Condividi l'analisi di Bauman sulla società contemporanea? Elabora un testo argomentativo in cui esprimi la tua posizione, facendo riferimento alla tua esperienza e alle tue letture. Il tuo elaborato deve essere di almeno 3 colonne di foglio protocollo."
  },
  {
    tipologia: "B", proposta: "B3", titolo: "ANALISI E PRODUZIONE DI UN TESTO ARGOMENTATIVO", ambito: "STORICO-POLITICO",
    testoCitato: {
      autore: "Hannah Arendt", trattoDa: "La banalità del male", anno: "1963",
      testo: "Il guaio del caso Eichmann era che uomini come lui ce n'erano tanti e che questi tanti non erano né perversi né sadici, bensì erano, e sono tuttora, terribilmente e spaventosamente normali. Dal punto di vista delle nostre istituzioni giuridiche e dei nostri canoni morali, questa normalità è più spaventosa di tutte le atrocità messe insieme, poiché implica che questo nuovo tipo di criminale commette i suoi crimini in circostanze che quasi gli impediscono di accorgersi o di sentire che agisce male. Il male può essere radicale, ma non è mai estremo; non possiede né profondità né dimensione demoniaca."
    },
    comprensione_analisi: ["Spiega il concetto di 'banalità del male' elaborato da Arendt.", "Perché, secondo l'autrice, la 'normalità' di Eichmann è più spaventosa delle atrocità?", "Quali implicazioni morali e giuridiche solleva il testo?", "Analizza il registro linguistico e le scelte stilistiche."],
    produzione: "Rifletti sul tema della responsabilità individuale nei sistemi totalitari. La 'normalità' può essere una giustificazione? Argomenta la tua posizione con riferimenti storici e culturali, sviluppando un testo di almeno 3 colonne di foglio protocollo."
  }
];

// Tracce C migliorate
const tracceC = [
  {
    tipologia: "C", proposta: "C1", titolo: "RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ",
    argomento: "Il rapporto tra uomo e tecnologia",
    citazione: "La tecnologia è un servo utile ma un padrone pericoloso",
    autore_citazione: "Christian Lous Lange",
    consegna: "A partire dalla citazione proposta, rifletti sul rapporto tra l'uomo e la tecnologia nella società contemporanea. Quali sono i benefici e i rischi della crescente dipendenza tecnologica? Come possiamo mantenere un rapporto equilibrato con gli strumenti digitali? Puoi fare riferimento alle tue esperienze personali, alle tue letture e conoscenze, articolando il tuo elaborato in paragrafi opportunamente titolati e presentando in modo chiaro la tua tesi. Il tuo testo deve essere di almeno 3 colonne di foglio protocollo."
  },
  {
    tipologia: "C", proposta: "C2", titolo: "RIFLESSIONE CRITICA DI CARATTERE ESPOSITIVO-ARGOMENTATIVO SU TEMATICHE DI ATTUALITÀ",
    argomento: "Il valore dell'istruzione",
    citazione: "L'istruzione è l'arma più potente che puoi usare per cambiare il mondo",
    autore_citazione: "Nelson Mandela",
    consegna: "Partendo dalla celebre affermazione di Nelson Mandela, rifletti sul valore dell'istruzione nella società contemporanea. Quale ruolo ha la scuola nella formazione dei cittadini? L'istruzione è ancora uno strumento di emancipazione sociale? Elabora le tue riflessioni in un testo argomentativo coerente, facendo riferimento alle tue esperienze, letture e conoscenze. Il tuo elaborato deve essere di almeno 3 colonne di foglio protocollo."
  }
];

let updated = 0;
files.forEach((file, idx) => {
  try {
    const filePath = path.join(simDir, file);
    const sim = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Aggiorna tracce B e C con versioni migliorate
    if (sim.tracce) {
      sim.tracce = sim.tracce.map(t => {
        if (t.tipologia === 'B' && t.proposta) {
          const newB = tracceB.find(b => b.proposta === t.proposta);
          if (newB) return { ...t, ...newB };
        }
        if (t.tipologia === 'C' && t.proposta) {
          const newC = tracceC.find(c => c.proposta === t.proposta);
          if (newC) return { ...t, ...newC };
        }
        return t;
      });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(sim, null, 2));
    updated++;
  } catch(e) {
    console.log('Errore file', file, e.message);
  }
});

console.log('Simulazioni italiano aggiornate:', updated);
