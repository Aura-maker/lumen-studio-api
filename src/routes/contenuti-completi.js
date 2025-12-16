const express = require('express');
const router = express.Router();
const contenuti = require('../data/contenuti-tutte-materie-complete');

// GET /api/contenuti/materie - Tutte le materie
router.get('/materie', (req, res) => {
  const materie = Object.values(contenuti).map(m => ({
    id: m.materia.nome.toLowerCase().replace(/[^a-z]/g, ''),
    nome: m.materia.nome,
    descrizione: m.materia.descrizione,
    colore: m.materia.colore,
    totaleArgomenti: m.argomenti.length,
    totaleSottoargomenti: m.argomenti.reduce((sum, arg) => sum + (arg.sottoargomenti?.length || 0), 0)
  }));
  
  res.json({ materie, totale: materie.length });
});

// GET /api/contenuti/materia/:nome - Singola materia con argomenti
router.get('/materia/:nome', (req, res) => {
  const { nome } = req.params;
  const materiaKey = Object.keys(contenuti).find(k => 
    contenuti[k].materia.nome.toLowerCase().includes(nome.toLowerCase()) ||
    k.toLowerCase() === nome.toLowerCase()
  );
  
  if (!materiaKey) {
    return res.status(404).json({ errore: 'Materia non trovata' });
  }
  
  const materiaData = contenuti[materiaKey];
  res.json(materiaData);
});

// GET /api/contenuti/argomento/:materiaId/:argomentoId - Singolo argomento
router.get('/argomento/:materiaId/:argomentoId', (req, res) => {
  const { materiaId, argomentoId } = req.params;
  
  const materiaKey = Object.keys(contenuti).find(k => k === materiaId);
  if (!materiaKey) {
    return res.status(404).json({ errore: 'Materia non trovata' });
  }
  
  const materia = contenuti[materiaKey];
  const argomento = materia.argomenti.find(a => 
    a.titolo.toLowerCase().includes(argomentoId.toLowerCase())
  );
  
  if (!argomento) {
    return res.status(404).json({ errore: 'Argomento non trovato' });
  }
  
  res.json({
    materia: materia.materia.nome,
    argomento
  });
});

// GET /api/contenuti/sottoargomento/:materiaId/:argomentoIndex/:sottoIndex
router.get('/sottoargomento/:materiaId/:argomentoIndex/:sottoIndex', (req, res) => {
  const { materiaId, argomentoIndex, sottoIndex } = req.params;
  
  const materia = contenuti[materiaId];
  if (!materia) {
    return res.status(404).json({ errore: 'Materia non trovata' });
  }
  
  const argomento = materia.argomenti[parseInt(argomentoIndex)];
  if (!argomento) {
    return res.status(404).json({ errore: 'Argomento non trovato' });
  }
  
  const sottoargomento = argomento.sottoargomenti[parseInt(sottoIndex)];
  if (!sottoargomento) {
    return res.status(404).json({ errore: 'Sottoargomento non trovato' });
  }
  
  res.json({
    materia: materia.materia.nome,
    argomento: argomento.titolo,
    sottoargomento
  });
});

// GET /api/contenuti/ricerca - Ricerca nei contenuti
router.get('/ricerca', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 3) {
    return res.status(400).json({ errore: 'Query troppo corta (minimo 3 caratteri)' });
  }
  
  const risultati = [];
  const query = q.toLowerCase();
  
  for (const [key, materiaData] of Object.entries(contenuti)) {
    for (const argomento of materiaData.argomenti) {
      for (const sotto of argomento.sottoargomenti || []) {
        if (sotto.titolo.toLowerCase().includes(query) ||
            sotto.riassunto.toLowerCase().includes(query)) {
          risultati.push({
            materia: materiaData.materia.nome,
            argomento: argomento.titolo,
            sottoargomento: sotto.titolo,
            snippet: sotto.riassunto.substring(0, 200) + '...'
          });
        }
      }
    }
  }
  
  res.json({ risultati, totale: risultati.length });
});

// GET /api/contenuti/stats - Statistiche contenuti
router.get('/stats', (req, res) => {
  const stats = {
    totaleMaterie: Object.keys(contenuti).length,
    totaleArgomenti: 0,
    totaleSottoargomenti: 0,
    totaleParole: 0,
    perMateria: {}
  };
  
  for (const [key, materiaData] of Object.entries(contenuti)) {
    const numArgomenti = materiaData.argomenti.length;
    let numSotto = 0;
    let parole = 0;
    
    for (const arg of materiaData.argomenti) {
      numSotto += arg.sottoargomenti?.length || 0;
      for (const sotto of arg.sottoargomenti || []) {
        parole += sotto.riassunto.split(/\s+/).length;
      }
    }
    
    stats.totaleArgomenti += numArgomenti;
    stats.totaleSottoargomenti += numSotto;
    stats.totaleParole += parole;
    
    stats.perMateria[materiaData.materia.nome] = {
      argomenti: numArgomenti,
      sottoargomenti: numSotto,
      parole
    };
  }
  
  res.json(stats);
});

module.exports = router;
