const express = require('express');
const router = express.Router();
const GamificationService = require('../services/gamification-service');

// Inizializza il servizio gamification
const gamification = new GamificationService();

// Funzione per ottenere icona materia
function getIconaMateria(materia) {
  const icone = {
    'italiano': '📘', 'storia': '📗', 'filosofia': '📙', 'scienze': '🔬',
    'latino': '📜', 'arte': '🎨', 'matematica': '🧮', 'fisica': '⚛️',
    'inglese': '🌍', 'religione': '✝️'
  };
  return icone[materia?.toLowerCase()] || '📖';
}

// GET /api/quiz-completo/all - Tutti i quiz (paginati)
router.get('/all', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  const quizGenerator = req.app.locals.quizGenerator;
  if (!quizGenerator) {
    return res.status(500).json({ error: 'Generatore quiz non inizializzato' });
  }
  
  const tuttiQuiz = quizGenerator.quizDatabase;
  const paginati = tuttiQuiz.slice(skip, skip + limit);
  
  res.json({
    quiz: paginati,
    totale: tuttiQuiz.length,
    pagina: page,
    totalePagine: Math.ceil(tuttiQuiz.length / limit),
    // 🤖 Statistiche AI se disponibili
    aiStats: quizGenerator.getStats ? {
      aiEnhanced: tuttiQuiz.filter(q => q.fonte === 'AI-Enhanced').length,
      classic: tuttiQuiz.filter(q => q.fonte === 'Classic').length,
      qualitaMedia: quizGenerator.getStats().quizPerFonte
    } : null
  });
});

// GET /api/quiz-completo/materia/:nome - Quiz per materia
router.get('/materia/:nome', (req, res) => {
  const { nome } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  
  const quizGenerator = req.app.locals.quizGenerator;
  if (!quizGenerator) {
    return res.status(500).json({ error: 'Generatore quiz non inizializzato' });
  }
  
  const quiz = quizGenerator.getQuizPerMateria(nome, limit);
  
  // Aggiungi campi di sicurezza per evitare errori frontend
  const quizSicuri = quiz.map(q => ({
    ...q,
    materia: q.materia || nome,
    materiaDisplay: `${q.materia || nome}`.charAt(0).toUpperCase() + `${q.materia || nome}`.slice(1),
    icona: getIconaMateria(q.materia || nome),
    // Trasforma opzioni per compatibilità frontend
    opzioni: q.opzioni ? q.opzioni.map((opzione, idx) => ({
      id: String.fromCharCode(97 + idx), // a, b, c, d
      testo: opzione
    })) : [],
    // Converti risposta corretta da indice numerico a lettera
    rispostaCorretta: q.opzioni && typeof q.rispostaCorretta === 'number' ? 
      String.fromCharCode(97 + q.rispostaCorretta) : q.rispostaCorretta
  }));
  
  res.json({ quiz: quizSicuri, totale: quizSicuri.length });
});

// GET /api/quiz-completo/difficolta/:livello - Quiz per difficoltà (MIX MATERIE)
router.get('/difficolta/:livello', (req, res) => {
  const { livello } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  
  const quizGenerator = req.app.locals.quizGenerator;
  if (!quizGenerator) {
    return res.status(500).json({ error: 'Generatore quiz non inizializzato' });
  }
  
  // Mappa livelli per compatibilità frontend
  let livelloMappato = livello.toLowerCase();
  if (livelloMappato === 'intermedio') livelloMappato = 'medio';
  if (livelloMappato === 'avanzato') livelloMappato = 'medio'; // Fallback
  
  // Ottieni quiz per difficoltà da TUTTE le materie e mescola
  const quiz = quizGenerator.getQuizPerDifficoltaMixMaterie(livelloMappato, limit);
  
  // Aggiungi campi di sicurezza per evitare errori frontend
  const quizSicuri = quiz.map(q => ({
    ...q,
    materia: q.materia || 'generale',
    materiaDisplay: `${q.materia || 'generale'}`.charAt(0).toUpperCase() + `${q.materia || 'generale'}`.slice(1),
    icona: getIconaMateria(q.materia || 'generale'),
    // Trasforma opzioni per compatibilità frontend
    opzioni: q.opzioni ? q.opzioni.map((opzione, idx) => ({
      id: String.fromCharCode(97 + idx), // a, b, c, d
      testo: opzione
    })) : [],
    // Converti risposta corretta da indice numerico a lettera
    rispostaCorretta: q.opzioni && typeof q.rispostaCorretta === 'number' ? 
      String.fromCharCode(97 + q.rispostaCorretta) : q.rispostaCorretta
  }));
  
  res.json({ quiz: quizSicuri, totale: quizSicuri.length });
});

// GET /api/quiz-completo/sbagliati - Quiz sbagliati per ripasso
router.get('/sbagliati', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const quizSbagliatiIds = req.query.ids ? req.query.ids.split(',').map(id => parseInt(id)) : [];
  
  const quizGenerator = req.app.locals.quizGenerator;
  if (!quizGenerator) {
    return res.status(500).json({ error: 'Generatore quiz non inizializzato' });
  }
  
  const quiz = quizGenerator.getQuizSbagliati(quizSbagliatiIds, limit);
  
  // Aggiungi campi di sicurezza per evitare errori frontend
  const quizSicuri = quiz.map(q => ({
    ...q,
    materia: q.materia || 'generale',
    materiaDisplay: `${q.materia || 'generale'}`.charAt(0).toUpperCase() + `${q.materia || 'generale'}`.slice(1),
    icona: getIconaMateria(q.materia || 'generale'),
    // Trasforma opzioni per compatibilità frontend
    opzioni: q.opzioni ? q.opzioni.map((opzione, idx) => ({
      id: String.fromCharCode(97 + idx), // a, b, c, d
      testo: opzione
    })) : [],
    // Converti risposta corretta da indice numerico a lettera
    rispostaCorretta: q.opzioni && typeof q.rispostaCorretta === 'number' ? 
      String.fromCharCode(97 + q.rispostaCorretta) : q.rispostaCorretta
  }));
  
  res.json({ 
    quiz: quizSicuri, 
    totale: quizSicuri.length,
    tipo: 'ripasso',
    descrizione: quizSbagliatiIds.length > 0 ? 'Quiz sbagliati da ripassare' : 'Quiz di esercitazione'
  });
});

// GET /api/quiz-completo/argomento/:materia/:argomento - Quiz per argomento specifico
router.get('/argomento/:materia/:argomento', (req, res) => {
  const { materia, argomento } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  const quizGenerator = req.app.locals.quizGenerator;
  if (!quizGenerator) {
    return res.status(500).json({ error: 'Generatore quiz non inizializzato' });
  }
  
  // Filtra quiz per materia E argomento
  const argomentoDecoded = decodeURIComponent(argomento).toLowerCase();
  const quiz = quizGenerator.quizDatabase.filter(q => {
    const materiaMatch = (q.materia || '').toLowerCase().includes(materia.toLowerCase());
    const argomentoMatch = (q.argomento || '').toLowerCase().includes(argomentoDecoded);
    return materiaMatch && argomentoMatch;
  });
  
  // Mescola e limita
  const quizMescolati = quiz.sort(() => Math.random() - 0.5).slice(0, limit);
  
  // Formatta per frontend
  const quizFormattati = quizMescolati.map(q => ({
    ...q,
    id: q.id || Math.random().toString(36).substr(2, 9),
    materia: q.materia || materia,
    argomento: q.argomento || argomento
  }));
  
  res.json({ 
    quiz: quizFormattati, 
    totale: quizFormattati.length,
    filtro: { materia, argomento: argomentoDecoded }
  });
});

// GET /api/quiz-completo/sottoargomento/:materia/:sottoargomento - Quiz per sottoargomento specifico
router.get('/sottoargomento/:materia/:sottoargomento', (req, res) => {
  const { materia, sottoargomento } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  const quizGenerator = req.app.locals.quizGenerator;
  if (!quizGenerator) {
    return res.status(500).json({ error: 'Generatore quiz non inizializzato' });
  }
  
  // Filtra quiz per materia E sottoargomento (campo argomento nei quiz corrisponde al sottoargomento)
  const sottoargomentoDecoded = decodeURIComponent(sottoargomento).toLowerCase();
  const quiz = quizGenerator.quizDatabase.filter(q => {
    const materiaMatch = (q.materia || '').toLowerCase().includes(materia.toLowerCase());
    // Il campo "argomento" nei quiz generati corrisponde spesso al sottoargomento
    const sottoMatch = (q.argomento || '').toLowerCase().includes(sottoargomentoDecoded) ||
                       (q.sottoargomento || '').toLowerCase().includes(sottoargomentoDecoded);
    return materiaMatch && sottoMatch;
  });
  
  // Mescola e limita
  const quizMescolati = quiz.sort(() => Math.random() - 0.5).slice(0, limit);
  
  // Formatta per frontend
  const quizFormattati = quizMescolati.map(q => ({
    ...q,
    id: q.id || Math.random().toString(36).substr(2, 9),
    materia: q.materia || materia,
    sottoargomento: sottoargomento
  }));
  
  res.json({ 
    quiz: quizFormattati, 
    totale: quizFormattati.length,
    filtro: { materia, sottoargomento: sottoargomentoDecoded }
  });
});

// GET /api/quiz-completo/simulazione - Simulazione esame
router.get('/simulazione', (req, res) => {
  const numDomande = parseInt(req.query.domande) || 40;
  
  const quizGenerator = req.app.locals.quizGenerator;
  if (!quizGenerator) {
    return res.status(500).json({ error: 'Generatore quiz non inizializzato' });
  }
  
  const quiz = quizGenerator.getSimulazioneEsame(numDomande);
  
  res.json({
    simulazione: quiz,
    totale: quiz.length,
    durata: numDomande * 1.5, // 1.5 min per domanda
    punteggio_massimo: quiz.reduce((sum, q) => sum + q.puntiXP, 0)
  });
});

// GET /api/quiz-completo/random - Quiz casuale
router.get('/random', (req, res) => {
  const quiz = quizGenerator.quizDatabase[
    Math.floor(Math.random() * quizGenerator.quizDatabase.length)
  ];
  res.json({ quiz });
});

// POST /api/quiz-completo/verifica - Verifica risposta
router.post('/verifica', (req, res) => {
  const { quizId, risposta, tempoImpiegato } = req.body;
  const userId = req.user?.id || 'guest';
  const quiz = quizGenerator.quizDatabase.find(q => q.id === quizId);
  
  if (!quiz) {
    return res.status(404).json({ errore: 'Quiz non trovato' });
  }
  
  const corretta = quiz.tipo === 'VERO_FALSO' 
    ? risposta === quiz.rispostaCorretta
    : risposta === quiz.rispostaCorretta;
  
  // Integrazione con sistema gamification
  let risultatoGamification = null;
  try {
    // Normalizza il nome della materia (rimuovi emoji)
    const materiaNormalizzata = quiz.materia.replace(/[📘📗📙🔬⚛️🧮🎨📜🌍✝️]/g, '').trim().toLowerCase();
    
    // Registra il completamento del quiz nel sistema gamification
    risultatoGamification = gamification.completaQuiz(
      userId, 
      materiaNormalizzata, 
      corretta, 
      tempoImpiegato || 60
    );
  } catch (error) {
    console.error('Errore integrazione gamification:', error);
    // Non bloccare la risposta se il gamification fallisce
  }
  
  const response = {
    corretta,
    rispostaCorretta: quiz.rispostaCorretta,
    spiegazione: quiz.spiegazione,
    puntiXP: corretta ? quiz.puntiXP : 0
  };
  
  // Aggiungi dati gamification se disponibili
  if (risultatoGamification) {
    response.gamification = {
      xpGuadagnati: risultatoGamification.xpGuadagnati,
      xpTotale: risultatoGamification.xpTotale,
      livelloUp: risultatoGamification.livelloUp,
      nuovoLivello: risultatoGamification.nuovoLivello,
      titoloLivello: risultatoGamification.titoloLivello,
      streak: risultatoGamification.streak,
      badgeOttenuti: risultatoGamification.badgeOttenuti
    };
  }
  
  res.json(response);
});

// GET /api/quiz-completo/stats - Statistiche quiz
router.get('/stats', (req, res) => {
  const quizGenerator = req.app.locals.quizGenerator;
  if (!quizGenerator) {
    return res.status(500).json({ error: 'Generatore quiz non inizializzato' });
  }
  
  // Usa il metodo getStats del generatore
  const stats = quizGenerator.getStats();
  
  const iconeMaterie = {
    'italiano': '📘',
    'storia': '📗',
    'filosofia': '📙',
    'scienze': '🔬',
    'latino': '📜',
    'arte': '🎨',
    'matematica': '🧮',
    'fisica': '⚛️',
    'inglese': '🌍',
    'religione': '✝️'
  };
  
  // Converti in array per il frontend
  const perMateria = Object.entries(stats.quizPerMateria).map(([nome, totaleQuiz]) => ({
    nome: nome,
    icona: iconeMaterie[nome] || '📖',
    totaleQuiz: totaleQuiz,
    completati: 0,
    percentualeCompletati: 0
  }));
  
  // Statistiche per difficoltà (dal generatore semplice)
  const perDifficolta = { facile: 0, medio: 0, avanzato: 0 };
  const perTipo = { multipla: 0, vero_falso: 0 };
  
  quizGenerator.quizDatabase.forEach(q => {
    const diff = q.difficolta || 'medio';
    if (diff === 'facile') perDifficolta.facile++;
    else if (diff === 'medio') perDifficolta.medio++;
    else if (diff === 'avanzato') perDifficolta.avanzato++;
    
    if (q.tipo === 'multipla') perTipo.multipla++;
    else if (q.tipo === 'vero_falso') perTipo.vero_falso++;
  });
  
  res.json({
    totaleQuiz: stats.totaleQuiz,
    quizPerMateria: stats.quizPerMateria,
    perMateria: perMateria,
    perDifficolta: perDifficolta,
    perTipo: perTipo
  });
});

// GET /api/quiz-completo/gamification-stats - Statistiche gamification per quiz
router.get('/gamification-stats', (req, res) => {
  const userId = req.user?.id || 'guest';
  
  try {
    const profilo = gamification.getProfiloUtente(userId);
    
    // Calcola statistiche specifiche per i quiz
    const statsQuiz = {
      quizCompletati: profilo.statistiche.quizCompletati,
      quizCorretti: profilo.statistiche.quizCorretti,
      accuratezza: profilo.statistiche.accuratezzaMedia,
      xpTotale: profilo.xpTotale,
      livello: profilo.livelloGlobale,
      titoloLivello: profilo.titoloLivello,
      streak: profilo.streak,
      badgeOttenuti: profilo.badge.length,
      materiePiuStudiate: profilo.statistiche.materiePiuStudiate,
      obiettiviSettimanali: profilo.obiettiviSettimanali
    };
    
    res.json({
      success: true,
      stats: statsQuiz,
      badge: profilo.badge,
      progressoLivello: profilo.progressoLivello
    });
  } catch (error) {
    console.error('Errore recupero statistiche gamification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Errore nel recupero delle statistiche' 
    });
  }
});

// GET /api/quiz-completo/tappe-progressione - Tappe di progressione per quiz
router.get('/tappe-progressione', (req, res) => {
  const userId = req.user?.id || 'guest';
  
  try {
    const profilo = gamification.getProfiloUtente(userId);
    
    // Definisci le tappe di progressione per i quiz
    const tappe = [
      { id: 1, nome: 'Primo Passo', descrizione: 'Completa il tuo primo quiz', target: 1, completata: profilo.statistiche.quizCompletati >= 1, ricompensa: '10 XP + Badge 🎯 Primo Quiz' },
      { id: 2, nome: 'Principiante', descrizione: 'Completa 5 quiz', target: 5, completata: profilo.statistiche.quizCompletati >= 5, ricompensa: '25 XP + Badge 🎯 Principiante' },
      { id: 3, nome: 'Studente Attivo', descrizione: 'Completa 10 quiz', target: 10, completata: profilo.statistiche.quizCompletati >= 10, ricompensa: '50 XP + Badge 🏆 Quiz Master' },
      { id: 4, nome: 'Esperto in Formazione', descrizione: 'Completa 25 quiz', target: 25, completata: profilo.statistiche.quizCompletati >= 25, ricompensa: '100 XP + Badge 🥉 Quiz Expert' },
      { id: 5, nome: 'Campione', descrizione: 'Completa 50 quiz', target: 50, completata: profilo.statistiche.quizCompletati >= 50, ricompensa: '200 XP + Badge 🥇 Quiz Champion' },
      { id: 6, nome: 'Leggenda', descrizione: 'Completa 100 quiz', target: 100, completata: profilo.statistiche.quizCompletati >= 100, ricompensa: '500 XP + Badge 👑 Quiz Legend' },
      { id: 7, nome: 'Maestro Supremo', descrizione: 'Completa 250 quiz', target: 250, completata: profilo.statistiche.quizCompletati >= 250, ricompensa: '1000 XP + Badge 🌟 Quiz Master Supreme' },
      { id: 8, nome: 'Immortale', descrizione: 'Completa 500 quiz', target: 500, completata: profilo.statistiche.quizCompletati >= 500, ricompensa: '2000 XP + Badge 🔥 Quiz Immortale' }
    ];
    
    // Tappe per accuratezza
    const tappeAccuratezza = [
      { id: 9, nome: 'Precisione', descrizione: 'Raggiungi 80% di accuratezza', target: 80, completata: profilo.statistiche.accuratezzaMedia >= 80, ricompensa: '100 XP + Badge 🎯 Precisione' },
      { id: 10, nome: 'Cecchino', descrizione: 'Raggiungi 90% di accuratezza', target: 90, completata: profilo.statistiche.accuratezzaMedia >= 90, ricompensa: '200 XP + Badge 🎯 Cecchino' },
      { id: 11, nome: 'Perfezionista', descrizione: 'Raggiungi 95% di accuratezza', target: 95, completata: profilo.statistiche.accuratezzaMedia >= 95, ricompensa: '300 XP + Badge 🎯 Perfezionista' }
    ];
    
    // Tappe per velocità
    const tappeVelocita = [
      { id: 12, nome: 'Speed Runner', descrizione: 'Completa 10 quiz in meno di 30 secondi', target: 10, completata: profilo.statistiche.quizVeloci >= 10, ricompensa: '150 XP + Badge ⚡ Speed Runner' },
      { id: 13, nome: 'Fulmine', descrizione: 'Completa 50 quiz in meno di 20 secondi', target: 50, completata: profilo.statistiche.quizMoltoVeloci >= 50, ricompensa: '300 XP + Badge ⚡ Fulmine' },
      { id: 14, nome: 'Velocità della Luce', descrizione: 'Completa 100 quiz in meno di 15 secondi', target: 100, completata: profilo.statistiche.quizUltraVeloci >= 100, ricompensa: '500 XP + Badge 💫 Velocità della Luce' }
    ];
    
    // Calcola progresso generale
    const progressoGenerale = {
      quizCompletati: profilo.statistiche.quizCompletati,
      accuratezza: Math.round(profilo.statistiche.accuratezzaMedia * 10) / 10,
      xpTotale: profilo.xpTotale,
      livello: profilo.livelloGlobale,
      badgeOttenuti: profilo.badge.length,
      prossimaTappa: tappe.find(t => !t.completata) || null
    };
    
    res.json({
      success: true,
      progressoGenerale,
      tappe: {
        quiz: tappe,
        accuratezza: tappeAccuratezza,
        velocita: tappeVelocita
      },
      statistiche: {
        quizCompletati: profilo.statistiche.quizCompletati,
        quizCorretti: profilo.statistiche.quizCorretti,
        accuratezzaMedia: profilo.statistiche.accuratezzaMedia,
        quizVeloci: profilo.statistiche.quizVeloci,
        quizMoltoVeloci: profilo.statistiche.quizMoltoVeloci,
        quizUltraVeloci: profilo.statistiche.quizUltraVeloci,
        seriePerfettaMassima: profilo.statistiche.seriePerfettaMassima
      }
    });
  } catch (error) {
    console.error('Errore recupero tappe progressione:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Errore nel recupero delle tappe di progressione' 
    });
  }
});

// NOTA: Gli esami sono gestiti separatamente nel modulo /api/esami
// I quiz sono solo per l'apprendimento didattico, non per valutazioni

module.exports = router;
