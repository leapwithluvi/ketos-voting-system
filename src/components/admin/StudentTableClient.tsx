'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Student {
  _id: string; nisn: string; name: string; kelas: string
  jurusan: string; hasVoted: boolean; isActive: boolean; createdAt: string
}

interface Props {
  students: Student[]; page: number; totalPages: number; search: string
}

export default function StudentTableClient({ students, page, totalPages, search }: Props) {
  const router = useRouter()
  const [resettingId, setResettingId] = useState<string | null>(null)

  async function resetPassword(id: string) {
    setResettingId(id)
    try {
      const res = await fetch(`/api/siswa/${id}/reset-password`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Password direset: ${data.newPassword}`, { duration: 8000 })
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal reset password')
    } finally {
      setResettingId(null)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/siswa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !current }),
      })
      if (!res.ok) throw new Error('Gagal mengubah status')
      toast.success(`Akun ${!current ? 'diaktifkan' : 'dinonaktifkan'}`)
      router.refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal')
    }
  }

  function buildUrl(p: number) {
    const params = new URLSearchParams()
    params.set('page', p.toString())
    if (search) params.set('search', search)
    return `/admin/siswa?${params.toString()}`
  }

  if (students.length === 0) {
    return (
      <div className="card p-16 text-center text-slate-400">
        Tidak ada siswa{search ? ` untuk pencarian "${search}"` : ''}
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['NISN', 'Nama', 'Kelas', 'Jurusan', 'Status', 'Sudah Memilih', 'Aksi'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-mono text-slate-600">{s.nisn}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                <td className="px-4 py-3 text-slate-600">{s.kelas}</td>
                <td className="px-4 py-3 text-slate-600">{s.jurusan}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(s._id, s.isActive)}
                    className={`badge cursor-pointer hover:opacity-80 transition-opacity ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {s.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {s.hasVoted
                    ? <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" /> Ya</span>
                    : <span className="flex items-center gap-1 text-slate-400"><XCircle className="w-4 h-4" /> Belum</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/siswa/${s._id}/edit`}
                      className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all font-medium">
                      Edit
                    </Link>
                    <button onClick={() => resetPassword(s._id)}
                      disabled={resettingId === s._id}
                      className="text-xs px-2 py-1 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all font-medium flex items-center gap-1 disabled:opacity-50">
                      {resettingId === s._id ? <div className="w-3 h-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      Reset
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <p className="text-sm text-slate-500">Halaman {page} dari {totalPages}</p>
          <div className="flex items-center gap-1">
            <Link href={buildUrl(page - 1)}
              aria-disabled={page <= 1}
              className={`p-2 rounded-lg transition-all ${page <= 1 ? 'text-slate-300 pointer-events-none' : 'text-slate-600 hover:bg-slate-100'}`}>
              <ChevronLeft className="w-4 h-4" />
            </Link>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return (
                <Link key={p} href={buildUrl(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${p === page ? 'gradient-primary text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {p}
                </Link>
              )
            })}
            <Link href={buildUrl(page + 1)}
              aria-disabled={page >= totalPages}
              className={`p-2 rounded-lg transition-all ${page >= totalPages ? 'text-slate-300 pointer-events-none' : 'text-slate-600 hover:bg-slate-100'}`}>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
