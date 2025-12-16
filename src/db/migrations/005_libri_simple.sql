-- Tabella libri semplificata per libromercato
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
