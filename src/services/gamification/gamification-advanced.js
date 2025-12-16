/**
 * 🎮 GAMIFICATION ADVANCED - Sistema Gamification Superiore
 * Più addictive di TikTok, più educativo di Duolingo
 * 
 * Features:
 * - Daily Quests & Challenges
 * - Battle Mode 1v1 real-time
 * - Clan Wars (gruppi vs gruppi)
 * - Season Pass con ricompense
 * - Avatar customization
 * - Power-ups e boost
 * - Achievements multi-livello
 * - Leaderboard dinamiche
 */

class AdvancedGamification {
  constructor() {
    // ==================== SISTEMI CORE ====================
    
    // 🎯 Daily Quests System
    this.dailyQuests = {
      facili: [
        { id: 'daily_1', nome: 'Prima Vittoria', desc: 'Completa 1 quiz', xp: 10, gems: 1 },
        { id: 'daily_2', nome: 'Studioso', desc: 'Studia per 10 minuti', xp: 15, gems: 2 },
        { id: 'daily_3', nome: 'Preciso', desc: '3 risposte corrette di fila', xp: 20, gems: 2 }
      ],
      medie: [
        { id: 'daily_4', nome: 'Maratoneta', desc: 'Completa 5 quiz', xp: 50, gems: 5 },
        { id: 'daily_5', nome: 'Perfezionista', desc: '100% in un quiz', xp: 30, gems: 3 },
        { id: 'daily_6', nome: 'Velocista', desc: 'Quiz in meno di 2 min', xp: 25, gems: 3 }
      ],
      difficili: [
        { id: 'daily_7', nome: 'Campione', desc: 'Vinci 3 battle', xp: 100, gems: 10 },
        { id: 'daily_8', nome: 'Maestro', desc: 'Aiuta 3 compagni', xp: 75, gems: 8 },
        { id: 'daily_9', nome: 'Leggenda', desc: 'Top 10 classifica', xp: 150, gems: 15 }
      ]
    };

    // ⚔️ Battle System
    this.battleSystem = {
      modalita: {
        QUICK: { nome: 'Battle Veloce', domande: 5, tempo: 60 },
        CLASSIC: { nome: 'Battle Classica', domande: 10, tempo: 300 },
        DEATH_MATCH: { nome: 'Death Match', domande: 20, tempo: 600 },
        BLITZ: { nome: 'Blitz', domande: 3, tempo: 30 }
      },
      powerUps: {
        FREEZE: { nome: 'Congela', desc: 'Blocca avversario 5 sec', costo: 3 },
        HINT: { nome: 'Suggerimento', desc: '50% opzioni eliminate', costo: 2 },
        SHIELD: { nome: 'Scudo', desc: 'Proteggi da freeze', costo: 2 },
        DOUBLE: { nome: 'Doppio XP', desc: 'XP x2 per 1 domanda', costo: 4 },
        SKIP: { nome: 'Salta', desc: 'Salta domanda difficile', costo: 5 }
      }
    };

    // 👥 Clan System
    this.clanSystem = {
      ranghi: ['Recluta', 'Soldato', 'Capitano', 'Generale', 'Leader'],
      benefici: {
        XP_BOOST: 1.1,      // +10% XP
        GEMS_BOOST: 1.05,   // +5% gems
        QUEST_EXTRA: 1      // +1 quest giornaliera
      },
      guerre: {
        durata: 7 * 24 * 60 * 60 * 1000, // 1 settimana
        fasi: ['Preparazione', 'Battaglia', 'Risultati'],
        ricompense: {
          primo: { xp: 5000, gems: 500, titolo: 'Clan Vittorioso' },
          secondo: { xp: 3000, gems: 300, titolo: 'Clan d\'Onore' },
          terzo: { xp: 1500, gems: 150, titolo: 'Clan Valoroso' }
        }
      }
    };

    // 🎖️ Season Pass
    this.seasonPass = {
      livelli: 100,
      xpPerLivello: 1000,
      durata: 30 * 24 * 60 * 60 * 1000, // 30 giorni
      prezzi: {
        pass: 9.99,
        passPlus: 19.99 // Include 25 livelli
      }
    };
    
    // Genera ricompense DOPO aver definito seasonPass
    this.seasonPass.ricompense = {
      free: this.generateSeasonRewards('free'),
      premium: this.generateSeasonRewards('premium')
    };

    // 👤 Avatar System
    this.avatarSystem = {
      parti: {
        CAPELLI: ['corto', 'lungo', 'riccio', 'mohawk', 'calvo'],
        FACCIA: ['tondo', 'ovale', 'quadrato', 'cuore'],
        OCCHI: ['marroni', 'blu', 'verdi', 'grigi', 'neri'],
        OUTFIT: ['casual', 'formale', 'sportivo', 'fantasy', 'cyber'],
        ACCESSORI: ['occhiali', 'cappello', 'cuffie', 'corona', 'maschera']
      },
      rarita: {
        COMUNE: { moltiplicatore: 1, colore: '#808080' },
        RARO: { moltiplicatore: 1.5, colore: '#4169E1' },
        EPICO: { moltiplicatore: 2, colore: '#9400D3' },
        LEGGENDARIO: { moltiplicatore: 3, colore: '#FFD700' },
        MITICO: { moltiplicatore: 5, colore: '#FF1493' }
      }
    };

    // 🏆 Achievement System Avanzato
    this.achievements = {
      categorie: {
        STUDIO: this.generateStudyAchievements(),
        BATTAGLIA: this.generateBattleAchievements(),
        SOCIALE: this.generateSocialAchievements(),
        COLLEZIONE: this.generateCollectionAchievements(),
        SEGRETI: this.generateSecretAchievements()
      }
    };

    // 📊 Leaderboard System
    this.leaderboards = {
      globale: new Map(),      // Tutti gli utenti
      nazionale: new Map(),    // Per paese
      regionale: new Map(),    // Per regione
      scuola: new Map(),       // Per scuola
      amici: new Map(),        // Solo amici
      materia: new Map()       // Per materia specifica
    };

    // 💰 Economia virtuale
    this.economia = {
      valute: {
        XP: 'Punti Esperienza',
        GEMS: 'Gemme Premium',
        COINS: 'Monete Oro',
        TICKETS: 'Biglietti Battle'
      },
      shop: {
        powerups: this.generateShopItems('powerups'),
        avatar: this.generateShopItems('avatar'),
        boost: this.generateShopItems('boost'),
        speciali: this.generateShopItems('speciali')
      }
    };

    // 🎰 Reward System
    this.rewardSystem = {
      loginBonus: this.generateLoginBonus(),
      milestones: this.generateMilestones(),
      lootBoxes: this.generateLootBoxes()
    };

    console.log('🎮 Advanced Gamification System inizializzato');
  }

  // ==================== DAILY QUESTS ====================

  /**
   * 🎯 Ottieni quest giornaliere per utente
   */
  getDailyQuests(userId) {
    const oggi = new Date().toDateString();
    const seed = this.hashCode(`${userId}-${oggi}`);
    
    // Seleziona 3 quest casuali ma deterministiche
    const quests = [];
    quests.push(this.dailyQuests.facili[seed % this.dailyQuests.facili.length]);
    quests.push(this.dailyQuests.medie[(seed * 7) % this.dailyQuests.medie.length]);
    quests.push(this.dailyQuests.difficili[(seed * 13) % this.dailyQuests.difficili.length]);

    return {
      data: oggi,
      quests,
      bonusCompleto: { xp: 100, gems: 10 }, // Se completi tutte
      scadenza: new Date().setHours(23, 59, 59, 999)
    };
  }

  /**
   * ✅ Completa una quest
   */
  completaQuest(userId, questId, progresso = {}) {
    const ricompense = {
      xp: 0,
      gems: 0,
      items: []
    };

    const quest = this.trovaQuest(questId);
    if (!quest) return null;

    // Verifica completamento
    if (this.verificaCompletamento(quest, progresso)) {
      ricompense.xp = quest.xp;
      ricompense.gems = quest.gems;
      
      // Bonus casuali
      if (Math.random() < 0.1) {
        ricompense.items.push(this.generaItemCasuale());
      }
    }

    return ricompense;
  }

  // ==================== BATTLE MODE ====================

  /**
   * ⚔️ Inizia battle 1v1
   */
  iniziaBattle(player1Id, player2Id, modalita = 'QUICK') {
    const battleId = this.generateBattleId();
    const config = this.battleSystem.modalita[modalita];

    const battle = {
      id: battleId,
      players: {
        [player1Id]: {
          id: player1Id,
          score: 0,
          risposte: [],
          powerUpsUsati: [],
          tempo: 0
        },
        [player2Id]: {
          id: player2Id,
          score: 0,
          risposte: [],
          powerUpsUsati: [],
          tempo: 0
        }
      },
      modalita: config,
      stato: 'IN_CORSO',
      inizioTimestamp: Date.now(),
      domandaCorrente: 0,
      vincitore: null
    };

    return battle;
  }

  /**
   * 💥 Usa power-up in battaglia
   */
  usaPowerUp(battleId, playerId, powerUpType) {
    const powerUp = this.battleSystem.powerUps[powerUpType];
    if (!powerUp) return { success: false, error: 'Power-up non valido' };

    // Applica effetto
    const effetto = {
      tipo: powerUpType,
      applicatoA: playerId,
      timestamp: Date.now(),
      durata: powerUp.durata || 0
    };

    // Effetti specifici
    switch (powerUpType) {
      case 'FREEZE':
        effetto.target = 'avversario';
        effetto.azione = 'blocca_input';
        break;
      case 'HINT':
        effetto.azione = 'elimina_opzioni';
        break;
      case 'DOUBLE':
        effetto.moltiplicatore = 2;
        break;
    }

    return { success: true, effetto };
  }

  // ==================== CLAN SYSTEM ====================

  /**
   * 👥 Crea nuovo clan
   */
  creaClan(leaderId, nome, descrizione, emblema) {
    const clanId = this.generateClanId();
    
    const clan = {
      id: clanId,
      nome,
      descrizione,
      emblema,
      leaderId,
      membri: [leaderId],
      livello: 1,
      xp: 0,
      trofei: 0,
      ranghi: new Map([[leaderId, 'Leader']]),
      guerra: null,
      creatoIl: Date.now()
    };

    return clan;
  }

  /**
   * ⚔️ Inizia guerra tra clan
   */
  iniziaGuerraClan(clan1Id, clan2Id) {
    const guerra = {
      id: this.generateWarId(),
      clan1: clan1Id,
      clan2: clan2Id,
      punteggi: {
        [clan1Id]: 0,
        [clan2Id]: 0
      },
      fase: 'Preparazione',
      inizioTimestamp: Date.now(),
      fineTimestamp: Date.now() + this.clanSystem.guerre.durata,
      battaglie: [],
      vincitore: null
    };

    return guerra;
  }

  // ==================== SEASON PASS ====================

  /**
   * 🎖️ Genera ricompense stagione
   */
  generateSeasonRewards(tier) {
    const rewards = [];
    const isPremium = tier === 'premium';
    
    for (let livello = 1; livello <= this.seasonPass.livelli; livello++) {
      const reward = {
        livello,
        items: []
      };

      // Ogni 5 livelli ricompensa maggiore
      if (livello % 5 === 0) {
        reward.items.push({
          tipo: 'gems',
          quantita: isPremium ? livello * 10 : livello * 2
        });
      }

      // Ogni 10 livelli item esclusivo
      if (livello % 10 === 0) {
        reward.items.push({
          tipo: 'avatar_item',
          rarita: livello < 50 ? 'RARO' : livello < 80 ? 'EPICO' : 'LEGGENDARIO',
          nome: `Season ${livello} Special`
        });
      }

      // Premium extras
      if (isPremium) {
        reward.items.push({
          tipo: 'xp_boost',
          durata: 3600000, // 1 ora
          moltiplicatore: 1.5
        });
      }

      rewards.push(reward);
    }

    return rewards;
  }

  /**
   * 📈 Progresso season pass
   */
  aggiornaProgressoSeason(userId, xpGuadagnati) {
    const livelloAttuale = Math.floor(xpGuadagnati / this.seasonPass.xpPerLivello);
    const xpNelLivello = xpGuadagnati % this.seasonPass.xpPerLivello;
    const percentuale = (xpNelLivello / this.seasonPass.xpPerLivello) * 100;

    const ricompense = [];
    
    // Controlla ricompense sbloccate
    for (let i = 1; i <= livelloAttuale; i++) {
      ricompense.push(...this.seasonPass.ricompense.free[i - 1]?.items || []);
    }

    return {
      livello: livelloAttuale,
      xpNelLivello,
      percentuale,
      prossimLivello: livelloAttuale + 1,
      xpMancanti: this.seasonPass.xpPerLivello - xpNelLivello,
      ricompense
    };
  }

  // ==================== AVATAR SYSTEM ====================

  /**
   * 👤 Genera avatar casuale
   */
  generaAvatarCasuale() {
    const avatar = {};
    
    for (const [parte, opzioni] of Object.entries(this.avatarSystem.parti)) {
      avatar[parte] = opzioni[Math.floor(Math.random() * opzioni.length)];
    }

    // Assegna rarità casuali
    avatar.rarita = this.calcolaRaritaAvatar(avatar);
    
    return avatar;
  }

  /**
   * 💎 Calcola rarità avatar
   */
  calcolaRaritaAvatar(avatar) {
    const random = Math.random();
    
    if (random < 0.6) return 'COMUNE';
    if (random < 0.85) return 'RARO';
    if (random < 0.95) return 'EPICO';
    if (random < 0.99) return 'LEGGENDARIO';
    return 'MITICO';
  }

  // ==================== ACHIEVEMENTS ====================

  /**
   * 🏆 Genera achievement studio
   */
  generateStudyAchievements() {
    return [
      { id: 'first_quiz', nome: 'Prima Volta', desc: 'Completa il tuo primo quiz', xp: 10, icon: '🎯' },
      { id: 'streak_7', nome: 'Una Settimana', desc: '7 giorni di streak', xp: 50, icon: '🔥' },
      { id: 'streak_30', nome: 'Un Mese', desc: '30 giorni di streak', xp: 200, icon: '💎' },
      { id: 'perfect_10', nome: 'Perfezionista', desc: '10 quiz al 100%', xp: 100, icon: '💯' },
      { id: 'speed_demon', nome: 'Velocista', desc: 'Quiz in < 30 secondi', xp: 75, icon: '⚡' },
      { id: 'night_owl', nome: 'Nottambulo', desc: 'Studia dopo mezzanotte', xp: 30, icon: '🦉' },
      { id: 'early_bird', nome: 'Mattiniero', desc: 'Studia prima delle 6', xp: 30, icon: '🐦' },
      { id: 'knowledge_master', nome: 'Maestro', desc: '1000 risposte corrette', xp: 500, icon: '🎓' }
    ];
  }

  /**
   * ⚔️ Genera achievement battaglia
   */
  generateBattleAchievements() {
    return [
      { id: 'first_blood', nome: 'Primo Sangue', desc: 'Vinci prima battaglia', xp: 20, icon: '⚔️' },
      { id: 'winning_streak', nome: 'Inarrestabile', desc: '5 vittorie di fila', xp: 100, icon: '🏆' },
      { id: 'comeback_kid', nome: 'Rimonta', desc: 'Vinci da svantaggio', xp: 150, icon: '🔄' },
      { id: 'david_goliath', nome: 'Davide', desc: 'Batti giocatore 10+ livelli sopra', xp: 200, icon: '🗿' },
      { id: 'flawless', nome: 'Perfetto', desc: 'Vinci senza errori', xp: 250, icon: '✨' }
    ];
  }

  /**
   * 👥 Genera achievement sociali
   */
  generateSocialAchievements() {
    return [
      { id: 'helper', nome: 'Altruista', desc: 'Aiuta 10 compagni', xp: 50, icon: '🤝' },
      { id: 'popular', nome: 'Popolare', desc: '50 amici', xp: 100, icon: '👥' },
      { id: 'clan_leader', nome: 'Leader', desc: 'Crea un clan', xp: 150, icon: '👑' },
      { id: 'war_hero', nome: 'Eroe di Guerra', desc: 'MVP in guerra clan', xp: 300, icon: '🎖️' }
    ];
  }

  /**
   * 🎁 Genera achievement collezione
   */
  generateCollectionAchievements() {
    return [
      { id: 'collector_10', nome: 'Collezionista', desc: '10 items avatar', xp: 50, icon: '🎨' },
      { id: 'rare_hunter', nome: 'Cacciatore', desc: 'Ottieni item epico', xp: 100, icon: '💜' },
      { id: 'legendary', nome: 'Leggendario', desc: 'Ottieni item leggendario', xp: 500, icon: '🌟' }
    ];
  }

  /**
   * 🔒 Genera achievement segreti
   */
  generateSecretAchievements() {
    return [
      { id: 'secret_1', nome: '???', desc: 'Scoprilo giocando', xp: 1000, icon: '🔒', segreto: true },
      { id: 'easter_egg', nome: 'Uovo di Pasqua', desc: 'Hai trovato il segreto!', xp: 500, icon: '🥚', segreto: true }
    ];
  }

  // ==================== ECONOMIA ====================

  /**
   * 🛍️ Genera item shop
   */
  generateShopItems(categoria) {
    const items = [];
    
    switch (categoria) {
      case 'powerups':
        for (const [key, powerup] of Object.entries(this.battleSystem.powerUps)) {
          items.push({
            id: key,
            nome: powerup.nome,
            desc: powerup.desc,
            prezzo: { gems: powerup.costo * 10 },
            quantita: 5
          });
        }
        break;
        
      case 'boost':
        items.push(
          { id: 'xp_2h', nome: 'XP x2 (2 ore)', prezzo: { gems: 50 }, durata: 7200000 },
          { id: 'xp_24h', nome: 'XP x2 (24 ore)', prezzo: { gems: 200 }, durata: 86400000 },
          { id: 'streak_freeze', nome: 'Congela Streak', prezzo: { gems: 100 }, usi: 1 }
        );
        break;
    }
    
    return items;
  }

  // ==================== REWARD SYSTEM ====================

  /**
   * 🎁 Login bonus progressivi
   */
  generateLoginBonus() {
    return [
      { giorno: 1, ricompensa: { xp: 10, coins: 50 } },
      { giorno: 2, ricompensa: { xp: 20, coins: 75 } },
      { giorno: 3, ricompensa: { xp: 30, coins: 100, gems: 1 } },
      { giorno: 4, ricompensa: { xp: 40, coins: 125 } },
      { giorno: 5, ricompensa: { xp: 50, coins: 150, powerup: 'HINT' } },
      { giorno: 6, ricompensa: { xp: 60, coins: 175 } },
      { giorno: 7, ricompensa: { xp: 100, coins: 250, gems: 5, lootbox: 'BRONZE' } }
    ];
  }

  /**
   * 🏁 Milestone rewards
   */
  generateMilestones() {
    return [
      { tipo: 'quiz', valore: 10, ricompensa: { xp: 100, titolo: 'Studente' } },
      { tipo: 'quiz', valore: 100, ricompensa: { xp: 1000, titolo: 'Studioso', gems: 50 } },
      { tipo: 'quiz', valore: 1000, ricompensa: { xp: 10000, titolo: 'Genio', avatar: 'EPICO' } }
    ];
  }

  /**
   * 🎰 Loot boxes
   */
  generateLootBoxes() {
    return {
      BRONZE: {
        costo: { coins: 500 },
        contenuto: [
          { tipo: 'xp', min: 50, max: 100, probabilita: 0.5 },
          { tipo: 'coins', min: 100, max: 500, probabilita: 0.4 },
          { tipo: 'avatar_item', rarita: 'COMUNE', probabilita: 0.1 }
        ]
      },
      SILVER: {
        costo: { gems: 10 },
        contenuto: [
          { tipo: 'xp', min: 200, max: 500, probabilita: 0.3 },
          { tipo: 'gems', min: 1, max: 5, probabilita: 0.3 },
          { tipo: 'avatar_item', rarita: 'RARO', probabilita: 0.3 },
          { tipo: 'powerup', quantita: 3, probabilita: 0.1 }
        ]
      },
      GOLD: {
        costo: { gems: 50 },
        contenuto: [
          { tipo: 'xp', min: 1000, max: 2000, probabilita: 0.2 },
          { tipo: 'gems', min: 10, max: 25, probabilita: 0.3 },
          { tipo: 'avatar_item', rarita: 'EPICO', probabilita: 0.4 },
          { tipo: 'boost', durata: 86400000, probabilita: 0.1 }
        ]
      }
    };
  }

  // ==================== UTILITY ====================

  /**
   * #️⃣ Hash code per seed deterministico
   */
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * 🔍 Trova quest by ID
   */
  trovaQuest(questId) {
    for (const livello of Object.values(this.dailyQuests)) {
      const quest = livello.find(q => q.id === questId);
      if (quest) return quest;
    }
    return null;
  }

  /**
   * ✅ Verifica completamento quest
   */
  verificaCompletamento(quest, progresso) {
    // Logica semplificata - in prod più complessa
    return progresso[quest.id] === true;
  }

  /**
   * 🎲 Genera item casuale
   */
  generaItemCasuale() {
    const tipi = ['avatar_item', 'powerup', 'boost'];
    const tipo = tipi[Math.floor(Math.random() * tipi.length)];
    
    return {
      tipo,
      nome: `${tipo}_random_${Date.now()}`,
      rarita: this.calcolaRaritaAvatar()
    };
  }

  /**
   * 🆔 Genera ID unici
   */
  generateBattleId() {
    return `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateClanId() {
    return `clan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateWarId() {
    return `war_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = AdvancedGamification;
