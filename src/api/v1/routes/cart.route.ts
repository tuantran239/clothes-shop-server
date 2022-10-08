import { Router } from 'express'
import { authenticate } from '@api-v1/middlewares'
import {
  createCartHandler,
  getUserCartsHandler,
  getNumberOfCartHandler,
  deleteCartHandler
} from '@api-v1/controllers/cart.controller'

const router = Router()

router.post(
  '/create-cart',
  authenticate,
  createCartHandler
)

router.get(
  '/my-carts',
  authenticate,
  getUserCartsHandler
)

router.get(
  '/number-of-cart',
  authenticate,
  getNumberOfCartHandler
)

router.post(
  '/delete-cart',
  authenticate,
  deleteCartHandler
)

export default router
