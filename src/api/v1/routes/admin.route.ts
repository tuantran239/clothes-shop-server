import { Router } from 'express'
import {
  authenticate,
  authRole,
  validate,
  multerMultiFile
} from '../middlewares'
import { createUserSchema } from '@api-v1/validator-schema/admin.Schema'
import { loginSchema } from '@api-v1/validator-schema/user.schema'
import {
  authUserHandler,
  loginAdminHandler,
  logoutHandler
} from '@api-v1/controllers/admin/auth.admin.controller'
import { Role } from '@api-v1/types'
import {
  createUserHandler,
  getUsersHandler,
  getUserHandler,
  deleteUserHandler,
  updateUserHandler
} from '@api-v1/controllers/admin/user.admin.controller'
import {
  createProductHandler,
  getProductHandler,
  getProductsHandler
} from '@api-v1/controllers/admin/product.admin.controller'
import {
  checkOrderHandler,
  getOrderHandler,
  getOrdersHandler,
  removeOrderItemHandler,
  updateOrderHandler,
  updateOrderStateHandler
} from '@api-v1/controllers/admin/order.admin.controller'
import { updateOrderStateSchema } from '@api-v1/validator-schema/order.Schema'

const router = Router()

// Auth
router.post('/auth/login', loginSchema, validate, loginAdminHandler)
router.get(
  '/auth',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  authUserHandler
)
router.get('/auth/logout', logoutHandler)

// user
router.post(
  '/user/create-user',
  createUserSchema,
  validate,
  authenticate,
  authRole([Role.MANAGER]),
  createUserHandler
)

router.get(
  '/user/all',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  getUsersHandler
)

router.get(
  '/user/one/:id',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  getUserHandler
)

router.delete(
  '/user/delete-user/:id',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  deleteUserHandler
)

router.put(
  '/user/update-user/:id',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  updateUserHandler
)

// Product
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

// Order
router.get(
  '/order/all',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  getOrdersHandler
)

router.get(
  '/order/one/:id',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  getOrderHandler
)

router.put(
  '/order/update-order/:id',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  updateOrderHandler
)

router.put(
  '/order/update-order-state/:id',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  updateOrderStateSchema,
  validate,
  updateOrderStateHandler
)

router.post(
  '/order/check-order',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  checkOrderHandler
)

// router.post(
//   '/order/order',
//   authenticate,
//   authRole([Role.ADMIN, Role.MANAGER]),
//   orderHandler
// )

router.delete(
  '/order/remove-item',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  removeOrderItemHandler
)

export default router
