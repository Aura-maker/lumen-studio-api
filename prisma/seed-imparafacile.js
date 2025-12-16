// Seed completo per ImparaFacile
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Import contenuti
const contenutiItaliano = require('../src/data/contenuti-italiano');
const flashcardsItaliano = require('../src/data/flashcards-italiano');
const quizService = require('../src/services/quiz-service');

async function main() {
  console.log('🚀 Inizio popolamento database ImparaFacile...\n');

  // 1. Crea utenti di test
  console.log('👤 Creazione utenti...');
  
  const passwordHash = await bcrypt.hash('password', 10);
  
  const admin = await prisma.utente.upsert({
    where: { email: 'admin@imparafacile.it' },
    update: {},
    create: {
      email: 'admin@imparafacile.it',
      password: passwordHash,
      nome: 'Admin',
      cognome: 'ImparaFacile',
      username: 'admin',
      ruolo: 'ADMIN',
      scuola: 'Liceo Scientifico',
      classe: '5A',
      xp: 10000,
      livelloGlobale: 10,
      streakGiorni: 30
    }
  });

  const studente = await prisma.utente.upsert({
    where: { email: 'mario.rossi@studente.it' },
    update: {},
    create: {
      email: 'mario.rossi@studente.it',
      password: passwordHash,
      nome: 'Mario',
      cognome: 'Rossi',
      username: 'mrossi',
      ruolo: 'STUDENTE',
      scuola: 'Liceo Classico',
      classe: '5B',
      xp: 500,
      livelloGlobale: 3,
      streakGiorni: 7
    }
  });

  console.log('✅ Utenti creati\n');

  // 2. Crea badges
  console.log('🏆 Creazione badges...');
  
  const badges = [
    {
      tipo: 'PRIMA_LEZIONE',
      nome: '🎓 Prima Lezione',
      descrizione: 'Completa la tua prima lezione',
      icona: '🎓',
      xpRichiesti: 0
    },
    {
      tipo: 'STREAK_7_GIORNI',
      nome: '🔥 Settimana di Fuoco',
      descrizione: 'Studia per 7 giorni consecutivi',
      icona: '🔥',
      xpRichiesti: 0
    },
    {
      tipo: 'STREAK_30_GIORNI',
      nome: '⭐ Mese Perfetto',
      descrizione: 'Studia per 30 giorni consecutivi',
      icona: '⭐',
      xpRichiesti: 0
    },
    {
      tipo: 'MAESTRO_MATERIA',
      nome: '👑 Maestro della Materia',
      descrizione: 'Completa tutti gli argomenti di una materia',
      icona: '👑',
      xpRichiesti: 1000
    },
    {
      tipo: 'QUIZ_PERFETTO',
      nome: '💯 Quiz Perfetto',
      descrizione: 'Rispondi correttamente a 10 quiz di fila',
      icona: '💯',
      xpRichiesti: 0
    }
  ];

  for (const badgeData of badges) {
    await prisma.badge.upsert({
      where: { tipo: badgeData.tipo },
      update: badgeData,
      create: badgeData
    });
  }

  console.log('✅ Badges creati\n');

  // 3. Crea materia Italiano
  console.log('📚 Creazione materia Italiano...');
  
  const italiano = await prisma.materia.upsert({
    where: { nome: '📚 Italiano' },
    update: {},
    create: {
      nome: '📚 Italiano',
      emoji: '📚',
      descrizione: 'Letteratura italiana dal Preromanticismo al Novecento',
      colore: '#4A90E2',
      annoScolastico: ['4', '5'],
      ordine: 1
    }
  });

  console.log('✅ Materia Italiano creata\n');

  // 4. Popola argomenti e sottoargomenti
  console.log('📖 Creazione argomenti e sottoargomenti...');
  
  let ordineArgomento = 0;
  for (const argData of contenutiItaliano.argomenti) {
    const argomento = await prisma.argomento.create({
      data: {
        titolo: argData.titolo,
        descrizione: argData.descrizione,
        ordine: ordineArgomento++,
        annoRiferimento: argData.annoRiferimento,
        materiaId: italiano.id
      }
    });

    console.log(`  📖 ${argomento.titolo}`);

    // Crea sottoargomenti
    let ordineSotto = 0;
    for (const sottoData of argData.sottoargomenti) {
      const sottoargomento = await prisma.sottoargomento.create({
        data: {
          titolo: sottoData.titolo,
          riassunto: sottoData.riassunto,
          ordine: ordineSotto++,
          livelloDifficolta: sottoData.livelloDifficolta,
          tempoLettura: sottoData.tempoLettura,
          tags: sottoData.tags,
          collegamenti: sottoData.collegamenti || [],
          argomentoId: argomento.id
        }
      });

      console.log(`    📝 ${sottoargomento.titolo}`);
    }
  }

  console.log('✅ Argomenti e sottoargomenti creati\n');

  // 5. Crea quiz
  console.log('🎯 Creazione quiz...');
  
  const sottoargomenti = await prisma.sottoargomento.findMany();
  const tuttiQuiz = quizService.tuttiQuiz;
  
  // Distribuisci i quiz tra i sottoargomenti
  let quizIndex = 0;
  for (const sotto of sottoargomenti) {
    // Assegna 10-20 quiz per sottoargomento
    const numQuiz = Math.floor(Math.random() * 10) + 10;
    
    for (let i = 0; i < numQuiz && quizIndex < tuttiQuiz.length; i++) {
      const quizData = tuttiQuiz[quizIndex++];
      
      await prisma.quiz.create({
        data: {
          domanda: quizData.domanda,
          tipo: quizData.tipo,
          difficolta: quizData.difficolta || 'MEDIO',
          opzioni: quizData.opzioni || null,
          rispostaCorretta: quizData.rispostaCorretta,
          spiegazione: quizData.spiegazione,
          puntiXP: quizData.puntiXP || 10,
          tempoMassimo: quizData.tempoMassimo || 30,
          sottoargomentoId: sotto.id
        }
      });
    }
  }

  console.log(`✅ ${quizIndex} quiz creati\n`);

  // 6. Crea flashcards
  console.log('🎴 Creazione flashcards...');
  
  let flashcardCount = 0;
  for (const sotto of sottoargomenti) {
    // Trova flashcards correlate
    const chiave = sotto.titolo.toLowerCase().includes('foscolo') ? 'foscolo' :
                   sotto.titolo.toLowerCase().includes('leopardi') ? 'leopardi' :
                   sotto.titolo.toLowerCase().includes('verga') ? 'verga' : null;
    
    if (chiave) {
      const flashcardKeys = Object.keys(flashcardsItaliano).filter(k => k.includes(chiave));
      
      for (const key of flashcardKeys) {
        const flashcardSet = flashcardsItaliano[key];
        
        for (const flashData of flashcardSet) {
          await prisma.flashcard.create({
            data: {
              fronte: flashData.fronte,
              retro: flashData.retro,
              tags: flashData.tags,
              livello: flashData.livello,
              formula: flashData.formula || null,
              spiegazioneFormula: flashData.spiegazioneFormula || null,
              sottoargomentoId: sotto.id
            }
          });
          flashcardCount++;
        }
      }
    }
  }

  console.log(`✅ ${flashcardCount} flashcards create\n`);

  // 7. Crea alcuni libri per il marketplace
  console.log('📚 Creazione annunci marketplace...');
  
  const libri = [
    {
      titolo: 'I Promessi Sposi - Edizione Integrale',
      autori: ['Alessandro Manzoni'],
      isbn: '9788807900001',
      casaEditrice: 'Feltrinelli',
      annoEdizione: '2023',
      condizione: 'OTTIMO',
      prezzo: 12.50,
      descrizione: 'Edizione integrale con note e commenti. Usato pochissimo, come nuovo.',
      citta: 'Milano',
      provincia: 'MI',
      venditoreId: studente.id,
      materiaId: italiano.id
    },
    {
      titolo: 'Antologia della Letteratura Italiana',
      autori: ['AA.VV.'],
      isbn: '9788808123456',
      casaEditrice: 'Zanichelli',
      annoEdizione: '2022',
      condizione: 'BUONO',
      prezzo: 18.00,
      descrizione: 'Antologia completa per il triennio. Qualche sottolineatura a matita.',
      citta: 'Roma',
      provincia: 'RM',
      venditoreId: admin.id,
      materiaId: italiano.id
    }
  ];

  for (const libroData of libri) {
    const libro = await prisma.libro.create({
      data: {
        ...libroData,
        stato: 'ATTIVO',
        spedizioneDisponibile: true,
        costoSpedizione: 5.00
      }
    });

    // Aggiungi foto fittizie
    await prisma.fotoLibro.createMany({
      data: [
        {
          url: `https://placeholder.com/libro-${libro.id}-1.jpg`,
          altText: `Copertina di ${libro.titolo}`,
          ordine: 0,
          libroId: libro.id
        },
        {
          url: `https://placeholder.com/libro-${libro.id}-2.jpg`,
          altText: `Retro di ${libro.titolo}`,
          ordine: 1,
          libroId: libro.id
        },
        {
          url: `https://placeholder.com/libro-${libro.id}-3.jpg`,
          altText: `Pagine interne di ${libro.titolo}`,
          ordine: 2,
          libroId: libro.id
        }
      ]
    });
  }

  console.log('✅ Annunci marketplace creati\n');

  // 8. Crea progressi di esempio per lo studente
  console.log('📊 Creazione progressi di esempio...');
  
  const primoSotto = sottoargomenti[0];
  await prisma.progresso.create({
    data: {
      percentualeCompletamento: 75,
      xpGuadagnati: 150,
      tempoStudio: 45,
      utenteId: studente.id,
      sottoargomentoId: primoSotto.id
    }
  });

  await prisma.progressoMateria.create({
    data: {
      livelloMateria: 2,
      xpMateria: 300,
      percentualeCompletamento: 25,
      utenteId: studente.id,
      materiaId: italiano.id
    }
  });

  // Assegna alcuni badge allo studente
  const badgePrimaLezione = await prisma.badge.findUnique({
    where: { tipo: 'PRIMA_LEZIONE' }
  });

  const badgeStreak7 = await prisma.badge.findUnique({
    where: { tipo: 'STREAK_7_GIORNI' }
  });

  await prisma.badgeUtente.create({
    data: {
      utenteId: studente.id,
      badgeId: badgePrimaLezione.id
    }
  });

  await prisma.badgeUtente.create({
    data: {
      utenteId: studente.id,
      badgeId: badgeStreak7.id
    }
  });

  console.log('✅ Progressi creati\n');

  // 9. Statistiche finali
  const stats = {
    utenti: await prisma.utente.count(),
    materie: await prisma.materia.count(),
    argomenti: await prisma.argomento.count(),
    sottoargomenti: await prisma.sottoargomento.count(),
    quiz: await prisma.quiz.count(),
    flashcards: await prisma.flashcard.count(),
    libri: await prisma.libro.count(),
    badges: await prisma.badge.count()
  };

  console.log('📊 STATISTICHE FINALI IMPARAFACILE:');
  console.log('=====================================');
  console.log(`   👤 Utenti: ${stats.utenti}`);
  console.log(`   📚 Materie: ${stats.materie}`);
  console.log(`   📖 Argomenti: ${stats.argomenti}`);
  console.log(`   📝 Sottoargomenti: ${stats.sottoargomenti}`);
  console.log(`   🎯 Quiz: ${stats.quiz}`);
  console.log(`   🎴 Flashcards: ${stats.flashcards}`);
  console.log(`   📚 Libri in vendita: ${stats.libri}`);
  console.log(`   🏆 Badges: ${stats.badges}`);
  console.log('=====================================\n');

  console.log('🎉 Popolamento completato con successo!');
  console.log('\n📱 Credenziali di accesso:');
  console.log('   Admin: admin@imparafacile.it / password');
  console.log('   Studente: mario.rossi@studente.it / password\n');
}

main()
  .catch(e => {
    console.error('❌ Errore durante il seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
