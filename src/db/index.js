/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATABASE INDEX - EXPORT TUTTI I REPOSITORY
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const db = require('./database');
const Utenti = require('./utenti');
const Statistiche = require('./statistiche');
const Streak = require('./streak');
const Notifiche = require('./notifiche');
const Libri = require('./libri');

module.exports = {
  db,
  Utenti,
  Statistiche,
  Streak,
  Notifiche,
  Libri
};
