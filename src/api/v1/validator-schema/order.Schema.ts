import { checkSchema } from 'express-validator'
import { required, valid } from '@api-v1/error/validator-error-message'

export const createOrderSchema = checkSchema({
  'shippingInfo.email': {
    notEmpty: {
      errorMessage: required('email')
    }
  },
  'shippingInfo.fullname': {
    notEmpty: {
      errorMessage: required('fullname')
    }
  },
  'shippingInfo.phone': {
    notEmpty: {
      errorMessage: required('phone')
    },
    isMobilePhone: {
      errorMessage: valid('phone', 'Phone not valid')
    }
  },
  'shippingInfo.address': {
    notEmpty: {
      errorMessage: required('address')
    }
  },
  orderItems: {
    notEmpty: {
      errorMessage: required('items', 'items empty')
    }
  },
  total: {
    notEmpty: {
      errorMessage: required('total')
    },
    isNumeric: {
      errorMessage: valid('total', 'total must be a number')
    }
  }
})

export const updateOrderStateSchema = checkSchema({
  state: {
    notEmpty: {
      errorMessage: required('state')
    }
  },
  newState: {
    notEmpty: {
      errorMessage: required('new state')
    }
  }
})
