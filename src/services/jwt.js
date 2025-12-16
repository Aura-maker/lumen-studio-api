// Utility JWT: creazione token di accesso
const jwt = require('jsonwebtoken');
const { jwtSegreto, jwtScadenza } = require('../config');

/**
 * Genera un token JWT per l'utente
 * @param {Object} utente - oggetto {id, email, ruolo}
 */
function firmaAccessToken(utente) {
  const payload = {
    sub: utente.id,
    email: utente.email,
    ruolo: utente.ruolo
  };
  return jwt.sign(payload, jwtSegreto, { expiresIn: jwtScadenza });
}

module.exports = { firmaAccessToken };