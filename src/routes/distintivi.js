// Endpoints per distintivi (badge) e assegnazione (italiano)
const express = require('express');
const prisma = require('../prisma');
const { autentica } = require('../middleware/auth');
const { consenti } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/distintivi - lista distintivi disponibili
 */
router.get('/', autentica, async (req, res, next) => {
  try {
    const distintivi = await prisma.distintivo.findMany();
    res.json({ distintivi });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/distintivi/assegna - assegna distintivo manualmente (admin)
 * body: { utenteId, chiave }
 */
router.post('/assegna', autentica, consenti('ADMIN'), async (req, res, next) => {
  try {
    const { utenteId, chiave, meta } = req.body;
    const distintivo = await prisma.distintivo.findUnique({ where: { chiave } });
    if (!distintivo) return res.status(404).json({ errore: 'Distintivo non trovato' });
    const du = await prisma.distintivoUtente.create({ data: { utenteId, distintivoId: distintivo.id, meta } });
    res.json({ distintivoUtente: du });
  } catch (err) {
    next(err);
  }
});

module.exports = router;