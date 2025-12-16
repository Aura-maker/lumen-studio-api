// Script per correggere automaticamente tutti i riassunti in italiano corretto
const fs = require('fs');
const path = require('path');

// Funzione per correggere un riassunto da stile telegrafico a italiano corretto
function correggiRiassunto(riassunto) {
  if (!riassunto || typeof riassunto !== 'string') return riassunto;
  
  let testo = riassunto;
  
  // 1. Sostituisci i doppi punti con punti normali
  testo = testo.replace(/\.\./g, '.');
  
  // 2. Aggiungi articoli mancanti
  testo = testo.replace(/\b([A-Z][a-z]+)\s+(movimento|periodo|sistema|metodo|teoria|opera|libro|trattato|filosofo|scrittore|poeta|autore|pittore|scultore|musicista|compositore|imperatore|re|papa|santo)\b/g, 
    (match, nome, tipo) => {
      const articoli = {
        'movimento': 'Il movimento',
        'periodo': 'Il periodo', 
        'sistema': 'Il sistema',
        'metodo': 'Il metodo',
        'teoria': 'La teoria',
        'opera': "L'opera",
        'libro': 'Il libro',
        'trattato': 'Il trattato',
        'filosofo': 'Il filosofo',
        'scrittore': 'Lo scrittore',
        'poeta': 'Il poeta',
        'autore': "L'autore",
        'pittore': 'Il pittore',
        'scultore': 'Lo scultore',
        'musicista': 'Il musicista',
        'compositore': 'Il compositore',
        'imperatore': "L'imperatore",
        're': 'Il re',
        'papa': 'Il papa',
        'santo': 'Il santo'
      };
      return `${nome} è ${articoli[tipo] || 'un ' + tipo}`;
    });
  
  // 3. Correggi pattern comuni problematici
  testo = testo.replace(/\bCause economiche:/g, 'Le cause economiche includono');
  testo = testo.replace(/\bCause sociali:/g, 'Le cause sociali derivano da');
  testo = testo.replace(/\bCause politiche:/g, 'Le cause politiche comprendono');
  testo = testo.replace(/\bCaratteristiche:/g, 'Le caratteristiche principali sono');
  testo = testo.replace(/\bObbiettivo:/g, "L'obiettivo è");
  testo = testo.replace(/\bMetodo:/g, 'Il metodo consiste nel');
  testo = testo.replace(/\bInfluenza:/g, "L'influenza si manifesta in");
  testo = testo.replace(/\bImportanza:/g, "L'importanza risiede nel");
  
  // 4. Aggiungi connettori logici
  testo = testo.replace(/\.\s*([A-Z][^.]*[a-z])\s*:/g, '. $1 include');
  testo = testo.replace(/\.\s*([A-Z][a-z]+)\s+([a-z])/g, '. $1 $2');
  
  // 5. Correggi elenchi sconnessi
  testo = testo.replace(/,\s*([a-z][^,]*),\s*([a-z][^,]*),/g, ', $1 e $2,');
  
  // 6. Aggiungi verbi mancanti
  testo = testo.replace(/\b([A-Z][a-z]+)\s+\((\d{4}-\d{4})\)\s+([a-z])/g, '$1 ($2) è $3');
  
  // 7. Correggi frasi senza verbo
  testo = testo.replace(/\b([A-Z][a-z]+\s+[a-z]+)\s+([a-z][a-z\s]+[a-z])\./g, (match, soggetto, resto) => {
    if (!resto.match(/\b(è|sono|ha|hanno|fa|fanno|dice|dicono|viene|vengono|rappresenta|caratterizza|sviluppa|sostiene)\b/)) {
      return `${soggetto} è ${resto}.`;
    }
    return match;
  });
  
  // 8. Normalizza spazi
  testo = testo.replace(/\s+/g, ' ');
  testo = testo.replace(/\s*\.\s*/g, '. ');
  testo = testo.replace(/\s*,\s*/g, ', ');
  
  // 9. Assicura maiuscola dopo punto
  testo = testo.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  // 10. Correggi errori specifici
  testo = testo.replace(/\bha è\b/g, 'ha');
  testo = testo.replace(/\bè è\b/g, 'è');
  testo = testo.replace(/\bdi è\b/g, 'di');
  testo = testo.replace(/\be è\b/g, 'e');
  testo = testo.replace(/\bin è\b/g, 'in');
  
  // 11. Rimuovi spazi extra
  testo = testo.trim();
  
  return testo;
}

// Funzione per processare un file di contenuti
function processaFile(filePath) {
  console.log(`📝 Processando: ${path.basename(filePath)}`);
  
  try {
    // Leggi il file
    const contenuto = fs.readFileSync(filePath, 'utf8');
    
    // Trova e correggi tutti i riassunti
    let contenutoCorretto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        const riassuntoCorretto = correggiRiassunto(riassunto);
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    // Scrivi il file corretto
    fs.writeFileSync(filePath, contenutoCorretto, 'utf8');
    console.log(`✅ Completato: ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`❌ Errore in ${path.basename(filePath)}:`, error.message);
  }
}

// Lista dei file da processare
const filesDaProcessare = [
  'contenuti-completi-storia.js',
  'contenuti-completi-italiano-NEW.js', 
  'contenuti-completi-latino.js',
  'contenuti-completi-fisica.js',
  'contenuti-completi-matematica.js',
  'contenuti-completi-scienze.js',
  'contenuti-completi-arte.js',
  'contenuti-completi-inglese.js',
  'contenuti-completi-religione.js'
];

// Processa tutti i file
console.log('🚀 Inizio correzione automatica riassunti...\n');

const dataDir = path.join(__dirname, '../data');

filesDaProcessare.forEach(fileName => {
  const filePath = path.join(dataDir, fileName);
  if (fs.existsSync(filePath)) {
    processaFile(filePath);
  } else {
    console.log(`⚠️  File non trovato: ${fileName}`);
  }
});

console.log('\n🎉 Correzione completata per tutte le materie!');
