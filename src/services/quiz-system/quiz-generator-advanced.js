/**
 * 🚀 QUIZ GENERATOR ADVANCED - Generatore Quiz di Alta Qualità
 * Integra tutti i componenti avanzati del sistema
 */

const EntityExtractor = require('./entity-extractor');
const DistractorGenerator = require('./distractor-generator');
const KnowledgeGraph = require('./knowledge-graph');
const QuestionValidator = require('./question-validator');
const { QuestionTemplates, getTemplatesByDifficulty } = require('./question-templates');

class QuizGeneratorAdvanced {
  constructor(options = {}) {
    this.extractor = new EntityExtractor();
    this.distractorGen = new DistractorGenerator();
    this.graph = new KnowledgeGraph();
    this.validator = new QuestionValidator();
    
    this.config = {
      maxQuizPerTipo: options.maxQuizPerTipo || 3,
      livelloMinimo: options.livelloMinimo || 1,
      livelloMassimo: options.livelloMassimo || 4,
      qualitaMinima: options.qualitaMinima || 0.7
    };
    
    console.log('🚀 QuizGeneratorAdvanced inizializzato');
  }

  /**
   * 📚 Genera quiz completi da un sottoargomento
   */
  async generaQuiz(sottoargomento, maxQuiz = 12) {
    const testo = sottoargomento.riassunto || sottoargomento.contenuto || '';
    
    if (!testo || testo.length < 100) {
      return [];
    }

    // 1. ESTRAZIONE ENTITÀ MIGLIORATA
    const entita = {
      persone: this.extractor.estraiPersone(testo),
      opere: this.extractor.estraiOpere(testo),
      luoghi: this.extractor.estraiLuoghi(testo),
      date: this.extractor.estraiDate(testo)
    };

    // 2. COSTRUZIONE KNOWLEDGE GRAPH
    this.costruisciGrafo(entita, testo);

    // 3. GENERAZIONE QUIZ MULTILIVELLO
    let quiz = [];
    
    // LIVELLO 1: CONOSCENZA (30% dei quiz)
    quiz.push(...this.generaQuizConoscenza(entita, Math.floor(maxQuiz * 0.3)));
    
    // LIVELLO 2: COMPRENSIONE (30% dei quiz)
    quiz.push(...this.generaQuizComprensione(entita, testo, Math.floor(maxQuiz * 0.3)));
    
    // LIVELLO 3: APPLICAZIONE (20% dei quiz)
    quiz.push(...this.generaQuizApplicazione(entita, testo, Math.floor(maxQuiz * 0.2)));
    
    // LIVELLO 4: ANALISI (20% dei quiz)
    quiz.push(...this.generaQuizAnalisi(entita, testo, Math.ceil(maxQuiz * 0.2)));

    // 4. VALIDAZIONE E SELEZIONE
    quiz = this.validaESeleziona(quiz, maxQuiz);

    // 5. ARRICCHIMENTO FINALE
    quiz = this.arricchisciQuiz(quiz, sottoargomento);

    return quiz;
  }

  // ==================== LIVELLO 1: CONOSCENZA ====================

  /**
   * 📖 Quiz di conoscenza (fatti, date, nomi)
   */
  generaQuizConoscenza(entita, maxQuiz) {
    const quiz = [];

    // Quiz sulle DATE
    entita.date.slice(0, Math.ceil(maxQuiz / 3)).forEach((data, idx) => {
      const distrattori = this.distractorGen.generaDistractors(
        { rispostaCorretta: data.anno },
        'data',
        3
      );
      
      quiz.push({
        id: `CONOS_DATA_${idx}`,
        tipo: 'multipla',
        livello: 1,
        testo: `In che anno ${data.evento.descrizione}?`,
        opzioni: this.mescolaOpzioni([
          { testo: data.anno, corretta: true },
          ...distrattori.map(d => ({ testo: d.valore, corretta: false }))
        ]),
        spiegazione: this.generaSpiegazione('data', data),
        difficolta: 1,
        argomento: 'Date storiche',
        bloom: 'CONOSCENZA'
      });
    });

    // Quiz sulle PERSONE
    entita.persone.slice(0, Math.ceil(maxQuiz / 3)).forEach((persona, idx) => {
      const distrattori = this.distractorGen.generaDistractors(
        { rispostaCorretta: persona.nome },
        'persona',
        3
      );
      
      quiz.push({
        id: `CONOS_PERS_${idx}`,
        tipo: 'multipla',
        livello: 1,
        testo: `Chi era ${persona.nome}?`,
        opzioni: this.mescolaOpzioni([
          { testo: this.descriviPersona(persona), corretta: true },
          ...distrattori.map(d => ({ testo: d.valore, corretta: false }))
        ]),
        spiegazione: this.generaSpiegazione('persona', persona),
        difficolta: 1,
        argomento: 'Personaggi',
        bloom: 'CONOSCENZA'
      });
    });

    // Quiz sulle OPERE
    entita.opere.slice(0, Math.ceil(maxQuiz / 3)).forEach((opera, idx) => {
      if (opera.autore) {
        quiz.push({
          id: `CONOS_OPERA_${idx}`,
          tipo: 'multipla',
          livello: 1,
          testo: `Chi scrisse "${opera.titolo}"?`,
          opzioni: this.mescolaOpzioni([
            { testo: opera.autore, corretta: true },
            ...this.distractorGen.generaDistractors(
              { rispostaCorretta: opera.autore },
              'autore',
              3
            ).map(d => ({ testo: d.valore, corretta: false }))
          ]),
          spiegazione: this.generaSpiegazione('opera', opera),
          difficolta: 1,
          argomento: 'Opere letterarie',
          bloom: 'CONOSCENZA'
        });
      }
    });

    return quiz;
  }

  // ==================== LIVELLO 2: COMPRENSIONE ====================

  /**
   * 🧠 Quiz di comprensione (significati, interpretazioni)
   */
  generaQuizComprensione(entita, testo, maxQuiz) {
    const quiz = [];
    
    // PERCHÉ domande
    const eventiImportanti = this.estraiEventiImportanti(testo);
    eventiImportanti.slice(0, Math.ceil(maxQuiz / 2)).forEach((evento, idx) => {
      quiz.push({
        id: `COMPR_PERCHE_${idx}`,
        tipo: 'multipla',
        livello: 2,
        testo: `Perché ${evento.soggetto} ${evento.azione}?`,
        opzioni: this.generaOpzioniPerche(evento, testo),
        spiegazione: this.generaSpiegazioneApprofondita(evento, testo),
        difficolta: 2,
        argomento: 'Cause ed effetti',
        bloom: 'COMPRENSIONE'
      });
    });

    // SIGNIFICATO domande
    const concettiChiave = this.estraiConcettiChiave(testo);
    concettiChiave.slice(0, Math.ceil(maxQuiz / 2)).forEach((concetto, idx) => {
      quiz.push({
        id: `COMPR_SIGNIF_${idx}`,
        tipo: 'multipla',
        livello: 2,
        testo: `Cosa significa "${concetto.termine}" nel contesto del brano?`,
        opzioni: this.generaOpzioniSignificato(concetto, testo),
        spiegazione: this.generaSpiegazioneSignificato(concetto, testo),
        difficolta: 2,
        argomento: 'Comprensione concetti',
        bloom: 'COMPRENSIONE'
      });
    });

    return quiz;
  }

  // ==================== LIVELLO 3: APPLICAZIONE ====================

  /**
   * 🔧 Quiz di applicazione
   */
  generaQuizApplicazione(entita, testo, maxQuiz) {
    const quiz = [];

    // VERO/FALSO con correzione
    const affermazioni = this.generaAffermazioni(entita, testo);
    affermazioni.slice(0, maxQuiz).forEach((affermazione, idx) => {
      quiz.push({
        id: `APPL_VF_${idx}`,
        tipo: 'vero_falso',
        livello: 3,
        testo: affermazione.testo,
        rispostaCorretta: affermazione.verita,
        correzione: affermazione.verita ? null : affermazione.correzione,
        spiegazione: affermazione.spiegazione,
        difficolta: 3,
        argomento: 'Verifica affermazioni',
        bloom: 'APPLICAZIONE'
      });
    });

    return quiz;
  }

  // ==================== LIVELLO 4: ANALISI ====================

  /**
   * 🔍 Quiz di analisi
   */
  generaQuizAnalisi(entita, testo, maxQuiz) {
    const quiz = [];

    // CONFRONTO tra elementi
    if (entita.persone.length >= 2) {
      const persona1 = entita.persone[0];
      const persona2 = entita.persone[1];
      
      quiz.push({
        id: 'ANAL_CONFR_01',
        tipo: 'aperta',
        livello: 4,
        testo: `Confronta ${persona1.nome} e ${persona2.nome} in base al testo.`,
        suggerimenti: [
          'Considera il periodo storico',
          'Analizza il ruolo di ciascuno'
        ],
        spiegazione: `Entrambe le figure sono importanti nel contesto storico-culturale.`,
        difficolta: 4,
        argomento: 'Analisi comparativa',
        bloom: 'ANALISI'
      });
    }

    return quiz;
  }

  // ==================== UTILITY ====================

  /**
   * 🕸️ Costruisce il grafo di conoscenza
   */
  costruisciGrafo(entita, testo) {
    // Aggiungi nodi persone
    entita.persone.forEach(p => {
      this.graph.aggiungiNodo(p.nome, 'persona', { ruolo: p.ruolo });
    });
    
    // Aggiungi nodi opere
    entita.opere.forEach(o => {
      this.graph.aggiungiNodo(o.titolo, 'opera', { autore: o.autore });
      if (o.autore) {
        this.graph.aggiungiArco(o.autore, o.titolo, 'autore_di');
      }
    });
  }

  /**
   * 🎲 Mescola opzioni
   */
  mescolaOpzioni(opzioni) {
    return opzioni.sort(() => Math.random() - 0.5);
  }

  /**
   * 📝 Genera spiegazione didattica
   */
  generaSpiegazione(tipo, entita) {
    switch (tipo) {
      case 'data':
        return `Nel ${entita.anno} ${entita.evento.descrizione}. Questo evento è significativo nel contesto storico.`;
      case 'persona':
        return `${entita.nome} fu ${entita.ruolo}, figura importante del periodo.`;
      case 'opera':
        return `"${entita.titolo}" è un'opera fondamentale della letteratura italiana.`;
      default:
        return 'Informazione importante per comprendere il contesto.';
    }
  }

  /**
   * 👤 Descrivi persona
   */
  descriviPersona(persona) {
    const descrizioni = {
      'scrittore/poeta': 'Importante figura della letteratura italiana',
      'filosofo': 'Pensatore che influenzò il dibattito culturale',
      'personaggio storico': 'Figura storica del periodo'
    };
    return descrizioni[persona.ruolo] || 'Personaggio del periodo';
  }

  /**
   * 🔍 Estrai eventi importanti
   */
  estraiEventiImportanti(testo) {
    const eventi = [];
    const pattern = /([A-Z][a-z]+)\s+(nacque|morì|scrisse|pubblicò)/g;
    let match;
    
    while ((match = pattern.exec(testo)) !== null) {
      eventi.push({
        soggetto: match[1],
        azione: match[2],
        contesto: this.extractor.estraiContesto(testo, match.index, 50)
      });
    }
    
    return eventi.slice(0, 3);
  }

  /**
   * 💡 Estrai concetti chiave
   */
  estraiConcettiChiave(testo) {
    const concetti = [];
    const termini = ['materialismo', 'illusioni', 'romanticismo', 'neoclassicismo'];
    
    termini.forEach(termine => {
      if (testo.toLowerCase().includes(termine)) {
        concetti.push({
          termine,
          contesto: 'presente nel testo'
        });
      }
    });
    
    return concetti.slice(0, 3);
  }

  /**
   * ❓ Genera opzioni per "Perché"
   */
  generaOpzioniPerche(evento, testo) {
    return this.mescolaOpzioni([
      { testo: 'Per le circostanze storiche del periodo', corretta: true },
      { testo: 'Per motivi economici', corretta: false },
      { testo: 'Per obblighi esterni', corretta: false },
      { testo: 'Per caso', corretta: false }
    ]);
  }

  /**
   * 🔤 Genera opzioni significato
   */
  generaOpzioniSignificato(concetto, testo) {
    const significati = {
      'materialismo': 'Concezione filosofica che nega lo spirito',
      'illusioni': 'Costruzioni mentali necessarie per Foscolo',
      'romanticismo': 'Movimento che privilegia il sentimento',
      'neoclassicismo': 'Corrente che riprende i modelli classici'
    };
    
    const corretto = significati[concetto.termine] || 'Concetto importante';
    const distrattori = this.distractorGen.generaDistractors(
      { rispostaCorretta: corretto },
      'definizione',
      3
    );
    
    return this.mescolaOpzioni([
      { testo: corretto, corretta: true },
      ...distrattori.map(d => ({ testo: d.valore || 'Definizione alternativa', corretta: false }))
    ]);
  }

  /**
   * 📚 Spiegazione approfondita
   */
  generaSpiegazioneApprofondita(evento, testo) {
    return `L'evento è significativo nel contesto storico-culturale dell'epoca.`;
  }

  /**
   * 💭 Spiegazione significato
   */
  generaSpiegazioneSignificato(concetto, testo) {
    return `Il termine rappresenta un concetto fondamentale nel pensiero dell'autore.`;
  }

  /**
   * ✅ Genera affermazioni
   */
  generaAffermazioni(entita, testo) {
    const affermazioni = [];
    
    if (entita.persone.length > 0) {
      affermazioni.push({
        testo: `${entita.persone[0].nome} fu una figura importante del periodo.`,
        verita: true,
        spiegazione: 'Affermazione corretta basata sul testo.'
      });
    }
    
    if (entita.date.length > 0) {
      const annoFalso = (parseInt(entita.date[0].anno) + 10).toString();
      affermazioni.push({
        testo: `L'evento avvenne nel ${annoFalso}.`,
        verita: false,
        correzione: `L'anno corretto è ${entita.date[0].anno}.`,
        spiegazione: 'La data indicata non è corretta.'
      });
    }
    
    return affermazioni;
  }

  /**
   * ✅ Valida e seleziona
   */
  validaESeleziona(quiz, maxQuiz) {
    // Valida con il validator
    const quizValidati = quiz.map(q => {
      const validazione = this.validator.valida(q);
      return {
        ...q,
        punteggio: validazione.punteggio,
        valido: validazione.valido
      };
    });
    
    // Filtra validi
    const validi = quizValidati.filter(q => q.valido && q.punteggio >= this.config.qualitaMinima);
    
    // Ordina per qualità e varietà
    validi.sort((a, b) => b.punteggio - a.punteggio);
    
    return validi.slice(0, maxQuiz);
  }

  /**
   * 💎 Arricchisci quiz
   */
  arricchisciQuiz(quiz, sottoargomento) {
    return quiz.map((q, idx) => ({
      ...q,
      id: q.id || `QUIZ_${idx}`,
      materia: sottoargomento.materia || 'Italiano',
      argomento: sottoargomento.titolo,
      timestamp: Date.now()
    }));
  }
}

module.exports = QuizGeneratorAdvanced;
