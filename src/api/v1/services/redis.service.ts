import {
  FuncHandleHGet,
  FuncHandleHSet
} from '@api-v1/utils/functions/functionRedis'
import { RedisKeys } from '@api-v1/utils/keys'

const { productKey } = RedisKeys

export const hSetProduct = async (productId: string, field: any) =>
  FuncHandleHSet(productKey(productId), field)

export const hGetProduct = async (productId: string) =>
  FuncHandleHGet(productKey(productId))
