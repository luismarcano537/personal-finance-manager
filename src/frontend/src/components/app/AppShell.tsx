import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'
import AppSidebar from './AppSidebar'
import type { AppNavItem } from './AppSidebar'
import MobileTopbar from './MobileTopbar'

type AppShellProps = {
  children: ReactNode
  navItems?: AppNavItem[]
  userName?: string
  userEmail?: string
  onLogout?: () => void
}

// Default navigation for the App Experience. Order follows the approved
// "Multi-screen Proposal v3" mockup. Kept here so the shell is usable on its
// own; callers may override it. "Commitments" has no route until Card 72, so
// it is prepared as a disabled/coming-soon item instead of a broken link.
// "Reports" is intentionally out of scope.
const defaultNavItems: AppNavItem[] = [
  { label: 'Dashboard', to: '/dashboard', helper: 'Visão geral' },
  { label: 'Transactions', to: '/transactions', helper: 'Movimentações' },
  { label: 'Categories', to: '/categories', helper: 'Organização' },
  {
    label: 'Commitments',
    to: '/commitments',
    helper: 'Compromissos',
    disabled: true,
    badge: 'Em breve',
  },
]

/**
 * Structural shell for the authenticated App Experience.
 *
 * Provides the desktop layout (calm fixed sidebar + spacious content) and the
 * mobile layout (compact top bar + collapsible menu + single column),
 * preserving the calm, premium Stewardly feel and the current logout /
 * theme-toggle behaviour.
 */
function AppShell({
  children,
  navItems = defaultNavItems,
  userName,
  userEmail,
  onLogout,
}: AppShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const closeMenu = (): void => setIsMenuOpen(false)

  const handleLogout = (): void => {
    closeMenu()
    onLogout?.()
  }

  return (
    <div className="app-shell-surface min-h-screen overflow-x-hidden text-brand-text">
      <MobileTopbar
        isMenuOpen={isMenuOpen}
        onMenuClick={() => setIsMenuOpen((open: boolean) => !open)}
        userName={userName}
      />

      {isMenuOpen ? (
        <div className="border-b border-brand-border bg-brand-surface px-4 py-3 lg:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5">
            {navItems.map((item: AppNavItem) =>
              item.disabled ? (
                <div
                  aria-disabled="true"
                  className="flex items-center justify-between gap-2 rounded-2xl border border-dashed border-brand-border px-4 py-3 opacity-70"
                  key={item.to}
                >
                  <span className="truncate text-sm font-bold text-brand-text-muted">
                    {item.label}
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
                      'flex items-center rounded-2xl border px-4 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
                      isActive
                        ? 'border-brand-primary bg-brand-primary-soft text-brand-primary-dark'
                        : 'border-transparent text-brand-text-strong hover:bg-brand-surface-muted',
                    ].join(' ')
                  }
                  end
                  key={item.to}
                  onClick={closeMenu}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-brand-border pt-3">
            <ThemeToggle />

            {onLogout ? (
              <button
                className="inline-flex items-center justify-center rounded-xl border border-brand-border-strong bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-text transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[1560px] flex-col lg:flex-row">
        <aside className="hidden shrink-0 border-r border-brand-border bg-brand-surface px-5 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:flex-col">
          <AppSidebar
            navItems={navItems}
            onLogout={onLogout}
            userEmail={userEmail}
            userName={userName}
          />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
