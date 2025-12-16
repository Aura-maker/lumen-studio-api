// Scheduler avanzato: aggiunge job cron per analisi, costanza e cleanup tokens
const cron = require('node-cron');
const { aggiungiJob } = require('../services/queue');

console.log('Scheduler avviato');

// snapshot giornaliero alle 02:00
cron.schedule('0 2 * * *', async () => {
  console.log('Scheduler: enqueuing calcola-analisi giornaliero');
  await aggiungiJob('calcola-analisi', { tipo: 'giornaliera' });
});

// snapshot settimanale lunedì 03:00
cron.schedule('0 3 * * 1', async () => {
  console.log('Scheduler: enqueuing calcola-analisi settimanale');
  await aggiungiJob('calcola-analisi', { tipo: 'settimanale' });
});

// assegna distintivi costanza settimanale lunedì 04:00
cron.schedule('0 4 * * 1', async () => {
  console.log('Scheduler: enqueuing assegna-distintivi-costanza');
  await aggiungiJob('assegna-distintivi-costanza', { giorni: 7 });
});

// cleanup refresh tokens: ogni giorno alle 05:00
cron.schedule('0 5 * * *', async () => {
  console.log('Scheduler: enqueuing cleanup-refresh-tokens');
  await aggiungiJob('cleanup-refresh-tokens', { days: 30 });
});

console.log('Scheduler in ascolto (cron jobs pianificati)');