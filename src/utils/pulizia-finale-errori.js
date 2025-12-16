// Script finale per eliminare tutti gli errori di duplicazione e problemi residui
const fs = require('fs');
const path = require('path');

function pulisciTestoFinale(testo) {
  let testoCorretto = testo;
  
  // ELIMINAZIONE ERRORI DI DUPLICAZIONE
  
  // 1. Articoli duplicati
  testoCorretto = testoCorretto.replace(/\bl'l'/g, "l'");
  testoCorretto = testoCorretto.replace(/\bla la\b/g, 'la');
  testoCorretto = testoCorretto.replace(/\bil il\b/g, 'il');
  testoCorretto = testoCorretto.replace(/\blo lo\b/g, 'lo');
  testoCorretto = testoCorretto.replace(/\ble le\b/g, 'le');
  testoCorretto = testoCorretto.replace(/\bgli gli\b/g, 'gli');
  testoCorretto = testoCorretto.replace(/\bun un\b/g, 'un');
  testoCorretto = testoCorretto.replace(/\buna una\b/g, 'una');
  
  // 2. Preposizioni duplicate
  testoCorretto = testoCorretto.replace(/\bdi di\b/g, 'di');
  testoCorretto = testoCorretto.replace(/\bda da\b/g, 'da');
  testoCorretto = testoCorretto.replace(/\bin in\b/g, 'in');
  testoCorretto = testoCorretto.replace(/\bcon con\b/g, 'con');
  testoCorretto = testoCorretto.replace(/\bper per\b/g, 'per');
  testoCorretto = testoCorretto.replace(/\btra tra\b/g, 'tra');
  testoCorretto = testoCorretto.replace(/\bsu su\b/g, 'su');
  
  // 3. Congiunzioni duplicate
  testoCorretto = testoCorretto.replace(/\be e\b/g, 'e');
  testoCorretto = testoCorretto.replace(/\bo o\b/g, 'o');
  testoCorretto = testoCorretto.replace(/\bma ma\b/g, 'ma');
  testoCorretto = testoCorretto.replace(/\bche che\b/g, 'che');
  testoCorretto = testoCorretto.replace(/\bse se\b/g, 'se');
  
  // 4. Verbi duplicati
  testoCorretto = testoCorretto.replace(/\bè è\b/g, 'è');
  testoCorretto = testoCorretto.replace(/\bsono sono\b/g, 'sono');
  testoCorretto = testoCorretto.replace(/\bha ha\b/g, 'ha');
  testoCorretto = testoCorretto.replace(/\bhanno hanno\b/g, 'hanno');
  
  // 5. Spazi multipli
  testoCorretto = testoCorretto.replace(/\s+/g, ' ');
  
  // 6. Punteggiatura corretta
  testoCorretto = testoCorretto.replace(/\s*\.\s*/g, '. ');
  testoCorretto = testoCorretto.replace(/\s*,\s*/g, ', ');
  testoCorretto = testoCorretto.replace(/\s*:\s*/g, ': ');
  testoCorretto = testoCorretto.replace(/\s*;\s*/g, '; ');
  
  // 7. Maiuscole dopo punti
  testoCorretto = testoCorretto.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  // 8. Correzioni specifiche per date
  testoCorretto = testoCorretto.replace(/\bd\.\s*C\./g, 'd.C.');
  testoCorretto = testoCorretto.replace(/\ba\.\s*C\./g, 'a.C.');
  
  // 9. Correzioni per numeri
  testoCorretto = testoCorretto.replace(/(\d+)\s*-\s*(\d+)/g, '$1-$2');
  
  return testoCorretto.trim();
}

function correggiFile(filePath, nomeMateria) {
  console.log(`🧹 Pulizia finale ${nomeMateria}: ${path.basename(filePath)}`);
  
  try {
    let contenuto = fs.readFileSync(filePath, 'utf8');
    let correzioni = 0;
    
    // Applica pulizia finale ai riassunti
    contenuto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        const riassuntoOriginale = riassunto;
        const riassuntoCorretto = pulisciTestoFinale(riassunto);
        
        if (riassuntoOriginale !== riassuntoCorretto) {
          correzioni++;
        }
        
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    fs.writeFileSync(filePath, contenuto, 'utf8');
    console.log(`✅ ${nomeMateria}: ${correzioni} errori corretti`);
    
  } catch (error) {
    console.error(`❌ Errore in ${nomeMateria}: ${error.message}`);
  }
}

// Processa tutte le materie con pulizia finale
console.log('🧹 PULIZIA FINALE di tutti gli errori residui...\n');

const dataDir = path.join(__dirname, '../data');

const materie = [
  { file: 'contenuti-completi-matematica.js', nome: 'MATEMATICA' },
  { file: 'contenuti-completi-fisica.js', nome: 'FISICA' },
  { file: 'contenuti-completi-scienze.js', nome: 'SCIENZE' },
  { file: 'contenuti-completi-latino.js', nome: 'LATINO' }
];

materie.forEach(({ file, nome }) => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    correggiFile(filePath, nome);
  } else {
    console.log(`⚠️  File non trovato: ${file}`);
  }
});

console.log('\n🎉 PULIZIA FINALE completata! Tutti gli errori eliminati!');
