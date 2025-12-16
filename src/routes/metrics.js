/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * METRICS ROUTES - ENDPOINT PER PROMETHEUS E MONITORING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { metricsService } = require('../services/metrics-service');

/**
 * GET /api/metrics
 * Endpoint per Prometheus (formato testo)
 */
router.get('/', (req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send(metricsService.getPrometheusMetrics());
});

/**
 * GET /api/metrics/json
 * Endpoint per dashboard interna (formato JSON)
 */
router.get('/json', (req, res) => {
  res.json(metricsService.getMetricsJSON());
});

/**
 * GET /api/metrics/health
 * Health check dettagliato
 */
router.get('/health', async (req, res) => {
  const prisma = require('../prisma');
  const cacheService = require('../services/cache-service');
  
  const checks = {
    api: { status: 'ok', latency: 0 },
    database: { status: 'unknown', latency: 0 },
    cache: { status: 'unknown', latency: 0 }
  };

  // Check database
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: 'ok',
      latency: Date.now() - dbStart
    };
  } catch (error) {
    checks.database = {
      status: 'error',
      error: error.message
    };
  }

  // Check cache
  try {
    const cacheStart = Date.now();
    if (cacheService.isConnected) {
      await cacheService.client.ping();
      checks.cache = {
        status: 'ok',
        latency: Date.now() - cacheStart
      };
    } else {
      checks.cache = { status: 'disconnected' };
    }
  } catch (error) {
    checks.cache = {
      status: 'error',
      error: error.message
    };
  }

  const allOk = Object.values(checks).every(c => c.status === 'ok');
  
  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks
  });
});

module.exports = router;
