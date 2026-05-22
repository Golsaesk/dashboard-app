export interface User {
  id: string
  fullName: string
  email: string
  isEmailVerified: boolean
  isTwoFactorEnabled: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}
