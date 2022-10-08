import { Schema, model, Document } from 'mongoose'

export interface CartDocument extends Document {
  user: any
  product: any
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    product: {
      id: String,
      name: String,
      color: String,
      size: String,
      price: Number,
      mainImage: {
        url: String,
        public_id: String
      }
    },
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      default: 1
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

cartSchema.index({ user: 1 })

const Cart = model<CartDocument>('Cart', cartSchema)

export default Cart
