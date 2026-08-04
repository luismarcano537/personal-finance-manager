import { NavLink } from 'react-router-dom'
import BrandLogo from '../ui/BrandLogo'

export type AppNavItem = {
  label: string
  to: string
  helper?: string
}

type AppSidebarProps = {
  navItems: AppNavItem[]
  onLogout?: () => void
  userName?: string
  userEmail?: string
}

/**
 * Desktop sidebar for the App Experience. Premium and calm — brand mark on
 * top, vertical navigation using NavLink for the active state, and a monthly
 * focus card anchored to the bottom. Not a heavy admin/CRM rail.
 */
function AppSidebar({ navItems, onLogout, userName, userEmail }: AppSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <BrandLogo className="max-w-[13rem]" showTagline />

      <nav
        aria-label="Main navigation"
        className="mt-8 flex flex-col gap-1.5"
      >
        {navItems.map((item: AppNavItem) => (
          <NavLink
            className={({ isActive }: { isActive: boolean }) =>
              [
                'group flex flex-col rounded-2xl border px-4 py-2.5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                isActive
                  ? 'border-brand-primary bg-brand-primary-soft shadow-[0_12px_30px_rgba(59,170,114,0.14)]'
                  : 'border-transparent hover:bg-brand-surface-muted',
              ].join(' ')
            }
            end
            key={item.to}
            to={item.to}
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <span
                  className={`text-sm font-bold ${
                    isActive ? 'text-brand-primary-dark' : 'text-brand-text-strong'
                  }`}
                >
                  {item.label}
                </span>
                {item.helper ? (
                  <span className="mt-0.5 text-xs font-medium text-brand-text-muted">
                    {item.helper}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-brand-border bg-gradient-to-br from-brand-primary-soft to-brand-surface p-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-primary-dark">
          Foco do mês
        </p>
        <p className="mt-2 text-sm font-medium text-brand-text">
          Acompanhe seus limites e mantenha o fôlego financeiro do mês.
        </p>

        {userName || userEmail ? (
          <div className="mt-4 min-w-0 border-t border-brand-border pt-3">
            {userName ? (
              <p className="truncate text-sm font-semibold text-brand-text-strong">
                {userName}
              </p>
            ) : null}
            {userEmail ? (
              <p className="truncate text-xs text-brand-text-muted">{userEmail}</p>
            ) : null}
          </div>
        ) : null}

        {onLogout ? (
          <button
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-brand-border-strong bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-text transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            onClick={onLogout}
            type="button"
          >
            Logout
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default AppSidebar
