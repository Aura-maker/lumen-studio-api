// GENERATORE QUIZ UNIVERSITARIO - AI AVANZATA
// Il più sofisticato generatore di quiz mai creato
const contenuti = require('../data/contenuti-tutte-materie-complete');

class QuizGeneratoreUniversitario {
  constructor() {
    this.quizDatabase = [];
    this.quizId = 1;
    this.bancaDatiConoscenze = this.inizializzaBancaDati();
    this.analizzatoreSemantico = new AnalizzatoreSemantico();
  }

  // Inizializza banca dati di conoscenze per ogni materia
  inizializzaBancaDati() {
    return {
      italiano: {
        autori: {
          'Dante Alighieri': { epoca: 'Medioevo', opere: ['Divina Commedia', 'Vita Nova'], movimento: 'Stilnovo' },
          'Francesco Petrarca': { epoca: 'Umanesimo', opere: ['Canzoniere', 'Secretum'], movimento: 'Umanesimo' },
          'Giovanni Boccaccio': { epoca: 'Umanesimo', opere: ['Decameron'], movimento: 'Umanesimo' },
          'Ugo Foscolo': { epoca: 'Neoclassicismo', opere: ['Ultime lettere di Jacopo Ortis', 'I Sepolcri'], movimento: 'Preromanticismo' },
          'Alessandro Manzoni': { epoca: 'Romanticismo', opere: ['I Promessi Sposi', 'Adelchi'], movimento: 'Romanticismo' },
          'Giacomo Leopardi': { epoca: 'Romanticismo', opere: ['Canti', 'Operette morali'], movimento: 'Romanticismo' },
          'Giovanni Verga': { epoca: 'Realismo', opere: ['I Malavoglia', 'Mastro-don Gesualdo'], movimento: 'Verismo' },
          'Gabriele D\'Annunzio': { epoca: 'Decadentismo', opere: ['Il piacere', 'Alcyone'], movimento: 'Decadentismo' },
          'Giovanni Pascoli': { epoca: 'Decadentismo', opere: ['Myricae', 'Canti di Castelvecchio'], movimento: 'Simbolismo' },
          'Luigi Pirandello': { epoca: 'Novecento', opere: ['Il fu Mattia Pascal', 'Sei personaggi in cerca d\'autore'], movimento: 'Teatro del grottesco' }
        },
        movimenti: {
          'Stilnovo': { periodo: '1280-1310', caratteristiche: ['amore spirituale', 'donna angelicata', 'nobiltà d\'animo'] },
          'Umanesimo': { periodo: '1400-1500', caratteristiche: ['riscoperta classici', 'dignità umana', 'filologia'] },
          'Rinascimento': { periodo: '1500-1600', caratteristiche: ['equilibrio', 'armonia', 'imitazione classica'] },
          'Barocco': { periodo: '1600-1700', caratteristiche: ['meraviglia', 'artificio', 'metafora'] },
          'Illuminismo': { periodo: '1700-1800', caratteristiche: ['ragione', 'progresso', 'enciclopedia'] },
          'Neoclassicismo': { periodo: '1750-1850', caratteristiche: ['imitazione antica', 'bellezza ideale', 'equilibrio'] },
          'Romanticismo': { periodo: '1800-1870', caratteristiche: ['sentimento', 'natura', 'storia', 'nazione'] },
          'Realismo': { periodo: '1850-1900', caratteristiche: ['verità', 'società', 'progresso scientifico'] },
          'Verismo': { periodo: '1875-1895', caratteristiche: ['impersonalità', 'regressione', 'determinismo'] },
          'Decadentismo': { periodo: '1880-1920', caratteristiche: ['estetismo', 'simbolismo', 'crisi valori'] }
        }
      },
      storia: {
        eventi: {
          'Rivoluzione francese': { anno: 1789, cause: ['crisi economica', 'crisi sociale', 'illuminismo'], conseguenze: ['fine ancien régime', 'dichiarazione diritti', 'terrore'] },
          'Congresso di Vienna': { anno: 1815, principi: ['legittimità', 'equilibrio', 'restaurazione'], conseguenze: ['santa alleanza', 'moti rivoluzionari'] },
          'Unità d\'Italia': { periodo: '1848-1870', protagonisti: ['Cavour', 'Garibaldi', 'Mazzini'], tappe: ['guerre indipendenza', 'spedizione mille', 'presa Roma'] },
          'Prima Guerra Mondiale': { periodo: '1914-1918', cause: ['imperialismo', 'nazionalismo', 'alleanze'], conseguenze: ['crollo imperi', 'nuovi stati', 'crisi economica'] }
        },
        personaggi: {
          'Napoleone Bonaparte': { ruolo: 'imperatore', periodo: '1799-1815', riforme: ['codice civile', 'concordato', 'università'] },
          'Camillo Cavour': { ruolo: 'statista', periodo: '1850-1861', politica: ['liberalismo', 'modernizzazione', 'diplomazia'] },
          'Giuseppe Garibaldi': { ruolo: 'condottiero', periodo: '1807-1882', imprese: ['repubblica romana', 'spedizione mille', 'aspromonte'] },
          'Giuseppe Mazzini': { ruolo: 'rivoluzionario', periodo: '1805-1872', ideali: ['repubblica', 'unità', 'democrazia'] }
        }
      },
      filosofia: {
        filosofi: {
          'Immanuel Kant': { epoca: 'Illuminismo critico', opere: ['Critica ragion pura', 'Critica ragion pratica'], concetti: ['fenomeno/noumeno', 'imperativo categorico', 'giudizi sintetici a priori'] },
          'Georg Hegel': { epoca: 'Idealismo', opere: ['Fenomenologia spirito', 'Filosofia diritto'], concetti: ['dialettica', 'spirito assoluto', 'filosofia storia'] },
          'Arthur Schopenhauer': { epoca: 'Pessimismo', opere: ['Il mondo come volontà', 'Parerga e paralipomena'], concetti: ['volontà di vivere', 'velo di Maya', 'arte come liberazione'] },
          'Friedrich Nietzsche': { epoca: 'Filosofia vita', opere: ['Così parlò Zarathustra', 'Genealogia morale'], concetti: ['morte di Dio', 'oltreuomo', 'eterno ritorno'] }
        },
        correnti: {
          'Idealismo': { caratteristiche: ['identità pensiero/essere', 'dialettica', 'sistema'], rappresentanti: ['Fichte', 'Schelling', 'Hegel'] },
          'Positivismo': { caratteristiche: ['metodo scientifico', 'progresso', 'sociologia'], rappresentanti: ['Comte', 'Spencer', 'Mill'] },
          'Esistenzialismo': { caratteristiche: ['esistenza precede essenza', 'angoscia', 'libertà'], rappresentanti: ['Kierkegaard', 'Sartre', 'Heidegger'] }
        }
      },
      matematica: {
        teoremi: {
          'Teorema di Pitagora': { formula: 'a² + b² = c²', applicazioni: ['triangoli rettangoli', 'distanze', 'geometria analitica'] },
          'Teorema fondamentale calcolo': { enunciato: 'derivazione e integrazione sono operazioni inverse', applicazioni: ['calcolo aree', 'fisica'] }
        },
        concetti: {
          'Limite': { definizione: 'valore cui tende funzione', tipi: ['finito', 'infinito', 'destro/sinistro'] },
          'Derivata': { definizione: 'tasso variazione istantaneo', applicazioni: ['velocità', 'ottimizzazione', 'studio funzioni'] }
        }
      },
      fisica: {
        leggi: {
          'Leggi Newton': { prima: 'inerzia', seconda: 'F=ma', terza: 'azione-reazione' },
          'Leggi termodinamica': { prima: 'conservazione energia', seconda: 'entropia', terza: 'zero assoluto' }
        },
        costanti: {
          'Velocità luce': { valore: '299792458 m/s', simbolo: 'c' },
          'Costante Planck': { valore: '6.626×10⁻³⁴ J·s', simbolo: 'h' }
        }
      }
    };
  }

  // Genera tutti i quiz con AI avanzata
  generaTuttiQuiz() {
    console.log('🧠 Generazione quiz universitari con AI avanzata...');
    
    for (const [materiaKey, materiaObj] of Object.entries(contenuti)) {
      const { materia, argomenti } = materiaObj;
      console.log(`🎓 ${materia.nome} - Analisi semantica avanzata...`);
      
      for (const argomento of argomenti) {
        for (const sottoargomento of argomento.sottoargomenti || []) {
          // Analisi semantica del riassunto
          const analisiSemantica = this.analizzatoreSemantico.analizza(
            sottoargomento.riassunto, 
            materiaKey, 
            argomento, 
            sottoargomento
          );
          
          // Genera quiz per ogni concetto identificato
          for (const concetto of analisiSemantica.concetti) {
            const quizAvanzati = this.generaQuizDaConcetto(concetto, materiaKey, argomento, sottoargomento);
            this.quizDatabase.push(...quizAvanzati);
          }
          
          // GENERAZIONE AGGIUNTIVA per aumentare il numero di quiz
          // Temporaneamente disabilitata - sarà riattivata dopo
          // const frasiAggiuntive = this.estraiFrasiPerQuiz(sottoargomento.riassunto || '');
          // for (const frase of frasiAggiuntive.slice(0, 3)) {
          //   const quizDaFrase = this.generaQuizDaFrase(frase, materiaKey, argomento, sottoargomento);
          //   if (quizDaFrase) {
          //     this.quizDatabase.push(quizDaFrase);
          //   }
          // }
        }
      }
    }
    
    console.log(`🎊 Quiz universitari generati: ${this.quizDatabase.length}`);
    return this.quizDatabase;
  }

  // Genera quiz sofisticati da un concetto (SPECIFICO PER MATERIA)
  generaQuizDaConcetto(concetto, materiaKey, argomento, sottoargomento) {
    const quiz = [];
    
    // FILTRO PRINCIPALE: Solo concetti significativi
    if (!this.èConcettoValido(concetto)) {
      return quiz;
    }
    
    // LOGICA SPECIFICA PER MATERIA - Come un vero professore
    const quizSpecifici = this.generaQuizSpecificiPerMateria(concetto, materiaKey, argomento, sottoargomento);
    
    // DISTRIBUZIONE INTELLIGENTE PER DIFFICOLTÀ
    const quizConDifficolta = this.assegnaDifficoltaIntelligente(quizSpecifici, concetto, materiaKey);
    quiz.push(...quizConDifficolta);
    
    return quiz;
  }

  // Assegna difficoltà in modo intelligente
  assegnaDifficoltaIntelligente(quiz, concetto, materiaKey) {
    return quiz.map((q, index) => {
      // LOGICA INTELLIGENTE PER DIFFICOLTÀ
      let difficolta = 'medio'; // Default
      
      // FACILE: Vero/Falso e concetti base
      if (q.tipo === 'vero_falso') {
        difficolta = 'facile';
        q.punti = 10;
      }
      // MEDIO: Quiz di comprensione e analisi
      else if (concetto.tipo === 'tema' || concetto.tipo === 'concetto') {
        difficolta = index === 0 ? 'medio' : 'facile';
        q.punti = difficolta === 'medio' ? 15 : 10;
      }
      // AVANZATO: Autori, opere, analisi critica
      else if (concetto.tipo === 'autore' || concetto.tipo === 'opera') {
        difficolta = index === 0 ? 'avanzato' : 'medio';
        q.punti = difficolta === 'avanzato' ? 20 : 15;
      }
      
      // MATERIE SCIENTIFICHE = PIÙ DIFFICILI
      if (materiaKey === 'matematica' || materiaKey === 'fisica') {
        if (difficolta === 'facile') difficolta = 'medio';
        else if (difficolta === 'medio') difficolta = 'avanzato';
        q.punti += 5;
      }
      
      q.difficolta = difficolta;
      return q;
    });
  }

  // GENERATORE SPECIFICO PER MATERIA - Il cuore dell'intelligenza
  generaQuizSpecificiPerMateria(concetto, materiaKey, argomento, sottoargomento) {
    switch (materiaKey.toLowerCase()) {
      case 'italiano':
        return this.generaQuizItaliano(concetto, argomento, sottoargomento);
      case 'storia':
        return this.generaQuizStoria(concetto, argomento, sottoargomento);
      case 'filosofia':
        return this.generaQuizFilosofia(concetto, argomento, sottoargomento);
      case 'matematica':
        return this.generaQuizMatematica(concetto, argomento, sottoargomento);
      case 'fisica':
        return this.generaQuizFisica(concetto, argomento, sottoargomento);
      case 'latino':
        return this.generaQuizLatino(concetto, argomento, sottoargomento);
      default:
        return this.generaQuizGenerico(concetto, argomento, sottoargomento, materiaKey);
    }
  }

  // Verifica se un concetto è valido per generare quiz
  èConcettoValido(concetto) {
    // Escludi concetti troppo generici o senza senso
    const concettiEsclusi = ['1901', '1900', '1902', 'nel', 'dal', 'fino', 'tra', 'durante'];
    
    if (concettiEsclusi.some(escluso => concetto.entitaPrincipale.includes(escluso))) {
      return false;
    }
    
    // Deve avere almeno 3 caratteri e non essere solo numeri
    if (concetto.entitaPrincipale.length < 3 || /^\d+$/.test(concetto.entitaPrincipale)) {
      return false;
    }
    
    // Deve avere una spiegazione significativa
    if (!concetto.spiegazione || concetto.spiegazione.length < 10) {
      return false;
    }
    
    return true;
  }

  // I metodi specifici per tipo sono stati sostituiti dai generatori per materia

  // Quiz di analisi critica (livello universitario)
  generaQuizAnalisiCritica(concetto, materiaKey, argomento, sottoargomento) {
    const bancaDati = this.bancaDatiConoscenze[materiaKey];
    if (!bancaDati) return null;
    
    const domanda = `Analizzando ${concetto.entitaPrincipale}, quale delle seguenti interpretazioni critiche è più accurata dal punto di vista ${argomento.titolo}?`;
    
    const opzioni = this.generatoreOpzioni.creaOpzioniAnalisiCritica(concetto, bancaDati, materiaKey);
    if (opzioni.length < 4) return null;
    
    return {
      id: this.quizId++,
      domanda: domanda,
      opzioni: this.mescolaArray(opzioni),
      rispostaCorretta: 0, // La prima è sempre quella corretta prima del mescolamento
      tipo: 'multipla',
      materia: materiaKey,
      argomento: argomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `L'analisi corretta considera ${concetto.spiegazione}`,
      difficolta: 'avanzato',
      punti: 20,
      livelloUniversitario: true
    };
  }

  // Quiz causa-effetto (solo per concetti significativi)
  generaQuizCausaEffetto(concetto, materiaKey, argomento, sottoargomento) {
    // FILTRO: Solo per autori, concetti, temi - MAI per anni isolati
    if (concetto.tipo === 'data' || concetto.tipo === 'periodo') {
      return null;
    }
    
    let domanda, opzioni;
    
    if (concetto.tipo === 'autore') {
      domanda = `Quale influenza esercita ${concetto.entitaPrincipale} nel panorama letterario del suo tempo?`;
      opzioni = [
        `${concetto.entitaPrincipale} introduce innovazioni che trasformano profondamente la letteratura`,
        `${concetto.entitaPrincipale} si limita a seguire le tendenze già consolidate`,
        `${concetto.entitaPrincipale} ha un impatto limitato ai circoli intellettuali ristretti`,
        `${concetto.entitaPrincipale} rappresenta solo una voce isolata nel panorama culturale`
      ];
    } else if (concetto.tipo === 'concetto' || concetto.tipo === 'tema') {
      domanda = `Come il tema del ${concetto.entitaPrincipale} influenza lo sviluppo narrativo in ${argomento.titolo}?`;
      opzioni = [
        `Il ${concetto.entitaPrincipale} diventa il motore principale della narrazione e della riflessione`,
        `Il ${concetto.entitaPrincipale} rimane sullo sfondo senza incidere sulla struttura`,
        `Il ${concetto.entitaPrincipale} viene utilizzato solo come elemento decorativo`,
        `Il ${concetto.entitaPrincipale} crea confusione nella coerenza dell'opera`
      ];
    } else {
      return null;
    }
    
    return {
      id: this.quizId++,
      domanda: domanda,
      opzioni: this.mescolaArray(opzioni),
      rispostaCorretta: 0,
      tipo: 'multipla',
      materia: materiaKey,
      argomento: argomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `${concetto.entitaPrincipale} esercita un'influenza determinante nel contesto`,
      difficolta: 'medio',
      punti: 15
    };
  }

  // Quiz cronologia eventi
  generaQuizCronologia(concetto, materiaKey, argomento, sottoargomento) {
    const domanda = `In quale sequenza cronologica si colloca ${concetto.entitaPrincipale}?`;
    
    const opzioni = [
      `${concetto.entitaPrincipale} precede cronologicamente gli sviluppi principali del ${argomento.titolo}`,
      `${concetto.entitaPrincipale} è contemporaneo ai momenti centrali del ${argomento.titolo}`,
      `${concetto.entitaPrincipale} segue temporalmente la fase culminante del ${argomento.titolo}`,
      `${concetto.entitaPrincipale} attraversa trasversalmente tutto il periodo del ${argomento.titolo}`
    ];
    
    return {
      id: this.quizId++,
      domanda: domanda,
      opzioni: this.mescolaArray(opzioni),
      rispostaCorretta: 0,
      tipo: 'multipla',
      materia: materiaKey,
      argomento: argomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `La collocazione cronologica di ${concetto.entitaPrincipale} è fondamentale`,
      difficolta: 'medio',
      punti: 15
    };
  }

  // Quiz definizione precisa (solo per concetti validi)
  generaQuizDefinizione(concetto, materiaKey, argomento, sottoargomento) {
    // FILTRO: Solo per concetti, temi, autori - MAI per anni isolati
    if (concetto.tipo === 'data' || concetto.tipo === 'periodo') {
      return null; // Non creare quiz di definizione per anni
    }
    
    let domanda, opzioni;
    
    if (concetto.tipo === 'autore') {
      domanda = `Quale caratteristica definisce meglio la poetica di ${concetto.entitaPrincipale}?`;
      opzioni = [
        `${concetto.entitaPrincipale} sviluppa una poetica innovativa che ${concetto.spiegazione}`,
        `${concetto.entitaPrincipale} si limita a imitare i modelli classici senza originalità`,
        `${concetto.entitaPrincipale} rappresenta solo una fase di transizione letteraria`,
        `${concetto.entitaPrincipale} non presenta elementi distintivi significativi`
      ];
    } else if (concetto.tipo === 'concetto' || concetto.tipo === 'tema') {
      domanda = `Come si manifesta il concetto di ${concetto.entitaPrincipale} nel contesto di ${argomento.titolo}?`;
      opzioni = [
        `Il ${concetto.entitaPrincipale} emerge come elemento centrale che ${concetto.spiegazione}`,
        `Il ${concetto.entitaPrincipale} rimane un aspetto marginale e poco sviluppato`,
        `Il ${concetto.entitaPrincipale} viene trattato solo superficialmente`,
        `Il ${concetto.entitaPrincipale} non trova una definizione precisa nell'opera`
      ];
    } else if (concetto.tipo === 'opera') {
      domanda = `Quale aspetto caratterizza principalmente "${concetto.entitaPrincipale}"?`;
      opzioni = [
        `"${concetto.entitaPrincipale}" rappresenta ${concetto.spiegazione} con innovazioni stilistiche`,
        `"${concetto.entitaPrincipale}" segue pedissequamente i modelli tradizionali`,
        `"${concetto.entitaPrincipale}" presenta solo valore documentario`,
        `"${concetto.entitaPrincipale}" manca di coerenza strutturale`
      ];
    } else {
      return null; // Non creare quiz per tipi non riconosciuti
    }
    
    return {
      id: this.quizId++,
      domanda: domanda,
      opzioni: this.mescolaArray(opzioni),
      rispostaCorretta: 0,
      tipo: 'multipla',
      materia: materiaKey,
      argomento: argomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `L'analisi evidenzia come ${concetto.entitaPrincipale} ${concetto.spiegazione}`,
      difficolta: 'avanzato',
      punti: 20
    };
  }

  // Quiz di confronto concetti
  generaQuizConfronto(concetto, materiaKey, argomento, sottoargomento) {
    const bancaDati = this.bancaDatiConoscenze[materiaKey];
    if (!bancaDati) return null;
    
    const concettiSimili = this.trovaConcettiSimili(concetto, bancaDati);
    if (concettiSimili.length < 2) return null;
    
    const domanda = `Confrontando ${concetto.entitaPrincipale} con ${concettiSimili[0]}, quale differenza fondamentale emerge?`;
    
    const opzioni = this.generatoreOpzioni.creaOpzioniConfronto(concetto, concettiSimili[0], bancaDati);
    
    return {
      id: this.quizId++,
      domanda: domanda,
      opzioni: this.mescolaArray(opzioni),
      rispostaCorretta: 0,
      tipo: 'multipla',
      materia: materiaKey,
      argomento: argomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `La differenza chiave risiede in ${concetto.caratteristicheDistintive}`,
      difficolta: 'medio',
      punti: 15,
      livelloUniversitario: true
    };
  }

  // Trova concetti simili per confronti
  trovaConcettiSimili(concetto, bancaDati) {
    // Logica sofisticata per trovare concetti correlati
    const simili = [];
    
    if (bancaDati.autori && concetto.tipo === 'autore') {
      const autoreCorrente = bancaDati.autori[concetto.entitaPrincipale];
      if (autoreCorrente) {
        for (const [nome, dati] of Object.entries(bancaDati.autori)) {
          if (nome !== concetto.entitaPrincipale && 
              dati.movimento === autoreCorrente.movimento) {
            simili.push(nome);
          }
        }
      }
    }
    
    return simili;
  }

  // ==================== GENERATORI SPECIFICI PER MATERIA ====================

  // ITALIANO - Come un professore di letteratura
  generaQuizItaliano(concetto, argomento, sottoargomento) {
    const quiz = [];
    
    if (concetto.tipo === 'autore') {
      // EVITA ripetizioni assurde - controlla che autore e argomento siano diversi
      if (concetto.entitaPrincipale.includes(argomento.titolo) || argomento.titolo.includes(concetto.entitaPrincipale)) {
        // Se l'autore è lo stesso dell'argomento, fai domanda diversa
        quiz.push({
          id: this.quizId++,
          domanda: `Quale innovazione stilistica caratterizza la produzione letteraria di ${concetto.entitaPrincipale}?`,
          opzioni: this.mescolaArray([
            `Introduce tecniche narrative e poetiche che rinnovano profondamente la tradizione letteraria italiana`,
            `Si attiene rigidamente ai modelli classici senza apportare contributi originali`,
            `Utilizza uno stile artificioso che compromette la chiarezza espressiva`,
            `Manca di coerenza stilistica tra le diverse fasi della sua produzione`
          ]),
          rispostaCorretta: 0,
          tipo: 'multipla',
          materia: 'italiano',
          argomento: argomento.titolo,
          sottoargomento: sottoargomento.titolo,
          spiegazione: `${concetto.entitaPrincipale} rappresenta una figura innovativa nel panorama letterario italiano`,
          difficolta: 'avanzato',
          punti: 20
        });
      } else {
        // Se sono diversi, fai domanda normale
        quiz.push({
          id: this.quizId++,
          domanda: `Come si colloca ${concetto.entitaPrincipale} rispetto alla tradizione letteraria del ${argomento.titolo}?`,
          opzioni: this.mescolaArray([
            `Rappresenta una sintesi innovativa che coniuga tradizione e modernità`,
            `Si limita a imitare pedissequamente i modelli del passato`,
            `Rompe completamente con la tradizione senza offrire alternative valide`,
            `Mantiene una posizione marginale senza influenzare gli sviluppi letterari`
          ]),
          rispostaCorretta: 0,
          tipo: 'multipla',
          materia: 'italiano',
          argomento: argomento.titolo,
          sottoargomento: sottoargomento.titolo,
          spiegazione: `${concetto.entitaPrincipale} occupa una posizione significativa nel panorama letterario`,
          difficolta: 'avanzato',
          punti: 20
        });
      }
      
      // Quiz su influenze letterarie
      quiz.push({
        id: this.quizId++,
        domanda: `Come si inserisce ${concetto.entitaPrincipale} nel panorama letterario del suo tempo?`,
        opzioni: this.mescolaArray([
          `Rappresenta una sintesi innovativa tra tradizione e modernità, influenzando profondamente la letteratura successiva`,
          `Rimane isolato nel panorama culturale senza esercitare influenze significative`,
          `Si limita a seguire le mode letterarie del momento senza apportare contributi originali`,
          `Appartiene a una corrente letteraria ormai superata e priva di attualità`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'italiano',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `${concetto.entitaPrincipale} occupa una posizione centrale nel panorama letterario per la sua capacità di innovare`,
        difficolta: 'medio',
        punti: 15
      });
    }
    
    if (concetto.tipo === 'tema' || concetto.tipo === 'concetto') {
      // Quiz su temi letterari
      quiz.push({
        id: this.quizId++,
        domanda: `In che modo il tema del ${concetto.entitaPrincipale} si articola nell'opera di ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Diventa il nucleo centrale dell'ispirazione poetica, strutturando l'intera visione dell'autore`,
          `Viene trattato solo marginalmente come elemento decorativo`,
          `Appare sporadicamente senza una coerente elaborazione tematica`,
          `Rimane confinato a pochi componimenti senza incidere sulla poetica generale`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'italiano',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `Il tema del ${concetto.entitaPrincipale} rappresenta una chiave interpretativa fondamentale`,
        difficolta: 'avanzato',
        punti: 20
      });
    }
    
    if (concetto.tipo === 'opera') {
      // Quiz su analisi dell'opera
      quiz.push({
        id: this.quizId++,
        domanda: `Quale innovazione stilistica caratterizza "${concetto.entitaPrincipale}"?`,
        opzioni: this.mescolaArray([
          `L'introduzione di tecniche narrative che rinnovano profondamente il genere letterario`,
          `Il rispetto rigoroso delle convenzioni tradizionali senza alcuna sperimentazione`,
          `L'uso di uno stile arcaizzante che guarda esclusivamente al passato`,
          `La mancanza di coerenza stilistica che compromette l'unità dell'opera`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'italiano',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `"${concetto.entitaPrincipale}" rappresenta un momento di svolta nella storia letteraria`,
        difficolta: 'avanzato',
        punti: 20
      });
    }
    
    // Aggiungi quiz VERO/FALSO per Italiano
    if (concetto.tipo === 'tema' || concetto.tipo === 'concetto') {
      quiz.push({
        id: this.quizId++,
        domanda: `Il tema del ${concetto.entitaPrincipale} rappresenta un elemento marginale nella produzione di ${argomento.titolo}.`,
        rispostaCorretta: false,
        tipo: 'vero_falso',
        materia: 'italiano',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `FALSO. Il tema del ${concetto.entitaPrincipale} è centrale nell'elaborazione poetica di ${argomento.titolo}`,
        difficolta: 'facile',
        punti: 10
      });
    }
    
    return quiz.slice(0, 3); // Massimo 3 quiz per concetto (inclusi vero/falso)
  }

  // STORIA - Come un professore di storia
  generaQuizStoria(concetto, argomento, sottoargomento) {
    const quiz = [];
    
    if (concetto.tipo === 'autore') { // Personaggi storici
      quiz.push({
        id: this.quizId++,
        domanda: `Quale ruolo storico svolge ${concetto.entitaPrincipale} nel contesto di ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Rappresenta una figura chiave che determina svolte decisive negli eventi storici`,
          `Mantiene una posizione marginale senza influenzare significativamente gli eventi`,
          `Agisce esclusivamente come esecutore di decisioni altrui`,
          `La sua importanza è stata sopravvalutata dalla storiografia tradizionale`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'storia',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `${concetto.entitaPrincipale} esercita un'influenza determinante sugli sviluppi storici del periodo`,
        difficolta: 'medio',
        punti: 15
      });
    }
    
    if (concetto.tipo === 'concetto' || concetto.tipo === 'tema') {
      quiz.push({
        id: this.quizId++,
        domanda: `Come si manifesta il fenomeno del ${concetto.entitaPrincipale} nel periodo storico di ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Costituisce un fattore strutturale che condiziona profondamente l'evoluzione sociale e politica`,
          `Rappresenta solo un episodio isolato senza conseguenze durature`,
          `Si limita a riflettere tendenze già consolidate senza apportare novità`,
          `Rimane confinato a specifici gruppi sociali senza diffusione generale`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'storia',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `Il ${concetto.entitaPrincipale} rappresenta un elemento caratterizzante del periodo storico`,
        difficolta: 'avanzato',
        punti: 20
      });
    }
    
    if (concetto.tipo === 'periodo') {
      quiz.push({
        id: this.quizId++,
        domanda: `Quali trasformazioni caratterizzano il ${concetto.entitaPrincipale} in relazione a ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Si verificano cambiamenti strutturali che ridefiniscono gli equilibri politici e sociali`,
          `Prevale una sostanziale continuità con il periodo precedente`,
          `Le trasformazioni riguardano solo aspetti superficiali della società`,
          `I cambiamenti sono limitati alle élite dirigenti senza coinvolgere le masse`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'storia',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `Il periodo è caratterizzato da trasformazioni profonde che segnano una svolta storica`,
        difficolta: 'avanzato',
        punti: 20
      });
    }
    
    // Aggiungi quiz VERO/FALSO per Storia
    if (concetto.tipo === 'concetto' || concetto.tipo === 'tema') {
      quiz.push({
        id: this.quizId++,
        domanda: `Il fenomeno del ${concetto.entitaPrincipale} ha avuto un impatto limitato sugli sviluppi storici di ${argomento.titolo}.`,
        rispostaCorretta: false,
        tipo: 'vero_falso',
        materia: 'storia',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `FALSO. Il ${concetto.entitaPrincipale} ha esercitato un'influenza determinante sugli eventi storici`,
        difficolta: 'facile',
        punti: 10
      });
    }
    
    return quiz.slice(0, 3);
  }

  // FILOSOFIA - Come un professore di filosofia
  generaQuizFilosofia(concetto, argomento, sottoargomento) {
    const quiz = [];
    
    if (concetto.tipo === 'autore') { // Filosofi
      quiz.push({
        id: this.quizId++,
        domanda: `Quale contributo teorico apporta ${concetto.entitaPrincipale} al dibattito filosofico del ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Introduce categorie concettuali innovative che ridefiniscono i termini del problema filosofico`,
          `Si limita a riproporre tesi già elaborate da altri filosofi`,
          `Sviluppa solo aspetti marginali senza toccare i nodi teorici fondamentali`,
          `La sua filosofia risulta incoerente e priva di sistematicità`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'filosofia',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `${concetto.entitaPrincipale} elabora una prospettiva filosofica originale e sistematica`,
        difficolta: 'avanzato',
        punti: 20
      });
    }
    
    if (concetto.tipo === 'concetto' || concetto.tipo === 'tema') {
      quiz.push({
        id: this.quizId++,
        domanda: `Come viene elaborato il concetto di ${concetto.entitaPrincipale} nel sistema filosofico di ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Diventa una categoria fondamentale che struttura l'intera architettura teorica`,
          `Viene trattato solo incidentalmente senza sviluppi sistematici`,
          `Rimane ambiguo e non sufficientemente definito`,
          `Viene mutuato acriticamente dalla tradizione filosofica precedente`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'filosofia',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `Il concetto di ${concetto.entitaPrincipale} assume un ruolo centrale nell'elaborazione teorica`,
        difficolta: 'avanzato',
        punti: 20
      });
    }
    
    return quiz.slice(0, 2);
  }

  // MATEMATICA - Come un professore di matematica
  generaQuizMatematica(concetto, argomento, sottoargomento) {
    const quiz = [];
    
    if (concetto.tipo === 'concetto' || concetto.tipo === 'tema') {
      quiz.push({
        id: this.quizId++,
        domanda: `Quale proprietà fondamentale caratterizza il concetto di ${concetto.entitaPrincipale} nel contesto di ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Soddisfa condizioni rigorose che ne garantiscono l'applicabilità in contesti matematici specifici`,
          `Presenta definizioni ambigue che ne limitano l'utilizzo pratico`,
          `È valido solo in casi particolari senza generalizzazioni possibili`,
          `Manca di fondamenti teorici solidi nella matematica moderna`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'matematica',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `Il concetto di ${concetto.entitaPrincipale} è fondamentale per la comprensione teorica e applicativa`,
        difficolta: 'avanzato',
        punti: 20
      });
      
      quiz.push({
        id: this.quizId++,
        domanda: `Come si applica il principio del ${concetto.entitaPrincipale} nella risoluzione di problemi matematici?`,
        opzioni: this.mescolaArray([
          `Fornisce un metodo sistematico per affrontare una classe specifica di problemi`,
          `Si limita a casi elementari senza estensioni significative`,
          `Richiede sempre l'uso di tecniche computazionali avanzate`,
          `È puramente teorico senza applicazioni pratiche`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'matematica',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `Il principio offre strumenti metodologici per la risoluzione sistematica di problemi`,
        difficolta: 'medio',
        punti: 15
      });
    }
    
    return quiz.slice(0, 2);
  }

  // FISICA - Come un professore di fisica
  generaQuizFisica(concetto, argomento, sottoargomento) {
    const quiz = [];
    
    if (concetto.tipo === 'concetto' || concetto.tipo === 'tema') {
      quiz.push({
        id: this.quizId++,
        domanda: `Quale principio fisico governa il fenomeno del ${concetto.entitaPrincipale} nel contesto di ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `È regolato da leggi fondamentali che descrivono quantitativamente il comportamento del sistema`,
          `Dipende esclusivamente da fattori casuali non prevedibili`,
          `È spiegabile solo attraverso modelli approssimativi`,
          `Non segue alcuna legge fisica riconosciuta`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'fisica',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `Il fenomeno è governato da principi fisici fondamentali che ne determinano il comportamento`,
        difficolta: 'avanzato',
        punti: 20
      });
      
      quiz.push({
        id: this.quizId++,
        domanda: `Come si manifesta sperimentalmente il ${concetto.entitaPrincipale} negli esperimenti di ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Produce effetti misurabili che confermano le previsioni teoriche del modello`,
          `Genera risultati contraddittori che mettono in dubbio la teoria`,
          `È osservabile solo in condizioni di laboratorio estreme`,
          `Non presenta evidenze sperimentali convincenti`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'fisica',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `Le evidenze sperimentali confermano la validità del modello teorico`,
        difficolta: 'medio',
        punti: 15
      });
    }
    
    return quiz.slice(0, 2);
  }

  // LATINO - Come un professore di latino
  generaQuizLatino(concetto, argomento, sottoargomento) {
    const quiz = [];
    
    if (concetto.tipo === 'autore') {
      quiz.push({
        id: this.quizId++,
        domanda: `Quale caratteristica stilistica distingue ${concetto.entitaPrincipale} nel panorama letterario di ${argomento.titolo}?`,
        opzioni: this.mescolaArray([
          `Sviluppa un linguaggio poetico che coniuga tradizione classica e innovazione espressiva`,
          `Si attiene rigidamente ai modelli arcaici senza originalità`,
          `Utilizza uno stile artificioso che compromette la chiarezza espositiva`,
          `Manca di coerenza stilistica nelle diverse opere`
        ]),
        rispostaCorretta: 0,
        tipo: 'multipla',
        materia: 'latino',
        argomento: argomento.titolo,
        sottoargomento: sottoargomento.titolo,
        spiegazione: `${concetto.entitaPrincipale} rappresenta una sintesi originale tra tradizione e innovazione`,
        difficolta: 'avanzato',
        punti: 20
      });
    }
    
    return quiz.slice(0, 1);
  }

  // GENERICO - Per materie non specificate
  generaQuizGenerico(concetto, argomento, sottoargomento, materia) {
    const quiz = [];
    
    quiz.push({
      id: this.quizId++,
      domanda: `Quale ruolo svolge ${concetto.entitaPrincipale} nel contesto di ${argomento.titolo}?`,
      opzioni: this.mescolaArray([
        `Rappresenta un elemento centrale per la comprensione dell'argomento`,
        `Ha un'importanza marginale nel quadro generale`,
        `È un aspetto puramente accessorio`,
        `Non presenta collegamenti significativi con il tema`
      ]),
      rispostaCorretta: 0,
      tipo: 'multipla',
      materia: materia,
      argomento: argomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `${concetto.entitaPrincipale} è fondamentale per la comprensione del tema`,
      difficolta: 'medio',
      punti: 15
    });
    
    return quiz;
  }

  // Metodi di utilità
  mescolaArray(array) {
    const mescolato = [...array];
    for (let i = mescolato.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mescolato[i], mescolato[j]] = [mescolato[j], mescolato[i]];
    }
    return mescolato;
  }

  // Metodi per compatibilità con il server esistente
  getQuizPerMateria(materia, limit = 20) {
    const materiaNormalizzata = materia.toLowerCase();
    let quizFiltrati = this.quizDatabase
      .filter(quiz => quiz.materia && quiz.materia.toLowerCase() === materiaNormalizzata);
    
    return this.mescolaArray(quizFiltrati).slice(0, limit);
  }

  getQuizPerDifficoltaMixMaterie(difficolta, limit = 20) {
    const difficoltaNormalizzata = difficolta.toLowerCase();
    let quizFiltrati = this.quizDatabase
      .filter(quiz => {
        if (!quiz.difficolta || !quiz.materia) return false;
        const diff = quiz.difficolta.toLowerCase();
        return diff === difficoltaNormalizzata;
      });
    
    return this.mescolaArray(quizFiltrati).slice(0, limit);
  }

  getQuizSbagliati(quizSbagliatiIds = [], limit = 10) {
    if (quizSbagliatiIds.length === 0) {
      return this.mescolaArray([...this.quizDatabase]).slice(0, limit);
    }
    
    const quizSbagliati = this.quizDatabase.filter(quiz => 
      quizSbagliatiIds.includes(quiz.id)
    );
    
    if (quizSbagliati.length < limit) {
      const materieQuizSbagliati = [...new Set(quizSbagliati.map(q => q.materia))];
      const quizSimili = this.quizDatabase.filter(quiz => 
        materieQuizSbagliati.includes(quiz.materia) && 
        !quizSbagliatiIds.includes(quiz.id)
      );
      
      const quizAggiuntivi = this.mescolaArray(quizSimili).slice(0, limit - quizSbagliati.length);
      return this.mescolaArray([...quizSbagliati, ...quizAggiuntivi]);
    }
    
    return this.mescolaArray(quizSbagliati).slice(0, limit);
  }

  getSimulazioneEsame(numDomande = 40) {
    const quiz = [];
    const materieDisponibili = [...new Set(this.quizDatabase.map(q => q.materia))];
    
    const quizPerMateria = Math.floor(numDomande / materieDisponibili.length);
    
    for (const materia of materieDisponibili) {
      const quizMateria = this.mescolaArray(
        this.quizDatabase.filter(q => q.materia === materia)
      ).slice(0, quizPerMateria);
      quiz.push(...quizMateria);
    }
    
    return this.mescolaArray(quiz).slice(0, numDomande);
  }

  getStats() {
    const stats = {
      totaleQuiz: this.quizDatabase.length,
      quizPerMateria: {},
      quizPerTipo: { multipla: 0, vero_falso: 0 }
    };
    
    this.quizDatabase.forEach(quiz => {
      stats.quizPerMateria[quiz.materia] = (stats.quizPerMateria[quiz.materia] || 0) + 1;
      stats.quizPerTipo[quiz.tipo] = (stats.quizPerTipo[quiz.tipo] || 0) + 1;
    });
    
    return stats;
  }
}

// Classe per analisi semantica avanzata
class AnalizzatoreSemantico {
  analizza(testo, materia, argomento, sottoargomento) {
    const concetti = [];
    
    // Estrai entità nominate (persone, luoghi, date, opere)
    const entitaNominate = this.estraiEntitaNominate(testo);
    
    // Analizza relazioni semantiche
    const relazioni = this.analizzaRelazioni(testo, entitaNominate);
    
    // Identifica concetti chiave
    for (const entita of entitaNominate) {
      const concetto = {
        entitaPrincipale: entita.nome,
        tipo: entita.tipo,
        contesto: argomento.titolo,
        relazioni: relazioni.filter(r => r.soggetto === entita.nome || r.oggetto === entita.nome),
        spiegazione: this.generaSpiegazione(entita, relazioni, testo),
        caratteristicheDistintive: this.estraiCaratteristiche(entita, testo)
      };
      concetti.push(concetto);
    }
    
    return { concetti, entitaNominate, relazioni };
  }

  estraiEntitaNominate(testo) {
    const entita = [];
    
    // BANCA DATI INTELLIGENTE - Solo concetti realmente significativi
    const concettiLetterari = {
      'italiano': [
        'romanticismo', 'verismo', 'decadentismo', 'simbolismo', 'futurismo', 'ermetismo', 
        'crepuscolarismo', 'umorismo', 'stilnovo', 'dolce stil novo', 'neoclassicismo',
        'realismo', 'naturalismo', 'scapigliatura', 'preromanticismo'
      ],
      'filosofia': [
        'idealismo', 'positivismo', 'esistenzialismo', 'fenomenologia', 'strutturalismo',
        'empirismo', 'razionalismo', 'materialismo', 'spiritualismo', 'pragmatismo',
        'relativismo', 'nichilismo', 'pessimismo', 'ottimismo', 'determinismo'
      ],
      'storia': [
        'rivoluzione', 'restaurazione', 'risorgimento', 'unificazione', 'nazionalismo',
        'liberalismo', 'socialismo', 'fascismo', 'democrazia', 'assolutismo',
        'costituzionalismo', 'imperialismo', 'colonialismo'
      ]
    };
    
    const temiUniversali = [
      'amore', 'morte', 'tempo', 'memoria', 'natura', 'progresso', 'società', 'famiglia',
      'identità', 'alienazione', 'incomunicabilità', 'crisi', 'maschera', 'apparenza', 
      'realtà', 'libertà', 'giustizia', 'bellezza', 'verità', 'dolore', 'felicità',
      'solitudine', 'passione', 'ragione', 'sentimento', 'tradizione', 'modernità'
    ];
    
    const autoriRiconosciuti = [
      'Dante Alighieri', 'Francesco Petrarca', 'Giovanni Boccaccio', 'Ugo Foscolo',
      'Alessandro Manzoni', 'Giacomo Leopardi', 'Giovanni Verga', 'Gabriele D\'Annunzio',
      'Giovanni Pascoli', 'Luigi Pirandello', 'Italo Svevo', 'Giuseppe Ungaretti',
      'Eugenio Montale', 'Salvatore Quasimodo', 'Immanuel Kant', 'Georg Hegel',
      'Arthur Schopenhauer', 'Friedrich Nietzsche', 'Karl Marx', 'Sigmund Freud'
    ];
    
    // Estrai solo concetti realmente presenti e significativi
    const testoLower = testo.toLowerCase();
    
    // Cerca concetti letterari/filosofici specifici
    Object.values(concettiLetterari).flat().forEach(concetto => {
      if (testoLower.includes(concetto.toLowerCase())) {
        entita.push({ 
          nome: concetto, 
          tipo: 'concetto',
          contesto: testo.substring(Math.max(0, testoLower.indexOf(concetto) - 50), testoLower.indexOf(concetto) + 100)
        });
      }
    });
    
    // Cerca temi universali
    temiUniversali.forEach(tema => {
      if (testoLower.includes(tema)) {
        entita.push({ 
          nome: tema, 
          tipo: 'tema',
          contesto: testo.substring(Math.max(0, testoLower.indexOf(tema) - 50), testoLower.indexOf(tema) + 100)
        });
      }
    });
    
    // Cerca autori riconosciuti
    autoriRiconosciuti.forEach(autore => {
      if (testo.includes(autore) || testo.includes(autore.split(' ').pop())) {
        entita.push({ 
          nome: autore, 
          tipo: 'autore',
          contesto: testo.substring(Math.max(0, testo.indexOf(autore.split(' ').pop()) - 50), testo.indexOf(autore.split(' ').pop()) + 100)
        });
      }
    });
    
    // Filtra duplicati e mantieni solo i più significativi
    const entitaUniche = [];
    const nomiVisti = new Set();
    
    entita.forEach(e => {
      if (!nomiVisti.has(e.nome.toLowerCase()) && e.nome.length > 3) {
        nomiVisti.add(e.nome.toLowerCase());
        entitaUniche.push(e);
      }
    });
    
    return entitaUniche.slice(0, 5); // Massimo 5 entità per evitare sovraccarico
  }

  analizzaRelazioni(testo, entita) {
    const relazioni = [];
    
    // Pattern per relazioni temporali
    const patternTemporali = [
      /(\w+)\s+(nasce|muore|scrive|pubblica)\s+(nel|tra il)\s+(\d{4})/gi,
      /(\w+)\s+(è|era|fu)\s+([^.]+)/gi
    ];
    
    patternTemporali.forEach(pattern => {
      let match;
      while ((match = pattern.exec(testo)) !== null) {
        relazioni.push({
          soggetto: match[1],
          predicato: match[2],
          oggetto: match[3] + (match[4] || ''),
          tipo: 'temporale'
        });
      }
    });
    
    return relazioni;
  }

  generaSpiegazione(entita, relazioni, testo) {
    // Genera spiegazioni intelligenti basate sul tipo di entità
    switch (entita.tipo) {
      case 'autore':
        return `sviluppa una poetica originale che si manifesta attraverso innovazioni stilistiche e tematiche`;
      case 'concetto':
        return `rappresenta una categoria fondamentale per la comprensione del periodo storico-culturale`;
      case 'tema':
        return `costituisce un nucleo tematico centrale che attraversa e caratterizza l'intera produzione`;
      default:
        return `è un elemento significativo per la comprensione del contesto`;
    }
  }

  estraiCaratteristiche(entita, testo) {
    // Caratteristiche intelligenti basate sul tipo
    const caratteristichePerTipo = {
      'autore': 'innovazioni stilistiche e contenutistiche',
      'concetto': 'rilevanza teorica e metodologica',
      'tema': 'centralità nell\'elaborazione poetica',
      'opera': 'originalità strutturale e linguistica'
    };
    
    return caratteristichePerTipo[entita.tipo] || 'specificità nel contesto disciplinare';
  }

  // Estrai frasi significative per quiz aggiuntivi
  estraiFrasiPerQuiz(riassunto) {
    if (!riassunto || riassunto.length < 100) return [];
    
    const frasi = riassunto.split(/\. /).map(f => f.trim());
    
    return frasi.filter(frase => {
      // Criteri per frasi significative
      return frase.length >= 50 && 
             frase.length <= 200 && 
             frase.split(' ').length >= 8 &&
             !frase.includes('...') &&
             (frase.includes('è') || frase.includes('sono') || frase.includes('rappresenta') || frase.includes('costituisce'));
    }).slice(0, 5);
  }

  // Genera quiz da frase significativa
  generaQuizDaFrase(frase, materiaKey, argomento, sottoargomento) {
    // 70% vero/falso, 30% multipla per varietà
    if (Math.random() < 0.7) {
      return this.generaVeroFalsoIntelligente(frase, materiaKey, argomento, sottoargomento);
    } else {
      return this.generaMultiplaIntelligente(frase, materiaKey, argomento, sottoargomento);
    }
  }

  // Genera vero/falso intelligente da frase
  generaVeroFalsoIntelligente(frase, materiaKey, argomento, sottoargomento) {
    // 50% vero, 50% falso
    const èVero = Math.random() < 0.5;
    let domanda = frase.endsWith('.') ? frase : frase + '.';
    
    if (!èVero) {
      // Rendi la frase falsa in modo intelligente
      domanda = this.rendiFraseFalsa(frase);
      if (!domanda || domanda === frase) {
        domanda = frase;
        return {
          id: this.quizId++,
          domanda: domanda,
          rispostaCorretta: true,
          tipo: 'vero_falso',
          materia: materiaKey,
          argomento: argomento.titolo,
          sottoargomento: sottoargomento.titolo,
          spiegazione: `VERO. L'affermazione è corretta secondo i contenuti di ${argomento.titolo}`,
          difficolta: 'facile',
          punti: 10
        };
      }
    }
    
    return {
      id: this.quizId++,
      domanda: domanda,
      rispostaCorretta: èVero,
      tipo: 'vero_falso',
      materia: materiaKey,
      argomento: argomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: èVero ? 
        `VERO. L'affermazione è corretta secondo i contenuti di ${argomento.titolo}` :
        `FALSO. La versione corretta si trova nei contenuti di ${argomento.titolo}`,
      difficolta: 'facile',
      punti: 10
    };
  }

  // Rendi frase falsa in modo intelligente
  rendiFraseFalsa(frase) {
    // Modifiche intelligenti per rendere falsa
    const modifiche = [
      { da: /\bè\b/g, a: 'non è' },
      { da: /\bsono\b/g, a: 'non sono' },
      { da: /\brappresenta\b/g, a: 'non rappresenta' },
      { da: /\bcostitui(sce|scono)\b/g, a: 'non costituisce' },
      { da: /\bimportante\b/g, a: 'marginale' },
      { da: /\bcentrale\b/g, a: 'secondario' },
      { da: /\bfondamentale\b/g, a: 'accessorio' },
      { da: /\bprimo\b/g, a: 'ultimo' },
      { da: /\binnovativ[oa]\b/g, a: 'tradizionale' }
    ];
    
    for (const modifica of modifiche) {
      if (modifica.da.test(frase)) {
        return frase.replace(modifica.da, modifica.a);
      }
    }
    
    return null;
  }

  // Genera multipla intelligente da frase
  generaMultiplaIntelligente(frase, materiaKey, argomento, sottoargomento) {
    const domanda = `Quale delle seguenti affermazioni su ${argomento.titolo} è corretta?`;
    
    const opzioni = this.mescolaArray([
      frase.endsWith('.') ? frase : frase + '.',
      `Questa informazione non trova riscontro nei contenuti di ${argomento.titolo}`,
      `L'argomento viene trattato in modo completamente diverso in ${argomento.titolo}`,
      `Questa teoria è stata superata dagli sviluppi più recenti di ${argomento.titolo}`
    ]);
    
    return {
      id: this.quizId++,
      domanda: domanda,
      opzioni: opzioni,
      rispostaCorretta: 0,
      tipo: 'multipla',
      materia: materiaKey,
      argomento: argomento.titolo,
      sottoargomento: sottoargomento.titolo,
      spiegazione: `La risposta corretta è basata sui contenuti specifici di ${argomento.titolo}`,
      difficolta: 'medio',
      punti: 15
    };
  }

  creaOpzioniAnalisiCritica(concetto, bancaDati, materia) {
    const opzioni = [];
    
    // Opzione corretta (sempre per prima)
    opzioni.push(`${concetto.entitaPrincipale} rappresenta un elemento fondamentale per comprendere ${concetto.spiegazione}`);
    
    // Opzioni plausibili ma errate
    if (bancaDati.autori && concetto.tipo === 'autore') {
      const autore = bancaDati.autori[concetto.entitaPrincipale];
      if (autore) {
        // Opzione con epoca sbagliata
        const epocheAlternative = ['Medioevo', 'Rinascimento', 'Barocco', 'Illuminismo', 'Romanticismo', 'Realismo'];
        const epocaSbagliata = epocheAlternative.find(e => e !== autore.epoca) || 'Novecento';
        opzioni.push(`${concetto.entitaPrincipale} è principalmente influenzato dalle correnti del ${epocaSbagliata}, come dimostrano le sue opere principali`);
        
        // Opzione con movimento sbagliato
        const movimentiAlternativi = ['Classicismo', 'Simbolismo', 'Futurismo', 'Ermetismo'];
        const movimentoSbagliato = movimentiAlternativi.find(m => m !== autore.movimento) || 'Modernismo';
        opzioni.push(`L'analisi critica evidenzia come ${concetto.entitaPrincipale} sia un precursore del ${movimentoSbagliato} italiano`);
        
        // Opzione con interpretazione parziale
        opzioni.push(`${concetto.entitaPrincipale} può essere compreso solo attraverso un'analisi biografica, trascurando il contesto storico-culturale`);
      }
    }
    
    return opzioni;
  }

  creaOpzioniConfronto(concetto1, concetto2, bancaDati) {
    const opzioni = [];
    
    // Opzione corretta
    opzioni.push(`${concetto1.entitaPrincipale} si distingue da ${concetto2} per ${concetto1.caratteristicheDistintive}`);
    
    // Opzioni errate ma plausibili
    opzioni.push(`Entrambi condividono la stessa visione estetica e gli stessi riferimenti culturali`);
    opzioni.push(`La differenza è puramente cronologica, senza implicazioni stilistiche o contenutistiche`);
    opzioni.push(`${concetto2} rappresenta un'evoluzione diretta e lineare di ${concetto1.entitaPrincipale}`);
    
    return opzioni;
  }
}

module.exports = QuizGeneratoreUniversitario;
