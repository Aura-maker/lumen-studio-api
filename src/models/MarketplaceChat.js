// Modello per le chat del marketplace
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  mittente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contenuto: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  immagine: {
    url: String,
    altText: String,
    metadata: {
      size: Number,
      format: String,
      width: Number,
      height: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  stato: {
    type: String,
    enum: ['inviato', 'consegnato', 'letto'],
    default: 'inviato'
  },
  eliminato: {
    type: Boolean,
    default: false
  }
});

const marketplaceChatSchema = new mongoose.Schema({
  // Collegamento all'annuncio
  annuncio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookListing',
    required: true
  },
  
  // Partecipanti (sempre 2: venditore e potenziale acquirente)
  partecipanti: [{
    utente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ruolo: {
      type: String,
      enum: ['venditore', 'acquirente'],
      required: true
    },
    ultimaLettura: {
      type: Date,
      default: Date.now
    },
    notificheAttive: {
      type: Boolean,
      default: true
    }
  }],

  // Messaggi
  messaggi: [messageSchema],

  // Stato della conversazione
  stato: {
    type: String,
    enum: ['attiva', 'in_trattativa', 'completata', 'annullata', 'archiviata', 'bloccata'],
    default: 'attiva'
  },

  // Transazione
  transazione: {
    tipo: {
      type: String,
      enum: ['vendita', 'scambio']
    },
    prezzo: Number,
    stato: {
      type: String,
      enum: ['proposta', 'accettata', 'rifiutata', 'completata', 'annullata']
    },
    dataCompletamento: Date
  },

  // Moderazione
  segnalazioni: [{
    segnalatore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    motivo: {
      type: String,
      enum: ['linguaggio_inappropriato', 'truffa', 'comportamento_scorretto', 'spam', 'altro']
    },
    descrizione: String,
    data: {
      type: Date,
      default: Date.now
    },
    risolto: {
      type: Boolean,
      default: false
    }
  }],

  // Metadati
  createdAt: {
    type: Date,
    default: Date.now
  },
  ultimaAttivita: {
    type: Date,
    default: Date.now
  },
  archiviataAutomaticamente: {
    type: Date
  }
});

// Indici
marketplaceChatSchema.index({ annuncio: 1 });
marketplaceChatSchema.index({ 'partecipanti.utente': 1 });
marketplaceChatSchema.index({ ultimaAttivita: -1 });
marketplaceChatSchema.index({ stato: 1 });
marketplaceChatSchema.index({ createdAt: -1 });

// Middleware per aggiornare ultimaAttivita
marketplaceChatSchema.pre('save', function(next) {
  if (this.isModified('messaggi')) {
    this.ultimaAttivita = new Date();
  }
  next();
});

// Metodi virtuali
marketplaceChatSchema.virtual('messaggiNonLetti').get(function() {
  const counts = {};
  this.partecipanti.forEach(p => {
    const userId = p.utente.toString();
    counts[userId] = this.messaggi.filter(m => 
      m.timestamp > p.ultimaLettura && 
      m.mittente.toString() !== userId &&
      !m.eliminato
    ).length;
  });
  return counts;
});

marketplaceChatSchema.virtual('ultimoMessaggio').get(function() {
  const messaggiAttivi = this.messaggi.filter(m => !m.eliminato);
  return messaggiAttivi.length > 0 ? messaggiAttivi[messaggiAttivi.length - 1] : null;
});

// Metodi di istanza
marketplaceChatSchema.methods.aggiungiMessaggio = function(mittente, contenuto, immagine = null) {
  const nuovoMessaggio = {
    mittente,
    contenuto,
    immagine,
    timestamp: new Date(),
    stato: 'inviato'
  };
  
  this.messaggi.push(nuovoMessaggio);
  this.ultimaAttivita = new Date();
  
  return this.save();
};

marketplaceChatSchema.methods.segnaComeLetto = function(userId) {
  const partecipante = this.partecipanti.find(p => p.utente.toString() === userId.toString());
  if (partecipante) {
    partecipante.ultimaLettura = new Date();
    
    // Aggiorna stato messaggi a 'letto'
    this.messaggi.forEach(msg => {
      if (msg.mittente.toString() !== userId.toString() && msg.stato !== 'letto') {
        msg.stato = 'letto';
      }
    });
    
    return this.save();
  }
  return Promise.resolve(this);
};

marketplaceChatSchema.methods.bloccaConversazione = function(motivoBlocco) {
  this.stato = 'bloccata';
  this.segnalazioni.push({
    motivo: 'altro',
    descrizione: motivoBlocco,
    data: new Date()
  });
  return this.save();
};

marketplaceChatSchema.methods.proponiTransazione = function(tipo, prezzo = null) {
  this.transazione = {
    tipo,
    prezzo,
    stato: 'proposta'
  };
  this.stato = 'in_trattativa';
  return this.save();
};

marketplaceChatSchema.methods.completaTransazione = function() {
  if (this.transazione) {
    this.transazione.stato = 'completata';
    this.transazione.dataCompletamento = new Date();
    this.stato = 'completata';
    return this.save();
  }
  return Promise.resolve(this);
};

// Metodi statici
marketplaceChatSchema.statics.findByUser = function(userId) {
  return this.find({
    'partecipanti.utente': userId,
    stato: { $ne: 'archiviata' }
  })
  .populate('annuncio', 'titolo immagini prezzo condizione stato')
  .populate('partecipanti.utente', 'nome avatar')
  .sort({ ultimaAttivita: -1 });
};

marketplaceChatSchema.statics.findByAnnuncio = function(annuncioId) {
  return this.find({ annuncio: annuncioId })
    .populate('partecipanti.utente', 'nome avatar')
    .sort({ createdAt: -1 });
};

marketplaceChatSchema.statics.creaChat = function(annuncioId, venditorId, acquirenteId) {
  // Verifica se esiste già una chat tra questi utenti per questo annuncio
  return this.findOne({
    annuncio: annuncioId,
    'partecipanti.utente': { $all: [venditorId, acquirenteId] }
  }).then(chatEsistente => {
    if (chatEsistente) {
      return chatEsistente;
    }
    
    // Crea nuova chat
    const nuovaChat = new this({
      annuncio: annuncioId,
      partecipanti: [
        { utente: venditorId, ruolo: 'venditore' },
        { utente: acquirenteId, ruolo: 'acquirente' }
      ]
    });
    
    return nuovaChat.save();
  });
};

marketplaceChatSchema.statics.archiviaChatInattive = function() {
  const trentaGiorniFa = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  return this.updateMany(
    {
      ultimaAttivita: { $lt: trentaGiorniFa },
      stato: { $in: ['attiva', 'completata'] }
    },
    {
      stato: 'archiviata',
      archiviataAutomaticamente: new Date()
    }
  );
};

module.exports = mongoose.model('MarketplaceChat', marketplaceChatSchema);
