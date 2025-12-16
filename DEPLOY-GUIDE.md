# 🚀 ImparaFacile - Guida al Deploy

## 🎯 Quick Deploy (5 minuti)

### Backend su Railway
```bash
# 1. Installa Railway CLI
npm install -g @railway/cli

# 2. Login e deploy
railway login
railway init
railway up

# 3. Aggiungi variabili ambiente nel dashboard Railway:
#    - DATABASE_URL (da Supabase)
#    - JWT_SECRET (genera con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
#    - NODE_ENV=production
```

### Frontend su Vercel
```bash
cd ../frontend
npm install -g vercel
vercel login
vercel --prod
```

---

## ✅ Checklist Pre-Deploy

### Backend
- [x] Health check endpoints (`/health`, `/health/detailed`, `/health/ready`)
- [x] Error handling robusto con logging
- [x] Rate limiting configurato
- [x] Daily challenges & streak system
- [x] Test automatizzati
- [x] CI/CD pipeline (GitHub Actions)
- [x] Docker configuration
- [x] Environment variables template

### Frontend
- [x] PWA manifest configurato
- [x] Service Worker per offline
- [x] Vercel configuration

---

## 🚂 Deploy su Railway (Backend)

### 1. Setup
```bash
# Installa Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crea progetto
railway init
```

### 2. Configura Environment Variables
Nel dashboard Railway, aggiungi:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=4000
```

### 3. Deploy
```bash
railway up
```

---

## ▲ Deploy su Vercel (Frontend)

### 1. Setup
```bash
cd frontend
npm install -g vercel
vercel login
```

### 2. Configura
Modifica `vercel.json` con l'URL del backend Railway.

### 3. Deploy
```bash
vercel --prod
```

---

## 🎨 Deploy su Render (Alternativa)

### Backend
1. Vai su [render.com](https://render.com)
2. New → Web Service
3. Connetti il repository GitHub
4. Configura:
   - Build Command: `npm ci`
   - Start Command: `node server-stable.js`
   - Environment: Node
5. Aggiungi environment variables
6. Deploy!

---

## 🐳 Deploy con Docker

### Build
```bash
docker build -t imparafacile-api .
```

### Run
```bash
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  imparafacile-api
```

### Docker Compose
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 📊 Monitoring

### Health Endpoints
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system info
- `GET /health/ready` - Kubernetes readiness probe
- `GET /health/live` - Kubernetes liveness probe
- `GET /health/metrics` - Prometheus metrics

### Logs
I log sono salvati in:
- `logs/error.log` - Solo errori
- `logs/combined.log` - Tutti i log

---

## 🔐 Security Checklist

- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] Rate limiting
- [x] CORS configurato
- [x] Helmet security headers
- [x] Input validation
- [x] SQL injection protection (parametrized queries)
- [ ] HTTPS (configurare su hosting provider)

---

## 📱 PWA Features

- Installabile su mobile
- Funziona offline (cache API)
- Push notifications ready
- Background sync per quiz offline

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

---

## 📈 Performance

- API response time: < 500ms
- Quiz API: < 1000ms
- Database queries ottimizzate
- Caching su risorse statiche

---

## 🆘 Troubleshooting

### Database connection failed
```bash
# Verifica DATABASE_URL
echo $DATABASE_URL

# Test connessione
node -e "require('./src/db/database').pool.query('SELECT 1')"
```

### Port already in use
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4000
kill -9 <PID>
```

### Memory issues
```bash
# Aumenta memoria Node
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

---

## 📞 Supporto

- GitHub Issues: [link]
- Email: support@imparafacile.it
