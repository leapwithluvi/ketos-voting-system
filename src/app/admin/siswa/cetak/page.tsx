import prisma from '@/lib/prisma'
import PrintCardsClient from '@/components/admin/PrintCardsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cetak Kartu Login' }
export const dynamic = 'force-dynamic'

export default async function CetakPage() {
  const students = await prisma.user.findMany({
    where: { role: 'user', isActive: true },
    orderBy: [
      { kelas: 'asc' },
      { name: 'asc' },
    ],
    select: {
      id: true,
      nisn: true,
      name: true,
      kelas: true,
      jurusan: true,
    },
  })

  const serialized = students.map((s) => ({
    id: s.id,
    nisn: s.nisn,
    name: s.name,
    kelas: s.kelas.toString(),
    jurusan: s.jurusan,
  }))

  return <PrintCardsClient students={serialized} />
}
