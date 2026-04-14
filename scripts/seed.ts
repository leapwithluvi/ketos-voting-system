/**
 * Script untuk membuat akun admin pertama
 * Jalankan: npx tsx scripts/seed.ts
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/osis-voting'

const UserSchema = new mongoose.Schema({
  nisn: String,
  name: String,
  kelas: String,
  jurusan: String,
  password: String,
  role: { type: String, default: 'user' },
  hasVoted: { type: Boolean, default: false },
  votedFor: { type: mongoose.Schema.Types.ObjectId, default: null },
  votedAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function seed() {
  console.log('🔄 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected')

  // Admin credentials
  const adminNisn = '0000000001'
  const adminPassword = 'Admin@12345'

  const existing = await User.findOne({ nisn: adminNisn })
  if (existing) {
    console.log('⚠️  Admin sudah ada. Hapus dulu jika ingin reset.')
    await mongoose.disconnect()
    return
  }

  const hashed = await bcrypt.hash(adminPassword, 12)
  await User.create({
    nisn: adminNisn,
    name: 'Administrator',
    kelas: 'XII',
    jurusan: 'Admin',
    password: hashed,
    role: 'admin',
    isActive: true,
  })

  console.log('\n✅ Admin berhasil dibuat!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  NISN     : ${adminNisn}`)
  console.log(`  Password : ${adminPassword}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⚠️  Segera ganti password setelah login pertama!\n')

  await mongoose.disconnect()
  console.log('🔌 Disconnected')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
