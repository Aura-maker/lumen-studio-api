/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UTENTI REPOSITORY - OPERAZIONI DATABASE UTENTI
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const db = require('./database');
const bcrypt = require('bcryptjs');

const UtentiRepository = {
  /**
   * Trova utente per email
   */
  async findByEmail(email) {
    return db.queryOne(
      'SELECT * FROM utenti WHERE email = $1',
      [email.toLowerCase()]
    );
  },

  /**
   * Trova utente per ID
   */
  async findById(id) {
    return db.queryOne(
      'SELECT * FROM utenti WHERE id = $1',
      [id]
    );
  },

  /**
   * Crea nuovo utente
   */
  async create({ email, password, nome, ruolo = 'STUDENTE' }) {
    const passwordHash = await bcrypt.hash(password, 12);
    
    const result = await db.queryOne(`
      INSERT INTO utenti (nome, email, password, ruolo, punti, livello)
      VALUES ($1, $2, $3, $4, 0, 1)
      RETURNING id, email, nome, ruolo, punti, livello, avatar_url as "avatarUrl", created_at as "createdAt"
    `, [nome, email.toLowerCase(), passwordHash, ruolo]);
    
    return result;
  },

  /**
   * Verifica password
   */
  async verifyPassword(email, password) {
    const utente = await this.findByEmail(email);
    if (!utente) return null;
    
    const valid = await bcrypt.compare(password, utente.password);
    if (!valid) return null;
    
    // Rimuovi password dal risultato
    delete utente.password;
    return utente;
  },

  /**
   * Aggiorna ultimo accesso
   */
  async updateLastLogin(id) {
    await db.query(
      'UPDATE utenti SET updated_at = NOW() WHERE id = $1',
      [id]
    );
  },

  /**
   * Aggiorna profilo utente
   */
  async updateProfile(id, { nome, avatarUrl }) {
    return db.queryOne(`
      UPDATE utenti 
      SET nome = COALESCE($2, nome), 
          avatar_url = COALESCE($3, avatar_url),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, nome, ruolo, punti, livello, avatar_url as "avatarUrl"
    `, [id, nome, avatarUrl]);
  },

  /**
   * Aggiorna password
   */
  async updatePassword(id, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.query(
      'UPDATE utenti SET password = $2, updated_at = NOW() WHERE id = $1',
      [id, passwordHash]
    );
  },

  /**
   * Aggiungi XP e aggiorna livello
   */
  async addXP(id, xp) {
    const result = await db.queryOne(`
      UPDATE utenti 
      SET punti = punti + $2,
          livello = CASE
            WHEN punti + $2 >= 40800 THEN 30
            WHEN punti + $2 >= 19200 THEN 20
            WHEN punti + $2 >= 9300 THEN 15
            WHEN punti + $2 >= 3800 THEN 10
            WHEN punti + $2 >= 1200 THEN 6
            WHEN punti + $2 >= 500 THEN 4
            WHEN punti + $2 >= 100 THEN 2
            ELSE 1
          END,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, punti, livello
    `, [id, xp]);
    
    return result;
  },

  /**
   * Classifica globale
   */
  async getClassifica(limite = 10) {
    return db.queryAll(`
      SELECT id, nome, avatar_url as "avatarUrl", punti, livello,
             ROW_NUMBER() OVER (ORDER BY punti DESC) as posizione
      FROM utenti
      WHERE ruolo = 'STUDENTE'
      ORDER BY punti DESC
      LIMIT $1
    `, [limite]);
  },

  /**
   * Classifica settimanale (semplificata)
   */
  async getClassificaSettimanale(limite = 10) {
    return this.getClassifica(limite);
  },

  /**
   * Posizione utente in classifica
   */
  async getPosizioneUtente(id) {
    const result = await db.queryOne(`
      SELECT posizione FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY punti DESC) as posizione
        FROM utenti
        WHERE ruolo = 'STUDENTE'
      ) ranked
      WHERE id = $1
    `, [id]);
    
    return result?.posizione || null;
  },

  /**
   * Conta utenti totali
   */
  async count() {
    const result = await db.queryOne('SELECT COUNT(*) as count FROM utenti');
    return parseInt(result?.count || 0);
  }
};

module.exports = UtentiRepository;
