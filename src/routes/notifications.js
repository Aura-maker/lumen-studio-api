// Notifiche: creazione e lettura. Integrazione email/push semplificata.
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate } = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const config = require('../config');
const nodemailer = require('nodemailer');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  auth: { user: config.smtp.user, pass: config.smtp.pass }
});

/**
 * POST /api/notifications/send
 * body: { userId (optional), title, body, channel, payload }
 * Se userId omesso => broadcast in-app, in produzione usare queue + worker
 */
router.post('/send', authenticate, permit('ADMIN', 'TEACHER'), async (req, res, next) => {
  try {
    const { userId, title, body, channel = 'in-app', payload } = req.body;
    if (channel === 'email' && userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.email) {
        await transporter.sendMail({ from: config.smtp.user, to: user.email, subject: title, text: body });
      }
    }
    const note = await prisma.notification.create({ data: { userId, title, body, channel, payload } });
    res.json({ note });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/notifications/me
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const notes = await prisma.notification.findMany({ where: { userId: req.user.id } });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
});

module.exports = router;