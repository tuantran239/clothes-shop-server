import { Router } from 'express'
import userAdminRoutes from './user.admin.route'
import authAdminRoutes from './auth.admin.route'
import productAdminRoutes from './product.admin.route'
import orderAdminRoutes from './order.admin.route'

const router = Router()

router.use(userAdminRoutes)
router.use(authAdminRoutes)
router.use(productAdminRoutes)
router.use(orderAdminRoutes)

export default router
