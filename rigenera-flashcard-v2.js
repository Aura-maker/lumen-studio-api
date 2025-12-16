/**
 * GENERATORE FLASHCARD V2 - ALTA QUALITÀ
 * Genera flashcard ottimizzate per spaced repetition
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'src', 'data', 'quiz-generati');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

console.log('\n' + '═'.repeat(60));
console.log('   📚 GENERATORE FLASHCARD V2 - ALTA QUALITÀ');
console.log('═'.repeat(60) + '\n');

// Knowledge base per flashcard
const FLASHCARD_DATA = {
  italiano: [
    // DANTE
    { fronte: 'Quando nacque Dante Alighieri?', retro: '1265 a Firenze', categoria: 'Dante', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Dante?', retro: 'La Divina Commedia (1321)', categoria: 'Dante', difficolta: 1 },
    { fronte: 'Quali sono le tre cantiche della Divina Commedia?', retro: 'Inferno, Purgatorio, Paradiso', categoria: 'Dante', difficolta: 1 },
    { fronte: 'Chi è Beatrice per Dante?', retro: 'La donna amata, guida spirituale nel Paradiso', categoria: 'Dante', difficolta: 2 },
    { fronte: 'Cos\'è la "Vita Nova"?', retro: 'Prosimetro dedicato a Beatrice (1294)', categoria: 'Dante', difficolta: 2 },
    { fronte: 'Cosa significa "Nel mezzo del cammin di nostra vita"?', retro: 'Dante ha 35 anni, metà della vita secondo la Bibbia', categoria: 'Dante', difficolta: 2 },
    { fronte: 'Chi guida Dante nell\'Inferno?', retro: 'Virgilio, simbolo della ragione', categoria: 'Dante', difficolta: 1 },
    { fronte: 'Cos\'è il "contrapasso"?', retro: 'Pena che rispecchia per analogia o contrasto il peccato', categoria: 'Dante', difficolta: 3 },
    
    // PETRARCA
    { fronte: 'Quando nacque Francesco Petrarca?', retro: '1304 ad Arezzo', categoria: 'Petrarca', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Petrarca?', retro: 'Il Canzoniere (366 componimenti)', categoria: 'Petrarca', difficolta: 1 },
    { fronte: 'Chi è Laura per Petrarca?', retro: 'La donna amata, vista per la prima volta il 6 aprile 1327', categoria: 'Petrarca', difficolta: 2 },
    { fronte: 'Cos\'è il "Secretum"?', retro: 'Dialogo interiore con Sant\'Agostino', categoria: 'Petrarca', difficolta: 2 },
    { fronte: 'Perché Petrarca è considerato padre dell\'Umanesimo?', retro: 'Riscoprì i classici latini e pose l\'uomo al centro', categoria: 'Petrarca', difficolta: 3 },
    
    // BOCCACCIO
    { fronte: 'Quando nacque Giovanni Boccaccio?', retro: '1313 a Certaldo', categoria: 'Boccaccio', difficolta: 1 },
    { fronte: 'Cos\'è il Decameron?', retro: '100 novelle raccontate da 10 giovani in 10 giorni durante la peste', categoria: 'Boccaccio', difficolta: 1 },
    { fronte: 'In che anno fu scritto il Decameron?', retro: '1349-1353, dopo la peste nera', categoria: 'Boccaccio', difficolta: 2 },
    { fronte: 'Quali sono i temi principali del Decameron?', retro: 'Amore, fortuna, ingegno, critica sociale', categoria: 'Boccaccio', difficolta: 2 },
    
    // MACHIAVELLI
    { fronte: 'Quando nacque Niccolò Machiavelli?', retro: '1469 a Firenze', categoria: 'Machiavelli', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Machiavelli?', retro: 'Il Principe (1513)', categoria: 'Machiavelli', difficolta: 1 },
    { fronte: 'Cosa significa "il fine giustifica i mezzi"?', retro: 'Il principe deve usare ogni mezzo per mantenere lo stato', categoria: 'Machiavelli', difficolta: 2 },
    { fronte: 'Cos\'è la "virtù" per Machiavelli?', retro: 'Capacità politica di dominare la fortuna', categoria: 'Machiavelli', difficolta: 3 },
    
    // ARIOSTO
    { fronte: 'Qual è l\'opera principale di Ariosto?', retro: 'Orlando Furioso (1532)', categoria: 'Ariosto', difficolta: 1 },
    { fronte: 'Di cosa parla l\'Orlando Furioso?', retro: 'Follia d\'amore di Orlando, avventure cavalleresche', categoria: 'Ariosto', difficolta: 2 },
    { fronte: 'Cos\'è l\'"entrelacement"?', retro: 'Tecnica narrativa di intreccio di storie parallele', categoria: 'Ariosto', difficolta: 3 },
    
    // TASSO
    { fronte: 'Qual è l\'opera principale di Tasso?', retro: 'Gerusalemme Liberata (1581)', categoria: 'Tasso', difficolta: 1 },
    { fronte: 'Di cosa parla la Gerusalemme Liberata?', retro: 'Prima crociata e conquista di Gerusalemme', categoria: 'Tasso', difficolta: 2 },
    
    // ILLUMINISMO
    { fronte: 'Chi scrisse "La locandiera"?', retro: 'Carlo Goldoni (1753)', categoria: 'Illuminismo', difficolta: 1 },
    { fronte: 'Cos\'è "Il Giorno" di Parini?', retro: 'Poemetto satirico sulla nobiltà milanese', categoria: 'Illuminismo', difficolta: 2 },
    { fronte: 'Quali sono le tragedie principali di Alfieri?', retro: 'Saul, Mirra', categoria: 'Illuminismo', difficolta: 2 },
    
    // FOSCOLO
    { fronte: 'Quando nacque Ugo Foscolo?', retro: '1778 a Zante (Grecia)', categoria: 'Foscolo', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Foscolo?', retro: 'I Sepolcri (1807)', categoria: 'Foscolo', difficolta: 1 },
    { fronte: 'Di cosa parlano "I Sepolcri"?', retro: 'Valore civile delle tombe, memoria dei grandi', categoria: 'Foscolo', difficolta: 2 },
    { fronte: 'Cos\'è "Le ultime lettere di Jacopo Ortis"?', retro: 'Romanzo epistolare sul suicidio di un patriota', categoria: 'Foscolo', difficolta: 2 },
    
    // MANZONI
    { fronte: 'Quando nacque Alessandro Manzoni?', retro: '1785 a Milano', categoria: 'Manzoni', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Manzoni?', retro: 'I Promessi Sposi (1827-1842)', categoria: 'Manzoni', difficolta: 1 },
    { fronte: 'Chi sono i protagonisti dei Promessi Sposi?', retro: 'Renzo Tramaglino e Lucia Mondella', categoria: 'Manzoni', difficolta: 1 },
    { fronte: 'In che epoca è ambientato il romanzo?', retro: 'Lombardia del 1628-1630, dominazione spagnola', categoria: 'Manzoni', difficolta: 2 },
    { fronte: 'Cos\'è la "Provvidenza" per Manzoni?', retro: 'Disegno divino che guida la storia verso il bene', categoria: 'Manzoni', difficolta: 3 },
    { fronte: 'Chi è Don Abbondio?', retro: 'Il curato pavido che rifiuta di sposare Renzo e Lucia', categoria: 'Manzoni', difficolta: 1 },
    
    // LEOPARDI
    { fronte: 'Quando nacque Giacomo Leopardi?', retro: '1798 a Recanati', categoria: 'Leopardi', difficolta: 1 },
    { fronte: 'Qual è l\'opera poetica principale di Leopardi?', retro: 'I Canti', categoria: 'Leopardi', difficolta: 1 },
    { fronte: 'Cos\'è "L\'Infinito"?', retro: 'Idillio sulla contemplazione dell\'infinito oltre la siepe', categoria: 'Leopardi', difficolta: 2 },
    { fronte: 'Cos\'è il "pessimismo cosmico"?', retro: 'La natura è matrigna, indifferente alla sofferenza umana', categoria: 'Leopardi', difficolta: 3 },
    { fronte: 'Cosa sono le "Operette morali"?', retro: 'Prose filosofiche satiriche (dialoghi)', categoria: 'Leopardi', difficolta: 2 },
    { fronte: 'Cos\'è lo "Zibaldone"?', retro: 'Diario di pensieri e riflessioni (1817-1832)', categoria: 'Leopardi', difficolta: 2 },
    
    // VERGA
    { fronte: 'Quando nacque Giovanni Verga?', retro: '1840 a Catania', categoria: 'Verga', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Verga?', retro: 'I Malavoglia (1881)', categoria: 'Verga', difficolta: 1 },
    { fronte: 'Cos\'è il Verismo?', retro: 'Corrente che rappresenta la realtà in modo oggettivo', categoria: 'Verga', difficolta: 2 },
    { fronte: 'Cos\'è la tecnica dell\'"impersonalità"?', retro: 'L\'autore scompare, la storia si racconta da sola', categoria: 'Verga', difficolta: 3 },
    { fronte: 'Cos\'è il "ciclo dei vinti"?', retro: 'Serie di romanzi sui perdenti del progresso', categoria: 'Verga', difficolta: 2 },
    
    // PASCOLI
    { fronte: 'Quando nacque Giovanni Pascoli?', retro: '1855 a San Mauro di Romagna', categoria: 'Pascoli', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Pascoli?', retro: 'Myricae (1891)', categoria: 'Pascoli', difficolta: 1 },
    { fronte: 'Cos\'è la poetica del "fanciullino"?', retro: 'Il poeta vede il mondo con stupore infantile', categoria: 'Pascoli', difficolta: 2 },
    { fronte: 'Cos\'è il "nido" per Pascoli?', retro: 'La famiglia come rifugio dal mondo ostile', categoria: 'Pascoli', difficolta: 2 },
    
    // D'ANNUNZIO
    { fronte: 'Quando nacque Gabriele D\'Annunzio?', retro: '1863 a Pescara', categoria: 'D\'Annunzio', difficolta: 1 },
    { fronte: 'Qual è il romanzo principale di D\'Annunzio?', retro: 'Il Piacere (1889)', categoria: 'D\'Annunzio', difficolta: 1 },
    { fronte: 'Cos\'è l\'"estetismo"?', retro: 'Culto della bellezza come valore supremo', categoria: 'D\'Annunzio', difficolta: 2 },
    { fronte: 'Cos\'è il "superuomo" dannunziano?', retro: 'Uomo superiore che domina le masse', categoria: 'D\'Annunzio', difficolta: 3 },
    
    // PIRANDELLO
    { fronte: 'Quando nacque Luigi Pirandello?', retro: '1867 ad Agrigento', categoria: 'Pirandello', difficolta: 1 },
    { fronte: 'Qual è il romanzo principale di Pirandello?', retro: 'Il fu Mattia Pascal (1904)', categoria: 'Pirandello', difficolta: 1 },
    { fronte: 'Cos\'è la "maschera" per Pirandello?', retro: 'Ruolo sociale che nasconde il vero io', categoria: 'Pirandello', difficolta: 2 },
    { fronte: 'Cos\'è "Sei personaggi in cerca d\'autore"?', retro: 'Opera teatrale metanarrativa (1921)', categoria: 'Pirandello', difficolta: 2 },
    { fronte: 'Cos\'è l\'"umorismo" pirandelliano?', retro: 'Sentimento del contrario: riso che diventa riflessione', categoria: 'Pirandello', difficolta: 3 },
    
    // SVEVO
    { fronte: 'Quando nacque Italo Svevo?', retro: '1861 a Trieste', categoria: 'Svevo', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Svevo?', retro: 'La coscienza di Zeno (1923)', categoria: 'Svevo', difficolta: 1 },
    { fronte: 'Cos\'è l\'"inettitudine"?', retro: 'Incapacità di agire e adattarsi alla vita', categoria: 'Svevo', difficolta: 2 },
    { fronte: 'Che ruolo ha la psicoanalisi in Svevo?', retro: 'Influenza di Freud nell\'analisi dell\'inconscio', categoria: 'Svevo', difficolta: 3 },
    
    // UNGARETTI
    { fronte: 'Quando nacque Giuseppe Ungaretti?', retro: '1888 ad Alessandria d\'Egitto', categoria: 'Ungaretti', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Ungaretti?', retro: 'L\'Allegria (1931)', categoria: 'Ungaretti', difficolta: 1 },
    { fronte: 'Cosa significa "M\'illumino d\'immenso"?', retro: 'Illuminazione improvvisa di fronte all\'infinito', categoria: 'Ungaretti', difficolta: 2 },
    { fronte: 'Cos\'è l\'Ermetismo?', retro: 'Poesia oscura, parola essenziale, analogia', categoria: 'Ungaretti', difficolta: 2 },
    
    // MONTALE
    { fronte: 'Quando nacque Eugenio Montale?', retro: '1896 a Genova', categoria: 'Montale', difficolta: 1 },
    { fronte: 'Qual è l\'opera principale di Montale?', retro: 'Ossi di seppia (1925)', categoria: 'Montale', difficolta: 1 },
    { fronte: 'Cos\'è il "male di vivere"?', retro: 'Condizione esistenziale di sofferenza e aridità', categoria: 'Montale', difficolta: 2 },
    { fronte: 'Cos\'è il "correlativo oggettivo"?', retro: 'Oggetto che esprime uno stato d\'animo', categoria: 'Montale', difficolta: 3 },
    
    // CALVINO
    { fronte: 'Quando nacque Italo Calvino?', retro: '1923 a Santiago de Las Vegas (Cuba)', categoria: 'Calvino', difficolta: 1 },
    { fronte: 'Quali sono le opere principali di Calvino?', retro: 'Il barone rampante, Se una notte d\'inverno un viaggiatore', categoria: 'Calvino', difficolta: 1 },
    { fronte: 'Cos\'è la "leggerezza" per Calvino?', retro: 'Valore letterario: sottrazione di peso alla narrazione', categoria: 'Calvino', difficolta: 3 }
  ],
  
  filosofia: [
    // SOCRATE
    { fronte: 'Qual è il metodo di Socrate?', retro: 'Maieutica: far "partorire" la verità attraverso domande', categoria: 'Socrate', difficolta: 2 },
    { fronte: 'Cosa significa "So di non sapere"?', retro: 'Consapevolezza dei propri limiti, inizio della saggezza', categoria: 'Socrate', difficolta: 2 },
    { fronte: 'Cos\'è l\'ironia socratica?', retro: 'Fingere ignoranza per smascherare la falsa sapienza', categoria: 'Socrate', difficolta: 2 },
    
    // PLATONE
    { fronte: 'Cos\'è la teoria delle Idee?', retro: 'Le Idee sono modelli perfetti ed eterni delle cose sensibili', categoria: 'Platone', difficolta: 2 },
    { fronte: 'Cos\'è il mito della caverna?', retro: 'Allegoria: prigionieri vedono ombre, il filosofo esce alla luce', categoria: 'Platone', difficolta: 2 },
    { fronte: 'Cos\'è l\'Iperuranio?', retro: 'Luogo sopraceleste dove risiedono le Idee', categoria: 'Platone', difficolta: 2 },
    { fronte: 'Quali sono le parti dell\'anima per Platone?', retro: 'Razionale (testa), irascibile (petto), concupiscibile (ventre)', categoria: 'Platone', difficolta: 3 },
    
    // ARISTOTELE
    { fronte: 'Cosa sono potenza e atto?', retro: 'Potenza: possibilità; Atto: realizzazione', categoria: 'Aristotele', difficolta: 2 },
    { fronte: 'Quali sono le quattro cause?', retro: 'Materiale, formale, efficiente, finale', categoria: 'Aristotele', difficolta: 2 },
    { fronte: 'Cos\'è l\'eudaimonia?', retro: 'Felicità come realizzazione delle proprie potenzialità', categoria: 'Aristotele', difficolta: 2 },
    { fronte: 'Cos\'è il sillogismo?', retro: 'Ragionamento deduttivo: premessa maggiore + minore = conclusione', categoria: 'Aristotele', difficolta: 3 },
    
    // CARTESIO
    { fronte: 'Cosa significa "Cogito ergo sum"?', retro: 'Penso dunque sono: certezza indubitabile dell\'io pensante', categoria: 'Cartesio', difficolta: 1 },
    { fronte: 'Cos\'è il dubbio metodico?', retro: 'Mettere in dubbio tutto per trovare certezze indubitabili', categoria: 'Cartesio', difficolta: 2 },
    { fronte: 'Cosa sono res cogitans e res extensa?', retro: 'Sostanza pensante (mente) e sostanza estesa (corpo)', categoria: 'Cartesio', difficolta: 2 },
    
    // KANT
    { fronte: 'Cos\'è la "rivoluzione copernicana" di Kant?', retro: 'Non la mente si adatta agli oggetti, ma gli oggetti alla mente', categoria: 'Kant', difficolta: 3 },
    { fronte: 'Cosa sono fenomeno e noumeno?', retro: 'Fenomeno: cosa come appare; Noumeno: cosa in sé, inconoscibile', categoria: 'Kant', difficolta: 2 },
    { fronte: 'Cos\'è l\'imperativo categorico?', retro: 'Agisci secondo una massima che possa diventare legge universale', categoria: 'Kant', difficolta: 2 },
    { fronte: 'Cosa sono i giudizi sintetici a priori?', retro: 'Giudizi che ampliano la conoscenza ma sono universali e necessari', categoria: 'Kant', difficolta: 3 },
    
    // HEGEL
    { fronte: 'Cos\'è la dialettica hegeliana?', retro: 'Tesi + Antitesi = Sintesi (superamento delle contraddizioni)', categoria: 'Hegel', difficolta: 2 },
    { fronte: 'Cosa significa "Ciò che è razionale è reale"?', retro: 'La realtà è manifestazione della Ragione/Spirito', categoria: 'Hegel', difficolta: 3 },
    { fronte: 'Cos\'è lo Spirito Assoluto?', retro: 'La totalità del reale che si realizza attraverso arte, religione, filosofia', categoria: 'Hegel', difficolta: 3 },
    
    // MARX
    { fronte: 'Cos\'è il materialismo storico?', retro: 'La storia è determinata dai rapporti economici di produzione', categoria: 'Marx', difficolta: 2 },
    { fronte: 'Cos\'è il plusvalore?', retro: 'Differenza tra valore prodotto dal lavoratore e salario ricevuto', categoria: 'Marx', difficolta: 2 },
    { fronte: 'Cos\'è l\'alienazione per Marx?', retro: 'Il lavoratore è estraneo al prodotto, al lavoro, a sé stesso', categoria: 'Marx', difficolta: 2 },
    { fronte: 'Cosa sono struttura e sovrastruttura?', retro: 'Struttura: economia; Sovrastruttura: politica, cultura, religione', categoria: 'Marx', difficolta: 3 },
    
    // NIETZSCHE
    { fronte: 'Cosa significa "Dio è morto"?', retro: 'Crollo dei valori tradizionali, nichilismo', categoria: 'Nietzsche', difficolta: 2 },
    { fronte: 'Cos\'è il superuomo (Übermensch)?', retro: 'Uomo che crea nuovi valori dopo la morte di Dio', categoria: 'Nietzsche', difficolta: 2 },
    { fronte: 'Cos\'è l\'eterno ritorno?', retro: 'Tutto ritorna eternamente: vivere come se ogni istante dovesse ripetersi', categoria: 'Nietzsche', difficolta: 3 },
    { fronte: 'Cos\'è la volontà di potenza?', retro: 'Impulso fondamentale alla crescita e all\'autoaffermazione', categoria: 'Nietzsche', difficolta: 3 },
    
    // ESISTENZIALISMO
    { fronte: 'Cosa significa "l\'esistenza precede l\'essenza"?', retro: 'L\'uomo prima esiste, poi si definisce attraverso le scelte', categoria: 'Sartre', difficolta: 2 },
    { fronte: 'Cos\'è la malafede per Sartre?', retro: 'Negare la propria libertà, fingere di non poter scegliere', categoria: 'Sartre', difficolta: 3 },
    { fronte: 'Cos\'è il Dasein per Heidegger?', retro: 'L\'esserci: l\'uomo come essere-nel-mondo', categoria: 'Heidegger', difficolta: 3 },
    { fronte: 'Cos\'è l\'essere-per-la-morte?', retro: 'La morte come possibilità più propria che dà senso all\'esistenza', categoria: 'Heidegger', difficolta: 3 }
  ],
  
  storia: [
    // RISORGIMENTO
    { fronte: 'Quando fu il Congresso di Vienna?', retro: '1814-1815', categoria: 'Risorgimento', difficolta: 1 },
    { fronte: 'Cos\'è la Restaurazione?', retro: 'Ritorno all\'ordine pre-napoleonico, legittimismo', categoria: 'Risorgimento', difficolta: 2 },
    { fronte: 'Chi fondò la Giovine Italia?', retro: 'Giuseppe Mazzini (1831)', categoria: 'Risorgimento', difficolta: 1 },
    { fronte: 'Quando fu la Spedizione dei Mille?', retro: '1860', categoria: 'Risorgimento', difficolta: 1 },
    { fronte: 'Quando fu proclamato il Regno d\'Italia?', retro: '17 marzo 1861', categoria: 'Risorgimento', difficolta: 1 },
    { fronte: 'Chi fu il primo re d\'Italia?', retro: 'Vittorio Emanuele II', categoria: 'Risorgimento', difficolta: 1 },
    { fronte: 'Quando Roma divenne capitale?', retro: '1871 (Breccia di Porta Pia: 1870)', categoria: 'Risorgimento', difficolta: 2 },
    
    // PRIMA GUERRA MONDIALE
    { fronte: 'Quando iniziò la Prima Guerra Mondiale?', retro: '28 luglio 1914', categoria: 'Prima Guerra Mondiale', difficolta: 1 },
    { fronte: 'Cosa scatenò la Prima Guerra Mondiale?', retro: 'Attentato di Sarajevo (28 giugno 1914)', categoria: 'Prima Guerra Mondiale', difficolta: 1 },
    { fronte: 'Quando entrò in guerra l\'Italia?', retro: '24 maggio 1915', categoria: 'Prima Guerra Mondiale', difficolta: 1 },
    { fronte: 'Cos\'era il Patto di Londra?', retro: 'Accordo segreto (1915) per l\'entrata in guerra dell\'Italia', categoria: 'Prima Guerra Mondiale', difficolta: 2 },
    { fronte: 'Quando fu la disfatta di Caporetto?', retro: '24 ottobre 1917', categoria: 'Prima Guerra Mondiale', difficolta: 2 },
    { fronte: 'Quando finì la Prima Guerra Mondiale?', retro: '11 novembre 1918', categoria: 'Prima Guerra Mondiale', difficolta: 1 },
    
    // FASCISMO
    { fronte: 'Quando fu la Marcia su Roma?', retro: '28 ottobre 1922', categoria: 'Fascismo', difficolta: 1 },
    { fronte: 'Quando furono le leggi fascistissime?', retro: '1925-1926', categoria: 'Fascismo', difficolta: 2 },
    { fronte: 'Quando furono i Patti Lateranensi?', retro: '11 febbraio 1929', categoria: 'Fascismo', difficolta: 2 },
    { fronte: 'Quando furono le leggi razziali?', retro: '1938', categoria: 'Fascismo', difficolta: 1 },
    
    // SECONDA GUERRA MONDIALE
    { fronte: 'Quando iniziò la Seconda Guerra Mondiale?', retro: '1 settembre 1939', categoria: 'Seconda Guerra Mondiale', difficolta: 1 },
    { fronte: 'Quando entrò in guerra l\'Italia?', retro: '10 giugno 1940', categoria: 'Seconda Guerra Mondiale', difficolta: 1 },
    { fronte: 'Quando fu l\'armistizio italiano?', retro: '8 settembre 1943', categoria: 'Seconda Guerra Mondiale', difficolta: 1 },
    { fronte: 'Quando fu la Liberazione?', retro: '25 aprile 1945', categoria: 'Seconda Guerra Mondiale', difficolta: 1 },
    { fronte: 'Quando finì la Seconda Guerra Mondiale in Europa?', retro: '8 maggio 1945', categoria: 'Seconda Guerra Mondiale', difficolta: 1 },
    
    // REPUBBLICA
    { fronte: 'Quando fu il referendum Repubblica/Monarchia?', retro: '2 giugno 1946', categoria: 'Repubblica', difficolta: 1 },
    { fronte: 'Quando entrò in vigore la Costituzione?', retro: '1 gennaio 1948', categoria: 'Repubblica', difficolta: 1 }
  ],
  
  matematica: [
    { fronte: 'Formula risolutiva equazione di 2° grado', retro: 'x = (-b ± √Δ) / 2a, dove Δ = b² - 4ac', categoria: 'Algebra', difficolta: 1 },
    { fronte: 'Prodotto notevole (a+b)²', retro: 'a² + 2ab + b²', categoria: 'Algebra', difficolta: 1 },
    { fronte: 'Prodotto notevole (a-b)²', retro: 'a² - 2ab + b²', categoria: 'Algebra', difficolta: 1 },
    { fronte: 'Prodotto notevole (a+b)(a-b)', retro: 'a² - b²', categoria: 'Algebra', difficolta: 1 },
    { fronte: 'Teorema di Pitagora', retro: 'a² + b² = c² (cateti e ipotenusa)', categoria: 'Geometria', difficolta: 1 },
    { fronte: 'Area del cerchio', retro: 'A = πr²', categoria: 'Geometria', difficolta: 1 },
    { fronte: 'Circonferenza', retro: 'C = 2πr', categoria: 'Geometria', difficolta: 1 },
    { fronte: 'Volume della sfera', retro: 'V = (4/3)πr³', categoria: 'Geometria', difficolta: 2 },
    { fronte: 'Derivata di xⁿ', retro: 'nxⁿ⁻¹', categoria: 'Analisi', difficolta: 2 },
    { fronte: 'Derivata di sin(x)', retro: 'cos(x)', categoria: 'Analisi', difficolta: 2 },
    { fronte: 'Derivata di cos(x)', retro: '-sin(x)', categoria: 'Analisi', difficolta: 2 },
    { fronte: 'Derivata di eˣ', retro: 'eˣ', categoria: 'Analisi', difficolta: 2 },
    { fronte: 'Derivata di ln(x)', retro: '1/x', categoria: 'Analisi', difficolta: 2 },
    { fronte: 'sin(30°)', retro: '1/2', categoria: 'Trigonometria', difficolta: 1 },
    { fronte: 'cos(60°)', retro: '1/2', categoria: 'Trigonometria', difficolta: 1 },
    { fronte: 'sin(45°)', retro: '√2/2', categoria: 'Trigonometria', difficolta: 1 },
    { fronte: 'Identità fondamentale trigonometria', retro: 'sin²x + cos²x = 1', categoria: 'Trigonometria', difficolta: 2 }
  ],
  
  fisica: [
    { fronte: 'Seconda legge di Newton', retro: 'F = ma (forza = massa × accelerazione)', categoria: 'Meccanica', difficolta: 1 },
    { fronte: 'Energia cinetica', retro: 'Ec = ½mv²', categoria: 'Meccanica', difficolta: 1 },
    { fronte: 'Energia potenziale gravitazionale', retro: 'Ep = mgh', categoria: 'Meccanica', difficolta: 1 },
    { fronte: 'Legge di gravitazione universale', retro: 'F = Gm₁m₂/r²', categoria: 'Gravitazione', difficolta: 2 },
    { fronte: 'Legge di Ohm', retro: 'V = IR (tensione = corrente × resistenza)', categoria: 'Elettricità', difficolta: 1 },
    { fronte: 'Potenza elettrica', retro: 'P = VI', categoria: 'Elettricità', difficolta: 1 },
    { fronte: 'Legge di Coulomb', retro: 'F = kq₁q₂/r²', categoria: 'Elettricità', difficolta: 2 },
    { fronte: 'Equazione di Einstein', retro: 'E = mc²', categoria: 'Relatività', difficolta: 1 },
    { fronte: 'Legge dei gas perfetti', retro: 'PV = nRT', categoria: 'Termodinamica', difficolta: 2 },
    { fronte: 'Primo principio termodinamica', retro: 'ΔU = Q - L', categoria: 'Termodinamica', difficolta: 2 }
  ],
  
  scienze: [
    { fronte: 'Funzione del DNA', retro: 'Conservare e trasmettere l\'informazione genetica', categoria: 'Genetica', difficolta: 1 },
    { fronte: 'Dove avviene la fotosintesi?', retro: 'Nei cloroplasti', categoria: 'Biologia', difficolta: 1 },
    { fronte: 'Formula della fotosintesi', retro: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', categoria: 'Biologia', difficolta: 2 },
    { fronte: 'Funzione dei mitocondri', retro: 'Produrre ATP (energia cellulare)', categoria: 'Biologia', difficolta: 1 },
    { fronte: 'Quanti cromosomi ha l\'uomo?', retro: '46 (23 coppie)', categoria: 'Genetica', difficolta: 1 },
    { fronte: 'Differenza mitosi/meiosi', retro: 'Mitosi: 2 cellule diploidi; Meiosi: 4 cellule aploidi', categoria: 'Genetica', difficolta: 2 },
    { fronte: 'Basi azotate del DNA', retro: 'Adenina, Timina, Citosina, Guanina (A-T, C-G)', categoria: 'Genetica', difficolta: 2 },
    { fronte: 'pH dell\'acqua pura', retro: '7 (neutro)', categoria: 'Chimica', difficolta: 1 },
    { fronte: 'Gas più abbondante nell\'atmosfera', retro: 'Azoto (N₂) - circa 78%', categoria: 'Chimica', difficolta: 1 }
  ],
  
  latino: [
    { fronte: 'Quante declinazioni ha il latino?', retro: '5 declinazioni', categoria: 'Grammatica', difficolta: 1 },
    { fronte: 'Quante coniugazioni ha il latino?', retro: '4 coniugazioni', categoria: 'Grammatica', difficolta: 1 },
    { fronte: 'Caso del complemento oggetto', retro: 'Accusativo', categoria: 'Grammatica', difficolta: 1 },
    { fronte: 'Caso del complemento di specificazione', retro: 'Genitivo', categoria: 'Grammatica', difficolta: 1 },
    { fronte: 'Traduzione "Carpe diem"', retro: 'Cogli l\'attimo (Orazio)', categoria: 'Citazioni', difficolta: 1 },
    { fronte: 'Traduzione "Cogito ergo sum"', retro: 'Penso dunque sono (Cartesio)', categoria: 'Citazioni', difficolta: 1 },
    { fronte: 'Opera principale di Virgilio', retro: 'Eneide', categoria: 'Letteratura', difficolta: 1 },
    { fronte: 'Opera principale di Cicerone', retro: 'Catilinarie, De Oratore', categoria: 'Letteratura', difficolta: 1 }
  ],
  
  arte: [
    { fronte: 'Chi dipinse la Gioconda?', retro: 'Leonardo da Vinci (1503-1519)', categoria: 'Rinascimento', difficolta: 1 },
    { fronte: 'Chi scolpì il David?', retro: 'Michelangelo (1501-1504)', categoria: 'Rinascimento', difficolta: 1 },
    { fronte: 'Chi dipinse la Cappella Sistina?', retro: 'Michelangelo (1508-1512)', categoria: 'Rinascimento', difficolta: 1 },
    { fronte: 'Chi dipinse la Scuola di Atene?', retro: 'Raffaello (1509-1511)', categoria: 'Rinascimento', difficolta: 1 },
    { fronte: 'Caratteristica principale del Caravaggio', retro: 'Uso drammatico della luce (chiaroscuro)', categoria: 'Barocco', difficolta: 2 },
    { fronte: 'Chi dipinse "Notte stellata"?', retro: 'Vincent van Gogh (1889)', categoria: 'Post-impressionismo', difficolta: 1 },
    { fronte: 'Chi dipinse "Guernica"?', retro: 'Pablo Picasso (1937)', categoria: 'Cubismo', difficolta: 1 },
    { fronte: 'Cos\'è l\'Impressionismo?', retro: 'Movimento che cattura la luce e l\'impressione del momento', categoria: 'Impressionismo', difficolta: 2 }
  ],
  
  inglese: [
    { fronte: 'Present Perfect structure', retro: 'have/has + past participle', categoria: 'Grammar', difficolta: 1 },
    { fronte: 'Second Conditional structure', retro: 'If + past simple, would + infinitive', categoria: 'Grammar', difficolta: 2 },
    { fronte: 'Third Conditional structure', retro: 'If + past perfect, would have + past participle', categoria: 'Grammar', difficolta: 2 },
    { fronte: 'Passive Voice structure', retro: 'be + past participle', categoria: 'Grammar', difficolta: 1 },
    { fronte: 'Who wrote "Hamlet"?', retro: 'William Shakespeare', categoria: 'Literature', difficolta: 1 },
    { fronte: 'Who wrote "1984"?', retro: 'George Orwell', categoria: 'Literature', difficolta: 1 },
    { fronte: 'Who wrote "Pride and Prejudice"?', retro: 'Jane Austen', categoria: 'Literature', difficolta: 1 }
  ],
  
  religione: [
    { fronte: 'Quanti sono i Vangeli canonici?', retro: '4 (Matteo, Marco, Luca, Giovanni)', categoria: 'Bibbia', difficolta: 1 },
    { fronte: 'Quanti sono i comandamenti?', retro: '10', categoria: 'Dottrina', difficolta: 1 },
    { fronte: 'Quanti sono i sacramenti?', retro: '7', categoria: 'Dottrina', difficolta: 1 },
    { fronte: 'Dove nacque Gesù?', retro: 'Betlemme', categoria: 'Vita di Gesù', difficolta: 1 },
    { fronte: 'Quanti sono gli apostoli?', retro: '12', categoria: 'Vita di Gesù', difficolta: 1 },
    { fronte: 'Chi fu il primo Papa?', retro: 'San Pietro', categoria: 'Chiesa', difficolta: 1 },
    { fronte: 'Cosa celebra la Pasqua?', retro: 'La resurrezione di Gesù', categoria: 'Feste', difficolta: 1 },
    { fronte: 'Cosa celebra la Pentecoste?', retro: 'La discesa dello Spirito Santo', categoria: 'Feste', difficolta: 2 }
  ]
};

// Genera flashcard per tutte le materie
function generaTutteFlashcard() {
  const tutteFlashcard = [];
  let totale = 0;
  
  for (const [materia, flashcards] of Object.entries(FLASHCARD_DATA)) {
    const flashcardMateria = flashcards.map((f, i) => ({
      id: `${materia}-${i + 1}`,
      fronte: f.fronte,
      retro: f.retro,
      materia: materia,
      categoria: f.categoria,
      difficolta: f.difficolta || 1,
      // Campi per spaced repetition
      intervallo: 1,
      ripetizioni: 0,
      facilita: 2.5,
      prossimaRevisione: new Date().toISOString()
    }));
    
    // Salva per materia
    fs.writeFileSync(
      path.join(outputDir, `flashcard-${materia}.json`),
      JSON.stringify({ materia, totale: flashcardMateria.length, flashcards: flashcardMateria }, null, 2)
    );
    
    tutteFlashcard.push(...flashcardMateria);
    console.log(`   ✓ ${materia}: ${flashcardMateria.length} flashcard`);
    totale += flashcardMateria.length;
  }
  
  // Salva tutte insieme
  fs.writeFileSync(
    path.join(outputDir, 'tutte-flashcard.json'),
    JSON.stringify({ totale: tutteFlashcard.length, generato: new Date().toISOString(), flashcards: tutteFlashcard }, null, 2)
  );
  
  return totale;
}

// MAIN
console.log('📚 Generazione flashcard...\n');
const totaleFlashcard = generaTutteFlashcard();

console.log('\n' + '═'.repeat(60));
console.log(`   ✅ GENERATE ${totaleFlashcard} FLASHCARD DI ALTA QUALITÀ`);
console.log('═'.repeat(60) + '\n');
