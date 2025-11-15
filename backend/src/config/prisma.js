// src/config/prisma.js

const { PrismaClient } = require('@prisma/client');

// Garanta que a INSTÂNCIA seja exportada
const prisma = new PrismaClient({ 
    log: ['query', 'error'],
});

module.exports = prisma; // <--- DEVE EXPORTAR A INSTÂNCIA 'prisma'