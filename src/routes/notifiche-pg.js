/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICHE ROUTES - DATABASE REALE (PG)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { Notifiche } = require('../db');
const authRoutes = require('./auth-pg');
const auth = authRoutes.authenticateToken;

/**
 * GET /api/notifiche - Lista notifiche utente
 */
router.get('/', auth, async (req, res) => {
  try {
    const { limite = 20 } = req.query;
    
    const [notifiche, nonLette] = await Promise.all([
      Notifiche.getNotifiche(req.user.sub, parseInt(limite)),
      Notifiche.countNonLette(req.user.sub)
    ]);

    res.json({ notifiche, nonLette });

  } catch (error) {
    console.error('Errore notifiche:', error);
    res.status(500).json({ errore: 'Errore caricamento notifiche' });
  }
});

/**
 * POST /api/notifiche/:id/letta - Segna come letta
 */
router.post('/:id/letta', auth, async (req, res) => {
  try {
    await Notifiche.segnaLetta(req.params.id, req.user.sub);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ errore: 'Errore' });
  }
});

/**
 * POST /api/notifiche/tutte-lette - Segna tutte come lette
 */
router.post('/tutte-lette', auth, async (req, res) => {
  try {
    await Notifiche.segnaTutteLette(req.user.sub);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ errore: 'Errore' });
  }
});

/**
 * GET /api/notifiche/count - Conta non lette
 */
router.get('/count', auth, async (req, res) => {
  try {
    const count = await Notifiche.countNonLette(req.user.sub);
    res.json({ nonLette: count });
  } catch (error) {
    res.status(500).json({ errore: 'Errore' });
  }
});

module.exports = router;
