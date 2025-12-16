// Rotte per ottenere report e snapshot analitici (italiano)
const express = require('express');
const prisma = require('../prisma');
const { autentica } = require('../middleware/auth');
const { consenti } = require('../middleware/roles');
const router = express.Router();

/**
 * GET /api/analisi/latest
 * Ritorna l'ultimo snapshot registrato (qualunque tipo)
 */
router.get('/latest', autentica, async (req, res, next) => {
  try {
    const latest = await prisma.analisiAggregata.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ latest });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analisi/leaderboard
 * Ritorna la leaderboard attuale (top 20)
 */
router.get('/leaderboard', autentica, async (req, res, next) => {
  try {
    const top = await prisma.utente.findMany({
      orderBy: { punti: 'desc' },
      take: 20,
      select: { id: true, nome: true, punti: true, livello: true }
    });
    res.json({ leaderboard: top });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analisi/materia-media
 * query: ?giorni=30 (default 30)
 * ritorna media punteggio per materia negli ultimi N giorni
 */
router.get('/materia-media', autentica, async (req, res, next) => {
  try {
    const giorni = parseInt(req.query.giorni || '30');
    const since = new Date(Date.now() - giorni * 24 * 3600 * 1000);
    const progressi = await prisma.progresso.findMany({
      where: { completatoAt: { gte: since } },
      include: { quiz: { include: { argomento: { include: { materia: true } } } } }
    });

    const agg = {};
    for (const p of progressi) {
      const mat = p.quiz.argomento.materia;
      if (!agg[mat.id]) agg[mat.id] = { nome: mat.nome, totalScore: 0, totalMax: 0, count: 0 };
      agg[mat.id].totalScore += p.punteggio;
      agg[mat.id].totalMax += p.punteggioMax;
      agg[mat.id].count += 1;
    }

    const result = Object.values(agg).map(m => ({
      nome: m.nome,
      mediaPercentuale: m.totalMax ? +(m.totalScore / m.totalMax).toFixed(3) : 0,
      totali: m.count
    }));

    res.json({ giorni, result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analisi/snapshots?limit=10
 */
router.get('/snapshots', autentica, consenti('ADMIN', 'DOCENTE'), async (req, res, next) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const snaps = await prisma.analisiAggregata.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
    res.json({ snaps });
  } catch (err) {
    next(err);
  }
});

module.exports = router;