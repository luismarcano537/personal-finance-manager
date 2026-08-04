import type { ReactNode } from 'react'

type FinancialRowTone = 'income' | 'expense' | 'neutral' | 'gold' | 'sky'

type FinancialRowProps = {
  title: string
  subtitle?: string
  amount?: string
  tone?: FinancialRowTone
  iconLabel?: string
  children?: ReactNode
  action?: ReactNode
}

type FinancialRowToneStyle = {
  amount: string
  iconWrap: string
}

const toneStyles: Record<FinancialRowTone, FinancialRowToneStyle> = {
  income: {
    amount: 'text-brand-primary-dark',
    iconWrap: 'bg-brand-primary-soft text-brand-primary-dark',
  },
  expense: {
    amount: 'text-brand-error',
    iconWrap: 'bg-brand-error-soft text-brand-error',
  },
  neutral: {
    amount: 'text-brand-text-strong',
    iconWrap: 'bg-brand-surface-muted text-brand-text',
  },
  gold: {
    amount: 'text-brand-gold',
    iconWrap: 'bg-brand-gold-soft text-brand-gold',
  },
  sky: {
    amount: 'text-brand-sky-strong',
    iconWrap: 'bg-brand-sky-soft text-brand-sky-strong',
  },
}

/**
 * Warm list item for transactions, categories and commitments. It reads as a
 * soft card row, never a cold table cell, and works on mobile and desktop.
 * Income/expense amounts are tinted with the matching tone.
 */
function FinancialRow({
  title,
  subtitle,
  amount,
  tone = 'neutral',
  iconLabel,
  children,
  action,
}: FinancialRowProps) {
  const styles = toneStyles[tone]

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-surface p-3 transition hover:border-brand-border-strong sm:p-4">
      {iconLabel ? (
        <span
          aria-hidden="true"
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold uppercase ${styles.iconWrap}`}
        >
          {iconLabel}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-brand-text-strong">{title}</p>
        {subtitle ? (
          <p className="truncate text-xs font-medium text-brand-text-muted">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>

      {amount ? (
        <span className={`shrink-0 text-sm font-bold tracking-tight ${styles.amount}`}>
          {amount}
        </span>
      ) : null}

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export default FinancialRow
