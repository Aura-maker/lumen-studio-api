// Middleware per autorizzazioni basate su ruolo (italiano)

/**
 * Verifica che l'utente abbia uno dei ruoli richiesti
 * @param {...string} ruoli - ruoli ammessi (es. 'ADMIN','DOCENTE')
 */
function consenti(...ruoli) {
  return (req, res, next) => {
    const utente = req.utente;
    if (!utente) return res.status(401).json({ errore: 'Non autorizzato' });
    if (!ruoli.includes(utente.ruolo)) {
      return res.status(403).json({ errore: 'Accesso proibito' });
    }
    next();
  };
}

module.exports = { consenti };