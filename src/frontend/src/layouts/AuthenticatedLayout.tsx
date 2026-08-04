import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/app'
import { useAuth } from '../hooks/useAuth'

type AuthenticatedLayoutProps = {
  children: ReactNode
}

/**
 * Authenticated layout for the protected routes. Delegates the visual
 * structure to the Stewardly AppShell (desktop sidebar + mobile top bar),
 * while keeping the existing authentication and logout behaviour intact.
 */
function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = (): void => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <AppShell onLogout={handleLogout} userEmail={user?.email} userName={user?.name}>
      {children}
    </AppShell>
  )
}

export default AuthenticatedLayout
