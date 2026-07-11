type SummaryCardProps = {
  label: string
  helper?: string
  value: string
  tone?: 'default' | 'income' | 'expense' | 'balance' | 'transactions'
}

type SummaryCardTone = NonNullable<SummaryCardProps['tone']>

type ToneStyle = {
  accent: string
  badge: string
  border: string
  label: string
  value: string
}

const toneStyles: Record<SummaryCardTone, ToneStyle> = {
  default: {
    accent: 'bg-brand-border-strong',
    badge: 'bg-brand-surface-muted text-brand-text',
    border: 'border-brand-border',
    label: 'text-brand-text-muted',
    value: 'text-brand-text-strong',
  },
  income: {
    accent: 'bg-brand-primary',
    badge: 'bg-brand-primary-soft text-brand-primary-dark',
    border: 'border-brand-border',
    label: 'text-brand-primary-dark',
    value: 'text-brand-text-strong',
  },
  expense: {
    accent: 'bg-brand-error',
    badge: 'bg-brand-error-soft text-brand-error',
    border: 'border-brand-border',
    label: 'text-brand-error',
    value: 'text-brand-text-strong',
  },
  balance: {
    accent: 'bg-brand-gold',
    badge: 'bg-brand-gold-soft text-brand-gold',
    border: 'border-brand-border',
    label: 'text-brand-gold',
    value: 'text-brand-text-strong',
  },
  transactions: {
    accent: 'bg-brand-gold',
    badge: 'bg-brand-surface-muted text-brand-text',
    border: 'border-brand-border',
    label: 'text-brand-text-muted',
    value: 'text-brand-text-strong',
  },
}

function SummaryCard({
  helper,
  label,
  value,
  tone = 'default',
}: SummaryCardProps) {
  const styles = toneStyles[tone]

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(31,41,51,0.1)] ${styles.border}`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${styles.accent}`} />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${styles.label}`}>{label}</p>
          {helper ? (
            <p className="mt-1 text-xs font-medium text-brand-text-muted">{helper}</p>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className={`mt-0.5 h-3 w-3 shrink-0 rounded-full ${styles.badge}`}
        />
      </div>

      <p
        className={`mt-5 break-words text-2xl font-bold tracking-normal sm:text-3xl ${styles.value}`}
      >
        {value}
      </p>
    </article>
  )
}

export default SummaryCard
