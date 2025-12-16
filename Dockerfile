# ImparaFacile Backend
FROM node:20-alpine

WORKDIR /app

# Copia package files
COPY package*.json ./

# Installa dipendenze (production only)
RUN npm install --only=production

# Copia sorgenti
COPY . .

# Porta
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Avvia
CMD ["node", "server-stable.js"]
