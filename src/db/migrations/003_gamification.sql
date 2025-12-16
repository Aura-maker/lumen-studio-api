-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRAZIONE: Tabelle Gamification
-- ═══════════════════════════════════════════════════════════════════════════════

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

-- Indice per ricerche veloci
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

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS gamification_profili_updated ON gamification_profili;
CREATE TRIGGER gamification_profili_updated
  BEFORE UPDATE ON gamification_profili
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
