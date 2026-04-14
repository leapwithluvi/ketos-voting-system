'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn, Shield, Vote } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [nisn, setNisn] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!/^\d{10}$/.test(nisn)) {
      setError('NISN harus tepat 10 digit angka')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        nisn,
        password,
        redirect: false,
      })

      if (result?.error) {
        const msg =
          result.error === 'Akun dikunci. Coba lagi nanti.'
            ? result.error
            : 'NISN atau password salah'
        setError(msg)
        toast.error(msg)
      } else {
        toast.success('Login berhasil!')
        router.refresh()
        // Redirect will be handled server-side via middleware
        window.location.href = '/'
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      toast.error('Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              E-Voting OSIS
            </h1>
            <p className="text-blue-200 mt-1 text-sm">Pemilihan Ketua OSIS {new Date().getFullYear()}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-1.5">
                NISN
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={nisn}
                onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
                placeholder="Masukkan 10 digit NISN"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-100 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                <Shield className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white gradient-primary hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Masuk
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-blue-200/60 justify-center">
            <Shield className="w-3.5 h-3.5" />
            Sistem dilindungi enkripsi & rate limiting
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-4">
          © {new Date().getFullYear()} E-Voting OSIS · Secure Electronic Voting System
        </p>
      </div>
    </div>
  )
}
