// Script finale per correggere Matematica, Fisica e Inglese
const fs = require('fs');
const path = require('path');

// Correzioni specifiche per materia
const correzioniMatematica = {
  // Pattern matematici comuni
  'Funzione reale variabile reale è legge': 'Una funzione reale di variabile reale è una legge',
  'Limite descrive comportamento funzione': 'Il limite descrive il comportamento di una funzione',
  'Derivata funzione f(x)': 'La derivata di una funzione f(x)',
  'Integrale definito': "L'integrale definito",
  'Teorema fondamentale': 'Il teorema fondamentale',
  'include': 'comprende',
  'comprende': 'è definito come'
};

const correzioniFisica = {
  // Pattern fisici comuni
  'Campo elettrico E vettore': 'Il campo elettrico E è un vettore che',
  'Corrente elettrica I flusso': 'La corrente elettrica I è il flusso di',
  'Forza magnetica': 'La forza magnetica',
  'Legge di Ohm': 'La legge di Ohm',
  'Principio di sovrapposizione': 'Il principio di sovrapposizione',
  'comprende': 'stabilisce che',
  'include': 'è definito come'
};

const correzioniInglese = {
  // Rimuovi mescolanza italiano-inglese
  'è was': 'è',
  'è were': 'erano',
  'include': 'includono',
  'comprende': 'comprende',
  'and': 'e',
  'with': 'con',
  'of': 'di',
  'the': 'il/la',
  'in': 'in'
};

function applicaCorrezioni(testo, correzioni) {
  let testoCorretto = testo;
  
  // Applica correzioni specifiche
  for (const [pattern, sostituzione] of Object.entries(correzioni)) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    testoCorretto = testoCorretto.replace(regex, sostituzione);
  }
  
  // Correzioni comuni
  testoCorretto = testoCorretto.replace(/\.\./g, '. ');
  testoCorretto = testoCorretto.replace(/\s+/g, ' ');
  testoCorretto = testoCorretto.replace(/\s*\.\s*/g, '. ');
  testoCorretto = testoCorretto.replace(/\s*,\s*/g, ', ');
  testoCorretto = testoCorretto.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  // Rimuovi errori specifici
  testoCorretto = testoCorretto.replace(/\bè\s+è\b/g, 'è');
  testoCorretto = testoCorretto.replace(/\bha\s+è\b/g, 'ha');
  testoCorretto = testoCorretto.replace(/\bdi\s+è\b/g, 'di');
  testoCorretto = testoCorretto.replace(/\be\s+è\b/g, 'e');
  
  return testoCorretto.trim();
}

function correggiFile(filePath, materia) {
  console.log(`📝 Correggendo ${materia.toUpperCase()}: ${path.basename(filePath)}`);
  
  try {
    let contenuto = fs.readFileSync(filePath, 'utf8');
    
    // Scegli correzioni per materia
    let correzioni = {};
    if (materia === 'matematica') correzioni = correzioniMatematica;
    else if (materia === 'fisica') correzioni = correzioniFisica;
    else if (materia === 'inglese') correzioni = correzioniInglese;
    
    // Applica correzioni ai riassunti
    contenuto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        // Evita riassunti troppo lunghi che causano problemi
        if (riassunto.length > 2000) {
          riassunto = riassunto.substring(0, 1800) + '...';
        }
        
        const riassuntoCorretto = applicaCorrezioni(riassunto, correzioni);
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    fs.writeFileSync(filePath, contenuto, 'utf8');
    console.log(`✅ Completato ${materia.toUpperCase()}: ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`❌ Errore in ${materia}: ${error.message}`);
  }
}

// Processa le tre materie
console.log('🚀 Inizio correzione finale Matematica, Fisica e Inglese...\n');

const dataDir = path.join(__dirname, '../data');

const materie = [
  { file: 'contenuti-completi-matematica.js', materia: 'matematica' },
  { file: 'contenuti-completi-fisica.js', materia: 'fisica' },
  { file: 'contenuti-completi-inglese.js', materia: 'inglese' }
];

materie.forEach(({ file, materia }) => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    correggiFile(filePath, materia);
  } else {
    console.log(`⚠️  File non trovato: ${file}`);
  }
});

console.log('\n🎉 Correzione finale completata per Matematica, Fisica e Inglese!');
