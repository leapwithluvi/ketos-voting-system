import Link from 'next/link'
import { connectDB } from '@/lib/db'
import Candidate from '@/models/Candidate'
import { Plus, Pencil, Users, CheckCircle2 } from 'lucide-react'
import DeleteCandidateButton from '@/components/admin/DeleteCandidateButton'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manajemen Kandidat' }
export const dynamic = 'force-dynamic'

export default async function KandidatPage() {
  await connectDB()
  const candidates = await Candidate.find().sort({ nomorUrut: 1 }).lean()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Kandidat
          </h1>
          <p className="text-slate-500 mt-1">{candidates.length} kandidat terdaftar</p>
        </div>
        <Link href="/admin/kandidat/tambah" className="btn-primary">
          <Plus className="w-5 h-5" />
          Tambah Kandidat
        </Link>
      </div>

      {candidates.length === 0 ? (
        <div className="card p-16 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-600 mb-1">Belum ada kandidat</h3>
          <p className="text-slate-400 text-sm mb-4">Tambahkan kandidat untuk memulai pemilihan</p>
          <Link href="/admin/kandidat/tambah" className="btn-primary inline-flex">
            <Plus className="w-4 h-4" /> Tambah Kandidat
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {candidates.map((c) => (
            <div key={c._id.toString()} className="card card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white text-xl font-bold shadow">
                    {c.nomorUrut}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Paslon {c.nomorUrut}</h3>
                    <span className={`badge ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {c.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/kandidat/${c._id}/edit`}
                    className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <DeleteCandidateButton id={c._id.toString()} name={`Paslon ${c.nomorUrut}`} />
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 mx-auto mb-1 overflow-hidden">
                    {c.fotoKetua ? (
                      <img src={c.fotoKetua} alt={c.namaKetua} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold">
                        {c.namaKetua.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Ketua</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.namaKetua}</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 mx-auto mb-1 overflow-hidden">
                    {c.fotoWakil ? (
                      <img src={c.fotoWakil} alt={c.namaWakil} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-bold">
                        {c.namaWakil.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Wakil</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{c.namaWakil}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-blue-600">{c.jumlahSuara}</span> suara
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 max-w-[60%] text-right">{c.visi}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
