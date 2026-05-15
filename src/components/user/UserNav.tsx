'use client'

import { signOut } from 'next-auth/react'
import { Vote, LogOut, User, Lock } from 'lucide-react'
import Link from 'next/link'

interface Props {
  user: { name: string; nisn: string; kelas: string; hasVoted: boolean }
}

export default function UserNav({ user }: Props) {
  return (
    <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow">
            <Vote className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            E-Voting OSIS
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user.hasVoted && (
            <span className="badge bg-green-100 text-green-700">✓ Sudah Memilih</span>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="w-4 h-4" />
            <span className="font-medium">{user.name}</span>
            <span className="text-slate-400">· Kelas {user.kelas}</span>
          </div>
          <Link
            href="/password"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            <Lock className="w-4 h-4" />
            Sandi
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>
    </header>
  )
}
