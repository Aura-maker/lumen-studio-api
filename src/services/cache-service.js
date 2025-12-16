/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CACHE SERVICE - REDIS PER PERFORMANCE SCALABILE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Gestisce:
 * - Cache dati frequenti (classifica, statistiche)
 * - Sessioni utente
 * - Rate limiting distribuito
 * - Pub/Sub per real-time
 */

const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.client = null;
    this.subscriber = null;
    this.isConnected = false;
    
    // TTL defaults (in secondi)
    this.TTL = {
      CLASSIFICA: 60,           // 1 minuto
      PROFILO: 30,              // 30 secondi
      STATISTICHE: 60,          // 1 minuto
      MATERIE: 3600,            // 1 ora
      QUIZ: 300,                // 5 minuti
      SESSIONE: 86400,          // 24 ore
      RATE_LIMIT: 60            // 1 minuto
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONNESSIONE
  // ═══════════════════════════════════════════════════════════════════════════

  async connect() {
    if (this.isConnected) return;

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        lazyConnect: true
      });

      this.subscriber = new Redis(redisUrl);

      await this.client.connect();
      
      this.client.on('error', (err) => {
        console.error('❌ Redis error:', err);
      });

      this.client.on('connect', () => {
        console.log('✅ Redis connesso');
        this.isConnected = true;
      });

      this.client.on('close', () => {
        console.log('⚠️ Redis disconnesso');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Errore connessione Redis:', error);
      // Fallback: continua senza cache
      this.isConnected = false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OPERAZIONI BASE
  // ═══════════════════════════════════════════════════════════════════════════

  async get(key) {
    if (!this.isConnected) return null;
    
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache del error:', error);
      return false;
    }
  }

  async delPattern(pattern) {
    if (!this.isConnected) return false;
    
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delPattern error:', error);
      return false;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CACHE SPECIFICHE
  // ═══════════════════════════════════════════════════════════════════════════

  // Classifica
  async getClassifica(periodo = 'globale') {
    return this.get(`classifica:${periodo}`);
  }

  async setClassifica(periodo, data) {
    return this.set(`classifica:${periodo}`, data, this.TTL.CLASSIFICA);
  }

  // Profilo utente
  async getProfilo(utenteId) {
    return this.get(`profilo:${utenteId}`);
  }

  async setProfilo(utenteId, data) {
    return this.set(`profilo:${utenteId}`, data, this.TTL.PROFILO);
  }

  async invalidaProfilo(utenteId) {
    return this.del(`profilo:${utenteId}`);
  }

  // Statistiche
  async getStatistiche(utenteId) {
    return this.get(`stats:${utenteId}`);
  }

  async setStatistiche(utenteId, data) {
    return this.set(`stats:${utenteId}`, data, this.TTL.STATISTICHE);
  }

  // Materie e contenuti (cache lunga)
  async getMaterie() {
    return this.get('materie:all');
  }

  async setMaterie(data) {
    return this.set('materie:all', data, this.TTL.MATERIE);
  }

  async getMateria(materiaId) {
    return this.get(`materia:${materiaId}`);
  }

  async setMateria(materiaId, data) {
    return this.set(`materia:${materiaId}`, data, this.TTL.MATERIE);
  }

  // Quiz
  async getQuiz(materiaId, limit) {
    return this.get(`quiz:${materiaId}:${limit}`);
  }

  async setQuiz(materiaId, limit, data) {
    return this.set(`quiz:${materiaId}:${limit}`, data, this.TTL.QUIZ);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RATE LIMITING DISTRIBUITO
  // ═══════════════════════════════════════════════════════════════════════════

  async checkRateLimit(key, maxRequests, windowSeconds) {
    if (!this.isConnected) return { allowed: true, remaining: maxRequests };
    
    try {
      const current = await this.client.incr(key);
      
      if (current === 1) {
        await this.client.expire(key, windowSeconds);
      }
      
      const ttl = await this.client.ttl(key);
      
      return {
        allowed: current <= maxRequests,
        remaining: Math.max(0, maxRequests - current),
        resetIn: ttl
      };
    } catch (error) {
      console.error('Rate limit error:', error);
      return { allowed: true, remaining: maxRequests };
    }
  }

  // Rate limit per IP
  async checkIpRateLimit(ip, maxRequests = 100, windowSeconds = 60) {
    return this.checkRateLimit(`ratelimit:ip:${ip}`, maxRequests, windowSeconds);
  }

  // Rate limit per utente
  async checkUserRateLimit(utenteId, maxRequests = 200, windowSeconds = 60) {
    return this.checkRateLimit(`ratelimit:user:${utenteId}`, maxRequests, windowSeconds);
  }

  // Rate limit per auth
  async checkAuthRateLimit(ip, maxRequests = 5, windowSeconds = 900) {
    return this.checkRateLimit(`ratelimit:auth:${ip}`, maxRequests, windowSeconds);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SESSIONI UTENTE
  // ═══════════════════════════════════════════════════════════════════════════

  async setSession(sessionId, data) {
    return this.set(`session:${sessionId}`, data, this.TTL.SESSIONE);
  }

  async getSession(sessionId) {
    return this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId) {
    return this.del(`session:${sessionId}`);
  }

  async deleteUserSessions(utenteId) {
    return this.delPattern(`session:*:${utenteId}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUB/SUB PER REAL-TIME
  // ═══════════════════════════════════════════════════════════════════════════

  async publish(channel, message) {
    if (!this.isConnected) return false;
    
    try {
      await this.client.publish(channel, JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Publish error:', error);
      return false;
    }
  }

  async subscribe(channel, callback) {
    if (!this.subscriber) return;
    
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (ch, message) => {
        if (ch === channel) {
          callback(JSON.parse(message));
        }
      });
    } catch (error) {
      console.error('Subscribe error:', error);
    }
  }

  // Notifica aggiornamento classifica
  async notifyClassificaUpdate() {
    return this.publish('classifica:update', { timestamp: Date.now() });
  }

  // Notifica nuovo badge
  async notifyBadge(utenteId, badge) {
    return this.publish(`user:${utenteId}:badge`, { badge, timestamp: Date.now() });
  }

  // Notifica XP guadagnati
  async notifyXP(utenteId, xp) {
    return this.publish(`user:${utenteId}:xp`, { xp, timestamp: Date.now() });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEADERBOARD CON SORTED SET
  // ═══════════════════════════════════════════════════════════════════════════

  async updateLeaderboard(utenteId, score, leaderboard = 'global') {
    if (!this.isConnected) return false;
    
    try {
      await this.client.zadd(`leaderboard:${leaderboard}`, score, utenteId);
      return true;
    } catch (error) {
      console.error('Leaderboard update error:', error);
      return false;
    }
  }

  async getLeaderboardTop(leaderboard = 'global', count = 10) {
    if (!this.isConnected) return [];
    
    try {
      const results = await this.client.zrevrange(
        `leaderboard:${leaderboard}`, 
        0, 
        count - 1, 
        'WITHSCORES'
      );
      
      // Converti in array di oggetti
      const leaderboardData = [];
      for (let i = 0; i < results.length; i += 2) {
        leaderboardData.push({
          utenteId: results[i],
          score: parseInt(results[i + 1]),
          posizione: Math.floor(i / 2) + 1
        });
      }
      
      return leaderboardData;
    } catch (error) {
      console.error('Leaderboard get error:', error);
      return [];
    }
  }

  async getUserRank(utenteId, leaderboard = 'global') {
    if (!this.isConnected) return null;
    
    try {
      const rank = await this.client.zrevrank(`leaderboard:${leaderboard}`, utenteId);
      const score = await this.client.zscore(`leaderboard:${leaderboard}`, utenteId);
      
      return rank !== null ? { posizione: rank + 1, score: parseInt(score) } : null;
    } catch (error) {
      console.error('User rank error:', error);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTICHE CACHE
  // ═══════════════════════════════════════════════════════════════════════════

  async getStats() {
    if (!this.isConnected) return null;
    
    try {
      const info = await this.client.info();
      const dbSize = await this.client.dbsize();
      
      return {
        connected: this.isConnected,
        dbSize,
        info: info.split('\n').reduce((acc, line) => {
          const [key, value] = line.split(':');
          if (key && value) acc[key.trim()] = value.trim();
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Stats error:', error);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CLEANUP
  // ═══════════════════════════════════════════════════════════════════════════

  async disconnect() {
    if (this.client) {
      await this.client.quit();
    }
    if (this.subscriber) {
      await this.subscriber.quit();
    }
    this.isConnected = false;
  }
}

// Singleton
const cacheService = new CacheService();

module.exports = cacheService;
