import { Request, Response } from 'express'
import {
  CommonErrorResponse,
  NotFoundResponse
} from '@api-v1/error/http-error'
import { HttpResponse } from '@api-v1/utils'
import { cloudinaryCons } from '@api-v1/constants'
import { uploadMultiFileWorker } from '@api-v1/worker/upload-worker'
import {
  createProduct,
  getAllProduct,
  getProduct
} from '@api-v1/services/product.service'
import { FilterProductsAdmin } from '@api-v1/utils/filter'

export const createProductHandler = async (req: Request, res: Response) => {
  const files = req.files
  const {
    name,
    gender,
    description,
    price,
    categories,
    productType,
    colors,
    sizes
  } = req.body
  const { data: product, error } = await createProduct({
    name,
    description,
    gender,
    price,
    categories,
    productType: JSON.parse(productType),
    colors: JSON.parse(colors),
    sizes: JSON.parse(sizes)
  })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  await uploadMultiFileWorker({
    name: 'product',
    productId: product?.id,
    folder: cloudinaryCons.folder('product', product?.name),
    files,
    resize: { width: 560, height: 560 }
  })

  return HttpResponse(res, 200, { success: true })
}


export const getProductsHandler = async (req: Request, res: Response) => {
  const { filter, options } = FilterProductsAdmin(req.query)
  const { data: products, error } = await getAllProduct(
    filter,
    'name price mainImage sizes colors productType createdAt',
    options
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, {
    success: true,
    products
  })
}


export const getProductHandler = async (req: Request, res: Response) => {
  const { data: product, error } = await getProduct(
    { _id: req.params.id },
    'name price description mainImage productType images sizes colors'
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }
  if (!product) {
    return NotFoundResponse(res, [
      { message: 'Product not found', field: 'product' }
    ])
  }

  return HttpResponse(res, 200, {
    success: true,
    product
  })
}
