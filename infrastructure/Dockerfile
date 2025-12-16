# ═══════════════════════════════════════════════════════════════════════════════
# DOCKERFILE - API BACKEND IMPARAFACILE
# ═══════════════════════════════════════════════════════════════════════════════
# Ottimizzato per produzione

FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./
COPY prisma ./prisma/

# Installa dipendenze
RUN npm ci --only=production

# Genera Prisma client
RUN npx prisma generate

# ─────────────────────────────────────────────────────────────────────────────
# STAGE PRODUZIONE
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Installa curl per healthcheck
RUN apk add --no-cache curl

# Crea utente non-root per sicurezza
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copia da builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copia codice sorgente
COPY . .

# Imposta permessi
RUN chown -R nodejs:nodejs /app

# Usa utente non-root
USER nodejs

# Esponi porta
EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

# Avvia server
CMD ["node", "server-stable.js"]
