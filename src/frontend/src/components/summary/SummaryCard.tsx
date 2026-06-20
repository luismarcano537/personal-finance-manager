type SummaryCardProps = {
  label: string
  value: string
  tone?: 'default' | 'income' | 'expense' | 'balance'
}

const toneClasses: Record<NonNullable<SummaryCardProps['tone']>, string> = {
  default: 'border-slate-800 bg-slate-900',
  income: 'border-emerald-900/70 bg-emerald-950/30',
  expense: 'border-red-900/70 bg-red-950/30',
  balance: 'border-sky-900/70 bg-sky-950/30',
}

function SummaryCard({ label, value, tone = 'default' }: SummaryCardProps) {
  return (
    <article className={`rounded-lg border p-5 shadow-xl ${toneClasses[tone]}`}>
      <p className="text-sm font-medium text-slate-300">{label}</p>
      <p className="mt-3 break-words text-2xl font-bold text-white">{value}</p>
    </article>
  )
}

export default SummaryCard
