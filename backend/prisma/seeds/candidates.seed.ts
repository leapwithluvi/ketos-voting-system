import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const candidates = [
  {
    nama: 'Rafif',
    visi: 'Nihao',
    misi: 'Ayok pakai n8n',
    photo_url: '',
  },
  {
    nama: 'Fatar',
    visi: 'Nihao',
    misi: 'Sepuh nya PHP bukan JS',
    photo_url: '',
  },
  {
    nama: 'Luvi',
    visi: 'Nihao',
    misi: 'Suka ML nggk suka MTK',
    photo_url: '',
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
