import { Request, Response } from 'express'
import { authEmailPassword } from '@api-v1/services/auth.service'
import { createSession, deleteSession } from '@api-v1/services/session.service'
import { Role } from '@api-v1/types/user.type'
import {
  CommonErrorResponse,
  ForbiddenResponse,
  InternalServerErrorResponse
} from '@api-v1/error/http-error'
import { HttpResponse, signJWT } from '@api-v1/utils'
import { cookieCons, jwtCons } from '@api-v1/constants'

export const loginAdminHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const { data: user, error } = await authEmailPassword(email, password)
  if (error) {
    return CommonErrorResponse(res, error)
  }

  if (user?.role !== Role.ADMIN && user?.role !== Role.MANAGER) {
    return ForbiddenResponse(res, [
      { message: 'User not allow', field: 'auth' }
    ])
  }

  await deleteSession({ user: user?.id })
  const { data: session, error: errorSession } = await createSession({
    user: user?.id
  })
  if (errorSession) {
    return InternalServerErrorResponse(res, errorSession.error)
  }

  res.clearCookie('access')
  res.clearCookie('refresh')

  const objJwt = { userId: user?.id, sessionId: session?.id }
  const accessToken = signJWT(objJwt, { expiresIn: jwtCons.timeAccessToken })
  const refreshToken = signJWT(objJwt, { expiresIn: jwtCons.timeRefeshToken })
  res.cookie('access', accessToken, {
    maxAge: cookieCons.timeCookieAccessToken,
    httpOnly: true
  })
  res.cookie('refresh', refreshToken, {
    maxAge: cookieCons.timeCookieRefeshToken,
    httpOnly: true
  })

  return HttpResponse(res, 200, { success: true })
}

export const authUserHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  return HttpResponse(res, 200, { user })
}

export const logoutHandler = async (req: Request, res: Response) => {
  const user = res.locals.user
  res.clearCookie('access')
  res.clearCookie('refresh')
  await deleteSession({ user: user?.id })
  return HttpResponse(res, 200, { success: true })
}
