/**
 * 🧠 ESTRAI & CREA - Sistema AI Proprietario (NO OpenAI)
 * Estrae contenuti e genera risorse educative GRATIS
 */

class EstraiCreaAIProprietario {
  constructor() {
    this.quizGenerator = null;
    this.flashcardGenerator = null;
    console.log('🧠 Estrai & Crea AI Proprietario inizializzato');
  }

  /**
   * 🚀 Inizializza generatori
   */
  initialize(quizGen, flashGen) {
    this.quizGenerator = quizGen;
    this.flashcardGenerator = flashGen;
  }

  /**
   * 📝 Processa contenuto e genera risorse
   */
  async processContent(input) {
    const result = {
      success: true,
      contenuto: null,
      quiz: [],
      flashcards: [],
      mappa: null,
      statistiche: {}
    };

    try {
      // 1. Estrai e analizza il contenuto
      const contenutoAnalizzato = this.analizzaContenuto(input);
      result.contenuto = contenutoAnalizzato;

      // 2. Genera quiz intelligenti
      if (this.quizGenerator && contenutoAnalizzato.testo) {
        const quiz = await this.generaQuizDaTesto(contenutoAnalizzato);
        result.quiz = quiz;
      }

      // 3. Genera flashcards
      if (this.flashcardGenerator && contenutoAnalizzato.concetti) {
        const flashcards = this.generaFlashcardsDaConcetti(contenutoAnalizzato.concetti);
        result.flashcards = flashcards;
      }

      // 4. Genera mappa concettuale
      result.mappa = this.generaMappaConceptuale(contenutoAnalizzato);

      // 5. Statistiche
      result.statistiche = {
        caratteri: contenutoAnalizzato.testo?.length || 0,
        parole: contenutoAnalizzato.testo?.split(' ').length || 0,
        concetti: contenutoAnalizzato.concetti?.length || 0,
        quiz: result.quiz.length,
        flashcards: result.flashcards.length
      };

    } catch (error) {
      result.success = false;
      result.error = error.message;
    }

    return result;
  }

  /**
   * 🔍 Analizza contenuto
   */
  analizzaContenuto(input) {
    const testo = typeof input === 'string' ? input : input.text || input.content || '';
    
    // Estrai concetti chiave
    const concetti = this.estraiConcettiChiave(testo);
    
    // Estrai argomento principale
    const argomento = this.identificaArgomento(testo);
    
    // Estrai entità (persone, date, luoghi)
    const entita = this.estraiEntita(testo);

    return {
      testo,
      argomento,
      concetti,
      entita,
      riassunto: this.generaRiassunto(testo),
      difficolta: this.calcolaDifficolta(testo)
    };
  }

  /**
   * 🎯 Estrai concetti chiave
   */
  estraiConcettiChiave(testo) {
    const concetti = [];
    
    // Pattern per identificare concetti importanti
    const patterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+è\s+([^.]+)/g, // X è Y
      /\b(?:importante|fondamentale|essenziale|cruciale)\s+([^.]+)/gi,
      /\b(?:teoria|principio|legge|concetto)\s+(?:di|del|della)\s+([^.]+)/gi,
      /\b([A-Z][a-z]+)\s+(?:definì|teorizzò|scoprì|inventò)\s+([^.]+)/g
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(testo)) !== null) {
        const concetto = match[1] || match[0];
        if (concetto.length > 3 && concetto.length < 100) {
          concetti.push({
            termine: concetto.trim(),
            contesto: testo.substring(
              Math.max(0, match.index - 50),
              Math.min(testo.length, match.index + 150)
            )
          });
        }
      }
    }

    // Rimuovi duplicati
    const concettiUnici = [];
    const terminiVisti = new Set();
    
    for (const c of concetti) {
      const termineNorm = c.termine.toLowerCase();
      if (!terminiVisti.has(termineNorm)) {
        terminiVisti.add(termineNorm);
        concettiUnici.push(c);
      }
    }

    return concettiUnici.slice(0, 20); // Max 20 concetti
  }

  /**
   * 📚 Identifica argomento principale
   */
  identificaArgomento(testo) {
    // Cerca keywords comuni per materia
    const materie = {
      italiano: ['letteratura', 'poesia', 'romanzo', 'novella', 'autore', 'poeta'],
      storia: ['guerra', 'rivoluzione', 'impero', 'repubblica', 'sovrano', 'battaglia'],
      filosofia: ['filosofo', 'pensiero', 'esistenza', 'essere', 'metafisica', 'etica'],
      matematica: ['equazione', 'funzione', 'derivata', 'integrale', 'teorema', 'limite'],
      fisica: ['forza', 'energia', 'velocità', 'accelerazione', 'onda', 'particella'],
      scienze: ['cellula', 'molecola', 'organismo', 'ecosistema', 'DNA', 'evoluzione']
    };

    let bestMatch = { materia: 'generale', score: 0 };
    
    for (const [materia, keywords] of Object.entries(materie)) {
      let score = 0;
      for (const keyword of keywords) {
        const regex = new RegExp(keyword, 'gi');
        const matches = testo.match(regex);
        if (matches) score += matches.length;
      }
      
      if (score > bestMatch.score) {
        bestMatch = { materia, score };
      }
    }

    // Cerca titolo o prima frase
    const primaFrase = testo.split(/[.!?]/)[0].trim();
    
    return {
      materia: bestMatch.materia,
      titolo: primaFrase.length < 100 ? primaFrase : 'Argomento non specificato',
      confidence: bestMatch.score > 5 ? 'alta' : bestMatch.score > 2 ? 'media' : 'bassa'
    };
  }

  /**
   * 👥 Estrai entità (persone, date, luoghi)
   */
  estraiEntita(testo) {
    const entita = {
      persone: [],
      date: [],
      luoghi: []
    };

    // Persone (nomi propri)
    const nomiPropri = testo.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g) || [];
    entita.persone = [...new Set(nomiPropri)]
      .filter(nome => nome.length > 3 && !['Questa', 'Quando', 'Dove', 'Come'].includes(nome))
      .slice(0, 10);

    // Date
    const dateMatches = testo.match(/\b(1\d{3}|20\d{2})\b/g) || [];
    entita.date = [...new Set(dateMatches)];

    // Luoghi (pattern comuni)
    const luoghiPattern = /\b(?:a|in|da|per)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
    let match;
    const luoghiSet = new Set();
    while ((match = luoghiPattern.exec(testo)) !== null) {
      if (match[1].length > 3) {
        luoghiSet.add(match[1]);
      }
    }
    entita.luoghi = Array.from(luoghiSet).slice(0, 10);

    return entita;
  }

  /**
   * 📄 Genera riassunto
   */
  generaRiassunto(testo) {
    if (testo.length < 200) return testo;
    
    // Prendi le prime 3 frasi
    const frasi = testo.split(/[.!?]/).filter(f => f.trim().length > 20);
    const riassunto = frasi.slice(0, 3).join('. ') + '.';
    
    return riassunto.substring(0, 500);
  }

  /**
   * 📊 Calcola difficoltà
   */
  calcolaDifficolta(testo) {
    const parole = testo.split(/\s+/);
    const paroleLunghe = parole.filter(p => p.length > 10).length;
    const frasiComplesse = testo.split(/[.!?]/).filter(f => f.split(',').length > 3).length;
    
    const complessita = (paroleLunghe / parole.length) * 100 + frasiComplesse;
    
    if (complessita > 20) return 'avanzato';
    if (complessita > 10) return 'intermedio';
    return 'base';
  }

  /**
   * 📝 Genera quiz dal testo
   */
  async generaQuizDaTesto(contenutoAnalizzato) {
    const quiz = [];
    const { testo, concetti, entita, argomento } = contenutoAnalizzato;

    // Quiz sui concetti
    for (const concetto of concetti.slice(0, 3)) {
      quiz.push({
        domanda: `Cosa si intende per ${concetto.termine}?`,
        tipo: 'concetto',
        risposta: concetto.contesto,
        difficolta: 'intermedio',
        materia: argomento.materia
      });
    }

    // Quiz sulle persone
    for (const persona of entita.persone.slice(0, 2)) {
      const contesto = this.trovContesto(testo, persona);
      if (contesto) {
        quiz.push({
          domanda: `Chi è ${persona}?`,
          tipo: 'persona',
          risposta: contesto,
          difficolta: 'facile',
          materia: argomento.materia
        });
      }
    }

    // Quiz sulle date
    for (const data of entita.date.slice(0, 2)) {
      const contesto = this.trovContesto(testo, data);
      if (contesto) {
        quiz.push({
          domanda: `Cosa accadde nel ${data}?`,
          tipo: 'data',
          risposta: contesto,
          difficolta: 'medio',
          materia: argomento.materia
        });
      }
    }

    return quiz;
  }

  /**
   * 🃏 Genera flashcards dai concetti
   */
  generaFlashcardsDaConcetti(concetti) {
    return concetti.slice(0, 10).map((concetto, idx) => ({
      id: idx + 1,
      fronte: concetto.termine,
      retro: concetto.contesto,
      difficolta: 'intermedio',
      ripetizioni: 0,
      prossima_revisione: new Date()
    }));
  }

  /**
   * 🗺️ Genera mappa concettuale
   */
  generaMappaConceptuale(contenutoAnalizzato) {
    const { argomento, concetti, entita } = contenutoAnalizzato;
    
    const nodi = [
      {
        id: 'root',
        label: argomento.titolo,
        tipo: 'centrale',
        livello: 0
      }
    ];

    const collegamenti = [];
    let nodeId = 1;

    // Aggiungi concetti come nodi
    for (const concetto of concetti.slice(0, 8)) {
      nodi.push({
        id: `node${nodeId}`,
        label: concetto.termine,
        tipo: 'concetto',
        livello: 1
      });
      
      collegamenti.push({
        from: 'root',
        to: `node${nodeId}`,
        label: 'include'
      });
      
      nodeId++;
    }

    // Aggiungi persone importanti
    for (const persona of entita.persone.slice(0, 3)) {
      nodi.push({
        id: `node${nodeId}`,
        label: persona,
        tipo: 'persona',
        livello: 2
      });
      
      collegamenti.push({
        from: 'root',
        to: `node${nodeId}`,
        label: 'correlato'
      });
      
      nodeId++;
    }

    return {
      nodi,
      collegamenti,
      metadata: {
        materia: argomento.materia,
        difficolta: contenutoAnalizzato.difficolta,
        totale_nodi: nodi.length
      }
    };
  }

  /**
   * 🔍 Trova contesto per una parola
   */
  trovContesto(testo, parola) {
    const indice = testo.indexOf(parola);
    if (indice === -1) return null;
    
    const inizio = Math.max(0, indice - 100);
    const fine = Math.min(testo.length, indice + 200);
    
    return testo.substring(inizio, fine).trim();
  }
}

module.exports = EstraiCreaAIProprietario;
