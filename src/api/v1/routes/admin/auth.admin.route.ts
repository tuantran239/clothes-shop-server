import {
  authUserHandler,
  loginAdminHandler,
  logoutHandler
} from '@api-v1/controllers/admin/auth.admin.controller'
import { authenticate, authRole, validate } from '@api-v1/middlewares'
import { Role } from '@api-v1/types'
import { loginSchema } from '@api-v1/validator-schema/user.schema'
import { Router } from 'express'

const router = Router()

router.post('/auth/login', loginSchema, validate, loginAdminHandler)
router.get(
  '/auth',
  authenticate,
  authRole([Role.ADMIN, Role.MANAGER]),
  authUserHandler
)
router.get('/auth/logout', logoutHandler)

export default router
