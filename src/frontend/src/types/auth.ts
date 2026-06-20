export type AuthUser = {
  id: string
  name: string
  email: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  accessToken: string
  expiresAt: string
  user: AuthUser
}

export type LoginResponse = AuthResponse
