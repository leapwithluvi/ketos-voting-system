import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { LoginSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'
import { authConfig } from './auth.config'
import type { SessionUser } from '@/types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        nisn: { label: 'NISN', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate input shape
        const parsed = LoginSchema.safeParse(credentials)
        if (!parsed.success) {
          logger.warn('Login validation failed', parsed.error.flatten())
          return null
        }

        const { nisn, password } = parsed.data

        // Find user
        const user = await prisma.user.findUnique({
          where: { nisn, isActive: true },
        })

        if (!user) {
          logger.warn('Login attempt for unknown NISN', { nisn })
          return null
        }

        // Check account lock
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          logger.warn('Login attempt on locked account', { nisn })
          throw new Error('Akun dikunci. Coba lagi nanti.')
        }

        const isValid = await verifyPassword(password, user.password)

        if (!isValid) {
          // Increment failed attempts
          const attempts = (user.failedLoginAttempts ?? 0) + 1
          const updateData: any = {
            failedLoginAttempts: attempts,
          }
          if (attempts >= 5) {
            updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
            logger.warn('Account locked due to failed attempts', { nisn })
          }
          await prisma.user.update({
            where: { id: user.id },
            data: updateData,
          })
          return null
        }

        // Reset failed attempts on success
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: 0, lockedUntil: null },
        })

        return {
          id: user.id,
          nisn: user.nisn,
          name: user.name,
          role: user.role,
          kelas: user.kelas,
          hasVoted: user.hasVoted,
        } as SessionUser & { id: string; name: string }
      },
    }),
  ],
})

