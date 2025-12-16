/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 📝 FEEDBACK & SEGNALAZIONI API
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db/database');
const fs = require('fs');
const path = require('path');

// File per salvare segnalazioni (backup se DB non disponibile)
const SEGNALAZIONI_FILE = path.join(__dirname, '../../data/segnalazioni.json');

// Carica segnalazioni esistenti
let segnalazioni = [];
try {
  if (fs.existsSync(SEGNALAZIONI_FILE)) {
    segnalazioni = JSON.parse(fs.readFileSync(SEGNALAZIONI_FILE, 'utf8'));
  }
} catch (e) {
  segnalazioni = [];
}

// Salva segnalazioni su file
const salvaSegnalazioni = () => {
  try {
    fs.writeFileSync(SEGNALAZIONI_FILE, JSON.stringify(segnalazioni, null, 2));
  } catch (e) {
    console.error('Errore salvataggio segnalazioni:', e);
  }
};

/**
 * POST /api/feedback/segnala-errore
 * Segnala un errore in un quiz
 */
router.post('/segnala-errore', async (req, res) => {
  try {
    const { quizId, domanda, materia, tipoErrore, descrizione, timestamp } = req.body;
    
    const segnalazione = {
      id: `seg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      quizId,
      domanda,
      materia,
      tipoErrore,
      descrizione,
      timestamp: timestamp || new Date().toISOString(),
      stato: 'nuovo', // nuovo, in_revisione, risolto, rifiutato
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    // Prova a salvare nel database
    try {
      await pool.query(
        `INSERT INTO "Segnalazioni" 
         ("id", "quizId", "domanda", "materia", "tipoErrore", "descrizione", "stato", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [segnalazione.id, quizId, domanda, materia, tipoErrore, descrizione, 'nuovo']
      );
    } catch (dbError) {
      // Se DB non disponibile, salva su file
      console.log('DB non disponibile, salvo su file');
    }
    
    // Salva sempre anche su file (backup)
    segnalazioni.push(segnalazione);
    salvaSegnalazioni();
    
    console.log(`📝 Nuova segnalazione: ${tipoErrore} - ${materia}`);
    
    res.status(201).json({
      success: true,
      message: 'Segnalazione ricevuta! Grazie per il tuo contributo.',
      id: segnalazione.id,
      xpBonus: 5
    });
  } catch (error) {
    console.error('Errore segnalazione:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Errore nel salvataggio della segnalazione' 
    });
  }
});

/**
 * GET /api/feedback/segnalazioni
 * Lista segnalazioni (admin)
 */
router.get('/segnalazioni', async (req, res) => {
  try {
    const { stato, materia, limit = 50 } = req.query;
    
    let filtered = [...segnalazioni];
    
    if (stato) {
      filtered = filtered.filter(s => s.stato === stato);
    }
    if (materia) {
      filtered = filtered.filter(s => s.materia === materia);
    }
    
    // Ordina per data (più recenti prima)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      success: true,
      totale: filtered.length,
      segnalazioni: filtered.slice(0, parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/feedback/segnalazioni/:id
 * Aggiorna stato segnalazione (admin)
 */
router.patch('/segnalazioni/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stato, note } = req.body;
    
    const index = segnalazioni.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Segnalazione non trovata' });
    }
    
    segnalazioni[index] = {
      ...segnalazioni[index],
      stato,
      note,
      updatedAt: new Date().toISOString()
    };
    
    salvaSegnalazioni();
    
    res.json({
      success: true,
      segnalazione: segnalazioni[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/feedback/generale
 * Feedback generale sull'app
 */
router.post('/generale', async (req, res) => {
  try {
    const { tipo, messaggio, email, voto } = req.body;
    
    const feedback = {
      id: `fb_${Date.now()}`,
      tipo, // suggerimento, bug, complimento, altro
      messaggio,
      email,
      voto, // 1-5
      timestamp: new Date().toISOString()
    };
    
    // Salva su file
    const feedbackFile = path.join(__dirname, '../../data/feedback-generale.json');
    let feedbacks = [];
    try {
      if (fs.existsSync(feedbackFile)) {
        feedbacks = JSON.parse(fs.readFileSync(feedbackFile, 'utf8'));
      }
    } catch (e) {}
    
    feedbacks.push(feedback);
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));
    
    res.status(201).json({
      success: true,
      message: 'Grazie per il tuo feedback!'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/feedback/stats
 * Statistiche segnalazioni
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totale: segnalazioni.length,
      perStato: {},
      perTipo: {},
      perMateria: {},
      ultimeSettimana: 0
    };
    
    const unaSettimanaFa = new Date();
    unaSettimanaFa.setDate(unaSettimanaFa.getDate() - 7);
    
    segnalazioni.forEach(s => {
      // Per stato
      stats.perStato[s.stato] = (stats.perStato[s.stato] || 0) + 1;
      // Per tipo
      stats.perTipo[s.tipoErrore] = (stats.perTipo[s.tipoErrore] || 0) + 1;
      // Per materia
      stats.perMateria[s.materia] = (stats.perMateria[s.materia] || 0) + 1;
      // Ultima settimana
      if (new Date(s.timestamp) > unaSettimanaFa) {
        stats.ultimeSettimana++;
      }
    });
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
