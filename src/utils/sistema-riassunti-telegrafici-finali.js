// Script finale per sistemare tutti i riassunti telegrafici rimanenti
const fs = require('fs');
const path = require('path');

// Correzioni specifiche per eliminare completamente lo stile telegrafico
function sistemaTestoTelegrafico(testo) {
  let testoCorretto = testo;
  
  // Aggiungi articoli mancanti all'inizio delle frasi
  testoCorretto = testoCorretto.replace(/\b([A-Z][a-z]+)\s+(è|sono|ha|hanno|può|possono|deve|devono)/g, (match, parola, verbo) => {
    const articoli = {
      'Integrale': "L'integrale",
      'Calcolo': 'Il calcolo',
      'Variabili': 'Le variabili',
      'Condensatori': 'I condensatori',
      'Campo': 'Il campo',
      'Legge': 'La legge',
      'Equazioni': 'Le equazioni',
      'Postulati': 'I postulati',
      'Equivalenza': "L'equivalenza",
      'Fisica': 'La fisica',
      'Legami': 'I legami',
      'Reazioni': 'Le reazioni',
      'Membrana': 'La membrana',
      'Organuli': 'Gli organuli',
      'Divisione': 'La divisione',
      'Mendel': 'Mendel',
      'DNA': 'Il DNA',
      'Mutazioni': 'Le mutazioni',
      'Ingegneria': "L'ingegneria",
      'Darwin': 'Darwin',
      'Neodarwinismo': 'Il neodarwinismo',
      'Meccanismi': 'I meccanismi',
      'PCR': 'La PCR',
      'Clonazione': 'La clonazione',
      'Terapie': 'Le terapie',
      'Stoicismo': 'Lo stoicismo',
      'Epistole': 'Le epistole',
      'Tragedie': 'Le tragedie',
      'Stile': 'Lo stile',
      'Tacito': 'Tacito',
      'Plinio': 'Plinio',
      'Apuleio': 'Apuleio',
      'Analisi': "L'analisi"
    };
    
    return articoli[parola] ? `${articoli[parola]} ${verbo}` : match;
  });
  
  // Migliora connettori e congiunzioni
  testoCorretto = testoCorretto.replace(/\s+e\s+/g, ' e ');
  testoCorretto = testoCorretto.replace(/\s+con\s+/g, ' con ');
  testoCorretto = testoCorretto.replace(/\s+per\s+/g, ' per ');
  testoCorretto = testoCorretto.replace(/\s+di\s+/g, ' di ');
  testoCorretto = testoCorretto.replace(/\s+in\s+/g, ' in ');
  testoCorretto = testoCorretto.replace(/\s+da\s+/g, ' da ');
  testoCorretto = testoCorretto.replace(/\s+che\s+/g, ' che ');
  testoCorretto = testoCorretto.replace(/\s+dove\s+/g, ' dove ');
  testoCorretto = testoCorretto.replace(/\s+quando\s+/g, ' quando ');
  
  // Sostituisci frasi telegrafiche comuni
  testoCorretto = testoCorretto.replace(/\bcomprende\b/g, 'include');
  testoCorretto = testoCorretto.replace(/\bstabilisce che\b/g, 'stabilisce che');
  testoCorretto = testoCorretto.replace(/\bpermette\b/g, 'permette di');
  testoCorretto = testoCorretto.replace(/\bconsente\b/g, 'consente di');
  
  // Migliora frasi spezzate tipiche dello stile telegrafico
  testoCorretto = testoCorretto.replace(/([a-z])\s*:\s*([a-z])/g, '$1: $2');
  testoCorretto = testoCorretto.replace(/([a-z])\s*;\s*([a-z])/g, '$1; $2');
  testoCorretto = testoCorretto.replace(/([a-z])\s*,\s*([a-z])/g, '$1, $2');
  
  // Correggi punteggiatura
  testoCorretto = testoCorretto.replace(/\s*\.\s*/g, '. ');
  testoCorretto = testoCorretto.replace(/\s*,\s*/g, ', ');
  testoCorretto = testoCorretto.replace(/\s*:\s*/g, ': ');
  testoCorretto = testoCorretto.replace(/\s*;\s*/g, '; ');
  
  // Rimuovi spazi multipli
  testoCorretto = testoCorretto.replace(/\s+/g, ' ');
  
  // Correggi maiuscole dopo punti
  testoCorretto = testoCorretto.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  return testoCorretto.trim();
}

function correggiFile(filePath, nomeMateria) {
  console.log(`📝 Sistemando ${nomeMateria}: ${path.basename(filePath)}`);
  
  try {
    let contenuto = fs.readFileSync(filePath, 'utf8');
    let correzioni = 0;
    
    // Applica correzioni ai riassunti
    contenuto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        const riassuntoCorretto = sistemaTestoTelegrafico(riassunto);
        if (riassunto !== riassuntoCorretto) {
          correzioni++;
        }
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    fs.writeFileSync(filePath, contenuto, 'utf8');
    console.log(`✅ ${nomeMateria}: ${correzioni} riassunti sistemati`);
    
  } catch (error) {
    console.error(`❌ Errore in ${nomeMateria}: ${error.message}`);
  }
}

// Processa le materie richieste
console.log('🚀 Sistemazione finale riassunti telegrafici...\n');

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

console.log('\n🎉 Sistemazione finale completata!');
