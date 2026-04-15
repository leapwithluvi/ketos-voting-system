import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { exportToExcel, generateStudentTemplate } from '@/lib/excel'
import { logger } from '@/lib/logger'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const isTemplate = url.searchParams.get('template') === '1'

    if (isTemplate) {
      const buffer = generateStudentTemplate()
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="template-siswa.xlsx"',
        },
      })
    }

    const students = await prisma.user.findMany({
      where: { role: 'user' },
      orderBy: [
        { kelas: 'asc' },
        { name: 'asc' },
      ],
    })

    const data = students.map((s, i) => ({
      No: i + 1,
      NISN: s.nisn,
      'Nama Lengkap': s.name,
      Kelas: s.kelas,
      Jurusan: s.jurusan,
      'Sudah Memilih': s.hasVoted ? 'Ya' : 'Belum',
      Status: s.isActive ? 'Aktif' : 'Nonaktif',
      'Tanggal Daftar': s.createdAt ? new Date(s.createdAt).toLocaleDateString('id-ID') : '',
    }))

    const buffer = exportToExcel(data, 'data-siswa')
    const date = new Date().toISOString().split('T')[0]

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="data-siswa-${date}.xlsx"`,
      },
    })

  } catch (error) {
    logger.error('GET /api/siswa/export error', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
