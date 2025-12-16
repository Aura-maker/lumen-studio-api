const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { autentica } = require('../middleware/auth');

// GET /api/libri - Lista tutti i libri
router.get('/', async (req, res) => {
  try {
    const { ricerca, condizione, maxPrezzo, citta } = req.query;
    
    const where = { stato: 'ATTIVO' };
    if (ricerca) {
      where.OR = [
        { titolo: { contains: ricerca, mode: 'insensitive' } },
        { descrizione: { contains: ricerca, mode: 'insensitive' } }
      ];
    }
    if (condizione) where.condizione = condizione;
    if (maxPrezzo) where.prezzo = { lte: parseFloat(maxPrezzo) };
    if (citta) where.citta = { contains: citta, mode: 'insensitive' };

    const libri = await prisma.libro.findMany({
      where,
      include: {
        foto: { orderBy: { ordine: 'asc' } },
        venditore: { select: { nome: true, cognome: true, username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ libri });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: 'Errore nel caricamento dei libri' });
  }
});

// POST /api/libri - Pubblica un libro
router.post('/', autentica, async (req, res) => {
  try {
    const {
      titolo, autori, isbn, casaEditrice, annoEdizione, condizione,
      prezzo, descrizione, citta, provincia, materiaId, foto
    } = req.body;

    const libro = await prisma.libro.create({
      data: {
        titolo, autori, isbn, casaEditrice, annoEdizione, condizione,
        prezzo: prezzo ? parseFloat(prezzo) : null,
        descrizione, citta, provincia,
        venditoreId: req.utente.id,
        materiaId,
        stato: 'ATTIVO'
      }
    });

    // Aggiungi foto
    if (foto && foto.length > 0) {
      await prisma.fotoLibro.createMany({
        data: foto.map((f, idx) => ({
          url: f.url,
          altText: f.altText || `Foto di ${titolo}`,
          ordine: idx,
          libroId: libro.id
        }))
      });
    }

    res.status(201).json({ libro });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: 'Errore nella pubblicazione' });
  }
});

// GET /api/libri/:id - Dettaglio libro
router.get('/:id', async (req, res) => {
  try {
    const libro = await prisma.libro.findUnique({
      where: { id: req.params.id },
      include: {
        foto: { orderBy: { ordine: 'asc' } },
        venditore: {
          select: {
            id: true, nome: true, cognome: true, username: true,
            scuola: true, citta: true,
            libriVenduti: { where: { stato: 'VENDUTO' }, select: { id: true } },
            recensioniRicevute: { select: { valutazione: true } }
          }
        },
        materia: { select: { nome: true } }
      }
    });

    if (!libro) return res.status(404).json({ errore: 'Libro non trovato' });

    res.json({ libro });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: 'Errore nel caricamento' });
  }
});

// POST /api/chat - Avvia chat con venditore
router.post('/chat', autentica, async (req, res) => {
  try {
    const { libroId } = req.body;

    const libro = await prisma.libro.findUnique({ where: { id: libroId } });
    if (!libro) return res.status(404).json({ errore: 'Libro non trovato' });
    if (libro.venditoreId === req.utente.id) {
      return res.status(400).json({ errore: 'Non puoi chattare con te stesso' });
    }

    // Trova o crea chat
    let chat = await prisma.chatMarketplace.findUnique({
      where: {
        libroId_acquirenteId: {
          libroId,
          acquirenteId: req.utente.id
        }
      },
      include: {
        messaggi: { orderBy: { createdAt: 'asc' }, take: 50 },
        libro: { select: { titolo: true, prezzo: true, condizione: true } }
      }
    });

    if (!chat) {
      chat = await prisma.chatMarketplace.create({
        data: {
          libroId,
          acquirenteId: req.utente.id,
          venditoreId: libro.venditoreId
        },
        include: {
          messaggi: true,
          libro: { select: { titolo: true, prezzo: true, condizione: true } }
        }
      });
    }

    res.json({ chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: 'Errore nell\'avvio della chat' });
  }
});

// POST /api/chat/:chatId/messaggi - Invia messaggio
router.post('/chat/:chatId/messaggi', autentica, async (req, res) => {
  try {
    const { testo, immagineUrl } = req.body;
    const { chatId } = req.params;

    const chat = await prisma.chatMarketplace.findUnique({ where: { id: chatId } });
    if (!chat) return res.status(404).json({ errore: 'Chat non trovata' });
    if (chat.acquirenteId !== req.utente.id && chat.venditoreId !== req.utente.id) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    const messaggio = await prisma.messaggioChat.create({
      data: {
        testo, immagineUrl,
        chatId,
        mittenteId: req.utente.id
      }
    });

    res.status(201).json({ messaggio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errore: 'Errore nell\'invio del messaggio' });
  }
});

module.exports = router;
