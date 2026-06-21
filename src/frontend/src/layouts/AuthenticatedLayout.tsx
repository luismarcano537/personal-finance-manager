import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type AuthenticatedLayoutProps = {
  children: ReactNode
}

function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#374151]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-[#E5E7EB] bg-white px-6 py-5 shadow-sm lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
                Finance Manager
              </p>
              <h1 className="mt-1 text-xl font-bold text-[#1F2933]">
                Dashboard
              </h1>
            </div>
            <nav className="flex items-center gap-2 lg:mt-8 lg:flex-col lg:items-stretch">
              <NavLink
                className={({ isActive }) =>
                  [
                    'inline-flex rounded-2xl px-4 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-[#EAF7F0] text-[#2F855A]'
                      : 'text-[#6B7280] hover:bg-[#F1F5F2] hover:text-[#1F2933]',
                  ].join(' ')
                }
                to="/dashboard"
              >
                Overview
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  [
                    'inline-flex rounded-2xl px-4 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-[#EAF7F0] text-[#2F855A]'
                      : 'text-[#6B7280] hover:bg-[#F1F5F2] hover:text-[#1F2933]',
                  ].join(' ')
                }
                to="/categories"
              >
                Categories
              </NavLink>
            </nav>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#E5E7EB] bg-white/95 px-6 py-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-[#6B7280]">Signed in as</p>
                <div className="mt-1 min-w-0">
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

              <button
                className="inline-flex w-full items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#3BAA72] hover:bg-[#EAF7F0] hover:text-[#2F855A] focus:outline-none focus:ring-2 focus:ring-[#3BAA72] focus:ring-offset-2 focus:ring-offset-white sm:w-auto"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
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
