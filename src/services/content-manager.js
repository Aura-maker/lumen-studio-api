/**
 * 📚 CONTENT MANAGER - Gestione centralizzata contenuti
 * Fornisce accesso unificato ai contenuti per tutti i sistemi
 */

class ContentManager {
  constructor() {
    this.contenuti = null;
    this.materieCaricate = false;
    this.initContenuti();
  }

  /**
   * Inizializza i contenuti
   */
  initContenuti() {
    try {
      // Carica contenuti completi tutte materie
      this.contenuti = require('../data/contenuti-tutte-materie-complete');
      this.materieCaricate = true;
      console.log('📚 ContentManager: Contenuti completi caricati');
      this.logStatistiche();
    } catch (error) {
      console.error('❌ ContentManager: Errore caricamento contenuti:', error.message);
      // Fallback contenuti minimi
      this.contenuti = this.getContenutiMinimi();
      this.materieCaricate = false;
    }
  }

  /**
   * Ottiene i contenuti
   */
  getContenuti() {
    return this.contenuti;
  }

  /**
   * Ottiene una materia specifica
   */
  getMateria(materiaId) {
    if (!this.contenuti || !this.contenuti[materiaId]) {
      console.log(`⚠️ Materia ${materiaId} non trovata`);
      return null;
    }
    return this.contenuti[materiaId];
  }

  /**
   * Ottiene un argomento specifico
   */
  getArgomento(materiaId, argomentoIndex) {
    const materia = this.getMateria(materiaId);
    if (!materia || !materia.argomenti || !materia.argomenti[argomentoIndex]) {
      console.log(`⚠️ Argomento ${argomentoIndex} non trovato in ${materiaId}`);
      return null;
    }
    return materia.argomenti[argomentoIndex];
  }

  /**
   * Ottiene un sottoargomento specifico
   */
  getSottoargomento(materiaId, argomentoIndex, sottoargomentoIndex) {
    const argomento = this.getArgomento(materiaId, argomentoIndex);
    if (!argomento || !argomento.sottoargomenti || !argomento.sottoargomenti[sottoargomentoIndex]) {
      console.log(`⚠️ Sottoargomento ${sottoargomentoIndex} non trovato`);
      return null;
    }
    
    // Aggiungi metadati utili
    const sottoargomento = argomento.sottoargomenti[sottoargomentoIndex];
    const materia = this.getMateria(materiaId);
    
    return {
      ...sottoargomento,
      materia: materia?.materia?.nome || materiaId,
      materiaId: materiaId,
      argomento: argomento.titolo || argomento.nome || argomento.id,
      argomentoIndex: argomentoIndex,
      sottoargomentoIndex: sottoargomentoIndex
    };
  }

  /**
   * Ottiene le materie disponibili
   */
  getMaterieDisponibili() {
    if (!this.contenuti) return [];
    
    return Object.keys(this.contenuti).map(id => {
      const materia = this.contenuti[id];
      return {
        id,
        nome: materia.materia?.nome || id,
        descrizione: materia.materia?.descrizione || '',
        colore: materia.materia?.colore || '#4A90E2',
        icona: materia.materia?.icona || '📚',
        argomenti: materia.argomenti?.length || 0,
        sottoargomenti: this.contaSottoargomenti(materia)
      };
    });
  }

  /**
   * Conta i sottoargomenti totali di una materia
   */
  contaSottoargomenti(materia) {
    if (!materia.argomenti) return 0;
    return materia.argomenti.reduce((tot, arg) => 
      tot + (arg.sottoargomenti?.length || 0), 0
    );
  }

  /**
   * Ottiene sottoargomento casuale per test
   */
  getSottoargomentoRandom(materiaId = null) {
    const materie = materiaId ? [materiaId] : Object.keys(this.contenuti);
    const materiaRandom = materie[Math.floor(Math.random() * materie.length)];
    const materia = this.getMateria(materiaRandom);
    
    if (!materia || !materia.argomenti || materia.argomenti.length === 0) {
      return null;
    }
    
    const argIndex = Math.floor(Math.random() * materia.argomenti.length);
    const argomento = materia.argomenti[argIndex];
    
    if (!argomento.sottoargomenti || argomento.sottoargomenti.length === 0) {
      return null;
    }
    
    const sottoIndex = Math.floor(Math.random() * argomento.sottoargomenti.length);
    return this.getSottoargomento(materiaRandom, argIndex, sottoIndex);
  }

  /**
   * Log statistiche contenuti
   */
  logStatistiche() {
    const materie = this.getMaterieDisponibili();
    console.log(`📊 ContentManager Statistiche:`);
    console.log(`  • Materie caricate: ${materie.length}`);
    
    let totArgomenti = 0;
    let totSottoargomenti = 0;
    
    materie.forEach(m => {
      totArgomenti += m.argomenti;
      totSottoargomenti += m.sottoargomenti;
      console.log(`    - ${m.nome}: ${m.argomenti} argomenti, ${m.sottoargomenti} sottoargomenti`);
    });
    
    console.log(`  • Totale argomenti: ${totArgomenti}`);
    console.log(`  • Totale sottoargomenti: ${totSottoargomenti}`);
  }

  /**
   * Contenuti minimi di fallback
   */
  getContenutiMinimi() {
    return {
      italiano: {
        materia: { 
          nome: '📘 Italiano', 
          descrizione: 'Letteratura italiana', 
          colore: '#4A90E2' 
        },
        argomenti: [{
          titolo: 'Argomento di test',
          sottoargomenti: [{
            titolo: 'Sottoargomento di test',
            riassunto: 'Questo è un contenuto di test per verificare il funzionamento del sistema.'
          }]
        }]
      }
    };
  }
}

// Singleton instance
let instance = null;

function getContentManager() {
  if (!instance) {
    instance = new ContentManager();
  }
  return instance;
}

module.exports = {
  ContentManager,
  getContentManager
};
