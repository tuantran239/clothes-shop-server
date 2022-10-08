import { Request, Response } from 'express'
import {
  createUser,
  deleteAvatar,
  deleteUser,
  getAllUser,
  getUserExist,
  updateUser
} from '@api-v1/services/user.service'
import {
  BadRequestResponse,
  CommonErrorResponse,
  InternalServerErrorResponse,
  generateError
} from '@api-v1/error/http-error'
import { generateAvatarUrl, HttpResponse } from '@api-v1/utils'
import { uploadFile } from '@api-v1/services/upload.service'
import { cloudinaryCons } from '@api-v1/constants'
import { AuthType } from '@api-v1/types'
import { FilterUsers } from '@api-v1/utils/filter'
import { deleteWorker } from '@api-v1/worker/delete-worker'

export const createUserHandler = async (req: Request, res: Response) => {
  const { error: errorExist } = await getUserExist(
    true,
    { email: req.body.email, authType: AuthType.EMAIL },
    'email'
  )
  if (errorExist) {
    return CommonErrorResponse(res, errorExist)
  }

  const { error } = await createUser({
    ...req.body,
    active: true,
    avatar: {
      public_id: null,
      url: generateAvatarUrl(req.body.name)
    }
  })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, { success: true })
}

export const uploadAvatarHandler = async (req: Request, res: Response) => {
  const file = req.file
  const user = res.locals.user

  const { error: errorDel } = await deleteAvatar(user?.avatar.public_id)
  if (errorDel) {
    return InternalServerErrorResponse(res, errorDel.error)
  }

  const { error, data: result } = await uploadFile(
    cloudinaryCons.folder('avatar', user?.id),
    file,
    { width: 320, height: 320 }
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  await updateUser(
    { _id: user?.id },
    {
      avatar: result || { public_id: null, url: generateAvatarUrl(user?.name) }
    }
  )

  return HttpResponse(res, 200, { success: true })
}

export const updatePasswordHandler = async (req: Request, res: Response) => {
  const { password, newPassword } = req.body
  const user = res.locals.user

  const { error: errorExist, data: u } = await getUserExist(false, {
    _id: user?.id
  })
  if (errorExist) {
    return CommonErrorResponse(res, errorExist)
  }

  const isMatch = await u?.comparePassword(password)
  if (!isMatch) {
    return BadRequestResponse(
      res,
      generateError('Password not match', 'password')
    )
  }

  u!!.password = newPassword
  await u!!.save()

  return HttpResponse(res, 200, { success: true })
}

export const getUsersHandler = async (req: Request, res: Response) => {
  const { options, filter } = FilterUsers(req.query)

  const { error, data: users } = await getAllUser(filter, '-password', options)
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, { success: true, users: users || [] })
}

export const getUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  const { error, data: user } = await getUserExist(
    false,
    { _id: id },
    '-password'
  )
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, { success: true, user })
}

export const deleteUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  const { error } = await deleteUser({ _id: id })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  await deleteWorker({
    doc: 'cart',
    filter: { user: id }
  })

  return HttpResponse(res, 200, { success: true })
}

export const updateUserHandler = async (req: Request, res: Response) => {
  const { id } = req.params

  const { error } = await updateUser({ _id: id }, { $set: { ...req.body } })
  if (error) {
    return CommonErrorResponse(res, error)
  }

  return HttpResponse(res, 200, { success: true })
}
