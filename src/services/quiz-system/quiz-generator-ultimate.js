/**
 * 🏆 QUIZ GENERATOR ULTIMATE - Sistema Completo Integrato
 * Unisce TUTTI i componenti in un sistema coeso
 */

const EntityExtractor = require('./entity-extractor');
const DistractorGenerator = require('./distractor-generator');
const KnowledgeGraph = require('./knowledge-graph');
const QuestionValidator = require('./question-validator');
const AdaptiveDifficulty = require('./adaptive-difficulty');

class QuizGeneratorUltimate {
  constructor(options = {}) {
    // Inizializza TUTTI i componenti
    this.extractor = new EntityExtractor();
    this.distractor = new DistractorGenerator();
    this.graph = new KnowledgeGraph();
    this.validator = new QuestionValidator();
    this.adaptive = new AdaptiveDifficulty();
    
    this.config = {
      userId: options.userId || 'default',
      qualitaMinima: 0.7,
      usaAdaptive: true,
      varietaGarantita: true
    };
    
    console.log('🏆 QuizGeneratorUltimate: TUTTI i sistemi integrati');
  }

  /**
   * 🚀 GENERA QUIZ CON TUTTI I SISTEMI INTEGRATI
   */
  async generaQuizCompleto(sottoargomento, opzioni = {}) {
    const { maxQuiz = 15, materia = 'Italiano' } = opzioni;
    const testo = sottoargomento.riassunto || '';
    
    if (!testo || testo.length < 100) {
      return { quiz: [], metadata: { errore: 'Testo insufficiente' } };
    }

    // 1. ESTRAI ENTITÀ + CONCETTI + RELAZIONI
    const entita = this.estraiTutto(testo);
    
    // 2. COSTRUISCI KNOWLEDGE GRAPH COMPLETO
    this.costruisciGrafoCompleto(entita, testo);
    
    // 3. DETERMINA DIFFICOLTÀ ADATTIVA
    const difficolta = this.getDifficoltaAdattiva(materia);
    
    // 4. GENERA QUIZ MULTILIVELLO
    let quiz = this.generaTuttiLivelli(entita, testo, maxQuiz, difficolta);
    
    // 5. VALIDA E FILTRA
    quiz = this.validaEOttimizza(quiz);
    
    // 6. ARRICCHISCI PEDAGOGICAMENTE
    quiz = this.arricchisci(quiz, sottoargomento, entita);
    
    // 7. REGISTRA PER ADAPTIVE LEARNING
    this.registraPerAdaptive(quiz);
    
    return {
      quiz,
      metadata: {
        entitaEstratte: Object.keys(entita).map(k => `${k}: ${entita[k].length}`),
        grafo: this.graph.getStatistiche(),
        difficoltaAdattiva: difficolta,
        qualita: this.calcolaQualitaTotale(quiz)
      }
    };
  }

  // ==================== ESTRAZIONE AVANZATA ====================
  
  estraiTutto(testo) {
    // Estrazione base
    const entita = {
      persone: this.extractor.estraiPersone(testo),
      opere: this.extractor.estraiOpere(testo),
      luoghi: this.extractor.estraiLuoghi(testo),
      date: this.extractor.estraiDate(testo)
    };
    
    // Estrazione avanzata
    entita.concetti = this.estraiConcetti(testo);
    entita.relazioni = this.estraiRelazioni(testo);
    entita.temi = this.estraiTemi(testo);
    
    return entita;
  }
  
  estraiConcetti(testo) {
    const concetti = [];
    const termini = ['materialismo','illusioni','romanticismo','neoclassicismo','pessimismo'];
    
    termini.forEach(t => {
      const regex = new RegExp(`\\b${t}\\b`, 'gi');
      const matches = testo.match(regex);
      if (matches) {
        concetti.push({
          termine: t,
          frequenza: matches.length,
          definizione: this.getDefinizione(t)
        });
      }
    });
    return concetti;
  }
  
  estraiRelazioni(testo) {
    const relazioni = [];
    const patterns = [
      /([A-Z][a-z]+)\s+influenzò\s+([A-Z][a-z]+)/g,
      /([A-Z][a-z]+)\s+(?:causò|determinò)\s+(.+?)(?:\.|,)/g,
      /([A-Z][a-z]+)\s+si\s+oppose\s+a\s+([A-Z][a-z]+)/g
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(testo))) {
        relazioni.push({
          da: match[1],
          a: match[2],
          tipo: this.identificaTipoRelazione(match[0])
        });
      }
    });
    return relazioni;
  }
  
  estraiTemi(testo) {
    const temi = [];
    if (testo.toLowerCase().includes('morte')) temi.push('morte');
    if (testo.toLowerCase().includes('amore')) temi.push('amore');
    if (testo.toLowerCase().includes('patria')) temi.push('patria');
    if (testo.toLowerCase().includes('esilio')) temi.push('esilio');
    return temi;
  }

  // ==================== KNOWLEDGE GRAPH ====================
  
  costruisciGrafoCompleto(entita, testo) {
    // Map per tenere traccia degli ID
    const nomeToId = {};
    
    // Aggiungi nodi
    Object.entries(entita).forEach(([tipo, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          const nome = item.nome || item.titolo || item.termine || item.anno || item;
          if (nome) {
            const id = this.graph.aggiungiNodo(nome, tipo, item);
            nomeToId[nome] = id;
          }
        });
      }
    });
    
    // Aggiungi relazioni
    entita.relazioni?.forEach(r => {
      const idDa = nomeToId[r.da];
      const idA = nomeToId[r.a];
      if (idDa && idA) {
        this.graph.aggiungiRelazione(idDa, idA, r.tipo);
      }
    });
    
    // Collega autori-opere
    entita.opere?.forEach(o => {
      if (o.autore) {
        const idAutore = nomeToId[o.autore];
        const idOpera = nomeToId[o.titolo];
        if (idAutore && idOpera) {
          this.graph.aggiungiRelazione(idAutore, idOpera, 'autore_di');
        }
      }
    });
    
    // Trova co-occorrenze
    this.trovaCooccorrenze(entita, testo, nomeToId);
  }
  
  trovaCooccorrenze(entita, testo, nomeToId) {
    const frasi = testo.split(/[.!?]/);
    frasi.forEach(frase => {
      const personeInFrase = entita.persone?.filter(p => frase.includes(p.nome)) || [];
      if (personeInFrase.length >= 2) {
        const id1 = nomeToId[personeInFrase[0].nome];
        const id2 = nomeToId[personeInFrase[1].nome];
        if (id1 && id2) {
          this.graph.aggiungiRelazione(id1, id2, 'cooccorrenza');
        }
      }
    });
  }

  // ==================== DIFFICOLTÀ ADATTIVA ====================
  
  getDifficoltaAdattiva(materia) {
    const userId = this.config.userId;
    const suggerita = this.adaptive.selezionaDifficolta(userId, materia);
    const analisi = this.adaptive.generaAnalisi(userId);
    
    return {
      livello: suggerita.difficolta,
      confidence: suggerita.confidence,
      trend: analisi.trend,
      raccomandazioni: analisi.raccomandazioni
    };
  }

  // ==================== GENERAZIONE MULTILIVELLO ====================
  
  generaTuttiLivelli(entita, testo, maxQuiz, difficolta) {
    const quiz = [];
    const dist = this.calcolaDistribuzione(difficolta.livello, maxQuiz);
    
    // CONOSCENZA (chi, cosa, quando)
    quiz.push(...this.generaConoscenza(entita, dist.conoscenza));
    
    // COMPRENSIONE (perché, significato)
    quiz.push(...this.generaComprensione(entita, testo, dist.comprensione));
    
    // APPLICAZIONE (completamento, vero/falso)
    quiz.push(...this.generaApplicazione(entita, testo, dist.applicazione));
    
    // ANALISI (confronti, relazioni, ordinamento)
    quiz.push(...this.generaAnalisi(entita, testo, dist.analisi));
    
    // SINTESI + VALUTAZIONE (domande aperte)
    quiz.push(...this.generaSintesiValutazione(entita, testo, dist.sintesi));
    
    // VARIETÀ (abbinamento, riempimento multiplo)
    quiz.push(...this.generaVarieta(entita, testo, Math.floor(maxQuiz * 0.2)));
    
    return quiz;
  }
  
  calcolaDistribuzione(livello, max) {
    const distribuzioni = {
      1: {conoscenza:0.5, comprensione:0.3, applicazione:0.2, analisi:0, sintesi:0},
      2: {conoscenza:0.3, comprensione:0.3, applicazione:0.3, analisi:0.1, sintesi:0},
      3: {conoscenza:0.2, comprensione:0.3, applicazione:0.2, analisi:0.2, sintesi:0.1},
      4: {conoscenza:0.1, comprensione:0.2, applicazione:0.3, analisi:0.3, sintesi:0.1},
      5: {conoscenza:0.1, comprensione:0.1, applicazione:0.2, analisi:0.3, sintesi:0.3}
    };
    
    const d = distribuzioni[livello] || distribuzioni[3];
    return {
      conoscenza: Math.floor(max * d.conoscenza),
      comprensione: Math.floor(max * d.comprensione),
      applicazione: Math.floor(max * d.applicazione),
      analisi: Math.floor(max * d.analisi),
      sintesi: Math.ceil(max * d.sintesi)
    };
  }

  // ==================== GENERATORI PER LIVELLO ====================
  
  generaConoscenza(entita, max) {
    const quiz = [];
    let id = 0;
    
    // Date
    entita.date?.slice(0,max/3).forEach(d => {
      const dist = this.distractor.generaDistractors({rispostaCorretta:d.anno},'data',3);
      quiz.push({
        id: `CON_${id++}`,
        tipo: 'multipla',
        livello: 1,
        bloom: 'CONOSCENZA',
        testo: `In che anno ${d.evento.descrizione}?`,
        opzioni: [{testo:d.anno,corretta:true},...dist.map(x=>({testo:x.valore,corretta:false}))],
      });
    });
    
    // Persone
    entita.persone?.slice(0,max/3).forEach(p => {
      quiz.push({
        id: `CON_${id++}`,
        tipo: 'multipla',
        livello: 1,
        bloom: 'CONOSCENZA',
        testo: `Chi era ${p.nome}?`,
        opzioni: this.generaOpzioniPersona(p)
      });
    });
    
    return quiz;
  }
  
  generaComprensione(entita, testo, max) {
    const quiz = [];
    let id = 0;
    
    // PERCHÉ
    entita.relazioni?.filter(r=>r.tipo==='causa').slice(0,max/2).forEach(r => {
      quiz.push({
        id: `COMP_${id++}`,
        tipo: 'multipla',
        livello: 2,
        bloom: 'COMPRENSIONE',
        testo: `Perché ${r.da} ${r.tipo} ${r.a}?`,
        opzioni: this.generaOpzioniPerche(r,testo)
      });
    });
    
    // SIGNIFICATO
    entita.concetti?.slice(0,max/2).forEach(c => {
      quiz.push({
        id: `COMP_${id++}`,
        tipo: 'multipla',
        livello: 2,
        bloom: 'COMPRENSIONE',
        testo: `Cosa significa "${c.termine}"?`,
        opzioni: this.generaOpzioniSignificato(c)
      });
    });
    
    return quiz;
  }
  
  generaApplicazione(entita, testo, max) {
    const quiz = [];
    
    // COMPLETAMENTO
    const frasi = testo.split('.').filter(f=>f.length>50&&f.length<150);
    frasi.slice(0,max/2).forEach((f,i) => {
      const parole = f.trim().split(' ');
      const idx = Math.floor(parole.length/2);
      const mancante = parole[idx];
      parole[idx] = '_____';
      
      quiz.push({
        id: `APP_${i}`,
        tipo: 'completamento',
        livello: 3,
        bloom: 'APPLICAZIONE',
        testo: parole.join(' '),
        rispostaCorretta: mancante
      });
    });
    
    // VERO/FALSO
    if(entita.date?.length>0) {
      quiz.push({
        id: `APP_VF`,
        tipo: 'vero_falso',
        livello: 3,
        bloom: 'APPLICAZIONE',
        testo: `L'evento avvenne nel ${parseInt(entita.date[0].anno)+10}`,
        rispostaCorretta: false,
        correzione: `L'anno corretto è ${entita.date[0].anno}`
      });
    }
    
    return quiz;
  }
  
  generaAnalisi(entita, testo, max) {
    const quiz = [];
    
    // CONFRONTI dal grafo
    if(entita.persone?.length>=2) {
      quiz.push({
        id: 'ANAL_1',
        tipo: 'aperta',
        livello: 4,
        bloom: 'ANALISI',
        testo: `Confronta ${entita.persone[0].nome} e ${entita.persone[1].nome}`,
        rubrica: {
          ottimo: 'Identifica 3+ punti di confronto',
          buono: 'Identifica 2 punti',
          sufficiente: 'Identifica 1 punto'
        }
      });
    }
    
    // ORDINAMENTO
    if(entita.date?.length>=3) {
      const eventi = entita.date.slice(0,4);
      quiz.push({
        id: 'ANAL_ORD',
        tipo: 'ordinamento',
        livello: 4,
        bloom: 'ANALISI',
        testo: 'Ordina cronologicamente:',
        elementi: eventi.map(e=>({id:e.anno,testo:e.evento.descrizione.substring(0,30)})),
        ordineCorretto: eventi.map(e=>e.anno).sort()
      });
    }
    
    return quiz;
  }
  
  generaSintesiValutazione(entita, testo, max) {
    const quiz = [];
    
    if(entita.persone?.length>0) {
      quiz.push({
        id: 'VAL_1',
        tipo: 'saggio_breve',
        livello: 6,
        bloom: 'VALUTAZIONE',
        testo: `Valuta l'importanza di ${entita.persone[0].nome}`,
        lunghezza: '100-150 parole',
        criteri: ['Argomentazione','Evidenze','Giudizio critico']
      });
    }
    
    return quiz;
  }
  
  generaVarieta(entita, testo, max) {
    const quiz = [];
    
    // ABBINAMENTO
    if(entita.opere?.length>=2 && entita.persone?.length>=2) {
      quiz.push({
        id: 'VAR_ABB',
        tipo: 'abbinamento',
        livello: 2,
        bloom: 'CONOSCENZA',
        testo: 'Abbina opere e autori:',
        colA: entita.opere.map(o=>o.titolo),
        colB: entita.persone.map(p=>p.nome),
        abbinamenti: entita.opere.map(o=>({sx:o.titolo,dx:o.autore||'Anonimo'}))
      });
    }
    
    return quiz;
  }

  // ==================== VALIDAZIONE E OTTIMIZZAZIONE ====================
  
  validaEOttimizza(quiz) {
    // Valida ogni quiz
    const validati = quiz.map(q => ({
      ...q,
      validazione: this.validator.valida(q)
    }));
    
    // Filtra per qualità
    const buoni = validati.filter(q => 
      q.validazione.valido && q.validazione.punteggio >= this.config.qualitaMinima
    );
    
    // Assicura varietà
    const conVarieta = this.assicuraVarieta(buoni);
    
    console.log(`✅ ${conVarieta.length}/${quiz.length} quiz superano i criteri`);
    
    return conVarieta;
  }
  
  assicuraVarieta(quiz) {
    const perTipo = {};
    const perLivello = {};
    const risultato = [];
    
    // Prima: almeno uno per tipo e livello
    quiz.forEach(q => {
      if(!perTipo[q.tipo] || !perLivello[q.livello]) {
        risultato.push(q);
        perTipo[q.tipo] = true;
        perLivello[q.livello] = true;
      }
    });
    
    // Poi: i migliori rimanenti
    const rimanenti = quiz.filter(q=>!risultato.includes(q));
    rimanenti.sort((a,b)=>b.validazione.punteggio-a.validazione.punteggio);
    risultato.push(...rimanenti);
    
    return risultato;
  }

  // ==================== ARRICCHIMENTO PEDAGOGICO ====================
  
  arricchisci(quiz, sottoargomento, entita) {
    return quiz.map(q => ({
      ...q,
      spiegazione: this.generaSpiegazione(q,sottoargomento),
      feedback: {
        corretto: this.feedbackPositivo(q.bloom),
        sbagliato: this.feedbackNegativo(q.bloom,q.testo)
      },
      collegamenti: this.trovaCollegamenti(q,entita),
      metadata: {
        materia: sottoargomento.materia || 'Italiano',
        argomento: sottoargomento.titolo,
        timestamp: Date.now()
      }
    }));
  }
  
  generaSpiegazione(quiz,sott) {
    const spiegazioni = {
      'CONOSCENZA': 'Questa domanda verifica la memorizzazione di fatti e date fondamentali.',
      'COMPRENSIONE': 'Qui devi dimostrare di aver capito il significato e le connessioni.',
      'APPLICAZIONE': 'Applica le conoscenze per completare o risolvere.',
      'ANALISI': 'Scomponi e identifica le relazioni tra gli elementi.',
      'SINTESI': 'Combina elementi per creare qualcosa di nuovo.',
      'VALUTAZIONE': 'Esprimi un giudizio critico motivato.'
    };
    return spiegazioni[quiz.bloom] || 'Rifletti e applica le tue conoscenze.';
  }
  
  feedbackPositivo(bloom) {
    const feedback = {
      'CONOSCENZA': '✨ Ottima memoria! Hai ricordato perfettamente!',
      'COMPRENSIONE': '💡 Eccellente comprensione del concetto!',
      'APPLICAZIONE': '🎯 Perfetta applicazione delle conoscenze!',
      'ANALISI': '🔍 Analisi accurata e precisa!',
      'SINTESI': '🎨 Creatività e sintesi eccellenti!',
      'VALUTAZIONE': '⚖️ Giudizio critico ben argomentato!'
    };
    return feedback[bloom] || '✅ Risposta corretta!';
  }
  
  feedbackNegativo(bloom,testo) {
    return `Rivedi il concetto. Ricorda: ${testo.substring(0,50)}...`;
  }
  
  trovaCollegamenti(quiz,entita) {
    const collegamenti = [];
    // Trova entità menzionate nel quiz
    entita.persone?.forEach(p => {
      if(quiz.testo.includes(p.nome)) collegamenti.push(p.nome);
    });
    return collegamenti;
  }

  // ==================== REGISTRAZIONE ADAPTIVE ====================
  
  registraPerAdaptive(quiz) {
    // Prepara i quiz per il sistema adattivo
    quiz.forEach(q => {
      q.preparatoPerAdaptive = {
        questionId: q.id,
        difficolta: q.livello,
        argomento: q.metadata?.argomento,
        bloom: q.bloom
      };
    });
  }

  // ==================== UTILITY ====================
  
  getDefinizione(termine) {
    const def = {
      'materialismo': 'Concezione che nega lo spirito',
      'illusioni': 'Costruzioni mentali necessarie per Foscolo',
      'romanticismo': 'Movimento del sentimento',
      'neoclassicismo': 'Ritorno ai modelli classici',
      'pessimismo': 'Visione negativa dell\'esistenza'
    };
    return def[termine] || 'Concetto letterario importante';
  }
  
  identificaTipoRelazione(frase) {
    if(frase.includes('influenz')) return 'influenza';
    if(frase.includes('caus') || frase.includes('determin')) return 'causa';
    if(frase.includes('oppos')) return 'opposizione';
    return 'relazione';
  }
  
  generaOpzioniPersona(persona) {
    const corretta = `${persona.ruolo} del periodo`;
    const dist = this.distractor.generaDistractors({rispostaCorretta:corretta},'persona',3);
    return [{testo:corretta,corretta:true},...dist.map(d=>({testo:d.valore||'Figura storica',corretta:false}))];
  }
  
  generaOpzioniPerche(rel,testo) {
    return [
      {testo:'Per le circostanze storiche',corretta:true},
      {testo:'Per motivi economici',corretta:false},
      {testo:'Per caso',corretta:false},
      {testo:'Non è specificato',corretta:false}
    ];
  }
  
  generaOpzioniSignificato(concetto) {
    const corretta = concetto.definizione;
    return [
      {testo:corretta,corretta:true},
      {testo:'Concetto opposto',corretta:false},
      {testo:'Termine non correlato',corretta:false},
      {testo:'Definizione errata',corretta:false}
    ];
  }
  
  calcolaQualitaTotale(quiz) {
    const media = quiz.reduce((acc,q)=>acc+(q.validazione?.punteggio||0),0)/quiz.length;
    return {
      mediaQualita: media.toFixed(2),
      varietaTipi: new Set(quiz.map(q=>q.tipo)).size,
      varietaLivelli: new Set(quiz.map(q=>q.livello)).size,
      coperturaBloom: new Set(quiz.map(q=>q.bloom)).size
    };
  }
}

module.exports = QuizGeneratorUltimate;
