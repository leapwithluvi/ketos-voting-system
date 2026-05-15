'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Settings, ToggleLeft, ToggleRight, Clock, AlertTriangle, Trash2 } from 'lucide-react'

interface VSession { id: string; name: string; isOpen: boolean; startTime?: string; endTime?: string }

export default function PengaturanPage() {
  const [session, setSession] = useState<VSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [form, setForm] = useState({ name: '', isOpen: false, startTime: '', endTime: '' })

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => {
      if (d.data?.session) {
        const s = d.data.session
        setSession(s)
        setForm({
          name: s.name ?? '',
          isOpen: s.isOpen ?? false,
          startTime: s.startTime ? new Date(s.startTime).toISOString().slice(0, 16) : '',
          endTime: s.endTime ? new Date(s.endTime).toISOString().slice(0, 16) : '',
        })
      }
      setLoading(false)
    })
  }, [])

  async function saveSession() {
    setSaving(true)
    try {
      const method = session ? 'PATCH' : 'POST'
      const res = await fetch('/api/stats', {
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

  async function resetVotes() {
    setResetting(true)
    try {
      const res = await fetch('/api/admin/reset-votes', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Semua data suara berhasil direset!')
      setShowResetConfirm(false)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal mereset suara')
    } finally {
      setResetting(false)
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
          <div className="flex items-center gap-2 text-red-600 mb-3">
            <Trash2 className="w-5 h-5" />
            <h2 className="font-semibold">Zona Berbahaya</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Reset semua data suara. Tindakan ini akan menghapus semua pilihan siswa dan mengosongkan perolehan suara kandidat.
          </p>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="btn-danger w-full sm:w-auto"
          >
            Reset Semua Suara
          </button>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !resetting && setShowResetConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Reset Semua Suara?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Tindakan ini tidak dapat dibatalkan. Semua siswa harus memilih kembali dari awal.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={resetting}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={resetVotes}
                disabled={resetting}
                className="btn-danger flex-1"
              >
                {resetting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  'Ya, Reset'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
