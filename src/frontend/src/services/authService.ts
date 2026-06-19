import { apiClient } from '../api/apiClient'
import type { LoginRequest, LoginResponse } from '../types/auth'

export function login(credentials: LoginRequest) {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}
