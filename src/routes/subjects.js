// CRUD per materie e year sections
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/subjects - lista materie
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany({ include: { years: true } });
    res.json({ subjects });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/subjects - crea materia (teacher/admin)
 * body: { name, description, years: [{label}] }
 */
router.post('/', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { name, description, years } = req.body;
    const subject = await prisma.subject.create({
      data: {
        name,
        description,
        years: { create: years || [] }
      },
      include: { years: true }
    });
    res.status(201).json({ subject });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/subjects/:id - aggiorna una materia
 */
router.put('/:id', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const subject = await prisma.subject.update({ where: { id }, data: { name, description } });
    res.json({ subject });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/subjects/:id - elimina materia
 */
router.delete('/:id', authenticate, permit('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.topic.deleteMany({ where: { subjectId: id } }); // pulizia topic
    await prisma.subject.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;