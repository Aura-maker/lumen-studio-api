// Gestione quiz e domande. Creazione, editing, cancellazione, esecuzione.
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/roles');

const router = express.Router();

/**
 * GET /api/quizzes/:id - ottieni quiz con domande
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { questions: true, topic: true }
    });
    if (!quiz) return res.status(404).json({ error: 'Quiz non trovato' });
    res.json({ quiz });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/quizzes - crea quiz (teacher/admin)
 * body: { title, description, topicId, timeLimit, isPublic, questions: [...] }
 * question: { text, type, choices (array), imageUrl, points }
 */
router.post('/', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { title, description, topicId, timeLimit, isPublic, questions } = req.body;
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        topicId,
        timeLimit,
        isPublic: !!isPublic,
        questions: { create: questions || [] },
        createdById: req.user.id
      },
      include: { questions: true }
    });
    res.status(201).json({ quiz });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/quizzes/:id - aggiorna meta del quiz
 */
router.put('/:id', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    // Per semplicità non gestiamo update complesso delle domande qui
    const quiz = await prisma.quiz.update({ where: { id }, data: payload });
    res.json({ quiz });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/quizzes/:id
 */
router.delete('/:id', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.question.deleteMany({ where: { quizId: id } });
    await prisma.quiz.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/quizzes/:id/submit - submit delle risposte di uno studente
 * body: { answers: [{ questionId, answer (string or array) }], timeSpent }
 * Logica: valuta automaticamente domande multiple/multi-select e registra progress
 */
router.post('/:id/submit', authenticate, permit('STUDENT', 'TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers, timeSpent = 0 } = req.body;
    const quiz = await prisma.quiz.findUnique({ where: { id }, include: { questions: true } });
    if (!quiz) return res.status(404).json({ error: 'Quiz non trovato' });

    let score = 0;
    const maxScore = quiz.questions.reduce((s, q) => s + q.points, 0);
    // Valutazione semplice: per ogni question
    const answersMap = {};
    (answers || []).forEach(a => (answersMap[a.questionId] = a.answer));
    const detailed = [];
    for (const q of quiz.questions) {
      const given = answersMap[q.id];
      let correct = false;
      let questionScore = 0;
      if (q.type === 'open') {
        // Non autovalutabile automaticamente
        correct = null;
      } else {
        // choices memorizzate in JSON come array di {text, isCorrect}
        const choices = q.choices || [];
        const correctChoices = (choices.filter(c => c.isCorrect)).map(c => c.text);
        if (q.type === 'multiple') {
          // single correct answer expected (text)
          if (typeof given === 'string' && correctChoices.includes(given)) {
            correct = true;
            questionScore = q.points;
          }
        } else if (q.type === 'multi-select') {
          // given expected as array of texts
          if (Array.isArray(given)) {
            const givenSet = new Set(given);
            const correctSet = new Set(correctChoices);
            // simple exact match
            const isExact = givenSet.size === correctSet.size && [...givenSet].every(v => correctSet.has(v));
            if (isExact) {
              correct = true;
              questionScore = q.points;
            } else {
              // partial scoring (pro-rata)
              const matched = [...givenSet].filter(x => correctSet.has(x)).length;
              questionScore = Math.round((matched / correctSet.size) * q.points);
            }
          }
        }
      }
      if (questionScore) score += questionScore;
      detailed.push({ questionId: q.id, given, correct, questionScore });
    }

    // Salvare progress
    const progress = await prisma.progress.create({
      data: {
        userId: req.user.id,
        quizId: id,
        score,
        maxScore,
        timeSpent,
        answers: detailed
      }
    });

    // Aggiorna punti utente e livello (semplice)
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const newPoints = user.points + score;
    const levelGain = Math.floor(newPoints / 100); // ogni 100 punti +1 livello (esempio)
    await prisma.user.update({ where: { id: req.user.id }, data: { points: newPoints, level: 1 + levelGain } });

    res.json({ progress, detailed, score, maxScore });
  } catch (err) {
    next(err);
  }
});

/**
 * Question CRUD endpoints (teacher/admin)
 * POST /api/quizzes/:id/questions
 * PUT /api/quizzes/:quizId/questions/:qId
 * DELETE ...
 */
router.post('/:id/questions', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    // choices expected to be array that will be saved as JSON
    const question = await prisma.question.create({
      data: { ...payload, quizId: id }
    });
    res.status(201).json({ question });
  } catch (err) {
    next(err);
  }
});

router.put('/:quizId/questions/:qId', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { qId } = req.params;
    const payload = req.body;
    const question = await prisma.question.update({ where: { id: qId }, data: payload });
    res.json({ question });
  } catch (err) {
    next(err);
  }
});

router.delete('/:quizId/questions/:qId', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { qId } = req.params;
    await prisma.question.delete({ where: { id: qId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;