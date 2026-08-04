import BrandLogo from '../ui/BrandLogo'

type MobileTopbarProps = {
  onMenuClick?: () => void
  isMenuOpen?: boolean
  userName?: string
}

/**
 * Mobile top bar for the App Experience. Brand mark on the left, a menu
 * button on the right that toggles the compact navigation panel. Mobile-first
 * and overflow-safe — reads like a personal finance app, not an admin console.
 */
function MobileTopbar({ onMenuClick, isMenuOpen = false, userName }: MobileTopbarProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-brand-border bg-brand-surface px-4 py-3 lg:hidden">
      <BrandLogo compact showText />

      <button
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? 'Fechar menu' : userName ? `Menu de ${userName}` : 'Abrir menu'}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-surface text-brand-text transition hover:border-brand-primary hover:bg-brand-primary-soft hover:text-brand-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        onClick={onMenuClick}
        type="button"
      >
        {isMenuOpen ? (
          <span aria-hidden="true" className="relative block h-5 w-5">
            <span className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rotate-45 rounded-full bg-current" />
            <span className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
          </span>
        ) : (
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        )}
      </button>
    </header>
  )
}

export default MobileTopbar
