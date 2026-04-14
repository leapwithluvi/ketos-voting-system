import type { DefaultSession, DefaultJWT } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      nisn: string
      name: string
      role: 'admin' | 'user'
      kelas: string
      hasVoted: boolean
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    nisn: string
    role: 'admin' | 'user'
    kelas: string
    hasVoted: boolean
  }
}
