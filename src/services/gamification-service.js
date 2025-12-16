/**
 * Servizio Gamification - Gestisce XP, streak, livelli
 */

class GamificationService {
  constructor() {
    // Storage in memoria per utenti (in produzione usare database)
    this.utenti = {};
    
    // Definizione 80 badges disponibili
    this.badgesDisponibili = [
      // === QUIZ BADGES (15) ===
      { id: 'first_quiz', nome: 'Prima Vittoria', icona: '🏆', descrizione: 'Completa il tuo primo quiz', categoria: 'quiz' },
      { id: 'quiz_5', nome: 'Principiante', icona: '📝', descrizione: 'Completa 5 quiz', categoria: 'quiz' },
      { id: 'quiz_10', nome: 'Studioso', icona: '📚', descrizione: 'Completa 10 quiz', categoria: 'quiz' },
      { id: 'quiz_25', nome: 'Dedicato', icona: '📖', descrizione: 'Completa 25 quiz', categoria: 'quiz' },
      { id: 'quiz_50', nome: 'Esperto', icona: '🎓', descrizione: 'Completa 50 quiz', categoria: 'quiz' },
      { id: 'quiz_100', nome: 'Maestro', icona: '👑', descrizione: 'Completa 100 quiz', categoria: 'quiz' },
      { id: 'quiz_250', nome: 'Professore', icona: '🧑‍🏫', descrizione: 'Completa 250 quiz', categoria: 'quiz' },
      { id: 'quiz_500', nome: 'Accademico', icona: '🏛️', descrizione: 'Completa 500 quiz', categoria: 'quiz' },
      { id: 'quiz_1000', nome: 'Leggenda Quiz', icona: '⭐', descrizione: 'Completa 1000 quiz', categoria: 'quiz' },
      { id: 'perfect_1', nome: 'Perfezionista', icona: '💎', descrizione: 'Quiz con 100% corretto', categoria: 'quiz' },
      { id: 'perfect_5', nome: 'Precisione', icona: '🎯', descrizione: '5 quiz perfetti', categoria: 'quiz' },
      { id: 'perfect_10', nome: 'Infallibile', icona: '💯', descrizione: '10 quiz perfetti', categoria: 'quiz' },
      { id: 'perfect_25', nome: 'Genio', icona: '🧠', descrizione: '25 quiz perfetti', categoria: 'quiz' },
      { id: 'speed_demon', nome: 'Velocista', icona: '⚡', descrizione: 'Quiz in meno di 1 minuto', categoria: 'quiz' },
      { id: 'marathon', nome: 'Maratoneta', icona: '🏃', descrizione: '10 quiz di fila', categoria: 'quiz' },

      // === FLASHCARD BADGES (12) ===
      { id: 'flash_1', nome: 'Prima Flashcard', icona: '🃏', descrizione: 'Completa la prima flashcard', categoria: 'flashcard' },
      { id: 'flash_10', nome: 'Memoria Attiva', icona: '💭', descrizione: '10 flashcards completate', categoria: 'flashcard' },
      { id: 'flash_25', nome: 'Ripetizione', icona: '🔄', descrizione: '25 flashcards completate', categoria: 'flashcard' },
      { id: 'flash_50', nome: 'Memoria Flash', icona: '⚡', descrizione: '50 flashcards completate', categoria: 'flashcard' },
      { id: 'flash_100', nome: 'Memoria d\'Acciaio', icona: '🦾', descrizione: '100 flashcards completate', categoria: 'flashcard' },
      { id: 'flash_250', nome: 'Enciclopedia', icona: '📖', descrizione: '250 flashcards completate', categoria: 'flashcard' },
      { id: 'flash_500', nome: 'Biblioteca Vivente', icona: '📚', descrizione: '500 flashcards completate', categoria: 'flashcard' },
      { id: 'flash_1000', nome: 'Mente Suprema', icona: '🌟', descrizione: '1000 flashcards completate', categoria: 'flashcard' },
      { id: 'flash_streak_10', nome: 'Serie Vincente', icona: '🔥', descrizione: '10 flashcards corrette di fila', categoria: 'flashcard' },
      { id: 'flash_streak_25', nome: 'Inarrestabile', icona: '💪', descrizione: '25 flashcards corrette di fila', categoria: 'flashcard' },
      { id: 'flash_master', nome: 'Maestro Flashcard', icona: '🎴', descrizione: 'Padroneggia tutte le flashcard di una materia', categoria: 'flashcard' },
      { id: 'flash_speed', nome: 'Riflessi Rapidi', icona: '⏱️', descrizione: '20 flashcards in 5 minuti', categoria: 'flashcard' },

      // === STREAK BADGES (10) ===
      { id: 'streak_3', nome: 'Costante', icona: '🔥', descrizione: '3 giorni di streak', categoria: 'streak' },
      { id: 'streak_7', nome: 'Settimana Perfetta', icona: '📅', descrizione: '7 giorni di streak', categoria: 'streak' },
      { id: 'streak_14', nome: 'Due Settimane', icona: '🗓️', descrizione: '14 giorni di streak', categoria: 'streak' },
      { id: 'streak_30', nome: 'Mese d\'Oro', icona: '🏅', descrizione: '30 giorni di streak', categoria: 'streak' },
      { id: 'streak_60', nome: 'Instancabile', icona: '💪', descrizione: '60 giorni di streak', categoria: 'streak' },
      { id: 'streak_90', nome: 'Trimestre', icona: '🎖️', descrizione: '90 giorni di streak', categoria: 'streak' },
      { id: 'streak_180', nome: 'Semestre', icona: '🏆', descrizione: '180 giorni di streak', categoria: 'streak' },
      { id: 'streak_365', nome: 'Anno Perfetto', icona: '👑', descrizione: '365 giorni di streak', categoria: 'streak' },
      { id: 'streak_comeback', nome: 'Ritorno', icona: '🔙', descrizione: 'Riprendi dopo 7 giorni di pausa', categoria: 'streak' },
      { id: 'streak_weekend', nome: 'Weekend Warrior', icona: '🎮', descrizione: 'Studia ogni weekend per un mese', categoria: 'streak' },

      // === XP BADGES (12) ===
      { id: 'xp_100', nome: 'Primi Passi', icona: '👣', descrizione: 'Raggiungi 100 XP', categoria: 'xp' },
      { id: 'xp_250', nome: 'In Crescita', icona: '🌱', descrizione: 'Raggiungi 250 XP', categoria: 'xp' },
      { id: 'xp_500', nome: 'Collezionista', icona: '✨', descrizione: 'Raggiungi 500 XP', categoria: 'xp' },
      { id: 'xp_1000', nome: 'Mille Punti', icona: '🌟', descrizione: 'Raggiungi 1000 XP', categoria: 'xp' },
      { id: 'xp_2500', nome: 'Veterano', icona: '🎖️', descrizione: 'Raggiungi 2500 XP', categoria: 'xp' },
      { id: 'xp_5000', nome: 'Elite', icona: '💎', descrizione: 'Raggiungi 5000 XP', categoria: 'xp' },
      { id: 'xp_10000', nome: 'Leggenda', icona: '🏆', descrizione: 'Raggiungi 10000 XP', categoria: 'xp' },
      { id: 'xp_25000', nome: 'Immortale', icona: '⚜️', descrizione: 'Raggiungi 25000 XP', categoria: 'xp' },
      { id: 'xp_50000', nome: 'Divinità', icona: '👑', descrizione: 'Raggiungi 50000 XP', categoria: 'xp' },
      { id: 'xp_daily_100', nome: 'Giornata Produttiva', icona: '☀️', descrizione: '100 XP in un giorno', categoria: 'xp' },
      { id: 'xp_daily_250', nome: 'Super Giornata', icona: '🌞', descrizione: '250 XP in un giorno', categoria: 'xp' },
      { id: 'xp_daily_500', nome: 'Giornata Epica', icona: '🔥', descrizione: '500 XP in un giorno', categoria: 'xp' },

      // === MATERIE BADGES (15) ===
      { id: 'materia_italiano', nome: 'Dante', icona: '📜', descrizione: 'Livello 10 in Italiano', categoria: 'materia' },
      { id: 'materia_storia', nome: 'Storico', icona: '🏛️', descrizione: 'Livello 10 in Storia', categoria: 'materia' },
      { id: 'materia_filosofia', nome: 'Filosofo', icona: '🤔', descrizione: 'Livello 10 in Filosofia', categoria: 'materia' },
      { id: 'materia_matematica', nome: 'Matematico', icona: '🔢', descrizione: 'Livello 10 in Matematica', categoria: 'materia' },
      { id: 'materia_fisica', nome: 'Fisico', icona: '⚛️', descrizione: 'Livello 10 in Fisica', categoria: 'materia' },
      { id: 'materia_scienze', nome: 'Scienziato', icona: '🔬', descrizione: 'Livello 10 in Scienze', categoria: 'materia' },
      { id: 'materia_latino', nome: 'Latinista', icona: '🏺', descrizione: 'Livello 10 in Latino', categoria: 'materia' },
      { id: 'materia_arte', nome: 'Artista', icona: '🎨', descrizione: 'Livello 10 in Arte', categoria: 'materia' },
      { id: 'materia_inglese', nome: 'Poliglotta', icona: '🌍', descrizione: 'Livello 10 in Inglese', categoria: 'materia' },
      { id: 'materia_religione', nome: 'Teologo', icona: '✝️', descrizione: 'Livello 10 in Religione', categoria: 'materia' },
      { id: 'multi_3', nome: 'Versatile', icona: '🎭', descrizione: 'Studia 3 materie diverse', categoria: 'materia' },
      { id: 'multi_5', nome: 'Tuttologia', icona: '🌈', descrizione: 'Studia 5 materie diverse', categoria: 'materia' },
      { id: 'multi_all', nome: 'Enciclopedico', icona: '📚', descrizione: 'Studia tutte le 10 materie', categoria: 'materia' },
      { id: 'specialist', nome: 'Specialista', icona: '🎯', descrizione: 'Livello 20 in una materia', categoria: 'materia' },
      { id: 'polymath', nome: 'Genio Universale', icona: '🧠', descrizione: 'Livello 10 in 5 materie', categoria: 'materia' },

      // === TEMPO BADGES (8) ===
      { id: 'early_bird', nome: 'Mattiniero', icona: '🐦', descrizione: 'Studia alle 6 del mattino', categoria: 'tempo' },
      { id: 'night_owl', nome: 'Gufo Notturno', icona: '🦉', descrizione: 'Studia dopo mezzanotte', categoria: 'tempo' },
      { id: 'lunch_learner', nome: 'Pausa Studio', icona: '🥪', descrizione: 'Studia durante la pausa pranzo', categoria: 'tempo' },
      { id: 'weekend_warrior', nome: 'Guerriero Weekend', icona: '⚔️', descrizione: 'Studia nel weekend', categoria: 'tempo' },
      { id: 'study_hour', nome: 'Ora di Studio', icona: '⏰', descrizione: '1 ora di studio continuo', categoria: 'tempo' },
      { id: 'study_2hours', nome: 'Sessione Intensa', icona: '⏱️', descrizione: '2 ore di studio continuo', categoria: 'tempo' },
      { id: 'study_3hours', nome: 'Maratona', icona: '🏃', descrizione: '3 ore di studio continuo', categoria: 'tempo' },
      { id: 'consistent', nome: 'Costanza', icona: '📊', descrizione: 'Studia alla stessa ora per 7 giorni', categoria: 'tempo' },

      // === SOCIAL/SPECIALI (8) ===
      { id: 'first_day', nome: 'Benvenuto', icona: '👋', descrizione: 'Primo giorno su ImparaFacile', categoria: 'speciale' },
      { id: 'profile_complete', nome: 'Profilo Completo', icona: '✅', descrizione: 'Completa il tuo profilo', categoria: 'speciale' },
      { id: 'share_result', nome: 'Condivisione', icona: '📤', descrizione: 'Condividi un risultato', categoria: 'speciale' },
      { id: 'invite_friend', nome: 'Ambasciatore', icona: '🤝', descrizione: 'Invita un amico', categoria: 'speciale' },
      { id: 'feedback', nome: 'Voce Attiva', icona: '💬', descrizione: 'Lascia un feedback', categoria: 'speciale' },
      { id: 'beta_tester', nome: 'Beta Tester', icona: '🧪', descrizione: 'Utente della versione beta', categoria: 'speciale' },
      { id: 'og_user', nome: 'OG User', icona: '🏅', descrizione: 'Tra i primi 100 utenti', categoria: 'speciale' },
      { id: 'anniversary', nome: 'Anniversario', icona: '🎂', descrizione: '1 anno su ImparaFacile', categoria: 'speciale' }
    ];
  }

  getProfiloUtente(userId) {
    if (!this.utenti[userId]) {
      this.utenti[userId] = {
        xpTotale: 0,
        quizCompletati: 0,
        flashcardsViste: 0,
        streak: 0,
        recordStreak: 0,
        accuratezzaMedia: 0,
        risposteCorrette: 0,
        risposteTotali: 0,
        livelloPerMateria: {},
        badges: [],
        attivitaRecenti: [],
        progressoSettimanale: this.initProgressoSettimanale(),
        ultimaAttivita: Date.now()
      };
    }
    return this.utenti[userId];
  }
  
  initProgressoSettimanale() {
    const giorni = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    const oggi = new Date().getDay();
    return giorni.map((g, i) => ({
      giorno: g,
      quiz: 0,
      xp: 0,
      isOggi: i === oggi
    }));
  }
  
  aggiornaProgressoSettimanale(profilo, xp) {
    if (!profilo.progressoSettimanale) {
      profilo.progressoSettimanale = this.initProgressoSettimanale();
    }
    const oggi = new Date().getDay();
    profilo.progressoSettimanale[oggi].xp += xp;
    profilo.progressoSettimanale[oggi].quiz += 1;
  }
  
  getAttivitaRecenti(userId) {
    const profilo = this.getProfiloUtente(userId);
    return profilo.attivitaRecenti || [];
  }
  
  getBadges(userId) {
    const profilo = this.getProfiloUtente(userId);
    return this.badgesDisponibili.map(b => ({
      ...b,
      sbloccato: profilo.badges.includes(b.id)
    }));
  }
  
  aggiungiAttivita(profilo, tipo, materia, dettaglio, xp, titoloRiassunto = null) {
    if (!profilo.attivitaRecenti) {
      profilo.attivitaRecenti = [];
    }
    
    // Formatta il titolo in base al tipo
    let titolo;
    if (tipo === 'flashcard') {
      titolo = 'Flashcards';
    } else if (tipo === 'quiz') {
      titolo = 'Quiz';
    } else if (tipo === 'studio' && titoloRiassunto) {
      titolo = titoloRiassunto;
    } else {
      titolo = materia.charAt(0).toUpperCase() + materia.slice(1);
    }
    
    profilo.attivitaRecenti.unshift({
      id: Date.now(),
      tipo,
      titolo,
      materia,
      dettaglio,
      xp,
      timestamp: Date.now()
    });
    
    // Mantieni solo le ultime 20 attività
    if (profilo.attivitaRecenti.length > 20) {
      profilo.attivitaRecenti = profilo.attivitaRecenti.slice(0, 20);
    }
  }
  
  verificaBadges(profilo) {
    const nuoviBadges = [];
    const sblocca = (id) => {
      if (!profilo.badges.includes(id)) {
        profilo.badges.push(id);
        nuoviBadges.push(id);
      }
    };
    
    // === QUIZ BADGES ===
    if (profilo.quizCompletati >= 1) sblocca('first_quiz');
    if (profilo.quizCompletati >= 5) sblocca('quiz_5');
    if (profilo.quizCompletati >= 10) sblocca('quiz_10');
    if (profilo.quizCompletati >= 25) sblocca('quiz_25');
    if (profilo.quizCompletati >= 50) sblocca('quiz_50');
    if (profilo.quizCompletati >= 100) sblocca('quiz_100');
    if (profilo.quizCompletati >= 250) sblocca('quiz_250');
    if (profilo.quizCompletati >= 500) sblocca('quiz_500');
    if (profilo.quizCompletati >= 1000) sblocca('quiz_1000');
    if (profilo.quizPerfetti >= 1) sblocca('perfect_1');
    if (profilo.quizPerfetti >= 5) sblocca('perfect_5');
    if (profilo.quizPerfetti >= 10) sblocca('perfect_10');
    if (profilo.quizPerfetti >= 25) sblocca('perfect_25');
    
    // === FLASHCARD BADGES ===
    if (profilo.flashcardsViste >= 1) sblocca('flash_1');
    if (profilo.flashcardsViste >= 10) sblocca('flash_10');
    if (profilo.flashcardsViste >= 25) sblocca('flash_25');
    if (profilo.flashcardsViste >= 50) sblocca('flash_50');
    if (profilo.flashcardsViste >= 100) sblocca('flash_100');
    if (profilo.flashcardsViste >= 250) sblocca('flash_250');
    if (profilo.flashcardsViste >= 500) sblocca('flash_500');
    if (profilo.flashcardsViste >= 1000) sblocca('flash_1000');
    
    // === STREAK BADGES ===
    if (profilo.streak >= 3) sblocca('streak_3');
    if (profilo.streak >= 7) sblocca('streak_7');
    if (profilo.streak >= 14) sblocca('streak_14');
    if (profilo.streak >= 30) sblocca('streak_30');
    if (profilo.streak >= 60) sblocca('streak_60');
    if (profilo.streak >= 90) sblocca('streak_90');
    if (profilo.streak >= 180) sblocca('streak_180');
    if (profilo.streak >= 365) sblocca('streak_365');
    
    // === XP BADGES ===
    if (profilo.xpTotale >= 100) sblocca('xp_100');
    if (profilo.xpTotale >= 250) sblocca('xp_250');
    if (profilo.xpTotale >= 500) sblocca('xp_500');
    if (profilo.xpTotale >= 1000) sblocca('xp_1000');
    if (profilo.xpTotale >= 2500) sblocca('xp_2500');
    if (profilo.xpTotale >= 5000) sblocca('xp_5000');
    if (profilo.xpTotale >= 10000) sblocca('xp_10000');
    if (profilo.xpTotale >= 25000) sblocca('xp_25000');
    if (profilo.xpTotale >= 50000) sblocca('xp_50000');
    
    // === MATERIE BADGES ===
    const materieStudiate = Object.keys(profilo.livelloPerMateria).length;
    if (materieStudiate >= 3) sblocca('multi_3');
    if (materieStudiate >= 5) sblocca('multi_5');
    if (materieStudiate >= 10) sblocca('multi_all');
    
    // Badges per materia specifica (livello 10)
    const materie = ['italiano', 'storia', 'filosofia', 'matematica', 'fisica', 'scienze', 'latino', 'arte', 'inglese', 'religione'];
    materie.forEach(m => {
      if ((profilo.livelloPerMateria[m] || 0) >= 10) {
        sblocca(`materia_${m}`);
      }
    });
    
    // Specialista (livello 20 in una materia)
    if (Object.values(profilo.livelloPerMateria).some(l => l >= 20)) sblocca('specialist');
    
    // Polymath (livello 10 in 5 materie)
    const materieAlte = Object.values(profilo.livelloPerMateria).filter(l => l >= 10).length;
    if (materieAlte >= 5) sblocca('polymath');
    
    // === TEMPO BADGES ===
    const ora = new Date().getHours();
    if (ora >= 0 && ora < 5) sblocca('night_owl');
    if (ora >= 5 && ora < 7) sblocca('early_bird');
    if (ora >= 12 && ora < 14) sblocca('lunch_learner');
    const giorno = new Date().getDay();
    if (giorno === 0 || giorno === 6) sblocca('weekend_warrior');
    
    // === SPECIALI ===
    sblocca('first_day'); // Primo giorno sempre sbloccato
    
    return nuoviBadges;
  }

  completaQuiz(userId, materia, corretto, xpGuadagnati = 10) {
    const profilo = this.getProfiloUtente(userId);
    
    profilo.quizCompletati++;
    profilo.risposteTotali++;
    
    if (corretto) {
      profilo.risposteCorrette++;
      profilo.xpTotale += xpGuadagnati;
    } else {
      profilo.xpTotale += Math.floor(xpGuadagnati * 0.2); // XP parziali
    }
    
    // Aggiorna accuratezza
    profilo.accuratezzaMedia = Math.round((profilo.risposteCorrette / profilo.risposteTotali) * 100);
    
    // Aggiorna livello materia
    if (!profilo.livelloPerMateria[materia]) {
      profilo.livelloPerMateria[materia] = 0;
    }
    profilo.livelloPerMateria[materia] += corretto ? 1 : 0.2;
    
    // Aggiorna streak
    this.aggiornaStreak(profilo);
    
    // Registra attività
    const xpEffettivi = corretto ? xpGuadagnati : Math.floor(xpGuadagnati * 0.2);
    this.aggiungiAttivita(profilo, 'quiz', materia, corretto ? 'Risposta corretta' : 'Risposta sbagliata', xpEffettivi);
    
    // Aggiorna progresso settimanale
    this.aggiornaProgressoSettimanale(profilo, xpEffettivi);
    
    // Verifica nuovi badges
    this.verificaBadges(profilo);
    
    console.log(`🎮 Quiz completato: ${userId} +${xpEffettivi} XP (totale: ${profilo.xpTotale})`);
    
    return {
      xpGuadagnati: xpEffettivi,
      xpTotale: profilo.xpTotale,
      corretto
    };
  }

  vedaFlashcard(userId, materia) {
    const profilo = this.getProfiloUtente(userId);
    
    profilo.flashcardsViste++;
    profilo.xpTotale += 10;
    
    // Aggiorna livello materia
    if (!profilo.livelloPerMateria[materia]) {
      profilo.livelloPerMateria[materia] = 0;
    }
    profilo.livelloPerMateria[materia] += 0.5;
    
    // Aggiorna streak
    this.aggiornaStreak(profilo);
    
    // Registra attività
    this.aggiungiAttivita(profilo, 'flashcard', materia, 'Flashcard completata', 10);
    
    // Aggiorna progresso settimanale
    this.aggiornaProgressoSettimanale(profilo, 10);
    
    // Verifica nuovi badges
    this.verificaBadges(profilo);
    
    console.log(`🎮 Flashcard vista: ${userId} +10 XP (totale: ${profilo.xpTotale})`);
    
    return {
      xpGuadagnati: 10,
      xpTotale: profilo.xpTotale
    };
  }

  leggiRiassunto(userId, materia, tempoMinuti, titoloRiassunto = null) {
    const profilo = this.getProfiloUtente(userId);
    
    const xp = Math.floor(tempoMinuti * 5); // 5 XP per minuto
    profilo.xpTotale += xp;
    
    // Aggiorna livello materia
    if (!profilo.livelloPerMateria[materia]) {
      profilo.livelloPerMateria[materia] = 0;
    }
    profilo.livelloPerMateria[materia] += tempoMinuti * 0.1;
    
    // Aggiorna streak
    this.aggiornaStreak(profilo);
    
    // Registra attività con titolo riassunto
    this.aggiungiAttivita(profilo, 'studio', materia, `${Math.round(tempoMinuti)} min di lettura`, xp, titoloRiassunto);
    
    // Verifica nuovi badges
    this.verificaBadges(profilo);
    
    console.log(`🎮 Riassunto letto: ${userId} +${xp} XP (${titoloRiassunto || materia})`);
    
    return {
      xpGuadagnati: xp,
      xpTotale: profilo.xpTotale
    };
  }

  aggiornaStreak(profilo) {
    const oggi = new Date().toDateString();
    const ultimaData = profilo.ultimaAttivita ? new Date(profilo.ultimaAttivita).toDateString() : null;
    
    if (ultimaData !== oggi) {
      const ieri = new Date(Date.now() - 86400000).toDateString();
      if (ultimaData === ieri) {
        profilo.streak++;
      } else if (ultimaData !== oggi) {
        profilo.streak = 1;
      }
      
      if (profilo.streak > profilo.recordStreak) {
        profilo.recordStreak = profilo.streak;
      }
    }
    
    profilo.ultimaAttivita = Date.now();
  }
}

module.exports = GamificationService;
