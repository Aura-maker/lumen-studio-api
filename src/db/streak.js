/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STREAK REPOSITORY - GESTIONE STREAK GIORNALIERI
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const db = require('./database');

const StreakRepository = {

  async getStreak(utenteId) {
    return db.queryOne(`
      SELECT "streakCorrente", "streakMassimo", "ultimoGiorno", "freezeUsati"
      FROM "Streak" WHERE "utenteId" = $1
    `, [utenteId]);
  },

  async aggiornaStreak(utenteId) {
    const streak = await this.getStreak(utenteId);
    if (!streak) return null;

    const oggi = new Date().toISOString().split('T')[0];
    const ultimoGiorno = streak.ultimoGiorno?.toISOString().split('T')[0];

    if (ultimoGiorno === oggi) {
      return streak; // Già aggiornato oggi
    }

    const ieri = new Date();
    ieri.setDate(ieri.getDate() - 1);
    const ieriStr = ieri.toISOString().split('T')[0];

    let nuovoStreak = streak.streakCorrente;
    
    if (ultimoGiorno === ieriStr) {
      nuovoStreak += 1;
    } else if (ultimoGiorno && ultimoGiorno !== oggi) {
      nuovoStreak = 1; // Reset streak
    } else {
      nuovoStreak = 1; // Primo giorno
    }

    const nuovoMassimo = Math.max(nuovoStreak, streak.streakMassimo);

    return db.queryOne(`
      UPDATE "Streak" SET 
        "streakCorrente" = $2,
        "streakMassimo" = $3,
        "ultimoGiorno" = $4,
        "updatedAt" = NOW()
      WHERE "utenteId" = $1
      RETURNING "streakCorrente", "streakMassimo", "freezeUsati"
    `, [utenteId, nuovoStreak, nuovoMassimo, oggi]);
  },

  async usaFreeze(utenteId) {
    const streak = await this.getStreak(utenteId);
    if (!streak || streak.freezeUsati >= 3) return false;

    await db.query(`
      UPDATE "Streak" SET "freezeUsati" = "freezeUsati" + 1, "updatedAt" = NOW()
      WHERE "utenteId" = $1
    `, [utenteId]);
    
    return true;
  }
};

module.exports = StreakRepository;
