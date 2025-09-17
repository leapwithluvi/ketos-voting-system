import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const candidates = [
  {
    nama: 'Rafif',
    visi: 'Nihao',
    misi: 'Ayok pakai n8n',
    foto: '',
  },
  {
    nama: 'Fatar',
    visi: 'Nihao',
    misi: 'Sepuh nya PHP bukan JS',
    foto: '',
  },
  {
    nama: 'Luvi',
    visi: 'Nihao',
    misi: 'Suka ML nggk suka MTK',
    foto: '',
  },
];

export async function seedCandidates(prisma: PrismaClient) {
  await prisma.$runCommandRaw({
    delete: 'Candidate',
    deletes: [{ q: {}, limit: 0 }],
  });

  await prisma.$runCommandRaw({
    insert: 'Candidate',
    documents: candidates,
  });

  console.log('✅ Seed candidates berhasil!');
}
