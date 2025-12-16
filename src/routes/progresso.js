// Endpoint per progresso e statistiche di base (italiano)
const express = require('express');
const prisma = require('../prisma');
const { autentica } = require('../middleware/auth');
const { consenti } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/progresso/me - tutti i progressi dell'utente loggato
 */
router.get('/me', autentica, async (req, res, next) => {
  try {
    const progressi = await prisma.progresso.findMany({ where: { utenteId: req.utente.id }, include: { quiz: true } });
    res.json({ progressi });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progresso/stats/me - statistiche semplici per utente (media, frequenza settimanale)
 */
router.get('/stats/me', autentica, async (req, res, next) => {
  try {
    const progressi = await prisma.progresso.findMany({ where: { utenteId: req.utente.id } });
    const totale = progressi.length;
    const avgScore = totale ? progressi.reduce((s, p) => s + (p.punteggio / (p.punteggioMax || 1)), 0) / totale : 0;
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const settimanale = progressi.filter(p => p.completatoAt >= since).length;
    res.json({ totale, media: avgScore, settimanale });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/progresso/utente/:utenteId - (DOCENTE/ADMIN) vedere progresso di uno studente
 */
router.get('/utente/:utenteId', autentica, consenti('ADMIN', 'DOCENTE'), async (req, res, next) => {
  try {
    const { utenteId } = req.params;
    const progressi = await prisma.progresso.findMany({ where: { utenteId } });
    res.json({ progressi });
  } catch (err) {
    next(err);
  }
});

module.exports = router;