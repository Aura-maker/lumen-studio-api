/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATABASE SERVICE - CONNESSIONE POSTGRESQL CON PG
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Sostituisce Prisma con pg nativo per massima compatibilità e performance.
 * Progettato per scalare a migliaia di studenti liceali in tutta Italia.
 */

const { Pool } = require('pg');

// Pool di connessioni (riutilizza connessioni per performance)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,                    // Max connessioni nel pool
  idleTimeoutMillis: 30000,   // Chiudi connessioni idle dopo 30s
  connectionTimeoutMillis: 10000  // Timeout connessione 10s
});

// Test connessione all'avvio
pool.on('connect', () => {
  console.log('✅ Database PostgreSQL connesso');
});

pool.on('error', (err) => {
  console.error('❌ Errore database:', err.message);
});

/**
 * Esegue una query con parametri
 * @param {string} text - Query SQL
 * @param {Array} params - Parametri
 * @returns {Promise<Object>} Risultato query
 */
async function query(text, params = []) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log query lente (>100ms) in development
    if (process.env.NODE_ENV !== 'production' && duration > 100) {
      console.log(`⚠️ Query lenta (${duration}ms):`, text.substring(0, 100));
    }
    
    return result;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    throw error;
  }
}

/**
 * Ottiene una singola riga
 */
async function queryOne(text, params = []) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Ottiene tutte le righe
 */
async function queryAll(text, params = []) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Esegue una transazione
 */
async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Test connessione database
 */
async function testConnection() {
  try {
    const result = await query('SELECT NOW() as now');
    console.log('✅ Database test OK:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database test FAILED:', error.message);
    return false;
  }
}

/**
 * Chiudi pool (per shutdown graceful)
 */
async function close() {
  await pool.end();
  console.log('🔌 Database pool chiuso');
}

module.exports = {
  pool,
  query,
  queryOne,
  queryAll,
  transaction,
  testConnection,
  close
};
