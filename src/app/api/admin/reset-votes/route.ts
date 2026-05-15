import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Reset votes transaction
    // 1. Set all users' hasVoted to false
    // 2. Clear all users' votedForId and votedAt
    // 3. Set all candidates' jumlahSuara to 0
    await prisma.$transaction([
      prisma.user.updateMany({
        where: { role: 'user' },
        data: {
          hasVoted: false,
          votedForId: null,
          votedAt: null,
        },
      }),
      prisma.candidate.updateMany({
        data: {
          jumlahSuara: 0,
        },
      }),
    ])

    await createAuditLog({
      userId: session.user.id,
      action: 'RESET_VOTES',
      resource: 'All',
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      details: { message: 'All votes have been cleared' },
    })

    logger.info('All votes have been reset by admin', { userId: session.user.id })

    return NextResponse.json({ success: true, message: 'Semua data suara berhasil direset' })
  } catch (error) {
    logger.error('POST /api/admin/reset-votes error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
