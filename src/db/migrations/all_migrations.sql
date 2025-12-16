-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRAZIONE COMPLETA: Tutte le tabelle necessarie
-- ═══════════════════════════════════════════════════════════════════════════════

-- Tabella utenti
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

-- Profili gamification utenti
CREATE TABLE IF NOT EXISTS gamification_profili (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  xp_totale INTEGER DEFAULT 0,
  quiz_completati INTEGER DEFAULT 0,
  flashcards_viste INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  record_streak INTEGER DEFAULT 0,
  accuratezza_media INTEGER DEFAULT 0,
  risposte_corrette INTEGER DEFAULT 0,
  risposte_totali INTEGER DEFAULT 0,
  livello_per_materia JSONB DEFAULT '{}',
  badges JSONB DEFAULT '[]',
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gamification_user ON gamification_profili(user_id);
CREATE INDEX IF NOT EXISTS idx_gamification_xp ON gamification_profili(xp_totale DESC);

-- Attività recenti
CREATE TABLE IF NOT EXISTS gamification_attivita (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  materia VARCHAR(100),
  descrizione TEXT,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attivita_user ON gamification_attivita(user_id);
CREATE INDEX IF NOT EXISTS idx_attivita_created ON gamification_attivita(created_at DESC);

-- Sfide 1v1
CREATE TABLE IF NOT EXISTS sfide (
  id SERIAL PRIMARY KEY,
  codice VARCHAR(10) UNIQUE NOT NULL,
  host_id VARCHAR(255) NOT NULL,
  guest_id VARCHAR(255),
  host_score INTEGER DEFAULT 0,
  guest_score INTEGER DEFAULT 0,
  vincitore VARCHAR(255),
  modalita VARCHAR(50),
  stato VARCHAR(20) DEFAULT 'attesa',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sfide_codice ON sfide(codice);
CREATE INDEX IF NOT EXISTS idx_sfide_host ON sfide(host_id);
CREATE INDEX IF NOT EXISTS idx_sfide_guest ON sfide(guest_id);

-- Tabella libri per libromercato
CREATE TABLE IF NOT EXISTS libri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titolo VARCHAR(255) NOT NULL,
  autore VARCHAR(255),
  editore VARCHAR(255),
  isbn VARCHAR(20),
  materia VARCHAR(100),
  anno VARCHAR(10),
  condizione VARCHAR(50) NOT NULL,
  prezzo DECIMAL(10,2),
  descrizione TEXT,
  foto_url TEXT,
  venditore_id UUID REFERENCES utenti(id),
  venditore_nome VARCHAR(255),
  venduto BOOLEAN DEFAULT false,
  compratore_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_libri_materia ON libri(materia);
CREATE INDEX IF NOT EXISTS idx_libri_venduto ON libri(venduto);
CREATE INDEX IF NOT EXISTS idx_libri_venditore ON libri(venditore_id);

-- Notifiche
CREATE TABLE IF NOT EXISTS notifiche (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  titolo VARCHAR(255) NOT NULL,
  messaggio TEXT,
  letta BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifiche_user ON notifiche(user_id);
CREATE INDEX IF NOT EXISTS idx_notifiche_letta ON notifiche(letta);

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS utenti_updated ON utenti;
CREATE TRIGGER utenti_updated
  BEFORE UPDATE ON utenti
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS gamification_profili_updated ON gamification_profili;
CREATE TRIGGER gamification_profili_updated
  BEFORE UPDATE ON gamification_profili
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS libri_updated ON libri;
CREATE TRIGGER libri_updated
  BEFORE UPDATE ON libri
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
