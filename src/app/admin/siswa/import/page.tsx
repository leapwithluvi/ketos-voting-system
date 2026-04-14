'use client'

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ImportSiswaPage() {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<{ success: number; failed: number; errors: Array<{ row: number; nisn: string; error: string }> } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleImport() {
    if (!file) return toast.error('Pilih file terlebih dahulu')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/siswa/import', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.data)
      toast.success(`Import selesai: ${data.data.success} berhasil`)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Import gagal')
    } finally {
      setLoading(false)
    }
  }

  async function downloadTemplate() {
    const res = await fetch('/api/siswa/export?template=1')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template-siswa.xlsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function exportSiswa() {
    const res = await fetch('/api/siswa/export')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-siswa-${new Date().toISOString().split('T')[0]}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data berhasil diexport')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/siswa" className="p-2 rounded-xl hover:bg-slate-100 transition-all">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Import & Export Siswa
          </h1>
          <p className="text-slate-500 mt-1">Upload file Excel/CSV untuk import massal</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Template download */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Download Template</h2>
          <p className="text-sm text-slate-500 mb-4">
            Gunakan template Excel ini untuk memastikan format data yang benar.
            Kolom: <strong>NISN, Nama Lengkap, Kelas (X/XI/XII), Jurusan</strong>
          </p>
          <div className="flex gap-3">
            <button onClick={downloadTemplate} className="btn-secondary">
              <Download className="w-4 h-4" /> Template Excel
            </button>
            <button onClick={exportSiswa} className="btn-secondary">
              <Download className="w-4 h-4" /> Export Data Siswa
            </button>
          </div>
        </div>

        {/* Upload */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Upload File</h2>
          <div
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${file ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}
          >
            <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <FileSpreadsheet className={`w-10 h-10 mx-auto mb-3 ${file ? 'text-blue-500' : 'text-slate-300'}`} />
            {file ? (
              <>
                <p className="font-semibold text-blue-700">{file.name}</p>
                <p className="text-sm text-blue-500">{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-600">Klik atau drag file di sini</p>
                <p className="text-sm text-slate-400 mt-1">Format: .xlsx, .xls, .csv</p>
              </>
            )}
          </div>

          <button onClick={handleImport} disabled={!file || loading} className="btn-primary w-full mt-4">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengimport...</>
              : <><Upload className="w-4 h-4" /> Mulai Import</>}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Hasil Import</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-600">{result.success}</p>
                <p className="text-sm text-green-600">Berhasil</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                <p className="text-sm text-red-600">Gagal</p>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4 space-y-2 max-h-48 overflow-y-auto">
                <p className="text-sm font-semibold text-red-700 mb-2">Detail Error:</p>
                {result.errors.map((err, i) => (
                  <div key={i} className="text-xs text-red-600">
                    Baris {err.row} (NISN: {err.nisn}): {err.error}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
