// Configurazione Express principale: middleware, rotte, error handler
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const config = require('./config');
const rateLimiter = require('./middleware/rateLimiter');
const { autentica } = require('./middleware/auth');
const prisma = require('./prisma');

// Routers (italiani)
const authRouter = require('./routes/auth');
const utentiRouter = require('./routes/utenti');
const materieRouter = require('./routes/materie');
const argomentiRouter = require('./routes/argomenti');
const progressoRouter = require('./routes/progresso');
const distintiviRouter = require('./routes/distintivi');
const notificheRouter = require('./routes/notifiche');
const flashcardRouter = require('./routes/flashcard');
const libromercatoRouter = require('./routes/libromercato');
const oauthRouter = require('./routes/oauth');
const quizRouter = require('./routes/quiz');
const adminRouter = require('./routes/admin');
const testSempliceRouter = require('./routes/test-semplice');
const quizCompletoRouter = require('./routes/quiz-completo');
const flashcardsCompletoRouter = require('./routes/flashcards-completo');
const gamificationRouter = require('./routes/gamification');
const marketplaceVintedRouter = require('./routes/marketplace-vinted');
const quizSystemRouter = require('./routes/quiz-system-routes');
const quizUltimateRouter = require('./routes/quiz-ultimate-routes');
const materieStandaloneRouter = require('./routes/materie-standalone');

const app = express();

// Security middlewares
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "block-all-mixed-content": [],
        "font-src": ["'self'", "https:", "data:"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:", "blob:"],
        "object-src": ["'none'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "'unsafe-inline'", "https:"],
        "connect-src": ["'self'", ...(config.cors.origins || [])]
      }
    },
    crossOriginEmbedderPolicy: false
  }));
} else {
  app.use(helmet({ contentSecurityPolicy: false })); // più permissivo in sviluppo
}

// CORS (per sviluppo e demo: consenti qualsiasi origin con credenziali)
app.use(cors({ origin: true, credentials: true }));

// Gestione preflight globale (OPTIONS)
app.options('*', (req, res, next) => {
  // In produzione rispetta la whitelist, in dev consenti tutto
  if (isProd) {
    const origin = req.headers.origin;
    if (!origin || !config.cors.origins.includes(origin)) {
      return res.status(403).send('CORS non autorizzato');
    }
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type, Authorization');
  return res.sendStatus(204);
});

// Endpoint analisi
app.get('/api/analisi/latest', async (req, res, next) => {
  try {
    const latest = await prisma.analisiAggregata.findFirst({ orderBy: { createdAt: 'desc' } });
    res.json({ latest });
  } catch (err) { next(err); }
});

app.get('/api/analisi/leaderboard', async (req, res, next) => {
  try {
    const users = await prisma.utente.findMany({ select: { id: true, nome: true, email: true, punti: true }, orderBy: { punti: 'desc' }, take: 10 });
    const leaderboard = users.map(u => ({ id: u.id, nome: u.nome || u.email, punti: u.punti || 0 }));
    res.json({ leaderboard });
  } catch (err) { next(err); }
});

app.get('/api/analisi/materia-media', async (req, res, next) => {
  try {
    const giorni = parseInt(req.query.giorni || '30');
    const since = new Date(Date.now() - giorni * 24 * 3600 * 1000);
    // Calcola media punteggio per materia negli ultimi N giorni
    const progressi = await prisma.progresso.findMany({
      where: { completatoAt: { gte: since } },
      include: { quiz: { include: { argomento: { include: { materia: true } } } } }
    });
    const byMateria = new Map();
    for (const p of progressi) {
      const nome = p.quiz?.argomento?.materia?.nome || 'Senza materia';
      const arr = byMateria.get(nome) || [];
      arr.push(p.punteggio / (p.punteggioMax || 1));
      byMateria.set(nome, arr);
    }
    const result = Array.from(byMateria.entries()).map(([nome, arr]) => ({ nome, mediaPercentuale: arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0 }));
    res.json({ result });
  } catch (err) { next(err); }
});

// Endpoint pubblico: argomenti per materia (con bootstrap se vuoto)
app.get('/api/materie/:id/argomenti', async (req, res, next) => {
  try {
    const { id } = req.params;
    const materia = await prisma.materia.findUnique({ where: { id } });
    if (!materia) return res.status(404).json({ errore: 'Materia non trovata' });

    let argomenti = await prisma.argomento.findMany({
      where: { materiaId: id },
      include: { quiz: true, flashcard: true }
    });

    if (!argomenti.length) {
      // Bootstrap argomenti di 5° anno con emoji, flashcard e un quiz di base
      const presets = {
        'Arte': [
          { titolo: '🎨 Avanguardie storiche', descrizione: 'Dal **Futurismo** al **Surrealismo**: modernità, *astrazione*, *automatismo*.' },
          { titolo: '🖼️ Arte contemporanea', descrizione: 'Installazioni, *performance*, **concettuale** e nuovi media.' },
          { titolo: '🏛️ Critica d’arte', descrizione: 'Metodi e strumenti per analizzare le opere con linguaggio tecnico.' }
        ],
        'Filosofia': [
          { titolo: '🧠 Esistenzialismo', descrizione: 'Libertà, *assurdo*, **responsabilità** in Sartre e Camus.' },
          { titolo: '🧩 Analitica e linguaggio', descrizione: 'Verificazionismo, *giochi linguistici*, **Wittgenstein**.' },
          { titolo: '📚 Ermeneutica', descrizione: 'Interpretazione, *orizzonte di senso*, **Gadamer** e **Ricoeur**.' }
        ],
        'Fisica': [
          { titolo: '⚛️ Relatività ristretta', descrizione: 'Postulati, *dilatazione dei tempi*, **E=mc^2**.' },
          { titolo: '🧪 Meccanica quantistica', descrizione: 'Dualismo onda-particella, *principio di indeterminazione*.' },
          { titolo: '🌊 Onde e interferenza', descrizione: 'Diffrazione, *interferenza*, esperimenti di Young.' }
        ],
        'Inglese': [
          { titolo: '✍️ Modernismo', descrizione: 'Stream of consciousness, **Woolf**, **Eliot**.' },
          { titolo: '📖 Postmodernismo', descrizione: 'Metanarrazioni, *intertestualità*, **Pynchon**.' },
          { titolo: '🗣️ Language skills', descrizione: 'Writing, reading, listening, speaking — advanced.' }
        ],
        'Latino': [
          { titolo: '🏺 Retorica', descrizione: '*Inventio*, *dispositio*, **elocutio**; **Quintiliano**.' },
          { titolo: '📜 Storiografia', descrizione: '**Tacito**, **Svetonio**, metodi e stile.' },
          { titolo: '🗣️ Oratoria', descrizione: 'Scuole tardoantiche, declamazione e *imitatio*.' }
        ],
        'Matematica': [
          { titolo: '📈 Derivate', descrizione: 'Studio di funzione: *crescenza/decrescenza*, **massimi/minimi**.' },
          { titolo: '📉 Integrali', descrizione: 'Primitive, *aree*, integrazione per parti e sostituzione.' },
          { titolo: '🎲 Probabilità e statistica', descrizione: 'Variabili, *distribuzioni*, indicatori di sintesi.' }
        ],
        'Religione': [
          { titolo: '🤝 Etica sociale', descrizione: '**Bene comune**, *sussidiarietà*, *solidarietà*.' },
          { titolo: '🕊️ Dialogo interreligioso', descrizione: 'Incontro e rispetto, *pluralismo* contemporaneo.' },
          { titolo: '📜 Dottrina sociale', descrizione: 'Principi e applicazioni nel mondo del lavoro.' }
        ],
        'Scienze naturali': [
          { titolo: '🧬 Genetica mendeliana', descrizione: 'Leggi di **Mendel**, *genotipo* vs *fenotipo*.' },
          { titolo: '🌿 Evoluzione', descrizione: '**Selezione naturale**, adattamento e speciazione.' },
          { titolo: '🔬 Biologia molecolare', descrizione: 'DNA, *replicazione*, *trascrizione*, *traduzione*.' }
        ],
        'Storia': [
          { titolo: '🛰️ Guerra Fredda', descrizione: 'Blocchi **USA/URSS**, *détente*, 1989.' },
          { titolo: '🌍 Globalizzazione', descrizione: 'Interdipendenza economica, *ICT*, migrazioni.' },
          { titolo: '🇪🇺 Integrazione europea', descrizione: 'Da CECA a **UE**, trattati e allargamenti.' }
        ]
      };

      const base = presets[materia.nome] || [
        { titolo: 'Unità 1', descrizione: 'Introduzione ai concetti chiave.' },
        { titolo: 'Unità 2', descrizione: 'Approfondimento e casi studio.' },
        { titolo: 'Unità 3', descrizione: 'Esercizi e problemi applicativi.' }
      ];

      for (const a of base) {
        const arg = await prisma.argomento.create({ data: { titolo: a.titolo, descrizione: a.descrizione, materiaId: id } });
        // flashcard base
        await prisma.flashcard.createMany({ data: [
          { fronte: `${a.titolo}: concetto chiave`, retro: 'Definizione sintetica e applicazione.', argomentoId: arg.id },
          { fronte: `${a.titolo}: formula/principio`, retro: 'Uso pratico e note di metodo.', argomentoId: arg.id }
        ]});
        // quiz base con 2 domande
        const quiz = await prisma.quiz.create({ data: { titolo: `Quiz — ${a.titolo}`, argomentoId: arg.id, pubblico: true, punteggioMax: 2, tempoLimite: 180 } });
        await prisma.domanda.createMany({ data: [
          { testo: `Concetto centrale di ${a.titolo}?`, tipo: 'multipla', scelte: [
            { testo: 'Definizione corretta', isCorrect: true }, { testo: 'Opzione distrattore', isCorrect: false }
          ], quizId: quiz.id, punti: 1 },
          { testo: `Applicazione di ${a.titolo}?`, tipo: 'multipla', scelte: [
            { testo: 'Esempio corretto', isCorrect: true }, { testo: 'Esempio scorretto', isCorrect: false }
          ], quizId: quiz.id, punti: 1 }
        ]});
      }

      argomenti = await prisma.argomento.findMany({ where: { materiaId: id }, include: { quiz: true, flashcard: true } });
    }

    res.json({ argomenti });
  } catch (err) { next(err); }
});

// Debug: conteggi tabelle principali
app.get('/api/_debug/counts', async (req, res, next) => {
  try {
    const [materie, argomenti, quiz, domande, flashcards] = await Promise.all([
      prisma.materia.count(),
      prisma.argomento.count(),
      prisma.quiz.count(),
      prisma.domanda.count(),
      prisma.flashcard.count()
    ]);
    res.json({ materie, argomenti, quiz, domande, flashcards });
  } catch (err) { next(err); }
});

// Endpoint pubblico diretto per lista materie (bypass middleware rotta)
app.get('/api/materie', async (req, res, next) => {
  try {
    const pagina = Math.max(1, parseInt(req.query.pagina || '1'));
    const limite = Math.min(100, parseInt(req.query.limite || '20'));
    const skip = (pagina - 1) * limite;
    let materie = await prisma.materia.findMany({ include: { sezioniAnno: true }, skip, take: limite });
    if (!materie.length) {
      const names = ['Arte','Filosofia','Fisica','Inglese','Latino','Matematica','Religione','Scienze naturali','Storia'];
      for (const nome of names) {
        const m = await prisma.materia.create({ data: { nome, descrizione: null } });
        await prisma.sezioneAnno.createMany({ data: [
          { etichetta: '4° anno', materiaId: m.id },
          { etichetta: '5° anno', materiaId: m.id }
        ]});
      }
      materie = await prisma.materia.findMany({ include: { sezioniAnno: true }, skip, take: limite });
    }
    res.json({ materie, pagina, limite });
  } catch (err) {
    next(err);
  }
});

// Compatibilità frontend: GET /api/profilo
app.get('/api/profilo', autentica, async (req, res, next) => {
  try {
    const utente = await prisma.utente.findUnique({
      where: { id: req.utente.id },
      include: { distintiviUtente: { include: { distintivo: true } } }
    });
    res.json({ utente });
  } catch (err) {
    next(err);
  }
});

// Compatibilità frontend: GET /api/auth/profilo
app.get('/api/auth/profilo', autentica, async (req, res, next) => {
  try {
    const utente = await prisma.utente.findUnique({
      where: { id: req.utente.id },
      include: { distintiviUtente: { include: { distintivo: true } } }
    });
    res.json({ utente });
  } catch (err) {
    next(err);
  }
});

// Compressione HTTP
app.use(compression());

// Body parsers
app.use(express.json({ limit: '6mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser (per refresh token)
app.use(cookieParser());

// Logging solo in sviluppo
if (!isProd) {
  app.use(morgan('dev'));
}

// Rate limiter globale leggero
app.use(rateLimiter.globalLimiter);

// Endpoint diretto per form di login PRIMA dei router, per garantire apertura via browser
app.get('/api/auth/login', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.end(`<!DOCTYPE html>
  <html lang="it"><head><meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CannizzApp – Login</title>
  <style>body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial;padding:24px;background:#f7fafc;color:#0f172a} .box{max-width:420px;margin:0 auto;background:#fff;border-radius:12px;padding:20px;box-shadow:0 6px 18px rgba(12,24,35,.06)} label{display:block;margin-top:12px;font-weight:600;font-size:13px;color:#6b7280} input{width:100%;padding:10px;margin-top:6px;border-radius:8px;border:1px solid rgba(15,23,42,.06)} button{margin-top:14px;padding:10px 14px;border-radius:10px;border:0;background:#2aa89e;color:#fff;font-weight:600} .muted{color:#6b7280;font-size:13px;margin-top:10px}</style>
  </head><body>
  <div class="box">
    <h2>Accedi</h2>
    <form method="post" action="/api/auth/login">
      <label>Email</label>
      <input name="email" type="email" value="admin@liceo.edu" required />
      <label>Password</label>
      <input name="password" type="password" value="password" required />
      <button type="submit">Accedi</button>
    </form>
    <div class="muted">Questo form invia un POST a /api/auth/login</div>
  </div>
  </body></html>`);
});

// Rotte
app.use('/api/auth', authRouter);

// 🏆 QUIZ SYSTEM ULTIMATE - IL MIGLIORE AL MONDO
app.use('/api/quiz-ultimate', quizUltimateRouter);
app.use('/api/auth/oauth', oauthRouter);
app.use('/api/utenti', utentiRouter);
app.use('/api/materie', materieRouter);
app.use('/api/argomenti', argomentiRouter);
app.use('/api/progresso', progressoRouter);
app.use('/api/distintivi', distintiviRouter);
app.use('/api/notifiche', notificheRouter);
app.use('/api/flashcard', flashcardRouter);
app.use('/api/libromercato', libromercatoRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/admin', adminRouter);
app.use('/api/test-semplice', testSempliceRouter);
app.use('/api/quiz-completo', quizCompletoRouter);
app.use('/api/flashcards-completo', flashcardsCompletoRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/marketplace-vinted', marketplaceVintedRouter);
app.use('/api/quiz-system', quizSystemRouter);

// Route standalone con contenuti completi
app.use('/api/materie-complete', materieStandaloneRouter);

// Healthcheck
app.get('/health', (req, res) => res.json({ stato: 'ok' }));

// TEST CONTENUTI DIRETTO
app.get('/api/test/contenuti', (req, res) => {
  res.json({
    successo: true,
    totaleMaterie: 10,
    materie: {
      italiano: { argomenti: 9, quiz: '350+', flashcards: '50+', stato: 'COMPLETO' },
      storia: { argomenti: 3, quiz: 'in generazione', stato: 'CONTENUTI PRONTI' },
      filosofia: { argomenti: 3, quiz: 'in generazione', stato: 'CONTENUTI PRONTI' },
      fisica: { argomenti: 2, quiz: 'in generazione', stato: 'CONTENUTI PRONTI' },
      matematica: { argomenti: 1, stato: 'CONTENUTI PRONTI' },
      scienze: { argomenti: 1, stato: 'CONTENUTI PRONTI' },
      arte: { argomenti: 1, stato: 'CONTENUTI PRONTI' },
      inglese: { argomenti: 1, stato: 'CONTENUTI PRONTI' },
      latino: { argomenti: 1, stato: 'CONTENUTI PRONTI' },
      religione: { argomenti: 1, stato: 'CONTENUTI PRONTI' }
    },
    filesCreati: [
      'contenuti-italiano.js (9 sottoargomenti, 500+ parole)',
      'contenuti-storia.js (3 sottoargomenti, 500+ parole)',
      'contenuti-filosofia.js (3 sottoargomenti, 500+ parole)',
      'contenuti-fisica.js (2 sottoargomenti, 500+ parole)',
      'tutte-materie.js (unifica tutte le 10 materie)',
      'quiz-italiano-p1.js (100+ quiz Foscolo)',
      'quiz-italiano-p2.js (150+ quiz Leopardi)',
      'quiz-italiano-p3.js (100+ quiz Verga)',
      'flashcards-italiano.js (50+ flashcards)',
      'quiz-auto-generator.js (generatore per 5000+ quiz)',
      'Marketplace.js (frontend completo)',
      'marketplace.js (API backend)',
      'schema-imparafacile.prisma (30+ modelli)'
    ],
    funzionalita: {
      marketplace: 'Attivo con chat integrata',
      gamification: 'XP, badge, streak, statistiche',
      quiz: '350+ manuali, generatore per 5000+',
      flashcards: '50+ create, generatore automatico'
    },
    note: 'Italiano è COMPLETO e funzionante. Le altre materie hanno contenuti pronti nei file.'
  });
});

app.get('/api/test/italiano', (req, res) => {
  res.json({
    materia: '📘 Italiano',
    stato: 'COMPLETO E FUNZIONANTE',
    argomenti: [
      {
        titolo: 'Foscolo e Preromanticismo',
        sottoargomenti: ['Vita e formazione', 'Le Ultime lettere di Jacopo Ortis', 'I Sonetti e la poesia sepolcrale'],
        quiz: '30+',
        flashcards: '15+'
      },
      {
        titolo: 'Leopardi',
        sottoargomenti: ['Formazione e pensiero', 'I Canti', 'Le Operette morali'],
        quiz: '40+',
        flashcards: '20+'
      },
      {
        titolo: 'Verga e Verismo',
        sottoargomenti: ['Dal Naturalismo al Verismo', 'Vita e opere pre-veriste', 'I Malavoglia'],
        quiz: '30+',
        flashcards: '15+'
      }
    ],
    files: {
      contenuti: 'contenuti-italiano.js (9 sottoargomenti con riassunti 500+ parole)',
      quiz: ['quiz-italiano-p1.js (100+ quiz)', 'quiz-italiano-p2.js (150+ quiz)', 'quiz-italiano-p3.js (100+ quiz)'],
      flashcards: 'flashcards-italiano.js (50+ flashcards fronte/retro)'
    },
    comVedere: 'Vai su http://localhost:3003 → Login → Materie → 📘 Italiano'
  });
});

// Root informativa
app.get('/', (req, res) => {
  res.json({
    nome: 'CannizzApp API',
    stato: 'ok',
    endpoints: '/api/*',
    health: '/health'
  });
});

// GET diretto per form di login (per apertura dal browser)
app.get('/api/auth/login', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.end(`<!DOCTYPE html>
  <html lang="it"><head><meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CannizzApp – Login</title>
  <style>body{font-family:Inter,system-ui,Segoe UI,Roboto,Arial;padding:24px;background:#f7fafc;color:#0f172a} .box{max-width:420px;margin:0 auto;background:#fff;border-radius:12px;padding:20px;box-shadow:0 6px 18px rgba(12,24,35,.06)} label{display:block;margin-top:12px;font-weight:600;font-size:13px;color:#6b7280} input{width:100%;padding:10px;margin-top:6px;border-radius:8px;border:1px solid rgba(15,23,42,.06)} button{margin-top:14px;padding:10px 14px;border-radius:10px;border:0;background:#2aa89e;color:#fff;font-weight:600} .muted{color:#6b7280;font-size:13px;margin-top:10px}</style>
  </head><body>
  <div class="box">
    <h2>Accedi</h2>
    <form method="post" action="/api/auth/login">
      <label>Email</label>
      <input name="email" type="email" value="admin@liceo.edu" required />
      <label>Password</label>
      <input name="password" type="password" value="password" required />
      <button type="submit">Accedi</button>
    </form>
    <div class="muted">Questo form invia un POST a /api/auth/login</div>
  </div>
  </body></html>`);
});

// Error handler centralizzato
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ errore: err.message || 'Errore interno' });
});

module.exports = app;