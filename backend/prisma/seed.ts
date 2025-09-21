import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
// import { seedCandidates } from './seeds/candidates.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  // await seedCandidates(prisma);
}

main()
  .then(() => {
    console.log('🌱 Seeding selesai!');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
