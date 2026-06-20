import { useEffect, useState } from 'react'
import CategorySummaryList from '../components/summary/CategorySummaryList'
import SummaryCard from '../components/summary/SummaryCard'
import { summaryService } from '../services/summaryService'
import type {
  CategorySummaryParams,
  CategorySummary,
  MonthlySummary,
  TransactionType,
} from '../types/summary'

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value)

const getCurrentPeriod = (): { month: number; monthName: string; year: number } => {
  const currentDate = new Date()
  const month = currentDate.getMonth() + 1
  const year = currentDate.getFullYear()
  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(currentDate)

  return { month, monthName, year }
}

function Dashboard() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [categorySummary, setCategorySummary] =
    useState<CategorySummary | null>(null)
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true)
  const [categoryError, setCategoryError] = useState<string>('')
  const [selectedCategoryType, setSelectedCategoryType] = useState<
    TransactionType | undefined
  >(undefined)
  const { month, monthName, year } = getCurrentPeriod()

  useEffect(() => {
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
  }, [month, year])

  useEffect(() => {
    async function loadCategorySummary(): Promise<void> {
      setCategoryLoading(true)
      setCategoryError('')

      try {
        const categoryParams: CategorySummaryParams = {
          month,
          year,
        }

        if (selectedCategoryType !== undefined) {
          categoryParams.type = selectedCategoryType
        }

        const categories = await summaryService.getCategorySummary(
          categoryParams,
        )
        setCategorySummary(categories)
      } catch {
        setCategoryError(
          'Could not load the category summary. Please try again later.',
        )
      } finally {
        setCategoryLoading(false)
      }
    }

    void loadCategorySummary()
  }, [month, selectedCategoryType, year])

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_24px_70px_rgba(31,41,51,0.08)]">
        <div className="border-b border-[#E5E7EB] bg-[#EAF7F0] px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
                Monthly summary
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#1F2933] sm:text-4xl">
                Dashboard
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#374151] sm:text-base">
                Track income, expenses, balance, and transaction volume with a
                clean view for the current month.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-sm sm:w-auto sm:min-w-60">
              <p className="text-xs font-semibold uppercase tracking-normal text-[#6B7280]">
                Current period
              </p>
              <p className="mt-1 text-xl font-bold text-[#1F2933]">
                {monthName} {year}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div
                  className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.07)]"
                  key={item}
                >
                  <div className="h-3 w-24 animate-pulse rounded-full bg-[#E5E7EB]" />
                  <div className="mt-5 h-8 w-32 animate-pulse rounded-full bg-[#F1F5F2]" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-3xl border border-[#E5E7EB] bg-[#FEF2F2] p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#DC2626]">
                Monthly summary unavailable
              </p>
              <p className="mt-2 text-sm leading-6 text-[#DC2626]">{error}</p>
            </div>
          ) : null}

          {!loading && !error && summary ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                helper="Money received"
                label="Total Income"
                tone="income"
                value={formatCurrency(summary.totalIncome)}
              />
              <SummaryCard
                helper="Money spent"
                label="Total Expense"
                tone="expense"
                value={formatCurrency(summary.totalExpense)}
              />
              <SummaryCard
                helper="Net position"
                label="Balance"
                tone="balance"
                value={formatCurrency(summary.balance)}
              />
              <SummaryCard
                helper="Registered activity"
                label="Transactions"
                tone="transactions"
                value={summary.transactionsCount.toString()}
              />
            </div>
          ) : null}
        </div>
      </div>

      <CategorySummaryList
        categories={categorySummary?.categories ?? []}
        error={categoryError}
        isLoading={categoryLoading}
        onTypeChange={setSelectedCategoryType}
        selectedType={selectedCategoryType}
      />
    </section>
  )
}

export default Dashboard
