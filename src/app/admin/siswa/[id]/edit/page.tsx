import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import EditSiswaForm from '@/components/admin/EditSiswaForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Siswa' }

type Props = { params: Promise<{ id: string }> }

export default async function EditSiswaPage({ params }: Props) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
  })
  if (!user || user.role !== 'user') notFound()

  return (
    <EditSiswaForm
      student={{
        id: user.id,
        nisn: user.nisn,
        name: user.name,
        kelas: user.kelas,
        jurusan: user.jurusan,
        isActive: user.isActive,
        hasVoted: user.hasVoted,
      }}
    />
  )
}
