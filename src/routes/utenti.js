// Rotte per gestione profili utente (italiano)
const express = require('express');
const prisma = require('../prisma');
const { autentica } = require('../middleware/auth');
const { consenti } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/utenti/me - profilo corrente
 */
router.get('/me', autentica, async (req, res, next) => {
  try {
    const utente = await prisma.utente.findUnique({ where: { id: req.utente.id }, include: { distintiviUtente: true } });
    res.json({ utente });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/utenti/me - aggiorna profilo (nome, preferenze, avatar)
 */
router.put('/me', autentica, async (req, res, next) => {
  try {
    const { nome, preferenze, avatarUrl } = req.body;
    const utente = await prisma.utente.update({
      where: { id: req.utente.id },
      data: { nome, preferenze: preferenze ? preferenze : undefined, avatarUrl }
    });
    res.json({ utente });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/utenti - lista utenti (solo admin)
 * Supporta paginazione: ?pagina=1&limite=20
 */
router.get('/', autentica, consenti('ADMIN'), async (req, res, next) => {
  try {
    const pagina = Math.max(1, parseInt(req.query.pagina || '1'));
    const limite = Math.min(100, parseInt(req.query.limite || '20'));
    const skip = (pagina - 1) * limite;
    const utenti = await prisma.utente.findMany({ include: { distintiviUtente: true }, skip, take: limite });
    res.json({ utenti, pagina, limite });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/utenti/:id - elimina utente (admin)
 */
router.delete('/:id', autentica, consenti('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.utente.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;