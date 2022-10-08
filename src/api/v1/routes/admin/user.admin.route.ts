import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  updateUserHandler
} from '@api-v1/controllers/admin/user.admin.controller'
import { authenticate, authRole, validate } from '@api-v1/middlewares'
import { Role } from '@api-v1/types'
import { createUserSchema } from '@api-v1/validator-schema/admin.Schema'
import { Router } from 'express'

const router = Router()

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

export default router
