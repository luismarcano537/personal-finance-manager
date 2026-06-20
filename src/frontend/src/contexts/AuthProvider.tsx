import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AUTH_TOKEN_STORAGE_KEY } from '../api/apiClient'
import { authService } from '../services/authService'
import type { AuthUser, LoginRequest } from '../types/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
  )
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials)

    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.accessToken)
    setToken(response.accessToken)
    setUser(response.user)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadAuthenticatedUser() {
      const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false)
        }

        return
      }

      try {
        const currentUser = await authService.getCurrentUser()

        if (isMounted) {
          setToken(storedToken)
          setUser(currentUser)
        }
      } catch {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)

        if (isMounted) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAuthenticatedUser()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    window.addEventListener('unauthorized', logout)

    return () => {
      window.removeEventListener('unauthorized', logout)
    }
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [isLoading, login, logout, token, user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
