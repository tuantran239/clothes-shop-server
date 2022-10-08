import { CommonErrorResponse } from '@api-v1/error/http-error'
import {
  createCart,
  getNumberOfCart,
  getAllCart,
  deleteCart
} from '@api-v1/services/cart.service'
import { HttpResponse } from '@api-v1/utils'
import { Request, Response } from 'express'

export const createCartHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  const { error } = await createCart({
    ...req.body,
    user: user?.id
  })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, { success: true })
}

export const getUserCartsHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  const { error, data: carts } = await getAllCart({ user: user?.id }, '', {
    sort: { createdAt: -1 }
  })
  if (error) {
    return CommonErrorResponse(res, error)
  }
  return HttpResponse(res, 200, { success: true, carts: carts || [] })
}

export const getNumberOfCartHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  const { data, error } = await getNumberOfCart({ user: user.id })
  if (error) {
    return CommonErrorResponse(res, error)
  }
  return HttpResponse(res, 200, { success: true, numberOfCart: data })
}

export const deleteCartHandler = async (req: Request, res: Response) => {
  const { error } = await deleteCart({ _id: req.body.id })
  if (error) {
    return CommonErrorResponse(res, error)
  }
  return HttpResponse(res, 200, { success: true })
}
