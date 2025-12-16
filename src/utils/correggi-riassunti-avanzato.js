// Script avanzato per correggere riassunti in stile telegrafico
const fs = require('fs');
const path = require('path');

function correggiRiassuntoAvanzato(riassunto) {
  if (!riassunto || typeof riassunto !== 'string') return riassunto;
  
  let testo = riassunto;
  
  // 1. Sostituisci pattern specifici problematici
  testo = testo.replace(/\.\./g, '. ');
  
  // 2. Correggi "include" usato impropriamente
  testo = testo.replace(/\binclude\b/g, 'comprende');
  testo = testo.replace(/\bcomprende\s+per\b/g, 'avviene per');
  testo = testo.replace(/\bcomprende\s+ogni\b/g, 'stabilisce che ogni');
  testo = testo.replace(/\bcomprende\s+carica\b/g, 'afferma che la carica');
  testo = testo.replace(/\bcomprende\s+forza\b/g, 'descrive la forza');
  
  // 3. Aggiungi articoli e verbi mancanti all'inizio
  testo = testo.replace(/^([A-Z][a-z]+\s+[a-z]+)\s+proprietà\s+fondamentale/g, '$1 è una proprietà fondamentale');
  testo = testo.replace(/^([A-Z][a-z]+)\s+movimento\s+culturale/g, '$1 è un movimento culturale');
  testo = testo.replace(/^([A-Z][a-z]+)\s+filosofo/g, '$1 è un filosofo');
  testo = testo.replace(/^([A-Z][a-z]+)\s+scrittore/g, '$1 è uno scrittore');
  
  // 4. Correggi pattern "esistente due tipi"
  testo = testo.replace(/esistente\s+due\s+tipi:/g, 'che esiste in due tipi:');
  
  // 5. Correggi elenchi con "e" ripetuto
  testo = testo.replace(/\s+e\s+([a-z][^.]*?)\s+e\s+/g, ', $1 e ');
  
  // 6. Aggiungi articoli determinativi
  testo = testo.replace(/\bUnità\s+misura\b/g, "L'unità di misura");
  testo = testo.replace(/\bQuantizzazione\s+carica\b/g, 'La quantizzazione della carica');
  testo = testo.replace(/\bConservazione\s+carica\b/g, 'La conservazione della carica');
  testo = testo.replace(/\bElettrizzazione\b/g, "L'elettrizzazione");
  testo = testo.replace(/\bLegge\s+([A-Z][a-z]+)\b/g, 'La legge di $1');
  
  // 7. Correggi frasi senza verbo principale
  testo = testo.replace(/\bCariche\s+stesso\s+segno\s+si\s+respingono/g, 'Le cariche dello stesso segno si respingono');
  testo = testo.replace(/\bsegno\s+opposto\s+attraggono/g, 'quelle di segno opposto si attraggono');
  
  // 8. Correggi pattern matematici
  testo = testo.replace(/\be\s*=\s*1\.\s*6/g, 'e = 1,6');
  testo = testo.replace(/\bk\s*=\s*8\.\s*99/g, 'k = 8,99');
  
  // 9. Correggi connettori logici
  testo = testo.replace(/\.\s*([A-Z][a-z]+)\s+([a-z])/g, '. $1 $2');
  testo = testo.replace(/\bmentre\s+([a-z])/g, 'mentre $1');
  
  // 10. Aggiungi connettori dove mancano
  testo = testo.replace(/\.\s*([A-Z][a-z]+\s+[a-z]+)\s+([a-z])/g, '. $1 $2');
  
  // 11. Correggi pattern specifici di fisica
  testo = testo.replace(/\bConduttori\s+([a-z])/g, 'I conduttori $1');
  testo = testo.replace(/\bisolanti\s+\(dielettrici\)\s+([a-z])/g, 'gli isolanti o dielettrici $1');
  testo = testo.replace(/\bForza\s+centrale\s+lungo/g, 'La forza è centrale lungo');
  testo = testo.replace(/\bPrincipio\s+sovrapposizione/g, 'Il principio di sovrapposizione');
  testo = testo.replace(/\bConfronto\s+forza/g, 'Nel confronto tra forza');
  testo = testo.replace(/\bApplicazioni\s+([a-z])/g, 'Le applicazioni $1');
  
  // 12. Correggi pattern di storia
  testo = testo.replace(/\bCause\s+economiche:/g, 'Le cause economiche includono');
  testo = testo.replace(/\bCause\s+sociali:/g, 'Le cause sociali derivano da');
  testo = testo.replace(/\bCause\s+politiche:/g, 'Le cause politiche comprendono');
  testo = testo.replace(/\bCause\s+immediate:/g, 'Le cause immediate sono');
  
  // 13. Normalizza punteggiatura
  testo = testo.replace(/\s+/g, ' ');
  testo = testo.replace(/\s*\.\s*/g, '. ');
  testo = testo.replace(/\s*,\s*/g, ', ');
  testo = testo.replace(/\s*:\s*/g, ': ');
  
  // 14. Maiuscola dopo punto
  testo = testo.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  // 15. Correggi errori specifici
  testo = testo.replace(/\bè\s+comprende\b/g, 'comprende');
  testo = testo.replace(/\bha\s+è\b/g, 'ha');
  testo = testo.replace(/\bdi\s+è\b/g, 'di');
  testo = testo.replace(/\be\s+è\b/g, 'e');
  
  // 16. Rimuovi spazi extra e normalizza
  testo = testo.trim();
  testo = testo.replace(/\s{2,}/g, ' ');
  
  return testo;
}

// Funzione per processare un file
function processaFileAvanzato(filePath) {
  console.log(`📝 Processando avanzato: ${path.basename(filePath)}`);
  
  try {
    const contenuto = fs.readFileSync(filePath, 'utf8');
    
    let contenutoCorretto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        const riassuntoCorretto = correggiRiassuntoAvanzato(riassunto);
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    fs.writeFileSync(filePath, contenutoCorretto, 'utf8');
    console.log(`✅ Completato avanzato: ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`❌ Errore in ${path.basename(filePath)}:`, error.message);
  }
}

// Lista file da processare
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

console.log('🚀 Inizio correzione AVANZATA riassunti...\n');

const dataDir = path.join(__dirname, '../data');

filesDaProcessare.forEach(fileName => {
  const filePath = path.join(dataDir, fileName);
  if (fs.existsSync(filePath)) {
    processaFileAvanzato(filePath);
  } else {
    console.log(`⚠️  File non trovato: ${fileName}`);
  }
});

console.log('\n🎉 Correzione AVANZATA completata!');
