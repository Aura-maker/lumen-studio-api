// Worker aggiornato: invia email/job, assegna distintivi, invia push tramite FCM, usa query aggregate per costanza
const { Worker } = require('bullmq');
const prisma = require('../prisma');
const { connection } = require('../services/queue');
const { inviaPushUtente } = require('../services/push');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const worker = new Worker('lavori', async (job) => {
  const { name, data } = job;
  console.log(`Worker: esecuzione job ${name}`, data);

  if (name === 'valuta-distintivi') {
    const { progressoId } = data;
    if (!progressoId) throw new Error('progressoId mancante');
    const progresso = await prisma.progresso.findUnique({
      where: { id: progressoId },
      include: { utente: true, quiz: { include: { argomento: { include: { materia: true } } } } }
    });
    if (!progresso) return;
    const utenteId = progresso.utenteId;
    const punteggio = progresso.punteggio;
    const punteggioMax = progresso.punteggioMax;
    const percent = punteggioMax > 0 ? punteggio / punteggioMax : 0;

    // Primo quiz
    const conta = await prisma.progresso.count({ where: { utenteId } });
    if (conta === 1) {
      const d = await prisma.distintivo.findUnique({ where: { chiave: 'primo_quiz' } });
      if (d) {
        const exists = await prisma.distintivoUtente.findFirst({ where: { utenteId, distintivoId: d.id } });
        if (!exists) {
          await prisma.distintivoUtente.create({ data: { utenteId, distintivoId: d.id } });
          await prisma.notifica.create({ data: { utenteId, titolo: `Hai ottenuto: ${d.titolo}`, corpo: d.descrizione || '', canale: 'in-app', payload: { chiave: d.chiave } } });
          // invia push
          await inviaPushUtente(utenteId, { title: `Hai ottenuto: ${d.titolo}`, body: d.descrizione || '' });
        }
      }
    }

    // Alto punteggio >= 90%
    if (percent >= 0.9) {
      const d = await prisma.distintivo.findUnique({ where: { chiave: 'alto_voto' } });
      if (d) {
        const exists = await prisma.distintivoUtente.findFirst({ where: { utenteId, distintivoId: d.id } });
        if (!exists) {
          await prisma.distintivoUtente.create({ data: { utenteId, distintivoId: d.id, meta: { progressoId } } });
          await prisma.notifica.create({ data: { utenteId, titolo: `Ottimo risultato! ${Math.round(percent*100)}%`, corpo: d.descrizione || '', canale: 'in-app', payload: { chiave: d.chiave } } });
          await inviaPushUtente(utenteId, { title: `Ottimo risultato! ${Math.round(percent*100)}%`, body: d.descrizione || '' });
        }
      }
    }

    // Mastery argomento: se 3 progressi >=80% nello stesso argomento
    try {
      const argId = progresso.quiz.argomentoId;
      // query: contare progressi per utente per argomento con percent >= 0.8
      const progs = await prisma.$queryRaw`
        SELECT COUNT(*)::int AS count
        FROM "Progresso" p
        JOIN "Quiz" q ON q.id = p.quiz_id
        WHERE p.utente_id = ${utenteId} AND q.argomento_id = ${argId} AND (CASE WHEN p.punteggio_max>0 THEN (p.punteggio::float / p.punteggio_max) ELSE 0 END) >= 0.8
      `;
      const count = progs[0] ? progs[0].count : 0;
      if (count >= 3) {
        const chiaveDinamica = `master_argomento_${argId}`;
        let distintivo = await prisma.distintivo.findUnique({ where: { chiave: chiaveDinamica } });
        if (!distintivo) {
          const arg = await prisma.argomento.findUnique({ where: { id: argId } });
          distintivo = await prisma.distintivo.create({
            data: {
              chiave: chiaveDinamica,
              titolo: `Master: ${arg?.titolo || argId}`,
              descrizione: `Mastery sull'argomento ${arg?.titolo || argId}`,
              punti: 50
            }
          });
        }
        const exists = await prisma.distintivoUtente.findFirst({ where: { utenteId, distintivoId: distintivo.id } });
        if (!exists) {
          await prisma.distintivoUtente.create({ data: { utenteId, distintivoId: distintivo.id } });
          await prisma.notifica.create({ data: { utenteId, titolo: `Hai ottenuto: ${distintivo.titolo}`, corpo: distintivo.descrizione || '', canale: 'in-app', payload: { chiave: distintivo.chiave } } });
          await inviaPushUtente(utenteId, { title: `Hai ottenuto: ${distintivo.titolo}`, body: distintivo.descrizione || '' });
        }
      }
    } catch (err) {
      console.warn('Errore mastery rule:', err.message);
    }

    return;
  } // end valuta-distintivi

  if (name === 'assegna-distintivi-costanza') {
    const giorni = data.giorni || 7;
    const cutoff = new Date(Date.now() - giorni * 24 * 3600 * 1000);
    // Query aggregata: per utente conta giorni distinti con progressi
    const rows = await prisma.$queryRawUnsafe(`
      SELECT utente_id, COUNT(DISTINCT DATE(completato_at)) as giorni_attivi
      FROM "Progresso"
      WHERE completato_at >= $1
      GROUP BY utente_id
      HAVING COUNT(DISTINCT DATE(completato_at)) >= $2
    `, cutoff.toISOString(), giorni);

    for (const r of rows) {
      const utenteId = r.utente_id;
      // assegna distintivo costanza
      const d = await prisma.distintivo.findUnique({ where: { chiave: 'costanza_settimana' } });
      if (!d) continue;
      const exists = await prisma.distintivoUtente.findFirst({ where: { utenteId, distintivoId: d.id } });
      if (!exists) {
        await prisma.distintivoUtente.create({ data: { utenteId, distintivoId: d.id, meta: { giorni, giorniAttivi: r.giorni_attivi } } });
        await prisma.notifica.create({ data: { utenteId, titolo: `Distintivo: ${d.titolo}`, corpo: d.descrizione || '', canale: 'in-app', payload: { chiave: d.chiave } } });
        await inviaPushUtente(utenteId, { title: `Distintivo: ${d.titolo}`, body: d.descrizione || '' });
      }
    }
    return;
  }

  if (name === 'calcola-analisi') {
    const tipo = data.tipo || 'on_demand';
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    // raccolta progressi negli ultimi 30 giorni con join su argomento/materia
    const progressi = await prisma.progresso.findMany({
      where: { completatoAt: { gte: since } },
      include: { quiz: { include: { argomento: { include: { materia: true } } } }, utente: true }
    });

    const materiaAgg = {};
    const argAgg = {};
    for (const p of progressi) {
      const arg = p.quiz.argomento;
      const mat = arg.materia;
      if (!materiaAgg[mat.id]) materiaAgg[mat.id] = { nome: mat.nome, totalScore: 0, totalMax: 0, count: 0 };
      materiaAgg[mat.id].totalScore += p.punteggio;
      materiaAgg[mat.id].totalMax += p.punteggioMax;
      materiaAgg[mat.id].count += 1;
      if (!argAgg[arg.id]) argAgg[arg.id] = { titolo: arg.titolo, completamenti: 0 };
      argAgg[arg.id].completamenti += 1;
    }

    const mediaPerMateria = Object.values(materiaAgg).map(m => ({
      nome: m.nome,
      mediaPercentuale: m.totalMax ? +(m.totalScore / m.totalMax).toFixed(3) : 0,
      totali: m.count
    }));

    const completamentiPerArgomento = Object.entries(argAgg).map(([id, a]) => ({ argomentoId: id, titolo: a.titolo, completamenti: a.completamenti }));

    const topUtenti = await prisma.utente.findMany({ orderBy: { punti: 'desc' }, take: 10, select: { id: true, nome: true, punti: true, livello: true } });

    const since7 = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const progressi7 = await prisma.progresso.findMany({ where: { completatoAt: { gte: since7 } }, select: { utenteId: true } });
    const utentiAttiviSet = new Set(progressi7.map(p => p.utenteId));
    const utentiAttiviSettimanali = utentiAttiviSet.size;

    const snapshot = {
      tipo,
      period: { from: since.toISOString(), to: new Date().toISOString() },
      mediaPerMateria,
      completamentiPerArgomento,
      leaderboard: topUtenti,
      utentiAttiviSettimanali
    };

    await prisma.analisiAggregata.create({ data: { tipo, dati: snapshot } });
    return;
  }

  if (name === 'invia-email') {
    // data: { utenteId, subject, text }
    const { utenteId, subject, text } = data;
    const user = await prisma.utente.findUnique({ where: { id: utenteId } });
    if (user && user.email) {
      try {
        await transporter.sendMail({ from: process.env.SMTP_USER, to: user.email, subject, text });
      } catch (err) {
        console.error('Invio email fallito', err.message);
      }
    }
    return;
  }

  if (name === 'cleanup-refresh-tokens') {
    // elimina refresh token revocati e scaduti più vecchi di X giorni
    const olderThanDays = data.days || 30;
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 3600 * 1000);
    await prisma.refreshToken.deleteMany({ where: { revoked: true, createdAt: { lt: cutoff } } });
    await prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 7 * 24 * 3600 * 1000) } } });
    return;
  }

  console.warn('Job non riconosciuto:', name);
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} (${job.name}) completato`));
worker.on('failed', (job, err) => console.error(`Job ${job?.id} (${job?.name}) fallito:`, err));

console.log('Worker avviato e in ascolto su queue "lavori"');