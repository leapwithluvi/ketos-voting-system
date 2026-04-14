import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Candidate from '@/models/Candidate'
import User from '@/models/User'
import VotingSession from '@/models/VotingSession'
import { VotingSessionSchema } from '@/lib/validations'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { logger } from '@/lib/logger'

export async function GET(_req: Request) {
  try {
    await connectDB()

    const [totalVoters, totalVoted, candidates, session] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      User.countDocuments({ role: 'user', hasVoted: true }),
      Candidate.find({ isActive: true }).sort({ nomorUrut: 1 }).lean(),
      VotingSession.findOne().sort({ createdAt: -1 }).lean(),
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
              _id: session._id.toString(),
              name: session.name,
              isOpen: session.isOpen,
              startTime: session.startTime,
              endTime: session.endTime,
            }
          : null,
        candidates: candidates.map((c) => ({
          _id: c._id.toString(),
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
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = VotingSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    await connectDB()

    let votingSession
    if (isUpdate) {
      votingSession = await VotingSession.findOneAndUpdate(
        {},
        { ...parsed.data, startTime: parsed.data.startTime ? new Date(parsed.data.startTime) : undefined, endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : undefined },
        { new: true, sort: { createdAt: -1 } }
      )
      if (!votingSession) {
        return NextResponse.json({ success: false, error: 'Sesi tidak ditemukan' }, { status: 404 })
      }
    } else {
      votingSession = await VotingSession.create({
        ...parsed.data,
        startTime: parsed.data.startTime ? new Date(parsed.data.startTime) : undefined,
        endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : undefined,
        createdBy: session.user.id,
      })
    }

    await createAuditLog({
      userId: session.user.id,
      action: isUpdate ? 'UPDATE_SESSION' : 'CREATE_SESSION',
      resource: 'VotingSession',
      resourceId: votingSession._id.toString(),
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
