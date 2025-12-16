// Middleware per verificare JWT e allegare utente alla richiesta (italiano)
const jwt = require('jsonwebtoken');
const { jwtSegreto } = require('../config');
const prisma = require('../prisma');

/**
 * Verifica il token JWT presente in Authorization: Bearer <token>
 * Se valido allega req.utente con i dati essenziali.
 */
async function autentica(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ errore: 'Token mancante' });
    }
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, jwtSegreto);
    // Recupera l'utente dal DB per verificare stato/ruolo
    const utente = await prisma.utente.findUnique({ where: { id: payload.sub } });
    if (!utente) return res.status(401).json({ errore: 'Utente del token non valido' });
    req.utente = { id: utente.id, email: utente.email, ruolo: utente.ruolo };
    // Alias legacy per rotte che usano req.user
    req.user = req.utente;
    next();
  } catch (err) {
    return res.status(401).json({ errore: 'Token non valido o scaduto' });
  }
}

// Esporta alias per compatibilità con rotte inglesi
const authenticate = autentica;
module.exports = { autentica, auth: autentica, authenticate };