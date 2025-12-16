// Servizio per invio notifiche push tramite Firebase Cloud Messaging (FCM)
// Richiede la variabile FIREBASE_SERVICE_ACCOUNT contenente JSON del service account
const admin = require('firebase-admin');
const prisma = require('../prisma');

function initFirebase() {
  if (admin.apps.length) return;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
  let cred;
  try {
    cred = JSON.parse(raw);
  } catch (err) {
    // se env è un percorso file, prova a caricare
    try {
      cred = require(raw);
    } catch (e) {
      console.warn('FIREBASE_SERVICE_ACCOUNT non valido o non presente. Push FCM disabilitate.');
      return;
    }
  }
  admin.initializeApp({
    credential: admin.credential.cert(cred)
  });
}

initFirebase();

/**
 * Invia una notifica push a un token device
 * @param {string} token FCM token
 * @param {Object} payload {title, body, data}
 */
async function inviaPush(token, payload) {
  if (!admin.apps.length) {
    console.warn('Firebase non inizializzato; skip push');
    return null;
  }
  const message = {
    token,
    notification: {
      title: payload.title,
      body: payload.body
    },
    data: payload.data || {}
  };
  try {
    const res = await admin.messaging().send(message);
    return res;
  } catch (err) {
    console.error('Errore invio push:', err.message);
    return null;
  }
}

/**
 * Invia push a tutti i device tokens di un utente
 */
async function inviaPushUtente(utenteId, payload) {
  const tokens = await prisma.deviceToken.findMany({ where: { utenteId }, select: { token: true } });
  const results = [];
  for (const t of tokens) {
    const r = await inviaPush(t.token, payload);
    results.push({ token: t.token, result: r });
  }
  return results;
}

module.exports = { inviaPush, inviaPushUtente, initFirebase };