/**
 * ✅ QUESTION VALIDATOR - Validatore Qualità Domande
 * Garantisce che ogni domanda generata rispetti standard universitari
 * 
 * Criteri di validazione:
 * 1. CORRETTEZZA GRAMMATICALE: Italiano corretto
 * 2. CHIAREZZA: Domanda comprensibile e non ambigua
 * 3. DISTRATTORI: Plausibili ma chiaramente errati
 * 4. DIFFICOLTA: Appropriata al livello dichiarato
 * 5. PEDAGOGIA: Valore educativo della domanda
 * 6. UNICITA: Non duplicata nel set
 */

class QuestionValidator {
  constructor() {
    // Pesi per il calcolo dello score finale
    this.pesi = {
      grammatica: 0.20,
      chiarezza: 0.20,
      distrattori: 0.25,
      difficolta: 0.15,
      pedagogia: 0.15,
      unicita: 0.05
    };

    // Soglie per accettazione
    this.soglie = {
      minima: 0.60,        // Sotto = domanda scartata
      accettabile: 0.70,   // Domanda base
      buona: 0.80,         // Domanda di qualità
      eccellente: 0.90     // Domanda da esame
    };

    // Pattern per validazione grammaticale italiana
    this.patternGrammaticali = this.inizializzaPatternGrammaticali();

    // Domande già generate (per unicità)
    this.domandeGenerate = new Set();

    console.log('✅ QuestionValidator inizializzato');
  }

  // ==================== PATTERN GRAMMATICALI ====================

  inizializzaPatternGrammaticali() {
    return {
      // Errori comuni
      erroriArticoli: [
        /\b(il|lo|la|i|gli|le) (il|lo|la|i|gli|le)\b/gi,  // Articoli doppi
        /\b(un|uno|una) (il|lo|la)\b/gi,                   // Articoli misti
        /\bil [aeiou]/gi,                                   // il + vocale (dovrebbe essere l')
        /\blo [^aeiousxyzgn]/gi                             // lo + consonante semplice
      ],
      erroriPreposizioni: [
        /\ba il\b/gi,     // dovrebbe essere "al"
        /\bdi il\b/gi,    // dovrebbe essere "del"
        /\bda il\b/gi,    // dovrebbe essere "dal"
        /\bin il\b/gi,    // dovrebbe essere "nel"
        /\bsu il\b/gi,    // dovrebbe essere "sul"
        /\ba lo\b/gi,     // dovrebbe essere "allo"
        /\bdi lo\b/gi     // dovrebbe essere "dello"
      ],
      erroriConcordanza: [
        /\b(il|lo|un|uno)\s+\w+[ae]\b/gi,   // Maschile + femminile
        /\b(la|una)\s+\w+[oi]\b/gi,         // Femminile + maschile (attenzione ai falsi positivi)
        /\b(i|gli)\s+\w+[ae]\b/gi,          // Plurale masc + sing/femm
        /\b(le)\s+\w+[oi]\b/gi              // Plurale femm + masc
      ],
      // Pattern per frasi mal formate
      fraseMalFormate: [
        /^[a-z]/,                           // Inizia con minuscola
        /\?[^"]$/,                          // Punto interrogativo non alla fine
        /\.\?/,                             // Punto + interrogativo
        /\s{2,}/g,                          // Spazi multipli
        /[,;:]\s*$/,                        // Termina con punteggiatura errata
        /\(\s*\)/                           // Parentesi vuote
      ],
      // Parole da evitare nelle domande
      paroleProblematiche: [
        /\bovviamente\b/gi,
        /\bchiaramente\b/gi,
        /\bnaturalmente\b/gi,
        /\bsicuramente\b/gi,
        /\bmai\b.*\bsempre\b/gi,            // Contraddizioni
        /\btutti\b.*\bnessuno\b/gi
      ]
    };
  }

  // ==================== VALIDAZIONE PRINCIPALE ====================

  /**
   * 🔍 Valida una domanda completa
   * @param {Object} domanda - Domanda da validare
   * @returns {Object} - Risultato validazione con score e feedback
   */
  valida(domanda) {
    const risultato = {
      valida: false,
      score: 0,
      livelloQualita: 'insufficiente',
      problemi: [],
      suggerimenti: [],
      dettagli: {}
    };

    // 1. Validazione grammaticale
    const grammatica = this.validaGrammatica(domanda);
    risultato.dettagli.grammatica = grammatica;

    // 2. Validazione chiarezza
    const chiarezza = this.validaChiarezza(domanda);
    risultato.dettagli.chiarezza = chiarezza;

    // 3. Validazione distrattori
    const distrattori = this.validaDistractors(domanda);
    risultato.dettagli.distrattori = distrattori;

    // 4. Validazione difficoltà
    const difficolta = this.validaDifficolta(domanda);
    risultato.dettagli.difficolta = difficolta;

    // 5. Validazione pedagogica
    const pedagogia = this.validaPedagogia(domanda);
    risultato.dettagli.pedagogia = pedagogia;

    // 6. Validazione unicità
    const unicita = this.validaUnicita(domanda);
    risultato.dettagli.unicita = unicita;

    // Calcola score pesato
    risultato.score = 
      grammatica.score * this.pesi.grammatica +
      chiarezza.score * this.pesi.chiarezza +
      distrattori.score * this.pesi.distrattori +
      difficolta.score * this.pesi.difficolta +
      pedagogia.score * this.pesi.pedagogia +
      unicita.score * this.pesi.unicita;

    // Raccogli problemi
    risultato.problemi = [
      ...grammatica.problemi,
      ...chiarezza.problemi,
      ...distrattori.problemi,
      ...difficolta.problemi,
      ...pedagogia.problemi,
      ...unicita.problemi
    ];

    // Raccogli suggerimenti
    risultato.suggerimenti = [
      ...grammatica.suggerimenti,
      ...chiarezza.suggerimenti,
      ...distrattori.suggerimenti,
      ...difficolta.suggerimenti,
      ...pedagogia.suggerimenti,
      ...unicita.suggerimenti
    ];

    // Determina livello qualità
    if (risultato.score >= this.soglie.eccellente) {
      risultato.livelloQualita = 'eccellente';
    } else if (risultato.score >= this.soglie.buona) {
      risultato.livelloQualita = 'buona';
    } else if (risultato.score >= this.soglie.accettabile) {
      risultato.livelloQualita = 'accettabile';
    } else if (risultato.score >= this.soglie.minima) {
      risultato.livelloQualita = 'sufficiente';
    }

    risultato.valida = risultato.score >= this.soglie.minima;

    // Registra domanda se valida
    if (risultato.valida) {
      this.registraDomanda(domanda);
    }

    return risultato;
  }

  // ==================== VALIDAZIONI SPECIFICHE ====================

  /**
   * 📝 Valida grammatica italiana
   */
  validaGrammatica(domanda) {
    const risultato = {
      score: 1.0,
      problemi: [],
      suggerimenti: []
    };

    const testo = domanda.testo || domanda.template || '';

    // Controlla pattern errori
    for (const pattern of this.patternGrammaticali.erroriArticoli) {
      if (pattern.test(testo)) {
        risultato.score -= 0.2;
        risultato.problemi.push('Possibile errore di articoli');
        risultato.suggerimenti.push('Verifica l\'uso degli articoli determinativi');
      }
    }

    for (const pattern of this.patternGrammaticali.erroriPreposizioni) {
      if (pattern.test(testo)) {
        risultato.score -= 0.2;
        risultato.problemi.push('Preposizione articolata errata');
        risultato.suggerimenti.push('Usa le preposizioni articolate (al, del, nel...)');
      }
    }

    for (const pattern of this.patternGrammaticali.fraseMalFormate) {
      if (pattern.test(testo)) {
        risultato.score -= 0.15;
        risultato.problemi.push('Formattazione frase non corretta');
        risultato.suggerimenti.push('Controlla punteggiatura e maiuscole');
      }
    }

    // Controlla lunghezza
    if (testo.length < 20) {
      risultato.score -= 0.3;
      risultato.problemi.push('Domanda troppo breve');
      risultato.suggerimenti.push('Espandi la domanda per maggiore chiarezza');
    }

    if (testo.length > 300) {
      risultato.score -= 0.2;
      risultato.problemi.push('Domanda troppo lunga');
      risultato.suggerimenti.push('Semplifica il testo mantenendo la precisione');
    }

    // Controlla terminazione
    if (!testo.trim().endsWith('?') && !testo.trim().endsWith(':')) {
      risultato.score -= 0.1;
      risultato.problemi.push('La domanda dovrebbe terminare con ? o :');
      risultato.suggerimenti.push('Aggiungi il punto interrogativo finale');
    }

    risultato.score = Math.max(0, risultato.score);
    return risultato;
  }

  /**
   * 🔎 Valida chiarezza della domanda
   */
  validaChiarezza(domanda) {
    const risultato = {
      score: 1.0,
      problemi: [],
      suggerimenti: []
    };

    const testo = domanda.testo || domanda.template || '';

    // Controlla parole problematiche
    for (const pattern of this.patternGrammaticali.paroleProblematiche) {
      if (pattern.test(testo)) {
        risultato.score -= 0.15;
        risultato.problemi.push('Uso di parole che possono creare ambiguità');
        risultato.suggerimenti.push('Evita avverbi valutativi (ovviamente, chiaramente...)');
      }
    }

    // Controlla che ci sia un chiaro oggetto della domanda
    const paroleDomanda = ['chi', 'cosa', 'dove', 'quando', 'quale', 'perché', 'come'];
    const iniziaConParolaDomanda = paroleDomanda.some(p => 
      testo.toLowerCase().trim().startsWith(p)
    );
    
    if (!iniziaConParolaDomanda && !testo.includes(':')) {
      risultato.score -= 0.2;
      risultato.suggerimenti.push('La domanda dovrebbe iniziare con una parola interrogativa');
    }

    // Controlla presenza di elementi vaghi
    const elementiVaghi = /\b(qualcosa|qualcuno|alcune|certi|vari)\b/gi;
    if (elementiVaghi.test(testo)) {
      risultato.score -= 0.1;
      risultato.problemi.push('Elementi vaghi nella domanda');
      risultato.suggerimenti.push('Sii più specifico nella formulazione');
    }

    // Controlla presenza di negazioni doppie
    const negazioniDoppie = /\bnon\b.*\bnon\b/gi;
    if (negazioniDoppie.test(testo)) {
      risultato.score -= 0.15;
      risultato.problemi.push('Possibile doppia negazione');
      risultato.suggerimenti.push('Evita le doppie negazioni che creano confusione');
    }

    risultato.score = Math.max(0, risultato.score);
    return risultato;
  }

  /**
   * 🎯 Valida qualità dei distrattori
   */
  validaDistractors(domanda) {
    const risultato = {
      score: 1.0,
      problemi: [],
      suggerimenti: []
    };

    const opzioni = domanda.opzioni || [];
    const rispostaCorretta = domanda.rispostaCorretta;

    // Verifica numero opzioni
    if (opzioni.length < 3) {
      risultato.score -= 0.4;
      risultato.problemi.push('Troppo poche opzioni di risposta');
      risultato.suggerimenti.push('Aggiungi almeno 4 opzioni per una domanda valida');
    }

    if (opzioni.length > 6) {
      risultato.score -= 0.1;
      risultato.suggerimenti.push('Considera di ridurre le opzioni a 4-5');
    }

    // Verifica che i distrattori siano diversi tra loro
    const testiOpzioni = opzioni.map(o => (o.testo || o).toString().toLowerCase().trim());
    const testiUnici = new Set(testiOpzioni);
    
    if (testiUnici.size !== testiOpzioni.length) {
      risultato.score -= 0.3;
      risultato.problemi.push('Opzioni duplicate');
      risultato.suggerimenti.push('Rimuovi le opzioni duplicate');
    }

    // Verifica lunghezza simile delle opzioni
    const lunghezze = testiOpzioni.map(t => t.length);
    const mediaLunghezza = lunghezze.reduce((a, b) => a + b, 0) / lunghezze.length;
    const varianza = lunghezze.reduce((acc, l) => acc + Math.pow(l - mediaLunghezza, 2), 0) / lunghezze.length;
    
    if (varianza > 500) { // Varianza alta = lunghezze molto diverse
      risultato.score -= 0.1;
      risultato.suggerimenti.push('Le opzioni hanno lunghezze molto diverse');
    }

    // Verifica che la risposta corretta esista
    if (rispostaCorretta === undefined || rispostaCorretta === null) {
      risultato.score -= 0.5;
      risultato.problemi.push('Risposta corretta non definita');
    }

    // Verifica che i distrattori siano plausibili
    // (questa è una verifica euristica basata sulla similarità)
    for (let i = 0; i < opzioni.length; i++) {
      if (i === rispostaCorretta) continue;
      
      const opzione = (opzioni[i].testo || opzioni[i]).toString();
      
      // Opzioni troppo corte sono sospette
      if (opzione.length < 3) {
        risultato.score -= 0.1;
        risultato.problemi.push(`Opzione ${i + 1} troppo breve`);
      }
      
      // Opzioni con pattern sospetti
      if (/^(nessuno|tutti|sempre|mai)$/i.test(opzione)) {
        risultato.score -= 0.05;
        risultato.suggerimenti.push('Evita opzioni assolute come "nessuno", "sempre"');
      }
    }

    risultato.score = Math.max(0, risultato.score);
    return risultato;
  }

  /**
   * 📊 Valida appropriatezza difficoltà
   */
  validaDifficolta(domanda) {
    const risultato = {
      score: 1.0,
      problemi: [],
      suggerimenti: []
    };

    const livello = domanda.livello || domanda.livelloDifficolta || 1;
    const testo = domanda.testo || domanda.template || '';

    // Indicatori di complessità
    const indicatoriComplessi = {
      // Livelli alti dovrebbero avere questi
      analisi: /\b(analizza|confronta|distingui|relazion|scomponi)\b/gi,
      valutazione: /\b(valuta|giudica|critica|argomenta|dimostri)\b/gi,
      sintesi: /\b(sintetizza|combina|crea|elabora|proponi)\b/gi
    };

    const indicatoriSemplici = {
      // Livelli bassi dovrebbero avere questi
      ricordo: /\b(chi|cosa|quando|dove|quale)\b/gi,
      comprensione: /\b(spiega|descrivi|riassumi|significa)\b/gi
    };

    // Conta indicatori
    let complessiTrovati = 0;
    let sempliciTrovati = 0;

    for (const [tipo, pattern] of Object.entries(indicatoriComplessi)) {
      if (pattern.test(testo)) complessiTrovati++;
    }

    for (const [tipo, pattern] of Object.entries(indicatoriSemplici)) {
      if (pattern.test(testo)) sempliciTrovati++;
    }

    // Verifica coerenza
    if (livello >= 4 && complessiTrovati === 0 && sempliciTrovati > 0) {
      risultato.score -= 0.2;
      risultato.problemi.push('Domanda dichiarata complessa ma con formulazione semplice');
      risultato.suggerimenti.push('Alza il livello della domanda o riformula');
    }

    if (livello <= 2 && complessiTrovati > 0 && sempliciTrovati === 0) {
      risultato.score -= 0.2;
      risultato.problemi.push('Domanda dichiarata semplice ma con formulazione complessa');
      risultato.suggerimenti.push('Abbassa il livello dichiarato');
    }

    risultato.score = Math.max(0, risultato.score);
    return risultato;
  }

  /**
   * 📚 Valida valore pedagogico
   */
  validaPedagogia(domanda) {
    const risultato = {
      score: 1.0,
      problemi: [],
      suggerimenti: []
    };

    // Verifica presenza di spiegazione
    if (!domanda.spiegazione || domanda.spiegazione.length < 50) {
      risultato.score -= 0.2;
      risultato.suggerimenti.push('Aggiungi una spiegazione più dettagliata');
    }

    // Verifica che non sia una domanda "trick"
    const testo = domanda.testo || domanda.template || '';
    const patternTrick = /\b(non|tranne|eccetto|escluso)\b.*\?$/gi;
    
    if (patternTrick.test(testo)) {
      risultato.score -= 0.1;
      risultato.suggerimenti.push('Le domande con negazioni possono essere ingannevoli');
    }

    // Verifica che la domanda testi conoscenza reale, non memoria di dettagli
    const testoLower = testo.toLowerCase();
    const dettagliInutili = [
      'colore', 'numero di pagine', 'peso', 'altezza'
    ];
    
    for (const dettaglio of dettagliInutili) {
      if (testoLower.includes(dettaglio)) {
        risultato.score -= 0.15;
        risultato.problemi.push('La domanda potrebbe testare dettagli poco rilevanti');
      }
    }

    // Bonus per domande che collegano concetti
    const collegamenti = /\b(relazione|collegamento|influenza|causa|effetto|confronto)\b/gi;
    if (collegamenti.test(testo)) {
      risultato.score = Math.min(1.0, risultato.score + 0.1);
    }

    risultato.score = Math.max(0, risultato.score);
    return risultato;
  }

  /**
   * 🔄 Valida unicità della domanda
   */
  validaUnicita(domanda) {
    const risultato = {
      score: 1.0,
      problemi: [],
      suggerimenti: []
    };

    const hash = this.generaHashDomanda(domanda);
    
    if (this.domandeGenerate.has(hash)) {
      risultato.score = 0;
      risultato.problemi.push('Domanda già presente nel set');
      risultato.suggerimenti.push('Genera una domanda diversa');
    }

    return risultato;
  }

  // ==================== UTILITY ====================

  /**
   * 🔐 Genera hash univoco per la domanda
   */
  generaHashDomanda(domanda) {
    const testo = (domanda.testo || domanda.template || '').toLowerCase().trim();
    const risposta = (domanda.rispostaCorretta || '').toString().toLowerCase().trim();
    
    // Hash semplice basato su contenuto
    let hash = 0;
    const str = testo + '|' + risposta;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return hash.toString(36);
  }

  /**
   * 📝 Registra una domanda come generata
   */
  registraDomanda(domanda) {
    const hash = this.generaHashDomanda(domanda);
    this.domandeGenerate.add(hash);
  }

  /**
   * 🧹 Reset domande registrate
   */
  reset() {
    this.domandeGenerate.clear();
  }

  /**
   * 🔧 Correggi automaticamente problemi comuni
   */
  correggiAutomaticamente(domanda) {
    let testo = domanda.testo || domanda.template || '';
    let modificato = false;

    // Correggi maiuscola iniziale
    if (/^[a-z]/.test(testo)) {
      testo = testo.charAt(0).toUpperCase() + testo.slice(1);
      modificato = true;
    }

    // Rimuovi spazi multipli
    if (/\s{2,}/.test(testo)) {
      testo = testo.replace(/\s{2,}/g, ' ');
      modificato = true;
    }

    // Aggiungi punto interrogativo se mancante
    if (!testo.trim().endsWith('?') && !testo.trim().endsWith(':')) {
      testo = testo.trim() + '?';
      modificato = true;
    }

    // Correggi preposizioni articolate
    const correzioni = {
      'a il ': 'al ',
      'di il ': 'del ',
      'da il ': 'dal ',
      'in il ': 'nel ',
      'su il ': 'sul ',
      'a lo ': 'allo ',
      'di lo ': 'dello ',
      ' il a': ' alla',
      ' il e': " all'e"
    };

    for (const [errato, corretto] of Object.entries(correzioni)) {
      if (testo.includes(errato)) {
        testo = testo.replace(new RegExp(errato, 'gi'), corretto);
        modificato = true;
      }
    }

    if (modificato) {
      if (domanda.testo) domanda.testo = testo;
      if (domanda.template) domanda.template = testo;
    }

    return { domanda, modificato };
  }

  /**
   * 📊 Genera report qualità per un set di domande
   */
  generaReport(domande) {
    const report = {
      totale: domande.length,
      valide: 0,
      scartate: 0,
      distribuzioneLivelli: {
        insufficiente: 0,
        sufficiente: 0,
        accettabile: 0,
        buona: 0,
        eccellente: 0
      },
      problemiPiuComuni: {},
      scoreMedia: 0,
      dettagli: []
    };

    let sommaScore = 0;

    for (const domanda of domande) {
      const validazione = this.valida(domanda);
      sommaScore += validazione.score;

      if (validazione.valida) {
        report.valide++;
      } else {
        report.scartate++;
      }

      report.distribuzioneLivelli[validazione.livelloQualita]++;

      for (const problema of validazione.problemi) {
        report.problemiPiuComuni[problema] = (report.problemiPiuComuni[problema] || 0) + 1;
      }

      report.dettagli.push({
        domanda: domanda.testo || domanda.template,
        score: validazione.score,
        livello: validazione.livelloQualita,
        problemi: validazione.problemi.length
      });
    }

    report.scoreMedia = sommaScore / domande.length;

    // Ordina problemi per frequenza
    report.problemiPiuComuni = Object.entries(report.problemiPiuComuni)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});

    return report;
  }
}

module.exports = QuestionValidator;
