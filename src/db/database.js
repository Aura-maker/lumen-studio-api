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
 * Esegue migrazioni automatiche all'avvio
 */
async function runMigrations() {
  console.log('🔄 Esecuzione migrazioni database...');
  
  const migrations = `
    -- Tabella utenti
    CREATE TABLE IF NOT EXISTS utenti (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      ruolo VARCHAR(50) DEFAULT 'STUDENTE',
      punti INTEGER DEFAULT 0,
      livello INTEGER DEFAULT 1,
      avatar_url TEXT,
      classe VARCHAR(10),
      materie_preferite JSONB DEFAULT '[]',
      obiettivo VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_utenti_email ON utenti(email);

    -- Profili gamification
    CREATE TABLE IF NOT EXISTS gamification_profili (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      xp_totale INTEGER DEFAULT 0,
      quiz_completati INTEGER DEFAULT 0,
      flashcards_viste INTEGER DEFAULT 0,
      streak INTEGER DEFAULT 0,
      record_streak INTEGER DEFAULT 0,
      accuratezza_media INTEGER DEFAULT 0,
      risposte_corrette INTEGER DEFAULT 0,
      risposte_totali INTEGER DEFAULT 0,
      livello_per_materia JSONB DEFAULT '{}',
      badges JSONB DEFAULT '[]',
      last_activity TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_gamification_user ON gamification_profili(user_id);

    -- Attività gamification
    CREATE TABLE IF NOT EXISTS gamification_attivita (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      tipo VARCHAR(50) NOT NULL,
      materia VARCHAR(100),
      descrizione TEXT,
      xp INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Sfide
    CREATE TABLE IF NOT EXISTS sfide (
      id SERIAL PRIMARY KEY,
      codice VARCHAR(10) UNIQUE NOT NULL,
      host_id VARCHAR(255) NOT NULL,
      guest_id VARCHAR(255),
      host_score INTEGER DEFAULT 0,
      guest_score INTEGER DEFAULT 0,
      vincitore VARCHAR(255),
      modalita VARCHAR(50),
      stato VARCHAR(20) DEFAULT 'attesa',
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Libri
    CREATE TABLE IF NOT EXISTS libri (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      titolo VARCHAR(255) NOT NULL,
      autore VARCHAR(255),
      editore VARCHAR(255),
      isbn VARCHAR(20),
      materia VARCHAR(100),
      anno VARCHAR(10),
      condizione VARCHAR(50) NOT NULL,
      prezzo DECIMAL(10,2),
      descrizione TEXT,
      foto_url TEXT,
      venditore_id UUID,
      venditore_nome VARCHAR(255),
      venduto BOOLEAN DEFAULT false,
      compratore_id UUID,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Notifiche
    CREATE TABLE IF NOT EXISTS notifiche (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      tipo VARCHAR(50) NOT NULL,
      titolo VARCHAR(255) NOT NULL,
      messaggio TEXT,
      letta BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await query(migrations);
    console.log('✅ Migrazioni completate!');
    return true;
  } catch (error) {
    console.error('❌ Errore migrazioni:', error.message);
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
  runMigrations,
  close
};
