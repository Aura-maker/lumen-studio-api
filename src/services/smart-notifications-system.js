/**
 * 🔔 SMART NOTIFICATIONS SYSTEM - ENGAGEMENT INTELLIGENTE
 * Push notifications personalizzate con AI scheduling
 */

class SmartNotificationsSystem {
  constructor() {
    this.notificationTypes = {
      streak: { priority: 'high', sound: true, vibrate: true },
      challenge: { priority: 'high', sound: true, vibrate: true },
      reminder: { priority: 'medium', sound: false, vibrate: true },
      achievement: { priority: 'high', sound: true, vibrate: false },
      social: { priority: 'low', sound: false, vibrate: false },
      goal: { priority: 'medium', sound: false, vibrate: true }
    };
    
    this.userPreferences = new Map();
    this.scheduledNotifications = new Map();
  }

  // === CONFIGURAZIONE NOTIFICHE ===
  async configureUserNotifications(userId, preferences) {
    const config = {
      enabled: preferences.enabled ?? true,
      quietHours: {
        start: preferences.quietStart || '22:00',
        end: preferences.quietEnd || '08:00'
      },
      frequency: preferences.frequency || 'smart', // smart, high, medium, low
      types: {
        streak: preferences.streak ?? true,
        challenges: preferences.challenges ?? true,
        studyReminders: preferences.studyReminders ?? true,
        achievements: preferences.achievements ?? true,
        social: preferences.social ?? true,
        goals: preferences.goals ?? true
      },
      channels: {
        push: preferences.push ?? true,
        email: preferences.email ?? false,
        inApp: preferences.inApp ?? true
      }
    };
    
    this.userPreferences.set(userId, config);
    
    // Schedula notifiche iniziali
    await this.scheduleSmartNotifications(userId);
    
    return config;
  }
  
  // === SCHEDULING INTELLIGENTE ===
  async scheduleSmartNotifications(userId) {
    const userData = await this.getUserData(userId);
    const prefs = this.userPreferences.get(userId);
    
    if (!prefs?.enabled) return;
    
    // Analizza pattern di studio
    const studyPattern = this.analyzeStudyPattern(userData.sessions);
    const optimalTimes = this.calculateOptimalTimes(studyPattern, prefs);
    
    // Cancella notifiche esistenti
    this.clearUserNotifications(userId);
    
    // Schedule basato su pattern
    const notifications = [];
    
    // Reminder streak
    if (prefs.types.streak && !userData.studiedToday) {
      notifications.push({
        id: this.generateId(),
        type: 'streak',
        time: optimalTimes.streak,
        message: this.generateStreakMessage(userData.currentStreak),
        data: { streak: userData.currentStreak }
      });
    }
    
    // Reminder studio ottimale
    if (prefs.types.studyReminders) {
      notifications.push({
        id: this.generateId(),
        type: 'reminder',
        time: optimalTimes.study,
        message: this.generateStudyMessage(userData),
        data: { subject: userData.weakestSubject }
      });
    }
    
    // Flashcard da ripassare
    if (userData.dueFlashcards > 0) {
      notifications.push({
        id: this.generateId(),
        type: 'reminder',
        time: optimalTimes.flashcards,
        message: `📚 ${userData.dueFlashcards} flashcard da ripassare!`,
        data: { count: userData.dueFlashcards }
      });
    }
    
    // Schedule notifiche
    for (const notif of notifications) {
      if (this.isInQuietHours(notif.time, prefs.quietHours)) {
        // Posticipa dopo quiet hours
        notif.time = this.afterQuietHours(prefs.quietHours);
      }
      
      this.scheduleNotification(userId, notif);
    }
    
    return notifications;
  }
  
  // === ANALISI PATTERN ===
  analyzeStudyPattern(sessions) {
    if (!sessions || sessions.length === 0) {
      return this.getDefaultPattern();
    }
    
    const pattern = {
      preferredHours: new Map(),
      averageDuration: 0,
      frequency: 0,
      consistency: 0,
      bestDays: []
    };
    
    // Analizza ore preferite
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      pattern.preferredHours.set(hour, 
        (pattern.preferredHours.get(hour) || 0) + 1
      );
    });
    
    // Top 3 ore
    const sortedHours = [...pattern.preferredHours.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => hour);
    
    pattern.preferredHours = sortedHours;
    
    // Durata media
    const durations = sessions.map(s => s.duration);
    pattern.averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    
    // Frequenza settimanale
    const weeks = new Set(sessions.map(s => 
      this.getWeekNumber(new Date(s.startTime))
    ));
    pattern.frequency = sessions.length / weeks.size;
    
    // Consistenza (deviazione standard)
    const dailyCounts = this.getDailyCounts(sessions);
    pattern.consistency = this.calculateConsistency(dailyCounts);
    
    return pattern;
  }
  
  calculateOptimalTimes(pattern, preferences) {
    const now = new Date();
    const times = {};
    
    // Orario ottimale per streak reminder
    if (pattern.preferredHours.length > 0) {
      // 2 ore prima dell'orario preferito
      const preferredHour = pattern.preferredHours[0];
      times.streak = new Date(now);
      times.streak.setHours(preferredHour - 2, 0, 0, 0);
      
      // Se è già passato, metti domani
      if (times.streak < now) {
        times.streak.setDate(times.streak.getDate() + 1);
      }
    } else {
      // Default: 18:00
      times.streak = new Date(now);
      times.streak.setHours(18, 0, 0, 0);
    }
    
    // Orario studio
    times.study = new Date(now);
    times.study.setHours(
      pattern.preferredHours[0] || 19,
      0, 0, 0
    );
    
    // Flashcards: 30 min prima dello studio
    times.flashcards = new Date(times.study);
    times.flashcards.setMinutes(times.flashcards.getMinutes() - 30);
    
    return times;
  }
  
  // === MESSAGGI PERSONALIZZATI ===
  generateStreakMessage(currentStreak) {
    const messages = {
      0: [
        "🌱 Inizia oggi il tuo percorso!",
        "📚 È il momento perfetto per studiare!",
        "🚀 Comincia una nuova serie!"
      ],
      low: [ // 1-6
        `🔥 ${currentStreak} giorni! Continua così!`,
        `💪 Serie di ${currentStreak}! Non fermarti!`,
        `⚡ ${currentStreak} giorni consecutivi!`
      ],
      medium: [ // 7-29
        `🔥 Incredibile! ${currentStreak} giorni!`,
        `🏆 ${currentStreak} giorni di fila! Sei forte!`,
        `⭐ WOW! Serie di ${currentStreak} giorni!`
      ],
      high: [ // 30+
        `🔥🔥 ${currentStreak} GIORNI! LEGGENDA!`,
        `👑 ${currentStreak} giorni! Inarrestabile!`,
        `🌟 RECORD: ${currentStreak} giorni consecutivi!`
      ]
    };
    
    let category;
    if (currentStreak === 0) category = 0;
    else if (currentStreak < 7) category = 'low';
    else if (currentStreak < 30) category = 'medium';
    else category = 'high';
    
    const categoryMessages = messages[category];
    return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
  }
  
  generateStudyMessage(userData) {
    const { weakestSubject, averageScore, goalProgress } = userData;
    
    const messages = [
      `📊 ${weakestSubject} ha bisogno di attenzione (media: ${averageScore}%)`,
      `🎯 Sei al ${goalProgress}% del tuo obiettivo giornaliero!`,
      `💡 5 minuti di ${weakestSubject} fanno la differenza!`,
      `🧠 Il tuo cervello è pronto per imparare!`,
      `⏰ È l'ora migliore per studiare secondo i tuoi pattern!`
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  // === NOTIFICHE REAL-TIME ===
  async sendInstantNotification(userId, notification) {
    const prefs = this.userPreferences.get(userId);
    
    // Controlla preferenze
    if (!prefs?.enabled || !prefs.types[notification.type]) {
      return { sent: false, reason: 'disabled' };
    }
    
    // Controlla quiet hours
    if (this.isInQuietHours(new Date(), prefs.quietHours)) {
      // Salva per dopo
      this.queueForLater(userId, notification);
      return { sent: false, reason: 'quiet_hours' };
    }
    
    // Invia notifica
    const result = await this.sendPushNotification(userId, {
      title: notification.title || 'ImparaFacile',
      body: notification.message,
      icon: '/icon-192.png',
      badge: '/badge.png',
      vibrate: this.notificationTypes[notification.type]?.vibrate ? [200] : [],
      sound: this.notificationTypes[notification.type]?.sound ? '/sounds/notification.mp3' : null,
      data: notification.data,
      actions: notification.actions || []
    });
    
    // Log per analytics
    await this.logNotification(userId, notification, result);
    
    return result;
  }
  
  // === NOTIFICHE SPECIALI ===
  async sendChallengeNotification(userId, challenge) {
    return this.sendInstantNotification(userId, {
      type: 'challenge',
      title: '⚔️ Nuova Sfida!',
      message: `${challenge.challenger.name} ti sfida in ${challenge.subject}!`,
      data: { challengeId: challenge.id },
      actions: [
        { action: 'accept', title: 'Accetta' },
        { action: 'decline', title: 'Rifiuta' }
      ]
    });
  }
  
  async sendAchievementNotification(userId, achievement) {
    return this.sendInstantNotification(userId, {
      type: 'achievement',
      title: '🏆 Achievement Sbloccato!',
      message: `Hai ottenuto: ${achievement.name}!`,
      data: { achievementId: achievement.id }
    });
  }
  
  async sendGoalCompletedNotification(userId, goal) {
    return this.sendInstantNotification(userId, {
      type: 'goal',
      title: '🎯 Obiettivo Completato!',
      message: `Hai raggiunto: ${goal.title}! +${goal.reward.xp} XP`,
      data: { goalId: goal.id }
    });
  }
  
  // === ANALYTICS & OPTIMIZATION ===
  async analyzeNotificationEffectiveness(userId) {
    const logs = await this.getNotificationLogs(userId);
    
    const analysis = {
      totalSent: logs.length,
      opened: logs.filter(l => l.opened).length,
      actionTaken: logs.filter(l => l.actionTaken).length,
      openRate: 0,
      actionRate: 0,
      bestTime: null,
      worstTime: null,
      recommendations: []
    };
    
    if (analysis.totalSent > 0) {
      analysis.openRate = (analysis.opened / analysis.totalSent) * 100;
      analysis.actionRate = (analysis.actionTaken / analysis.totalSent) * 100;
    }
    
    // Analizza orari migliori/peggiori
    const hourStats = new Map();
    logs.forEach(log => {
      const hour = new Date(log.sentAt).getHours();
      if (!hourStats.has(hour)) {
        hourStats.set(hour, { sent: 0, opened: 0 });
      }
      const stats = hourStats.get(hour);
      stats.sent++;
      if (log.opened) stats.opened++;
    });
    
    // Trova orari ottimali
    let bestRate = 0, worstRate = 100;
    hourStats.forEach((stats, hour) => {
      const rate = (stats.opened / stats.sent) * 100;
      if (rate > bestRate) {
        bestRate = rate;
        analysis.bestTime = hour;
      }
      if (rate < worstRate) {
        worstRate = rate;
        analysis.worstTime = hour;
      }
    });
    
    // Genera raccomandazioni
    if (analysis.openRate < 20) {
      analysis.recommendations.push('Riduci frequenza notifiche');
    }
    if (analysis.bestTime !== null) {
      analysis.recommendations.push(`Invia notifiche alle ${analysis.bestTime}:00`);
    }
    
    return analysis;
  }
  
  // === HELPER FUNCTIONS ===
  isInQuietHours(time, quietHours) {
    const hour = time.getHours();
    const start = parseInt(quietHours.start.split(':')[0]);
    const end = parseInt(quietHours.end.split(':')[0]);
    
    if (start < end) {
      return hour >= start && hour < end;
    } else {
      // Attraversa mezzanotte
      return hour >= start || hour < end;
    }
  }
  
  afterQuietHours(quietHours) {
    const end = quietHours.end.split(':');
    const time = new Date();
    time.setHours(parseInt(end[0]), parseInt(end[1]), 0, 0);
    
    // Se è già passato, metti domani
    if (time < new Date()) {
      time.setDate(time.getDate() + 1);
    }
    
    return time;
  }
  
  generateId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  }
  
  getDailyCounts(sessions) {
    const counts = new Map();
    sessions.forEach(session => {
      const day = new Date(session.startTime).toDateString();
      counts.set(day, (counts.get(day) || 0) + 1);
    });
    return Array.from(counts.values());
  }
  
  calculateConsistency(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
  
  getDefaultPattern() {
    return {
      preferredHours: [19, 20, 21],
      averageDuration: 30,
      frequency: 3,
      consistency: 0.5,
      bestDays: ['Mon', 'Wed', 'Fri']
    };
  }
  
  clearUserNotifications(userId) {
    // Cancella notifiche schedulate
    const userNotifs = [];
    this.scheduledNotifications.forEach((notif, id) => {
      if (notif.userId === userId) {
        userNotifs.push(id);
      }
    });
    
    userNotifs.forEach(id => {
      clearTimeout(this.scheduledNotifications.get(id).timer);
      this.scheduledNotifications.delete(id);
    });
  }
  
  scheduleNotification(userId, notification) {
    const delay = notification.time - Date.now();
    
    if (delay <= 0) {
      // Invia subito
      this.sendInstantNotification(userId, notification);
    } else {
      // Schedula
      const timer = setTimeout(() => {
        this.sendInstantNotification(userId, notification);
      }, delay);
      
      this.scheduledNotifications.set(notification.id, {
        ...notification,
        userId,
        timer
      });
    }
  }
  
  queueForLater(userId, notification) {
    // Salva in coda per invio dopo quiet hours
    console.log(`Notifica in coda per ${userId}`);
  }
  
  // Simulazioni
  async getUserData(userId) {
    return {
      currentStreak: 15,
      studiedToday: false,
      weakestSubject: 'Matematica',
      averageScore: 65,
      goalProgress: 45,
      dueFlashcards: 23,
      sessions: []
    };
  }
  
  async sendPushNotification(userId, payload) {
    console.log(`Push to ${userId}:`, payload);
    return { sent: true, id: this.generateId() };
  }
  
  async logNotification(userId, notification, result) {
    console.log(`Logged: ${userId} - ${notification.type} - ${result.sent}`);
  }
  
  async getNotificationLogs(userId) {
    return [];
  }
}

module.exports = SmartNotificationsSystem;
