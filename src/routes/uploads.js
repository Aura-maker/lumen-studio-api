// Endpoint per richiedere presigned URL per upload immagini
const express = require('express');
const { autentica } = require('../middleware/auth');
const { generaPresignedUpload } = require('../services/s3');
const router = express.Router();

/**
 * POST /api/uploads/presign
 * body: { filename }
 * Ritorna presignedUrl e key
 */
router.post('/presign', autentica, async (req, res, next) => {
  try {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ errore: 'filename mancante' });
    // genera key con prefisso utente per organizzazione
    const key = `uploads/${req.utente.id}/${Date.now()}_${filename}`;
    const url = await generaPresignedUpload(key, 120);
    res.json({ url, key });
  } catch (err) {
    next(err);
  }
});

module.exports = router;