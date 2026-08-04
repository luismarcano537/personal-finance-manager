import type { ReactNode } from 'react'

type MetricTone = 'neutral' | 'income' | 'expense' | 'gold' | 'sky'

type MetricCardProps = {
  label: string
  value: string
  helper?: string
  tone?: MetricTone
  icon?: ReactNode
}

type MetricToneStyle = {
  value: string
  iconWrap: string
}

const toneStyles: Record<MetricTone, MetricToneStyle> = {
  neutral: {
    value: 'text-brand-text-strong',
    iconWrap: 'bg-brand-surface-muted text-brand-text',
  },
  income: {
    value: 'text-brand-primary-dark',
    iconWrap: 'bg-brand-primary-soft text-brand-primary-dark',
  },
  expense: {
    value: 'text-brand-error',
    iconWrap: 'bg-brand-error-soft text-brand-error',
  },
  gold: {
    value: 'text-brand-gold',
    iconWrap: 'bg-brand-gold-soft text-brand-gold',
  },
  sky: {
    value: 'text-brand-sky-strong',
    iconWrap: 'bg-brand-sky-soft text-brand-sky-strong',
  },
}

/**
 * Compact card for headline figures (Income, Expenses, Saved...).
 * The tone tints the value and the optional icon holder only, keeping
 * the surface calm and consistent with the rest of the experience.
 */
function MetricCard({
  label,
  value,
  helper,
  tone = 'neutral',
  icon,
}: MetricCardProps) {
  const styles = toneStyles[tone]

  return (
    <article className="rounded-3xl border border-brand-border bg-brand-surface p-5 shadow-[0_18px_50px_rgba(16,24,40,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-brand-text-muted">{label}</p>
        {icon ? (
          <span
            aria-hidden="true"
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${styles.iconWrap}`}
          >
            {icon}
          </span>
        ) : null}
      </div>

      <p
        className={`mt-4 break-words text-2xl font-bold tracking-tight sm:text-3xl ${styles.value}`}
      >
        {value}
      </p>

      {helper ? (
        <p className="mt-1 text-xs font-medium text-brand-text-muted">{helper}</p>
      ) : null}
    </article>
  )
}

export default MetricCard
