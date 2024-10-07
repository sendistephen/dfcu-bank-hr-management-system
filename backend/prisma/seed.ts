import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  await prisma.$connect();

  const saltRounds = 10;

  const adminUsername = process.env.ADMIN_USERNAME as string;
  const adminPassword = process.env.ADMIN_PASSWORD as string;

  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  await prisma.user.upsert({
    where: {
      email: adminUsername,
    },
    update: {
      password: passwordHash,
    },
    create: {
      email: adminUsername,
      password: passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created or updated.');
}

main()
  .catch((e) => console.log(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
