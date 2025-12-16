-- Tabella utenti semplificata
CREATE TABLE IF NOT EXISTS utenti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  ruolo VARCHAR(50) DEFAULT 'STUDENTE',
  punti INTEGER DEFAULT 0,
  livello INTEGER DEFAULT 1,
  avatar_url TEXT,
  classe VARCHAR(10),
  materie_preferite JSONB DEFAULT '[]',
  obiettivo VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_utenti_email ON utenti(email);
