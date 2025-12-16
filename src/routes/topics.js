// CRUD per argomenti (associati a materia)
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/topics?subjectId=...
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { subjectId } = req.query;
    const where = subjectId ? { where: { subjectId } } : {};
    const topics = await prisma.topic.findMany({ ...where });
    res.json({ topics });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/topics - crea argomento
 * body: { title, description, subjectId, rangeFrom, rangeTo }
 */
router.post('/', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { title, description, subjectId, rangeFrom, rangeTo } = req.body;
    const topic = await prisma.topic.create({
      data: { title, description, subjectId, rangeFrom, rangeTo }
    });
    res.status(201).json({ topic });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/topics/:id
 */
router.put('/:id', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const topic = await prisma.topic.update({ where: { id }, data: payload });
    res.json({ topic });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/topics/:id
 */
router.delete('/:id', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.quiz.deleteMany({ where: { topicId: id } }); // pulizia
    await prisma.topic.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;