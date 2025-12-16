// Endpoints per progresso e statistiche base
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/progress/me - tutti i progressi dell'utente
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const progresses = await prisma.progress.findMany({ where: { userId: req.user.id }, include: { quiz: true } });
    res.json({ progresses });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progress/stats/me - statistiche semplici per utente (media punteggio, frequenza settimanale)
 */
router.get('/stats/me', authenticate, async (req, res, next) => {
  try {
    const progresses = await prisma.progress.findMany({ where: { userId: req.user.id } });
    const total = progresses.length;
    const avgScore = total ? progresses.reduce((s, p) => s + p.score / p.maxScore, 0) / total : 0;
    // frequenza settimanale: conteggio degli ultimi 7 giorni
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const weekly = progresses.filter(p => p.completedAt >= since).length;
    res.json({ total, avgScore, weekly });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progress/user/:userId - (teacher/admin) vedere progresso di uno studente
 */
router.get('/user/:userId', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const progresses = await prisma.progress.findMany({ where: { userId } });
    res.json({ progresses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;