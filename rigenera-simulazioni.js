/**
 * Script per rigenerare le simulazioni con quesiti diversificati
 */

const fs = require('fs');
const path = require('path');

const simulazioniDir = path.join(__dirname, 'src', 'data', 'simulazioni-esame');

// ==================== QUESITI MATEMATICA (molto diversificati) ====================
const quesitiMatematica = {
  limiti: [
    { testo: 'Calcolare: lim(x→0) [sin(3x) - 3x + x³/2]/(x⁵)', suggerimento: 'Sviluppi di Taylor' },
    { testo: 'Calcolare: lim(x→+∞) x²·[√(x²+1) - x]', suggerimento: 'Razionalizzazione' },
    { testo: 'Determinare a,b ∈ ℝ tali che lim(x→0) [e^(ax)-bcos(x)-1]/x² = 2', suggerimento: null },
    { testo: 'Calcolare: lim(x→0⁺) x^(sin x)', suggerimento: 'Forma indeterminata 0⁰' },
    { testo: 'Studiare lim(x→+∞) (1 + 1/x + 1/x²)^(x²)', suggerimento: 'Limite notevole' },
    { testo: 'Calcolare: lim(x→0) [tan(x) - sin(x)]/(x³)', suggerimento: null },
    { testo: 'Verificare che lim(n→∞) (1 + 2/n)^n = e²', suggerimento: null },
    { testo: 'Calcolare: lim(x→π/4) [tan(x) - 1]/[x - π/4]', suggerimento: 'Derivata' },
    { testo: 'Determinare lim(x→0) [arcsin(x) - x]/(x³)', suggerimento: 'Taylor' },
    { testo: 'Calcolare: lim(x→1) [x^x - 1]/[x - 1]', suggerimento: null }
  ],
  derivate: [
    { testo: 'Data f(x) = x^(1/x) per x > 0, studiare monotonia e calcolare max/min.', suggerimento: null },
    { testo: 'Calcolare la derivata di f(x) = arctan(√((1-x)/(1+x))) e semplificare.', suggerimento: null },
    { testo: 'Determinare f\'\'(0) se f(x) = e^(sin x).', suggerimento: null },
    { testo: 'Sia f(x) = ln(x + √(x²+1)). Dimostrare che f\'(x) = 1/√(x²+1).', suggerimento: null },
    { testo: 'Calcolare d^n/dx^n [x²·e^x] usando la formula di Leibniz.', suggerimento: null },
    { testo: 'Data f(x) = |x|·sin(1/x) per x≠0, f(0)=0, studiare derivabilità in x=0.', suggerimento: null },
    { testo: 'Trovare i punti della curva y = x³ - 3x in cui la tangente è parallela a y = 9x.', suggerimento: null },
    { testo: 'Calcolare f\'(x) se f(x) = ∫₀^(x²) e^(-t²) dt.', suggerimento: 'Teorema fondamentale' },
    { testo: 'Dimostrare che la funzione f(x) = x·|x| è derivabile ovunque e calcolare f\'(x).', suggerimento: null },
    { testo: 'Data f(x) = (sin x)^(cos x), calcolare f\'(π/4).', suggerimento: 'Derivata logaritmica' }
  ],
  integrali: [
    { testo: 'Calcolare: ∫ x²·arctan(x) dx', suggerimento: 'Per parti' },
    { testo: 'Calcolare: ∫₀^1 ln(1+x²) dx', suggerimento: null },
    { testo: 'Calcolare: ∫ 1/(x⁴+1) dx', suggerimento: 'Fratti semplici' },
    { testo: 'Dimostrare: ∫₀^∞ e^(-x²) dx = √π/2', suggerimento: 'Integrale di Gauss' },
    { testo: 'Calcolare: ∫ √(tan x) dx', suggerimento: 'Sostituzione' },
    { testo: 'Calcolare l\'area racchiusa da r = 2cos(θ) (coordinate polari).', suggerimento: null },
    { testo: 'Calcolare: ∫₀^(π/2) 1/(1 + tan^n(x)) dx per n ∈ ℕ', suggerimento: 'Simmetria' },
    { testo: 'Calcolare il volume del solido ottenuto ruotando y = e^(-x) attorno all\'asse x per x ≥ 0.', suggerimento: null },
    { testo: 'Calcolare: ∫ x·e^x·sin(x) dx', suggerimento: 'Per parti ripetute' },
    { testo: 'Calcolare la lunghezza dell\'arco di y = cosh(x) per x ∈ [0, 1].', suggerimento: null }
  ],
  geometria: [
    { testo: 'Trovare l\'equazione dell\'ellisse con fuochi F₁(-3,0), F₂(3,0) passante per (5,0).', suggerimento: null },
    { testo: 'Data l\'iperbole xy = 4, trovare le tangenti parallele alla retta x + y = 0.', suggerimento: null },
    { testo: 'Calcolare la distanza tra le rette r: (x-1)/2 = (y+1)/3 = z/1 e s: (x+1)/2 = y/3 = (z-2)/1.', suggerimento: null },
    { testo: 'Trovare il piano tangente alla superficie z = x² + y² nel punto (1, 1, 2).', suggerimento: null },
    { testo: 'Calcolare il raggio della sfera inscritta nel tetraedro di vertici O, A(1,0,0), B(0,1,0), C(0,0,1).', suggerimento: null },
    { testo: 'Data la parabola y² = 8x, trovare il luogo dei punti medi delle corde passanti per il fuoco.', suggerimento: null },
    { testo: 'Trovare l\'equazione della conica passante per (0,0), (1,0), (0,1), (1,1), (2,3).', suggerimento: null },
    { testo: 'Calcolare l\'area del triangolo di vertici A(1,2,3), B(4,0,5), C(2,1,0).', suggerimento: 'Prodotto vettoriale' },
    { testo: 'Trovare le generatrici del cono x² + y² = z² passanti per il punto (1, 1, √2).', suggerimento: null },
    { testo: 'Data la curva r(t) = (cos t, sin t, t), calcolare curvatura e torsione.', suggerimento: null }
  ],
  probabilita: [
    { testo: 'In un gioco si lanciano 3 dadi. Calcolare P(somma = 10).', suggerimento: null },
    { testo: 'Da un\'urna con 4 palline numerate 1,2,3,4 si estraggono 2 palline. Calcolare E[X·Y].', suggerimento: null },
    { testo: 'Sia X ~ N(μ, σ²). Calcolare P(|X - μ| < 2σ).', suggerimento: 'Distribuzione normale' },
    { testo: 'Un test ha 20 domande V/F. Rispondendo a caso, qual è P(almeno 15 corrette)?', suggerimento: 'Binomiale' },
    { testo: 'Calcolare la varianza di X se P(X=k) = 1/2^k per k = 1, 2, 3, ...', suggerimento: null },
    { testo: 'Due giocatori lanciano alternamente un dado. Vince chi ottiene 6. Calcolare P(vince il primo).', suggerimento: 'Serie geometrica' },
    { testo: 'In un\'urna ci sono n palline numerate. Si estrae fino a ottenere la pallina 1. Calcolare E[estrazioni].', suggerimento: null },
    { testo: 'Siano X, Y v.a. indipendenti con X ~ Exp(λ), Y ~ Exp(μ). Calcolare P(X < Y).', suggerimento: null },
    { testo: 'Un sistema ha 3 componenti in parallelo con affidabilità 0.9. Calcolare l\'affidabilità del sistema.', suggerimento: null },
    { testo: 'Calcolare la funzione generatrice dei momenti di X ~ Poisson(λ).', suggerimento: null }
  ],
  equazioni_diff: [
    { testo: 'Risolvere: y\' = y² - 1 con y(0) = 0.', suggerimento: 'A variabili separabili' },
    { testo: 'Risolvere: y\'\' + y = tan(x).', suggerimento: 'Variazione delle costanti' },
    { testo: 'Trovare la soluzione di y\' = (x + y)/(x - y).', suggerimento: 'Omogenea' },
    { testo: 'Risolvere: x²y\'\' - 2xy\' + 2y = 0 (equazione di Eulero).', suggerimento: null },
    { testo: 'Risolvere il sistema: x\' = x - y, y\' = x + y.', suggerimento: 'Autovalori' },
    { testo: 'Trovare la soluzione di y\' + y·tan(x) = cos(x).', suggerimento: 'Fattore integrante' },
    { testo: 'Risolvere: y\'\' + 4y = sin(2x).', suggerimento: 'Risonanza' },
    { testo: 'Data y\'\' - y = e^x, trovare una soluzione particolare.', suggerimento: null },
    { testo: 'Risolvere: (1 + x²)y\' + 2xy = 1/(1 + x²).', suggerimento: null },
    { testo: 'Trovare le curve ortogonali alla famiglia y = cx².', suggerimento: null }
  ],
  trigonometria: [
    { testo: 'Risolvere: cos(2x) + cos(4x) + cos(6x) = 0.', suggerimento: 'Formule di prostaferesi' },
    { testo: 'Calcolare: sin(π/5) usando l\'equazione di 5° grado.', suggerimento: null },
    { testo: 'Dimostrare: tan(x) + tan(y) + tan(z) = tan(x)·tan(y)·tan(z) se x + y + z = π.', suggerimento: null },
    { testo: 'Risolvere: arcsin(x) + arccos(x) = π/2 e spiegare perché.', suggerimento: null },
    { testo: 'Calcolare: Σ(k=0 to n) cos(kx) usando i numeri complessi.', suggerimento: 'Serie geometrica' },
    { testo: 'In un triangolo, dimostrare: a/sin(A) = 2R dove R è il raggio della circonferenza circoscritta.', suggerimento: null },
    { testo: 'Risolvere: sin(x) + sin(2x) + sin(3x) = 0 per x ∈ [0, 2π].', suggerimento: null },
    { testo: 'Calcolare: arctan(1) + arctan(2) + arctan(3).', suggerimento: null },
    { testo: 'Dimostrare: sin²(x) + sin²(x + 2π/3) + sin²(x + 4π/3) = 3/2.', suggerimento: null },
    { testo: 'Trovare il massimo di f(x) = sin(x) + sin(2x)/2 + sin(3x)/3.', suggerimento: null }
  ],
  numeri_complessi: [
    { testo: 'Calcolare tutte le radici di z⁵ = 1 + i.', suggerimento: 'Forma esponenziale' },
    { testo: 'Trovare z ∈ ℂ tale che z + 1/z sia reale.', suggerimento: null },
    { testo: 'Calcolare: (1 + i)^20 + (1 - i)^20.', suggerimento: 'Formula di De Moivre' },
    { testo: 'Risolvere: z⁴ + z³ + z² + z + 1 = 0.', suggerimento: 'Radici dell\'unità' },
    { testo: 'Trovare il luogo dei punti z tali che |z - 1| = 2|z + 1|.', suggerimento: null },
    { testo: 'Calcolare: Σ(k=0 to n-1) e^(2πik/n).', suggerimento: null },
    { testo: 'Dimostrare che se |z| = 1 allora z + 1/z è reale.', suggerimento: null },
    { testo: 'Trovare z tale che z³ = z̄ (coniugato).', suggerimento: null },
    { testo: 'Calcolare l\'argomento principale di (1 + i√3)^10.', suggerimento: null },
    { testo: 'Risolvere: |z|² + z + z̄ = 0.', suggerimento: null }
  ]
};

// Problemi di matematica molto diversificati
const problemiMatematica = [
  {
    titolo: 'Studio di funzione con parametro',
    introduzione: 'Sia data la famiglia di funzioni:',
    funzioni: { 'f_k(x)': '(x² - k)·e^(-x) con k ∈ ℝ' },
    punti: [
      'Determinare dominio, simmetrie e comportamento agli estremi per ogni k.',
      'Studiare segno, monotonia e concavità di f_k(x) al variare di k.',
      'Determinare per quali valori di k la funzione ha esattamente due zeri.',
      'Calcolare l\'area della regione compresa tra il grafico di f₁(x) e l\'asse x.',
      'Trovare il valore di k per cui il massimo relativo di f_k(x) vale 1.'
    ]
  },
  {
    titolo: 'Problema di ottimizzazione',
    contesto: 'Un\'azienda produce x unità di un bene con costo totale C(x) = x³ - 6x² + 15x + 10 e ricavo R(x) = 20x - x².',
    punti: [
      'Determinare la funzione profitto P(x) e studiarne il segno.',
      'Trovare la quantità x che massimizza il profitto.',
      'Calcolare il costo marginale e il ricavo marginale. Per quale x sono uguali?',
      'Determinare l\'elasticità del costo rispetto alla quantità prodotta.',
      'Se il prezzo di vendita aumenta del 10%, come varia la quantità ottimale?'
    ]
  },
  {
    titolo: 'Successioni e serie',
    introduzione: 'Si consideri la successione definita per ricorrenza:',
    dati: { 'a₁': '1', 'aₙ₊₁': '(aₙ + 2)/(aₙ + 1)' },
    punti: [
      'Dimostrare che la successione è limitata.',
      'Studiare la monotonia della successione.',
      'Calcolare il limite della successione.',
      'Determinare la velocità di convergenza.',
      'Studiare la serie Σ(aₙ - L) dove L è il limite trovato.'
    ]
  },
  {
    titolo: 'Geometria analitica nello spazio',
    contesto: 'Nel riferimento cartesiano Oxyz, si considerino il piano π: x + 2y - z = 3 e la retta r: (x-1)/2 = (y+1)/1 = z/(-1).',
    punti: [
      'Verificare che r e π sono incidenti e trovare il punto di intersezione.',
      'Calcolare l\'angolo tra r e π.',
      'Trovare l\'equazione della retta s passante per P(1,0,2), parallela a π e incidente r.',
      'Determinare il piano contenente r e perpendicolare a π.',
      'Calcolare la distanza del punto Q(0,0,0) dalla retta r.'
    ]
  },
  {
    titolo: 'Integrazione e applicazioni',
    introduzione: 'Si consideri la funzione f(x) = x·ln(x) per x > 0.',
    punti: [
      'Calcolare ∫₁^e f(x) dx.',
      'Determinare la primitiva F(x) tale che F(1) = 0.',
      'Calcolare il volume del solido ottenuto ruotando il grafico di f attorno all\'asse x per x ∈ [1, e].',
      'Trovare il baricentro della regione piana delimitata da f, l\'asse x e le rette x = 1, x = e.',
      'Studiare la convergenza di ∫₀^1 f(x) dx (integrale improprio).'
    ]
  },
  {
    titolo: 'Equazioni differenziali e modelli',
    contesto: 'La temperatura T di un corpo segue la legge di Newton del raffreddamento: dT/dt = -k(T - Tₐ) dove Tₐ = 20°C è la temperatura ambiente.',
    dati: { 'T(0)': '100°C', 'T(10)': '60°C' },
    punti: [
      'Risolvere l\'equazione differenziale e determinare T(t).',
      'Calcolare il valore della costante k.',
      'Dopo quanto tempo la temperatura sarà 30°C?',
      'Calcolare la velocità di raffreddamento quando T = 50°C.',
      'Determinare il tempo necessario affinché la temperatura scenda del 90% rispetto a (T₀ - Tₐ).'
    ]
  }
];

// Quesiti specifici per GRECO
const quesitiGreco = {
  comprensione: [
    'Analizza il contenuto del brano, evidenziando la tesi centrale e le argomentazioni a supporto.',
    'Riassumi il passo individuando i nuclei tematici fondamentali e il loro sviluppo logico.',
    'Contestualizza il brano nell\'opera e nel pensiero dell\'autore, spiegandone la rilevanza.',
    'Illustra il rapporto tra il contenuto del brano e il contesto storico-culturale dell\'Atene classica.',
    'Spiega come il brano si inserisce nel dibattito filosofico/letterario dell\'epoca.',
    'Analizza la struttura argomentativa del testo, distinguendo premesse, sviluppo e conclusioni.',
    'Individua i riferimenti mitologici o storici presenti e spiegane la funzione nel testo.',
    'Esamina il rapporto tra l\'autore e il suo pubblico come emerge dal brano.'
  ],
  analisi: [
    'Analizza le figure retoriche presenti nel brano, spiegandone la funzione espressiva.',
    'Esamina la struttura sintattica del periodo greco, commentando l\'uso di ipotassi e paratassi.',
    'Individua e commenta i principali fenomeni morfologici (forme verbali, casi, modi).',
    'Analizza il lessico del brano, evidenziando i campi semantici e le scelte terminologiche.',
    'Commenta l\'uso delle particelle greche e la loro funzione nella costruzione del discorso.',
    'Esamina l\'uso dei tempi e degli aspetti verbali in relazione alla narrazione.',
    'Analizza le scelte stilistiche dell\'autore in rapporto al genere letterario.',
    'Individua eventuali figure di suono e commentane l\'effetto.'
  ],
  approfondimento: [
    'Confronta il tema del brano con la trattazione dello stesso in altri autori greci.',
    'Rifletti sull\'attualità del messaggio, collegandolo a questioni contemporanee.',
    'Illustra l\'influenza del pensiero espresso sulla cultura occidentale successiva.',
    'Confronta la posizione dell\'autore con quella di altri pensatori greci sullo stesso tema.',
    'Analizza la ricezione del testo nella tradizione letteraria e filosofica.',
    'Proponi un\'interpretazione personale argomentata del significato del brano.',
    'Discuti il rapporto tra il brano e la tradizione letteraria precedente.',
    'Rifletti sul valore educativo del testo nella prospettiva greca e in quella moderna.'
  ]
};

// Quesiti specifici per LATINO
const quesitiLatino = {
  comprensione: [
    'Analizza il contenuto del brano, evidenziando il messaggio centrale e la sua articolazione.',
    'Sintetizza il passo spiegando il problema affrontato e la posizione dell\'autore.',
    'Contestualizza il brano nell\'opera complessiva e nel pensiero dell\'autore.',
    'Illustra il rapporto tra il contenuto e il contesto storico-politico romano.',
    'Spiega la funzione del brano nell\'economia dell\'opera da cui è tratto.',
    'Analizza la struttura argomentativa, individuando tesi, antitesi e sintesi.',
    'Individua i riferimenti storici o mitologici e spiegane il significato.',
    'Esamina il rapporto tra l\'autore e il potere politico come emerge dal testo.'
  ],
  analisi: [
    'Analizza le figure retoriche, spiegandone la funzione persuasiva o espressiva.',
    'Esamina la struttura del periodo latino, commentando la costruzione sintattica.',
    'Individua e commenta le scelte lessicali significative e i tecnicismi.',
    'Analizza l\'uso dei modi e dei tempi verbali in relazione al contenuto.',
    'Commenta la struttura della frase, evidenziando l\'ordine delle parole.',
    'Esamina l\'uso dei connettivi e la loro funzione nella coesione testuale.',
    'Analizza le scelte stilistiche in rapporto al genere letterario di appartenenza.',
    'Individua eventuali clausole metriche o effetti ritmici nella prosa.'
  ],
  approfondimento: [
    'Confronta il tema con la sua trattazione in altri autori latini o greci.',
    'Rifletti sull\'attualità del messaggio in relazione al mondo contemporaneo.',
    'Illustra l\'influenza del pensiero espresso sulla cultura europea successiva.',
    'Analizza il rapporto tra il brano e i modelli greci di riferimento.',
    'Discuti la fortuna del testo o dell\'autore nella tradizione letteraria.',
    'Proponi un\'interpretazione personale supportata da argomentazioni testuali.',
    'Confronta la visione dell\'autore con quella di altri intellettuali romani.',
    'Rifletti sul valore formativo del testo nella prospettiva romana e moderna.'
  ]
};

// Funzione per aggiornare i quesiti di una simulazione
function aggiornaQuesiti(simulazione, tipo, numero) {
  const quesiti = tipo === 'greco' ? quesitiGreco : quesitiLatino;
  
  if (simulazione.struttura && simulazione.struttura.seconda_parte) {
    const nuoviQuesiti = [
      {
        numero: 1,
        tipo: 'comprensione',
        testo: quesiti.comprensione[numero % quesiti.comprensione.length],
        punti_max: 5
      },
      {
        numero: 2,
        tipo: 'analisi',
        testo: quesiti.analisi[(numero + 3) % quesiti.analisi.length],
        punti_max: 5
      },
      {
        numero: 3,
        tipo: 'approfondimento',
        testo: quesiti.approfondimento[(numero + 5) % quesiti.approfondimento.length],
        punti_max: 10
      }
    ];
    
    simulazione.struttura.seconda_parte.quesiti = nuoviQuesiti;
  }
  
  return simulazione;
}

// Funzione per aggiornare simulazioni matematica
function aggiornaMatematica(simulazione, numero) {
  const argomenti = Object.keys(quesitiMatematica);
  
  // Seleziona 8 quesiti da argomenti diversi, ruotando in base al numero
  const nuoviQuesiti = [];
  for (let i = 0; i < 8; i++) {
    const argomento = argomenti[(numero + i) % argomenti.length];
    const quesitiArg = quesitiMatematica[argomento];
    const quesito = quesitiArg[(numero + i * 3) % quesitiArg.length];
    
    nuoviQuesiti.push({
      numero: i + 1,
      argomento: argomento,
      testo: quesito.testo,
      suggerimento: quesito.suggerimento
    });
  }
  
  simulazione.quesiti = nuoviQuesiti;
  
  // Aggiorna anche i problemi se possibile
  const prob1 = problemiMatematica[numero % problemiMatematica.length];
  const prob2 = problemiMatematica[(numero + 3) % problemiMatematica.length];
  
  simulazione.problemi = [
    {
      numero: 'PROBLEMA 1',
      titolo: prob1.titolo,
      introduzione: prob1.introduzione || null,
      contesto: prob1.contesto || null,
      funzioni: prob1.funzioni || null,
      dati: prob1.dati || null,
      punti: prob1.punti.map((p, i) => ({ lettera: String.fromCharCode(97 + i), testo: p }))
    },
    {
      numero: 'PROBLEMA 2',
      titolo: prob2.titolo,
      introduzione: prob2.introduzione || null,
      contesto: prob2.contesto || null,
      funzioni: prob2.funzioni || null,
      dati: prob2.dati || null,
      punti: prob2.punti.map((p, i) => ({ lettera: String.fromCharCode(97 + i), testo: p }))
    }
  ];
  
  return simulazione;
}

// Aggiorna simulazioni matematica
const matDir = path.join(simulazioniDir, 'matematica');
if (fs.existsSync(matDir)) {
  const files = fs.readdirSync(matDir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  console.log(`Aggiornamento ${files.length} simulazioni di matematica...`);
  
  files.forEach((file, idx) => {
    const filepath = path.join(matDir, file);
    const sim = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    const updated = aggiornaMatematica(sim, idx);
    fs.writeFileSync(filepath, JSON.stringify(updated, null, 2));
  });
  console.log('✅ Matematica completata');
}

// Aggiorna simulazioni greco
const grecoDir = path.join(simulazioniDir, 'greco');
if (fs.existsSync(grecoDir)) {
  const files = fs.readdirSync(grecoDir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  console.log(`Aggiornamento ${files.length} simulazioni di greco...`);
  
  files.forEach((file, idx) => {
    const filepath = path.join(grecoDir, file);
    const sim = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    const updated = aggiornaQuesiti(sim, 'greco', idx);
    fs.writeFileSync(filepath, JSON.stringify(updated, null, 2));
  });
  console.log('✅ Greco completato');
}

// Aggiorna simulazioni latino
const latinoDir = path.join(simulazioniDir, 'latino');
if (fs.existsSync(latinoDir)) {
  const files = fs.readdirSync(latinoDir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
  console.log(`Aggiornamento ${files.length} simulazioni di latino...`);
  
  files.forEach((file, idx) => {
    const filepath = path.join(latinoDir, file);
    const sim = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    const updated = aggiornaQuesiti(sim, 'latino', idx);
    fs.writeFileSync(filepath, JSON.stringify(updated, null, 2));
  });
  console.log('✅ Latino completato');
}

console.log('🎉 Rigenerazione completata!');
