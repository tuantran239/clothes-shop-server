import Cart, { CartDocument } from '@api-v1/models/Cart'
import { FilterQuery, ProjectionType, QueryOptions } from 'mongoose'
import {
  createDoc,
  deleteDoc,
  deleteDocs,
  getAllDocs,
  getDoc,
  getNumberOfDocs
} from './db.service'

export const createCart = (body: Partial<CartDocument>) =>
  createDoc('Error create Cart', Cart, body)

export const getCart = (
  filter?: FilterQuery<CartDocument>,
  projection?: ProjectionType<CartDocument>,
  options?: QueryOptions<CartDocument>
) => getDoc('Error get Cart', Cart, filter, projection, options)

export const getNumberOfCart = (filter: FilterQuery<CartDocument>) =>
  getNumberOfDocs('Error get number Cart', Cart, filter)

export const getAllCart = (
  filter: FilterQuery<CartDocument>,
  projection?: ProjectionType<CartDocument>,
  options?: QueryOptions<CartDocument>
) => getAllDocs('Error get all cart', Cart, filter, projection, options)

export const deleteCart = (
  filter: FilterQuery<CartDocument>,
  options?: QueryOptions<CartDocument>
) => deleteDoc('Error delete cart', Cart, filter, options)

export const deleteManyCart = (
  filter?: FilterQuery<CartDocument>,
  options?: QueryOptions<CartDocument>
) => deleteDocs('Error delete Carts', Cart, filter, options)
