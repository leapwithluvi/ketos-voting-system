import 'dotenv/config'
import { PrismaClient, Kelas } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function seed() {
  console.log("🔄 Seeding database...")

  // 1. Seed Admin
  const adminNisn = process.env.ADMIN_NISN || "0000000001"
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345"
  const hashedAdminPw = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { nisn: adminNisn },
    update: { password: hashedAdminPw, isActive: true },
    create: {
      nisn: adminNisn,
      name: "Administrator",
      kelas: "XII",
      jurusan: "Admin",
      password: hashedAdminPw,
      role: "admin",
      isActive: true,
    }
  })
  console.log("✅ Admin seeded.")

  // 2. Seed Students (Siswa)
  console.log("👥 Seeding students...")
  const studentPassword = "Password@123" // Common password for all seeded students
  const hashedStudentPw = await bcrypt.hash(studentPassword, 12)

  const studentsData = [
    { nisn: "1234500001", name: "Ahmad Fauzi", kelas: Kelas.X, jurusan: "IPA 1" },
    { nisn: "1234500002", name: "Budi Santoso", kelas: Kelas.X, jurusan: "IPA 2" },
    { nisn: "1234500003", name: "Citra Lestari", kelas: Kelas.X, jurusan: "IPS 1" },
    { nisn: "1234500004", name: "Dedi Kurniawan", kelas: Kelas.XI, jurusan: "IPA 1" },
    { nisn: "1234500005", name: "Eka Putri", kelas: Kelas.XI, jurusan: "IPA 2" },
    { nisn: "1234500006", name: "Fajar Pratama", kelas: Kelas.XI, jurusan: "IPS 2" },
    { nisn: "1234500007", name: "Gita Permata", kelas: Kelas.XII, jurusan: "IPA 1" },
    { nisn: "1234500008", name: "Hadi Saputra", kelas: Kelas.XII, jurusan: "IPS 1" },
    { nisn: "1234500009", name: "Indah Sari", kelas: Kelas.XII, jurusan: "IPS 2" },
    { nisn: "1234500010", name: "Joko Widodo", kelas: Kelas.X, jurusan: "Bahasa" },
  ]

  for (const student of studentsData) {
    await prisma.user.upsert({
      where: { nisn: student.nisn },
      update: { isActive: true },
      create: {
        ...student,
        password: hashedStudentPw,
        role: "user",
        isActive: true,
      }
    })
  }
  console.log(`✅ ${studentsData.length} students seeded.`)

  // 3. Seed some dummy Candidates (Optional but helpful)
  console.log("🗳️ Seeding candidates...")
  const candidatesData = [
    {
      nomorUrut: 1,
      namaKetua: "Andi Wijaya",
      namaWakil: "Siti Aminah",
      fotoKetua: "/candidates/c1-ketua.jpg",
      fotoWakil: "/candidates/c1-wakil.jpg",
      visi: "Mewujudkan OSIS yang inspiratif dan kolaboratif.",
      misi: ["Meningkatkan kreativitas siswa", "Mempererat hubungan antar ekstrakurikuler"],
    },
    {
      nomorUrut: 2,
      namaKetua: "Bambang Heru",
      namaWakil: "Dewi Sartika",
      fotoKetua: "/candidates/c2-ketua.jpg",
      fotoWakil: "/candidates/c2-wakil.jpg",
      visi: "Sekolah unggul dengan karakter budi pekerti luhur.",
      misi: ["Menyelenggarakan event seni budaya", "Meningkatkan kedisiplinan siswa"],
    },
  ]

  for (const candidate of candidatesData) {
    await prisma.candidate.upsert({
      where: { nomorUrut: candidate.nomorUrut },
      update: { isActive: true },
      create: {
        ...candidate,
        isActive: true,
      }
    })
  }
  console.log("✅ Candidates seeded.")

  console.log("\n🚀 Seeding completed successfully!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("  Admin Login:")
  console.log(`    NISN     : ${adminNisn}`)
  console.log(`    Password : ${adminPassword}`)
  console.log("  Student Login Sample:")
  console.log(`    NISN     : ${studentsData[0].nisn}`)
  console.log(`    Password : ${studentPassword}`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log("🔌 Disconnected")
  })
