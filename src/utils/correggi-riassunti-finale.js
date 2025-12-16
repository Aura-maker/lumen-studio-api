// Script FINALE per correggere completamente tutti i riassunti
const fs = require('fs');
const path = require('path');

function correggiRiassuntoFinale(riassunto) {
  if (!riassunto || typeof riassunto !== 'string') return riassunto;
  
  let testo = riassunto;
  
  // 1. Sostituisci pattern base
  testo = testo.replace(/\.\./g, '. ');
  
  // 2. Correggi "comprende" usato impropriamente (molto comune)
  testo = testo.replace(/\bcomprende\s+([a-z])/g, (match, resto) => {
    // Analizza il contesto per scegliere il verbo giusto
    if (resto.match(/^(ogni|carica|particella|elettrone|fotone)/)) return `stabilisce che ${resto}`;
    if (resto.match(/^(luce|energia|forza|campo)/)) return `descrive ${resto}`;
    if (resto.match(/^(per|quando|se|dove)/)) return `avviene ${resto}`;
    if (resto.match(/^(funzione|equazione|principio)/)) return `si basa su ${resto}`;
    return `include ${resto}`;
  });
  
  // 3. Correggi inizi di frase senza articolo/verbo
  testo = testo.replace(/^([A-Z][a-z]+)\s+(crisi|fisica|movimento|periodo|sistema|teoria|legge|principio|effetto|esperimento|dualità|meccanica)/g, 
    (match, art, nome) => {
      const articoli = {
        'crisi': 'La crisi',
        'fisica': 'La fisica', 
        'movimento': 'Il movimento',
        'periodo': 'Il periodo',
        'sistema': 'Il sistema',
        'teoria': 'La teoria',
        'legge': 'La legge',
        'principio': 'Il principio',
        'effetto': "L'effetto",
        'esperimento': "L'esperimento",
        'dualità': 'La dualità',
        'meccanica': 'La meccanica'
      };
      return articoli[nome] || `${art} ${nome}`;
    });
  
  // 4. Correggi pattern specifici di fisica quantistica
  testo = testo.replace(/\bCorpo nero\s+\(/g, 'Il corpo nero (');
  testo = testo.replace(/\bEffetto fotoelettrico\s+\(/g, "L'effetto fotoelettrico (");
  testo = testo.replace(/\bSpettri atomici\s+\(/g, 'Gli spettri atomici (');
  testo = testo.replace(/\bDualità onda-particella\s+([a-z])/g, 'La dualità onda-particella $1');
  testo = testo.replace(/\bEsperimento doppia\s+è\s+fenditura/g, "L'esperimento della doppia fenditura");
  testo = testo.replace(/\bFotone\s+([a-z])/g, 'Il fotone $1');
  testo = testo.replace(/\bOnda materia\s+De Broglie/g, "L'onda di materia di De Broglie");
  testo = testo.replace(/\bPrincipio indeterminazione\s+Heisenberg/g, 'Il principio di indeterminazione di Heisenberg');
  testo = testo.replace(/\bConseguenze\s+([a-z])/g, 'Le conseguenze $1');
  testo = testo.replace(/\bMeccanica quantistica\s+([a-z])/g, 'La meccanica quantistica $1');
  
  // 5. Correggi pattern matematici e fisici
  testo = testo.replace(/\bE=nhf\b/g, 'E = nhf');
  testo = testo.replace(/\bλ=h\/p\b/g, 'λ = h/p');
  testo = testo.replace(/\bE=hf=ħω\b/g, 'E = hf = ħω');
  testo = testo.replace(/\bp=E\/c=h\/λ\b/g, 'p = E/c = h/λ');
  testo = testo.replace(/\bh=6\.\s*63×10⁻³⁴\b/g, 'h = 6,63×10⁻³⁴');
  testo = testo.replace(/\bħ=h\/2π\b/g, 'ħ = h/2π');
  testo = testo.replace(/\bK=hf-W\b/g, 'K = hf - W');
  testo = testo.replace(/\bλ=h\/\(mv\)\b/g, 'λ = h/(mv)');
  testo = testo.replace(/\bΔx·Δp≥ħ\/2\b/g, 'Δx·Δp ≥ ħ/2');
  testo = testo.replace(/\bΔE·Δt≥ħ\/2\b/g, 'ΔE·Δt ≥ ħ/2');
  
  // 6. Correggi frasi sconnesse tipiche
  testo = testo.replace(/\bsolo se f>f₀ soglia\b/g, 'solo se la frequenza supera una soglia f₀');
  testo = testo.replace(/\benergia cinetica elettroni\b/g, 'energia cinetica degli elettroni');
  testo = testo.replace(/\bindipendente intensità contrario classica\b/g, 'indipendente dall\'intensità contrariamente alla teoria classica');
  testo = testo.replace(/\bimmediato e intensità numero fotoni\b/g, 'immediato e l\'intensità determina il numero di fotoni');
  testo = testo.replace(/\bparticella massa m velocità v\b/g, 'particella di massa m e velocità v');
  testo = testo.replace(/\brisoluzione maggiore ottico\b/g, 'risoluzione maggiore di quello ottico');
  
  // 7. Correggi connessioni logiche
  testo = testo.replace(/\bimpossibile misurare simultaneamente precisione\b/g, 'impossibilità di misurare simultaneamente con precisione');
  testo = testo.replace(/\bnon limitazione tecnica e ma natura quantistica\b/g, 'non è una limitazione tecnica ma deriva dalla natura quantistica');
  testo = testo.replace(/\beletrone atomo non orbita classica, ma orbitale probabilità\b/g, 'elettrone nell\'atomo non segue un\'orbita classica ma occupa un orbitale di probabilità');
  testo = testo.replace(/\bvuoto quantistico fluttuazioni particelle virtuali\b/g, 'vuoto quantistico con fluttuazioni di particelle virtuali');
  testo = testo.replace(/\bimpossibilità determinismo classico\b/g, 'impossibilità del determinismo classico');
  
  // 8. Correggi pattern di meccanica quantistica
  testo = testo.replace(/\bfunzione onda ψ ampiezza probabilità\b/g, 'funzione d\'onda ψ come ampiezza di probabilità');
  testo = testo.replace(/\bequazione Schrödinger\b/g, 'equazione di Schrödinger');
  testo = testo.replace(/\bprobabilità \|ψ\|² e misura collassa stato\b/g, 'probabilità |ψ|² e collasso dello stato durante la misura');
  testo = testo.replace(/\bsovrapposizione stati\b/g, 'sovrapposizione di stati');
  testo = testo.replace(/\bentanglement quantistico\b/g, 'entanglement quantistico');
  
  // 9. Aggiungi connettori dove necessario
  testo = testo.replace(/\)\s*,\s*([a-z])/g, '), $1');
  testo = testo.replace(/\)\s+e\s+([a-z])/g, ') e $1');
  testo = testo.replace(/\bmentre\s+([a-z])/g, 'mentre $1');
  testo = testo.replace(/\bquando\s+([a-z])/g, 'quando $1');
  testo = testo.replace(/\bdove\s+([a-z])/g, 'dove $1');
  
  // 10. Normalizza punteggiatura e spazi
  testo = testo.replace(/\s+/g, ' ');
  testo = testo.replace(/\s*\.\s*/g, '. ');
  testo = testo.replace(/\s*,\s*/g, ', ');
  testo = testo.replace(/\s*:\s*/g, ': ');
  testo = testo.replace(/\s*;\s*/g, '; ');
  
  // 11. Maiuscola dopo punto
  testo = testo.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  // 12. Correggi errori residui
  testo = testo.replace(/\bè\s+([a-z])/g, '$1');
  testo = testo.replace(/\bha\s+è\b/g, 'ha');
  testo = testo.replace(/\bdi\s+è\b/g, 'di');
  testo = testo.replace(/\be\s+è\b/g, 'e');
  testo = testo.replace(/\bin\s+è\b/g, 'in');
  
  // 13. Rimuovi spazi extra
  testo = testo.trim();
  testo = testo.replace(/\s{2,}/g, ' ');
  
  return testo;
}

// Funzione per processare un file
function processaFileFinale(filePath) {
  console.log(`📝 Processando FINALE: ${path.basename(filePath)}`);
  
  try {
    const contenuto = fs.readFileSync(filePath, 'utf8');
    
    let contenutoCorretto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        const riassuntoCorretto = correggiRiassuntoFinale(riassunto);
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    fs.writeFileSync(filePath, contenutoCorretto, 'utf8');
    console.log(`✅ Completato FINALE: ${path.basename(filePath)}`);
    
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

console.log('🚀 Inizio correzione FINALE riassunti...\n');

const dataDir = path.join(__dirname, '../data');

filesDaProcessare.forEach(fileName => {
  const filePath = path.join(dataDir, fileName);
  if (fs.existsSync(filePath)) {
    processaFileFinale(filePath);
  } else {
    console.log(`⚠️  File non trovato: ${fileName}`);
  }
});

console.log('\n🎉 Correzione FINALE completata per tutte le materie!');
