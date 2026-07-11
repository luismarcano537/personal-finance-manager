import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from 'react'
import CategoryFormModal from '../components/categories/CategoryFormModal'
import CategorySummaryList from '../components/summary/CategorySummaryList'
import SummaryCard from '../components/summary/SummaryCard'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
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

type MonthOption = {
  label: string
  value: number
}

const currentDate = new Date()
const currentMonth = currentDate.getMonth() + 1
const currentYear = currentDate.getFullYear()

const monthOptions: MonthOption[] = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]

const yearOptions: number[] = [currentYear - 1, currentYear, currentYear + 1]

const selectClassName =
  'mt-2 w-full rounded-2xl border border-brand-border-strong bg-white px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-soft disabled:cursor-not-allowed disabled:bg-brand-surface-muted disabled:text-brand-text-muted'

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
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] =
    useState<boolean>(false)
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)

  const loadMonthlySummary = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError('')

    try {
      const monthlySummary = await summaryService.getMonthlySummary({
        month: selectedMonth,
        year: selectedYear,
      })
      setSummary(monthlySummary)
    } catch {
      setError('Could not load the monthly summary. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, selectedYear])

  const loadCategorySummary = useCallback(async (): Promise<void> => {
    setCategoryLoading(true)
    setCategoryError('')

    try {
      const categoryParams: CategorySummaryParams = {
        month: selectedMonth,
        year: selectedYear,
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
  }, [selectedCategoryType, selectedMonth, selectedYear])

  useEffect(() => {
    let isActive = true

    void Promise.resolve().then(() => {
      if (isActive) {
        void loadMonthlySummary()
      }
    })

    return (): void => {
      isActive = false
    }
  }, [loadMonthlySummary])

  useEffect(() => {
    let isActive = true

    void Promise.resolve().then(() => {
      if (isActive) {
        void loadCategorySummary()
      }
    })

    return (): void => {
      isActive = false
    }
  }, [loadCategorySummary])

  const handleOpenTransactionModal = (): void => {
    setIsTransactionModalOpen(true)
  }

  const handleCloseTransactionModal = (): void => {
    setIsTransactionModalOpen(false)
  }

  const handleOpenCategoryModal = (): void => {
    setIsCategoryModalOpen(true)
  }

  const handleCloseCategoryModal = (): void => {
    setIsCategoryModalOpen(false)
  }

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLoading(true)
    setCategoryLoading(true)
    setSelectedMonth(Number(event.target.value))
  }

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLoading(true)
    setCategoryLoading(true)
    setSelectedYear(Number(event.target.value))
  }

  const handleTransactionCreated = (): void => {
    void Promise.all([loadMonthlySummary(), loadCategorySummary()])
  }

  const handleCategoryCreated = (): void => {
    void loadCategorySummary()
  }

  const selectedMonthLabel =
    monthOptions.find((monthOption) => monthOption.value === selectedMonth)
      ?.label ?? 'Selected month'

  return (
    <>
      <section className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_24px_70px_rgba(31,41,51,0.08)]">
          <div className="border-b border-brand-border bg-brand-primary-soft px-5 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-normal text-brand-primary-dark">
                  Monthly summary
                </p>
                <h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">
                  Dashboard
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-text sm:text-base">
                  Track income, expenses, balance, and transaction volume with a
                  clean view for the current month.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-72">
                <div className="rounded-2xl border border-brand-border bg-white px-5 py-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-normal text-brand-text-muted">
                    Current period
                  </p>
                  <p className="mt-1 text-xl font-bold text-brand-text-strong">
                    {selectedMonthLabel} {selectedYear}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-brand-text">
                        Month
                      </span>
                      <select
                        className={selectClassName}
                        onChange={handleMonthChange}
                        value={selectedMonth}
                      >
                        {monthOptions.map((monthOption) => (
                          <option
                            key={monthOption.value}
                            value={monthOption.value}
                          >
                            {monthOption.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-brand-text">
                        Year
                      </span>
                      <select
                        className={selectClassName}
                        onChange={handleYearChange}
                        value={selectedYear}
                      >
                        {yearOptions.map((yearOption) => (
                          <option key={yearOption} value={yearOption}>
                            {yearOption}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <button
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,170,114,0.22)] transition hover:bg-brand-primary-dark"
                    onClick={handleOpenTransactionModal}
                    type="button"
                  >
                    New Transaction
                  </button>
                  <button
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-brand-gold/45 bg-white px-5 py-3 text-sm font-semibold text-[#8A642E] shadow-sm transition hover:border-brand-gold hover:bg-brand-gold-soft hover:text-brand-text-strong"
                    onClick={handleOpenCategoryModal}
                    type="button"
                  >
                    New Category
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8 lg:px-10">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div
                    className="rounded-3xl border border-brand-border bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.07)]"
                    key={item}
                  >
                    <div className="h-3 w-24 animate-pulse rounded-full bg-brand-border" />
                    <div className="mt-5 h-8 w-32 animate-pulse rounded-full bg-brand-surface-muted" />
                  </div>
                ))}
              </div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-3xl border border-brand-border bg-brand-error-soft p-6 shadow-sm">
                <p className="text-sm font-semibold text-brand-error">
                  Monthly summary unavailable
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-error">
                  {error}
                </p>
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

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        onSuccess={handleTransactionCreated}
      />

      {isCategoryModalOpen ? (
        <CategoryFormModal
          isOpen={isCategoryModalOpen}
          onClose={handleCloseCategoryModal}
          onSuccess={handleCategoryCreated}
        />
      ) : null}
    </>
  )
}

export default Dashboard
