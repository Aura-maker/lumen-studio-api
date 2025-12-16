/**
 * Seed database Supabase usando pg direttamente (bypass Prisma engine)
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🌱 Inizio seed database Supabase...\n');

  const client = new Client({
    connectionString: process.env.DATABASE_URL || 
      "postgresql://postgres.uqvdiqmioqnvywmkchma:Levinoliver18_@aws-1-eu-west-2.pooler.supabase.com:6543/postgres"
  });

  try {
    await client.connect();
    console.log('✅ Connesso al database!\n');

    const passwordHash = await bcrypt.hash('password123', 12);

    // 1. Crea Admin
    console.log('👤 Creazione utenti...');
    
    const adminResult = await client.query(`
      INSERT INTO "Utente" (id, email, password, nome, ruolo, punti, livello, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'admin@imparafacile.it', $1, 'Admin', 'ADMIN', 5000, 10, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET punti = 5000
      RETURNING id, email, nome
    `, [passwordHash]);
    console.log('   ✓ Admin:', adminResult.rows[0]?.email || 'già esistente');

    // 2. Crea studenti di esempio
    const studenti = [
      { email: 'mario.rossi@studente.it', nome: 'Mario Rossi', punti: 2500 },
      { email: 'giulia.bianchi@studente.it', nome: 'Giulia Bianchi', punti: 3200 },
      { email: 'luca.verdi@studente.it', nome: 'Luca Verdi', punti: 1800 },
      { email: 'sara.neri@studente.it', nome: 'Sara Neri', punti: 4100 },
      { email: 'marco.gialli@studente.it', nome: 'Marco Gialli', punti: 950 }
    ];

    for (const s of studenti) {
      const result = await client.query(`
        INSERT INTO "Utente" (id, email, password, nome, ruolo, punti, livello, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, 'STUDENTE', $4, $5, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET punti = $4
        RETURNING nome
      `, [s.email, passwordHash, s.nome, s.punti, Math.floor(s.punti / 500) + 1]);
      console.log('   ✓ Studente:', s.nome);
    }

    // 3. Crea distintivi (se la tabella esiste)
    console.log('\n🏅 Creazione distintivi...');
    
    try {
      const distintivi = [
        { chiave: 'primo-quiz', titolo: '🎯 Primo Quiz', descrizione: 'Completa il tuo primo quiz', punti: 10 },
        { chiave: 'quiz-10', titolo: '🏆 Quiz Master', descrizione: 'Completa 10 quiz', punti: 50 },
        { chiave: 'streak-7', titolo: '🔥 Costanza', descrizione: '7 giorni consecutivi', punti: 70 },
        { chiave: 'precisione-80', titolo: '🎯 Precisione', descrizione: 'Raggiungi 80% di accuratezza', punti: 100 }
      ];

      for (const d of distintivi) {
        await client.query(`
          INSERT INTO "Distintivo" (id, chiave, titolo, descrizione, punti)
          VALUES (gen_random_uuid(), $1, $2, $3, $4)
          ON CONFLICT (chiave) DO NOTHING
        `, [d.chiave, d.titolo, d.descrizione, d.punti]);
      }
      console.log(`   ✓ ${distintivi.length} distintivi creati`);
    } catch (e) {
      console.log('   ⚠️ Distintivi saltati:', e.message);
    }

    // 4. Crea streak per utenti
    console.log('\n🔥 Creazione streak...');
    
    const utenti = await client.query('SELECT id FROM "Utente"');
    for (const u of utenti.rows) {
      await client.query(`
        INSERT INTO "Streak" (id, "utenteId", "streakCorrente", "streakMassimo", "ultimoGiorno", "freezeUsati", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), 0, NOW(), NOW())
        ON CONFLICT ("utenteId") DO NOTHING
      `, [u.id, Math.floor(Math.random() * 10), Math.floor(Math.random() * 30)]);
    }
    console.log(`   ✓ Streak creati per ${utenti.rows.length} utenti`);

    // 5. Crea notifiche di benvenuto
    console.log('\n🔔 Creazione notifiche...');
    
    for (const u of utenti.rows) {
      await client.query(`
        INSERT INTO "Notifica" (id, "utenteId", titolo, corpo, canale, letta, "createdAt")
        VALUES (gen_random_uuid(), $1, '🎉 Benvenuto su ImparaFacile!', 'Inizia il tuo percorso di studio!', 'in-app', false, NOW())
      `, [u.id]);
    }
    console.log(`   ✓ Notifiche create`);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('   ✅ SEED COMPLETATO CON SUCCESSO!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n📋 Credenziali di test:');
    console.log('   Admin: admin@imparafacile.it / password123');
    console.log('   Studente: mario.rossi@studente.it / password123');
    console.log('');

  } catch (error) {
    console.error('❌ Errore:', error.message);
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('\n⚠️ Le tabelle non esistono ancora. Esegui prima: npx prisma db push');
    }
  } finally {
    await client.end();
  }
}

require('dotenv').config();
seed();
