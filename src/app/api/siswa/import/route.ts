import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { hashPassword, generatePassword } from '@/lib/password'
import { ImportRowSchema } from '@/lib/validations'
import { createAuditLog, getClientIp, getUserAgent } from '@/lib/audit'
import { parseExcelBuffer, parseCsvString } from '@/lib/excel'
import { logger } from '@/lib/logger'
import type { ImportResult } from '@/types'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 })

    const maxSize = 5 * 1024 * 1024 // 5 MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'File terlalu besar (maks 5 MB)' }, { status: 400 })
    }

    let rows: any[]
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (ext === 'csv') {
      const text = await file.text()
      rows = parseCsvString(text)
    } else if (ext === 'xlsx' || ext === 'xls') {
      const buffer = await file.arrayBuffer()
      rows = parseExcelBuffer(buffer)

    } else {
      return NextResponse.json({ success: false, error: 'Format file tidak didukung (.xlsx, .xls, .csv)' }, { status: 400 })
    }

    const result: ImportResult = { success: 0, failed: 0, errors: [] }

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i]
      const rowNum = i + 2 // +2 for 1-based + header row

      // Normalize keys
      const normalized = {
        nisn: String(raw.nisn ?? raw.NISN ?? '').trim(),
        name: String(raw.name ?? raw['nama lengkap'] ?? raw.nama ?? '').trim(),
        kelas: String(raw.kelas ?? raw.Kelas ?? '').trim().toUpperCase(),
        jurusan: String(raw.jurusan ?? raw.Jurusan ?? '').trim(),
      }

      const parsed = ImportRowSchema.safeParse(normalized)
      if (!parsed.success) {
        result.failed++
        result.errors.push({
          row: rowNum,
          nisn: normalized.nisn,
          error: parsed.error.errors[0].message,
        })
        continue
      }

      try {
        // Check duplicate
        const exists = await prisma.user.findUnique({
          where: { nisn: parsed.data.nisn }
        })
        if (exists) {
          result.failed++
          result.errors.push({ row: rowNum, nisn: parsed.data.nisn, error: 'NISN sudah terdaftar' })
          continue
        }

        const plainPassword = generatePassword(parsed.data.nisn)
        const hashed = await hashPassword(plainPassword)

        await prisma.user.create({
          data: {
            ...parsed.data,
            password: hashed,
            kelas: parsed.data.kelas as any,
          }
        })
        result.success++
      } catch (err: unknown) {
        result.failed++
        result.errors.push({
          row: rowNum,
          nisn: normalized.nisn,
          error: err instanceof Error ? err.message : 'Gagal menyimpan',
        })
      }
    }

    await createAuditLog({
      userId: session.user.id,
      action: 'IMPORT_USERS',
      resource: 'User',
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      details: { success: result.success, failed: result.failed, filename: file.name },
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    logger.error('POST /api/siswa/import error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
