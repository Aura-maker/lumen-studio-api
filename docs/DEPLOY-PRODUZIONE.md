# 🚀 Deploy in Produzione - ImparaFacile

## Panoramica Architettura

```
                                    ┌─────────────────┐
                                    │   CloudFlare    │
                                    │   (CDN + WAF)   │
                                    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │     NGINX       │
                                    │  Load Balancer  │
                                    │   + SSL/TLS     │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
           │    API Pod 1    │     │    API Pod 2    │     │    API Pod N    │
           │   (Node.js)     │     │   (Node.js)     │     │   (Node.js)     │
           └────────┬────────┘     └────────┬────────┘     └────────┬────────┘
                    │                        │                        │
                    └────────────────────────┼────────────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
           ┌────────▼────────┐     ┌────────▼────────┐     ┌────────▼────────┐
           │   PostgreSQL    │     │     Redis       │     │    Workers      │
           │   (Primary)     │     │  (Cache+Queue)  │     │  (Background)   │
           └─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Requisiti Minimi per 10.000 Utenti

| Componente | Specifiche | Costo Stimato/mese |
|------------|------------|-------------------|
| API Servers | 3x 2vCPU, 4GB RAM | €90 |
| PostgreSQL | 4vCPU, 16GB RAM, 100GB SSD | €150 |
| Redis | 2GB RAM | €30 |
| Load Balancer | Managed | €20 |
| CDN | CloudFlare Pro | €20 |
| **Totale** | | **~€310/mese** |

## Opzione 1: Docker Compose (VPS/Dedicated)

### Server Consigliati
- **Hetzner**: CPX41 (8vCPU, 16GB) - €30/mese
- **DigitalOcean**: Premium 8GB - €48/mese
- **OVH**: VPS Essential 8 - €35/mese

### Setup

```bash
# 1. Clona repository
git clone https://github.com/imparafacile/backend.git
cd backend

# 2. Configura variabili ambiente
cp infrastructure/.env.production .env
nano .env  # Modifica con i tuoi valori

# 3. Genera certificati SSL (Let's Encrypt)
mkdir -p infrastructure/ssl
certbot certonly --standalone -d api.imparafacile.it
cp /etc/letsencrypt/live/api.imparafacile.it/* infrastructure/ssl/

# 4. Avvia servizi
cd infrastructure
docker-compose up -d

# 5. Esegui migrazioni database
docker-compose exec api npx prisma migrate deploy

# 6. Popola dati iniziali
docker-compose exec api node prisma/seed-completo.js
```

### Scaling Orizzontale

```bash
# Scala API a 5 istanze
docker-compose up -d --scale api=5
```

## Opzione 2: Kubernetes (Cloud)

### Provider Consigliati
- **Google GKE**: Autopilot - pay per pod
- **AWS EKS**: Con Fargate
- **DigitalOcean Kubernetes**: Più economico

### Setup GKE

```bash
# 1. Crea cluster
gcloud container clusters create imparafacile \
  --zone europe-west1-b \
  --num-nodes 3 \
  --machine-type e2-standard-2 \
  --enable-autoscaling \
  --min-nodes 2 \
  --max-nodes 10

# 2. Configura kubectl
gcloud container clusters get-credentials imparafacile

# 3. Installa cert-manager per SSL
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# 4. Crea secrets
kubectl create secret generic imparafacile-secrets \
  --from-env-file=.env.production \
  -n imparafacile

# 5. Deploy
kubectl apply -f infrastructure/kubernetes/deployment.yaml

# 6. Verifica
kubectl get pods -n imparafacile
kubectl get services -n imparafacile
```

## Opzione 3: Platform as a Service

### Railway.app (Più Semplice)

```bash
# 1. Installa CLI
npm install -g @railway/cli

# 2. Login e init
railway login
railway init

# 3. Aggiungi servizi
railway add postgresql
railway add redis

# 4. Deploy
railway up
```

### Render.com

1. Connetti repository GitHub
2. Crea Web Service (Node.js)
3. Aggiungi PostgreSQL e Redis
4. Configura variabili ambiente
5. Deploy automatico su push

## Database

### Backup Automatici

```bash
# Cron job per backup giornaliero
0 3 * * * pg_dump -h localhost -U imparafacile imparafacile | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Retention 30 giorni
find /backups -name "db_*.sql.gz" -mtime +30 -delete
```

### Replica Read-Only

```yaml
# docker-compose.override.yml
services:
  postgres-replica:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=imparafacile
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    command: |
      postgres -c wal_level=replica
               -c hot_standby=on
               -c max_wal_senders=10
```

## Monitoring

### Grafana Dashboards

Accedi a `https://grafana.imparafacile.it:3001`

Dashboard incluse:
- **API Performance**: Latenza, throughput, errori
- **Business Metrics**: Utenti, quiz, XP
- **Infrastructure**: CPU, memoria, disco

### Alerting

```yaml
# prometheus/rules/alerts.yml
groups:
- name: imparafacile
  rules:
  - alert: HighErrorRate
    expr: rate(imparafacile_http_errors_total[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "Alto tasso di errori API"
      
  - alert: HighLatency
    expr: imparafacile_http_request_duration_ms{quantile="0.99"} > 2000
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "Latenza API elevata (p99 > 2s)"
```

## Sicurezza

### Checklist Pre-Deploy

- [ ] Cambiare tutti i valori `CHANGE_ME` in `.env`
- [ ] Generare JWT_SECRET sicuro: `openssl rand -base64 64`
- [ ] Configurare CORS con domini specifici
- [ ] Abilitare rate limiting
- [ ] Configurare WAF (CloudFlare/AWS WAF)
- [ ] Abilitare audit logging
- [ ] Configurare backup automatici
- [ ] Test penetration (OWASP ZAP)

### Headers Sicurezza

Già configurati in nginx.conf:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=63072000`
- `Content-Security-Policy: ...`

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: docker build -t imparafacile/api:${{ github.sha }} .
    
    - name: Push to Registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push imparafacile/api:${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/api api=imparafacile/api:${{ github.sha }} -n imparafacile
```

## Scaling per Picchi

### Durante Esami/Verifiche

```bash
# Scala temporaneamente
kubectl scale deployment api --replicas=10 -n imparafacile

# Dopo il picco
kubectl scale deployment api --replicas=3 -n imparafacile
```

### Auto-scaling Configurato

L'HPA scala automaticamente:
- **Min**: 3 pod
- **Max**: 20 pod
- **Target CPU**: 70%
- **Target Memory**: 80%

## Costi Stimati per Scala

| Utenti | API Pods | DB | Redis | Costo/mese |
|--------|----------|-----|-------|------------|
| 1.000 | 2 | 2GB | 512MB | €50 |
| 10.000 | 3-5 | 8GB | 2GB | €150 |
| 50.000 | 5-10 | 16GB | 4GB | €400 |
| 100.000 | 10-20 | 32GB | 8GB | €800 |

## Supporto

- **Email**: tech@imparafacile.it
- **Status Page**: status.imparafacile.it
- **Documentazione**: docs.imparafacile.it
