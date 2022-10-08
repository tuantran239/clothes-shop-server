import { Schema, model, Document } from 'mongoose'

export interface ProductDocument extends Document {
  name: string
  gender: string
  description: string
  price: number
  categories: string[]
  mainImage: {
    url: string
    public_id: string
  }
  images: [
    {
      url: string
      public_id: string
    }
  ]
  colors: string[]
  sizes: string[]
  productType: [
    {
      color: string
      size: string
      amount: number
    }
  ]
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      text: true
    },
    gender: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      deafult: 0
    },
    categories: {
      type: [String],
      default: []
    },
    mainImage: {
      url: String,
      public_id: String
    },
    images: [
      {
        url: String,
        public_id: String
      }
    ],
    colors: {
      type: [String],
      default: []
    },
    sizes: {
      type: [String],
      default: []
    },
    productType: [
      {
        color: {
          type: String,
          default: 'BLACK'
        },
        size: {
          type: String,
          default: 'S'
        },
        amount: {
          type: Number,
          default: 0
        }
      }
    ]
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

productSchema.index({ _id: 1, categories: 1, colors: 1, sizes: 1 })

const Product = model<ProductDocument>('Product', productSchema)

export default Product
