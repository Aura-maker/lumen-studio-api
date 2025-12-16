/**
 * 🧠 SM-2+ ALGORITHM - SUPERIORE AD ANKI
 * Algoritmo di ripetizione spaziata con 6 livelli di qualità
 */

class SM2PlusAlgorithm {
  // 6 livelli di qualità come Anki
  static QUALITY_LEVELS = {
    0: { name: 'Blackout', factor: 0.0, color: '#FF0000' },
    1: { name: 'Sbagliato', factor: 0.6, color: '#FF6B6B' },
    2: { name: 'Difficile', factor: 0.8, color: '#FFA500' },
    3: { name: 'Corretto con sforzo', factor: 0.9, color: '#FFD700' },
    4: { name: 'Corretto', factor: 1.0, color: '#90EE90' },
    5: { name: 'Facile', factor: 1.3, color: '#00FF00' }
  };

  static calculate(card, quality) {
    let { easeFactor = 2.5, interval = 0, repetitions = 0 } = card;
    
    // Algoritmo SM-2+
    if (quality < 3) {
      // Reset su errore
      repetitions = 0;
      interval = 1;
    } else {
      // Incrementa repetitions
      repetitions += 1;
      
      // Calcola nuovo intervallo
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      
      // Aggiusta ease factor
      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      
      // Limiti
      if (easeFactor < 1.3) easeFactor = 1.3;
      if (easeFactor > 2.8) easeFactor = 2.8;
      if (interval > 365) interval = 365;
    }
    
    // Calcola prossima review
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    
    return {
      easeFactor,
      interval,
      repetitions,
      nextReview,
      quality,
      difficulty: this.calculateDifficulty(easeFactor, repetitions)
    };
  }
  
  static calculateDifficulty(easeFactor, repetitions) {
    // Calcola difficoltà percepita
    if (easeFactor < 1.5) return 'molto_difficile';
    if (easeFactor < 2.0) return 'difficile';
    if (easeFactor < 2.3) return 'normale';
    if (easeFactor < 2.6) return 'facile';
    return 'molto_facile';
  }
  
  static getOptimalReviewTime(cards) {
    // Trova carte da ripassare oggi
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueCards = cards.filter(card => {
      const reviewDate = new Date(card.nextReview);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    });
    
    // Ordina per priorità (ease factor basso = più difficile = priorità alta)
    return dueCards.sort((a, b) => a.easeFactor - b.easeFactor);
  }
  
  static generateHeatmap(reviews) {
    // Genera heatmap stile GitHub per visualizzare studio
    const heatmap = {};
    const today = new Date();
    
    // Ultimi 365 giorni
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      heatmap[dateStr] = 0;
    }
    
    // Conta reviews per giorno
    reviews.forEach(review => {
      const dateStr = new Date(review.date).toISOString().split('T')[0];
      if (heatmap[dateStr] !== undefined) {
        heatmap[dateStr]++;
      }
    });
    
    return heatmap;
  }
}

module.exports = SM2PlusAlgorithm;
