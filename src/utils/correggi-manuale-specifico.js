// Script per correzione manuale specifica di Arte, Scienze e Matematica
const fs = require('fs');
const path = require('path');

function correggiRiassuntoSpecifico(riassunto, materia) {
  if (!riassunto || typeof riassunto !== 'string') return riassunto;
  
  let testo = riassunto;
  
  // Correzioni base comuni
  testo = testo.replace(/\.\./g, '. ');
  testo = testo.replace(/\binclude\b/g, 'comprende');
  testo = testo.replace(/\bcomprende\b/g, 'include');
  
  if (materia === 'arte') {
    // Correzioni specifiche per Arte
    testo = testo.replace(/^([A-Z][a-z]+\s+[A-Z][a-z]+)\s+\((\d{4}-\d{4})\)\s+è\s+([a-z])/g, '$1 ($2) è $3');
    testo = testo.replace(/\bNasce\s+([A-Z][a-z]+)\s+([A-Z][a-z]+)/g, 'Nasce a $1 in $2');
    testo = testo.replace(/\bstudia\s+([A-Z][a-z]+)/g, 'studia a $1');
    testo = testo.replace(/\bRoma\s+(\d{4})\s+successo/g, 'Roma nel $1 dove ottiene il successo');
    testo = testo.replace(/\bprotetto\s+papi\s+([A-Z])/g, 'protetto dai papi $1');
    testo = testo.replace(/\bopere\s+per\s+tutta\s+Europa/g, 'le sue opere si diffondono in tutta Europa');
    
    // Correzioni per stile artistico
    testo = testo.replace(/\bIdeale\s+bellezza\s+include/g, 'Il suo ideale di bellezza si basa su');
    testo = testo.replace(/\bimitazione\s+sublime\s+natura/g, "l'imitazione sublime della natura");
    testo = testo.replace(/\bforme\s+pure\s+armoniose\s+idealizzate/g, 'forme pure, armoniose e idealizzate');
    testo = testo.replace(/\blevigatura\s+marmo\s+estrema\s+effetto\s+carne\s+morbida/g, 'levigatura del marmo estrema che crea l\'effetto di carne morbida');
    
    // Correzioni per opere d'arte
    testo = testo.replace(/\bTemi\s+mitologici\s+include/g, 'I temi mitologici includono');
    testo = testo.replace(/\bAmore\s+Psiche\s+\(varie\s+versioni\s+bacio,\s+stante\)/g, 'Amore e Psiche in varie versioni del bacio e stante');
    testo = testo.replace(/\bPaolina\s+Borghese\s+come\s+Venere\s+vincitrice\s+\(ritratto\s+idealizzato\s+sorella\s+Napoleone\)/g, 'Paolina Borghese come Venere vincitrice che è un ritratto idealizzato della sorella di Napoleone');
    testo = testo.replace(/\bTre\s+Grazie\s+\(grazia\s+femminile\s+massima\s+espressione\)/g, 'le Tre Grazie che rappresentano la massima espressione della grazia femminile');
    
    // Correzioni per tecnica artistica
    testo = testo.replace(/\bTecnica\s+include/g, 'La sua tecnica prevede');
    testo = testo.replace(/\bmodello\s+creta,\s+calco\s+gesso\s+e\s+puntinatura\s+marmo/g, 'il modello in creta, il calco in gesso e la puntinatura per il marmo');
    testo = testo.replace(/\blevigatura\s+maniacale\s+e\s+raramente\s+dipinge\s+statue/g, 'levigatura maniacale, e raramente dipinge le statue');
    
    // Correzioni per teoria artistica
    testo = testo.replace(/\bTeoria\s+include/g, 'La sua teoria si basa su');
    testo = testo.replace(/\bbello\s+ideale\s+sintesi\s+osservazione\s+natura\s+canoni\s+classici/g, 'il bello ideale come sintesi tra osservazione della natura e canoni classici');
    
  } else if (materia === 'scienze') {
    // Correzioni specifiche per Scienze
    testo = testo.replace(/^([A-Z][a-z]+)\s+(teoria|legge|principio|processo)/g, 'La $2 di $1');
    testo = testo.replace(/\bCellula\s+unità\s+base/g, 'La cellula è l\'unità base');
    testo = testo.replace(/\bDNA\s+acido\s+desossiribonucleico/g, 'Il DNA è l\'acido desossiribonucleico');
    testo = testo.replace(/\bFotosintesi\s+processo/g, 'La fotosintesi è il processo');
    testo = testo.replace(/\bRespirazioni\s+cellulare/g, 'La respirazione cellulare');
    testo = testo.replace(/\bMitosi\s+divisione/g, 'La mitosi è la divisione');
    testo = testo.replace(/\bMeiosi\s+divisione/g, 'La meiosi è la divisione');
    
    // Correzioni per formule chimiche
    testo = testo.replace(/\bH2O\b/g, 'H₂O');
    testo = testo.replace(/\bCO2\b/g, 'CO₂');
    testo = testo.replace(/\bO2\b/g, 'O₂');
    testo = testo.replace(/\bC6H12O6\b/g, 'C₆H₁₂O₆');
    
  } else if (materia === 'matematica') {
    // Correzioni specifiche per Matematica
    testo = testo.replace(/^([A-Z][a-z]+)\s+(funzione|derivata|integrale|limite|teorema)/g, 'La $2 $1');
    testo = testo.replace(/\bDerivata\s+funzione/g, 'La derivata di una funzione');
    testo = testo.replace(/\bIntegrale\s+definito/g, "L'integrale definito");
    testo = testo.replace(/\bLimite\s+funzione/g, 'Il limite di una funzione');
    testo = testo.replace(/\bTeorema\s+fondamentale/g, 'Il teorema fondamentale');
    
    // Correzioni per formule matematiche
    testo = testo.replace(/\bf\(x\)/g, 'f(x)');
    testo = testo.replace(/\bf'\(x\)/g, "f'(x)");
    testo = testo.replace(/\bdx\b/g, 'dx');
    testo = testo.replace(/\bdy\b/g, 'dy');
    testo = testo.replace(/\b∫\b/g, '∫');
    testo = testo.replace(/\b∞\b/g, '∞');
  }
  
  // Correzioni finali comuni
  testo = testo.replace(/\s+/g, ' ');
  testo = testo.replace(/\s*\.\s*/g, '. ');
  testo = testo.replace(/\s*,\s*/g, ', ');
  testo = testo.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  // Correzioni errori specifici
  testo = testo.replace(/\bè\s+include\b/g, 'include');
  testo = testo.replace(/\bha\s+è\b/g, 'ha');
  testo = testo.replace(/\bdi\s+è\b/g, 'di');
  testo = testo.replace(/\be\s+è\b/g, 'e');
  
  return testo.trim();
}

function processaFileSpecifico(filePath, materia) {
  console.log(`📝 Processando ${materia.toUpperCase()}: ${path.basename(filePath)}`);
  
  try {
    const contenuto = fs.readFileSync(filePath, 'utf8');
    
    let contenutoCorretto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        const riassuntoCorretto = correggiRiassuntoSpecifico(riassunto, materia);
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    fs.writeFileSync(filePath, contenutoCorretto, 'utf8');
    console.log(`✅ Completato ${materia.toUpperCase()}: ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`❌ Errore in ${path.basename(filePath)}:`, error.message);
  }
}

// Processa le tre materie specifiche
console.log('🚀 Inizio correzione MANUALE specifica...\n');

const dataDir = path.join(__dirname, '../data');

const materieDaProcessare = [
  { file: 'contenuti-completi-arte.js', materia: 'arte' },
  { file: 'contenuti-completi-scienze.js', materia: 'scienze' },
  { file: 'contenuti-completi-matematica.js', materia: 'matematica' }
];

materieDaProcessare.forEach(({ file, materia }) => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    processaFileSpecifico(filePath, materia);
  } else {
    console.log(`⚠️  File non trovato: ${file}`);
  }
});

console.log('\n🎉 Correzione MANUALE specifica completata!');
