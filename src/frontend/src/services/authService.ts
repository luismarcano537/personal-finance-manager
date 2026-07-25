import { apiClient } from '../api/apiClient'
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth'

export function login(credentials: LoginRequest): Promise<AuthResponse> {
  return apiClient
    .post<AuthResponse>('/auth/login', credentials)
    .then((response) => response.data)
}

export function getCurrentUser(): Promise<AuthUser> {
  return apiClient.get<AuthUser>('/auth/me').then((response) => response.data)
}

export function register(
  account: RegisterRequest,
): Promise<RegisterResponse> {
  return apiClient
    .post<RegisterResponse>('/auth/register', account)
    .then((response) => response.data)
}

export const authService = {
  login,
  getCurrentUser,
  register,
}
