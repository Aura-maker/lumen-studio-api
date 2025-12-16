/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SERVIZIO STATISTICHE LIVE - DATI REALI CON PRISMA
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Gestisce tutte le statistiche degli studenti in tempo reale:
 * - XP e livelli
 * - Streak giornaliero
 * - Badge e achievements
 * - Statistiche quiz e flashcards
 * - Grafici dashboard
 * - Attività e notifiche
 */

const prisma = require('../prisma');

class StatisticheLiveService {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONFIGURAZIONE XP E LIVELLI
  // ═══════════════════════════════════════════════════════════════════════════
  
  static XP_CONFIG = {
    // XP per azioni
    QUIZ_CORRETTO: 10,
    QUIZ_ERRATO: 2,
    QUIZ_PERFETTO_BONUS: 25,
    FLASHCARD_VISTA: 2,
    FLASHCARD_RICORDATA: 5,
    RIASSUNTO_LETTO: 15,
    SESSIONE_STUDIO_MIN: 1, // XP per minuto
    ESAME_COMPLETATO: 50,
    STREAK_BONUS: 10, // XP bonus per ogni giorno di streak
    
    // Livelli (XP richiesti)
    LIVELLI: [
      0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
      4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300,
      19200, 21200, 23300, 25500, 27800, 30200, 32700, 35300, 38000, 40800
    ]
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DEFINIZIONE BADGE
  // ═══════════════════════════════════════════════════════════════════════════
  
  static BADGES = {
    // Quiz
    'primo-quiz': { nome: '🎯 Primo Quiz', descrizione: 'Completa il tuo primo quiz', condizione: (s) => s.quizCompletati >= 1 },
    'quiz-10': { nome: '🏆 Quiz Master', descrizione: 'Completa 10 quiz', condizione: (s) => s.quizCompletati >= 10 },
    'quiz-50': { nome: '🥇 Quiz Champion', descrizione: 'Completa 50 quiz', condizione: (s) => s.quizCompletati >= 50 },
    'quiz-100': { nome: '👑 Quiz Legend', descrizione: 'Completa 100 quiz', condizione: (s) => s.quizCompletati >= 100 },
    'quiz-500': { nome: '🔥 Quiz Immortale', descrizione: 'Completa 500 quiz', condizione: (s) => s.quizCompletati >= 500 },
    
    // Accuratezza
    'precisione-80': { nome: '🎯 Precisione', descrizione: 'Raggiungi 80% di accuratezza', condizione: (s) => s.accuratezzaMedia >= 80 },
    'precisione-90': { nome: '🎯 Cecchino', descrizione: 'Raggiungi 90% di accuratezza', condizione: (s) => s.accuratezzaMedia >= 90 },
    'precisione-95': { nome: '🎯 Perfezionista', descrizione: 'Raggiungi 95% di accuratezza', condizione: (s) => s.accuratezzaMedia >= 95 },
    
    // Streak
    'streak-3': { nome: '🔥 Iniziativa', descrizione: '3 giorni consecutivi', condizione: (s) => s.streakCorrente >= 3 },
    'streak-7': { nome: '🔥 Costanza', descrizione: '7 giorni consecutivi', condizione: (s) => s.streakCorrente >= 7 },
    'streak-14': { nome: '🔥 Dedizione', descrizione: '14 giorni consecutivi', condizione: (s) => s.streakCorrente >= 14 },
    'streak-30': { nome: '🔥 Leggenda', descrizione: '30 giorni consecutivi', condizione: (s) => s.streakCorrente >= 30 },
    
    // Studio
    'studioso-1h': { nome: '📚 Studioso', descrizione: '1 ora di studio totale', condizione: (s) => s.minutiStudioTotali >= 60 },
    'studioso-10h': { nome: '📚 Dedicato', descrizione: '10 ore di studio totale', condizione: (s) => s.minutiStudioTotali >= 600 },
    'studioso-50h': { nome: '📚 Esperto', descrizione: '50 ore di studio totale', condizione: (s) => s.minutiStudioTotali >= 3000 },
    
    // Flashcards
    'flashcard-100': { nome: '🃏 Memorizzatore', descrizione: 'Visualizza 100 flashcards', condizione: (s) => s.flashcardViste >= 100 },
    'flashcard-500': { nome: '🃏 Memoria d\'Elefante', descrizione: 'Visualizza 500 flashcards', condizione: (s) => s.flashcardViste >= 500 },
    
    // Livelli
    'livello-5': { nome: '⭐ Livello 5', descrizione: 'Raggiungi il livello 5', condizione: (s) => s.livello >= 5 },
    'livello-10': { nome: '⭐⭐ Livello 10', descrizione: 'Raggiungi il livello 10', condizione: (s) => s.livello >= 10 },
    'livello-20': { nome: '⭐⭐⭐ Livello 20', descrizione: 'Raggiungi il livello 20', condizione: (s) => s.livello >= 20 },
    
    // Esami
    'primo-esame': { nome: '📝 Prima Simulazione', descrizione: 'Completa la prima simulazione d\'esame', condizione: (s) => s.esamiCompletati >= 1 },
    'esami-10': { nome: '📝 Veterano Esami', descrizione: 'Completa 10 simulazioni d\'esame', condizione: (s) => s.esamiCompletati >= 10 }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILO COMPLETO UTENTE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Ottiene il profilo completo di un utente con tutte le statistiche
   */
  async getProfiloCompleto(utenteId) {
    try {
      // Recupera utente con tutte le relazioni
      const utente = await prisma.utente.findUnique({
        where: { id: utenteId },
        include: {
          streak: true,
          achievements: true,
          distintiviUtente: { include: { distintivo: true } },
          statistiche: {
            orderBy: { data: 'desc' },
            take: 30 // Ultimi 30 giorni
          },
          sessioniStudio: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          dailyGoals: {
            where: {
              data: {
                gte: this.getStartOfDay()
              }
            }
          },
          dailyChallenges: {
            where: {
              data: {
                gte: this.getStartOfDay()
              }
            }
          }
        }
      });

      if (!utente) {
        throw new Error('Utente non trovato');
      }

      // Calcola statistiche aggregate
      const statsAggregate = await this.calcolaStatisticheAggregate(utenteId);
      
      // Calcola livello da XP
      const livello = this.calcolaLivello(utente.punti);
      const xpPerProssimoLivello = this.xpPerProssimoLivello(utente.punti);
      
      // Verifica nuovi badge
      const nuoviBadge = await this.verificaBadge(utenteId, statsAggregate);

      return {
        id: utente.id,
        nome: utente.nome,
        email: utente.email,
        avatarUrl: utente.avatarUrl,
        ruolo: utente.ruolo,
        
        // XP e Livello
        xpTotale: utente.punti,
        livello,
        xpPerProssimoLivello,
        progressoLivello: this.calcolaProgressoLivello(utente.punti),
        
        // Streak
        streak: {
          corrente: utente.streak?.streakCorrente || 0,
          massimo: utente.streak?.streakMassimo || 0,
          ultimoGiorno: utente.streak?.ultimoGiorno,
          freezeDisponibili: 3 - (utente.streak?.freezeUsati || 0)
        },
        
        // Statistiche
        statistiche: {
          ...statsAggregate,
          graficoSettimana: await this.getGraficoSettimana(utenteId),
          graficoMaterie: await this.getGraficoMaterie(utenteId)
        },
        
        // Badge
        badge: utente.achievements.map(a => ({
          id: a.achievement,
          ...StatisticheLiveService.BADGES[a.achievement],
          sbloccatoAt: a.sbloccatoAt,
          visto: a.visto
        })),
        nuoviBadge,
        
        // Obiettivi giornalieri
        obiettiviGiornalieri: utente.dailyGoals,
        sfideGiornaliere: utente.dailyChallenges,
        
        // Sessioni recenti
        sessioniRecenti: utente.sessioniStudio,
        
        // Timestamp
        ultimoAggiornamento: new Date().toISOString()
      };
    } catch (error) {
      console.error('Errore getProfiloCompleto:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRAZIONE ATTIVITÀ
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Registra il completamento di un quiz
   */
  async registraQuiz(utenteId, dati) {
    const { materia, corretto, tempoRisposta, domandeTotali, domandeCorrette } = dati;
    
    try {
      // Calcola XP
      let xpGuadagnati = corretto ? 
        StatisticheLiveService.XP_CONFIG.QUIZ_CORRETTO : 
        StatisticheLiveService.XP_CONFIG.QUIZ_ERRATO;
      
      // Bonus per quiz perfetto
      if (domandeCorrette === domandeTotali && domandeTotali > 0) {
        xpGuadagnati += StatisticheLiveService.XP_CONFIG.QUIZ_PERFETTO_BONUS;
      }

      // Aggiorna utente
      const utente = await prisma.utente.update({
        where: { id: utenteId },
        data: {
          punti: { increment: xpGuadagnati }
        }
      });

      // Aggiorna statistiche giornaliere
      await this.aggiornaStatisticheGiornaliere(utenteId, {
        quizCompletati: 1,
        quizCorretti: corretto ? 1 : 0,
        xpGuadagnati
      });

      // Aggiorna streak
      await this.aggiornaStreak(utenteId);

      // Log attività
      await prisma.activityLog.create({
        data: {
          utenteId,
          tipo: 'QUIZ_COMPLETATO',
          dettagli: { materia, corretto, tempoRisposta, xpGuadagnati }
        }
      });

      // Verifica badge
      const statsAggregate = await this.calcolaStatisticheAggregate(utenteId);
      const nuoviBadge = await this.verificaBadge(utenteId, statsAggregate);

      return {
        xpGuadagnati,
        xpTotale: utente.punti + xpGuadagnati,
        livello: this.calcolaLivello(utente.punti + xpGuadagnati),
        nuoviBadge
      };
    } catch (error) {
      console.error('Errore registraQuiz:', error);
      throw error;
    }
  }

  /**
   * Registra visualizzazione flashcard
   */
  async registraFlashcard(utenteId, dati) {
    const { flashcardId, ricordata, tempoRisposta } = dati;
    
    try {
      const xpGuadagnati = ricordata ? 
        StatisticheLiveService.XP_CONFIG.FLASHCARD_RICORDATA : 
        StatisticheLiveService.XP_CONFIG.FLASHCARD_VISTA;

      // Aggiorna utente
      await prisma.utente.update({
        where: { id: utenteId },
        data: {
          punti: { increment: xpGuadagnati }
        }
      });

      // Aggiorna statistiche giornaliere
      await this.aggiornaStatisticheGiornaliere(utenteId, {
        flashcardViste: 1,
        flashcardRicordate: ricordata ? 1 : 0,
        xpGuadagnati
      });

      // Aggiorna streak
      await this.aggiornaStreak(utenteId);

      // Aggiorna progresso flashcard (spaced repetition)
      if (flashcardId) {
        await this.aggiornaProgressoFlashcard(utenteId, flashcardId, ricordata);
      }

      return { xpGuadagnati };
    } catch (error) {
      console.error('Errore registraFlashcard:', error);
      throw error;
    }
  }

  /**
   * Registra sessione di studio
   */
  async registraSessioneStudio(utenteId, dati) {
    const { tipo, materia, argomento, durataMinuti } = dati;
    
    try {
      const xpGuadagnati = durataMinuti * StatisticheLiveService.XP_CONFIG.SESSIONE_STUDIO_MIN;

      // Crea sessione
      const sessione = await prisma.sessioneStudio.create({
        data: {
          utenteId,
          tipo: tipo || 'libero',
          materia,
          argomento,
          durataMinuti,
          xpGuadagnati,
          inizioAt: new Date(Date.now() - durataMinuti * 60000),
          fineAt: new Date()
        }
      });

      // Aggiorna utente
      await prisma.utente.update({
        where: { id: utenteId },
        data: {
          punti: { increment: xpGuadagnati }
        }
      });

      // Aggiorna statistiche giornaliere
      await this.aggiornaStatisticheGiornaliere(utenteId, {
        minutiStudio: durataMinuti,
        sessioniComplete: 1,
        xpGuadagnati
      });

      // Aggiorna streak
      await this.aggiornaStreak(utenteId);

      return { sessione, xpGuadagnati };
    } catch (error) {
      console.error('Errore registraSessioneStudio:', error);
      throw error;
    }
  }

  /**
   * Registra completamento simulazione esame
   */
  async registraEsame(utenteId, dati) {
    const { tipoProva, tipologia, materia, punteggio, punteggioMax, durataMinuti, risposte } = dati;
    
    try {
      const xpGuadagnati = StatisticheLiveService.XP_CONFIG.ESAME_COMPLETATO + 
        Math.floor((punteggio / punteggioMax) * 50);

      // Crea simulazione
      const simulazione = await prisma.simulazioneEsame.create({
        data: {
          utenteId,
          tipoProva,
          tipologia,
          materia,
          punteggio,
          punteggioMax,
          durataMinuti,
          risposte
        }
      });

      // Aggiorna utente
      await prisma.utente.update({
        where: { id: utenteId },
        data: {
          punti: { increment: xpGuadagnati }
        }
      });

      // Aggiorna statistiche
      await this.aggiornaStatisticheGiornaliere(utenteId, {
        xpGuadagnati
      });

      // Aggiorna streak
      await this.aggiornaStreak(utenteId);

      return { simulazione, xpGuadagnati };
    } catch (error) {
      console.error('Errore registraEsame:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTICHE E GRAFICI
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Calcola statistiche aggregate per un utente
   */
  async calcolaStatisticheAggregate(utenteId) {
    try {
      // Statistiche quiz
      const quizStats = await prisma.progresso.aggregate({
        where: { utenteId },
        _count: true,
        _sum: { punteggio: true, punteggioMax: true }
      });

      // Statistiche flashcard
      const flashcardStats = await prisma.progressoFlashcard.aggregate({
        where: { utenteId },
        _count: true
      });

      // Statistiche sessioni studio
      const studioStats = await prisma.sessioneStudio.aggregate({
        where: { utenteId },
        _sum: { durataMinuti: true, xpGuadagnati: true },
        _count: true
      });

      // Statistiche esami
      const esamiStats = await prisma.simulazioneEsame.aggregate({
        where: { utenteId },
        _count: true,
        _avg: { punteggio: true }
      });

      // Streak
      const streak = await prisma.streak.findUnique({
        where: { utenteId }
      });

      // Utente per XP e livello
      const utente = await prisma.utente.findUnique({
        where: { id: utenteId },
        select: { punti: true, livello: true }
      });

      const quizCompletati = quizStats._count || 0;
      const quizCorretti = quizStats._sum?.punteggio || 0;
      const quizTotali = quizStats._sum?.punteggioMax || 1;
      
      return {
        quizCompletati,
        quizCorretti,
        accuratezzaMedia: quizTotali > 0 ? Math.round((quizCorretti / quizTotali) * 100) : 0,
        flashcardViste: flashcardStats._count || 0,
        minutiStudioTotali: studioStats._sum?.durataMinuti || 0,
        sessioniStudio: studioStats._count || 0,
        esamiCompletati: esamiStats._count || 0,
        mediaEsami: Math.round(esamiStats._avg?.punteggio || 0),
        streakCorrente: streak?.streakCorrente || 0,
        streakMassimo: streak?.streakMassimo || 0,
        xpTotale: utente?.punti || 0,
        livello: this.calcolaLivello(utente?.punti || 0)
      };
    } catch (error) {
      console.error('Errore calcolaStatisticheAggregate:', error);
      return {
        quizCompletati: 0,
        quizCorretti: 0,
        accuratezzaMedia: 0,
        flashcardViste: 0,
        minutiStudioTotali: 0,
        sessioniStudio: 0,
        esamiCompletati: 0,
        mediaEsami: 0,
        streakCorrente: 0,
        streakMassimo: 0,
        xpTotale: 0,
        livello: 1
      };
    }
  }

  /**
   * Ottiene dati per grafico settimanale
   */
  async getGraficoSettimana(utenteId) {
    try {
      const oggi = new Date();
      const settimaneFa = new Date(oggi);
      settimaneFa.setDate(oggi.getDate() - 7);

      const statistiche = await prisma.statisticheGiornaliere.findMany({
        where: {
          utenteId,
          data: {
            gte: settimaneFa
          }
        },
        orderBy: { data: 'asc' }
      });

      // Crea array con tutti i 7 giorni
      const giorni = [];
      for (let i = 6; i >= 0; i--) {
        const data = new Date(oggi);
        data.setDate(oggi.getDate() - i);
        const dataStr = data.toISOString().split('T')[0];
        
        const stat = statistiche.find(s => 
          s.data.toISOString().split('T')[0] === dataStr
        );
        
        giorni.push({
          data: dataStr,
          giorno: this.getNomeGiorno(data),
          minutiStudio: stat?.minutiStudio || 0,
          quizCompletati: stat?.quizCompletati || 0,
          xpGuadagnati: stat?.xpGuadagnati || 0
        });
      }

      return giorni;
    } catch (error) {
      console.error('Errore getGraficoSettimana:', error);
      return [];
    }
  }

  /**
   * Ottiene dati per grafico materie
   */
  async getGraficoMaterie(utenteId) {
    try {
      // Raggruppa sessioni per materia
      const sessioni = await prisma.sessioneStudio.groupBy({
        by: ['materia'],
        where: { 
          utenteId,
          materia: { not: null }
        },
        _sum: { durataMinuti: true, xpGuadagnati: true },
        _count: true
      });

      return sessioni.map(s => ({
        materia: s.materia,
        minutiStudio: s._sum.durataMinuti || 0,
        xpGuadagnati: s._sum.xpGuadagnati || 0,
        sessioni: s._count
      }));
    } catch (error) {
      console.error('Errore getGraficoMaterie:', error);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STREAK E BADGE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Aggiorna lo streak dell'utente
   */
  async aggiornaStreak(utenteId) {
    try {
      const oggi = this.getStartOfDay();
      
      let streak = await prisma.streak.findUnique({
        where: { utenteId }
      });

      if (!streak) {
        // Crea nuovo streak
        streak = await prisma.streak.create({
          data: {
            utenteId,
            streakCorrente: 1,
            streakMassimo: 1,
            ultimoGiorno: oggi
          }
        });
        return streak;
      }

      const ultimoGiorno = streak.ultimoGiorno ? new Date(streak.ultimoGiorno) : null;
      const ieri = new Date(oggi);
      ieri.setDate(ieri.getDate() - 1);

      if (ultimoGiorno && ultimoGiorno.toDateString() === oggi.toDateString()) {
        // Già aggiornato oggi
        return streak;
      }

      if (ultimoGiorno && ultimoGiorno.toDateString() === ieri.toDateString()) {
        // Continua streak
        const nuovoStreak = streak.streakCorrente + 1;
        streak = await prisma.streak.update({
          where: { utenteId },
          data: {
            streakCorrente: nuovoStreak,
            streakMassimo: Math.max(nuovoStreak, streak.streakMassimo),
            ultimoGiorno: oggi
          }
        });

        // Bonus XP per streak
        const bonusXP = StatisticheLiveService.XP_CONFIG.STREAK_BONUS * nuovoStreak;
        await prisma.utente.update({
          where: { id: utenteId },
          data: { punti: { increment: bonusXP } }
        });
      } else {
        // Streak interrotto, ricomincia da 1
        streak = await prisma.streak.update({
          where: { utenteId },
          data: {
            streakCorrente: 1,
            ultimoGiorno: oggi
          }
        });
      }

      return streak;
    } catch (error) {
      console.error('Errore aggiornaStreak:', error);
      throw error;
    }
  }

  /**
   * Verifica e assegna nuovi badge
   */
  async verificaBadge(utenteId, statistiche) {
    const nuoviBadge = [];
    
    try {
      // Ottieni badge già ottenuti
      const badgeOttenuti = await prisma.achievementUtente.findMany({
        where: { utenteId },
        select: { achievement: true }
      });
      const badgeIds = new Set(badgeOttenuti.map(b => b.achievement));

      // Verifica ogni badge
      for (const [badgeId, badge] of Object.entries(StatisticheLiveService.BADGES)) {
        if (!badgeIds.has(badgeId) && badge.condizione(statistiche)) {
          // Assegna nuovo badge
          await prisma.achievementUtente.create({
            data: {
              utenteId,
              achievement: badgeId,
              visto: false
            }
          });
          
          nuoviBadge.push({
            id: badgeId,
            ...badge
          });

          // Crea notifica
          await prisma.notifica.create({
            data: {
              utenteId,
              titolo: '🏆 Nuovo Badge Sbloccato!',
              corpo: `Hai ottenuto il badge "${badge.nome}"!`,
              canale: 'in-app',
              payload: { tipo: 'badge', badgeId }
            }
          });
        }
      }

      return nuoviBadge;
    } catch (error) {
      console.error('Errore verificaBadge:', error);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Aggiorna statistiche giornaliere
   */
  async aggiornaStatisticheGiornaliere(utenteId, incrementi) {
    const oggi = this.getStartOfDay();
    
    try {
      await prisma.statisticheGiornaliere.upsert({
        where: {
          utenteId_data: {
            utenteId,
            data: oggi
          }
        },
        create: {
          utenteId,
          data: oggi,
          minutiStudio: incrementi.minutiStudio || 0,
          sessioniComplete: incrementi.sessioniComplete || 0,
          quizCompletati: incrementi.quizCompletati || 0,
          quizCorretti: incrementi.quizCorretti || 0,
          flashcardViste: incrementi.flashcardViste || 0,
          flashcardRicordate: incrementi.flashcardRicordate || 0,
          xpGuadagnati: incrementi.xpGuadagnati || 0
        },
        update: {
          minutiStudio: { increment: incrementi.minutiStudio || 0 },
          sessioniComplete: { increment: incrementi.sessioniComplete || 0 },
          quizCompletati: { increment: incrementi.quizCompletati || 0 },
          quizCorretti: { increment: incrementi.quizCorretti || 0 },
          flashcardViste: { increment: incrementi.flashcardViste || 0 },
          flashcardRicordate: { increment: incrementi.flashcardRicordate || 0 },
          xpGuadagnati: { increment: incrementi.xpGuadagnati || 0 }
        }
      });
    } catch (error) {
      console.error('Errore aggiornaStatisticheGiornaliere:', error);
    }
  }

  /**
   * Aggiorna progresso flashcard (spaced repetition)
   */
  async aggiornaProgressoFlashcard(utenteId, flashcardId, ricordata) {
    try {
      const progresso = await prisma.progressoFlashcard.findUnique({
        where: {
          utenteId_flashcardId: { utenteId, flashcardId }
        }
      });

      const nuovoLivello = progresso ? 
        (ricordata ? Math.min(progresso.livelloMemoria + 1, 5) : Math.max(progresso.livelloMemoria - 1, 0)) : 
        (ricordata ? 1 : 0);

      // Calcola prossima revisione (SM-2 semplificato)
      const intervalliGiorni = [1, 2, 4, 7, 14, 30];
      const prossimaRevisione = new Date();
      prossimaRevisione.setDate(prossimaRevisione.getDate() + intervalliGiorni[nuovoLivello]);

      await prisma.progressoFlashcard.upsert({
        where: {
          utenteId_flashcardId: { utenteId, flashcardId }
        },
        create: {
          utenteId,
          flashcardId,
          livelloMemoria: nuovoLivello,
          ultimaRevisione: new Date(),
          prossimaRevisione
        },
        update: {
          livelloMemoria: nuovoLivello,
          ultimaRevisione: new Date(),
          prossimaRevisione
        }
      });
    } catch (error) {
      console.error('Errore aggiornaProgressoFlashcard:', error);
    }
  }

  /**
   * Calcola livello da XP
   */
  calcolaLivello(xp) {
    const livelli = StatisticheLiveService.XP_CONFIG.LIVELLI;
    for (let i = livelli.length - 1; i >= 0; i--) {
      if (xp >= livelli[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Calcola XP necessari per prossimo livello
   */
  xpPerProssimoLivello(xp) {
    const livello = this.calcolaLivello(xp);
    const livelli = StatisticheLiveService.XP_CONFIG.LIVELLI;
    if (livello >= livelli.length) return 0;
    return livelli[livello] - xp;
  }

  /**
   * Calcola progresso verso prossimo livello (0-100)
   */
  calcolaProgressoLivello(xp) {
    const livello = this.calcolaLivello(xp);
    const livelli = StatisticheLiveService.XP_CONFIG.LIVELLI;
    if (livello >= livelli.length) return 100;
    
    const xpLivelloCorrente = livelli[livello - 1];
    const xpProssimoLivello = livelli[livello];
    const progressoXP = xp - xpLivelloCorrente;
    const xpNecessari = xpProssimoLivello - xpLivelloCorrente;
    
    return Math.round((progressoXP / xpNecessari) * 100);
  }

  /**
   * Ottiene inizio giornata corrente
   */
  getStartOfDay() {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    return oggi;
  }

  /**
   * Ottiene nome giorno della settimana
   */
  getNomeGiorno(data) {
    const giorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return giorni[data.getDay()];
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CLASSIFICA
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Ottiene classifica globale
   */
  async getClassifica(limite = 10, periodo = 'sempre') {
    try {
      let utenti;
      
      if (periodo === 'settimana') {
        // Classifica settimanale basata su XP guadagnati questa settimana
        const inizioSettimana = new Date();
        inizioSettimana.setDate(inizioSettimana.getDate() - 7);
        
        const stats = await prisma.statisticheGiornaliere.groupBy({
          by: ['utenteId'],
          where: {
            data: { gte: inizioSettimana }
          },
          _sum: { xpGuadagnati: true },
          orderBy: {
            _sum: { xpGuadagnati: 'desc' }
          },
          take: limite
        });

        const utenteIds = stats.map(s => s.utenteId);
        const utentiData = await prisma.utente.findMany({
          where: { id: { in: utenteIds } },
          select: { id: true, nome: true, avatarUrl: true, punti: true, livello: true }
        });

        utenti = stats.map((s, i) => {
          const u = utentiData.find(u => u.id === s.utenteId);
          return {
            posizione: i + 1,
            id: s.utenteId,
            nome: u?.nome || 'Utente',
            avatarUrl: u?.avatarUrl,
            xpSettimana: s._sum.xpGuadagnati || 0,
            xpTotale: u?.punti || 0,
            livello: this.calcolaLivello(u?.punti || 0)
          };
        });
      } else {
        // Classifica totale
        utenti = await prisma.utente.findMany({
          orderBy: { punti: 'desc' },
          take: limite,
          select: {
            id: true,
            nome: true,
            avatarUrl: true,
            punti: true,
            livello: true,
            streak: { select: { streakCorrente: true } }
          }
        });

        utenti = utenti.map((u, i) => ({
          posizione: i + 1,
          id: u.id,
          nome: u.nome,
          avatarUrl: u.avatarUrl,
          xpTotale: u.punti,
          livello: this.calcolaLivello(u.punti),
          streak: u.streak?.streakCorrente || 0
        }));
      }

      return utenti;
    } catch (error) {
      console.error('Errore getClassifica:', error);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTIFICHE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Ottiene notifiche utente
   */
  async getNotifiche(utenteId, limite = 20, soloNonLette = false) {
    try {
      const where = { utenteId };
      if (soloNonLette) {
        where.letta = false;
      }

      const notifiche = await prisma.notifica.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limite
      });

      return notifiche;
    } catch (error) {
      console.error('Errore getNotifiche:', error);
      return [];
    }
  }

  /**
   * Segna notifica come letta
   */
  async segnaNotificaLetta(notificaId, utenteId) {
    try {
      await prisma.notifica.updateMany({
        where: { id: notificaId, utenteId },
        data: { letta: true }
      });
      return true;
    } catch (error) {
      console.error('Errore segnaNotificaLetta:', error);
      return false;
    }
  }

  /**
   * Segna tutte le notifiche come lette
   */
  async segnaTutteNotificheLette(utenteId) {
    try {
      await prisma.notifica.updateMany({
        where: { utenteId, letta: false },
        data: { letta: true }
      });
      return true;
    } catch (error) {
      console.error('Errore segnaTutteNotificheLette:', error);
      return false;
    }
  }
}

module.exports = StatisticheLiveService;
