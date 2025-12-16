/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RESET DATABASE - Pulisce tutti i dati per produzione
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ATTENZIONE: Questo script elimina TUTTI i dati dal database!
 * Usare solo per preparare l'ambiente di produzione.
 */

require('dotenv').config();
const { Client } = require('pg');

async function resetDatabase() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   ⚠️  RESET DATABASE - ELIMINAZIONE DATI');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connesso al database\n');

    // Elimina dati in ordine (rispetta foreign keys)
    const tabelle = [
      'Notifica',
      'StatisticheGiornaliere', 
      'Streak',
      'SessioneStudio',
      'Libro',
      'Distintivo',
      'Utente'
    ];

    console.log('🗑️  Eliminazione dati...');
    for (const tabella of tabelle) {
      try {
        const result = await client.query(`DELETE FROM "${tabella}"`);
        console.log(`   ✓ ${tabella}: ${result.rowCount} righe eliminate`);
      } catch (e) {
        console.log(`   ⚠️ ${tabella}: ${e.message}`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   ✅ DATABASE PULITO - PRONTO PER PRODUZIONE');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n   Il database è ora vuoto e pronto per utenti reali.');
    console.log('   Gli utenti potranno registrarsi tramite /api/auth/registrati\n');

  } catch (error) {
    console.error('❌ Errore:', error.message);
  } finally {
    await client.end();
  }
}

// Conferma prima di eseguire
const args = process.argv.slice(2);
if (args.includes('--confirm')) {
  resetDatabase();
} else {
  console.log('');
  console.log('⚠️  ATTENZIONE: Questo script elimina TUTTI i dati dal database!');
  console.log('');
  console.log('   Per confermare, esegui:');
  console.log('   node reset-database.js --confirm');
  console.log('');
}
