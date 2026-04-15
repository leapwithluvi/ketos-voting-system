// ============ User Types ============
export interface IUser {
  id: string
  nisn: string
  name: string
  kelas: 'X' | 'XI' | 'XII'
  jurusan: string
  role: 'admin' | 'user'
  password?: string
  hasVoted: boolean
  votedFor?: string | null
  votedForId?: string | null
  votedAt: Date | null
  isActive: boolean
  failedLoginAttempts?: number
  lockedUntil?: Date | null
  passwordChangedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IUserPublic {
  id: string
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
  id: string
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
  id: string
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
  id: string
  name: string
  isOpen: boolean
  startTime: Date
  endTime: Date
  createdBy: string
}

// ============ Audit Log ============
export interface IAuditLog {
  id: string
  userId?: string
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
    id: string
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
