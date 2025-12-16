/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🛡️ RATE LIMITING - PRODUCTION READY
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const rateLimit = require('express-rate-limit');

// ═══════════════════════════════════════════════════════════════════════════════
// RATE LIMITERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Rate limiter generale per tutte le API
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 500, // 500 richieste per finestra
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Troppe richieste. Riprova tra qualche minuto.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

/**
 * Rate limiter per autenticazione (più restrittivo)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10, // 10 tentativi
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT',
      message: 'Troppi tentativi di login. Riprova tra 15 minuti.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Non conta i login riusciti
});

/**
 * Rate limiter per registrazione
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ora
  max: 5, // 5 registrazioni per IP
  message: {
    success: false,
    error: {
      code: 'REGISTER_RATE_LIMIT',
      message: 'Troppe registrazioni da questo indirizzo. Riprova più tardi.'
    }
  }
});

/**
 * Rate limiter per quiz (per evitare farming XP)
 */
const quizLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ora
  max: 100, // 100 quiz per ora
  message: {
    success: false,
    error: {
      code: 'QUIZ_RATE_LIMIT',
      message: 'Hai completato molti quiz! Fai una pausa e riprova tra un\'ora.'
    }
  },
  keyGenerator: (req) => req.user?.id || req.ip
});

/**
 * Rate limiter per API intensive (es. generazione contenuti)
 */
const heavyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 richieste al minuto
  message: {
    success: false,
    error: {
      code: 'HEAVY_RATE_LIMIT',
      message: 'Operazione intensiva. Attendi un momento.'
    }
  }
});

/**
 * Rate limiter per upload
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ora
  max: 20, // 20 upload per ora
  message: {
    success: false,
    error: {
      code: 'UPLOAD_RATE_LIMIT',
      message: 'Troppi upload. Riprova più tardi.'
    }
  }
});

/**
 * Rate limiter per marketplace
 */
const marketplaceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ora
  max: 30, // 30 annunci per ora
  message: {
    success: false,
    error: {
      code: 'MARKETPLACE_RATE_LIMIT',
      message: 'Troppe operazioni sul marketplace. Riprova più tardi.'
    }
  },
  keyGenerator: (req) => req.user?.id || req.ip
});

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter,
  quizLimiter,
  heavyLimiter,
  uploadLimiter,
  marketplaceLimiter
};
