import { checkSchema } from 'express-validator'
import { minLength, required, valid } from '@api-v1/error/validator-error-message'

export const createUserSchema = checkSchema({
  name: {
    notEmpty: {
      errorMessage: required('name')
    }
  },
  email: {
    notEmpty: {
      errorMessage: required('email')
    },
    isEmail: {
      errorMessage: valid('email')
    }
  },
  password: {
    notEmpty: {
      errorMessage: required('password')
    },
    isLength: {
      errorMessage: minLength('password', 6),
      options: { min: 6 }
    }
  },
  role: {
    notEmpty: {
      errorMessage: required('role')
    }
  }
})
