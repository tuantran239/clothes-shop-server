import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery
} from 'mongoose'
import Product, { ProductDocument } from '@api-v1/models/Product'
import {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  getNumberOfDocs
} from './db.service'

export const createProduct = (body: Partial<ProductDocument>) =>
  createDoc('Error create product', Product, body)


export const getProduct = (
  filter?: FilterQuery<ProductDocument>,
  projection?: ProjectionType<ProductDocument>,
  options?: QueryOptions<ProductDocument>
) => getDoc('Error get product', Product, filter, projection, options)

export const getNumberOfProduct = (filter: FilterQuery<ProductDocument>) =>
  getNumberOfDocs('Error get number product', Product, filter)

export const getAllProduct = (
  filter: FilterQuery<ProductDocument>,
  projection?: ProjectionType<ProductDocument>,
  options?: QueryOptions<ProductDocument>
) => getAllDocs('Error get all product', Product, filter, projection, options)


export const updateProduct = (
  filter: FilterQuery<ProductDocument>,
  update?: UpdateQuery<ProductDocument>,
  options?: QueryOptions<ProductDocument>
) => updateDoc('Error update user', Product, filter, update, options)
