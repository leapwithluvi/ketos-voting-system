'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'

interface Student { _id: string; nisn: string; name: string; kelas: string; jurusan: string }

export default function PrintCardsClient({ students }: { students: Student[] }) {
  const printRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const content = printRef.current
    if (!content) return

    const win = window.open('', '_blank')!
    win.document.write(`
      <html>
      <head>
        <title>Kartu Login Siswa - E-Voting OSIS</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background: white; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 16px; }
          .card {
            border: 2px solid #1e40af; border-radius: 10px; overflow: hidden;
            page-break-inside: avoid;
          }
          .header {
            background: linear-gradient(135deg, #1e3a8a, #2563eb);
            color: white; padding: 8px 12px; text-align: center;
          }
          .header h2 { font-size: 11px; font-weight: 800; letter-spacing: 0.05em; }
          .header p { font-size: 9px; opacity: 0.8; }
          .body { padding: 10px 12px; }
          .label { font-size: 8px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
          .value { font-size: 11px; color: #0f172a; font-weight: 700; margin-bottom: 6px; }
          .nisn { font-size: 16px; color: #1d4ed8; letter-spacing: 0.15em; font-family: monospace; font-weight: 800; }
          .password-box {
            background: #f0f9ff; border: 1px dashed #93c5fd;
            border-radius: 6px; padding: 6px 8px; margin-top: 6px; text-align: center;
          }
          .password-label { font-size: 7px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
          .password { font-size: 13px; color: #1d4ed8; font-weight: 800; letter-spacing: 0.1em; font-family: monospace; }
          .footer { font-size: 7px; color: #94a3b8; text-align: center; padding: 4px; border-top: 1px solid #f1f5f9; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 10mm; }
          }
        </style>
      </head>
      <body>
        <div class="grid">
          ${students.map((s) => `
            <div class="card">
              <div class="header">
                <h2>🗳 E-VOTING OSIS</h2>
                <p>Kartu Login Pemilihan</p>
              </div>
              <div class="body">
                <div class="label">Nama</div>
                <div class="value">${s.name}</div>
                <div class="label">Kelas</div>
                <div class="value">${s.kelas} · ${s.jurusan}</div>
                <div class="label">NISN (Username)</div>
                <div class="nisn">${s.nisn}</div>
                <div class="password-box">
                  <div class="password-label">Password Default</div>
                  <div class="password">OSIS${s.nisn.slice(-4)}</div>
                </div>
              </div>
              <div class="footer">Jaga kerahasiaan kartu ini</div>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 500)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/siswa" className="p-2 rounded-xl hover:bg-slate-100 transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cetak Kartu Login
            </h1>
            <p className="text-slate-500 mt-1">{students.length} kartu akan dicetak</p>
          </div>
        </div>
        <button onClick={handlePrint} className="btn-primary">
          <Printer className="w-5 h-5" /> Cetak Semua
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
        ⚠️ Password default: <strong>OSIS + 4 digit terakhir NISN</strong>. Minta siswa segera mengganti password setelah login pertama.
      </div>

      {/* Preview */}
      <div ref={printRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {students.map((s) => (
          <div key={s._id} className="border-2 border-blue-200 rounded-xl overflow-hidden text-xs shadow-sm">
            <div className="gradient-primary text-white p-2.5 text-center">
              <p className="font-bold text-sm">🗳 E-VOTING OSIS</p>
              <p className="opacity-70 text-xs">Kartu Login Pemilihan</p>
            </div>
            <div className="p-3 space-y-1.5">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Nama</p>
                <p className="font-bold text-slate-900 text-sm leading-tight truncate">{s.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Kelas</p>
                <p className="font-semibold text-slate-700">{s.kelas} · {s.jurusan}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">NISN</p>
                <p className="font-mono font-black text-blue-700 text-base tracking-widest">{s.nisn}</p>
              </div>
              <div className="bg-blue-50 border border-dashed border-blue-300 rounded-lg p-2 text-center mt-1">
                <p className="text-slate-400 text-xs uppercase tracking-wide font-semibold">Password</p>
                <p className="font-mono font-black text-blue-800 text-sm tracking-wider">OSIS{s.nisn.slice(-4)}</p>
              </div>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 text-center text-slate-400 text-xs border-t border-slate-100">
              Jaga kerahasiaan kartu ini
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
