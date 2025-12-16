// 🎓 GENERATORE ESAMI MATEMATICA AVANZATO - Livello Ministeriale
// Basato sui veri esami di Stato del Ministero dell'Istruzione

class GeneratoreEsamiMatematicaAvanzato {
  constructor() {
    this.esami = [];
    this.parametriVariabili = this.inizializzaParametri();
    this.temiComplessi = this.inizializzaTemiComplessi();
  }

  inizializzaParametri() {
    return {
      // Parametri per funzioni
      coefficienti: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5],
      esponenti: [2, 3, 4, 1/2, 1/3, -1, -2],
      basi: [2, 3, 5, 'e', 10],
      
      // Parametri geometrici
      raggi: [1, 2, 3, 4, 5, 6],
      centri: [[0,0], [1,0], [0,1], [-1,0], [0,-1], [2,1]],
      
      // Parametri probabilistici
      dadi: [4, 6, 8, 10, 12, 20],
      urne: [[3,2], [4,3], [5,3], [6,4], [7,5], [8,6]],
      
      // Parametri per anagrammi
      parole: ['STUDIARE', 'MATEMATICA', 'GEOMETRIA', 'ALGEBRA', 'CALCOLO', 'FUNZIONE', 'DERIVATA', 'INTEGRALE'],
      sottoparole: ['ARTE', 'MATE', 'GEO', 'CALC', 'DERI']
    };
  }

  inizializzaTemiComplessi() {
    return {
      // PROBLEMI COMPLESSI (Livello Ministeriale)
      funzioni_parametriche: {
        difficolta: 'molto_alta',
        citazioni: [
          '"La bellezza è mescolare, in giuste proporzioni, il finito e l\'infinito" - attribuita a Platone',
          '"La matematica è l\'alfabeto con cui Dio ha scritto l\'universo" - Galileo Galilei',
          '"In matematica non c\'è ignorabimus" - David Hilbert'
        ],
        templates: [
          {
            funzioni: ['f(x) = p(x) · e^(φ(x))', 'g(x) = q(x) · e^(ψ(x))'],
            contesto: 'funzioni esponenziali con polinomi parametrici',
            complessita: 'studio completo con parametri, asintoti, ottimizzazione'
          },
          {
            funzioni: ['f(x) = (ax² + bx + c) / (dx + e)', 'g(x) = √(mx² + nx + p)'],
            contesto: 'funzioni razionali e irrazionali',
            complessita: 'domini, asintoti, intersezioni, aree'
          }
        ]
      },

      geometria_analitica_avanzata: {
        difficolta: 'molto_alta',
        citazioni: [
          '"La geometria è l\'arte di ragionare bene su figure mal fatte" - Henri Poincaré',
          '"Dio geometrizza sempre" - Platone'
        ],
        templates: [
          {
            elementi: ['circonferenza', 'parabola', 'retta tangente'],
            contesto: 'luoghi geometrici e ottimizzazione',
            complessita: 'aree, volumi, massimi e minimi vincolati'
          },
          {
            elementi: ['ellisse', 'iperbole', 'fascio di rette'],
            contesto: 'coniche e trasformazioni geometriche',
            complessita: 'parametri, simmetrie, proprietà focali'
          }
        ]
      },

      calcolo_integrale_applicato: {
        difficolta: 'molto_alta',
        citazioni: [
          '"L\'integrale è la somma di infinite parti infinitesime" - Leibniz',
          '"Il calcolo differenziale è l\'algebra dell\'infinito" - Voltaire'
        ],
        templates: [
          {
            tipo: 'aree_volumi_parametrici',
            contesto: 'solidi di rotazione e aree tra curve',
            complessita: 'integrali definiti, teoremi fondamentali, applicazioni fisiche'
          },
          {
            tipo: 'equazioni_differenziali',
            contesto: 'modelli matematici e crescita',
            complessita: 'separazione variabili, condizioni iniziali, interpretazione'
          }
        ]
      }
    };
  }

  genera(numeroEsami = 50) {
    console.log(`🎓 Generazione ${numeroEsami} esami Matematica AVANZATI (livello ministeriale)...`);
    
    for (let i = 1; i <= numeroEsami; i++) {
      this.esami.push({
        id: `MAT_ADV_${i}`,
        titolo: `Simulazione Matematica Avanzata ${i}`,
        sottotitolo: `Seconda Prova Scritta - Sessione ${2024 + Math.floor(i/10)}`,
        durata: 360, // 6 ore come negli esami reali
        istruzioni: this.generaIstruzioniRealistiche(),
        struttura: {
          problemi: 2,
          quesiti: 8,
          daRisolvere: { problemi: 1, quesiti: 4 },
          punteggioTotale: 100
        },
        problemi: [
          this.generaProblemaComplesso(i, 1),
          this.generaProblemaComplesso(i, 2)
        ],
        quesiti: this.generaQuesitiVariegati(i),
        metadata: {
          difficolta: 'ministeriale',
          argomenti: this.getArgomentiCoperti(i),
          competenze: this.getCompetenzeTested(i)
        }
      });
    }
    
    console.log(`✅ ${this.esami.length} esami Matematica AVANZATI pronti!`);
    return this.esami;
  }

  generaIstruzioniRealistiche() {
    const istruzioni = [
      'Il candidato risolva uno dei due problemi e 4 degli 8 quesiti del questionario.',
      'Durata massima della prova: 6 ore. È consentito l\'uso di calcolatrici scientifiche e/o grafiche purché non siano dotate di capacità di calcolo simbolico.',
      'È consentito l\'uso del dizionario bilingue (italiano-lingua del paese di provenienza) per i candidati di madrelingua non italiana.',
      'Non è consentito lasciare l\'Istituto prima che siano trascorse 3 ore dalla dettatura del tema.'
    ];
    return istruzioni[Math.floor(Math.random() * istruzioni.length)];
  }

  generaProblemaComplesso(n, pNum) {
    // Molto più varietà - 12 temi diversi invece di 3
    const temiAvanzati = [
      'funzioni_parametriche_esponenziali',
      'geometria_analitica_coniche', 
      'calcolo_integrale_volumi',
      'funzioni_razionali_asintoti',
      'successioni_limiti_serie',
      'geometria_solida_ottimizzazione',
      'probabilita_statistica_avanzata',
      'equazioni_differenziali_modelli',
      'trigonometria_identita_complesse',
      'analisi_numerica_approssimazioni',
      'funzioni_implicite_parametriche',
      'teoria_numeri_combinatoria'
    ];
    
    const tema = temiAvanzati[(n * 7 + pNum * 11) % temiAvanzati.length];
    const params = this.selezionaParametriDiversificati(n, pNum, tema);
    
    return this.generaProblemaPerTema(tema, params, n, pNum);
  }

  selezionaParametriCoerenti(n, pNum) {
    const seed = n * 7 + pNum * 13; // Seed per consistenza
    return {
      a: this.parametriVariabili.coefficienti[seed % this.parametriVariabili.coefficienti.length],
      b: this.parametriVariabili.coefficienti[(seed + 3) % this.parametriVariabili.coefficienti.length],
      c: this.parametriVariabili.coefficienti[(seed + 7) % this.parametriVariabili.coefficienti.length],
      r: this.parametriVariabili.raggi[seed % this.parametriVariabili.raggi.length],
      centro: this.parametriVariabili.centri[seed % this.parametriVariabili.centri.length],
      base: this.parametriVariabili.basi[seed % this.parametriVariabili.basi.length]
    };
  }

  selezionaParametriDiversificati(n, pNum, tema) {
    const seed = n * 17 + pNum * 23 + tema.length * 31;
    
    // Parametri molto più diversificati per tema
    const parametriSpecializzati = {
      funzioni_parametriche_esponenziali: {
        coeffs: [-7, -5, -3, -1, 1, 3, 5, 7, 9],
        esponenti: [0.5, 1, 1.5, 2, 2.5, 3],
        basi: ['e', 2, 3, 5, 10]
      },
      geometria_analitica_coniche: {
        semiassi: [1, 2, 3, 4, 5, 6, 8],
        centri: [[0,0], [1,2], [-1,1], [2,-1], [-2,2]],
        rotazioni: [0, 30, 45, 60, 90]
      },
      calcolo_integrale_volumi: {
        limiti: [[0,1], [0,2], [-1,1], [-2,2], [1,3]],
        funzioni: ['polinomiali', 'trigonometriche', 'esponenziali', 'logaritmiche']
      }
    };

    const config = parametriSpecializzati[tema] || parametriSpecializzati.funzioni_parametriche_esponenziali;
    
    return {
      a: (seed % 13) - 6, // da -6 a +6
      b: ((seed * 7) % 11) - 5, // da -5 a +5  
      c: ((seed * 11) % 9) - 4, // da -4 a +4
      d: ((seed * 13) % 7) - 3, // da -3 a +3
      r: Math.abs((seed % 8)) + 1, // da 1 a 8
      tema_config: config,
      variante: seed % 5 // 5 varianti per tema
    };
  }

  generaProblemaPerTema(tema, params, n, pNum) {
    const generatori = {
      funzioni_parametriche_esponenziali: () => this.problemaFunzioniEsponenziali(params, n),
      geometria_analitica_coniche: () => this.problemaGeometriaConiche(params, n),
      calcolo_integrale_volumi: () => this.problemaIntegraliVolumi(params, n),
      funzioni_razionali_asintoti: () => this.problemaFunzioniRazionali(params, n),
      successioni_limiti_serie: () => this.problemaSuccessioniSerie(params, n),
      geometria_solida_ottimizzazione: () => this.problemaGeometriaSolida(params, n),
      probabilita_statistica_avanzata: () => this.problemaProbabilitaAvanzata(params, n),
      equazioni_differenziali_modelli: () => this.problemaEquazioniDifferenziali(params, n),
      trigonometria_identita_complesse: () => this.problemaTrigonometriaComplessa(params, n),
      analisi_numerica_approssimazioni: () => this.problemaAnalisiNumerica(params, n),
      funzioni_implicite_parametriche: () => this.problemaFunzioniImplicite(params, n),
      teoria_numeri_combinatoria: () => this.problemaTeoriaNumeri(params, n)
    };

    const generatore = generatori[tema] || (() => this.problemaFunzioniEsponenziali(params, n));
    return generatore();
  }

  // METODI PLACEHOLDER PER I GENERATORI MANCANTI
  problemaProbabilitaAvanzata(params, n) { return this.problemaFunzioniEsponenziali(params, n); }
  problemaSuccessioniSerie(params, n) { return this.problemaGeometriaConiche(params, n); }
  problemaFunzioniRazionali(params, n) { return this.problemaIntegraliVolumi(params, n); }
  problemaGeometriaSolida(params, n) { return this.problemaFunzioniEsponenziali(params, n); }
  problemaEquazioniDifferenziali(params, n) { return this.problemaGeometriaConiche(params, n); }
  problemaTrigonometriaComplessa(params, n) { return this.problemaIntegraliVolumi(params, n); }
  problemaAnalisiNumerica(params, n) { return this.problemaFunzioniEsponenziali(params, n); }
  problemaFunzioniImplicite(params, n) { return this.problemaGeometriaConiche(params, n); }
  problemaTeoriaNumeri(params, n) { return this.problemaIntegraliVolumi(params, n); }

  // NUOVI GENERATORI DIVERSIFICATI
  problemaFunzioniEsponenziali(params, n) {
    const citazioni = [
      '"La natura è scritta in linguaggio matematico" - Galileo Galilei',
      '"Dio non gioca a dadi con l\'universo" - Einstein',
      '"La matematica è la regina delle scienze" - Gauss'
    ];
    
    const tipi = [
      `f(x) = (${params.a}x² + ${params.b}x + ${params.c}) · e^(${params.d/10}x)`,
      `f(x) = ${params.a}x · ln(x² + ${params.r}) + ${params.b}e^(-x)`,
      `f(x) = ${params.a}x³ · e^(-${params.b}x²) + ${params.c}`
    ];
    
    return {
      citazione: citazioni[n % citazioni.length],
      tipo: 'Funzioni esponenziali e logaritmiche avanzate',
      testo: `Si consideri la funzione ${tipi[params.variante % tipi.length]} definita su ℝ.`,
      punti: [
        {
          lettera: 'a',
          richiesta: `Determinare il dominio di f e studiare il comportamento agli estremi. Calcolare i limiti notevoli e determinare eventuali asintoti orizzontali, verticali od obliqui.`,
          punteggio: 6
        },
        {
          lettera: 'b', 
          richiesta: `Calcolare f'(x) e determinare i punti stazionari. Studiare la monotonia di f e classificare i punti stazionari (massimi, minimi, flessi a tangente orizzontale).`,
          punteggio: 6
        },
        {
          lettera: 'c',
          richiesta: `Calcolare f''(x) e studiare la concavità di f. Determinare eventuali punti di flesso e tracciare il grafico qualitativo di f.`,
          punteggio: 6
        },
        {
          lettera: 'd',
          richiesta: `Determinare l'equazione della retta tangente al grafico di f nel punto di ascissa x = ${params.r/2}. Calcolare l'area della regione delimitata dal grafico di f, dall'asse x e dalle rette x = 0 e x = ${params.r}.`,
          punteggio: 7
        }
      ]
    };
  }

  problemaGeometriaConiche(params, n) {
    const coniche = ['ellisse', 'iperbole', 'parabola'];
    const conica = coniche[n % coniche.length];
    
    return {
      citazione: '"La geometria è l\'arte di ragionare bene su figure mal fatte" - Henri Poincaré',
      tipo: `Geometria analitica: ${conica} e luoghi geometrici`,
      testo: `Nel piano cartesiano si consideri la ${conica} Γ di equazione ${this.getEquazioneConica(conica, params)}.`,
      punti: [
        {
          lettera: 'a',
          richiesta: `Determinare gli elementi caratteristici della ${conica}: centro, vertici, fuochi, asintoti (se esistenti). Tracciare il grafico di Γ.`,
          punteggio: 6
        },
        {
          lettera: 'b',
          richiesta: `Scrivere l'equazione della retta r tangente a Γ nel punto P(${params.a}, ${params.b}). Determinare i punti di intersezione di r con gli assi coordinati.`,
          punteggio: 6
        },
        {
          lettera: 'c', 
          richiesta: `Sia Q un punto variabile su Γ. Determinare la posizione di Q tale che la distanza QP sia minima. Calcolare tale distanza minima.`,
          punteggio: 6
        },
        {
          lettera: 'd',
          richiesta: `Considerare il fascio di rette per P. Determinare quante rette del fascio sono tangenti a Γ e calcolare l'area del triangolo formato da P e dai due punti di tangenza.`,
          punteggio: 7
        }
      ]
    };
  }

  problemaIntegraliVolumi(params, n) {
    const funzioni = [
      `f(x) = ${params.a}x² + ${params.b}x + ${params.c}`,
      `f(x) = ${params.a}sin(${params.b}x) + ${params.c}`,
      `f(x) = ${params.a}e^(${params.b}x) + ${params.c}x`
    ];
    
    return {
      citazione: '"L\'integrale è la somma di infinite parti infinitesime" - Leibniz',
      tipo: 'Calcolo integrale: aree, volumi e applicazioni',
      testo: `Si consideri la funzione ${funzioni[n % funzioni.length]} definita nell'intervallo [${-params.r}, ${params.r}].`,
      punti: [
        {
          lettera: 'a',
          richiesta: `Calcolare ∫₀^${params.r} f(x) dx utilizzando il teorema fondamentale del calcolo integrale. Interpretare geometricamente il risultato.`,
          punteggio: 6
        },
        {
          lettera: 'b',
          richiesta: `Determinare l'area della regione R delimitata dal grafico di f, dall'asse x e dalle rette x = ${-params.r} e x = ${params.r}.`,
          punteggio: 6
        },
        {
          lettera: 'c',
          richiesta: `Calcolare il volume del solido ottenuto dalla rotazione di R attorno all'asse x. Utilizzare il metodo dei dischi.`,
          punteggio: 6
        },
        {
          lettera: 'd',
          richiesta: `Determinare il baricentro della regione R. Verificare il risultato utilizzando il teorema di Guldino per il calcolo del volume.`,
          punteggio: 7
        }
      ]
    };
  }

  getEquazioneConica(tipo, params) {
    switch(tipo) {
      case 'ellisse':
        return `x²/${params.a}² + y²/${params.b}² = 1`;
      case 'iperbole':
        return `x²/${params.a}² - y²/${params.b}² = 1`;
      case 'parabola':
        return `y² = ${params.a}x`;
      default:
        return `x² + y² = ${params.r}²`;
    }
  }

  generaProblemaFunzioniParametriche(params, config) {
    const citazione = config.citazioni[Math.floor(Math.random() * config.citazioni.length)];
    
    return {
      citazione: citazione,
      tipo: 'Studio di funzioni parametriche con esponenziali',
      testo: `I grafici γ₁ e γ₂ rappresentano, rispettivamente, le funzioni f e g, definite su ℝ, le cui espressioni analitiche sono:

f(x) = (${params.a}x² + ${params.b}x + ${params.c}) · e^(αx)
g(x) = (${params.b}x² - ${params.a}x + ${params.c}) · e^(βx)

dove α = ${(params.a/2).toFixed(2)} e β = ${(params.b/3).toFixed(2)} sono parametri reali.`,
      
      punti: [
        {
          lettera: 'a',
          richiesta: `Determinare i parametri α e β utilizzando le informazioni deducibili dai grafici, sapendo che f ha un punto stazionario in x = ${params.r/2} e che g si annulla in x = ${-params.r}. Studiare il comportamento asintotico di entrambe le funzioni e determinare gli eventuali asintoti.

[Suggerimento: Calcolare f'(x) e imporre f'(${params.r/2}) = 0. Per g, imporre g(${-params.r}) = 0. Per gli asintoti, studiare i limiti per x → ±∞]`,
          punteggio: 6
        },
        {
          lettera: 'b',
          richiesta: `Studiare la funzione f, determinando:
• Dominio e codominio
• Intervalli di monotonia e punti stazionari
• Concavità e punti di flesso
• Grafico qualitativo

Verificare che f ammette un massimo assoluto e determinarne le coordinate esatte.`,
          punteggio: 6
        },
        {
          lettera: 'c',
          richiesta: `Dimostrare che le funzioni f e g hanno esattamente ${Math.abs(params.a) + 1} punti di intersezione. Determinare le coordinate del punto di intersezione con ascissa positiva maggiore.

Calcolare l'area della regione finita delimitata dai grafici di f e g nell'intervallo [0, ${params.r}].

[Note: Risolvere f(x) = g(x) e usare metodi numerici se necessario. L'area è ∫₀^${params.r} |f(x) - g(x)| dx]`,
          punteggio: 6
        },
        {
          lettera: 'd',
          richiesta: `Sia h(x) = ∫₀ˣ f(t) dt la funzione integrale di f. Studiare h determinando:
• Monotonia e punti stazionari
• Concavità e punti di flesso
• Comportamento agli estremi del dominio

Determinare per quali valori del parametro k ∈ ℝ l'equazione h(x) = k ammette esattamente due soluzioni.`,
          punteggio: 7
        }
      ]
    };
  }

  generaProblemaGeometriaAvanzata(params, config) {
    const citazione = config.citazioni[Math.floor(Math.random() * config.citazioni.length)];
    
    return {
      citazione: citazione,
      tipo: 'Geometria analitica e luoghi geometrici',
      testo: `Nel piano cartesiano Oxy si considerino:
• La circonferenza Γ di centro C(${params.centro[0]}, ${params.centro[1]}) e raggio r = ${params.r}
• La parabola P di equazione y = ${params.a}x² + ${params.b}x + ${params.c}
• Il punto A(${params.r}, ${params.a * params.r * params.r + params.b * params.r + params.c})`,
      
      punti: [
        {
          lettera: 'a',
          richiesta: `Determinare per quali valori di r la circonferenza Γ e la parabola P:
• Non hanno punti in comune
• Sono tangenti
• Si intersecano in due punti distinti

Stabilito che r = ${params.r} corrisponde al caso di tangenza, determinare le coordinate del punto di tangenza T.`,
          punteggio: 6
        },
        {
          lettera: 'b',
          richiesta: `Sia M un punto variabile sulla parabola P con ascissa x ∈ [${-params.r}, ${params.r}]. Determinare la posizione di M tale che:
• La distanza MC sia minima
• L'area del triangolo MCA sia massima

Verificare che il punto M di distanza minima da C appartiene alla retta per C perpendicolare alla tangente alla parabola in M.`,
          punteggio: 6
        },
        {
          lettera: 'c',
          richiesta: `Considerare la famiglia di rette r_t di equazione y = tx + ${params.c} - t, al variare del parametro reale t. Dimostrare che:
• Tutte le rette della famiglia passano per un punto fisso F
• Esistono esattamente due rette della famiglia tangenti alla circonferenza Γ

Determinare le equazioni di tali rette tangenti e calcolare l'area del triangolo che esse formano con la retta CF.`,
          punteggio: 6
        },
        {
          lettera: 'd',
          richiesta: `Sia S la regione del piano delimitata dalla parabola P, dalla circonferenza Γ e dalle rette x = ${-params.r} e x = ${params.r}. Calcolare:
• L'area di S
• Il volume del solido ottenuto dalla rotazione di S attorno all'asse x
• Il baricentro della regione S

[Suggerimento: Usare le formule per i momenti statici e il teorema di Guldino per il volume]`,
          punteggio: 7
        }
      ]
    };
  }

  generaProblemaCalculoIntegrale(params, config) {
    const citazione = config.citazioni[Math.floor(Math.random() * config.citazioni.length)];
    
    return {
      citazione: citazione,
      tipo: 'Calcolo integrale e applicazioni',
      testo: `Si consideri la funzione f(x) = ${params.a}x³ + ${params.b}x² + ${params.c}x definita su ℝ.
      
Sia inoltre g(x) = ∫₀ˣ f(t) dt la funzione integrale di f e h(x) = f'(x) la derivata di f.`,
      
      punti: [
        {
          lettera: 'a',
          richiesta: `Studiare la funzione f determinando:
• Dominio, simmetrie e comportamento agli estremi
• Punti stazionari e intervalli di monotonia  
• Concavità e punti di flesso
• Grafico qualitativo

Determinare per quali valori di x la funzione f è positiva.`,
          punteggio: 6
        },
        {
          lettera: 'b',
          richiesta: `Studiare la funzione integrale g(x) = ∫₀ˣ f(t) dt, determinando:
• Relazione tra g e f (teorema fondamentale del calcolo)
• Monotonia e punti stazionari di g
• Concavità di g e relazione con f'
• Grafico qualitativo di g

Calcolare g(${params.r}) e interpretarne il significato geometrico.`,
          punteggio: 6
        },
        {
          lettera: 'c',
          richiesta: `Calcolare l'area della regione R delimitata dal grafico di f, dall'asse x e dalle rette x = ${-params.r} e x = ${params.r}.

Determinare il volume del solido ottenuto dalla rotazione di R attorno all'asse x.

[Suggerimento: Area = ∫_{-${params.r}}^{${params.r}} |f(x)| dx, Volume = π∫_{-${params.r}}^{${params.r}} [f(x)]² dx]`,
          punteggio: 6
        },
        {
          lettera: 'd',
          richiesta: `Risolvere l'equazione differenziale y' = f(x) con la condizione iniziale y(0) = ${params.c}. Studiare il comportamento asintotico della soluzione e determinare se esistono soluzioni limitate. Interpretare geometricamente il risultato in relazione alla funzione g(x).`,
          punteggio: 7
        }
      ]
    };
  }

  generaQuesitiVariegati(n) {
    return [
      {
        numero: 1,
        tipo: 'geometria_solida_tetraedro',
        testo: `Un tetraedro regolare ha spigolo di lunghezza a = ${3 + (n % 4)}. Si consideri la sfera inscritta nel tetraedro. Determinare: • Il raggio della sfera inscritta • Il volume della regione compresa tra il tetraedro e la sfera • Il rapporto tra l'area della superficie sferica e l'area totale del tetraedro [Formule utili: Volume tetraedro = a³√2/12, Raggio sfera inscritta = a√6/12]`,
        punteggio: 12
      },
      {
        numero: 2,
        tipo: 'probabilita_ipergeometrica',
        testo: `Un'urna contiene ${8 + (n % 3)} palline rosse e ${6 + (n % 4)} palline blu. Si effettuano 6 estrazioni senza reinserimento. Calcolare: • La probabilità che tutte le palline estratte siano dello stesso colore • Il valore atteso e la varianza del numero di palline rosse estratte • La probabilità che il numero di palline rosse estratte sia maggiore del numero di palline blu estratte [Suggerimento: Usare la distribuzione ipergeometrica e le sue proprietà]`,
        punteggio: 12
      },
      {
        numero: 3,
        tipo: 'equazioni_differenziali',
        testo: `Risolvere l'equazione differenziale: y' + ${2 + (n % 3)}y = ${-3 - (n % 4)}e^(-${1 + (n % 2)}x) con la condizione iniziale y(0) = ${1 + (n % 3)}. Studiare il comportamento asintotico della soluzione e determinare per quali valori dei parametri la soluzione è limitata per x → +∞. [Metodo: Equazione lineare del primo ordine, fattore integrante μ(x) = e^(${2 + (n % 3)}x)]`,
        punteggio: 12
      },
      {
        numero: 4,
        tipo: 'ottimizzazione_geometrica',
        testo: `Un cilindro circolare retto è inscritto in una sfera di raggio R = ${2 + (n % 4)}. Determinare le dimensioni del cilindro che: • Massimizzano il volume del cilindro • Massimizzano l'area della superficie laterale del cilindro • Rendono minimo il rapporto tra superficie totale e volume. Confrontare i risultati ottenuti e fornire un'interpretazione geometrica.`,
        punteggio: 12
      },
      {
        numero: 5,
        tipo: 'combinatoria_anagrammi',
        testo: `Considerare la parola "${['MATEMATICA', 'INTEGRALE', 'DERIVATA', 'FUNZIONE'][n % 4]}". Calcolare: • Il numero totale di anagrammi (anche privi di significato) • Il numero di anagrammi in cui le vocali occupano posizioni consecutive • Il numero di anagrammi che contengono una sottosequenza specifica • La probabilità che un anagramma scelto a caso inizi e finisca con una consonante [Attenzione: Considerare eventuali lettere ripetute e usare il principio di inclusione-esclusione]`,
        punteggio: 12
      },
      {
        numero: 6,
        tipo: 'successioni_serie',
        testo: `Studiare la convergenza della serie ∑(n=1 to ∞) [${1 + (n % 3)}^n · sin(nπ/${2 + (n % 4)})] / [n^${2 + (n % 2)} · (${3 + (n % 3)} + cos(n))]. • Determinare il carattere della serie (convergente, divergente, indeterminato) • Se convergente, stimare la somma con un errore inferiore a 10^(-3) • Studiare la convergenza assoluta e condizionata [Suggerimenti: Criteri di convergenza per serie a termini di segno variabile]`,
        punteggio: 12
      },
      {
        numero: 7,
        tipo: 'trigonometria_identita',
        testo: `Risolvere nel campo complesso l'equazione: ${2 + (n % 3)}cos(${1 + (n % 2)}z) + ${1 + (n % 4)}sin(${2 + (n % 3)}z) = ${3 + (n % 5)}e^(iz). • Trovare tutte le soluzioni nell'intervallo [0, 4π] • Rappresentare graficamente le soluzioni nel piano complesso • Studiare il comportamento delle soluzioni per z → ∞ [Formule di Eulero: e^(iz) = cos(z) + i·sin(z)]`,
        punteggio: 12
      },
      {
        numero: 8,
        tipo: 'analisi_complessa',
        testo: `Sia f(z) = (z^${2 + (n % 3)} + ${1 + (n % 4)}) / (z^${1 + (n % 2)} - ${2 + (n % 3)}i) una funzione di variabile complessa. • Determinare il dominio di f e classificare le singolarità • Calcolare i residui nei poli e applicare il teorema dei residui • Calcolare ∫_γ f(z) dz dove γ è la circonferenza |z| = ${2 + (n % 3)} • Studiare il comportamento asintotico di f(z) per |z| → ∞`,
        punteggio: 12
      }
    ];
  }

  getArgomentiCoperti(n) {
    const argomenti = [
      'Funzioni e loro proprietà',
      'Limiti e continuità', 
      'Derivate e applicazioni',
      'Integrali definiti e indefiniti',
      'Geometria analitica',
      'Probabilità e statistica',
      'Geometria solida',
      'Successioni e serie'
    ];
    
    const numArgomenti = 4 + (n % 3);
    return argomenti.slice(0, numArgomenti);
  }

  getCompetenzeTested(n) {
    return [
      'Utilizzare le tecniche e le procedure del calcolo aritmetico ed algebrico',
      'Confrontare ed analizzare figure geometriche, individuando invarianti e relazioni',
      'Individuare le strategie appropriate per la soluzione di problemi',
      'Analizzare dati e interpretarli sviluppando deduzioni e ragionamenti sugli stessi'
    ];
  }

  getEsame(id) {
    return this.esami.find(esame => esame.id === id);
  }

  getEsamiPerDifficolta(difficolta = 'ministeriale') {
    return this.esami.filter(esame => esame.metadata.difficolta === difficolta);
  }

  getEsameCasuale() {
    if (this.esami.length === 0) return null;
    const indice = Math.floor(Math.random() * this.esami.length);
    return this.esami[indice];
  }
}

module.exports = GeneratoreEsamiMatematicaAvanzato;
