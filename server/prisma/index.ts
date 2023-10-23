import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export default prismaClient;