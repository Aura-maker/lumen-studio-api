/**
 * 🎯 DISTRACTOR GENERATOR - Generatore Distrattori Intelligenti
 * Crea distrattori plausibili ma errati basati su strategie pedagogiche
 * 
 * Strategie implementate:
 * 1. ERRORI COMUNI: Confusioni storiche frequenti
 * 2. CONTEMPORANEI: Elementi dello stesso periodo
 * 3. SIMILI: Elementi con caratteristiche simili
 * 4. PARZIALMENTE CORRETTI: Informazioni incomplete
 * 5. ANACRONISMI: Elementi fuori contesto temporale
 * 6. OPPOSITI: Per domande vero/falso
 * 7. CONFUSIONE SEMANTICA: Termini simili ma diversi
 */

class DistractorGenerator {
  constructor(knowledgeGraph = null) {
    this.graph = knowledgeGraph;
    
    // Database errori comuni organizzato per categoria
    this.erroriComuni = this.inizializzaErroriComuni();
    
    // Database contemporanei per periodo
    this.contemporanei = this.inizializzaContemporanei();
    
    // Database confusioni semantiche
    this.confusioniSemantiche = this.inizializzaConfusioniSemantiche();
    
    console.log('🎯 DistractorGenerator inizializzato');
  }

  // ==================== DATABASE ERRORI COMUNI ====================

  inizializzaErroriComuni() {
    return {
      // ========== DATE ==========
      date: {
        // Risorgimento e Unità d'Italia
        '1848': {
          errate: ['1847', '1849', '1850', '1846'],
          motivazione: 'Moti del 1848 - spesso confusi con anni vicini',
          suggerimento: '1848 = Anno delle rivoluzioni europee'
        },
        '1859': {
          errate: ['1858', '1860', '1861', '1857'],
          motivazione: 'Seconda guerra d\'indipendenza',
          suggerimento: '1859 = Plombières → Solferino → Armistizio Villafranca'
        },
        '1860': {
          errate: ['1859', '1861', '1862', '1858'],
          motivazione: 'Spedizione dei Mille',
          suggerimento: '1860 = Garibaldi e i Mille'
        },
        '1861': {
          errate: ['1860', '1859', '1870', '1866'],
          motivazione: 'Proclamazione Regno d\'Italia',
          suggerimento: '1861 = 17 marzo, Vittorio Emanuele II re'
        },
        '1866': {
          errate: ['1865', '1867', '1870', '1861'],
          motivazione: 'Terza guerra d\'indipendenza - Veneto',
          suggerimento: '1866 = Prussia vince Austria → Veneto all\'Italia'
        },
        '1870': {
          errate: ['1871', '1866', '1861', '1869'],
          motivazione: 'Breccia di Porta Pia - Roma capitale',
          suggerimento: '1870 = 20 settembre, fine potere temporale'
        },
        
        // Autori italiani
        '1778': {
          errate: ['1774', '1779', '1782', '1785'],
          motivazione: 'Nascita Foscolo',
          suggerimento: '1778 = Foscolo nasce a Zante (7-7)'
        },
        '1798': {
          errate: ['1795', '1800', '1797', '1799'],
          motivazione: 'Nascita Leopardi',
          suggerimento: '1798 = Leopardi nasce a Recanati'
        },
        '1785': {
          errate: ['1783', '1787', '1790', '1788'],
          motivazione: 'Nascita Manzoni',
          suggerimento: '1785 = Manzoni nasce a Milano'
        },
        '1827': {
          errate: ['1825', '1829', '1830', '1823'],
          motivazione: 'Prima edizione Promessi Sposi',
          suggerimento: '1827 = "Ventisettana" dei Promessi Sposi'
        },
        '1840': {
          errate: ['1838', '1842', '1835', '1845'],
          motivazione: 'Edizione definitiva Promessi Sposi',
          suggerimento: '1840 = "Quarantana" rivista linguisticamente'
        },
        '1807': {
          errate: ['1805', '1809', '1810', '1803'],
          motivazione: 'I Sepolcri di Foscolo',
          suggerimento: '1807 = Carme "I Sepolcri"'
        },
        '1816': {
          errate: ['1814', '1818', '1820', '1815'],
          motivazione: 'Canti leopardiani iniziati',
          suggerimento: '1816 = Prime canzoni di Leopardi'
        },
        
        // Eventi storici
        '1789': {
          errate: ['1776', '1793', '1799', '1804'],
          motivazione: 'Rivoluzione francese',
          suggerimento: '1789 = Presa della Bastiglia (14 luglio)'
        },
        '1797': {
          errate: ['1795', '1799', '1800', '1796'],
          motivazione: 'Trattato di Campoformio',
          suggerimento: '1797 = Napoleone cede Venezia all\'Austria'
        },
        '1804': {
          errate: ['1802', '1806', '1799', '1805'],
          motivazione: 'Napoleone imperatore',
          suggerimento: '1804 = Incoronazione Notre-Dame (2 dicembre)'
        },
        '1815': {
          errate: ['1814', '1816', '1818', '1820'],
          motivazione: 'Congresso di Vienna',
          suggerimento: '1815 = Restaurazione e nuovo ordine europeo'
        },
        '1914': {
          errate: ['1915', '1912', '1913', '1916'],
          motivazione: 'Inizio Prima Guerra Mondiale',
          suggerimento: '1914 = Sarajevo (28 giugno), Austria vs Serbia'
        },
        '1915': {
          errate: ['1914', '1916', '1917', '1918'],
          motivazione: 'Italia entra in guerra',
          suggerimento: '1915 = Patto di Londra, 24 maggio dichiarazione'
        },
        '1922': {
          errate: ['1920', '1924', '1923', '1925'],
          motivazione: 'Marcia su Roma',
          suggerimento: '1922 = 28 ottobre, Mussolini al governo'
        },
        '1939': {
          errate: ['1938', '1940', '1941', '1937'],
          motivazione: 'Inizio Seconda Guerra Mondiale',
          suggerimento: '1939 = 1 settembre, invasione Polonia'
        },
        '1943': {
          errate: ['1942', '1944', '1945', '1941'],
          motivazione: 'Armistizio italiano',
          suggerimento: '1943 = 8 settembre, Badoglio'
        },
        '1945': {
          errate: ['1944', '1946', '1943', '1947'],
          motivazione: 'Fine Seconda Guerra Mondiale',
          suggerimento: '1945 = 25 aprile Liberazione, 8 maggio resa Germania'
        }
      },

      // ========== AUTORI ==========
      autori: {
        'Foscolo': {
          confusiCon: ['Leopardi', 'Manzoni', 'Alfieri', 'Monti'],
          motivazione: 'Tutti autori tra Neoclassicismo e Romanticismo',
          distinzione: 'Foscolo = illusioni, Sepolcri, esilio'
        },
        'Leopardi': {
          confusiCon: ['Foscolo', 'Pascoli', 'Manzoni', 'Carducci'],
          motivazione: 'Pessimismo e lirica',
          distinzione: 'Leopardi = infinito, pessimismo cosmico, Recanati'
        },
        'Manzoni': {
          confusiCon: ['Verga', 'Nievo', 'Foscolo', 'Pellico'],
          motivazione: 'Romanzo storico italiano',
          distinzione: 'Manzoni = Provvidenza, Promessi Sposi, romanzo storico'
        },
        'Verga': {
          confusiCon: ['Capuana', 'De Roberto', 'Pirandello', 'Deledda'],
          motivazione: 'Verismo siciliano',
          distinzione: 'Verga = ciclo dei Vinti, eclisse, impersonalità'
        },
        'Pirandello': {
          confusiCon: ['Svevo', 'Tozzi', 'Verga', 'Moravia'],
          motivazione: 'Crisi dell\'identità nel \'900',
          distinzione: 'Pirandello = maschere, metateatro, umorismo'
        },
        'Svevo': {
          confusiCon: ['Pirandello', 'Tozzi', 'Joyce', 'Moravia'],
          motivazione: 'Romanzo psicologico',
          distinzione: 'Svevo = inetto, psicoanalisi, Trieste'
        },
        'D\'Annunzio': {
          confusiCon: ['Pascoli', 'Carducci', 'Fogazzaro', 'Pirandello'],
          motivazione: 'Estetismo e Decadentismo',
          distinzione: 'D\'Annunzio = superuomo, panismo, vita inimitabile'
        },
        'Pascoli': {
          confusiCon: ['D\'Annunzio', 'Carducci', 'Fogazzaro', 'Gozzano'],
          motivazione: 'Simbolismo e Decadentismo',
          distinzione: 'Pascoli = fanciullino, nido, fonosimbolismo'
        },
        'Ungaretti': {
          confusiCon: ['Montale', 'Quasimodo', 'Saba', 'Campana'],
          motivazione: 'Poesia del Novecento',
          distinzione: 'Ungaretti = parola essenziale, trincea, Allegria'
        },
        'Montale': {
          confusiCon: ['Ungaretti', 'Quasimodo', 'Saba', 'Luzi'],
          motivazione: 'Ermetismo',
          distinzione: 'Montale = correlativo oggettivo, male di vivere, Liguria'
        }
      },

      // ========== OPERE ==========
      opere: {
        'I Sepolcri': {
          confuseCon: ['Le Grazie', 'A Zacinto', 'Ultime lettere', 'Odi'],
          autoreCorretto: 'Foscolo',
          anno: '1807',
          motivazione: 'Opere foscoliane spesso confuse'
        },
        'Ultime lettere di Jacopo Ortis': {
          confuseCon: ['I Sepolcri', 'I dolori del giovane Werther', 'Le Grazie'],
          autoreCorretto: 'Foscolo',
          anno: '1802',
          motivazione: 'Romanzo epistolare, influenza Goethe'
        },
        'I Promessi Sposi': {
          confuseCon: ['I Malavoglia', 'Le confessioni di un italiano', 'Storia della colonna infame'],
          autoreCorretto: 'Manzoni',
          anno: '1827/1840',
          motivazione: 'Romanzo storico italiano'
        },
        'I Malavoglia': {
          confuseCon: ['Mastro-don Gesualdo', 'I Promessi Sposi', 'Vita dei campi'],
          autoreCorretto: 'Verga',
          anno: '1881',
          motivazione: 'Romanzo verista'
        },
        'La coscienza di Zeno': {
          confuseCon: ['Senilità', 'Una vita', 'Il fu Mattia Pascal'],
          autoreCorretto: 'Svevo',
          anno: '1923',
          motivazione: 'Romanzo psicologico novecentesco'
        },
        'Il fu Mattia Pascal': {
          confuseCon: ['La coscienza di Zeno', 'Uno, nessuno e centomila', 'I vecchi e i giovani'],
          autoreCorretto: 'Pirandello',
          anno: '1904',
          motivazione: 'Crisi identità novecentesca'
        },
        'L\'Infinito': {
          confuseCon: ['A Silvia', 'La sera del dì di festa', 'Alla luna'],
          autoreCorretto: 'Leopardi',
          anno: '1819',
          motivazione: 'Idilli leopardiani'
        }
      },

      // ========== MOVIMENTI ==========
      movimenti: {
        'Romanticismo': {
          confusiCon: ['Neoclassicismo', 'Preromanticismo', 'Realismo', 'Illuminismo'],
          caratteristiche: 'Sentimento, natura, nazione, popolo',
          periodo: '1816-1860'
        },
        'Verismo': {
          confusiCon: ['Realismo', 'Naturalismo', 'Decadentismo', 'Romanticismo'],
          caratteristiche: 'Impersonalità, ciclo dei vinti, Sicilia',
          periodo: '1870-1900'
        },
        'Decadentismo': {
          confusiCon: ['Simbolismo', 'Estetismo', 'Verismo', 'Crepuscolarismo'],
          caratteristiche: 'Crisi valori, estetismo, superuomo',
          periodo: '1880-1920'
        },
        'Ermetismo': {
          confusiCon: ['Crepuscolarismo', 'Futurismo', 'Neorealismo', 'Simbolismo'],
          caratteristiche: 'Parola oscura, Firenze, analogia',
          periodo: '1920-1945'
        },
        'Futurismo': {
          confusiCon: ['Dadaismo', 'Surrealismo', 'Espressionismo', 'Cubismo'],
          caratteristiche: 'Velocità, guerra, paroliberismo',
          periodo: '1909-1944'
        }
      }
    };
  }

  // ==================== DATABASE CONTEMPORANEI ====================

  inizializzaContemporanei() {
    return {
      periodi: {
        'preromanticismo': {
          anni: [1770, 1815],
          autori: ['Foscolo', 'Alfieri', 'Monti', 'Parini', 'Cesarotti'],
          eventi: ['Rivoluzione francese', 'Napoleone', 'Campoformio']
        },
        'romanticismo': {
          anni: [1815, 1860],
          autori: ['Manzoni', 'Leopardi', 'Berchet', 'Pellico', 'Nievo'],
          eventi: ['Restaurazione', 'Moti', 'Risorgimento', 'Unità']
        },
        'verismo': {
          anni: [1870, 1900],
          autori: ['Verga', 'Capuana', 'De Roberto', 'Deledda', 'Serao'],
          eventi: ['Questione meridionale', 'Colonialismo', 'Crisi agraria']
        },
        'decadentismo': {
          anni: [1880, 1920],
          autori: ['D\'Annunzio', 'Pascoli', 'Fogazzaro', 'Pirandello', 'Svevo'],
          eventi: ['Crisi fine secolo', 'Prima guerra mondiale']
        },
        'novecento': {
          anni: [1900, 1950],
          autori: ['Ungaretti', 'Montale', 'Quasimodo', 'Saba', 'Gadda'],
          eventi: ['Guerre mondiali', 'Fascismo', 'Resistenza']
        }
      }
    };
  }

  // ==================== CONFUSIONI SEMANTICHE ====================

  inizializzaConfusioniSemantiche() {
    return {
      // Termini spesso confusi
      'pessimismo storico': {
        confusoCon: ['pessimismo cosmico', 'nichilismo', 'atarassia'],
        definizione: 'Infelicità causata dalla civiltà (Leopardi giovane)',
        distinzione: 'Storico = colpa civiltà; Cosmico = colpa natura'
      },
      'pessimismo cosmico': {
        confusoCon: ['pessimismo storico', 'nichilismo', 'materialismo'],
        definizione: 'Infelicità insita nella natura (Leopardi maturo)',
        distinzione: 'Cosmico = natura matrigna; Storico = natura benefica'
      },
      'titanismo': {
        confusoCon: ['superomismo', 'eroismo', 'individualismo'],
        definizione: 'Ribellione eroica al destino pur sapendolo invincibile',
        distinzione: 'Titanismo = lotta contro fato; Superomismo = dominio sugli altri'
      },
      'superomismo': {
        confusoCon: ['titanismo', 'individualismo', 'vitalismo'],
        definizione: 'Affermazione individuo superiore (D\'Annunzio)',
        distinzione: 'Superomismo = potere; Titanismo = resistenza'
      },
      'verismo': {
        confusoCon: ['naturalismo', 'realismo', 'positivismo'],
        definizione: 'Movimento italiano: impersonalità, dialetto, Sicilia',
        distinzione: 'Verismo = italiano, pessimista; Naturalismo = francese, scientifico'
      },
      'naturalismo': {
        confusoCon: ['verismo', 'realismo', 'positivismo'],
        definizione: 'Movimento francese: Zola, romanzo sperimentale',
        distinzione: 'Naturalismo = fiducia scienza; Verismo = pessimismo'
      },
      'ermetismo': {
        confusoCon: ['simbolismo', 'crepuscolarismo', 'futurismo'],
        definizione: 'Poesia oscura, parola pura, Firenze anni \'30',
        distinzione: 'Ermetismo = chiuso, elitario; Crepuscolarismo = quotidiano'
      },
      'illusioni': {
        confusoCon: ['ideali', 'valori', 'miti'],
        definizione: 'In Foscolo: costruzioni necessarie ma razionalmente false',
        distinzione: 'Illusioni = false ma vitali; Ideali = valori veri'
      }
    };
  }

  // ==================== GENERAZIONE DISTRATTORI ====================

  /**
   * 🎯 Genera distrattori per una domanda specifica
   * @param {Object} domanda - Oggetto domanda con risposta corretta
   * @param {string} tipo - Tipo di risposta (data, autore, opera, etc.)
   * @param {number} numero - Numero di distrattori da generare
   * @returns {Array} - Array di distrattori con metadata
   */
  generaDistractors(domanda, tipo, numero = 3) {
    const rispostaCorretta = domanda.rispostaCorretta;
    let distrattori = [];

    switch (tipo) {
      case 'anno':
      case 'data':
        distrattori = this.generaDistractorsDate(rispostaCorretta, numero);
        break;
      case 'autore':
      case 'persona':
        distrattori = this.generaDistractorsAutori(rispostaCorretta, numero, domanda);
        break;
      case 'opera':
        distrattori = this.generaDistractorsOpere(rispostaCorretta, numero, domanda);
        break;
      case 'luogo':
        distrattori = this.generaDistractorsLuoghi(rispostaCorretta, numero);
        break;
      case 'movimento':
      case 'corrente':
        distrattori = this.generaDistractorsMovimenti(rispostaCorretta, numero);
        break;
      case 'definizione':
        distrattori = this.generaDistractorsDefinizioni(rispostaCorretta, numero);
        break;
      default:
        distrattori = this.generaDistractorsGenerici(rispostaCorretta, numero, tipo);
    }

    // Filtra duplicati e risposta corretta
    distrattori = this.filtraDistractors(distrattori, rispostaCorretta);

    // Assicura numero corretto
    while (distrattori.length < numero) {
      const fallback = this.generaDistractorFallback(tipo, rispostaCorretta);
      if (fallback && !distrattori.some(d => d.valore === fallback.valore)) {
        distrattori.push(fallback);
      } else {
        break; // Evita loop infinito
      }
    }

    return distrattori.slice(0, numero);
  }

  /**
   * 📅 Genera distrattori per date
   */
  generaDistractorsDate(annoCorretto, numero) {
    const distrattori = [];
    const anno = parseInt(annoCorretto);

    // 1. Prima cerca errori comuni noti
    if (this.erroriComuni.date[annoCorretto]) {
      const errori = this.erroriComuni.date[annoCorretto];
      for (const errato of errori.errate) {
        distrattori.push({
          valore: errato,
          strategia: 'errore_comune',
          motivazione: errori.motivazione,
          confidence: 0.95
        });
      }
    }

    // 2. Date molto vicine (±1-2 anni) - errori di memoria
    if (distrattori.length < numero) {
      const vicine = [anno - 1, anno + 1, anno - 2, anno + 2];
      for (const v of vicine) {
        if (!distrattori.some(d => d.valore === v.toString())) {
          distrattori.push({
            valore: v.toString(),
            strategia: 'vicinanza',
            motivazione: 'Data molto vicina a quella corretta',
            confidence: 0.85
          });
        }
      }
    }

    // 3. Date dello stesso decennio
    if (distrattori.length < numero) {
      const decennio = Math.floor(anno / 10) * 10;
      for (let i = 0; i <= 9; i++) {
        const candidata = decennio + i;
        if (candidata !== anno && !distrattori.some(d => d.valore === candidata.toString())) {
          distrattori.push({
            valore: candidata.toString(),
            strategia: 'stesso_decennio',
            motivazione: 'Data nello stesso decennio',
            confidence: 0.75
          });
        }
      }
    }

    // 4. Date simmetriche (scambio cifre)
    const annoStr = annoCorretto.toString();
    if (annoStr.length === 4) {
      const invertito = annoStr[0] + annoStr[1] + annoStr[3] + annoStr[2];
      if (invertito !== annoCorretto && !distrattori.some(d => d.valore === invertito)) {
        distrattori.push({
          valore: invertito,
          strategia: 'inversione_cifre',
          motivazione: 'Cifre invertite',
          confidence: 0.7
        });
      }
    }

    return distrattori;
  }

  /**
   * 👤 Genera distrattori per autori
   */
  generaDistractorsAutori(autoreCorretto, numero, domanda = null) {
    const distrattori = [];

    // 1. Autori spesso confusi
    if (this.erroriComuni.autori[autoreCorretto]) {
      const confusi = this.erroriComuni.autori[autoreCorretto];
      for (const confuso of confusi.confusiCon) {
        distrattori.push({
          valore: confuso,
          strategia: 'confusione_comune',
          motivazione: confusi.motivazione,
          distinzione: confusi.distinzione,
          confidence: 0.95
        });
      }
    }

    // 2. Se abbiamo il grafo, cerca contemporanei
    if (this.graph) {
      const nodo = this.graph.trovaNodoPerNome(autoreCorretto);
      if (nodo) {
        const contemporanei = this.graph.trovaNodContemporanei(nodo.id, 30);
        for (const { nodo: cont } of contemporanei) {
          if (cont.tipo === 'persona' && cont.nome !== autoreCorretto) {
            if (!distrattori.some(d => d.valore === cont.nome)) {
              distrattori.push({
                valore: cont.nome,
                strategia: 'contemporaneo',
                motivazione: 'Autore dello stesso periodo',
                confidence: 0.85
              });
            }
          }
        }
      }
    }

    // 3. Cerca nel database contemporanei per periodo
    for (const [periodo, dati] of Object.entries(this.contemporanei.periodi)) {
      if (dati.autori.includes(autoreCorretto)) {
        for (const altro of dati.autori) {
          if (altro !== autoreCorretto && !distrattori.some(d => d.valore === altro)) {
            distrattori.push({
              valore: altro,
              strategia: 'stesso_periodo',
              motivazione: `Autore del ${periodo}`,
              confidence: 0.8
            });
          }
        }
      }
    }

    return distrattori;
  }

  /**
   * 📚 Genera distrattori per opere
   */
  generaDistractorsOpere(operaCorretta, numero, domanda = null) {
    const distrattori = [];

    // 1. Opere spesso confuse
    if (this.erroriComuni.opere[operaCorretta]) {
      const info = this.erroriComuni.opere[operaCorretta];
      for (const confusa of info.confuseCon) {
        distrattori.push({
          valore: confusa,
          strategia: 'confusione_comune',
          motivazione: info.motivazione,
          confidence: 0.95
        });
      }
    }

    // 2. Se abbiamo info sull'autore, cerca altre opere dello stesso autore
    if (domanda && domanda.autore) {
      // Cerca nel database errori comuni
      for (const [opera, info] of Object.entries(this.erroriComuni.opere)) {
        if (info.autoreCorretto === domanda.autore && opera !== operaCorretta) {
          if (!distrattori.some(d => d.valore === opera)) {
            distrattori.push({
              valore: opera,
              strategia: 'stesso_autore',
              motivazione: 'Altra opera dello stesso autore',
              confidence: 0.9
            });
          }
        }
      }
    }

    // 3. Opere con titoli simili
    const paroleChiave = operaCorretta.toLowerCase().split(' ').filter(p => p.length > 3);
    for (const [opera, info] of Object.entries(this.erroriComuni.opere)) {
      if (opera !== operaCorretta) {
        const paroleOpera = opera.toLowerCase().split(' ');
        const overlap = paroleChiave.some(p => paroleOpera.some(o => o.includes(p)));
        if (overlap && !distrattori.some(d => d.valore === opera)) {
          distrattori.push({
            valore: opera,
            strategia: 'titolo_simile',
            motivazione: 'Titolo con parole simili',
            confidence: 0.7
          });
        }
      }
    }

    return distrattori;
  }

  /**
   * 📍 Genera distrattori per luoghi
   */
  generaDistractorsLuoghi(luogoCorretto, numero) {
    const distrattori = [];

    // Database luoghi italiani per categoria
    const luoghi = {
      cittaLettere: ['Firenze', 'Milano', 'Venezia', 'Roma', 'Napoli', 'Torino', 'Genova', 'Bologna'],
      cittaSicilia: ['Catania', 'Palermo', 'Messina', 'Siracusa', 'Agrigento', 'Aci Trezza'],
      cittaMarche: ['Recanati', 'Macerata', 'Ancona', 'Pesaro', 'Urbino'],
      cittaEstere: ['Londra', 'Parigi', 'Vienna', 'Berlino', 'Zurigo'],
      isole: ['Zante', 'Sicilia', 'Sardegna', 'Capri', 'Ischia']
    };

    // Trova categoria del luogo corretto
    let categoriaCorretta = null;
    for (const [cat, lista] of Object.entries(luoghi)) {
      if (lista.includes(luogoCorretto)) {
        categoriaCorretta = cat;
        break;
      }
    }

    // Aggiungi luoghi della stessa categoria
    if (categoriaCorretta) {
      for (const luogo of luoghi[categoriaCorretta]) {
        if (luogo !== luogoCorretto && !distrattori.some(d => d.valore === luogo)) {
          distrattori.push({
            valore: luogo,
            strategia: 'stessa_categoria',
            motivazione: 'Luogo della stessa area geografica',
            confidence: 0.85
          });
        }
      }
    }

    // Aggiungi città importanti generiche
    const tutteLeCitta = Object.values(luoghi).flat();
    for (const citta of tutteLeCitta) {
      if (citta !== luogoCorretto && !distrattori.some(d => d.valore === citta)) {
        distrattori.push({
          valore: citta,
          strategia: 'citta_importante',
          motivazione: 'Città importante per la letteratura',
          confidence: 0.7
        });
      }
    }

    return distrattori;
  }

  /**
   * 🏛️ Genera distrattori per movimenti
   */
  generaDistractorsMovimenti(movimentoCorretto, numero) {
    const distrattori = [];

    // 1. Movimenti spesso confusi
    if (this.erroriComuni.movimenti[movimentoCorretto]) {
      const info = this.erroriComuni.movimenti[movimentoCorretto];
      for (const confuso of info.confusiCon) {
        distrattori.push({
          valore: confuso,
          strategia: 'confusione_comune',
          motivazione: 'Movimento spesso confuso',
          distinzione: `${movimentoCorretto}: ${info.caratteristiche}`,
          confidence: 0.95
        });
      }
    }

    // 2. Aggiungi tutti gli altri movimenti conosciuti
    const tuttiMovimenti = Object.keys(this.erroriComuni.movimenti);
    for (const mov of tuttiMovimenti) {
      if (mov !== movimentoCorretto && !distrattori.some(d => d.valore === mov)) {
        distrattori.push({
          valore: mov,
          strategia: 'stesso_ambito',
          motivazione: 'Altro movimento letterario',
          confidence: 0.8
        });
      }
    }

    return distrattori;
  }

  /**
   * 📖 Genera distrattori per definizioni
   */
  generaDistractorsDefinizioni(definizioneCorretta, numero) {
    const distrattori = [];

    // Cerca confusioni semantiche
    for (const [termine, info] of Object.entries(this.confusioniSemantiche)) {
      if (definizioneCorretta.toLowerCase().includes(termine)) {
        for (const confuso of info.confusoCon) {
          const defConfusa = this.confusioniSemantiche[confuso]?.definizione;
          if (defConfusa && defConfusa !== definizioneCorretta) {
            distrattori.push({
              valore: defConfusa,
              strategia: 'confusione_semantica',
              motivazione: info.distinzione,
              confidence: 0.9
            });
          }
        }
      }
    }

    // Modifica definizione corretta per creare distrattori
    // Strategia: nega, sostituisci parole chiave, inverte
    const negazioni = ['non', 'mai', 'nessun'];
    const modificata = definizioneCorretta.replace(
      /sempre|tutti|ogni/gi, 
      m => m === 'sempre' ? 'mai' : m === 'tutti' ? 'nessuno' : 'nessun'
    );
    
    if (modificata !== definizioneCorretta) {
      distrattori.push({
        valore: modificata,
        strategia: 'negazione',
        motivazione: 'Definizione con significato opposto',
        confidence: 0.85
      });
    }

    return distrattori;
  }

  /**
   * 🔄 Genera distrattori generici
   */
  generaDistractorsGenerici(rispostaCorretta, numero, tipo) {
    // Fallback generico
    return [{
      valore: `[Distrattore ${tipo} per: ${rispostaCorretta}]`,
      strategia: 'fallback',
      motivazione: 'Generato automaticamente',
      confidence: 0.5
    }];
  }

  /**
   * 🆘 Genera distrattore di fallback
   */
  generaDistractorFallback(tipo, rispostaCorretta) {
    const fallbacks = {
      'anno': () => {
        const anno = parseInt(rispostaCorretta) || 1800;
        return {
          valore: (anno + Math.floor(Math.random() * 20) - 10).toString(),
          strategia: 'fallback_random',
          confidence: 0.5
        };
      },
      'autore': () => {
        const autori = ['Foscolo', 'Leopardi', 'Manzoni', 'Verga', 'Pascoli', 'D\'Annunzio'];
        const filtrati = autori.filter(a => a !== rispostaCorretta);
        return {
          valore: filtrati[Math.floor(Math.random() * filtrati.length)],
          strategia: 'fallback_lista',
          confidence: 0.6
        };
      },
      default: () => ({
        valore: `Opzione alternativa`,
        strategia: 'fallback_generico',
        confidence: 0.4
      })
    };

    const generator = fallbacks[tipo] || fallbacks.default;
    return generator();
  }

  /**
   * 🧹 Filtra distrattori invalidi
   */
  filtraDistractors(distrattori, rispostaCorretta) {
    const visti = new Set();
    const rispostaLower = rispostaCorretta.toString().toLowerCase().trim();

    return distrattori.filter(d => {
      const valoreLower = d.valore.toString().toLowerCase().trim();
      
      // Escludi se uguale alla risposta corretta
      if (valoreLower === rispostaLower) return false;
      
      // Escludi duplicati
      if (visti.has(valoreLower)) return false;
      visti.add(valoreLower);
      
      // Escludi valori vuoti o troppo corti
      if (!d.valore || d.valore.length < 2) return false;
      
      return true;
    });
  }

  /**
   * 🔀 Mescola opzioni mantenendo traccia della risposta corretta
   */
  mescolaOpzioni(rispostaCorretta, distrattori) {
    const opzioni = [
      { testo: rispostaCorretta, corretta: true },
      ...distrattori.map(d => ({ testo: d.valore, corretta: false, metadata: d }))
    ];

    // Fisher-Yates shuffle
    for (let i = opzioni.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opzioni[i], opzioni[j]] = [opzioni[j], opzioni[i]];
    }

    // Trova indice risposta corretta
    const indiceCorretta = opzioni.findIndex(o => o.corretta);

    return {
      opzioni: opzioni.map((o, i) => ({ id: i, testo: o.testo })),
      rispostaCorretta: indiceCorretta
    };
  }

  /**
   * 📊 Ottieni statistiche distrattori
   */
  getStatistiche() {
    return {
      dateConosciute: Object.keys(this.erroriComuni.date).length,
      autoriConosciuti: Object.keys(this.erroriComuni.autori).length,
      opereConosciute: Object.keys(this.erroriComuni.opere).length,
      movimentiConosciuti: Object.keys(this.erroriComuni.movimenti).length,
      confusioniSemantiche: Object.keys(this.confusioniSemantiche).length,
      periodi: Object.keys(this.contemporanei.periodi).length
    };
  }
}

module.exports = DistractorGenerator;
