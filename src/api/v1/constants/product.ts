type ObjectType = {
  [key: string]: any
}

const LIMIT = 8

const MIN = 1
const MAX = 5000

const ORDER_STATE: ObjectType = {
  lock: 0,
  placement: 1,
  checked: 2,
  payment: 3,
  delivery: 4,
  success: 5
}

const productCons = {
  LIMIT,
  MIN,
  MAX,
  ORDER_STATE
}

export default productCons
