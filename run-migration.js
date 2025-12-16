require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('🚀 Esecuzione migrazione database...');
  
  const sqlPath = path.join(__dirname, 'src/db/migrations/all_migrations.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  try {
    await pool.query(sql);
    console.log('✅ Migrazione completata con successo!');
    
    // Verifica tabelle create
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tabelle create:', tables.rows.map(r => r.table_name).join(', '));
    
  } catch (error) {
    console.error('❌ Errore migrazione:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();
