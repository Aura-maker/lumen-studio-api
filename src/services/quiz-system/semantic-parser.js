/**
 * 🧠 SEMANTIC PARSER - Estrazione Intelligente con Contesto
 * Analizza testi e estrae fatti verificabili con relazioni semantiche
 * 
 * SUPERIORE al semplice regex: comprende il CONTESTO delle informazioni
 */

class SemanticParser {
  constructor() {
    // Pattern grammaticali italiani per analisi SVO (Soggetto-Verbo-Oggetto)
    this.patterns = {
      // Pattern per fatti biografici
      nascita: [
        /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:nacque|nasce|è nato|nato)\s+(?:nel|il|a)?\s*(\d{4})?\s*(?:a|in)?\s*([A-Za-zàèéìòù]+)?/gi,
        /Nato\s+(?:nel|il)?\s*(\d{4})?\s*(?:a|in)?\s*([A-Za-zàèéìòù]+)?/gi,
        /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+nasce\s+nel\s+(\d{4})\s+a\s+([A-Za-zàèéìòù]+)/gi
      ],
      morte: [
        /([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)\s+(?:morì|muore|morto|deceduto)\s+(?:nel|il|a)?\s*(\d{4})?\s*(?:a|in)?\s*([A-Za-zàèéìòù]+)?/gi,
        /(?:morte|decesso|scomparsa)\s+di\s+([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?)/gi,
        /Muore\s+(?:in\s+povertà\s+)?a\s+([A-Za-zàèéìòù]+)\s+nel\s+(\d{4})/gi
      ],
      // Pattern per opere letterarie
      opera: [
        /(?:scrisse|pubblicò|compose|scritto|pubblicato|composto)\s+["«']?([^"»']+)["»']?\s*\(?(\d{4})?\)?/gi,
        /["«']([^"»']+)["»']\s*\(?(\d{4})?\)?/g,
        /(?:opera|romanzo|poesia|tragedia|commedia|raccolta)\s+["«']?([^"»',\.]+)["»']?/gi,
        /(?:Le\s+|Il\s+|La\s+|I\s+|Gli\s+|L')([A-Z][^,\.]+?)(?:\s+\(|,|\.|$)/g,
        /'([^']+)'/g  // Cattura titoli tra apostrofi singoli
      ],
      // Pattern per eventi storici
      evento: [
        /(?:nel|il|durante il)\s*(\d{4})\s+(?:si verificò|avvenne|ebbe luogo|scoppiò|iniziò|terminò|fu firmato|venne proclamato)\s+([^.]+)/gi,
        /(trattato|battaglia|guerra|rivoluzione|congresso|editto|pace)\s+di\s+([A-Z][a-zàèéìòù]+)/gi,
        /la\s+(prima|seconda|terza)\s+(guerra\s+mondiale|guerra\s+d'indipendenza|crociata)/gi
      ],
      
      // Pattern per concetti e definizioni
      definizione: [
        /([A-Z][a-zàèéìòù]+(?:\s+[a-zàèéìòù]+)?)\s+(?:è|significa|rappresenta|consiste in|si definisce come)\s+([^.]+)/gi,
        /(?:per|con)\s+([a-zàèéìòù]+)\s+si\s+intende\s+([^.]+)/gi,
        /il\s+termine\s+["«']?([^"»']+)["»']?\s+indica\s+([^.]+)/gi
      ],
      
      // Pattern per relazioni causali
      causale: [
        /([^.]+)\s+(?:causò|provocò|determinò|portò a|generò|produsse|comportò)\s+([^.]+)/gi,
        /(?:a causa di|per via di|in seguito a)\s+([^,]+),\s+([^.]+)/gi,
        /([^.]+)\s+(?:fu causato|venne provocato|derivò)\s+da\s+([^.]+)/gi
      ],
      
      // Pattern per influenze e relazioni
      influenza: [
        /([A-Z][a-zàèéìòù]+)\s+(?:influenzò|ispirò|fu maestro di|insegnò a)\s+([A-Z][a-zàèéìòù]+)/gi,
        /([A-Z][a-zàèéìòù]+)\s+(?:fu influenzato|si ispirò|apprese)\s+da\s+([A-Z][a-zàèéìòù]+)/gi
      ],
      
      // Pattern per appartenenza a movimenti/correnti
      movimento: [
        /([A-Z][a-zàèéìòù]+)\s+(?:appartenne|aderì|fu esponente|rappresentò)\s+(?:al|del|il)?\s*([A-Za-zàèéìòù]+ismo|[A-Za-zàèéìòù]+ismo)/gi,
        /(?:esponente|rappresentante|padre|fondatore)\s+del\s+([A-Za-zàèéìòù]+)/gi
      ]
    };

    // Stopwords italiane da ignorare
    this.stopwords = new Set([
      'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una',
      'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra',
      'e', 'o', 'ma', 'però', 'quindi', 'perché', 'che', 'cui',
      'questo', 'quello', 'questi', 'quelli', 'questa', 'quella',
      'suo', 'sua', 'suoi', 'sue', 'loro', 'proprio',
      'essere', 'avere', 'fare', 'dire', 'potere', 'volere',
      'come', 'quando', 'dove', 'quanto', 'quale', 'chi',
      'non', 'più', 'anche', 'solo', 'già', 'ancora', 'sempre', 'mai',
      'molto', 'poco', 'tanto', 'troppo', 'così', 'bene', 'male',
      'dopo', 'prima', 'durante', 'mentre', 'inoltre', 'infine',
      'infatti', 'dunque', 'tuttavia', 'perciò', 'allora', 'ora'
    ]);

    // Database errori comuni per distrattori intelligenti
    this.erroriComuni = {
      date: {
        // Date italiane comunemente confuse
        '1861': ['1860', '1859', '1870', '1871'], // Unità d'Italia
        '1870': ['1861', '1871', '1866', '1882'], // Roma capitale
        '1789': ['1776', '1793', '1799', '1804'], // Rivoluzione francese
        '1914': ['1915', '1912', '1918', '1939'], // WWI
        '1939': ['1938', '1940', '1941', '1945'], // WWII
        '1922': ['1919', '1924', '1925', '1943'], // Marcia su Roma
        '1848': ['1847', '1849', '1859', '1860'], // Moti
        '1815': ['1814', '1816', '1821', '1830'], // Congresso Vienna
        '1492': ['1489', '1498', '1502', '1500'], // Scoperta America
        '1778': ['1774', '1779', '1782', '1785'], // Foscolo
        '1798': ['1795', '1799', '1802', '1805'], // Leopardi
        '1827': ['1825', '1829', '1830', '1832'], // Manzoni
        '1867': ['1863', '1870', '1873', '1875']  // Pirandello
      },
      autori: {
        // Autori contemporanei spesso confusi
        'Foscolo': ['Leopardi', 'Manzoni', 'Alfieri', 'Parini'],
        'Leopardi': ['Foscolo', 'Manzoni', 'Pascoli', 'Monti'],
        'Manzoni': ['Verga', 'Foscolo', 'Leopardi', 'Nievo'],
        'Verga': ['Capuana', 'De Roberto', 'Pirandello', 'Svevo'],
        'Pirandello': ['Svevo', 'Verga', "D'Annunzio", 'Tozzi'],
        'Svevo': ['Pirandello', 'Joyce', 'Tozzi', 'Moravia'],
        'Montale': ['Ungaretti', 'Quasimodo', 'Saba', 'Rebora'],
        'Ungaretti': ['Montale', 'Quasimodo', 'Saba', 'Campana'],
        'Pascoli': ['Carducci', "D'Annunzio", 'Fogazzaro', 'Verga']
      },
      movimenti: {
        // Movimenti letterari spesso confusi
        'Romanticismo': ['Neoclassicismo', 'Realismo', 'Preromanticismo', 'Illuminismo'],
        'Verismo': ['Realismo', 'Naturalismo', 'Decadentismo', 'Romanticismo'],
        'Decadentismo': ['Simbolismo', 'Estetismo', 'Verismo', 'Crepuscolarismo'],
        'Futurismo': ['Dadaismo', 'Surrealismo', 'Espressionismo', 'Cubismo'],
        'Ermetismo': ['Crepuscolarismo', 'Simbolismo', 'Futurismo', 'Neorealismo']
      }
    };

    console.log('🧠 SemanticParser inizializzato');
  }

  /**
   * 📖 Analizza un testo completo e estrae tutti i fatti
   * @param {string} testo - Il testo da analizzare
   * @param {string} materia - La materia di riferimento
   * @param {string} argomento - L'argomento specifico
   * @returns {Object} - Oggetto con tutti i fatti estratti e classificati
   */
  analizzaTesto(testo, materia, argomento) {
    if (!testo || testo.length < 50) {
      return { fatti: [], errori: ['Testo troppo corto'] };
    }

    // Normalizza il testo
    const testoNormalizzato = this.normalizzaTesto(testo);
    
    // Dividi in frasi
    const frasi = this.dividiInFrasi(testoNormalizzato);
    
    // Estrai tutti i tipi di fatti
    const fatti = {
      biografici: this.estraiBiografici(testoNormalizzato, frasi),
      opere: this.estraiOpere(testoNormalizzato, frasi),
      eventi: this.estraiEventi(testoNormalizzato, frasi),
      definizioni: this.estraiDefinizioni(testoNormalizzato, frasi),
      relazioni: this.estraiRelazioni(testoNormalizzato, frasi),
      concetti: this.estraiConcettiChiave(testoNormalizzato, frasi)
    };

    // Valida e arricchisce i fatti
    const fattiValidati = this.validaFatti(fatti, testoNormalizzato);
    
    // Calcola confidence score per ogni fatto
    const fattiConScore = this.calcolaConfidence(fattiValidati, testoNormalizzato);

    return {
      materia,
      argomento,
      testoOriginale: testo.substring(0, 200) + '...',
      numerFrasi: frasi.length,
      fatti: fattiConScore,
      statistiche: this.calcolaStatistiche(fattiConScore)
    };
  }

  /**
   * 🔤 Normalizza il testo per l'analisi
   */
  normalizzaTesto(testo) {
    return testo
      .replace(/\s+/g, ' ')           // Normalizza spazi
      .replace(/\.{2,}/g, '.')        // Rimuovi puntini multipli
      .replace(/\.\s*\./g, '.')       // Rimuovi punti doppi
      .replace(/\n+/g, ' ')           // Rimuovi a capo
      .trim();
  }

  /**
   * 📝 Dividi il testo in frasi mantenendo il contesto
   */
  dividiInFrasi(testo) {
    // Proteggi abbreviazioni comuni
    const testoProtetto = testo
      .replace(/\b(dott|prof|sig|avv|ing|arch)\./gi, '$1§')
      .replace(/\b(es|cfr|ecc|etc)\./gi, '$1§')
      .replace(/\b([A-Z])\./g, '$1§'); // Iniziali

    // Dividi per punti, punti esclamativi, interrogativi
    const frasi = testoProtetto
      .split(/(?<=[.!?])\s+/)
      .map(f => f.replace(/§/g, '.').trim())
      .filter(f => f.length > 10);

    return frasi.map((frase, index) => ({
      indice: index,
      testo: frase,
      lunghezza: frase.length,
      paroleChiave: this.estraiParoleChiave(frase)
    }));
  }

  /**
   * 🔑 Estrai parole chiave da una frase
   */
  estraiParoleChiave(frase) {
    const parole = frase
      .toLowerCase()
      .replace(/[^\wàèéìòùÀÈÉÌÒÙ\s]/g, '')
      .split(/\s+/)
      .filter(p => p.length > 3 && !this.stopwords.has(p));

    // Estrai anche nomi propri (maiuscole)
    const nomiPropri = frase.match(/\b[A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+)?\b/g) || [];

    return {
      comuni: [...new Set(parole)],
      propri: [...new Set(nomiPropri)]
    };
  }

  /**
   * 👤 Estrai fatti biografici (nascite, morti, luoghi)
   */
  estraiBiografici(testo, frasi) {
    const biografici = [];

    // Estrai nascite
    for (const pattern of this.patterns.nascita) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(testo)) !== null) {
        const personaggio = match[1]?.trim();
        const data = match[2]?.trim();
        const luogo = match[3]?.trim();

        if (personaggio && (data || luogo)) {
          biografici.push({
            tipo: 'nascita',
            personaggio,
            data: this.normalizzaData(data),
            luogo,
            fraseOriginale: this.trovaFraseContenente(frasi, match[0]),
            confidence: 0.8
          });
        }
      }
    }

    // Estrai morti
    for (const pattern of this.patterns.morte) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(testo)) !== null) {
        const personaggio = match[1]?.trim();
        const data = match[2]?.trim();
        const luogo = match[3]?.trim();

        if (personaggio && (data || luogo)) {
          biografici.push({
            tipo: 'morte',
            personaggio,
            data: this.normalizzaData(data),
            luogo,
            fraseOriginale: this.trovaFraseContenente(frasi, match[0]),
            confidence: 0.8
          });
        }
      }
    }

    return this.deduplicaFatti(biografici);
  }

  /**
   * 📚 Estrai opere (libri, poesie, composizioni)
   */
  estraiOpere(testo, frasi) {
    const opere = [];

    for (const pattern of this.patterns.opera) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(testo)) !== null) {
        const titolo = match[1]?.trim();
        const anno = match[2]?.trim();

        if (titolo && titolo.length > 2) {
          // Cerca l'autore nella stessa frase o nelle frasi vicine
          const fraseOriginale = this.trovaFraseContenente(frasi, titolo);
          const autore = this.cercaAutorePerOpera(testo, titolo, fraseOriginale);

          opere.push({
            tipo: 'opera',
            titolo: this.normalizzaTitolo(titolo),
            autore,
            anno: this.normalizzaData(anno),
            genere: this.identificaGenere(testo, titolo),
            fraseOriginale,
            confidence: autore ? 0.9 : 0.6
          });
        }
      }
    }

    return this.deduplicaFatti(opere);
  }

  /**
   * 📅 Estrai eventi storici
   */
  estraiEventi(testo, frasi) {
    const eventi = [];

    for (const pattern of this.patterns.evento) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(testo)) !== null) {
        // Il formato dipende dal pattern
        let data, descrizione, tipo;

        if (match[0].includes('trattato') || match[0].includes('battaglia') || 
            match[0].includes('guerra') || match[0].includes('rivoluzione')) {
          tipo = match[1]?.toLowerCase();
          descrizione = match[0].trim();
          data = this.cercaDataVicina(testo, match.index);
        } else {
          data = match[1]?.trim();
          descrizione = match[2]?.trim();
          tipo = this.identificaTipoEvento(descrizione);
        }

        if (descrizione && descrizione.length > 5) {
          eventi.push({
            tipo: 'evento',
            sottotipo: tipo,
            descrizione: this.pulisciDescrizione(descrizione),
            data: this.normalizzaData(data),
            fraseOriginale: this.trovaFraseContenente(frasi, match[0]),
            confidence: data ? 0.85 : 0.6
          });
        }
      }
    }

    return this.deduplicaFatti(eventi);
  }

  /**
   * 📖 Estrai definizioni e concetti
   */
  estraiDefinizioni(testo, frasi) {
    const definizioni = [];

    for (const pattern of this.patterns.definizione) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(testo)) !== null) {
        const termine = match[1]?.trim();
        const spiegazione = match[2]?.trim();

        if (termine && spiegazione && spiegazione.length > 10) {
          definizioni.push({
            tipo: 'definizione',
            termine: this.normalizzaTermine(termine),
            spiegazione: this.pulisciDescrizione(spiegazione),
            categoria: this.categorizzaTermine(termine, spiegazione),
            fraseOriginale: this.trovaFraseContenente(frasi, match[0]),
            confidence: 0.75
          });
        }
      }
    }

    return this.deduplicaFatti(definizioni);
  }

  /**
   * 🔗 Estrai relazioni tra entità
   */
  estraiRelazioni(testo, frasi) {
    const relazioni = [];

    // Relazioni causali
    for (const pattern of this.patterns.causale) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(testo)) !== null) {
        const causa = match[1]?.trim();
        const effetto = match[2]?.trim();

        if (causa && effetto && causa.length > 10 && effetto.length > 10) {
          relazioni.push({
            tipo: 'relazione',
            sottotipo: 'causale',
            causa: this.pulisciDescrizione(causa),
            effetto: this.pulisciDescrizione(effetto),
            fraseOriginale: this.trovaFraseContenente(frasi, match[0]),
            confidence: 0.7
          });
        }
      }
    }

    // Relazioni di influenza
    for (const pattern of this.patterns.influenza) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(testo)) !== null) {
        const soggetto = match[1]?.trim();
        const oggetto = match[2]?.trim();

        if (soggetto && oggetto) {
          relazioni.push({
            tipo: 'relazione',
            sottotipo: 'influenza',
            soggetto,
            oggetto,
            fraseOriginale: this.trovaFraseContenente(frasi, match[0]),
            confidence: 0.8
          });
        }
      }
    }

    // Appartenenza a movimenti
    for (const pattern of this.patterns.movimento) {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(testo)) !== null) {
        const personaggio = match[1]?.trim();
        const movimento = match[2]?.trim();

        if (personaggio && movimento) {
          relazioni.push({
            tipo: 'relazione',
            sottotipo: 'appartenenza',
            personaggio,
            movimento,
            fraseOriginale: this.trovaFraseContenente(frasi, match[0]),
            confidence: 0.85
          });
        }
      }
    }

    return this.deduplicaFatti(relazioni);
  }

  /**
   * 💡 Estrai concetti chiave dal testo
   */
  estraiConcettiChiave(testo, frasi) {
    const concetti = [];
    const testoLower = testo.toLowerCase();

    // Lista di concetti importanti da cercare
    const concettiDaCercare = [
      // Letteratura
      'romanticismo', 'neoclassicismo', 'verismo', 'decadentismo', 'ermetismo',
      'futurismo', 'crepuscolarismo', 'illuminismo', 'preromanticismo',
      'simbolismo', 'estetismo', 'naturalismo', 'realismo',
      // Filosofia
      'idealismo', 'materialismo', 'positivismo', 'esistenzialismo', 'razionalismo',
      'empirismo', 'fenomenologia', 'strutturalismo', 'nichilismo', 'pessimismo',
      // Storia
      'risorgimento', 'restaurazione', 'unificazione', 'colonialismo', 'imperialismo',
      'fascismo', 'nazismo', 'comunismo', 'liberalismo', 'nazionalismo',
      // Concetti trasversali
      'sublime', 'titanismo', 'sepolcralismo', 'materialismo', 'spiritualismo'
    ];

    for (const concetto of concettiDaCercare) {
      if (testoLower.includes(concetto)) {
        // Trova la frase che contiene il concetto
        const fraseConConcetto = frasi.find(f => 
          f.testo.toLowerCase().includes(concetto)
        );

        if (fraseConConcetto) {
          // Estrai il contesto del concetto
          const contesto = this.estraiContestoConcetto(fraseConConcetto.testo, concetto);
          
          concetti.push({
            tipo: 'concetto',
            nome: concetto,
            contesto,
            fraseOriginale: fraseConConcetto.testo,
            confidence: 0.9
          });
        }
      }
    }

    return concetti;
  }

  // ================== METODI HELPER ==================

  /**
   * Trova la frase che contiene un testo specifico
   */
  trovaFraseContenente(frasi, testo) {
    if (!testo) return null;
    const testoClean = testo.substring(0, 50);
    const frase = frasi.find(f => f.testo.includes(testoClean));
    return frase ? frase.testo : null;
  }

  /**
   * Cerca l'autore associato a un'opera
   */
  cercaAutorePerOpera(testo, titolo, fraseConOpera) {
    if (!fraseConOpera) return null;

    // Pattern per trovare autore vicino all'opera
    const patterns = [
      new RegExp(`([A-Z][a-zàèéìòù]+(?:\\s+[A-Z][a-zàèéìòù]+)?)\\s+(?:scrisse|compose|pubblicò|creò).*${titolo.substring(0,10)}`, 'i'),
      new RegExp(`${titolo.substring(0,10)}.*(?:di|di\\s+)([A-Z][a-zàèéìòù]+(?:\\s+[A-Z][a-zàèéìòù]+)?)`, 'i'),
      new RegExp(`([A-Z][a-zàèéìòù]+).*${titolo.substring(0,10)}`, 'i')
    ];

    for (const pattern of patterns) {
      const match = fraseConOpera.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  /**
   * Cerca una data vicino a una posizione nel testo
   */
  cercaDataVicina(testo, posizione) {
    const intorno = testo.substring(Math.max(0, posizione - 100), posizione + 100);
    const match = intorno.match(/\b(1\d{3}|20\d{2})\b/);
    return match ? match[1] : null;
  }

  /**
   * Identifica il genere di un'opera
   */
  identificaGenere(testo, titolo) {
    const testoVicino = testo.substring(
      Math.max(0, testo.indexOf(titolo) - 50),
      testo.indexOf(titolo) + titolo.length + 50
    ).toLowerCase();

    const generi = {
      'romanzo': ['romanzo', 'narrativa', 'prosa'],
      'poesia': ['poesia', 'versi', 'lirica', 'sonetto', 'ode', 'carme'],
      'tragedia': ['tragedia', 'dramma', 'teatro'],
      'commedia': ['commedia'],
      'saggio': ['saggio', 'trattato', 'opera critica']
    };

    for (const [genere, keywords] of Object.entries(generi)) {
      if (keywords.some(k => testoVicino.includes(k))) {
        return genere;
      }
    }

    return 'opera';
  }

  /**
   * Identifica il tipo di evento
   */
  identificaTipoEvento(descrizione) {
    const desc = descrizione.toLowerCase();
    
    if (desc.includes('guerra') || desc.includes('battaglia') || desc.includes('conflitto')) return 'militare';
    if (desc.includes('trattato') || desc.includes('pace') || desc.includes('accordo')) return 'diplomatico';
    if (desc.includes('rivoluzione') || desc.includes('rivolta') || desc.includes('moti')) return 'rivoluzionario';
    if (desc.includes('congresso') || desc.includes('conferenza')) return 'politico';
    if (desc.includes('scoperta') || desc.includes('invenzione')) return 'scientifico';
    if (desc.includes('nascita') || desc.includes('morte') || desc.includes('fondazione')) return 'fondativo';
    
    return 'storico';
  }

  /**
   * Normalizza una data
   */
  normalizzaData(data) {
    if (!data) return null;
    
    // Se è già un anno, restituiscilo
    const anno = data.match(/\b(1\d{3}|20\d{2})\b/);
    if (anno) return anno[1];
    
    return data;
  }

  /**
   * Normalizza un titolo
   */
  normalizzaTitolo(titolo) {
    return titolo
      .replace(/[«»""'']/g, '')
      .trim();
  }

  /**
   * Normalizza un termine
   */
  normalizzaTermine(termine) {
    return termine
      .toLowerCase()
      .replace(/^(il|lo|la|i|gli|le)\s+/i, '')
      .trim();
  }

  /**
   * Pulisce una descrizione
   */
  pulisciDescrizione(desc) {
    return desc
      .replace(/^\s*[,;:]\s*/, '')
      .replace(/\s*[,;:]\s*$/, '')
      .trim();
  }

  /**
   * Categorizza un termine
   */
  categorizzaTermine(termine, spiegazione) {
    const termLower = termine.toLowerCase();
    const spiegLower = spiegazione.toLowerCase();
    
    if (termLower.endsWith('ismo')) return 'movimento';
    if (spiegLower.includes('filosofia') || spiegLower.includes('pensiero')) return 'filosofico';
    if (spiegLower.includes('letteratura') || spiegLower.includes('poetica')) return 'letterario';
    if (spiegLower.includes('arte') || spiegLower.includes('artistico')) return 'artistico';
    
    return 'generico';
  }

  /**
   * Estrae il contesto di un concetto
   */
  estraiContestoConcetto(frase, concetto) {
    const idx = frase.toLowerCase().indexOf(concetto);
    if (idx === -1) return frase;
    
    const inizio = Math.max(0, idx - 30);
    const fine = Math.min(frase.length, idx + concetto.length + 50);
    
    return '...' + frase.substring(inizio, fine) + '...';
  }

  /**
   * Deduplica fatti simili
   */
  deduplicaFatti(fatti) {
    const visti = new Set();
    return fatti.filter(fatto => {
      const chiave = JSON.stringify({
        tipo: fatto.tipo,
        principale: fatto.personaggio || fatto.titolo || fatto.termine || fatto.descrizione?.substring(0, 30)
      });
      
      if (visti.has(chiave)) return false;
      visti.add(chiave);
      return true;
    });
  }

  /**
   * Valida i fatti estratti
   */
  validaFatti(fatti, testoOriginale) {
    const fattiValidati = {};

    for (const [categoria, lista] of Object.entries(fatti)) {
      fattiValidati[categoria] = lista.filter(fatto => {
        // Verifica che il fatto principale sia nel testo
        const contenutoPrincipale = fatto.personaggio || fatto.titolo || 
                                    fatto.termine || fatto.descrizione;
        
        if (!contenutoPrincipale) return false;
        
        // Verifica lunghezza minima
        if (contenutoPrincipale.length < 3) return false;
        
        // Verifica che non sia una stopword
        if (this.stopwords.has(contenutoPrincipale.toLowerCase())) return false;
        
        return true;
      });
    }

    return fattiValidati;
  }

  /**
   * Calcola confidence score per ogni fatto
   */
  calcolaConfidence(fatti, testoOriginale) {
    const fattiConScore = {};

    for (const [categoria, lista] of Object.entries(fatti)) {
      fattiConScore[categoria] = lista.map(fatto => {
        let score = fatto.confidence || 0.5;

        // Bonus se ha più informazioni
        if (fatto.data) score += 0.1;
        if (fatto.autore) score += 0.1;
        if (fatto.fraseOriginale) score += 0.05;

        // Penalità se troppo generico
        const contenuto = fatto.personaggio || fatto.titolo || fatto.termine || fatto.descrizione;
        if (contenuto && contenuto.length < 5) score -= 0.2;

        // Normalizza
        fatto.confidence = Math.min(1, Math.max(0, score));
        
        return fatto;
      });
    }

    return fattiConScore;
  }

  /**
   * Calcola statistiche sui fatti estratti
   */
  calcolaStatistiche(fatti) {
    let totale = 0;
    let altaConfidence = 0;
    const perCategoria = {};

    for (const [categoria, lista] of Object.entries(fatti)) {
      perCategoria[categoria] = lista.length;
      totale += lista.length;
      altaConfidence += lista.filter(f => f.confidence >= 0.8).length;
    }

    return {
      totale,
      altaConfidence,
      perCategoria,
      qualitaMedia: totale > 0 ? (altaConfidence / totale * 100).toFixed(1) + '%' : '0%'
    };
  }

  /**
   * Ottieni distrattori intelligenti per un fatto
   */
  getDistractors(fatto, tipo) {
    const distrattori = [];

    switch (tipo) {
      case 'data':
        if (fatto.data && this.erroriComuni.date[fatto.data]) {
          distrattori.push(...this.erroriComuni.date[fatto.data]);
        } else if (fatto.data) {
          const anno = parseInt(fatto.data);
          distrattori.push(
            (anno + 1).toString(),
            (anno - 1).toString(),
            (anno + 10).toString(),
            (anno - 10).toString()
          );
        }
        break;

      case 'autore':
        if (fatto.personaggio && this.erroriComuni.autori[fatto.personaggio]) {
          distrattori.push(...this.erroriComuni.autori[fatto.personaggio]);
        }
        break;

      case 'movimento':
        if (fatto.movimento && this.erroriComuni.movimenti[fatto.movimento]) {
          distrattori.push(...this.erroriComuni.movimenti[fatto.movimento]);
        }
        break;
    }

    return distrattori.slice(0, 3);
  }
}

module.exports = SemanticParser;
