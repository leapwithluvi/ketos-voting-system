import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { hashPassword, generatePassword } from '@/lib/password'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { logger } from '@/lib/logger'
import mongoose from 'mongoose'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(id)
    if (!user) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })

    const newPassword = generatePassword(user.nisn)
    const hashed = await hashPassword(newPassword)

    await User.findByIdAndUpdate(id, {
      password: hashed,
      passwordChangedAt: new Date(),
      failedLoginAttempts: 0,
      lockedUntil: null,
    })

    await createAuditLog({
      userId: session.user.id,
      action: 'RESET_PASSWORD',
      resource: 'User',
      resourceId: id,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      details: { targetNisn: user.nisn },
    })

    logger.info('Password reset by admin', { targetId: id, adminId: session.user.id })

    return NextResponse.json({
      success: true,
      newPassword,
      message: 'Password berhasil direset',
    })
  } catch (error) {
    logger.error('POST /api/siswa/[id]/reset-password error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
