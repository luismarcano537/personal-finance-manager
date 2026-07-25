import type { ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import BrandLogo from '../components/ui/BrandLogo'
import ThemeToggle from '../components/ui/ThemeToggle'
import { useAuth } from '../hooks/useAuth'

type AuthenticatedLayoutProps = {
  children: ReactNode
}

type NavigationItem = {
  label: string
  path: '/dashboard' | '/categories' | '/transactions'
  description: string
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Visao geral financeira',
  },
  {
    label: 'Categories',
    path: '/categories',
    description: 'Organizacao de entradas e saidas',
  },
  {
    label: 'Transactions',
    path: '/transactions',
    description: 'Movimentacoes financeiras',
  },
]

function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const currentNavigationItem =
    navigationItems.find((item: NavigationItem) => item.path === location.pathname) ??
    navigationItems[0]

  const handleLogout = (): void => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-background text-brand-text">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-brand-border bg-brand-surface px-4 py-4 shadow-sm lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <BrandLogo className="max-w-[13rem] [&_.brand-logo-tagline]:hidden sm:[&_.brand-logo-tagline]:block" showTagline />

            <button
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-brand-border-strong bg-brand-surface px-3 py-2 text-sm font-semibold text-brand-text transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-white lg:hidden"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>

          <nav
            aria-label="Main navigation"
            className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {navigationItems.map((item: NavigationItem) => (
              <NavLink
                className={({ isActive }: { isActive: boolean }) =>
                  [
                    'inline-flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-white lg:w-full',
                    isActive
                      ? 'border-brand-primary bg-brand-primary-soft text-brand-primary-dark shadow-sm'
                      : 'border-transparent text-brand-text-muted hover:bg-brand-surface-muted hover:text-brand-text-strong',
                  ].join(' ')
                }
                end
                key={item.path}
                to={item.path}
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto hidden rounded-2xl border border-brand-border bg-brand-background p-4 lg:block">
            <p className="text-xs font-semibold uppercase tracking-normal text-brand-text-muted">
              Signed in
            </p>
            <div className="mt-2 min-w-0">
              {user?.name ? (
                <p className="truncate text-sm font-semibold text-brand-text-strong">
                  {user.name}
                </p>
              ) : null}
              {user?.email ? (
                <p className="truncate text-sm text-brand-text-muted">{user.email}</p>
              ) : null}
            </div>

            <button
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-brand-border-strong bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-text transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-background"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-brand-border bg-brand-surface/95 px-4 py-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-brand-text-muted">
                  {currentNavigationItem.description}
                </p>
                <h2 className="mt-1 truncate text-xl font-bold text-brand-text-strong">
                  {currentNavigationItem.label}
                </h2>
              </div>

              <ThemeToggle showLabel={false} />

              <div className="hidden min-w-0 text-right sm:block">
                <p className="text-sm text-brand-text-muted">Signed in as</p>
                <div className="mt-1 min-w-0 max-w-56">
                  {user?.name ? (
                    <p className="truncate text-base font-semibold text-brand-text-strong">
                      {user.name}
                    </p>
                  ) : null}
                  {user?.email ? (
                    <p className="truncate text-sm text-brand-text-muted">
                      {user.email}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AuthenticatedLayout
