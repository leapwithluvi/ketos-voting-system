import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.nisn = (user as any).nisn
        token.role = (user as any).role
        token.kelas = (user as any).kelas
        token.hasVoted = (user as any).hasVoted
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.nisn = token.nisn as string
        session.user.role = token.role as 'admin' | 'user'
        session.user.kelas = token.kelas as string
        session.user.hasVoted = token.hasVoted as boolean
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPublicPage = ['/login', '/api/auth', '/api/health'].some(path => 
        nextUrl.pathname.startsWith(path)
      )

      if (isPublicPage) return true
      return isLoggedIn
    },
  },
  providers: [], // Add empty providers array to satisfy type
} satisfies NextAuthConfig
