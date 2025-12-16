/**
 * 🤝 SOCIAL & COMPETITION SYSTEM - SFIDE 1V1 E GRUPPI STUDIO
 * Sistema sociale completo con amici, sfide e tornei
 */

const EventEmitter = require('events');

class SocialCompetitionSystem extends EventEmitter {
  constructor() {
    super();
    this.activeChallenges = new Map();
    this.tournaments = new Map();
    this.studyGroups = new Map();
  }

  // === SISTEMA AMICI ===
  async addFriend(userId, friendCode) {
    // Verifica codice amico
    const friend = await this.getUserByCode(friendCode);
    if (!friend) {
      return { success: false, error: 'Codice non valido' };
    }
    
    // Invia richiesta amicizia
    const request = {
      id: this.generateId(),
      from: userId,
      to: friend.id,
      status: 'pending',
      createdAt: new Date()
    };
    
    // Notifica amico
    this.emit('friend_request', {
      userId: friend.id,
      request
    });
    
    return { success: true, request };
  }
  
  async getFriendsActivity(userId) {
    const friends = await this.getFriends(userId);
    const activities = [];
    
    for (const friend of friends) {
      const recentActivity = await this.getRecentActivity(friend.id);
      activities.push({
        friend,
        activities: recentActivity,
        isOnline: this.isUserOnline(friend.id)
      });
    }
    
    // Ordina per attività recente
    return activities.sort((a, b) => 
      b.activities[0]?.timestamp - a.activities[0]?.timestamp
    );
  }
  
  // === SFIDE 1V1 ===
  async createChallenge(challengerId, opponentId, settings = {}) {
    const challenge = {
      id: this.generateId(),
      challenger: challengerId,
      opponent: opponentId,
      type: settings.type || 'quiz_battle',
      subject: settings.subject || 'random',
      difficulty: settings.difficulty || 'medium',
      rounds: settings.rounds || 10,
      timeLimit: settings.timeLimit || 30, // secondi per domanda
      stake: settings.stake || { xp: 50 },
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    };
    
    this.activeChallenges.set(challenge.id, challenge);
    
    // Notifica sfidato
    this.emit('challenge_received', {
      userId: opponentId,
      challenge
    });
    
    return challenge;
  }
  
  async startChallenge(challengeId, userId) {
    const challenge = this.activeChallenges.get(challengeId);
    
    if (!challenge) {
      return { success: false, error: 'Sfida non trovata' };
    }
    
    if (challenge.opponent !== userId) {
      return { success: false, error: 'Non sei il destinatario della sfida' };
    }
    
    // Genera domande per la sfida
    const questions = await this.generateChallengeQuestions(challenge);
    
    // Inizia la sfida
    challenge.status = 'active';
    challenge.startedAt = new Date();
    challenge.questions = questions;
    challenge.scores = {
      [challenge.challenger]: 0,
      [challenge.opponent]: 0
    };
    challenge.answers = {
      [challenge.challenger]: [],
      [challenge.opponent]: []
    };
    
    // Notifica entrambi i giocatori
    this.emit('challenge_started', {
      userIds: [challenge.challenger, challenge.opponent],
      challenge
    });
    
    return { success: true, challenge };
  }
  
  async submitChallengeAnswer(challengeId, userId, questionIndex, answer, timeSpent) {
    const challenge = this.activeChallenges.get(challengeId);
    
    if (!challenge || challenge.status !== 'active') {
      return { success: false };
    }
    
    const question = challenge.questions[questionIndex];
    const isCorrect = answer === question.correctAnswer;
    
    // Calcola punteggio con bonus tempo
    let points = 0;
    if (isCorrect) {
      points = 100;
      // Bonus velocità (max 50 punti extra)
      const speedBonus = Math.max(0, 50 - timeSpent * 2);
      points += speedBonus;
    }
    
    // Aggiorna punteggio
    challenge.scores[userId] += points;
    challenge.answers[userId].push({
      questionIndex,
      answer,
      isCorrect,
      timeSpent,
      points
    });
    
    // Controlla se entrambi hanno risposto
    const bothAnswered = 
      challenge.answers[challenge.challenger].length === questionIndex + 1 &&
      challenge.answers[challenge.opponent].length === questionIndex + 1;
    
    if (bothAnswered) {
      // Notifica risultato round
      this.emit('round_complete', {
        userIds: [challenge.challenger, challenge.opponent],
        challengeId,
        round: questionIndex + 1,
        scores: challenge.scores
      });
      
      // Controlla fine sfida
      if (questionIndex + 1 === challenge.rounds) {
        return this.endChallenge(challengeId);
      }
    }
    
    return { success: true, points, isCorrect };
  }
  
  async endChallenge(challengeId) {
    const challenge = this.activeChallenges.get(challengeId);
    
    const scores = challenge.scores;
    const winner = scores[challenge.challenger] > scores[challenge.opponent] 
      ? challenge.challenger 
      : scores[challenge.opponent] > scores[challenge.challenger]
        ? challenge.opponent
        : null; // pareggio
    
    challenge.status = 'completed';
    challenge.winner = winner;
    challenge.endedAt = new Date();
    
    // Calcola ricompense
    const rewards = {
      winner: {
        xp: challenge.stake.xp * 2,
        trophies: 1,
        streak: 1
      },
      loser: {
        xp: Math.floor(challenge.stake.xp * 0.3),
        trophies: 0,
        streak: -1
      }
    };
    
    // Notifica risultati
    this.emit('challenge_complete', {
      userIds: [challenge.challenger, challenge.opponent],
      challenge,
      rewards
    });
    
    // Rimuovi da sfide attive
    this.activeChallenges.delete(challengeId);
    
    return { success: true, challenge, rewards };
  }
  
  // === MATCHMAKING CASUALE ===
  async findRandomOpponent(userId, preferences = {}) {
    const userStats = await this.getUserStats(userId);
    const pool = await this.getMatchmakingPool();
    
    // Filtra per livello simile (ELO-based)
    const eligibleOpponents = pool.filter(opponent => {
      const eloDiff = Math.abs(opponent.elo - userStats.elo);
      return eloDiff <= 200 && opponent.id !== userId;
    });
    
    if (eligibleOpponents.length === 0) {
      return null;
    }
    
    // Seleziona random con peso basato su similarità
    const weights = eligibleOpponents.map(o => 
      1 / (1 + Math.abs(o.elo - userStats.elo) / 100)
    );
    
    const selected = this.weightedRandom(eligibleOpponents, weights);
    
    return {
      opponent: selected,
      estimatedWaitTime: 5 // secondi
    };
  }
  
  // === TORNEI SETTIMANALI ===
  async createWeeklyTournament(subject) {
    const tournament = {
      id: `tournament_${subject}_${Date.now()}`,
      subject,
      type: 'weekly',
      status: 'registration',
      participants: [],
      maxParticipants: 64,
      rounds: [],
      prizes: {
        1: { xp: 1000, gems: 100, badge: `${subject}_champion` },
        2: { xp: 500, gems: 50, badge: `${subject}_finalist` },
        3: { xp: 250, gems: 25, badge: `${subject}_semifinalist` },
        top8: { xp: 100, gems: 10 }
      },
      startsAt: this.getNextMonday(),
      endsAt: this.getNextSunday()
    };
    
    this.tournaments.set(tournament.id, tournament);
    
    return tournament;
  }
  
  async joinTournament(tournamentId, userId) {
    const tournament = this.tournaments.get(tournamentId);
    
    if (!tournament) {
      return { success: false, error: 'Torneo non trovato' };
    }
    
    if (tournament.participants.length >= tournament.maxParticipants) {
      return { success: false, error: 'Torneo pieno' };
    }
    
    if (tournament.participants.includes(userId)) {
      return { success: false, error: 'Già iscritto' };
    }
    
    tournament.participants.push(userId);
    
    // Se pieno, genera bracket
    if (tournament.participants.length === tournament.maxParticipants) {
      this.generateTournamentBracket(tournament);
    }
    
    return { success: true, position: tournament.participants.length };
  }
  
  generateTournamentBracket(tournament) {
    // Shuffle partecipanti
    const shuffled = [...tournament.participants].sort(() => Math.random() - 0.5);
    
    // Genera primo round (32 match per 64 partecipanti)
    const firstRound = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      firstRound.push({
        match: Math.floor(i / 2) + 1,
        player1: shuffled[i],
        player2: shuffled[i + 1],
        winner: null,
        scores: {}
      });
    }
    
    tournament.rounds.push(firstRound);
    tournament.status = 'active';
    tournament.currentRound = 0;
    
    // Notifica partecipanti
    this.emit('tournament_started', {
      userIds: tournament.participants,
      tournament
    });
  }
  
  // === GRUPPI STUDIO ===
  async createStudyGroup(creatorId, settings) {
    const group = {
      id: this.generateId(),
      name: settings.name,
      description: settings.description,
      subject: settings.subject,
      creator: creatorId,
      members: [creatorId],
      maxMembers: settings.maxMembers || 50,
      privacy: settings.privacy || 'public', // public, private, invite-only
      goals: settings.goals || [],
      chat: {
        enabled: true,
        messages: []
      },
      stats: {
        totalXP: 0,
        averageStreak: 0,
        completedGoals: 0
      },
      createdAt: new Date()
    };
    
    this.studyGroups.set(group.id, group);
    
    return group;
  }
  
  async joinStudyGroup(groupId, userId) {
    const group = this.studyGroups.get(groupId);
    
    if (!group) {
      return { success: false, error: 'Gruppo non trovato' };
    }
    
    if (group.members.length >= group.maxMembers) {
      return { success: false, error: 'Gruppo pieno' };
    }
    
    if (group.members.includes(userId)) {
      return { success: false, error: 'Già membro' };
    }
    
    group.members.push(userId);
    
    // Notifica membri
    this.emit('member_joined', {
      groupId,
      userId,
      members: group.members
    });
    
    return { success: true, group };
  }
  
  async setGroupGoal(groupId, goal) {
    const group = this.studyGroups.get(groupId);
    
    if (!group) {
      return { success: false };
    }
    
    const groupGoal = {
      id: this.generateId(),
      title: goal.title,
      description: goal.description,
      target: goal.target, // es. "5000 XP totali questa settimana"
      deadline: goal.deadline,
      progress: 0,
      contributors: [],
      reward: goal.reward || { xp: 100, badge: 'team_player' }
    };
    
    group.goals.push(groupGoal);
    
    // Notifica membri
    this.emit('new_group_goal', {
      groupId,
      goal: groupGoal,
      members: group.members
    });
    
    return { success: true, goal: groupGoal };
  }
  
  // === HELPER FUNCTIONS ===
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  weightedRandom(items, weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[items.length - 1];
  }
  
  getNextMonday() {
    const d = new Date();
    d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  
  getNextSunday() {
    const d = new Date();
    d.setDate(d.getDate() + (7 - d.getDay()) % 7);
    d.setHours(23, 59, 59, 999);
    return d;
  }
  
  isUserOnline(userId) {
    // Check Redis/memory per stato online
    return Math.random() > 0.5; // Simulato
  }
  
  async generateChallengeQuestions(challenge) {
    // Genera domande per sfida
    const questions = [];
    for (let i = 0; i < challenge.rounds; i++) {
      questions.push({
        question: `Domanda ${i + 1} su ${challenge.subject}`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: Math.floor(Math.random() * 4),
        difficulty: challenge.difficulty
      });
    }
    return questions;
  }
  
  // Simulazioni database
  async getUserByCode(code) {
    return { id: 'user_' + code, name: 'Amico' };
  }
  
  async getFriends(userId) {
    return [
      { id: 'friend_1', name: 'Marco', avatar: '🦊' },
      { id: 'friend_2', name: 'Giulia', avatar: '🦄' }
    ];
  }
  
  async getRecentActivity(userId) {
    return [
      { type: 'quiz', subject: 'Storia', score: 85, timestamp: Date.now() - 3600000 },
      { type: 'flashcard', count: 30, timestamp: Date.now() - 7200000 }
    ];
  }
  
  async getUserStats(userId) {
    return { elo: 1500, wins: 10, losses: 5 };
  }
  
  async getMatchmakingPool() {
    return [
      { id: 'user_1', elo: 1450 },
      { id: 'user_2', elo: 1550 },
      { id: 'user_3', elo: 1480 }
    ];
  }
}

module.exports = SocialCompetitionSystem;
