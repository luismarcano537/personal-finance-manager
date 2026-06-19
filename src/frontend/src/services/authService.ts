import { apiClient } from '../api/apiClient'
import type { LoginRequest, LoginResponse } from '../types/auth'

export function login(credentials: LoginRequest) {
  return apiClient
    .post<LoginResponse>('/auth/login', credentials)
    .then((response) => response.data)
}
