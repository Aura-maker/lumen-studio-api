// Rotte per gestione flashcard
const express = require('express');
const { autentica } = require('../middleware/auth');
const router = express.Router();
const prisma = require('../prisma');

function buildVisibilityFilter(utenteId) {
  return {
    OR: [
      { pubblico: true },
      { creatoDaId: utenteId }
    ]
  };
}

function serializeFlashcard(record, argomento, progresso) {
  return {
    id: record.id,
    fronte: record.fronte,
    retro: record.retro,
    immagineUrl: record.immagineUrl,
    pubblico: record.pubblico,
    argomentoId: argomento?.id || record.argomentoId,
    argomentoTitolo: argomento?.titolo || record.argomento?.titolo || '',
    materiaId: argomento?.materia?.id || record.argomento?.materia?.id || null,
    materiaNome: argomento?.materia?.nome || record.argomento?.materia?.nome || '',
    progresso: progresso
      ? {
          livelloMemoria: progresso.livelloMemoria,
          ultimaRevisione: progresso.ultimaRevisione,
          prossimaRevisione: progresso.prossimaRevisione
        }
      : null
  };
}

// GET /api/flashcard/materie - elenco materie con flashcard disponibili
router.get('/materie', autentica, async (req, res, next) => {
  try {
    const materie = await prisma.materia.findMany({
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        descrizione: true,
        argomenti: {
          select: {
            id: true,
            flashcard: {
              where: buildVisibilityFilter(req.utente.id),
              select: { id: true }
            }
          }
        }
      }
    });

    const payload = materie
      .map(m => {
        const totaleFlashcard = m.argomenti.reduce((sum, arg) => sum + arg.flashcard.length, 0);
        if (!totaleFlashcard) return null;
        return {
          id: m.id,
          nome: m.nome,
          descrizione: m.descrizione,
          totaleFlashcard
        };
      })
      .filter(Boolean);

    res.json({ materie: payload });
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcard/materia/:materiaId/argomenti - argomenti con flashcard nella materia
router.get('/materia/:materiaId/argomenti', autentica, async (req, res, next) => {
  try {
    const { materiaId } = req.params;

    const materia = await prisma.materia.findUnique({
      where: { id: materiaId },
      select: { id: true }
    });

    if (!materia) {
      return res.status(404).json({ errore: 'Materia non trovata' });
    }

    const argomenti = await prisma.argomento.findMany({
      where: { materiaId },
      orderBy: { titolo: 'asc' },
      select: {
        id: true,
        titolo: true,
        descrizione: true,
        flashcard: {
          where: buildVisibilityFilter(req.utente.id),
          select: { id: true }
        }
      }
    });

    const payload = argomenti
      .map(arg => ({
        id: arg.id,
        titolo: arg.titolo,
        descrizione: arg.descrizione,
        totaleFlashcard: arg.flashcard.length
      }))
      .filter(arg => arg.totaleFlashcard > 0);

    res.json({ argomenti: payload });
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcard/argomento/:argomentoId - Ottieni tutte le flashcard di un argomento
router.get('/argomento/:argomentoId', autentica, async (req, res, next) => {
  try {
    const { argomentoId } = req.params;

    const argomento = await prisma.argomento.findUnique({
      where: { id: argomentoId },
      include: { materia: true }
    });

    if (!argomento) {
      return res.status(404).json({ errore: 'Argomento non trovato' });
    }

    const records = await prisma.flashcard.findMany({
      where: {
        argomentoId,
        ...buildVisibilityFilter(req.utente.id)
      },
      include: {
        progressi: {
          where: { utenteId: req.utente.id },
          take: 1
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    const flashcard = records.map(record =>
      serializeFlashcard(record, argomento, record.progressi[0])
    );

    res.json({
      argomento: {
        id: argomento.id,
        titolo: argomento.titolo,
        materia: argomento.materia
          ? { id: argomento.materia.id, nome: argomento.materia.nome }
          : null
      },
      flashcard
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/flashcard/due - Ottieni flashcard da ripassare (spaced repetition)
router.get('/due', autentica, async (req, res, next) => {
  try {
    const now = new Date();
    const records = await prisma.flashcard.findMany({
      where: buildVisibilityFilter(req.utente.id),
      include: {
        argomento: {
          include: { materia: true }
        },
        progressi: {
          where: { utenteId: req.utente.id },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const daRipassare = records
      .filter(fc => {
        const progresso = fc.progressi[0];
        if (!progresso) return true;
        if (!progresso.prossimaRevisione) return true;
        return new Date(progresso.prossimaRevisione) <= now;
      })
      .slice(0, 12)
      .map(record => serializeFlashcard(record, record.argomento, record.progressi[0]));

    res.json({ flashcard: daRipassare });
  } catch (err) {
    next(err);
  }
});

// POST /api/flashcard - Crea nuova flashcard
router.post('/', autentica, async (req, res, next) => {
  try {
    const { fronte, retro, argomentoId, immagineUrl, pubblico } = req.body;
    if (!fronte || !retro || !argomentoId) {
      return res.status(400).json({ errore: 'Fronte, retro e argomentoId obbligatori' });
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        fronte,
        retro,
        argomentoId,
        immagineUrl,
        pubblico: pubblico !== undefined ? pubblico : true,
        creatoDaId: req.utente.id
      },
      include: {
        argomento: { include: { materia: true } }
      }
    });

    res.status(201).json({ flashcard });
  } catch (err) {
    next(err);
  }
});

// PUT /api/flashcard/:id - Aggiorna flashcard
router.put('/:id', autentica, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fronte, retro, immagineUrl, pubblico } = req.body;

    // Verifica che sia il creatore o admin
    const flashcard = await prisma.flashcard.findUnique({ where: { id } });
    if (!flashcard) {
      return res.status(404).json({ errore: 'Flashcard non trovata' });
    }
    if (flashcard.creatoDaId !== req.utente.id && req.utente.ruolo !== 'ADMIN') {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    const updated = await prisma.flashcard.update({
      where: { id },
      data: { fronte, retro, immagineUrl, pubblico }
    });

    res.json({ flashcard: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/flashcard/:id - Elimina flashcard
router.delete('/:id', autentica, async (req, res, next) => {
  try {
    const { id } = req.params;
    const flashcard = await prisma.flashcard.findUnique({ where: { id } });
    if (!flashcard) {
      return res.status(404).json({ errore: 'Flashcard non trovata' });
    }
    if (flashcard.creatoDaId !== req.utente.id && req.utente.ruolo !== 'ADMIN') {
      return res.status(403).json({ errore: 'Non autorizzato' });
    }

    await prisma.flashcard.delete({ where: { id } });
    res.json({ messaggio: 'Flashcard eliminata' });
  } catch (err) {
    next(err);
  }
});

// POST /api/flashcard/:id/ripassa - Aggiorna progresso dopo ripasso
router.post('/:id/ripassa', autentica, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ricordato } = req.body; // true se ricordato, false se no

    const flashcard = await prisma.flashcard.findUnique({ where: { id } });
    if (!flashcard) {
      return res.status(404).json({ errore: 'Flashcard non trovata' });
    }

    // Trova o crea progresso
    let progresso = await prisma.progressoFlashcard.findUnique({
      where: {
        utenteId_flashcardId: {
          utenteId: req.utente.id,
          flashcardId: id
        }
      }
    });

    const now = new Date();
    let nuovoLivello = ricordato ? 1 : 0;
    let prossimaRevisione = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 giorno

    if (progresso) {
      nuovoLivello = ricordato
        ? Math.min(progresso.livelloMemoria + 1, 5)
        : Math.max(progresso.livelloMemoria - 1, 0);

      // Calcola prossima revisione basata sul livello (spaced repetition)
      const giorni = [1, 2, 4, 7, 14, 30]; // giorni per livello 0-5
      const giorniAttesa = giorni[Math.min(nuovoLivello, 5)] || 30;
      prossimaRevisione = new Date(now.getTime() + giorniAttesa * 24 * 60 * 60 * 1000);
    }

    progresso = await prisma.progressoFlashcard.upsert({
      where: {
        utenteId_flashcardId: {
          utenteId: req.utente.id,
          flashcardId: id
        }
      },
      create: {
        utenteId: req.utente.id,
        flashcardId: id,
        livelloMemoria: nuovoLivello,
        ultimaRevisione: now,
        prossimaRevisione
      },
      update: {
        livelloMemoria: nuovoLivello,
        ultimaRevisione: now,
        prossimaRevisione
      }
    });

    res.json({ progresso });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

