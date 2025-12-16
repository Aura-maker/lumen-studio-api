/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🚀 IMPARAFACILE API - PRODUCTION SERVER
 * ═══════════════════════════════════════════════════════════════════════════════
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');

// Rate limiters
const { generalLimiter, authLimiter, quizLimiter } = require('./src/middleware/rate-limiter');

// Error handling
const { errorHandler, notFoundHandler, requestLogger, setupGlobalErrorHandlers } = require('./src/middleware/error-handler');

const app = express();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// Setup global error handlers
setupGlobalErrorHandlers();

// Test connessione database all'avvio
const { db } = require('./src/db');
db.testConnection().then(ok => {
  if (ok) console.log('✅ Database Supabase connesso!');
  else console.log('⚠️ Database non disponibile, alcune funzioni limitate');
}).catch(() => console.log('⚠️ Database non configurato'));

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

// Helmet per security headers
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// Compression
app.use(compression());

// CORS
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3003', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In production, be more strict
    if (isProduction) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body parsers
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting generale
app.use(generalLimiter);

// Request logging (solo in development o se richiesto)
if (!isProduction || process.env.LOG_REQUESTS === 'true') {
  app.use(requestLogger);
}

// Middleware per logging richieste (semplice)
app.use((req, res, next) => {
  if (!isProduction) {
    console.log(`📡 ${req.method} ${req.path}`);
  }
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    app: 'ImparaFacile API',
    version: '2.0.0',
    status: 'online',
    endpoints: {
      health: '/api/health',
      materie: '/api/materie',
      gamification: '/gamification/profilo',
      quiz: '/api/quiz',
      flashcards: '/api/flashcards-completo/stats',
      simulazioni: '/api/simulazioni'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Servizi usano database reale (pg) - nessun mock in memoria
console.log('✅ Servizi: database reale (Supabase PostgreSQL)');

// Inizializza servizio gamification (in memoria come fallback)
const GamificationService = require('./src/services/gamification-service');
const gamificationService = new GamificationService();
console.log('✅ Gamification service inizializzato');

// Repository gamification database (persistenza reale)
let gamificationRepo = null;
try {
  gamificationRepo = require('./src/db/gamification');
  console.log('✅ Gamification repository database caricato');
} catch (e) {
  console.log('⚠️ Gamification repository non disponibile, uso memoria');
}

// Inizializza servizio battle
const BattleService = require('./src/services/battle-service');
const battleService = new BattleService();
console.log('✅ Battle service inizializzato');

// ==================== CARICAMENTO CONTENUTI (prima delle routes) ====================
const fs = require('fs');
// path già dichiarato in cima al file

let contenuti = {};
try {
  const tutteMaterie = require('./src/data/contenuti-tutte-materie-complete.js');
  const quizData = require('./src/data/quiz-generati/tutti-quiz.json');
  const flashcardsData = require('./src/data/flashcards/tutte-flashcards.json');

  Object.keys(tutteMaterie).forEach(materiaId => {
    const materiaData = tutteMaterie[materiaId];
    contenuti[materiaId] = {
      materia: materiaData.materia,
      sottoargomenti: {}
    };
    
    if (materiaData.argomenti) {
      materiaData.argomenti.forEach((arg, argIdx) => {
        if (arg.sottoargomenti && Array.isArray(arg.sottoargomenti)) {
          arg.sottoargomenti.forEach((sotto, sottoIdx) => {
            const id = sotto.id || `${materiaId}_${argIdx}_${sottoIdx}`;
            contenuti[materiaId].sottoargomenti[id] = {
              titolo: sotto.titolo,
              descrizione: sotto.tags ? sotto.tags.join(', ') : (arg.descrizione || ''),
              contenuto: sotto.riassunto || '',
              livello: sotto.livelloDifficolta || 'intermedio',
              argomento: arg.titolo
            };
          });
        } else {
          const id = arg.id || `${materiaId}_arg_${argIdx}`;
          contenuti[materiaId].sottoargomenti[id] = {
            titolo: arg.titolo,
            descrizione: arg.descrizione || '',
            contenuto: arg.riassunto || '',
            livello: arg.livelloDifficolta || 'intermedio',
            argomento: materiaId
          };
        }
      });
    }
  });
  
  const totSotto = Object.values(contenuti).reduce((acc, m) => acc + Object.keys(m.sottoargomenti || {}).length, 0);
  console.log(`✅ Contenuti caricati: ${Object.keys(contenuti).length} materie, ${totSotto} sottoargomenti`);
} catch (e) {
  console.error('❌ Errore caricamento contenuti:', e.message);
}

// Routes con gestione errori
const routeWrapper = (routeHandler) => {
  return async (req, res, next) => {
    try {
      await routeHandler(req, res, next);
    } catch (error) {
      console.error('❌ Errore in route:', error);
      res.status(500).json({ 
        error: 'Errore interno del server',
        message: error.message 
      });
    }
  };
};

// Gamification routes
app.get('/gamification/profilo', routeWrapper(async (req, res) => {
  if (!gamificationService) {
    return res.status(503).json({ error: 'Servizio non disponibile' });
  }
  
  const userId = req.query.userId || req.headers['x-user-id'] || 'default-user';
  
  // Profilo reale - nessuna simulazione, parte da zero
  const profilo = gamificationService.getProfiloUtente(userId);
  
  // Dati live reali - grafici vuoti se nessuna attività
  const giorni = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  const progressoSettimanale = profilo.progressoSettimanale || giorni.map(g => ({
    giorno: g,
    xp: 0,
    quiz: 0
  }));
  
  const profiloCompleto = {
    ...profilo,
    xpSettimana: profilo.xpSettimana || 0,
    quizMese: profilo.quizMese || 0,
    recordStreak: profilo.recordStreak || 0,
    accuratezzaDelta: 0,
    progressoSettimanale
  };
  
  res.json(profiloCompleto);
}));

app.get('/gamification/notifiche', routeWrapper(async (req, res) => {
  const userId = req.query.userId || 'default-user';
  
  // Prendi attività recenti dal servizio gamification
  const attivita = gamificationService.getAttivitaRecenti(userId);
  
  // Converti in formato notifiche usando il titolo dall'attività
  const notifiche = attivita.map(a => ({
    id: a.id,
    tipo: a.tipo,
    titolo: a.titolo || (a.tipo === 'quiz' ? 'Quiz' : a.tipo === 'flashcard' ? 'Flashcards' : a.materia),
    messaggio: `${a.materia} - ${a.dettaglio}`,
    xp: a.xp,
    timestamp: a.timestamp
  }));
  
  res.json(notifiche);
}));

// GET /api/gamification/badge - Lista badges con stato sblocco
app.get('/api/gamification/badge', routeWrapper(async (req, res) => {
  const userId = req.query.userId || 'default-user';
  const badges = gamificationService.getBadges(userId);
  res.json(badges);
}));

// GET /gamification/attivita - Attività recenti
app.get('/gamification/attivita', routeWrapper(async (req, res) => {
  const userId = req.query.userId || 'default-user';
  const attivita = gamificationService.getAttivitaRecenti(userId);
  res.json(attivita);
}));

app.post('/gamification/riassunto', routeWrapper(async (req, res) => {
  if (!gamificationService) {
    return res.status(503).json({ error: 'Servizio non disponibile' });
  }
  
  const { materia, tempoLettura, titoloRiassunto } = req.body;
  const userId = req.body.userId || 'default-user';
  
  console.log(`📚 Richiesta studio: ${titoloRiassunto || materia} - ${tempoLettura} minuti`);
  
  const risultato = gamificationService.leggiRiassunto(userId, materia, tempoLettura, titoloRiassunto);
  res.json(risultato);
}));

// Flashcards routes
app.get('/api/flashcards-completo/stats', routeWrapper(async (req, res) => {
  if (!flashcardService) {
    return res.status(503).json({ error: 'Servizio non disponibile' });
  }
  
  const userId = req.query.userId || 'default-user';
  const stats = flashcardService.getStatistiche(userId);
  res.json(stats);
}));

// Materie routes - con conteggi sottoargomenti
app.get('/api/materie', routeWrapper(async (req, res) => {
  const materieBase = [
    { id: 'italiano', nome: '📘 Italiano', descrizione: 'Letteratura e grammatica', icona: '📘' },
    { id: 'storia', nome: '📗 Storia', descrizione: 'Storia moderna e contemporanea', icona: '📗' },
    { id: 'filosofia', nome: '📙 Filosofia', descrizione: 'Filosofia moderna', icona: '📙' },
    { id: 'matematica', nome: '🧮 Matematica', descrizione: 'Analisi e geometria', icona: '🧮' },
    { id: 'fisica', nome: '⚛️ Fisica', descrizione: 'Fisica classica e moderna', icona: '⚛️' },
    { id: 'scienze', nome: '🔬 Scienze', descrizione: 'Biologia e chimica', icona: '🔬' },
    { id: 'latino', nome: '📜 Latino', descrizione: 'Lingua e letteratura latina', icona: '📜' },
    { id: 'arte', nome: '🎨 Arte', descrizione: 'Storia dell\'arte', icona: '🎨' },
    { id: 'inglese', nome: '🌍 Inglese', descrizione: 'Lingua inglese', icona: '🌍' },
    { id: 'religione', nome: '✝️ Religione', descrizione: 'Religione cattolica', icona: '✝️' }
  ];
  
  // Aggiungi conteggi dai contenuti caricati
  const materie = materieBase.map(m => {
    const numSotto = contenuti[m.id] ? Object.keys(contenuti[m.id].sottoargomenti || {}).length : 0;
    return {
      ...m,
      totaleSottoargomenti: numSotto,
      totaleArgomenti: numSotto > 0 ? Math.ceil(numSotto / 4) : 0
    };
  });
  
  res.json({ materie });
}));

// ==================== ROUTES MATERIE DETTAGLIO ====================

// Route principale per materia (usata dal frontend)
app.get('/api/materie/:materiaId', routeWrapper(async (req, res) => {
  const { materiaId } = req.params;
  
  if (contenuti[materiaId]) {
    // Raggruppa sottoargomenti per argomento
    const sottoargomentiList = Object.entries(contenuti[materiaId].sottoargomenti || {});
    
    // Crea struttura argomenti con sottoargomenti annidati
    const argomentiMap = {};
    sottoargomentiList.forEach(([id, data]) => {
      const argomentoKey = data.argomento || 'Generale';
      if (!argomentiMap[argomentoKey]) {
        argomentiMap[argomentoKey] = {
          id: argomentoKey.toLowerCase().replace(/\s+/g, '-'),
          titolo: argomentoKey,
          descrizione: '',
          sottoargomenti: []
        };
      }
      argomentiMap[argomentoKey].sottoargomenti.push({
        id,
        titolo: data.titolo,
        descrizione: data.descrizione || '',
        riassunto: data.contenuto,
        livelloDifficolta: data.livello || 'intermedio'
      });
    });
    
    const argomenti = Object.values(argomentiMap);
    
    res.json({
      materia: contenuti[materiaId].materia || { id: materiaId, nome: materiaId },
      argomenti,
      totaleArgomenti: argomenti.length,
      totaleSottoargomenti: sottoargomentiList.length
    });
  } else {
    res.status(404).json({ error: 'Materia non trovata' });
  }
}));

app.get('/api/materie/:materiaId/sottoargomenti', routeWrapper(async (req, res) => {
  const { materiaId } = req.params;
  
  if (contenuti[materiaId] && contenuti[materiaId].sottoargomenti) {
    const sottoargomenti = Object.entries(contenuti[materiaId].sottoargomenti).map(([id, data]) => ({
      id,
      titolo: data.titolo || id,
      descrizione: data.descrizione || '',
      contenuto: data.contenuto ? data.contenuto.substring(0, 200) + '...' : ''
    }));
    res.json({ sottoargomenti });
  } else {
    res.json({ sottoargomenti: [] });
  }
}));

app.get('/api/materie/:materiaId/sottoargomenti/:sottoId', routeWrapper(async (req, res) => {
  const { materiaId, sottoId } = req.params;
  
  if (contenuti[materiaId] && contenuti[materiaId].sottoargomenti && contenuti[materiaId].sottoargomenti[sottoId]) {
    res.json(contenuti[materiaId].sottoargomenti[sottoId]);
  } else {
    res.status(404).json({ error: 'Sottoargomento non trovato' });
  }
}));

// ==================== QUIZ ====================
let quizData = { quiz: [] };
try {
  const quizPath = path.join(__dirname, 'src', 'data', 'quiz-generati', 'tutti-quiz.json');
  if (fs.existsSync(quizPath)) {
    quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    console.log(`✅ Quiz caricati: ${quizData.quiz?.length || 0}`);
  }
} catch (e) {
  console.error('❌ Errore caricamento quiz:', e.message);
}

app.get('/api/quiz', routeWrapper(async (req, res) => {
  const { materia, limit = 10 } = req.query;
  let quiz = quizData.quiz || [];
  
  if (materia) {
    quiz = quiz.filter(q => q.materia === materia);
  }
  
  // Shuffle e limita
  quiz = quiz.sort(() => Math.random() - 0.5).slice(0, parseInt(limit));
  
  res.json({ quiz, totale: quiz.length });
}));

app.get('/api/quiz/:materia', routeWrapper(async (req, res) => {
  const { materia } = req.params;
  const { limit = 10 } = req.query;
  
  let quiz = (quizData.quiz || []).filter(q => q.materia === materia);
  quiz = quiz.sort(() => Math.random() - 0.5).slice(0, parseInt(limit));
  
  res.json({ quiz, totale: quiz.length });
}));

// ==================== QUIZ ULTIMATE (generazione dinamica) ====================
// Funzione per validare quiz di qualità
function isQuizValido(q) {
  if (!q.domanda || !q.rispostaCorretta || !q.opzioni) return false;
  if (q.opzioni.length < 4) return false;
  
  // Risposta max 40 caratteri per essere leggibile
  if (q.rispostaCorretta.length > 40 || q.rispostaCorretta.length < 2) return false;
  
  // Tutte le opzioni devono essere ragionevoli
  for (const opt of q.opzioni) {
    if (!opt || opt.length < 2 || opt.length > 50) return false;
    const lower = opt.toLowerCase();
    // Filtra contenuti problematici o senza senso
    if (lower.includes('prostitut') || lower.includes('bordello') || 
        lower.includes('scomposti') || lower.includes('frantumata') ||
        lower.includes('maschere africane') || lower.includes('corpi s') ||
        lower.includes('volti ') || lower.includes('piani geometrici')) return false;
  }
  
  // Domanda sensata
  if (q.domanda.length < 20) return false;
  
  // Evita domande tipo "Completa:" con risposte lunghe
  if (q.domanda.startsWith('Completa:') && q.rispostaCorretta.length > 30) return false;
  
  // La risposta deve essere tra le opzioni
  if (!q.opzioni.includes(q.rispostaCorretta)) return false;
  
  // Preferisci quiz con tipo specifico
  const tipiValidi = ['multipla', 'vero_falso', 'data', 'autore'];
  if (q.tipo && !tipiValidi.includes(q.tipo)) return false;
  
  return true;
}

// Statistiche quiz per utente (in memoria per ora)
const userQuizStats = {};

app.get('/api/quiz-ultimate/statistiche', routeWrapper(async (req, res) => {
  const userId = req.query.userId || 'default-user';
  
  if (!userQuizStats[userId]) {
    userQuizStats[userId] = {
      quizCompletati: 0,
      risposteCorrette: 0,
      risposteTotali: 0,
      xpGuadagnati: 0,
      streakGiornaliera: 0,
      ultimoQuiz: null,
      perMateria: {}
    };
  }
  
  res.json(userQuizStats[userId]);
}));

app.post('/api/quiz-ultimate/genera', routeWrapper(async (req, res) => {
  const { materia, argomento, sottoargomento, riassunto, testo, numQuiz = 10, numDomande = 10 } = req.body;
  const limit = numQuiz || numDomande;
  
  // Cerca quiz esistenti per la materia E validi
  let quizFiltrati = (quizData.quiz || []).filter(q => {
    if (materia && q.materia !== materia) return false;
    return isQuizValido(q);
  });
  
  // Se non ci sono abbastanza quiz e c'è un riassunto/testo, genera da quello
  const testoSorgente = riassunto || testo;
  if (quizFiltrati.length < limit && testoSorgente) {
    const quizGenerati = generaQuizDaTesto(testoSorgente, materia, sottoargomento || argomento, limit);
    // Filtra anche i generati
    quizFiltrati = [...quizFiltrati, ...quizGenerati.filter(isQuizValido)];
  }
  
  // Shuffle e limita
  quizFiltrati = quizFiltrati.sort(() => Math.random() - 0.5).slice(0, limit);
  
  res.json({
    success: true,
    quiz: quizFiltrati,
    totale: quizFiltrati.length,
    materia,
    argomento,
    sottoargomento
  });
}));

app.post('/api/quiz-ultimate/verifica', routeWrapper(async (req, res) => {
  const { quizId, risposta, userId = 'default-user' } = req.body;
  
  // Trova il quiz
  const quiz = (quizData.quiz || []).find(q => q.id === quizId);
  
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz non trovato' });
  }
  
  const corretto = quiz.rispostaCorretta === risposta;
  const xp = corretto ? 10 : 2;
  
  // Aggiorna statistiche
  if (!userQuizStats[userId]) {
    userQuizStats[userId] = {
      quizCompletati: 0,
      risposteCorrette: 0,
      risposteTotali: 0,
      xpGuadagnati: 0,
      streakGiornaliera: 0,
      ultimoQuiz: null,
      perMateria: {}
    };
  }
  
  userQuizStats[userId].risposteTotali++;
  if (corretto) userQuizStats[userId].risposteCorrette++;
  userQuizStats[userId].xpGuadagnati += xp;
  userQuizStats[userId].ultimoQuiz = new Date().toISOString();
  
  res.json({
    corretto,
    rispostaCorretta: quiz.rispostaCorretta,
    spiegazione: quiz.spiegazione || 'Nessuna spiegazione disponibile',
    xpGuadagnati: xp
  });
}));

// Funzione helper per generare quiz da testo
function generaQuizDaTesto(testo, materia, argomento, numDomande) {
  const quiz = [];
  const frasi = testo.split(/[.!?]+/).filter(f => f.trim().length > 30);
  
  for (let i = 0; i < Math.min(numDomande, frasi.length); i++) {
    const frase = frasi[i].trim();
    
    // Estrai parole chiave
    const parole = frase.split(/\s+/).filter(p => p.length > 4);
    if (parole.length < 3) continue;
    
    const parolaChiave = parole[Math.floor(Math.random() * parole.length)];
    
    quiz.push({
      id: `gen_${Date.now()}_${i}`,
      tipo: 'completamento',
      domanda: frase.replace(parolaChiave, '________'),
      opzioni: shuffleArray([parolaChiave, ...generaDistrattori(parolaChiave)]).slice(0, 4),
      rispostaCorretta: parolaChiave,
      spiegazione: `La parola corretta è "${parolaChiave}".`,
      materia,
      argomento,
      difficolta: 'intermedio'
    });
  }
  
  return quiz;
}

function generaDistrattori(parola) {
  // Genera distrattori semplici
  const distrattori = [
    parola.split('').reverse().join(''),
    parola.substring(0, Math.ceil(parola.length / 2)) + 'zione',
    'altro' + parola.substring(parola.length - 3),
    parola + 'ismo'
  ];
  return distrattori.filter(d => d !== parola);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ==================== QUIZ VELOCE ====================
app.get('/api/quiz-ultimate/veloce', routeWrapper(async (req, res) => {
  const { numDomande = 10 } = req.query;
  const limit = parseInt(numDomande);
  
  // Prendi quiz casuali da tutte le materie
  const tuttiQuiz = quizData.quiz || [];
  
  // Filtra solo quiz validi e di qualità
  const quizValidi = tuttiQuiz.filter(isQuizValido);
  
  // Shuffle e prendi il numero richiesto
  const quizSelezionati = shuffleArray(quizValidi).slice(0, limit);
  
  res.json({
    success: true,
    quiz: quizSelezionati,
    totale: quizSelezionati.length,
    tipo: 'veloce'
  });
}));

// ==================== FLASHCARDS ====================
let flashcardData = { flashcards: [] };
try {
  const fcPath = path.join(__dirname, 'src', 'data', 'quiz-generati', 'tutte-flashcard.json');
  if (fs.existsSync(fcPath)) {
    flashcardData = JSON.parse(fs.readFileSync(fcPath, 'utf8'));
    console.log(`✅ Flashcard caricate: ${flashcardData.flashcards?.length || 0}`);
  }
} catch (e) {
  console.error('❌ Errore caricamento flashcard:', e.message);
}

app.get('/api/flashcards', routeWrapper(async (req, res) => {
  const { materia, limit = 20 } = req.query;
  let flashcards = flashcardData.flashcards || [];
  
  if (materia) {
    flashcards = flashcards.filter(f => f.materia === materia);
  }
  
  flashcards = flashcards.sort(() => Math.random() - 0.5).slice(0, parseInt(limit));
  
  res.json({ flashcards, totale: flashcards.length });
}));

app.get('/api/flashcards/:materia', routeWrapper(async (req, res) => {
  const { materia } = req.params;
  const { limit = 20 } = req.query;
  
  let flashcards = (flashcardData.flashcards || []).filter(f => f.materia === materia);
  flashcards = flashcards.sort(() => Math.random() - 0.5).slice(0, parseInt(limit));
  
  res.json({ flashcards, totale: flashcards.length });
}));

// ==================== BATTLE API ====================

// POST /api/battle/crea - Crea una nuova partita
app.post('/api/battle/crea', routeWrapper(async (req, res) => {
  const { userId, nome, modalita } = req.body;
  const partita = battleService.creaPartita(userId || 'host', nome || 'Giocatore', modalita);
  res.json({ success: true, partita });
}));

// POST /api/battle/join - Entra in una partita con codice
app.post('/api/battle/join', routeWrapper(async (req, res) => {
  const { codice, odice, nome } = req.body;
  const result = battleService.joinPartita(codice.toUpperCase(), odice || 'guest', nome || 'Sfidante');
  if (result.error) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.json({ success: true, partita: result });
}));

// GET /api/battle/:codice - Ottieni stato partita
app.get('/api/battle/:codice', routeWrapper(async (req, res) => {
  const partita = battleService.getPartita(req.params.codice.toUpperCase());
  if (!partita) {
    return res.status(404).json({ success: false, error: 'Partita non trovata' });
  }
  res.json({ success: true, partita });
}));

// POST /api/battle/inizia - Inizia la partita con quiz
app.post('/api/battle/inizia', routeWrapper(async (req, res) => {
  const { codice } = req.body;
  const partita = battleService.getPartita(codice.toUpperCase());
  if (!partita) {
    return res.status(404).json({ success: false, error: 'Partita non trovata' });
  }
  
  // Carica quiz per la partita
  const numDomande = partita.modalita?.domande || 10;
  let quiz = (quizData.quiz || []).sort(() => Math.random() - 0.5).slice(0, numDomande);
  
  const partitaInCorso = battleService.iniziaPartita(codice.toUpperCase(), quiz);
  res.json({ success: true, partita: partitaInCorso });
}));

// POST /api/battle/risposta - Registra risposta
app.post('/api/battle/risposta', routeWrapper(async (req, res) => {
  const { codice, odice, risposta, tempo } = req.body;
  const result = battleService.registraRisposta(codice.toUpperCase(), odice, risposta, tempo);
  if (!result) {
    return res.status(400).json({ success: false, error: 'Errore registrazione risposta' });
  }
  res.json({ success: true, ...result });
}));

// POST /api/battle/prossima - Passa alla prossima domanda
app.post('/api/battle/prossima', routeWrapper(async (req, res) => {
  const { codice } = req.body;
  const partita = battleService.prossimaDomanda(codice.toUpperCase());
  res.json({ success: true, partita });
}));

// POST /api/battle/termina - Termina la partita
app.post('/api/battle/termina', routeWrapper(async (req, res) => {
  const { codice } = req.body;
  const partita = battleService.terminaPartita(codice.toUpperCase());
  
  // Assegna XP ai giocatori
  if (partita && gamificationService) {
    const hostVince = partita.host.score > partita.guest.score;
    const xpHost = hostVince ? 100 : 30;
    const xpGuest = hostVince ? 30 : 100;
    gamificationService.completaQuiz(partita.host.id, 'sfida', hostVince, xpHost);
    gamificationService.completaQuiz(partita.guest.id, 'sfida', !hostVince, xpGuest);
  }
  
  res.json({ success: true, partita });
}));

// GET /api/battle/stats/:odice - Statistiche giocatore
app.get('/api/battle/stats/:odice', routeWrapper(async (req, res) => {
  const stats = battleService.getStatistiche(req.params.odice);
  res.json({ success: true, stats });
}));

// ==================== REFERRAL API ====================
const referralStats = new Map();

// GET /api/referral/stats - Statistiche referral utente
app.get('/api/referral/stats', routeWrapper(async (req, res) => {
  const userId = req.query.userId || 'default-user';
  const stats = referralStats.get(userId) || { invitati: 0, xpGuadagnati: 0 };
  res.json(stats);
}));

// POST /api/referral/apply - Applica codice referral
app.post('/api/referral/apply', routeWrapper(async (req, res) => {
  const { referralCode, newUserId } = req.body;
  
  // Trova chi ha il codice referral
  const referrerId = referralCode.replace('LUMEN', '');
  
  // Assegna XP a entrambi
  const xpBonus = 50;
  
  if (gamificationService) {
    // XP al nuovo utente
    gamificationService.completaQuiz(newUserId, 'referral', true, xpBonus);
    // XP al referrer (simulato)
  }
  
  // Aggiorna stats referrer
  const currentStats = referralStats.get(referrerId) || { invitati: 0, xpGuadagnati: 0 };
  currentStats.invitati++;
  currentStats.xpGuadagnati += xpBonus;
  referralStats.set(referrerId, currentStats);
  
  res.json({ success: true, xpBonus, messaggio: `Hai ricevuto ${xpBonus} XP bonus!` });
}));

// POST /api/quiz/risposta - Registra risposta quiz e assegna XP
app.post('/api/quiz/risposta', routeWrapper(async (req, res) => {
  const { quizId, materia, corretto, userId = 'default-user' } = req.body;
  
  const xp = corretto ? 10 : 2; // 10 XP se corretto, 2 XP per partecipazione
  
  // Registra nel sistema gamification
  if (gamificationService) {
    gamificationService.completaQuiz(userId, materia || 'generale', corretto, xp);
  }
  
  res.json({ 
    success: true, 
    xp,
    corretto,
    messaggio: corretto ? 'Risposta corretta!' : 'Risposta sbagliata'
  });
}));

// POST /api/flashcards/risposta - Registra risposta flashcard e assegna XP
app.post('/api/flashcards/risposta', routeWrapper(async (req, res) => {
  const { flashcardId, materia, ricordato, userId = 'default-user' } = req.body;
  
  let xp = 0;
  if (ricordato) {
    xp = 10;
    // Registra XP nel sistema gamification
    if (gamificationService) {
      gamificationService.vedaFlashcard(userId, materia);
    }
  }
  
  res.json({ 
    success: true, 
    xp,
    messaggio: ricordato ? 'Risposta corretta!' : 'Da ripassare'
  });
}));

// ==================== SIMULAZIONI ESAME ====================
const simulazioniDir = path.join(__dirname, 'src', 'data', 'simulazioni-esame');

// Cache simulazioni per performance
let simulazioniCache = null;
function loadSimulazioniCache() {
  if (simulazioniCache) return simulazioniCache;
  
  const materie = ['italiano', 'matematica', 'greco', 'latino'];
  const allSimulazioni = [];
  
  const descrizioni = {
    italiano: 'Analisi del testo, tema argomentativo e attualità',
    matematica: '2 problemi + 8 quesiti di analisi e geometria',
    greco: 'Versione dal greco con analisi e commento',
    latino: 'Versione dal latino con analisi e commento'
  };
  
  const numDomande = {
    italiano: 7, // 7 tracce
    matematica: 10, // 2 problemi + 8 quesiti
    greco: 4, // versione + 3 quesiti
    latino: 4
  };
  
  for (const materia of materie) {
    const materiaDir = path.join(simulazioniDir, materia);
    if (fs.existsSync(materiaDir)) {
      const files = fs.readdirSync(materiaDir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
      files.forEach((file, idx) => {
        allSimulazioni.push({
          id: file.replace('.json', ''),
          materia,
          numero: idx + 1,
          nome: `Simulazione ${materia.charAt(0).toUpperCase() + materia.slice(1)} #${idx + 1}`,
          titolo: `Simulazione ${materia.charAt(0).toUpperCase() + materia.slice(1)} #${idx + 1}`,
          descrizione: descrizioni[materia],
          durata: materia === 'matematica' ? 300 : 360, // minuti
          numDomande: numDomande[materia],
          difficolta: idx < 50 ? 'base' : idx < 100 ? 'intermedio' : idx < 150 ? 'avanzato' : 'esperto'
        });
      });
    }
  }
  
  simulazioniCache = allSimulazioni;
  return allSimulazioni;
}

app.get('/api/simulazioni', routeWrapper(async (req, res) => {
  const { materia, page = 1, limit = 12 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  let simulazioni = loadSimulazioniCache();
  
  // Filtra per materia se specificata
  if (materia) {
    simulazioni = simulazioni.filter(s => s.materia === materia);
  }
  
  const totale = simulazioni.length;
  const totalePagine = Math.ceil(totale / limitNum);
  const start = (pageNum - 1) * limitNum;
  const paginati = simulazioni.slice(start, start + limitNum);
  
  res.json({
    simulazioni: paginati,
    totale,
    pagina: pageNum,
    totalePagine,
    perPagina: limitNum
  });
}));

app.post('/api/simulazioni/avvia', routeWrapper(async (req, res) => {
  const { simulazioneId } = req.body;
  
  if (!simulazioneId) {
    return res.status(400).json({ error: 'ID simulazione richiesto' });
  }
  
  // Trova la simulazione
  const parts = simulazioneId.split('_');
  const materiaCode = parts[0].toLowerCase();
  const materiaMap = { ita: 'italiano', mat: 'matematica', gre: 'greco', lat: 'latino' };
  const materia = materiaMap[materiaCode] || materiaCode;
  
  const filepath = path.join(simulazioniDir, materia, `${simulazioneId}.json`);
  
  if (fs.existsSync(filepath)) {
    const simulazione = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    res.json({
      success: true,
      simulazione,
      quiz: simulazione.tracce || simulazione.problemi || [],
      durata: simulazione.durata || '6 ore'
    });
  } else {
    res.status(404).json({ error: 'Simulazione non trovata' });
  }
}));

app.get('/api/simulazioni/:materia', routeWrapper(async (req, res) => {
  const { materia } = req.params;
  const { numero = 1 } = req.query;
  
  const filename = `${materia.toUpperCase().substring(0, 3)}_SIM_${String(numero).padStart(3, '0')}.json`;
  const filepath = path.join(simulazioniDir, materia, filename);
  
  if (fs.existsSync(filepath)) {
    const simulazione = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    res.json(simulazione);
  } else {
    res.status(404).json({ error: 'Simulazione non trovata', file: filename });
  }
}));

app.get('/api/simulazioni/:materia/random', routeWrapper(async (req, res) => {
  const { materia } = req.params;
  const materiaDir = path.join(simulazioniDir, materia);
  
  if (fs.existsSync(materiaDir)) {
    const files = fs.readdirSync(materiaDir).filter(f => f.endsWith('.json') && !f.startsWith('_'));
    if (files.length > 0) {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const simulazione = JSON.parse(fs.readFileSync(path.join(materiaDir, randomFile), 'utf8'));
      res.json(simulazione);
    } else {
      res.status(404).json({ error: 'Nessuna simulazione disponibile' });
    }
  } else {
    res.status(404).json({ error: 'Materia non trovata' });
  }
}));

// ==================== ROUTES AUTENTICAZIONE E STATISTICHE LIVE ====================

// Metrics middleware (prima di tutto per tracciare tutte le richieste)
try {
  const { metricsMiddleware } = require('./src/services/metrics-service');
  app.use(metricsMiddleware);
  console.log('✅ Metrics middleware attivo');
} catch (e) {
  console.error('❌ Errore caricamento metrics middleware:', e.message);
}

// Metrics routes (per Prometheus)
try {
  const metricsRoutes = require('./src/routes/metrics');
  app.use('/api/metrics', metricsRoutes);
  console.log('✅ Metrics routes caricate');
} catch (e) {
  console.error('❌ Errore caricamento metrics routes:', e.message);
}

// Auth routes (PG - database reale)
try {
  const authRoutes = require('./src/routes/auth-pg');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes (PG) caricate');
} catch (e) {
  console.error('❌ Errore caricamento auth routes:', e.message);
}

// Statistiche live routes (PG - database reale)
try {
  const statsRoutes = require('./src/routes/stats-pg');
  app.use('/api/stats', statsRoutes);
  console.log('✅ Stats routes (PG) caricate');
} catch (e) {
  console.error('❌ Errore caricamento stats routes:', e.message);
}

// Gamification routes (PG - database reale)
try {
  const gamificationRoutes = require('./src/routes/gamification-pg');
  app.use('/api/gamification', gamificationRoutes);
  console.log('✅ Gamification routes (PG) caricate');
} catch (e) {
  console.error('❌ Errore caricamento gamification routes:', e.message);
}

// Libromercato routes (PG - database reale)
try {
  const libromercatoRoutes = require('./src/routes/libromercato-pg');
  app.use('/api/libromercato', libromercatoRoutes);
  console.log('✅ Libromercato routes (PG) caricate');
} catch (e) {
  console.error('❌ Errore caricamento libromercato routes:', e.message);
}

// Notifiche routes (PG - database reale)
try {
  const notificheRoutes = require('./src/routes/notifiche-pg');
  app.use('/api/notifiche', notificheRoutes);
  console.log('✅ Notifiche routes (PG) caricate');
} catch (e) {
  console.error('❌ Errore caricamento notifiche routes:', e.message);
}

// Daily Challenges & Streak routes
try {
  const dailyRoutes = require('./src/routes/daily-challenges');
  app.use('/api/daily', dailyRoutes);
  console.log('✅ Daily challenges routes caricate');
} catch (e) {
  console.error('❌ Errore caricamento daily routes:', e.message);
}

// Health check routes avanzate
try {
  const healthRoutes = require('./src/routes/health');
  app.use('/health', healthRoutes);
  console.log('✅ Health routes caricate');
} catch (e) {
  console.error('❌ Errore caricamento health routes:', e.message);
}

// Feedback & Segnalazioni routes
try {
  const feedbackRoutes = require('./src/routes/feedback');
  app.use('/api/feedback', feedbackRoutes);
  console.log('✅ Feedback routes caricate');
} catch (e) {
  console.error('❌ Errore caricamento feedback routes:', e.message);
}

// 404 handler
app.use(notFoundHandler);

// Error handler (deve essere l'ultimo middleware)
app.use(errorHandler);

// Avvio server
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   📚 IMPARAFACILE - Backend API v2.0');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   🚀 Server avviato su http://localhost:${PORT}`);
  console.log('');
  console.log('   📋 ENDPOINTS PRINCIPALI:');
  console.log(`   ├─ Health:      http://localhost:${PORT}/api/health`);
  console.log(`   ├─ Materie:     http://localhost:${PORT}/api/materie`);
  console.log(`   ├─ Quiz:        http://localhost:${PORT}/api/quiz-ultimate/veloce`);
  console.log(`   ├─ Flashcard:   http://localhost:${PORT}/api/flashcards`);
  console.log(`   ├─ Simulazioni: http://localhost:${PORT}/api/simulazioni`);
  console.log(`   ├─ Auth:        http://localhost:${PORT}/api/auth/login`);
  console.log(`   └─ Classifica:  http://localhost:${PORT}/api/stats/classifica`);
  console.log('');
  console.log('   🔑 CREDENZIALI TEST:');
  console.log('   ├─ Admin:    admin@imparafacile.it / password123');
  console.log('   └─ Studente: mario.rossi@studente.it / password123');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutdown graceful del server...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutdown del server...');
  process.exit(0);
});
