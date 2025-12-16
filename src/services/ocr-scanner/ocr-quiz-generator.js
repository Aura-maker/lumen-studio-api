/**
 * 📸 OCR QUIZ GENERATOR - Foto → Quiz Automatici
 * Scansiona appunti, libri, lavagne e genera quiz istantanei
 * 
 * Features:
 * - OCR multilingua (Tesseract.js)
 * - Riconoscimento formule matematiche
 * - Estrazione tabelle e diagrammi
 * - Generazione quiz contestuali
 * - Supporto handwriting
 */

class OCRQuizGenerator {
  constructor() {
    // Mock Tesseract config (in prod usa vera libreria)
    this.ocrConfig = {
      languages: ['ita', 'eng', 'lat'],
      confidence: 0.85,
      preprocessing: true
    };

    // Pattern recognition per materie
    this.patterns = {
      matematica: {
        formule: /[a-z]\s*=\s*[\d\w\+\-\*\/\^\(\)]+/gi,
        equazioni: /[\d\w]+\s*[+\-*/]\s*[\d\w]+\s*=\s*[\d\w]+/gi,
        teoremi: /teorema|lemma|corollario|dimostrazione/gi,
        numeri: /\d+([.,]\d+)?/g
      },
      fisica: {
        formule: /[A-Z]\s*=\s*[a-zA-Z0-9\s\+\-\*\/\^\(\)]+/g,
        unita: /\b(m|kg|s|A|K|mol|cd|Hz|N|Pa|J|W|C|V|Ω|T|H|lm|lx)\b/g,
        costanti: /c\s*=|g\s*=|h\s*=|k\s*=/gi
      },
      chimica: {
        elementi: /\b([A-Z][a-z]?)\b(?:\d+)?/g,
        reazioni: /\w+\s*\+\s*\w+\s*[→←⇌]\s*\w+/g,
        composti: /[A-Z][a-z]?\d*[A-Z]?[a-z]?\d*/g
      },
      storia: {
        date: /\b(1\d{3}|20\d{2})\b/g,
        periodi: /secolo|epoca|età|periodo|guerra|rivoluzione/gi,
        personaggi: /[A-Z][a-z]+\s+[A-Z][a-z]+/g
      },
      letteratura: {
        autori: /[A-Z][a-z]+\s+[A-Z][a-z]+/g,
        opere: /"[^"]+"|«[^»]+»|'[^']+'/g,
        correnti: /romanticismo|verismo|decadentismo|futurismo/gi
      }
    };

    // Tipi di quiz generabili
    this.tipiQuiz = {
      DEFINIZIONE: 'Cosa significa questo termine?',
      FORMULA: 'Completa la formula',
      DATA: 'Quando è avvenuto?',
      CALCOLO: 'Risolvi il problema',
      IDENTIFICAZIONE: 'Identifica l\'elemento',
      COMPLETAMENTO: 'Completa la frase'
    };

    console.log('📸 OCR Quiz Generator inizializzato');
  }

  // ==================== ELABORAZIONE IMMAGINE ====================

  /**
   * 📷 Processa immagine e genera quiz
   */
  async processaImmagine(imageData, opzioni = {}) {
    const risultato = {
      testo: '',
      materia: null,
      quiz: [],
      confidence: 0,
      metadata: {}
    };

    try {
      // Step 1: Pre-processing immagine
      const preprocessed = await this.preprocessImage(imageData);
      
      // Step 2: OCR
      const testoEstratto = await this.eseguiOCR(preprocessed);
      risultato.testo = testoEstratto.testo;
      risultato.confidence = testoEstratto.confidence;

      // Step 3: Identifica materia
      risultato.materia = this.identificaMateria(testoEstratto.testo);

      // Step 4: Estrai elementi chiave
      const elementi = this.estraiElementi(testoEstratto.testo, risultato.materia);
      risultato.metadata = elementi;

      // Step 5: Genera quiz
      risultato.quiz = this.generaQuizDaElementi(elementi, risultato.materia);

      // Step 6: Valida e ottimizza
      risultato.quiz = this.validaQuiz(risultato.quiz);

    } catch (error) {
      console.error('Errore processamento immagine:', error);
      risultato.errore = error.message;
    }

    return risultato;
  }

  /**
   * 🖼️ Pre-processing immagine
   */
  async preprocessImage(imageData) {
    // Simulazione preprocessing
    // In produzione: binarizzazione, deskew, denoising, etc.
    
    const processed = {
      data: imageData,
      enhancements: [],
      quality: 0
    };

    // Simula operazioni
    processed.enhancements.push('contrast_adjusted');
    processed.enhancements.push('noise_reduced');
    processed.enhancements.push('deskewed');
    processed.quality = 0.85;

    return processed;
  }

  /**
   * 📝 Esegui OCR su immagine
   */
  async eseguiOCR(imageData) {
    // Mock OCR - in produzione usa Tesseract.js
    const mockTexts = {
      matematica: `Teorema di Pitagora
        In un triangolo rettangolo, il quadrato dell'ipotenusa è uguale alla somma dei quadrati dei cateti.
        Formula: a² + b² = c²
        Esempio: Se a = 3 e b = 4, allora c = √(9 + 16) = 5`,
      
      storia: `La Rivoluzione Francese (1789-1799)
        Cause principali:
        - Crisi finanziaria dello Stato
        - Disuguaglianze sociali tra i tre stati
        - Diffusione idee illuministe
        Eventi chiave:
        - 14 luglio 1789: Presa della Bastiglia
        - 26 agosto 1789: Dichiarazione dei diritti dell'uomo
        - 21 gennaio 1793: Esecuzione di Luigi XVI`,
      
      letteratura: `Ugo Foscolo (1778-1827)
        Opere principali:
        - "Le ultime lettere di Jacopo Ortis" (1802)
        - "I Sepolcri" (1807)
        - "Le Grazie" (incompiuta)
        Temi ricorrenti: patria, esilio, morte, bellezza, illusioni`
    };

    // Simula estrazione random
    const keys = Object.keys(mockTexts);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    return {
      testo: mockTexts[randomKey],
      confidence: 0.85 + Math.random() * 0.15,
      lingua: 'ita',
      blocchi: this.dividiInBlocchi(mockTexts[randomKey])
    };
  }

  /**
   * 📊 Dividi testo in blocchi logici
   */
  dividiInBlocchi(testo) {
    const blocchi = [];
    const righe = testo.split('\n').filter(r => r.trim());
    
    let bloccoCorrente = {
      tipo: 'testo',
      contenuto: '',
      indentazione: 0
    };

    for (const riga of righe) {
      const indent = riga.search(/\S/);
      
      // Identifica tipo blocco
      if (riga.match(/^[-•]\s/)) {
        if (bloccoCorrente.contenuto) {
          blocchi.push(bloccoCorrente);
        }
        bloccoCorrente = {
          tipo: 'lista',
          contenuto: riga.replace(/^[-•]\s/, ''),
          indentazione: indent
        };
      } else if (riga.match(/[a-z]\s*=\s*|Formula:/i)) {
        if (bloccoCorrente.contenuto) {
          blocchi.push(bloccoCorrente);
        }
        bloccoCorrente = {
          tipo: 'formula',
          contenuto: riga,
          indentazione: indent
        };
      } else if (riga.match(/^\d{1,2}\s/)) {
        if (bloccoCorrente.contenuto) {
          blocchi.push(bloccoCorrente);
        }
        bloccoCorrente = {
          tipo: 'numerato',
          contenuto: riga,
          indentazione: indent
        };
      } else {
        if (bloccoCorrente.tipo === 'testo') {
          bloccoCorrente.contenuto += (bloccoCorrente.contenuto ? ' ' : '') + riga;
        } else {
          blocchi.push(bloccoCorrente);
          bloccoCorrente = {
            tipo: 'testo',
            contenuto: riga,
            indentazione: indent
          };
        }
      }
    }
    
    if (bloccoCorrente.contenuto) {
      blocchi.push(bloccoCorrente);
    }

    return blocchi;
  }

  // ==================== IDENTIFICAZIONE MATERIA ====================

  /**
   * 🎓 Identifica materia dal testo
   */
  identificaMateria(testo) {
    const punteggi = {};
    
    // Calcola punteggio per ogni materia
    for (const [materia, patterns] of Object.entries(this.patterns)) {
      punteggi[materia] = 0;
      
      for (const [tipo, pattern] of Object.entries(patterns)) {
        const matches = testo.match(pattern);
        if (matches) {
          punteggi[materia] += matches.length * this.getPesoPattern(tipo);
        }
      }
    }

    // Trova materia con punteggio più alto
    let materiaMigliore = 'generale';
    let punteggioMax = 0;
    
    for (const [materia, punteggio] of Object.entries(punteggi)) {
      if (punteggio > punteggioMax) {
        punteggioMax = punteggio;
        materiaMigliore = materia;
      }
    }

    // Se punteggio troppo basso, ritorna generale
    return punteggioMax > 5 ? materiaMigliore : 'generale';
  }

  /**
   * ⚖️ Peso pattern per identificazione
   */
  getPesoPattern(tipo) {
    const pesi = {
      formule: 5,
      equazioni: 4,
      teoremi: 3,
      date: 3,
      autori: 3,
      opere: 2,
      elementi: 2,
      default: 1
    };
    return pesi[tipo] || pesi.default;
  }

  // ==================== ESTRAZIONE ELEMENTI ====================

  /**
   * 🔍 Estrai elementi chiave dal testo
   */
  estraiElementi(testo, materia) {
    const elementi = {
      definizioni: [],
      formule: [],
      date: [],
      persone: [],
      concetti: [],
      liste: [],
      esempi: []
    };

    // Estrazione specifica per materia
    if (materia === 'matematica' || materia === 'fisica') {
      elementi.formule = this.estraiFormule(testo);
      elementi.teoremi = this.estraiTeoremi(testo);
    }
    
    if (materia === 'storia' || materia === 'letteratura') {
      elementi.date = this.estraiDate(testo);
      elementi.persone = this.estraiPersone(testo);
    }

    // Estrazione generale
    elementi.definizioni = this.estraiDefinizioni(testo);
    elementi.liste = this.estraiListe(testo);
    elementi.esempi = this.estraiEsempi(testo);
    elementi.concetti = this.estraiConcettiChiave(testo);

    return elementi;
  }

  /**
   * 📐 Estrai formule
   */
  estraiFormule(testo) {
    const formule = [];
    const pattern = /([a-zA-Z_]\w*)\s*=\s*([^,\n]+)/g;
    let match;
    
    while ((match = pattern.exec(testo)) !== null) {
      formule.push({
        variabile: match[1],
        espressione: match[2].trim(),
        contesto: this.estraiContesto(testo, match.index)
      });
    }
    
    return formule;
  }

  /**
   * 📅 Estrai date
   */
  estraiDate(testo) {
    const date = [];
    const pattern = /(\d{1,2}\s+\w+\s+)?(1\d{3}|20\d{2})/g;
    let match;
    
    while ((match = pattern.exec(testo)) !== null) {
      const contesto = this.estraiContesto(testo, match.index);
      date.push({
        data: match[0],
        anno: match[2],
        evento: this.estraiEvento(contesto),
        contesto
      });
    }
    
    return date;
  }

  /**
   * 👤 Estrai persone
   */
  estraiPersone(testo) {
    const persone = [];
    const pattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
    let match;
    
    while ((match = pattern.exec(testo)) !== null) {
      const nome = match[1];
      // Filtra falsi positivi comuni
      if (!this.isFalsoPositivo(nome)) {
        persone.push({
          nome,
          contesto: this.estraiContesto(testo, match.index)
        });
      }
    }
    
    return persone;
  }

  /**
   * 📖 Estrai definizioni
   */
  estraiDefinizioni(testo) {
    const definizioni = [];
    const patterns = [
      /([A-Z][^:]+):\s*([^.]+\.)/g,
      /\b(\w+)\s+è\s+([^.]+\.)/gi,
      /Si definisce\s+(\w+)\s+([^.]+\.)/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(testo)) !== null) {
        definizioni.push({
          termine: match[1].trim(),
          definizione: match[2].trim()
        });
      }
    }
    
    return definizioni;
  }

  /**
   * 📝 Estrai liste
   */
  estraiListe(testo) {
    const liste = [];
    const righe = testo.split('\n');
    let listaCorrente = null;
    
    for (const riga of righe) {
      if (riga.match(/^[-•]\s+/)) {
        if (!listaCorrente) {
          listaCorrente = {
            titolo: '',
            elementi: []
          };
        }
        listaCorrente.elementi.push(riga.replace(/^[-•]\s+/, '').trim());
      } else if (listaCorrente && listaCorrente.elementi.length > 0) {
        liste.push(listaCorrente);
        listaCorrente = null;
      }
    }
    
    if (listaCorrente && listaCorrente.elementi.length > 0) {
      liste.push(listaCorrente);
    }
    
    return liste;
  }

  /**
   * 💡 Estrai esempi
   */
  estraiEsempi(testo) {
    const esempi = [];
    const patterns = [
      /Esempio:\s*([^.]+\.)/gi,
      /Ad esempio[,:]?\s*([^.]+\.)/gi,
      /Per esempio[,:]?\s*([^.]+\.)/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(testo)) !== null) {
        esempi.push({
          testo: match[1].trim(),
          tipo: 'esempio'
        });
      }
    }
    
    return esempi;
  }

  /**
   * 🔑 Estrai concetti chiave
   */
  estraiConcettiChiave(testo) {
    // Analisi frequenza parole significative (> 4 caratteri, no stopwords)
    const stopwords = ['della', 'nella', 'sulla', 'dalla', 'questo', 'quella'];
    const parole = testo.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const frequenza = {};
    
    for (const parola of parole) {
      if (!stopwords.includes(parola)) {
        frequenza[parola] = (frequenza[parola] || 0) + 1;
      }
    }
    
    // Top 10 concetti più frequenti
    return Object.entries(frequenza)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([parola, freq]) => ({
        concetto: parola,
        frequenza: freq,
        importanza: freq > 3 ? 'alta' : freq > 1 ? 'media' : 'bassa'
      }));
  }

  // ==================== GENERAZIONE QUIZ ====================

  /**
   * 🎯 Genera quiz da elementi estratti
   */
  generaQuizDaElementi(elementi, materia) {
    const quiz = [];
    
    // Quiz da definizioni
    for (const def of elementi.definizioni) {
      quiz.push(this.creaQuizDefinizione(def));
    }
    
    // Quiz da formule
    for (const formula of elementi.formule) {
      quiz.push(this.creaQuizFormula(formula));
    }
    
    // Quiz da date
    for (const data of elementi.date) {
      quiz.push(this.creaQuizData(data));
    }
    
    // Quiz da persone
    for (const persona of elementi.persone) {
      quiz.push(this.creaQuizPersona(persona));
    }
    
    // Quiz da liste
    for (const lista of elementi.liste) {
      if (lista.elementi.length >= 3) {
        quiz.push(this.creaQuizLista(lista));
      }
    }
    
    // Quiz da esempi
    for (const esempio of elementi.esempi) {
      quiz.push(this.creaQuizEsempio(esempio));
    }
    
    // Limita a max 20 quiz
    return quiz.slice(0, 20);
  }

  /**
   * 📖 Crea quiz da definizione
   */
  creaQuizDefinizione(definizione) {
    return {
      tipo: 'multipla',
      testo: `Cosa si intende per "${definizione.termine}"?`,
      opzioni: [
        { testo: definizione.definizione, corretta: true },
        { testo: this.generaDistratoreDefinizione(definizione), corretta: false },
        { testo: this.generaDistratoreDefinizione(definizione), corretta: false },
        { testo: this.generaDistratoreDefinizione(definizione), corretta: false }
      ],
      spiegazione: `${definizione.termine}: ${definizione.definizione}`,
      difficolta: 2,
      fonte: 'OCR'
    };
  }

  /**
   * 📐 Crea quiz da formula
   */
  creaQuizFormula(formula) {
    return {
      tipo: 'completamento',
      testo: `Completa la formula: ${formula.variabile} = ?`,
      rispostaCorretta: formula.espressione,
      spiegazione: `La formula completa è: ${formula.variabile} = ${formula.espressione}`,
      difficolta: 3,
      fonte: 'OCR'
    };
  }

  /**
   * 📅 Crea quiz da data
   */
  creaQuizData(data) {
    return {
      tipo: 'multipla',
      testo: `In che anno ${data.evento || 'è avvenuto questo evento'}?`,
      opzioni: [
        { testo: data.anno, corretta: true },
        { testo: (parseInt(data.anno) - 10).toString(), corretta: false },
        { testo: (parseInt(data.anno) + 5).toString(), corretta: false },
        { testo: (parseInt(data.anno) - 5).toString(), corretta: false }
      ],
      spiegazione: data.contesto,
      difficolta: 2,
      fonte: 'OCR'
    };
  }

  /**
   * 👤 Crea quiz da persona
   */
  creaQuizPersona(persona) {
    return {
      tipo: 'aperta',
      testo: `Chi era ${persona.nome}?`,
      rispostaSuggerita: persona.contesto,
      difficolta: 3,
      fonte: 'OCR'
    };
  }

  /**
   * 📝 Crea quiz da lista
   */
  creaQuizLista(lista) {
    const elementoCorretto = lista.elementi[0];
    const elementoFalso = this.generaElementoFalso(lista);
    
    return {
      tipo: 'vero_falso',
      testo: `"${elementoFalso}" fa parte di: ${lista.titolo || 'questa lista'}`,
      rispostaCorretta: false,
      spiegazione: `Gli elementi corretti sono: ${lista.elementi.join(', ')}`,
      difficolta: 2,
      fonte: 'OCR'
    };
  }

  /**
   * 💡 Crea quiz da esempio
   */
  creaQuizEsempio(esempio) {
    return {
      tipo: 'aperta',
      testo: 'Fornisci un esempio simile a questo:',
      contesto: esempio.testo,
      difficolta: 4,
      fonte: 'OCR'
    };
  }

  // ==================== UTILITY ====================

  /**
   * 📍 Estrai contesto intorno a posizione
   */
  estraiContesto(testo, posizione, caratteri = 100) {
    const inizio = Math.max(0, posizione - caratteri);
    const fine = Math.min(testo.length, posizione + caratteri);
    return testo.substring(inizio, fine).trim();
  }

  /**
   * 🎯 Estrai evento da contesto
   */
  estraiEvento(contesto) {
    // Cerca verbo principale o sostantivo rilevante
    const verbi = contesto.match(/\b(avvenne|nacque|morì|iniziò|finì|scoprì|inventò|scrisse)\b/gi);
    if (verbi && verbi.length > 0) {
      return contesto;
    }
    return 'evento storico';
  }

  /**
   * ❌ Verifica falsi positivi nomi
   */
  isFalsoPositivo(nome) {
    const falsiPositivi = [
      'La Prima', 'La Seconda', 'Il Grande', 'Gli Stati',
      'Le Nazioni', 'I Promessi', 'La Divina'
    ];
    return falsiPositivi.includes(nome);
  }

  /**
   * 🎭 Genera distrattore per definizione
   */
  generaDistratoreDefinizione(definizione) {
    const distrattori = [
      'Un concetto opposto a quello descritto',
      'Una teoria non correlata all\'argomento',
      'Una definizione parzialmente corretta ma incompleta',
      'Un\'interpretazione errata del termine'
    ];
    return distrattori[Math.floor(Math.random() * distrattori.length)];
  }

  /**
   * 🚫 Genera elemento falso per lista
   */
  generaElementoFalso(lista) {
    const falsi = [
      'Un elemento non correlato',
      'Un concetto di altra materia',
      'Una data errata',
      'Un personaggio inventato'
    ];
    return falsi[Math.floor(Math.random() * falsi.length)];
  }

  /**
   * ✅ Valida quiz generati
   */
  validaQuiz(quiz) {
    return quiz.filter(q => {
      // Verifica campi obbligatori
      if (!q.testo || !q.tipo) return false;
      
      // Verifica opzioni per multipla
      if (q.tipo === 'multipla' && (!q.opzioni || q.opzioni.length < 2)) return false;
      
      // Verifica risposta per completamento
      if (q.tipo === 'completamento' && !q.rispostaCorretta) return false;
      
      return true;
    });
  }

  // ==================== API PUBBLICA ====================

  /**
   * 📱 Scansiona da camera mobile
   */
  async scanFromCamera(stream) {
    // Cattura frame da stream
    const frame = await this.captureFrame(stream);
    
    // Processa
    return this.processaImmagine(frame);
  }

  /**
   * 📄 Scansiona PDF
   */
  async scanPDF(pdfData, pagina = 1) {
    // Estrai immagine da pagina PDF
    const pageImage = await this.extractPageImage(pdfData, pagina);
    
    // Processa
    return this.processaImmagine(pageImage);
  }

  /**
   * 🖼️ Batch processing
   */
  async processBatch(images) {
    const risultati = [];
    
    for (const img of images) {
      const risultato = await this.processaImmagine(img);
      risultati.push(risultato);
    }
    
    // Unisci quiz da tutte le immagini
    return this.mergeQuiz(risultati);
  }

  /**
   * 🔄 Merge quiz multipli
   */
  mergeQuiz(risultati) {
    const merged = {
      quiz: [],
      materie: new Set(),
      totaleImmagini: risultati.length,
      confidenceMedia: 0
    };
    
    let totaleConfidence = 0;
    
    for (const ris of risultati) {
      merged.quiz.push(...(ris.quiz || []));
      if (ris.materia) merged.materie.add(ris.materia);
      totaleConfidence += ris.confidence || 0;
    }
    
    merged.confidenceMedia = totaleConfidence / risultati.length;
    merged.materie = Array.from(merged.materie);
    
    // Rimuovi duplicati
    merged.quiz = this.rimuoviDuplicati(merged.quiz);
    
    return merged;
  }

  /**
   * 🧹 Rimuovi quiz duplicati
   */
  rimuoviDuplicati(quiz) {
    const unici = new Map();
    
    for (const q of quiz) {
      const key = q.testo.toLowerCase().trim();
      if (!unici.has(key)) {
        unici.set(key, q);
      }
    }
    
    return Array.from(unici.values());
  }

  /**
   * 📸 Mock capture frame
   */
  async captureFrame(stream) {
    // In produzione usa getUserMedia API
    return { data: 'mock_frame_data' };
  }

  /**
   * 📄 Mock extract page
   */
  async extractPageImage(pdfData, pagina) {
    // In produzione usa pdf.js
    return { data: 'mock_pdf_page_data' };
  }
}

module.exports = OCRQuizGenerator;
