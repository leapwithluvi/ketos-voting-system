import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { CreateCandidateSchema } from '@/lib/validations'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { checkRateLimit, apiRateLimiter } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'

export async function GET(req: Request) {
  try {
    const { allowed } = await checkRateLimit(apiRateLimiter, getClientIp(req))
    if (!allowed) return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })

    const candidates = await prisma.candidate.findMany({
      orderBy: { nomorUrut: 'asc' },
    })
    return NextResponse.json({ success: true, data: candidates })
  } catch (error) {
    logger.error('GET /api/kandidat error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { allowed } = await checkRateLimit(apiRateLimiter, session.user.id)
    if (!allowed) return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })

    const body = await req.json()
    const parsed = CreateCandidateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    // Check duplicate nomorUrut
    const existing = await prisma.candidate.findUnique({
      where: { nomorUrut: parsed.data.nomorUrut },
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Nomor urut ${parsed.data.nomorUrut} sudah digunakan` },
        { status: 409 }
      )
    }

    const candidate = await prisma.candidate.create({
      data: parsed.data,
    })

    await createAuditLog({
      userId: session.user.id,
      action: 'CREATE_CANDIDATE',
      resource: 'Candidate',
      resourceId: candidate.id,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      details: { nomorUrut: candidate.nomorUrut, namaKetua: candidate.namaKetua },
    })

    logger.info('Candidate created', { id: candidate.id, nomorUrut: candidate.nomorUrut })
    return NextResponse.json({ success: true, data: candidate }, { status: 201 })
  } catch (error) {
    logger.error('POST /api/kandidat error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

