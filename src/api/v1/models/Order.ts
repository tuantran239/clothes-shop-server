import { OrderState } from '@api-v1/types/product.type'
import { Schema, model, Document } from 'mongoose'

export interface OrderDocument extends Document {
  OrderID: string
  user: any
  shippingInfo: {
    email: string
    fullname: string
    phone: number
    address: string
  }
  orderItems: [
    {
      id: string
      name: string
      quantity: number
      mainImage: {
        url: String
        public_id: String
      }
      price: number
      color: string
      size: string
    }
  ]
  paymentInfo: {}
  total: number
  state: OrderState
}

const orderSchema = new Schema(
  {
    OrderID: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    shippingInfo: {
      email: {
        type: String,
        required: true
      },
      fullname: {
        type: String,
        required: true
      },
      phone: {
        type: Number,
        required: true
      },
      address: {
        type: String,
        required: true
      }
    },
    orderItems: [
      {
        id: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        color: {
          type: String,
          required: true
        },
        size: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        mainImage: {
          url: String,
          public_id: String
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    paymentInfo: {},
    total: {
      type: Number,
      required: true
    },
    state: {
      type: String,
      default: OrderState.PLACEMENT
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

orderSchema.index({ user: 1 })

const Order = model<OrderDocument>('Order', orderSchema)

export default Order
