import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { UpdateCandidateSchema } from '@/lib/validations'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    })
    if (!candidate) return NextResponse.json({ success: false, error: 'Kandidat tidak ditemukan' }, { status: 404 })
    return NextResponse.json({ success: true, data: candidate })
  } catch (error) {
    logger.error('GET /api/kandidat/[id] error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = UpdateCandidateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: parsed.data,
    })

    await createAuditLog({
      userId: session.user.id,
      action: 'UPDATE_CANDIDATE',
      resource: 'Candidate',
      resourceId: id,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
    })

    return NextResponse.json({ success: true, data: candidate })
  } catch (error) {
    logger.error('PATCH /api/kandidat/[id] error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Prevent deletion if votes exist
    const candidate = await prisma.candidate.findUnique({
      where: { id },
    })
    if (!candidate) return NextResponse.json({ success: false, error: 'Kandidat tidak ditemukan' }, { status: 404 })
    if (candidate.jumlahSuara > 0) {
      return NextResponse.json(
        { success: false, error: 'Tidak dapat menghapus kandidat yang sudah mendapat suara' },
        { status: 400 }
      )
    }

    await prisma.candidate.delete({
      where: { id },
    })

    await createAuditLog({
      userId: session.user.id,
      action: 'DELETE_CANDIDATE',
      resource: 'Candidate',
      resourceId: id,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
    })

    return NextResponse.json({ success: true, message: 'Kandidat berhasil dihapus' })
  } catch (error) {
    logger.error('DELETE /api/kandidat/[id] error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
