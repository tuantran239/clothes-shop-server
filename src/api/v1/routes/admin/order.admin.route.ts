import {
  checkOrderHandler,
  getOrderHandler,
  getOrdersHandler,
  removeOrderItemHandler,
  updateOrderHandler,
  updateOrderStateHandler
} from '@api-v1/controllers/admin/order.admin.controller'
import {
  authenticate,
  authRole,
  validate
} from '@api-v1/middlewares'
import { Role } from '@api-v1/types'
import { updateOrderStateSchema } from '@api-v1/validator-schema/order.Schema'
import { Router } from 'express'

const router = Router()

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
