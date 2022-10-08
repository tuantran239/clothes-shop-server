import { throwValidationError } from '@api-v1/error/mongodb-error'
import { OrderDocument } from '@api-v1/models/Order'
import Product from '@api-v1/models/Product'
import { FuncHandleService } from '@api-v1/utils/functions'
import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery
} from 'mongoose'
import Order from '../models/Order'
import {
  createDoc,
  deleteDoc,
  docExist,
  getAllDocs,
  getDoc,
  getNumberOfDocs,
  updateDoc
} from './db.service'

export const createOrder = (body: Partial<OrderDocument>) =>
  createDoc('Error create Order', Order, body)

export const getOrder = (
  filter?: FilterQuery<OrderDocument>,
  projection?: ProjectionType<OrderDocument>,
  options?: QueryOptions<OrderDocument>
) => getDoc('Error get Order', Order, filter, projection, options)

export const getOrderExist = (
  exist: boolean,
  filter?: FilterQuery<OrderDocument>,
  projection?: ProjectionType<OrderDocument>,
  options?: QueryOptions<OrderDocument>
) =>
  docExist(
    'Error get order exist',
    Order,
    'Order',
    exist,
    filter,
    projection,
    options
  )

export const getNumberOfOrder = (filter: FilterQuery<OrderDocument>) =>
  getNumberOfDocs('Error get number Order', Order, filter)

export const getAllOrder = (
  filter: FilterQuery<OrderDocument>,
  projection?: ProjectionType<OrderDocument>,
  options?: QueryOptions<OrderDocument>
) => getAllDocs('Error get all Order', Order, filter, projection, options)

export const deleteOrder = (
  filter: FilterQuery<OrderDocument>,
  options?: QueryOptions<OrderDocument>
) => deleteDoc('Error delete Order', Order, filter, options)

export const updateOrder = (
  filter: FilterQuery<OrderDocument>,
  update?: UpdateQuery<OrderDocument>,
  options?: QueryOptions<OrderDocument>
) => updateDoc('Error update order', Order, filter, update, options)

export const checkProductInStock = (orderItem: any) =>
  FuncHandleService('Error check product in stock', async () => {
    const { id, color, size, quantity } = orderItem
    const product = await Product.findOne({ _id: id }, 'productType')
    if (product) {
      const pt = product.productType?.find(
        (pt) => pt.color === color && pt.size === size
      )
      if (pt && pt.amount - +quantity > 0) {
        return { ...orderItem, amount: pt.amount, inStock: true }
      }
      return { ...orderItem, amount: pt?.amount || 0, inStock: false }
    }
    return { ...orderItem, amount: 0, inStock: false }
  })

export const removeOrderItem = ({ OrderID, id, totalItem }: any) =>
  FuncHandleService('Error remove order item', async () => {
    await Order.findOneAndUpdate(
      { OrderID },
      {
        $inc: {
          total: -totalItem
        },
        $pull: {
          orderItems: { id }
        }
      },
      {
        upsert: true
      }
    )
    return true
  })

export const updateAmountProduct = async (orderItem: any) =>
  FuncHandleService('Error order product', async () => {
    const { id, color, size, quantity, name } = orderItem

    const product = await Product.findOne({ _id: id })
    if (product) {
      const pt = product.productType?.find(
        (pt) => pt.color === color && pt.size === size
      )
      if (pt && pt.amount - +quantity > 0) {
        await Product.findOneAndUpdate(
          {
            _id: id,
            'productType.color': color,
            'productType.size': size
          },
          {
            $inc: {
              'productType.$.amount': -quantity
            }
          }
        )
      } else {
        throwValidationError(
          'Product',
          `${name}, Size: ${size}, Color:${color} out of stock`,
          true
        )
      }
    }

    return true
  })
