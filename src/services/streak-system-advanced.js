/**
 * 🔥 STREAK SYSTEM AVANZATO - COME DUOLINGO MA MEGLIO
 * Sistema streak con freeze, milestones, recovery e rewards
 */

class StreakSystemAdvanced {
  constructor() {
    this.milestones = [3, 7, 14, 30, 50, 100, 365, 500, 1000];
    this.freezeTokens = 2; // 2 freeze gratuiti al mese
  }

  // Calcola streak con gestione freeze
  async calculateStreak(userId) {
    const today = new Date().toISOString().split('T')[0];
    const userData = await this.getUserData(userId);
    
    // Controlla se oggi ha studiato
    if (userData.lastStudyDate === today) {
      return {
        current: userData.currentStreak,
        status: 'active',
        nextMilestone: this.getNextMilestone(userData.currentStreak)
      };
    }
    
    // Controlla se può usare freeze
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (userData.lastStudyDate === yesterdayStr) {
      // Può continuare streak
      return {
        current: userData.currentStreak,
        status: 'continue_today',
        hoursLeft: this.getHoursLeft()
      };
    }
    
    // Controlla freeze disponibili
    if (userData.freezeTokens > 0 && this.canUseFreeze(userData)) {
      return {
        current: userData.currentStreak,
        status: 'freeze_available',
        freezeTokens: userData.freezeTokens
      };
    }
    
    // Streak perso - offri recovery challenge
    if (userData.currentStreak > 7) {
      return {
        current: 0,
        status: 'lost_recoverable',
        lostStreak: userData.currentStreak,
        recoveryChallenge: this.generateRecoveryChallenge(userData.currentStreak)
      };
    }
    
    return {
      current: 0,
      status: 'lost',
      lostStreak: userData.currentStreak
    };
  }
  
  // Milestone rewards
  getMilestoneRewards(milestone) {
    const rewards = {
      3: { xp: 50, badge: 'streak_starter', freezeToken: 1 },
      7: { xp: 100, badge: 'week_warrior', freezeToken: 1 },
      14: { xp: 200, badge: 'fortnight_fighter', freezeToken: 2 },
      30: { xp: 500, badge: 'month_master', freezeToken: 3, premiumTrial: 3 },
      50: { xp: 1000, badge: 'streak_hero', freezeToken: 5 },
      100: { xp: 2500, badge: 'century_scholar', premiumMonth: 1 },
      365: { xp: 10000, badge: 'year_legend', premiumYear: 1 },
      500: { xp: 15000, badge: 'streak_immortal', lifetime: true },
      1000: { xp: 25000, badge: 'study_god', customAvatar: true }
    };
    
    return rewards[milestone] || null;
  }
  
  // Recovery challenge per recuperare streak perso
  generateRecoveryChallenge(lostStreak) {
    const difficulty = Math.min(5, Math.floor(lostStreak / 10));
    
    return {
      type: 'recovery',
      difficulty,
      requirements: [
        { task: 'complete_quiz', count: 5 + difficulty },
        { task: 'perfect_score', count: 2 },
        { task: 'study_minutes', count: 30 + (difficulty * 10) },
        { task: 'review_flashcards', count: 20 + (difficulty * 5) }
      ],
      timeLimit: 24, // ore
      reward: {
        streakRestore: Math.floor(lostStreak * 0.8), // Recupera 80% dello streak
        xp: lostStreak * 10
      }
    };
  }
  
  // Weekend bonus XP
  getWeekendBonus() {
    const day = new Date().getDay();
    if (day === 0 || day === 6) { // Domenica o Sabato
      return {
        active: true,
        multiplier: 2,
        endTime: this.getEndOfDay()
      };
    }
    return { active: false };
  }
  
  // Power hours - XP bonus in orari specifici
  getPowerHours() {
    const hour = new Date().getHours();
    const powerHours = {
      morning: { start: 6, end: 9, bonus: 1.5, name: 'Early Bird' },
      lunch: { start: 12, end: 14, bonus: 1.3, name: 'Lunch Learner' },
      evening: { start: 18, end: 21, bonus: 1.5, name: 'Evening Scholar' },
      night: { start: 21, end: 23, bonus: 2, name: 'Night Owl' }
    };
    
    for (const [key, period] of Object.entries(powerHours)) {
      if (hour >= period.start && hour < period.end) {
        return {
          active: true,
          bonus: period.bonus,
          name: period.name,
          endTime: new Date().setHours(period.end, 0, 0, 0)
        };
      }
    }
    
    return { active: false };
  }
  
  // Streak calendar visualization
  generateStreakCalendar(userId, year = new Date().getFullYear()) {
    const calendar = {};
    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    
    // Genera struttura calendario
    for (let month = 0; month < 12; month++) {
      calendar[months[month]] = [];
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        calendar[months[month]].push({
          day,
          studied: false,
          freeze: false,
          milestone: false
        });
      }
    }
    
    return calendar;
  }
  
  // Helper functions
  getNextMilestone(currentStreak) {
    return this.milestones.find(m => m > currentStreak) || null;
  }
  
  getHoursLeft() {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return Math.floor((endOfDay - now) / (1000 * 60 * 60));
  }
  
  getEndOfDay() {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end;
  }
  
  canUseFreeze(userData) {
    // Max 1 freeze a settimana
    const lastFreeze = new Date(userData.lastFreezeUsed || 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastFreeze < weekAgo;
  }
  
  async getUserData(userId) {
    // Simula fetch da database
    return {
      currentStreak: 15,
      maxStreak: 30,
      lastStudyDate: '2024-11-29',
      freezeTokens: 2,
      lastFreezeUsed: null
    };
  }
}

module.exports = StreakSystemAdvanced;
