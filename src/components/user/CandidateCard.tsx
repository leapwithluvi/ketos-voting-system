'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CheckCircle2, ChevronDown, ChevronUp, Vote } from 'lucide-react'
import Link from 'next/link'
import type { ICandidatePublic } from '@/types'

interface Props {
  candidate: ICandidatePublic
  isVotingOpen: boolean
  hasVoted: boolean
  isVotedFor: boolean
}

export default function CandidateCard({ candidate: c, isVotingOpen, hasVoted, isVotedFor }: Props) {
  const router = useRouter()
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [showMisi, setShowMisi] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleVote() {
    setLoading(true)
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: c._id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Suaramu berhasil dicatat! 🎉')
      setShowVoteModal(false)
      router.refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Gagal memilih')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={`card card-hover overflow-hidden transition-all duration-300 ${isVotedFor ? 'ring-2 ring-blue-500 shadow-blue-100' : ''}`}>
        {/* Header */}
        <div className="gradient-primary p-4 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">
              Pasangan Calon
            </span>
            <span className="text-2xl font-bold opacity-30">#{c.nomorUrut}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {c.nomorUrut}
          </div>
          {isVotedFor && (
            <div className="absolute top-3 right-3 bg-green-400 rounded-full p-1">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Photos */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 text-center">
              <div className="w-full aspect-square rounded-xl bg-slate-100 overflow-hidden mb-1.5">
                {c.fotoKetua ? (
                  <img src={c.fotoKetua} alt={c.namaKetua} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl font-bold">
                    {c.namaKetua.charAt(0)}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">Ketua</p>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{c.namaKetua}</p>
            </div>
            <div className="flex-1 text-center">
              <div className="w-full aspect-square rounded-xl bg-slate-100 overflow-hidden mb-1.5">
                {c.fotoWakil ? (
                  <img src={c.fotoWakil} alt={c.namaWakil} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl font-bold">
                    {c.namaWakil.charAt(0)}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">Wakil</p>
              <p className="text-sm font-semibold text-slate-800 leading-tight">{c.namaWakil}</p>
            </div>
          </div>

          {/* Visi */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Visi</p>
            <p className="text-sm text-slate-600 line-clamp-3">{c.visi}</p>
          </div>

          {/* Misi toggle */}
          <button
            onClick={() => setShowMisi(!showMisi)}
            className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-3 hover:underline"
          >
            {showMisi ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showMisi ? 'Sembunyikan' : 'Lihat'} Misi ({c.misi.length})
          </button>

          {showMisi && (
            <ul className="space-y-1.5 mb-4">
              {c.misi.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          )}

          {/* Actions */}
          {isVotedFor ? (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Pilihanmu
            </div>
          ) : hasVoted ? (
            <div className="p-3 rounded-xl bg-slate-50 text-slate-400 text-sm text-center">
              Kamu sudah memilih pasangan lain
            </div>
          ) : isVotingOpen ? (
            <button
              onClick={() => setShowVoteModal(true)}
              className="btn-primary w-full"
            >
              <Vote className="w-4 h-4" />
              Pilih Pasangan Ini
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 text-slate-400 text-sm text-center">
              Voting belum dibuka
            </div>
          )}
        </div>
      </div>

      {/* Vote Confirmation Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !loading && setShowVoteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
              {c.nomorUrut}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              Konfirmasi Pilihan
            </h3>
            <p className="text-slate-500 text-sm mb-5">
              Kamu akan memilih <strong>{c.namaKetua}</strong> &amp; <strong>{c.namaWakil}</strong>
              sebagai pasangan calon {c.nomorUrut}. Pilihan tidak dapat diubah.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowVoteModal(false)}
                disabled={loading}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                onClick={handleVote}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  '✓ Ya, Pilih!'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
