import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { checkRateLimit, uploadRateLimiter } from '@/lib/rateLimit'
import { getClientIp } from '@/lib/audit'
import { logger } from '@/lib/logger'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const ip = getClientIp(req)
    const { allowed } = await checkRateLimit(uploadRateLimiter, ip)
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak upload' }, { status: 429 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 })

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP.' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'Ukuran file maksimal 5 MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Optimize with sharp
    let optimized: Buffer
    try {
      const sharp = (await import('sharp')).default
      optimized = await sharp(buffer)
        .resize(400, 400, { fit: 'cover', position: 'face' })
        .webp({ quality: 80 })
        .toBuffer()
    } catch {
      // Sharp might fail in some environments; fallback to original
      logger.warn('Sharp optimization failed, using original')
      optimized = buffer
    }

    // Save to public/uploads
    await mkdir(UPLOAD_DIR, { recursive: true })
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
    const filepath = join(UPLOAD_DIR, filename)
    await writeFile(filepath, optimized)

    const url = `/uploads/${filename}`
    logger.info('Image uploaded', { filename, size: optimized.length })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    logger.error('POST /api/upload error', error)
    return NextResponse.json({ success: false, error: 'Upload gagal' }, { status: 500 })
  }
}
