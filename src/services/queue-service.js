/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QUEUE SERVICE - CODE ASINCRONE PER TASK PESANTI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Gestisce:
 * - Invio email (benvenuto, reset password, notifiche)
 * - Push notifications
 * - Generazione report
 * - Aggiornamento classifiche
 * - Analytics aggregati
 */

const { Queue, Worker, QueueScheduler } = require('bullmq');
const nodemailer = require('nodemailer');

class QueueService {
  constructor() {
    this.connection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379
    };
    
    this.queues = {};
    this.workers = {};
    this.schedulers = {};
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INIZIALIZZAZIONE
  // ═══════════════════════════════════════════════════════════════════════════

  async init() {
    // Crea code
    this.queues.email = new Queue('email', { connection: this.connection });
    this.queues.push = new Queue('push-notifications', { connection: this.connection });
    this.queues.analytics = new Queue('analytics', { connection: this.connection });
    this.queues.classifica = new Queue('classifica', { connection: this.connection });
    this.queues.cleanup = new Queue('cleanup', { connection: this.connection });
    this.queues.reports = new Queue('reports', { connection: this.connection });

    // Crea scheduler per job ripetuti
    this.schedulers.email = new QueueScheduler('email', { connection: this.connection });
    this.schedulers.analytics = new QueueScheduler('analytics', { connection: this.connection });
    this.schedulers.classifica = new QueueScheduler('classifica', { connection: this.connection });
    this.schedulers.cleanup = new QueueScheduler('cleanup', { connection: this.connection });

    // Schedula job ricorrenti
    await this.scheduleRecurringJobs();

    console.log('✅ Queue service inizializzato');
  }

  async scheduleRecurringJobs() {
    // Aggiorna classifica ogni 5 minuti
    await this.queues.classifica.add(
      'aggiorna-classifica',
      {},
      { repeat: { every: 5 * 60 * 1000 } }
    );

    // Analytics aggregati ogni ora
    await this.queues.analytics.add(
      'aggregazione-oraria',
      {},
      { repeat: { every: 60 * 60 * 1000 } }
    );

    // Pulizia dati vecchi ogni giorno alle 3:00
    await this.queues.cleanup.add(
      'pulizia-giornaliera',
      {},
      { repeat: { cron: '0 3 * * *' } }
    );

    // Report settimanale ogni lunedì alle 8:00
    await this.queues.reports.add(
      'report-settimanale',
      {},
      { repeat: { cron: '0 8 * * 1' } }
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // WORKERS
  // ═══════════════════════════════════════════════════════════════════════════

  startWorkers() {
    // Worker Email
    this.workers.email = new Worker('email', async (job) => {
      return this.processEmail(job);
    }, { connection: this.connection, concurrency: 5 });

    // Worker Push Notifications
    this.workers.push = new Worker('push-notifications', async (job) => {
      return this.processPush(job);
    }, { connection: this.connection, concurrency: 10 });

    // Worker Analytics
    this.workers.analytics = new Worker('analytics', async (job) => {
      return this.processAnalytics(job);
    }, { connection: this.connection, concurrency: 2 });

    // Worker Classifica
    this.workers.classifica = new Worker('classifica', async (job) => {
      return this.processClassifica(job);
    }, { connection: this.connection, concurrency: 1 });

    // Worker Cleanup
    this.workers.cleanup = new Worker('cleanup', async (job) => {
      return this.processCleanup(job);
    }, { connection: this.connection, concurrency: 1 });

    // Worker Reports
    this.workers.reports = new Worker('reports', async (job) => {
      return this.processReport(job);
    }, { connection: this.connection, concurrency: 1 });

    // Event handlers
    Object.values(this.workers).forEach(worker => {
      worker.on('completed', (job) => {
        console.log(`✅ Job ${job.name} completato`);
      });
      worker.on('failed', (job, err) => {
        console.error(`❌ Job ${job.name} fallito:`, err.message);
      });
    });

    console.log('✅ Workers avviati');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROCESSORI JOB
  // ═══════════════════════════════════════════════════════════════════════════

  async processEmail(job) {
    const { tipo, destinatario, dati } = job.data;
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const templates = {
      benvenuto: {
        subject: '🎉 Benvenuto su ImparaFacile!',
        html: `
          <h1>Ciao ${dati.nome}!</h1>
          <p>Benvenuto su ImparaFacile, la piattaforma per studiare in modo efficace.</p>
          <p>Inizia subito a guadagnare XP completando quiz e flashcards!</p>
          <a href="https://imparafacile.it/dashboard" style="background:#667eea;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Vai alla Dashboard
          </a>
        `
      },
      resetPassword: {
        subject: '🔐 Reset Password - ImparaFacile',
        html: `
          <h1>Reset Password</h1>
          <p>Hai richiesto il reset della password.</p>
          <p>Clicca il link qui sotto per impostare una nuova password:</p>
          <a href="${dati.resetUrl}" style="background:#667eea;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
            Reimposta Password
          </a>
          <p><small>Il link scade tra 1 ora.</small></p>
        `
      },
      badge: {
        subject: `🏆 Nuovo Badge Sbloccato: ${dati.badgeNome}`,
        html: `
          <h1>Complimenti ${dati.nome}!</h1>
          <p>Hai sbloccato un nuovo badge:</p>
          <div style="text-align:center;padding:20px;">
            <span style="font-size:48px;">${dati.badgeIcona}</span>
            <h2>${dati.badgeNome}</h2>
            <p>${dati.badgeDescrizione}</p>
          </div>
        `
      },
      reportSettimanale: {
        subject: '📊 Il tuo Report Settimanale - ImparaFacile',
        html: `
          <h1>Ciao ${dati.nome}!</h1>
          <p>Ecco il tuo riepilogo della settimana:</p>
          <ul>
            <li>⭐ XP guadagnati: ${dati.xpSettimana}</li>
            <li>📝 Quiz completati: ${dati.quizCompletati}</li>
            <li>🔥 Streak attuale: ${dati.streak} giorni</li>
            <li>⏱️ Tempo di studio: ${dati.minutiStudio} minuti</li>
          </ul>
          <p>Continua così! 💪</p>
        `
      }
    };

    const template = templates[tipo];
    if (!template) throw new Error(`Template email non trovato: ${tipo}`);

    await transporter.sendMail({
      from: `"ImparaFacile" <${process.env.SMTP_USER}>`,
      to: destinatario,
      subject: template.subject,
      html: template.html
    });

    return { sent: true, tipo, destinatario };
  }

  async processPush(job) {
    const { tokens, titolo, corpo, dati } = job.data;
    
    // Integrazione con Firebase Cloud Messaging
    const admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
    }

    const message = {
      notification: { title: titolo, body: corpo },
      data: dati || {},
      tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    
    return {
      successCount: response.successCount,
      failureCount: response.failureCount
    };
  }

  async processAnalytics(job) {
    const prisma = require('../prisma');
    const { tipo } = job.data;

    if (tipo === 'aggregazione-oraria' || job.name === 'aggregazione-oraria') {
      // Aggrega statistiche dell'ultima ora
      const oraFa = new Date(Date.now() - 60 * 60 * 1000);
      
      const stats = await prisma.activityLog.groupBy({
        by: ['tipo'],
        where: { createdAt: { gte: oraFa } },
        _count: true
      });

      await prisma.analisiAggregata.create({
        data: {
          tipo: 'oraria',
          dati: { timestamp: new Date(), stats }
        }
      });

      return { aggregated: true, stats };
    }

    return { processed: true };
  }

  async processClassifica(job) {
    const prisma = require('../prisma');
    const cacheService = require('./cache-service');

    // Aggiorna classifica globale
    const classificaGlobale = await prisma.utente.findMany({
      where: { ruolo: 'STUDENTE' },
      orderBy: { punti: 'desc' },
      take: 100,
      select: {
        id: true,
        nome: true,
        avatarUrl: true,
        punti: true,
        livello: true,
        streak: { select: { streakCorrente: true } }
      }
    });

    await cacheService.setClassifica('globale', classificaGlobale);

    // Aggiorna classifica settimanale
    const inizioSettimana = new Date();
    inizioSettimana.setDate(inizioSettimana.getDate() - 7);

    const statsSettimana = await prisma.statisticheGiornaliere.groupBy({
      by: ['utenteId'],
      where: { data: { gte: inizioSettimana } },
      _sum: { xpGuadagnati: true },
      orderBy: { _sum: { xpGuadagnati: 'desc' } },
      take: 100
    });

    const utenteIds = statsSettimana.map(s => s.utenteId);
    const utenti = await prisma.utente.findMany({
      where: { id: { in: utenteIds } },
      select: { id: true, nome: true, avatarUrl: true }
    });

    const classificaSettimana = statsSettimana.map((s, i) => {
      const u = utenti.find(u => u.id === s.utenteId);
      return {
        posizione: i + 1,
        id: s.utenteId,
        nome: u?.nome || 'Utente',
        avatarUrl: u?.avatarUrl,
        xpSettimana: s._sum.xpGuadagnati || 0
      };
    });

    await cacheService.setClassifica('settimana', classificaSettimana);

    // Aggiorna leaderboard Redis
    for (const u of classificaGlobale) {
      await cacheService.updateLeaderboard(u.id, u.punti, 'global');
    }

    return { updated: true, globale: classificaGlobale.length, settimana: classificaSettimana.length };
  }

  async processCleanup(job) {
    const prisma = require('../prisma');

    // Elimina notifiche vecchie
    const deletedNotifiche = await prisma.notifica.deleteMany({
      where: {
        letta: true,
        createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    });

    // Elimina activity log vecchi
    const deletedLogs = await prisma.activityLog.deleteMany({
      where: {
        createdAt: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
      }
    });

    // Elimina refresh token scaduti
    const deletedTokens = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revoked: true }
        ]
      }
    });

    return {
      notifiche: deletedNotifiche.count,
      logs: deletedLogs.count,
      tokens: deletedTokens.count
    };
  }

  async processReport(job) {
    const prisma = require('../prisma');

    if (job.name === 'report-settimanale') {
      // Genera report per tutti gli utenti attivi
      const inizioSettimana = new Date();
      inizioSettimana.setDate(inizioSettimana.getDate() - 7);

      const utentiAttivi = await prisma.utente.findMany({
        where: {
          statistiche: {
            some: { data: { gte: inizioSettimana } }
          }
        },
        include: {
          statistiche: {
            where: { data: { gte: inizioSettimana } }
          },
          streak: true
        }
      });

      for (const utente of utentiAttivi) {
        const xpSettimana = utente.statistiche.reduce((sum, s) => sum + s.xpGuadagnati, 0);
        const quizCompletati = utente.statistiche.reduce((sum, s) => sum + s.quizCompletati, 0);
        const minutiStudio = utente.statistiche.reduce((sum, s) => sum + s.minutiStudio, 0);

        // Invia email report
        await this.addEmailJob('reportSettimanale', utente.email, {
          nome: utente.nome,
          xpSettimana,
          quizCompletati,
          streak: utente.streak?.streakCorrente || 0,
          minutiStudio
        });
      }

      return { reportsSent: utentiAttivi.length };
    }

    return { processed: true };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // API PUBBLICA
  // ═══════════════════════════════════════════════════════════════════════════

  async addEmailJob(tipo, destinatario, dati, options = {}) {
    return this.queues.email.add('send-email', {
      tipo,
      destinatario,
      dati
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      ...options
    });
  }

  async addPushJob(tokens, titolo, corpo, dati = {}) {
    return this.queues.push.add('send-push', {
      tokens,
      titolo,
      corpo,
      dati
    }, {
      attempts: 2,
      backoff: { type: 'fixed', delay: 5000 }
    });
  }

  async addAnalyticsJob(tipo, dati = {}) {
    return this.queues.analytics.add(tipo, dati);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════

  async shutdown() {
    // Chiudi workers
    await Promise.all(Object.values(this.workers).map(w => w.close()));
    
    // Chiudi scheduler
    await Promise.all(Object.values(this.schedulers).map(s => s.close()));
    
    // Chiudi code
    await Promise.all(Object.values(this.queues).map(q => q.close()));

    console.log('✅ Queue service chiuso');
  }
}

// Singleton
const queueService = new QueueService();

module.exports = queueService;
