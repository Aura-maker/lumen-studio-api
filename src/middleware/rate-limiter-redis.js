/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RATE LIMITER DISTRIBUITO CON REDIS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Rate limiting scalabile per migliaia di utenti simultanei
 */

const cacheService = require('../services/cache-service');

/**
 * Crea middleware rate limiter
 * @param {Object} options
 * @param {number} options.maxRequests - Numero massimo richieste
 * @param {number} options.windowSeconds - Finestra temporale in secondi
 * @param {string} options.keyPrefix - Prefisso chiave Redis
 * @param {Function} options.keyGenerator - Funzione per generare chiave (req) => string
 * @param {boolean} options.skipFailedRequests - Ignora richieste fallite
 */
function createRateLimiter(options = {}) {
  const {
    maxRequests = 100,
    windowSeconds = 60,
    keyPrefix = 'ratelimit',
    keyGenerator = (req) => req.ip,
    skipFailedRequests = false,
    message = { error: 'Troppe richieste. Riprova più tardi.' }
  } = options;

  return async (req, res, next) => {
    try {
      const key = `${keyPrefix}:${keyGenerator(req)}`;
      const result = await cacheService.checkRateLimit(key, maxRequests, windowSeconds);

      // Aggiungi headers standard
      res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': result.remaining,
        'X-RateLimit-Reset': Math.ceil(Date.now() / 1000) + result.resetIn
      });

      if (!result.allowed) {
        res.set('Retry-After', result.resetIn);
        return res.status(429).json(message);
      }

      // Se skipFailedRequests, decrementa su errore
      if (skipFailedRequests) {
        res.on('finish', async () => {
          if (res.statusCode >= 400) {
            // Decrementa contatore (best effort)
            try {
              await cacheService.client?.decr(key);
            } catch (e) {}
          }
        });
      }

      next();
    } catch (error) {
      // In caso di errore Redis, permetti la richiesta
      console.error('Rate limiter error:', error);
      next();
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIMITER PRECONFIGURATI
// ═══════════════════════════════════════════════════════════════════════════════

// Limite globale per IP (100 req/min)
const globalLimiter = createRateLimiter({
  maxRequests: 100,
  windowSeconds: 60,
  keyPrefix: 'global',
  keyGenerator: (req) => req.ip
});

// Limite per autenticazione (5 req/15min per IP)
const authLimiter = createRateLimiter({
  maxRequests: 5,
  windowSeconds: 900,
  keyPrefix: 'auth',
  keyGenerator: (req) => req.ip,
  message: { error: 'Troppi tentativi di login. Riprova tra 15 minuti.' }
});

// Limite per API autenticata (200 req/min per utente)
const apiLimiter = createRateLimiter({
  maxRequests: 200,
  windowSeconds: 60,
  keyPrefix: 'api',
  keyGenerator: (req) => req.utente?.id || req.ip
});

// Limite per upload (10 req/min)
const uploadLimiter = createRateLimiter({
  maxRequests: 10,
  windowSeconds: 60,
  keyPrefix: 'upload',
  keyGenerator: (req) => req.utente?.id || req.ip
});

// Limite per ricerca (30 req/min)
const searchLimiter = createRateLimiter({
  maxRequests: 30,
  windowSeconds: 60,
  keyPrefix: 'search',
  keyGenerator: (req) => req.utente?.id || req.ip
});

// Limite per quiz (60 req/min - più generoso per gameplay)
const quizLimiter = createRateLimiter({
  maxRequests: 60,
  windowSeconds: 60,
  keyPrefix: 'quiz',
  keyGenerator: (req) => req.utente?.id || req.ip
});

// Limite per notifiche push (100 req/ora per utente)
const pushLimiter = createRateLimiter({
  maxRequests: 100,
  windowSeconds: 3600,
  keyPrefix: 'push',
  keyGenerator: (req) => req.utente?.id || req.ip
});

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDING WINDOW RATE LIMITER (più preciso)
// ═══════════════════════════════════════════════════════════════════════════════

async function slidingWindowLimiter(key, maxRequests, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const client = cacheService.client;
  if (!client) return { allowed: true, remaining: maxRequests };

  try {
    // Usa sorted set per sliding window
    const multi = client.multi();
    
    // Rimuovi entries vecchie
    multi.zremrangebyscore(key, 0, windowStart);
    
    // Conta entries nella finestra
    multi.zcard(key);
    
    // Aggiungi nuova entry
    multi.zadd(key, now, `${now}-${Math.random()}`);
    
    // Imposta TTL
    multi.expire(key, Math.ceil(windowMs / 1000));
    
    const results = await multi.exec();
    const count = results[1][1];
    
    return {
      allowed: count < maxRequests,
      remaining: Math.max(0, maxRequests - count - 1),
      resetIn: Math.ceil(windowMs / 1000)
    };
  } catch (error) {
    console.error('Sliding window error:', error);
    return { allowed: true, remaining: maxRequests };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC RATE LIMITER (basato su comportamento)
// ═══════════════════════════════════════════════════════════════════════════════

function createDynamicLimiter(options = {}) {
  const {
    baseLimit = 100,
    windowSeconds = 60,
    trustMultiplier = 2,      // Utenti fidati ottengono 2x limite
    suspiciousMultiplier = 0.5 // Utenti sospetti ottengono 0.5x limite
  } = options;

  return async (req, res, next) => {
    try {
      const userId = req.utente?.id;
      let limit = baseLimit;

      if (userId) {
        // Controlla trust score dell'utente
        const trustScore = await getUserTrustScore(userId);
        
        if (trustScore > 80) {
          limit = Math.floor(baseLimit * trustMultiplier);
        } else if (trustScore < 30) {
          limit = Math.floor(baseLimit * suspiciousMultiplier);
        }
      }

      const key = `dynamic:${userId || req.ip}`;
      const result = await cacheService.checkRateLimit(key, limit, windowSeconds);

      res.set({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': result.remaining
      });

      if (!result.allowed) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      next();
    } catch (error) {
      next();
    }
  };
}

async function getUserTrustScore(userId) {
  // Calcola trust score basato su:
  // - Età account
  // - Attività legittima
  // - Assenza di violazioni
  // Per ora ritorna un valore di default
  const cached = await cacheService.get(`trust:${userId}`);
  return cached?.score || 50;
}

module.exports = {
  createRateLimiter,
  globalLimiter,
  authLimiter,
  apiLimiter,
  uploadLimiter,
  searchLimiter,
  quizLimiter,
  pushLimiter,
  slidingWindowLimiter,
  createDynamicLimiter
};
