/**
 * 🎯 DAILY GOALS SYSTEM - OBIETTIVI PERSONALIZZATI AI
 * Sistema obiettivi giornalieri adattivi basati su performance
 */

class DailyGoalsSystem {
  constructor() {
    this.defaultGoals = {
      beginner: { xp: 10, quiz: 3, flashcards: 10, minutes: 15 },
      casual: { xp: 20, quiz: 5, flashcards: 20, minutes: 30 },
      regular: { xp: 30, quiz: 10, flashcards: 30, minutes: 45 },
      serious: { xp: 50, quiz: 15, flashcards: 50, minutes: 60 },
      intense: { xp: 100, quiz: 20, flashcards: 100, minutes: 90 }
    };
  }

  // Genera obiettivi personalizzati basati su AI
  async generatePersonalizedGoals(userId) {
    const userData = await this.getUserStats(userId);
    const performance = this.analyzePerformance(userData);
    
    // Obiettivi base
    const baseGoals = this.defaultGoals[performance.level];
    
    // Personalizza per materie deboli
    const weakSubjects = this.identifyWeakSubjects(userData);
    
    // Mini-challenges giornalieri
    const challenges = this.generateDailyChallenges(userData, weakSubjects);
    
    // Calcola ricompense
    const rewards = this.calculateRewards(baseGoals, challenges);
    
    return {
      main: {
        title: "Obiettivo Giornaliero",
        goals: baseGoals,
        progress: this.calculateProgress(userData.todayStats, baseGoals),
        reward: rewards.main
      },
      challenges: challenges,
      bonus: this.generateBonusGoal(userData),
      adaptiveHint: this.getAdaptiveHint(performance)
    };
  }
  
  // Analizza performance per adattare difficoltà
  analyzePerformance(userData) {
    const { avgCorrect, studyFrequency, streakDays } = userData;
    
    let level = 'casual';
    let adjustment = 1.0;
    
    // Determina livello base
    if (avgCorrect > 85 && studyFrequency > 5) {
      level = 'intense';
    } else if (avgCorrect > 75 && studyFrequency > 4) {
      level = 'serious';
    } else if (avgCorrect > 65 && studyFrequency > 3) {
      level = 'regular';
    } else if (avgCorrect > 50) {
      level = 'casual';
    } else {
      level = 'beginner';
    }
    
    // Aggiustamenti basati su trend
    if (userData.trend === 'improving') {
      adjustment = 1.1; // Aumenta leggermente difficoltà
    } else if (userData.trend === 'declining') {
      adjustment = 0.9; // Riduci difficoltà
    }
    
    return { level, adjustment };
  }
  
  // Genera mini-challenges giornalieri
  generateDailyChallenges(userData, weakSubjects) {
    const challenges = [];
    const templates = [
      {
        id: 'perfect_run',
        title: '🎯 Corsa Perfetta',
        desc: 'Completa 5 quiz di fila senza errori',
        xp: 50,
        difficulty: 'medium'
      },
      {
        id: 'speed_demon',
        title: '⚡ Velocista',
        desc: 'Rispondi a 20 domande in 5 minuti',
        xp: 30,
        difficulty: 'hard'
      },
      {
        id: 'weak_subject',
        title: '💪 Rinforzo',
        desc: `Studia ${weakSubjects[0]} per 15 minuti`,
        xp: 40,
        difficulty: 'easy'
      },
      {
        id: 'flashcard_master',
        title: '🃏 Maestro Flashcard',
        desc: 'Ripassa 30 flashcard con 80%+ corretto',
        xp: 35,
        difficulty: 'medium'
      },
      {
        id: 'early_bird',
        title: '🌅 Mattiniero',
        desc: 'Studia prima delle 9:00',
        xp: 25,
        difficulty: 'easy'
      }
    ];
    
    // Seleziona 3 challenges casuali
    const selected = [];
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
      selected.push({
        ...shuffled[i],
        progress: 0,
        completed: false,
        expiresAt: this.getEndOfDay()
      });
    }
    
    return selected;
  }
  
  // Reward chest system
  generateRewardChest() {
    const rewards = [
      { type: 'xp', amount: 10, weight: 40 },
      { type: 'xp', amount: 25, weight: 25 },
      { type: 'xp', amount: 50, weight: 15 },
      { type: 'xp', amount: 100, weight: 5 },
      { type: 'freeze', amount: 1, weight: 10 },
      { type: 'powerup', name: 'double_xp', duration: 30, weight: 3 },
      { type: 'badge', name: 'daily_champion', weight: 2 }
    ];
    
    // Weighted random selection
    const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const reward of rewards) {
      random -= reward.weight;
      if (random <= 0) {
        return {
          ...reward,
          animation: 'chest_open',
          message: this.getRewardMessage(reward)
        };
      }
    }
    
    return rewards[0];
  }
  
  // Bonus goals per engagement extra
  generateBonusGoal(userData) {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    // Bonus serale
    if (hour >= 20 && hour <= 23) {
      return {
        active: true,
        title: '🌙 Bonus Notturno',
        desc: 'Studia altri 15 minuti per XP x2',
        multiplier: 2,
        timeLeft: this.getTimeUntil(23, 59)
      };
    }
    
    // Bonus weekend
    if (day === 0 || day === 6) {
      return {
        active: true,
        title: '🎉 Weekend Special',
        desc: 'Completa tutti gli obiettivi per un premio extra',
        reward: 'mystery_chest',
        timeLeft: this.getEndOfDay()
      };
    }
    
    return { active: false };
  }
  
  // Progress tracking
  calculateProgress(todayStats, goals) {
    const progress = {};
    
    for (const [key, target] of Object.entries(goals)) {
      const current = todayStats[key] || 0;
      progress[key] = {
        current,
        target,
        percentage: Math.min(100, (current / target) * 100),
        completed: current >= target
      };
    }
    
    // Overall progress
    const completed = Object.values(progress).filter(p => p.completed).length;
    const total = Object.keys(goals).length;
    
    progress.overall = {
      completed,
      total,
      percentage: (completed / total) * 100,
      allCompleted: completed === total
    };
    
    return progress;
  }
  
  // Helper functions
  identifyWeakSubjects(userData) {
    return userData.subjects
      .filter(s => s.avgScore < 60)
      .sort((a, b) => a.avgScore - b.avgScore)
      .map(s => s.name)
      .slice(0, 3);
  }
  
  calculateRewards(goals, challenges) {
    const baseXP = goals.xp;
    const challengeXP = challenges.reduce((sum, c) => sum + c.xp, 0);
    
    return {
      main: {
        xp: baseXP,
        streak: '+1 giorno',
        chest: Math.random() > 0.7 ? 'bronze' : null
      },
      total: baseXP + challengeXP,
      bonus: []
    };
  }
  
  getAdaptiveHint(performance) {
    const hints = {
      beginner: "Inizia con obiettivi piccoli. Ogni passo conta! 🌱",
      casual: "Ottimo ritmo! Prova a studiare un po' di più ogni giorno 📈",
      regular: "Stai andando benissimo! Mantieni questo ritmo 💪",
      serious: "Sei un campione! Non dimenticare le pause 🎯",
      intense: "Incredibile dedizione! Sei nel top 1% degli studenti 🔥"
    };
    
    return hints[performance.level];
  }
  
  getRewardMessage(reward) {
    const messages = {
      xp: `+${reward.amount} XP guadagnati!`,
      freeze: 'Freeze token ottenuto! 🧊',
      powerup: `Power-up ${reward.name} attivato!`,
      badge: `Badge "${reward.name}" sbloccato! 🏆`
    };
    
    return messages[reward.type] || 'Premio ottenuto!';
  }
  
  getEndOfDay() {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end;
  }
  
  getTimeUntil(hour, minute) {
    const target = new Date();
    target.setHours(hour, minute, 0, 0);
    const now = new Date();
    return Math.max(0, target - now);
  }
  
  async getUserStats(userId) {
    // Simula fetch da database
    return {
      avgCorrect: 75,
      studyFrequency: 4,
      streakDays: 15,
      trend: 'improving',
      todayStats: { xp: 15, quiz: 7, flashcards: 25, minutes: 35 },
      subjects: [
        { name: 'Matematica', avgScore: 45 },
        { name: 'Storia', avgScore: 78 },
        { name: 'Inglese', avgScore: 82 }
      ]
    };
  }
}

module.exports = DailyGoalsSystem;
