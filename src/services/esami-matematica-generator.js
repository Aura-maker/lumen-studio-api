// ✅ GENERATORE ESAMI MATEMATICA - Seconda Prova Maturità
// Genera migliaia di tracce complete

class GeneratoreEsamiMatematica {
  constructor() {
    this.esami = [];
  }

  genera(numeroEsami = 100) {
    console.log(`📐 Generazione ${numeroEsami} esami Matematica...`);
    
    for (let i = 1; i <= numeroEsami; i++) {
      this.esami.push({
        id: `MAT_${i}`,
        titolo: `Simulazione Matematica ${i}`,
        durata: 360, // 6 ore
        istruzioni: 'Scegliere 1 problema tra i 2 proposti + 4 quesiti tra gli 8 proposti.',
        struttura: {
          problemi: 2,
          quesiti: 8,
          daRisolvere: { problemi: 1, quesiti: 4 }
        },
        problemi: [
          this.generaProblema(i, 1),
          this.generaProblema(i, 2)
        ],
        quesiti: this.generaQuesiti(i)
      });
    }
    
    console.log(`✅ ${this.esami.length} esami Matematica pronti!`);
    return this.esami;
  }

  generaProblema(n, pNum) {
    const temi = ['funzioni_cerchio', 'funzioni_esponenziali', 'geometria_solida', 'probabilita_combinatoria', 'ottimizzazione_area'];
    const tema = temi[(n + pNum) % temi.length];
    
    const generatori = {
      funzioni_cerchio: () => ({
        citazione: '"La ragione non è nulla senza l\'immaginazione" - Cartesio',
        tipo: 'Studio di funzione con circonferenza',
        testo: `Dati r > 0 e k < 0, si considerino la circonferenza Cᵣ, di centro l'origine e raggio r, e la funzione fₖ(x) = k|x|.`,
        punti: [
          { 
            lettera: 'a', 
            richiesta: `Verificare che fₖ è continua ma non derivabile in x = 0 qualunque sia il valore di k. Individuare i due valori di r in corrispondenza dei quali Cᵣ delimita con il grafico di fₖ, per opportuni valori di k, un settore circolare nel semipiano y ≤ 0 di area π e contorno di lunghezza 4 + π. Stabilito che r = 2 è il maggiore di tali valori, in uno stesso riferimento cartesiano Oxy, tracciare la circonferenza C₂ e il grafico della funzione f₋₁.

[Istruzioni per il grafico: Tracciare la circonferenza di centro O e raggio 2. Il grafico di f₋₁(x) = -|x| è una 'V' rovesciata con vertice in O(0,0) e pendenze ±1. La circonferenza e la funzione si intersecano nei punti (-√2, -√2) e (√2, -√2)]`, 
            punteggio: 5 
          },
          { 
            lettera: 'b', 
            richiesta: `Studiare la funzione g(x) = √(4 - x²), specificandone dominio, simmetrie, punti di non derivabilità, intervalli di monotonia ed insieme immagine. Verificare che il grafico di g coincide con la parte di C₂ che si trova nel semipiano y ≥ 0. Spiegare perché g non è invertibile nel suo dominio ed esplicitare l'intervallo [a; b] di ampiezza massima, con b > 0, nel quale g ammette una funzione inversa h. Qual è l'espressione analitica di h?`, 
            punteggio: 5 
          },
          { 
            lettera: 'c', 
            richiesta: `Sia A un punto del grafico di g, situato nel I quadrante, e siano M e R le sue proiezioni ortogonali sugli assi del riferimento. Determinare le coordinate di A in modo che il quadrilatero AMOR abbia area massima. Dopo aver verificato che tale quadrilatero è un quadrato, dimostrare che è anche quello di perimetro massimo.

[Suggerimento: Se A ha coordinate (x, √(4-x²)) con 0 < x < 2, allora l'area del rettangolo AMOR è S(x) = x·√(4-x²). Massimizzare usando la derivata.]`, 
            punteggio: 5 
          },
          { 
            lettera: 'd', 
            richiesta: `Si consideri la funzione F(x) = ∫₋₂ˣ √(4 - t²) dt, con x ∈ [-2; 2]. Determinare F(2) e tracciare un grafico di F, dopo averne studiato monotonia e concavità. Scrivere, inoltre, l'equazione della retta tangente al grafico di F nel suo punto di flesso.

[Note: F(x) rappresenta l'area sotto la semicirconferenza da -2 a x. F(2) = π·2²/2 = 2π. La derivata F'(x) = √(4-x²) indica che F è crescente. Il punto di flesso si trova dove F''(x) = 0]`, 
            punteggio: 5 
          }
        ]
      }),
      
      funzioni_esponenziali: () => ({
        citazione: '"La bellezza è mescolare, in giuste proporzioni, il finito e l\'infinito" - attribuita a Platone',
        tipo: 'Funzioni con parametri esponenziali',
        testo: `I grafici γ₁ e γ₂ rappresentano, rispettivamente, le funzioni f e g, definite su ℝ, le cui espressioni analitiche sono:

f(x) = p(x) · e^(φ(x)),    g(x) = q(x) · e^(φ(x))

con p(x) e q(x) polinomi di secondo grado.`,
        punti: [
          { 
            lettera: 'a', 
            richiesta: `Determinare i polinomi p(x) e q(x) utilizzando le informazioni deducibili dai grafici in figura, considerando che φ = (1+√5)/2 è ascissa di un punto stazionario di f e che -φ, ascissa del punto A, è uno zero di g.

[Informazioni grafiche: Osservare massimi, minimi, zeri e comportamento asintotico delle funzioni. Il grafico mostra che f ha un massimo locale e g ha uno zero in x = -φ ≈ -1.618]`, 
            punteggio: 5 
          },
          { 
            lettera: 'b', 
            richiesta: `Posto che p(x) = x - x², studiare la funzione f specificando l'equazione dell'asintoto, le ascisse dei punti stazionari e di flesso. Verificare che la retta di equazione x = 1/2 è asse di simmetria per γ₁. Determinare l'insieme immagine di f e indicare, al variare del parametro reale k, il numero di soluzioni dell'equazione f(x) = k.`, 
            punteggio: 5 
          },
          { 
            lettera: 'c', 
            richiesta: `Stabilito altresì che q(x) = 1 - x - x², verificare che 1/φ è l'ulteriore zero di g e che il triangolo ABC è rettangolo. Dimostrare che γ₁ e γ₂ hanno un unico punto di intersezione, del quale si chiedono le coordinate. Considerati su γ₁ e γ₂, rispettivamente, i punti P₁ e P₂ aventi uguale ascissa x ≥ 1/2, calcolare la lunghezza massima che può assumere il segmento P₁P₂.

[Note geometriche: Il triangolo ABC è formato dai punti A(-φ,0), B(1/φ,0) e C dato dall'intersezione. Verificare che AB·BC forma un angolo retto.]`, 
            punteggio: 5 
          },
          { 
            lettera: 'd', 
            richiesta: `Calcolare l'area della regione limitata R compresa tra γ₁, γ₂ e l'asse delle ordinate. Individuare, successivamente, il valore di t ≥ 1/2 affinché la retta x = t delimiti con i due grafici una regione R' equivalente ad R.

[Calcolo integrale: L'area è data da ∫₀ᵃ |f(x) - g(x)| dx dove a è l'ascissa del punto di intersezione]`, 
            punteggio: 5 
          }
        ]
      }),
      probabilita_combinatoria: () => ({
        citazione: '"Siccome mi sembrava che per puro caso alcuni fatti fossero avvenuti così com\'erano stati predetti dagl\'indovini..." - Cicerone, De divinatione',
        tipo: 'Probabilità e combinatoria',
        testo: `Cicerone, nel dialogo con il fratello Quinto, parla del "colpo di Venere", che consiste nel lanciare 4 dadi a 4 facce ottenendo 4 risultati diversi.`,
        punti: [
          { 
            lettera: 'a', 
            richiesta: `Supponendo che le facce di ciascun dado siano equiprobabili, determinare:

• La probabilità di ottenere il colpo di Venere nel lancio di 4 dadi (cioè 4 numeri tutti diversi)
• La probabilità di ottenere 4 numeri tutti uguali

[Suggerimento: Spazio campionario ha 4⁴ = 256 casi possibili. Per il colpo di Venere usare le permutazioni: 4!/1 · 1/4⁴. Per quattro numeri uguali: 4 casi favorevoli su 256]`, 
            punteggio: 5 
          },
          { 
            lettera: 'b', 
            richiesta: `Quanti sono gli anagrammi, anche senza significato, della parola "STUDIARE"? In quanti di tali anagrammi si può leggere consecutivamente la parola "ARTE", come ad esempio in "SUARTEDI"? 

[Analisi: STUDIARE ha 8 lettere con nessuna ripetuta. Gli anagrammi sono 8! = 40.320. Per ARTE consecutivo, trattare ARTE come un unico blocco: permutare 5 elementi (ARTE, S, U, D, I)]`, 
            punteggio: 5 
          },
          { 
            lettera: 'c', 
            richiesta: `Quanti sono gli anagrammi, anche senza significato, della parola "VACANZA"?

[Attenzione: VACANZA ha 7 lettere con A ripetuta 3 volte. Formula: 7! / 3! = 5.040 / 6 = 840]`, 
            punteggio: 5 
          },
          { 
            lettera: 'd', 
            richiesta: `Un'urna contiene 5 palline rosse e 3 palline bianche. Si estraggono 3 palline senza reinserimento. Calcolare:

• P(tutte e 3 rosse)
• P(almeno 1 bianca)
• Il valore atteso del numero di palline rosse estratte

[Usare combinazioni: C(5,3) per 3 rosse su C(8,3) totali. Per "almeno 1 bianca" usare il complementare]`, 
            punteggio: 5 
          }
        ]
      }),
      geometria_solida: () => ({
        citazione: '"La geometria è la scienza dello spazio, e lo spazio è una delle forme a priori della nostra sensibilità" - Immanuel Kant',
        tipo: 'Geometria analitica e solida',
        testo: `Dato un triangolo ABC, sia M il punto medio del lato BC e siano B' e C' due punti, rispettivamente, sul lato AB e sul lato AC, in modo tale che AB' = (1/3)AB e AC' = (1/3)AC.`,
        punti: [
          { 
            lettera: 'a', 
            richiesta: `Dimostrare che, se i segmenti MB' e MC' sono tra loro congruenti, allora lo sono anche i lati AB e AC (cioè il triangolo è isoscele).

[Suggerimento: Usare il teorema di Pitagora nei triangoli rettangoli appropriati o le coordinate. Se il triangolo è isoscele con AB = AC, la simmetria garantisce MB' = MC']`, 
            punteggio: 5 
          },
          { 
            lettera: 'b', 
            richiesta: `Si considerino la superficie sferica di equazione (x-1)² + (y-2)² + z² = 1 e il piano π di equazione x - 2y - 2z + d = 0. Discutere, al variare del parametro reale d, se il piano π è secante, tangente o esterno alla superficie sferica. Determinare il valore del parametro d in modo che π divida la sfera in due parti uguali.

[Metodo: Calcolare la distanza del centro C(1,2,0) dal piano π usando la formula d = |ax₀+by₀+cz₀+d|/√(a²+b²+c²). Confrontare con il raggio r = 1]`, 
            punteggio: 5 
          },
          { 
            lettera: 'c', 
            richiesta: `Determinare l'equazione della retta r passante per i punti A(1,0,2) e B(3,1,-1). Calcolare la distanza del punto P(0,2,1) dalla retta r. Trovare, inoltre, le coordinate del punto H, proiezione ortogonale di P su r.

[Equazione parametrica: r: (x,y,z) = A + t(B-A). Per la distanza usare |AP×(B-A)|/|B-A|. Il punto H si trova minimizzando |PH|]`, 
            punteggio: 5 
          },
          { 
            lettera: 'd', 
            richiesta: `Un tetraedro regolare ABCD ha spigolo di lunghezza a = 6 cm. Calcolare:

• Il volume del tetraedro
• L'area della superficie totale
• Il raggio della sfera inscritta nel tetraedro
• L'angolo formato da due facce adiacenti

[Formule: Volume = a³/(6√2), Area = a²√3, raggio sfera inscritta r = a/(2√6)]`, 
            punteggio: 5 
          }
        ]
      }),
      ottimizzazione_area: () => ({
        citazione: '"La natura opera sempre per le vie più brevi" - Aristotele',
        tipo: 'Ottimizzazione e calcolo integrale',
        testo: `Si consideri un rettangolo ABCD di base AB = 2b e altezza AD = h, con h < b. Dal punto medio M del lato AB si tracciano i segmenti MC e MD che dividono il rettangolo in tre regioni.`,
        punti: [
          { 
            lettera: 'a', 
            richiesta: `Posto b = 3 e h = 2, determinare:

• Le coordinate dei vertici A, B, C, D in un sistema cartesiano con origine in M
• Le equazioni delle rette MC e MD
• L'area di ciascuna delle tre regioni in cui è diviso il rettangolo
• Verificare che le due regioni triangolari sono congruenti

[Sistema di riferimento: Porre M nell'origine, AB sull'asse x. Allora A(-3,0), B(3,0), C(3,2), D(-3,2)]`, 
            punteggio: 5 
          },
          { 
            lettera: 'b', 
            richiesta: `Mantenendo fissa la base 2b = 6, determinare il valore dell'altezza h che massimizza l'area della regione centrale (quadrilatera). Calcolare l'area massima e verificare che corrisponde a h = b/√2.

[L'area del quadrilatero centrale è A(h) = 2b·h - 2·(1/2)·b·h = b·h. Massimizzare rispetto ai vincoli geometrici]`, 
            punteggio: 5 
          },
          { 
            lettera: 'c', 
            richiesta: `Si inscriva nel rettangolo ABCD (con b = 3, h = 2) un'ellisse avente gli assi coincidenti con gli assi del rettangolo. Determinare l'equazione dell'ellisse e calcolare:

• La sua area (formula: A = πab dove a e b sono i semiassi)
• Il rapporto tra l'area dell'ellisse e l'area del rettangolo
• I punti dell'ellisse nei quali la tangente ha coefficiente angolare m = 1

[Equazione ellisse: x²/9 + y²/4 = 1. Per le tangenti usare la condizione di tangenza]`, 
            punteggio: 5 
          },
          { 
            lettera: 'd', 
            richiesta: `Sia R la regione del piano delimitata dall'ellisse x²/9 + y²/4 = 1. Calcolare il volume del solido ottenuto facendo ruotare R:

• Attorno all'asse x (ellissoide di rotazione)
• Attorno all'asse y
• Spiegare perché i due volumi sono diversi nonostante la regione sia la stessa

[Formula volume di rotazione: V = π∫[a,b] [f(x)]² dx. Per l'ellisse: Vₓ = (16π²)/3, Vᵧ = 24π]`, 
            punteggio: 5 
          }
        ]
      })
    };
    
    const prob = generatori[tema]();
    
    // Aggiungi spiegazioni soluzioni per ogni punto
    const puntiConSoluzione = prob.punti.map(punto => ({
      ...punto,
      spiegazione: this.generaSpiegazionePunto(tema, punto.lettera)
    }));
    
    return { 
      numero: pNum, 
      ...prob, 
      punti: puntiConSoluzione,
      punteggio: 20 
    };
  }

  generaSpiegazionePunto(tema, lettera) {
    // Spiegazioni generiche per ogni punto
    const spiegazioni = {
      funzioni_cerchio: {
        a: 'Per verificare la continuità in x=0, controllare che lim(x→0⁻) f(x) = lim(x→0⁺) f(x) = f(0). Per la derivabilità, calcolare le derivate destra e sinistra in x=0. Per i valori di r, usare le formule dell\'area e della lunghezza del settore circolare.',
        b: 'Dominio: -2 ≤ x ≤ 2 (dalla radice quadrata). Simmetria: pari rispetto all\'asse y. Non derivabile in x = ±2 (tangente verticale). Decrescente per x > 0, crescente per x < 0. Insieme immagine: [0, 2]. Non è invertibile in [-2, 2] perché non è iniettiva. L\'intervallo di inversione massimo con b > 0 è [0, 2], e h(x) = √(4-x²).',
        c: 'Se A = (x, √(4-x²)), allora M = (x, 0) e R = (0, √(4-x²)). Area AMOR = x·√(4-x²). Derivando e ponendo = 0: x = √2. Sostituendo: A(√2, √2), area = 2. Per verificare che è un quadrato: |AM| = |AR| = √2. Il perimetro è 4√2.',
        d: 'F(x) rappresenta l\'area della semicirconferenza da -2 a x. F(2) = area totale = π·2²/2 = 2π. F\'(x) = √(4-x²) > 0, quindi F è crescente. F\'\'(x) = -x/√(4-x²), si annulla in x=0 (punto di flesso). Tangente in (0, π): y = 2x + π.'
      },
      funzioni_esponenziali: {
        a: 'Dai grafici osservare: zeri, massimi/minimi, comportamento agli estremi. Usare le condizioni date: φ punto stazionario di f → p\'(φ) = 0; -φ zero di g → q(-φ) = 0. Risolvere il sistema per determinare p(x) e q(x).',
        b: 'Con p(x) = x - x², calcolare f\'(x) applicando la regola del prodotto. Asintoto: y → 0 per x → ±∞. Punti stazionari: f\'(x) = 0. Simmetria rispetto a x = 1/2. Insieme immagine: (0, f(1/2)]. Numero di soluzioni di f(x) = k dipende da k.',
        c: 'Con q(x) = 1 - x - x², trovare gli zeri risolvendo q(x) = 0. Verificare che il triangolo ABC ha un angolo retto calcolando i prodotti scalari. Per l\'intersezione, risolvere f(x) = g(x). Per la distanza massima P₁P₂, calcolare |f(x) - g(x)| e massimizzare.',
        d: 'Area R = ∫₀ᵃ |f(x) - g(x)| dx dove a è l\'ascissa di intersezione. Per R\' equivalente: ∫ₐᵗ |f(x) - g(x)| dx = R. Risolvere per t.'
      },
      probabilita_combinatoria: {
        a: 'Spazio campionario: 4⁴ = 256. Colpo di Venere (4 diversi): 4! = 24 casi. P = 24/256 = 3/32. Quattro uguali: 4 casi. P = 4/256 = 1/64.',
        b: 'STUDIARE ha 8 lettere distinte: 8! = 40.320 anagrammi. Per ARTE consecutivo, considerare ARTE come blocco unico con S,U,D,I: 5! = 120 anagrammi. Ma ARTE ha 4! = 24 permutazioni interne, quindi 120×24 = 2.880.',
        c: 'VACANZA ha 7 lettere con A ripetuta 3 volte: 7!/3! = 5.040/6 = 840 anagrammi.',
        d: 'P(3 rosse) = C(5,3)/C(8,3) = 10/56 = 5/28. P(almeno 1 bianca) = 1 - P(3 rosse) = 23/28. E[rosse] = 3·(5/8) = 15/8.'
      },
      geometria_solida: {
        a: 'Porre il triangolo in un sistema di coordinate. Se MB\' = MC\', usando il teorema di Pitagora o le distanze, dimostrare che AB = AC. Utilizzare la simmetria del triangolo isoscele.',
        b: 'Distanza centro-piano: d = |1-4+0+d|/√(1+4+4) = |d-3|/3. Piano tangente: d = 1±r. Piano secante: d < r. Piano passante per centro: d - 3 = 0 → d = 3.',
        c: 'Equazione parametrica: r(t) = (1,0,2) + t(2,1,-3). Distanza punto-retta: |AP×v|/|v| dove v è il vettore direttore. Per H, minimizzare |PH| o usare la proiezione.',
        d: 'Volume tetraedro: V = a³/(6√2) = 216/(6√2) = 18√2 cm³. Area totale: A = √3·a² = 36√3 cm². Raggio sfera inscritta: r = a/(2√6) = √6 cm. Angolo diedro: arccos(1/3) ≈ 70.5°.'
      },
      ottimizzazione_area: {
        a: 'Con M in origine: A(-3,0), B(3,0), C(3,2), D(-3,2). Rette: MC: y = (2/3)x, MD: y = -(2/3)x + 2. Aree: triangoli AMC e BMC hanno area 3, quadrilatero centrale ha area 6.',
        b: 'Area regione centrale: A(h) = 2b·h - 2·(1/2)·b·h = b·h = 6h. Per massimizzare con vincoli geometrici, derivare rispetto a h. Massimo quando h = b/√2 ≈ 4.24.',
        c: 'Ellisse: x²/9 + y²/4 = 1. Area = π·3·2 = 6π. Rapporto = 6π/12 = π/2 ≈ 1.57. Tangente con m=1: derivare implicitamente e risolvere.',
        d: 'Rotazione attorno a x: Vₓ = π∫₋₃³ (√(4(1-x²/9)))² dx = (16π²)/3. Rotazione attorno a y: Vᵧ = π∫₋₂² (3√(1-y²/4))² dy = 24π. Diversi perché i raggi di rotazione sono diversi.'
      }
    };
    
    return spiegazioni[tema]?.[lettera] || 'Applicare le formule e i metodi studiati per risolvere il punto richiesto.';
  }

  funzioneRandom(seed) {
    const funzioni = [
      'x·ln(x) - 2x + 3',
      '(x³ - 3x)/(x² + 1)',
      'ln(x² + 4) - 2ln(x + 2)',
      '√(x + 3)/(x - 1)',
      'x²·e⁻ˣ',
      'eˣ - x²'
    ];
    return funzioni[seed % funzioni.length];
  }

  generaQuesiti(n) {
    return [
      { 
        num: 1, 
        testo: `Calcolare lim(x→∞) ${this.limiteRandom(n, 0)}`, 
        punteggio: 5,
        soluzione: this.soluzioneLimit(n, 0),
        passaggi: `Dividendo numeratore e denominatore per il termine di grado massimo e applicando il limite si ottiene il risultato`
      },
      { 
        num: 2, 
        testo: `Derivare f(x) = ${this.funzioneDerivare(n, 0)}`, 
        punteggio: 5,
        soluzione: this.soluzioneDerivata(n, 0),
        passaggi: `Applicando la regola del quoziente/prodotto e la regola della catena si ottiene la derivata`
      },
      { 
        num: 3, 
        testo: `Risolvere: {x+y=${5+n%3}, x²-y²=${9+n%5}}`, 
        punteggio: 5,
        soluzione: this.soluzioneSistema(n),
        passaggi: `Dalla prima equazione ricavo y in funzione di x, sostituisco nella seconda e risolvo`
      },
      { 
        num: 4, 
        testo: this.probabilitaRandom(n), 
        punteggio: 5,
        soluzione: this.soluzioneProbabilita(n),
        passaggi: `Applicando le formule di probabilità e il calcolo combinatorio si ottiene il risultato`
      },
      { 
        num: 5, 
        testo: `Retta tangente y=${this.funzioneDerivare(n,1)} in x=${1+n%3}`, 
        punteggio: 5,
        soluzione: this.soluzioneTangente(n),
        passaggi: `Calcolo f(x₀) per il punto, f'(x₀) per il coefficiente angolare, poi uso y-y₀=m(x-x₀)`
      },
      { 
        num: 6, 
        testo: `Calcolare ∫ ${this.integraleRandom(n)} dx`, 
        punteggio: 5,
        soluzione: this.soluzioneIntegrale(n),
        passaggi: `Applicando le regole di integrazione si ottiene la primitiva + C`
      },
      { 
        num: 7, 
        testo: `Centro/raggio: x²+y²${this.circonferenzaRandom(n)}=0`, 
        punteggio: 5,
        soluzione: this.soluzioneCirconferenza(n),
        passaggi: `Portando l'equazione in forma canonica (x-a)²+(y-b)²=r² si ricavano centro e raggio`
      },
      { 
        num: 8, 
        testo: this.quesitoGeometriaRandom(n), 
        punteggio: 5,
        soluzione: this.soluzioneGeometria(n),
        passaggi: `Applicando le formule della geometria analitica si ottiene il risultato richiesto`
      }
    ];
  }

  // Metodi per generare soluzioni
  soluzioneLimit(n, i) {
    const soluzioni = ['3/2', '5', '1/2', '0'];
    return soluzioni[(n+i)%soluzioni.length];
  }

  soluzioneDerivata(n, i) {
    const soluzioni = [
      '(-x²+4x-3)/(x-2)²',
      '6x/(3x²+1)',
      'x(2-x)·e⁻ˣ',
      'e²ˣ(2sin(x)+cos(x))'
    ];
    return soluzioni[(n+i)%soluzioni.length];
  }

  soluzioneSistema(n) {
    const val = 5+n%3;
    const val2 = 9+n%5;
    return `x=${((val+Math.sqrt(val*val+4*val2))/2).toFixed(2)}, y=${((val-Math.sqrt(val*val+4*val2))/2).toFixed(2)}`;
  }

  soluzioneProbabilita(n) {
    const soluzioni = [
      'E[X]=2.1, Var(X)=0.49',
      'P(somma≥10)=1/6',
      'P(2 rosse)=25/64'
    ];
    return soluzioni[n % soluzioni.length];
  }

  soluzioneTangente(n) {
    const x0 = 1+n%3;
    return `y = mx + q (calcolare coefficiente angolare m=f'(${x0}) e termine noto)`;
  }

  soluzioneIntegrale(n) {
    const integrali = ['2x²-5x+C', 'x⁴/4-2x²+C', 'x³/3+x²+x+C', '(1/2)e^(x²)+C'];
    return integrali[n % integrali.length];
  }

  soluzioneCirconferenza(n) {
    const soluzioni = [
      'Centro: (2,-3), Raggio: √13',
      'Centro: (-1,4), Raggio: √17',
      'Centro: (3,-2), Raggio: √13'
    ];
    return soluzioni[n % soluzioni.length];
  }

  soluzioneGeometria(n) {
    const soluzioni = [
      'd = √29 ≈ 5.39',
      'y = -(1/4)x - 5/4',
      'x + 2y + 3z = 0',
      'y = x² - 4x + 3'
    ];
    return soluzioni[n % soluzioni.length];
  }

  limiteRandom(n, i) {
    const limiti = ['(3x²-1)/(2x²+5)', 'sin(5x)/x', '(1-cos(2x))/x²', 'ln(x)/x'];
    return limiti[(n+i)%limiti.length];
  }

  funzioneDerivare(n, i) {
    const f = ['(x²+3x)/(x-2)', 'ln(3x²+1)', 'x²·e⁻ˣ', 'e²ˣ·sin(x)'];
    return f[(n+i)%f.length];
  }

  probabilitaRandom(n) {
    const prob = [
      'Variabile X: P(1)=0.2, P(2)=0.5, P(3)=? Media? Varianza?',
      'Due dadi: P(somma ≥ 10)?',
      'Urna 5R, 3B: P(2 rosse con reimmissione)?'
    ];
    return prob[n % prob.length];
  }

  integraleRandom(n) {
    const integrali = ['4x-5', 'x³-4x', '(x+1)²', 'x·eˣ²'];
    return integrali[n % integrali.length];
  }

  circonferenzaRandom(n) {
    const segni = ['-4x+6y-3', '+2x-8y+7', '-6x+4y-12'];
    return segni[n % segni.length];
  }

  quesitoGeometriaRandom(n) {
    const quesiti = [
      'Distanza A(1,2,3) e B(4,6,0)',
      'Retta per (3,-2) ⊥ a y=4x+7',
      'Piano per (0,0,0) // x+2y+3z=1',
      'Parabola vertice (2,-1) per (0,3)'
    ];
    return quesiti[n % quesiti.length];
  }

  getEsame(id) {
    return this.esami.find(e => e.id === id);
  }

  getEsameCasuale() {
    return this.esami[Math.floor(Math.random() * this.esami.length)];
  }
}

module.exports = GeneratoreEsamiMatematica;
