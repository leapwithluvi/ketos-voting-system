'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Student {
  id: string; nisn: string; name: string
  kelas: string; jurusan: string; isActive: boolean; hasVoted: boolean
}

export default function EditSiswaForm({ student }: { student: Student }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: student.name,
    kelas: student.kelas,
    jurusan: student.jurusan,
    isActive: student.isActive,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target
    setForm((f) => ({
      ...f,
      [target.name]: target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/siswa/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Data siswa diperbarui!')
      router.push('/admin/siswa')
      router.refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal memperbarui')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/siswa" className="p-2 rounded-xl hover:bg-slate-100 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Edit Siswa
          </h1>
          <p className="text-slate-500 mt-1">NISN: {student.nisn}</p>
        </div>
      </div>

      {student.hasVoted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700">
          ✓ Siswa ini sudah memberikan suara
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">NISN</label>
          <input value={student.nisn} disabled
            className="input-field opacity-60 cursor-not-allowed bg-slate-50" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap *</label>
          <input name="name" value={form.name} onChange={handleChange}
            className="input-field" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kelas *</label>
            <select name="kelas" value={form.kelas} onChange={handleChange} className="input-field">
              {['X', 'XI', 'XII'].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jurusan *</label>
            <input name="jurusan" value={form.jurusan} onChange={handleChange}
              className="input-field" required />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="isActive" checked={form.isActive}
            onChange={handleChange} className="w-4 h-4 rounded text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">Akun Aktif</span>
        </label>

        <div className="flex gap-3 pt-2">
          <Link href="/admin/siswa" className="btn-secondary flex-1 text-center justify-center">Batal</Link>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
              : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  )
}
