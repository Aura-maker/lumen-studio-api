// Modello User aggiornato con funzionalità marketplace
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Dati base
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Informazioni profilo
  avatar: {
    type: String,
    default: null
  },
  scuola: {
    type: String,
    trim: true
  },
  classe: {
    type: String,
    enum: ['1°', '2°', '3°', '4°', '5°', 'Università', 'Altro']
  },
  
  // Posizione
  citta: {
    type: String,
    trim: true
  },
  provincia: {
    type: String,
    trim: true,
    maxlength: 2
  },
  regione: {
    type: String,
    trim: true
  },
  
  // Statistiche marketplace
  marketplace: {
    // Statistiche venditore
    valutazioneMedia: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totaleFeedback: {
      type: Number,
      default: 0
    },
    libriVenduti: {
      type: Number,
      default: 0
    },
    libriScambiati: {
      type: Number,
      default: 0
    },
    
    // Statistiche attività
    annunciPubblicati: {
      type: Number,
      default: 0
    },
    chatAttive: {
      type: Number,
      default: 0
    },
    ultimaAttivita: {
      type: Date,
      default: Date.now
    },
    ultimoFeedback: {
      type: Date
    },
    
    // Preferenze
    notificheEmail: {
      type: Boolean,
      default: true
    },
    notifichePush: {
      type: Boolean,
      default: true
    },
    visibilitaProfilo: {
      type: String,
      enum: ['pubblico', 'limitato', 'privato'],
      default: 'pubblico'
    },
    
    // Sicurezza
    accountVerificato: {
      type: Boolean,
      default: false
    },
    telefonoVerificato: {
      type: Boolean,
      default: false
    },
    emailVerificata: {
      type: Boolean,
      default: false
    },
    
    // Moderazione
    segnalazioni: {
      type: Number,
      default: 0
    },
    bannato: {
      type: Boolean,
      default: false
    },
    motivoBan: {
      type: String
    },
    dataBan: {
      type: Date
    }
  },
  
  // Gamification (esistente)
  xp: {
    type: Number,
    default: 0
  },
  livello: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  ultimoAccesso: {
    type: Date,
    default: Date.now
  },
  
  // Metadati
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indici
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'marketplace.valutazioneMedia': -1 });
userSchema.index({ 'marketplace.libriVenduti': -1 });
userSchema.index({ citta: 1, provincia: 1 });
userSchema.index({ createdAt: -1 });

// Middleware per hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware per aggiornare updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metodi di istanza
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.aggiornaUltimoAccesso = function() {
  this.ultimoAccesso = new Date();
  this.marketplace.ultimaAttivita = new Date();
  return this.save();
};

userSchema.methods.aggiornaStatisticheVendita = function(tipoTransazione) {
  if (tipoTransazione === 'vendita') {
    this.marketplace.libriVenduti += 1;
  } else if (tipoTransazione === 'scambio') {
    this.marketplace.libriScambiati += 1;
  }
  
  this.marketplace.ultimaAttivita = new Date();
  return this.save();
};

userSchema.methods.aggiornaValutazione = function(nuovaValutazione) {
  const totaleFeedback = this.marketplace.totaleFeedback;
  const valutazioneAttuale = this.marketplace.valutazioneMedia;
  
  // Calcola nuova media
  const nuovaMedia = ((valutazioneAttuale * totaleFeedback) + nuovaValutazione) / (totaleFeedback + 1);
  
  this.marketplace.valutazioneMedia = Math.round(nuovaMedia * 10) / 10; // Arrotonda a 1 decimale
  this.marketplace.totaleFeedback += 1;
  this.marketplace.ultimoFeedback = new Date();
  
  return this.save();
};

userSchema.methods.segnalaUtente = function(motivo) {
  this.marketplace.segnalazioni += 1;
  
  // Auto-ban dopo 5 segnalazioni (da rivedere manualmente)
  if (this.marketplace.segnalazioni >= 5 && !this.marketplace.bannato) {
    this.marketplace.bannato = true;
    this.marketplace.motivoBan = 'Segnalazioni multiple - revisione automatica';
    this.marketplace.dataBan = new Date();
  }
  
  return this.save();
};

// Metodi virtuali
userSchema.virtual('nomeCompleto').get(function() {
  return this.nome;
});

userSchema.virtual('marketplace.reputazione').get(function() {
  const valutazione = this.marketplace.valutazioneMedia;
  const feedback = this.marketplace.totaleFeedback;
  
  if (feedback === 0) return 'Nuovo';
  if (valutazione >= 4.5 && feedback >= 10) return 'Eccellente';
  if (valutazione >= 4.0 && feedback >= 5) return 'Molto buono';
  if (valutazione >= 3.5) return 'Buono';
  if (valutazione >= 3.0) return 'Discreto';
  return 'In miglioramento';
});

userSchema.virtual('marketplace.badgeVenditore').get(function() {
  const venduti = this.marketplace.libriVenduti;
  const scambiati = this.marketplace.libriScambiati;
  const totale = venduti + scambiati;
  
  if (totale >= 100) return '🏆 Venditore Esperto';
  if (totale >= 50) return '⭐ Venditore Affidabile';
  if (totale >= 20) return '✅ Venditore Attivo';
  if (totale >= 5) return '📚 Venditore';
  return '🆕 Nuovo Venditore';
});

userSchema.virtual('marketplace.tempoRegistrazione').get(function() {
  const now = new Date();
  const registrazione = this.createdAt;
  const diffMs = now - registrazione;
  const diffGiorni = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffGiorni < 30) return `${diffGiorni} giorni`;
  if (diffGiorni < 365) return `${Math.floor(diffGiorni / 30)} mesi`;
  return `${Math.floor(diffGiorni / 365)} anni`;
});

// Metodi statici
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.getTopVenditori = function(limit = 10) {
  return this.find({
    'marketplace.bannato': false,
    'marketplace.totaleFeedback': { $gte: 3 }
  })
  .sort({
    'marketplace.valutazioneMedia': -1,
    'marketplace.totaleFeedback': -1
  })
  .limit(limit)
  .select('nome citta marketplace.valutazioneMedia marketplace.totaleFeedback marketplace.libriVenduti');
};

userSchema.statics.getStatisticheGenerali = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totaleUtenti: { $sum: 1 },
        utentiAttivi: {
          $sum: {
            $cond: [
              { $gte: ['$marketplace.ultimaAttivita', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        },
        mediaValutazione: { $avg: '$marketplace.valutazioneMedia' },
        totaleLibriVenduti: { $sum: '$marketplace.libriVenduti' },
        totaleLibriScambiati: { $sum: '$marketplace.libriScambiati' }
      }
    }
  ]);
};

// Rimuovi password dal JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
