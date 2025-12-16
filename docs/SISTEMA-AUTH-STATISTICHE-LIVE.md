# Sistema Autenticazione e Statistiche Live

## Panoramica

Sistema completo per gestire l'autenticazione degli studenti e le statistiche in tempo reale, connesso al database PostgreSQL tramite Prisma.

## Architettura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  AuthContext          │  Hooks                │  Components      │
│  - login()            │  - useStatisticheLive │  - LoginPage     │
│  - registrati()       │  - useClassifica      │  - DashboardLive │
│  - logout()           │  - useNotifiche       │  - ProtectedRoute│
│  - refreshToken()     │  - useStreak          │                  │
│  - registraQuiz()     │  - useBadge           │                  │
│  - registraFlashcard()│  - useObiettivi       │                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
├─────────────────────────────────────────────────────────────────┤
│  /api/auth             │  /api/stats                            │
│  - POST /login         │  - GET /profilo                        │
│  - POST /registrati    │  - GET /dashboard                      │
│  - POST /refresh       │  - POST /quiz                          │
│  - POST /logout        │  - POST /flashcard                     │
│  - GET /me             │  - POST /sessione                      │
│                        │  - GET /classifica                     │
│                        │  - GET /notifiche                      │
│                        │  - GET /badge                          │
│                        │  - GET /streak                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIZI BACKEND                               │
├─────────────────────────────────────────────────────────────────┤
│  StatisticheLiveService                                         │
│  - getProfiloCompleto()                                         │
│  - registraQuiz()                                               │
│  - registraFlashcard()                                          │
│  - registraSessioneStudio()                                     │
│  - registraEsame()                                              │
│  - aggiornaStreak()                                             │
│  - verificaBadge()                                              │
│  - getClassifica()                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL + Prisma)                │
├─────────────────────────────────────────────────────────────────┤
│  Utente                │  StatisticheGiornaliere                │
│  Streak                │  SessioneStudio                        │
│  AchievementUtente     │  SimulazioneEsame                      │
│  Notifica              │  DailyGoal                             │
│  RefreshToken          │  League / LeagueUser                   │
└─────────────────────────────────────────────────────────────────┘
```

## File Creati

### Backend

| File | Descrizione |
|------|-------------|
| `src/services/statistiche-live-service.js` | Servizio principale per statistiche real-time |
| `src/routes/statistiche-live.js` | Routes API per statistiche |
| `prisma/seed-completo.js` | Script per inizializzare il database |

### Frontend

| File | Descrizione |
|------|-------------|
| `src/contexts/AuthContext.js` | Context React per autenticazione |
| `src/hooks/useStatisticheLive.js` | Hooks per dati real-time |
| `src/components/auth/LoginPage.jsx` | Pagina di login |
| `src/components/auth/ProtectedRoute.jsx` | Protezione route autenticate |
| `src/components/dashboard/DashboardLive.jsx` | Dashboard con statistiche live |

## API Endpoints

### Autenticazione (`/api/auth`)

```
POST /api/auth/login
Body: { email, password }
Response: { token, utente }

POST /api/auth/registrati
Body: { nome, email, password }
Response: { token, utente }

POST /api/auth/refresh
Cookie: refreshToken
Response: { token }

POST /api/auth/logout
Response: { ok: true }

GET /api/auth/me
Header: Authorization: Bearer <token>
Response: { utente }
```

### Statistiche Live (`/api/stats`)

```
GET /api/stats/profilo
Response: { profilo completo con XP, livello, streak, badge, statistiche }

GET /api/stats/dashboard
Response: { profilo, classifica, notificheNonLette }

POST /api/stats/quiz
Body: { materia, corretto, tempoRisposta, domandeTotali, domandeCorrette }
Response: { xpGuadagnati, xpTotale, livello, nuoviBadge }

POST /api/stats/flashcard
Body: { flashcardId, ricordata, tempoRisposta }
Response: { xpGuadagnati }

POST /api/stats/sessione
Body: { tipo, materia, argomento, durataMinuti }
Response: { sessione, xpGuadagnati }

GET /api/stats/classifica?limite=10&periodo=settimana
Response: { classifica, posizioneUtente }

GET /api/stats/notifiche?limite=20&soloNonLette=false
Response: { notifiche, nonLette }

GET /api/stats/badge
Response: { badge, totaleOttenuti, totaleBadge }

GET /api/stats/streak
Response: { corrente, massimo, freezeDisponibili }

GET /api/stats/obiettivi
Response: [{ tipoObiettivo, target, corrente, completato }]
```

## Sistema XP e Livelli

### XP per Azione

| Azione | XP |
|--------|-----|
| Quiz corretto | 10 |
| Quiz errato | 2 |
| Quiz perfetto (bonus) | +25 |
| Flashcard vista | 2 |
| Flashcard ricordata | 5 |
| Riassunto letto | 15 |
| Minuto di studio | 1 |
| Esame completato | 50+ |
| Streak bonus | 10 × giorni |

### Livelli

| Livello | XP Richiesti |
|---------|--------------|
| 1 | 0 |
| 2 | 100 |
| 3 | 250 |
| 4 | 500 |
| 5 | 800 |
| 10 | 3800 |
| 20 | 19200 |
| 30 | 40800 |

## Badge Disponibili

- **Quiz**: primo-quiz, quiz-10, quiz-50, quiz-100, quiz-500
- **Precisione**: precisione-80, precisione-90, precisione-95
- **Streak**: streak-3, streak-7, streak-14, streak-30
- **Studio**: studioso-1h, studioso-10h, studioso-50h
- **Flashcard**: flashcard-100, flashcard-500
- **Livelli**: livello-5, livello-10, livello-20
- **Esami**: primo-esame, esami-10

## Utilizzo nel Frontend

### 1. Wrappare l'app con AuthProvider

```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* routes */}
      </Router>
    </AuthProvider>
  );
}
```

### 2. Proteggere le route

```jsx
import { ProtectedRoute } from './components/auth';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardLive />
    </ProtectedRoute>
  } 
/>
```

### 3. Usare i dati live nei componenti

```jsx
import { useAuth } from '../contexts/AuthContext';
import { useStatisticheLive, useStreak } from '../hooks/useStatisticheLive';

function MioComponente() {
  const { utente, registraQuiz } = useAuth();
  const { statistiche, loading } = useStatisticheLive();
  const { streak } = useStreak();

  const handleQuizCompletato = async (risultato) => {
    await registraQuiz({
      materia: 'italiano',
      corretto: risultato.corretto,
      tempoRisposta: risultato.tempo
    });
  };

  return (
    <div>
      <p>XP: {statistiche?.profilo?.xpTotale}</p>
      <p>Streak: {streak.corrente} giorni</p>
    </div>
  );
}
```

## Setup Database

```bash
# 1. Genera client Prisma
npx prisma generate

# 2. Esegui migrazioni
npx prisma migrate dev

# 3. Popola database con dati iniziali
node prisma/seed-completo.js
```

## Credenziali di Test

| Ruolo | Email | Password |
|-------|-------|----------|
| Admin | admin@imparafacile.it | password123 |
| Studente | mario.rossi@studente.it | password123 |
| Studente | giulia.bianchi@studente.it | password123 |

## Note Importanti

1. **Token JWT**: Scade dopo 15 minuti, usa refresh token per rinnovare
2. **Refresh Token**: Cookie httpOnly, scade dopo 30 giorni
3. **Statistiche**: Aggiornate automaticamente ogni 30 secondi nel frontend
4. **Badge**: Verificati automaticamente dopo ogni azione
5. **Streak**: Aggiornato automaticamente, supporta freeze (max 3)
