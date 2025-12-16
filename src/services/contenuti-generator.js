// Servizio per generazione automatica contenuti educativi - ImparaFacile
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import contenuti
const contenutiItaliano = require('../data/contenuti-italiano');
const quizItaliano = require('../data/quiz-italiano');
const flashcardsItaliano = require('../data/flashcards-italiano');

class ContenutiGenerator {
  /**
   * Popola il database con tutti i contenuti di una materia
   */
  async popolaMateria(nomeMateria) {
    console.log(`📚 Inizio popolamento materia: ${nomeMateria}`);
    
    try {
      // Trova o crea la materia
      let materia = await prisma.materia.findUnique({
        where: { nome: nomeMateria }
      });

      if (!materia) {
        const datiMateria = this.getDatiMateria(nomeMateria);
        materia = await prisma.materia.create({
          data: datiMateria
        });
        console.log(`✅ Materia creata: ${materia.nome}`);
      }

      // Popola argomenti e sottoargomenti
      const argomenti = this.getArgomenti(nomeMateria);
      
      for (const argomentoData of argomenti) {
        const argomento = await prisma.argomento.create({
          data: {
            titolo: argomentoData.titolo,
            descrizione: argomentoData.descrizione,
            ordine: argomentoData.ordine || 0,
            annoRiferimento: argomentoData.annoRiferimento,
            materiaId: materia.id
          }
        });

        console.log(`  📖 Argomento creato: ${argomento.titolo}`);

        // Crea sottoargomenti
        for (const sottoData of argomentoData.sottoargomenti) {
          const sottoargomento = await prisma.sottoargomento.create({
            data: {
              titolo: sottoData.titolo,
              riassunto: sottoData.riassunto,
              livelloDifficolta: sottoData.livelloDifficolta,
              tempoLettura: sottoData.tempoLettura,
              tags: sottoData.tags,
              collegamenti: sottoData.collegamenti || [],
              ordine: sottoData.ordine || 0,
              argomentoId: argomento.id
            }
          });

          console.log(`    📝 Sottoargomento creato: ${sottoargomento.titolo}`);

          // Genera quiz per questo sottoargomento
          await this.generaQuiz(sottoargomento.id, nomeMateria, sottoData.titolo);

          // Genera flashcards per questo sottoargomento
          await this.generaFlashcards(sottoargomento.id, nomeMateria, sottoData.titolo);
        }
      }

      console.log(`✅ Popolamento completato per ${nomeMateria}\n`);
      return materia;
    } catch (error) {
      console.error(`❌ Errore nel popolamento di ${nomeMateria}:`, error);
      throw error;
    }
  }

  /**
   * Ottiene i dati della materia
   */
  getDatiMateria(nomeMateria) {
    const mappaMaterie = {
      '📚 Italiano': contenutiItaliano.materia,
      // Aggiungi altre materie qui
    };

    return mappaMaterie[nomeMateria] || {
      nome: nomeMateria,
      descrizione: 'Materia scolastica',
      colore: '#4A90E2',
      annoScolastico: ['5']
    };
  }

  /**
   * Ottiene gli argomenti di una materia
   */
  getArgomenti(nomeMateria) {
    const mappaArgomenti = {
      '📚 Italiano': contenutiItaliano.argomenti,
      // Aggiungi altre materie qui
    };

    return mappaArgomenti[nomeMateria] || [];
  }

  /**
   * Genera quiz per un sottoargomento
   */
  async generaQuiz(sottoargomentoId, nomeMateria, titoloSottoargomento) {
    // Mappa quiz per materia e sottoargomento
    const mappaQuiz = {
      '📚 Italiano': quizItaliano
    };

    const quizMateria = mappaQuiz[nomeMateria];
    if (!quizMateria) return;

    // Trova quiz correlati al sottoargomento
    const chiaveQuiz = this.trovaChiaveQuiz(titoloSottoargomento);
    const quizDaCreare = quizMateria[chiaveQuiz] || [];

    for (const quizData of quizDaCreare) {
      await prisma.quiz.create({
        data: {
          domanda: quizData.domanda,
          tipo: quizData.tipo,
          difficolta: quizData.difficolta,
          opzioni: quizData.opzioni || null,
          rispostaCorretta: quizData.rispostaCorretta,
          spiegazione: quizData.spiegazione,
          puntiXP: quizData.puntiXP || 10,
          tempoMassimo: quizData.tempoMassimo || 30,
          sottoargomentoId: sottoargomentoId
        }
      });
    }

    console.log(`      🎯 ${quizDaCreare.length} quiz creati`);
  }

  /**
   * Genera flashcards per un sottoargomento
   */
  async generaFlashcards(sottoargomentoId, nomeMateria, titoloSottoargomento) {
    const mappaFlashcards = {
      '📚 Italiano': flashcardsItaliano
    };

    const flashcardsMateria = mappaFlashcards[nomeMateria];
    if (!flashcardsMateria) return;

    // Trova flashcards correlate
    const chiaveFlashcard = this.trovaChiaveQuiz(titoloSottoargomento);
    const flashcardsDaCreare = flashcardsMateria[chiaveFlashcard] || [];

    for (const flashData of flashcardsDaCreare) {
      await prisma.flashcard.create({
        data: {
          fronte: flashData.fronte,
          retro: flashData.retro,
          tags: flashData.tags,
          livello: flashData.livello,
          formula: flashData.formula || null,
          spiegazioneFormula: flashData.spiegazioneFormula || null,
          immagineFronte: flashData.immagineFronte || null,
          immagineRetro: flashData.immagineRetro || null,
          altTextFronte: flashData.altTextFronte || null,
          altTextRetro: flashData.altTextRetro || null,
          sottoargomentoId: sottoargomentoId
        }
      });
    }

    console.log(`      🎴 ${flashcardsDaCreare.length} flashcards create`);
  }

  /**
   * Trova la chiave per accedere a quiz/flashcards
   */
  trovaChiaveQuiz(titoloSottoargomento) {
    const mappaTitoli = {
      'Ugo Foscolo: vita e formazione': 'foscolo_vita',
      'Le Ultime lettere di Jacopo Ortis': 'foscolo_ortis',
      'I Sonetti e la poesia sepolcrale': 'foscolo_sonetti',
      'La formazione e l\'evoluzione del pensiero leopardiano': 'leopardi_pensiero',
      'I Canti: evoluzione poetica e temi principali': 'leopardi_canti',
      'Le Operette morali e la prosa filosofica': 'leopardi_operette',
      'Dal Naturalismo francese al Verismo italiano': 'verga_verismo',
      'Giovanni Verga: vita e opere del periodo pre-verista': 'verga_verismo',
      'I Malavoglia e il ciclo dei Vinti': 'verga_malavoglia'
    };

    return mappaTitoli[titoloSottoargomento] || 'default';
  }

  /**
   * Genera badge di sistema
   */
  async generaBadges() {
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
      },
      {
        tipo: 'FLASHCARD_CHAMPION',
        nome: '🏆 Campione Flashcard',
        descrizione: 'Rivedi 100 flashcards in un giorno',
        icona: '🏆',
        xpRichiesti: 0
      },
      {
        tipo: 'VENDITORE_AFFIDABILE',
        nome: '⭐ Venditore Affidabile',
        descrizione: 'Ricevi 10 recensioni a 5 stelle',
        icona: '⭐',
        xpRichiesti: 0
      },
      {
        tipo: 'STUDENTE_MODELLO',
        nome: '📚 Studente Modello',
        descrizione: 'Raggiungi il livello 10',
        icona: '📚',
        xpRichiesti: 5000
      }
    ];

    for (const badgeData of badges) {
      await prisma.badge.upsert({
        where: { tipo: badgeData.tipo },
        update: badgeData,
        create: badgeData
      });
    }

    console.log(`✅ ${badges.length} badges creati/aggiornati`);
  }

  /**
   * Popola tutte le materie disponibili
   */
  async popolaTutteLeMaterie() {
    const materie = ['📚 Italiano'];
    // Aggiungi altre materie man mano che vengono create

    for (const materia of materie) {
      await this.popolaMateria(materia);
    }

    await this.generaBadges();
    
    console.log('🎉 Popolamento completo di tutte le materie!');
  }

  /**
   * Calcola statistiche contenuti
   */
  async getStatistiche() {
    const stats = {
      materie: await prisma.materia.count(),
      argomenti: await prisma.argomento.count(),
      sottoargomenti: await prisma.sottoargomento.count(),
      quiz: await prisma.quiz.count(),
      flashcards: await prisma.flashcard.count(),
      utenti: await prisma.utente.count()
    };

    console.log('\n📊 STATISTICHE IMPARAFACILE:');
    console.log(`   Materie: ${stats.materie}`);
    console.log(`   Argomenti: ${stats.argomenti}`);
    console.log(`   Sottoargomenti: ${stats.sottoargomenti}`);
    console.log(`   Quiz: ${stats.quiz}`);
    console.log(`   Flashcards: ${stats.flashcards}`);
    console.log(`   Utenti registrati: ${stats.utenti}\n`);

    return stats;
  }
}

module.exports = new ContenutiGenerator();
