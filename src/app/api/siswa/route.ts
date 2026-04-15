import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { CreateUserSchema, PaginationSchema } from '@/lib/validations'
import { hashPassword, generatePassword } from '@/lib/password'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { checkRateLimit, apiRateLimiter } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { allowed } = await checkRateLimit(apiRateLimiter, session.user.id)
    if (!allowed) return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })

    const url = new URL(req.url)
    const pagination = PaginationSchema.parse({
      page: url.searchParams.get('page') ?? '1',
      limit: url.searchParams.get('limit') ?? '15',
      search: url.searchParams.get('search') ?? undefined,
    })

    const where: any = { role: 'user' }
    if (pagination.search) {
      where.OR = [
        { name: { contains: pagination.search, mode: 'insensitive' } },
        { nisn: { contains: pagination.search, mode: 'insensitive' } },
        { jurusan: { contains: pagination.search, mode: 'insensitive' } },
      ]
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: students,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    })
  } catch (error) {
    logger.error('GET /api/siswa error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = CreateUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    // Check NISN duplicate
    const existing = await prisma.user.findUnique({
      where: { nisn: parsed.data.nisn },
    })
    if (existing) {
      return NextResponse.json({ success: false, error: 'NISN sudah terdaftar' }, { status: 409 })
    }

    const plainPassword = generatePassword(parsed.data.nisn)
    const hashedPassword = await hashPassword(plainPassword)

    const user = await prisma.user.create({
      data: {
        ...parsed.data,
        password: hashedPassword,
        passwordChangedAt: new Date(),
        kelas: parsed.data.kelas as any,
      },
    })

    await createAuditLog({
      userId: session.user.id,
      action: 'CREATE_USER',
      resource: 'User',
      resourceId: user.id,
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      details: { nisn: user.nisn },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { success: true, data: { ...userWithoutPassword, password: plainPassword } },
      { status: 201 }
    )
  } catch (error) {
    logger.error('POST /api/siswa error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

