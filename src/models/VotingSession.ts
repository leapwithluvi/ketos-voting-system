import mongoose, { Schema, type Document, type Model } from 'mongoose'
import type { IVotingSession } from '@/types'

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
  { timestamps: true }
)

const VotingSession: Model<IVotingSessionDocument> =
  mongoose.models.VotingSession ??
  mongoose.model<IVotingSessionDocument>('VotingSession', VotingSessionSchema)

export default VotingSession
