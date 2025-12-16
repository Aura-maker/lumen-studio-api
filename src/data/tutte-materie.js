// Tutte le materie di ImparaFacile - Contenuti completi
const italiano = require('./contenuti-italiano');
const storia = require('./contenuti-storia');
const filosofia = require('./contenuti-filosofia');
const fisica = require('./contenuti-fisica');

// Matematica
const matematica = {
  materia: {
    nome: '🧮 Matematica',
    descrizione: 'Analisi matematica e calcolo differenziale',
    colore: '#50E3C2',
    annoScolastico: ['4', '5']
  },
  argomenti: [
    {
      titolo: 'Derivate e studio di funzione',
      annoRiferimento: '5',
      descrizione: 'Calcolo differenziale e applicazioni',
      sottoargomenti: [
        {
          titolo: 'Derivate e significato geometrico',
          riassunto: `La derivata di una funzione f(x) in un punto x₀ rappresenta il coefficiente angolare della retta tangente al grafico in quel punto ed è definita come il limite del rapporto incrementale: f'(x₀) = lim[h→0] (f(x₀+h) - f(x₀))/h. Geometricamente, la derivata misura la velocità istantanea di variazione della funzione. Una funzione è derivabile in x₀ se questo limite esiste finito. La derivabilità implica continuità ma non viceversa (es: f(x)=|x| in x=0 è continua ma non derivabile). Regole di derivazione: derivata di una costante è zero d/dx(k)=0; derivata di x^n è nx^(n-1); derivata della somma è somma delle derivate d/dx(f+g)=f'+g'; derivata del prodotto (fg)'=f'g+fg'; derivata del quoziente (f/g)'=(f'g-fg')/g²; derivata di funzione composta (regola della catena) d/dx f(g(x))=f'(g(x))·g'(x). Derivate notevoli: d/dx(e^x)=e^x, d/dx(ln x)=1/x, d/dx(sin x)=cos x, d/dx(cos x)=-sin x, d/dx(tan x)=1/cos²x, d/dx(arctan x)=1/(1+x²). Il teorema di Fermat afferma che se f ha un massimo o minimo locale in x₀ interno e f è derivabile, allora f'(x₀)=0 (punto stazionario). I punti stazionari sono candidati per massimi e minimi. Il test della derivata seconda determina la natura: se f''(x₀)>0 è un minimo, se f''(x₀)<0 è un massimo. Studio completo di funzione: 1)dominio, 2)intersezioni assi, 3)segno, 4)limiti agli estremi e asintoti (verticali lim=±∞, orizzontali lim=k, obliqui y=mx+q con m=lim f(x)/x e q=lim(f(x)-mx)), 5)derivata prima e crescenza/decrescenza (f'>0 crescente, f'<0 decrescente), 6)punti stazionari e massimi/minimi, 7)derivata seconda e concavità (f''>0 concava verso l'alto, f''<0 verso il basso), 8)flessi (punti dove cambia concavità), 9)grafico. Teoremi fondamentali: Rolle (se f continua in [a,b], derivabile in (a,b), f(a)=f(b) allora esiste c: f'(c)=0), Lagrange (esiste c: f'(c)=(f(b)-f(a))/(b-a)), Cauchy, de l'Hôpital (per forme indeterminate 0/0 o ∞/∞: lim f/g = lim f'/g').`,
          livelloDifficolta: 'avanzato',
          tempoLettura: 6,
          tags: ['derivate', 'studio-funzione', 'massimi-minimi', 'teoremi'],
          collegamenti: ['limiti', 'integrali', 'grafici']
        }
      ]
    }
  ]
};

// Scienze
const scienze = {
  materia: {
    nome: '🔬 Scienze',
    descrizione: 'Biologia, Chimica e Scienze della Terra',
    colore: '#4ECDC4',
    annoScolastico: ['5']
  },
  argomenti: [
    {
      titolo: 'Genetica e DNA',
      annoRiferimento: '5',
      descrizione: 'La molecola della vita e l\'eredità genetica',
      sottoargomenti: [
        {
          titolo: 'Struttura del DNA e replicazione',
          riassunto: `Il DNA (acido desossiribonucleico) è la molecola che contiene l'informazione genetica di tutti gli organismi viventi. La sua struttura a doppia elica fu scoperta da Watson e Crick nel 1953 basandosi sui dati di diffrazione ai raggi X di Rosalind Franklin. Il DNA è un polimero formato da nucleotidi, ognuno composto da: uno zucchero (desossiribosio), un gruppo fosfato e una base azotata. Le basi azotate sono quattro: adenina (A) e guanina (G) sono purine (anello doppio), timina (T) e citosina (C) sono pirimidine (anello singolo). I nucleotidi si legano tra loro formando un filamento dove lo zucchero di un nucleotide si lega al fosfato del successivo (legame fosfodiesterico) creando lo scheletro zucchero-fosfato. Due filamenti si appaiano tramite legami idrogeno tra basi complementari: A si appaia sempre con T (due legami idrogeno), G sempre con C (tre legami idrogeno). Questa complementarietà è la chiave della replicazione. I due filamenti sono antiparalleli (orientati in direzioni opposte 5'→3' e 3'→5') e avvolti a spirale (doppia elica) con un giro completo ogni 10 paia di basi (3,4 nm). La replicazione del DNA è semiconservativa: ogni filamento serve da stampo per sintetizzare il filamento complementare, producendo due molecole figlie ognuna con un filamento vecchio e uno nuovo. Il processo inizia in punti specifici (origini di replicazione) dove l'enzima elicasi apre la doppia elica. La DNA polimerasi sintetizza il nuovo filamento aggiungendo nucleotidi complementari in direzione 5'→3'. Sul filamento guida la sintesi è continua, su quello tardivo è discontinua (frammenti di Okazaki) uniti poi dalla DNA ligasi. Meccanismi di controllo correggono errori garantendo fedeltà. Ogni cellula umana contiene circa 2 metri di DNA compattato in 46 cromosomi grazie a proteine istoniche. I geni sono sequenze di DNA che codificano proteine o RNA funzionali.`,
          livelloDifficolta: 'intermedio',
          tempoLettura: 6,
          tags: ['dna', 'genetica', 'replicazione', 'watson-crick'],
          collegamenti: ['rna', 'sintesi-proteica', 'mutazioni', 'evoluzione']
        }
      ]
    }
  ]
};

// Arte
const arte = {
  materia: {
    nome: '🎨 Arte',
    descrizione: 'Storia dell\'arte moderna e contemporanea',
    colore: '#FF6B6B',
    annoScolastico: ['4', '5']
  },
  argomenti: [
    {
      titolo: 'Impressionismo',
      annoRiferimento: '5',
      descrizione: 'La rivoluzione della luce e del colore',
      sottoargomenti: [
        {
          titolo: 'Claude Monet e l\'Impressionismo',
          riassunto: `L'Impressionismo nasce ufficialmente nel 1874 quando un gruppo di artisti parigini (Monet, Renoir, Degas, Pissarro, Sisley, Morisot) organizza una mostra indipendente presso lo studio del fotografo Nadar, rifiutati dal Salon ufficiale. Il critico Louis Leroy conia ironicamente il termine "impressionismo" vedendo il quadro di Monet "Impression, soleil levant" (1872). Gli impressionisti rivoluzionano la pittura occidentale abbandonando lo studio e dipingendo en plein air per cogliere gli effetti fuggevoli della luce naturale. Claude Monet (1840-1926) è il caposcuola: la sua ricerca si concentra ossessivamente sulle variazioni luminose. Dipinge lo stesso soggetto a diverse ore (le cattedrali di Rouen, la Gare Saint-Lazare, i covoni) per catturare come la luce modifica i colori. La sua tecnica prevede pennellate separate di colori puri (non mescolati sulla tavolozza) che l'occhio dello spettatore fonde a distanza (mescolanza ottica), creando vibrazioni luminose. Abolisce il nero e le ombre colorate. I soggetti sono la vita moderna: paesaggi, fiumi, giardini, scene urbane. Negli ultimi anni a Giverny crea il giardino con lo stagno delle ninfee che dipinge ossessivamente in grandi pannelli dove la forma si dissolve in macchie di colore prefigurando l'astrattismo. Gli impressionisti eliminano il disegno preparatorio, la prospettiva rigida, il chiaroscuro tradizionale. Dipingono rapidamente per cogliere l'attimo. Usano colori complementari per contrasti vivaci. Le ombre non sono nere ma colorate (viola, blu). Il tocco è frammentato, visibile. Influenze: fotografia (inquadrature nuove), stampe giapponesi (composizioni asimmetriche, colori piatti). Conseguenze: liberano il colore dalla forma, aprono la strada alle avanguardie del Novecento.`,
          livelloDifficolta: 'intermedio',
          tempoLettura: 5,
          tags: ['impressionismo', 'monet', 'luce', 'plein-air'],
          collegamenti: ['post-impressionismo', 'realismo', 'avanguardie']
        }
      ]
    }
  ]
};

// Inglese, Latino, Religione
const inglese = {
  materia: { nome: '🌍 Inglese', descrizione: 'Letteratura inglese moderna', colore: '#1E90FF', annoScolastico: ['4', '5'] },
  argomenti: [{ titolo: 'Victorian Age', annoRiferimento: '5', descrizione: 'Età vittoriana e romanzo sociale', sottoargomenti: [{ titolo: 'Charles Dickens', riassunto: `Charles Dickens (1812-1870) è il più grande romanziere dell'età vittoriana. La sua infanzia difficile (il padre in prigione per debiti, il lavoro in fabbrica a 12 anni) segna profondamente la sua opera. Dickens denuncia le ingiustizie sociali della società industriale vittoriana: lo sfruttamento minorile, le workhouses (ospizi per poveri), le prigioni, la corruzione. Oliver Twist (1837-39) racconta di un orfano che cade nelle mani di una banda di ladri londinesi guidata da Fagin; il romanzo denuncia la durezza delle workhouses. David Copperfield (1849-50) è in parte autobiografico: la storia di formazione di un ragazzo che diventa scrittore superando povertà e difficoltà. Great Expectations (1860-61) esplora i temi dell'ambizione, della colpa, della redenzione attraverso la storia di Pip. A Christmas Carol (1843) usa il fantastico per veicolare un messaggio di carità cristiana. Lo stile di Dickens unisce realismo sociale a umorismo, sentimentalismo e grottesco. Crea personaggi memorabili e tipi sociali. Usa cliffhanger per tenere i lettori in attesa (pubblicava a puntate). La sua lingua è ricca, inventiva, drammatica. Dickens influenza il romanzo sociale europeo mostrando che la letteratura può essere strumento di denuncia mantenendo appeal popolare. Muore nel 1870 lasciando incompiuto The Mystery of Edwin Drood. È sepolto a Westminster Abbey.`, livelloDifficolta: 'base', tempoLettura: 5, tags: ['dickens', 'victorian', 'romanzo-sociale'], collegamenti: ['romanzo-realista', 'verismo'] }] }] };

const latino = {
  materia: { nome: '📘 Latino', descrizione: 'Letteratura latina imperiale', colore: '#CD853F', annoScolastico: ['4', '5'] },
  argomenti: [{ titolo: 'Tacito', annoRiferimento: '5', descrizione: 'Storiografia e analisi del potere', sottoargomenti: [{ titolo: 'Annales e stile tacitiano', riassunto: `Publio Cornelio Tacito (55-120 d.C. circa) è il massimo storico latino e uno dei più grandi dell'antichità. Appartiene all'aristocrazia senatoria e vive durante il principato, assistendo al tramonto delle libertà repubblicane. La sua opera maggiore sono gli Annales che narrano la storia di Roma dalla morte di Augusto (14 d.C.) a quella di Nerone (68 d.C.), coprendo le dinastie Giulio-Claudia. Ci sono pervenuti libri 1-4 (Tiberio), parte del 5-6, 11-12 (Claudio), 13-16 (Nerone). Tacito analizza lucidamente i meccanismi del potere imperiale: come il principato distrugge le virtù romane sostituendo la libertas con la servitù adulatoria. Ritrae Tiberio come tiranno dissimulatore, Claudio come burattino nelle mani di liberti e mogli, Nerone come mostro. Ma Tacito non è nostalgico della repubblica: capisce che l'impero è necessario per governare il vasto territorio. Il suo pessimismo è consapevole della contraddizione tra necessità dell'impero e perdita della libertà. Lo stile tacitiano è unico: conciso fino all'oscurità, asimmetrico, drammatico. Usa variatio (evita ripetizioni), inconcinnitas (rottura della simmetria classica), brevitas (eliminazione del superfluo). Memorabili le sentenze che condensano giudizi morali. Usa il discorso indiretto per riportare dibattiti. Il metodo storiografico è rigoroso: consulta fonti, riporta versioni divergenti. Ma la storia per Tacito non è neutrale: è magistra vitae, deve insegnare la virtù o almeno far orrore del vizio. Influenzerà Machiavelli e gli storici moderni.`, livelloDifficolta: 'avanzato', tempoLettura: 6, tags: ['tacito', 'annales', 'storiografia', 'impero'], collegamenti: ['seneca', 'svetonio', 'impero-romano'] }] }] };

const religione = {
  materia: { nome: '✝️ Religione', descrizione: 'Etica, fede e dialogo interreligioso', colore: '#FFA500', annoScolastico: ['5'] },
  argomenti: [{ titolo: 'Etica e società contemporanea', annoRiferimento: '5', descrizione: 'Sfide etiche del mondo moderno', sottoargomenti: [{ titolo: 'Dottrina sociale della Chiesa', riassunto: `La dottrina sociale della Chiesa cattolica è un corpo di insegnamenti che applica il Vangelo ai problemi sociali, economici e politici. Nasce con l'enciclica Rerum Novarum di Leone XIII (1891) che affronta la questione operaia e critica sia il capitalismo selvaggio sia il socialismo materialista, proponendo una "terza via" basata sulla dignità del lavoro e sulla giustizia sociale. I principi fondamentali sono: 1)Dignità della persona umana - ogni essere umano è creato a immagine di Dio e ha diritti inalienabili. 2)Bene comune - l'insieme delle condizioni sociali che permettono alle persone di realizzarsi; prevale sul bene individuale ma rispetta i diritti personali. 3)Sussidiarietà - le decisioni vanno prese al livello più vicino ai cittadini; lo Stato interviene solo quando le comunità minori non possono farcela da sole. 4)Solidarietà - riconoscimento dell'interdipendenza umana e impegno per il bene di tutti. 5)Opzione preferenziale per i poveri - la Chiesa privilegia chi è marginalizzato. Applicazioni: diritto al lavoro dignitoso e giustamente retribuito, diritto all'abitazione, all'istruzione, alla salute. Critica della finanza speculativa e dell'economia che esclude. Cura del creato (Laudato si' di Francesco 2015). Pace come frutto della giustizia. Dialogo interreligioso come via per convivenza pacifica. Temi bioetici: dignità della vita dal concepimento alla morte naturale; critica di aborto ed eutanasia ma anche della pena di morte; responsabilità nella procreazione; limiti della tecnica. La DSC non è un programma politico ma indica valori e criteri etici per valutare sistemi sociali. Dialoga con laici e non credenti su base razionale.`, livelloDifficolta: 'base', tempoLettura: 5, tags: ['dottrina-sociale', 'etica', 'bene-comune', 'solidarietà'], collegamenti: ['filosofia-morale', 'bioetica', 'dialogo'] }] }] };

module.exports = {
  italiano,
  storia,
  filosofia,
  fisica,
  matematica,
  scienze,
  arte,
  inglese,
  latino,
  religione
};
