// Rate limiter configurati per proteggere endpoint critici
const rateLimit = require('express-rate-limit');

// Limite globale leggero
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

// Limite per auth (login/register) per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { errore: 'Troppi tentativi. Riprova più tardi.' }
});

module.exports = { globalLimiter, authLimiter };