// Script finale per sistemare TUTTI i riassunti telegrafici rimanenti
const fs = require('fs');
const path = require('path');

// Correzioni specifiche per ogni materia
const correzioniSpecifiche = {
  matematica: {
    patterns: [
      { from: /\bè\s+/g, to: 'è ' },
      { from: /\bcomprende\b/g, to: 'include' },
      { from: /\bstabilisce che\b/g, to: 'stabilisce che' },
      { from: /\bpermette\b/g, to: 'permette di' },
      { from: /\bconsente\b/g, to: 'consente di' }
    ]
  },
  fisica: {
    patterns: [
      { from: /\bCampo\s/g, to: 'Il campo ' },
      { from: /\bLegge\s/g, to: 'La legge ' },
      { from: /\bEquazioni\s/g, to: 'Le equazioni ' },
      { from: /\bPostulati\s/g, to: 'I postulati ' },
      { from: /\bEquivalenza\s/g, to: "L'equivalenza " },
      { from: /\bFisica\s/g, to: 'La fisica ' }
    ]
  },
  scienze: {
    patterns: [
      { from: /\bLegami\s/g, to: 'I legami ' },
      { from: /\bReazioni\s/g, to: 'Le reazioni ' },
      { from: /\bMembrana\s/g, to: 'La membrana ' },
      { from: /\bOrganuli\s/g, to: 'Gli organuli ' },
      { from: /\bDivisione\s/g, to: 'La divisione ' },
      { from: /\bDNA\s/g, to: 'Il DNA ' },
      { from: /\bMutazioni\s/g, to: 'Le mutazioni ' },
      { from: /\bIngegneria\s/g, to: "L'ingegneria " }
    ]
  },
  latino: {
    patterns: [
      { from: /\bStoicismo\s/g, to: 'Lo stoicismo ' },
      { from: /\bEpistole\s/g, to: 'Le epistole ' },
      { from: /\bTragedie\s/g, to: 'Le tragedie ' },
      { from: /\bStile\s/g, to: 'Lo stile ' },
      { from: /\bAnalisi\s/g, to: "L'analisi " }
    ]
  }
};

function sistemaTestoCompleto(testo, materia) {
  let testoCorretto = testo;
  
  // Applica correzioni specifiche per materia
  if (correzioniSpecifiche[materia]) {
    correzioniSpecifiche[materia].patterns.forEach(({ from, to }) => {
      testoCorretto = testoCorretto.replace(from, to);
    });
  }
  
  // Correzioni generali per eliminare stile telegrafico
  
  // Aggiungi articoli mancanti
  testoCorretto = testoCorretto.replace(/\b([A-Z][a-z]+)\s+(è|sono|ha|hanno|può|possono|deve|devono|include|comprende)/g, 
    (match, parola, verbo) => {
      const articoli = {
        'Calcolo': 'Il calcolo',
        'Variabili': 'Le variabili',
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
        'Analisi': "L'analisi"
      };
      
      return articoli[parola] ? `${articoli[parola]} ${verbo}` : match;
    });
  
  // Migliora connettori
  testoCorretto = testoCorretto.replace(/\s+e\s+/g, ' e ');
  testoCorretto = testoCorretto.replace(/\s+con\s+/g, ' con ');
  testoCorretto = testoCorretto.replace(/\s+per\s+/g, ' per ');
  testoCorretto = testoCorretto.replace(/\s+di\s+/g, ' di ');
  testoCorretto = testoCorretto.replace(/\s+in\s+/g, ' in ');
  testoCorretto = testoCorretto.replace(/\s+da\s+/g, ' da ');
  testoCorretto = testoCorretto.replace(/\s+che\s+/g, ' che ');
  testoCorretto = testoCorretto.replace(/\s+dove\s+/g, ' dove ');
  testoCorretto = testoCorretto.replace(/\s+quando\s+/g, ' quando ');
  
  // Elimina errori telegrafici comuni
  testoCorretto = testoCorretto.replace(/\bè\s+è\b/g, 'è');
  testoCorretto = testoCorretto.replace(/\bha\s+è\b/g, 'ha');
  testoCorretto = testoCorretto.replace(/\bdi\s+è\b/g, 'di');
  testoCorretto = testoCorretto.replace(/\be\s+è\b/g, 'e');
  testoCorretto = testoCorretto.replace(/\bcomprende\s+è\b/g, 'comprende');
  testoCorretto = testoCorretto.replace(/\binclude\s+è\b/g, 'include');
  
  // Migliora punteggiatura
  testoCorretto = testoCorretto.replace(/\s*\.\s*/g, '. ');
  testoCorretto = testoCorretto.replace(/\s*,\s*/g, ', ');
  testoCorretto = testoCorretto.replace(/\s*:\s*/g, ': ');
  testoCorretto = testoCorretto.replace(/\s*;\s*/g, '; ');
  
  // Correggi maiuscole dopo punti
  testoCorretto = testoCorretto.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  // Rimuovi spazi multipli
  testoCorretto = testoCorretto.replace(/\s+/g, ' ');
  
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
        // Evita riassunti troppo lunghi che causano problemi
        if (riassunto.length > 3000) {
          riassunto = riassunto.substring(0, 2800) + '...';
        }
        
        const riassuntoCorretto = sistemaTestoCompleto(riassunto, nomeMateria.toLowerCase());
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

// Processa tutte le materie
console.log('🚀 Sistemazione finale COMPLETA di tutti i riassunti telegrafici...\n');

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

console.log('\n🎉 Sistemazione finale COMPLETA di tutti i riassunti telegrafici completata!');
