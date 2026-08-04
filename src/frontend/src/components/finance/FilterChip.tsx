import type { ReactNode } from 'react'

type FilterChipProps = {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

/**
 * Rounded pill used for filters (All / Income / Expense, weeks, periods...).
 * Active state uses the primary brand color; both states read well in light
 * and dark mode through brand tokens.
 */
function FilterChip({
  children,
  active = false,
  onClick,
  type = 'button',
  className = '',
}: FilterChipProps) {
  const stateClassName = active
    ? 'border-brand-primary bg-brand-primary text-white shadow-[0_10px_24px_rgba(59,170,114,0.24)]'
    : 'border-brand-border bg-brand-surface text-brand-text-muted hover:border-brand-primary hover:text-brand-primary-dark'

  return (
    <button
      aria-pressed={active}
      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${stateClassName} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default FilterChip
