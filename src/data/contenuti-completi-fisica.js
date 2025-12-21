// Contenuti - CORRETTO AUTOMATICAMENTE
// Correzioni grammaticali applicate: 146

module.exports = {
  "materia": {
    "nome": "⚛️ Fisica",
    "descrizione": "Fisica moderna: elettromagnetismo, relatività, e quantistica",
    "colore": "#3498DB",
    "icona": "atom",
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
      "id": "fis-grandezze-misure",
      "titolo": "Grandezze e misure",
      "annoRiferimento": "1.",
      "descrizione": "Il metodo scientifico e le grandezze fisiche",
      "sottoargomenti": [
        {
          "titolo": "Il metodo scientifico",
          "riassunto": "La fisica è la scienza che studia i fenomeni naturali cercando leggi quantitative. Il metodo scientifico, sviluppato da Galileo Galilei nel XVII secolo, si basa su: osservazione del fenomeno, formulazione di un'ipotesi, verifica sperimentale, formulazione di una legge. Un'ipotesi deve essere falsificabile: deve essere possibile progettare un esperimento che la smentisca. Una teoria è un insieme coerente di leggi che spiega una classe di fenomeni. Il modello è una rappresentazione semplificata della realtà che ne cattura gli aspetti essenziali. La fisica si divide in: meccanica (moto e forze), termodinamica (calore e temperatura), elettromagnetismo (cariche e campi), ottica (luce), fisica moderna (relatività e quantistica). Le grandezze fisiche sono proprietà misurabili: fondamentali (definite indipendentemente) e derivate (combinazioni delle fondamentali). Il Sistema Internazionale (SI) definisce sette grandezze fondamentali: lunghezza (metro, m), massa (chilogrammo, kg), tempo (secondo, s), corrente elettrica (ampere, A), temperatura (kelvin, K), quantità di sostanza (mole, mol), intensità luminosa (candela, cd).",
          "livelloDifficolta": "base",
          "tempoLettura": 6,
          "tags": ["metodo scientifico", "Galileo", "grandezze", "SI"],
          "collegamenti": ["misure", "unità", "fisica"]
        },
        {
          "titolo": "Misure e incertezze",
          "riassunto": "Misurare significa confrontare una grandezza con un'unità di misura. Ogni misura è affetta da incertezza (errore). L'errore sistematico è costante e prevedibile (strumento tarato male); l'errore casuale è variabile e imprevedibile (fluttuazioni). La sensibilità è la minima variazione rilevabile; la portata è il massimo valore misurabile. L'incertezza assoluta Δx indica l'intervallo di indeterminazione: x = x₀ ± Δx. L'incertezza relativa εᵣ = Δx/x₀ è adimensionale; quella percentuale è εᵣ × 100%. Le cifre significative indicano la precisione: tutte le cifre certe più la prima incerta. Nelle operazioni: nella somma/differenza si mantiene il minor numero di decimali; nel prodotto/quoziente il minor numero di cifre significative. La propagazione degli errori: nella somma Δ(a+b) = Δa + Δb; nel prodotto εᵣ(ab) = εᵣ(a) + εᵣ(b). La notazione scientifica a × 10ⁿ con 1 ≤ |a| < 10 esprime numeri molto grandi o piccoli. I prefissi SI: nano (10⁻⁹), micro (10⁻⁶), milli (10⁻³), kilo (10³), mega (10⁶), giga (10⁹).",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["misure", "errori", "incertezza", "cifre significative"],
          "collegamenti": ["strumenti", "precisione", "notazione scientifica"]
        }
      ]
    },
    {
      "id": "fis-cinematica",
      "titolo": "Cinematica",
      "annoRiferimento": "1.",
      "descrizione": "Lo studio del moto",
      "sottoargomenti": [
        {
          "titolo": "Moto rettilineo uniforme",
          "riassunto": "La cinematica studia il moto senza considerare le cause. Il moto è il cambiamento di posizione nel tempo rispetto a un sistema di riferimento. La traiettoria è il percorso seguito; lo spostamento Δs = s₂ - s₁ è la variazione di posizione (vettore). La velocità media è vₘ = Δs/Δt; la velocità istantanea è il limite per Δt → 0. L'unità SI è m/s; 1 km/h = 1/3,6 m/s. Il moto rettilineo uniforme (MRU) ha velocità costante. La legge oraria è s = s₀ + vt dove s₀ è la posizione iniziale. Il grafico s-t è una retta con pendenza v; il grafico v-t è una retta orizzontale. Lo spazio percorso è l'area sotto il grafico v-t. Nel moto di andata e ritorno, lo spostamento totale può essere nullo anche se lo spazio percorso non lo è. La velocità relativa: se A si muove con velocità vₐ rispetto a B, e B con vᵦ rispetto a C, allora A rispetto a C ha velocità vₐ + vᵦ (somma vettoriale). Applicazioni: veicoli a velocità costante, onde, luce nel vuoto.",
          "livelloDifficolta": "base",
          "tempoLettura": 6,
          "tags": ["MRU", "velocità", "legge oraria", "traiettoria"],
          "collegamenti": ["spostamento", "grafico", "tempo"]
        },
        {
          "titolo": "Moto rettilineo uniformemente accelerato",
          "riassunto": "L'accelerazione è la variazione di velocità nel tempo: a = Δv/Δt. L'unità SI è m/s². L'accelerazione può essere positiva (aumento di velocità), negativa o decelerazione (diminuzione), nulla (MRU). Il moto rettilineo uniformemente accelerato (MRUA) ha accelerazione costante. Le leggi del MRUA sono: v = v₀ + at (velocità), s = s₀ + v₀t + ½at² (posizione), v² = v₀² + 2aΔs (senza tempo). Il grafico v-t è una retta con pendenza a; l'area sotto è lo spostamento. Il grafico s-t è una parabola. La caduta libera è un MRUA con a = g ≈ 9,8 m/s² verso il basso. Nel vuoto tutti i corpi cadono con la stessa accelerazione (Galileo). Le leggi della caduta: v = gt, h = ½gt², v² = 2gh. Il lancio verso l'alto: il corpo sale decelerando, si ferma all'altezza massima h = v₀²/2g, poi scende. Il tempo di salita è t = v₀/g; il tempo totale è 2t. La velocità di arrivo è uguale a quella di lancio.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["MRUA", "accelerazione", "caduta libera", "lancio"],
          "collegamenti": ["velocità", "gravità", "Galileo"]
        }
      ]
    },
    {
      "id": "fis-dinamica",
      "titolo": "Dinamica",
      "annoRiferimento": "1.",
      "descrizione": "Le forze e le leggi di Newton",
      "sottoargomenti": [
        {
          "titolo": "Le forze e i principi della dinamica",
          "riassunto": "La dinamica studia le cause del moto. La forza è una grandezza vettoriale che modifica lo stato di moto o la forma di un corpo. L'unità SI è il Newton (N = kg·m/s²). Le forze si sommano vettorialmente; la risultante è la somma di tutte le forze. Il primo principio (inerzia): un corpo permane nel suo stato di quiete o moto rettilineo uniforme se la risultante delle forze è nulla. L'inerzia è la tendenza a mantenere lo stato di moto; la massa è la misura dell'inerzia. Il secondo principio: F = ma; la forza risultante è uguale al prodotto di massa per accelerazione. A parità di forza, maggiore è la massa, minore è l'accelerazione. Il terzo principio (azione-reazione): a ogni azione corrisponde una reazione uguale e contraria. Le due forze agiscono su corpi diversi, hanno stessa retta d'azione, stesso modulo, versi opposti. Esempi: la Terra attira la mela, la mela attira la Terra; camminando spingiamo il pavimento indietro, il pavimento ci spinge avanti.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["forza", "Newton", "inerzia", "massa"],
          "collegamenti": ["accelerazione", "principi", "dinamica"]
        },
        {
          "titolo": "Forze fondamentali e applicazioni",
          "riassunto": "La forza peso è P = mg, diretta verso il centro della Terra. Dipende dalla massa e dall'accelerazione di gravità g (varia con latitudine e altitudine). La forza normale N è perpendicolare alla superficie di contatto; impedisce la compenetrazione. Su un piano orizzontale N = P. La forza di attrito si oppone al moto relativo tra superfici. L'attrito statico fₛ ≤ μₛN impedisce l'inizio del moto; l'attrito dinamico fₐ = μₐN agisce durante il moto. I coefficienti μ dipendono dai materiali; μₛ > μₐ. La forza elastica F = -kx (legge di Hooke): proporzionale allo spostamento dalla posizione di equilibrio, diretta verso l'equilibrio. k è la costante elastica (N/m). La tensione T è la forza trasmessa da funi e fili ideali (inestensibili, senza massa). Il piano inclinato: la componente parallela del peso è P∥ = mg sinθ, quella perpendicolare P⊥ = mg cosθ. Senza attrito, l'accelerazione è a = g sinθ. Con attrito, a = g(sinθ - μ cosθ).",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["peso", "attrito", "elastica", "piano inclinato"],
          "collegamenti": ["Hooke", "normale", "tensione"]
        }
      ]
    },
    {
      "id": "fis-lavoro-energia",
      "titolo": "Lavoro ed energia",
      "annoRiferimento": "2.",
      "descrizione": "Energia meccanica e conservazione",
      "sottoargomenti": [
        {
          "titolo": "Lavoro e potenza",
          "riassunto": "Il lavoro è il trasferimento di energia mediante una forza. Per una forza costante: L = F·s·cosθ dove θ è l'angolo tra forza e spostamento. L'unità SI è il Joule (J = N·m). Il lavoro è positivo se θ < 90° (forza concorde al moto), negativo se θ > 90° (forza opposta), nullo se θ = 90° (forza perpendicolare). Il lavoro della forza peso è L = mgh (positivo in discesa, negativo in salita). Il lavoro della forza elastica è L = ½kx₁² - ½kx₂². Il lavoro dell'attrito è sempre negativo: L = -fₐ·s. Per forze variabili, il lavoro è l'area sotto il grafico F-s. La potenza è il lavoro nell'unità di tempo: P = L/t = F·v. L'unità SI è il Watt (W = J/s). Altre unità: cavallo vapore (CV ≈ 736 W), kilowattora (kWh = 3,6 MJ, unità di energia). L'efficienza o rendimento è η = Lᵤₜᵢₗₑ/Lₜₒₜₐₗₑ ≤ 1. Le macchine semplici (leva, carrucola, piano inclinato) non moltiplicano il lavoro ma la forza a scapito dello spostamento.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["lavoro", "potenza", "Joule", "Watt"],
          "collegamenti": ["forza", "energia", "rendimento"]
        },
        {
          "titolo": "Energia cinetica e potenziale",
          "riassunto": "L'energia è la capacità di compiere lavoro. L'energia cinetica è l'energia del moto: Eₖ = ½mv². Il teorema dell'energia cinetica: il lavoro della risultante è uguale alla variazione di energia cinetica: L = ΔEₖ = ½mv₂² - ½mv₁². L'energia potenziale è l'energia della posizione in un campo di forze conservative. L'energia potenziale gravitazionale è Eₚ = mgh (rispetto a un livello di riferimento). L'energia potenziale elastica è Eₑ = ½kx². Una forza è conservativa se il lavoro dipende solo dalle posizioni iniziale e finale, non dal percorso: L = -ΔEₚ. Forze conservative: peso, elastica, gravitazionale. Forze non conservative: attrito. L'energia meccanica è Eₘ = Eₖ + Eₚ. Il principio di conservazione: in assenza di forze non conservative, l'energia meccanica si conserva: Eₘ₁ = Eₘ₂. Con attrito: Eₘ₁ = Eₘ₂ + |Lₐₜₜᵣᵢₜₒ|. L'energia si trasforma ma non si crea né si distrugge (primo principio della termodinamica generalizzato).",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": ["energia cinetica", "energia potenziale", "conservazione"],
          "collegamenti": ["lavoro", "forze conservative", "meccanica"]
        }
      ]
    },
    {
      "id": "fis-quantita-moto",
      "titolo": "Quantità di moto e urti",
      "annoRiferimento": "2.",
      "descrizione": "Impulso, quantità di moto e collisioni",
      "sottoargomenti": [
        {
          "titolo": "Quantità di moto e impulso",
          "riassunto": "La quantità di moto è p = mv, grandezza vettoriale. L'unità SI è kg·m/s. Il secondo principio in forma generale: F = dp/dt; la forza è la derivata della quantità di moto. Per massa costante: F = ma. L'impulso è J = FΔt = Δp; l'impulso di una forza è uguale alla variazione di quantità di moto. Per forze variabili, l'impulso è l'area sotto il grafico F-t. Il principio di conservazione della quantità di moto: in un sistema isolato (risultante delle forze esterne nulla), la quantità di moto totale si conserva: Σpᵢ = costante. Questo vale anche quando l'energia meccanica non si conserva (urti anelastici). Applicazioni: rinculo delle armi, propulsione dei razzi, moto dei biliardi. Il centro di massa di un sistema è il punto che si muove come se tutta la massa fosse concentrata lì e tutte le forze esterne vi fossero applicate. Per due masse: xₒₘ = (m₁x₁ + m₂x₂)/(m₁ + m₂).",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["quantità di moto", "impulso", "conservazione"],
          "collegamenti": ["forza", "massa", "velocità"]
        },
        {
          "titolo": "Gli urti",
          "riassunto": "Un urto è un'interazione breve e intensa tra corpi. In tutti gli urti si conserva la quantità di moto totale. L'urto elastico conserva anche l'energia cinetica: m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂' e ½m₁v₁² + ½m₂v₂² = ½m₁v₁'² + ½m₂v₂'². Nell'urto elastico centrale tra masse uguali, le velocità si scambiano. L'urto anelastico non conserva l'energia cinetica (parte si trasforma in calore, deformazione, suono). L'urto completamente anelastico: i corpi rimangono uniti dopo l'urto; v' = (m₁v₁ + m₂v₂)/(m₁ + m₂). La perdita di energia cinetica è massima. Il coefficiente di restituzione e = (v₂' - v₁')/(v₁ - v₂) misura l'elasticità: e = 1 elastico, e = 0 completamente anelastico, 0 < e < 1 anelastico. Gli urti obliqui richiedono la conservazione delle componenti della quantità di moto. Applicazioni: sicurezza automobilistica (airbag, zone di deformazione), sport (biliardo, tennis), fisica delle particelle.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 6,
          "tags": ["urti", "elastico", "anelastico", "collisioni"],
          "collegamenti": ["energia", "quantità di moto", "conservazione"]
        }
      ]
    },
    {
      "id": "fis-termodinamica",
      "titolo": "Termodinamica",
      "annoRiferimento": "2.",
      "descrizione": "Calore, temperatura e trasformazioni",
      "sottoargomenti": [
        {
          "titolo": "Temperatura e calore",
          "riassunto": "La temperatura misura lo stato termico di un corpo, legato all'energia cinetica media delle molecole. Le scale termometriche: Celsius (°C, 0° fusione ghiaccio, 100° ebollizione acqua), Kelvin (K, 0 K = -273,15°C è lo zero assoluto), Fahrenheit (°F). Conversioni: T(K) = T(°C) + 273,15; T(°F) = 1,8T(°C) + 32. Il calore Q è energia in transito tra corpi a temperature diverse; fluisce spontaneamente dal caldo al freddo. L'unità SI è il Joule; la caloria (cal) è il calore per alzare 1 g d'acqua di 1°C (1 cal = 4,186 J). La capacità termica C = Q/ΔT è il calore per variare la temperatura di 1 K. Il calore specifico c = C/m è la capacità termica per unità di massa. Q = mcΔT. L'acqua ha c = 4186 J/(kg·K), molto alto (termoregolazione). L'equilibrio termico: due corpi a contatto raggiungono la stessa temperatura; Q₁ + Q₂ = 0 (il calore ceduto da uno è assorbito dall'altro).",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["temperatura", "calore", "calore specifico", "equilibrio"],
          "collegamenti": ["Kelvin", "Celsius", "energia"]
        },
        {
          "titolo": "I principi della termodinamica",
          "riassunto": "Il primo principio: ΔU = Q - L; la variazione di energia interna è uguale al calore assorbito meno il lavoro compiuto dal sistema. L'energia interna U è l'energia totale delle molecole (cinetica + potenziale). Per i gas ideali U dipende solo dalla temperatura: U = nCᵥT. Le trasformazioni: isoterma (T costante, ΔU = 0, Q = L), isobara (P costante, L = PΔV), isocora (V costante, L = 0, Q = ΔU), adiabatica (Q = 0, ΔU = -L). Il secondo principio (Kelvin-Planck): è impossibile realizzare una trasformazione il cui unico risultato sia convertire integralmente calore in lavoro. (Clausius): è impossibile trasferire spontaneamente calore da un corpo freddo a uno caldo. L'entropia S è una misura del disordine; in un sistema isolato S può solo aumentare o restare costante: ΔS ≥ 0. Il rendimento di una macchina termica è η = L/Qₐₛₛ = 1 - Qceduto/Qₐₛₛ. Il rendimento massimo è quello di Carnot: η = 1 - Tₓ/Tₒ.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": ["termodinamica", "principi", "entropia", "rendimento"],
          "collegamenti": ["energia interna", "trasformazioni", "Carnot"]
        }
      ]
    },
    {
      "id": "fis-onde",
      "titolo": "Onde e suono",
      "annoRiferimento": "3.",
      "descrizione": "Fenomeni ondulatori e acustica",
      "sottoargomenti": [
        {
          "titolo": "Le onde meccaniche",
          "riassunto": "Un'onda è una perturbazione che si propaga trasportando energia senza trasporto di materia. Le onde meccaniche richiedono un mezzo materiale. Le onde trasversali hanno oscillazione perpendicolare alla propagazione (onde su corda, onde elettromagnetiche). Le onde longitudinali hanno oscillazione parallela alla propagazione (suono, onde sismiche P). Le grandezze caratteristiche: ampiezza A (massimo spostamento), lunghezza d'onda λ (distanza tra due creste), periodo T (tempo per un'oscillazione), frequenza f = 1/T (oscillazioni al secondo, Hz), velocità v = λf = λ/T. L'equazione dell'onda armonica: y = A sin(kx - ωt) con k = 2π/λ (numero d'onda) e ω = 2πf (pulsazione). Il principio di sovrapposizione: quando due onde si incontrano, lo spostamento risultante è la somma degli spostamenti. L'interferenza è costruttiva se le onde sono in fase (cresta con cresta), distruttiva se in opposizione di fase (cresta con ventre). Le onde stazionarie si formano per sovrapposizione di onde che viaggiano in direzioni opposte; hanno nodi (punti fermi) e ventri (massima oscillazione).",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 7,
          "tags": ["onde", "frequenza", "lunghezza d'onda", "interferenza"],
          "collegamenti": ["suono", "luce", "oscillazioni"]
        },
        {
          "titolo": "Il suono",
          "riassunto": "Il suono è un'onda longitudinale che si propaga in un mezzo elastico (non nel vuoto). La velocità dipende dal mezzo: aria ~340 m/s, acqua ~1500 m/s, acciaio ~5000 m/s. L'orecchio umano percepisce frequenze tra 20 Hz e 20.000 Hz (campo udibile). Infrasuoni < 20 Hz, ultrasuoni > 20.000 Hz. Le caratteristiche del suono: altezza (frequenza: grave/acuto), intensità (ampiezza: forte/debole), timbro (forma d'onda: distingue strumenti). L'intensità sonora I = P/A è la potenza per unità di superficie (W/m²). Il livello di intensità in decibel: β = 10 log(I/I₀) con I₀ = 10⁻¹² W/m² (soglia di udibilità). La soglia del dolore è ~120 dB. L'effetto Doppler: la frequenza percepita cambia se sorgente e osservatore sono in moto relativo. Se si avvicinano, la frequenza aumenta; se si allontanano, diminuisce. Formula: f' = f(v ± vₒ)/(v ∓ vₛ). Applicazioni: ecografia, sonar, radar, rilevazione velocità.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["suono", "decibel", "Doppler", "frequenza"],
          "collegamenti": ["onde", "acustica", "ultrasuoni"]
        }
      ]
    },
    {
      "id": "fis-ottica",
      "titolo": "Ottica",
      "annoRiferimento": "3.",
      "descrizione": "La luce e i fenomeni ottici",
      "sottoargomenti": [
        {
          "titolo": "La natura della luce",
          "riassunto": "La luce è un'onda elettromagnetica che si propaga nel vuoto a velocità c = 3×10⁸ m/s. Lo spettro elettromagnetico comprende (in ordine di frequenza crescente): onde radio, microonde, infrarosso, luce visibile (400-700 nm), ultravioletto, raggi X, raggi gamma. La luce visibile va dal rosso (λ ~ 700 nm) al viola (λ ~ 400 nm). La luce ha natura duale: onda e particella (fotone). L'energia del fotone è E = hf dove h = 6,63×10⁻³⁴ J·s è la costante di Planck. L'ottica geometrica tratta la luce come raggi rettilinei (valida quando λ << dimensioni degli oggetti). La propagazione rettilinea spiega le ombre. La riflessione: il raggio incidente, il raggio riflesso e la normale giacciono sullo stesso piano; l'angolo di incidenza è uguale all'angolo di riflessione. Gli specchi piani formano immagini virtuali, diritte, delle stesse dimensioni. Gli specchi curvi (concavi e convessi) formano immagini reali o virtuali secondo la posizione dell'oggetto.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 6,
          "tags": ["luce", "spettro", "riflessione", "specchi"],
          "collegamenti": ["onde", "fotone", "ottica"]
        },
        {
          "titolo": "Rifrazione e lenti",
          "riassunto": "La rifrazione è la deviazione della luce nel passaggio tra mezzi con diverso indice di rifrazione n = c/v. La legge di Snell: n₁ sinθ₁ = n₂ sinθ₂. Passando a un mezzo più denso (n maggiore), il raggio si avvicina alla normale. La riflessione totale avviene quando la luce passa da un mezzo più denso a uno meno denso con angolo maggiore dell'angolo critico: sinθc = n₂/n₁. Applicazioni: fibre ottiche, prismi. La dispersione: l'indice di rifrazione dipende dalla lunghezza d'onda; la luce bianca si separa nei colori (arcobaleno, prisma). Le lenti sono mezzi trasparenti limitati da superfici curve. Le lenti convergenti (biconvesse) fanno convergere i raggi paralleli nel fuoco; le lenti divergenti (biconcave) li fanno divergere. L'equazione delle lenti sottili: 1/p + 1/q = 1/f dove p è la distanza oggetto, q la distanza immagine, f la distanza focale. L'ingrandimento è G = -q/p. L'occhio umano è un sistema ottico con lente (cristallino) e schermo (retina). I difetti visivi (miopia, ipermetropia) si correggono con lenti.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": ["rifrazione", "Snell", "lenti", "dispersione"],
          "collegamenti": ["indice rifrazione", "fibre ottiche", "occhio"]
        }
      ]
    },
    {
      "id": "fis-elettrostatica",
      "titolo": "Elettrostatica",
      "annoRiferimento": "4.",
      "descrizione": "Cariche elettriche, e campo elettrico",
      "sottoargomenti": [
        {
          "titolo": "Carica elettrica, e legge di Coulomb",
          "riassunto": "La carica elettrica è una proprietà fondamentale della materia che esiste in due tipi: positiva (protone) e negativa (elettrone). Le cariche dello stesso segno si respingono, mentre quelle di segno opposto si attraggono. L'unità di misura è il Coulomb (C), l'elettrone ha una carica elementare e = 1, 6×10⁻¹⁹ C. La quantizzazione della carica ogni carica è un multiplo intero della carica elementare q = ne. La conservazione della carica afferma che la carica totale di un sistema isolato rimane costante: si può redistribuire ma non si crea né si distrugge. L'elettrizzazione avviene per strofinio con trasferimento di elettroni (l'ambra strofinata attrae le pagliuzze), per contatto quando un conduttore toccato acquisisce la stessa carica, e per induzione quando una carica vicina polarizza un conduttore senza contatto diretto. I conduttori hanno cariche libere di muoversi (nei metalli gli elettroni di conduzione), mentre gli isolanti o dielettrici hanno cariche fisse. La legge di Coulomb descrive la forza elettrostatica tra due cariche puntiformi q₁ e q₂ a distanza r: F = k(q₁q₂)/r² con k costante elettrostatica k = 8, 99×10⁹ N·m²/C² nel vuoto. La forza è centrale lungo la congiungente, attrattiva o repulsiva secondo il segno, e dipende dal quadrato inverso della distanza come la gravitazione. Il Il principio di sovrapposizione la forza su una carica dovuta a più cariche è la somma vettoriale delle forze singole. Nel confronto tra forza elettrica e gravitazionale, quella elettrica è enormemente più intensa, mentre quella gravitazionale è sempre attrattiva ma trascurabile a scala atomica. Le applicazioni includono i fulmini per separazione di cariche nelle nubi, l'elettroscopio come rivelatore di cariche, le macchine elettrostatiche come il generatore. .",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 8,
          "tags": [
            "elettrostatica",
            "Coulomb",
            "carica",
            "forza elettrica"
          ],
          "collegamenti": [
            "campo elettrico",
            "potenziale",
            "atomo"
          ]
        },
        {
          "titolo": "Campo elettrico, e potenziale",
          "riassunto": "Il campo elettrico E è un vettore che definisce la forza per unità di carica positiva: E=F/q. È generato dalle cariche sorgenti e agisce sulle cariche di prova. L'unità di misura è N/C o V/m. Per una carica puntiforme q il campo è E=kq/r² con direzione radiale uscente se positiva ed entrante se negativa. Il Il principio di sovrapposizione il campo totale è la somma vettoriale dei campi singoli. Le linee di campo sono tangenti alla direzione del campo, la loro densità indica l'intensità, escono dalle cariche positive ed entrano in quelle negative, e non si intersecano mai. Il flusso del campo elettrico Φ misura quante linee attraversano una superficie: Φ=E·A per campo uniforme perpendicolare. La legge di Gauss il flusso attraverso una superficie chiusa è proporzionale alla carica interna: Φ=Q/ε₀ con ε₀=8, 85×10⁻¹² C²/(N·m²) costante dielettrica del vuoto. Le applicazioni di Gauss permettono il calcolo del campo in presenza di simmetrie come sfera conduttrice carica, piano infinito uniforme e filo infinito. In un conduttore all'equilibrio il campo interno è nullo, la carica si distribuisce sulla superficie esterna e il campo alla superficie è perpendicolare con E=σ/ε₀ dove σ è la densità superficiale. La gabbia di Faraday realizza la schermatura dal campo esterno. L'energia potenziale elettrica U rappresenta il lavoro della forza conservativa indipendente dal percorso: U=kq₁q₂/r per l'energia di una coppia di cariche. Il potenziale elettrico V è l'energia potenziale per unità di carica V=U/q con unità il Volt (V=J/C). Per una carica puntiforme V=kq/r ed è uno scalare. La differenza di potenziale o tensione ΔV=V_B-V_A rappresenta il lavoro per spostare una carica unitaria da A a B. Le superfici equipotenziali collegano punti allo stesso potenziale. .",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "campo elettrico",
            "potenziale",
            "Gauss",
            "energia"
          ],
          "collegamenti": [
            "lavoro",
            "conservazione energia",
            "conduttori"
          ]
        }
      ]
    },
    {
      "id": "fis-corrente",
      "titolo": "Corrente elettrica, e circuiti",
      "annoRiferimento": "4.",
      "descrizione": "Leggi di Ohm e circuiti elettrici",
      "sottoargomenti": [
        {
          "titolo": "Corrente elettrica, e resistenza",
          "riassunto": "La corrente elettrica I rappresenta il flusso di cariche attraverso un conduttore ed è definita come l'intensità di carica che transita per unità di tempo: I=Q/t, con unità di misura l'Ampere (A=C/s). La corrente continua (DC) ha intensità costante, mentre la corrente alternata (AC) è periodica e sinusoidale. Il verso convenzionale va dal positivo al negativo, opposto al movimento degli elettroni. Il generatore di tensione come batterie e pile mantiene una differenza di potenziale chiamata forza elettromotrice (fem) ε, spostando le cariche contro il campo elettrico e compiendo lavoro attraverso reazioni chimiche. Un circuito elettrico è un percorso chiuso per la corrente, composto da elementi come generatori, resistori, capacitori, interruttori e conduttori. La prima legge di Ohm la differenza di potenziale V tra gli estremi di un conduttore è proporzionale alla corrente I: V=RI, dove R è la resistenza con unità l'Ohm (Ω=V/A). La resistenza rappresenta l'opposizione al passaggio della corrente e dipende dal materiale e dalla geometria. La seconda legge di Ohm esprime la resistenza di un filo come R=ρL/A, dove ρ è la resistività del materiale (Ω·m), l la lunghezza e A la sezione. I conduttori hanno resistività bassa (rame, argento), gli isolanti alta. I superconduttori hanno resistività nulla sotto la temperatura critica. La dipendenza dalla temperatura mostra che nei metalli la resistività aumenta con T per le collisioni con gli ioni, mentre nei semiconduttori diminuisce. L'effetto Joule descrive come la corrente scalda il conduttore dissipando energia, con potenza P=VI=RI²=V²/R e calore Q=Pt. Le applicazioni includono lampadine a incandescenza, forni e tostapane. I resistori sono componenti con resistenza definita, identificata da codici a colori. Nei circuiti in serie R_tot=R₁+R₂+. . . Con stessa corrente e tensioni che si sommano, mentre in parallelo 1/R_tot=1/R₁+1/R₂+. . . Con stessa tensione e correnti che si sommano. Si usano partitori di tensione e di corrente. Le leggi di Kirchhoff stabiliscono che nei nodi la somma delle correnti entranti e uscenti è zero per la conservazione della carica, mentre nelle maglie la somma delle tensioni è zero per la conservazione dell'energia.",
          "livelloDifficolta": "intermedio",
          "tempoLettura": 8,
          "tags": [
            "corrente",
            "Ohm",
            "resistenza",
            "circuiti",
            "Kirchhoff"
          ],
          "collegamenti": [
            "potenza",
            "Joule",
            "serie parallelo"
          ]
        },
        {
          "titolo": "Condensatori, e circuiti RC",
          "riassunto": "Il condensatore è un dispositivo che immagazzina carica ed energia elettrica, costituito da due armature conduttrici separate da un isolante chiamato dielettrico. La capacità C è definita come il rapporto tra la carica Q e la differenza di potenziale V: C=Q/V, con unità di misura il Farad (F=C/V). Per un condensatore piano parallelo la capacità è C=ε₀A/d, dove A è l'area delle armature e d la distanza tra esse. L'inserimento di un dielettrico tra le armature aumenta la capacità secondo la formula C=κε₀A/d, dove κ è la costante dielettrica relativa del materiale (κ>1). L'energia immagazzinata nel condensatore è U=(1/2)QV=(1/2)CV²=(1/2)Q²/C ed è localizzata nel campo elettrico tra le armature. La densità di energia del campo elettrico è u=(1/2)ε₀E². Nei circuiti con condensatori, il collegamento in serie segue la legge 1/C_tot=1/C₁+1/C₂+. . . Con stessa carica e tensioni che si sommano, mentre in parallelo C_tot=C₁+C₂+. . . Con stessa tensione e cariche che si sommano. Il circuito RC (resistore-condensatore) presenta fenomeni transitori: durante la carica del condensatore attraverso un resistore, corrente e tensione variano esponenzialmente nel tempo secondo Q(t)=Q_max(1-e^(-t/τ)), dove τ=RC è la costante di tempo caratteristica che indica il tempo per raggiungere il 63% della carica. Durante la scarica si ha Q(t)=Q₀e^(-t/τ) con decadimento esponenziale. Le applicazioni dei condensatori includono filtri di frequenza, temporizzatori, flash per fotocamere, alimentatori per il livellamento della tensione, memorie DRAM dove i condensatori mantengono i bit, touch screen capacitivi e defibrillatori cardiaci. Gli esperimenti storici comprendono la bottiglia di Leyda (primo condensatore del 1745) e gli esperimenti di Franklin sull'elettricità atmosferica. I condensatori variabili sono usati nelle radio per la sintonia delle frequenze. I supercondensatori o ultracapacitori hanno capacità enormi (migliaia di Farad) e rappresentano un ponte tra condensatori tradizionali e batterie.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 7,
          "tags": [
            "condensatori",
            "capacità",
            "circuiti RC",
            "energia"
          ],
          "collegamenti": [
            "campo elettrico",
            "esponenziale",
            "dielettrico"
          ]
        }
      ]
    },
    {
      "id": "fis-magnetismo",
      "titolo": "Magnetismo",
      "annoRiferimento": "4.",
      "descrizione": "Campo magnetico, e forza di Lorentz",
      "sottoargomenti": [
        {
          "titolo": "Campo magnetico, e forza di Lorentz",
          "riassunto": "Magnetismo fenomeno forze attrattive repulsive magneti (magnetite naturale, calamite artificiali). Poli magnetici Nord Sud poli opposti attraggono, uguali respingono e inseparabili (monopolo non esiste, spezzando magnete si ottengono due dipoli). Bussola ago magnetico orientato campo magnetico terrestre (Nord geografico Sud magnetico). Il campo magnetico B vettore descrive interazione magnetica e direzione Nord bussola, unità Tesla (T=N/(A·m)) o Gauss (1G=10⁻⁴T). Generato correnti è cariche movimento e non esistono cariche magnetiche isolate. Linee campo chiuse (non sorgenti né pozzi) e escono Nord entrano Sud magnete. Esperimento Oersted (1820): corrente filo devia ago magnetico, scopre legame elettricità magnetismo. La forza Lorentz descrive la forza carica q velocità v campo magnetico B: F=qv×B (prodotto vettoriale), direzione perpendicolare v e B (regola mano destra), modulo F=qvB sin(θ) e nulla se v parallelo B, massima se perpendicolare. Carica positiva è negativa forze opposte. Moto carica se v⊥B traiettoria circolare uniforme e raggio r=mv/(qB) proporzionale quantità moto, periodo T=2πm/(qB) indipendente velocità (ciclotrone). Le applicazioni spettrometro massa (separazione isotopi ioni diversa massa), ciclotrone sincrotrone (acceleratori particelle) e tubo raggi catodici (TV vecchie oscilloscopi), aurore polari (particelle vento solare campo terrestre), fasce Van Allen. La forza su filo percorso corrente F=ILB sin(θ) con I corrente, l lunghezza filo. Motore elettrico spira corrente campo ruota coppia forze, collettore inverte corrente rotazione continua",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "magnetismo",
            "Lorentz",
            "campo magnetico",
            "forza"
          ],
          "collegamenti": [
            "elettromagnetismo",
            "moto circolare",
            "acceleratori"
          ]
        },
        {
          "titolo": "Legge di Ampère, e solenoide",
          "riassunto": "La legge di Biot-Savart: campo magnetico generato corrente elemento infinitesimo filo, dB=(μ₀/4π)(Idl×r̂)/r² con μ₀=4π×10⁻⁷ T·m/A permeabilità magnetica vuoto. Integrazione lungo è filo campo totale. Filo rettilineo infinito corrente I: campo circonferenze concentriche, modulo B=(μ₀I)/(2πr) con r distanza filo e direzione regola mano destra (pollice corrente, dita campo). Spira circolare centro B=(μ₀I)/(2R) con R raggio. La legge di Ampère circuitazione campo magnetico lungo linea chiusa uguale corrente concatenata moltiplicata μ₀: ∮B·dl=μ₀I_conc. Simile Gauss elettrostatica. Applicazione simmetrie filo infinito e solenoide, toroide. Solenoide bobina N spire elicoidali avvolte cilindro, corrente genera campo uniforme interno B=μ₀nI con n=N/L densità spire (spire per metro) e esterno campo trascurabile. Solenoide ideale infinito campo perfettamente uniforme interno, applicazione elettromagneti. Toroide solenoide chiuso ciambella, campo confinato interno. La forza tra fili paralleli correnti attrattiva se correnti stessi verso (campi rafforzano) e repulsiva se opposte. La forza per unità lunghezza F/L=(μ₀I₁I₂)/(2πd). Definizione Ampere corrente che tra due fili paralleli infiniti distanza 1m produce forza 2×10⁻⁷ N/m. Le applicazioni elettromagneti (gru, campanelli, relè) e risonanza magnetica nucleare (MRI campi intensi uniformi), treni levitazione magnetica (Maglev), spettrometria massa e ciclotrone. Materiali magnetici diamagnetici (respinti campo), paramagnetici (attratti debolmente), ferromagnetici (ferro cobalto nichel fortemente magnetizzabili e domini magnetici allineano, isteresi)",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "Ampère",
            "solenoide",
            "elettromagnete",
            "fili corrente"
          ],
          "collegamenti": [
            "campo magnetico",
            "induzione",
            "materiali"
          ]
        }
      ]
    },
    {
      "id": "fis-induzione",
      "titolo": "Induzione elettromagnetica",
      "annoRiferimento": "5.",
      "descrizione": "Legge di Faraday, e onde elettromagnetiche",
      "sottoargomenti": [
        {
          "titolo": "Legge di Faraday-Neumann-Lenz e applicazioni",
          "riassunto": "L'induzione elettromagnetica è il fenomeno per cui la variazione del flusso magnetico concatenato con un circuito induce una corrente e una forza elettromotrice. La scoperta di Faraday (1831) dimostrò che un magnete mosso vicino a una spira genera corrente, ma solo durante la variazione di posizione. Il flusso magnetico Φ è definito come Φ=B·A=BA cos(θ), prodotto scalare tra campo magnetico e superficie, con unità di misura il Weber (Wb=T·m²), e misura quante linee di campo attraversano la superficie. La legge di Faraday-Neumann stabilisce che la forza elettromotrice indotta è ε=-dΦ/dt, proporzionale alla velocità di variazione del flusso. Il segno negativo esprime la legge di Lenz: la corrente indotta genera un campo magnetico che si oppone alla variazione del flusso, in accordo con la conservazione dell'energia. Secondo Lenz, se il flusso aumenta la corrente induce un campo contrario, se diminuisce un campo concorde. I modi per variare il flusso includono: muovere un magnete rispetto a una bobina, variare l'intensità della corrente in un elettromagnete, ruotare una spira in un campo magnetico, variare l'area della spira. La forza elettromotrice di moto per un conduttore di lunghezza L che si muove con velocità v perpendicolare a un campo B è ε=BLv (rotaia di Faraday), dove gli elettroni spostati dalla forza di Lorentz si accumulano agli estremi. L'alternatore è un generatore di corrente alternata dove una spira ruota in un campo magnetico uniforme: il flusso varia sinusoidalmente Φ(t)=BA cos(ωt) e la fem indotta è ε(t)=NBAω sin(ωt) con N spire e ω velocità angolare. Nelle centrali elettriche le turbine idrauliche, a vapore o eoliche ruotano gli alternatori. La dinamo è un generatore di corrente continua che usa un collettore per raddrizzare la corrente. Il trasformatore ha due avvolgimenti (primario e secondario) sullo stesso nucleo ferromagnetico: la variazione di corrente nel primario induce fem nel secondario, con rapporto delle tensioni V₂/V₁=N₂/N₁ uguale al rapporto delle spire e conservazione della potenza V₁I₁=V₂I₂. Si usa come elevatore di tensione per la trasmissione (riducendo le perdite) e riduttore per l'utilizzazione. Le applicazioni comprendono la generazione di energia elettrica, i trasformatori per la distribuzione, le dinamo delle biciclette e i microfoni dinamici.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 9,
          "tags": [
            "induzione",
            "Faraday",
            "Lenz",
            "alternatore",
            "trasformatore"
          ],
          "collegamenti": [
            "flusso magnetico",
            "corrente alternata",
            "energia"
          ]
        },
        {
          "titolo": "Equazioni di Maxwell, e onde elettromagnetiche",
          "riassunto": "L'Le equazioni di Maxwell sono quattro leggi fondamentali che unificano elettricità e magnetismo e predicono l'esistenza delle onde elettromagnetiche. 1) La legge di Gauss per l'elettrostatica: ∮E·dA=Q/ε₀ stabilisce che il flusso del campo elettrico è proporzionale alla carica racchiusa, indicando che le cariche sono le sorgenti del campo elettrico. 2) La legge di Gauss per il magnetismo: ∮B·dA=0 afferma che il flusso del campo magnetico è sempre nullo, dimostrando che non esistono monopoli magnetici. 3) La legge di Faraday-Neumann: ∮E·dl=-dΦ_B/dt stabilisce che la circuitazione del campo elettrico indotto è uguale alla variazione del flusso magnetico, rendendo il campo elettrico non conservativo. 4) La legge di Ampère-Maxwell: ∮B·dl=μ₀(I+ε₀ dΦ_E/dt) mostra che il campo magnetico è generato dalle correnti di conduzione più la corrente di spostamento, creando simmetria tra E e B. La corrente di spostamento introdotta da Maxwell nel 1865 è il termine ε₀ dΦ_E/dt aggiunto alla legge di Ampère: un campo elettrico variabile genera un campo magnetico, simmetricamente alla legge di Faraday, ed è essenziale per chiudere la teoria e permettere l'esistenza delle onde elettromagnetiche. Senza questo termine si avrebbe un'incoerenza nella carica di un condensatore dove la corrente appare interrotta. La simmetria delle equazioni mostra che un campo elettrico variabile genera un campo magnetico e viceversa, creando un accoppiamento reciproco che permette l'autopropagazione delle onde. Le conseguenze includono: l'unificazione dei fenomeni elettrici, magnetici e ottici; la previsione delle onde elettromagnetiche che si propagano alla velocità della luce nel vuoto c=1/√(ε₀μ₀)=3×10⁸ m/s; l'identificazione della luce come onda elettromagnetica; le basi per la relatività di Einstein. Le onde elettromagnetiche hanno campi E e B perpendicolari tra loro e alla direzione di propagazione, oscillano in fase, sono trasversali, si propagano nel vuoto e trasportano energia e quantità di moto. Lo spettro elettromagnetico comprende onde radio, microonde, infrarosso, luce visibile, ultravioletto, raggi X e raggi gamma. Le applicazioni spaziano dalle comunicazioni all'imaging medico, dall'astronomia multibanda alle tecnologie moderne.",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 8,
          "tags": [
            "Maxwell",
            "onde EM",
            "luce",
            "corrente spostamento"
          ],
          "collegamenti": [
            "elettromagnetismo",
            "relatività",
            "fotoni"
          ]
        }
      ]
    },
    {
      "id": "fis-relativita",
      "titolo": "Relatività ristretta",
      "annoRiferimento": "5.",
      "descrizione": "Spazio-tempo, e teoria Einstein",
      "sottoargomenti": [
        {
          "titolo": "Postulati relatività, e dilatazione tempo",
          "riassunto": "La fisica classica fine '800: velocità luce costante esperimento Michelson-Morley (1887) contraddice trasformazioni Galileo, non rileva etere (mezzo propagazione luce ipotizzato). Einstein (1905) teoria relatività ristretta rivoluziona concetti spazio tempo. I postulati 1) Leggi fisica identiche tutti sistemi riferimento inerziali (moto rettilineo uniforme), 2) Velocità luce vuoto c costante universale indipendente moto sorgente osservatore. Le conseguenze simultaneità relativa (eventi simultanei un sistema non sono altro), dilatazione tempo, contrazione lunghezze e equivalenza massa energia. Dilatazione tempo orologio moto ritarda rispetto fermo, Δt=γΔt₀ con γ=1/√(1-v²/c²) fattore Lorentz, Δt₀ tempo proprio (sistema riposo orologio). Per v<<c γ≈1 effetti trascurabili, v→c γ→∞. Paradosso gemelli gemello viaggia astronave velocità relativistica torna giovane fratello terra invecchiato e simmetria apparente risolta accelerazioni viaggiatore (non inerziale). Conferme sperimentali muoni cosmici raggi cosmici alta atmosfera decadono tempo vita 2μs ma velocità prossime c ritardo relativistico raggiungono superficie e orologi atomici aerei GPS correzioni relativistiche. Applicazioni GPS: satelliti moto veloce campo gravitazionale diverso correggere ritardi altrimenti errori chilometri. Sincrotrone acceleratori particelle elettroni protoni accelerati energie enormi massa aumenta relativisticamente limite velocità c. Spazio tempo unificati spaziotempo Minkowski 4D, intervallo invariante s²=c²t²-x²-y²-z²",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 9,
          "tags": [
            "relatività",
            "Einstein",
            "dilatazione tempo",
            "Lorentz"
          ],
          "collegamenti": [
            "velocità luce",
            "spaziotempo",
            "paradosso gemelli"
          ]
        },
        {
          "titolo": "Equivalenza massa-energia E=mc²",
          "riassunto": "Contrazione lunghezze: oggetto moto lunghezza direzione moto contratta, l=L₀/γ con L₀ lunghezza propria (riposo oggetto). Larghezze perpendicolari è invariate. Trasformazioni Lorentz sostituiscono Galileo velocità relativistiche, x'=γ(x-vt) e t'=γ(t-vx/c²). Composizione velocità: u'=(u-v)/(1-uv/c²) non somma semplice e se u=c anche u'=c (luce invariante). Quantità moto relativistica p=γmv con m massa riposo, tende ∞ per v→c impossibile raggiungere c. L'energia relativistica E=γmc² energia totale particella e riposo (v=0) E₀=mc² massa è energia, cinetica K=E-E₀=(γ-1)mc² per v<<c K≈(1/2)mv² classica. L'equivalenza massa-energia E=mc²: piccola massa enorme energia (c² enorme) e massa difetto nuclei (legame nuclei fissione fusione), sole stelle è fusione idrogeno elio. Conferme sperimentali decadimenti radioattivi massa prodotti minore originale differenza energia radiazione, reazioni nucleari fissione (centrali nucleari bombe uranio plutonio) fusione (Sole stelle bombe idrogeno), annichilazione elettrone-positrone 2γ fotoni energia 2m_e c² e creazione coppie fotone alta energia passa vicino nucleo crea elettrone-positrone. Acceleratori particelle LHC CERN energie TeV particelle, massa aumenta velocità energia cinetica enormi e scoperta bosone Higgs massa è particelle. Relazione energia-quantità moto E²=(pc)²+(mc²)² generalizza. Il fotone m=0: E=pc. La fisica nucleare particelle relativistica per energie alte velocità prossime c. Relatività generale (1915): estensione gravità curvatura spaziotempo, conferme perielo Mercurio lenti gravitazionali onde gravitazionali",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 9,
          "tags": [
            "E=mc²",
            "massa-energia",
            "fissione",
            "fusione"
          ],
          "collegamenti": [
            "energia nucleare",
            "relatività",
            "particelle"
          ]
        }
      ]
    },
    {
      "id": "fis-quantistica",
      "titolo": "Fisica quantistica, e nucleare",
      "annoRiferimento": "5.",
      "descrizione": "Atomo, nucleo, e meccanica quantistica",
      "sottoargomenti": [
        {
          "titolo": "Dualità onda-particella, e principio indeterminazione",
          "riassunto": "La crisi della fisica classica emerge da tre fenomeni fondamentali: il corpo nero con la quantizzazione dell'energia di Planck nel 1900 (E = nhf), l'effetto fotoelettrico spiegato da Einstein nel 1905 con i fotoni come luce quantizzata, e gli spettri atomici interpretati da Bohr nel 1913 con livelli energetici quantizzati. La dualità onda-particella rivela che la luce si comporta sia come fotoni (particelle) sia come onde (interferenza e diffrazione), mentre gli elettroni e la materia mostrano proprietà sia particellari sia ondulatorie secondo De Broglie nel 1924 (λ = h/p). L'esperimento della doppia fenditura dimostra che elettroni singoli creano frange di interferenza passando attraverso entrambe le fenditure contemporaneamente, ma questo comportamento collassa quando vengono osservati. Il fotone è il quanto di luce con energia E = hf = ħω e quantità di moto p = E/c = h/λ, dove h = 6, 63×10⁻³⁴ J·s è la costante di Planck e ħ = h/2π. L'effetto fotoelettrico si verifica quando la luce incide su un metallo ed estrae elettroni solo se la frequenza supera una soglia f₀, con energia cinetica degli elettroni K = hf - W dove W è il lavoro di estrazione. Questo fenomeno è indipendente dall'intensità contrariamente alla teoria classica, è immediato e l'intensità determina il numero di fotoni. L'onda di materia di De Broglie associa a ogni particella di massa m e velocità v una lunghezza d'onda λ = h/(mv), confermata dalla diffrazione di elettroni nei cristalli nell'esperimento di Davisson-Germer del 1927 e utilizzata nel microscopio elettronico per ottenere risoluzione maggiore di quello ottico. Il principio di indeterminazione di Heisenberg del 1927 stabilisce l'impossibilità di misurare simultaneamente con precisione posizione e quantità di moto (Δx·Δp ≥ ħ/2) ed energia e tem. .",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 9,
          "tags": [
            "dualità",
            "Heisenberg",
            "fotoni",
            "De Broglie",
            "quantistica"
          ],
          "collegamenti": [
            "atomo",
            "probabilità",
            "onda materia"
          ]
        },
        {
          "titolo": "Fisica nucleare: fissione, fusione, radioattività",
          "riassunto": "Nucleo atomico: protoni Z carica positiva (numero atomico elemento), neutroni N elettricamente neutri e numero massa A=Z+N. Isotopi stesso elemento Z diverso N (idrogeno deuterio trizio). Dimensione nucleo ~10⁻¹⁵m (femtometro fm) molto minore atomo ~10⁻¹⁰m. La forza nucleare è forte attrazione protoni neutroni cortissimo raggio supera repulsione elettrostatica protoni e mediata gluoni scambio quark. Difetto massa massa nucleo minore somma masse protoni neutroni, differenza Δm energia legame E_leg=Δm c² tiene unito nucleo. Curva energia legame per nucleone massima ferro-56 (più stabile) e nuclei leggeri possono fondere liberando energia, pesanti fissione. Radioattività: nuclei instabili decadono emettendo radiazioni spontaneamente. Decadimento α: emissione nucleo elio (2p+2n) riduce A di 4 Z di 2. Decadimento β⁻: neutrone diventa protone elettrone antineutrino aumenta Z di 1. Decadimento β⁺: protone diventa neutrone positrone neutrino diminuisce Z di 1. Decadimento γ: nucleo eccitato emette fotone gamma alta energia senza cambiare A Z. La legge decadimento N(t)=N₀e^(-λt) esponenziale e tempo dimezzamento t_(1/2)=ln(2)/λ tempo dimezzare nuclei. Fissione nucleare nucleo pesante (uranio-235 plutonio-239) assorbe neutrone si spezza due frammenti più neutroni liberando energia (~200 MeV). Reazione catena neutroni prodotti fissionano altri nuclei e controllata reattori nucleari (barre controllo assorbono neutroni), incontrollata bombe atomiche. Fusione nucleare nuclei leggeri (deuterio trizio) fondono nucleo più pesante (elio) liberando energia (~17 MeV), richiede temperature altissime (milioni gradi) vincere repulsione coulombiana, sole stelle, bombe idrogeno, iTER progetto fusione controllata",
          "livelloDifficolta": "avanzato",
          "tempoLettura": 9,
          "tags": [
            "nucleo",
            "fissione",
            "fusione",
            "radioattività",
            "energia nucleare"
          ],
          "collegamenti": [
            "E=mc²",
            "decadimento",
            "reattori"
          ]
        }
      ]
    }
  ]
};
