/**
 * Seed libri di esempio per il libromercato
 */
require('dotenv').config();
const { Client } = require('pg');

async function seedLibri() {
  console.log('📚 Seed libri per libromercato...\n');

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connesso al database\n');

    // Prendi un utente esistente come venditore
    const utenti = await client.query('SELECT id, nome FROM "Utente" LIMIT 5');
    if (utenti.rows.length === 0) {
      console.log('❌ Nessun utente trovato. Esegui prima seed-supabase.js');
      return;
    }

    const libri = [
      { titolo: 'Promessi Sposi', autore: 'Alessandro Manzoni', materia: 'Italiano', anno: '5°', condizione: 'Buono', prezzo: 8.50 },
      { titolo: 'Divina Commedia - Inferno', autore: 'Dante Alighieri', materia: 'Italiano', anno: '3°', condizione: 'Ottimo', prezzo: 12.00 },
      { titolo: 'Storia Contemporanea', autore: 'Sabbatucci-Vidotto', materia: 'Storia', anno: '5°', condizione: 'Buono', prezzo: 15.00 },
      { titolo: 'Filosofia Vol. 3', autore: 'Abbagnano-Fornero', materia: 'Filosofia', anno: '5°', condizione: 'Discreto', prezzo: 18.00 },
      { titolo: 'Matematica.blu 2.0 Vol. 5', autore: 'Bergamini-Barozzi', materia: 'Matematica', anno: '5°', condizione: 'Ottimo', prezzo: 25.00 },
      { titolo: 'Fisica! Le leggi della natura', autore: 'Amaldi', materia: 'Fisica', anno: '5°', condizione: 'Buono', prezzo: 22.00 },
      { titolo: 'Performer Heritage', autore: 'Spiazzi-Tavella', materia: 'Inglese', anno: '5°', condizione: 'Ottimo', prezzo: 20.00 },
      { titolo: 'Latino - Lingua e Cultura', autore: 'Flocchini', materia: 'Latino', anno: '4°', condizione: 'Discreto', prezzo: 14.00 },
      { titolo: 'Scienze della Terra', autore: 'Lupia Palmieri', materia: 'Scienze', anno: '5°', condizione: 'Buono', prezzo: 16.00 },
      { titolo: 'Arte nel Tempo Vol. 3', autore: 'De Vecchi-Cerchiari', materia: 'Arte', anno: '5°', condizione: 'Ottimo', prezzo: 28.00 }
    ];

    console.log('📖 Inserimento libri...');
    
    for (let i = 0; i < libri.length; i++) {
      const libro = libri[i];
      const venditore = utenti.rows[i % utenti.rows.length];
      
      await client.query(`
        INSERT INTO "Libro" (id, titolo, autore, materia, anno, condizione, prezzo, "venditoreId", venduto, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, false, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [libro.titolo, libro.autore, libro.materia, libro.anno, libro.condizione, libro.prezzo, venditore.id]);
      
      console.log(`   ✓ "${libro.titolo}" - €${libro.prezzo} (${venditore.nome})`);
    }

    // Statistiche finali
    const stats = await client.query(`
      SELECT COUNT(*) as totale, 
             COUNT(*) FILTER (WHERE venduto = false) as disponibili
      FROM "Libro"
    `);
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`   ✅ LIBRI INSERITI: ${stats.rows[0].totale} totali, ${stats.rows[0].disponibili} disponibili`);
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Errore:', error.message);
  } finally {
    await client.end();
  }
}

seedLibri();
