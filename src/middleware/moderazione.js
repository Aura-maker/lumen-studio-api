// Middleware per moderazione automatica dei contenuti
const fs = require('fs').promises;
const path = require('path');

// Lista di parole vietate (esempio base - da espandere)
const PAROLE_VIETATE = [
  // Insulti e linguaggio offensivo
  'idiota', 'stupido', 'cretino', 'imbecille', 'deficiente',
  'merda', 'cazzo', 'fottuto', 'bastardo', 'stronzo',
  
  // Contenuti inappropriati
  'droga', 'cocaina', 'eroina', 'marijuana', 'hashish',
  'sesso', 'porno', 'nudo', 'xxx',
  
  // Truffe e contenuti pericolosi
  'truffa', 'fregatura', 'soldi facili', 'guadagno garantito',
  'bitcoin gratis', 'investimento sicuro',
  
  // Dati sensibili (pattern)
  'password', 'pin', 'codice fiscale', 'carta di credito'
];

// Pattern per rilevare dati sensibili
const PATTERN_SENSIBILI = [
  // Numeri di telefono italiani
  /(?:\+39\s?)?(?:0\d{2,3}[\s\-]?\d{6,7}|\d{10})/g,
  
  // Email
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  
  // IBAN
  /IT\d{2}[A-Z]\d{3}\d{4}\d{12}/gi,
  
  // Codici fiscali
  /[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]/gi,
  
  // Indirizzi (pattern base)
  /via\s+[a-zA-Z\s]+\d+/gi,
  /corso\s+[a-zA-Z\s]+\d+/gi,
  /piazza\s+[a-zA-Z\s]+\d+/gi,
  
  // Link esterni
  /https?:\/\/(?!localhost|127\.0\.0\.1)[^\s]+/gi,
  
  // Numeri di carta di credito (pattern Luhn)
  /(?:\d{4}[\s\-]?){3}\d{4}/g
];

// Funzione per verificare se il testo contiene parole vietate
function contienePoroleVietate(testo) {
  const testoLower = testo.toLowerCase();
  const paroleVietateRilevate = [];
  
  PAROLE_VIETATE.forEach(parola => {
    if (testoLower.includes(parola.toLowerCase())) {
      paroleVietateRilevate.push(parola);
    }
  });
  
  return paroleVietateRilevate;
}

// Funzione per rilevare dati sensibili
function rilevaDatiSensibili(testo) {
  const datiSensibili = [];
  
  PATTERN_SENSIBILI.forEach((pattern, index) => {
    const matches = testo.match(pattern);
    if (matches) {
      const tipi = [
        'Numero di telefono',
        'Email',
        'IBAN',
        'Codice fiscale',
        'Indirizzo via',
        'Indirizzo corso',
        'Indirizzo piazza',
        'Link esterno',
        'Numero carta di credito'
      ];
      
      matches.forEach(match => {
        datiSensibili.push({
          tipo: tipi[index],
          valore: match,
          posizione: testo.indexOf(match)
        });
      });
    }
  });
  
  return datiSensibili;
}

// Funzione per analizzare immagini (placeholder - da implementare con servizi AI)
async function analizzaImmagine(filePath) {
  try {
    // Qui si potrebbe integrare un servizio di AI per analisi immagini
    // come Google Vision API, AWS Rekognition, etc.
    
    // Per ora, controlli base sui metadati del file
    const stats = await fs.stat(filePath);
    
    // Verifica dimensione file (max 5MB per annunci, 2MB per chat)
    const maxSize = filePath.includes('/chat/') ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (stats.size > maxSize) {
      return {
        valida: false,
        motivo: 'File troppo grande',
        dettagli: `Dimensione: ${Math.round(stats.size / 1024 / 1024)}MB, Max: ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }
    
    // Verifica estensione file
    const ext = path.extname(filePath).toLowerCase();
    const estensioni_valide = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!estensioni_valide.includes(ext)) {
      return {
        valida: false,
        motivo: 'Formato file non supportato',
        dettagli: `Estensione: ${ext}, Supportate: ${estensioni_valide.join(', ')}`
      };
    }
    
    return {
      valida: true,
      motivo: null,
      dettagli: null
    };
    
  } catch (error) {
    console.error('Errore analisi immagine:', error);
    return {
      valida: false,
      motivo: 'Errore durante l\'analisi dell\'immagine',
      dettagli: error.message
    };
  }
}

// Middleware principale per moderazione contenuti
const moderazioneContenuti = async (req, res, next) => {
  try {
    const problemi = [];
    
    // Analizza testi nei campi del body
    const campiTesto = ['titolo', 'descrizione', 'contenuto', 'commento'];
    
    campiTesto.forEach(campo => {
      if (req.body[campo]) {
        const testo = req.body[campo];
        
        // Controlla parole vietate
        const paroleVietate = contienePoroleVietate(testo);
        if (paroleVietate.length > 0) {
          problemi.push({
            campo,
            tipo: 'linguaggio_inappropriato',
            dettagli: `Parole vietate rilevate: ${paroleVietate.join(', ')}`
          });
        }
        
        // Controlla dati sensibili
        const datiSensibili = rilevaDatiSensibili(testo);
        if (datiSensibili.length > 0) {
          problemi.push({
            campo,
            tipo: 'dati_sensibili',
            dettagli: `Dati sensibili rilevati: ${datiSensibili.map(d => d.tipo).join(', ')}`
          });
        }
        
        // Controlla lunghezza eccessiva (possibile spam)
        if (testo.length > 2000) {
          problemi.push({
            campo,
            tipo: 'testo_troppo_lungo',
            dettagli: `Lunghezza: ${testo.length} caratteri (max 2000)`
          });
        }
        
        // Controlla ripetizioni eccessive (possibile spam)
        const parole = testo.toLowerCase().split(/\s+/);
        const frequenze = {};
        parole.forEach(parola => {
          if (parola.length > 3) {
            frequenze[parola] = (frequenze[parola] || 0) + 1;
          }
        });
        
        const parolePiuRipetute = Object.entries(frequenze)
          .filter(([parola, freq]) => freq > 5)
          .map(([parola]) => parola);
        
        if (parolePiuRipetute.length > 0) {
          problemi.push({
            campo,
            tipo: 'possibile_spam',
            dettagli: `Parole ripetute eccessivamente: ${parolePiuRipetute.join(', ')}`
          });
        }
      }
    });
    
    // Analizza immagini se presenti
    if (req.files) {
      const files = Array.isArray(req.files) ? req.files : [req.files].filter(Boolean);
      
      for (const file of files) {
        if (file && file.path) {
          const analisi = await analizzaImmagine(file.path);
          if (!analisi.valida) {
            problemi.push({
              campo: 'immagine',
              tipo: 'immagine_non_valida',
              dettagli: `${analisi.motivo}: ${analisi.dettagli}`
            });
          }
        }
      }
    }
    
    // Se ci sono problemi gravi, blocca la richiesta
    const problemiGravi = problemi.filter(p => 
      ['linguaggio_inappropriato', 'dati_sensibili', 'immagine_non_valida'].includes(p.tipo)
    );
    
    if (problemiGravi.length > 0) {
      // Log per amministratori
      console.warn('Contenuto bloccato dalla moderazione:', {
        utente: req.user?.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        problemi: problemiGravi,
        timestamp: new Date().toISOString()
      });
      
      return res.status(400).json({
        errore: 'Contenuto non conforme alle linee guida',
        motivo: 'moderazione_automatica',
        dettagli: problemiGravi.map(p => ({
          campo: p.campo,
          messaggio: getMessaggioUtente(p.tipo)
        }))
      });
    }
    
    // Se ci sono problemi minori, flagga per revisione manuale
    if (problemi.length > 0) {
      req.flaggedForReview = true;
      req.moderationIssues = problemi;
      
      console.info('Contenuto flaggato per revisione:', {
        utente: req.user?.id,
        problemi: problemi,
        timestamp: new Date().toISOString()
      });
    }
    
    next();
    
  } catch (error) {
    console.error('Errore nel middleware di moderazione:', error);
    // In caso di errore, lascia passare ma logga
    next();
  }
};

// Funzione per ottenere messaggi user-friendly
function getMessaggioUtente(tipoProblema) {
  const messaggi = {
    'linguaggio_inappropriato': 'Il contenuto contiene linguaggio inappropriato. Mantieni un tono rispettoso.',
    'dati_sensibili': 'Non condividere informazioni personali come telefono, email o indirizzi. Usa la chat per i dettagli.',
    'immagine_non_valida': 'L\'immagine non è valida o non rispetta i requisiti di formato e dimensione.',
    'testo_troppo_lungo': 'Il testo è troppo lungo. Cerca di essere più conciso.',
    'possibile_spam': 'Il contenuto sembra essere spam. Evita ripetizioni eccessive.'
  };
  
  return messaggi[tipoProblema] || 'Contenuto non conforme alle linee guida della community.';
}

// Middleware per verificare rate limiting (anti-spam)
const rateLimiting = (req, res, next) => {
  // Implementazione base del rate limiting
  const userId = req.user?.id;
  const ip = req.ip;
  const key = userId || ip;
  
  // In produzione, usare Redis o un database per il tracking
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }
  
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minuti
  const maxRequests = 50; // Max 50 richieste per finestra
  
  const userRequests = global.rateLimitStore.get(key) || [];
  
  // Rimuovi richieste vecchie
  const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({
      errore: 'Troppe richieste',
      messaggio: 'Hai superato il limite di richieste. Riprova tra qualche minuto.',
      retryAfter: Math.ceil(windowMs / 1000)
    });
  }
  
  // Aggiungi la richiesta corrente
  recentRequests.push(now);
  global.rateLimitStore.set(key, recentRequests);
  
  next();
};

// Funzione per pulire periodicamente il rate limit store
setInterval(() => {
  if (global.rateLimitStore) {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    
    for (const [key, requests] of global.rateLimitStore.entries()) {
      const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);
      if (recentRequests.length === 0) {
        global.rateLimitStore.delete(key);
      } else {
        global.rateLimitStore.set(key, recentRequests);
      }
    }
  }
}, 5 * 60 * 1000); // Pulizia ogni 5 minuti

module.exports = {
  moderazioneContenuti,
  rateLimiting,
  contienePoroleVietate,
  rilevaDatiSensibili,
  analizzaImmagine
};
