// Script per correzione manuale completa di TUTTI i riassunti telegrafici
const fs = require('fs');
const path = require('path');

function sistemaTestoCompletamente(testo) {
  let testoCorretto = testo;
  
  // ELIMINAZIONE COMPLETA STILE TELEGRAFICO
  
  // 1. Rimuovi "è" ripetuto e malposizionato
  testoCorretto = testoCorretto.replace(/\s+è\s+è\s+/g, ' è ');
  testoCorretto = testoCorretto.replace(/\bè\s+([A-Z])/g, 'è $1');
  testoCorretto = testoCorretto.replace(/\s+è\s+include\s+/g, ' include ');
  testoCorretto = testoCorretto.replace(/\s+è\s+comprende\s+/g, ' comprende ');
  testoCorretto = testoCorretto.replace(/\s+è\s+stabilisce\s+/g, ' stabilisce ');
  
  // 2. Correggi "include" e "comprende" telegrafici
  testoCorretto = testoCorretto.replace(/\bTemi\s+([a-z])/g, 'I temi $1');
  testoCorretto = testoCorretto.replace(/\bArgomenti\s+([a-z])/g, 'Gli argomenti $1');
  testoCorretto = testoCorretto.replace(/\bStruttura\s+include\s+/g, 'La struttura prevede ');
  testoCorretto = testoCorretto.replace(/\bStile\s+include\s+/g, 'Lo stile è caratterizzato da ');
  testoCorretto = testoCorretto.replace(/\bLettere\s+celebri\s+include\s+/g, 'Tra le lettere più celebri: ');
  testoCorretto = testoCorretto.replace(/\bConcezione\s+([a-z])/g, 'La concezione $1');
  testoCorretto = testoCorretto.replace(/\bInfluenza\s+([a-z])/g, "L'influenza $1");
  
  // 3. Aggiungi articoli mancanti
  testoCorretto = testoCorretto.replace(/\bopera\s+tarda\s+/g, "l'opera tarda ");
  testoCorretto = testoCorretto.replace(/\bletture\s+raccolte\s+/g, 'lettere raccolte in ');
  testoCorretto = testoCorretto.replace(/\bprogressione\s+spirituale\s+/g, 'la progressione spirituale ');
  testoCorretto = testoCorretto.replace(/\bcammino\s+verso\s+/g, 'il cammino verso la ');
  testoCorretto = testoCorretto.replace(/\bpartenza\s+occasione\s+/g, 'la partenza da un\'occasione ');
  testoCorretto = testoCorretto.replace(/\bsviluppo\s+filosofico\s+/g, 'lo sviluppo filosofico ');
  testoCorretto = testoCorretto.replace(/\btono\s+colloquiale\s+/g, 'un tono colloquiale ');
  
  // 4. Correggi frasi spezzate specifiche
  testoCorretto = testoCorretto.replace(/\bschiavi\s+uomini\s+servi\s+fortuna\s+non\s+natura\s+tratta\s+umanamente/g, 
    'schiavi, affermando che sono uomini e servi della fortuna, non della natura, e devono essere trattati umanamente');
  testoCorretto = testoCorretto.replace(/\bsuicidio\s+Catone\s+exemplum\s+virtutis\s+libertà/g, 
    'suicidio, con Catone come exemplum virtutis e simbolo di libertà');
  testoCorretto = testoCorretto.replace(/\bmorte\s+Marcellino\s+suicidio\s+è\s+approvato\s+malattia/g, 
    'morte di Marcellino, dove il suicidio viene approvato in caso di malattia');
  testoCorretto = testoCorretto.replace(/\bprogresso\s+tecnico\s+non\s+morale/g, 
    'progresso tecnico che non coincide con quello morale');
  testoCorretto = testoCorretto.replace(/\bvecchiaia\s+preparazione\s+morte/g, 
    'vecchiaia come preparazione alla morte');
  testoCorretto = testoCorretto.replace(/\bcondivisione\s+tutto,\s+amico\s+alter\s+ego,\s+franquillo\s+dire\s+tutto/g, 
    'condivisione di tutto: l\'amico è un alter ego con cui si può parlare con franchezza di qualsiasi argomento');
  testoCorretto = testoCorretto.replace(/\bnemo\s+repente\s+sapiens\s+nessuno\s+diventa\s+saggio\s+improvvisamente\s+e\s+disciplina\s+quotidiana/g, 
    'nemo repente sapiens (nessuno diventa saggio improvvisamente) e richiede una disciplina quotidiana');
  
  // 5. Migliora connettori e congiunzioni
  testoCorretto = testoCorretto.replace(/\s+poi\s+/g, ', seguita da ');
  testoCorretto = testoCorretto.replace(/\s+ma\s+pubblicate\s+/g, ', ma in realtà destinate alla pubblicazione ');
  testoCorretto = testoCorretto.replace(/\s+indirizzate\s+amico\s+/g, ', formalmente indirizzate all\'amico ');
  testoCorretto = testoCorretto.replace(/\s+procuratore\s+([A-Z])/g, ', procuratore della $1');
  
  // 6. Correggi punteggiatura e spaziatura
  testoCorretto = testoCorretto.replace(/\s*\.\s*/g, '. ');
  testoCorretto = testoCorretto.replace(/\s*,\s*/g, ', ');
  testoCorretto = testoCorretto.replace(/\s*:\s*/g, ': ');
  testoCorretto = testoCorretto.replace(/\s*;\s*/g, '; ');
  testoCorretto = testoCorretto.replace(/\s+/g, ' ');
  
  // 7. Correggi maiuscole dopo punti
  testoCorretto = testoCorretto.replace(/\.\s*([a-z])/g, (match, lettera) => '. ' + lettera.toUpperCase());
  
  // 8. Correggi numeri e date
  testoCorretto = testoCorretto.replace(/\b(\d+)-(\d+)\s+d\.\s*C\./g, '$1 e il $2 d.C.');
  testoCorretto = testoCorretto.replace(/\b(\d+)\s+lettere\s+raccolte\s+(\d+)\s+libri/g, '$1 lettere raccolte in $2 libri');
  
  return testoCorretto.trim();
}

function correggiFile(filePath, nomeMateria) {
  console.log(`📝 Correzione manuale completa ${nomeMateria}: ${path.basename(filePath)}`);
  
  try {
    let contenuto = fs.readFileSync(filePath, 'utf8');
    let correzioni = 0;
    
    // Applica correzioni manuali ai riassunti
    contenuto = contenuto.replace(
      /"riassunto":\s*"([^"]+)"/g,
      (match, riassunto) => {
        const riassuntoOriginale = riassunto;
        let riassuntoCorretto = sistemaTestoCompletamente(riassunto);
        
        // Controllo se il riassunto è ancora troppo telegrafico
        const indicatoriTelegrafici = [
          /\s+è\s+include\s+/,
          /\s+comprende\s+[a-z]/,
          /\bTemi\s+[a-z]/,
          /\bArgomenti\s+[a-z]/,
          /\bStruttura\s+include/,
          /\bStile\s+include/,
          /\bLettere\s+celebri\s+include/,
          /\s+è\s+è\s+/,
          /\bopera\s+tarda\s+\d/
        ];
        
        const haProblemaTelegrafico = indicatoriTelegrafici.some(pattern => pattern.test(riassuntoCorretto));
        
        if (haProblemaTelegrafico) {
          // Applica correzioni più aggressive
          riassuntoCorretto = riassuntoCorretto
            .replace(/^([A-Z][a-z]+)\s+è\s+/, 'L\'$1 è ')
            .replace(/^([A-Z][a-z]+)\s+([a-z])/, 'L\'$1 $2')
            .replace(/\bTemi\s+/, 'I temi trattati ')
            .replace(/\bArgomenti\s+vari\s+/, 'Gli argomenti sono vari e ')
            .replace(/\bStruttura\s+/, 'La struttura ')
            .replace(/\bStile\s+/, 'Lo stile è caratterizzato da ')
            .replace(/\bLettere\s+celebri\s+/, 'Tra le lettere più celebri: ')
            .replace(/\bConcezione\s+/, 'La concezione della ')
            .replace(/\bAutoperfezionamento\s+/, 'L\'autoperfezionamento ')
            .replace(/\bInfluenza\s+/, 'L\'influenza si estende alla ');
        }
        
        if (riassuntoOriginale !== riassuntoCorretto) {
          correzioni++;
        }
        
        return `"riassunto": "${riassuntoCorretto}"`;
      }
    );
    
    fs.writeFileSync(filePath, contenuto, 'utf8');
    console.log(`✅ ${nomeMateria}: ${correzioni} riassunti corretti manualmente`);
    
  } catch (error) {
    console.error(`❌ Errore in ${nomeMateria}: ${error.message}`);
  }
}

// Processa tutte le materie con correzione manuale completa
console.log('🚀 CORREZIONE MANUALE COMPLETA di tutti i riassunti telegrafici...\n');

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

console.log('\n🎉 CORREZIONE MANUALE COMPLETA terminata!');
