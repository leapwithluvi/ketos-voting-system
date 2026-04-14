import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Candidate from '@/models/Candidate'
import mongoose from 'mongoose'
import EditKandidatForm from '@/components/admin/EditKandidatForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Kandidat' }

type Props = { params: Promise<{ id: string }> }

export default async function EditKandidatPage({ params }: Props) {
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) notFound()

  await connectDB()
  const candidate = await Candidate.findById(id).lean()
  if (!candidate) notFound()

  return (
    <EditKandidatForm
      candidate={{
        _id: candidate._id.toString(),
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
