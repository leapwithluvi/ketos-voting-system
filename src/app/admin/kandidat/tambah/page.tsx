'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'

export default function TambahKandidatPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [misi, setMisi] = useState([''])
  const [form, setForm] = useState({
    nomorUrut: '',
    namaKetua: '',
    namaWakil: '',
    fotoKetua: '',
    fotoWakil: '',
    visi: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'fotoKetua' | 'fotoWakil') {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) {
      setForm((f) => ({ ...f, [field]: data.url }))
      toast.success('Foto berhasil diupload')
    } else {
      toast.error(data.error ?? 'Upload gagal')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        nomorUrut: parseInt(form.nomorUrut),
        misi: misi.filter((m) => m.trim()),
      }
      const res = await fetch('/api/kandidat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Kandidat berhasil ditambahkan!')
      router.push('/admin/kandidat')
      router.refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menambahkan kandidat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/kandidat" className="p-2 rounded-xl hover:bg-slate-100 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Tambah Kandidat
          </h1>
          <p className="text-slate-500 mt-1">Isi data pasangan calon dengan lengkap</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nomor urut */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Informasi Dasar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Urut *</label>
              <input name="nomorUrut" type="number" min="1" max="99" value={form.nomorUrut}
                onChange={handleChange} placeholder="1" className="input-field" required />
            </div>
          </div>
        </div>

        {/* Ketua */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Data Ketua</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Ketua *</label>
              <input name="namaKetua" value={form.namaKetua} onChange={handleChange}
                placeholder="Nama lengkap ketua" className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Ketua *</label>
              <div className="flex items-center gap-3">
                {form.fotoKetua && (
                  <img src={form.fotoKetua} alt="Ketua" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                )}
                <label className="btn-secondary cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Foto
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleImageUpload(e, 'fotoKetua')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Wakil */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Data Wakil Ketua</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Wakil *</label>
              <input name="namaWakil" value={form.namaWakil} onChange={handleChange}
                placeholder="Nama lengkap wakil ketua" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Wakil *</label>
              <div className="flex items-center gap-3">
                {form.fotoWakil && (
                  <img src={form.fotoWakil} alt="Wakil" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                )}
                <label className="btn-secondary cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Foto
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleImageUpload(e, 'fotoWakil')} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Visi & Misi</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Visi *</label>
              <textarea name="visi" value={form.visi} onChange={handleChange}
                placeholder="Visi pasangan calon..." rows={3}
                maxLength={500} className="input-field resize-none" required />
              <p className="text-xs text-slate-400 mt-1 text-right">{form.visi.length}/500</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Misi *</label>
                <button type="button" onClick={() => setMisi([...misi, ''])}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Tambah Misi
                </button>
              </div>
              <div className="space-y-2">
                {misi.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={m} onChange={(e) => {
                      const updated = [...misi]
                      updated[i] = e.target.value
                      setMisi(updated)
                    }} placeholder={`Misi ${i + 1}`} className="input-field flex-1" />
                    {misi.length > 1 && (
                      <button type="button"
                        onClick={() => setMisi(misi.filter((_, j) => j !== i))}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/kandidat" className="btn-secondary flex-1 text-center justify-center">
            Batal
          </Link>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</>
            ) : 'Simpan Kandidat'}
          </button>
        </div>
      </form>
    </div>
  )
}
