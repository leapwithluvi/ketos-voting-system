import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Candidate from '@/models/Candidate'
import VotingSession from '@/models/VotingSession'
import StatsChart from '@/components/admin/StatsChart'
import {
  Users, UserSquare2, CheckCircle2, TrendingUp, Clock, ToggleLeft, ToggleRight
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard Admin' }
export const dynamic = 'force-dynamic'

async function getDashboardData() {
  await connectDB()
  const [totalVoters, totalVoted, candidates, session] = await Promise.all([
    User.countDocuments({ role: 'user', isActive: true }),
    User.countDocuments({ role: 'user', hasVoted: true }),
    Candidate.find({ isActive: true }).sort({ nomorUrut: 1 }).lean(),
    VotingSession.findOne().sort({ createdAt: -1 }).lean(),
  ])

  const participationRate = totalVoters > 0 ? (totalVoted / totalVoters) * 100 : 0

  return { totalVoters, totalVoted, candidates, session, participationRate }
}

export default async function AdminDashboardPage() {
  await auth()
  const { totalVoters, totalVoted, candidates, session, participationRate } =
    await getDashboardData()

  const totalSuara = candidates.reduce((a, c) => a + c.jumlahSuara, 0)

  const statCards = [
    {
      label: 'Total Pemilih', value: totalVoters,
      icon: Users, color: 'text-blue-600', bg: 'bg-blue-50',
    },
    {
      label: 'Sudah Memilih', value: totalVoted,
      icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50',
    },
    {
      label: 'Belum Memilih', value: totalVoters - totalVoted,
      icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50',
    },
    {
      label: 'Total Kandidat', value: candidates.length,
      icon: UserSquare2, color: 'text-purple-600', bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Ringkasan hasil pemilihan ketua OSIS</p>
      </div>

      {/* Voting status banner */}
      <div className={`card p-4 mb-6 flex items-center justify-between ${session?.isOpen ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-slate-300'}`}>
        <div className="flex items-center gap-3">
          {session?.isOpen
            ? <ToggleRight className="w-6 h-6 text-green-500" />
            : <ToggleLeft className="w-6 h-6 text-slate-400" />}
          <div>
            <p className="font-semibold text-slate-900">
              {session?.name ?? 'Belum ada sesi voting'}
            </p>
            <p className="text-sm text-slate-500">
              Status: {session?.isOpen ? 'Voting sedang berlangsung' : 'Voting ditutup'}
            </p>
          </div>
        </div>
        <a href="/admin/pengaturan" className="text-sm text-blue-600 hover:underline font-medium">
          Kelola →
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Participation rate */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Tingkat Partisipasi</h2>
          </div>
          <span className="text-2xl font-bold text-blue-600">{participationRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="h-3 rounded-full gradient-primary transition-all duration-1000"
            style={{ width: `${participationRate}%` }}
          />
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {totalVoted} dari {totalVoters} siswa telah memberikan suara
        </p>
      </div>

      {/* Charts + table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recharts pie / bar */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Perolehan Suara</h2>
          <StatsChart
            data={candidates.map((c) => ({
              name: `Paslon ${c.nomorUrut}`,
              namaKetua: c.namaKetua,
              suara: c.jumlahSuara,
              percentage: totalSuara > 0
                ? ((c.jumlahSuara / totalSuara) * 100).toFixed(1)
                : '0',
            }))}
          />
        </div>

        {/* Kandidat table */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Rincian Perolehan</h2>
          <div className="space-y-3">
            {candidates.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-8">Belum ada kandidat</p>
            )}
            {candidates.map((c, i) => {
              const pct = totalSuara > 0 ? (c.jumlahSuara / totalSuara) * 100 : 0
              const colors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500']
              return (
                <div key={c._id.toString()}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-semibold text-slate-900 text-sm">
                        Paslon {c.nomorUrut} – {c.namaKetua}
                      </span>
                      {i === 0 && totalSuara > 0 && (
                        <span className="ml-2 badge bg-yellow-100 text-yellow-700">Unggul</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {c.jumlahSuara} suara
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors[i % colors.length]} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 text-right">{pct.toFixed(1)}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
