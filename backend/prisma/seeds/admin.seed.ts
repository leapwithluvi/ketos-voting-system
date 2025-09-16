import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedAdmin() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.log('⚠️ Development mode: skip admin seeding (buat manual di DB)');
    return;
  }

  const adminExist = await prisma.admin.findUnique({
    where: { username: 'admin' },
  });

  if (adminExist) {
    console.log('⚠️ Admin sudah ada, skip seeding');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin berhasil di-seed (production)');
}
