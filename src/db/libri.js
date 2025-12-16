/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LIBRI REPOSITORY - LIBROMERCATO (VENDITA LIBRI USATI)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const db = require('./database');

const LibriRepository = {

  async lista({ materia, anno, condizione, venduto, search, limite = 50 }) {
    let query = `SELECT * FROM libri WHERE 1=1`;
    const params = [];
    let idx = 1;

    if (venduto !== undefined) {
      query += ` AND venduto = $${idx++}`;
      params.push(venduto === 'true' || venduto === true);
    } else {
      query += ` AND venduto = false`;
    }

    if (materia) {
      query += ` AND LOWER(materia) LIKE LOWER($${idx++})`;
      params.push(`%${materia}%`);
    }
    if (anno) {
      query += ` AND anno = $${idx++}`;
      params.push(anno);
    }
    if (condizione) {
      query += ` AND condizione = $${idx++}`;
      params.push(condizione);
    }
    if (search) {
      query += ` AND (LOWER(titolo) LIKE LOWER($${idx}) OR LOWER(autore) LIKE LOWER($${idx++}))`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${idx}`;
    params.push(limite);

    const rows = await db.queryAll(query, params);
    
    return rows.map(r => ({
      id: r.id,
      titolo: r.titolo,
      autore: r.autore,
      editore: r.editore,
      isbn: r.isbn,
      materia: r.materia,
      anno: r.anno,
      condizione: r.condizione,
      prezzo: r.prezzo,
      descrizione: r.descrizione,
      fotoUrl: r.foto_url,
      venduto: r.venduto,
      createdAt: r.created_at,
      venditore: {
        id: r.venditore_id,
        nome: r.venditore_nome || 'Utente'
      }
    }));
  },

  async getMiei(venditoreId) {
    return db.queryAll(`
      SELECT * FROM libri WHERE venditore_id = $1 ORDER BY created_at DESC
    `, [venditoreId]);
  },

  async getById(id) {
    const r = await db.queryOne(`SELECT * FROM libri WHERE id = $1`, [id]);
    if (!r) return null;
    return {
      id: r.id,
      titolo: r.titolo,
      autore: r.autore,
      editore: r.editore,
      isbn: r.isbn,
      materia: r.materia,
      anno: r.anno,
      condizione: r.condizione,
      prezzo: r.prezzo,
      descrizione: r.descrizione,
      fotoUrl: r.foto_url,
      venduto: r.venduto,
      createdAt: r.created_at,
      venditore: { id: r.venditore_id, nome: r.venditore_nome || 'Utente' }
    };
  },

  async crea(venditoreId, venditoreNome, dati) {
    const { titolo, autore, editore, isbn, materia, anno, condizione, prezzo, descrizione, fotoUrl } = dati;
    return db.queryOne(`
      INSERT INTO libri (titolo, autore, editore, isbn, materia, anno, condizione, prezzo, descrizione, foto_url, venditore_id, venditore_nome, venduto)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false)
      RETURNING *
    `, [titolo, autore, editore, isbn, materia, anno, condizione, prezzo, descrizione, fotoUrl, venditoreId, venditoreNome]);
  },

  async aggiorna(id, venditoreId, dati) {
    const { titolo, prezzo, descrizione, condizione } = dati;
    return db.queryOne(`
      UPDATE libri SET
        titolo = COALESCE($3, titolo),
        prezzo = COALESCE($4, prezzo),
        descrizione = COALESCE($5, descrizione),
        condizione = COALESCE($6, condizione),
        updated_at = NOW()
      WHERE id = $1 AND venditore_id = $2
      RETURNING *
    `, [id, venditoreId, titolo, prezzo, descrizione, condizione]);
  },

  async segnaVenduto(id, venditoreId, compratoreId = null) {
    return db.queryOne(`
      UPDATE libri SET venduto = true, compratore_id = $3, updated_at = NOW()
      WHERE id = $1 AND venditore_id = $2 RETURNING *
    `, [id, venditoreId, compratoreId]);
  },

  async elimina(id, venditoreId) {
    const result = await db.query(`DELETE FROM libri WHERE id = $1 AND venditore_id = $2`, [id, venditoreId]);
    return result.rowCount > 0;
  },

  async getStatistiche() {
    const s = await db.queryOne(`
      SELECT 
        COUNT(*) FILTER (WHERE venduto = false) as disponibili,
        COUNT(*) FILTER (WHERE venduto = true) as venduti,
        COUNT(DISTINCT venditore_id) as venditori,
        COALESCE(AVG(prezzo) FILTER (WHERE venduto = false), 0) as prezzo_medio
      FROM libri
    `);
    return {
      libriDisponibili: parseInt(s?.disponibili || 0),
      libriVenduti: parseInt(s?.venduti || 0),
      venditori: parseInt(s?.venditori || 0),
      prezzoMedio: parseFloat(s?.prezzo_medio || 0).toFixed(2)
    };
  }
};

module.exports = LibriRepository;
