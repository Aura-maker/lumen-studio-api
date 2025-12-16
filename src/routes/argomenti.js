// CRUD per argomenti (associati a materia) - italiano
const express = require('express');
const prisma = require('../prisma');
const { autentica } = require('../middleware/auth');
const { consenti } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/argomenti?materiaId=...
 */
router.get('/', autentica, async (req, res, next) => {
  try {
    const { materiaId } = req.query;
    const where = materiaId ? { where: { materiaId } } : {};
    const argomenti = await prisma.argomento.findMany({ ...where });
    res.json({ argomenti });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/argomenti - crea argomento
 * body: { titolo, descrizione, materiaId, da, a }
 */
router.post('/', autentica, consenti('ADMIN', 'DOCENTE'), async (req, res, next) => {
  try {
    const { titolo, descrizione, materiaId, da, a } = req.body;
    const argomento = await prisma.argomento.create({
      data: { titolo, descrizione, materiaId, da, a }
    });
    res.status(201).json({ argomento });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/argomenti/:id
 */
router.put('/:id', autentica, consenti('ADMIN', 'DOCENTE'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const argomento = await prisma.argomento.update({ where: { id }, data: payload });
    res.json({ argomento });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/argomenti/:id
 */
router.delete('/:id', autentica, consenti('ADMIN', 'DOCENTE'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.quiz.deleteMany({ where: { argomentoId: id } });
    await prisma.argomento.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;