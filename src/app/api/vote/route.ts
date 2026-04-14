import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Candidate from '@/models/Candidate'
import User from '@/models/User'
import VotingSession from '@/models/VotingSession'
import { VoteSchema } from '@/lib/validations'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { checkRateLimit, voteRateLimiter } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import mongoose from 'mongoose'

export async function POST(req: Request) {
  try {
    // Auth check
    const session = await auth()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user.role !== 'user') {
      return NextResponse.json({ success: false, error: 'Admin tidak dapat memilih' }, { status: 403 })
    }

    // Rate limit by IP
    const ip = getClientIp(req)
    const { allowed } = await checkRateLimit(voteRateLimiter, ip)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak percobaan. Coba lagi nanti.' },
        { status: 429 }
      )
    }

    // Validate body
    const body = await req.json()
    const parsed = VoteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Data tidak valid' }, { status: 400 })
    }

    const { candidateId } = parsed.data

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return NextResponse.json({ success: false, error: 'ID kandidat tidak valid' }, { status: 400 })
    }

    await connectDB()

    // Check voting session open
    const votingSession = await VotingSession.findOne().sort({ createdAt: -1 }).lean()
    if (!votingSession?.isOpen) {
      return NextResponse.json(
        { success: false, error: 'Sesi voting sedang ditutup' },
        { status: 403 }
      )
    }

    // Double-check hasVoted from DB (not from JWT to prevent stale token attack)
    const voter = await User.findById(session.user.id).select('+hasVoted +votedFor +isActive')
    if (!voter) {
      return NextResponse.json({ success: false, error: 'User tidak ditemukan' }, { status: 404 })
    }
    if (!voter.isActive) {
      return NextResponse.json({ success: false, error: 'Akun tidak aktif' }, { status: 403 })
    }
    if (voter.hasVoted) {
      return NextResponse.json(
        { success: false, error: 'Kamu sudah memberikan suara sebelumnya' },
        { status: 409 }
      )
    }

    // Check candidate exists and active
    const candidate = await Candidate.findOne({ _id: candidateId, isActive: true })
    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Kandidat tidak ditemukan atau tidak aktif' }, { status: 404 })
    }

    // Atomic vote transaction using session
    const dbSession = await mongoose.startSession()
    try {
      await dbSession.withTransaction(async () => {
        // Mark user as voted
        await User.findByIdAndUpdate(
          session.user.id,
          {
            hasVoted: true,
            votedFor: candidateId,
            votedAt: new Date(),
          },
          { session: dbSession }
        )
        // Increment candidate vote count
        await Candidate.findByIdAndUpdate(
          candidateId,
          { $inc: { jumlahSuara: 1 } },
          { session: dbSession }
        )
      })
    } finally {
      await dbSession.endSession()
    }

    await createAuditLog({
      userId: session.user.id,
      action: 'VOTE',
      resource: 'Candidate',
      resourceId: candidateId,
      ipAddress: ip,
      userAgent: getUserAgent(req),
      details: { candidateName: candidate.namaKetua },
    })

    logger.info('Vote recorded', {
      userId: session.user.id,
      candidateId,
      ip,
    })

    return NextResponse.json({ success: true, message: 'Suara berhasil dicatat' })
  } catch (error) {
    logger.error('POST /api/vote error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
