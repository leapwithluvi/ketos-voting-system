import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const pathname = nextUrl.pathname

  // Public routes
  const publicRoutes = ['/login', '/api/auth', '/api/health']
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r))

  if (isPublic) return NextResponse.next()

  // Not authenticated
  if (!session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin-only routes
  const adminRoutes = ['/admin', '/api/siswa', '/api/stats']
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))

  if (isAdminRoute && session.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // User routes
  const userRoutes = ['/dashboard', '/kandidat']
  const isUserRoute = userRoutes.some((r) => pathname.startsWith(r))

  if (isUserRoute && session.user.role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
}

