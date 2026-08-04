import type { ReactNode } from 'react'

type QuickActionTone = 'primary' | 'gold' | 'sky' | 'neutral'

type QuickActionCardProps = {
  title: string
  description?: string
  icon?: ReactNode
  onClick?: () => void
  tone?: QuickActionTone
}

type QuickActionToneStyle = {
  border: string
  hover: string
  iconWrap: string
}

const toneStyles: Record<QuickActionTone, QuickActionToneStyle> = {
  primary: {
    border: 'border-brand-border',
    hover: 'hover:border-brand-primary hover:bg-brand-primary-soft',
    iconWrap: 'bg-brand-primary-soft text-brand-primary-dark',
  },
  gold: {
    border: 'border-brand-border',
    hover: 'hover:border-brand-gold hover:bg-brand-gold-soft',
    iconWrap: 'bg-brand-gold-soft text-brand-gold',
  },
  sky: {
    border: 'border-brand-border',
    hover: 'hover:border-brand-sky hover:bg-brand-sky-soft',
    iconWrap: 'bg-brand-sky-soft text-brand-sky-strong',
  },
  neutral: {
    border: 'border-brand-border',
    hover: 'hover:border-brand-border-strong hover:bg-brand-surface-muted',
    iconWrap: 'bg-brand-surface-muted text-brand-text',
  },
}

/**
 * Tap target for quick actions (add transaction, new category...).
 * Rendered as a button so it stays keyboard and screen-reader friendly.
 */
function QuickActionCard({
  title,
  description,
  icon,
  onClick,
  tone = 'primary',
}: QuickActionCardProps) {
  const styles = toneStyles[tone]

  return (
    <button
      className={`flex w-full items-center gap-3 rounded-2xl border bg-brand-surface p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${styles.border} ${styles.hover}`}
      onClick={onClick}
      type="button"
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${styles.iconWrap}`}
        >
          {icon}
        </span>
      ) : null}

      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-brand-text-strong">
          {title}
        </span>
        {description ? (
          <span className="mt-0.5 block truncate text-xs font-medium text-brand-text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export default QuickActionCard
