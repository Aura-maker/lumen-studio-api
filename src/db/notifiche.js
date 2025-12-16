/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICHE REPOSITORY
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const db = require('./database');

const NotificheRepository = {

  async getNotifiche(utenteId, limite = 20) {
    return db.queryAll(`
      SELECT id, titolo, corpo, canale, letta, "createdAt"
      FROM "Notifica"
      WHERE "utenteId" = $1
      ORDER BY "createdAt" DESC
      LIMIT $2
    `, [utenteId, limite]);
  },

  async countNonLette(utenteId) {
    const result = await db.queryOne(`
      SELECT COUNT(*) as count FROM "Notifica"
      WHERE "utenteId" = $1 AND letta = false
    `, [utenteId]);
    return parseInt(result?.count || 0);
  },

  async segnaLetta(id, utenteId) {
    await db.query(`
      UPDATE "Notifica" SET letta = true
      WHERE id = $1 AND "utenteId" = $2
    `, [id, utenteId]);
  },

  async segnaTutteLette(utenteId) {
    await db.query(`
      UPDATE "Notifica" SET letta = true WHERE "utenteId" = $1
    `, [utenteId]);
  },

  async crea(utenteId, { titolo, corpo, canale = 'in-app' }) {
    return db.queryOne(`
      INSERT INTO "Notifica" (id, "utenteId", titolo, corpo, canale, letta, "createdAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, false, NOW())
      RETURNING *
    `, [utenteId, titolo, corpo, canale]);
  }
};

module.exports = NotificheRepository;
