import { useEffect, useState } from 'react'
import SummaryCard from '../components/summary/SummaryCard'
import { summaryService } from '../services/summaryService'
import type { MonthlySummary } from '../types/summary'

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value)

function Dashboard() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const currentDate = new Date()
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()

    async function loadMonthlySummary(): Promise<void> {
      setLoading(true)
      setError('')

      try {
        const monthlySummary = await summaryService.getMonthlySummary({
          month,
          year,
        })
        setSummary(monthlySummary)
      } catch {
        setError('Could not load the monthly summary. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    void loadMonthlySummary()
  }, [])

  return (
    <section className="max-w-6xl">
      <div>
        <p className="text-sm font-semibold uppercase text-emerald-400">
          Monthly summary
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
          Track this month's income, expenses, balance, and transaction volume.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300 shadow-xl">
          Loading monthly summary...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mt-8 rounded-lg border border-red-900/70 bg-red-950/30 p-6 text-sm text-red-200 shadow-xl">
          {error}
        </div>
      ) : null}

      {!loading && !error && summary ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total Income"
            tone="income"
            value={formatCurrency(summary.totalIncome)}
          />
          <SummaryCard
            label="Total Expense"
            tone="expense"
            value={formatCurrency(summary.totalExpense)}
          />
          <SummaryCard
            label="Balance"
            tone="balance"
            value={formatCurrency(summary.balance)}
          />
          <SummaryCard
            label="Transactions Count"
            value={summary.transactionsCount.toString()}
          />
        </div>
      ) : null}
    </section>
  )
}

export default Dashboard
