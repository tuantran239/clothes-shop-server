import { Request, Response } from 'express'
import {
  BadRequestResponse,
  CommonErrorResponse,
  generateError
} from '@api-v1/error/http-error'
import { HttpResponse } from '@api-v1/utils'
import { FilterOrders } from '@api-v1/utils/filter'
import {
  checkProductInStock,
  getAllOrder,
  getOrderExist,
  removeOrderItem,
  updateOrder
} from '@api-v1/services/order.service'
import { productCons } from '@api-v1/constants'
import { OrderState } from '@api-v1/types/product.type'

export const getOrdersHandler = async (req: Request, res: Response) => {
  const { filter, options } = FilterOrders(req.query)
  const { data: orders, error } = await getAllOrder(
    filter,
    'shippingInfo OrderID createdAt state',
    options
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, {
    success: true,
    orders
  })
}

export const getOrderHandler = async (req: Request, res: Response) => {
  const { data: order, error } = await getOrderExist(false, {
    _id: req.params.id
  })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, {
    success: true,
    order
  })
}

export const updateOrderHandler = async (req: Request, res: Response) => {
  const { error } = await updateOrder(
    {
      _id: req.params.id
    },
    {
      $set: req.body
    }
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, {
    success: true
  })
}

export const updateOrderStateHandler = async (req: Request, res: Response) => {
  const { state, newState } = req.body

  if (newState === OrderState.LOCK) {
    const { error } = await updateOrder(
      {
        _id: req.params.id
      },
      {
        $set: { state: OrderState.LOCK }
      }
    )
    if (error) {
      return CommonErrorResponse(res, error)
    }

    return HttpResponse(res, 200, {
      success: true
    })
  }

  const indexState = productCons.ORDER_STATE[state] || 0
  const indexNewState = productCons.ORDER_STATE[newState] || 0

  if (indexNewState <= indexState) {
    return BadRequestResponse(
      res,
      generateError(`You cant update from ${state} to ${newState}`, 'order')
    )
  }

  const { error } = await updateOrder(
    {
      _id: req.params.id
    },
    {
      $set: { state: newState }
    }
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, {
    success: true
  })
}

export const checkOrderHandler = async (req: Request, res: Response) => {
  const { orderItems } = req.body
  const items = req.body.orderItems || []
  const result = []
  for (let i = 0; i < items.length; i++) {
    const { data, error } = await checkProductInStock(orderItems[i])
    if (error) {
      return CommonErrorResponse(res, error)
    }
    result.push(data)
  }
  return HttpResponse(res, 200, {
    success: true,
    orderItems: result
  })
}

export const removeOrderItemHandler = async (req: Request, res: Response) => {
  const { error } = await removeOrderItem(req.query)
  if (error) {
    return CommonErrorResponse(res, error)
  }
  return HttpResponse(res, 200, {
    success: true
  })
}
