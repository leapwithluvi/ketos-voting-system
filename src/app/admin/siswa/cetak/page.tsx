import { connectDB } from '@/lib/db'
import User from '@/models/User'
import PrintCardsClient from '@/components/admin/PrintCardsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cetak Kartu Login' }
export const dynamic = 'force-dynamic'

export default async function CetakPage() {
  await connectDB()
  const students = await User.find({ role: 'user', isActive: true })
    .sort({ kelas: 1, name: 1 })
    .select('nisn name kelas jurusan')
    .lean()

  const serialized = students.map((s) => ({
    _id: s._id.toString(),
    nisn: s.nisn,
    name: s.name,
    kelas: s.kelas,
    jurusan: s.jurusan,
  }))

  return <PrintCardsClient students={serialized} />
}
