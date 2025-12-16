/**
 * API SIMULAZIONI - Route per simulazioni d'esame
 */
const express = require('express');
const router = express.Router();

// Generatori esami
let generatoreMatematica, generatoreItaliano;
try {
  const GeneratoreEsamiMatematica = require('../services/esami-matematica-generator');
  const GeneratoreEsamiItaliano = require('../services/esami-italiano-generator');
  generatoreMatematica = new GeneratoreEsamiMatematica();
  generatoreItaliano = new GeneratoreEsamiItaliano();
  generatoreMatematica.genera(50);
  generatoreItaliano.genera(50);
  console.log('✅ Simulazioni: 100 esami pronti (50 Mat + 50 Ita)');
} catch (e) {
  console.log('⚠️ Generatori esami non disponibili:', e.message);
}

// GET /api/simulazioni - Lista tutte le simulazioni
router.get('/', (req, res) => {
  const { materia, page = 1, limit = 12 } = req.query;
  
  let simulazioni = [];
  
  // Aggiungi esami matematica
  if (generatoreMatematica && (!materia || materia === 'matematica')) {
    generatoreMatematica.esami.forEach((e, idx) => {
      simulazioni.push({
        id: `mat_${e.id || idx}`,
        nome: e.titolo || `Simulazione Matematica ${idx + 1}`,
        descrizione: e.sottotitolo || 'Seconda prova - Liceo Scientifico',
        materia: 'matematica',
        difficolta: e.metadata?.difficolta || 'standard',
        durata: 300,
        numDomande: 2 + 8, // 2 problemi + 8 quesiti
        tipo: 'MATEMATICA'
      });
    });
  }
  
  // Aggiungi esami italiano
  if (generatoreItaliano && (!materia || materia === 'italiano')) {
    generatoreItaliano.esami.forEach((e, idx) => {
      simulazioni.push({
        id: `ita_${e.id || idx}`,
        nome: e.titolo || `Simulazione Italiano ${idx + 1}`,
        descrizione: e.sottotitolo || 'Prima prova - Tutte le tipologie',
        materia: 'italiano',
        difficolta: e.metadata?.difficolta || 'standard',
        durata: 360,
        numDomande: 7, // 7 tracce
        tipo: 'ITALIANO'
      });
    });
  }
  
  // Paginazione
  const start = (parseInt(page) - 1) * parseInt(limit);
  const end = start + parseInt(limit);
  const paginatedSimulazioni = simulazioni.slice(start, end);
  
  res.json({
    simulazioni: paginatedSimulazioni,
    totale: simulazioni.length,
    pagina: parseInt(page),
    totalePagine: Math.ceil(simulazioni.length / parseInt(limit))
  });
});

// POST /api/simulazioni/avvia - Avvia una simulazione
router.post('/avvia', (req, res) => {
  const { simulazioneId } = req.body;
  
  if (!simulazioneId) {
    return res.status(400).json({ error: 'ID simulazione richiesto' });
  }
  
  let simulazione = null;
  
  // Cerca in matematica
  if (simulazioneId.startsWith('mat_')) {
    const id = simulazioneId.replace('mat_', '');
    const esame = generatoreMatematica?.esami.find(e => e.id === id || e.id === parseInt(id));
    if (esame) {
      simulazione = {
        id: simulazioneId,
        materia: 'MATEMATICA - Seconda Prova',
        tipo: 'Liceo Scientifico',
        istruzioni: esame.istruzioni || 'Il candidato risolva uno dei due problemi e risponda a 4 quesiti.',
        strumenti_ammessi: 'Calcolatrice non programmabile',
        problemi: esame.problemi || [],
        quesiti: esame.quesiti || [],
        soluzioni: esame.soluzioni || null
      };
    }
  }
  
  // Cerca in italiano
  if (simulazioneId.startsWith('ita_')) {
    const id = simulazioneId.replace('ita_', '');
    const idx = parseInt(id);
    const esame = generatoreItaliano?.esami[idx] || generatoreItaliano?.esami.find(e => e.id === id);
    if (esame) {
      simulazione = {
        id: simulazioneId,
        materia: 'ITALIANO',
        tipo: 'Prima Prova',
        istruzioni: 'Scegli una delle seguenti tracce e svolgi il tema proposto.',
        tracce: esame.tracce || []
      };
    }
  }
  
  if (!simulazione) {
    return res.status(404).json({ error: 'Simulazione non trovata' });
  }
  
  res.json({
    success: true,
    simulazione
  });
});

// GET /api/simulazioni/:id/soluzioni - Ottieni soluzioni
router.get('/:id/soluzioni', (req, res) => {
  const { id } = req.params;
  
  if (id.startsWith('mat_')) {
    const esameId = id.replace('mat_', '');
    const esame = generatoreMatematica?.esami.find(e => e.id === esameId || e.id === parseInt(esameId));
    if (esame && esame.soluzioni) {
      return res.json({
        success: true,
        soluzioni: esame.soluzioni
      });
    }
  }
  
  res.status(404).json({ error: 'Soluzioni non disponibili' });
});

module.exports = router;
