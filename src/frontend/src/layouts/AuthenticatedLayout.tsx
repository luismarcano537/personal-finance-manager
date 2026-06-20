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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-800 bg-slate-900/80 px-6 py-5 lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <p className="text-sm font-semibold uppercase text-emerald-400">
                Finance Manager
              </p>
              <h1 className="mt-1 text-xl font-bold text-white">Dashboard</h1>
            </div>
            <nav className="lg:mt-8">
              <NavLink
                className={({ isActive }) =>
                  [
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  ].join(' ')
                }
                to="/dashboard"
              >
                Overview
              </NavLink>
            </nav>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-800 bg-slate-950/95 px-6 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-400">Signed in as</p>
                <div className="mt-1 min-w-0">
                  {user?.name ? (
                    <p className="truncate text-base font-semibold text-white">
                      {user.name}
                    </p>
                  ) : null}
                  {user?.email ? (
                    <p className="truncate text-sm text-slate-300">
                      {user.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 px-6 py-8 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default AuthenticatedLayout
