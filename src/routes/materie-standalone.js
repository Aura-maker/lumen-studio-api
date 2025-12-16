// Route materie standalone senza Prisma
const express = require('express');
const router = express.Router();

// Dati materie hardcoded per standalone
const materie = [
  {
    id: 'italiano',
    nome: '📘 Italiano',
    descrizione: 'Letteratura italiana del 5° anno',
    colore: '#3b82f6',
    icona: '📘',
    argomenti: [
      {
        id: 'scapigliatura',
        nome: 'La Scapigliatura',
        descrizione: 'Movimento letterario di ribellione',
        sottoargomenti: [
          { id: 'praga', nome: 'Emilio Praga', riassunto: 'Poeta e scrittore della Scapigliatura...' },
          { id: 'tarchetti', nome: 'Igino Ugo Tarchetti', riassunto: 'Narratore scapigliato...' }
        ]
      },
      {
        id: 'verismo',
        nome: 'Il Verismo',
        descrizione: 'Corrente letteraria realista',
        sottoargomenti: [
          { id: 'verga', nome: 'Giovanni Verga', riassunto: 'Maestro del Verismo...' },
          { id: 'capuana', nome: 'Luigi Capuana', riassunto: 'Teorico del Verismo...' }
        ]
      }
    ]
  },
  {
    id: 'storia',
    nome: '📗 Storia',
    descrizione: 'Storia contemporanea',
    colore: '#10b981',
    icona: '📗',
    argomenti: [
      {
        id: 'prima-guerra-mondiale',
        nome: 'Prima Guerra Mondiale',
        descrizione: 'Il conflitto del 1914-1918',
        sottoargomenti: [
          { id: 'cause', nome: 'Cause del conflitto', riassunto: 'Le tensioni europee...' },
          { id: 'fronte-occidentale', nome: 'Fronte occidentale', riassunto: 'La guerra di trincea...' }
        ]
      }
    ]
  },
  {
    id: 'filosofia',
    nome: '📙 Filosofia',
    descrizione: 'Filosofia moderna e contemporanea',
    colore: '#f59e0b',
    icona: '📙',
    argomenti: [
      {
        id: 'kant',
        nome: 'Immanuel Kant',
        descrizione: 'Il filosofo della ragion pura',
        sottoargomenti: [
          { id: 'critica-ragion-pura', nome: 'Critica della Ragion Pura', riassunto: 'Opera fondamentale di Kant...' },
          { id: 'critica-ragion-pratica', nome: 'Critica della Ragion Pratica', riassunto: 'Etica kantiana...' }
        ]
      }
    ]
  },
  {
    id: 'matematica',
    nome: '🧮 Matematica',
    descrizione: 'Analisi matematica e geometria',
    colore: '#8b5cf6',
    icona: '🧮',
    argomenti: [
      {
        id: 'limiti',
        nome: 'Limiti',
        descrizione: 'Teoria dei limiti',
        sottoargomenti: [
          { id: 'definizione-limite', nome: 'Definizione di limite', riassunto: 'Concetto fondamentale...' }
        ]
      }
    ]
  },
  {
    id: 'fisica',
    nome: '⚛️ Fisica',
    descrizione: 'Fisica classica e moderna',
    colore: '#ef4444',
    icona: '⚛️',
    argomenti: [
      {
        id: 'meccanica',
        nome: 'Meccanica',
        descrizione: 'Leggi del movimento',
        sottoargomenti: [
          { id: 'newton', nome: 'Leggi di Newton', riassunto: 'Principi della dinamica...' }
        ]
      }
    ]
  },
  {
    id: 'scienze',
    nome: '🔬 Scienze',
    descrizione: 'Biologia e chimica',
    colore: '#06b6d4',
    icona: '🔬',
    argomenti: [
      {
        id: 'genetica',
        nome: 'Genetica',
        descrizione: 'Eredità biologica',
        sottoargomenti: [
          { id: 'mendel', nome: 'Leggi di Mendel', riassunto: 'Principi dell\'eredità...' }
        ]
      }
    ]
  },
  {
    id: 'latino',
    nome: '📜 Latino',
    descrizione: 'Lingua e letteratura latina',
    colore: '#84cc16',
    icona: '📜',
    argomenti: [
      {
        id: 'cicerone',
        nome: 'Cicerone',
        descrizione: 'Oratore e filosofo romano',
        sottoargomenti: [
          { id: 'catilinarie', nome: 'Catilinarie', riassunto: 'Orazioni contro Catilina...' }
        ]
      }
    ]
  },
  {
    id: 'arte',
    nome: '🎨 Arte',
    descrizione: 'Storia dell\'arte',
    colore: '#f97316',
    icona: '🎨',
    argomenti: [
      {
        id: 'rinascimento',
        nome: 'Rinascimento',
        descrizione: 'Arte rinascimentale',
        sottoargomenti: [
          { id: 'leonardo', nome: 'Leonardo da Vinci', riassunto: 'Genio universale...' }
        ]
      }
    ]
  },
  {
    id: 'inglese',
    nome: '🌍 Inglese',
    descrizione: 'Lingua inglese',
    colore: '#ec4899',
    icona: '🌍',
    argomenti: [
      {
        id: 'shakespeare',
        nome: 'Shakespeare',
        descrizione: 'Il Bardo inglese',
        sottoargomenti: [
          { id: 'amleto', nome: 'Amleto', riassunto: 'Tragedia di Shakespeare...' }
        ]
      }
    ]
  },
  {
    id: 'religione',
    nome: '✝️ Religione',
    descrizione: 'Religione cattolica',
    colore: '#6366f1',
    icona: '✝️',
    argomenti: [
      {
        id: 'bioetica',
        nome: 'Bioetica',
        descrizione: 'Etica e vita',
        sottoargomenti: [
          { id: 'vita-umana', nome: 'Dignità della vita umana', riassunto: 'Principi fondamentali...' }
        ]
      }
    ]
  }
];

// GET /api/materie - Lista tutte le materie
router.get('/', (req, res) => {
  try {
    const pagina = Math.max(1, parseInt(req.query.pagina || '1'));
    const limite = Math.min(100, parseInt(req.query.limite || '20'));
    const skip = (pagina - 1) * limite;
    
    const materieSlice = materie.slice(skip, skip + limite);
    
    res.json({ 
      materie: materieSlice,
      pagina,
      limite,
      totale: materie.length
    });
  } catch (err) {
    console.error('Errore GET /api/materie:', err);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// GET /api/materie/:id - Dettagli materia specifica
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const materia = materie.find(m => m.id === id);
    
    if (!materia) {
      return res.status(404).json({ errore: 'Materia non trovata' });
    }
    
    res.json(materia);
  } catch (err) {
    console.error(`Errore GET /api/materie/${req.params.id}:`, err);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// GET /api/materie/:id/argomenti - Argomenti di una materia
router.get('/:id/argomenti', (req, res) => {
  try {
    const { id } = req.params;
    const materia = materie.find(m => m.id === id);
    
    if (!materia) {
      return res.status(404).json({ errore: 'Materia non trovata' });
    }
    
    res.json({ 
      materia: materia.nome,
      argomenti: materia.argomenti || []
    });
  } catch (err) {
    console.error(`Errore GET /api/materie/${req.params.id}/argomenti:`, err);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// GET /api/materie/:materiaId/argomenti/:argomentoId - Dettagli argomento
router.get('/:materiaId/argomenti/:argomentoId', (req, res) => {
  try {
    const { materiaId, argomentoId } = req.params;
    const materia = materie.find(m => m.id === materiaId);
    
    if (!materia) {
      return res.status(404).json({ errore: 'Materia non trovata' });
    }
    
    const argomento = materia.argomenti?.find(a => a.id === argomentoId);
    
    if (!argomento) {
      return res.status(404).json({ errore: 'Argomento non trovato' });
    }
    
    res.json({
      materia: materia.nome,
      argomento: argomento
    });
  } catch (err) {
    console.error(`Errore GET /api/materie/${req.params.materiaId}/argomenti/${req.params.argomentoId}:`, err);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// GET /api/materie/:materiaId/argomenti/:argomentoId/sottoargomenti - Sottoargomenti
router.get('/:materiaId/argomenti/:argomentoId/sottoargomenti', (req, res) => {
  try {
    const { materiaId, argomentoId } = req.params;
    const materia = materie.find(m => m.id === materiaId);
    
    if (!materia) {
      return res.status(404).json({ errore: 'Materia non trovata' });
    }
    
    const argomento = materia.argomenti?.find(a => a.id === argomentoId);
    
    if (!argomento) {
      return res.status(404).json({ errore: 'Argomento non trovato' });
    }
    
    res.json({
      materia: materia.nome,
      argomento: argomento.nome,
      sottoargomenti: argomento.sottoargomenti || []
    });
  } catch (err) {
    console.error(`Errore GET sottoargomenti:`, err);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

module.exports = router;
