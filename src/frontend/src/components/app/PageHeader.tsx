import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  children?: ReactNode
}

/**
 * Reusable header for authenticated pages. Large, human title with tight
 * letter spacing and a calm description, plus an optional action slot for a
 * period selector or a primary button.
 */
function PageHeader({
  eyebrow,
  title,
  description,
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-primary-dark">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-brand-text-strong sm:text-3xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-2 max-w-2xl text-sm font-medium text-brand-text-muted">
            {description}
          </p>
        ) : null}

        {children}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export default PageHeader
