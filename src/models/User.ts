import mongoose, { Schema, type Document, type Model } from 'mongoose'
import type { IUser } from '@/types'

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    nisn: {
      type: String,
      unique: true,
      required: [true, 'NISN wajib diisi'],
      match: [/^\d{10}$/, 'NISN harus 10 digit angka'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
      maxlength: [100, 'Nama maksimal 100 karakter'],
    },
    kelas: {
      type: String,
      required: [true, 'Kelas wajib diisi'],
      enum: {
        values: ['X', 'XI', 'XII'],
        message: 'Kelas harus X, XI, atau XII',
      },
    },
    jurusan: {
      type: String,
      required: [true, 'Jurusan wajib diisi'],
      trim: true,
      maxlength: [50, 'Jurusan maksimal 50 karakter'],
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    hasVoted: {
      type: Boolean,
      default: false,
    },
    votedFor: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      default: null,
    },
    votedAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password
        delete ret.failedLoginAttempts
        delete ret.lockedUntil
        return ret
      },
    },
  }
)

// Indexes
UserSchema.index({ kelas: 1, jurusan: 1 })
UserSchema.index({ hasVoted: 1 })
UserSchema.index({ role: 1 })

const User: Model<IUserDocument> =
  mongoose.models.User ?? mongoose.model<IUserDocument>('User', UserSchema)

export default User
