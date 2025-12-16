// Script per eliminare completamente lo stile telegrafico da Matematica e Fisica
const fs = require('fs');
const path = require('path');

function sistemaRiassuntoTelegrafico(testo) {
  let testoCorretto = testo;
  
  // Rimuovi "è definito come" ripetuto
  testoCorretto = testoCorretto.replace(/\s+è\s+definito\s+come\s+/gi, ' ');
  testoCorretto = testoCorretto.replace(/\s+stabilisce\s+che\s+/gi, ' ');
  testoCorretto = testoCorretto.replace(/\s+comprende\s+/gi, ' include ');
  
  // Aggiungi articoli mancanti
  testoCorretto = testoCorretto.replace(/\bFunzione\s/g, 'La funzione ');
  testoCorretto = testoCorretto.replace(/\bDerivata\s/g, 'La derivata ');
  testoCorretto = testoCorretto.replace(/\bLimite\s/g, 'Il limite ');
  testoCorretto = testoCorretto.replace(/\bIntegrale\s/g, "L'integrale ");
  testoCorretto = testoCorretto.replace(/\bTeorema\s/g, 'Il teorema ');
  testoCorretto = testoCorretto.replace(/\bCampo\s/g, 'Il campo ');
  testoCorretto = testoCorretto.replace(/\bCorrente\s/g, 'La corrente ');
  testoCorretto = testoCorretto.replace(/\bForza\s/g, 'La forza ');
  testoCorretto = testoCorretto.replace(/\bEnergia\s/g, "L'energia ");
  testoCorretto = testoCorretto.replace(/\bPotenziale\s/g, 'Il potenziale ');
  
  // Migliora connettori
  testoCorretto = testoCorretto.replace(/\s+e\s+/g, ' e ');
  testoCorretto = testoCorretto.replace(/\s+con\s+/g, ' con ');
  testoCorretto = testoCorretto.replace(/\s+per\s+/g, ' per ');
  testoCorretto = testoCorretto.replace(/\s+di\s+/g, ' di ');
  testoCorretto = testoCorretto.replace(/\s+in\s+/g, ' in ');
  testoCorretto = testoCorretto.replace(/\s+da\s+/g, ' da ');
  
  // Sistemi frasi spezzate
  testoCorretto = testoCorretto.replace(/\.\s*([a-z])/g, (match, letter) => '. ' + letter.toUpperCase());
  testoCorretto = testoCorretto.replace(/,\s*([A-Z])/g, (match, letter) => ', ' + letter.toLowerCase());
  
  // Rimuovi doppie congiunzioni
  testoCorretto = testoCorretto.replace(/\s+e\s+e\s+/g, ' e ');
  testoCorretto = testoCorretto.replace(/\s+di\s+di\s+/g, ' di ');
  testoCorretto = testoCorretto.replace(/\s+con\s+con\s+/g, ' con ');
  
  // Migliora punteggiatura
  testoCorretto = testoCorretto.replace(/\s*\.\s*/g, '. ');
  testoCorretto = testoCorretto.replace(/\s*,\s*/g, ', ');
  testoCorretto = testoCorretto.replace(/\s*:\s*/g, ': ');
  testoCorretto = testoCorretto.replace(/\s*;\s*/g, '; ');
  
  // Rimuovi spazi multipli
  testoCorretto = testoCorretto.replace(/\s+/g, ' ');
  
  return testoCorretto.trim();
}

function correggiFile(filePath, nomeMateria) {
  console.log(`📝 Sistemando ${nomeMateria}: ${path.basename(filePath)}`);
  
  try {
    let contenuto = fs.readFileSync(filePath, 'utf8');
    
    // Conta riassunti telegrafici prima
    const riassuntiPrima = (contenuto.match(/"riassunto":\s*"[^"]*è definito come[^"]*"/g) || []).length;
    
    // Applica correzioni ai riassunti
    contenuto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        const riassuntoCorretto = sistemaRiassuntoTelegrafico(riassunto);
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    // Conta riassunti telegrafici dopo
    const riassuntiDopo = (contenuto.match(/"riassunto":\s*"[^"]*è definito come[^"]*"/g) || []).length;
    
    fs.writeFileSync(filePath, contenuto, 'utf8');
    
    console.log(`✅ ${nomeMateria}: ${riassuntiPrima - riassuntiDopo} riassunti telegrafici sistemati`);
    
  } catch (error) {
    console.error(`❌ Errore in ${nomeMateria}: ${error.message}`);
  }
}

// Processa Matematica e Fisica
console.log('🚀 Eliminazione stile telegrafico da Matematica e Fisica...\n');

const dataDir = path.join(__dirname, '../data');

const materie = [
  { file: 'contenuti-completi-matematica.js', nome: 'MATEMATICA' },
  { file: 'contenuti-completi-fisica.js', nome: 'FISICA' }
];

materie.forEach(({ file, nome }) => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    correggiFile(filePath, nome);
  } else {
    console.log(`⚠️  File non trovato: ${file}`);
  }
});

console.log('\n🎉 Eliminazione stile telegrafico completata!');
