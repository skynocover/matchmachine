import { PrismaClient } from '@prisma/client';
import sha256 from 'crypto-js/sha256';
const prisma = new PrismaClient();

async function main() {
  await prisma.users.create({
    data: {
      account: 'admin',
      password: sha256('123456').toString(),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
