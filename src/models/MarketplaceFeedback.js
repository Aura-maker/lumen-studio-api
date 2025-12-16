// Modello per i feedback del marketplace
const mongoose = require('mongoose');

const marketplaceFeedbackSchema = new mongoose.Schema({
  // Transazione di riferimento
  annuncio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookListing',
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketplaceChat',
    required: true
  },

  // Chi lascia il feedback e chi lo riceve
  recensore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recensito: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Valutazione
  stelle: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commento: {
    type: String,
    maxlength: 500,
    trim: true
  },

  // Tipo di transazione
  tipoTransazione: {
    type: String,
    enum: ['vendita', 'scambio'],
    required: true
  },

  // Aspetti specifici della valutazione
  aspetti: {
    comunicazione: {
      type: Number,
      min: 1,
      max: 5
    },
    descrizioneAccurata: {
      type: Number,
      min: 1,
      max: 5
    },
    tempiConsegna: {
      type: Number,
      min: 1,
      max: 5
    },
    condizioniLibro: {
      type: Number,
      min: 1,
      max: 5
    }
  },

  // Metadati
  createdAt: {
    type: Date,
    default: Date.now
  },
  verificato: {
    type: Boolean,
    default: false
  },
  segnalato: {
    type: Boolean,
    default: false
  },
  motivoSegnalazione: String
});

// Indici
marketplaceFeedbackSchema.index({ recensito: 1, createdAt: -1 });
marketplaceFeedbackSchema.index({ recensore: 1 });
marketplaceFeedbackSchema.index({ annuncio: 1 });
marketplaceFeedbackSchema.index({ chat: 1 });
marketplaceFeedbackSchema.index({ stelle: 1 });

// Vincolo di unicità: un utente può lasciare un solo feedback per chat
marketplaceFeedbackSchema.index({ chat: 1, recensore: 1 }, { unique: true });

// Metodi virtuali
marketplaceFeedbackSchema.virtual('mediaAspetti').get(function() {
  const aspetti = this.aspetti;
  const valori = Object.values(aspetti).filter(v => v != null);
  if (valori.length === 0) return null;
  
  return valori.reduce((sum, val) => sum + val, 0) / valori.length;
});

marketplaceFeedbackSchema.virtual('tempoFa').get(function() {
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
marketplaceFeedbackSchema.statics.calcolaStatisticheUtente = function(userId) {
  return this.aggregate([
    { $match: { recensito: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        mediaStelle: { $avg: '$stelle' },
        totaleFeedback: { $sum: 1 },
        distribuzione: {
          $push: {
            stelle: '$stelle',
            aspetti: '$aspetti'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        mediaStelle: { $round: ['$mediaStelle', 1] },
        totaleFeedback: 1,
        distribuzione: 1,
        stelle5: {
          $size: {
            $filter: {
              input: '$distribuzione',
              cond: { $eq: ['$$this.stelle', 5] }
            }
          }
        },
        stelle4: {
          $size: {
            $filter: {
              input: '$distribuzione',
              cond: { $eq: ['$$this.stelle', 4] }
            }
          }
        },
        stelle3: {
          $size: {
            $filter: {
              input: '$distribuzione',
              cond: { $eq: ['$$this.stelle', 3] }
            }
          }
        },
        stelle2: {
          $size: {
            $filter: {
              input: '$distribuzione',
              cond: { $eq: ['$$this.stelle', 2] }
            }
          }
        },
        stelle1: {
          $size: {
            $filter: {
              input: '$distribuzione',
              cond: { $eq: ['$$this.stelle', 1] }
            }
          }
        }
      }
    }
  ]);
};

marketplaceFeedbackSchema.statics.getFeedbackUtente = function(userId, limit = 10) {
  return this.find({ recensito: userId })
    .populate('recensore', 'nome avatar')
    .populate('annuncio', 'titolo immagini')
    .sort({ createdAt: -1 })
    .limit(limit);
};

marketplaceFeedbackSchema.statics.verificaPermessoFeedback = function(chatId, userId) {
  // Verifica che l'utente possa lasciare feedback per questa chat
  return this.findOne({ chat: chatId, recensore: userId })
    .then(feedbackEsistente => {
      if (feedbackEsistente) {
        throw new Error('Hai già lasciato un feedback per questa transazione');
      }
      
      // Verifica che la chat sia completata
      return mongoose.model('MarketplaceChat').findById(chatId);
    })
    .then(chat => {
      if (!chat || chat.stato !== 'completata') {
        throw new Error('Puoi lasciare feedback solo per transazioni completate');
      }
      
      // Verifica che l\'utente sia partecipante alla chat
      const isPartecipante = chat.partecipanti.some(p => 
        p.utente.toString() === userId.toString()
      );
      
      if (!isPartecipante) {
        throw new Error('Non sei autorizzato a lasciare feedback per questa transazione');
      }
      
      return chat;
    });
};

// Middleware per aggiornare le statistiche dell'utente
marketplaceFeedbackSchema.post('save', async function(doc) {
  try {
    // Ricalcola le statistiche dell'utente recensito
    const stats = await this.constructor.calcolaStatisticheUtente(doc.recensito);
    
    if (stats.length > 0) {
      const { mediaStelle, totaleFeedback } = stats[0];
      
      // Aggiorna il profilo utente
      await mongoose.model('User').findByIdAndUpdate(doc.recensito, {
        'marketplace.valutazioneMedia': mediaStelle,
        'marketplace.totaleFeedback': totaleFeedback,
        'marketplace.ultimoFeedback': new Date()
      });
    }
  } catch (error) {
    console.error('Errore aggiornamento statistiche utente:', error);
  }
});

module.exports = mongoose.model('MarketplaceFeedback', marketplaceFeedbackSchema);
