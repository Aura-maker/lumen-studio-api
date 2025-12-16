// Contenuti - CORRETTO AUTOMATICAMENTE
// Correzioni grammaticali applicate: 146

module.exports = {
  "materia": {
    "nome": "⚛️ Fisica",
    "descrizione": "Fisica moderna: elettromagnetismo, relatività, e quantistica",
    "colore": "#3498DB",
    "icona": "atom",
    "annoScolastico": [
      "4.",
      "5."
    ]
  },
  "argomenti": [
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
