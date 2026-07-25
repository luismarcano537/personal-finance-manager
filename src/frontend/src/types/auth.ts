export type AuthUser = {
  id: string
  name: string
  email: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
}

export type RegisterResponse = AuthUser & {
  createdAt: string
}

export type AuthResponse = {
  accessToken: string
  expiresAt: string
  user: AuthUser
}

export type LoginResponse = AuthResponse
