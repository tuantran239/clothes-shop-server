import { serverConf } from '@config'

const commonRoute = `/api/${serverConf.version}`

const routes = {
  auth: `${commonRoute}/auth`,
  authSocial: '/api',
  user: `${commonRoute}/user`,
  product: `${commonRoute}/product`,
  cart: `${commonRoute}/cart`,
  order: `${commonRoute}/order`,
  admin: `${commonRoute}/admin`
}

const serverCons = {
  routes,
  commonRoute
}

export default serverCons
