import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import mongoose from 'mongoose'
import EditSiswaForm from '@/components/admin/EditSiswaForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Siswa' }

type Props = { params: Promise<{ id: string }> }

export default async function EditSiswaPage({ params }: Props) {
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) notFound()

  await connectDB()
  const user = await User.findById(id).lean()
  if (!user || user.role !== 'user') notFound()

  return (
    <EditSiswaForm
      student={{
        _id: user._id.toString(),
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
