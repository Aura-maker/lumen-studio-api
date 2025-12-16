/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * METRICS SERVICE - MONITORAGGIO E METRICHE PER PROMETHEUS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Espone metriche per:
 * - Performance API
 * - Utilizzo risorse
 * - Business metrics
 * - Error tracking
 */

class MetricsService {
  constructor() {
    this.metrics = {
      // Contatori
      httpRequestsTotal: new Map(),
      httpErrorsTotal: new Map(),
      quizCompletati: 0,
      flashcardViste: 0,
      utentiRegistrati: 0,
      loginEffettuati: 0,
      
      // Gauge
      utentiOnline: 0,
      connessioniDB: 0,
      cacheHitRate: 0,
      
      // Istogrammi (buckets)
      httpRequestDuration: [],
      quizDuration: [],
      
      // Business
      xpTotaleDistribuito: 0,
      badgeSbloccati: 0,
      libriInVendita: 0
    };

    this.startTime = Date.now();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTATORI HTTP
  // ═══════════════════════════════════════════════════════════════════════════

  incrementHttpRequests(method, path, statusCode) {
    const key = `${method}:${path}:${statusCode}`;
    const current = this.metrics.httpRequestsTotal.get(key) || 0;
    this.metrics.httpRequestsTotal.set(key, current + 1);

    if (statusCode >= 400) {
      const errorKey = `${method}:${path}:${statusCode}`;
      const errorCurrent = this.metrics.httpErrorsTotal.get(errorKey) || 0;
      this.metrics.httpErrorsTotal.set(errorKey, errorCurrent + 1);
    }
  }

  recordHttpDuration(durationMs) {
    this.metrics.httpRequestDuration.push(durationMs);
    // Mantieni solo ultimi 1000 valori
    if (this.metrics.httpRequestDuration.length > 1000) {
      this.metrics.httpRequestDuration.shift();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BUSINESS METRICS
  // ═══════════════════════════════════════════════════════════════════════════

  incrementQuizCompletati() {
    this.metrics.quizCompletati++;
  }

  incrementFlashcardViste() {
    this.metrics.flashcardViste++;
  }

  incrementUtentiRegistrati() {
    this.metrics.utentiRegistrati++;
  }

  incrementLogin() {
    this.metrics.loginEffettuati++;
  }

  addXP(amount) {
    this.metrics.xpTotaleDistribuito += amount;
  }

  incrementBadgeSbloccati() {
    this.metrics.badgeSbloccati++;
  }

  recordQuizDuration(durationMs) {
    this.metrics.quizDuration.push(durationMs);
    if (this.metrics.quizDuration.length > 1000) {
      this.metrics.quizDuration.shift();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GAUGE
  // ═══════════════════════════════════════════════════════════════════════════

  setUtentiOnline(count) {
    this.metrics.utentiOnline = count;
  }

  setConnessioniDB(count) {
    this.metrics.connessioniDB = count;
  }

  setCacheHitRate(rate) {
    this.metrics.cacheHitRate = rate;
  }

  setLibriInVendita(count) {
    this.metrics.libriInVendita = count;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CALCOLI STATISTICI
  // ═══════════════════════════════════════════════════════════════════════════

  calculatePercentile(values, percentile) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  calculateAverage(values) {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPORT PROMETHEUS FORMAT
  // ═══════════════════════════════════════════════════════════════════════════

  getPrometheusMetrics() {
    const lines = [];
    const uptime = (Date.now() - this.startTime) / 1000;

    // Uptime
    lines.push('# HELP imparafacile_uptime_seconds Server uptime in seconds');
    lines.push('# TYPE imparafacile_uptime_seconds gauge');
    lines.push(`imparafacile_uptime_seconds ${uptime}`);

    // HTTP Requests
    lines.push('# HELP imparafacile_http_requests_total Total HTTP requests');
    lines.push('# TYPE imparafacile_http_requests_total counter');
    for (const [key, value] of this.metrics.httpRequestsTotal) {
      const [method, path, status] = key.split(':');
      lines.push(`imparafacile_http_requests_total{method="${method}",path="${path}",status="${status}"} ${value}`);
    }

    // HTTP Errors
    lines.push('# HELP imparafacile_http_errors_total Total HTTP errors');
    lines.push('# TYPE imparafacile_http_errors_total counter');
    for (const [key, value] of this.metrics.httpErrorsTotal) {
      const [method, path, status] = key.split(':');
      lines.push(`imparafacile_http_errors_total{method="${method}",path="${path}",status="${status}"} ${value}`);
    }

    // HTTP Duration
    lines.push('# HELP imparafacile_http_request_duration_ms HTTP request duration in milliseconds');
    lines.push('# TYPE imparafacile_http_request_duration_ms summary');
    lines.push(`imparafacile_http_request_duration_ms{quantile="0.5"} ${this.calculatePercentile(this.metrics.httpRequestDuration, 50)}`);
    lines.push(`imparafacile_http_request_duration_ms{quantile="0.9"} ${this.calculatePercentile(this.metrics.httpRequestDuration, 90)}`);
    lines.push(`imparafacile_http_request_duration_ms{quantile="0.99"} ${this.calculatePercentile(this.metrics.httpRequestDuration, 99)}`);
    lines.push(`imparafacile_http_request_duration_ms_avg ${this.calculateAverage(this.metrics.httpRequestDuration)}`);

    // Business Metrics
    lines.push('# HELP imparafacile_quiz_completati_total Total quizzes completed');
    lines.push('# TYPE imparafacile_quiz_completati_total counter');
    lines.push(`imparafacile_quiz_completati_total ${this.metrics.quizCompletati}`);

    lines.push('# HELP imparafacile_flashcard_viste_total Total flashcards viewed');
    lines.push('# TYPE imparafacile_flashcard_viste_total counter');
    lines.push(`imparafacile_flashcard_viste_total ${this.metrics.flashcardViste}`);

    lines.push('# HELP imparafacile_utenti_registrati_total Total registered users');
    lines.push('# TYPE imparafacile_utenti_registrati_total counter');
    lines.push(`imparafacile_utenti_registrati_total ${this.metrics.utentiRegistrati}`);

    lines.push('# HELP imparafacile_login_total Total logins');
    lines.push('# TYPE imparafacile_login_total counter');
    lines.push(`imparafacile_login_total ${this.metrics.loginEffettuati}`);

    lines.push('# HELP imparafacile_xp_distribuito_total Total XP distributed');
    lines.push('# TYPE imparafacile_xp_distribuito_total counter');
    lines.push(`imparafacile_xp_distribuito_total ${this.metrics.xpTotaleDistribuito}`);

    lines.push('# HELP imparafacile_badge_sbloccati_total Total badges unlocked');
    lines.push('# TYPE imparafacile_badge_sbloccati_total counter');
    lines.push(`imparafacile_badge_sbloccati_total ${this.metrics.badgeSbloccati}`);

    // Gauges
    lines.push('# HELP imparafacile_utenti_online Current online users');
    lines.push('# TYPE imparafacile_utenti_online gauge');
    lines.push(`imparafacile_utenti_online ${this.metrics.utentiOnline}`);

    lines.push('# HELP imparafacile_db_connections Current database connections');
    lines.push('# TYPE imparafacile_db_connections gauge');
    lines.push(`imparafacile_db_connections ${this.metrics.connessioniDB}`);

    lines.push('# HELP imparafacile_cache_hit_rate Cache hit rate');
    lines.push('# TYPE imparafacile_cache_hit_rate gauge');
    lines.push(`imparafacile_cache_hit_rate ${this.metrics.cacheHitRate}`);

    lines.push('# HELP imparafacile_libri_in_vendita Books for sale');
    lines.push('# TYPE imparafacile_libri_in_vendita gauge');
    lines.push(`imparafacile_libri_in_vendita ${this.metrics.libriInVendita}`);

    // Quiz Duration
    lines.push('# HELP imparafacile_quiz_duration_ms Quiz completion duration in milliseconds');
    lines.push('# TYPE imparafacile_quiz_duration_ms summary');
    lines.push(`imparafacile_quiz_duration_ms{quantile="0.5"} ${this.calculatePercentile(this.metrics.quizDuration, 50)}`);
    lines.push(`imparafacile_quiz_duration_ms{quantile="0.9"} ${this.calculatePercentile(this.metrics.quizDuration, 90)}`);

    // Node.js metrics
    const memUsage = process.memoryUsage();
    lines.push('# HELP nodejs_heap_used_bytes Node.js heap used');
    lines.push('# TYPE nodejs_heap_used_bytes gauge');
    lines.push(`nodejs_heap_used_bytes ${memUsage.heapUsed}`);

    lines.push('# HELP nodejs_heap_total_bytes Node.js heap total');
    lines.push('# TYPE nodejs_heap_total_bytes gauge');
    lines.push(`nodejs_heap_total_bytes ${memUsage.heapTotal}`);

    lines.push('# HELP nodejs_external_bytes Node.js external memory');
    lines.push('# TYPE nodejs_external_bytes gauge');
    lines.push(`nodejs_external_bytes ${memUsage.external}`);

    return lines.join('\n');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // JSON EXPORT (per dashboard interna)
  // ═══════════════════════════════════════════════════════════════════════════

  getMetricsJSON() {
    return {
      uptime: (Date.now() - this.startTime) / 1000,
      http: {
        requests: Object.fromEntries(this.metrics.httpRequestsTotal),
        errors: Object.fromEntries(this.metrics.httpErrorsTotal),
        avgDuration: this.calculateAverage(this.metrics.httpRequestDuration),
        p50Duration: this.calculatePercentile(this.metrics.httpRequestDuration, 50),
        p99Duration: this.calculatePercentile(this.metrics.httpRequestDuration, 99)
      },
      business: {
        quizCompletati: this.metrics.quizCompletati,
        flashcardViste: this.metrics.flashcardViste,
        utentiRegistrati: this.metrics.utentiRegistrati,
        loginEffettuati: this.metrics.loginEffettuati,
        xpDistribuito: this.metrics.xpTotaleDistribuito,
        badgeSbloccati: this.metrics.badgeSbloccati
      },
      current: {
        utentiOnline: this.metrics.utentiOnline,
        connessioniDB: this.metrics.connessioniDB,
        cacheHitRate: this.metrics.cacheHitRate,
        libriInVendita: this.metrics.libriInVendita
      },
      memory: process.memoryUsage()
    };
  }
}

// Singleton
const metricsService = new MetricsService();

// Middleware per tracciare richieste HTTP
function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.route?.path || req.path;
    
    metricsService.incrementHttpRequests(req.method, path, res.statusCode);
    metricsService.recordHttpDuration(duration);
  });
  
  next();
}

module.exports = { metricsService, metricsMiddleware };
