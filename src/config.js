// Config generali (in italiano)
const dotenv = require('dotenv');
dotenv.config();

const corsOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

module.exports = {
  porta: process.env.PORT || 4000,
  jwtSegreto: process.env.JWT_SECRET || 'cambia_questo_segreto',
  jwtScadenza: process.env.JWT_EXPIRES_IN || '15m',
  databaseUrl: process.env.DATABASE_URL,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }
  },
  cors: {
    origins: corsOrigins.length ? corsOrigins : ['http://localhost:3000']
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAMESITE || 'lax'
  }
};