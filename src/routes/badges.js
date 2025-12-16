// Endpoints di base per badge e assignment automatico semplice
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/badges - lista badge disponibili
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const badges = await prisma.badge.findMany();
    res.json({ badges });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/badges/award - assegna badge manualmente (admin)
 * body: { userId, badgeKey }
 */
router.post('/award', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const { userId, badgeKey, meta } = req.body;
    const badge = await prisma.badge.findUnique({ where: { key: badgeKey } });
    if (!badge) return res.status(404).json({ error: 'Badge non trovato' });
    const ub = await prisma.userBadge.create({ data: { userId, badgeId: badge.id, meta } });
    res.json({ userBadge: ub });
  } catch (err) {
    next(err);
  }
});

module.exports = router;