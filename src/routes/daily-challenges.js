/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎯 DAILY CHALLENGES & ENGAGEMENT SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sistema completo per:
 * - Daily challenges (sfide giornaliere)
 * - Streak management con freeze
 * - Rewards giornalieri
 * - Notifiche engagement
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db/database');
const { authenticate } = require('../middleware/auth');

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY CHALLENGES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/daily/challenges
 * Ottiene le sfide giornaliere dell'utente
 */
router.get('/challenges', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const oggi = new Date().toISOString().split('T')[0];
    
    // Verifica se esistono sfide per oggi
    let challenges = await getDailyChallenges(userId, oggi);
    
    if (!challenges || challenges.length === 0) {
      // Genera nuove sfide
      challenges = await generateDailyChallenges(userId, oggi);
    }
    
    res.json({
      success: true,
      data: oggi,
      challenges,
      completate: challenges.filter(c => c.completata).length,
      totale: challenges.length
    });
  } catch (error) {
    console.error('Errore daily challenges:', error);
    res.status(500).json({ error: 'Errore nel recupero delle sfide' });
  }
});

/**
 * POST /api/daily/challenges/:id/complete
 * Completa una sfida giornaliera
 */
router.post('/challenges/:id/complete', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.id;
    const { progresso } = req.body;
    
    const result = await completeDailyChallenge(userId, challengeId, progresso);
    
    if (result.completata) {
      // Assegna XP bonus
      await assegnaXP(userId, result.xpBonus, 'daily_challenge');
    }
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Errore completamento sfida:', error);
    res.status(500).json({ error: 'Errore nel completamento della sfida' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// STREAK SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/daily/streak
 * Ottiene lo stato dello streak dell'utente
 */
router.get('/streak', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await getStreakStatus(userId);
    
    res.json({
      success: true,
      ...streak
    });
  } catch (error) {
    console.error('Errore streak:', error);
    res.status(500).json({ error: 'Errore nel recupero dello streak' });
  }
});

/**
 * POST /api/daily/streak/freeze
 * Usa uno streak freeze per proteggere lo streak
 */
router.post('/streak/freeze', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await useStreakFreeze(userId);
    
    res.json({
      success: result.success,
      message: result.message,
      freezeRimanenti: result.freezeRimanenti
    });
  } catch (error) {
    console.error('Errore streak freeze:', error);
    res.status(500).json({ error: 'Errore nell\'uso dello streak freeze' });
  }
});

/**
 * POST /api/daily/streak/update
 * Aggiorna lo streak (chiamato quando l'utente completa un'attività)
 */
router.post('/streak/update', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await updateStreak(userId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Errore aggiornamento streak:', error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento dello streak' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY REWARDS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/daily/rewards
 * Ottiene i rewards giornalieri disponibili
 */
router.get('/rewards', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const rewards = await getDailyRewards(userId);
    
    res.json({
      success: true,
      rewards,
      streakBonus: rewards.streakBonus,
      prossimoPremio: rewards.prossimoPremio
    });
  } catch (error) {
    console.error('Errore daily rewards:', error);
    res.status(500).json({ error: 'Errore nel recupero dei rewards' });
  }
});

/**
 * POST /api/daily/rewards/claim
 * Riscatta il reward giornaliero
 */
router.post('/rewards/claim', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await claimDailyReward(userId);
    
    res.json({
      success: result.success,
      reward: result.reward,
      message: result.message
    });
  } catch (error) {
    console.error('Errore claim reward:', error);
    res.status(500).json({ error: 'Errore nel riscatto del reward' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

async function getDailyChallenges(userId, data) {
  try {
    const result = await pool.query(
      `SELECT * FROM "DailyChallenges" 
       WHERE "utenteId" = $1 AND DATE("createdAt") = $2
       ORDER BY "ordine"`,
      [userId, data]
    );
    return result.rows;
  } catch (error) {
    // Tabella potrebbe non esistere, ritorna array vuoto
    return [];
  }
}

async function generateDailyChallenges(userId, data) {
  const challengeTemplates = [
    { tipo: 'quiz', titolo: 'Quiz Master', descrizione: 'Completa 5 quiz', obiettivo: 5, xpBonus: 50, icona: '📝' },
    { tipo: 'flashcard', titolo: 'Memoria d\'Acciaio', descrizione: 'Studia 10 flashcard', obiettivo: 10, xpBonus: 30, icona: '🧠' },
    { tipo: 'streak', titolo: 'Costanza', descrizione: 'Mantieni lo streak', obiettivo: 1, xpBonus: 20, icona: '🔥' },
    { tipo: 'perfect', titolo: 'Perfezione', descrizione: 'Ottieni 100% in un quiz', obiettivo: 1, xpBonus: 100, icona: '⭐' },
    { tipo: 'tempo', titolo: 'Velocista', descrizione: 'Completa un quiz in meno di 2 minuti', obiettivo: 1, xpBonus: 40, icona: '⚡' },
    { tipo: 'materia', titolo: 'Esploratore', descrizione: 'Studia 3 materie diverse', obiettivo: 3, xpBonus: 60, icona: '🗺️' }
  ];
  
  // Seleziona 3 sfide casuali
  const shuffled = challengeTemplates.sort(() => 0.5 - Math.random());
  const selectedChallenges = shuffled.slice(0, 3);
  
  // Salva nel database (se la tabella esiste)
  const challenges = selectedChallenges.map((c, i) => ({
    id: `${data}-${userId}-${i}`,
    ...c,
    progresso: 0,
    completata: false,
    ordine: i
  }));
  
  try {
    for (const challenge of challenges) {
      await pool.query(
        `INSERT INTO "DailyChallenges" 
         ("id", "utenteId", "tipo", "titolo", "descrizione", "obiettivo", "progresso", "xpBonus", "icona", "completata", "ordine", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         ON CONFLICT ("id") DO NOTHING`,
        [challenge.id, userId, challenge.tipo, challenge.titolo, challenge.descrizione, 
         challenge.obiettivo, 0, challenge.xpBonus, challenge.icona, false, challenge.ordine]
      );
    }
  } catch (error) {
    // Ignora errori di tabella mancante
    console.log('Daily challenges table not found, returning in-memory challenges');
  }
  
  return challenges;
}

async function completeDailyChallenge(userId, challengeId, progresso) {
  try {
    // Aggiorna progresso
    const result = await pool.query(
      `UPDATE "DailyChallenges" 
       SET "progresso" = $3, 
           "completata" = CASE WHEN $3 >= "obiettivo" THEN true ELSE false END,
           "updatedAt" = NOW()
       WHERE "id" = $1 AND "utenteId" = $2
       RETURNING *`,
      [challengeId, userId, progresso]
    );
    
    if (result.rows.length > 0) {
      const challenge = result.rows[0];
      return {
        completata: challenge.completata,
        progresso: challenge.progresso,
        obiettivo: challenge.obiettivo,
        xpBonus: challenge.completata ? challenge.xpBonus : 0
      };
    }
  } catch (error) {
    console.log('Error updating challenge:', error.message);
  }
  
  return { completata: false, progresso: 0, obiettivo: 1, xpBonus: 0 };
}

async function getStreakStatus(userId) {
  try {
    const result = await pool.query(
      `SELECT * FROM "Streak" WHERE "utenteId" = $1`,
      [userId]
    );
    
    if (result.rows.length > 0) {
      const streak = result.rows[0];
      const oggi = new Date();
      const ultimaAttivita = new Date(streak.ultimaAttivita);
      const diffGiorni = Math.floor((oggi - ultimaAttivita) / (1000 * 60 * 60 * 24));
      
      return {
        giorni: streak.giorni,
        maxStreak: streak.maxStreak,
        freezeDisponibili: streak.freezeDisponibili || 0,
        attivoOggi: diffGiorni === 0,
        aRischio: diffGiorni === 1,
        perso: diffGiorni > 1 && streak.freezeDisponibili === 0
      };
    }
  } catch (error) {
    console.log('Streak table error:', error.message);
  }
  
  return {
    giorni: 0,
    maxStreak: 0,
    freezeDisponibili: 1,
    attivoOggi: false,
    aRischio: false,
    perso: false
  };
}

async function useStreakFreeze(userId) {
  try {
    const result = await pool.query(
      `UPDATE "Streak" 
       SET "freezeDisponibili" = "freezeDisponibili" - 1,
           "ultimaAttivita" = NOW()
       WHERE "utenteId" = $1 AND "freezeDisponibili" > 0
       RETURNING *`,
      [userId]
    );
    
    if (result.rows.length > 0) {
      return {
        success: true,
        message: 'Streak freeze utilizzato! Il tuo streak è salvo 🛡️',
        freezeRimanenti: result.rows[0].freezeDisponibili
      };
    }
    
    return {
      success: false,
      message: 'Nessun streak freeze disponibile',
      freezeRimanenti: 0
    };
  } catch (error) {
    return { success: false, message: 'Errore', freezeRimanenti: 0 };
  }
}

async function updateStreak(userId) {
  try {
    const oggi = new Date().toISOString().split('T')[0];
    
    // Verifica se già aggiornato oggi
    const existing = await pool.query(
      `SELECT * FROM "Streak" WHERE "utenteId" = $1`,
      [userId]
    );
    
    if (existing.rows.length > 0) {
      const streak = existing.rows[0];
      const ultimaData = new Date(streak.ultimaAttivita).toISOString().split('T')[0];
      
      if (ultimaData === oggi) {
        return { giorni: streak.giorni, aggiornato: false, message: 'Streak già aggiornato oggi' };
      }
      
      const ieri = new Date();
      ieri.setDate(ieri.getDate() - 1);
      const ieriStr = ieri.toISOString().split('T')[0];
      
      let nuovoStreak = ultimaData === ieriStr ? streak.giorni + 1 : 1;
      let nuovoMax = Math.max(streak.maxStreak, nuovoStreak);
      
      await pool.query(
        `UPDATE "Streak" 
         SET "giorni" = $2, "maxStreak" = $3, "ultimaAttivita" = NOW()
         WHERE "utenteId" = $1`,
        [userId, nuovoStreak, nuovoMax]
      );
      
      return { 
        giorni: nuovoStreak, 
        maxStreak: nuovoMax,
        aggiornato: true, 
        message: nuovoStreak > 1 ? `🔥 Streak di ${nuovoStreak} giorni!` : '🔥 Streak iniziato!' 
      };
    } else {
      // Crea nuovo streak
      await pool.query(
        `INSERT INTO "Streak" ("utenteId", "giorni", "maxStreak", "ultimaAttivita", "freezeDisponibili")
         VALUES ($1, 1, 1, NOW(), 1)`,
        [userId]
      );
      
      return { giorni: 1, maxStreak: 1, aggiornato: true, message: '🔥 Streak iniziato!' };
    }
  } catch (error) {
    console.log('Update streak error:', error.message);
    return { giorni: 0, aggiornato: false, message: 'Errore aggiornamento streak' };
  }
}

async function getDailyRewards(userId) {
  const streak = await getStreakStatus(userId);
  
  // Rewards basati sullo streak
  const rewards = [
    { giorno: 1, xp: 10, tipo: 'xp', descrizione: '10 XP bonus' },
    { giorno: 3, xp: 30, tipo: 'xp', descrizione: '30 XP bonus' },
    { giorno: 7, xp: 100, tipo: 'xp', descrizione: '100 XP + Streak Freeze', extra: 'freeze' },
    { giorno: 14, xp: 200, tipo: 'xp', descrizione: '200 XP bonus' },
    { giorno: 30, xp: 500, tipo: 'badge', descrizione: 'Badge "Costanza" + 500 XP' }
  ];
  
  const streakBonus = Math.floor(streak.giorni / 7) * 50; // 50 XP extra ogni settimana
  const prossimoPremio = rewards.find(r => r.giorno > streak.giorni) || rewards[rewards.length - 1];
  
  return {
    rewards,
    streakBonus,
    prossimoPremio,
    giorniMancanti: prossimoPremio.giorno - streak.giorni
  };
}

async function claimDailyReward(userId) {
  try {
    const oggi = new Date().toISOString().split('T')[0];
    
    // Verifica se già riscattato oggi
    const claimed = await pool.query(
      `SELECT * FROM "DailyRewardsClaimed" 
       WHERE "utenteId" = $1 AND DATE("claimedAt") = $2`,
      [userId, oggi]
    );
    
    if (claimed.rows.length > 0) {
      return { success: false, message: 'Reward già riscattato oggi', reward: null };
    }
    
    // Calcola reward
    const streak = await getStreakStatus(userId);
    const xpBonus = 10 + (streak.giorni * 2); // Base 10 + 2 per ogni giorno di streak
    
    // Assegna XP
    await assegnaXP(userId, xpBonus, 'daily_reward');
    
    // Registra claim
    try {
      await pool.query(
        `INSERT INTO "DailyRewardsClaimed" ("utenteId", "xp", "claimedAt")
         VALUES ($1, $2, NOW())`,
        [userId, xpBonus]
      );
    } catch (e) {
      // Tabella potrebbe non esistere
    }
    
    return {
      success: true,
      message: `🎁 Hai ricevuto ${xpBonus} XP!`,
      reward: { xp: xpBonus, tipo: 'daily' }
    };
  } catch (error) {
    return { success: false, message: 'Errore', reward: null };
  }
}

async function assegnaXP(userId, xp, motivo) {
  try {
    await pool.query(
      `UPDATE "Utente" SET "xp" = COALESCE("xp", 0) + $2 WHERE "id" = $1`,
      [userId, xp]
    );
    
    // Log XP
    await pool.query(
      `INSERT INTO "XPLog" ("utenteId", "xp", "motivo", "createdAt")
       VALUES ($1, $2, $3, NOW())`,
      [userId, xp, motivo]
    ).catch(() => {}); // Ignora se tabella non esiste
    
  } catch (error) {
    console.log('Errore assegnazione XP:', error.message);
  }
}

module.exports = router;
