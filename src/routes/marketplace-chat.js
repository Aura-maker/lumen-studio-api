// API per il sistema di chat del marketplace
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const MarketplaceChat = require('../models/MarketplaceChat');
const BookListing = require('../models/BookListing');
const { autentica } = require('../middleware/auth');
const { moderazioneContenuti } = require('../middleware/moderazione');

// Configurazione multer per immagini chat
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/chat');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `chat-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB per immagini chat
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo immagini JPEG, PNG e WebP sono permesse'));
    }
  }
});

// ==================== CHAT ====================

// GET /api/marketplace-chat - Lista chat dell'utente
router.get('/', autentica, async (req, res) => {
  try {
    const { stato = 'attive' } = req.query;
    
    let filtroStato = {};
    switch (stato) {
      case 'attive':
        filtroStato = { stato: { $in: ['attiva', 'in_trattativa'] } };
        break;
      case 'completate':
        filtroStato = { stato: 'completata' };
        break;
      case 'archiviate':
        filtroStato = { stato: 'archiviata' };
        break;
      default:
        filtroStato = { stato: { $ne: 'bloccata' } };
    }

    const chat = await MarketplaceChat.find({
      'partecipanti.utente': req.user.id,
      ...filtroStato
    })
    .populate('annuncio', 'titolo immagini prezzo condizione stato venditore')
    .populate('partecipanti.utente', 'nome avatar marketplace.valutazioneMedia')
    .sort({ ultimaAttivita: -1 })
    .lean();

    // Calcola messaggi non letti per ogni chat
    const chatConNonLetti = chat.map(c => {
      const partecipanteCorrente = c.partecipanti.find(p => 
        p.utente._id.toString() === req.user.id
      );
      
      const messaggiNonLetti = c.messaggi.filter(m => 
        m.timestamp > partecipanteCorrente.ultimaLettura &&
        m.mittente.toString() !== req.user.id &&
        !m.eliminato
      ).length;

      const ultimoMessaggio = c.messaggi.filter(m => !m.eliminato).pop();
      
      return {
        ...c,
        messaggiNonLetti,
        ultimoMessaggio,
        altroPartecipante: c.partecipanti.find(p => 
          p.utente._id.toString() !== req.user.id
        )
      };
    });

    res.json({
      chat: chatConNonLetti,
      totaleNonLetti: chatConNonLetti.reduce((sum, c) => sum + c.messaggiNonLetti, 0)
    });
  } catch (error) {
    console.error('Errore recupero chat:', error);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// GET /api/marketplace-chat/:id - Dettaglio singola chat
router.get('/:id', autentica, async (req, res) => {
  try {
    const chat = await MarketplaceChat.findById(req.params.id)
      .populate('annuncio', 'titolo immagini prezzo condizione stato venditore')
      .populate('partecipanti.utente', 'nome avatar marketplace')
      .populate('messaggi.mittente', 'nome avatar');

    if (!chat) {
      return res.status(404).json({ errore: 'Chat non trovata' });
    }

    // Verifica che l'utente sia partecipante
    const isPartecipante = chat.partecipanti.some(p => 
      p.utente._id.toString() === req.user.id
    );

    if (!isPartecipante) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    // Segna messaggi come letti
    await chat.segnaComeLetto(req.user.id);

    // Filtra messaggi non eliminati
    const messaggiAttivi = chat.messaggi.filter(m => !m.eliminato);

    res.json({
      ...chat.toObject(),
      messaggi: messaggiAttivi,
      altroPartecipante: chat.partecipanti.find(p => 
        p.utente._id.toString() !== req.user.id
      )
    });
  } catch (error) {
    console.error('Errore dettaglio chat:', error);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// POST /api/marketplace-chat/inizia - Inizia nuova chat per un annuncio
router.post('/inizia', autentica, async (req, res) => {
  try {
    const { annuncioId } = req.body;

    if (!annuncioId) {
      return res.status(400).json({ errore: 'ID annuncio richiesto' });
    }

    const annuncio = await BookListing.findById(annuncioId);

    if (!annuncio) {
      return res.status(404).json({ errore: 'Annuncio non trovato' });
    }

    if (annuncio.stato !== 'attivo') {
      return res.status(400).json({ errore: 'Annuncio non più disponibile' });
    }

    if (annuncio.venditore.toString() === req.user.id) {
      return res.status(400).json({ errore: 'Non puoi chattare con te stesso' });
    }

    // Verifica se esiste già una chat
    let chat = await MarketplaceChat.findOne({
      annuncio: annuncioId,
      'partecipanti.utente': { $all: [annuncio.venditore, req.user.id] }
    });

    if (chat) {
      // Riattiva chat se era archiviata
      if (chat.stato === 'archiviata') {
        chat.stato = 'attiva';
        chat.ultimaAttivita = new Date();
        await chat.save();
      }
    } else {
      // Crea nuova chat
      chat = new MarketplaceChat({
        annuncio: annuncioId,
        partecipanti: [
          { utente: annuncio.venditore, ruolo: 'venditore' },
          { utente: req.user.id, ruolo: 'acquirente' }
        ]
      });
      await chat.save();
    }

    // Popola dati per risposta
    await chat.populate('annuncio', 'titolo immagini prezzo condizione');
    await chat.populate('partecipanti.utente', 'nome avatar');

    res.json({
      messaggio: 'Chat iniziata con successo',
      chat
    });
  } catch (error) {
    console.error('Errore inizializzazione chat:', error);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// POST /api/marketplace-chat/:id/messaggio - Invia messaggio
router.post('/:id/messaggio', autentica, upload.single('immagine'), moderazioneContenuti, async (req, res) => {
  try {
    const { contenuto } = req.body;

    if (!contenuto || contenuto.trim().length === 0) {
      return res.status(400).json({ errore: 'Contenuto messaggio richiesto' });
    }

    const chat = await MarketplaceChat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ errore: 'Chat non trovata' });
    }

    // Verifica partecipazione
    const isPartecipante = chat.partecipanti.some(p => 
      p.utente.toString() === req.user.id
    );

    if (!isPartecipante) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    // Verifica stato chat
    if (['bloccata', 'archiviata'].includes(chat.stato)) {
      return res.status(400).json({ errore: 'Chat non più attiva' });
    }

    // Prepara dati immagine se presente
    let immagine = null;
    if (req.file) {
      immagine = {
        url: `/uploads/chat/${req.file.filename}`,
        altText: 'Immagine condivisa in chat',
        metadata: {
          size: req.file.size,
          format: req.file.mimetype
        }
      };
    }

    // Aggiungi messaggio
    await chat.aggiungiMessaggio(req.user.id, contenuto.trim(), immagine);

    // Popola mittente per risposta
    await chat.populate('messaggi.mittente', 'nome avatar');

    const ultimoMessaggio = chat.messaggi[chat.messaggi.length - 1];

    res.json({
      messaggio: 'Messaggio inviato con successo',
      nuovoMessaggio: ultimoMessaggio
    });
  } catch (error) {
    console.error('Errore invio messaggio:', error);
    
    // Rimuovi file caricato in caso di errore
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Errore rimozione file:', unlinkError);
      }
    }

    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// POST /api/marketplace-chat/:id/proposta - Proponi transazione
router.post('/:id/proposta', autentica, async (req, res) => {
  try {
    const { tipo, prezzo } = req.body;

    if (!['vendita', 'scambio'].includes(tipo)) {
      return res.status(400).json({ errore: 'Tipo transazione non valido' });
    }

    if (tipo === 'vendita' && (!prezzo || prezzo <= 0)) {
      return res.status(400).json({ errore: 'Prezzo richiesto per vendita' });
    }

    const chat = await MarketplaceChat.findById(req.params.id)
      .populate('annuncio');

    if (!chat) {
      return res.status(404).json({ errore: 'Chat non trovata' });
    }

    // Verifica partecipazione
    const partecipante = chat.partecipanti.find(p => 
      p.utente.toString() === req.user.id
    );

    if (!partecipante) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    // Proponi transazione
    await chat.proponiTransazione(tipo, prezzo);

    // Aggiungi messaggio automatico
    const messaggioTransazione = tipo === 'scambio' 
      ? 'Ha proposto uno scambio per questo libro'
      : `Ha proposto l'acquisto per €${prezzo}`;

    await chat.aggiungiMessaggio(req.user.id, messaggioTransazione);

    res.json({
      messaggio: 'Proposta inviata con successo',
      transazione: chat.transazione
    });
  } catch (error) {
    console.error('Errore proposta transazione:', error);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// POST /api/marketplace-chat/:id/accetta-proposta - Accetta proposta
router.post('/:id/accetta-proposta', autentica, async (req, res) => {
  try {
    const chat = await MarketplaceChat.findById(req.params.id)
      .populate('annuncio');

    if (!chat) {
      return res.status(404).json({ errore: 'Chat non trovata' });
    }

    // Verifica che sia il venditore
    const partecipante = chat.partecipanti.find(p => 
      p.utente.toString() === req.user.id
    );

    if (!partecipante || partecipante.ruolo !== 'venditore') {
      return res.status(403).json({ errore: 'Solo il venditore può accettare proposte' });
    }

    if (!chat.transazione || chat.transazione.stato !== 'proposta') {
      return res.status(400).json({ errore: 'Nessuna proposta da accettare' });
    }

    // Accetta proposta
    chat.transazione.stato = 'accettata';
    await chat.save();

    // Aggiorna stato annuncio
    await BookListing.findByIdAndUpdate(chat.annuncio._id, {
      stato: 'in_trattativa'
    });

    // Messaggio automatico
    await chat.aggiungiMessaggio(req.user.id, 'Ha accettato la proposta! Procedete con i dettagli della transazione.');

    res.json({
      messaggio: 'Proposta accettata con successo',
      transazione: chat.transazione
    });
  } catch (error) {
    console.error('Errore accettazione proposta:', error);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// POST /api/marketplace-chat/:id/completa - Completa transazione
router.post('/:id/completa', autentica, async (req, res) => {
  try {
    const chat = await MarketplaceChat.findById(req.params.id)
      .populate('annuncio');

    if (!chat) {
      return res.status(404).json({ errore: 'Chat non trovata' });
    }

    // Verifica partecipazione
    const isPartecipante = chat.partecipanti.some(p => 
      p.utente.toString() === req.user.id
    );

    if (!isPartecipante) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    if (!chat.transazione || chat.transazione.stato !== 'accettata') {
      return res.status(400).json({ errore: 'Nessuna transazione da completare' });
    }

    // Completa transazione
    await chat.completaTransazione();

    // Aggiorna stato annuncio
    const nuovoStato = chat.transazione.tipo === 'scambio' ? 'scambiato' : 'venduto';
    await BookListing.findByIdAndUpdate(chat.annuncio._id, {
      stato: nuovoStato
    });

    // Messaggio automatico
    await chat.aggiungiMessaggio(req.user.id, '✅ Transazione completata! Ora puoi lasciare un feedback.');

    res.json({
      messaggio: 'Transazione completata con successo',
      chat
    });
  } catch (error) {
    console.error('Errore completamento transazione:', error);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// POST /api/marketplace-chat/:id/segnala - Segnala conversazione
router.post('/:id/segnala', autentica, async (req, res) => {
  try {
    const { motivo, descrizione } = req.body;

    if (!motivo) {
      return res.status(400).json({ errore: 'Motivo segnalazione richiesto' });
    }

    const chat = await MarketplaceChat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ errore: 'Chat non trovata' });
    }

    // Verifica partecipazione
    const isPartecipante = chat.partecipanti.some(p => 
      p.utente.toString() === req.user.id
    );

    if (!isPartecipante) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    // Aggiungi segnalazione
    chat.segnalazioni.push({
      segnalatore: req.user.id,
      motivo,
      descrizione,
      data: new Date()
    });

    await chat.save();

    res.json({ messaggio: 'Segnalazione inviata con successo' });
  } catch (error) {
    console.error('Errore segnalazione chat:', error);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

// DELETE /api/marketplace-chat/:id - Archivia chat
router.delete('/:id', autentica, async (req, res) => {
  try {
    const chat = await MarketplaceChat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ errore: 'Chat non trovata' });
    }

    // Verifica partecipazione
    const isPartecipante = chat.partecipanti.some(p => 
      p.utente.toString() === req.user.id
    );

    if (!isPartecipante) {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    chat.stato = 'archiviata';
    await chat.save();

    res.json({ messaggio: 'Chat archiviata con successo' });
  } catch (error) {
    console.error('Errore archiviazione chat:', error);
    res.status(500).json({ errore: 'Errore interno del server' });
  }
});

module.exports = router;
