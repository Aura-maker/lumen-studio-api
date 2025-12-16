/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GAMIFICATION ROUTES - DATABASE REALE (PG)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { Utenti, Statistiche, Streak } = require('../db');
const authRoutes = require('./auth-pg');
const auth = authRoutes.authenticateToken;

// Definizione badge
const BADGE = {
  'primo-quiz': { nome: '🎯 Primo Quiz', descrizione: 'Completa il tuo primo quiz', xp: 10, requisito: { quizCompletati: 1 } },
  'quiz-master-10': { nome: '🏆 Quiz Master', descrizione: 'Completa 10 quiz', xp: 50, requisito: { quizCompletati: 10 } },
  'quiz-master-50': { nome: '🥇 Quiz Champion', descrizione: 'Completa 50 quiz', xp: 200, requisito: { quizCompletati: 50 } },
  'quiz-master-100': { nome: '👑 Quiz Legend', descrizione: 'Completa 100 quiz', xp: 500, requisito: { quizCompletati: 100 } },
  'precisione-80': { nome: '🎯 Precisione', descrizione: 'Raggiungi 80% di accuratezza', xp: 100, requisito: { accuratezza: 80 } },
  'precisione-90': { nome: '🎯 Cecchino', descrizione: 'Raggiungi 90% di accuratezza', xp: 200, requisito: { accuratezza: 90 } },
  'streak-7': { nome: '🔥 Costanza', descrizione: '7 giorni consecutivi', xp: 70, requisito: { streak: 7 } },
  'streak-30': { nome: '🔥 Leggenda', descrizione: '30 giorni consecutivi', xp: 500, requisito: { streak: 30 } },
  'studioso-10h': { nome: '📚 Dedicato', descrizione: '10 ore di studio totale', xp: 100, requisito: { minutiStudio: 600 } },
  'studioso-50h': { nome: '📚 Esperto', descrizione: '50 ore di studio totale', xp: 300, requisito: { minutiStudio: 3000 } }
};

/**
 * GET /api/gamification/dashboard - Dashboard completa
 */
router.get('/dashboard', auth, async (req, res) => {
  try {
    const utenteId = req.user.sub;
    
    const [utente, stats, streak, posizione] = await Promise.all([
      Utenti.findById(utenteId),
      Statistiche.getStatisticheUtente(utenteId),
      Streak.getStreak(utenteId),
      Utenti.getPosizioneUtente(utenteId)
    ]);

    // Calcola badge sbloccati
    const badgeSbloccati = calcolaBadgeSbloccati(stats, streak);

    res.json({
      profilo: {
        id: utente.id,
        nome: utente.nome,
        avatarUrl: utente.avatarUrl,
        xp: utente.punti,
        livello: utente.livello,
        posizioneClassifica: posizione
      },
      statistiche: stats,
      streak: {
        corrente: streak?.streakCorrente || 0,
        massimo: streak?.streakMassimo || 0
      },
      badge: badgeSbloccati,
      badgeTotali: Object.keys(BADGE).length
    });

  } catch (error) {
    console.error('Errore dashboard:', error);
    res.status(500).json({ errore: 'Errore caricamento dashboard' });
  }
});

/**
 * GET /api/gamification/badge - Lista badge
 */
router.get('/badge', auth, async (req, res) => {
  try {
    const utenteId = req.user.sub;
    
    const [stats, streak] = await Promise.all([
      Statistiche.getStatisticheUtente(utenteId),
      Streak.getStreak(utenteId)
    ]);

    const badgeList = Object.entries(BADGE).map(([id, badge]) => {
      const sbloccato = verificaBadge(id, stats, streak);
      const progresso = calcolaProgressoBadge(id, stats, streak);
      
      return {
        id,
        ...badge,
        sbloccato,
        progresso
      };
    });

    res.json({
      badge: badgeList,
      sbloccati: badgeList.filter(b => b.sbloccato).length,
      totali: badgeList.length
    });

  } catch (error) {
    console.error('Errore badge:', error);
    res.status(500).json({ errore: 'Errore caricamento badge' });
  }
});

/**
 * GET /api/gamification/classifica
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

/**
 * GET /api/gamification/profilo - Profilo pubblico
 */
router.get('/profilo/:id?', async (req, res) => {
  try {
    const utenteId = req.params.id;
    
    if (!utenteId) {
      return res.status(400).json({ errore: 'ID utente richiesto' });
    }

    const [utente, stats, streak, posizione] = await Promise.all([
      Utenti.findById(utenteId),
      Statistiche.getStatisticheUtente(utenteId),
      Streak.getStreak(utenteId),
      Utenti.getPosizioneUtente(utenteId)
    ]);

    if (!utente) {
      return res.status(404).json({ errore: 'Utente non trovato' });
    }

    res.json({
      profilo: {
        id: utente.id,
        nome: utente.nome,
        avatarUrl: utente.avatarUrl,
        xp: utente.punti,
        livello: utente.livello,
        posizioneClassifica: posizione,
        membro_dal: utente.createdAt
      },
      statistiche: {
        quizCompletati: stats.quizCompletati,
        accuratezza: stats.accuratezzaMedia,
        streakMassimo: streak?.streakMassimo || 0
      }
    });

  } catch (error) {
    console.error('Errore profilo:', error);
    res.status(500).json({ errore: 'Errore caricamento profilo' });
  }
});

// Helper functions
function calcolaBadgeSbloccati(stats, streak) {
  return Object.entries(BADGE)
    .filter(([id]) => verificaBadge(id, stats, streak))
    .map(([id, badge]) => ({ id, ...badge }));
}

function verificaBadge(id, stats, streak) {
  const badge = BADGE[id];
  if (!badge?.requisito) return false;
  
  const req = badge.requisito;
  if (req.quizCompletati && stats.quizCompletati >= req.quizCompletati) return true;
  if (req.accuratezza && stats.accuratezzaMedia >= req.accuratezza) return true;
  if (req.streak && (streak?.streakMassimo || 0) >= req.streak) return true;
  if (req.minutiStudio && stats.minutiStudioTotali >= req.minutiStudio) return true;
  
  return false;
}

function calcolaProgressoBadge(id, stats, streak) {
  const badge = BADGE[id];
  if (!badge?.requisito) return 0;
  
  const req = badge.requisito;
  if (req.quizCompletati) return Math.min(100, Math.round((stats.quizCompletati / req.quizCompletati) * 100));
  if (req.accuratezza) return Math.min(100, Math.round((stats.accuratezzaMedia / req.accuratezza) * 100));
  if (req.streak) return Math.min(100, Math.round(((streak?.streakMassimo || 0) / req.streak) * 100));
  if (req.minutiStudio) return Math.min(100, Math.round((stats.minutiStudioTotali / req.minutiStudio) * 100));
  
  return 0;
}

module.exports = router;
