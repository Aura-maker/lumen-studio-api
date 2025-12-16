// Bull Board UI per monitorare la coda (protetto con basic auth)
// DISABILITATO temporaneamente - richiede @bull-board packages
const express = require('express');
// const basicAuth = require('express-basic-auth');
// const { ExpressAdapter } = require('@bull-board/express');
// const { createBullBoard } = require('bull-board');
// const { queue } = require('../services/queue');

const router = express.Router();

// const adminUser = process.env.QUEUE_ADMIN_USER || 'admin';
// const adminPass = process.env.QUEUE_ADMIN_PASS || 'changeme';

// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath('/admin/queues');

// createBullBoard({
//   queues: [
//     {
//       type: 'bullmq',
//       queue
//     }
//   ],
//   serverAdapter
// });

// router.use('/queues', basicAuth({
//   users: { [adminUser]: adminPass },
//   challenge: true
// }), serverAdapter.getRouter());

router.get('/queues', (req, res) => {
  res.json({ messaggio: 'Bull Board non configurato. Installa @bull-board packages per abilitarlo.' });
});

module.exports = router;
