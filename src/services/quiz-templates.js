/**
 * 🎯 100+ TEMPLATE QUIZ PEDAGOGICI
 */

const quizTemplates = {
  // Bloom's Taxonomy - 6 livelli
  conoscenza: [
    "Che cos'è {termine}?",
    "Chi {azione}?",
    "Quando {evento}?",
    "Dove {luogo}?",
    "Quale {elemento}?"
  ],
  
  comprensione: [
    "Perché {evento} è importante?",
    "Spiega il significato di {concetto}",
    "Qual è la differenza tra {A} e {B}?",
    "Come {elemento} influenza {risultato}?",
    "Cosa implica {affermazione}?"
  ],
  
  applicazione: [
    "In quale situazione si applica {regola}?",
    "Come useresti {concetto} per {obiettivo}?",
    "Quale esempio dimostra {teoria}?",
    "Se {condizione}, allora?",
    "Risolvi: {problema}"
  ],
  
  analisi: [
    "Qual è la causa di {evento}?",
    "Analizza la relazione tra {A} e {B}",
    "Quali fattori hanno determinato {risultato}?",
    "Identifica gli elementi di {sistema}",
    "Cosa distingue {A} da {B}?"
  ],
  
  sintesi: [
    "Quale conclusione emerge da {dati}?",
    "Sintetizza {argomento} in:",
    "L'idea centrale è:",
    "Combinando {A} e {B} otteniamo:",
    "Il punto chiave di {tema} è:"
  ],
  
  valutazione: [
    "Quale interpretazione è più valida?",
    "Valuta l'importanza di {elemento}",
    "Quale critica è più fondata?",
    "Il contributo più significativo è:",
    "Giudica l'efficacia di {metodo}"
  ]
};

// Distrattori intelligenti per errori comuni
const distrattoriIntelligenti = {
  date: (annoCorretto, contesto) => {
    const distrattori = [];
    
    // Eventi vicini temporalmente
    if (contesto.includes('guerra')) {
      const guerre = [1914, 1939, 1861, 1848, 1815];
      distrattori.push(...guerre.filter(g => Math.abs(g - annoCorretto) > 5));
    }
    
    // Date confuse comunemente
    const confusioni = {
      1492: [1489, 1498, 1512], // Scoperta America
      1789: [1776, 1793, 1799], // Rivoluzione francese
      1861: [1860, 1865, 1870], // Unità Italia
    };
    
    if (confusioni[annoCorretto]) {
      distrattori.push(...confusioni[annoCorretto]);
    } else {
      // Default: anni plausibili
      distrattori.push(
        annoCorretto + 10,
        annoCorretto - 5,
        annoCorretto + Math.floor(Math.random() * 20 - 10)
      );
    }
    
    return distrattori.slice(0, 3);
  },
  
  personaggi: (personaCorretta, materia) => {
    const contemporanei = {
      'Foscolo': ['Leopardi', 'Manzoni', 'Alfieri'],
      'Leopardi': ['Foscolo', 'Manzoni', 'Pascoli'],
      'Verga': ['Capuana', 'De Roberto', 'Pirandello'],
      'Pirandello': ['Svevo', 'Verga', 'D\'Annunzio']
    };
    
    return contemporanei[personaCorretta] || ['Autore A', 'Autore B', 'Autore C'];
  }
};

module.exports = { quizTemplates, distrattoriIntelligenti };
