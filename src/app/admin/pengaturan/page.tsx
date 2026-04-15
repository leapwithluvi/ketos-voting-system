'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Settings, ToggleLeft, ToggleRight, Clock } from 'lucide-react'

interface VSession { id: string; name: string; isOpen: boolean; startTime?: string; endTime?: string }

export default function PengaturanPage() {
  const [session, setSession] = useState<VSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', isOpen: false, startTime: '', endTime: '' })

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => {
      if (d.data?.session) {
        const s = d.data.session
        setSession(s)
        setForm({
          name: s.name ?? '',
          isOpen: s.isOpen ?? false,
          startTime: s.startTime ? new Date(s.startTime).toISOString().slice(0,16) : '',
          endTime: s.endTime ? new Date(s.endTime).toISOString().slice(0,16) : '',
        })
      }
      setLoading(false)
    })
  }, [])

  async function saveSession() {
    setSaving(true)
    try {
      const method = session ? 'PATCH' : 'POST'
      const url = session ? `/api/stats` : '/api/stats'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSession(data.data)
      toast.success('Pengaturan disimpan!')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-7 h-7 text-slate-600" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Pengaturan Voting
          </h1>
          <p className="text-slate-500 mt-1">Kelola sesi dan status pemilihan</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status banner */}
        <div className={`card p-5 border-l-4 ${form.isOpen ? 'border-l-green-500' : 'border-l-slate-300'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {form.isOpen
                ? <ToggleRight className="w-8 h-8 text-green-500" />
                : <ToggleLeft className="w-8 h-8 text-slate-400" />}
              <div>
                <p className="font-semibold text-slate-900">Status Voting</p>
                <p className={`text-sm font-medium ${form.isOpen ? 'text-green-600' : 'text-slate-500'}`}>
                  {form.isOpen ? '🟢 Sedang Berlangsung' : '🔴 Ditutup'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setForm(f => ({ ...f, isOpen: !f.isOpen }))}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${form.isOpen ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 ${form.isOpen ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Session form */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Detail Sesi</h2>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Sesi *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Contoh: Pemilihan OSIS 2024/2025"
              className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Waktu Mulai
              </label>
              <input type="datetime-local" value={form.startTime}
                onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Waktu Selesai
              </label>
              <input type="datetime-local" value={form.endTime}
                onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          <button onClick={saveSession} disabled={saving || !form.name} className="btn-primary w-full">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</> : 'Simpan Pengaturan'}
          </button>
        </div>

        {/* Danger zone */}
        <div className="card p-6 border border-red-100">
          <h2 className="font-semibold text-red-600 mb-3">Zona Berbahaya</h2>
          <p className="text-sm text-slate-500 mb-4">
            Reset semua data suara. Tindakan ini tidak dapat dibatalkan.
          </p>
          <button className="btn-danger" onClick={() => toast.error('Fitur ini membutuhkan konfirmasi tambahan')}>
            Reset Semua Suara
          </button>
        </div>
      </div>
    </div>
  )
}
