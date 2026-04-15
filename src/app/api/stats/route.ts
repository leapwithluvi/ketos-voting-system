import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { VotingSessionSchema } from '@/lib/validations'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { logger } from '@/lib/logger'

export async function GET(_req: Request) {
  try {
    const [totalVoters, totalVoted, candidates, session] = await Promise.all([
      prisma.user.count({ where: { role: 'user', isActive: true } }),
      prisma.user.count({ where: { role: 'user', hasVoted: true } }),
      prisma.candidate.findMany({
        where: { isActive: true },
        orderBy: { nomorUrut: 'asc' },
      }),
      prisma.votingSession.findFirst({
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const totalSuara = candidates.reduce((a, c) => a + c.jumlahSuara, 0)
    const participationRate = totalVoters > 0 ? (totalVoted / totalVoters) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        totalVoters,
        totalVoted,
        participationRate,
        isOpen: session?.isOpen ?? false,
        session: session
          ? {
              id: session.id,
              name: session.name,
              isOpen: session.isOpen,
              startTime: session.startTime,
              endTime: session.endTime,
            }
          : null,
        candidates: candidates.map((c) => ({
          id: c.id,
          nomorUrut: c.nomorUrut,
          namaKetua: c.namaKetua,
          namaWakil: c.namaWakil,
          jumlahSuara: c.jumlahSuara,
          percentage: totalSuara > 0 ? ((c.jumlahSuara / totalSuara) * 100).toFixed(1) : '0',
        })),
      },
    })
  } catch (error) {
    logger.error('GET /api/stats error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// Create or update voting session
export async function POST(req: Request) {
  return upsertSession(req, false)
}

export async function PATCH(req: Request) {
  return upsertSession(req, true)
}

async function upsertSession(req: Request, isUpdate: boolean) {
  try {
    const sessionUser = await auth()
    if (!sessionUser || sessionUser.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = VotingSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    let votingSession
    if (isUpdate) {
      const current = await prisma.votingSession.findFirst({
        orderBy: { createdAt: 'desc' },
      })
      if (!current) {
        return NextResponse.json({ success: false, error: 'Sesi tidak ditemukan' }, { status: 404 })
      }
      votingSession = await prisma.votingSession.update({
        where: { id: current.id },
        data: {
          ...parsed.data,
          startTime: parsed.data.startTime ? new Date(parsed.data.startTime) : undefined,
          endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : undefined,
        },
      })
    } else {
      votingSession = await prisma.votingSession.create({
        data: {
          ...parsed.data,
          startTime: parsed.data.startTime ? new Date(parsed.data.startTime) : undefined,
          endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : undefined,
          createdBy: sessionUser.user.id,
        },
      })
    }

    await createAuditLog({
      userId: sessionUser.user.id,
      action: isUpdate ? 'UPDATE_SESSION' : 'CREATE_SESSION',
      resource: 'VotingSession',
      resourceId: votingSession.id,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      details: { isOpen: votingSession.isOpen },
    })

    return NextResponse.json({ success: true, data: votingSession })
  } catch (error) {
    logger.error('POST/PATCH /api/stats error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

