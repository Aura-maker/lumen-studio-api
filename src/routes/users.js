// Rotte per gestione profili utente: GET, PUT, delete (admin), list (admin)
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/users/me - profilo corrente
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { badges: true } });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/users/me - aggiorna profilo (name, preferences, avatar)
 * body: { name, preferences, avatarUrl }
 */
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { name, preferences, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, preferences: preferences ? preferences : undefined, avatarUrl }
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users - lista utenti (solo admin)
 */
router.get('/', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ include: { badges: true } });
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/users/:id - elimina utente (admin)
 */
router.delete('/:id', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;