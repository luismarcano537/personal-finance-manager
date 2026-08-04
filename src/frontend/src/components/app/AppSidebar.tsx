import { NavLink } from 'react-router-dom'
import BrandLogo from '../ui/BrandLogo'
import ThemeToggle from '../ui/ThemeToggle'

export type AppNavItem = {
  label: string
  to: string
  helper?: string
  /** Item prepared for a future card (e.g. /commitments). Rendered as a calm,
   *  non-interactive placeholder instead of a link to a missing route. */
  disabled?: boolean
  /** Short pill shown on a disabled item, e.g. "Em breve". */
  badge?: string
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

      <nav aria-label="Main navigation" className="mt-8 flex flex-col gap-1.5">
        {navItems.map((item: AppNavItem) =>
          item.disabled ? (
            <div
              aria-disabled="true"
              className="flex items-center justify-between gap-2 rounded-2xl border border-dashed border-brand-border px-4 py-2.5 opacity-70"
              key={item.to}
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-bold text-brand-text-muted">
                  {item.label}
                </span>
                {item.helper ? (
                  <span className="mt-0.5 truncate text-xs font-medium text-brand-text-muted">
                    {item.helper}
                  </span>
                ) : null}
              </span>
              {item.badge ? (
                <span className="shrink-0 rounded-full bg-brand-surface-muted px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-brand-text-muted">
                  {item.badge}
                </span>
              ) : null}
            </div>
          ) : (
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
          ),
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="rounded-3xl border border-brand-border bg-gradient-to-br from-brand-primary-soft to-brand-surface p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-primary-dark">
            Monthly focus
          </p>
          <p className="mt-2 text-sm font-medium text-brand-text">
            Keep your financial flow visible before it becomes stress.
          </p>
        </div>

        {userName || userEmail ? (
          <div className="min-w-0 px-1">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {onLogout ? (
            <button
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-brand-border-strong bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-text transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              onClick={onLogout}
              type="button"
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default AppSidebar
