/**
 * 📈 ADAPTIVE DIFFICULTY - Sistema Difficoltà Adattiva
 * Regola automaticamente la difficoltà dei quiz in base alle performance dell'utente
 * 
 * Basato su:
 * - Item Response Theory (IRT) semplificata
 * - Spaced Repetition (SM-2 modificato)
 * - Zone of Proximal Development (ZPD)
 * 
 * L'obiettivo è mantenere lo studente nella "zona ottimale" di apprendimento:
 * - Non troppo facile (noia)
 * - Non troppo difficile (frustrazione)
 * - Target: 70-85% di accuratezza
 */

class AdaptiveDifficulty {
  constructor(options = {}) {
    // Configurazione
    this.config = {
      // Range difficoltà
      difficoltaMinima: 1,
      difficoltaMassima: 5,
      
      // Target accuratezza (ZPD)
      accuratezzaTarget: {
        minima: 0.65,    // Sotto = domande troppo difficili
        ottimale: 0.75,  // Punto ideale
        massima: 0.85    // Sopra = domande troppo facili
      },
      
      // Velocità adattamento
      velocitaAdattamento: options.velocitaAdattamento || 0.15,
      
      // Finestra analisi (ultime N risposte)
      finestraAnalisi: options.finestraAnalisi || 20,
      
      // Peso tempo risposta
      pesoTempo: options.pesoTempo || 0.2,
      
      // Soglie tempo (secondi)
      tempoOttimale: {
        facile: 10,
        medio: 20,
        difficile: 40
      }
    };

    // Stato utente
    this.statoUtente = new Map(); // userId -> stato

    // Modello IRT semplificato per le domande
    this.difficoltaDomande = new Map(); // questionId -> parametri

    console.log('📈 AdaptiveDifficulty inizializzato');
  }

  // ==================== GESTIONE STATO UTENTE ====================

  /**
   * 👤 Inizializza o ottieni stato utente
   */
  getStatoUtente(userId) {
    if (!this.statoUtente.has(userId)) {
      this.statoUtente.set(userId, {
        livelloStimato: 2.5,           // Difficoltà stimata (1-5)
        varianza: 1.0,                  // Incertezza sulla stima
        storico: [],                    // Ultime risposte
        statistiche: {
          totaleRisposte: 0,
          corrette: 0,
          tempoMedioMs: 0,
          streak: 0,
          maxStreak: 0
        },
        perArgomento: new Map(),        // Statistiche per argomento
        ultimoAggiornamento: new Date().toISOString()
      });
    }
    return this.statoUtente.get(userId);
  }

  /**
   * 📊 Aggiorna stato dopo risposta
   */
  aggiornaStato(userId, risposta) {
    const stato = this.getStatoUtente(userId);
    
    // Aggiungi a storico
    stato.storico.push({
      questionId: risposta.questionId,
      corretta: risposta.corretta,
      tempoMs: risposta.tempoMs,
      difficolta: risposta.difficolta,
      livelloBloom: risposta.livelloBloom,
      argomento: risposta.argomento,
      timestamp: new Date().toISOString()
    });

    // Mantieni solo ultime N risposte
    if (stato.storico.length > this.config.finestraAnalisi * 2) {
      stato.storico = stato.storico.slice(-this.config.finestraAnalisi);
    }

    // Aggiorna statistiche generali
    stato.statistiche.totaleRisposte++;
    if (risposta.corretta) {
      stato.statistiche.corrette++;
      stato.statistiche.streak++;
      stato.statistiche.maxStreak = Math.max(
        stato.statistiche.maxStreak,
        stato.statistiche.streak
      );
    } else {
      stato.statistiche.streak = 0;
    }

    // Aggiorna tempo medio
    stato.statistiche.tempoMedioMs = (
      stato.statistiche.tempoMedioMs * (stato.statistiche.totaleRisposte - 1) +
      risposta.tempoMs
    ) / stato.statistiche.totaleRisposte;

    // Aggiorna statistiche per argomento
    if (risposta.argomento) {
      if (!stato.perArgomento.has(risposta.argomento)) {
        stato.perArgomento.set(risposta.argomento, {
          totale: 0,
          corrette: 0,
          livelloStimato: 2.5
        });
      }
      const statArg = stato.perArgomento.get(risposta.argomento);
      statArg.totale++;
      if (risposta.corretta) statArg.corrette++;
      
      // Aggiorna livello argomento
      statArg.livelloStimato = this.calcolaLivelloArgomento(statArg, risposta);
    }

    // Ricalcola livello stimato generale
    this.aggiornaLivelloStimato(stato, risposta);

    stato.ultimoAggiornamento = new Date().toISOString();

    return stato;
  }

  // ==================== CALCOLO DIFFICOLTA ====================

  /**
   * 🧮 Aggiorna livello stimato usando IRT semplificato
   */
  aggiornaLivelloStimato(stato, risposta) {
    // Formula IRT semplificata:
    // θ(nuovo) = θ(vecchio) + α * (risposta - probabilità_attesa)
    
    const difficoltaDomanda = risposta.difficolta || 3;
    const theta = stato.livelloStimato;
    
    // Probabilità attesa di risposta corretta (modello logistico)
    const probabilitaAttesa = this.calcolaProbabilita(theta, difficoltaDomanda);
    
    // Outcome (1 = corretto, 0 = sbagliato)
    const outcome = risposta.corretta ? 1 : 0;
    
    // Fattore tempo (risposta veloce = più sicurezza)
    const fattoreTempo = this.calcolaFattoreTempo(risposta.tempoMs, difficoltaDomanda);
    
    // Aggiustamento con velocità adattamento
    const alpha = this.config.velocitaAdattamento * (1 + fattoreTempo * this.config.pesoTempo);
    
    // Delta = differenza tra outcome e attesa
    const delta = outcome - probabilitaAttesa;
    
    // Nuovo theta
    let nuovoTheta = theta + alpha * delta * (1 + stato.varianza);
    
    // Clamp al range valido
    nuovoTheta = Math.max(this.config.difficoltaMinima, 
                          Math.min(this.config.difficoltaMassima, nuovoTheta));
    
    // Aggiorna varianza (diminuisce con più dati)
    stato.varianza = Math.max(0.1, stato.varianza * 0.98);
    
    stato.livelloStimato = nuovoTheta;
  }

  /**
   * 📐 Calcola probabilità risposta corretta (modello logistico)
   */
  calcolaProbabilita(theta, difficolta) {
    // P(corretto) = 1 / (1 + e^-(theta - difficolta))
    const exp = Math.exp(-(theta - difficolta));
    return 1 / (1 + exp);
  }

  /**
   * ⏱️ Calcola fattore tempo
   */
  calcolaFattoreTempo(tempoMs, difficolta) {
    const tempoSec = tempoMs / 1000;
    const tempoOttimale = 
      difficolta <= 2 ? this.config.tempoOttimale.facile :
      difficolta <= 4 ? this.config.tempoOttimale.medio :
      this.config.tempoOttimale.difficile;
    
    // Normalizza: veloce = positivo, lento = negativo
    const rapporto = tempoOttimale / Math.max(tempoSec, 1);
    return Math.tanh(rapporto - 1); // Range [-1, 1]
  }

  /**
   * 📊 Calcola livello per argomento specifico
   */
  calcolaLivelloArgomento(statArg, risposta) {
    const accuratezza = statArg.corrette / Math.max(statArg.totale, 1);
    const livelloBase = statArg.livelloStimato;
    
    // Aggiusta basandosi su accuratezza
    let aggiustamento = 0;
    
    if (accuratezza > this.config.accuratezzaTarget.massima) {
      // Troppo facile, alza difficoltà
      aggiustamento = 0.2;
    } else if (accuratezza < this.config.accuratezzaTarget.minima) {
      // Troppo difficile, abbassa
      aggiustamento = -0.2;
    }
    
    const nuovoLivello = livelloBase + aggiustamento;
    return Math.max(1, Math.min(5, nuovoLivello));
  }

  // ==================== SELEZIONE DOMANDE ====================

  /**
   * 🎯 Seleziona difficoltà ottimale per prossima domanda
   */
  selezionaDifficolta(userId, argomento = null) {
    const stato = this.getStatoUtente(userId);
    
    // Livello base
    let livelloTarget = stato.livelloStimato;
    
    // Se c'è argomento, usa livello specifico
    if (argomento && stato.perArgomento.has(argomento)) {
      const statArg = stato.perArgomento.get(argomento);
      // Media pesata tra generale e argomento
      livelloTarget = livelloTarget * 0.4 + statArg.livelloStimato * 0.6;
    }
    
    // Aggiungi variazione per esplorazione
    const variazione = (Math.random() - 0.5) * stato.varianza;
    livelloTarget += variazione;
    
    // Considera streak per motivazione
    if (stato.statistiche.streak >= 5) {
      // Streak positiva: occasionalmente proponi sfida
      if (Math.random() < 0.3) {
        livelloTarget += 0.5;
      }
    } else if (stato.statistiche.streak === 0 && stato.storico.length > 3) {
      // Dopo errori: facilita un po'
      livelloTarget -= 0.3;
    }
    
    // Clamp finale
    livelloTarget = Math.round(
      Math.max(1, Math.min(5, livelloTarget))
    );
    
    return {
      difficolta: livelloTarget,
      confidence: 1 - stato.varianza,
      motivazione: this.generaMotivazioneDifficolta(stato, livelloTarget)
    };
  }

  /**
   * 📝 Genera motivazione per la scelta della difficoltà
   */
  generaMotivazioneDifficolta(stato, livello) {
    const ultimoN = stato.storico.slice(-10);
    const accuratezzaRecente = ultimoN.length > 0 ?
      ultimoN.filter(r => r.corretta).length / ultimoN.length : 0.5;

    if (accuratezzaRecente > 0.85) {
      return 'Ottima performance! Ti proponiamo una sfida più impegnativa.';
    } else if (accuratezzaRecente < 0.5) {
      return 'Consolidiamo le basi con domande più accessibili.';
    } else if (stato.statistiche.streak >= 3) {
      return 'Continua così! Manteniamo il ritmo.';
    } else {
      return 'Domanda calibrata sul tuo livello attuale.';
    }
  }

  /**
   * 🎲 Filtra domande per difficoltà appropriata
   */
  filtraDomande(domande, userId, argomento = null) {
    const { difficolta, confidence } = this.selezionaDifficolta(userId, argomento);
    
    // Range accettabile (±1 dal target, più ampio se bassa confidence)
    const margine = 1 + (1 - confidence);
    const min = Math.max(1, difficolta - margine);
    const max = Math.min(5, difficolta + margine);
    
    // Filtra domande nel range
    const filtrate = domande.filter(d => {
      const diff = d.livello || d.difficolta || 3;
      return diff >= min && diff <= max;
    });
    
    // Se non ci sono abbastanza domande, allarga range
    if (filtrate.length < 3) {
      return domande;
    }
    
    // Ordina per vicinanza al target
    return filtrate.sort((a, b) => {
      const diffA = Math.abs((a.livello || 3) - difficolta);
      const diffB = Math.abs((b.livello || 3) - difficolta);
      return diffA - diffB;
    });
  }

  // ==================== SPACED REPETITION ====================

  /**
   * 📅 Calcola prossima revisione (SM-2 modificato)
   */
  calcolaProssimaRevisione(userId, questionId, risposta) {
    const stato = this.getStatoUtente(userId);
    
    // Ottieni o crea stato domanda
    if (!this.difficoltaDomande.has(questionId)) {
      this.difficoltaDomande.set(questionId, {
        intervalloGiorni: 1,
        facilita: 2.5,
        ripetizioni: 0
      });
    }
    
    const statoDomanda = this.difficoltaDomande.get(questionId);
    
    // Calcola qualità risposta (0-5)
    const qualita = this.calcolaQualitaRisposta(risposta);
    
    if (qualita < 3) {
      // Risposta insufficiente: reset
      statoDomanda.ripetizioni = 0;
      statoDomanda.intervalloGiorni = 1;
    } else {
      // Risposta sufficiente: aumenta intervallo
      statoDomanda.ripetizioni++;
      
      if (statoDomanda.ripetizioni === 1) {
        statoDomanda.intervalloGiorni = 1;
      } else if (statoDomanda.ripetizioni === 2) {
        statoDomanda.intervalloGiorni = 6;
      } else {
        statoDomanda.intervalloGiorni *= statoDomanda.facilita;
      }
    }
    
    // Aggiorna facilità
    statoDomanda.facilita = Math.max(1.3, 
      statoDomanda.facilita + 0.1 - (5 - qualita) * (0.08 + (5 - qualita) * 0.02)
    );
    
    // Prossima data
    const prossimaData = new Date();
    prossimaData.setDate(prossimaData.getDate() + Math.round(statoDomanda.intervalloGiorni));
    
    return {
      prossimaData: prossimaData.toISOString(),
      intervalloGiorni: Math.round(statoDomanda.intervalloGiorni),
      facilita: statoDomanda.facilita,
      ripetizioni: statoDomanda.ripetizioni
    };
  }

  /**
   * ⭐ Calcola qualità risposta (0-5) per SM-2
   */
  calcolaQualitaRisposta(risposta) {
    if (!risposta.corretta) {
      // Sbagliata: 0-2 in base al tempo
      return risposta.tempoMs < 5000 ? 1 : 0;
    }
    
    // Corretta: 3-5 in base a tempo e difficoltà
    const tempoSec = risposta.tempoMs / 1000;
    const tempoOttimale = (risposta.difficolta || 3) * 8;
    
    if (tempoSec <= tempoOttimale * 0.5) {
      return 5; // Molto veloce = perfetto
    } else if (tempoSec <= tempoOttimale) {
      return 4; // Normale
    } else {
      return 3; // Lento ma corretto
    }
  }

  // ==================== ANALISI E REPORT ====================

  /**
   * 📊 Genera analisi dettagliata per utente
   */
  generaAnalisi(userId) {
    const stato = this.getStatoUtente(userId);
    const storico = stato.storico.slice(-this.config.finestraAnalisi);
    
    // Accuratezza recente
    const corrette = storico.filter(r => r.corretta).length;
    const accuratezza = storico.length > 0 ? corrette / storico.length : 0;
    
    // Trend (confronto con prima metà vs seconda metà)
    const meta = Math.floor(storico.length / 2);
    const primaMeta = storico.slice(0, meta);
    const secondaMeta = storico.slice(meta);
    
    const accPrima = primaMeta.filter(r => r.corretta).length / Math.max(primaMeta.length, 1);
    const accSeconda = secondaMeta.filter(r => r.corretta).length / Math.max(secondaMeta.length, 1);
    const trend = accSeconda - accPrima;
    
    // Analisi per livello
    const perLivello = {};
    for (let i = 1; i <= 5; i++) {
      const domandeLivello = storico.filter(r => r.difficolta === i);
      perLivello[i] = {
        totale: domandeLivello.length,
        corrette: domandeLivello.filter(r => r.corretta).length,
        accuratezza: domandeLivello.length > 0 ?
          domandeLivello.filter(r => r.corretta).length / domandeLivello.length : null
      };
    }
    
    // Punti di forza e debolezza per argomento
    const puntiForza = [];
    const puntiDebolezza = [];
    
    for (const [argomento, stat] of stato.perArgomento) {
      const acc = stat.corrette / Math.max(stat.totale, 1);
      if (acc >= 0.8 && stat.totale >= 5) {
        puntiForza.push({ argomento, accuratezza: acc });
      } else if (acc < 0.6 && stat.totale >= 3) {
        puntiDebolezza.push({ argomento, accuratezza: acc });
      }
    }
    
    return {
      livelloStimato: stato.livelloStimato,
      accuratezzaRecente: accuratezza,
      trend: trend > 0.05 ? 'miglioramento' : trend < -0.05 ? 'calo' : 'stabile',
      trendNumerico: trend,
      statistiche: stato.statistiche,
      perLivello,
      puntiForza: puntiForza.sort((a, b) => b.accuratezza - a.accuratezza),
      puntiDebolezza: puntiDebolezza.sort((a, b) => a.accuratezza - b.accuratezza),
      raccomandazioni: this.generaRaccomandazioni(stato, accuratezza, trend)
    };
  }

  /**
   * 💡 Genera raccomandazioni personalizzate
   */
  generaRaccomandazioni(stato, accuratezza, trend) {
    const raccomandazioni = [];
    
    if (accuratezza < 0.6) {
      raccomandazioni.push({
        tipo: 'ripasso',
        messaggio: 'Ti consigliamo di ripassare i concetti base prima di continuare.',
        priorita: 'alta'
      });
    }
    
    if (trend < -0.1) {
      raccomandazioni.push({
        tipo: 'pausa',
        messaggio: 'Forse è il momento di fare una pausa. Il riposo aiuta la memorizzazione!',
        priorita: 'media'
      });
    }
    
    if (stato.statistiche.streak >= 10) {
      raccomandazioni.push({
        tipo: 'sfida',
        messaggio: 'Ottima serie! Pronto per domande più impegnative?',
        priorita: 'bassa'
      });
    }
    
    if (accuratezza > 0.9 && stato.storico.length > 20) {
      raccomandazioni.push({
        tipo: 'avanzamento',
        messaggio: 'Stai dominando questo livello! Passa al successivo.',
        priorita: 'media'
      });
    }
    
    // Argomenti da riprendere
    for (const [argomento, stat] of stato.perArgomento) {
      if (stat.totale >= 5 && stat.corrette / stat.totale < 0.5) {
        raccomandazioni.push({
          tipo: 'argomento',
          messaggio: `Riprendi l'argomento "${argomento}" con calma.`,
          priorita: 'alta',
          argomento
        });
      }
    }
    
    return raccomandazioni;
  }

  // ==================== PERSISTENZA ====================

  /**
   * 💾 Esporta stato per salvataggio
   */
  esportaStato(userId) {
    const stato = this.getStatoUtente(userId);
    return {
      userId,
      livelloStimato: stato.livelloStimato,
      varianza: stato.varianza,
      storico: stato.storico,
      statistiche: stato.statistiche,
      perArgomento: Object.fromEntries(stato.perArgomento),
      ultimoAggiornamento: stato.ultimoAggiornamento
    };
  }

  /**
   * 📥 Importa stato salvato
   */
  importaStato(dati) {
    const stato = {
      livelloStimato: dati.livelloStimato || 2.5,
      varianza: dati.varianza || 1.0,
      storico: dati.storico || [],
      statistiche: dati.statistiche || {
        totaleRisposte: 0,
        corrette: 0,
        tempoMedioMs: 0,
        streak: 0,
        maxStreak: 0
      },
      perArgomento: new Map(Object.entries(dati.perArgomento || {})),
      ultimoAggiornamento: dati.ultimoAggiornamento || new Date().toISOString()
    };
    
    this.statoUtente.set(dati.userId, stato);
  }
}

module.exports = AdaptiveDifficulty;
