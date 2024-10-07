import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient and export it
const prisma = new PrismaClient();

export default prisma;
