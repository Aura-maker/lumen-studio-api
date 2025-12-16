// Rotte OAuth (Google) - italiano
const express = require('express');
const passport = require('../auth/google');
const { firmaAccessToken } = require('../services/jwt');

const router = express.Router();

// Inizia flusso OAuth con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback OAuth Google
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }), (req, res) => {
  const token = firmaAccessToken(req.user);
  const base = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  const url = new URL('/oauth-landing', base);
  url.searchParams.set('token', token);
  return res.redirect(url.toString());
});

module.exports = router;