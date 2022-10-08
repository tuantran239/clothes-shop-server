export const authKey = (userId: string) => `auth#${userId}`
export const productKey = (productId: string) => `product#${productId}`

const redisKeys = {
    authKey,
    productKey
}

export default redisKeys
