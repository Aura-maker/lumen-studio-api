/**
 * GAMIFICATION REPOSITORY - Persistenza su PostgreSQL
 * Gestisce XP, badges, streak, statistiche sfide per ogni utente
 */

const { query, queryOne, queryAll, transaction } = require('./database');

const gamificationRepo = {
  /**
   * Ottiene o crea il profilo gamification di un utente
   */
  async getOrCreateProfilo(userId) {
    let profilo = await queryOne(
      'SELECT * FROM gamification_profili WHERE user_id = $1',
      [userId]
    );
    
    if (!profilo) {
      await query(`
        INSERT INTO gamification_profili (user_id, xp_totale, quiz_completati, flashcards_viste, streak, record_streak, accuratezza_media, risposte_corrette, risposte_totali, livello_per_materia, badges, created_at, updated_at)
        VALUES ($1, 0, 0, 0, 0, 0, 0, 0, 0, '{}', '[]', NOW(), NOW())
      `, [userId]);
      
      profilo = await queryOne(
        'SELECT * FROM gamification_profili WHERE user_id = $1',
        [userId]
      );
    }
    
    return {
      userId: profilo.user_id,
      xpTotale: profilo.xp_totale,
      quizCompletati: profilo.quiz_completati,
      flashcardsViste: profilo.flashcards_viste,
      streak: profilo.streak,
      recordStreak: profilo.record_streak,
      accuratezzaMedia: profilo.accuratezza_media,
      risposteCorrette: profilo.risposte_corrette,
      risposteTotali: profilo.risposte_totali,
      livelloPerMateria: profilo.livello_per_materia || {},
      badges: profilo.badges || []
    };
  },

  /**
   * Aggiorna XP e statistiche quiz
   */
  async completaQuiz(userId, materia, corretto, xpGuadagnati) {
    const xpEffettivi = corretto ? xpGuadagnati : Math.floor(xpGuadagnati * 0.2);
    
    await query(`
      UPDATE gamification_profili SET
        xp_totale = xp_totale + $2,
        quiz_completati = quiz_completati + 1,
        risposte_totali = risposte_totali + 1,
        risposte_corrette = risposte_corrette + $3,
        accuratezza_media = CASE 
          WHEN risposte_totali > 0 
          THEN ROUND((risposte_corrette + $3)::numeric / (risposte_totali + 1) * 100)
          ELSE 0 
        END,
        livello_per_materia = jsonb_set(
          COALESCE(livello_per_materia, '{}')::jsonb,
          ARRAY[$4],
          (COALESCE((livello_per_materia->>$4)::numeric, 0) + $5)::text::jsonb
        ),
        updated_at = NOW()
      WHERE user_id = $1
    `, [userId, xpEffettivi, corretto ? 1 : 0, materia, corretto ? 1 : 0.2]);
    
    return { xpGuadagnati: xpEffettivi, corretto };
  },

  /**
   * Aggiorna XP e statistiche flashcard
   */
  async vedaFlashcard(userId, materia) {
    await query(`
      UPDATE gamification_profili SET
        xp_totale = xp_totale + 10,
        flashcards_viste = flashcards_viste + 1,
        livello_per_materia = jsonb_set(
          COALESCE(livello_per_materia, '{}')::jsonb,
          ARRAY[$2],
          (COALESCE((livello_per_materia->>$2)::numeric, 0) + 0.5)::text::jsonb
        ),
        updated_at = NOW()
      WHERE user_id = $1
    `, [userId, materia]);
    
    return { xpGuadagnati: 10 };
  },

  /**
   * Aggiorna streak giornaliero
   */
  async aggiornaStreak(userId) {
    const profilo = await queryOne(
      'SELECT streak, record_streak, last_activity FROM gamification_profili WHERE user_id = $1',
      [userId]
    );
    
    if (!profilo) return { streak: 0 };
    
    const oggi = new Date().toDateString();
    const ultimaAttivita = profilo.last_activity ? new Date(profilo.last_activity).toDateString() : null;
    
    let nuovoStreak = profilo.streak;
    
    if (ultimaAttivita !== oggi) {
      const ieri = new Date();
      ieri.setDate(ieri.getDate() - 1);
      
      if (ultimaAttivita === ieri.toDateString()) {
        nuovoStreak = profilo.streak + 1;
      } else if (ultimaAttivita !== oggi) {
        nuovoStreak = 1;
      }
      
      const nuovoRecord = Math.max(nuovoStreak, profilo.record_streak);
      
      await query(`
        UPDATE gamification_profili SET
          streak = $2,
          record_streak = $3,
          last_activity = NOW(),
          updated_at = NOW()
        WHERE user_id = $1
      `, [userId, nuovoStreak, nuovoRecord]);
    }
    
    return { streak: nuovoStreak };
  },

  /**
   * Sblocca un badge
   */
  async sbloccaBadge(userId, badgeId) {
    await query(`
      UPDATE gamification_profili SET
        badges = badges || $2::jsonb,
        updated_at = NOW()
      WHERE user_id = $1 AND NOT badges @> $2::jsonb
    `, [userId, JSON.stringify([badgeId])]);
  },

  /**
   * Ottiene i badges sbloccati
   */
  async getBadges(userId) {
    const profilo = await queryOne(
      'SELECT badges FROM gamification_profili WHERE user_id = $1',
      [userId]
    );
    return profilo?.badges || [];
  },

  /**
   * Registra attività recente
   */
  async registraAttivita(userId, tipo, materia, descrizione, xp) {
    await query(`
      INSERT INTO gamification_attivita (user_id, tipo, materia, descrizione, xp, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [userId, tipo, materia, descrizione, xp]);
  },

  /**
   * Ottiene attività recenti
   */
  async getAttivitaRecenti(userId, limit = 10) {
    const attivita = await queryAll(`
      SELECT id, tipo, materia, descrizione, xp, created_at as timestamp
      FROM gamification_attivita
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [userId, limit]);
    
    return attivita.map(a => ({
      id: a.id,
      tipo: a.tipo,
      titolo: a.tipo === 'quiz' ? 'Quiz' : a.tipo === 'flashcard' ? 'Flashcards' : a.descrizione,
      materia: a.materia,
      xp: a.xp,
      timestamp: new Date(a.timestamp).getTime()
    }));
  },

  /**
   * Statistiche sfide 1v1
   */
  async getSfideStats(userId) {
    const stats = await queryOne(`
      SELECT 
        COALESCE(SUM(CASE WHEN vincitore = $1 THEN 1 ELSE 0 END), 0) as vittorie,
        COALESCE(SUM(CASE WHEN vincitore != $1 AND vincitore IS NOT NULL THEN 1 ELSE 0 END), 0) as sconfitte,
        COALESCE(SUM(CASE WHEN vincitore IS NULL THEN 1 ELSE 0 END), 0) as pareggi
      FROM sfide
      WHERE host_id = $1 OR guest_id = $1
    `, [userId]);
    
    return {
      vittorie: parseInt(stats?.vittorie || 0),
      sconfitte: parseInt(stats?.sconfitte || 0),
      pareggi: parseInt(stats?.pareggi || 0)
    };
  },

  /**
   * Registra risultato sfida
   */
  async registraSfida(codice, hostId, guestId, hostScore, guestScore) {
    let vincitore = null;
    if (hostScore > guestScore) vincitore = hostId;
    else if (guestScore > hostScore) vincitore = guestId;
    
    await query(`
      INSERT INTO sfide (codice, host_id, guest_id, host_score, guest_score, vincitore, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (codice) DO UPDATE SET
        host_score = $4,
        guest_score = $5,
        vincitore = $6
    `, [codice, hostId, guestId, hostScore, guestScore, vincitore]);
  },

  /**
   * Classifica globale
   */
  async getClassifica(limit = 50) {
    const classifica = await queryAll(`
      SELECT 
        u.id,
        u.nome,
        u.email,
        g.xp_totale,
        g.streak,
        g.quiz_completati,
        g.accuratezza_media
      FROM utenti u
      JOIN gamification_profili g ON u.id = g.user_id
      ORDER BY g.xp_totale DESC
      LIMIT $1
    `, [limit]);
    
    return classifica.map((u, i) => ({
      posizione: i + 1,
      id: u.id,
      nome: u.nome || 'Studente',
      xp: u.xp_totale,
      streak: u.streak,
      quiz: u.quiz_completati,
      accuratezza: u.accuratezza_media
    }));
  },

  /**
   * Progresso settimanale
   */
  async getProgressoSettimanale(userId) {
    const giorni = await queryAll(`
      SELECT 
        EXTRACT(DOW FROM created_at) as giorno,
        SUM(xp) as xp,
        COUNT(*) as attivita
      FROM gamification_attivita
      WHERE user_id = $1 
        AND created_at > NOW() - INTERVAL '7 days'
      GROUP BY EXTRACT(DOW FROM created_at)
    `, [userId]);
    
    const nomiGiorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const oggi = new Date().getDay();
    
    return nomiGiorni.map((nome, i) => {
      const dati = giorni.find(g => parseInt(g.giorno) === i);
      return {
        giorno: nome,
        xp: parseInt(dati?.xp || 0),
        quiz: parseInt(dati?.attivita || 0),
        isOggi: i === oggi
      };
    });
  }
};

module.exports = gamificationRepo;
