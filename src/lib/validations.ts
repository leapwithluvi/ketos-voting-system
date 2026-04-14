import { z } from 'zod'

// ============ Auth ============
export const LoginSchema = z.object({
  nisn: z
    .string()
    .regex(/^\d{10}$/, 'NISN harus tepat 10 digit angka'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(128, 'Password maksimal 128 karakter'),
})

export type LoginInput = z.infer<typeof LoginSchema>

// ============ User / Student ============
export const CreateUserSchema = z.object({
  nisn: z.string().regex(/^\d{10}$/, 'NISN harus 10 digit angka'),
  name: z
    .string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter')
    .trim(),
  kelas: z.enum(['X', 'XI', 'XII'], { message: 'Kelas tidak valid' }),
  jurusan: z
    .string()
    .min(2, 'Jurusan minimal 2 karakter')
    .max(50, 'Jurusan maksimal 50 karakter')
    .trim(),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

export const ResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password maksimal 128 karakter')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password harus mengandung huruf besar, huruf kecil, dan angka'
    ),
})

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

// ============ Candidate ============
export const CreateCandidateSchema = z.object({
  nomorUrut: z
    .number()
    .int()
    .min(1, 'Nomor urut minimal 1')
    .max(99, 'Nomor urut maksimal 99'),
  namaKetua: z
    .string()
    .min(2, 'Nama ketua minimal 2 karakter')
    .max(100)
    .trim(),
  namaWakil: z
    .string()
    .min(2, 'Nama wakil minimal 2 karakter')
    .max(100)
    .trim(),
  fotoKetua: z.string().min(1, 'Foto ketua wajib diisi'),
  fotoWakil: z.string().min(1, 'Foto wakil wajib diisi'),
  visi: z
    .string()
    .min(10, 'Visi minimal 10 karakter')
    .max(500, 'Visi maksimal 500 karakter'),
  misi: z
    .array(z.string().min(5).max(300))
    .min(1, 'Minimal 1 misi')
    .max(10, 'Maksimal 10 misi'),
})

export type CreateCandidateInput = z.infer<typeof CreateCandidateSchema>

export const UpdateCandidateSchema = CreateCandidateSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export type UpdateCandidateInput = z.infer<typeof UpdateCandidateSchema>

// ============ Vote ============
export const VoteSchema = z.object({
  candidateId: z.string().length(24, 'ID kandidat tidak valid'),
})

export type VoteInput = z.infer<typeof VoteSchema>

// ============ Voting Session ============
export const VotingSessionSchema = z.object({
  name: z.string().min(3).max(200).trim(),
  isOpen: z.boolean(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
})

export type VotingSessionInput = z.infer<typeof VotingSessionSchema>

// ============ Import ============
export const ImportRowSchema = z.object({
  nisn: z.string().regex(/^\d{10}$/, 'NISN harus 10 digit'),
  name: z.string().min(2).max(100).trim(),
  kelas: z.enum(['X', 'XI', 'XII']),
  jurusan: z.string().min(2).max(50).trim(),
})

export type ImportRow = z.infer<typeof ImportRowSchema>

// ============ Pagination ============
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
})

export type PaginationInput = z.infer<typeof PaginationSchema>
