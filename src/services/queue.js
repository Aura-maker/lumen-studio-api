// Servizio per accodare job su Redis usando BullMQ (italiano)
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const config = require('../config');

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

// Queue principale
const queue = new Queue('lavori', { connection });

/**
 * Aggiunge un job alla coda
 * @param {string} nome - nome del job (es. 'valuta-distintivi', 'calcola-analisi')
 * @param {Object} dati - payload del job
 * @param {Object} opts - opzioni bullmq
 */
async function aggiungiJob(nome, dati = {}, opts = {}) {
  return queue.add(nome, dati, opts);
}

module.exports = { aggiungiJob, queue, connection };