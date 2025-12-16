/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STATISTICHE ROUTES - STATISTICHE LIVE CON PG
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const { Utenti, Statistiche, Streak, Notifiche } = require('../db');
const authRoutes = require('./auth-pg');

const router = express.Router();
const auth = authRoutes.authenticateToken;

/**
 * GET /api/stats/dashboard - Dashboard completa
 */
router.get('/dashboard', auth, async (req, res) => {
  try {
    const utenteId = req.user.sub;

    const [utente, stats, streak, notificheNonLette, grafico] = await Promise.all([
      Utenti.findById(utenteId),
      Statistiche.getStatisticheUtente(utenteId),
      Streak.getStreak(utenteId),
      Notifiche.countNonLette(utenteId),
      Statistiche.getGraficoSettimana(utenteId)
    ]);

    res.json({
      profilo: {
        id: utente.id,
        nome: utente.nome,
        email: utente.email,
        avatarUrl: utente.avatarUrl,
        xpTotale: utente.punti,
        livello: utente.livello,
        progressoLivello: calcolaProgressoLivello(utente.punti),
        xpPerProssimoLivello: calcolaXpProssimoLivello(utente.punti)
      },
      statistiche: stats,
      streak: {
        corrente: streak?.streakCorrente || 0,
        massimo: streak?.streakMassimo || 0,
        freezeDisponibili: 3 - (streak?.freezeUsati || 0)
      },
      notificheNonLette,
      graficoSettimana: grafico
    });

  } catch (error) {
    console.error('Errore dashboard:', error);
    res.status(500).json({ errore: 'Errore caricamento dashboard' });
  }
});

/**
 * POST /api/stats/quiz - Registra quiz completato
 */
router.post('/quiz', auth, async (req, res) => {
  try {
    const { corretto, materia } = req.body;
    const xpGuadagnati = corretto ? 10 : 2;

    const result = await Statistiche.registraQuiz(req.user.sub, {
      corretto,
      xpGuadagnati,
      materia
    });

    // Aggiorna streak
    await Streak.aggiornaStreak(req.user.sub);

    res.json({
      success: true,
      xpGuadagnati,
      xpTotale: result.punti,
      livello: result.livello
    });

  } catch (error) {
    console.error('Errore registra quiz:', error);
    res.status(500).json({ errore: 'Errore registrazione quiz' });
  }
});

/**
 * POST /api/stats/flashcard - Registra flashcard vista
 */
router.post('/flashcard', auth, async (req, res) => {
  try {
    const { ricordata } = req.body;
    const xpGuadagnati = ricordata ? 5 : 2;

    await Statistiche.registraFlashcard(req.user.sub, { ricordata, xpGuadagnati });
    await Streak.aggiornaStreak(req.user.sub);

    res.json({ success: true, xpGuadagnati });

  } catch (error) {
    console.error('Errore registra flashcard:', error);
    res.status(500).json({ errore: 'Errore registrazione flashcard' });
  }
});

/**
 * POST /api/stats/sessione - Registra sessione studio
 */
router.post('/sessione', auth, async (req, res) => {
  try {
    const { durataMinuti, materia } = req.body;
    const xpGuadagnati = Math.floor(durataMinuti * 1.5);

    await Statistiche.registraSessione(req.user.sub, { durataMinuti, materia, xpGuadagnati });
    await Streak.aggiornaStreak(req.user.sub);

    res.json({ success: true, xpGuadagnati, durataMinuti });

  } catch (error) {
    console.error('Errore registra sessione:', error);
    res.status(500).json({ errore: 'Errore registrazione sessione' });
  }
});

/**
 * GET /api/stats/streak
 */
router.get('/streak', auth, async (req, res) => {
  try {
    const streak = await Streak.getStreak(req.user.sub);
    
    res.json({
      corrente: streak?.streakCorrente || 0,
      massimo: streak?.streakMassimo || 0,
      freezeDisponibili: 3 - (streak?.freezeUsati || 0)
    });

  } catch (error) {
    console.error('Errore streak:', error);
    res.status(500).json({ errore: 'Errore caricamento streak' });
  }
});

/**
 * GET /api/stats/notifiche
 */
router.get('/notifiche', auth, async (req, res) => {
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
 * POST /api/stats/notifiche/:id/letta
 */
router.post('/notifiche/:id/letta', auth, async (req, res) => {
  try {
    await Notifiche.segnaLetta(req.params.id, req.user.sub);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ errore: 'Errore' });
  }
});

/**
 * GET /api/stats/classifica
 */
router.get('/classifica', async (req, res) => {
  try {
    const { limite = 10, tipo = 'globale' } = req.query;
    
    const classifica = tipo === 'settimana' 
      ? await Utenti.getClassificaSettimanale(parseInt(limite))
      : await Utenti.getClassifica(parseInt(limite));

    res.json({ classifica });

  } catch (error) {
    console.error('Errore classifica:', error);
    res.status(500).json({ errore: 'Errore caricamento classifica' });
  }
});

// Helper functions
function calcolaProgressoLivello(xp) {
  const livelli = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800];
  let livello = 1;
  for (let i = 0; i < livelli.length; i++) {
    if (xp >= livelli[i]) livello = i + 1;
  }
  const xpLivelloCorrente = livelli[livello - 1] || 0;
  const xpProssimoLivello = livelli[livello] || livelli[livelli.length - 1] + 1000;
  return Math.round(((xp - xpLivelloCorrente) / (xpProssimoLivello - xpLivelloCorrente)) * 100);
}

function calcolaXpProssimoLivello(xp) {
  const livelli = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800];
  for (const l of livelli) {
    if (xp < l) return l - xp;
  }
  return 1000;
}

module.exports = router;
