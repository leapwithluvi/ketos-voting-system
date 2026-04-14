import mongoose, { Schema, type Document, type Model } from 'mongoose'
import type { ICandidate } from '@/types'

export interface ICandidateDocument extends Omit<ICandidate, '_id'>, Document {}

const CandidateSchema = new Schema<ICandidateDocument>(
  {
    nomorUrut: {
      type: Number,
      unique: true,
      required: [true, 'Nomor urut wajib diisi'],
    },
    namaKetua: {
      type: String,
      required: [true, 'Nama ketua wajib diisi'],
      trim: true,
      maxlength: [100, 'Nama maksimal 100 karakter'],
    },
    namaWakil: {
      type: String,
      required: [true, 'Nama wakil ketua wajib diisi'],
      trim: true,
      maxlength: [100, 'Nama maksimal 100 karakter'],
    },
    fotoKetua: {
      type: String,
      required: [true, 'Foto ketua wajib diisi'],
    },
    fotoWakil: {
      type: String,
      required: [true, 'Foto wakil wajib diisi'],
    },
    visi: {
      type: String,
      required: [true, 'Visi wajib diisi'],
      maxlength: [500, 'Visi maksimal 500 karakter'],
    },
    misi: [
      {
        type: String,
        maxlength: [300, 'Setiap misi maksimal 300 karakter'],
      },
    ],
    jumlahSuara: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

CandidateSchema.index({ nomorUrut: 1 })
CandidateSchema.index({ isActive: 1 })

const Candidate: Model<ICandidateDocument> =
  mongoose.models.Candidate ??
  mongoose.model<ICandidateDocument>('Candidate', CandidateSchema)

export default Candidate
