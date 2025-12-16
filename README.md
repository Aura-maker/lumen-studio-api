# 📚 ImparaFacile - Backend API

App educativa stile Duolingo per studenti delle superiori italiane.

## 🚀 Quick Start

```bash
# Installa dipendenze
npm install

# Configura database (copia e modifica .env)
# DATABASE_URL deve puntare a PostgreSQL (es. Supabase)

# Avvia server
node server-stable.js
```

Server disponibile su `http://localhost:4000`

## 📋 Funzionalità

### Contenuti Educativi
- **10 materie** complete (Italiano, Storia, Filosofia, Latino, Matematica, Fisica, Scienze, Arte, Inglese, Religione)
- **169 sottoargomenti** con riassunti dettagliati
- **1300+ quiz** con spiegazioni
- **1200+ flashcard** generate automaticamente
- **800 simulazioni d'esame** (Italiano, Matematica, Greco, Latino)

### Sistema Utenti
- Registrazione e login con JWT
- Profilo con avatar e statistiche
- Classifica globale e settimanale
- Streak giornalieri
- Badge e achievements

### Gamification
- Sistema XP e livelli
- Obiettivi giornalieri
- Notifiche in-app

## 🔌 API Endpoints

### Autenticazione
| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/auth/registrati` | POST | Registrazione |
| `/api/auth/login` | POST | Login |
| `/api/auth/me` | GET | Profilo (auth) |

### Contenuti
| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/materie` | GET | Lista materie |
| `/api/materie/:id` | GET | Dettaglio materia |
| `/api/quiz-ultimate/veloce` | GET | Quiz casuali |
| `/api/flashcards` | GET | Flashcard |
| `/api/simulazioni` | GET | Lista simulazioni |
| `/api/simulazioni/avvia` | POST | Avvia simulazione |

### Statistiche
| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/stats/dashboard` | GET | Dashboard (auth) |
| `/api/stats/quiz` | POST | Registra quiz |
| `/api/stats/classifica` | GET | Classifica |

## 🗄️ Database

Usa PostgreSQL (consigliato: Supabase gratuito).

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="chiave-segreta-lunga"
PORT=4000
```

## 📁 Struttura

```
├── server-stable.js      # Entry point
├── src/
│   ├── db/               # Repository database (pg)
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Auth, rate limiting
│   └── data/             # Contenuti statici
├── infrastructure/       # Docker, K8s, Nginx
└── prisma/               # Schema database
```

## 🚀 Deploy Produzione

Vedi `docs/DEPLOY-PRODUZIONE.md` per:
- Docker Compose
- Kubernetes
- Scaling per migliaia di utenti

## 📊 Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Supabase)
- **Auth**: JWT
- **Cache**: Redis (opzionale)
- **Monitoring**: Prometheus + Grafana

---

**Credenziali Test:**
- Admin: `admin@imparafacile.it` / `password123`
- Studente: `mario.rossi@studente.it` / `password123`