import mongoose, { Schema, type Document, type Model } from 'mongoose'
import type { IAuditLog, IVotingSession } from '@/types'

// ==================== AuditLog ====================
export interface IAuditLogDocument extends Omit<IAuditLog, '_id'>, Document {}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: String,
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: '',
    },
    details: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

AuditLogSchema.index({ createdAt: -1 })
AuditLogSchema.index({ userId: 1 })

export const AuditLog: Model<IAuditLogDocument> =
  mongoose.models.AuditLog ??
  mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema)

// ==================== VotingSession ====================
export interface IVotingSessionDocument
  extends Omit<IVotingSession, '_id'>,
    Document {}

const VotingSessionSchema = new Schema<IVotingSessionDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    startTime: Date,
    endTime: Date,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const VotingSession: Model<IVotingSessionDocument> =
  mongoose.models.VotingSession ??
  mongoose.model<IVotingSessionDocument>('VotingSession', VotingSessionSchema)
