/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STATISTICHE REPOSITORY - STATISTICHE STUDENTI IN TEMPO REALE
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const db = require('./database');

const StatisticheRepository = {

  async registraQuiz(utenteId, { corretto, xpGuadagnati }) {
    const oggi = new Date().toISOString().split('T')[0];
    
    await db.query(`
      INSERT INTO "StatisticheGiornaliere" 
      (id, "utenteId", data, "quizCompletati", "quizCorretti", "xpGuadagnati", "minutiStudio", "sessioniComplete", "flashcardViste", "flashcardRicordate", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, 1, $3, $4, 0, 0, 0, 0, NOW(), NOW())
      ON CONFLICT ("utenteId", data) DO UPDATE SET
        "quizCompletati" = "StatisticheGiornaliere"."quizCompletati" + 1,
        "quizCorretti" = "StatisticheGiornaliere"."quizCorretti" + $3,
        "xpGuadagnati" = "StatisticheGiornaliere"."xpGuadagnati" + $4,
        "updatedAt" = NOW()
    `, [utenteId, oggi, corretto ? 1 : 0, xpGuadagnati]);
    
    return db.queryOne(`
      UPDATE "Utente" SET punti = punti + $2, "updatedAt" = NOW()
      WHERE id = $1 RETURNING punti, livello
    `, [utenteId, xpGuadagnati]);
  },

  async registraFlashcard(utenteId, { ricordata, xpGuadagnati }) {
    const oggi = new Date().toISOString().split('T')[0];
    
    await db.query(`
      INSERT INTO "StatisticheGiornaliere" 
      (id, "utenteId", data, "flashcardViste", "flashcardRicordate", "xpGuadagnati", "minutiStudio", "sessioniComplete", "quizCompletati", "quizCorretti", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, 1, $3, $4, 0, 0, 0, 0, NOW(), NOW())
      ON CONFLICT ("utenteId", data) DO UPDATE SET
        "flashcardViste" = "StatisticheGiornaliere"."flashcardViste" + 1,
        "flashcardRicordate" = "StatisticheGiornaliere"."flashcardRicordate" + $3,
        "xpGuadagnati" = "StatisticheGiornaliere"."xpGuadagnati" + $4,
        "updatedAt" = NOW()
    `, [utenteId, oggi, ricordata ? 1 : 0, xpGuadagnati]);
    
    await db.query('UPDATE "Utente" SET punti = punti + $2, "updatedAt" = NOW() WHERE id = $1', [utenteId, xpGuadagnati]);
  },

  async registraSessione(utenteId, { durataMinuti, materia, xpGuadagnati }) {
    const oggi = new Date().toISOString().split('T')[0];
    
    await db.query(`
      INSERT INTO "StatisticheGiornaliere" 
      (id, "utenteId", data, "minutiStudio", "sessioniComplete", "xpGuadagnati", "quizCompletati", "quizCorretti", "flashcardViste", "flashcardRicordate", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, 1, $4, 0, 0, 0, 0, NOW(), NOW())
      ON CONFLICT ("utenteId", data) DO UPDATE SET
        "minutiStudio" = "StatisticheGiornaliere"."minutiStudio" + $3,
        "sessioniComplete" = "StatisticheGiornaliere"."sessioniComplete" + 1,
        "xpGuadagnati" = "StatisticheGiornaliere"."xpGuadagnati" + $4,
        "updatedAt" = NOW()
    `, [utenteId, oggi, durataMinuti, xpGuadagnati]);
    
    await db.query('UPDATE "Utente" SET punti = punti + $2, "updatedAt" = NOW() WHERE id = $1', [utenteId, xpGuadagnati]);
  },

  async getStatisticheUtente(utenteId) {
    const stats = await db.queryOne(`
      SELECT 
        COALESCE(SUM("quizCompletati"), 0) as "quizTotali",
        COALESCE(SUM("quizCorretti"), 0) as "quizCorretti",
        COALESCE(SUM("flashcardViste"), 0) as "flashcardTotali",
        COALESCE(SUM("minutiStudio"), 0) as "minutiTotali",
        COALESCE(SUM("xpGuadagnati"), 0) as "xpTotali"
      FROM "StatisticheGiornaliere"
      WHERE "utenteId" = $1
    `, [utenteId]);
    
    return {
      quizCompletati: parseInt(stats?.quizTotali || 0),
      quizCorretti: parseInt(stats?.quizCorretti || 0),
      accuratezzaMedia: stats?.quizTotali > 0 ? Math.round((stats.quizCorretti / stats.quizTotali) * 100) : 0,
      flashcardViste: parseInt(stats?.flashcardTotali || 0),
      minutiStudioTotali: parseInt(stats?.minutiTotali || 0),
      xpTotali: parseInt(stats?.xpTotali || 0)
    };
  },

  async getGraficoSettimana(utenteId) {
    const giorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    
    const stats = await db.queryAll(`
      SELECT data, "minutiStudio", "quizCompletati", "xpGuadagnati"
      FROM "StatisticheGiornaliere"
      WHERE "utenteId" = $1 AND data >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY data
    `, [utenteId]);
    
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dataStr = d.toISOString().split('T')[0];
      const stat = stats.find(s => s.data.toISOString().split('T')[0] === dataStr);
      
      result.push({
        giorno: giorni[d.getDay()],
        data: dataStr,
        minutiStudio: stat?.minutiStudio || 0,
        quiz: stat?.quizCompletati || 0,
        xp: stat?.xpGuadagnati || 0
      });
    }
    
    return result;
  }
};

module.exports = StatisticheRepository;
