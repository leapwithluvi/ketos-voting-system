import type { Types } from 'mongoose'

// ============ User Types ============
export interface IUser {
  _id: Types.ObjectId
  nisn: string
  name: string
  kelas: 'X' | 'XI' | 'XII'
  jurusan: string
  role: 'admin' | 'user'
  password?: string
  hasVoted: boolean
  votedFor: Types.ObjectId | null
  votedAt: Date | null
  isActive: boolean
  failedLoginAttempts?: number
  lockedUntil?: Date | null
  passwordChangedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IUserPublic {
  _id: string
  nisn: string
  name: string
  kelas: string
  jurusan: string
  role: 'admin' | 'user'
  hasVoted: boolean
  votedFor: string | null
  isActive: boolean
  createdAt: string
}

// ============ Candidate Types ============
export interface ICandidate {
  _id: Types.ObjectId
  nomorUrut: number
  namaKetua: string
  namaWakil: string
  fotoKetua: string
  fotoWakil: string
  visi: string
  misi: string[]
  jumlahSuara: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICandidatePublic {
  _id: string
  nomorUrut: number
  namaKetua: string
  namaWakil: string
  fotoKetua: string
  fotoWakil: string
  visi: string
  misi: string[]
  jumlahSuara: number
  isActive: boolean
}

// ============ Voting Session ============
export interface IVotingSession {
  _id: Types.ObjectId
  name: string
  isOpen: boolean
  startTime: Date
  endTime: Date
  createdBy: Types.ObjectId
}

// ============ Audit Log ============
export interface IAuditLog {
  _id: Types.ObjectId
  userId?: Types.ObjectId
  action: string
  resource: string
  resourceId?: string
  ipAddress: string
  userAgent: string
  details?: Record<string, unknown>
  createdAt: Date
}

// ============ Auth Types ============
export interface SessionUser {
  id: string
  nisn: string
  name: string
  role: 'admin' | 'user'
  kelas: string
  hasVoted: boolean
}

// ============ API Response ============
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ============ Stats ============
export interface VotingStats {
  totalVoters: number
  totalVoted: number
  participationRate: number
  candidates: Array<{
    _id: string
    nomorUrut: number
    namaKetua: string
    namaWakil: string
    jumlahSuara: number
    percentage: number
  }>
  isOpen: boolean
}

// ============ Import ============
export interface StudentImportRow {
  nisn: string
  name: string
  kelas: string
  jurusan: string
}

export interface ImportResult {
  success: number
  failed: number
  errors: Array<{ row: number; nisn: string; error: string }>
}
