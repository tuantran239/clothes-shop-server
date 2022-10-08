import { productCons } from '@api-v1/constants'
import {
  getAllProduct,
  getNumberOfProduct,
  getProduct
} from '@api-v1/services/product.service'
import { hGetProduct, hSetProduct } from '@api-v1/services/redis.service'
import { HttpResponse } from '@api-v1/utils'
import { FilterProducts } from '@api-v1/utils/filter'
import { Request, Response } from 'express'

export const getProductsHandler = async (req: Request, res: Response) => {
  const { filter, options } = FilterProducts(req.query)

  const data = await Promise.all([
    getAllProduct(
      filter,
      'name price mainImage sizes colors productType',
      options
    ),
    getNumberOfProduct(filter)
  ])

  let pages = 0
  const numOfProds = data[1].data
  if (numOfProds) {
    pages = Math.ceil(numOfProds / productCons.LIMIT)
  }

  return HttpResponse(res, 200, {
    success: true,
    products: data[0].data || [],
    pages,
    results: numOfProds || 0
  })
}

export const getProductHandler = async (req: Request, res: Response) => {
  const id = req.params.id

  const productCache = await hGetProduct(id)
  if (productCache) {
    return HttpResponse(res, 200, {
      success: true,
      product: productCache || {}
    })
  }

  const { data: product } = await getProduct(
    { _id: req.params.id },
    'name price description mainImage productType images sizes colors'
  )
  await hSetProduct(id, product || {})

  return HttpResponse(res, 200, {
    success: true,
    product: product || {}
  })
}
