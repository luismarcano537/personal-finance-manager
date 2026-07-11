import type { ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAF7] text-[#374151]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-4 shadow-sm lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-normal text-[#2F855A]">
                Prosperity Finance
              </p>
              <h1 className="mt-1 truncate text-lg font-bold text-[#1F2933] sm:text-xl">
                Finance Manager
              </h1>
            </div>

            <button
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#D1D5DB] bg-[#FFFFFF] px-3 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#3BAA72] hover:bg-[#EAF7F0] hover:text-[#2F855A] focus:outline-none focus:ring-2 focus:ring-[#3BAA72] focus:ring-offset-2 focus:ring-offset-white lg:hidden"
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
                    'inline-flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#3BAA72] focus:ring-offset-2 focus:ring-offset-white lg:w-full',
                    isActive
                      ? 'border-[#3BAA72] bg-[#EAF7F0] text-[#2F855A] shadow-sm'
                      : 'border-transparent text-[#6B7280] hover:bg-[#F1F5F2] hover:text-[#1F2933]',
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

          <div className="mt-auto hidden rounded-2xl border border-[#E5E7EB] bg-[#F8FAF7] p-4 lg:block">
            <p className="text-xs font-semibold uppercase tracking-normal text-[#6B7280]">
              Signed in
            </p>
            <div className="mt-2 min-w-0">
              {user?.name ? (
                <p className="truncate text-sm font-semibold text-[#1F2933]">
                  {user.name}
                </p>
              ) : null}
              {user?.email ? (
                <p className="truncate text-sm text-[#6B7280]">{user.email}</p>
              ) : null}
            </div>

            <button
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#D1D5DB] bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#3BAA72] hover:bg-[#EAF7F0] hover:text-[#2F855A] focus:outline-none focus:ring-2 focus:ring-[#3BAA72] focus:ring-offset-2 focus:ring-offset-[#F8FAF7]"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#E5E7EB] bg-[#FFFFFF]/95 px-4 py-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#6B7280]">
                  {currentNavigationItem.description}
                </p>
                <h2 className="mt-1 truncate text-xl font-bold text-[#1F2933]">
                  {currentNavigationItem.label}
                </h2>
              </div>

              <div className="hidden min-w-0 text-right sm:block">
                <p className="text-sm text-[#6B7280]">Signed in as</p>
                <div className="mt-1 min-w-0 max-w-56">
                  {user?.name ? (
                    <p className="truncate text-base font-semibold text-[#1F2933]">
                      {user.name}
                    </p>
                  ) : null}
                  {user?.email ? (
                    <p className="truncate text-sm text-[#6B7280]">
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
