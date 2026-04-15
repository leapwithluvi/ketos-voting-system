import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { UpdateUserSchema } from '@/lib/validations'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { logger } from '@/lib/logger'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const user = await prisma.user.findUnique({
      where: { id },
    })
    if (!user) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    logger.error('GET /api/siswa/[id] error', error)
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
    const parsed = UpdateUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
    })
    if (!user) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })

    await createAuditLog({
      userId: session.user.id,
      action: 'UPDATE_USER',
      resource: 'User',
      resourceId: id,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
    })

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    logger.error('PATCH /api/siswa/[id] error', error)
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

    const user = await prisma.user.delete({
      where: { id },
    })
    if (!user) return NextResponse.json({ success: false, error: 'Siswa tidak ditemukan' }, { status: 404 })

    await createAuditLog({
      userId: session.user.id,
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: id,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
    })

    return NextResponse.json({ success: true, message: 'Siswa berhasil dihapus' })
  } catch (error) {
    logger.error('DELETE /api/siswa/[id] error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
