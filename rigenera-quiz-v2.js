/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GENERATORE QUIZ V2 - QUIZ DI ALTA QUALITÀ
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

// Importa contenuti
const contenuti = require('./src/data/contenuti-tutte-materie-complete');

// Directory output
const outputDir = path.join(__dirname, 'src', 'data', 'quiz-generati');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('   🎯 GENERATORE QUIZ V2 - ALTA QUALITÀ');
console.log('═══════════════════════════════════════════════════════════════\n');

// ============================================================
// KNOWLEDGE BASE - Dati strutturati per quiz precisi
// ============================================================

const AUTORI = {
  // MEDIOEVO E STILNOVO
  'Dante Alighieri': { nascita: 1265, morte: 1321, luogo: 'Firenze', opere: ['Divina Commedia', 'Vita Nova', 'Convivio', 'De vulgari eloquentia'], corrente: 'Stilnovo', temi: ['amore', 'viaggio', 'politica', 'fede'] },
  'Francesco Petrarca': { nascita: 1304, morte: 1374, luogo: 'Arezzo', opere: ['Canzoniere', 'Secretum', 'Trionfi', 'Africa'], corrente: 'Umanesimo', temi: ['amore', 'tempo', 'gloria', 'introspezione'] },
  'Giovanni Boccaccio': { nascita: 1313, morte: 1375, luogo: 'Certaldo', opere: ['Decameron', 'Filocolo', 'Filostrato', 'Elegia di Madonna Fiammetta'], corrente: 'Umanesimo', temi: ['amore', 'fortuna', 'ingegno', 'società'] },
  'Guido Cavalcanti': { nascita: 1255, morte: 1300, luogo: 'Firenze', opere: ['Rime', 'Donna me prega'], corrente: 'Stilnovo', temi: ['amore', 'morte', 'spiriti'] },
  'Cecco Angiolieri': { nascita: 1260, morte: 1312, luogo: 'Siena', opere: ['Rime', 'S\'i fosse foco'], corrente: 'Poesia comico-realistica', temi: ['parodia', 'denaro', 'vino'] },
  
  // RINASCIMENTO
  'Niccolò Machiavelli': { nascita: 1469, morte: 1527, luogo: 'Firenze', opere: ['Il Principe', 'Discorsi', 'La Mandragola', 'Arte della guerra'], corrente: 'Rinascimento', temi: ['politica', 'virtù', 'fortuna', 'stato'] },
  'Ludovico Ariosto': { nascita: 1474, morte: 1533, luogo: 'Reggio Emilia', opere: ['Orlando Furioso', 'Satire', 'La Cassaria', 'I Suppositi'], corrente: 'Rinascimento', temi: ['follia', 'amore', 'avventura', 'ironia'] },
  'Torquato Tasso': { nascita: 1544, morte: 1595, luogo: 'Sorrento', opere: ['Gerusalemme Liberata', 'Aminta', 'Rime', 'Gerusalemme Conquistata'], corrente: 'Manierismo', temi: ['crociata', 'amore', 'dovere', 'fede'] },
  'Pietro Bembo': { nascita: 1470, morte: 1547, luogo: 'Venezia', opere: ['Prose della volgar lingua', 'Gli Asolani', 'Rime'], corrente: 'Rinascimento', temi: ['lingua', 'amore', 'classicismo'] },
  'Baldassarre Castiglione': { nascita: 1478, morte: 1529, luogo: 'Casatico', opere: ['Il Cortegiano'], corrente: 'Rinascimento', temi: ['corte', 'grazia', 'sprezzatura'] },
  'Francesco Guicciardini': { nascita: 1483, morte: 1540, luogo: 'Firenze', opere: ['Storia d\'Italia', 'Ricordi'], corrente: 'Rinascimento', temi: ['storia', 'politica', 'particulare'] },
  
  // SEICENTO
  'Giambattista Marino': { nascita: 1569, morte: 1625, luogo: 'Napoli', opere: ['Adone', 'La Lira', 'La Galeria'], corrente: 'Barocco', temi: ['meraviglia', 'sensualità', 'virtuosismo'] },
  'Galileo Galilei': { nascita: 1564, morte: 1642, luogo: 'Pisa', opere: ['Dialogo sopra i due massimi sistemi', 'Il Saggiatore', 'Sidereus Nuncius'], corrente: 'Scienza', temi: ['scienza', 'ragione', 'esperimento'] },
  
  // SETTECENTO
  'Carlo Goldoni': { nascita: 1707, morte: 1793, luogo: 'Venezia', opere: ['La locandiera', 'I rusteghi', 'Le baruffe chiozzotte', 'Il servitore di due padroni'], corrente: 'Illuminismo', temi: ['commedia', 'borghesia', 'realismo'] },
  'Giuseppe Parini': { nascita: 1729, morte: 1799, luogo: 'Bosisio', opere: ['Il Giorno', 'Odi'], corrente: 'Illuminismo', temi: ['satira', 'nobiltà', 'virtù'] },
  'Vittorio Alfieri': { nascita: 1749, morte: 1803, luogo: 'Asti', opere: ['Saul', 'Mirra', 'Vita', 'Del principe e delle lettere'], corrente: 'Preromanticismo', temi: ['libertà', 'tirannide', 'eroismo'] },
  
  // OTTOCENTO
  'Ugo Foscolo': { nascita: 1778, morte: 1827, luogo: 'Zante', opere: ['I Sepolcri', 'Le ultime lettere di Jacopo Ortis', 'Le Grazie', 'Sonetti'], corrente: 'Preromanticismo', temi: ['morte', 'memoria', 'patria', 'esilio'] },
  'Alessandro Manzoni': { nascita: 1785, morte: 1873, luogo: 'Milano', opere: ['I Promessi Sposi', 'Adelchi', 'Il Conte di Carmagnola', 'Inni Sacri'], corrente: 'Romanticismo', temi: ['provvidenza', 'storia', 'umili', 'fede'] },
  'Giacomo Leopardi': { nascita: 1798, morte: 1837, luogo: 'Recanati', opere: ['Canti', 'Operette morali', 'Zibaldone', 'L\'Infinito'], corrente: 'Romanticismo', temi: ['pessimismo', 'natura', 'illusioni', 'noia'] },
  'Giosuè Carducci': { nascita: 1835, morte: 1907, luogo: 'Valdicastello', opere: ['Odi barbare', 'Rime nuove', 'Giambi ed Epodi'], corrente: 'Classicismo', temi: ['patria', 'storia', 'natura', 'classicità'] },
  'Giovanni Verga': { nascita: 1840, morte: 1922, luogo: 'Catania', opere: ['I Malavoglia', 'Mastro-don Gesualdo', 'Vita dei campi', 'Novelle rusticane'], corrente: 'Verismo', temi: ['roba', 'fatalismo', 'progresso', 'vinti'] },
  'Luigi Capuana': { nascita: 1839, morte: 1915, luogo: 'Mineo', opere: ['Giacinta', 'Il marchese di Roccaverdina'], corrente: 'Verismo', temi: ['psicologia', 'società', 'determinismo'] },
  'Federico De Roberto': { nascita: 1861, morte: 1927, luogo: 'Napoli', opere: ['I Viceré', 'L\'Imperio'], corrente: 'Verismo', temi: ['potere', 'famiglia', 'decadenza'] },
  
  // DECADENTISMO
  'Giovanni Pascoli': { nascita: 1855, morte: 1912, luogo: 'San Mauro', opere: ['Myricae', 'Canti di Castelvecchio', 'Poemetti', 'Poemi conviviali'], corrente: 'Decadentismo', temi: ['nido', 'fanciullino', 'morte', 'natura'] },
  'Gabriele D\'Annunzio': { nascita: 1863, morte: 1938, luogo: 'Pescara', opere: ['Il Piacere', 'Le Laudi', 'Notturno', 'Il fuoco', 'L\'innocente'], corrente: 'Decadentismo', temi: ['superuomo', 'estetismo', 'vitalismo', 'eros'] },
  
  // NOVECENTO
  'Luigi Pirandello': { nascita: 1867, morte: 1936, luogo: 'Agrigento', opere: ['Il fu Mattia Pascal', 'Uno, nessuno e centomila', 'Sei personaggi in cerca d\'autore', 'Enrico IV'], corrente: 'Novecento', temi: ['maschera', 'identità', 'follia', 'relatività'] },
  'Italo Svevo': { nascita: 1861, morte: 1928, luogo: 'Trieste', opere: ['La coscienza di Zeno', 'Senilità', 'Una vita'], corrente: 'Novecento', temi: ['inettitudine', 'malattia', 'psicoanalisi', 'tempo'] },
  'Giuseppe Ungaretti': { nascita: 1888, morte: 1970, luogo: 'Alessandria d\'Egitto', opere: ['L\'Allegria', 'Sentimento del Tempo', 'Il Dolore', 'Vita d\'un uomo'], corrente: 'Ermetismo', temi: ['guerra', 'parola', 'dolore', 'memoria'] },
  'Eugenio Montale': { nascita: 1896, morte: 1981, luogo: 'Genova', opere: ['Ossi di seppia', 'Le occasioni', 'La bufera e altro', 'Satura'], corrente: 'Ermetismo', temi: ['male di vivere', 'varco', 'memoria', 'oggetti'] },
  'Salvatore Quasimodo': { nascita: 1901, morte: 1968, luogo: 'Modica', opere: ['Ed è subito sera', 'Giorno dopo giorno', 'La vita non è sogno'], corrente: 'Ermetismo', temi: ['solitudine', 'guerra', 'impegno'] },
  'Umberto Saba': { nascita: 1883, morte: 1957, luogo: 'Trieste', opere: ['Il Canzoniere', 'Ernesto', 'Scorciatoie'], corrente: 'Novecento', temi: ['autobiografia', 'città', 'psicoanalisi'] },
  'Cesare Pavese': { nascita: 1908, morte: 1950, luogo: 'Santo Stefano Belbo', opere: ['La luna e i falò', 'Paesi tuoi', 'Il mestiere di vivere'], corrente: 'Neorealismo', temi: ['mito', 'campagna', 'solitudine', 'morte'] },
  'Elio Vittorini': { nascita: 1908, morte: 1966, luogo: 'Siracusa', opere: ['Conversazione in Sicilia', 'Uomini e no'], corrente: 'Neorealismo', temi: ['resistenza', 'popolo', 'impegno'] },
  'Italo Calvino': { nascita: 1923, morte: 1985, luogo: 'Santiago de Las Vegas', opere: ['Il sentiero dei nidi di ragno', 'Il barone rampante', 'Se una notte d\'inverno un viaggiatore', 'Le città invisibili'], corrente: 'Neorealismo', temi: ['fantasia', 'leggerezza', 'combinatoria'] },
  'Primo Levi': { nascita: 1919, morte: 1987, luogo: 'Torino', opere: ['Se questo è un uomo', 'La tregua', 'Il sistema periodico', 'I sommersi e i salvati'], corrente: 'Neorealismo', temi: ['shoah', 'memoria', 'testimonianza', 'chimica'] },
  'Alberto Moravia': { nascita: 1907, morte: 1990, luogo: 'Roma', opere: ['Gli indifferenti', 'La ciociara', 'La noia', 'Il conformista'], corrente: 'Neorealismo', temi: ['borghesia', 'alienazione', 'sesso', 'società'] },
  'Pier Paolo Pasolini': { nascita: 1922, morte: 1975, luogo: 'Bologna', opere: ['Ragazzi di vita', 'Una vita violenta', 'Scritti corsari', 'Petrolio'], corrente: 'Neorealismo', temi: ['sottoproletariato', 'critica sociale', 'omologazione'] },
  'Leonardo Sciascia': { nascita: 1921, morte: 1989, luogo: 'Racalmuto', opere: ['Il giorno della civetta', 'A ciascuno il suo', 'Todo modo'], corrente: 'Novecento', temi: ['mafia', 'giustizia', 'potere', 'Sicilia'] },
  'Dino Buzzati': { nascita: 1906, morte: 1972, luogo: 'Belluno', opere: ['Il deserto dei Tartari', 'Sessanta racconti', 'Un amore'], corrente: 'Novecento', temi: ['attesa', 'tempo', 'mistero', 'angoscia'] },
  'Elsa Morante': { nascita: 1912, morte: 1985, luogo: 'Roma', opere: ['La Storia', 'L\'isola di Arturo', 'Menzogna e sortilegio'], corrente: 'Novecento', temi: ['storia', 'infanzia', 'mito', 'amore'] },
  'Natalia Ginzburg': { nascita: 1916, morte: 1991, luogo: 'Palermo', opere: ['Lessico famigliare', 'Le voci della sera', 'Caro Michele'], corrente: 'Novecento', temi: ['famiglia', 'memoria', 'quotidiano'] }
};

const FILOSOFI = {
  // FILOSOFIA GRECA
  'Talete': { nascita: -624, morte: -546, luogo: 'Mileto', concetti: ['acqua come archè', 'naturalismo'], corrente: 'Presocratici' },
  'Anassimandro': { nascita: -610, morte: -546, luogo: 'Mileto', concetti: ['apeiron', 'infinito'], corrente: 'Presocratici' },
  'Pitagora': { nascita: -570, morte: -495, luogo: 'Samo', concetti: ['numero', 'armonia', 'metempsicosi'], corrente: 'Presocratici' },
  'Eraclito': { nascita: -535, morte: -475, luogo: 'Efeso', concetti: ['panta rei', 'logos', 'fuoco', 'divenire'], corrente: 'Presocratici' },
  'Parmenide': { nascita: -515, morte: -450, luogo: 'Elea', concetti: ['essere', 'non-essere', 'verità vs opinione'], corrente: 'Presocratici' },
  'Democrito': { nascita: -460, morte: -370, luogo: 'Abdera', concetti: ['atomi', 'vuoto', 'materialismo'], corrente: 'Presocratici' },
  'Socrate': { nascita: -470, morte: -399, luogo: 'Atene', concetti: ['maieutica', 'ironia socratica', 'so di non sapere', 'virtù è conoscenza'], corrente: 'Filosofia greca' },
  'Platone': { nascita: -428, morte: -348, luogo: 'Atene', concetti: ['idee', 'dualismo', 'reminiscenza', 'mito della caverna', 'Iperuranio'], corrente: 'Filosofia greca' },
  'Aristotele': { nascita: -384, morte: -322, luogo: 'Stagira', concetti: ['sostanza', 'potenza e atto', 'sillogismo', 'eudaimonia', 'quattro cause'], corrente: 'Filosofia greca' },
  'Epicuro': { nascita: -341, morte: -270, luogo: 'Samo', concetti: ['atarassia', 'piacere', 'tetrafarmaco', 'clinamen'], corrente: 'Ellenismo' },
  'Zenone di Cizio': { nascita: -334, morte: -262, luogo: 'Cizio', concetti: ['logos', 'apatia', 'vivere secondo natura'], corrente: 'Stoicismo' },
  'Seneca': { nascita: -4, morte: 65, luogo: 'Cordova', concetti: ['virtù', 'tempo', 'morte', 'saggezza'], corrente: 'Stoicismo romano' },
  'Marco Aurelio': { nascita: 121, morte: 180, luogo: 'Roma', concetti: ['meditazioni', 'dovere', 'logos'], corrente: 'Stoicismo romano' },
  
  // FILOSOFIA MEDIEVALE
  'Agostino': { nascita: 354, morte: 430, luogo: 'Tagaste', concetti: ['grazia', 'peccato originale', 'città di Dio', 'tempo'], corrente: 'Patristica' },
  'Tommaso d\'Aquino': { nascita: 1225, morte: 1274, luogo: 'Roccasecca', concetti: ['cinque vie', 'essenza ed esistenza', 'analogia entis'], corrente: 'Scolastica' },
  'Guglielmo di Ockham': { nascita: 1285, morte: 1347, luogo: 'Ockham', concetti: ['rasoio di Ockham', 'nominalismo'], corrente: 'Scolastica' },
  
  // FILOSOFIA MODERNA
  'Cartesio': { nascita: 1596, morte: 1650, luogo: 'La Haye', concetti: ['cogito ergo sum', 'dubbio metodico', 'res cogitans', 'res extensa', 'ghiandola pineale'], corrente: 'Razionalismo' },
  'Spinoza': { nascita: 1632, morte: 1677, luogo: 'Amsterdam', concetti: ['Deus sive Natura', 'sostanza unica', 'attributi', 'modi', 'conatus'], corrente: 'Razionalismo' },
  'Leibniz': { nascita: 1646, morte: 1716, luogo: 'Lipsia', concetti: ['monadi', 'armonia prestabilita', 'teodicea', 'migliore dei mondi possibili'], corrente: 'Razionalismo' },
  'Locke': { nascita: 1632, morte: 1704, luogo: 'Wrington', concetti: ['tabula rasa', 'idee semplici e complesse', 'contratto sociale', 'tolleranza'], corrente: 'Empirismo' },
  'Berkeley': { nascita: 1685, morte: 1753, luogo: 'Kilkenny', concetti: ['esse est percipi', 'immaterialismo'], corrente: 'Empirismo' },
  'Hume': { nascita: 1711, morte: 1776, luogo: 'Edimburgo', concetti: ['impressioni e idee', 'scetticismo', 'abitudine', 'critica causalità'], corrente: 'Empirismo' },
  'Rousseau': { nascita: 1712, morte: 1778, luogo: 'Ginevra', concetti: ['contratto sociale', 'volontà generale', 'buon selvaggio', 'stato di natura'], corrente: 'Illuminismo' },
  'Voltaire': { nascita: 1694, morte: 1778, luogo: 'Parigi', concetti: ['tolleranza', 'deismo', 'critica superstizione'], corrente: 'Illuminismo' },
  'Kant': { nascita: 1724, morte: 1804, luogo: 'Königsberg', concetti: ['a priori', 'noumeno', 'fenomeno', 'imperativo categorico', 'rivoluzione copernicana'], corrente: 'Criticismo' },
  
  // IDEALISMO TEDESCO
  'Fichte': { nascita: 1762, morte: 1814, luogo: 'Rammenau', concetti: ['Io assoluto', 'non-Io', 'dialettica'], corrente: 'Idealismo' },
  'Schelling': { nascita: 1775, morte: 1854, luogo: 'Leonberg', concetti: ['Assoluto', 'filosofia della natura', 'identità'], corrente: 'Idealismo' },
  'Hegel': { nascita: 1770, morte: 1831, luogo: 'Stoccarda', concetti: ['dialettica', 'spirito assoluto', 'Aufhebung', 'tesi-antitesi-sintesi', 'fenomenologia'], corrente: 'Idealismo' },
  
  // OTTOCENTO
  'Schopenhauer': { nascita: 1788, morte: 1860, luogo: 'Danzica', concetti: ['volontà', 'rappresentazione', 'pessimismo', 'noluntas', 'velo di Maya'], corrente: 'Irrazionalismo' },
  'Kierkegaard': { nascita: 1813, morte: 1855, luogo: 'Copenaghen', concetti: ['angoscia', 'singolo', 'stadi esistenza', 'salto della fede', 'aut-aut'], corrente: 'Esistenzialismo' },
  'Feuerbach': { nascita: 1804, morte: 1872, luogo: 'Landshut', concetti: ['alienazione religiosa', 'uomo come Dio', 'materialismo'], corrente: 'Sinistra hegeliana' },
  'Marx': { nascita: 1818, morte: 1883, luogo: 'Treviri', concetti: ['plusvalore', 'alienazione', 'lotta di classe', 'materialismo storico', 'struttura e sovrastruttura'], corrente: 'Marxismo' },
  'Comte': { nascita: 1798, morte: 1857, luogo: 'Montpellier', concetti: ['legge dei tre stadi', 'positivismo', 'sociologia'], corrente: 'Positivismo' },
  'Mill': { nascita: 1806, morte: 1873, luogo: 'Londra', concetti: ['utilitarismo', 'libertà', 'felicità'], corrente: 'Positivismo' },
  'Nietzsche': { nascita: 1844, morte: 1900, luogo: 'Röcken', concetti: ['superuomo', 'volontà di potenza', 'eterno ritorno', 'morte di Dio', 'trasvalutazione valori'], corrente: 'Nichilismo' },
  
  // NOVECENTO
  'Bergson': { nascita: 1859, morte: 1941, luogo: 'Parigi', concetti: ['durata', 'slancio vitale', 'intuizione'], corrente: 'Spiritualismo' },
  'Husserl': { nascita: 1859, morte: 1938, luogo: 'Prostějov', concetti: ['epoché', 'intenzionalità', 'riduzione fenomenologica', 'Lebenswelt'], corrente: 'Fenomenologia' },
  'Heidegger': { nascita: 1889, morte: 1976, luogo: 'Meßkirch', concetti: ['Dasein', 'essere-per-la-morte', 'angoscia', 'cura', 'essere-nel-mondo'], corrente: 'Esistenzialismo' },
  'Sartre': { nascita: 1905, morte: 1980, luogo: 'Parigi', concetti: ['esistenza precede essenza', 'libertà', 'malafede', 'nausea', 'per-sé e in-sé'], corrente: 'Esistenzialismo' },
  'Camus': { nascita: 1913, morte: 1960, luogo: 'Mondovi', concetti: ['assurdo', 'rivolta', 'Sisifo'], corrente: 'Esistenzialismo' },
  'Wittgenstein': { nascita: 1889, morte: 1951, luogo: 'Vienna', concetti: ['giochi linguistici', 'limiti del linguaggio', 'Tractatus'], corrente: 'Filosofia analitica' },
  'Popper': { nascita: 1902, morte: 1994, luogo: 'Vienna', concetti: ['falsificabilità', 'società aperta', 'congetture e confutazioni'], corrente: 'Epistemologia' },
  'Hannah Arendt': { nascita: 1906, morte: 1975, luogo: 'Hannover', concetti: ['banalità del male', 'vita activa', 'totalitarismo'], corrente: 'Filosofia politica' },
  'Foucault': { nascita: 1926, morte: 1984, luogo: 'Poitiers', concetti: ['potere', 'sapere', 'biopolitica', 'episteme'], corrente: 'Post-strutturalismo' },
  'Derrida': { nascita: 1930, morte: 2004, luogo: 'El-Biar', concetti: ['decostruzione', 'différance', 'logocentrismo'], corrente: 'Post-strutturalismo' }
};

const EVENTI_STORICI = {
  // RISORGIMENTO
  'Congresso di Vienna': { anno: 1815, luogo: 'Vienna', protagonisti: ['Metternich', 'Talleyrand', 'Castlereagh'], conseguenze: ['Restaurazione', 'Santa Alleanza', 'Equilibrio europeo'] },
  'Moti del 1820-21': { anno: 1820, luogo: 'Italia', protagonisti: ['Carbonari', 'Santorre di Santarosa'], conseguenze: ['Repressione austriaca', 'Esili'] },
  'Moti del 1830-31': { anno: 1831, luogo: 'Italia', protagonisti: ['Ciro Menotti', 'Mazzini'], conseguenze: ['Fondazione Giovine Italia', 'Repressione'] },
  'Prima guerra d\'indipendenza': { anno: 1848, luogo: 'Italia', protagonisti: ['Carlo Alberto', 'Radetzky'], conseguenze: ['Sconfitta Custoza', 'Statuto Albertino'] },
  'Repubblica Romana': { anno: 1849, luogo: 'Roma', protagonisti: ['Mazzini', 'Garibaldi', 'Mameli'], conseguenze: ['Intervento francese', 'Restaurazione papale'] },
  'Spedizione dei Mille': { anno: 1860, luogo: 'Sicilia', protagonisti: ['Garibaldi', 'Bixio', 'Crispi'], conseguenze: ['Conquista Sud', 'Unificazione'] },
  'Unità d\'Italia': { anno: 1861, luogo: 'Torino', protagonisti: ['Cavour', 'Garibaldi', 'Vittorio Emanuele II'], conseguenze: ['Regno d\'Italia', 'Questione romana'] },
  'Terza guerra d\'indipendenza': { anno: 1866, luogo: 'Veneto', protagonisti: ['La Marmora', 'Cialdini'], conseguenze: ['Annessione Veneto', 'Sconfitta Lissa'] },
  'Breccia di Porta Pia': { anno: 1870, luogo: 'Roma', protagonisti: ['Cadorna', 'Pio IX'], conseguenze: ['Roma capitale', 'Fine Stato Pontificio'] },
  
  // ITALIA LIBERALE
  'Destra storica': { anno: 1861, fine: 1876, protagonisti: ['Cavour', 'Ricasoli', 'Minghetti'], conseguenze: ['Pareggio bilancio', 'Questione meridionale'] },
  'Sinistra storica': { anno: 1876, fine: 1896, protagonisti: ['Depretis', 'Crispi'], conseguenze: ['Trasformismo', 'Colonialismo'] },
  'Crisi di fine secolo': { anno: 1898, luogo: 'Milano', protagonisti: ['Bava Beccaris', 'Umberto I'], conseguenze: ['Repressione', 'Regicidio 1900'] },
  'Età giolittiana': { anno: 1903, fine: 1914, protagonisti: ['Giolitti'], conseguenze: ['Suffragio universale', 'Guerra Libia'] },
  
  // PRIMA GUERRA MONDIALE
  'Attentato Sarajevo': { anno: 1914, luogo: 'Sarajevo', protagonisti: ['Francesco Ferdinando', 'Gavrilo Princip'], conseguenze: ['Scoppio guerra', 'Ultimatum Austria'] },
  'Entrata Italia in guerra': { anno: 1915, luogo: 'Italia', protagonisti: ['Salandra', 'Sonnino', 'D\'Annunzio'], conseguenze: ['Patto di Londra', 'Fronte italiano'] },
  'Battaglia di Caporetto': { anno: 1917, luogo: 'Caporetto', protagonisti: ['Cadorna', 'Diaz'], conseguenze: ['Ritirata', 'Cambio comando'] },
  'Vittoria Vittorio Veneto': { anno: 1918, luogo: 'Vittorio Veneto', protagonisti: ['Diaz', 'Armando Diaz'], conseguenze: ['Armistizio', 'Fine guerra'] },
  'Trattato di Versailles': { anno: 1919, luogo: 'Versailles', protagonisti: ['Wilson', 'Clemenceau', 'Orlando'], conseguenze: ['Società Nazioni', 'Vittoria mutilata'] },
  
  // FASCISMO
  'Biennio rosso': { anno: 1919, fine: 1920, protagonisti: ['Operai', 'Socialisti'], conseguenze: ['Occupazione fabbriche', 'Paura borghesia'] },
  'Marcia su Roma': { anno: 1922, luogo: 'Roma', protagonisti: ['Mussolini', 'Vittorio Emanuele III', 'Facta'], conseguenze: ['Fascismo al potere', 'Fine liberalismo'] },
  'Delitto Matteotti': { anno: 1924, luogo: 'Roma', protagonisti: ['Matteotti', 'Mussolini'], conseguenze: ['Aventino', 'Dittatura'] },
  'Leggi fascistissime': { anno: 1925, fine: 1926, protagonisti: ['Mussolini', 'Rocco'], conseguenze: ['Partito unico', 'OVRA'] },
  'Patti Lateranensi': { anno: 1929, luogo: 'Roma', protagonisti: ['Mussolini', 'Pio XI'], conseguenze: ['Conciliazione', 'Stato Vaticano'] },
  'Guerra d\'Etiopia': { anno: 1935, fine: 1936, protagonisti: ['Mussolini', 'Badoglio', 'Graziani'], conseguenze: ['Impero', 'Sanzioni'] },
  'Leggi razziali': { anno: 1938, luogo: 'Italia', protagonisti: ['Mussolini'], conseguenze: ['Persecuzione ebrei', 'Espulsioni'] },
  
  // SECONDA GUERRA MONDIALE
  'Invasione Polonia': { anno: 1939, luogo: 'Polonia', protagonisti: ['Hitler', 'Stalin'], conseguenze: ['Scoppio guerra', 'Spartizione'] },
  'Entrata Italia in guerra': { anno: 1940, luogo: 'Italia', protagonisti: ['Mussolini'], conseguenze: ['Asse Roma-Berlino', 'Campagna Grecia'] },
  'Sbarco in Sicilia': { anno: 1943, luogo: 'Sicilia', protagonisti: ['Eisenhower', 'Patton'], conseguenze: ['Caduta Mussolini', 'Armistizio'] },
  'Armistizio 8 settembre': { anno: 1943, luogo: 'Italia', protagonisti: ['Badoglio', 'Vittorio Emanuele III'], conseguenze: ['Occupazione tedesca', 'RSI'] },
  'Resistenza': { anno: 1943, fine: 1945, protagonisti: ['Partigiani', 'CLN', 'Pertini'], conseguenze: ['Liberazione', 'Costituzione'] },
  'Liberazione': { anno: 1945, luogo: 'Italia', protagonisti: ['Partigiani', 'Alleati'], conseguenze: ['Fine fascismo', '25 aprile'] },
  'Sbarco in Normandia': { anno: 1944, luogo: 'Normandia', protagonisti: ['Eisenhower', 'Montgomery'], conseguenze: ['Liberazione Francia', 'Fine nazismo'] },
  'Bomba atomica Hiroshima': { anno: 1945, luogo: 'Hiroshima', protagonisti: ['Truman', 'Oppenheimer'], conseguenze: ['Resa Giappone', 'Era atomica'] },
  
  // ITALIA REPUBBLICANA
  'Referendum Repubblica': { anno: 1946, luogo: 'Italia', protagonisti: ['De Gasperi', 'Togliatti', 'Nenni'], conseguenze: ['Repubblica', 'Esilio Savoia'] },
  'Costituzione italiana': { anno: 1948, luogo: 'Italia', protagonisti: ['Assemblea Costituente', 'De Nicola'], conseguenze: ['Carta costituzionale', 'Democrazia'] },
  'Elezioni 1948': { anno: 1948, luogo: 'Italia', protagonisti: ['De Gasperi', 'Togliatti'], conseguenze: ['Vittoria DC', 'Centrismo'] },
  'Miracolo economico': { anno: 1958, fine: 1963, protagonisti: ['Fanfani', 'Mattei'], conseguenze: ['Boom industriale', 'Emigrazione interna'] },
  'Centro-sinistra': { anno: 1963, luogo: 'Italia', protagonisti: ['Moro', 'Nenni'], conseguenze: ['Riforme', 'Nazionalizzazione elettricità'] },
  'Sessantotto': { anno: 1968, luogo: 'Italia', protagonisti: ['Studenti', 'Operai'], conseguenze: ['Contestazione', 'Autunno caldo'] },
  'Strage Piazza Fontana': { anno: 1969, luogo: 'Milano', protagonisti: ['Terroristi', 'Pinelli'], conseguenze: ['Strategia tensione', 'Anni di piombo'] },
  'Compromesso storico': { anno: 1976, luogo: 'Italia', protagonisti: ['Berlinguer', 'Moro'], conseguenze: ['Governi solidarietà', 'Rapimento Moro'] },
  'Rapimento Moro': { anno: 1978, luogo: 'Roma', protagonisti: ['Moro', 'BR'], conseguenze: ['Assassinio', 'Fine compromesso'] },
  'Caduta Muro Berlino': { anno: 1989, luogo: 'Berlino', protagonisti: ['Gorbaciov', 'Kohl'], conseguenze: ['Fine Guerra Fredda', 'Riunificazione'] },
  'Tangentopoli': { anno: 1992, luogo: 'Milano', protagonisti: ['Di Pietro', 'Craxi'], conseguenze: ['Fine Prima Repubblica', 'Nuovi partiti'] }
};

const FORMULE_FISICHE = {
  // MECCANICA
  'Seconda legge di Newton': { formula: 'F = ma', grandezze: ['forza', 'massa', 'accelerazione'], unità: ['N', 'kg', 'm/s²'], argomento: 'Meccanica' },
  'Energia cinetica': { formula: 'Ec = ½mv²', grandezze: ['energia', 'massa', 'velocità'], unità: ['J', 'kg', 'm/s'], argomento: 'Meccanica' },
  'Energia potenziale gravitazionale': { formula: 'Ep = mgh', grandezze: ['energia', 'massa', 'altezza'], unità: ['J', 'kg', 'm'], argomento: 'Meccanica' },
  'Quantità di moto': { formula: 'p = mv', grandezze: ['quantità di moto', 'massa', 'velocità'], unità: ['kg·m/s', 'kg', 'm/s'], argomento: 'Meccanica' },
  'Lavoro': { formula: 'L = F·s·cosθ', grandezze: ['lavoro', 'forza', 'spostamento'], unità: ['J', 'N', 'm'], argomento: 'Meccanica' },
  'Potenza': { formula: 'P = L/t', grandezze: ['potenza', 'lavoro', 'tempo'], unità: ['W', 'J', 's'], argomento: 'Meccanica' },
  'Velocità angolare': { formula: 'ω = Δθ/Δt', grandezze: ['velocità angolare', 'angolo', 'tempo'], unità: ['rad/s', 'rad', 's'], argomento: 'Meccanica' },
  'Accelerazione centripeta': { formula: 'ac = v²/r', grandezze: ['accelerazione', 'velocità', 'raggio'], unità: ['m/s²', 'm/s', 'm'], argomento: 'Meccanica' },
  'Periodo pendolo': { formula: 'T = 2π√(l/g)', grandezze: ['periodo', 'lunghezza', 'gravità'], unità: ['s', 'm', 'm/s²'], argomento: 'Meccanica' },
  'Legge gravitazione universale': { formula: 'F = Gm₁m₂/r²', grandezze: ['forza', 'masse', 'distanza'], unità: ['N', 'kg', 'm'], argomento: 'Gravitazione' },
  
  // TERMODINAMICA
  'Primo principio termodinamica': { formula: 'ΔU = Q - L', grandezze: ['energia interna', 'calore', 'lavoro'], unità: ['J', 'J', 'J'], argomento: 'Termodinamica' },
  'Legge gas perfetti': { formula: 'PV = nRT', grandezze: ['pressione', 'volume', 'temperatura'], unità: ['Pa', 'm³', 'K'], argomento: 'Termodinamica' },
  'Calore specifico': { formula: 'Q = mcΔT', grandezze: ['calore', 'massa', 'temperatura'], unità: ['J', 'kg', 'K'], argomento: 'Termodinamica' },
  'Rendimento macchina termica': { formula: 'η = L/Q₁', grandezze: ['rendimento', 'lavoro', 'calore'], unità: ['%', 'J', 'J'], argomento: 'Termodinamica' },
  
  // ELETTROMAGNETISMO
  'Legge di Ohm': { formula: 'V = IR', grandezze: ['tensione', 'corrente', 'resistenza'], unità: ['V', 'A', 'Ω'], argomento: 'Elettricità' },
  'Potenza elettrica': { formula: 'P = VI', grandezze: ['potenza', 'tensione', 'corrente'], unità: ['W', 'V', 'A'], argomento: 'Elettricità' },
  'Legge di Coulomb': { formula: 'F = kq₁q₂/r²', grandezze: ['forza', 'cariche', 'distanza'], unità: ['N', 'C', 'm'], argomento: 'Elettricità' },
  'Campo elettrico': { formula: 'E = F/q', grandezze: ['campo elettrico', 'forza', 'carica'], unità: ['N/C', 'N', 'C'], argomento: 'Elettricità' },
  'Capacità condensatore': { formula: 'C = Q/V', grandezze: ['capacità', 'carica', 'tensione'], unità: ['F', 'C', 'V'], argomento: 'Elettricità' },
  'Forza di Lorentz': { formula: 'F = qvB', grandezze: ['forza', 'carica', 'velocità', 'campo magnetico'], unità: ['N', 'C', 'm/s', 'T'], argomento: 'Magnetismo' },
  'Legge di Faraday': { formula: 'fem = -dΦ/dt', grandezze: ['forza elettromotrice', 'flusso magnetico', 'tempo'], unità: ['V', 'Wb', 's'], argomento: 'Magnetismo' },
  
  // ONDE E OTTICA
  'Velocità onda': { formula: 'v = λf', grandezze: ['velocità', 'lunghezza d\'onda', 'frequenza'], unità: ['m/s', 'm', 'Hz'], argomento: 'Onde' },
  'Legge rifrazione (Snell)': { formula: 'n₁sinθ₁ = n₂sinθ₂', grandezze: ['indice rifrazione', 'angolo'], unità: ['adimensionale', 'gradi'], argomento: 'Ottica' },
  'Equazione lenti sottili': { formula: '1/f = 1/p + 1/q', grandezze: ['focale', 'distanza oggetto', 'distanza immagine'], unità: ['m', 'm', 'm'], argomento: 'Ottica' },
  
  // RELATIVITÀ E QUANTISTICA
  'Equazione di Einstein': { formula: 'E = mc²', grandezze: ['energia', 'massa', 'velocità luce'], unità: ['J', 'kg', 'm/s'], argomento: 'Relatività' },
  'Dilatazione temporale': { formula: 'Δt\' = γΔt', grandezze: ['tempo dilatato', 'fattore Lorentz', 'tempo proprio'], unità: ['s', 'adimensionale', 's'], argomento: 'Relatività' },
  'Energia fotone': { formula: 'E = hf', grandezze: ['energia', 'costante Planck', 'frequenza'], unità: ['J', 'J·s', 'Hz'], argomento: 'Quantistica' },
  'Principio indeterminazione': { formula: 'ΔxΔp ≥ ℏ/2', grandezze: ['posizione', 'quantità di moto'], unità: ['m', 'kg·m/s'], argomento: 'Quantistica' }
};

// ============================================================
// GENERATORI QUIZ PER TIPO
// ============================================================

function generaQuizAutori() {
  const quiz = [];
  
  for (const [nome, info] of Object.entries(AUTORI)) {
    // Quiz nascita
    quiz.push({
      tipo: 'multipla',
      domanda: `In quale anno nacque ${nome}?`,
      rispostaCorretta: String(info.nascita),
      opzioni: shuffleArray([String(info.nascita), String(info.nascita - 5), String(info.nascita + 3), String(info.nascita - 8)]),
      spiegazione: `${nome} nacque nel ${info.nascita} a ${info.luogo}.`,
      livello: 'base',
      argomento: info.corrente,
      materia: 'italiano'
    });
    
    // Quiz morte
    quiz.push({
      tipo: 'multipla',
      domanda: `In quale anno morì ${nome}?`,
      rispostaCorretta: String(info.morte),
      opzioni: shuffleArray([String(info.morte), String(info.morte - 4), String(info.morte + 6), String(info.morte - 10)]),
      spiegazione: `${nome} morì nel ${info.morte}.`,
      livello: 'base',
      argomento: info.corrente,
      materia: 'italiano'
    });
    
    // Quiz luogo nascita
    const altriLuoghi = Object.values(AUTORI).map(a => a.luogo).filter(l => l !== info.luogo).slice(0, 3);
    quiz.push({
      tipo: 'multipla',
      domanda: `Dove nacque ${nome}?`,
      rispostaCorretta: info.luogo,
      opzioni: shuffleArray([info.luogo, ...altriLuoghi]),
      spiegazione: `${nome} nacque a ${info.luogo} nel ${info.nascita}.`,
      livello: 'base',
      argomento: info.corrente,
      materia: 'italiano'
    });
    
    // Quiz opere
    if (info.opere.length > 0) {
      const operaPrincipale = info.opere[0];
      const altreOpere = Object.values(AUTORI)
        .flatMap(a => a.opere)
        .filter(o => !info.opere.includes(o))
        .slice(0, 3);
      
      quiz.push({
        tipo: 'multipla',
        domanda: `Quale tra queste è un'opera di ${nome}?`,
        rispostaCorretta: operaPrincipale,
        opzioni: shuffleArray([operaPrincipale, ...altreOpere]),
        spiegazione: `"${operaPrincipale}" è una delle opere principali di ${nome}.`,
        livello: 'intermedio',
        argomento: info.corrente,
        materia: 'italiano'
      });
      
      // Quiz autore dell'opera
      quiz.push({
        tipo: 'multipla',
        domanda: `Chi è l'autore di "${operaPrincipale}"?`,
        rispostaCorretta: nome,
        opzioni: shuffleArray([nome, ...Object.keys(AUTORI).filter(n => n !== nome).slice(0, 3)]),
        spiegazione: `"${operaPrincipale}" fu scritta da ${nome}.`,
        livello: 'base',
        argomento: info.corrente,
        materia: 'italiano'
      });
    }
    
    // Quiz corrente letteraria
    const altreCorrenti = [...new Set(Object.values(AUTORI).map(a => a.corrente))].filter(c => c !== info.corrente).slice(0, 3);
    quiz.push({
      tipo: 'multipla',
      domanda: `A quale corrente letteraria appartiene ${nome}?`,
      rispostaCorretta: info.corrente,
      opzioni: shuffleArray([info.corrente, ...altreCorrenti]),
      spiegazione: `${nome} è uno dei principali esponenti del ${info.corrente}.`,
      livello: 'intermedio',
      argomento: info.corrente,
      materia: 'italiano'
    });
  }
  
  return quiz;
}

function generaQuizFilosofi() {
  const quiz = [];
  
  for (const [nome, info] of Object.entries(FILOSOFI)) {
    // Quiz nascita (solo per filosofi con date positive)
    if (info.nascita > 0) {
      quiz.push({
        tipo: 'multipla',
        domanda: `In quale anno nacque ${nome}?`,
        rispostaCorretta: String(info.nascita),
        opzioni: shuffleArray([String(info.nascita), String(info.nascita - 10), String(info.nascita + 8), String(info.nascita - 15)]),
        spiegazione: `${nome} nacque nel ${info.nascita} a ${info.luogo}.`,
        livello: 'base',
        argomento: info.corrente,
        materia: 'filosofia'
      });
    }
    
    // Quiz concetti
    if (info.concetti.length > 0) {
      const concettoPrincipale = info.concetti[0];
      const altriConcetti = Object.values(FILOSOFI)
        .flatMap(f => f.concetti)
        .filter(c => !info.concetti.includes(c))
        .slice(0, 3);
      
      quiz.push({
        tipo: 'multipla',
        domanda: `Quale concetto è associato a ${nome}?`,
        rispostaCorretta: concettoPrincipale,
        opzioni: shuffleArray([concettoPrincipale, ...altriConcetti]),
        spiegazione: `Il concetto di "${concettoPrincipale}" è centrale nel pensiero di ${nome}.`,
        livello: 'intermedio',
        argomento: info.corrente,
        materia: 'filosofia'
      });
      
      // Quiz filosofo del concetto
      quiz.push({
        tipo: 'multipla',
        domanda: `A quale filosofo è associato il concetto di "${concettoPrincipale}"?`,
        rispostaCorretta: nome,
        opzioni: shuffleArray([nome, ...Object.keys(FILOSOFI).filter(n => n !== nome).slice(0, 3)]),
        spiegazione: `"${concettoPrincipale}" è un concetto fondamentale di ${nome}.`,
        livello: 'intermedio',
        argomento: info.corrente,
        materia: 'filosofia'
      });
    }
    
    // Quiz corrente filosofica
    const altreCorrenti = [...new Set(Object.values(FILOSOFI).map(f => f.corrente))].filter(c => c !== info.corrente).slice(0, 3);
    quiz.push({
      tipo: 'multipla',
      domanda: `A quale corrente filosofica appartiene ${nome}?`,
      rispostaCorretta: info.corrente,
      opzioni: shuffleArray([info.corrente, ...altreCorrenti]),
      spiegazione: `${nome} è uno dei principali esponenti del ${info.corrente}.`,
      livello: 'base',
      argomento: info.corrente,
      materia: 'filosofia'
    });
  }
  
  return quiz;
}

function generaQuizStoria() {
  const quiz = [];
  
  for (const [nome, info] of Object.entries(EVENTI_STORICI)) {
    // Quiz anno
    quiz.push({
      tipo: 'multipla',
      domanda: `In quale anno avvenne ${nome}?`,
      rispostaCorretta: String(info.anno),
      opzioni: shuffleArray([String(info.anno), String(info.anno - 5), String(info.anno + 3), String(info.anno - 10)]),
      spiegazione: `${nome} avvenne nel ${info.anno}.`,
      livello: 'base',
      argomento: 'Storia contemporanea',
      materia: 'storia'
    });
    
    // Quiz protagonisti
    if (info.protagonisti && info.protagonisti.length > 0) {
      const protagonista = info.protagonisti[0];
      const altriProtagonisti = Object.values(EVENTI_STORICI)
        .flatMap(e => e.protagonisti || [])
        .filter(p => !info.protagonisti.includes(p))
        .slice(0, 3);
      
      quiz.push({
        tipo: 'multipla',
        domanda: `Chi fu uno dei protagonisti di ${nome}?`,
        rispostaCorretta: protagonista,
        opzioni: shuffleArray([protagonista, ...altriProtagonisti]),
        spiegazione: `${protagonista} fu uno dei protagonisti di ${nome} (${info.anno}).`,
        livello: 'intermedio',
        argomento: 'Storia contemporanea',
        materia: 'storia'
      });
    }
    
    // Quiz conseguenze
    if (info.conseguenze && info.conseguenze.length > 0) {
      const conseguenza = info.conseguenze[0];
      const altreConseguenze = Object.values(EVENTI_STORICI)
        .flatMap(e => e.conseguenze || [])
        .filter(c => !info.conseguenze.includes(c))
        .slice(0, 3);
      
      quiz.push({
        tipo: 'multipla',
        domanda: `Quale fu una conseguenza di ${nome}?`,
        rispostaCorretta: conseguenza,
        opzioni: shuffleArray([conseguenza, ...altreConseguenze]),
        spiegazione: `${conseguenza} fu una delle conseguenze di ${nome}.`,
        livello: 'avanzato',
        argomento: 'Storia contemporanea',
        materia: 'storia'
      });
    }
  }
  
  return quiz;
}

function generaQuizFisica() {
  const quiz = [];
  
  for (const [nome, info] of Object.entries(FORMULE_FISICHE)) {
    const argomento = info.argomento || 'Fisica';
    
    // Quiz formula
    const altreFormule = Object.values(FORMULE_FISICHE).map(f => f.formula).filter(f => f !== info.formula).slice(0, 3);
    quiz.push({
      tipo: 'multipla',
      domanda: `Qual è la formula della ${nome}?`,
      rispostaCorretta: info.formula,
      opzioni: shuffleArray([info.formula, ...altreFormule]),
      spiegazione: `La ${nome} si esprime con la formula ${info.formula}.`,
      livello: 'base',
      argomento: argomento,
      materia: 'fisica'
    });
    
    // Quiz nome della formula
    quiz.push({
      tipo: 'multipla',
      domanda: `A quale legge corrisponde la formula ${info.formula}?`,
      rispostaCorretta: nome,
      opzioni: shuffleArray([nome, ...Object.keys(FORMULE_FISICHE).filter(n => n !== nome).slice(0, 3)]),
      spiegazione: `La formula ${info.formula} rappresenta la ${nome}.`,
      livello: 'intermedio',
      argomento: 'Fisica',
      materia: 'fisica'
    });
    
    // Quiz grandezze
    if (info.grandezze.length > 0) {
      const grandezza = info.grandezze[0];
      const altreGrandezze = ['temperatura', 'pressione', 'volume', 'frequenza', 'lunghezza d\'onda'].filter(g => !info.grandezze.includes(g)).slice(0, 3);
      quiz.push({
        tipo: 'multipla',
        domanda: `Quale grandezza compare nella ${nome}?`,
        rispostaCorretta: grandezza,
        opzioni: shuffleArray([grandezza, ...altreGrandezze]),
        spiegazione: `La ${nome} (${info.formula}) include la grandezza ${grandezza}.`,
        livello: 'intermedio',
        argomento: 'Fisica',
        materia: 'fisica'
      });
    }
  }
  
  return quiz;
}

function generaQuizMatematica() {
  const quiz = [];
  
  // ALGEBRA
  const algebra = [
    { domanda: 'Qual è la formula risolutiva dell\'equazione di secondo grado?', risposta: 'x = (-b ± √Δ) / 2a', opzioni: ['x = (-b ± √Δ) / 2a', 'x = -b / 2a', 'x = b² - 4ac', 'x = a + b'], argomento: 'Algebra' },
    { domanda: 'Cosa rappresenta il discriminante Δ?', risposta: 'b² - 4ac', opzioni: ['b² - 4ac', 'b² + 4ac', '2ab', 'a² + b²'], argomento: 'Algebra' },
    { domanda: 'Se Δ > 0, quante soluzioni reali ha l\'equazione?', risposta: 'Due distinte', opzioni: ['Due distinte', 'Una', 'Nessuna', 'Infinite'], argomento: 'Algebra' },
    { domanda: 'Se Δ = 0, quante soluzioni reali ha l\'equazione?', risposta: 'Una (doppia)', opzioni: ['Una (doppia)', 'Due', 'Nessuna', 'Infinite'], argomento: 'Algebra' },
    { domanda: 'Se Δ < 0, quante soluzioni reali ha l\'equazione?', risposta: 'Nessuna', opzioni: ['Nessuna', 'Due', 'Una', 'Infinite'], argomento: 'Algebra' },
    { domanda: 'Qual è il prodotto notevole (a+b)²?', risposta: 'a² + 2ab + b²', opzioni: ['a² + 2ab + b²', 'a² + b²', 'a² - b²', '2ab'], argomento: 'Algebra' },
    { domanda: 'Qual è il prodotto notevole (a-b)²?', risposta: 'a² - 2ab + b²', opzioni: ['a² - 2ab + b²', 'a² + b²', 'a² - b²', '-2ab'], argomento: 'Algebra' },
    { domanda: 'Qual è il prodotto notevole (a+b)(a-b)?', risposta: 'a² - b²', opzioni: ['a² - b²', 'a² + b²', 'a² + 2ab + b²', '2ab'], argomento: 'Algebra' },
    { domanda: 'Come si scompone a³ + b³?', risposta: '(a+b)(a² - ab + b²)', opzioni: ['(a+b)(a² - ab + b²)', '(a+b)³', '(a-b)(a² + ab + b²)', 'a²b + ab²'], argomento: 'Algebra' },
    { domanda: 'Come si scompone a³ - b³?', risposta: '(a-b)(a² + ab + b²)', opzioni: ['(a-b)(a² + ab + b²)', '(a-b)³', '(a+b)(a² - ab + b²)', 'a²b - ab²'], argomento: 'Algebra' },
    { domanda: 'Qual è la proprietà commutativa della somma?', risposta: 'a + b = b + a', opzioni: ['a + b = b + a', 'a × b = b × a', '(a + b) + c = a + (b + c)', 'a × 1 = a'], argomento: 'Algebra' },
    { domanda: 'Qual è la proprietà associativa?', risposta: '(a + b) + c = a + (b + c)', opzioni: ['(a + b) + c = a + (b + c)', 'a + b = b + a', 'a × 0 = 0', 'a + 0 = a'], argomento: 'Algebra' },
    { domanda: 'Qual è la proprietà distributiva?', risposta: 'a(b + c) = ab + ac', opzioni: ['a(b + c) = ab + ac', 'a + b = b + a', 'a × b = b × a', 'a + 0 = a'], argomento: 'Algebra' }
  ];
  
  algebra.forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `La risposta corretta è: ${q.risposta}.`,
      livello: 'base',
      argomento: q.argomento,
      materia: 'matematica'
    });
  });
  
  // GEOMETRIA
  const geometria = [
    { domanda: 'Qual è la formula dell\'area del cerchio?', risposta: 'πr²', opzioni: ['πr²', '2πr', 'πd', 'r²'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula della circonferenza?', risposta: '2πr', opzioni: ['2πr', 'πr²', 'πd²', 'r²'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula dell\'area del triangolo?', risposta: '(base × altezza) / 2', opzioni: ['(base × altezza) / 2', 'base × altezza', 'base + altezza', 'base²'], argomento: 'Geometria' },
    { domanda: 'Qual è il teorema di Pitagora?', risposta: 'a² + b² = c²', opzioni: ['a² + b² = c²', 'a + b = c', 'a² = b² + c²', 'a × b = c'], argomento: 'Geometria' },
    { domanda: 'Quanto vale la somma degli angoli interni di un triangolo?', risposta: '180°', opzioni: ['180°', '360°', '90°', '270°'], argomento: 'Geometria' },
    { domanda: 'Quanto vale la somma degli angoli interni di un quadrilatero?', risposta: '360°', opzioni: ['360°', '180°', '540°', '270°'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula del volume della sfera?', risposta: '(4/3)πr³', opzioni: ['(4/3)πr³', '4πr²', 'πr³', '(4/3)πr²'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula della superficie della sfera?', risposta: '4πr²', opzioni: ['4πr²', '(4/3)πr³', 'πr²', '2πr²'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula del volume del cilindro?', risposta: 'πr²h', opzioni: ['πr²h', '2πrh', 'πr²', '(1/3)πr²h'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula del volume del cono?', risposta: '(1/3)πr²h', opzioni: ['(1/3)πr²h', 'πr²h', 'πrh', '(1/2)πr²h'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula dell\'area del rettangolo?', risposta: 'base × altezza', opzioni: ['base × altezza', '(base × altezza) / 2', '2(base + altezza)', 'base²'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula del perimetro del rettangolo?', risposta: '2(base + altezza)', opzioni: ['2(base + altezza)', 'base × altezza', 'base + altezza', '4 × lato'], argomento: 'Geometria' },
    { domanda: 'Qual è la formula dell\'area del quadrato?', risposta: 'l²', opzioni: ['l²', '4l', '2l²', 'l × 2'], argomento: 'Geometria' },
    { domanda: 'Cos\'è un angolo retto?', risposta: '90°', opzioni: ['90°', '180°', '45°', '60°'], argomento: 'Geometria' },
    { domanda: 'Cos\'è un angolo piatto?', risposta: '180°', opzioni: ['180°', '90°', '360°', '270°'], argomento: 'Geometria' },
    { domanda: 'Cos\'è un angolo giro?', risposta: '360°', opzioni: ['360°', '180°', '90°', '270°'], argomento: 'Geometria' }
  ];
  
  geometria.forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `La risposta corretta è: ${q.risposta}.`,
      livello: 'base',
      argomento: q.argomento,
      materia: 'matematica'
    });
  });
  
  // TRIGONOMETRIA
  const trigonometria = [
    { domanda: 'Quanto vale sin(0°)?', risposta: '0', opzioni: ['0', '1', '-1', '1/2'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale sin(90°)?', risposta: '1', opzioni: ['1', '0', '-1', '1/2'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale cos(0°)?', risposta: '1', opzioni: ['1', '0', '-1', '1/2'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale cos(90°)?', risposta: '0', opzioni: ['0', '1', '-1', '1/2'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale sin(30°)?', risposta: '1/2', opzioni: ['1/2', '√2/2', '√3/2', '1'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale cos(60°)?', risposta: '1/2', opzioni: ['1/2', '√2/2', '√3/2', '1'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale sin(45°)?', risposta: '√2/2', opzioni: ['√2/2', '1/2', '√3/2', '1'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale tan(45°)?', risposta: '1', opzioni: ['1', '0', '√3', '1/√3'], argomento: 'Trigonometria' },
    { domanda: 'Qual è l\'identità fondamentale della trigonometria?', risposta: 'sin²x + cos²x = 1', opzioni: ['sin²x + cos²x = 1', 'sin x + cos x = 1', 'tan x = sin x / cos x', 'sin 2x = 2 sin x'], argomento: 'Trigonometria' },
    { domanda: 'Come si definisce la tangente?', risposta: 'tan x = sin x / cos x', opzioni: ['tan x = sin x / cos x', 'tan x = cos x / sin x', 'tan x = sin x × cos x', 'tan x = sin x + cos x'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale sin(180°)?', risposta: '0', opzioni: ['0', '1', '-1', '1/2'], argomento: 'Trigonometria' },
    { domanda: 'Quanto vale cos(180°)?', risposta: '-1', opzioni: ['-1', '1', '0', '1/2'], argomento: 'Trigonometria' }
  ];
  
  trigonometria.forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `La risposta corretta è: ${q.risposta}.`,
      livello: 'intermedio',
      argomento: q.argomento,
      materia: 'matematica'
    });
  });
  
  // DERIVATE
  const derivate = [
    { funzione: 'x²', derivata: '2x' },
    { funzione: 'x³', derivata: '3x²' },
    { funzione: 'xⁿ', derivata: 'nxⁿ⁻¹' },
    { funzione: 'sin(x)', derivata: 'cos(x)' },
    { funzione: 'cos(x)', derivata: '-sin(x)' },
    { funzione: 'tan(x)', derivata: '1/cos²(x)' },
    { funzione: 'eˣ', derivata: 'eˣ' },
    { funzione: 'ln(x)', derivata: '1/x' },
    { funzione: 'aˣ', derivata: 'aˣ ln(a)' },
    { funzione: '1/x', derivata: '-1/x²' },
    { funzione: '√x', derivata: '1/(2√x)' },
    { funzione: 'arcsin(x)', derivata: '1/√(1-x²)' },
    { funzione: 'arctan(x)', derivata: '1/(1+x²)' }
  ];
  
  derivate.forEach(d => {
    const altreDerivate = derivate.filter(x => x.derivata !== d.derivata).map(x => x.derivata).slice(0, 3);
    quiz.push({
      tipo: 'multipla',
      domanda: `Qual è la derivata di ${d.funzione}?`,
      rispostaCorretta: d.derivata,
      opzioni: shuffleArray([d.derivata, ...altreDerivate]),
      spiegazione: `La derivata di ${d.funzione} è ${d.derivata}.`,
      livello: 'intermedio',
      argomento: 'Analisi',
      materia: 'matematica'
    });
  });
  
  // INTEGRALI
  const integrali = [
    { funzione: 'x', integrale: 'x²/2 + C' },
    { funzione: 'x²', integrale: 'x³/3 + C' },
    { funzione: 'xⁿ', integrale: 'xⁿ⁺¹/(n+1) + C' },
    { funzione: 'cos(x)', integrale: 'sin(x) + C' },
    { funzione: 'sin(x)', integrale: '-cos(x) + C' },
    { funzione: 'eˣ', integrale: 'eˣ + C' },
    { funzione: '1/x', integrale: 'ln|x| + C' },
    { funzione: '1/(1+x²)', integrale: 'arctan(x) + C' },
    { funzione: '1/√(1-x²)', integrale: 'arcsin(x) + C' }
  ];
  
  integrali.forEach(i => {
    const altriIntegrali = integrali.filter(x => x.integrale !== i.integrale).map(x => x.integrale).slice(0, 3);
    quiz.push({
      tipo: 'multipla',
      domanda: `Qual è l'integrale indefinito di ${i.funzione}?`,
      rispostaCorretta: i.integrale,
      opzioni: shuffleArray([i.integrale, ...altriIntegrali]),
      spiegazione: `L'integrale di ${i.funzione} è ${i.integrale}.`,
      livello: 'avanzato',
      argomento: 'Analisi',
      materia: 'matematica'
    });
  });
  
  // LIMITI NOTEVOLI
  const limiti = [
    { limite: 'lim(x→0) sin(x)/x', valore: '1' },
    { limite: 'lim(x→∞) (1+1/x)ˣ', valore: 'e' },
    { limite: 'lim(x→0) (eˣ-1)/x', valore: '1' },
    { limite: 'lim(x→0) ln(1+x)/x', valore: '1' },
    { limite: 'lim(x→0) (1-cos x)/x²', valore: '1/2' },
    { limite: 'lim(x→0) tan(x)/x', valore: '1' }
  ];
  
  limiti.forEach(l => {
    quiz.push({
      tipo: 'multipla',
      domanda: `Quanto vale ${l.limite}?`,
      rispostaCorretta: l.valore,
      opzioni: shuffleArray([l.valore, '0', '∞', '-1']),
      spiegazione: `${l.limite} = ${l.valore} è un limite notevole.`,
      livello: 'avanzato',
      argomento: 'Analisi',
      materia: 'matematica'
    });
  });
  
  // PROBABILITÀ E STATISTICA
  const probabilita = [
    { domanda: 'Qual è la formula della probabilità di un evento?', risposta: 'casi favorevoli / casi possibili', opzioni: ['casi favorevoli / casi possibili', 'casi possibili / casi favorevoli', 'casi favorevoli × casi possibili', 'casi favorevoli + casi possibili'], argomento: 'Probabilità' },
    { domanda: 'Qual è la probabilità di un evento certo?', risposta: '1', opzioni: ['1', '0', '0.5', '∞'], argomento: 'Probabilità' },
    { domanda: 'Qual è la probabilità di un evento impossibile?', risposta: '0', opzioni: ['0', '1', '0.5', '-1'], argomento: 'Probabilità' },
    { domanda: 'Qual è la formula della media aritmetica?', risposta: 'somma valori / numero valori', opzioni: ['somma valori / numero valori', 'valore massimo - valore minimo', 'valore centrale', 'valore più frequente'], argomento: 'Statistica' },
    { domanda: 'Cos\'è la mediana?', risposta: 'Valore centrale dei dati ordinati', opzioni: ['Valore centrale dei dati ordinati', 'Valore più frequente', 'Media dei valori', 'Differenza max-min'], argomento: 'Statistica' },
    { domanda: 'Cos\'è la moda?', risposta: 'Valore più frequente', opzioni: ['Valore più frequente', 'Valore centrale', 'Media dei valori', 'Valore massimo'], argomento: 'Statistica' },
    { domanda: 'Cos\'è la varianza?', risposta: 'Media degli scarti quadratici', opzioni: ['Media degli scarti quadratici', 'Radice della deviazione', 'Differenza max-min', 'Media dei valori'], argomento: 'Statistica' },
    { domanda: 'Cos\'è la deviazione standard?', risposta: 'Radice quadrata della varianza', opzioni: ['Radice quadrata della varianza', 'Varianza al quadrato', 'Media degli scarti', 'Differenza max-min'], argomento: 'Statistica' }
  ];
  
  probabilita.forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `La risposta corretta è: ${q.risposta}.`,
      livello: 'intermedio',
      argomento: q.argomento,
      materia: 'matematica'
    });
  });
  
  // LOGARITMI E ESPONENZIALI
  const logaritmi = [
    { domanda: 'Quanto vale log₁₀(100)?', risposta: '2', opzioni: ['2', '10', '100', '1'], argomento: 'Logaritmi' },
    { domanda: 'Quanto vale log₁₀(1000)?', risposta: '3', opzioni: ['3', '10', '1000', '2'], argomento: 'Logaritmi' },
    { domanda: 'Quanto vale ln(e)?', risposta: '1', opzioni: ['1', 'e', '0', '2.71'], argomento: 'Logaritmi' },
    { domanda: 'Quanto vale ln(1)?', risposta: '0', opzioni: ['0', '1', 'e', '-1'], argomento: 'Logaritmi' },
    { domanda: 'Qual è la proprietà log(a×b)?', risposta: 'log(a) + log(b)', opzioni: ['log(a) + log(b)', 'log(a) × log(b)', 'log(a) - log(b)', 'log(a) / log(b)'], argomento: 'Logaritmi' },
    { domanda: 'Qual è la proprietà log(a/b)?', risposta: 'log(a) - log(b)', opzioni: ['log(a) - log(b)', 'log(a) + log(b)', 'log(a) / log(b)', 'log(a) × log(b)'], argomento: 'Logaritmi' },
    { domanda: 'Qual è la proprietà log(aⁿ)?', risposta: 'n × log(a)', opzioni: ['n × log(a)', 'log(a)ⁿ', 'log(a) + n', 'log(a) / n'], argomento: 'Logaritmi' },
    { domanda: 'Quanto vale e⁰?', risposta: '1', opzioni: ['1', '0', 'e', '∞'], argomento: 'Esponenziali' },
    { domanda: 'Quanto vale 2⁰?', risposta: '1', opzioni: ['1', '0', '2', '∞'], argomento: 'Esponenziali' },
    { domanda: 'Quanto vale a⁻¹?', risposta: '1/a', opzioni: ['1/a', '-a', 'a', '-1/a'], argomento: 'Esponenziali' }
  ];
  
  logaritmi.forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `La risposta corretta è: ${q.risposta}.`,
      livello: 'intermedio',
      argomento: q.argomento,
      materia: 'matematica'
    });
  });
  
  return quiz;
}

// ============================================================
// UTILITY
// ============================================================

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================
// QUIZ SCIENZE
// ============================================================

function generaQuizScienze() {
  const quiz = [];
  
  const biologia = [
    // Cellula
    { domanda: 'Qual è la funzione del DNA?', risposta: 'Conservare l\'informazione genetica', opzioni: ['Conservare l\'informazione genetica', 'Produrre energia', 'Trasportare ossigeno', 'Digerire proteine'], argomento: 'Biologia cellulare' },
    { domanda: 'Dove avviene la fotosintesi?', risposta: 'Cloroplasti', opzioni: ['Cloroplasti', 'Mitocondri', 'Nucleo', 'Ribosomi'], argomento: 'Biologia cellulare' },
    { domanda: 'Qual è la funzione dei mitocondri?', risposta: 'Produrre ATP (energia)', opzioni: ['Produrre ATP (energia)', 'Sintetizzare proteine', 'Conservare DNA', 'Digerire sostanze'], argomento: 'Biologia cellulare' },
    { domanda: 'Dove avviene la sintesi proteica?', risposta: 'Ribosomi', opzioni: ['Ribosomi', 'Mitocondri', 'Nucleo', 'Lisosomi'], argomento: 'Biologia cellulare' },
    { domanda: 'Qual è la funzione del reticolo endoplasmatico rugoso?', risposta: 'Sintesi proteine', opzioni: ['Sintesi proteine', 'Produzione energia', 'Digestione', 'Fotosintesi'], argomento: 'Biologia cellulare' },
    { domanda: 'Cosa contiene il nucleo cellulare?', risposta: 'DNA e nucleolo', opzioni: ['DNA e nucleolo', 'Mitocondri', 'Cloroplasti', 'Ribosomi'], argomento: 'Biologia cellulare' },
    { domanda: 'Qual è la funzione dei lisosomi?', risposta: 'Digestione cellulare', opzioni: ['Digestione cellulare', 'Sintesi proteine', 'Produzione energia', 'Fotosintesi'], argomento: 'Biologia cellulare' },
    { domanda: 'Cosa distingue cellula procariote da eucariote?', risposta: 'Assenza di nucleo definito', opzioni: ['Assenza di nucleo definito', 'Dimensioni maggiori', 'Presenza di ribosomi', 'Membrana cellulare'], argomento: 'Biologia cellulare' },
    
    // Genetica
    { domanda: 'Quanti cromosomi ha una cellula umana?', risposta: '46', opzioni: ['46', '23', '48', '44'], argomento: 'Genetica' },
    { domanda: 'Cosa produce la meiosi?', risposta: 'Cellule aploidi (gameti)', opzioni: ['Cellule aploidi (gameti)', 'Cellule diploidi', 'Proteine', 'ATP'], argomento: 'Genetica' },
    { domanda: 'Cosa produce la mitosi?', risposta: 'Due cellule identiche', opzioni: ['Due cellule identiche', 'Quattro gameti', 'Proteine', 'ATP'], argomento: 'Genetica' },
    { domanda: 'Quali basi azotate compongono il DNA?', risposta: 'Adenina, Timina, Citosina, Guanina', opzioni: ['Adenina, Timina, Citosina, Guanina', 'Adenina, Uracile, Citosina, Guanina', 'Solo Adenina e Timina', 'Solo purine'], argomento: 'Genetica' },
    { domanda: 'Cosa si intende per genotipo?', risposta: 'Corredo genetico', opzioni: ['Corredo genetico', 'Aspetto fisico', 'Comportamento', 'Ambiente'], argomento: 'Genetica' },
    { domanda: 'Cosa si intende per fenotipo?', risposta: 'Caratteri osservabili', opzioni: ['Caratteri osservabili', 'Corredo genetico', 'DNA', 'Cromosomi'], argomento: 'Genetica' },
    { domanda: 'Chi scoprì la struttura del DNA?', risposta: 'Watson e Crick', opzioni: ['Watson e Crick', 'Mendel', 'Darwin', 'Pasteur'], argomento: 'Genetica' },
    { domanda: 'Cosa sono gli alleli?', risposta: 'Forme alternative di un gene', opzioni: ['Forme alternative di un gene', 'Cromosomi', 'Proteine', 'Cellule'], argomento: 'Genetica' },
    
    // Metabolismo
    { domanda: 'Qual è la formula della fotosintesi?', risposta: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', opzioni: ['6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', 'H₂O → H₂ + O₂', 'CO₂ → C + O₂'], argomento: 'Metabolismo' },
    { domanda: 'Qual è la formula della respirazione cellulare?', risposta: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', opzioni: ['C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', 'H₂O → H₂ + O₂', 'Solo glucosio'], argomento: 'Metabolismo' },
    { domanda: 'Dove avviene la glicolisi?', risposta: 'Citoplasma', opzioni: ['Citoplasma', 'Mitocondri', 'Nucleo', 'Ribosomi'], argomento: 'Metabolismo' },
    { domanda: 'Dove avviene il ciclo di Krebs?', risposta: 'Matrice mitocondriale', opzioni: ['Matrice mitocondriale', 'Citoplasma', 'Nucleo', 'Membrana'], argomento: 'Metabolismo' },
    
    // Corpo umano
    { domanda: 'Quale molecola trasporta l\'ossigeno nel sangue?', risposta: 'Emoglobina', opzioni: ['Emoglobina', 'Insulina', 'Glucosio', 'Colesterolo'], argomento: 'Corpo umano' },
    { domanda: 'Dove viene prodotta l\'insulina?', risposta: 'Pancreas', opzioni: ['Pancreas', 'Fegato', 'Reni', 'Stomaco'], argomento: 'Corpo umano' },
    { domanda: 'Qual è la funzione dei reni?', risposta: 'Filtrare il sangue', opzioni: ['Filtrare il sangue', 'Produrre insulina', 'Digerire', 'Pompare sangue'], argomento: 'Corpo umano' },
    { domanda: 'Quante camere ha il cuore umano?', risposta: '4', opzioni: ['4', '2', '3', '6'], argomento: 'Corpo umano' },
    { domanda: 'Qual è la funzione del fegato?', risposta: 'Metabolismo e detossificazione', opzioni: ['Metabolismo e detossificazione', 'Pompare sangue', 'Respirazione', 'Movimento'], argomento: 'Corpo umano' },
    { domanda: 'Dove avviene lo scambio gassoso?', risposta: 'Alveoli polmonari', opzioni: ['Alveoli polmonari', 'Bronchi', 'Trachea', 'Laringe'], argomento: 'Corpo umano' },
    { domanda: 'Qual è la funzione dei globuli bianchi?', risposta: 'Difesa immunitaria', opzioni: ['Difesa immunitaria', 'Trasporto ossigeno', 'Coagulazione', 'Nutrizione'], argomento: 'Corpo umano' },
    { domanda: 'Qual è la funzione delle piastrine?', risposta: 'Coagulazione del sangue', opzioni: ['Coagulazione del sangue', 'Trasporto ossigeno', 'Difesa immunitaria', 'Nutrizione'], argomento: 'Corpo umano' },
    
    // Evoluzione
    { domanda: 'Chi formulò la teoria dell\'evoluzione?', risposta: 'Charles Darwin', opzioni: ['Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'Watson'], argomento: 'Evoluzione' },
    { domanda: 'Cosa si intende per selezione naturale?', risposta: 'Sopravvivenza dei più adatti', opzioni: ['Sopravvivenza dei più adatti', 'Creazione divina', 'Mutazione casuale', 'Ereditarietà'], argomento: 'Evoluzione' },
    { domanda: 'Cosa sono i fossili?', risposta: 'Resti di organismi antichi', opzioni: ['Resti di organismi antichi', 'Rocce vulcaniche', 'Minerali', 'Cristalli'], argomento: 'Evoluzione' }
  ];
  
  const chimica = [
    // Struttura atomica
    { domanda: 'Qual è il numero atomico dell\'ossigeno?', risposta: '8', opzioni: ['8', '6', '16', '12'], argomento: 'Chimica generale' },
    { domanda: 'Qual è il numero atomico del carbonio?', risposta: '6', opzioni: ['6', '8', '12', '14'], argomento: 'Chimica generale' },
    { domanda: 'Cosa sono gli isotopi?', risposta: 'Atomi con stesso Z ma diverso A', opzioni: ['Atomi con stesso Z ma diverso A', 'Atomi con diverso Z', 'Molecole uguali', 'Ioni'], argomento: 'Chimica generale' },
    { domanda: 'Cosa determina il numero atomico?', risposta: 'Numero di protoni', opzioni: ['Numero di protoni', 'Numero di neutroni', 'Numero di elettroni', 'Massa'], argomento: 'Chimica generale' },
    { domanda: 'Dove si trovano gli elettroni?', risposta: 'Orbitali', opzioni: ['Orbitali', 'Nucleo', 'Protoni', 'Neutroni'], argomento: 'Chimica generale' },
    
    // Legami
    { domanda: 'Cos\'è un legame covalente?', risposta: 'Condivisione di elettroni', opzioni: ['Condivisione di elettroni', 'Trasferimento di elettroni', 'Attrazione elettrostatica', 'Forze deboli'], argomento: 'Legami chimici' },
    { domanda: 'Cos\'è un legame ionico?', risposta: 'Trasferimento di elettroni', opzioni: ['Trasferimento di elettroni', 'Condivisione di elettroni', 'Legame metallico', 'Forze deboli'], argomento: 'Legami chimici' },
    { domanda: 'Qual è la formula dell\'acqua?', risposta: 'H₂O', opzioni: ['H₂O', 'CO₂', 'NaCl', 'H₂SO₄'], argomento: 'Legami chimici' },
    { domanda: 'Qual è la formula del cloruro di sodio?', risposta: 'NaCl', opzioni: ['NaCl', 'H₂O', 'CO₂', 'HCl'], argomento: 'Legami chimici' },
    
    // Acidi e basi
    { domanda: 'Cosa indica il pH?', risposta: 'Acidità o basicità', opzioni: ['Acidità o basicità', 'Temperatura', 'Pressione', 'Densità'], argomento: 'Acidi e basi' },
    { domanda: 'Qual è il pH dell\'acqua pura?', risposta: '7', opzioni: ['7', '0', '14', '1'], argomento: 'Acidi e basi' },
    { domanda: 'Un pH < 7 indica?', risposta: 'Soluzione acida', opzioni: ['Soluzione acida', 'Soluzione basica', 'Soluzione neutra', 'Acqua pura'], argomento: 'Acidi e basi' },
    { domanda: 'Un pH > 7 indica?', risposta: 'Soluzione basica', opzioni: ['Soluzione basica', 'Soluzione acida', 'Soluzione neutra', 'Acqua pura'], argomento: 'Acidi e basi' },
    
    // Reazioni
    { domanda: 'Cosa si conserva in una reazione chimica?', risposta: 'La massa', opzioni: ['La massa', 'Il volume', 'La temperatura', 'Il colore'], argomento: 'Reazioni chimiche' },
    { domanda: 'Cos\'è un catalizzatore?', risposta: 'Sostanza che accelera la reazione', opzioni: ['Sostanza che accelera la reazione', 'Reagente', 'Prodotto', 'Solvente'], argomento: 'Reazioni chimiche' },
    { domanda: 'Cos\'è una reazione esotermica?', risposta: 'Libera calore', opzioni: ['Libera calore', 'Assorbe calore', 'Non produce energia', 'Produce luce'], argomento: 'Reazioni chimiche' },
    { domanda: 'Cos\'è una reazione endotermica?', risposta: 'Assorbe calore', opzioni: ['Assorbe calore', 'Libera calore', 'Non produce energia', 'Produce luce'], argomento: 'Reazioni chimiche' },
    
    // Elementi
    { domanda: 'Quale gas è più abbondante nell\'atmosfera?', risposta: 'Azoto (N₂)', opzioni: ['Azoto (N₂)', 'Ossigeno (O₂)', 'Anidride carbonica', 'Argon'], argomento: 'Elementi' },
    { domanda: 'Qual è il simbolo dell\'oro?', risposta: 'Au', opzioni: ['Au', 'Ag', 'Fe', 'Cu'], argomento: 'Elementi' },
    { domanda: 'Qual è il simbolo dell\'argento?', risposta: 'Ag', opzioni: ['Ag', 'Au', 'Fe', 'Cu'], argomento: 'Elementi' },
    { domanda: 'Qual è il simbolo del ferro?', risposta: 'Fe', opzioni: ['Fe', 'Au', 'Ag', 'Cu'], argomento: 'Elementi' },
    { domanda: 'Qual è il simbolo del rame?', risposta: 'Cu', opzioni: ['Cu', 'Au', 'Ag', 'Fe'], argomento: 'Elementi' }
  ];
  
  const scienzeTerra = [
    { domanda: 'Quali sono gli strati della Terra?', risposta: 'Crosta, mantello, nucleo', opzioni: ['Crosta, mantello, nucleo', 'Solo crosta e nucleo', 'Atmosfera e litosfera', 'Mare e terra'], argomento: 'Scienze della Terra' },
    { domanda: 'Cosa causa i terremoti?', risposta: 'Movimento delle placche tettoniche', opzioni: ['Movimento delle placche tettoniche', 'Vento', 'Pioggia', 'Luna'], argomento: 'Scienze della Terra' },
    { domanda: 'Cos\'è la litosfera?', risposta: 'Crosta terrestre e parte del mantello', opzioni: ['Crosta terrestre e parte del mantello', 'Solo oceani', 'Atmosfera', 'Nucleo'], argomento: 'Scienze della Terra' },
    { domanda: 'Cosa misura la scala Richter?', risposta: 'Magnitudo dei terremoti', opzioni: ['Magnitudo dei terremoti', 'Temperatura', 'Pressione', 'Vento'], argomento: 'Scienze della Terra' },
    { domanda: 'Cos\'è un vulcano?', risposta: 'Apertura nella crosta terrestre', opzioni: ['Apertura nella crosta terrestre', 'Montagna qualsiasi', 'Lago', 'Fiume'], argomento: 'Scienze della Terra' }
  ];
  
  [...biologia, ...chimica, ...scienzeTerra].forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `La risposta corretta è: ${q.risposta}.`,
      livello: 'intermedio',
      argomento: q.argomento || 'Scienze',
      materia: 'scienze'
    });
  });
  
  return quiz;
}

// ============================================================
// QUIZ LATINO
// ============================================================

function generaQuizLatino() {
  const quiz = [];
  
  const autoriLatini = {
    'Virgilio': { opere: ['Eneide', 'Bucoliche', 'Georgiche'], periodo: 'Età augustea', genere: 'epica' },
    'Orazio': { opere: ['Odi', 'Satire', 'Epistole', 'Ars Poetica'], periodo: 'Età augustea', genere: 'lirica' },
    'Ovidio': { opere: ['Metamorfosi', 'Ars Amatoria', 'Tristia'], periodo: 'Età augustea', genere: 'elegia' },
    'Cicerone': { opere: ['De Oratore', 'De Re Publica', 'Catilinarie'], periodo: 'Età repubblicana', genere: 'oratoria' },
    'Seneca': { opere: ['Epistulae morales', 'De Brevitate Vitae', 'Medea'], periodo: 'Età imperiale', genere: 'filosofia' },
    'Tacito': { opere: ['Annales', 'Historiae', 'Germania'], periodo: 'Età imperiale', genere: 'storiografia' },
    'Lucrezio': { opere: ['De Rerum Natura'], periodo: 'Età repubblicana', genere: 'poesia didascalica' },
    'Catullo': { opere: ['Liber', 'Carmina'], periodo: 'Età repubblicana', genere: 'lirica' }
  };
  
  for (const [nome, info] of Object.entries(autoriLatini)) {
    // Quiz opere
    const opera = info.opere[0];
    const altreOpere = Object.values(autoriLatini).flatMap(a => a.opere).filter(o => !info.opere.includes(o)).slice(0, 3);
    quiz.push({
      tipo: 'multipla',
      domanda: `Quale tra queste è un'opera di ${nome}?`,
      rispostaCorretta: opera,
      opzioni: shuffleArray([opera, ...altreOpere]),
      spiegazione: `"${opera}" è una delle opere principali di ${nome}.`,
      livello: 'base',
      argomento: info.periodo,
      materia: 'latino'
    });
    
    // Quiz autore
    quiz.push({
      tipo: 'multipla',
      domanda: `Chi è l'autore di "${opera}"?`,
      rispostaCorretta: nome,
      opzioni: shuffleArray([nome, ...Object.keys(autoriLatini).filter(n => n !== nome).slice(0, 3)]),
      spiegazione: `"${opera}" fu scritta da ${nome}.`,
      livello: 'base',
      argomento: info.periodo,
      materia: 'latino'
    });
    
    // Quiz periodo
    const altriPeriodi = [...new Set(Object.values(autoriLatini).map(a => a.periodo))].filter(p => p !== info.periodo);
    quiz.push({
      tipo: 'multipla',
      domanda: `A quale periodo appartiene ${nome}?`,
      rispostaCorretta: info.periodo,
      opzioni: shuffleArray([info.periodo, ...altriPeriodi]),
      spiegazione: `${nome} visse durante l'${info.periodo}.`,
      livello: 'intermedio',
      argomento: info.periodo,
      materia: 'latino'
    });
  }
  
  // Grammatica latina
  const grammatica = [
    { domanda: 'Quante declinazioni ha il latino?', risposta: '5', opzioni: ['5', '3', '4', '6'] },
    { domanda: 'Quante coniugazioni ha il latino?', risposta: '4', opzioni: ['4', '3', '5', '2'] },
    { domanda: 'Quale caso esprime il complemento oggetto?', risposta: 'Accusativo', opzioni: ['Accusativo', 'Genitivo', 'Dativo', 'Ablativo'] },
    { domanda: 'Quale caso esprime il complemento di specificazione?', risposta: 'Genitivo', opzioni: ['Genitivo', 'Dativo', 'Accusativo', 'Nominativo'] },
    { domanda: 'Quale caso esprime il complemento di termine?', risposta: 'Dativo', opzioni: ['Dativo', 'Genitivo', 'Ablativo', 'Accusativo'] },
    { domanda: 'Come si traduce "Carpe diem"?', risposta: 'Cogli l\'attimo', opzioni: ['Cogli l\'attimo', 'Vivi il giorno', 'Ama la vita', 'Pensa al futuro'] }
  ];
  
  grammatica.forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `La risposta corretta è: ${q.risposta}.`,
      livello: 'base',
      argomento: 'Grammatica latina',
      materia: 'latino'
    });
  });
  
  return quiz;
}

// ============================================================
// QUIZ ARTE
// ============================================================

function generaQuizArte() {
  const quiz = [];
  
  const artisti = {
    // RINASCIMENTO
    'Giotto': { opere: ['Cappella degli Scrovegni', 'Crocifisso di Santa Maria Novella', 'Storie di San Francesco'], periodo: 'Gotico', nascita: 1267 },
    'Masaccio': { opere: ['Trinità', 'Cappella Brancacci', 'Tributo'], periodo: 'Rinascimento', nascita: 1401 },
    'Botticelli': { opere: ['La nascita di Venere', 'La Primavera', 'Adorazione dei Magi'], periodo: 'Rinascimento', nascita: 1445 },
    'Leonardo da Vinci': { opere: ['Gioconda', 'Ultima Cena', 'Uomo Vitruviano', 'Annunciazione'], periodo: 'Rinascimento', nascita: 1452 },
    'Michelangelo': { opere: ['David', 'Cappella Sistina', 'Pietà', 'Giudizio Universale'], periodo: 'Rinascimento', nascita: 1475 },
    'Raffaello': { opere: ['Scuola di Atene', 'Trasfigurazione', 'Madonna Sistina', 'Stanze Vaticane'], periodo: 'Rinascimento', nascita: 1483 },
    'Tiziano': { opere: ['Amor Sacro e Amor Profano', 'Venere di Urbino', 'Assunta'], periodo: 'Rinascimento', nascita: 1488 },
    'Piero della Francesca': { opere: ['Flagellazione di Cristo', 'Battesimo di Cristo', 'Ritratti dei duchi di Urbino'], periodo: 'Rinascimento', nascita: 1415 },
    
    // BAROCCO
    'Caravaggio': { opere: ['Vocazione di San Matteo', 'Canestra di frutta', 'Giuditta e Oloferne', 'Deposizione'], periodo: 'Barocco', nascita: 1571 },
    'Bernini': { opere: ['Apollo e Dafne', 'Estasi di Santa Teresa', 'Colonnato San Pietro', 'Ratto di Proserpina'], periodo: 'Barocco', nascita: 1598 },
    'Borromini': { opere: ['San Carlo alle Quattro Fontane', 'Sant\'Ivo alla Sapienza'], periodo: 'Barocco', nascita: 1599 },
    'Rubens': { opere: ['Le tre Grazie', 'Deposizione dalla Croce', 'Giardino dell\'amore'], periodo: 'Barocco', nascita: 1577 },
    'Rembrandt': { opere: ['Ronda di notte', 'Lezione di anatomia', 'Autoritratti'], periodo: 'Barocco', nascita: 1606 },
    'Vermeer': { opere: ['Ragazza con l\'orecchino di perla', 'La lattaia', 'L\'astronomo'], periodo: 'Barocco', nascita: 1632 },
    
    // NEOCLASSICISMO E ROMANTICISMO
    'Canova': { opere: ['Amore e Psiche', 'Paolina Borghese', 'Le tre Grazie'], periodo: 'Neoclassicismo', nascita: 1757 },
    'Jacques-Louis David': { opere: ['Giuramento degli Orazi', 'Morte di Marat', 'Incoronazione di Napoleone'], periodo: 'Neoclassicismo', nascita: 1748 },
    'Delacroix': { opere: ['La Libertà che guida il popolo', 'La morte di Sardanapalo'], periodo: 'Romanticismo', nascita: 1798 },
    'Goya': { opere: ['Il 3 maggio 1808', 'Saturno che divora i suoi figli', 'La Maya desnuda'], periodo: 'Romanticismo', nascita: 1746 },
    'Turner': { opere: ['Pioggia, vapore e velocità', 'Il Temerario'], periodo: 'Romanticismo', nascita: 1775 },
    'Caspar David Friedrich': { opere: ['Viandante sul mare di nebbia', 'Il mare di ghiaccio'], periodo: 'Romanticismo', nascita: 1774 },
    
    // IMPRESSIONISMO E POST
    'Monet': { opere: ['Impressione, levar del sole', 'Ninfee', 'Cattedrale di Rouen', 'Colazione sull\'erba'], periodo: 'Impressionismo', nascita: 1840 },
    'Renoir': { opere: ['Ballo al Moulin de la Galette', 'Colazione dei canottieri'], periodo: 'Impressionismo', nascita: 1841 },
    'Degas': { opere: ['La classe di danza', 'L\'assenzio', 'Ballerine'], periodo: 'Impressionismo', nascita: 1834 },
    'Manet': { opere: ['Olympia', 'Colazione sull\'erba', 'Il bar delle Folies-Bergère'], periodo: 'Impressionismo', nascita: 1832 },
    'Van Gogh': { opere: ['Notte stellata', 'Girasoli', 'Camera da letto', 'Campo di grano con corvi'], periodo: 'Post-impressionismo', nascita: 1853 },
    'Cézanne': { opere: ['I giocatori di carte', 'Mont Sainte-Victoire', 'Le grandi bagnanti'], periodo: 'Post-impressionismo', nascita: 1839 },
    'Gauguin': { opere: ['Da dove veniamo? Chi siamo? Dove andiamo?', 'Donne tahitiane'], periodo: 'Post-impressionismo', nascita: 1848 },
    'Seurat': { opere: ['Una domenica pomeriggio sull\'isola della Grande-Jatte'], periodo: 'Puntinismo', nascita: 1859 },
    
    // AVANGUARDIE
    'Picasso': { opere: ['Guernica', 'Les Demoiselles d\'Avignon', 'Periodo blu', 'Periodo rosa'], periodo: 'Cubismo', nascita: 1881 },
    'Braque': { opere: ['Case all\'Estaque', 'Violino e brocca'], periodo: 'Cubismo', nascita: 1882 },
    'Kandinsky': { opere: ['Composizione VIII', 'Primo acquerello astratto'], periodo: 'Astrattismo', nascita: 1866 },
    'Mondrian': { opere: ['Composizione in rosso, giallo e blu', 'Broadway Boogie Woogie'], periodo: 'Neoplasticismo', nascita: 1872 },
    'Dalí': { opere: ['La persistenza della memoria', 'Sogno causato dal volo di un\'ape'], periodo: 'Surrealismo', nascita: 1904 },
    'Magritte': { opere: ['Il tradimento delle immagini', 'L\'impero delle luci', 'Gli amanti'], periodo: 'Surrealismo', nascita: 1898 },
    'Munch': { opere: ['L\'urlo', 'Madonna', 'Pubertà'], periodo: 'Espressionismo', nascita: 1863 },
    'Klimt': { opere: ['Il bacio', 'Ritratto di Adele Bloch-Bauer', 'L\'albero della vita'], periodo: 'Art Nouveau', nascita: 1862 },
    'Matisse': { opere: ['La danza', 'La stanza rossa', 'Nudo blu'], periodo: 'Fauvismo', nascita: 1869 },
    
    // ARTE ITALIANA MODERNA
    'Boccioni': { opere: ['Forme uniche della continuità nello spazio', 'La città che sale'], periodo: 'Futurismo', nascita: 1882 },
    'Balla': { opere: ['Dinamismo di un cane al guinzaglio', 'Velocità astratta'], periodo: 'Futurismo', nascita: 1871 },
    'De Chirico': { opere: ['Le Muse inquietanti', 'Piazze d\'Italia'], periodo: 'Metafisica', nascita: 1888 },
    'Modigliani': { opere: ['Nudo sdraiato', 'Ritratti allungati'], periodo: 'Scuola di Parigi', nascita: 1884 },
    'Fontana': { opere: ['Concetto spaziale, Attese', 'Tagli'], periodo: 'Spazialismo', nascita: 1899 },
    'Burri': { opere: ['Sacchi', 'Cretti', 'Combustioni'], periodo: 'Informale', nascita: 1915 }
  };
  
  for (const [nome, info] of Object.entries(artisti)) {
    const opera = info.opere[0];
    const altreOpere = Object.values(artisti).flatMap(a => a.opere).filter(o => !info.opere.includes(o)).slice(0, 3);
    
    quiz.push({
      tipo: 'multipla',
      domanda: `Chi è l'autore di "${opera}"?`,
      rispostaCorretta: nome,
      opzioni: shuffleArray([nome, ...Object.keys(artisti).filter(n => n !== nome).slice(0, 3)]),
      spiegazione: `"${opera}" è un'opera di ${nome}.`,
      livello: 'base',
      argomento: info.periodo,
      materia: 'arte'
    });
    
    quiz.push({
      tipo: 'multipla',
      domanda: `Quale tra queste è un'opera di ${nome}?`,
      rispostaCorretta: opera,
      opzioni: shuffleArray([opera, ...altreOpere]),
      spiegazione: `"${opera}" è una delle opere principali di ${nome}.`,
      livello: 'base',
      argomento: info.periodo,
      materia: 'arte'
    });
    
    const altriPeriodi = [...new Set(Object.values(artisti).map(a => a.periodo))].filter(p => p !== info.periodo).slice(0, 3);
    quiz.push({
      tipo: 'multipla',
      domanda: `A quale movimento artistico appartiene ${nome}?`,
      rispostaCorretta: info.periodo,
      opzioni: shuffleArray([info.periodo, ...altriPeriodi]),
      spiegazione: `${nome} è uno dei principali esponenti del ${info.periodo}.`,
      livello: 'intermedio',
      argomento: info.periodo,
      materia: 'arte'
    });
  }
  
  return quiz;
}

// ============================================================
// QUIZ INGLESE
// ============================================================

function generaQuizInglese() {
  const quiz = [];
  
  const autoriInglesi = {
    'William Shakespeare': { opere: ['Hamlet', 'Romeo and Juliet', 'Macbeth', 'Othello'], periodo: 'Elizabethan Era' },
    'Jane Austen': { opere: ['Pride and Prejudice', 'Sense and Sensibility', 'Emma'], periodo: 'Romantic Era' },
    'Charles Dickens': { opere: ['Oliver Twist', 'A Tale of Two Cities', 'Great Expectations'], periodo: 'Victorian Era' },
    'Oscar Wilde': { opere: ['The Picture of Dorian Gray', 'The Importance of Being Earnest'], periodo: 'Victorian Era' },
    'James Joyce': { opere: ['Ulysses', 'Dubliners', 'A Portrait of the Artist'], periodo: 'Modernism' },
    'Virginia Woolf': { opere: ['Mrs Dalloway', 'To the Lighthouse', 'Orlando'], periodo: 'Modernism' },
    'George Orwell': { opere: ['1984', 'Animal Farm', 'Homage to Catalonia'], periodo: '20th Century' }
  };
  
  for (const [nome, info] of Object.entries(autoriInglesi)) {
    const opera = info.opere[0];
    quiz.push({
      tipo: 'multipla',
      domanda: `Who wrote "${opera}"?`,
      rispostaCorretta: nome,
      opzioni: shuffleArray([nome, ...Object.keys(autoriInglesi).filter(n => n !== nome).slice(0, 3)]),
      spiegazione: `"${opera}" was written by ${nome}.`,
      livello: 'base',
      argomento: info.periodo,
      materia: 'inglese'
    });
  }
  
  // Grammar - Verbs
  const grammar = [
    { domanda: 'Which is the correct form? "She ___ to school every day."', risposta: 'goes', opzioni: ['goes', 'go', 'going', 'gone'], argomento: 'Present Simple' },
    { domanda: 'Choose the correct past tense: "I ___ a book yesterday."', risposta: 'read', opzioni: ['read', 'readed', 'reading', 'reads'], argomento: 'Past Simple' },
    { domanda: 'Which sentence is correct?', risposta: 'I have been waiting for an hour', opzioni: ['I have been waiting for an hour', 'I am waiting since an hour', 'I wait for an hour', 'I waiting for an hour'], argomento: 'Present Perfect Continuous' },
    { domanda: 'Choose the correct conditional: "If I ___ rich, I would travel."', risposta: 'were', opzioni: ['were', 'am', 'would be', 'was being'], argomento: 'Second Conditional' },
    { domanda: 'Which is the passive form of "They built the house"?', risposta: 'The house was built', opzioni: ['The house was built', 'The house is built', 'The house built', 'The house has built'], argomento: 'Passive Voice' },
    { domanda: '"I ___ to London twice." Choose the correct form.', risposta: 'have been', opzioni: ['have been', 'was', 'am', 'had been'], argomento: 'Present Perfect' },
    { domanda: 'Which is correct? "By 5 PM, I ___ my homework."', risposta: 'will have finished', opzioni: ['will have finished', 'will finish', 'finished', 'am finishing'], argomento: 'Future Perfect' },
    { domanda: '"She ___ when I arrived." Choose the correct form.', risposta: 'was sleeping', opzioni: ['was sleeping', 'slept', 'is sleeping', 'has slept'], argomento: 'Past Continuous' },
    { domanda: 'Which is the third conditional? "If I ___ studied, I would have passed."', risposta: 'had', opzioni: ['had', 'have', 'would have', 'has'], argomento: 'Third Conditional' },
    { domanda: '"I wish I ___ taller." Choose the correct form.', risposta: 'were', opzioni: ['were', 'am', 'was being', 'would be'], argomento: 'Wish Clauses' },
    
    // Vocabulary
    { domanda: 'What is the opposite of "ancient"?', risposta: 'modern', opzioni: ['modern', 'old', 'antique', 'historic'], argomento: 'Vocabulary' },
    { domanda: 'What is the synonym of "beautiful"?', risposta: 'gorgeous', opzioni: ['gorgeous', 'ugly', 'plain', 'simple'], argomento: 'Vocabulary' },
    { domanda: 'What does "ubiquitous" mean?', risposta: 'present everywhere', opzioni: ['present everywhere', 'rare', 'unique', 'hidden'], argomento: 'Vocabulary' },
    { domanda: 'What is the plural of "child"?', risposta: 'children', opzioni: ['children', 'childs', 'childes', 'childrens'], argomento: 'Irregular Plurals' },
    { domanda: 'What is the plural of "mouse"?', risposta: 'mice', opzioni: ['mice', 'mouses', 'mices', 'mouse'], argomento: 'Irregular Plurals' },
    
    // Prepositions
    { domanda: 'Choose the correct preposition: "I\'m interested ___ art."', risposta: 'in', opzioni: ['in', 'on', 'at', 'for'], argomento: 'Prepositions' },
    { domanda: 'Choose the correct preposition: "She\'s good ___ maths."', risposta: 'at', opzioni: ['at', 'in', 'on', 'for'], argomento: 'Prepositions' },
    { domanda: 'Choose the correct preposition: "I depend ___ my parents."', risposta: 'on', opzioni: ['on', 'in', 'at', 'for'], argomento: 'Prepositions' },
    { domanda: 'Choose the correct preposition: "He apologized ___ being late."', risposta: 'for', opzioni: ['for', 'of', 'about', 'to'], argomento: 'Prepositions' },
    
    // Relative Clauses
    { domanda: 'Which relative pronoun is correct? "The man ___ called is my uncle."', risposta: 'who', opzioni: ['who', 'which', 'whose', 'whom'], argomento: 'Relative Clauses' },
    { domanda: 'Which relative pronoun is correct? "The book ___ I read was interesting."', risposta: 'which/that', opzioni: ['which/that', 'who', 'whose', 'whom'], argomento: 'Relative Clauses' },
    
    // Reported Speech
    { domanda: '"I am happy" in reported speech becomes:', risposta: 'He said he was happy', opzioni: ['He said he was happy', 'He said he is happy', 'He said I am happy', 'He said he has been happy'], argomento: 'Reported Speech' },
    { domanda: '"I will come" in reported speech becomes:', risposta: 'He said he would come', opzioni: ['He said he would come', 'He said he will come', 'He said I will come', 'He said he comes'], argomento: 'Reported Speech' }
  ];
  
  grammar.forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `The correct answer is: ${q.risposta}.`,
      livello: 'intermedio',
      argomento: q.argomento || 'Grammar',
      materia: 'inglese'
    });
  });
  
  return quiz;
}

// ============================================================
// QUIZ RELIGIONE
// ============================================================

function generaQuizReligione() {
  const quiz = [];
  
  const domande = [
    // Vangeli e Bibbia
    { domanda: 'Quanti sono i Vangeli canonici?', risposta: '4', opzioni: ['4', '3', '5', '12'], argomento: 'Vangeli' },
    { domanda: 'Chi sono i quattro evangelisti?', risposta: 'Matteo, Marco, Luca, Giovanni', opzioni: ['Matteo, Marco, Luca, Giovanni', 'Pietro, Paolo, Giacomo, Giovanni', 'Matteo, Pietro, Luca, Paolo', 'Marco, Paolo, Giacomo, Luca'], argomento: 'Vangeli' },
    { domanda: 'Quanti libri contiene la Bibbia cattolica?', risposta: '73', opzioni: ['73', '66', '46', '27'], argomento: 'Bibbia' },
    { domanda: 'Quanti libri ha l\'Antico Testamento cattolico?', risposta: '46', opzioni: ['46', '39', '27', '50'], argomento: 'Bibbia' },
    { domanda: 'Quanti libri ha il Nuovo Testamento?', risposta: '27', opzioni: ['27', '46', '39', '21'], argomento: 'Bibbia' },
    { domanda: 'Qual è il primo libro della Bibbia?', risposta: 'Genesi', opzioni: ['Genesi', 'Esodo', 'Salmi', 'Matteo'], argomento: 'Bibbia' },
    { domanda: 'Qual è l\'ultimo libro della Bibbia?', risposta: 'Apocalisse', opzioni: ['Apocalisse', 'Giovanni', 'Atti', 'Giuda'], argomento: 'Bibbia' },
    
    // Gesù
    { domanda: 'Dove nacque Gesù?', risposta: 'Betlemme', opzioni: ['Betlemme', 'Nazareth', 'Gerusalemme', 'Cafarnao'], argomento: 'Vita di Gesù' },
    { domanda: 'Dove crebbe Gesù?', risposta: 'Nazareth', opzioni: ['Nazareth', 'Betlemme', 'Gerusalemme', 'Cafarnao'], argomento: 'Vita di Gesù' },
    { domanda: 'Chi battezzò Gesù?', risposta: 'Giovanni Battista', opzioni: ['Giovanni Battista', 'Pietro', 'Paolo', 'Giacomo'], argomento: 'Vita di Gesù' },
    { domanda: 'Dove fu crocifisso Gesù?', risposta: 'Golgota', opzioni: ['Golgota', 'Betlemme', 'Nazareth', 'Getsemani'], argomento: 'Vita di Gesù' },
    { domanda: 'Quanti giorni dopo la morte risorse Gesù?', risposta: '3', opzioni: ['3', '7', '40', '1'], argomento: 'Vita di Gesù' },
    { domanda: 'Qual è il primo miracolo di Gesù?', risposta: 'Nozze di Cana', opzioni: ['Nozze di Cana', 'Moltiplicazione pani', 'Guarigione cieco', 'Resurrezione Lazzaro'], argomento: 'Vita di Gesù' },
    
    // Apostoli
    { domanda: 'Quanti sono gli apostoli?', risposta: '12', opzioni: ['12', '10', '7', '13'], argomento: 'Apostoli' },
    { domanda: 'Chi fu il primo Papa?', risposta: 'San Pietro', opzioni: ['San Pietro', 'San Paolo', 'San Giovanni', 'San Giacomo'], argomento: 'Apostoli' },
    { domanda: 'Chi tradì Gesù?', risposta: 'Giuda Iscariota', opzioni: ['Giuda Iscariota', 'Pietro', 'Tommaso', 'Matteo'], argomento: 'Apostoli' },
    { domanda: 'Chi rinnegò Gesù tre volte?', risposta: 'Pietro', opzioni: ['Pietro', 'Giuda', 'Giovanni', 'Tommaso'], argomento: 'Apostoli' },
    { domanda: 'Chi è l\'apostolo delle genti?', risposta: 'San Paolo', opzioni: ['San Paolo', 'San Pietro', 'San Giovanni', 'San Giacomo'], argomento: 'Apostoli' },
    { domanda: 'Chi scrisse l\'Apocalisse?', risposta: 'Giovanni', opzioni: ['Giovanni', 'Paolo', 'Pietro', 'Matteo'], argomento: 'Apostoli' },
    
    // Sacramenti
    { domanda: 'Quanti sono i sacramenti?', risposta: '7', opzioni: ['7', '5', '10', '3'], argomento: 'Sacramenti' },
    { domanda: 'Quale sacramento si riceve per primo?', risposta: 'Battesimo', opzioni: ['Battesimo', 'Comunione', 'Cresima', 'Confessione'], argomento: 'Sacramenti' },
    { domanda: 'Quale sacramento conferisce lo Spirito Santo?', risposta: 'Cresima', opzioni: ['Cresima', 'Battesimo', 'Comunione', 'Ordine'], argomento: 'Sacramenti' },
    { domanda: 'Quale sacramento perdona i peccati?', risposta: 'Confessione', opzioni: ['Confessione', 'Battesimo', 'Comunione', 'Unzione'], argomento: 'Sacramenti' },
    { domanda: 'Quale sacramento unisce gli sposi?', risposta: 'Matrimonio', opzioni: ['Matrimonio', 'Ordine', 'Cresima', 'Battesimo'], argomento: 'Sacramenti' },
    
    // Comandamenti
    { domanda: 'Quanti sono i comandamenti?', risposta: '10', opzioni: ['10', '7', '12', '5'], argomento: 'Comandamenti' },
    { domanda: 'Qual è il primo comandamento?', risposta: 'Non avrai altro Dio', opzioni: ['Non avrai altro Dio', 'Non uccidere', 'Onora il padre', 'Non rubare'], argomento: 'Comandamenti' },
    { domanda: 'Qual è il quinto comandamento?', risposta: 'Non uccidere', opzioni: ['Non uccidere', 'Non rubare', 'Non mentire', 'Onora il padre'], argomento: 'Comandamenti' },
    
    // Feste
    { domanda: 'Quale festa celebra la nascita di Gesù?', risposta: 'Natale', opzioni: ['Natale', 'Pasqua', 'Epifania', 'Ascensione'], argomento: 'Feste' },
    { domanda: 'Quale festa celebra la resurrezione di Gesù?', risposta: 'Pasqua', opzioni: ['Pasqua', 'Natale', 'Pentecoste', 'Epifania'], argomento: 'Feste' },
    { domanda: 'Cosa celebra la Pentecoste?', risposta: 'La discesa dello Spirito Santo', opzioni: ['La discesa dello Spirito Santo', 'La nascita di Gesù', 'La resurrezione', 'L\'ascensione'], argomento: 'Feste' },
    { domanda: 'Cosa celebra l\'Epifania?', risposta: 'La visita dei Magi', opzioni: ['La visita dei Magi', 'La nascita', 'La resurrezione', 'L\'ascensione'], argomento: 'Feste' },
    { domanda: 'Cosa celebra l\'Ascensione?', risposta: 'Gesù sale al cielo', opzioni: ['Gesù sale al cielo', 'La resurrezione', 'La nascita', 'La Pentecoste'], argomento: 'Feste' },
    { domanda: 'Quanti giorni dura la Quaresima?', risposta: '40', opzioni: ['40', '30', '50', '7'], argomento: 'Feste' },
    
    // Chiesa
    { domanda: 'In quale città si trova il Vaticano?', risposta: 'Roma', opzioni: ['Roma', 'Gerusalemme', 'Milano', 'Firenze'], argomento: 'Chiesa' },
    { domanda: 'Chi è il capo della Chiesa cattolica?', risposta: 'Il Papa', opzioni: ['Il Papa', 'Il Vescovo', 'Il Cardinale', 'Il Patriarca'], argomento: 'Chiesa' },
    { domanda: 'Qual è la basilica più grande del mondo?', risposta: 'San Pietro', opzioni: ['San Pietro', 'San Giovanni', 'Santa Maria Maggiore', 'San Paolo'], argomento: 'Chiesa' },
    
    // Altre religioni
    { domanda: 'Qual è il libro sacro dell\'Islam?', risposta: 'Corano', opzioni: ['Corano', 'Torah', 'Veda', 'Bibbia'], argomento: 'Altre religioni' },
    { domanda: 'Qual è il libro sacro dell\'Ebraismo?', risposta: 'Torah', opzioni: ['Torah', 'Corano', 'Veda', 'Talmud'], argomento: 'Altre religioni' },
    { domanda: 'Chi è il fondatore del Buddhismo?', risposta: 'Siddharta Gautama', opzioni: ['Siddharta Gautama', 'Maometto', 'Confucio', 'Lao Tzu'], argomento: 'Altre religioni' },
    { domanda: 'Qual è il simbolo del Cristianesimo?', risposta: 'La croce', opzioni: ['La croce', 'La mezzaluna', 'La stella', 'Il loto'], argomento: 'Simboli' },
    { domanda: 'Qual è il simbolo dell\'Islam?', risposta: 'Mezzaluna e stella', opzioni: ['Mezzaluna e stella', 'La croce', 'La stella di David', 'Il loto'], argomento: 'Simboli' },
    { domanda: 'Qual è il simbolo dell\'Ebraismo?', risposta: 'Stella di David', opzioni: ['Stella di David', 'La croce', 'La mezzaluna', 'Il loto'], argomento: 'Simboli' }
  ];
  
  domande.forEach(q => {
    quiz.push({
      tipo: 'multipla',
      domanda: q.domanda,
      rispostaCorretta: q.risposta,
      opzioni: shuffleArray(q.opzioni),
      spiegazione: `La risposta corretta è: ${q.risposta}.`,
      livello: 'base',
      argomento: q.argomento || 'Religione cattolica',
      materia: 'religione'
    });
  });
  
  return quiz;
}

// ============================================================
// MAIN
// ============================================================

function main() {
  console.log('📚 Generazione quiz...\n');
  
  const tuttiQuiz = [];
  
  // Genera quiz per ogni categoria
  const quizAutori = generaQuizAutori();
  console.log(`   ✓ Italiano (autori): ${quizAutori.length} quiz`);
  tuttiQuiz.push(...quizAutori);
  
  const quizFilosofi = generaQuizFilosofi();
  console.log(`   ✓ Filosofia: ${quizFilosofi.length} quiz`);
  tuttiQuiz.push(...quizFilosofi);
  
  const quizStoria = generaQuizStoria();
  console.log(`   ✓ Storia: ${quizStoria.length} quiz`);
  tuttiQuiz.push(...quizStoria);
  
  const quizFisica = generaQuizFisica();
  console.log(`   ✓ Fisica: ${quizFisica.length} quiz`);
  tuttiQuiz.push(...quizFisica);
  
  const quizMatematica = generaQuizMatematica();
  console.log(`   ✓ Matematica: ${quizMatematica.length} quiz`);
  tuttiQuiz.push(...quizMatematica);
  
  const quizScienze = generaQuizScienze();
  console.log(`   ✓ Scienze: ${quizScienze.length} quiz`);
  tuttiQuiz.push(...quizScienze);
  
  const quizLatino = generaQuizLatino();
  console.log(`   ✓ Latino: ${quizLatino.length} quiz`);
  tuttiQuiz.push(...quizLatino);
  
  const quizArte = generaQuizArte();
  console.log(`   ✓ Arte: ${quizArte.length} quiz`);
  tuttiQuiz.push(...quizArte);
  
  const quizInglese = generaQuizInglese();
  console.log(`   ✓ Inglese: ${quizInglese.length} quiz`);
  tuttiQuiz.push(...quizInglese);
  
  const quizReligione = generaQuizReligione();
  console.log(`   ✓ Religione: ${quizReligione.length} quiz`);
  tuttiQuiz.push(...quizReligione);
  
  // Salva
  const output = {
    totale: tuttiQuiz.length,
    generato: new Date().toISOString(),
    quiz: shuffleArray(tuttiQuiz)
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'tutti-quiz.json'),
    JSON.stringify(output, null, 2)
  );
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`   ✅ GENERATI ${tuttiQuiz.length} QUIZ DI ALTA QUALITÀ`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Statistiche per materia
  const perMateria = {};
  tuttiQuiz.forEach(q => {
    perMateria[q.materia] = (perMateria[q.materia] || 0) + 1;
  });
  
  console.log('📊 Quiz per materia:');
  Object.entries(perMateria).sort((a, b) => b[1] - a[1]).forEach(([materia, count]) => {
    console.log(`   ${materia}: ${count}`);
  });
}

main();
