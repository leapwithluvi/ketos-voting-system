import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const users = [
  { nisn: '0085194993', password: '13042008', role: 'user' },
  { nisn: '0085194994', password: '13042008', role: 'admin' },
  { nisn: 'smakensa', password: '13042008', role: 'admin' },
];

export const seedUsers = async (prisma: PrismaClient) => {
  await prisma.$runCommandRaw({
    delete: 'User',
    deletes: [{ q: {}, limit: 0 }],
  });
  await prisma.$runCommandRaw({
    insert: 'User',
    documents: users,
  });

  console.log('✅ Seed users berhasil!');
};
