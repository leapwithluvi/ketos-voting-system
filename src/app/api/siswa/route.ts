import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
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

    await connectDB()

    const query: Record<string, unknown> = { role: 'user' }
    if (pagination.search) {
      query.$or = [
        { name: { $regex: pagination.search, $options: 'i' } },
        { nisn: { $regex: pagination.search, $options: 'i' } },
        { jurusan: { $regex: pagination.search, $options: 'i' } },
      ]
    }

    const [students, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .lean(),
      User.countDocuments(query),
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

    await connectDB()

    // Check NISN duplicate
    const existing = await User.findOne({ nisn: parsed.data.nisn })
    if (existing) {
      return NextResponse.json({ success: false, error: 'NISN sudah terdaftar' }, { status: 409 })
    }

    const plainPassword = generatePassword(parsed.data.nisn)
    const hashedPassword = await hashPassword(plainPassword)

    const user = await User.create({
      ...parsed.data,
      password: hashedPassword,
      passwordChangedAt: new Date(),
    })

    await createAuditLog({
      userId: session.user.id,
      action: 'CREATE_USER',
      resource: 'User',
      resourceId: user._id.toString(),
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      details: { nisn: user.nisn },
    })

    return NextResponse.json(
      { success: true, data: { ...user.toJSON(), password: plainPassword } },
      { status: 201 }
    )
  } catch (error) {
    logger.error('POST /api/siswa error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
