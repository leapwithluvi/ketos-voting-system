import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Candidate from '@/models/Candidate'
import mongoose from 'mongoose'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) return { title: 'Kandidat' }
  await connectDB()
  const c = await Candidate.findById(id).lean()
  if (!c) return { title: 'Kandidat tidak ditemukan' }
  return { title: `Paslon ${c.nomorUrut} – ${c.namaKetua}` }
}

export default async function KandidatDetailPage({ params }: Props) {
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) notFound()

  await connectDB()
  const c = await Candidate.findById(id).lean()
  if (!c || !c.isActive) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <div className="card overflow-hidden">
        {/* Hero */}
        <div className="gradient-primary p-8 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black mx-auto mb-3">
            {c.nomorUrut}
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Pasangan Calon {c.nomorUrut}
          </h1>
        </div>

        {/* Photos */}
        <div className="flex gap-6 p-8 border-b border-slate-100">
          {[{ foto: c.fotoKetua, nama: c.namaKetua, role: 'Calon Ketua' },
            { foto: c.fotoWakil, nama: c.namaWakil, role: 'Calon Wakil Ketua' }].map(({ foto, nama, role }) => (
            <div key={role} className="flex-1 text-center">
              <div className="w-32 h-32 rounded-2xl bg-slate-100 mx-auto mb-3 overflow-hidden border-2 border-slate-200">
                {foto ? (
                  <img src={foto} alt={nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl font-bold">
                    {nama.charAt(0)}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">{role}</p>
              <p className="font-bold text-slate-900 text-lg">{nama}</p>
            </div>
          ))}
        </div>

        {/* Visi */}
        <div className="p-8 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-lg mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Visi
          </h2>
          <p className="text-slate-600 leading-relaxed">{c.visi}</p>
        </div>

        {/* Misi */}
        <div className="p-8">
          <h2 className="font-bold text-slate-900 text-lg mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Misi
          </h2>
          <ul className="space-y-3">
            {c.misi.map((m, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 shadow">
                  {i + 1}
                </div>
                <p className="text-slate-600 leading-relaxed pt-0.5">{m}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
