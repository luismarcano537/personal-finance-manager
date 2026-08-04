import type { ReactNode } from 'react'
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
// own; callers may override it. "Reports" is intentionally out of scope.
const defaultNavItems: AppNavItem[] = [
  { label: 'Dashboard', to: '/dashboard', helper: 'Visão geral' },
  { label: 'Transactions', to: '/transactions', helper: 'Movimentações' },
  { label: 'Categories', to: '/categories', helper: 'Organização' },
  { label: 'Commitments', to: '/commitments', helper: 'Compromissos' },
]

/**
 * Structural shell for the authenticated App Experience.
 *
 * Prepared for future use — it is NOT wired into any page yet. Provides the
 * desktop layout (fixed sidebar + spacious content) and the mobile layout
 * (top bar + single column), preserving the calm, premium Stewardly feel.
 */
function AppShell({
  children,
  navItems = defaultNavItems,
  userName,
  userEmail,
  onLogout,
}: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-brand-background text-brand-text">
      <MobileTopbar userName={userName} />

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
