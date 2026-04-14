import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generatePassword(nisn: string): string {
  // Default: OSIS + last 4 NISN digits
  return `OSIS${nisn.slice(-4)}`
}

export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) errors.push('Minimal 8 karakter')
  if (!/[A-Z]/.test(password)) errors.push('Harus ada huruf besar')
  if (!/[a-z]/.test(password)) errors.push('Harus ada huruf kecil')
  if (!/\d/.test(password)) errors.push('Harus ada angka')

  return { valid: errors.length === 0, errors }
}
