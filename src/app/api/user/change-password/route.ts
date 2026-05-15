import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ResetPasswordSchema } from '@/lib/validations'
import { hashPassword, verifyPassword } from '@/lib/password'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    // Basic check for current password
    if (!currentPassword) {
      return NextResponse.json({ success: false, error: 'Password saat ini wajib diisi' }, { status: 400 })
    }

    // Validate new password with Zod
    const parsed = ResetPasswordSchema.safeParse({ newPassword })
    if (!parsed.success) {
      return NextResponse.json({ 
        success: false, 
        error: parsed.error.errors[0].message 
      }, { status: 400 })
    }

    // Get full user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User tidak ditemukan' }, { status: 404 })
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Password saat ini salah' }, { status: 400 })
    }

    // Hash and update
    const hashed = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashed,
        passwordChangedAt: new Date()
      }
    })

    await createAuditLog({
      userId: user.id,
      action: 'CHANGE_PASSWORD',
      resource: 'User',
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      details: { reason: 'User self-service' }
    })

    logger.info('Password changed successfully', { userId: user.id })

    return NextResponse.json({ success: true, message: 'Password berhasil diperbarui' })
  } catch (error) {
    logger.error('POST /api/user/change-password error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
