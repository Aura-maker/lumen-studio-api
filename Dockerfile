# ImparaFacile Backend
FROM node:20-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze (production only)
RUN npm ci --only=production

# Copia sorgenti
COPY . .

# Porta
EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Avvia
CMD ["node", "server-stable.js"]
