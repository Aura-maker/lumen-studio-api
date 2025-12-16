/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LIBROMERCATO ROUTES - MARKETPLACE LIBRI USATI (PG)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const express = require('express');
const router = express.Router();

const Libri = require('../db/libri');
const authRoutes = require('./auth-pg');
const auth = authRoutes.authenticateToken;

/**
 * GET /api/libromercato - Lista libri disponibili
 */
router.get('/', async (req, res) => {
  try {
    const { materia, anno, condizione, venduto, search, limite } = req.query;
    const libri = await Libri.lista({ materia, anno, condizione, venduto, search, limite: parseInt(limite) || 50 });
    res.json({ libri, totale: libri.length });
  } catch (error) {
    console.error('Errore lista libri:', error);
    res.status(500).json({ errore: 'Errore caricamento libri' });
  }
});

/**
 * GET /api/libromercato/stats - Statistiche marketplace
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await Libri.getStatistiche();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ errore: 'Errore statistiche' });
  }
});

/**
 * GET /api/libromercato/miei - I miei libri in vendita
 */
router.get('/miei', auth, async (req, res) => {
  try {
    const libri = await Libri.getMiei(req.user.sub);
    res.json({ libri });
  } catch (error) {
    res.status(500).json({ errore: 'Errore caricamento libri' });
  }
});

/**
 * GET /api/libromercato/:id - Dettaglio libro
 */
router.get('/:id', async (req, res) => {
  try {
    const libro = await Libri.getById(req.params.id);
    if (!libro) {
      return res.status(404).json({ errore: 'Libro non trovato' });
    }
    res.json({ libro });
  } catch (error) {
    res.status(500).json({ errore: 'Errore caricamento libro' });
  }
});

/**
 * POST /api/libromercato - Pubblica nuovo libro
 */
router.post('/', auth, async (req, res) => {
  try {
    const { titolo, autore, editore, isbn, materia, anno, condizione, prezzo, descrizione, fotoUrl } = req.body;

    if (!titolo || !condizione) {
      return res.status(400).json({ errore: 'Titolo e condizione richiesti' });
    }

    // Passa anche il nome del venditore
    const venditoreNome = req.user.nome || 'Utente';
    const libro = await Libri.crea(req.user.sub, venditoreNome, {
      titolo, autore, editore, isbn, materia, anno, condizione,
      prezzo: parseFloat(prezzo) || null,
      descrizione, fotoUrl
    });

    res.status(201).json({ success: true, libro });
  } catch (error) {
    console.error('Errore creazione libro:', error);
    res.status(500).json({ errore: 'Errore pubblicazione libro' });
  }
});

/**
 * PUT /api/libromercato/:id - Modifica libro
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const libro = await Libri.aggiorna(req.params.id, req.user.sub, req.body);
    if (!libro) {
      return res.status(404).json({ errore: 'Libro non trovato o non autorizzato' });
    }
    res.json({ success: true, libro });
  } catch (error) {
    res.status(500).json({ errore: 'Errore modifica libro' });
  }
});

/**
 * POST /api/libromercato/:id/venduto - Segna come venduto
 */
router.post('/:id/venduto', auth, async (req, res) => {
  try {
    const { compratoreId } = req.body;
    const libro = await Libri.segnaVenduto(req.params.id, req.user.sub, compratoreId);
    if (!libro) {
      return res.status(404).json({ errore: 'Libro non trovato' });
    }
    res.json({ success: true, libro });
  } catch (error) {
    res.status(500).json({ errore: 'Errore aggiornamento' });
  }
});

/**
 * DELETE /api/libromercato/:id - Elimina libro
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const eliminato = await Libri.elimina(req.params.id, req.user.sub);
    if (!eliminato) {
      return res.status(404).json({ errore: 'Libro non trovato' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ errore: 'Errore eliminazione' });
  }
});

module.exports = router;
