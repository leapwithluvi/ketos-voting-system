import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import EditKandidatForm from '@/components/admin/EditKandidatForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Kandidat' }

type Props = { params: Promise<{ id: string }> }

export default async function EditKandidatPage({ params }: Props) {
  const { id } = await params

  const candidate = await prisma.candidate.findUnique({
    where: { id },
  })
  if (!candidate) notFound()

  return (
    <EditKandidatForm
      candidate={{
        id: candidate.id,
        nomorUrut: candidate.nomorUrut,
        namaKetua: candidate.namaKetua,
        namaWakil: candidate.namaWakil,
        fotoKetua: candidate.fotoKetua,
        fotoWakil: candidate.fotoWakil,
        visi: candidate.visi,
        misi: candidate.misi,
        isActive: candidate.isActive,
        jumlahSuara: candidate.jumlahSuara,
      }}
    />
  )
}
