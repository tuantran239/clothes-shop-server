import { Router } from 'express'
import { serverCons } from '@api-v1/constants'

import authRoutes from './auth.route'
import authSocialRoutes from './authsocial.route'
import userRoutes from './user.route'
import productRoutes from './product.route'
import cartRoutes from './cart.route'
import orderRoutes from './order.route'
import adminRoutes from './admin'

const routes = Router()

routes.use(serverCons.routes.auth, authRoutes)

routes.use(serverCons.routes.authSocial, authSocialRoutes)

routes.use(serverCons.routes.user, userRoutes)

routes.use(serverCons.routes.product, productRoutes)

routes.use(serverCons.routes.cart, cartRoutes)

routes.use(serverCons.routes.order, orderRoutes)

routes.use(serverCons.routes.admin, adminRoutes)

export default routes
