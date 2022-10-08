import { Router } from 'express'
import { authenticate, validate } from '@api-v1/middlewares'
import {
  cancelMyOrderHandler,
  createOrderHandler,
  createPaymentIntentHandler,
  getMyOrdersHandler,
  paymentHandler
} from '@api-v1/controllers/order.controller'
import { createOrderSchema } from '@api-v1/validator-schema/order.Schema'

const router = Router()

router.post('/create-payment-intent', authenticate, createPaymentIntentHandler)

router.post(
  '/create-order',
  authenticate,
  createOrderSchema,
  validate,
  createOrderHandler
)


router.post(
  '/payment',
  authenticate,
  paymentHandler
)

router.get('/my-orders', authenticate, getMyOrdersHandler)

router.delete('/cancel-my-order', authenticate, cancelMyOrderHandler)

export default router
