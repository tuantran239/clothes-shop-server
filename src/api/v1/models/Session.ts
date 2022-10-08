import { UserDocument } from './User'
import { Schema, model, Document } from 'mongoose'

export interface SessionDocument extends Document {
  valid: boolean
  user: UserDocument['_id']
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    valid: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

const Session = model<SessionDocument>('Session', sessionSchema)

export default Session
