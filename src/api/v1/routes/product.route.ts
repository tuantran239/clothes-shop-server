import {
  getProductHandler,
  getProductsHandler
} from '@api-v1/controllers/product.controller'
import { Router } from 'express'

const router = Router()

router.get('/all', getProductsHandler)

router.get('/one/:id', getProductHandler)

export default router
