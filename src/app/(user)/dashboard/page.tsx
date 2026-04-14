import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Candidate from '@/models/Candidate'
import VotingSession from '@/models/VotingSession'
import User from '@/models/User'
import CandidateCard from '@/components/user/CandidateCard'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pilih Kandidat' }
export const dynamic = 'force-dynamic'

export default async function UserDashboardPage() {
  const session = await auth()
  if (!session) return null

  await connectDB()

  const [candidates, votingSession, user] = await Promise.all([
    Candidate.find({ isActive: true }).sort({ nomorUrut: 1 }).lean(),
    VotingSession.findOne().sort({ createdAt: -1 }).lean(),
    User.findById(session.user.id).lean(),
  ])

  const hasVoted = user?.hasVoted ?? false
  const votedFor = user?.votedFor?.toString()
  const isOpen = votingSession?.isOpen ?? false

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
          Pemilihan Ketua OSIS
        </h1>
        <p className="text-slate-500 mt-1">{votingSession?.name ?? 'Pilih pasangan calon favoritmu'}</p>
      </div>

      {/* Status banners */}
      {hasVoted && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 mb-6">
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Suaramu telah tercatat!</p>
            <p className="text-sm text-green-600">Terima kasih sudah berpartisipasi dalam pemilihan ini.</p>
          </div>
        </div>
      )}

      {!isOpen && !hasVoted && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-200 mb-6">
          <Clock className="w-6 h-6 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-orange-800">Voting belum dibuka</p>
            <p className="text-sm text-orange-600">Tunggu admin membuka sesi voting untuk dapat memilih.</p>
          </div>
        </div>
      )}

      {isOpen && !hasVoted && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200 mb-6">
          <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-800">Voting sedang berlangsung</p>
            <p className="text-sm text-blue-600">Pilihlah dengan bijak. Setiap suara hanya dapat diberikan sekali.</p>
          </div>
        </div>
      )}

      {/* Candidates */}
      {candidates.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Belum ada kandidat yang terdaftar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <CandidateCard
              key={c._id.toString()}
              candidate={{
                _id: c._id.toString(),
                nomorUrut: c.nomorUrut,
                namaKetua: c.namaKetua,
                namaWakil: c.namaWakil,
                fotoKetua: c.fotoKetua,
                fotoWakil: c.fotoWakil,
                visi: c.visi,
                misi: c.misi,
                jumlahSuara: c.jumlahSuara,
                isActive: c.isActive,
              }}
              isVotingOpen={isOpen}
              hasVoted={hasVoted}
              isVotedFor={votedFor === c._id.toString()}
            />
          ))}
        </div>
      )}
    </div>
  )
}
