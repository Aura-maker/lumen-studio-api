// Istanza singleton Prisma (già presente ma aggiornata per consistenza)
const { PrismaClient } = require('@prisma/client');

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

module.exports = prisma;