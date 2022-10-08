import {
  createProductHandler,
  getProductHandler,
  getProductsHandler
} from '@api-v1/controllers/admin/product.admin.controller'
import { authenticate, authRole, multerMultiFile } from '@api-v1/middlewares'
import { Role } from '@api-v1/types'
import { Router } from 'express'

const router = Router()

router.post(
  '/product/create-product',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  multerMultiFile('images'),
  createProductHandler
)

router.get(
  '/product/all',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  getProductsHandler
)

router.get(
  '/product/one/:id',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  getProductHandler
)

export default router
