// Modello per gli annunci di libri nel marketplace
const mongoose = require('mongoose');

const bookListingSchema = new mongoose.Schema({
  // Informazioni libro
  titolo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  autori: [{
    type: String,
    required: true,
    trim: true
  }],
  isbn: {
    type: String,
    required: true,
    trim: true,
    match: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
  },
  casaEditrice: {
    type: String,
    required: true,
    trim: true
  },
  annoEdizione: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  materia: {
    type: String,
    required: true,
    enum: ['Italiano', 'Storia', 'Filosofia', 'Latino', 'Matematica', 'Fisica', 'Scienze', 'Arte', 'Inglese', 'Religione', 'Altro']
  },
  classeConsigliata: {
    type: String,
    required: true,
    enum: ['1°', '2°', '3°', '4°', '5°', 'Università', 'Altro']
  },

  // Condizione e prezzo
  condizione: {
    type: String,
    required: true,
    enum: ['nuovo', 'ottimo', 'buono', 'usato', 'danneggiato']
  },
  prezzo: {
    type: Number,
    min: 0,
    max: 1000
  },
  tipoVendita: {
    type: String,
    required: true,
    enum: ['vendita', 'scambio', 'entrambi'],
    default: 'vendita'
  },

  // Immagini
  immagini: [{
    url: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      required: true
    },
    metadata: {
      size: Number,
      format: String,
      width: Number,
      height: Number
    }
  }],

  // Descrizione e posizione
  descrizione: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  citta: {
    type: String,
    required: true,
    trim: true
  },
  provincia: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2
  },
  regione: {
    type: String,
    required: true,
    trim: true
  },

  // Venditore
  venditore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Stato annuncio
  stato: {
    type: String,
    enum: ['attivo', 'in_trattativa', 'venduto', 'scambiato', 'rimosso', 'sospeso'],
    default: 'attivo'
  },
  
  // Statistiche
  visualizzazioni: {
    type: Number,
    default: 0
  },
  interessati: [{
    utente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dataInteresse: {
      type: Date,
      default: Date.now
    }
  }],

  // Moderazione
  moderato: {
    type: Boolean,
    default: false
  },
  flagged: {
    type: Boolean,
    default: false
  },
  motivoFlag: String,

  // Metadati
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  dataScadenza: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 giorni
  }
});

// Indici per ricerca veloce
bookListingSchema.index({ titolo: 'text', autori: 'text', descrizione: 'text' });
bookListingSchema.index({ isbn: 1 });
bookListingSchema.index({ materia: 1, classeConsigliata: 1 });
bookListingSchema.index({ citta: 1, provincia: 1 });
bookListingSchema.index({ prezzo: 1 });
bookListingSchema.index({ condizione: 1 });
bookListingSchema.index({ stato: 1 });
bookListingSchema.index({ createdAt: -1 });
bookListingSchema.index({ venditore: 1 });

// Middleware per aggiornare updatedAt
bookListingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metodi virtuali
bookListingSchema.virtual('prezzoFormattato').get(function() {
  if (this.tipoVendita === 'scambio') return 'Scambio';
  return this.prezzo ? `€${this.prezzo.toFixed(2)}` : 'Prezzo da concordare';
});

bookListingSchema.virtual('tempoFa').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const giorni = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (giorni === 0) return 'Oggi';
  if (giorni === 1) return 'Ieri';
  if (giorni < 7) return `${giorni} giorni fa`;
  if (giorni < 30) return `${Math.floor(giorni / 7)} settimane fa`;
  return `${Math.floor(giorni / 30)} mesi fa`;
});

// Metodi statici
bookListingSchema.statics.findByISBN = function(isbn) {
  return this.find({ isbn: isbn, stato: 'attivo' });
};

bookListingSchema.statics.findByVenditore = function(venditorId) {
  return this.find({ venditore: venditorId }).populate('venditore', 'nome email');
};

bookListingSchema.statics.ricercaAvanzata = function(filtri) {
  const query = { stato: 'attivo' };
  
  if (filtri.titolo) {
    query.$text = { $search: filtri.titolo };
  }
  if (filtri.isbn) {
    query.isbn = new RegExp(filtri.isbn, 'i');
  }
  if (filtri.autore) {
    query.autori = new RegExp(filtri.autore, 'i');
  }
  if (filtri.materia) {
    query.materia = filtri.materia;
  }
  if (filtri.condizione) {
    query.condizione = { $in: Array.isArray(filtri.condizione) ? filtri.condizione : [filtri.condizione] };
  }
  if (filtri.prezzoMin || filtri.prezzoMax) {
    query.prezzo = {};
    if (filtri.prezzoMin) query.prezzo.$gte = filtri.prezzoMin;
    if (filtri.prezzoMax) query.prezzo.$lte = filtri.prezzoMax;
  }
  if (filtri.citta) {
    query.citta = new RegExp(filtri.citta, 'i');
  }
  if (filtri.provincia) {
    query.provincia = filtri.provincia.toUpperCase();
  }
  
  return this.find(query).populate('venditore', 'nome citta valutazioneMedia libriVenduti');
};

module.exports = mongoose.model('BookListing', bookListingSchema);
