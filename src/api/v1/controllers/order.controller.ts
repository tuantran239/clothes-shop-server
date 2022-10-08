import {
  BadRequestResponse,
  CommonErrorResponse,
  generateError
} from '@api-v1/error/http-error'
import {
  createOrder,
  deleteOrder,
  getAllOrder,
  getOrderExist,
  updateAmountProduct,
  updateOrder
} from '@api-v1/services/order.service'
import { OrderState } from '@api-v1/types/product.type'
import { HttpResponse, logger } from '@api-v1/utils'
import { deleteWorker } from '@api-v1/worker/delete-worker'
import { stripeConf } from '@config'
import { Request, Response } from 'express'
import Stripe from 'stripe'
import uniqid from 'uniqid'

export const createPaymentIntentHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const stripe = new Stripe(stripeConf.secretKey || '', {
      apiVersion: '2022-08-01'
    })
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      payment_method_types: ['card']
    })
    return HttpResponse(res, 200, {
      success: true,
      paymentIntent: {
        client_secret: paymentIntent.client_secret,
        id: paymentIntent.id
      }
    })
  } catch (error) {
    logger.error({ error }, 'Error create payment intent')
    return HttpResponse(res, 500, error)
  }
}

export const createOrderHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  const { shippingInfo, total, orderItems } = req.body
  const { error } = await createOrder({
    shippingInfo,
    total,
    orderItems,
    user: user.id,
    OrderID: `order_${uniqid()}`
  })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  await deleteWorker({ filter: { user: user.id }, doc: 'cart' })

  return HttpResponse(res, 200, { success: true })
}

export const getMyOrdersHandler = async (req: Request, res: Response) => {
  const user = res.locals.user

  const { data: orders, error } = await getAllOrder(
    {
      user: user.id
    },
    '',
    {
      sort: { createdAt: -1 }
    }
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, { success: true, orders })
}

export const cancelMyOrderHandler = async (req: Request, res: Response) => {
  if (
    !req.query.state ||
    req.query.state === OrderState.LOCK ||
    req.query.state !== OrderState.PLACEMENT
  ) {
    return BadRequestResponse(
      res,
      generateError(
        `Your order ${req.query.state}, you cant cancel order`,
        'order'
      )
    )
  }

  const { error } = await deleteOrder({
    OrderID: req.query.OrderID
  })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, { success: true })
}

export const paymentHandler = async (req: Request, res: Response) => {
  const { paymentInfo, orderItems, id } = req.body

  const { data: product, error: errorExist } = await getOrderExist(false, {
    _id: id
  })

  if (errorExist) {
    return CommonErrorResponse(res, errorExist)
  }

  if (
    product?.state === OrderState.LOCK ||
    product?.state !== OrderState.CHECKED
  ) {
    return BadRequestResponse(
      res,
      generateError(`Your order ${product?.state}`, 'order')
    )
  }

  const items = req.body.orderItems || []
  for (let i = 0; i < items.length; i++) {
    const { error } = await updateAmountProduct(orderItems[i])
    if (error) {
      await updateOrder(
        {
          _id: id
        },
        {
          $set: {
            state: OrderState.LOCK
          }
        }
      )
      return CommonErrorResponse(res, error)
    }
  }

  await updateOrder(
    {
      _id: id
    },
    {
      $set: {
        state: OrderState.PAYMENT,
        paymentInfo
      }
    }
  )

  return HttpResponse(res, 200, {
    success: true,
    state: OrderState.PAYMENT
  })
}
