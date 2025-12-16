/**
 * 🧠 SEMANTIC PARSER SEMPLIFICATO - Funziona con dati REALI
 * Parser più semplice ma efficace per estrarre fatti dai testi
 */

class SemanticParserSimple {
  constructor() {
    console.log('🧠 SemanticParserSimple inizializzato');
  }

  /**
   * 📖 Analizza testo e estrae fatti
   */
  analizzaTesto(testo) {
    const fatti = {
      date: [],
      persone: [],
      opere: [],
      luoghi: [],
      eventi: [],
      concetti: []
    };

    // 1. ESTRAI DATE (anni)
    const datePattern = /\b(1\d{3}|20\d{2})\b/g;
    let match;
    while ((match = datePattern.exec(testo)) !== null) {
      const anno = match[1];
      const contesto = this.estraiContesto(testo, match.index, 50);
      fatti.date.push({
        anno,
        contesto,
        posizione: match.index
      });
    }

    // 2. ESTRAI PERSONE (nomi propri)
    const personePattern = /\b([A-Z][a-zàèéìòù]+(?:\s+[A-Z][a-zàèéìòù]+){0,2})\b/g;
    const personeSet = new Set();
    while ((match = personePattern.exec(testo)) !== null) {
      const nome = match[1];
      // Filtra parole comuni che iniziano con maiuscola
      if (!this.isParolaComune(nome)) {
        personeSet.add(nome);
      }
    }
    fatti.persone = Array.from(personeSet).map(nome => ({
      nome,
      menzioni: this.contaMenzioni(testo, nome)
    }));

    // 3. ESTRAI OPERE (tra virgolette o con pattern specifici)
    const operePatterns = [
      /'([^']+)'/g,                    // Tra apostrofi singoli
      /"([^"]+)"/g,                    // Tra virgolette doppie
      /«([^»]+)»/g,                    // Tra virgolette francesi
      /\b(I\s+[A-Z][a-z]+|Le\s+[A-Z][a-z]+|Il\s+[A-Z][a-z]+|La\s+[A-Z][a-z]+|L'[A-Z][a-z]+)\b/g  // Articolo + Maiuscola
    ];
    
    const opereSet = new Set();
    for (const pattern of operePatterns) {
      pattern.lastIndex = 0;
      while ((match = pattern.exec(testo)) !== null) {
        const opera = match[1];
        if (opera && opera.length > 2) {
          opereSet.add(opera);
        }
      }
    }
    fatti.opere = Array.from(opereSet).map(titolo => ({
      titolo,
      contesto: this.trovaContestoOpera(testo, titolo)
    }));

    // 4. ESTRAI LUOGHI (pattern geografici)
    const luoghiPattern = /\b(?:a|in|da|per|verso)\s+([A-Z][a-zàèéìòù]+)\b/g;
    const luoghiSet = new Set();
    while ((match = luoghiPattern.exec(testo)) !== null) {
      const luogo = match[1];
      if (!this.isParolaComune(luogo)) {
        luoghiSet.add(luogo);
      }
    }
    fatti.luoghi = Array.from(luoghiSet);

    // 5. ESTRAI EVENTI (pattern con verbi d'azione)
    const eventiPattern = /\b(nacque|nasce|morì|muore|scrisse|pubblicò|compose|fondò|creò|iniziò|terminò|vinse|perse)\b[^.]+/gi;
    while ((match = eventiPattern.exec(testo)) !== null) {
      const evento = match[0];
      fatti.eventi.push({
        testo: evento.substring(0, 100),
        verbo: match[1].toLowerCase()
      });
    }

    // 6. ESTRAI CONCETTI CHIAVE (parole frequenti significative)
    const parole = testo.toLowerCase()
      .replace(/[^\wàèéìòù\s]/g, ' ')
      .split(/\s+/)
      .filter(p => p.length > 5);
    
    const frequenza = {};
    parole.forEach(parola => {
      if (!this.isStopword(parola)) {
        frequenza[parola] = (frequenza[parola] || 0) + 1;
      }
    });
    
    fatti.concetti = Object.entries(frequenza)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([parola, count]) => ({ parola, frequenza: count }));

    return fatti;
  }

  /**
   * 🔍 Estrai contesto intorno a una posizione
   */
  estraiContesto(testo, posizione, caratteri = 50) {
    const inizio = Math.max(0, posizione - caratteri);
    const fine = Math.min(testo.length, posizione + caratteri);
    return '...' + testo.substring(inizio, fine).trim() + '...';
  }

  /**
   * 🔢 Conta menzioni di un nome nel testo
   */
  contaMenzioni(testo, nome) {
    const pattern = new RegExp(`\\b${nome}\\b`, 'gi');
    const matches = testo.match(pattern);
    return matches ? matches.length : 0;
  }

  /**
   * 📚 Trova contesto di un'opera
   */
  trovaContestoOpera(testo, titolo) {
    const index = testo.indexOf(titolo);
    if (index === -1) return '';
    return this.estraiContesto(testo, index, 60);
  }

  /**
   * ❌ Verifica se è una parola comune
   */
  isParolaComune(parola) {
    const comuni = new Set([
      'Il', 'La', 'Le', 'I', 'Gli', 'Un', 'Una',
      'Questa', 'Questo', 'Quello', 'Quella',
      'Dopo', 'Prima', 'Durante', 'Mentre',
      'Inoltre', 'Tuttavia', 'Infatti', 'Quindi',
      'Milano', 'Roma', 'Napoli', 'Firenze', 'Venezia', // Città comuni
      'Francia', 'Inghilterra', 'Germania', 'Spagna', // Paesi
      'Europa', 'Italia', 'America'
    ]);
    return comuni.has(parola);
  }

  /**
   * 🚫 Verifica se è una stopword
   */
  isStopword(parola) {
    const stopwords = new Set([
      'essere', 'avere', 'fare', 'dire', 'andare',
      'potere', 'dovere', 'volere', 'sapere',
      'molto', 'poco', 'tutto', 'niente', 'qualche',
      'questo', 'quello', 'quale', 'quanto',
      'quando', 'dove', 'come', 'perché'
    ]);
    return stopwords.has(parola);
  }

  /**
   * 🎯 Genera quiz da fatti estratti
   */
  generaQuizDaFatti(fatti) {
    const quiz = [];

    // Quiz da date
    fatti.date.forEach(data => {
      quiz.push({
        tipo: 'multipla',
        testo: `In che anno ${this.estraiEventoDaContesto(data.contesto)}?`,
        rispostaCorretta: data.anno,
        opzioni: this.generaOpzioniDate(data.anno),
        fonte: 'date'
      });
    });

    // Quiz da persone
    fatti.persone.filter(p => p.menzioni > 1).forEach(persona => {
      quiz.push({
        tipo: 'aperta',
        testo: `Chi era ${persona.nome}?`,
        suggerimento: `Personaggio menzionato ${persona.menzioni} volte nel testo`,
        fonte: 'persone'
      });
    });

    // Quiz da opere
    fatti.opere.forEach(opera => {
      quiz.push({
        tipo: 'vero_falso',
        testo: `"${opera.titolo}" è un'opera menzionata nel testo`,
        rispostaCorretta: true,
        fonte: 'opere'
      });
    });

    return quiz;
  }

  /**
   * 📅 Estrai evento dal contesto
   */
  estraiEventoDaContesto(contesto) {
    // Cerca verbi chiave nel contesto
    const verbi = ['nacque', 'morì', 'scrisse', 'pubblicò', 'avvenne', 'fu'];
    for (const verbo of verbi) {
      if (contesto.toLowerCase().includes(verbo)) {
        return contesto.toLowerCase().split(verbo)[1].substring(0, 30);
      }
    }
    return 'questo evento';
  }

  /**
   * 🎲 Genera opzioni per date
   */
  generaOpzioniDate(annoCorretto) {
    const anno = parseInt(annoCorretto);
    return [
      annoCorretto,
      (anno - 5).toString(),
      (anno + 5).toString(),
      (anno + 10).toString()
    ].sort(() => Math.random() - 0.5);
  }
}

module.exports = SemanticParserSimple;
