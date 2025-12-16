/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SEED DATABASE COMPLETO - INIZIALIZZAZIONE DATI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Crea:
 * - Utente admin di test
 * - Utenti studenti di esempio
 * - Badge/Distintivi base
 * - Leghe per gamification
 * - Dati iniziali per demo
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inizio seed database...\n');

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. UTENTI DI TEST
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('👤 Creazione utenti...');
  
  const passwordHash = await bcrypt.hash('password123', 12);
  
  // Admin
  const admin = await prisma.utente.upsert({
    where: { email: 'admin@imparafacile.it' },
    update: {},
    create: {
      email: 'admin@imparafacile.it',
      password: passwordHash,
      nome: 'Admin',
      ruolo: 'ADMIN',
      punti: 5000,
      livello: 10
    }
  });
  console.log(`   ✓ Admin: ${admin.email}`);

  // Studenti di esempio
  const studenti = [
    { email: 'mario.rossi@studente.it', nome: 'Mario Rossi', punti: 2500 },
    { email: 'giulia.bianchi@studente.it', nome: 'Giulia Bianchi', punti: 3200 },
    { email: 'luca.verdi@studente.it', nome: 'Luca Verdi', punti: 1800 },
    { email: 'sara.neri@studente.it', nome: 'Sara Neri', punti: 4100 },
    { email: 'marco.gialli@studente.it', nome: 'Marco Gialli', punti: 950 }
  ];

  for (const s of studenti) {
    const utente = await prisma.utente.upsert({
      where: { email: s.email },
      update: { punti: s.punti },
      create: {
        email: s.email,
        password: passwordHash,
        nome: s.nome,
        ruolo: 'STUDENTE',
        punti: s.punti,
        livello: Math.floor(s.punti / 500) + 1
      }
    });
    console.log(`   ✓ Studente: ${utente.nome}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. DISTINTIVI/BADGE
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n🏅 Creazione distintivi...');
  
  const distintivi = [
    { chiave: 'primo-quiz', titolo: '🎯 Primo Quiz', descrizione: 'Completa il tuo primo quiz', punti: 10 },
    { chiave: 'quiz-10', titolo: '🏆 Quiz Master', descrizione: 'Completa 10 quiz', punti: 50 },
    { chiave: 'quiz-50', titolo: '🥇 Quiz Champion', descrizione: 'Completa 50 quiz', punti: 200 },
    { chiave: 'quiz-100', titolo: '👑 Quiz Legend', descrizione: 'Completa 100 quiz', punti: 500 },
    { chiave: 'streak-3', titolo: '🔥 Iniziativa', descrizione: '3 giorni consecutivi', punti: 30 },
    { chiave: 'streak-7', titolo: '🔥 Costanza', descrizione: '7 giorni consecutivi', punti: 70 },
    { chiave: 'streak-14', titolo: '🔥 Dedizione', descrizione: '14 giorni consecutivi', punti: 150 },
    { chiave: 'streak-30', titolo: '🔥 Leggenda', descrizione: '30 giorni consecutivi', punti: 500 },
    { chiave: 'precisione-80', titolo: '🎯 Precisione', descrizione: 'Raggiungi 80% di accuratezza', punti: 100 },
    { chiave: 'precisione-90', titolo: '🎯 Cecchino', descrizione: 'Raggiungi 90% di accuratezza', punti: 200 },
    { chiave: 'studioso-1h', titolo: '📚 Studioso', descrizione: '1 ora di studio totale', punti: 20 },
    { chiave: 'studioso-10h', titolo: '📚 Dedicato', descrizione: '10 ore di studio totale', punti: 100 },
    { chiave: 'flashcard-100', titolo: '🃏 Memorizzatore', descrizione: 'Visualizza 100 flashcards', punti: 50 },
    { chiave: 'livello-5', titolo: '⭐ Livello 5', descrizione: 'Raggiungi il livello 5', punti: 100 },
    { chiave: 'livello-10', titolo: '⭐⭐ Livello 10', descrizione: 'Raggiungi il livello 10', punti: 250 },
    { chiave: 'primo-esame', titolo: '📝 Prima Simulazione', descrizione: 'Completa la prima simulazione d\'esame', punti: 100 }
  ];

  for (const d of distintivi) {
    await prisma.distintivo.upsert({
      where: { chiave: d.chiave },
      update: {},
      create: d
    });
  }
  console.log(`   ✓ ${distintivi.length} distintivi creati`);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. LEGHE GAMIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n🏆 Creazione leghe...');
  
  const leghe = [
    { nome: 'Bronze', livello: 1, icona: '🥉', colore: '#CD7F32', xpMinimo: 0 },
    { nome: 'Silver', livello: 2, icona: '🥈', colore: '#C0C0C0', xpMinimo: 1000 },
    { nome: 'Gold', livello: 3, icona: '🥇', colore: '#FFD700', xpMinimo: 3000 },
    { nome: 'Diamond', livello: 4, icona: '💎', colore: '#B9F2FF', xpMinimo: 7000 },
    { nome: 'Master', livello: 5, icona: '👑', colore: '#9B59B6', xpMinimo: 15000 }
  ];

  for (const l of leghe) {
    await prisma.league.upsert({
      where: { id: `league-${l.livello}` },
      update: {},
      create: {
        id: `league-${l.livello}`,
        ...l
      }
    });
  }
  console.log(`   ✓ ${leghe.length} leghe create`);

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. STREAK PER UTENTI
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n🔥 Creazione streak...');
  
  const tuttiUtenti = await prisma.utente.findMany();
  
  for (const u of tuttiUtenti) {
    await prisma.streak.upsert({
      where: { utenteId: u.id },
      update: {},
      create: {
        utenteId: u.id,
        streakCorrente: Math.floor(Math.random() * 10),
        streakMassimo: Math.floor(Math.random() * 30),
        ultimoGiorno: new Date(),
        freezeUsati: 0
      }
    });
  }
  console.log(`   ✓ Streak creati per ${tuttiUtenti.length} utenti`);

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. STATISTICHE GIORNALIERE DI ESEMPIO
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n📊 Creazione statistiche di esempio...');
  
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  
  for (const u of tuttiUtenti.slice(0, 3)) {
    // Ultimi 7 giorni
    for (let i = 0; i < 7; i++) {
      const data = new Date(oggi);
      data.setDate(data.getDate() - i);
      
      await prisma.statisticheGiornaliere.upsert({
        where: {
          utenteId_data: {
            utenteId: u.id,
            data
          }
        },
        update: {},
        create: {
          utenteId: u.id,
          data,
          minutiStudio: Math.floor(Math.random() * 60) + 10,
          sessioniComplete: Math.floor(Math.random() * 3) + 1,
          quizCompletati: Math.floor(Math.random() * 10) + 2,
          quizCorretti: Math.floor(Math.random() * 8) + 1,
          flashcardViste: Math.floor(Math.random() * 20) + 5,
          flashcardRicordate: Math.floor(Math.random() * 15) + 3,
          xpGuadagnati: Math.floor(Math.random() * 200) + 50
        }
      });
    }
  }
  console.log('   ✓ Statistiche di esempio create');

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. NOTIFICHE DI BENVENUTO
  // ═══════════════════════════════════════════════════════════════════════════
  
  console.log('\n🔔 Creazione notifiche di benvenuto...');
  
  for (const u of tuttiUtenti) {
    await prisma.notifica.create({
      data: {
        utenteId: u.id,
        titolo: '🎉 Benvenuto su ImparaFacile!',
        corpo: 'Inizia il tuo percorso di studio e guadagna XP completando quiz e flashcards.',
        canale: 'in-app',
        payload: { tipo: 'benvenuto' }
      }
    });
  }
  console.log(`   ✓ Notifiche create per ${tuttiUtenti.length} utenti`);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('   ✅ SEED COMPLETATO CON SUCCESSO!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n📋 Credenziali di test:');
  console.log('   Admin: admin@imparafacile.it / password123');
  console.log('   Studente: mario.rossi@studente.it / password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Errore seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
