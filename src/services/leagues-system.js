/**
 * 🏆 LEAGUES SYSTEM - DIVISIONI COMPETITIVE COME DUOLINGO
 * Bronze → Silver → Gold → Diamond → Master
 */

class LeaguesSystem {
  constructor() {
    this.leagues = [
      { id: 'bronze', name: 'Bronzo', icon: '🥉', color: '#CD7F32', minXP: 0 },
      { id: 'silver', name: 'Argento', icon: '🥈', color: '#C0C0C0', minXP: 100 },
      { id: 'gold', name: 'Oro', icon: '🥇', color: '#FFD700', minXP: 300 },
      { id: 'diamond', name: 'Diamante', icon: '💎', color: '#B9F2FF', minXP: 600 },
      { id: 'master', name: 'Master', icon: '👑', color: '#FF6B6B', minXP: 1000 }
    ];
    
    this.leagueSize = 30; // Giocatori per lega
    this.promotionZone = 10; // Top 10 promossi
    this.relegationZone = 5; // Bottom 5 retrocessi
  }

  // Ottieni lega corrente e classifica
  async getCurrentLeague(userId) {
    const userData = await this.getUserLeagueData(userId);
    const league = this.leagues.find(l => l.id === userData.leagueId);
    const leaderboard = await this.getLeaderboard(userData.leagueId, userData.groupId);
    
    // Calcola posizione utente
    const userPosition = leaderboard.findIndex(u => u.id === userId) + 1;
    const isPromotionZone = userPosition <= this.promotionZone;
    const isRelegationZone = userPosition > this.leagueSize - this.relegationZone;
    
    // Tempo rimanente nella settimana
    const timeLeft = this.getTimeToWeekEnd();
    
    return {
      league,
      position: userPosition,
      leaderboard: leaderboard.slice(0, 20), // Top 20
      userStats: {
        weeklyXP: userData.weeklyXP,
        todayXP: userData.todayXP,
        streak: userData.streak
      },
      zones: {
        promotion: isPromotionZone,
        safe: !isPromotionZone && !isRelegationZone,
        relegation: isRelegationZone
      },
      timeLeft,
      rewards: this.getPositionRewards(userPosition, league.id)
    };
  }
  
  // Genera leaderboard con bot realistici
  async getLeaderboard(leagueId, groupId) {
    // Fetch utenti reali nel gruppo
    const realUsers = await this.getRealUsers(groupId);
    
    // Genera bot per riempire la lega
    const bots = this.generateRealisticBots(this.leagueSize - realUsers.length, leagueId);
    
    // Combina e ordina per XP
    const leaderboard = [...realUsers, ...bots]
      .sort((a, b) => b.weeklyXP - a.weeklyXP)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        movement: this.calculateMovement(user, index)
      }));
    
    return leaderboard;
  }
  
  // Genera bot con comportamento realistico
  generateRealisticBots(count, leagueId) {
    const bots = [];
    const names = this.getBotNames();
    const baseXP = this.getBaseXPForLeague(leagueId);
    
    for (let i = 0; i < count; i++) {
      const variance = Math.random() * 0.4 + 0.8; // 80-120% del base
      const dailyPattern = this.generateDailyPattern();
      
      bots.push({
        id: `bot_${i}`,
        name: names[i % names.length],
        avatar: this.getRandomAvatar(),
        isBot: true,
        weeklyXP: Math.floor(baseXP * variance),
        todayXP: Math.floor(dailyPattern * baseXP / 7),
        streak: Math.floor(Math.random() * 30),
        country: this.getRandomCountry(),
        studyPattern: dailyPattern
      });
    }
    
    return bots;
  }
  
  // Pattern di studio realistico per bot
  generateDailyPattern() {
    const patterns = [
      0.8,  // Lunedì - basso
      1.0,  // Martedì - normale
      1.2,  // Mercoledì - alto
      0.9,  // Giovedì - normale
      0.7,  // Venerdì - basso
      1.5,  // Sabato - molto alto
      1.3   // Domenica - alto
    ];
    
    const dayOfWeek = new Date().getDay();
    return patterns[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
  }
  
  // Sistema promozione/retrocessione
  async processWeeklyPromotion() {
    const allLeagues = [];
    
    for (const league of this.leagues) {
      const groups = await this.getAllGroups(league.id);
      
      for (const groupId of groups) {
        const leaderboard = await this.getLeaderboard(league.id, groupId);
        
        // Identifica promossi e retrocessi
        const promoted = leaderboard.slice(0, this.promotionZone);
        const relegated = leaderboard.slice(-this.relegationZone);
        
        allLeagues.push({
          leagueId: league.id,
          groupId,
          promoted: promoted.map(u => u.id),
          relegated: relegated.map(u => u.id)
        });
      }
    }
    
    // Processa promozioni e retrocessioni
    return this.applyPromotionsAndRelegations(allLeagues);
  }
  
  // Rewards per posizione
  getPositionRewards(position, leagueId) {
    const leagueMultiplier = {
      bronze: 1,
      silver: 1.5,
      gold: 2,
      diamond: 3,
      master: 5
    }[leagueId];
    
    const rewards = {
      1: { xp: 500, gems: 100, chest: 'legendary' },
      2: { xp: 300, gems: 50, chest: 'epic' },
      3: { xp: 200, gems: 25, chest: 'rare' },
      4: { xp: 150, gems: 15, chest: 'rare' },
      5: { xp: 100, gems: 10, chest: 'common' },
      10: { xp: 50, gems: 5, chest: 'common' }
    };
    
    // Trova reward appropriato
    let reward = null;
    for (const [pos, rew] of Object.entries(rewards)) {
      if (position <= parseInt(pos)) {
        reward = rew;
        break;
      }
    }
    
    // Applica moltiplicatore lega
    if (reward) {
      reward.xp = Math.floor(reward.xp * leagueMultiplier);
      reward.gems = Math.floor(reward.gems * leagueMultiplier);
    }
    
    return reward;
  }
  
  // Animazioni e celebrazioni
  getPromotionAnimation(fromLeague, toLeague) {
    return {
      type: 'league_promotion',
      from: fromLeague,
      to: toLeague,
      animation: 'confetti_explosion',
      duration: 3000,
      sound: 'fanfare.mp3',
      message: `🎉 Promosso in ${toLeague.name}!`,
      rewards: {
        xp: 200,
        badge: `${toLeague.id}_league`,
        freezeTokens: 3
      }
    };
  }
  
  // Sfide speciali lega
  generateLeagueChallenges(leagueId) {
    const challenges = {
      bronze: [
        { name: 'Prima Vittoria', desc: 'Finisci nella top 15', xp: 50 },
        { name: 'Costanza', desc: 'Studia 5 giorni di fila', xp: 75 }
      ],
      silver: [
        { name: 'Scalata', desc: 'Sali di 5 posizioni', xp: 100 },
        { name: 'Maratona', desc: '500 XP in un giorno', xp: 150 }
      ],
      gold: [
        { name: 'Podio', desc: 'Finisci nei primi 3', xp: 200 },
        { name: 'Perfect Week', desc: 'Studia ogni giorno', xp: 300 }
      ],
      diamond: [
        { name: 'Dominatore', desc: 'Mantieni il 1° posto per 3 giorni', xp: 500 },
        { name: 'Speed Demon', desc: '1000 XP in un giorno', xp: 400 }
      ],
      master: [
        { name: 'Leggenda', desc: 'Vinci la lega', xp: 1000 },
        { name: 'Imbattibile', desc: 'Non scendere mai sotto il 5° posto', xp: 750 }
      ]
    };
    
    return challenges[leagueId] || [];
  }
  
  // Helper functions
  calculateMovement(user, currentPosition) {
    // Simula movimento rispetto a ieri
    const yesterdayPosition = currentPosition + Math.floor(Math.random() * 5 - 2);
    const movement = yesterdayPosition - currentPosition;
    
    return {
      value: movement,
      direction: movement > 0 ? 'up' : movement < 0 ? 'down' : 'stable',
      icon: movement > 0 ? '↑' : movement < 0 ? '↓' : '→'
    };
  }
  
  getTimeToWeekEnd() {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(sunday.getDate() + (7 - now.getDay()));
    sunday.setHours(23, 59, 59, 999);
    
    const diff = sunday - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours, timestamp: sunday };
  }
  
  getBaseXPForLeague(leagueId) {
    const base = {
      bronze: 300,
      silver: 600,
      gold: 1200,
      diamond: 2000,
      master: 3500
    };
    
    return base[leagueId] || 300;
  }
  
  getBotNames() {
    return [
      'Marco_95', 'GiuliaStudia', 'LorenzoXP', 'ChiaraTop', 'Andrea_ITA',
      'FrancescaWin', 'Matteo2024', 'SofiaLearn', 'Luca_Pro', 'ElenaStudy',
      'DavideRocket', 'MartaChamp', 'Paolo_Roma', 'SaraQuiz', 'GiovanniAce'
    ];
  }
  
  getRandomAvatar() {
    const avatars = ['🦊', '🦁', '🐼', '🦄', '🐨', '🦅', '🐺', '🦉', '🐯', '🐸'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }
  
  getRandomCountry() {
    const countries = ['IT', 'FR', 'ES', 'DE', 'UK'];
    return countries[Math.floor(Math.random() * countries.length)];
  }
  
  async getUserLeagueData(userId) {
    // Simula fetch da database
    return {
      leagueId: 'silver',
      groupId: 'group_42',
      weeklyXP: 425,
      todayXP: 65,
      streak: 12
    };
  }
  
  async getRealUsers(groupId) {
    // Simula fetch utenti reali
    return [
      { id: 'user_1', name: 'Tu', weeklyXP: 425, todayXP: 65, streak: 12 }
    ];
  }
  
  async getAllGroups(leagueId) {
    // Simula fetch gruppi
    return ['group_1', 'group_2', 'group_3'];
  }
  
  async applyPromotionsAndRelegations(leagues) {
    // Logica per applicare promozioni/retrocessioni
    console.log('Processing weekly promotions...');
    return { promoted: 150, relegated: 75 };
  }
}

module.exports = LeaguesSystem;
