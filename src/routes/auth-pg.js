/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTH ROUTES - AUTENTICAZIONE CON PG (NO PRISMA)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { Utenti } = require('../db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'imparafacile-secret-key-change-in-production';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

/**
 * POST /api/auth/registrati
 */
router.post('/registrati', async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ errore: 'Nome, email e password richiesti' });
    }

    if (password.length < 6) {
      return res.status(400).json({ errore: 'Password deve essere almeno 6 caratteri' });
    }

    // Verifica email esistente
    const esistente = await Utenti.findByEmail(email);
    if (esistente) {
      return res.status(400).json({ errore: 'Email già registrata' });
    }

    // Crea utente
    const utente = await Utenti.create({ nome, email, password });

    // Genera token
    const token = jwt.sign(
      { sub: utente.id, email: utente.email, ruolo: utente.ruolo },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(201).json({
      success: true,
      token,
      utente: {
        id: utente.id,
        nome: utente.nome,
        email: utente.email,
        ruolo: utente.ruolo,
        punti: utente.punti,
        livello: utente.livello
      }
    });

  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ errore: 'Errore durante la registrazione' });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ errore: 'Email e password richiesti' });
    }

    // Verifica credenziali
    const utente = await Utenti.verifyPassword(email, password);
    if (!utente) {
      return res.status(401).json({ errore: 'Credenziali non valide' });
    }

    // Aggiorna ultimo accesso
    await Utenti.updateLastLogin(utente.id);

    // Genera token
    const token = jwt.sign(
      { sub: utente.id, email: utente.email, ruolo: utente.ruolo },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      success: true,
      token,
      utente: {
        id: utente.id,
        nome: utente.nome,
        email: utente.email,
        ruolo: utente.ruolo,
        punti: utente.punti,
        livello: utente.livello,
        avatarUrl: utente.avatarUrl
      }
    });

  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ errore: 'Errore durante il login' });
  }
});

/**
 * GET /api/auth/me - Profilo utente corrente
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const utente = await Utenti.findById(req.user.sub);
    if (!utente) {
      return res.status(404).json({ errore: 'Utente non trovato' });
    }

    res.json({
      utente: {
        id: utente.id,
        nome: utente.nome,
        email: utente.email,
        ruolo: utente.ruolo,
        punti: utente.punti,
        livello: utente.livello,
        avatarUrl: utente.avatarUrl,
        createdAt: utente.createdAt
      }
    });

  } catch (error) {
    console.error('Errore profilo:', error);
    res.status(500).json({ errore: 'Errore caricamento profilo' });
  }
});

/**
 * PUT /api/auth/profilo - Aggiorna profilo
 */
router.put('/profilo', authenticateToken, async (req, res) => {
  try {
    const { nome, avatarUrl } = req.body;
    
    const utente = await Utenti.updateProfile(req.user.sub, { nome, avatarUrl });
    
    res.json({ success: true, utente });

  } catch (error) {
    console.error('Errore aggiornamento profilo:', error);
    res.status(500).json({ errore: 'Errore aggiornamento profilo' });
  }
});

/**
 * GET /api/auth/classifica
 */
router.get('/classifica', async (req, res) => {
  try {
    const { limite = 10, tipo = 'globale' } = req.query;
    
    let classifica;
    if (tipo === 'settimana') {
      classifica = await Utenti.getClassificaSettimanale(parseInt(limite));
    } else {
      classifica = await Utenti.getClassifica(parseInt(limite));
    }

    res.json({ classifica });

  } catch (error) {
    console.error('Errore classifica:', error);
    res.status(500).json({ errore: 'Errore caricamento classifica' });
  }
});

/**
 * Middleware autenticazione JWT
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ errore: 'Token richiesto' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ errore: 'Token non valido' });
    }
    req.user = user;
    next();
  });
}

// Export middleware per uso in altre routes
router.authenticateToken = authenticateToken;

module.exports = router;
