/**
 * 🎯 ENTITY EXTRACTOR - Estrazione Entità Migliorata
 * Identifica correttamente persone, opere, luoghi, date
 */

class EntityExtractor {
  constructor() {
    // Database nomi propri italiani
    this.nomiItaliani = new Set([
      'Ugo', 'Giacomo', 'Alessandro', 'Giovanni', 'Luigi', 'Gabriele',
      'Italo', 'Eugenio', 'Salvatore', 'Cesare', 'Giuseppe', 'Carlo',
      'Dante', 'Francesco', 'Niccolò', 'Ludovico', 'Torquato',
      'Foscolo', 'Leopardi', 'Manzoni', 'Verga', 'Pirandello', 'Svevo',
      'Montale', 'Ungaretti', 'Quasimodo', 'Pascoli', 'Carducci',
      'Petrarca', 'Boccaccio', 'Ariosto', 'Tasso', 'Machiavelli',
      'Alfieri', 'Goldoni', 'Metastasio', 'Parini', 'Monti'
    ]);

    // Database luoghi italiani
    this.luoghi = new Set([
      'Roma', 'Milano', 'Venezia', 'Firenze', 'Napoli', 'Torino',
      'Genova', 'Bologna', 'Padova', 'Verona', 'Trieste', 'Palermo',
      'Recanati', 'Zante', 'Londra', 'Parigi', 'Vienna', 'Berlino',
      'Italia', 'Francia', 'Germania', 'Inghilterra', 'Austria',
      'Spagna', 'Grecia', 'America', 'Europa', 'Asia', 'Africa'
    ]);

    // Database opere letterarie famose
    this.opereFamose = {
      'I Promessi Sposi': 'Manzoni',
      'I Sepolcri': 'Foscolo',
      'Le ultime lettere di Jacopo Ortis': 'Foscolo',
      'L\'Infinito': 'Leopardi',
      'I Canti': 'Leopardi',
      'Le Operette morali': 'Leopardi',
      'La Ginestra': 'Leopardi',
      'A Silvia': 'Leopardi',
      'I Malavoglia': 'Verga',
      'Mastro-don Gesualdo': 'Verga',
      'Il fu Mattia Pascal': 'Pirandello',
      'Uno, nessuno e centomila': 'Pirandello',
      'La coscienza di Zeno': 'Svevo',
      'Senilità': 'Svevo',
      'Ossi di seppia': 'Montale',
      'Le occasioni': 'Montale',
      'Myricae': 'Pascoli',
      'Il fanciullino': 'Pascoli',
      'L\'Allegria': 'Ungaretti',
      'Il Decameron': 'Boccaccio',
      'Il Canzoniere': 'Petrarca',
      'La Divina Commedia': 'Dante',
      'Orlando Furioso': 'Ariosto',
      'Gerusalemme Liberata': 'Tasso'
    };

    // Parole che NON sono persone anche se maiuscole
    this.nonPersone = new Set([
      'Il', 'La', 'Le', 'I', 'Gli', 'Lo', 'Un', 'Una',
      'Questa', 'Questo', 'Quella', 'Quello', 'Questi', 'Quelli',
      'Dopo', 'Prima', 'Durante', 'Mentre', 'Inoltre', 'Tuttavia',
      'Infatti', 'Quindi', 'Pertanto', 'Perciò', 'Dunque',
      'Chiesa', 'Stato', 'Regno', 'Repubblica', 'Impero',
      'Rivoluzione', 'Guerra', 'Pace', 'Trattato', 'Congresso',
      'Romanticismo', 'Illuminismo', 'Rinascimento', 'Medioevo',
      'Neoclassicismo', 'Verismo', 'Decadentismo', 'Futurismo'
    ]);
  }

  /**
   * 👤 Estrai VERE persone dal testo
   */
  estraiPersone(testo) {
    const persone = new Map();
    
    // Pattern per nome + cognome
    const patternNomeCognome = /\b([A-Z][a-zàèéìòù]+)\s+([A-Z][a-zàèéìòù]+)\b/g;
    let match;
    
    while ((match = patternNomeCognome.exec(testo)) !== null) {
      const nome = match[1];
      const cognome = match[2];
      const nomeCompleto = `${nome} ${cognome}`;
      
      // Verifica che sia una persona
      if (this.isPersona(nome, cognome, nomeCompleto)) {
        const menzioni = this.contaMenzioni(testo, nomeCompleto);
        persone.set(nomeCompleto, {
          nome: nomeCompleto,
          tipo: 'persona',
          menzioni,
          ruolo: this.identificaRuolo(testo, nomeCompleto)
        });
      }
    }
    
    // Pattern per solo cognome (autori famosi)
    const patternCognome = /\b(Foscolo|Leopardi|Manzoni|Verga|Pirandello|Svevo|Dante|Petrarca|Boccaccio|Montale|Ungaretti|Pascoli|Carducci)\b/g;
    
    while ((match = patternCognome.exec(testo)) !== null) {
      const cognome = match[1];
      if (!persone.has(cognome)) {
        const menzioni = this.contaMenzioni(testo, cognome);
        persone.set(cognome, {
          nome: cognome,
          tipo: 'persona',
          menzioni,
          ruolo: 'scrittore/poeta'
        });
      }
    }
    
    return Array.from(persone.values());
  }

  /**
   * 📚 Estrai VERE opere letterarie
   */
  estraiOpere(testo) {
    const opere = new Set();
    
    // 1. Cerca opere note nel database
    for (const [titolo, autore] of Object.entries(this.opereFamose)) {
      if (testo.includes(titolo)) {
        opere.add({
          titolo,
          autore,
          tipo: 'opera_letteraria',
          verificata: true
        });
      }
    }
    
    // 2. Pattern per titoli tra virgolette (ma con filtri)
    const patterns = [
      /"([^"]+)"/g,
      /«([^»]+)»/g,
      /'([^']+)'/g
    ];
    
    for (const pattern of patterns) {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(testo)) !== null) {
        const potenzialeTitolo = match[1];
        
        // Filtri per evitare falsi positivi
        if (this.isProbabileOpera(potenzialeTitolo)) {
          opere.add({
            titolo: potenzialeTitolo,
            autore: this.cercaAutore(testo, potenzialeTitolo),
            tipo: 'opera_letteraria',
            verificata: false
          });
        }
      }
    }
    
    // 3. Pattern per articolo determinativo + maiuscola (opere famose)
    const patternArticolo = /\b(?:Il|La|Le|I|Gli|L')\s+([A-Z][a-z]+(?:\s+[a-z]+)?)\b/g;
    let match;
    
    while ((match = patternArticolo.exec(testo)) !== null) {
      const titolo = match[0];
      const contesto = this.estraiContesto(testo, match.index);
      
      // Verifica che sia in contesto letterario
      if (contesto.match(/(?:opera|romanzo|poesia|tragedia|commedia|raccolta|libro|scritto|pubblicato|compose)/i)) {
        opere.add({
          titolo,
          autore: this.cercaAutore(testo, titolo),
          tipo: 'opera_letteraria',
          verificata: false
        });
      }
    }
    
    return Array.from(opere);
  }

  /**
   * 📍 Estrai luoghi geografici
   */
  estraiLuoghi(testo) {
    const luoghi = new Set();
    
    // Pattern per luoghi con preposizioni
    const pattern = /\b(?:a|in|da|per|verso|di)\s+([A-Z][a-zàèéìòù]+)\b/g;
    let match;
    
    while ((match = pattern.exec(testo)) !== null) {
      const luogo = match[1];
      
      if (this.luoghi.has(luogo)) {
        luoghi.add({
          nome: luogo,
          tipo: 'luogo',
          contesto: this.estraiContesto(testo, match.index, 30)
        });
      }
    }
    
    return Array.from(luoghi);
  }

  /**
   * 📅 Estrai date con evento associato
   */
  estraiDate(testo) {
    const date = [];
    const pattern = /\b(1\d{3}|20\d{2})\b/g;
    let match;
    
    while ((match = pattern.exec(testo)) !== null) {
      const anno = match[1];
      const contesto = this.estraiContesto(testo, match.index, 60);
      
      date.push({
        anno,
        evento: this.estraiEvento(contesto, anno),
        contesto,
        tipo: 'data'
      });
    }
    
    return date;
  }

  // ==================== UTILITY ====================

  /**
   * ✅ Verifica se è una persona
   */
  isPersona(nome, cognome, nomeCompleto) {
    // Esclude non-persone
    if (this.nonPersone.has(nome) || this.nonPersone.has(cognome)) {
      return false;
    }
    
    // Esclude luoghi
    if (this.luoghi.has(nome) || this.luoghi.has(cognome)) {
      return false;
    }
    
    // Include nomi noti
    if (this.nomiItaliani.has(nome) || this.nomiItaliani.has(cognome)) {
      return true;
    }
    
    // Euristica: se ha pattern Nome Cognome è probabilmente persona
    return nome.length > 2 && cognome.length > 2;
  }

  /**
   * 📖 Verifica se è probabile opera
   */
  isProbabileOpera(titolo) {
    // Escludi frasi troppo lunghe
    if (titolo.length > 50) return false;
    
    // Escludi frasi che iniziano con minuscola
    if (titolo[0] && titolo[0] === titolo[0].toLowerCase()) return false;
    
    // Escludi singole parole comuni
    if (titolo.split(' ').length === 1 && titolo.length < 5) return false;
    
    // Escludi frasi con punteggiatura interna
    if (titolo.match(/[,;:!?]/)) return false;
    
    return true;
  }

  /**
   * 🔍 Cerca autore di un'opera nel testo
   */
  cercaAutore(testo, titolo) {
    // Cerca pattern "titolo di Autore"
    const pattern = new RegExp(`${titolo}.*?di\\s+([A-Z][a-zàèéìòù]+)`, 'i');
    const match = testo.match(pattern);
    
    if (match) return match[1];
    
    // Cerca autori noti vicino al titolo
    const index = testo.indexOf(titolo);
    if (index > -1) {
      const contesto = testo.substring(Math.max(0, index - 50), Math.min(testo.length, index + 50));
      
      for (const autore of this.nomiItaliani) {
        if (contesto.includes(autore)) {
          return autore;
        }
      }
    }
    
    return null;
  }

  /**
   * 🎭 Identifica ruolo della persona
   */
  identificaRuolo(testo, nome) {
    const index = testo.indexOf(nome);
    if (index === -1) return 'personaggio storico';
    
    const contesto = testo.substring(Math.max(0, index - 50), Math.min(testo.length, index + 100));
    
    if (contesto.match(/\b(scrittore|poeta|autore|letterato)\b/i)) return 'scrittore/poeta';
    if (contesto.match(/\b(filosofo|pensatore)\b/i)) return 'filosofo';
    if (contesto.match(/\b(re|imperatore|principe|duca)\b/i)) return 'sovrano';
    if (contesto.match(/\b(generale|condottiero|soldato)\b/i)) return 'militare';
    if (contesto.match(/\b(papa|vescovo|cardinale|santo)\b/i)) return 'religioso';
    if (contesto.match(/\b(scienziato|matematico|fisico)\b/i)) return 'scienziato';
    if (contesto.match(/\b(pittore|scultore|artista)\b/i)) return 'artista';
    if (contesto.match(/\b(amico|amicizia)\b/i)) return 'amico/conoscente';
    
    return 'personaggio storico';
  }

  /**
   * 📅 Estrai evento da contesto
   */
  estraiEvento(contesto, anno) {
    const patterns = [
      { pattern: /nasc\w+\s+(.+)/i, tipo: 'nascita' },
      { pattern: /mor\w+\s+(.+)/i, tipo: 'morte' },
      { pattern: /pubblic\w+\s+(.+)/i, tipo: 'pubblicazione' },
      { pattern: /scrisse\s+(.+)/i, tipo: 'scrittura' },
      { pattern: /battaglia\s+di\s+(.+)/i, tipo: 'battaglia' },
      { pattern: /trattato\s+di\s+(.+)/i, tipo: 'trattato' },
      { pattern: /guerra\s+(.+)/i, tipo: 'guerra' }
    ];
    
    for (const { pattern, tipo } of patterns) {
      const match = contesto.match(pattern);
      if (match) {
        return {
          tipo,
          descrizione: match[0].substring(0, 50)
        };
      }
    }
    
    return {
      tipo: 'evento',
      descrizione: contesto.substring(0, 50)
    };
  }

  /**
   * 📍 Estrai contesto
   */
  estraiContesto(testo, posizione, lunghezza = 50) {
    const inizio = Math.max(0, posizione - lunghezza);
    const fine = Math.min(testo.length, posizione + lunghezza);
    return testo.substring(inizio, fine).trim();
  }

  /**
   * 🔢 Conta menzioni
   */
  contaMenzioni(testo, termine) {
    const pattern = new RegExp(`\\b${termine}\\b`, 'gi');
    const matches = testo.match(pattern);
    return matches ? matches.length : 0;
  }
}

module.exports = EntityExtractor;
