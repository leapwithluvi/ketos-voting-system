import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import type { StudentImportRow } from '@/types'

export function parseExcelBuffer(buffer: ArrayBuffer): StudentImportRow[] {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    header: ['nisn', 'name', 'kelas', 'jurusan'],
    range: 1, // skip header row
  })
  return rows as unknown as StudentImportRow[]
}

export function parseCsvString(csv: string): StudentImportRow[] {
  const result = Papa.parse<StudentImportRow>(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.toLowerCase().trim(),
  })
  return result.data
}

export function exportToExcel(
  data: Record<string, unknown>[],
  filename: string
): Buffer {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  return Buffer.from(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }))
}

export function generateStudentTemplate(): Buffer {
  const template = [
    { NISN: '1234567890', 'Nama Lengkap': 'Contoh Nama', Kelas: 'X', Jurusan: 'IPA' },
  ]
  return exportToExcel(template, 'template-siswa')
}
