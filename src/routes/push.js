// Rotte per registrare/cancellare device tokens (FCM) - italiano
const express = require('express');
const prisma = require('../prisma');
const { autentica } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/push/register
 * body: { token, piattaforma }
 * Registra il device token associato all'utente
 */
router.post('/register', autentica, async (req, res, next) => {
  try {
    const { token, piattaforma = 'web' } = req.body;
    if (!token) return res.status(400).json({ errore: 'token mancante' });
    // upsert su token (unico)
    let dt = await prisma.deviceToken.findUnique({ where: { token } });
    if (dt && dt.utenteId !== req.utente.id) {
      // riassegna token all'utente corrente (es. nuovo login)
      dt = await prisma.deviceToken.update({ where: { token }, data: { utenteId: req.utente.id, piattaforma } });
    } else if (!dt) {
      dt = await prisma.deviceToken.create({ data: { utenteId: req.utente.id, token, piattaforma } });
    }
    res.json({ deviceToken: dt });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/push/unregister
 * body: { token }
 */
router.post('/unregister', autentica, async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ errore: 'token mancante' });
    await prisma.deviceToken.deleteMany({ where: { token, utenteId: req.utente.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;