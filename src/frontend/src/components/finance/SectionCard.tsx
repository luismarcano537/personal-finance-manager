import type { ReactNode } from 'react'

type SectionCardProps = {
  title?: string
  actionLabel?: string
  onAction?: () => void
  children: ReactNode
  className?: string
}

/**
 * Premium rounded container used across the App Experience.
 * Provides subtle border, soft depth and a themed surface for both
 * light and dark mode through brand tokens.
 */
function SectionCard({
  title,
  actionLabel,
  onAction,
  children,
  className = '',
}: SectionCardProps) {
  const hasHeader = Boolean(title) || Boolean(actionLabel)

  return (
    <section
      className={`rounded-3xl border border-brand-border bg-brand-surface p-5 shadow-[0_20px_60px_rgba(16,24,40,0.06)] sm:p-6 ${className}`}
    >
      {hasHeader ? (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h3 className="text-base font-bold tracking-tight text-brand-text-strong">
              {title}
            </h3>
          ) : (
            <span />
          )}

          {actionLabel ? (
            <button
              className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold text-brand-primary-dark transition hover:bg-brand-primary-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              onClick={onAction}
              type="button"
            >
              {actionLabel}
            </button>
          ) : null}
        </header>
      ) : null}

      {children}
    </section>
  )
}

export default SectionCard
