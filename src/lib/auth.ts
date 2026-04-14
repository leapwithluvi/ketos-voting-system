import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
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

        await connectDB()

        // Find user with password field
        const user = await User.findOne({ nisn, isActive: true }).select(
          '+password +failedLoginAttempts +lockedUntil'
        )

        if (!user) {
          logger.warn('Login attempt for unknown NISN', { nisn })
          return null
        }

        // Check account lock
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          logger.warn('Login attempt on locked account', { nisn })
          throw new Error('Akun dikunci. Coba lagi nanti.')
        }

        const isValid = await verifyPassword(password, (user as any).password)

        if (!isValid) {
          // Increment failed attempts
          const attempts = (user.failedLoginAttempts ?? 0) + 1
          const updateData: Record<string, unknown> = {
            failedLoginAttempts: attempts,
          }
          if (attempts >= 5) {
            updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
            logger.warn('Account locked due to failed attempts', { nisn })
          }
          await User.updateOne({ _id: user._id }, updateData)
          return null
        }

        // Reset failed attempts on success
        await User.updateOne(
          { _id: user._id },
          { failedLoginAttempts: 0, lockedUntil: null }
        )

        return {
          id: user._id.toString(),
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

