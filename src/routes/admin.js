const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const tutteMaterie = require('../data/tutte-materie');

// POST /api/admin/crea-materie - Crea tutte le 10 materie
router.post('/crea-materie', async (req, res) => {
  try {
    console.log('📚 Creazione materie ImparaFacile...');

    const materieDaCreare = [
      { nome: '📘 Italiano', emoji: '📘', colore: '#4A90E2', ordine: 1 },
      { nome: '📗 Storia', emoji: '📗', colore: '#7ED321', ordine: 2 },
      { nome: '📙 Filosofia', emoji: '📙', colore: '#F5A623', ordine: 3 },
      { nome: '⚛️ Fisica', emoji: '⚛️', colore: '#9013FE', ordine: 4 },
      { nome: '🧮 Matematica', emoji: '🧮', colore: '#50E3C2', ordine: 5 },
      { nome: '🔬 Scienze', emoji: '🔬', colore: '#4ECDC4', ordine: 6 },
      { nome: '🎨 Arte', emoji: '🎨', colore: '#FF6B6B', ordine: 7 },
      { nome: '🌍 Inglese', emoji: '🌍', colore: '#1E90FF', ordine: 8 },
      { nome: '📘 Latino', emoji: '📘', colore: '#CD853F', ordine: 9 },
      { nome: '✝️ Religione', emoji: '✝️', colore: '#FFA500', ordine: 10 }
    ];

    const risultati = [];

    for (const m of materieDaCreare) {
      // Trova descrizione da tutte-materie
      let descrizione = 'Materia scolastica';
      for (const [key, valore] of Object.entries(tutteMaterie)) {
        if (valore.materia && valore.materia.nome === m.nome) {
          descrizione = valore.materia.descrizione;
          break;
        }
      }

      const materia = await prisma.materia.upsert({
        where: { nome: m.nome },
        update: { emoji: m.emoji, descrizione, colore: m.colore, ordine: m.ordine },
        create: {
          nome: m.nome,
          emoji: m.emoji,
          descrizione: descrizione,
          colore: m.colore,
          ordine: m.ordine
        }
      });
      
      risultati.push(materia);
      console.log(`✅ ${materia.nome}`);
    }

    const count = await prisma.materia.count();
    
    res.json({ 
      successo: true, 
      materie: risultati, 
      totale: count,
      messaggio: `${risultati.length} materie create/aggiornate` 
    });
  } catch (err) {
    console.error('Errore creazione materie:', err);
    res.status(500).json({ errore: err.message });
  }
});

module.exports = router;
