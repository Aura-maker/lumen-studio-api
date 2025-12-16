/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🏥 HEALTH CHECK & MONITORING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db/database');
const os = require('os');

const startTime = Date.now();

/**
 * GET /health
 * Health check base per load balancer
 */
router.get('/', async (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * GET /health/detailed
 * Health check dettagliato
 */
router.get('/detailed', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: process.env.npm_package_version || '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {}
  };
  
  // Database check
  try {
    const dbStart = Date.now();
    await pool.query('SELECT 1');
    health.checks.database = {
      status: 'ok',
      responseTime: Date.now() - dbStart
    };
  } catch (error) {
    health.status = 'degraded';
    health.checks.database = {
      status: 'error',
      error: error.message
    };
  }
  
  // Memory check
  const memUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemPercent = ((totalMem - freeMem) / totalMem * 100).toFixed(1);
  
  health.checks.memory = {
    status: usedMemPercent < 90 ? 'ok' : 'warning',
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
    systemUsedPercent: usedMemPercent + '%'
  };
  
  // CPU check
  const cpuLoad = os.loadavg()[0];
  const cpuCount = os.cpus().length;
  health.checks.cpu = {
    status: cpuLoad / cpuCount < 0.8 ? 'ok' : 'warning',
    load: cpuLoad.toFixed(2),
    cores: cpuCount
  };
  
  const statusCode = health.status === 'ok' ? 200 : 
                     health.status === 'degraded' ? 503 : 500;
  
  res.status(statusCode).json(health);
});

/**
 * GET /health/ready
 * Readiness probe per Kubernetes
 */
router.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: 'Database not ready' });
  }
});

/**
 * GET /health/live
 * Liveness probe per Kubernetes
 */
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});

/**
 * GET /health/metrics
 * Metriche per monitoring (Prometheus-style)
 */
router.get('/metrics', async (req, res) => {
  const metrics = [];
  
  // Uptime
  metrics.push(`# HELP app_uptime_seconds Application uptime in seconds`);
  metrics.push(`# TYPE app_uptime_seconds gauge`);
  metrics.push(`app_uptime_seconds ${Math.floor((Date.now() - startTime) / 1000)}`);
  
  // Memory
  const mem = process.memoryUsage();
  metrics.push(`# HELP nodejs_heap_used_bytes Node.js heap used`);
  metrics.push(`# TYPE nodejs_heap_used_bytes gauge`);
  metrics.push(`nodejs_heap_used_bytes ${mem.heapUsed}`);
  
  metrics.push(`# HELP nodejs_heap_total_bytes Node.js heap total`);
  metrics.push(`# TYPE nodejs_heap_total_bytes gauge`);
  metrics.push(`nodejs_heap_total_bytes ${mem.heapTotal}`);
  
  // CPU
  metrics.push(`# HELP nodejs_cpu_load CPU load average`);
  metrics.push(`# TYPE nodejs_cpu_load gauge`);
  metrics.push(`nodejs_cpu_load ${os.loadavg()[0]}`);
  
  res.set('Content-Type', 'text/plain');
  res.send(metrics.join('\n'));
});

module.exports = router;
