// Contenuti - CORRETTO AUTOMATICAMENTE
// Correzioni grammaticali applicate: 129

module.exports = {
  "materia": {
    "nome": "🧮 Matematica",
    "descrizione": "Analisi matematica, calcolo, e geometria analitica",
    "colore": "#50E3C2",
    "icona": "calculator",
    "annoScolastico": [
      "1.",
      "2.",
      "3.",
      "4.",
      "5."
    ]
  },
  "argomenti": [
    {
      "id": "mat-insiemi-logica",
      "titolo": "Insiemi e logica",
      "annoRiferimento": "1.",
      "descrizione": "I fondamenti della matematica",
      "sottoargomenti": [
        {
          "titolo": "Gli insiemi e le operazioni",
          "riassunto": "Un insieme è una collezione di oggetti (elementi) ben definiti. Si indica con lettere maiuscole (A, B, C) e gli elementi con minuscole (a, b, c). L'appartenenza si indica con ∈: a∈A significa 'a appartiene ad A'. Un insieme può essere definito per elencazione A={1, 2, 3}, per caratteristica A={x: x è pari}, o con diagrammi di Venn. L'insieme vuoto ∅ non contiene elementi. Due insiemi sono uguali se hanno gli stessi elementi. A è sottoinsieme di B (A⊆B) se ogni elemento di A è anche in B. L'insieme delle parti P(A) contiene tutti i sottoinsiemi di A; se A ha n elementi, P(A) ha 2^n elementi. Le operazioni sono: unione A∪B (elementi in A o B o entrambi), intersezione A∩B (elementi in entrambi), differenza A-B (elementi in A ma non in B), complementare Ā (elementi non in A rispetto all'universo U), prodotto cartesiano A×B (coppie ordinate). Valgono le proprietà commutativa, associativa, distributiva e le leggi di De Morgan: (A∪B)̄=Ā∩B̄ e (A∩B)̄=Ā∪B̄.",
          "livelloDifficolta": "base",
          "tempoLettura": 6,
          "tags": ["insiemi", "operazioni", "Venn", "sottoinsiemi"],
          "collegamenti": ["logica", "relazioni", "funzioni"]
        },
        {
          "titolo": "Logica proposizionale",
          "riassunto": "Una proposizione è un'affermazione che può essere vera (V) o falsa (F). Le proposizioni semplici si combinano con connettivi logici. La negazione ¬p inverte il valore di verità. La congiunzione p∧q (e) è vera solo se entrambe sono vere. La disgiunzione p∨q (o) è vera se almeno una è vera. La disgiunzione esclusiva p⊕q è vera se una sola è vera. L'implicazione p→q (se...allora) è falsa solo se p è vera e q è falsa; p è condizione sufficiente, q è condizione necessaria. La doppia implicazione p↔q (se e solo se) è vera quando p e q hanno lo stesso valore. Le tavole di verità elencano tutti i casi possibili. Una tautologia è sempre vera (es. p∨¬p), una contraddizione sempre falsa (es. p∧¬p). Due proposizioni sono equivalenti se hanno la stessa tavola di verità. Le leggi logiche includono: De Morgan ¬(p∧q)≡¬p∨¬q, doppia negazione ¬¬p≡p, contronominale (p→q)≡(¬q→¬p). I quantificatori sono: universale ∀ (per ogni) ed esistenziale ∃ (esiste). La negazione di ∀xP(x) è ∃x¬P(x).",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["logica", "proposizioni", "connettivi", "quantificatori"],
          "collegamenti": ["insiemi", "dimostrazioni", "matematica"]
        }
      ]
    },
    {
      "id": "mat-numeri",
      "titolo": "I numeri e il calcolo",
      "annoRiferimento": "1.",
      "descrizione": "Dai naturali ai reali",
      "sottoargomenti": [
        {
          "titolo": "Numeri naturali e interi",
          "riassunto": "I numeri naturali ℕ={0, 1, 2, 3, ...} servono per contare. Le operazioni sono addizione, sottrazione (non sempre possibile in ℕ), moltiplicazione, divisione (con resto). Le proprietà includono commutativa, associativa, elemento neutro (0 per +, 1 per ×), distributiva. La divisibilità: a divide b (a|b) se b=ka per qualche intero k. Un numero primo ha solo 1 e se stesso come divisori; i composti hanno altri divisori. Il Teorema Fondamentale dell'Aritmetica: ogni intero >1 si fattorizza in modo unico in primi. Il MCD (massimo comun divisore) è il più grande divisore comune; il mcm (minimo comune multiplo) è il più piccolo multiplo comune. L'algoritmo di Euclide calcola il MCD. I numeri interi ℤ={..., -2, -1, 0, 1, 2, ...} includono i negativi. Le regole dei segni: (+)(+)=+, (-)(-)=+, (+)(-)=-, (-)(+)=-. Il valore assoluto |a| è la distanza da zero. Le potenze con esponente naturale: a^n=a×a×...×a (n volte), a^0=1, a^1=a. Proprietà: a^m×a^n=a^(m+n), a^m/a^n=a^(m-n), (a^m)^n=a^(mn), (ab)^n=a^n×b^n.",
          "livelloDifficolta": "base",
          "tempoLettura": 6,
          "tags": ["naturali", "interi", "divisibilità", "primi"],
          "collegamenti": ["MCD", "mcm", "potenze"]
        },
        {
          "titolo": "Numeri razionali e reali",
          "riassunto": "I numeri razionali ℚ sono frazioni a/b con a∈ℤ, b∈ℤ-{0}. Due frazioni sono equivalenti se a/b=c/d ⟺ ad=bc. La riduzione ai minimi termini divide numeratore e denominatore per il MCD. Le operazioni: a/b+c/d=(ad+bc)/bd, a/b×c/d=ac/bd, a/b÷c/d=ad/bc. Ogni razionale ha rappresentazione decimale finita o periodica; viceversa, ogni decimale finito o periodico è razionale. La frazione generatrice di un periodico: 0,̄3=3/9=1/3, 0,1̄6=16-1/90=15/90=1/6. I numeri irrazionali non sono esprimibili come frazioni: √2, π, e. La dimostrazione che √2 è irrazionale usa la riduzione all'assurdo. I numeri reali ℝ=ℚ∪{irrazionali} formano una retta continua. Ogni punto della retta corrisponde a un reale e viceversa (assioma di continuità). Le proprietà di ℝ: campo ordinato completo. La notazione scientifica a×10^n con 1≤|a|<10 esprime numeri molto grandi o piccoli. Gli intervalli: [a,b] chiuso, (a,b) aperto, [a,b) e (a,b] semiaperti, (-∞,a], [a,+∞) illimitati.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["razionali", "reali", "frazioni", "irrazionali"],
          "collegamenti": ["decimali", "intervalli", "retta"]
        }
      ]
    },
    {
      "id": "mat-algebra",
      "titolo": "Algebra e equazioni",
      "annoRiferimento": "1.",
      "descrizione": "Calcolo letterale e risoluzione di equazioni",
      "sottoargomenti": [
        {
          "titolo": "Monomi e polinomi",
          "riassunto": "Un monomio è il prodotto di un coefficiente numerico e variabili con esponenti naturali: 3x²y. Il grado è la somma degli esponenti. Due monomi sono simili se hanno la stessa parte letterale. Operazioni: somma di simili (si sommano i coefficienti), prodotto (si moltiplicano coefficienti e si sommano esponenti), quoziente (si dividono coefficienti e si sottraggono esponenti), potenza. Un polinomio è la somma di monomi. Il grado è il massimo dei gradi dei monomi. Polinomi notevoli: somma per differenza (a+b)(a-b)=a²-b², quadrato di binomio (a±b)²=a²±2ab+b², cubo di binomio (a±b)³=a³±3a²b+3ab²±b³, quadrato di trinomio. La divisione tra polinomi: P(x)=Q(x)×D(x)+R(x) con grado R < grado D. La regola di Ruffini divide per (x-a). Il teorema del resto: P(a) è il resto della divisione di P(x) per (x-a). Il teorema di Ruffini: (x-a) divide P(x) ⟺ P(a)=0. La scomposizione: raccoglimento, prodotti notevoli, trinomio speciale x²+sx+p=(x-x₁)(x-x₂) dove x₁+x₂=-s e x₁×x₂=p.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["monomi", "polinomi", "prodotti notevoli", "Ruffini"],
          "collegamenti": ["scomposizione", "divisione", "equazioni"]
        },
        {
          "titolo": "Equazioni di primo e secondo grado",
          "riassunto": "Un'equazione è un'uguaglianza con incognite; risolverla significa trovare i valori che la rendono vera. Le equazioni equivalenti hanno le stesse soluzioni. I principi di equivalenza: si può aggiungere/sottrarre lo stesso termine a entrambi i membri; si può moltiplicare/dividere per un numero ≠0. L'equazione di primo grado ax+b=0 ha soluzione x=-b/a se a≠0; se a=0 e b=0 è indeterminata (infinite soluzioni); se a=0 e b≠0 è impossibile. L'equazione di secondo grado ax²+bx+c=0 si risolve con la formula x=(-b±√Δ)/2a dove Δ=b²-4ac è il discriminante. Se Δ>0: due soluzioni reali distinte; se Δ=0: due soluzioni coincidenti x=-b/2a; se Δ<0: nessuna soluzione reale. Le relazioni di Viète: x₁+x₂=-b/a, x₁×x₂=c/a. La scomposizione: ax²+bx+c=a(x-x₁)(x-x₂). Equazioni particolari: pura ax²+c=0, spuria ax²+bx=0, monomia ax²=0. Le equazioni di grado superiore si risolvono per scomposizione. Le equazioni fratte richiedono condizioni di esistenza (denominatori ≠0).",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["equazioni", "primo grado", "secondo grado", "discriminante"],
          "collegamenti": ["soluzioni", "Viète", "scomposizione"]
        }
      ]
    },
    {
      "id": "mat-geometria-euclidea",
      "titolo": "Geometria euclidea",
      "annoRiferimento": "1.",
      "descrizione": "Punti, rette, figure piane",
      "sottoargomenti": [
        {
          "titolo": "Enti fondamentali e triangoli",
          "riassunto": "La geometria euclidea si basa su enti primitivi (punto, retta, piano) e assiomi. Per due punti passa una sola retta. Due rette nel piano sono incidenti (un punto comune), parallele (nessun punto comune) o coincidenti. Gli angoli si misurano in gradi (giro=360°) o radianti (giro=2π). Angoli: acuto (<90°), retto (=90°), ottuso (>90°), piatto (=180°). Angoli complementari (somma 90°), supplementari (somma 180°), esplementari (somma 360°). Il triangolo ha tre lati e tre angoli; la somma degli angoli interni è 180°. Classificazione per lati: equilatero (3 uguali), isoscele (2 uguali), scaleno (tutti diversi). Per angoli: acutangolo, rettangolo, ottusangolo. Criteri di congruenza: 1° LAL (lato-angolo-lato), 2° ALA (angolo-lato-angolo), 3° LLL (lato-lato-lato). Nel triangolo isoscele gli angoli alla base sono uguali. Punti notevoli: baricentro (mediane), ortocentro (altezze), circocentro (assi), incentro (bisettrici). Disuguaglianza triangolare: ogni lato è minore della somma degli altri due.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["triangoli", "angoli", "congruenza", "punti notevoli"],
          "collegamenti": ["geometria", "Euclide", "dimostrazioni"]
        },
        {
          "titolo": "Quadrilateri e poligoni",
          "riassunto": "I quadrilateri hanno quattro lati; la somma degli angoli interni è 360°. Il trapezio ha una coppia di lati paralleli (basi); il trapezio isoscele ha i lati obliqui uguali. Il parallelogramma ha i lati opposti paralleli e uguali, gli angoli opposti uguali, le diagonali che si bisecano. Il rettangolo è un parallelogramma con angoli retti; le diagonali sono uguali. Il rombo è un parallelogramma con lati uguali; le diagonali sono perpendicolari. Il quadrato è rettangolo e rombo insieme. Formule delle aree: rettangolo A=b×h, quadrato A=l², parallelogramma A=b×h, triangolo A=b×h/2, trapezio A=(B+b)×h/2, rombo A=d₁×d₂/2. I poligoni regolari hanno lati e angoli uguali; l'angolo interno è (n-2)×180°/n. Il cerchio ha raggio r, diametro d=2r, circonferenza C=2πr, area A=πr². L'arco è una porzione di circonferenza; il settore circolare è la porzione di cerchio. Il teorema di Pitagora nel triangolo rettangolo: c²=a²+b² (ipotenusa² = somma cateti²). Le terne pitagoriche: (3,4,5), (5,12,13), (8,15,17).",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["quadrilateri", "poligoni", "aree", "Pitagora"],
          "collegamenti": ["parallelogramma", "cerchio", "formule"]
        }
      ]
    },
    {
      "id": "mat-disequazioni",
      "titolo": "Disequazioni",
      "annoRiferimento": "2.",
      "descrizione": "Risoluzione di disequazioni algebriche",
      "sottoargomenti": [
        {
          "titolo": "Disequazioni di primo e secondo grado",
          "riassunto": "Una disequazione è una disuguaglianza con incognite. I simboli sono: < (minore), > (maggiore), ≤ (minore o uguale), ≥ (maggiore o uguale). Le soluzioni formano intervalli. I principi: si può aggiungere/sottrarre lo stesso termine; moltiplicando/dividendo per un numero negativo si inverte il verso. Disequazione di primo grado ax+b>0: se a>0 la soluzione è x>-b/a; se a<0 è x<-b/a. Disequazione di secondo grado ax²+bx+c>0 (con a>0): si trovano le radici dell'equazione associata; se Δ>0 la parabola è positiva per x<x₁ o x>x₂; se Δ=0 è positiva per x≠x₀; se Δ<0 è sempre positiva. Per a<0 si invertono i risultati. Il metodo grafico: la parabola y=ax²+bx+c è sopra l'asse x dove ax²+bx+c>0. Disequazioni fratte: si studia il segno di numeratore e denominatore separatamente, poi si usa la regola dei segni. Disequazioni con valori assoluti: |f(x)|<k equivale a -k<f(x)<k; |f(x)|>k equivale a f(x)<-k o f(x)>k.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["disequazioni", "intervalli", "parabola", "segno"],
          "collegamenti": ["equazioni", "grafico", "soluzioni"]
        },
        {
          "titolo": "Sistemi di disequazioni",
          "riassunto": "Un sistema di disequazioni richiede che tutte le disequazioni siano verificate simultaneamente. La soluzione è l'intersezione degli intervalli soluzione. Metodo: si risolve ogni disequazione separatamente, si rappresentano le soluzioni sulla retta, si trova l'intersezione. Se l'intersezione è vuota, il sistema è impossibile. Esempio: {x>2, x<5} ha soluzione 2<x<5; {x>3, x<1} è impossibile. I sistemi misti contengono equazioni e disequazioni. Le disequazioni di grado superiore si risolvono studiando il segno del polinomio fattorizzato: il segno cambia passando per le radici di molteplicità dispari, non cambia per molteplicità pari. Le disequazioni irrazionali con radici richiedono condizioni di esistenza (radicando ≥0 per radici pari) e si risolvono elevando al quadrato con attenzione ai segni. Le disequazioni esponenziali a^f(x)>a^g(x): se a>1 equivale a f(x)>g(x); se 0<a<1 equivale a f(x)<g(x). Le disequazioni logaritmiche log_a(f(x))>log_a(g(x)) con condizioni f(x)>0, g(x)>0.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": ["sistemi", "intersezione", "irrazionali", "esponenziali"],
          "collegamenti": ["disequazioni", "intervalli", "logaritmi"]
        }
      ]
    },
    {
      "id": "mat-geometria-analitica",
      "titolo": "Geometria analitica",
      "annoRiferimento": "2.",
      "descrizione": "Il piano cartesiano e le coniche",
      "sottoargomenti": [
        {
          "titolo": "Retta nel piano cartesiano",
          "riassunto": "Il piano cartesiano ha due assi perpendicolari (x orizzontale, y verticale) che si incontrano nell'origine O. Ogni punto P ha coordinate (x,y). La distanza tra P₁(x₁,y₁) e P₂(x₂,y₂) è d=√[(x₂-x₁)²+(y₂-y₁)²]. Il punto medio ha coordinate M=((x₁+x₂)/2, (y₁+y₂)/2). La retta ha equazione y=mx+q (forma esplicita) dove m è il coefficiente angolare (pendenza) e q l'ordinata all'origine. Forma implicita: ax+by+c=0. Rette particolari: y=k orizzontale, x=h verticale. Il coefficiente angolare m=tanα dove α è l'angolo con l'asse x; m=(y₂-y₁)/(x₂-x₁). Retta per un punto: y-y₀=m(x-x₀). Retta per due punti: (y-y₁)/(y₂-y₁)=(x-x₁)/(x₂-x₁). Due rette sono parallele se m₁=m₂, perpendicolari se m₁×m₂=-1. Distanza punto-retta: d=|ax₀+by₀+c|/√(a²+b²). Intersezione di rette: si risolve il sistema. Fascio di rette per un punto: y-y₀=m(x-x₀) al variare di m.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["retta", "piano cartesiano", "coefficiente angolare"],
          "collegamenti": ["distanza", "parallele", "perpendicolari"]
        },
        {
          "titolo": "Parabola e circonferenza",
          "riassunto": "La parabola è il luogo dei punti equidistanti da un punto (fuoco F) e una retta (direttrice d). Equazione con asse parallelo a y: y=ax²+bx+c. Il vertice V ha coordinate V=(-b/2a, -Δ/4a). L'asse di simmetria è x=-b/2a. Se a>0 la parabola ha concavità verso l'alto, se a<0 verso il basso. Il fuoco è F=(-b/2a, (1-Δ)/4a), la direttrice y=-(1+Δ)/4a. Intersezioni con gli assi: con x (y=0) si risolve ax²+bx+c=0; con y (x=0) si ha y=c. Parabola con asse parallelo a x: x=ay²+by+c. La circonferenza è il luogo dei punti equidistanti da un punto (centro). Equazione: (x-α)²+(y-β)²=r² con centro C(α,β) e raggio r. Forma generale: x²+y²+ax+by+c=0 con centro C(-a/2,-b/2) e raggio r=√(a²/4+b²/4-c). Condizione di esistenza: a²/4+b²/4-c>0. Posizione retta-circonferenza: secante (2 punti), tangente (1 punto), esterna (0 punti). Condizione di tangenza: distanza centro-retta = raggio.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": ["parabola", "circonferenza", "coniche", "vertice"],
          "collegamenti": ["fuoco", "direttrice", "tangente"]
        }
      ]
    },
    {
      "id": "mat-trigonometria",
      "titolo": "Trigonometria",
      "annoRiferimento": "3.",
      "descrizione": "Funzioni goniometriche e loro applicazioni",
      "sottoargomenti": [
        {
          "titolo": "Funzioni goniometriche",
          "riassunto": "La circonferenza goniometrica ha centro nell'origine e raggio 1. Un angolo α determina un punto P sulla circonferenza; le coordinate di P definiscono cosα (ascissa) e sinα (ordinata). La tangente è tanα=sinα/cosα (definita per cosα≠0). La cotangente è cotα=cosα/sinα. Relazione fondamentale: sin²α+cos²α=1. Valori notevoli: sin0°=0, sin30°=1/2, sin45°=√2/2, sin60°=√3/2, sin90°=1. Per il coseno: cos0°=1, cos30°=√3/2, cos45°=√2/2, cos60°=1/2, cos90°=0. Periodicità: sin e cos hanno periodo 2π, tan e cot hanno periodo π. Simmetrie: sin(-α)=-sinα (dispari), cos(-α)=cosα (pari). Angoli associati: sin(π-α)=sinα, cos(π-α)=-cosα, sin(π/2-α)=cosα. I grafici: sinusoide e cosinusoide oscillano tra -1 e 1; la tangente ha asintoti verticali in π/2+kπ. Le funzioni inverse: arcsin, arccos, arctan restituiscono l'angolo dato il valore.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["seno", "coseno", "tangente", "circonferenza goniometrica"],
          "collegamenti": ["angoli", "periodicità", "grafici"]
        },
        {
          "titolo": "Formule e equazioni goniometriche",
          "riassunto": "Formule di addizione: sin(α±β)=sinα cosβ±cosα sinβ, cos(α±β)=cosα cosβ∓sinα sinβ, tan(α±β)=(tanα±tanβ)/(1∓tanα tanβ). Formule di duplicazione: sin2α=2sinα cosα, cos2α=cos²α-sin²α=2cos²α-1=1-2sin²α, tan2α=2tanα/(1-tan²α). Formule di bisezione: sin(α/2)=±√[(1-cosα)/2], cos(α/2)=±√[(1+cosα)/2]. Formule parametriche con t=tan(α/2): sinα=2t/(1+t²), cosα=(1-t²)/(1+t²). Prostaferesi: somma in prodotto e viceversa. Equazioni goniometriche elementari: sinx=k ha soluzioni x=arcsin(k)+2kπ e x=π-arcsin(k)+2kπ se |k|≤1. Equazioni lineari in sin e cos: asinx+bcosx=c si risolvono con metodo grafico o parametrico. Equazioni omogenee: si divide per cos²x ottenendo equazione in tanx. Disequazioni goniometriche: si usano i grafici o la circonferenza goniometrica. Teoremi sui triangoli: teorema dei seni a/sinA=b/sinB=c/sinC=2R, teorema del coseno c²=a²+b²-2ab cosC.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": ["formule", "equazioni goniometriche", "teorema seni"],
          "collegamenti": ["addizione", "duplicazione", "triangoli"]
        }
      ]
    },
    {
      "id": "mat-esponenziali-logaritmi",
      "titolo": "Esponenziali e logaritmi",
      "annoRiferimento": "3.",
      "descrizione": "Funzioni esponenziali e logaritmiche",
      "sottoargomenti": [
        {
          "titolo": "Funzione esponenziale",
          "riassunto": "La funzione esponenziale è f(x)=aˣ con a>0 e a≠1. Il dominio è ℝ, l'immagine è (0,+∞). Passa sempre per (0,1). Se a>1 è crescente (cresce verso +∞ per x→+∞, tende a 0 per x→-∞). Se 0<a<1 è decrescente. L'asintoto orizzontale è y=0. La funzione è iniettiva, quindi invertibile. Proprietà: a⁰=1, a¹=a, aˣ×aʸ=aˣ⁺ʸ, aˣ/aʸ=aˣ⁻ʸ, (aˣ)ʸ=aˣʸ, (ab)ˣ=aˣbˣ. La base più importante è e≈2,718 (numero di Nepero): eˣ è la funzione esponenziale naturale, derivata di se stessa. Equazioni esponenziali: aᶠ⁽ˣ⁾=aᵍ⁽ˣ⁾ ⟺ f(x)=g(x). Equazioni riconducibili: si pone t=aˣ e si risolve in t, poi si torna a x. Disequazioni: aᶠ⁽ˣ⁾>aᵍ⁽ˣ⁾ equivale a f(x)>g(x) se a>1, a f(x)<g(x) se 0<a<1. Applicazioni: crescita esponenziale (popolazioni, interessi composti), decadimento radioattivo.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["esponenziale", "crescita", "numero e", "proprietà"],
          "collegamenti": ["logaritmi", "equazioni", "applicazioni"]
        },
        {
          "titolo": "Funzione logaritmica",
          "riassunto": "Il logaritmo in base a di x è l'esponente a cui elevare a per ottenere x: logₐx=y ⟺ aʸ=x. Condizioni: a>0, a≠1, x>0. Il dominio è (0,+∞), l'immagine è ℝ. Passa per (1,0). Se a>1 è crescente; se 0<a<1 è decrescente. L'asintoto verticale è x=0. È l'inversa dell'esponenziale: logₐ(aˣ)=x e a^(logₐx)=x. Logaritmi notevoli: log₁₀ (decimale), ln=logₑ (naturale). Proprietà: logₐ1=0, logₐa=1, logₐ(xy)=logₐx+logₐy, logₐ(x/y)=logₐx-logₐy, logₐ(xⁿ)=n logₐx. Cambio di base: logₐx=logᵦx/logᵦa. Equazioni logaritmiche: si pongono condizioni di esistenza (argomenti >0), si applicano le proprietà, si risolve. Disequazioni: logₐf(x)>logₐg(x) equivale a f(x)>g(x)>0 se a>1, a 0<f(x)<g(x) se 0<a<1. Applicazioni: scale logaritmiche (decibel, Richter, pH), compressione di dati, complessità algoritmica.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["logaritmo", "proprietà", "cambio base", "equazioni"],
          "collegamenti": ["esponenziale", "inversa", "applicazioni"]
        }
      ]
    },
    {
      "id": "mat-funzioni",
      "titolo": "Funzioni reali",
      "annoRiferimento": "4.",
      "descrizione": "Studio delle funzioni, e proprietà",
      "sottoargomenti": [
        {
          "titolo": "Dominio, codominio, e grafico",
          "riassunto": "Una funzione reale di variabile reale è una legge f: A→B che associa a ogni x∈A (dominio) un unico y∈B (codominio). La notazione f(x) indica il valore della funzione in x. Il grafico è l'insieme dei punti (x, f(x)) nel piano cartesiano e costituisce la rappresentazione visiva. La determinazione del dominio consiste nell'insieme dei valori x per cui f(x) è definita. Le restrizioni includono radici pari con radicando ≥0, denominatori ≠0, logaritmi con argomento >0, arcsin e arccos con argomento in [-1, 1]. Esempi sono f(x)=1/x con dominio R-{0}, f(x)=√x con dominio [0, +∞), f(x)=log(x) con dominio (0, +∞). Il codominio è l'insieme di arrivo mentre l'immagine sono i valori effettivamente assunti: Im(f)={f(x): x∈Dom(f)}⊆Cod(f). Le funzioni elementari includono polinomiali con dominio R, razionali o fratte con dominio R esclusi gli zeri del denominatore, irrazionali con radici, esponenziali a^x con dominio R e immagine (0, +∞) se a>0, logaritmiche log_a(x) con dominio (0, +∞) e immagine R, trigonometriche come sin e cos con dominio R e immagine [-1, 1] e tan con dominio R-{π/2+kπ}, iperboliche e inverse trigonometriche. La lettura del grafico simmetrie per funzioni pari o dispari, intersezioni con gli assi per gli zeri f(x)=0 e l'ordinata all'origine f(0), segno, monotonia, limiti e asintoti. Una funzione è iniettiva se f(x₁)=f(x₂) ⟹ x₁=x₂, cioè ogni retta orizzontale interseca il grafico al massimo una volta. È suriettiva se Im(f)=Cod(f), cioè ogni y ha una controimmagine. È biiettiva se è sia iniettiva sia suriettiva e ammette l'inversa f⁻¹. La composizione è (g∘f)(x)=g(f(x)) dove si applica prima f, seguita da g, con dominio {x: x∈Dom(f) ∧ f(x)∈Dom(g)}.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": [
            "funzioni",
            "dominio",
            "grafico",
            "iniettività"
          ],
          "collegamenti": [
            "insieme",
            "relazioni",
            "inversa"
          ]
        },
        {
          "titolo": "Funzioni elementari, e trasformazioni",
          "riassunto": "Le funzioni elementari sono i mattoni fondamentali: le potenze x^n con n pari hanno simmetria rispetto all'asse y e n dispari simmetria rispetto all'origine, le radici sono inverse delle potenze, le esponenziali e^x e a^x sono crescenti se a>1 e decrescenti se 0<a<1 e sempre positive, i logaritmi ln(x) e log_a(x) sono inversi delle esponenziali e crescenti se a>1, le trigonometriche sin, cos, tan sono periodiche, e il valore assoluto |x| ha grafico a V. Le trasformazioni geometriche del grafico includono la traslazione verticale f(x)+k dove il grafico sale se k>0 e scende se k<0, la traslazione orizzontale f(x-h) verso destra se h>0 e sinistra se h<0, la dilatazione verticale kf(x) che allunga se k>1 e schiaccia se 0<k<1, la dilatazione orizzontale f(x/k), la riflessione rispetto all'asse x con -f(x) che ribalta, la riflessione rispetto all'asse y con f(-x) che specchia, il valore assoluto |f(x)| che ribalta la parte negativa e f(|x|) che crea simmetria rispetto all'asse y dalla parte x>0. Nelle composizioni di trasformazioni l'ordine è importante e si applicano prima le parentesi più interne. Una funzione è pari se f(-x)=f(x) ed è simmetrica rispetto all'asse y, dispari se f(-x)=-f(x) ed è simmetrica rispetto all'origine, periodica se f(x+T)=f(x) e si ripete ogni periodo T. Le funzioni definite per casi o piecewise hanno forma f(x)={g(x) se x<a, h(x) se x≥a} e richiedono studio separato degli intervalli e raccordo per la continuità. Esempi sono la funzione segno, parte intera ⌊x⌋, parte frazionaria {x}, heaviside H(x) e rampa max(0, x). Le applicazioni includono la modellazione di fenomeni in fisica ed economia.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": [
            "trasformazioni",
            "grafico",
            "simmetrie",
            "funzioni elementari"
          ],
          "collegamenti": [
            "esponenziali",
            "logaritmi",
            "trigonometria"
          ]
        }
      ]
    },
    {
      "id": "mat-limiti",
      "titolo": "Limiti, e continuità",
      "annoRiferimento": "4.",
      "descrizione": "Teoria dei limiti, e funzioni continue",
      "sottoargomenti": [
        {
          "titolo": "Concetto di limite, e calcolo",
          "riassunto": "Il limite descrive il comportamento di una funzione vicino a un punto o all'infinito. Il limite lim(x→x₀) f(x) = L significa che f(x) si avvicina arbitrariamente a L quando x si avvicina sufficientemente a x₀ escludendo x₀. La definizione rigorosa ε-δ ∀ε>0 ∃δ>0: 0<|x-x₀|<δ ⟹ |f(x)-L|<ε. I limiti all'infinito includono lim(x→x₀) f(x) = +∞ quando f diverge positivamente e lim(x→x₀) f(x) = -∞ quando diverge negativamente. I limiti all'infinito come lim(x→+∞) f(x) = L descrivono il comportamento per x grande. I limiti destro e sinistro sono lim(x→x₀⁺) f(x) per l'avvicinamento da destra e lim(x→x₀⁻) f(x) da sinistra, e il limite esiste se coincidono. I teoremi fondamentali includono l'unicità del limite, la permanenza del segno dove f(x)>0 in un intorno implica lim≥0, e il confronto o teorema dei carabinieri dove g≤f≤h e lim g = lim h = L implica lim f = L. L'algebra dei limiti lim(f+g)=lim f + lim g per la somma, lim(fg)=lim f · lim g per il prodotto e lim(f/g)=lim f / lim g per il quoziente se lim g≠0. Le forme indeterminate 0/0, ∞/∞, 0·∞, ∞-∞, 1^∞, 0^0, ∞^0 richiedono manipolazioni algebriche, razionalizzazione, raccoglimento e semplificazioni. I limiti notevoli includono lim(x→0) sin(x)/x = 1, lim(x→0) (1-cos(x))/x² = 1/2, lim(x→±∞) (1+1/x)^x = e, lim(x→0) (e^x-1)/x = 1, lim(x→0) (a^x-1)/x = ln(a), lim(x→0) log(1+x)/x = 1. La sostituzione t=f(x) cambia la variabile e semplifica il calcolo. Gli infinitesimi e infiniti hanno ordini, confronti ed equivalenze dove f~g se lim f/g=1.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "limiti",
            "continuità",
            "forme indeterminate",
            "limiti notevoli"
          ],
          "collegamenti": [
            "derivate",
            "asintoti",
            "successioni"
          ]
        },
        {
          "titolo": "Continuità, e teoremi fondamentali",
          "riassunto": "Una funzione è continua in x₀ se sono verificate tre condizioni: 1) f(x₀) è definita, 2) lim(x→x₀) f(x) esiste, 3) lim(x→x₀) f(x) = f(x₀). Equivalentemente, la continuità richiede che lim(x→x₀⁺) f(x) = lim(x→x₀⁻) f(x) = f(x₀). Una funzione è continua in un intervallo se è continua in ogni punto dell'intervallo. Le discontinuità si classificano in: prima specie o salto quando i limiti destro e sinistro sono diversi ma finiti, seconda specie quando almeno un limite non esiste o è infinito, terza specie o eliminabile quando i limiti coincidono ma sono diversi da f(x₀) o f non è definita. Le funzioni elementari sono continue nei loro domini naturali: i polinomi in R, le esponenziali, i logaritmi e le trigonometriche nei loro domini. L'algebra delle funzioni continue somma, prodotto, quoziente e composizione di funzioni continue sono continue. Il teorema degli zeri di Bolzano afferma che se f è continua in [a, b] e f(a)·f(b)<0 (segni opposti), allora esiste c∈(a, b) tale che f(c)=0, cioè la funzione attraversa l'asse x. Questo teorema ha applicazioni nella localizzazione degli zeri delle equazioni. Il teorema dei valori intermedi di Darboux una funzione continua in [a, b] assume tutti i valori compresi tra f(a) e f(b). Il teorema di Weierstrass afferma che una funzione continua su un intervallo chiuso e limitato [a, b] è limitata e raggiunge il massimo e minimo assoluti, cioè esistono x_M e x_m tali che f(x_m)≤f(x)≤f(x_M) per ogni x∈[a, b]. Questi teoremi permettono di dimostrare l'esistenza di soluzioni di equazioni e di risolvere problemi di ottimizzazione.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": [
            "continuità",
            "teorema zeri",
            "Weierstrass",
            "discontinuità"
          ],
          "collegamenti": [
            "limiti",
            "estremi",
            "teoremi"
          ]
        }
      ]
    },
    {
      "id": "mat-derivate",
      "titolo": "Derivate, e applicazioni",
      "annoRiferimento": "5.",
      "descrizione": "Calcolo differenziale, e studio funzioni",
      "sottoargomenti": [
        {
          "titolo": "Definizione, e significato geometrico derivata",
          "riassunto": "La derivata f'(x₀) misura la velocità di variazione istantanea della funzione f nel punto x₀. Il rapporto incrementale Δf/Δx = [f(x₀+h)-f(x₀)]/h rappresenta la variazione media nell'intervallo [x₀, x₀+h]. La derivata è definita come f'(x₀) = lim(h→0) [f(x₀+h)-f(x₀)]/h, cioè il limite del rapporto incrementale. L'interpretazione geometrica f'(x₀) è il coefficiente angolare della retta tangente al grafico nel punto (x₀, f(x₀)), con equazione y-f(x₀)=f'(x₀)(x-x₀). L'interpretazione fisica vede la derivata come velocità istantanea se f(t) rappresenta la posizione, mentre l'accelerazione è a=v'(t). Una funzione è derivabile in x₀ se f'(x₀) esiste ed è finita, ed è derivabile in un intervallo se è derivabile in ogni punto interno. La derivabilità implica la continuità, ma non viceversa: ad esempio |x| è continua nell'origine ma non derivabile per la presenza di una cuspide. I punti di non derivabilità includono cuspidi come |x| nell'origine dove i limiti destro e sinistro della derivata sono opposti, punti angolosi dove le derivate destra e sinistra sono diverse, tangenti verticali dove f'=±∞, e punti di discontinuità. Le derivate fondamentali sono: c'=0, (x^n)'=nx^(n-1), (e^x)'=e^x, (a^x)'=a^x ln(a), (ln x)'=1/x, (log_a x)'=1/(x ln a), (sin x)'=cos x, (cos x)'=-sin x, (tan x)'=1/cos²x=1+tan²x, (arcsin x)'=1/√(1-x²), (arctan x)'=1/(1+x²). Le regole di derivazione includono la linearità [af+bg]'=af'+bg', la regola del prodotto (fg)'=f'g+fg', la regola del quoziente (f/g)'=(f'g-fg')/g², la regola della catena per la composizione [f(g(x))]'=f'(g(x))·g'(x), e la derivata della funzione inversa [f⁻¹(y)]'=1/f'(x).",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "derivate",
            "tangente",
            "regole derivazione",
            "interpretazione"
          ],
          "collegamenti": [
            "limiti",
            "continuità",
            "velocità"
          ]
        },
        {
          "titolo": "Teoremi fondamentali calcolo differenziale",
          "riassunto": "Il teorema di Fermat fornisce una condizione necessaria per gli estremi locali: se x₀ è un estremo relativo interno e f è derivabile in x₀, allora f'(x₀)=0, cioè x₀ è un punto stazionario o critico. Il viceversa è falso: f'(x₀)=0 non implica necessariamente un estremo, come mostra l'esempio di x³ nell'origine che è un flesso. Il teorema di Rolle stabilisce che se f è continua in [a, b], derivabile in (a, b) e f(a)=f(b), allora esiste c∈(a, b) tale che f'(c)=0, cioè esiste un punto con tangente orizzontale. Il teorema di Lagrange o del valor medio afferma che se f è continua in [a, b] e derivabile in (a, b), allora esiste c∈(a, b) tale che f'(c)=[f(b)-f(a)]/(b-a), ovvero esiste un punto dove la tangente è parallela alla secante. Le conseguenze del teorema di Lagrange sono fondamentali: se f'=0 in un intervallo allora f è costante; se f'=g' allora f=g+c cioè differiscono per una costante; se f'>0 allora f è strettamente crescente, se f'<0 allora è decrescente (test di monotonia). Il teorema di Cauchy è una generalizzazione del teorema di Lagrange a due funzioni. La regola di De L'Hôpital risolve le forme indeterminate 0/0 o ∞/∞ stabilendo che lim f/g = lim f'/g' se il secondo limite esiste, ed è iterabile. Si applica al calcolo di limiti difficili e alle forme indeterminate 0·∞ riscrivendole come quoziente, ∞-∞ usando il minimo comune multiplo, 1^∞, 0^0, ∞^0 usando il logaritmo ed e^. Lo studio completo di una funzione include: dominio, intersezioni con gli assi, studio del segno, limiti e asintoti, derivata prima per crescenza/decrescenza e massimi/minimi, derivata seconda per concavità e flessi, e infine il grafico qualitativo.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "Lagrange",
            "Rolle",
            "De L'Hôpital",
            "teoremi"
          ],
          "collegamenti": [
            "estremi",
            "monotonia",
            "studio funzione"
          ]
        },
        {
          "titolo": "Studio completo di funzione",
          "riassunto": "Lo studio completo di una funzione è una procedura sistematica per tracciare il grafico qualitativo attraverso dieci passi fondamentali. 1) Dominio: determinare l'insieme di definizione escludendo i punti problematici come zeri del denominatore o argomenti negativi di radici pari. 2) Simmetrie: verificare se la funzione è pari f(-x)=f(x), dispari f(-x)=-f(x) o periodica f(x+T)=f(x). 3) Intersezioni con gli assi: trovare gli zeri risolvendo f(x)=0 per l'asse x, e calcolare f(0) per l'ordinata all'origine se 0∈Dom. 4) Studio del segno: risolvere f(x)>0 e f(x)<0 costruendo la tabella dei segni. 5) Limiti: calcolare i limiti agli estremi del dominio, nei punti di accumulo e per x→±∞, verificando l'esistenza di limiti finiti o infiniti. 6) Asintoti: verticali x=x₀ se lim(x→x₀±)f(x)=±∞, orizzontali y=L se lim(x→±∞)f(x)=L, obliqui y=mx+q dove m=lim f(x)/x e q=lim[f(x)-mx] per x→±∞, escludendo gli obliqui se esistono quelli orizzontali. 7) Derivata prima f': calcolarla, studiarne il segno per determinare gli intervalli di crescenza f'>0 e decrescenza f'<0, individuare i punti critici dove f'=0 o non esiste e classificare massimi e minimi con lo studio del segno di f' (cambio da + a - indica massimo, da - a + minimo, nessun cambio indica flesso orizzontale). 8) Derivata seconda f'': calcolarla, studiarne il segno per la concavità verso l'alto f''>0 (convessa ∪) o verso il basso f''<0 (concava ∩), individuare i flessi dove f''=0 con cambio di segno della concavità. 9) Grafico: sintetizzare tutte le informazioni raccolte, segnare i punti notevoli (estremi, flessi, intersezioni), tracciare gli andamenti negli intervalli usando gli asintoti come guide. 10) Verifiche: controllare la coerenza del grafico con tutti i dati calcolati. Le funzioni più studiate sono razionali, irrazionali, esponenziali, logaritmiche, trigonometriche e le loro composizioni.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 9,
          "tags": [
            "studio funzione",
            "asintoti",
            "grafico",
            "concavità"
          ],
          "collegamenti": [
            "derivate",
            "limiti",
            "massimi minimi"
          ]
        }
      ]
    },
    {
      "id": "mat-integrali",
      "titolo": "Integrali",
      "annoRiferimento": "5.",
      "descrizione": "Calcolo integrale, e applicazioni",
      "sottoargomenti": [
        {
          "titolo": "Integrale indefinito, e primitive",
          "riassunto": "Una primitiva o antiderivata F di una funzione f su un intervallo I è una funzione tale che F'(x)=f(x) per ogni x∈I. Se F è una primitiva di f, allora anche F+c è una primitiva, dove c è una costante arbitraria, poiché la derivata di una costante è zero. L'insieme di tutte le primitive forma una famiglia di funzioni che differiscono per una costante additiva. L'integrale indefinito ∫f(x)dx = F(x)+c è la notazione che indica l'insieme di tutte le primitive di f. Gli integrali immediati sono le inverse delle derivate: ∫x^n dx = x^(n+1)/(n+1)+c per n≠-1, ∫1/x dx = ln|x|+c, ∫e^x dx = e^x+c, ∫a^x dx = a^x/ln(a)+c, ∫sin(x)dx = -cos(x)+c, ∫cos(x)dx = sin(x)+c, ∫1/cos²(x)dx = tan(x)+c, ∫1/√(1-x²)dx = arcsin(x)+c, ∫1/(1+x²)dx = arctan(x)+c. La proprietà di linearità stabilisce che ∫[af(x)+bg(x)]dx = a∫f(x)dx + b∫g(x)dx. I metodi di integrazione includono la scomposizione in somme, i raccoglimenti, le sostituzioni e l'integrazione per parti, oltre alle frazioni parziali. L'integrazione per sostituzione usa la formula ∫f(g(x))g'(x)dx = F(g(x))+c dove F è una primitiva di f, oppure il cambio di variabile t=g(x) con dt=g'(x)dx. L'integrazione per parti segue la formula ∫f(x)g'(x)dx = f(x)g(x) - ∫f'(x)g(x)dx, scegliendo f facilmente derivabile e g' facilmente integrabile, iterando se necessario. Gli integrali di funzioni razionali si risolvono con le frazioni parziali, scomponendo N(x)/D(x) in una somma di termini più semplici con denominatori di primo e secondo grado. Gli integrali trigonometrici utilizzano le formule di duplicazione, bisezione e di Werner.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "integrale indefinito",
            "primitive",
            "metodi integrazione"
          ],
          "collegamenti": [
            "derivate",
            "sostituzione",
            "parti"
          ]
        },
        {
          "titolo": "Integrale definito, e teorema fondamentale",
          "riassunto": "L'integrale definito ∫[a, b] f(x)dx rappresenta l'area sottesa dal grafico di f tra x=a e x=b, considerata con segno: positiva sopra l'asse x e negativa sotto. La definizione di Riemann si basa sulla partizione dell'intervallo [a, b] in n sottointervalli, calcolando le somme integrali superiori e inferiori tramite rettangoli circoscritti e inscritti, e prendendo il limite per n→∞ con larghezza massima che tende a zero. Una funzione è integrabile secondo Riemann se questo limite esiste ed è unico. Le funzioni continue sono sempre integrabili. Le proprietà fondamentali includono: linearità ∫[a, b][αf+βg] = α∫f + β∫g, additività ∫[a, b]f = ∫[a, c]f + ∫[c, b]f per a<c<b, monotonia f≤g ⟹ ∫f≤∫g, e teorema del valor medio ∫[a, b]f = f(ξ)(b-a) per qualche ξ∈(a, b). Il teorema fondamentale del calcolo integrale (Torricelli-Barrow) stabilisce due risultati cruciali: 1) se f è continua in [a, b], allora F(x)=∫[a, x]f(t)dt è derivabile e F'(x)=f(x), cioè l'integrale definisce una primitiva; 2) se F è una primitiva di f, allora ∫[a, b]f(x)dx = F(b)-F(a) = [F(x)]ᵇₐ, permettendo il calcolo tramite primitive. Le applicazioni comprendono il calcolo dell'area tra curve usando ∫[a, b][f(x)-g(x)]dx quando f≥g, il volume di solidi di rotazione con ∫πf²(x)dx attorno all'asse x o ∫πx²dy attorno all'asse y con il metodo dei gusci cilindrici, la lunghezza dell'arco di curva tramite ∫√(1+f'²(x))dx, e gli integrali impropri su intervalli illimitati o con funzioni illimitate, studiandone convergenza e divergenza.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "integrale definito",
            "teorema fondamentale",
            "area",
            "volume"
          ],
          "collegamenti": [
            "Riemann",
            "applicazioni geometriche",
            "primitive"
          ]
        }
      ]
    },
    {
      "id": "mat-probabilita",
      "titolo": "Probabilità, e statistica",
      "annoRiferimento": "5.",
      "descrizione": "Calcolo probabilità, e statistica descrittiva",
      "sottoargomenti": [
        {
          "titolo": "Calcolo combinatorio, e probabilità",
          "riassunto": "Il calcolo combinatorio si occupa di contare le configurazioni possibili. Il principio di moltiplicazione stabilisce che per k scelte successive con n₁, n₂, . . ., nₖ modi rispettivamente, si ottengono n₁·n₂·. . . ·nₖ configurazioni totali. Le permutazioni sono gli ordinamenti di n oggetti distinti e si calcolano con P_n=n! (fattoriale). Con ripetizione si hanno n^k modi per k scelte da n oggetti quando l'ordine conta. Le disposizioni sono k oggetti scelti da n in modo ordinato: D(n, k)=n!/(n-k)! = n(n-1). . . (n-k+1). Le combinazioni sono k oggetti scelti da n senza considerare l'ordine: C(n, k)=n!/[k!(n-k)!], detto coefficiente binomiale. La probabilità può essere definita in tre modi: classica P(E) = casi favorevoli / casi possibili per eventi equiprobabili, statistica come frequenza relativa, e assiomatica secondo Kolmogorov con 0≤P≤1, P(Ω)=1 e additività per eventi disgiunti. Lo spazio campionario Ω è l'insieme di tutti gli esiti possibili, mentre un evento E⊆Ω è un sottoinsieme. Gli eventi possono essere: complementare Ē (non E), unione E∪F (E o F), intersezione E∩F (E e F), incompatibili quando E∩F=∅. La probabilità totale è P(E∪F)=P(E)+P(F)-P(E∩F), che si semplifica in P(E∪F)=P(E)+P(F) per eventi disgiunti. La probabilità condizionata P(E|F) = P(E∩F)/P(F) esprime la probabilità di E dato che F è avvenuto. Gli eventi sono indipendenti quando P(E∩F)=P(E)·P(F), cioè uno non influenza l'altro. Il teorema di Bayes P(E|F) = P(F|E)·P(E)/P(F) permette di l'inversione del condizionamento. Le applicazioni spaziano dalla genetica alla diagnostica medica, dai giochi d'azzardo alla finanza.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "probabilità",
            "combinatoria",
            "eventi",
            "Bayes"
          ],
          "collegamenti": [
            "statistica",
            "fattoriale",
            "indipendenza"
          ]
        },
        {
          "titolo": "Variabili aleatorie, e distribuzioni",
          "riassunto": "Una variabile aleatoria X è una funzione dallo spazio campionario Ω ai numeri reali che associa un valore numerico a ogni esito. Le variabili discrete assumono valori finiti o numerabili come nei lanci di dadi, monete o conteggi di difetti. Le variabili continue assumono infiniti valori in un intervallo come altezze, pesi o tempi. Per le variabili discrete, la funzione di probabilità è p(x)=P(X=x) che esprime la probabilità dei singoli valori, con Σp(x)=1. Per le variabili continue, la funzione di densità f(x)≥0 soddisfa ∫f(x)dx=1 e P(a≤X≤b)=∫[a, b]f(x)dx. La funzione di ripartizione F(x)=P(X≤x) è cumulativa, crescente, con lim(x→-∞)F=0 e lim(x→+∞)F=1. Il valore atteso o media è E(X)=Σx·p(x) per variabili discrete e ∫x·f(x)dx per continue, rappresentando il baricentro della distribuzione. La varianza Var(X)=E[(X-μ)²]=E(X²)-[E(X)]² misura la dispersione intorno alla media, mentre la deviazione standard è σ=√Var(X). Le distribuzioni discrete notevoli includono: Bernoulli per successo/insuccesso con probabilità p, binomiale B(n, p) per n prove di Bernoulli indipendenti, Poisson per eventi rari. Le distribuzioni continue comprendono: uniforme U(a, b) costante nell'intervallo [a, b], esponenziale per tempi di attesa, normale o Gaussiana N(μ, σ²) con forma a campana simmetrica intorno alla media μ e deviazione σ, normale standard N(0, 1). Il teorema del limite centrale stabilisce che la somma di molte variabili indipendenti tende alla distribuzione normale indipendentemente dalla distribuzione originale, risultato fondamentale per la statistica inferenziale. Le applicazioni spaziano dalla fisica per misure ed errori, alla biologia per popolazioni, all'economia e finanza per la gestione dei rischi.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "variabili aleatorie",
            "distribuzioni",
            "media",
            "varianza",
            "Normale"
          ],
          "collegamenti": [
            "probabilità",
            "statistica",
            "Gauss"
          ]
        }
      ]
    }
  ]
};
