'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const kelasOptions = ['X', 'XI', 'XII']

export default function TambahSiswaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nisn: '', name: '', kelas: 'X', jurusan: '' })
  const [result, setResult] = useState<{ password?: string } | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Siswa berhasil ditambahkan!')
      setResult({ password: data.data?.password })
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menambahkan siswa')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="p-8 max-w-lg">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Siswa Berhasil Ditambahkan!
          </h2>
          <p className="text-slate-500 text-sm mb-6">Simpan password berikut dan berikan ke siswa</p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
            <p className="text-xs text-slate-500 mb-1">NISN</p>
            <p className="font-mono font-bold text-slate-900 text-lg">{form.nisn}</p>
            <p className="text-xs text-slate-500 mt-3 mb-1">Password</p>
            <p className="font-mono font-bold text-blue-600 text-2xl tracking-widest">{result.password}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setResult(null); setForm({ nisn: '', name: '', kelas: 'X', jurusan: '' }) }}
              className="btn-secondary flex-1">Tambah Lagi</button>
            <Link href="/admin/siswa" className="btn-primary flex-1 text-center justify-center">Kembali</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/siswa" className="p-2 rounded-xl hover:bg-slate-100 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Tambah Siswa
          </h1>
          <p className="text-slate-500 mt-1">Password otomatis akan digenerate</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">NISN *</label>
          <input name="nisn" value={form.nisn} onChange={handleChange}
            placeholder="10 digit NISN" maxLength={10} className="input-field"
            inputMode="numeric" pattern="\d{10}" required />
          <p className="text-xs text-slate-400 mt-1">{form.nisn.length}/10 digit</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap *</label>
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="Nama lengkap siswa" className="input-field" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kelas *</label>
            <select name="kelas" value={form.kelas} onChange={handleChange} className="input-field">
              {kelasOptions.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jurusan *</label>
            <input name="jurusan" value={form.jurusan} onChange={handleChange}
              placeholder="IPA / IPS / dll" className="input-field" required />
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
          💡 Password default: <strong>OSIS + 4 digit terakhir NISN</strong>
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/admin/siswa" className="btn-secondary flex-1 text-center justify-center">Batal</Link>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</> : 'Simpan Siswa'}
          </button>
        </div>
      </form>
    </div>
  )
}
