import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hook to connect to the test database before running tests
beforeAll(async () => {
  await prisma.$connect();
});

// Hook to clean up data after each test
afterEach(async () => {
  await prisma.staff.deleteMany();
  await prisma.staffCode.deleteMany();
  await prisma.user.deleteMany();
});

// Hook to disconnect Prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

export default prisma;
