/**
 * Battle Service - Gestisce le sfide 1v1 in tempo reale
 */

class BattleService {
  constructor() {
    this.partite = new Map();
    this.statistiche = new Map();
  }

  generaCodice() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codice = '';
    for (let i = 0; i < 6; i++) {
      codice += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codice;
  }

  creaPartita(hostId, hostNome, modalita) {
    const codice = this.generaCodice();
    const partita = {
      codice,
      stato: 'attesa',
      modalita,
      host: { id: hostId, nome: hostNome, score: 0, risposte: [] },
      guest: null,
      quiz: [],
      domandaCorrente: 0,
      createdAt: Date.now()
    };
    this.partite.set(codice, partita);
    return partita;
  }

  joinPartita(codice, guestId, guestNome) {
    const partita = this.partite.get(codice);
    if (!partita) return { error: 'Partita non trovata' };
    if (partita.stato !== 'attesa') return { error: 'Partita già iniziata' };
    if (partita.guest) return { error: 'Partita piena' };
    
    partita.guest = { id: guestId, nome: guestNome, score: 0, risposte: [] };
    partita.stato = 'pronta';
    return partita;
  }

  getPartita(codice) {
    return this.partite.get(codice);
  }

  iniziaPartita(codice, quiz) {
    const partita = this.partite.get(codice);
    if (!partita || partita.stato !== 'pronta') return null;
    
    partita.quiz = quiz;
    partita.stato = 'in_corso';
    partita.domandaCorrente = 0;
    partita.inizioTempo = Date.now();
    return partita;
  }

  registraRisposta(codice, odice, risposta, tempo) {
    const partita = this.partite.get(codice);
    if (!partita) return null;
    
    const giocatore = partita.host.id === odice ? partita.host : (partita.guest?.id === odice ? partita.guest : null);
    if (!giocatore) return null;
    
    const domanda = partita.quiz[partita.domandaCorrente];
    const corretto = risposta === domanda.rispostaCorretta;
    
    giocatore.risposte.push({ risposta, corretto, tempo });
    if (corretto) giocatore.score++;
    
    return { corretto, scoreAttuale: giocatore.score };
  }

  prossimaDomanda(codice) {
    const partita = this.partite.get(codice);
    if (!partita) return null;
    
    partita.domandaCorrente++;
    if (partita.domandaCorrente >= partita.quiz.length) {
      partita.stato = 'terminata';
    }
    return partita;
  }

  terminaPartita(codice) {
    const partita = this.partite.get(codice);
    if (!partita) return null;
    
    partita.stato = 'terminata';
    
    // Aggiorna statistiche
    this.aggiornaStatistiche(partita.host.id, partita.host.score > partita.guest.score);
    this.aggiornaStatistiche(partita.guest.id, partita.guest.score > partita.host.score);
    
    return partita;
  }

  aggiornaStatistiche(userId, vittoria) {
    if (!this.statistiche.has(userId)) {
      this.statistiche.set(userId, { vittorie: 0, sconfitte: 0, pareggi: 0 });
    }
    const stats = this.statistiche.get(userId);
    if (vittoria === true) stats.vittorie++;
    else if (vittoria === false) stats.sconfitte++;
    else stats.pareggi++;
  }

  getStatistiche(userId) {
    return this.statistiche.get(userId) || { vittorie: 0, sconfitte: 0, pareggi: 0 };
  }

  pulisciPartiteVecchie() {
    const ora = Date.now();
    for (const [codice, partita] of this.partite) {
      if (ora - partita.createdAt > 3600000) {
        this.partite.delete(codice);
      }
    }
  }
}

module.exports = BattleService;
