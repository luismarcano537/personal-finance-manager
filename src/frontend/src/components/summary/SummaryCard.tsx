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
    accent: 'bg-[#D1D5DB]',
    badge: 'bg-[#F1F5F2] text-[#374151]',
    border: 'border-[#E5E7EB]',
    label: 'text-[#6B7280]',
    value: 'text-[#1F2933]',
  },
  income: {
    accent: 'bg-[#3BAA72]',
    badge: 'bg-[#EAF7F0] text-[#2F855A]',
    border: 'border-[#E5E7EB]',
    label: 'text-[#2F855A]',
    value: 'text-[#1F2933]',
  },
  expense: {
    accent: 'bg-[#DC2626]',
    badge: 'bg-[#FEF2F2] text-[#DC2626]',
    border: 'border-[#E5E7EB]',
    label: 'text-[#DC2626]',
    value: 'text-[#1F2933]',
  },
  balance: {
    accent: 'bg-[#CF9F57]',
    badge: 'bg-[#FBF4E8] text-[#CF9F57]',
    border: 'border-[#E5E7EB]',
    label: 'text-[#CF9F57]',
    value: 'text-[#1F2933]',
  },
  transactions: {
    accent: 'bg-[#CF9F57]',
    badge: 'bg-[#F1F5F2] text-[#374151]',
    border: 'border-[#E5E7EB]',
    label: 'text-[#6B7280]',
    value: 'text-[#1F2933]',
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
            <p className="mt-1 text-xs font-medium text-[#6B7280]">{helper}</p>
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
