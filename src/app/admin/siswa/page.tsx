import Link from 'next/link'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { Plus, Upload, Printer, Search } from 'lucide-react'
import StudentTableClient from '@/components/admin/StudentTableClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Data Siswa' }
export const dynamic = 'force-dynamic'

export default async function SiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1'))
  const search = params.search ?? ''
  const limit = 15

  await connectDB()

  const query = search
    ? {
        role: 'user',
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { nisn: { $regex: search, $options: 'i' } },
          { jurusan: { $regex: search, $options: 'i' } },
        ],
      }
    : { role: 'user' }

  const [students, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limit)

  const serialized = students.map((s) => ({
    _id: s._id.toString(),
    nisn: s.nisn,
    name: s.name,
    kelas: s.kelas,
    jurusan: s.jurusan,
    hasVoted: s.hasVoted,
    isActive: s.isActive,
    createdAt: s.createdAt?.toISOString() ?? '',
  }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Data Siswa
          </h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} siswa terdaftar</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/siswa/cetak" className="btn-secondary">
            <Printer className="w-4 h-4" /> Cetak Kartu
          </Link>
          <Link href="/admin/siswa/import" className="btn-secondary">
            <Upload className="w-4 h-4" /> Import
          </Link>
          <Link href="/admin/siswa/tambah" className="btn-primary">
            <Plus className="w-4 h-4" /> Tambah Siswa
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <form method="GET" className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="search"
              defaultValue={search}
              placeholder="Cari NISN, nama, atau jurusan..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">Cari</button>
          {search && (
            <Link href="/admin/siswa" className="btn-secondary">Reset</Link>
          )}
        </form>
      </div>

      <StudentTableClient
        students={serialized}
        page={page}
        totalPages={totalPages}
        search={search}
      />
    </div>
  )
}
