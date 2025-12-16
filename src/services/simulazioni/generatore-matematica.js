/**
 * 🧮 GENERATORE SIMULAZIONI MATEMATICA
 * Sistema per generare simulazioni d'esame di matematica formato maturità
 */

class GeneratoreMatematicaSimulazioni {
  constructor() {
    this.struttura = {
      problemi: 2,  // Il candidato sceglie 1 dei 2
      quesiti: 8,   // Il candidato sceglie 4 degli 8
      durata: '6 ore'
    };

    this.argomenti = {
      analisi: ['limiti', 'derivate', 'integrali', 'studio_funzione', 'equazioni_differenziali'],
      geometria: ['analitica_piano', 'analitica_spazio', 'trasformazioni'],
      probabilita: ['calcolo_combinatorio', 'probabilita', 'statistica'],
      algebra: ['numeri_complessi', 'matrici', 'sistemi_lineari']
    };
  }

  /**
   * Genera simulazione completa matematica
   */
  generaSimulazioneCompleta(numero = 1) {
    return {
      id: `MAT_SIM_${String(numero).padStart(3, '0')}`,
      materia: 'MATEMATICA',
      tipo: 'ESAME DI STATO - LICEO SCIENTIFICO',
      numero: numero,
      data: new Date().toISOString().split('T')[0],
      durata: '6 ore',
      intestazione: this.generaIntestazione(),
      istruzioni: 'Il candidato risolva uno dei due problemi e risponda a 4 quesiti.',
      strumenti_ammessi: 'È consentito l\'uso della calcolatrice non programmabile.',
      problemi: [
        this.generaProblema1(numero),
        this.generaProblema2(numero)
      ],
      quesiti: this.generaQuesiti(numero)
    };
  }

  generaIntestazione() {
    return `Ministero dell'Istruzione e del Merito
ESAME DI STATO DI ISTRUZIONE SECONDARIA SUPERIORE
Indirizzo: LICEO SCIENTIFICO
Tema di: MATEMATICA`;
  }

  /**
   * PROBLEMA 1 - Studio di funzione con parametri
   */
  generaProblema1(n) {
    const problemi = this.getBancaProblemiAnalisi();
    const problema = problemi[n % problemi.length];
    
    return {
      numero: 'PROBLEMA 1',
      titolo: problema.titolo,
      introduzione: problema.introduzione,
      funzioni: problema.funzioni,
      figura: problema.figura || null,
      punti: problema.punti.map((p, i) => ({
        lettera: String.fromCharCode(97 + i), // a, b, c, ...
        testo: p
      }))
    };
  }

  /**
   * PROBLEMA 2 - Applicazioni geometriche/fisiche
   */
  generaProblema2(n) {
    const problemi = this.getBancaProblemiApplicati();
    const problema = problemi[n % problemi.length];
    
    return {
      numero: 'PROBLEMA 2',
      titolo: problema.titolo,
      contesto: problema.contesto,
      dati: problema.dati,
      figura: problema.figura,
      punti: problema.punti.map((p, i) => ({
        lettera: String.fromCharCode(97 + i),
        testo: p
      }))
    };
  }

  /**
   * Genera 8 quesiti
   */
  generaQuesiti(n) {
    const bancaQuesiti = this.getBancaQuesiti();
    const quesiti = [];
    
    // Distribuzione tematica bilanciata
    const temi = ['limiti', 'derivate', 'integrali', 'geometria', 'probabilita', 
                  'equazioni_diff', 'trigonometria', 'numeri_complessi'];
    
    for (let i = 0; i < 8; i++) {
      const tema = temi[i % temi.length];
      const quesitiTema = bancaQuesiti[tema];
      const q = quesitiTema[(n + i) % quesitiTema.length];
      
      quesiti.push({
        numero: i + 1,
        argomento: tema,
        testo: q.testo,
        suggerimento: q.suggerimento || null
      });
    }
    
    return quesiti;
  }

  // ========== BANCHE DATI ==========

  getBancaProblemiAnalisi() {
    return [
      {
        titolo: 'Studio di funzione parametrica',
        introduzione: 'Si consideri la funzione:',
        funzioni: {
          f: 'f(x) = (x³ - 3kx + 2)/(x² + 1)',
          g: 'g(x) = e^x · (x - k)'
        },
        punti: [
          'Determinare per quali valori del parametro k la funzione f(x) ammette un massimo relativo nel punto x = 1.',
          'Posto k = 2, studiare la funzione f(x) determinando: dominio, eventuali simmetrie, segno, limiti e asintoti, crescenza e decrescenza, massimi e minimi, concavità e flessi. Tracciare il grafico.',
          'Calcolare l\'area della regione finita di piano delimitata dal grafico di f(x) con k = 2 e dall\'asse x nell\'intervallo [0, 3].',
          'Determinare l\'equazione della retta tangente al grafico di g(x) nel punto di ascissa x = 0 e verificare che tale retta è tangente anche al grafico di f(x) per un opportuno valore di k.',
          'Stabilire per quali valori di k i grafici di f(x) e g(x) hanno esattamente due punti di intersezione.'
        ]
      },
      {
        titolo: 'Analisi di famiglia di funzioni',
        introduzione: 'Data la famiglia di funzioni:',
        funzioni: {
          f_a: 'f_a(x) = x · e^(-ax²)',
          derivata: "f'_a(x)"
        },
        punti: [
          'Determinare il valore del parametro a > 0 affinché la funzione f_a(x) abbia un massimo relativo nel punto x = 1/√2.',
          'Per a = 1, studiare completamente la funzione e tracciarne il grafico.',
          'Verificare che tutte le curve della famiglia passano per l\'origine e hanno ivi la stessa retta tangente.',
          'Calcolare il volume del solido generato dalla rotazione attorno all\'asse x della regione delimitata dal grafico di f₁(x) e dall\'asse x per x ∈ [0, +∞).',
          'Determinare i punti di flesso della funzione f_a(x) al variare di a > 0.'
        ]
      },
      {
        titolo: 'Ottimizzazione e calcolo integrale',
        introduzione: 'Sia data la funzione:',
        funzioni: {
          h: 'h(x) = ln(x² + 1) - 2arctg(x)'
        },
        punti: [
          'Studiare la funzione h(x) e tracciarne il grafico.',
          'Verificare che h(x) è dispari e determinare l\'equazione della tangente nell\'origine.',
          'Dimostrare che l\'equazione h(x) = k ammette esattamente una soluzione per k ∈ ℝ.',
          'Calcolare l\'integrale ∫₀¹ h(x)dx utilizzando l\'integrazione per parti.',
          'Determinare il polinomio di Taylor di ordine 4 centrato nell\'origine per h(x).'
        ]
      }
    ];
  }

  getBancaProblemiApplicati() {
    return [
      {
        titolo: 'Ottimizzazione geometrica',
        contesto: 'In un semicerchio di raggio r = 5 cm è inscritto un rettangolo ABCD con il lato AB sul diametro.',
        dati: {
          figura: 'semicerchio con rettangolo inscritto',
          raggio: '5 cm'
        },
        figura: {
          tipo: 'geometrica',
          descrizione: 'Semicerchio con centro O, diametro AB, e rettangolo ABCD inscritto'
        },
        punti: [
          'Indicando con x la semidistanza di AB dal centro O, esprimere l\'area del rettangolo in funzione di x.',
          'Determinare il valore di x per cui l\'area del rettangolo è massima e calcolare tale area.',
          'Calcolare il perimetro del rettangolo di area massima.',
          'Determinare il volume del solido ottenuto dalla rotazione del rettangolo di area massima attorno al diametro.',
          'Se il rettangolo ruota attorno ad un lato perpendicolare al diametro, calcolare il volume del solido generato.'
        ]
      },
      {
        titolo: 'Modello di crescita',
        contesto: 'Una popolazione di batteri cresce secondo la legge:',
        dati: {
          legge: 'N(t) = N₀ · e^(kt)/(1 + e^(kt))',
          N0: '1000 batteri',
          k: 'costante positiva'
        },
        figura: null,
        punti: [
          'Determinare il valore di k sapendo che dopo 2 ore la popolazione è di 4000 batteri.',
          'Calcolare dopo quanto tempo la popolazione raggiunge il 90% del valore asintotico.',
          'Studiare la velocità di crescita dN/dt e determinare quando è massima.',
          'Calcolare il tempo medio di raddoppio della popolazione nella fase di crescita esponenziale.',
          'Rappresentare graficamente N(t) e la sua derivata prima per 0 ≤ t ≤ 10 ore.'
        ]
      },
      {
        titolo: 'Problema di fisica matematica',
        contesto: 'Una particella si muove lungo l\'asse x con legge del moto:',
        dati: {
          posizione: 'x(t) = t³ - 6t² + 9t',
          tempo: 't ≥ 0 (in secondi)',
          unita: 'x in metri'
        },
        figura: null,
        punti: [
          'Determinare velocità v(t) e accelerazione a(t) della particella.',
          'Individuare gli istanti in cui la particella inverte il moto.',
          'Calcolare lo spazio totale percorso dalla particella nell\'intervallo [0, 4].',
          'Determinare quando la particella ha accelerazione nulla e calcolare la velocità in tali istanti.',
          'Tracciare i grafici di x(t), v(t) e a(t) per 0 ≤ t ≤ 4.'
        ]
      }
    ];
  }

  getBancaQuesiti() {
    return {
      limiti: [
        {
          testo: 'Calcolare: lim(x→0) [sin(3x) - 3x + x³]/(x⁵)',
          suggerimento: 'Utilizzare gli sviluppi di Taylor'
        },
        {
          testo: 'Calcolare: lim(x→+∞) x · [ln(x+1) - ln(x)]',
          suggerimento: 'Proprietà dei logaritmi'
        },
        {
          testo: 'Determinare per quali valori di a ∈ ℝ esiste finito: lim(x→0) [e^(ax) - cos(x)]/x²'
        },
        {
          testo: 'Calcolare: lim(n→∞) n · sin(π/n) · cos(π/n)'
        }
      ],
      derivate: [
        {
          testo: 'Data f(x) = x^x per x > 0, calcolare f\'(e) e determinare l\'equazione della tangente in x = e.'
        },
        {
          testo: 'Determinare i punti di non derivabilità della funzione f(x) = |x³ - 2x|.'
        },
        {
          testo: 'Se f(x) = arctan(1/x), verificare che f\'(x) + f\'(1/x) = 0 per x ≠ 0.'
        },
        {
          testo: 'Calcolare la derivata n-esima di f(x) = x · e^x.'
        }
      ],
      integrali: [
        {
          testo: 'Calcolare: ∫₀^(π/2) x · sin(x) dx'
        },
        {
          testo: 'Calcolare: ∫ e^x · sin(x) dx'
        },
        {
          testo: 'Verificare che ∫₀^(π/2) sin^n(x) dx = ∫₀^(π/2) cos^n(x) dx per n ∈ ℕ.'
        },
        {
          testo: 'Calcolare l\'area della regione delimitata dalle curve y = e^x e y = e^(2x-1) e dalle rette x = 0 e x = 1.'
        }
      ],
      geometria: [
        {
          testo: 'Determinare l\'equazione della circonferenza passante per i punti A(1,2), B(3,4) e C(5,2).'
        },
        {
          testo: 'Nel piano, data la parabola y² = 4x, determinare i punti da cui si possono condurre due tangenti perpendicolari alla parabola.'
        },
        {
          testo: 'Calcolare il volume del solido ottenuto ruotando attorno all\'asse x la regione delimitata da y = √x e y = x/2.'
        },
        {
          testo: 'Data la sfera x² + y² + z² = 9, calcolare l\'area della sezione ottenuta con il piano x + y + z = 3.'
        }
      ],
      probabilita: [
        {
          testo: 'Un\'urna contiene 5 palline rosse e 3 blu. Si estraggono 3 palline senza reinserimento. Calcolare la probabilità che siano tutte dello stesso colore.'
        },
        {
          testo: 'In una classe di 30 studenti, calcolare la probabilità che almeno due abbiano il compleanno lo stesso giorno.'
        },
        {
          testo: 'Lanciando 4 dadi equilibrati, qual è la probabilità di ottenere almeno un 6?'
        },
        {
          testo: 'Da un mazzo di 52 carte se ne estraggono 5. Calcolare la probabilità di avere esattamente una coppia.'
        }
      ],
      equazioni_diff: [
        {
          testo: 'Risolvere l\'equazione differenziale: y\' + 2y = e^(-x)'
        },
        {
          testo: 'Risolvere il problema di Cauchy: y\' = y/x + x², y(1) = 1'
        },
        {
          testo: 'Determinare la soluzione generale di: y\'\' - 4y\' + 4y = 0'
        },
        {
          testo: 'Verificare che y = Ce^x + xe^x è soluzione generale di y\'\' - 2y\' + y = 0.'
        }
      ],
      trigonometria: [
        {
          testo: 'Risolvere l\'equazione: 2sin²(x) + sin(x) - 1 = 0 per x ∈ [0, 2π].'
        },
        {
          testo: 'Dimostrare l\'identità: sin(3x) = 3sin(x) - 4sin³(x)'
        },
        {
          testo: 'Calcolare il valore esatto di: sin(15°) · cos(15°)'
        },
        {
          testo: 'In un triangolo ABC, se a = 5, b = 7, γ = 60°, calcolare c e l\'area.'
        }
      ],
      numeri_complessi: [
        {
          testo: 'Determinare le radici quarte di -16.'
        },
        {
          testo: 'Se z = 1 + i, calcolare z^8.'
        },
        {
          testo: 'Risolvere nel campo complesso: z² + (2-i)z + (1-2i) = 0'
        },
        {
          testo: 'Rappresentare nel piano di Gauss l\'insieme: {z ∈ ℂ : |z-i| = |z+1|}'
        }
      ]
    };
  }
}

module.exports = { GeneratoreMatematicaSimulazioni };
