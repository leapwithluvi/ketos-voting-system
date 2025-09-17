import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const candidates = await prisma.candidate.findMany();
    console.log("✅ Koneksi Atlas berhasil, jumlah kandidat:", candidates.length);
  } catch (err) {
    console.error("❌ Error koneksi:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();