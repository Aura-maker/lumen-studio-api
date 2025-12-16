/**
 * 🏆 QUIZ GENERATOR PRO - SISTEMA INTELLIGENTE DEFINITIVO
 * 
 * Architettura:
 * 1. NLP Parser - Estrazione semantica profonda con analisi sintattica
 * 2. Knowledge Graph - Relazioni tra entità per distrattori intelligenti
 * 3. Template Engine - Domande contestuali per materia e tipo
 * 4. Quality Validator - Filtra domande senza senso
 * 5. Distractor Generator - Distrattori basati su errori comuni reali
 */

// ============================================================
// 1. KNOWLEDGE BASE - Database di conoscenza per materia
// ============================================================

const KNOWLEDGE_BASE = {
  // AUTORI ITALIANI con info correlate
  autori_italiani: {
    'Ugo Foscolo': { periodo: 'preromanticismo', anni: '1778-1827', opere: ['I Sepolcri', 'Le Ultime lettere di Jacopo Ortis', 'Le Grazie'], temi: ['morte', 'memoria', 'patria', 'esilio'], luoghi: ['Zante', 'Venezia', 'Milano', 'Londra'] },
    'Giacomo Leopardi': { periodo: 'romanticismo', anni: '1798-1837', opere: ['Canti', 'Operette morali', 'Zibaldone', 'L\'Infinito'], temi: ['pessimismo', 'natura', 'illusioni', 'noia'], luoghi: ['Recanati', 'Roma', 'Firenze', 'Napoli'] },
    'Alessandro Manzoni': { periodo: 'romanticismo', anni: '1785-1873', opere: ['I Promessi Sposi', 'Adelchi', 'Il Conte di Carmagnola'], temi: ['provvidenza', 'storia', 'umili', 'fede'], luoghi: ['Milano', 'Parigi'] },
    'Giovanni Verga': { periodo: 'verismo', anni: '1840-1922', opere: ['I Malavoglia', 'Mastro-don Gesualdo', 'Vita dei campi'], temi: ['roba', 'fatalismo', 'progresso', 'vinti'], luoghi: ['Catania', 'Milano', 'Firenze'] },
    'Luigi Pirandello': { periodo: 'novecento', anni: '1867-1936', opere: ['Uno, nessuno e centomila', 'Il fu Mattia Pascal', 'Sei personaggi in cerca d\'autore'], temi: ['maschera', 'identità', 'follia', 'relatività'], luoghi: ['Agrigento', 'Roma', 'Berlino'] },
    'Gabriele D\'Annunzio': { periodo: 'decadentismo', anni: '1863-1938', opere: ['Il Piacere', 'Le Laudi', 'Notturno'], temi: ['superuomo', 'estetismo', 'vitalismo', 'eros'], luoghi: ['Pescara', 'Roma', 'Fiume'] },
    'Giovanni Pascoli': { periodo: 'decadentismo', anni: '1855-1912', opere: ['Myricae', 'Canti di Castelvecchio', 'Poemetti'], temi: ['nido', 'fanciullino', 'morte', 'natura'], luoghi: ['San Mauro', 'Bologna', 'Castelvecchio'] },
    'Italo Svevo': { periodo: 'novecento', anni: '1861-1928', opere: ['La coscienza di Zeno', 'Senilità', 'Una vita'], temi: ['inettitudine', 'malattia', 'psicoanalisi', 'tempo'], luoghi: ['Trieste'] },
    'Eugenio Montale': { periodo: 'ermetismo', anni: '1896-1981', opere: ['Ossi di seppia', 'Le occasioni', 'La bufera e altro'], temi: ['male di vivere', 'varco', 'memoria', 'oggetti'], luoghi: ['Genova', 'Firenze', 'Milano'] },
    'Dante Alighieri': { periodo: 'medioevo', anni: '1265-1321', opere: ['Divina Commedia', 'Vita Nova', 'Convivio', 'De vulgari eloquentia'], temi: ['amore', 'viaggio', 'politica', 'fede'], luoghi: ['Firenze', 'Ravenna', 'Verona'] }
  },
  
  // FILOSOFI con info correlate
  filosofi: {
    'Immanuel Kant': { corrente: 'idealismo trascendentale', anni: '1724-1804', opere: ['Critica della ragion pura', 'Critica della ragion pratica', 'Critica del giudizio'], concetti: ['noumeno', 'fenomeno', 'imperativo categorico', 'a priori'], luoghi: ['Königsberg'] },
    'Georg Wilhelm Friedrich Hegel': { corrente: 'idealismo assoluto', anni: '1770-1831', opere: ['Fenomenologia dello spirito', 'Scienza della logica', 'Enciclopedia'], concetti: ['dialettica', 'Aufhebung', 'spirito assoluto', 'tesi-antitesi-sintesi'], luoghi: ['Stoccarda', 'Berlino', 'Jena'] },
    'Friedrich Nietzsche': { corrente: 'nichilismo/vitalismo', anni: '1844-1900', opere: ['Così parlò Zarathustra', 'Al di là del bene e del male', 'La nascita della tragedia'], concetti: ['superuomo', 'volontà di potenza', 'eterno ritorno', 'morte di Dio'], luoghi: ['Röcken', 'Basilea', 'Torino'] },
    'Martin Heidegger': { corrente: 'esistenzialismo/fenomenologia', anni: '1889-1976', opere: ['Essere e Tempo', 'Lettera sull\'umanismo'], concetti: ['Dasein', 'essere-per-la-morte', 'angoscia', 'cura'], luoghi: ['Meßkirch', 'Friburgo'] },
    'Karl Marx': { corrente: 'materialismo storico', anni: '1818-1883', opere: ['Il Capitale', 'Manifesto del Partito Comunista', 'Manoscritti economico-filosofici'], concetti: ['plusvalore', 'lotta di classe', 'alienazione', 'materialismo dialettico'], luoghi: ['Treviri', 'Parigi', 'Londra'] },
    'Jean-Paul Sartre': { corrente: 'esistenzialismo', anni: '1905-1980', opere: ['L\'essere e il nulla', 'La nausea', 'L\'esistenzialismo è un umanismo'], concetti: ['libertà', 'angoscia', 'malafede', 'per-sé/in-sé'], luoghi: ['Parigi'] },
    'Edmund Husserl': { corrente: 'fenomenologia', anni: '1859-1938', opere: ['Idee per una fenomenologia pura', 'Ricerche logiche'], concetti: ['epoché', 'intenzionalità', 'riduzione fenomenologica', 'Lebenswelt'], luoghi: ['Prossnitz', 'Gottinga', 'Friburgo'] },
    'Arthur Schopenhauer': { corrente: 'pessimismo', anni: '1788-1860', opere: ['Il mondo come volontà e rappresentazione'], concetti: ['volontà', 'rappresentazione', 'noluntas', 'compassione'], luoghi: ['Danzica', 'Francoforte'] }
  },
  
  // MOVIMENTI LETTERARI
  movimenti_letterari: {
    'preromanticismo': { periodo: '1750-1800', caratteristiche: ['sensibilità', 'natura', 'sentimento', 'malinconia'], autori: ['Foscolo', 'Alfieri', 'Parini'] },
    'romanticismo': { periodo: '1800-1850', caratteristiche: ['sentimento', 'natura', 'popolo', 'nazione', 'storia'], autori: ['Manzoni', 'Leopardi', 'Berchet'] },
    'verismo': { periodo: '1870-1900', caratteristiche: ['impersonalità', 'regressione', 'documento umano', 'darwinismo sociale'], autori: ['Verga', 'Capuana', 'De Roberto'] },
    'decadentismo': { periodo: '1880-1920', caratteristiche: ['estetismo', 'simbolismo', 'irrazionalismo', 'crisi valori'], autori: ['D\'Annunzio', 'Pascoli', 'Svevo'] },
    'ermetismo': { periodo: '1920-1950', caratteristiche: ['oscurità', 'analogia', 'parola pura', 'lirica assoluta'], autori: ['Montale', 'Ungaretti', 'Quasimodo'] },
    'neorealismo': { periodo: '1945-1960', caratteristiche: ['impegno', 'resistenza', 'popolo', 'dialetto'], autori: ['Pavese', 'Vittorini', 'Calvino'] }
  },
  
  // CORRENTI FILOSOFICHE
  correnti_filosofiche: {
    'illuminismo': { periodo: '1700-1800', caratteristiche: ['ragione', 'progresso', 'tolleranza', 'critica'], filosofi: ['Voltaire', 'Rousseau', 'Diderot', 'Kant'] },
    'idealismo': { periodo: '1780-1850', caratteristiche: ['spirito', 'dialettica', 'assoluto', 'autocoscienza'], filosofi: ['Kant', 'Fichte', 'Schelling', 'Hegel'] },
    'positivismo': { periodo: '1830-1900', caratteristiche: ['scienza', 'fatti', 'progresso', 'metodo'], filosofi: ['Comte', 'Spencer', 'Mill'] },
    'esistenzialismo': { periodo: '1900-1970', caratteristiche: ['esistenza', 'libertà', 'angoscia', 'autenticità'], filosofi: ['Heidegger', 'Sartre', 'Jaspers', 'Kierkegaard'] },
    'fenomenologia': { periodo: '1900-oggi', caratteristiche: ['coscienza', 'intenzionalità', 'epoché', 'essenze'], filosofi: ['Husserl', 'Heidegger', 'Merleau-Ponty'] },
    'marxismo': { periodo: '1850-oggi', caratteristiche: ['materialismo', 'dialettica', 'prassi', 'rivoluzione'], filosofi: ['Marx', 'Engels', 'Lenin', 'Gramsci'] }
  },
  
  // EVENTI STORICI
  eventi_storici: {
    'Congresso di Vienna': { anno: 1815, protagonisti: ['Metternich', 'Talleyrand', 'Castlereagh'], conseguenze: ['Restaurazione', 'Santa Alleanza', 'equilibrio europeo'] },
    'Moti del 1848': { anno: 1848, protagonisti: ['Mazzini', 'Garibaldi', 'Carlo Alberto'], conseguenze: ['Prima guerra d\'indipendenza', 'Statuto Albertino', 'Repubblica Romana'] },
    'Unità d\'Italia': { anno: 1861, protagonisti: ['Cavour', 'Garibaldi', 'Vittorio Emanuele II'], conseguenze: ['Regno d\'Italia', 'questione romana', 'questione meridionale'] },
    'Prima Guerra Mondiale': { anni: '1914-1918', protagonisti: ['Wilson', 'Clemenceau', 'Orlando'], conseguenze: ['Trattato di Versailles', 'Società delle Nazioni', 'crollo imperi'] },
    'Seconda Guerra Mondiale': { anni: '1939-1945', protagonisti: ['Hitler', 'Mussolini', 'Churchill', 'Roosevelt', 'Stalin'], conseguenze: ['ONU', 'Guerra Fredda', 'decolonizzazione'] },
    'Resistenza italiana': { anni: '1943-1945', protagonisti: ['partigiani', 'CLN', 'Togliatti', 'De Gasperi'], conseguenze: ['Liberazione', 'Repubblica', 'Costituzione'] }
  }
};

// ============================================================
// 1.5 TEMPLATE ENGINE - 50+ Template per ogni tipo di quiz
// ============================================================

const QUIZ_TEMPLATES = {
  // TEMPLATE BIOGRAFICI (10)
  nascita_anno: [
    'In quale anno nacque {soggetto}?',
    'Quando nacque {soggetto}?',
    '{soggetto} nacque nell\'anno:',
    'L\'anno di nascita di {soggetto} è:',
    'La data di nascita di {soggetto} risale al:'
  ],
  nascita_luogo: [
    'Dove nacque {soggetto}?',
    'In quale città nacque {soggetto}?',
    'Il luogo di nascita di {soggetto} è:',
    '{soggetto} venne alla luce a:',
    'La città natale di {soggetto} è:'
  ],
  morte_anno: [
    'In quale anno morì {soggetto}?',
    'Quando morì {soggetto}?',
    '{soggetto} morì nell\'anno:',
    'L\'anno di morte di {soggetto} è:',
    'La scomparsa di {soggetto} avvenne nel:'
  ],
  
  // TEMPLATE OPERE (10)
  opera_anno: [
    'In quale anno fu pubblicata l\'opera "{titolo}"?',
    'Quando fu scritta l\'opera "{titolo}"?',
    '"{titolo}" fu pubblicata nel:',
    'L\'anno di pubblicazione di "{titolo}" è:',
    'La prima edizione di "{titolo}" risale al:'
  ],
  opera_autore: [
    'Chi scrisse l\'opera "{titolo}"?',
    'Chi è l\'autore di "{titolo}"?',
    '"{titolo}" fu scritta da:',
    'L\'autore dell\'opera "{titolo}" è:',
    'A chi si deve la stesura di "{titolo}"?'
  ],
  
  // TEMPLATE RELAZIONI (10)
  allievo_maestro: [
    'Di chi fu allievo {allievo}?',
    '{allievo} studiò sotto la guida di:',
    'Chi fu il maestro di {allievo}?',
    '{allievo} apprese da:',
    'La formazione di {allievo} fu influenzata da:'
  ],
  esponente: [
    'Di quale movimento fu esponente {persona}?',
    '{persona} è considerato esponente del:',
    'A quale corrente appartiene {persona}?',
    '{persona} fu il principale rappresentante del:',
    'Il movimento di cui {persona} fu promotore è:'
  ],
  
  // TEMPLATE CONCETTI (10)
  concetto_chi: [
    'Chi elaborò il concetto di "{concetto}"?',
    'A chi si deve il concetto di "{concetto}"?',
    'Il concetto di "{concetto}" fu introdotto da:',
    'Chi teorizzò "{concetto}"?',
    '"{concetto}" fu sviluppato da:'
  ],
  concetto_cosa: [
    'Cosa si intende per "{concetto}"?',
    'Qual è il significato di "{concetto}"?',
    'Come si definisce "{concetto}"?',
    '"{concetto}" indica:',
    'Con "{concetto}" si intende:'
  ],
  
  // TEMPLATE DEFINIZIONI (10)
  definizione: [
    'Cosa indica il termine "{termine}"?',
    'Qual è la definizione di "{termine}"?',
    'Come si definisce "{termine}"?',
    '"{termine}" rappresenta:',
    'Con il termine "{termine}" si indica:',
    'Cosa si intende per "{termine}"?',
    '"{termine}" può essere definito come:',
    'Il concetto di "{termine}" indica:',
    'La nozione di "{termine}" si riferisce a:',
    '"{termine}" è definito come:'
  ],
  
  // TEMPLATE SCOPERTE (5)
  scoperta_chi: [
    'Chi scoprì {cosa}?',
    'A chi si deve la scoperta di {cosa}?',
    '{cosa} fu scoperta da:',
    'Lo scopritore di {cosa} è:',
    'Chi fece la scoperta di {cosa}?'
  ],
  scoperta_anno: [
    'In quale anno fu scoperta {cosa}?',
    'Quando avvenne la scoperta di {cosa}?',
    '{cosa} fu scoperta nel:',
    'L\'anno della scoperta di {cosa} è:',
    'La scoperta di {cosa} risale al:'
  ],
  
  // TEMPLATE VERO/FALSO (5)
  vero_falso: [
    'Vero o Falso: "{affermazione}"',
    'È corretto affermare che "{affermazione}"?',
    'L\'affermazione "{affermazione}" è:',
    'Indica se è vero: "{affermazione}"',
    '"{affermazione}" - Questa affermazione è:'
  ],
  
  // TEMPLATE COMPLETAMENTO (5)
  completamento: [
    'Completa: "{frase_con_blank}"',
    'Inserisci il termine mancante: "{frase_con_blank}"',
    'Quale parola completa la frase: "{frase_con_blank}"?',
    'Il termine che completa "{frase_con_blank}" è:',
    'Riempi lo spazio: "{frase_con_blank}"'
  ]
};

// Funzione helper per selezionare template random
function getRandomTemplate(tipo) {
  const templates = QUIZ_TEMPLATES[tipo] || QUIZ_TEMPLATES.definizione;
  return templates[Math.floor(Math.random() * templates.length)];
}

// ============================================================
// 2. NLP PARSER - Estrazione semantica profonda
// ============================================================

class NLPParser {
  constructor() {
    this.stopWords = new Set(['il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una', 'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'e', 'o', 'ma', 'che', 'se', 'come', 'quando', 'dove', 'perché', 'quale', 'quanto', 'chi', 'cosa', 'nel', 'nella', 'nell', 'dello', 'della', 'dei', 'degli', 'delle', 'al', 'alla', 'agli', 'alle', 'dal', 'dalla', 'dai', 'dalle', 'sul', 'sulla', 'sui', 'sulle']);
  }
  
  /**
   * Estrae tutti i fatti dal testo con contesto completo
   */
  estraiFatti(testo, materia) {
    const fatti = [];
    const frasi = this.tokenizzaFrasi(testo);
    
    frasi.forEach((frase, idx) => {
      // Contesto = frasi circostanti
      const contesto = {
        precedente: frasi[idx - 1] || '',
        successiva: frasi[idx + 1] || ''
      };
      
      // Estrai diversi tipi di fatti
      const fattiBiografici = this.estraiFattiBiografici(frase, contesto);
      const fattiOpere = this.estraiFattiOpere(frase, contesto);
      const fattiConcettuali = this.estraiFattiConcettuali(frase, contesto, materia);
      const fattiRelazionali = this.estraiFattiRelazionali(frase, contesto);
      const fattiDefinitori = this.estraiFattiDefinitori(frase, contesto);
      const fattiSpeciali = this.estraiFattiSpeciali(frase, contesto, materia);
      const fattiUmanistici = this.estraiFattiUmanistici(frase, contesto, materia);
      
      fatti.push(...fattiBiografici, ...fattiOpere, ...fattiConcettuali, ...fattiRelazionali, ...fattiDefinitori, ...fattiSpeciali, ...fattiUmanistici);
    });
    
    return this.deduplicaFatti(fatti);
  }
  
  tokenizzaFrasi(testo) {
    return testo
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map(f => f.trim())
      .filter(f => f.length > 30 && f.length < 500);
  }
  
  estraiFattiBiografici(frase, contesto) {
    const fatti = [];
    
    // PATTERN 1: "Nome Cognome (anno-anno)" - date tra parentesi
    const dateParentesiPattern = /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù']+)+)\s*\((\d{4})\s*-\s*(\d{4})\)/;
    const dateMatch = frase.match(dateParentesiPattern);
    if (dateMatch) {
      fatti.push({
        tipo: 'nascita',
        soggetto: dateMatch[1].trim(),
        anno: dateMatch[2],
        frase: frase,
        contesto: contesto,
        confidenza: 0.95
      });
      fatti.push({
        tipo: 'morte',
        soggetto: dateMatch[1].trim(),
        anno: dateMatch[3],
        frase: frase,
        contesto: contesto,
        confidenza: 0.95
      });
    }
    
    // PATTERN 2: "Nato/Nata a Luogo"
    const natoAPattern = /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù']+)*)[,\s]+(?:nato|nata)\s+a\s+([A-Za-zàèéìòù\s]+?)(?:\s*\(|\s*,|\s*nel|\.|$)/i;
    const natoAMatch = frase.match(natoAPattern);
    if (natoAMatch && !dateMatch) {
      fatti.push({
        tipo: 'nascita',
        soggetto: natoAMatch[1].trim(),
        luogo: natoAMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // NASCITA con pattern multipli classici
    const nascitaPatterns = [
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)*)\s+nacque\s+(?:il\s+\d+\s+\w+\s+)?(?:del\s+|nel\s+)?(\d{4})(?:\s+a\s+([A-Za-zàèéìòù\s]+?))?(?:\s+(?:in|,)\s+([A-Za-zàèéìòù\s]+))?[.,]/i,
      /(?:Nel|Il)\s+(\d{4})\s+(?:nasce|nacque)\s+([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)*)/i,
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)*)\s+nasce\s+(?:nel\s+)?(\d{4})/i
    ];
    
    for (const pattern of nascitaPatterns) {
      const match = frase.match(pattern);
      if (match) {
        const nome = match[1].match(/\d/) ? match[2] : match[1];
        const anno = match[1].match(/\d/) ? match[1] : match[2];
        const luogo = match[3]?.trim().replace(/[.,]$/, '') || '';
        const regione = match[4]?.trim().replace(/[.,]$/, '') || '';
        
        fatti.push({
          tipo: 'nascita',
          soggetto: nome,
          anno: anno,
          luogo: luogo,
          regione: regione,
          frase: frase,
          contesto: contesto,
          confidenza: 0.95
        });
        break;
      }
    }
    
    // MORTE con pattern multipli (incluso "mori" senza accento)
    const mortePatterns = [
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)*)\s+(?:morì|mori|muore|è morto|scomparve)\s+(?:il\s+\d+\s+\w+\s+)?(?:del\s+|nel\s+)?(\d{4})(?:\s+a\s+([A-Za-zàèéìòù\s]+?))?/i,
      /(?:Nel|Il)\s+(\d{4})\s+(?:muore|morì|mori|scompare)\s+([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)*)/i
    ];
    
    for (const pattern of mortePatterns) {
      const match = frase.match(pattern);
      if (match) {
        const nome = match[1].match(/\d/) ? match[2] : match[1];
        const anno = match[1].match(/\d/) ? match[1] : match[2];
        const luogo = match[3]?.trim().replace(/[.,]$/, '') || '';
        
        fatti.push({
          tipo: 'morte',
          soggetto: nome,
          anno: anno,
          luogo: luogo,
          frase: frase,
          contesto: contesto,
          confidenza: 0.95
        });
        break;
      }
    }
    
    return fatti;
  }
  
  estraiFattiOpere(frase, contesto) {
    const fatti = [];
    
    // Parole da escludere come titoli di opere
    const escludiTitoli = ['nacque nel', 'mori nel', 'morì nel', 'nato nel', 'morto nel', 'nel', 'del', 'della'];
    
    // OPERA con titolo e data - pattern AMPLIATI
    const operaPatterns = [
      // "Titolo" (anno) - pattern più comune nei riassunti
      /["«""]([A-Z][A-Za-zàèéìòù\s'']{3,60})["»""]\s*\((\d{4})\)/,
      // "Titolo" del anno
      /["«""]([A-Z][A-Za-zàèéìòù\s'']{3,60})["»""]\s+(?:del|nel)\s+(\d{4})/i,
      // opera/romanzo/saggio "Titolo" (anno)
      /(?:opera|libro|romanzo|saggio|poema|tragedia|commedia|raccolta|carme|ode|sonetto|canzone)\s+(?:principale\s+)?["«""]([A-Za-zàèéìòù\s'']+?)["»""]\s*(?:\()?(\d{4})(?:\))?/i,
      // Le/I/La Titolo (anno)
      /(?:Le|I|Lo|La|Gli|L')\s+([A-Z][a-zàèéìòù]+(?:\s+[a-zàèéìòù]+){0,4})\s*\((\d{4})\)/,
      // scrive/pubblica "Titolo" nel anno
      /(?:scrive|scrisse|pubblica|pubblicò|compose|compone)\s+["«""]([A-Za-zàèéìòù\s'']+?)["»""]\s+(?:nel\s+)?(\d{4})/i,
      // edizione/edizioni del anno
      /["«""]([A-Z][A-Za-zàèéìòù\s'']{3,50})["»""][,\s]+(?:edizione|edizioni|prima edizione|pubblicat[ao])\s+(?:del|nel)\s+(\d{4})/i
    ];
    
    for (const pattern of operaPatterns) {
      const match = frase.match(pattern);
      if (match && match[1].length > 3 && match[1].length < 60) {
        const titolo = match[1].trim().toLowerCase();
        
        // Salta titoli invalidi
        if (escludiTitoli.some(e => titolo.includes(e)) || titolo.match(/^\d/) || titolo.length < 4) {
          continue;
        }
        
        // Il titolo deve iniziare con maiuscola o essere tra virgolette
        if (!match[1].match(/^[A-Z]/) && !frase.includes('"') && !frase.includes('«')) {
          continue;
        }
        
        // Cerca l'autore nel contesto
        const autoreMatch = frase.match(/([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:scrive|scrisse|pubblica|pubblicò|compose|compone)/i) ||
                          contesto.precedente.match(/([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)/);
        
        fatti.push({
          tipo: 'opera',
          titolo: match[1].trim(),
          anno: match[2],
          autore: autoreMatch?.[1] || '',
          frase: frase,
          contesto: contesto,
          confidenza: 0.9
        });
        break;
      }
    }
    
    return fatti;
  }
  
  estraiFattiConcettuali(frase, contesto, materia) {
    const fatti = [];
    
    // CONCETTO INTRODOTTO
    const concettoPatterns = [
      /([A-Z][a-zàèéìòù]+)\s+introduce\s+(?:il\s+)?(?:concetto\s+di\s+)?["«]?([a-zàèéìòùA-Z\s'-]+?)["»]?(?:,|\s+come|\s+che|\.)/i,
      /(?:il\s+)?(?:concetto\s+di\s+)?["«]?([a-zàèéìòùA-Z\s'-]+?)["»]?\s+(?:fu\s+)?(?:introdotto|elaborato|formulato)\s+da\s+([A-Z][a-zàèéìòù]+)/i
    ];
    
    for (const pattern of concettoPatterns) {
      const match = frase.match(pattern);
      if (match) {
        const autore = match[1].match(/^[A-Z]/) ? match[1] : match[2];
        const concetto = match[1].match(/^[A-Z]/) ? match[2] : match[1];
        
        if (concetto.length > 3 && concetto.length < 40) {
          fatti.push({
            tipo: 'concetto_introdotto',
            autore: autore,
            concetto: concetto.trim(),
            frase: frase,
            contesto: contesto,
            confidenza: 0.88
          });
        }
        break;
      }
    }
    
    // SCOPERTA SCIENTIFICA: "X fu scoperta/scoperto da Y nel ANNO"
    const scopertaPattern = /(?:La|Il|L[''])\s+([a-zàèéìòùA-Z][a-zàèéìòù\s]+?)\s+(?:fu|venne)\s+(?:scoperta|scoperto|inventata|inventato)\s+da\s+([A-Z][a-zàèéìòù]+)\s+(?:nel\s+)?(\d{4})/i;
    const scopertaMatch = frase.match(scopertaPattern);
    if (scopertaMatch) {
      fatti.push({
        tipo: 'scoperta',
        cosa: scopertaMatch[1].trim(),
        chi: scopertaMatch[2],
        anno: scopertaMatch[3],
        frase: frase,
        contesto: contesto,
        confidenza: 0.9
      });
    }
    
    // LEGGE/PRINCIPIO: "La legge di X stabilisce/afferma che..."
    const leggePattern = /(?:La\s+)?(?:legge|principio|teorema)\s+di\s+([A-Z][a-zàèéìòù]+)\s+(?:stabilisce|afferma|dice|enuncia)\s+che\s+(.{20,100})/i;
    const leggeMatch = frase.match(leggePattern);
    if (leggeMatch) {
      fatti.push({
        tipo: 'legge',
        nome: leggeMatch[1],
        contenuto: leggeMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.9
      });
    }
    
    // ============ PATTERN AGGRESSIVI PER MATEMATICA/FISICA ============
    
    // TEOREMA: "Il teorema di/degli X afferma..."
    const teoremaPatterns = [
      /(?:Il\s+)?teorema\s+(?:di|degli|delle)\s+([A-Za-zàèéìòù\s]+?)\s+(?:afferma|stabilisce|dice|enuncia)\s+che\s+(.{15,150})/i,
      /(?:Il\s+)?teorema\s+(?:di|degli|delle)\s+([A-Za-zàèéìòù]+)/i
    ];
    for (const pattern of teoremaPatterns) {
      const match = frase.match(pattern);
      if (match) {
        fatti.push({
          tipo: 'teorema',
          nome: match[1].trim(),
          contenuto: match[2]?.trim() || frase.substring(0, 100),
          frase: frase,
          contesto: contesto,
          confidenza: 0.9
        });
        break;
      }
    }
    
    // FORMULA: "formula/equazione X = Y" o "X: formula"
    const formulaPattern = /(?:formula|equazione|legge)\s*[:=]?\s*([A-Za-z])\s*=\s*([^.]{5,50})/i;
    const formulaMatch = frase.match(formulaPattern);
    if (formulaMatch) {
      fatti.push({
        tipo: 'formula',
        simbolo: formulaMatch[1],
        espressione: formulaMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // UNITÀ DI MISURA: "L'unità di misura è il/la X (simbolo)"
    const unitaPattern = /(?:unità\s+di\s+misura|si\s+misura\s+in)\s+(?:è\s+)?(?:il|la|lo)?\s*([A-Za-zàèéìòù]+)\s*(?:\(([A-Za-z\/²³]+)\))?/i;
    const unitaMatch = frase.match(unitaPattern);
    if (unitaMatch) {
      fatti.push({
        tipo: 'unita_misura',
        nome: unitaMatch[1],
        simbolo: unitaMatch[2] || '',
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // DEFINIZIONE TECNICA: "X è definito/a come Y" o "X rappresenta Y"
    const defTecnicaPatterns = [
      /(?:La|Il|Lo|L[''])\s+([a-zàèéìòùA-Z][a-zàèéìòù\s]{2,30}?)\s+(?:è\s+)?(?:definit[ao]|rappresenta|indica|misura|descrive)\s+(?:come\s+)?(.{15,150})/i,
      /(?:La|Il)\s+([a-zàèéìòùA-Z][a-zàèéìòù\s]{2,25}?)\s+([A-Z])\s+(?:è|rappresenta|indica)\s+(.{10,100})/i
    ];
    for (const pattern of defTecnicaPatterns) {
      const match = frase.match(pattern);
      if (match && match[1].length > 3 && match[1].length < 35) {
        const termine = match[1].trim();
        // Escludi termini generici
        if (!termine.match(/^(questo|quello|essa|esso|cui|che|come|quando|dove|perché)/i)) {
          fatti.push({
            tipo: 'definizione_tecnica',
            termine: termine,
            definizione: (match[3] || match[2]).trim(),
            frase: frase,
            contesto: contesto,
            confidenza: 0.8
          });
          break;
        }
      }
    }
    
    // COSTANTE FISICA: "costante X = valore"
    const costantePattern = /costante\s+(?:di\s+)?([a-zàèéìòùA-Z][a-zàèéìòù\s]+?)\s*(?:=|è|vale)\s*([0-9,.\s×\-⁰¹²³⁴⁵⁶⁷⁸⁹]+)/i;
    const costanteMatch = frase.match(costantePattern);
    if (costanteMatch) {
      fatti.push({
        tipo: 'costante',
        nome: costanteMatch[1].trim(),
        valore: costanteMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.9
      });
    }
    
    return fatti;
  }
  
  estraiFattiRelazionali(frase, contesto) {
    const fatti = [];
    
    // ALLIEVO-MAESTRO
    const allievoPattern = /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:fu|era|è stato)\s+(?:allievo|discepolo|studente)\s+di\s+([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)/i;
    const match1 = frase.match(allievoPattern);
    if (match1) {
      fatti.push({
        tipo: 'relazione_allievo',
        allievo: match1[1],
        maestro: match1[2],
        frase: frase,
        contesto: contesto,
        confidenza: 0.95
      });
    }
    
    // ESPONENTE DI - pattern AMPLIATI per catturare più ruoli
    const esponentePatterns = [
      // X è il massimo esponente del Y
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:fu|era|è|divenne|rappresenta)\s+(?:il\s+|una?\s+)?(?:principale\s+|massimo\s+|maggiore\s+|grande\s+)?(?:esponente|fondatore|rappresentante|teorico|poeta|scrittore|filosofo|voce|pilastro|figura)\s+(?:del|dell['']?|della|dello|di)\s+([a-zàèéìòùA-Z\s]+?)(?:[.,\s]e\s|[.,]|$)/i,
      // Fu/Era il massimo esponente
      /(?:Fu|Era|Divenne|Rappresenta)\s+(?:il\s+|una?\s+)?(?:principale\s+|massimo\s+|maggiore\s+)?(?:esponente|fondatore|rappresentante|figura\s+fondamentale)\s+(?:del|dell['']?|della|dello|di)\s+([a-zàèéìòùA-Z\s]+?)(?:[.,]|$)/i,
      // X incarna il Y / X è ponte tra Y e Z
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:incarna|incarnò|rappresenta|è ponte tra)\s+(?:il\s+|la\s+|le\s+)?([a-zàèéìòùA-Z\s]+?)(?:[.,]|$)/i,
      // uno dei pilastri / una delle voci
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+è\s+(?:uno dei|una delle)\s+(?:pilastri|voci|figure|maestri)\s+(?:del|dell['']?|della|dello)\s+([a-zàèéìòùA-Z\s]+?)(?:[.,]|$)/i
    ];
    
    for (const pattern of esponentePatterns) {
      const match2 = frase.match(pattern);
      if (match2) {
        // Se il primo gruppo è il movimento (pattern 2), cerca il soggetto nel contesto
        let persona = match2[1];
        let movimento = match2[2] || match2[1];
        
        if (!persona.match(/^[A-Z]/)) {
          // Il primo gruppo è il movimento, cerca persona nel contesto
          movimento = persona;
          const soggettoMatch = contesto.precedente?.match(/([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)/);
          persona = soggettoMatch?.[1] || '';
        }
        
        if (persona && movimento) {
          fatti.push({
            tipo: 'ruolo_movimento',
            persona: persona,
            movimento: movimento.trim().replace(/[.,]$/, ''),
            frase: frase,
            contesto: contesto,
            confidenza: 0.9
          });
        }
        break;
      }
    }
    
    // INFLUENZA
    const influenzaPattern = /([A-Z][a-zàèéìòù]+)\s+(?:fu\s+)?(?:influenzato|ispirato)\s+da\s+([A-Z][a-zàèéìòù]+)/i;
    const match3 = frase.match(influenzaPattern);
    if (match3) {
      fatti.push({
        tipo: 'influenza',
        influenzato: match3[1],
        influenzatore: match3[2],
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    return fatti;
  }
  
  // ============ PATTERN INTELLIGENTI PER UMANISTICA ============
  
  estraiFattiUmanistici(frase, contesto, materia) {
    const fatti = [];
    
    // 1. TEMI LETTERARI: "X esprime/rappresenta/incarna il tema di Y"
    const temaPatterns = [
      /["«""]([A-Z][^"»""]{3,40})["»""]\s+(?:esprime|rappresenta|incarna|celebra|evoca|descrive|analizza)\s+(?:il\s+tema\s+di\s+)?(.{10,100})/i,
      /(?:il\s+tema\s+(?:centrale|principale|fondamentale)\s+(?:è|di)\s+)(.{10,80})/i,
      /(?:I\s+temi\s+(?:principali|centrali)\s+(?:sono|includono)\s+)(.{10,120})/i
    ];
    for (const pattern of temaPatterns) {
      const match = frase.match(pattern);
      if (match) {
        fatti.push({
          tipo: 'tema_letterario',
          opera: match[1]?.trim() || sottoargomento,
          tema: (match[2] || match[1]).trim(),
          frase: frase,
          contesto: contesto,
          confidenza: 0.85
        });
        break;
      }
    }
    
    // 2. OPERE CON DESCRIZIONE: "X è il primo/il capolavoro/la più importante..."
    const operaDescPattern = /["«""]([A-Z][^"»""]{3,50})["»""]\s+(?:è|rappresenta|costituisce)\s+(?:il\s+primo|il\s+capolavoro|l['']opera\s+principale|la\s+più\s+importante|il\s+vertice)\s+(.{10,100})/i;
    const operaDescMatch = frase.match(operaDescPattern);
    if (operaDescMatch) {
      fatti.push({
        tipo: 'opera_descrizione',
        titolo: operaDescMatch[1].trim(),
        descrizione: operaDescMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.9
      });
    }
    
    // 3. PERSONAGGI CON RUOLO: "X (il/la Y)" o "X incarna il Y"
    const personaggioPatterns = [
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+\((?:il|la|lo)\s+([a-zàèéìòù\s]+)\)/i,
      /([A-Z][a-zàèéìòù]+)\s+(?:incarna|rappresenta|è)\s+(?:il|la|l[''])\s+([a-zàèéìòù\s]{5,40})/i
    ];
    for (const pattern of personaggioPatterns) {
      const match = frase.match(pattern);
      if (match && match[2].length > 4 && match[2].length < 50) {
        fatti.push({
          tipo: 'personaggio_ruolo',
          nome: match[1].trim(),
          ruolo: match[2].trim(),
          frase: frase,
          contesto: contesto,
          confidenza: 0.85
        });
        break;
      }
    }
    
    // 4. CONCETTI/TEORIE: "La teoria di X", "Il concetto di X significa/afferma"
    const concettoPatterns = [
      /(?:La\s+)?["«""]?teoria\s+del\s+([a-zàèéìòùA-Z\s]{3,30})["»""]?\s+(?:afferma|spiega|sostiene)\s+che\s+(.{15,120})/i,
      /(?:Il\s+)?concetto\s+di\s+["«""]?([a-zàèéìòùA-Z\s]{3,25})["»""]?\s+(?:è|significa|indica)\s+(.{15,100})/i,
      /(?:Il\s+)?["«""]?([a-zàèéìòùA-Z\s]{4,25})["»""]?\s+(?:leopardiano|manzoniano|foscoliano|kantiano|hegeliano)\s+(?:è|significa|indica)\s+(.{15,100})/i
    ];
    for (const pattern of concettoPatterns) {
      const match = frase.match(pattern);
      if (match) {
        fatti.push({
          tipo: 'concetto_teoria',
          nome: match[1].trim(),
          spiegazione: match[2].trim(),
          frase: frase,
          contesto: contesto,
          confidenza: 0.85
        });
        break;
      }
    }
    
    // 5. CAUSE/CONSEGUENZE: "Le cause includono/sono", "Le conseguenze sono"
    const causePattern = /(?:Le\s+)?(?:cause|ragioni|motivi)\s+(?:principali\s+)?(?:sono|includono|comprendono)\s+(.{20,150})/i;
    const causeMatch = frase.match(causePattern);
    if (causeMatch) {
      fatti.push({
        tipo: 'cause',
        contenuto: causeMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    const conseguenzePattern = /(?:Le\s+)?(?:conseguenze|effetti|risultati)\s+(?:sono|includono|comprendono|furono)\s+(.{20,150})/i;
    const conseguenzeMatch = frase.match(conseguenzePattern);
    if (conseguenzeMatch) {
      fatti.push({
        tipo: 'conseguenze',
        contenuto: conseguenzeMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 6. FASI/PERIODI: "la prima fase", "il periodo X (date)"
    const fasePattern = /(?:La\s+)?(?:prima|seconda|terza|ultima)\s+fase\s+(?:è|fu|comprende)\s+(.{15,100})/i;
    const faseMatch = frase.match(fasePattern);
    if (faseMatch) {
      fatti.push({
        tipo: 'fase_periodo',
        descrizione: faseMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.8
      });
    }
    
    // 7. CARATTERISTICHE: "Le caratteristiche principali sono/includono"
    const caratteristichePattern = /(?:Le\s+)?caratteristiche\s+(?:principali|fondamentali)?\s*(?:sono|includono)\s+(.{20,150})/i;
    const caratteristicheMatch = frase.match(caratteristichePattern);
    if (caratteristicheMatch) {
      fatti.push({
        tipo: 'caratteristiche',
        contenuto: caratteristicheMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 8. CITAZIONI/FRASI CELEBRI: "la frase X", "il motto X"
    const citazionePattern = /(?:la\s+frase|il\s+motto|l['']espressione)\s+["«""]([^"»""]{10,80})["»""]/i;
    const citazioneMatch = frase.match(citazionePattern);
    if (citazioneMatch) {
      fatti.push({
        tipo: 'citazione',
        testo: citazioneMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.9
      });
    }
    
    // 9. EVENTI CON DATE: "nel 1789 avvenne/fu/si verificò X"
    const eventoDataPattern = /(?:nel|il|del)\s+(\d{4})\s+(?:avvenne|fu|si\s+verificò|ebbe\s+luogo|venne|scoppiò|iniziò|terminò|nacque|morì)\s+(.{10,80})/i;
    const eventoMatch = frase.match(eventoDataPattern);
    if (eventoMatch) {
      fatti.push({
        tipo: 'evento_data',
        anno: eventoMatch[1],
        evento: eventoMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 10. RIFORME/CAMBIAMENTI: "Le riforme includono/comprendono"
    const riformePattern = /(?:Le\s+)?(?:riforme|innovazioni|cambiamenti|trasformazioni)\s+(?:principali\s+)?(?:includono|comprendono|furono|sono)\s+(.{20,150})/i;
    const riformeMatch = frase.match(riformePattern);
    if (riformeMatch) {
      fatti.push({
        tipo: 'riforme',
        contenuto: riformeMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 11. INFLUENZE: "influenzò/fu influenzato da"
    const influenzaPatterns = [
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:influenzò|ispirò|determinò)\s+(.{10,80})/i,
      /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+fu\s+(?:influenzato|ispirato)\s+da\s+(.{10,60})/i
    ];
    for (const pattern of influenzaPatterns) {
      const match = frase.match(pattern);
      if (match) {
        fatti.push({
          tipo: 'influenza',
          soggetto: match[1].trim(),
          oggetto: match[2].trim(),
          frase: frase,
          contesto: contesto,
          confidenza: 0.85
        });
        break;
      }
    }
    
    // 12. OBIETTIVI/SCOPI: "l'obiettivo era/è", "lo scopo fu"
    const obiettivoPattern = /(?:l[''])?(?:obiettivo|scopo|finalità|fine)\s+(?:era|è|fu|principale)\s+(.{15,100})/i;
    const obiettivoMatch = frase.match(obiettivoPattern);
    if (obiettivoMatch) {
      fatti.push({
        tipo: 'obiettivo',
        contenuto: obiettivoMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 13. METODI/APPROCCI: "il metodo consiste in", "l'approccio prevede"
    const metodoPattern = /(?:il\s+)?(?:metodo|approccio|procedimento|sistema)\s+(?:consiste\s+in|prevede|si\s+basa\s+su|utilizza)\s+(.{15,100})/i;
    const metodoMatch = frase.match(metodoPattern);
    if (metodoMatch) {
      fatti.push({
        tipo: 'metodo',
        contenuto: metodoMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 14. CRITICHE: "le critiche riguardano", "viene criticato per"
    const critichePattern = /(?:le\s+)?(?:critiche|obiezioni)\s+(?:riguardano|sono|includono)\s+(.{15,100})/i;
    const criticheMatch = frase.match(critichePattern);
    if (criticheMatch) {
      fatti.push({
        tipo: 'critiche',
        contenuto: criticheMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 15. SIGNIFICATO/IMPORTANZA: "l'importanza sta in", "il significato è"
    const importanzaPattern = /(?:l[''])?(?:importanza|significato|rilevanza|valore)\s+(?:sta\s+in|è|consiste\s+in|risiede\s+in)\s+(.{15,100})/i;
    const importanzaMatch = frase.match(importanzaPattern);
    if (importanzaMatch) {
      fatti.push({
        tipo: 'importanza',
        contenuto: importanzaMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 16. CONFRONTI: "a differenza di X", "rispetto a X"
    const confrontoPattern = /(?:a\s+differenza\s+di|rispetto\s+a|contrariamente\s+a)\s+([A-Za-zàèéìòù\s]{3,30}),?\s+(.{15,100})/i;
    const confrontoMatch = frase.match(confrontoPattern);
    if (confrontoMatch) {
      fatti.push({
        tipo: 'confronto',
        termine1: confrontoMatch[1].trim(),
        differenza: confrontoMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 17. PRINCIPI/VALORI: "i principi di X sono", "i valori fondamentali"
    const principiPattern = /(?:i\s+)?(?:principi|valori|ideali)\s+(?:di\s+)?(?:fondamentali\s+)?(?:sono|includono|comprendono)\s+(.{15,120})/i;
    const principiMatch = frase.match(principiPattern);
    if (principiMatch) {
      fatti.push({
        tipo: 'principi_valori',
        contenuto: principiMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 18. STRUTTURA/COMPOSIZIONE: "è composto da", "si divide in"
    const strutturaPattern = /(?:è\s+)?(?:composto|costituito|formato)\s+da\s+(.{15,100})|si\s+divide\s+in\s+(.{15,100})/i;
    const strutturaMatch = frase.match(strutturaPattern);
    if (strutturaMatch) {
      fatti.push({
        tipo: 'struttura',
        contenuto: (strutturaMatch[1] || strutturaMatch[2]).trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 19. AFFERMAZIONI: "X afferma/sostiene/ritiene che Y"
    const affermazionePattern = /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:afferma|sostiene|ritiene|pensa|crede)\s+che\s+(.{15,100})/i;
    const affermazioneMatch = frase.match(affermazionePattern);
    if (affermazioneMatch) {
      fatti.push({
        tipo: 'affermazione',
        autore: affermazioneMatch[1].trim(),
        contenuto: affermazioneMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 20. FUNZIONI/RUOLI: "la funzione di X è", "il ruolo di X consiste"
    const funzionePattern = /(?:la\s+)?(?:funzione|ruolo|compito)\s+(?:di\s+)?(.{5,30}?)\s+(?:è|consiste\s+in|riguarda)\s+(.{15,100})/i;
    const funzioneMatch = frase.match(funzionePattern);
    if (funzioneMatch && !funzioneMatch[1].match(/^(questo|quello|che)/i)) {
      fatti.push({
        tipo: 'funzione',
        soggetto: funzioneMatch[1].trim(),
        descrizione: funzioneMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 21. TIPOLOGIE: "esistono X tipi di Y", "si distinguono X categorie"
    const tipologiePattern = /(?:esistono|si\s+distinguono|ci\s+sono)\s+(?:(\d+|tre|due|quattro|cinque)\s+)?(?:tipi|forme|categorie|tipologie)\s+(?:di\s+)?([a-zàèéìòùA-Z\s]{3,40})/i;
    const tipologieMatch = frase.match(tipologiePattern);
    if (tipologieMatch) {
      fatti.push({
        tipo: 'tipologie',
        numero: tipologieMatch[1] || 'vari',
        soggetto: tipologieMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 22. DIFFERENZE: "la differenza tra X e Y è/sta in"
    const differenzaPattern = /(?:la\s+)?differenza\s+(?:tra|fra)\s+([A-Za-zàèéìòù\s]{3,30})\s+e\s+([A-Za-zàèéìòù\s]{3,30})\s+(?:è|sta\s+in|consiste\s+in)\s+(.{15,100})/i;
    const differenzaMatch = frase.match(differenzaPattern);
    if (differenzaMatch) {
      fatti.push({
        tipo: 'differenza',
        termine1: differenzaMatch[1].trim(),
        termine2: differenzaMatch[2].trim(),
        spiegazione: differenzaMatch[3].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.9
      });
    }
    
    // 23. ESEMPI: "un esempio è", "ad esempio X"
    const esempioPattern = /(?:un\s+)?esempio\s+(?:è|di\s+.{5,30}\s+è)\s+(.{10,80})/i;
    const esempioMatch = frase.match(esempioPattern);
    if (esempioMatch) {
      fatti.push({
        tipo: 'esempio',
        contenuto: esempioMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.8
      });
    }
    
    // 24. ORIGINI: "l'origine di X risale", "X deriva da", "X nasce da"
    const originePattern = /(?:l[''])?(?:origine|nascita)\s+(?:di\s+)?(.{5,30}?)\s+(?:risale\s+a|deriva\s+da|nasce\s+da)\s+(.{10,80})/i;
    const origineMatch = frase.match(originePattern);
    if (origineMatch) {
      fatti.push({
        tipo: 'origine',
        soggetto: origineMatch[1].trim(),
        descrizione: origineMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 25. FRASI INFORMATIVE GENERICHE: "X è Y" dove X è un concetto e Y è una descrizione
    const frasiInformativePattern = /^([A-Z][a-zàèéìòù]+(?:\s+[a-zàèéìòù]+){0,3})\s+è\s+(?:un[ao']?\s+)?(.{20,100})[.!]?$/i;
    const frasiMatch = frase.match(frasiInformativePattern);
    if (frasiMatch && frasiMatch[1].length > 3 && frasiMatch[1].length < 40) {
      const soggetto = frasiMatch[1].trim();
      // Escludi soggetti generici
      if (!soggetto.match(/^(questo|quello|che|il|la|lo|essa|esso|lui|lei|ciò)/i)) {
        fatti.push({
          tipo: 'frase_informativa',
          soggetto: soggetto,
          descrizione: frasiMatch[2].trim(),
          frase: frase,
          contesto: contesto,
          confidenza: 0.75
        });
      }
    }
    
    // 26. PROCESSI: "il processo di X comporta/prevede Y"
    const processoPattern = /(?:il\s+)?processo\s+(?:di\s+)?([a-zàèéìòùA-Z\s]{3,25})\s+(?:comporta|prevede|richiede|implica)\s+(.{15,100})/i;
    const processoMatch = frase.match(processoPattern);
    if (processoMatch) {
      fatti.push({
        tipo: 'processo',
        nome: processoMatch[1].trim(),
        descrizione: processoMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // 27. RISULTATI: "il risultato è/fu"
    const risultatoPattern = /(?:il\s+)?risultato\s+(?:è|fu|finale)\s+(.{15,100})/i;
    const risultatoMatch = frase.match(risultatoPattern);
    if (risultatoMatch) {
      fatti.push({
        tipo: 'risultato',
        contenuto: risultatoMatch[1].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    return fatti;
  }
  
  // ============ PATTERN AGGRESSIVI PER TESTI SPECIALI ============
  
  estraiFattiSpeciali(frase, contesto, materia) {
    const fatti = [];
    
    // ENCICLICHE/DOCUMENTI con anno: "Titolo (anno)" o "Titolo anno"
    const enciclicaPattern = /([A-Z][a-zàèéìòù]+(?:\s+[A-Z]?[a-zàèéìòù]+){0,3})\s*\((\d{4})\)\s*([A-Z][a-zàèéìòù\s]+)?:?\s*(.{10,100})?/;
    const enciclicaMatch = frase.match(enciclicaPattern);
    if (enciclicaMatch && enciclicaMatch[2].match(/^1[89]\d{2}|20[0-2]\d$/)) {
      fatti.push({
        tipo: 'documento',
        titolo: enciclicaMatch[1].trim(),
        anno: enciclicaMatch[2],
        autore: enciclicaMatch[3]?.trim() || '',
        contenuto: enciclicaMatch[4]?.trim() || frase.substring(0, 80),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // CONCETTI con "include/comprende": "X include Y, Z, W"
    const includePattern = /([A-Za-zàèéìòù\s]{5,40}?)\s+(?:include|comprende|consiste\s+in|prevede|significa|implica)\s+(.{15,150})/i;
    const includeMatch = frase.match(includePattern);
    if (includeMatch && !includeMatch[1].match(/^(questo|quello|che|il|la|lo)/i)) {
      fatti.push({
        tipo: 'concetto_include',
        concetto: includeMatch[1].trim(),
        contenuto: includeMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.8
      });
    }
    
    // PRINCIPI numerati: "1) X" o "Principio 1: X"
    const principioPattern = /(?:(\d)\)|Principio\s+\d:?)\s*([A-Za-zàèéìòù\s]{5,30}?)(?::|include|comprende|è)\s*(.{10,100})/i;
    const principioMatch = frase.match(principioPattern);
    if (principioMatch) {
      fatti.push({
        tipo: 'principio',
        numero: principioMatch[1],
        nome: principioMatch[2].trim(),
        descrizione: principioMatch[3].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    // AUTORI LATINI con formato "Nome nasce/nacque a Luogo anno"
    const autoreAnnoPattern = /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)*)\s+(?:nasce|nacque)\s+(?:a\s+)?([A-Za-zàèéìòù\s]+?)\s+(\d+)\s*(?:a\.?\s*C\.?|d\.?\s*C\.?)?/i;
    const autoreMatch = frase.match(autoreAnnoPattern);
    if (autoreMatch) {
      fatti.push({
        tipo: 'nascita',
        soggetto: autoreMatch[1].trim(),
        luogo: autoreMatch[2].trim(),
        anno: autoreMatch[3],
        frase: frase,
        contesto: contesto,
        confidenza: 0.9
      });
    }
    
    // OPERE LATINE: "Titolo sono/è opera..."
    const operaLatinaPattern = /(?:Le\s+)?([A-Z][a-zàèéìòù]+(?:\s+[a-zàèéìòùA-Z]+){0,4})\s+(?:sono|è)\s+(?:l[''])?opera\s+(.{10,80})/i;
    const operaLatinaMatch = frase.match(operaLatinaPattern);
    if (operaLatinaMatch) {
      fatti.push({
        tipo: 'opera_latina',
        titolo: operaLatinaMatch[1].trim(),
        descrizione: operaLatinaMatch[2].trim(),
        frase: frase,
        contesto: contesto,
        confidenza: 0.85
      });
    }
    
    return fatti;
  }
  
  estraiFattiDefinitori(frase, contesto) {
    const fatti = [];
    
    // Parole da escludere come termini (articoli, preposizioni, verbi comuni)
    const terminiInvalidi = ['non', 'che', 'come', 'anche', 'solo', 'ancora', 'sempre', 'mai', 'già', 'ora', 'poi', 'così', 'tanto', 'poco', 'molto', 'tutto', 'ogni', 'altro', 'stesso', 'proprio', 'quale', 'questo', 'quello', 'suo', 'loro', 'nostro', 'vostro'];
    
    // DEFINIZIONE: Pattern rigorosi
    const defPatterns = [
      // "Il/La X è Y" dove X è un sostantivo specifico
      /^(?:Il|La|Lo|L[''])\s+([A-Z][a-zàèéìòù]+(?:\s+[a-zàèéìòù]+)?)\s+(?:è|rappresenta|costituisce|indica)\s+(.{25,200})/i,
      // "Per X si intende Y"
      /^Per\s+["«]?([a-zàèéìòùA-Z][a-zàèéìòù\s]{3,25})["»]?\s+si\s+intende\s+(.{25,200})/i,
      // "X: definizione" (con due punti)
      /^([A-Z][a-zàèéìòù]+(?:\s+[a-zàèéìòù]+)?)\s*:\s+(.{25,200})/
    ];
    
    for (const pattern of defPatterns) {
      const match = frase.match(pattern);
      if (match) {
        const termine = match[1].trim().toLowerCase();
        const definizione = match[2].trim();
        
        // VALIDAZIONE RIGOROSA DEL TERMINE
        // 1. Non deve contenere parole invalide
        if (terminiInvalidi.some(inv => termine.includes(inv))) continue;
        
        // 2. Lunghezza ragionevole (3-30 caratteri)
        if (termine.length < 3 || termine.length > 30) continue;
        
        // 3. Non deve essere troncato (deve essere una parola completa)
        if (termine.match(/\s+(di|del|della|a|da|in|con|su|per|tra|fra)$/)) continue;
        
        // 4. Deve iniziare con lettera
        if (!termine.match(/^[a-zàèéìòù]/i)) continue;
        
        // VALIDAZIONE DELLA DEFINIZIONE
        // 1. Deve avere senso (contenere verbi o sostantivi)
        if (definizione.length < 25) continue;
        
        // 2. Non deve essere una lista o frammento
        if (definizione.match(/^[a-z]/) && !definizione.match(/^(un|una|il|la|lo|l'|che|come)/i)) continue;
        
        fatti.push({
          tipo: 'definizione',
          termine: match[1].trim(), // Mantieni case originale
          definizione: definizione.replace(/[.,]$/, ''),
          frase: frase,
          contesto: contesto,
          confidenza: 0.85
        });
        break;
      }
    }
    
    return fatti;
  }
  
  deduplicaFatti(fatti) {
    const seen = new Set();
    return fatti.filter(fatto => {
      const key = `${fatto.tipo}_${fatto.soggetto || fatto.termine || fatto.titolo || fatto.concetto}_${fatto.anno || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// ============================================================
// 3. DISTRACTOR GENERATOR - Distrattori intelligenti
// ============================================================

class DistractorGenerator {
  constructor() {
    this.kb = KNOWLEDGE_BASE;
  }
  
  /**
   * Genera distrattori per date basati su errori comuni
   */
  generaDistrattoriData(annoCorretto, tipo, soggetto, materia) {
    const anno = parseInt(annoCorretto);
    const distrattori = new Set();
    
    // 1. Errori comuni: confusione decenni vicini
    distrattori.add(String(anno - 10));
    distrattori.add(String(anno + 10));
    
    // 2. Errori comuni: stesso decennio
    distrattori.add(String(anno - 3));
    distrattori.add(String(anno + 5));
    
    // 3. Date correlate (nascita/morte dello stesso autore)
    if (materia === 'italiano' && this.kb.autori_italiani) {
      for (const [nome, info] of Object.entries(this.kb.autori_italiani)) {
        if (soggetto && nome.includes(soggetto.split(' ')[0])) continue; // Evita lo stesso autore
        const [nascita, morte] = info.anni.split('-');
        if (Math.abs(parseInt(nascita) - anno) < 50) distrattori.add(nascita);
        if (Math.abs(parseInt(morte) - anno) < 50) distrattori.add(morte);
      }
    }
    
    if (materia === 'filosofia' && this.kb.filosofi) {
      for (const [nome, info] of Object.entries(this.kb.filosofi)) {
        if (soggetto && nome.includes(soggetto.split(' ')[0])) continue;
        const [nascita, morte] = info.anni.split('-');
        if (Math.abs(parseInt(nascita) - anno) < 50) distrattori.add(nascita);
        if (Math.abs(parseInt(morte) - anno) < 50) distrattori.add(morte);
      }
    }
    
    // Rimuovi l'anno corretto e limita a 3
    distrattori.delete(annoCorretto);
    return [...distrattori].slice(0, 3);
  }
  
  /**
   * Genera distrattori per luoghi
   */
  generaDistrattoriLuogo(luogoCorretto, soggetto, materia) {
    const distrattori = new Set();
    
    // Luoghi correlati per materia
    if (materia === 'italiano') {
      const cittaItaliane = ['Milano', 'Roma', 'Firenze', 'Napoli', 'Venezia', 'Torino', 'Bologna', 'Genova', 'Palermo', 'Trieste', 'Recanati', 'Catania'];
      cittaItaliane.filter(c => c.toLowerCase() !== luogoCorretto.toLowerCase()).forEach(c => distrattori.add(c));
    }
    
    if (materia === 'filosofia') {
      const cittaEuropee = ['Berlino', 'Parigi', 'Vienna', 'Londra', 'Königsberg', 'Friburgo', 'Basilea', 'Francoforte', 'Gottinga', 'Jena'];
      cittaEuropee.filter(c => c.toLowerCase() !== luogoCorretto.toLowerCase()).forEach(c => distrattori.add(c));
    }
    
    return [...distrattori].sort(() => Math.random() - 0.5).slice(0, 3);
  }
  
  /**
   * Genera distrattori per persone (maestri, influenze)
   */
  generaDistrattoriPersona(personaCorretta, tipo, materia) {
    const distrattori = new Set();
    
    if (materia === 'filosofia' && this.kb.filosofi) {
      Object.keys(this.kb.filosofi)
        .filter(nome => !nome.toLowerCase().includes(personaCorretta.toLowerCase()))
        .forEach(nome => distrattori.add(nome.split(' ').pop())); // Solo cognome
    }
    
    if (materia === 'italiano' && this.kb.autori_italiani) {
      Object.keys(this.kb.autori_italiani)
        .filter(nome => !nome.toLowerCase().includes(personaCorretta.toLowerCase()))
        .forEach(nome => distrattori.add(nome.split(' ').pop()));
    }
    
    return [...distrattori].sort(() => Math.random() - 0.5).slice(0, 3);
  }
  
  /**
   * Genera distrattori per movimenti/correnti
   */
  generaDistrattoriMovimento(movimentoCorretto, materia) {
    const distrattori = new Set();
    
    if (materia === 'italiano' && this.kb.movimenti_letterari) {
      Object.keys(this.kb.movimenti_letterari)
        .filter(m => m.toLowerCase() !== movimentoCorretto.toLowerCase())
        .forEach(m => distrattori.add(m));
    }
    
    if (materia === 'filosofia' && this.kb.correnti_filosofiche) {
      Object.keys(this.kb.correnti_filosofiche)
        .filter(c => c.toLowerCase() !== movimentoCorretto.toLowerCase())
        .forEach(c => distrattori.add(c));
    }
    
    return [...distrattori].sort(() => Math.random() - 0.5).slice(0, 3);
  }
  
  /**
   * Genera distrattori intelligenti per definizioni
   * VERSIONE PULITA: Solo distrattori predefiniti per materia, NO manipolazione testo
   */
  generaDistrattoriDefinizione(defCorretta, termine, materia) {
    const distrattori = [];
    const termineLower = termine.toLowerCase();
    const defLunghezza = defCorretta?.length || 50;
    
    // DATABASE DISTRATTORI PER MATERIA
    const distrattoriPerMateria = {
      filosofia: {
        // Distrattori per concetti filosofici comuni
        patterns: {
          'essere': ['il divenire continuo della realtà', 'la negazione della sostanza', 'l\'apparenza fenomenica'],
          'coscienza': ['l\'inconscio freudiano', 'la materia cerebrale', 'il riflesso condizionato'],
          'libertà': ['il determinismo causale', 'la necessità naturale', 'l\'istinto biologico'],
          'ragione': ['l\'intuizione mistica', 'il sentimento irrazionale', 'l\'istinto primordiale'],
          'verità': ['l\'opinione soggettiva', 'l\'apparenza sensibile', 'il relativismo assoluto'],
          'tempo': ['lo spazio euclideo', 'la materia inerte', 'il numero astratto'],
          'esistenza': ['l\'essenza astratta', 'il concetto universale', 'la categoria logica'],
          'default': [
            'un principio della metafisica classica opposto a quello descritto',
            'una categoria della logica formale non applicabile in questo contesto',
            'un concetto dell\'empirismo che nega questa posizione'
          ]
        }
      },
      italiano: {
        patterns: {
          'romanticismo': ['il razionalismo illuminista', 'il realismo oggettivo', 'il classicismo formale'],
          'verismo': ['l\'idealismo romantico', 'il simbolismo decadente', 'l\'estetismo dannunziano'],
          'decadentismo': ['il naturalismo zoliano', 'il positivismo scientifico', 'il realismo sociale'],
          'pessimismo': ['l\'ottimismo illuminista', 'il progressismo positivista', 'l\'edonismo classico'],
          'sublime': ['il bello armonico classico', 'il grazioso rococò', 'il pittoresco romantico'],
          'default': [
            'una corrente letteraria opposta a quella descritta nel testo',
            'un movimento artistico del periodo precedente',
            'una tendenza culturale di matrice razionalista'
          ]
        }
      },
      storia: {
        patterns: {
          'rivoluzione': ['la restaurazione monarchica', 'il conservatorismo aristocratico', 'il riformismo moderato'],
          'guerra': ['il trattato di pace', 'l\'alleanza diplomatica', 'la neutralità armata'],
          'default': [
            'un evento del periodo precedente con conseguenze opposte',
            'un movimento politico di segno contrario',
            'una riforma istituzionale di stampo conservatore'
          ]
        }
      },
      fisica: {
        patterns: {
          'energia': ['la quantità di moto del sistema', 'la forza peso applicata', 'l\'accelerazione istantanea'],
          'forza': ['la velocità del corpo', 'l\'energia potenziale', 'la massa inerziale'],
          'campo': ['una particella elementare', 'un\'onda meccanica', 'una forza di contatto'],
          'resistenza': ['la capacità elettrica del condensatore', 'l\'induttanza della bobina', 'la conduttanza del materiale'],
          'corrente': ['la differenza di potenziale', 'la resistività del materiale', 'il campo magnetico statico'],
          'default': [
            'una grandezza vettoriale ortogonale a quella descritta',
            'una proprietà intensiva del sistema termodinamico',
            'un coefficiente adimensionale del fenomeno'
          ]
        }
      },
      matematica: {
        patterns: {
          'funzione': ['una relazione non univoca', 'un insieme privo di struttura', 'una corrispondenza biunivoca inversa'],
          'derivata': ['l\'integrale indefinito della funzione', 'il limite del rapporto incrementale inverso', 'la primitiva della funzione composta'],
          'integrale': ['la derivata seconda della funzione', 'il limite della serie di Taylor', 'la somma della progressione aritmetica'],
          'limite': ['il valore massimo della funzione', 'la derivata nel punto di discontinuità', 'l\'estremo superiore dell\'insieme'],
          'composizione': ['il prodotto scalare delle funzioni', 'la somma delle funzioni componenti', 'l\'inversa della funzione risultante'],
          'insieme': ['una sequenza ordinata di elementi', 'una funzione a valori discreti', 'una relazione d\'ordine totale'],
          'default': [
            'un\'operazione algebrica di natura differente',
            'una proprietà topologica non equivalente',
            'una struttura matematica di ordine superiore'
          ]
        }
      },
      scienze: {
        patterns: {
          'cellula': ['un tessuto connettivo', 'un organo complesso', 'una molecola organica'],
          'dna': ['una proteina strutturale', 'un lipide di membrana', 'un carboidrato complesso'],
          'evoluzione': ['la creazione spontanea', 'la generazione diretta', 'la trasformazione istantanea'],
          'default': [
            'un processo biochimico di natura opposta',
            'una struttura anatomica non correlata',
            'un meccanismo fisiologico differente'
          ]
        }
      },
      default: [
        'una nozione tecnica appartenente a un ambito affine ma distinto',
        'un concetto spesso confuso ma con proprietà differenti',
        'una definizione alternativa non accettata dalla comunità scientifica'
      ]
    };
    
    // Seleziona distrattori per materia
    const materiaData = distrattoriPerMateria[materia] || {};
    const patterns = materiaData.patterns || {};
    
    // Cerca distrattori specifici per il termine
    let distSpecifici = null;
    for (const [key, values] of Object.entries(patterns)) {
      if (termineLower.includes(key) || key === 'default') {
        if (key !== 'default') {
          distSpecifici = values;
          break;
        }
      }
    }
    
    // Usa distrattori specifici o default per materia
    if (distSpecifici) {
      distrattori.push(...distSpecifici);
    } else if (patterns.default) {
      distrattori.push(...patterns.default);
    } else {
      distrattori.push(...distrattoriPerMateria.default);
    }
    
    // ADATTA LUNGHEZZA: Se la risposta corretta è corta, accorcia i distrattori
    const maxLen = Math.min(defLunghezza + 20, 100);
    const distrattoriAdattati = distrattori.map(d => {
      if (d.length > maxLen) {
        return d.substring(0, maxLen - 3) + '...';
      }
      return d;
    });
    
    return distrattoriAdattati.slice(0, 3);
  }
}

// ============================================================
// 4. QUESTION GENERATOR - Generatore domande contestuali
// ============================================================

class QuestionGenerator {
  constructor() {
    this.distractorGen = new DistractorGenerator();
  }
  
  /**
   * Genera quiz da un fatto estratto
   */
  generaQuizDaFatto(fatto, materia, sottoargomento) {
    const quiz = [];
    const timestamp = Date.now();
    
    switch (fatto.tipo) {
      case 'nascita':
        quiz.push(...this.generaQuizNascita(fatto, materia, sottoargomento, timestamp));
        break;
      case 'morte':
        quiz.push(...this.generaQuizMorte(fatto, materia, sottoargomento, timestamp));
        break;
      case 'opera':
        quiz.push(...this.generaQuizOpera(fatto, materia, sottoargomento, timestamp));
        break;
      case 'relazione_allievo':
        quiz.push(...this.generaQuizRelazione(fatto, materia, sottoargomento, timestamp));
        break;
      case 'ruolo_movimento':
        quiz.push(...this.generaQuizRuolo(fatto, materia, sottoargomento, timestamp));
        break;
      case 'concetto_introdotto':
        quiz.push(...this.generaQuizConcetto(fatto, materia, sottoargomento, timestamp));
        break;
      case 'definizione':
        quiz.push(...this.generaQuizDefinizione(fatto, materia, sottoargomento, timestamp));
        break;
      case 'scoperta':
        quiz.push(...this.generaQuizScoperta(fatto, materia, sottoargomento, timestamp));
        break;
      case 'legge':
        quiz.push(...this.generaQuizLegge(fatto, materia, sottoargomento, timestamp));
        break;
      // NUOVI TIPI PER MATEMATICA/FISICA
      case 'teorema':
        quiz.push(...this.generaQuizTeorema(fatto, materia, sottoargomento, timestamp));
        break;
      case 'formula':
        quiz.push(...this.generaQuizFormula(fatto, materia, sottoargomento, timestamp));
        break;
      case 'unita_misura':
        quiz.push(...this.generaQuizUnita(fatto, materia, sottoargomento, timestamp));
        break;
      case 'definizione_tecnica':
        quiz.push(...this.generaQuizDefTecnica(fatto, materia, sottoargomento, timestamp));
        break;
      case 'costante':
        quiz.push(...this.generaQuizCostante(fatto, materia, sottoargomento, timestamp));
        break;
      // NUOVI TIPI SPECIALI
      case 'documento':
        quiz.push(...this.generaQuizDocumento(fatto, materia, sottoargomento, timestamp));
        break;
      case 'concetto_include':
        quiz.push(...this.generaQuizConcettoInclude(fatto, materia, sottoargomento, timestamp));
        break;
      case 'principio':
        quiz.push(...this.generaQuizPrincipio(fatto, materia, sottoargomento, timestamp));
        break;
      case 'opera_latina':
        quiz.push(...this.generaQuizOperaLatina(fatto, materia, sottoargomento, timestamp));
        break;
      // TIPI UMANISTICI INTELLIGENTI
      case 'tema_letterario':
        quiz.push(...this.generaQuizTema(fatto, materia, sottoargomento, timestamp));
        break;
      case 'opera_descrizione':
        quiz.push(...this.generaQuizOperaDesc(fatto, materia, sottoargomento, timestamp));
        break;
      case 'personaggio_ruolo':
        quiz.push(...this.generaQuizPersonaggio(fatto, materia, sottoargomento, timestamp));
        break;
      case 'concetto_teoria':
        quiz.push(...this.generaQuizConcettoTeoria(fatto, materia, sottoargomento, timestamp));
        break;
      case 'cause':
        quiz.push(...this.generaQuizCause(fatto, materia, sottoargomento, timestamp));
        break;
      case 'conseguenze':
        quiz.push(...this.generaQuizConseguenze(fatto, materia, sottoargomento, timestamp));
        break;
      case 'caratteristiche':
        quiz.push(...this.generaQuizCaratteristiche(fatto, materia, sottoargomento, timestamp));
        break;
      case 'citazione':
        quiz.push(...this.generaQuizCitazione(fatto, materia, sottoargomento, timestamp));
        break;
      // NUOVI TIPI AGGIUNTIVI
      case 'evento_data':
        quiz.push(...this.generaQuizEventoData(fatto, materia, sottoargomento, timestamp));
        break;
      case 'riforme':
        quiz.push(...this.generaQuizRiforme(fatto, materia, sottoargomento, timestamp));
        break;
      case 'influenza':
        quiz.push(...this.generaQuizInfluenza(fatto, materia, sottoargomento, timestamp));
        break;
      case 'obiettivo':
        quiz.push(...this.generaQuizObiettivo(fatto, materia, sottoargomento, timestamp));
        break;
      case 'metodo':
        quiz.push(...this.generaQuizMetodo(fatto, materia, sottoargomento, timestamp));
        break;
      case 'critiche':
        quiz.push(...this.generaQuizCritiche(fatto, materia, sottoargomento, timestamp));
        break;
      case 'importanza':
        quiz.push(...this.generaQuizImportanza(fatto, materia, sottoargomento, timestamp));
        break;
      case 'confronto':
        quiz.push(...this.generaQuizConfronto(fatto, materia, sottoargomento, timestamp));
        break;
      case 'principi_valori':
        quiz.push(...this.generaQuizPrincipiValori(fatto, materia, sottoargomento, timestamp));
        break;
      case 'struttura':
        quiz.push(...this.generaQuizStruttura(fatto, materia, sottoargomento, timestamp));
        break;
      case 'affermazione':
        quiz.push(...this.generaQuizAffermazione(fatto, materia, sottoargomento, timestamp));
        break;
      case 'funzione':
        quiz.push(...this.generaQuizFunzione(fatto, materia, sottoargomento, timestamp));
        break;
      case 'tipologie':
        quiz.push(...this.generaQuizTipologie(fatto, materia, sottoargomento, timestamp));
        break;
      case 'differenza':
        quiz.push(...this.generaQuizDifferenza(fatto, materia, sottoargomento, timestamp));
        break;
      case 'esempio':
        quiz.push(...this.generaQuizEsempio(fatto, materia, sottoargomento, timestamp));
        break;
      case 'origine':
        quiz.push(...this.generaQuizOrigine(fatto, materia, sottoargomento, timestamp));
        break;
      case 'frase_informativa':
        quiz.push(...this.generaQuizFraseInfo(fatto, materia, sottoargomento, timestamp));
        break;
      case 'processo':
        quiz.push(...this.generaQuizProcesso(fatto, materia, sottoargomento, timestamp));
        break;
      case 'risultato':
        quiz.push(...this.generaQuizRisultato(fatto, materia, sottoargomento, timestamp));
        break;
    }
    
    return quiz.filter(q => this.validaQuiz(q));
  }
  
  generaQuizNascita(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const distrattoriAnno = this.distractorGen.generaDistrattoriData(fatto.anno, 'nascita', fatto.soggetto, materia);
    
    // SOLO 1-2 QUIZ PER FATTO, NON DUPLICATI
    if (distrattoriAnno.length >= 3) {
      quiz.push({
        id: `nascita_${ts}`,
        domanda: `In quale anno nacque ${fatto.soggetto}?`,
        opzioni: this.mescola([fatto.anno, ...distrattoriAnno]),
        rispostaCorretta: fatto.anno,
        spiegazione: `${fatto.soggetto} nacque nel ${fatto.anno}${fatto.luogo ? ` a ${fatto.luogo}` : ''}.`,
        livello: 'conoscenza',
        tipo: 'multipla',
        materia,
        argomento: sottoargomento,
        qualita: 0.95
      });
    }
    
    // Solo 1 quiz luogo se disponibile
    if (fatto.luogo && fatto.luogo.length > 2) {
      const distrattoriLuogo = this.distractorGen.generaDistrattoriLuogo(fatto.luogo, fatto.soggetto, materia);
      if (distrattoriLuogo.length >= 3) {
        quiz.push({
          id: `nascita_luogo_${ts}`,
          domanda: `Dove nacque ${fatto.soggetto}?`,
          opzioni: this.mescola([fatto.luogo, ...distrattoriLuogo]),
          rispostaCorretta: fatto.luogo,
          spiegazione: `${fatto.soggetto} nacque a ${fatto.luogo} nel ${fatto.anno}.`,
          livello: 'conoscenza',
          tipo: 'multipla',
          materia,
          argomento: sottoargomento,
          qualita: 0.9
        });
      }
    }
    
    return quiz;
  }
  
  generaQuizMorte(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const distrattori = this.distractorGen.generaDistrattoriData(fatto.anno, 'morte', fatto.soggetto, materia);
    
    if (distrattori.length >= 3) {
      quiz.push({
        id: `morte_anno_${ts}`,
        domanda: `In quale anno morì ${fatto.soggetto}?`,
        opzioni: this.mescola([fatto.anno, ...distrattori]),
        rispostaCorretta: fatto.anno,
        spiegazione: `${fatto.soggetto} morì nel ${fatto.anno}${fatto.luogo ? ` a ${fatto.luogo}` : ''}.`,
        livello: 'conoscenza',
        tipo: 'multipla',
        materia,
        argomento: sottoargomento,
        qualita: 0.95
      });
    }
    
    return quiz;
  }
  
  generaQuizOpera(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const distrattori = this.distractorGen.generaDistrattoriData(fatto.anno, 'opera', fatto.autore, materia);
    
    if (distrattori.length >= 3) {
      quiz.push({
        id: `opera_${ts}`,
        domanda: `In quale anno fu pubblicata l'opera "${fatto.titolo}"?`,
        opzioni: this.mescola([fatto.anno, ...distrattori]),
        rispostaCorretta: fatto.anno,
        spiegazione: `"${fatto.titolo}" fu pubblicata nel ${fatto.anno}${fatto.autore ? ` da ${fatto.autore}` : ''}.`,
        livello: 'conoscenza',
        tipo: 'multipla',
        materia,
        argomento: sottoargomento,
        qualita: 0.9
      });
    }
    
    return quiz;
  }
  
  generaQuizRelazione(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const distrattori = this.distractorGen.generaDistrattoriPersona(fatto.maestro, 'maestro', materia);
    
    if (distrattori.length >= 3) {
      quiz.push({
        id: `relazione_${ts}`,
        domanda: `Di chi fu allievo ${fatto.allievo}?`,
        opzioni: this.mescola([fatto.maestro, ...distrattori]),
        rispostaCorretta: fatto.maestro,
        spiegazione: `${fatto.allievo} fu allievo di ${fatto.maestro}.`,
        livello: 'conoscenza',
        tipo: 'multipla',
        materia,
        argomento: sottoargomento,
        qualita: 0.95
      });
    }
    
    return quiz;
  }
  
  generaQuizRuolo(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const distrattori = this.distractorGen.generaDistrattoriMovimento(fatto.movimento, materia);
    
    if (distrattori.length >= 3) {
      quiz.push({
        id: `ruolo_${ts}`,
        domanda: `Di quale corrente/movimento fu esponente ${fatto.persona}?`,
        opzioni: this.mescola([fatto.movimento, ...distrattori]),
        rispostaCorretta: fatto.movimento,
        spiegazione: `${fatto.persona} fu esponente del ${fatto.movimento}.`,
        livello: 'comprensione',
        tipo: 'multipla',
        materia,
        argomento: sottoargomento,
        qualita: 0.9
      });
    }
    
    return quiz;
  }
  
  generaQuizConcetto(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const distrattori = this.distractorGen.generaDistrattoriPersona(fatto.autore, 'autore', materia);
    
    if (distrattori.length >= 3) {
      quiz.push({
        id: `concetto_${ts}`,
        domanda: `Chi elaborò il concetto di "${fatto.concetto}"?`,
        opzioni: this.mescola([fatto.autore, ...distrattori]),
        rispostaCorretta: fatto.autore,
        spiegazione: `Il concetto di "${fatto.concetto}" fu elaborato da ${fatto.autore}.`,
        livello: 'comprensione',
        tipo: 'multipla',
        materia,
        argomento: sottoargomento,
        qualita: 0.9
      });
    }
    
    return quiz;
  }
  
  generaQuizDefinizione(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    
    // VALIDAZIONE AGGIUNTIVA
    // 1. Il termine deve essere significativo (parola singola o composta breve)
    if (!fatto.termine || fatto.termine.length < 3 || fatto.termine.length > 40) return quiz;
    
    // 2. La definizione deve essere sostanziale ma non troppo lunga
    if (!fatto.definizione || fatto.definizione.length < 20 || fatto.definizione.length > 300) return quiz;
    
    // 3. Il termine non deve contenere parole problematiche
    const termineProblematico = /\b(non|che|come|anche|solo|ancora|più|meno|molto|poco|tutto|ogni|altro|proposta|obiettivo)\b/i;
    if (termineProblematico.test(fatto.termine)) return quiz;
    
    // Genera distrattori intelligenti
    const distrattori = this.distractorGen.generaDistrattoriDefinizione(
      fatto.definizione, 
      fatto.termine, 
      materia
    );
    
    // Verifica qualità distrattori
    if (distrattori.length < 3) return quiz;
    
    // USA LA DEFINIZIONE COMPLETA - NO TRONCAMENTO
    const defCompleta = fatto.definizione;
    
    // VALIDAZIONE FINALE: Tutte le opzioni devono essere diverse
    const opzioniSet = new Set([defCompleta.toLowerCase(), ...distrattori.map(d => d.toLowerCase())]);
    if (opzioniSet.size < 4) return quiz;
    
    // Usa template diversi per la domanda
    const templates = QUIZ_TEMPLATES.definizione;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    quiz.push({
      id: `def_${ts}`,
      domanda: template.replace('{termine}', fatto.termine),
      opzioni: this.mescola([defCompleta, ...distrattori]),
      rispostaCorretta: defCompleta,
      spiegazione: `"${fatto.termine}": ${fatto.definizione}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizScoperta(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const annoNum = parseInt(fatto.anno);
    
    // Quiz su chi fece la scoperta
    const altriScienziati = ['Newton', 'Einstein', 'Galileo', 'Maxwell', 'Volta', 'Ampere', 'Tesla', 'Edison', 'Curie', 'Fermi']
      .filter(s => s !== fatto.chi);
    
    quiz.push({
      id: `scoperta_chi_${ts}`,
      domanda: `Chi scoprì/inventò ${fatto.cosa}?`,
      opzioni: this.mescola([fatto.chi, ...altriScienziati.slice(0, 3)]),
      rispostaCorretta: fatto.chi,
      spiegazione: `${fatto.cosa} fu scoperta/inventata da ${fatto.chi} nel ${fatto.anno}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.95
    });
    
    // Quiz sull'anno
    quiz.push({
      id: `scoperta_anno_${ts}`,
      domanda: `In quale anno fu scoperta/inventata ${fatto.cosa}?`,
      opzioni: this.mescola([fatto.anno, String(annoNum - 10), String(annoNum + 15), String(annoNum - 25)]),
      rispostaCorretta: fatto.anno,
      spiegazione: `${fatto.cosa} fu scoperta da ${fatto.chi} nel ${fatto.anno}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.95
    });
    
    return quiz;
  }
  
  generaQuizLegge(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    
    // Quiz su chi formulò la legge - NON TRONCARE MAI
    const altriScienziati = ['Newton', 'Einstein', 'Galileo', 'Maxwell', 'Faraday', 'Ampere', 'Coulomb', 'Gauss', 'Boyle', 'Joule', 'Ohm', 'Volta', 'Kelvin', 'Planck', 'Heisenberg']
      .filter(s => s !== fatto.nome);
    
    // Usa il nome della legge, non il contenuto troncato
    quiz.push({
      id: `legge_chi_${ts}`,
      domanda: `Chi formulò la legge di ${fatto.nome}?`,
      opzioni: this.mescola([fatto.nome, ...altriScienziati.slice(0, 3)]),
      rispostaCorretta: fatto.nome,
      spiegazione: `La legge di ${fatto.nome} stabilisce che ${fatto.contenuto}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    // Quiz sul contenuto della legge
    quiz.push({
      id: `legge_cosa_${ts}`,
      domanda: `Cosa stabilisce la legge di ${fatto.nome}?`,
      opzioni: this.mescola([
        fatto.contenuto,
        'la conservazione dell\'energia in un sistema isolato',
        'la proporzionalità tra forza e accelerazione',
        'l\'equivalenza tra massa ed energia'
      ]),
      rispostaCorretta: fatto.contenuto,
      spiegazione: `La legge di ${fatto.nome} stabilisce che ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  // ============ GENERATORI AGGRESSIVI PER MATEMATICA/FISICA ============
  
  generaQuizTeorema(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriTeoremi = ['Pitagora', 'Euclide', 'Fermat', 'Gauss', 'Eulero', 'Lagrange', 'Cauchy', 'Bolzano', 'Weierstrass', 'Rolle', 'Taylor', 'Bernoulli']
      .filter(t => !fatto.nome.includes(t));
    
    // Quiz sul nome del teorema
    quiz.push({
      id: `teorema_nome_${ts}`,
      domanda: `Quale teorema afferma che: "${fatto.contenuto?.substring(0, 80) || fatto.frase.substring(0, 80)}..."?`,
      opzioni: this.mescola([`Teorema di ${fatto.nome}`, `Teorema di ${altriTeoremi[0]}`, `Teorema di ${altriTeoremi[1]}`, `Teorema di ${altriTeoremi[2]}`]),
      rispostaCorretta: `Teorema di ${fatto.nome}`,
      spiegazione: `Il teorema di ${fatto.nome} afferma che ${fatto.contenuto || fatto.frase}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    // Quiz vero/falso
    quiz.push({
      id: `teorema_vf_${ts}`,
      domanda: `Vero o Falso: "Il teorema di ${fatto.nome} è fondamentale in ${materia}."`,
      opzioni: ['Vero', 'Falso'],
      rispostaCorretta: 'Vero',
      spiegazione: `Il teorema di ${fatto.nome} è effettivamente un risultato importante.`,
      livello: 'conoscenza',
      tipo: 'vero_falso',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizFormula(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreFormule = ['E=mc²', 'F=ma', 'V=IR', 'P=VI', 'a²+b²=c²', 's=vt', 'W=Fd'];
    
    quiz.push({
      id: `formula_${ts}`,
      domanda: `Quale formula esprime ${fatto.simbolo}?`,
      opzioni: this.mescola([`${fatto.simbolo}=${fatto.espressione}`, ...altreFormule.slice(0, 3)]),
      rispostaCorretta: `${fatto.simbolo}=${fatto.espressione}`,
      spiegazione: `La formula corretta è ${fatto.simbolo}=${fatto.espressione}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    return quiz;
  }
  
  generaQuizUnita(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreUnita = ['Newton', 'Joule', 'Watt', 'Pascal', 'Coulomb', 'Volt', 'Ampere', 'Ohm', 'Farad', 'Tesla', 'Henry', 'Hertz']
      .filter(u => u.toLowerCase() !== fatto.nome.toLowerCase());
    
    quiz.push({
      id: `unita_${ts}`,
      domanda: `Qual è l'unità di misura per la grandezza descritta nel contesto di ${sottoargomento}?`,
      opzioni: this.mescola([fatto.nome, ...altreUnita.slice(0, 3)]),
      rispostaCorretta: fatto.nome,
      spiegazione: `L'unità di misura è il ${fatto.nome}${fatto.simbolo ? ` (${fatto.simbolo})` : ''}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizDefTecnica(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    
    // Genera distrattori specifici per materia
    let distrattori = [];
    if (materia === 'matematica') {
      distrattori = [
        'una relazione di equivalenza tra insiemi',
        'un operatore lineare su spazi vettoriali',
        'una funzione periodica trigonometrica'
      ];
    } else if (materia === 'fisica') {
      distrattori = [
        'una grandezza scalare adimensionale',
        'un campo vettoriale conservativo',
        'una proprietà estensiva del sistema'
      ];
    } else {
      distrattori = [
        'un concetto complementare a quello descritto',
        'una proprietà caratteristica del sistema',
        'una relazione funzionale inversa'
      ];
    }
    
    quiz.push({
      id: `deftec_${ts}`,
      domanda: `Cosa rappresenta "${fatto.termine}" in ${materia}?`,
      opzioni: this.mescola([fatto.definizione.substring(0, 100), ...distrattori]),
      rispostaCorretta: fatto.definizione.substring(0, 100),
      spiegazione: `${fatto.termine}: ${fatto.definizione}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // Quiz completamento
    quiz.push({
      id: `deftec_comp_${ts}`,
      domanda: `Completa: "${fatto.termine} rappresenta _____"`,
      opzioni: this.mescola([fatto.definizione.substring(0, 60), ...distrattori.map(d => d.substring(0, 60))]),
      rispostaCorretta: fatto.definizione.substring(0, 60),
      spiegazione: `${fatto.termine} rappresenta ${fatto.definizione}.`,
      livello: 'comprensione',
      tipo: 'completamento',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizCostante(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreCostanti = ['9,81 m/s²', '3×10⁸ m/s', '6,67×10⁻¹¹', '8,99×10⁹', '6,02×10²³', '1,38×10⁻²³'];
    
    quiz.push({
      id: `costante_${ts}`,
      domanda: `Qual è il valore della costante di ${fatto.nome}?`,
      opzioni: this.mescola([fatto.valore, ...altreCostanti.slice(0, 3)]),
      rispostaCorretta: fatto.valore,
      spiegazione: `La costante di ${fatto.nome} vale ${fatto.valore}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    return quiz;
  }
  
  // ============ GENERATORI PER TIPI SPECIALI (RELIGIONE/LATINO) ============
  
  generaQuizDocumento(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriAnni = [
      String(parseInt(fatto.anno) - 10),
      String(parseInt(fatto.anno) + 15),
      String(parseInt(fatto.anno) - 25)
    ];
    
    // Quiz sull'anno del documento
    quiz.push({
      id: `doc_anno_${ts}`,
      domanda: `In quale anno fu pubblicata "${fatto.titolo}"?`,
      opzioni: this.mescola([fatto.anno, ...altriAnni]),
      rispostaCorretta: fatto.anno,
      spiegazione: `"${fatto.titolo}" fu pubblicata nel ${fatto.anno}${fatto.autore ? ` da ${fatto.autore}` : ''}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    // Quiz vero/falso
    quiz.push({
      id: `doc_vf_${ts}`,
      domanda: `Vero o Falso: "${fatto.titolo}" risale al ${fatto.anno}.`,
      opzioni: ['Vero', 'Falso'],
      rispostaCorretta: 'Vero',
      spiegazione: `"${fatto.titolo}" fu effettivamente pubblicata nel ${fatto.anno}.`,
      livello: 'conoscenza',
      tipo: 'vero_falso',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // Completamento
    quiz.push({
      id: `doc_comp_${ts}`,
      domanda: `Completa: "${fatto.titolo}" fu pubblicata nel _____`,
      opzioni: this.mescola([fatto.anno, ...altriAnni]),
      rispostaCorretta: fatto.anno,
      spiegazione: `"${fatto.titolo}" fu pubblicata nel ${fatto.anno}.`,
      livello: 'conoscenza',
      tipo: 'completamento',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizConcettoInclude(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    
    // Genera distrattori specifici
    const distrattori = [
      'elementi non correlati al concetto descritto',
      'caratteristiche opposte a quelle indicate',
      'aspetti di un concetto diverso ma affine'
    ];
    
    quiz.push({
      id: `include_${ts}`,
      domanda: `Cosa include/comprende "${fatto.concetto}"?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...distrattori]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `${fatto.concetto} include ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // Quiz completamento
    quiz.push({
      id: `include_comp_${ts}`,
      domanda: `Completa: "${fatto.concetto} include _____"`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 50), ...distrattori.map(d => d.substring(0, 50))]),
      rispostaCorretta: fatto.contenuto.substring(0, 50),
      spiegazione: `${fatto.concetto} include ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'completamento',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizPrincipio(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    
    const altriPrincipi = ['sussidiarietà', 'solidarietà', 'bene comune', 'dignità', 'giustizia', 'carità']
      .filter(p => !fatto.nome.toLowerCase().includes(p));
    
    quiz.push({
      id: `principio_${ts}`,
      domanda: `Quale principio prevede: "${fatto.descrizione.substring(0, 60)}..."?`,
      opzioni: this.mescola([fatto.nome, ...altriPrincipi.slice(0, 3)]),
      rispostaCorretta: fatto.nome,
      spiegazione: `Il principio di ${fatto.nome} prevede ${fatto.descrizione}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizOperaLatina(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    
    const altreOpere = ['De rerum natura', 'Eneide', 'Metamorfosi', 'Georgiche', 'Satire', 'Epistole']
      .filter(o => !fatto.titolo.toLowerCase().includes(o.toLowerCase()));
    
    quiz.push({
      id: `opera_lat_${ts}`,
      domanda: `Quale opera "${fatto.descrizione.substring(0, 50)}..."?`,
      opzioni: this.mescola([fatto.titolo, ...altreOpere.slice(0, 3)]),
      rispostaCorretta: fatto.titolo,
      spiegazione: `"${fatto.titolo}" è l'opera che ${fatto.descrizione}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  // ============ GENERATORI UMANISTICI INTELLIGENTI ============
  
  generaQuizTema(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriTemi = ['l\'amore impossibile', 'la morte e il tempo', 'la natura matrigna', 'il progresso', 'la memoria', 'l\'esilio', 'la libertà', 'il dolore esistenziale']
      .filter(t => !fatto.tema.toLowerCase().includes(t.toLowerCase().replace('l\'', '')));
    
    quiz.push({
      id: `tema_${ts}`,
      domanda: `Quale tema esprime "${fatto.opera || sottoargomento}"?`,
      opzioni: this.mescola([fatto.tema.substring(0, 60), ...altriTemi.slice(0, 3)]),
      rispostaCorretta: fatto.tema.substring(0, 60),
      spiegazione: `L'opera esprime il tema di ${fatto.tema}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });

    // Quiz sull'opera
    quiz.push({
      id: `opera_desc_${ts}`,
      domanda: `Quale opera "${fatto.descrizione.substring(0, 50)}..."?`,
      opzioni: this.mescola([fatto.titolo, ...altreOpere.slice(0, 3)]),
      rispostaCorretta: fatto.titolo,
      spiegazione: `"${fatto.titolo}" ${fatto.descrizione}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    return quiz;
  }
  
  generaQuizPersonaggio(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriRuoli = ['il protagonista tragico', 'l\'eroe romantico', 'il simbolo della ragione', 'l\'antagonista', 'il narratore', 'il testimone degli eventi']
      .filter(r => !fatto.ruolo.toLowerCase().includes(r.toLowerCase()));
    
    quiz.push({
      id: `personaggio_${ts}`,
      domanda: `Quale ruolo ha ${fatto.nome} nell'opera?`,
      opzioni: this.mescola([fatto.ruolo, ...altriRuoli.slice(0, 3)]),
      rispostaCorretta: fatto.ruolo,
      spiegazione: `${fatto.nome} è ${fatto.ruolo}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizConcettoTeoria(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreSpiegazioni = [
      'un principio opposto a quello descritto',
      'una visione complementare ma distinta',
      'un concetto di derivazione classica diversa'
    ];
    
    quiz.push({
      id: `concetto_${ts}`,
      domanda: `Cosa afferma la teoria/concetto di "${fatto.nome}"?`,
      opzioni: this.mescola([fatto.spiegazione.substring(0, 80), ...altreSpiegazioni]),
      rispostaCorretta: fatto.spiegazione.substring(0, 80),
      spiegazione: `Il concetto di ${fatto.nome} afferma che ${fatto.spiegazione}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    // Vero/falso
    quiz.push({
      id: `concetto_vf_${ts}`,
      domanda: `Vero o Falso: Il concetto di "${fatto.nome}" afferma che ${fatto.spiegazione.substring(0, 50)}...`,
      opzioni: ['Vero', 'Falso'],
      rispostaCorretta: 'Vero',
      spiegazione: `È corretto.`,
      livello: 'conoscenza',
      tipo: 'vero_falso',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizCause(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreCause = [
      'fattori economici di natura opposta',
      'ragioni politiche non correlate al contesto',
      'motivazioni sociali di segno contrario'
    ];
    
    quiz.push({
      id: `cause_${ts}`,
      domanda: `Quali sono le cause principali di ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altreCause]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `Le cause includono ${fatto.contenuto}.`,
      livello: 'analisi',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // Completamento
    quiz.push({
      id: `cause_comp_${ts}`,
      domanda: `Completa: Le cause di ${sottoargomento} includono _____`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 60), ...altreCause.map(c => c.substring(0, 60))]),
      rispostaCorretta: fatto.contenuto.substring(0, 60),
      spiegazione: `Le cause includono ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'completamento',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizConseguenze(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreConseguenze = [
      'risultati opposti a quelli descritti',
      'effetti non correlati al fenomeno',
      'conseguenze di segno contrario'
    ];
    
    quiz.push({
      id: `conseguenze_${ts}`,
      domanda: `Quali furono le conseguenze di ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altreConseguenze]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `Le conseguenze furono ${fatto.contenuto}.`,
      livello: 'analisi',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // Vero/Falso
    quiz.push({
      id: `conseguenze_vf_${ts}`,
      domanda: `Vero o Falso: Le conseguenze di ${sottoargomento} includono ${fatto.contenuto.substring(0, 50)}...`,
      opzioni: ['Vero', 'Falso'],
      rispostaCorretta: 'Vero',
      spiegazione: `È corretto.`,
      livello: 'conoscenza',
      tipo: 'vero_falso',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizCaratteristiche(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreCaratteristiche = [
      'elementi opposti a quelli descritti',
      'tratti non pertinenti al contesto',
      'caratteristiche di un fenomeno diverso'
    ];
    
    quiz.push({
      id: `caratteristiche_${ts}`,
      domanda: `Quali sono le caratteristiche principali di ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altreCaratteristiche]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `Le caratteristiche includono ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // VERO/FALSO aggiuntivo
    quiz.push({
      id: `caratteristiche_vf_${ts}`,
      domanda: `Vero o Falso: "${sottoargomento}" presenta le seguenti caratteristiche: ${fatto.contenuto.substring(0, 50)}...`,
      opzioni: ['Vero', 'Falso'],
      rispostaCorretta: 'Vero',
      spiegazione: `È vero: le caratteristiche includono ${fatto.contenuto}.`,
      livello: 'conoscenza',
      tipo: 'vero_falso',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizCitazione(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreCitazioni = [
      'una frase di significato opposto',
      'un\'espressione non correlata al contesto',
      'un motto di autore diverso'
    ];
    
    quiz.push({
      id: `citazione_${ts}`,
      domanda: `Quale citazione/motto è associata a ${sottoargomento}?`,
      opzioni: this.mescola([fatto.testo, ...altreCitazioni]),
      rispostaCorretta: fatto.testo,
      spiegazione: `La citazione "${fatto.testo}" è fondamentale.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    return quiz;
  }
  
  // ============ 10 NUOVI GENERATORI ============
  
  generaQuizEventoData(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const annoNum = parseInt(fatto.anno);
    const altriAnni = [String(annoNum - 10), String(annoNum + 5), String(annoNum - 20)];
    
    quiz.push({
      id: `evento_${ts}`,
      domanda: `In quale anno ${fatto.evento.substring(0, 50)}?`,
      opzioni: this.mescola([fatto.anno, ...altriAnni]),
      rispostaCorretta: fatto.anno,
      spiegazione: `Nel ${fatto.anno} ${fatto.evento}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    return quiz;
  }
  
  generaQuizRiforme(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreRiforme = [
      'cambiamenti di natura opposta',
      'riforme non pertinenti al periodo',
      'trasformazioni di altro tipo'
    ];
    
    quiz.push({
      id: `riforme_${ts}`,
      domanda: `Quali riforme furono attuate in ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altreRiforme]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `Le riforme includevano ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // Vero/falso
    quiz.push({
      id: `riforme_vf_${ts}`,
      domanda: `Vero o Falso: In ${sottoargomento} furono attuate riforme che includevano ${fatto.contenuto.substring(0, 40)}...`,
      opzioni: ['Vero', 'Falso'],
      rispostaCorretta: 'Vero',
      spiegazione: `È corretto.`,
      livello: 'conoscenza',
      tipo: 'vero_falso',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizInfluenza(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriSoggetti = ['un pensatore contemporaneo', 'un movimento culturale diverso', 'una corrente filosofica opposta'];
    
    quiz.push({
      id: `influenza_${ts}`,
      domanda: `Chi/cosa influenzò ${fatto.oggetto.substring(0, 40)}?`,
      opzioni: this.mescola([fatto.soggetto, ...altriSoggetti]),
      rispostaCorretta: fatto.soggetto,
      spiegazione: `${fatto.soggetto} influenzò ${fatto.oggetto}.`,
      livello: 'analisi',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizObiettivo(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriObiettivi = [
      'uno scopo di natura opposta',
      'un fine non correlato al contesto',
      'un obiettivo di altra natura'
    ];
    
    quiz.push({
      id: `obiettivo_${ts}`,
      domanda: `Qual era l'obiettivo principale di ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altriObiettivi]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `L'obiettivo era ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // Completamento
    quiz.push({
      id: `obiettivo_comp_${ts}`,
      domanda: `Completa: L'obiettivo principale di ${sottoargomento} era _____`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 60), ...altriObiettivi.map(o => o.substring(0, 60))]),
      rispostaCorretta: fatto.contenuto.substring(0, 60),
      spiegazione: `L'obiettivo era ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'completamento',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizMetodo(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriMetodi = [
      'un approccio di tipo opposto',
      'un metodo non correlato',
      'un procedimento differente'
    ];
    
    quiz.push({
      id: `metodo_${ts}`,
      domanda: `Quale metodo/approccio caratterizza ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altriMetodi]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `Il metodo consiste in ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizCritiche(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreCritiche = [
      'obiezioni di natura diversa',
      'critiche non pertinenti',
      'rilievi di altro tipo'
    ];
    
    quiz.push({
      id: `critiche_${ts}`,
      domanda: `Quali critiche vengono mosse a ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altreCritiche]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `Le critiche riguardano ${fatto.contenuto}.`,
      livello: 'analisi',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizImportanza(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreImportanze = [
      'un significato di natura opposta',
      'una rilevanza non correlata',
      'un valore diverso'
    ];
    
    quiz.push({
      id: `importanza_${ts}`,
      domanda: `Qual è l'importanza/significato di ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altreImportanze]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `L'importanza sta in ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizConfronto(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreDifferenze = [
      'elementi di continuità invece che differenze',
      'aspetti non pertinenti al confronto',
      'caratteristiche comuni invece che distintive'
    ];
    
    quiz.push({
      id: `confronto_${ts}`,
      domanda: `A differenza di ${fatto.termine1}, ${sottoargomento}...?`,
      opzioni: this.mescola([fatto.differenza.substring(0, 80), ...altreDifferenze]),
      rispostaCorretta: fatto.differenza.substring(0, 80),
      spiegazione: `A differenza di ${fatto.termine1}, ${fatto.differenza}.`,
      livello: 'analisi',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    return quiz;
  }
  
  generaQuizPrincipiValori(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriPrincipi = [
      'valori di natura opposta',
      'principi non correlati',
      'ideali di altro tipo'
    ];
    
    quiz.push({
      id: `principi_${ts}`,
      domanda: `Quali principi/valori fondano ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altriPrincipi]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `I principi fondamentali sono ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizStruttura(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreStrutture = [
      'una composizione diversa',
      'elementi non pertinenti',
      'una struttura differente'
    ];
    
    quiz.push({
      id: `struttura_${ts}`,
      domanda: `Come è strutturato/composto ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altreStrutture]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `È composto da ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizAffermazione(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriAutori = ['un pensatore diverso', 'un contemporaneo', 'un predecessore'];
    
    quiz.push({
      id: `affermazione_${ts}`,
      domanda: `Chi afferma che "${fatto.contenuto.substring(0, 50)}..."?`,
      opzioni: this.mescola([fatto.autore, ...altriAutori]),
      rispostaCorretta: fatto.autore,
      spiegazione: `${fatto.autore} afferma che ${fatto.contenuto}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    // Vero/falso
    quiz.push({
      id: `affermazione_vf_${ts}`,
      domanda: `Vero o Falso: ${fatto.autore} sostiene che ${fatto.contenuto.substring(0, 50)}...`,
      opzioni: ['Vero', 'Falso'],
      rispostaCorretta: 'Vero',
      spiegazione: `È vero: ${fatto.autore} afferma questo.`,
      livello: 'conoscenza',
      tipo: 'vero_falso',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizFunzione(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreFunzioni = [
      'un ruolo di natura diversa',
      'una funzione non pertinente',
      'un compito differente'
    ];
    
    quiz.push({
      id: `funzione_${ts}`,
      domanda: `Qual è la funzione/ruolo di ${fatto.soggetto}?`,
      opzioni: this.mescola([fatto.descrizione.substring(0, 80), ...altreFunzioni]),
      rispostaCorretta: fatto.descrizione.substring(0, 80),
      spiegazione: `La funzione di ${fatto.soggetto} è ${fatto.descrizione}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizTipologie(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriNumeri = ['due', 'cinque', 'sette', 'molti'];
    
    quiz.push({
      id: `tipologie_${ts}`,
      domanda: `Quanti tipi/forme di ${fatto.soggetto} esistono?`,
      opzioni: this.mescola([fatto.numero, ...altriNumeri.slice(0, 3)]),
      rispostaCorretta: fatto.numero,
      spiegazione: `Esistono ${fatto.numero} tipi di ${fatto.soggetto}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    return quiz;
  }
  
  generaQuizDifferenza(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreDiff = [
      'non esiste differenza sostanziale',
      'la differenza riguarda un aspetto diverso',
      'sono concetti identici'
    ];
    
    quiz.push({
      id: `differenza_${ts}`,
      domanda: `Qual è la differenza tra ${fatto.termine1} e ${fatto.termine2}?`,
      opzioni: this.mescola([fatto.spiegazione.substring(0, 80), ...altreDiff]),
      rispostaCorretta: fatto.spiegazione.substring(0, 80),
      spiegazione: `La differenza sta in: ${fatto.spiegazione}.`,
      livello: 'analisi',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.9
    });
    
    return quiz;
  }
  
  generaQuizEsempio(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriEsempi = [
      'un esempio non pertinente',
      'un caso differente',
      'una situazione diversa'
    ];
    
    quiz.push({
      id: `esempio_${ts}`,
      domanda: `Quale esempio illustra ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altriEsempi]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `Un esempio è: ${fatto.contenuto}.`,
      livello: 'applicazione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizOrigine(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreOrigini = [
      'un\'origine diversa',
      'una derivazione non pertinente',
      'una provenienza differente'
    ];
    
    quiz.push({
      id: `origine_${ts}`,
      domanda: `Qual è l'origine di ${fatto.soggetto}?`,
      opzioni: this.mescola([fatto.descrizione.substring(0, 80), ...altreOrigini]),
      rispostaCorretta: fatto.descrizione.substring(0, 80),
      spiegazione: `L'origine di ${fatto.soggetto} risale a ${fatto.descrizione}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizFraseInfo(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altreDesc = [
      'una descrizione non pertinente',
      'una definizione diversa',
      'un concetto differente'
    ];
    
    // Quiz multipla
    quiz.push({
      id: `info_${ts}`,
      domanda: `Cosa è/rappresenta "${fatto.soggetto}"?`,
      opzioni: this.mescola([fatto.descrizione.substring(0, 80), ...altreDesc]),
      rispostaCorretta: fatto.descrizione.substring(0, 80),
      spiegazione: `${fatto.soggetto} è ${fatto.descrizione}.`,
      livello: 'conoscenza',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.8
    });
    
    // Vero/falso
    quiz.push({
      id: `info_vf_${ts}`,
      domanda: `Vero o Falso: ${fatto.soggetto} è ${fatto.descrizione.substring(0, 50)}...`,
      opzioni: ['Vero', 'Falso'],
      rispostaCorretta: 'Vero',
      spiegazione: `È corretto.`,
      livello: 'conoscenza',
      tipo: 'vero_falso',
      materia,
      argomento: sottoargomento,
      qualita: 0.75
    });
    
    return quiz;
  }
  
  generaQuizProcesso(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriProcessi = [
      'fasi diverse da quelle descritte',
      'un procedimento differente',
      'passaggi non correlati'
    ];
    
    quiz.push({
      id: `processo_${ts}`,
      domanda: `Cosa comporta/prevede il processo di ${fatto.nome}?`,
      opzioni: this.mescola([fatto.descrizione.substring(0, 80), ...altriProcessi]),
      rispostaCorretta: fatto.descrizione.substring(0, 80),
      spiegazione: `Il processo di ${fatto.nome} comporta ${fatto.descrizione}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  generaQuizRisultato(fatto, materia, sottoargomento, ts) {
    const quiz = [];
    const altriRisultati = [
      'un esito diverso',
      'un risultato opposto',
      'conseguenze differenti'
    ];
    
    quiz.push({
      id: `risultato_${ts}`,
      domanda: `Qual è il risultato di ${sottoargomento}?`,
      opzioni: this.mescola([fatto.contenuto.substring(0, 80), ...altriRisultati]),
      rispostaCorretta: fatto.contenuto.substring(0, 80),
      spiegazione: `Il risultato è ${fatto.contenuto}.`,
      livello: 'comprensione',
      tipo: 'multipla',
      materia,
      argomento: sottoargomento,
      qualita: 0.85
    });
    
    return quiz;
  }
  
  mescola(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
  
  validaQuiz(quiz) {
    if (!quiz.domanda || !quiz.rispostaCorretta) return false;
    if (!quiz.opzioni) return false;
    
    // Vero/Falso ha solo 2 opzioni, altri tipi hanno 4
    const minOpzioni = quiz.tipo === 'vero_falso' ? 2 : 4;
    if (quiz.opzioni.length < minOpzioni) return false;
    if (!quiz.opzioni.includes(quiz.rispostaCorretta)) return false;
    
    // Controlla duplicati nelle opzioni
    const opzioniLower = quiz.opzioni.map(o => o?.toString().toLowerCase().trim());
    if (new Set(opzioniLower).size !== opzioniLower.length) return false;
    
    // Lunghezza minima
    if (quiz.domanda.length < 15) return false;
    
    return true;
  }
}

// ============================================================
// 5. FLASHCARD GENERATOR - Flashcard intelligenti
// ============================================================

class FlashcardGenerator {
  /**
   * Genera MULTIPLE flashcard da un fatto
   */
  generaFlashcardDaFatto(fatto) {
    const cards = [];
    
    switch (fatto.tipo) {
      case 'nascita':
        cards.push({
          fronte: `Quando nacque ${fatto.soggetto}?`,
          retro: `${fatto.soggetto} nacque nel ${fatto.anno}.`,
          categoria: 'biografia'
        });
        cards.push({
          fronte: `In quale anno nacque ${fatto.soggetto}?`,
          retro: `Nel ${fatto.anno}.`,
          categoria: 'biografia'
        });
        if (fatto.luogo) {
          cards.push({
            fronte: `Dove nacque ${fatto.soggetto}?`,
            retro: `${fatto.soggetto} nacque a ${fatto.luogo}.`,
            categoria: 'biografia'
          });
          cards.push({
            fronte: `${fatto.soggetto}: luogo e data di nascita?`,
            retro: `Nacque a ${fatto.luogo} nel ${fatto.anno}.`,
            categoria: 'biografia'
          });
        }
        break;
      
      case 'morte':
        cards.push({
          fronte: `Quando morì ${fatto.soggetto}?`,
          retro: `${fatto.soggetto} morì nel ${fatto.anno}.`,
          categoria: 'biografia'
        });
        cards.push({
          fronte: `In quale anno morì ${fatto.soggetto}?`,
          retro: `Nel ${fatto.anno}.`,
          categoria: 'biografia'
        });
        break;
      
      case 'opera':
        cards.push({
          fronte: `Quando fu pubblicata "${fatto.titolo}"?`,
          retro: `"${fatto.titolo}" fu pubblicata nel ${fatto.anno}.`,
          categoria: 'opere'
        });
        cards.push({
          fronte: `Descrivi l'opera "${fatto.titolo}".`,
          retro: fatto.frase?.substring(0, 200) || `Opera pubblicata nel ${fatto.anno}.`,
          categoria: 'opere'
        });
        cards.push({
          fronte: `In quale anno fu scritta "${fatto.titolo}"?`,
          retro: `Nel ${fatto.anno}.`,
          categoria: 'opere'
        });
        cards.push({
          fronte: `"${fatto.titolo}": anno di pubblicazione`,
          retro: `${fatto.anno}.`,
          categoria: 'opere'
        });
        break;
      
      case 'relazione_allievo':
        cards.push({
          fronte: `Di chi fu allievo ${fatto.allievo}?`,
          retro: `${fatto.allievo} fu allievo di ${fatto.maestro}.`,
          categoria: 'relazioni'
        });
        break;
      
      case 'ruolo_movimento':
        cards.push({
          fronte: `Qual è il ruolo di ${fatto.persona} nel ${fatto.movimento}?`,
          retro: `${fatto.persona} fu esponente del ${fatto.movimento}.`,
          categoria: 'movimenti'
        });
        break;
      
      case 'concetto_introdotto':
        cards.push({
          fronte: `Cosa si intende per "${fatto.concetto}"?`,
          retro: `Il concetto di "${fatto.concetto}" fu elaborato da ${fatto.autore}.`,
          categoria: 'concetti'
        });
        break;
      
      case 'definizione':
        cards.push({
          fronte: `Definisci "${fatto.termine}".`,
          retro: `${fatto.termine}: ${fatto.definizione}.`,
          categoria: 'definizioni'
        });
        cards.push({
          fronte: `Cosa significa "${fatto.termine}"?`,
          retro: `${fatto.definizione}.`,
          categoria: 'definizioni'
        });
        cards.push({
          fronte: `"${fatto.termine}": definizione`,
          retro: `${fatto.definizione}.`,
          categoria: 'definizioni'
        });
        break;
        
      // NUOVI TIPI AGGIUNTI
      case 'documento':
        cards.push({
          fronte: `Quando fu pubblicato "${fatto.titolo}"?`,
          retro: `"${fatto.titolo}" fu pubblicato nel ${fatto.anno}${fatto.autore ? ` da ${fatto.autore}` : ''}.`,
          categoria: 'documenti'
        });
        cards.push({
          fronte: `"${fatto.titolo}": anno e autore`,
          retro: `${fatto.anno}${fatto.autore ? `, ${fatto.autore}` : ''}.`,
          categoria: 'documenti'
        });
        cards.push({
          fronte: `Chi scrisse "${fatto.titolo}" e quando?`,
          retro: `${fatto.autore || 'Autore'} nel ${fatto.anno}.`,
          categoria: 'documenti'
        });
        break;
        
      case 'concetto_include':
        cards.push({
          fronte: `Cosa include/comprende "${fatto.concetto}"?`,
          retro: `${fatto.concetto} include ${fatto.contenuto}.`,
          categoria: 'concetti'
        });
        cards.push({
          fronte: `"${fatto.concetto}": elementi costitutivi`,
          retro: `${fatto.contenuto}.`,
          categoria: 'concetti'
        });
        break;
        
      case 'tema_letterario':
        cards.push({
          fronte: `Quale tema esprime "${fatto.opera}"?`,
          retro: `L'opera esprime il tema di ${fatto.tema}.`,
          categoria: 'temi'
        });
        break;
        
      case 'personaggio_ruolo':
        cards.push({
          fronte: `Quale ruolo ha ${fatto.nome}?`,
          retro: `${fatto.nome} è ${fatto.ruolo}.`,
          categoria: 'personaggi'
        });
        break;
        
      case 'concetto_teoria':
        cards.push({
          fronte: `Cosa afferma la teoria di "${fatto.nome}"?`,
          retro: `La teoria afferma che ${fatto.spiegazione}.`,
          categoria: 'teorie'
        });
        cards.push({
          fronte: `Spiega il concetto di "${fatto.nome}".`,
          retro: `${fatto.spiegazione}.`,
          categoria: 'teorie'
        });
        cards.push({
          fronte: `"${fatto.nome}": significato`,
          retro: `${fatto.spiegazione}.`,
          categoria: 'teorie'
        });
        break;
        
      case 'cause':
        cards.push({
          fronte: `Quali sono le cause principali?`,
          retro: `Le cause includono ${fatto.contenuto}.`,
          categoria: 'cause_effetti'
        });
        cards.push({
          fronte: `Elenca le cause.`,
          retro: `${fatto.contenuto}.`,
          categoria: 'cause_effetti'
        });
        break;
        
      case 'conseguenze':
        cards.push({
          fronte: `Quali furono le conseguenze?`,
          retro: `Le conseguenze furono ${fatto.contenuto}.`,
          categoria: 'cause_effetti'
        });
        cards.push({
          fronte: `Elenca le conseguenze/effetti.`,
          retro: `${fatto.contenuto}.`,
          categoria: 'cause_effetti'
        });
        break;
        
      case 'caratteristiche':
        cards.push({
          fronte: `Quali sono le caratteristiche principali?`,
          retro: `Le caratteristiche includono ${fatto.contenuto}.`,
          categoria: 'caratteristiche'
        });
        cards.push({
          fronte: `Elenca le caratteristiche fondamentali.`,
          retro: `${fatto.contenuto}.`,
          categoria: 'caratteristiche'
        });
        break;
        
      case 'teorema':
        cards.push({
          fronte: `Cosa afferma il teorema di ${fatto.nome}?`,
          retro: `Il teorema di ${fatto.nome} afferma che ${fatto.contenuto || fatto.frase}.`,
          categoria: 'matematica'
        });
        break;
        
      case 'formula':
        cards.push({
          fronte: `Qual è la formula per ${fatto.simbolo}?`,
          retro: `${fatto.simbolo} = ${fatto.espressione}`,
          categoria: 'formule'
        });
        break;
        
      case 'legge':
        cards.push({
          fronte: `Cosa stabilisce la legge di ${fatto.nome}?`,
          retro: `La legge di ${fatto.nome} stabilisce che ${fatto.contenuto}.`,
          categoria: 'leggi'
        });
        break;
        
      case 'scoperta':
        cards.push({
          fronte: `Chi scoprì ${fatto.cosa} e quando?`,
          retro: `${fatto.cosa} fu scoperta da ${fatto.chi} nel ${fatto.anno}.`,
          categoria: 'scoperte'
        });
        break;
        
      case 'definizione_tecnica':
        cards.push({
          fronte: `Cosa rappresenta "${fatto.termine}"?`,
          retro: `${fatto.termine} rappresenta ${fatto.definizione}.`,
          categoria: 'definizioni'
        });
        break;
        
      case 'evento_data':
        cards.push({
          fronte: `In quale anno ${fatto.evento}?`,
          retro: `Nel ${fatto.anno} ${fatto.evento}.`,
          categoria: 'eventi'
        });
        break;
        
      case 'riforme':
        cards.push({
          fronte: `Quali riforme furono attuate?`,
          retro: `Le riforme includevano ${fatto.contenuto}.`,
          categoria: 'storia'
        });
        break;
        
      case 'influenza':
        cards.push({
          fronte: `Chi influenzò ${fatto.oggetto}?`,
          retro: `${fatto.soggetto} influenzò ${fatto.oggetto}.`,
          categoria: 'influenze'
        });
        break;
        
      case 'obiettivo':
        cards.push({
          fronte: `Qual era l'obiettivo principale?`,
          retro: `L'obiettivo era ${fatto.contenuto}.`,
          categoria: 'obiettivi'
        });
        break;
        
      case 'metodo':
        cards.push({
          fronte: `Quale metodo/approccio viene utilizzato?`,
          retro: `Il metodo consiste in ${fatto.contenuto}.`,
          categoria: 'metodi'
        });
        break;
        
      case 'critiche':
        cards.push({
          fronte: `Quali critiche vengono mosse?`,
          retro: `Le critiche riguardano ${fatto.contenuto}.`,
          categoria: 'critiche'
        });
        break;
        
      case 'importanza':
        cards.push({
          fronte: `Qual è l'importanza/significato?`,
          retro: `L'importanza sta in ${fatto.contenuto}.`,
          categoria: 'importanza'
        });
        break;
        
      case 'confronto':
        cards.push({
          fronte: `Qual è la differenza rispetto a ${fatto.termine1}?`,
          retro: `A differenza di ${fatto.termine1}, ${fatto.differenza}.`,
          categoria: 'confronti'
        });
        break;
        
      case 'principi_valori':
        cards.push({
          fronte: `Quali principi/valori sono fondamentali?`,
          retro: `I principi fondamentali sono ${fatto.contenuto}.`,
          categoria: 'principi'
        });
        break;
        
      case 'struttura':
        cards.push({
          fronte: `Come è strutturato/composto?`,
          retro: `È composto da ${fatto.contenuto}.`,
          categoria: 'struttura'
        });
        break;
        
      case 'affermazione':
        cards.push({
          fronte: `Cosa afferma ${fatto.autore}?`,
          retro: `${fatto.autore} afferma che ${fatto.contenuto}.`,
          categoria: 'affermazioni'
        });
        break;
        
      case 'funzione':
        cards.push({
          fronte: `Qual è la funzione di ${fatto.soggetto}?`,
          retro: `La funzione di ${fatto.soggetto} è ${fatto.descrizione}.`,
          categoria: 'funzioni'
        });
        break;
        
      case 'differenza':
        cards.push({
          fronte: `Qual è la differenza tra ${fatto.termine1} e ${fatto.termine2}?`,
          retro: `La differenza è: ${fatto.spiegazione}.`,
          categoria: 'differenze'
        });
        break;
        
      case 'frase_informativa':
        cards.push({
          fronte: `Cosa è/rappresenta "${fatto.soggetto}"?`,
          retro: `${fatto.soggetto} è ${fatto.descrizione}.`,
          categoria: 'informazioni'
        });
        break;
        
      default:
        return null;
    }
    
    // Restituisce la prima card (per retrocompatibilità) o tutte
    return cards.length > 0 ? cards : null;
  }
}

// ============================================================
// 6. MAIN QUIZ GENERATOR PRO
// ============================================================

class QuizGeneratorPro {
  constructor() {
    this.parser = new NLPParser();
    this.questionGen = new QuestionGenerator();
    this.flashcardGen = new FlashcardGenerator();
  }
  
  /**
   * Genera quiz di alta qualità
   */
  generaQuiz(testo, materia, sottoargomento, numQuiz = 10) {
    console.log(`\n🏆 QUIZ GENERATOR PRO - Analisi testo...`);
    
    // 1. Estrai fatti
    const fatti = this.parser.estraiFatti(testo, materia);
    console.log(`📊 Fatti estratti: ${fatti.length}`);
    fatti.forEach(f => console.log(`   [${f.tipo}] ${f.soggetto || f.titolo || f.termine || f.concetto || ''}`));
    
    // 2. Genera quiz da ogni fatto
    let quiz = [];
    fatti.forEach(fatto => {
      const quizDaFatto = this.questionGen.generaQuizDaFatto(fatto, materia, sottoargomento);
      quiz.push(...quizDaFatto);
    });
    
    // 3. Aggiungi quiz dalla knowledge base se necessario
    if (quiz.length < numQuiz) {
      const quizKB = this.generaQuizDaKnowledgeBase(testo, materia, sottoargomento, numQuiz - quiz.length);
      quiz.push(...quizKB);
    }
    
    // 4. Deduplica e seleziona
    quiz = this.deduplicaQuiz(quiz);
    
    // 5. Mescola e limita
    quiz = quiz.sort(() => Math.random() - 0.5).slice(0, numQuiz);
    
    console.log(`✅ Quiz generati: ${quiz.length}`);
    return quiz;
  }
  
  /**
   * Genera flashcard di alta qualità
   */
  generaFlashcard(testo, materia, sottoargomento) {
    const fatti = this.parser.estraiFatti(testo, materia);
    
    let flashcards = [];
    
    // 1. Genera flashcard dai fatti estratti
    fatti.forEach(fatto => {
      const cards = this.flashcardGen.generaFlashcardDaFatto(fatto);
      if (cards) {
        if (Array.isArray(cards)) {
          cards.forEach(card => {
            if (card && card.fronte && card.retro && card.retro.length > 20) {
              flashcards.push({
                ...card,
                materia,
                argomento: sottoargomento,
                id: `fc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              });
            }
          });
        } else if (cards.fronte && cards.retro && cards.retro.length > 20) {
          flashcards.push({
            ...cards,
            materia,
            argomento: sottoargomento,
            id: `fc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          });
        }
      }
    });
    
    // 2. Genera flashcard aggiuntive da frasi chiave del testo
    const frasiAggiuntive = this.estraiFrasiChiave(testo, sottoargomento, materia);
    flashcards.push(...frasiAggiuntive);
    
    // Rimuovi duplicati per fronte
    const seenFronti = new Set();
    flashcards = flashcards.filter(fc => {
      const key = fc.fronte.toLowerCase().trim().substring(0, 40);
      if (seenFronti.has(key)) return false;
      seenFronti.add(key);
      return true;
    });
    
    return flashcards;
  }
  
  /**
   * Estrae frasi chiave dal testo per generare flashcard aggiuntive
   */
  estraiFrasiChiave(testo, sottoargomento, materia) {
    const flashcards = [];
    const frasi = testo.split(/[.!?]+/).filter(f => f.trim().length > 30 && f.trim().length < 200);
    
    frasi.forEach((frase, idx) => {
      const fraseTrim = frase.trim();
      
      // Pattern: "X è Y" dove X è corto e Y è la definizione
      const defMatch = fraseTrim.match(/^([A-Z][a-zàèéìòù]+(?:\s+[a-zàèéìòù]+){0,2})\s+(?:è|sono|rappresenta|significa|indica)\s+(.{20,150})/i);
      if (defMatch && defMatch[1].length < 30) {
        flashcards.push({
          fronte: `Cosa è/significa "${defMatch[1].trim()}"?`,
          retro: `${defMatch[2].trim()}.`,
          categoria: 'definizioni',
          materia,
          argomento: sottoargomento,
          id: `fc_frase_${Date.now()}_${idx}`
        });
      }
      
      // Pattern: verbi importanti "stabilisce", "afferma", "prevede"
      const affMatch = fraseTrim.match(/([A-Z][a-zàèéìòù]+(?:\s+[A-Z]?[a-zàèéìòù]+){0,2})\s+(?:stabilisce|afferma|prevede|sostiene|ritiene)\s+che\s+(.{20,120})/i);
      if (affMatch) {
        flashcards.push({
          fronte: `Cosa afferma/stabilisce ${affMatch[1].trim()}?`,
          retro: `${affMatch[2].trim()}.`,
          categoria: 'affermazioni',
          materia,
          argomento: sottoargomento,
          id: `fc_aff_${Date.now()}_${idx}`
        });
      }
      
      // Pattern: numeri/date importanti
      const dataMatch = fraseTrim.match(/(?:nel|del|anno)\s+(\d{4})\s+(.{15,80})/i);
      if (dataMatch) {
        flashcards.push({
          fronte: `Cosa avvenne nel ${dataMatch[1]}?`,
          retro: `${dataMatch[2].trim()}.`,
          categoria: 'eventi',
          materia,
          argomento: sottoargomento,
          id: `fc_data_${Date.now()}_${idx}`
        });
      }
      
      // Pattern: "Le X includono/comprendono Y"
      const includeMatch = fraseTrim.match(/(?:Le|I|Gli)\s+([a-zàèéìòù]+)\s+(?:includono|comprendono|sono)\s+(.{20,120})/i);
      if (includeMatch) {
        flashcards.push({
          fronte: `Cosa includono/comprendono ${includeMatch[1].trim()}?`,
          retro: `${includeMatch[2].trim()}.`,
          categoria: 'liste',
          materia,
          argomento: sottoargomento,
          id: `fc_incl_${Date.now()}_${idx}`
        });
      }
      
      // Pattern: "X consiste in Y" o "X si basa su Y"
      const consisteMatch = fraseTrim.match(/([A-Z][a-zàèéìòù]+(?:\s+[a-zàèéìòù]+){0,2})\s+(?:consiste\s+in|si\s+basa\s+su|comporta|prevede)\s+(.{20,120})/i);
      if (consisteMatch && consisteMatch[1].length < 35) {
        flashcards.push({
          fronte: `In cosa consiste/cosa comporta "${consisteMatch[1].trim()}"?`,
          retro: `${consisteMatch[2].trim()}.`,
          categoria: 'processi',
          materia,
          argomento: sottoargomento,
          id: `fc_cons_${Date.now()}_${idx}`
        });
      }
      
      // Pattern: "X fu/era Y"
      const fuMatch = fraseTrim.match(/([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:fu|era|divenne)\s+(?:un[ao']?\s+)?([a-zàèéìòù\s]{10,60})/i);
      if (fuMatch && fuMatch[1].length < 30) {
        flashcards.push({
          fronte: `Chi/Cosa fu ${fuMatch[1].trim()}?`,
          retro: `Fu ${fuMatch[2].trim()}.`,
          categoria: 'ruoli',
          materia,
          argomento: sottoargomento,
          id: `fc_fu_${Date.now()}_${idx}`
        });
      }
      
      // Pattern: "X sviluppò/elaborò/creò Y"
      const svilMatch = fraseTrim.match(/([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:sviluppò|elaborò|creò|inventò|fondò|introdusse)\s+(.{10,80})/i);
      if (svilMatch && svilMatch[1].length < 30) {
        flashcards.push({
          fronte: `Cosa sviluppò/creò ${svilMatch[1].trim()}?`,
          retro: `${svilMatch[2].trim()}.`,
          categoria: 'contributi',
          materia,
          argomento: sottoargomento,
          id: `fc_svil_${Date.now()}_${idx}`
        });
      }
      
      // Pattern: "La/Il X di Y" con descrizione
      const diMatch = fraseTrim.match(/(?:La|Il|Lo|L[''])\s+([a-zàèéìòù]+)\s+di\s+([A-Z][a-zàèéìòù]+(?:\s+[A-Z]?[a-zàèéìòù]+)?)\s+(?:è|era|fu|consiste|rappresenta)\s+(.{15,100})/i);
      if (diMatch) {
        flashcards.push({
          fronte: `Cos'è ${diMatch[1].trim()} di ${diMatch[2].trim()}?`,
          retro: `${diMatch[3].trim()}.`,
          categoria: 'concetti',
          materia,
          argomento: sottoargomento,
          id: `fc_di_${Date.now()}_${idx}`
        });
      }
      
      // Pattern: frasi con "importante/fondamentale/essenziale"
      const impMatch = fraseTrim.match(/(?:è|fu|era)\s+(?:molto\s+)?(?:importante|fondamentale|essenziale|centrale|cruciale)\s+(.{15,100})/i);
      if (impMatch) {
        flashcards.push({
          fronte: `Cosa è importante/fondamentale riguardo ${sottoargomento}?`,
          retro: `È importante ${impMatch[1].trim()}.`,
          categoria: 'importanza',
          materia,
          argomento: sottoargomento,
          id: `fc_imp_${Date.now()}_${idx}`
        });
      }
    });
    
    return flashcards;
  }
  
  /**
   * Genera quiz aggiuntivi dalla knowledge base
   */
  generaQuizDaKnowledgeBase(testo, materia, sottoargomento, numQuiz) {
    const quiz = [];
    const testoLower = testo.toLowerCase();
    const ts = Date.now();
    
    // Cerca concetti dalla KB nel testo
    const concettiTrovati = [];
    
    if (materia === 'italiano' && KNOWLEDGE_BASE.movimenti_letterari) {
      for (const [movimento, info] of Object.entries(KNOWLEDGE_BASE.movimenti_letterari)) {
        if (testoLower.includes(movimento)) {
          concettiTrovati.push({ tipo: 'movimento', nome: movimento, info });
        }
      }
    }
    
    if (materia === 'filosofia' && KNOWLEDGE_BASE.correnti_filosofiche) {
      for (const [corrente, info] of Object.entries(KNOWLEDGE_BASE.correnti_filosofiche)) {
        if (testoLower.includes(corrente)) {
          concettiTrovati.push({ tipo: 'corrente', nome: corrente, info });
        }
      }
    }
    
    // Genera quiz dai concetti trovati
    concettiTrovati.slice(0, numQuiz).forEach((concetto, idx) => {
      const caratteristica = concetto.info.caratteristiche[0];
      const altreCaratteristiche = [
        'razionalismo scientifico',
        'misticismo religioso',
        'materialismo storico',
        'individualismo romantico'
      ].filter(c => c !== caratteristica);
      
      quiz.push({
        id: `kb_${idx}_${ts}`,
        domanda: `Quale caratteristica è propria del ${concetto.nome}?`,
        opzioni: [caratteristica, ...altreCaratteristiche.slice(0, 3)].sort(() => Math.random() - 0.5),
        rispostaCorretta: caratteristica,
        spiegazione: `Il ${concetto.nome} si caratterizza per: ${concetto.info.caratteristiche.join(', ')}.`,
        livello: 'comprensione',
        tipo: 'multipla',
        materia,
        argomento: sottoargomento,
        qualita: 0.85
      });
    });
    
    return quiz;
  }
  
  deduplicaQuiz(quiz) {
    const seen = new Set();
    return quiz.filter(q => {
      const key = q.domanda.toLowerCase().substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

// Export
module.exports = {
  QuizGeneratorPro,
  NLPParser,
  DistractorGenerator,
  QuestionGenerator,
  FlashcardGenerator,
  KNOWLEDGE_BASE
};
