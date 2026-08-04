import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import CategoryFormModal from '../components/categories/CategoryFormModal'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import { PageHeader } from '../components/app'
import {
  FilterChip,
  FinancialRow,
  MetricCard,
  QuickActionCard,
  SectionCard,
  StewardlyLineChart,
  WaterMeterGroup,
  type LineChartPoint,
  type WaterMeterItem,
} from '../components/finance'
import { summaryService } from '../services/summaryService'
import { transactionService } from '../services/transactionService'
import {
  TransactionType,
  type CategorySummary,
  type CategorySummaryItem,
  type CategorySummaryParams,
  type MonthlySummary,
  type TransactionType as TransactionTypeValue,
} from '../types/summary'
import type { Transaction } from '../types/transaction'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

const dashboardLoadErrorMessage =
  'Unable to load dashboard data. Please try again.'

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value)

type MonthOption = {
  label: string
  value: number
}

type MonthlyFlow = {
  income: number
  expenses: number
}

type WaterMeterTone = 'primary' | 'gold' | 'sky'

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

const monthShortLabels: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const meterTones: WaterMeterTone[] = ['primary', 'sky', 'gold']

const yearOptions: number[] = [currentYear - 1, currentYear, currentYear + 1]

const selectClassName =
  'w-full rounded-2xl border border-brand-border bg-brand-surface px-3 py-2 text-sm font-semibold text-brand-text-strong outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-soft'

const categoryFilterOptions: { label: string; value: TransactionTypeValue | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Income', value: TransactionType.Income },
  { label: 'Expense', value: TransactionType.Expense },
]

const plusIcon: ReactNode = (
  <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.2"
    />
  </svg>
)

const tagIcon: ReactNode = (
  <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M3 7.5V4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 .7.3l11 11a1 1 0 0 1 0 1.4l-4.8 4.8a1 1 0 0 1-1.4 0l-11-11a1 1 0 0 1-.3-.7Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <circle cx="7" cy="7" fill="currentColor" r="1.4" />
  </svg>
)

const calendarIcon: ReactNode = (
  <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
    <rect
      height="16"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
      width="18"
      x="3"
      y="5"
    />
    <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  </svg>
)

// Extracts the 0-based month from an ISO transaction date without relying on
// Date() parsing (which would shift across time zones at month boundaries).
const parseMonthIndex = (isoDate: string): number => {
  const match = /^(\d{4})-(\d{2})/.exec(isoDate)
  if (match) {
    return Number(match[2]) - 1
  }
  const parsed = new Date(isoDate)
  return Number.isNaN(parsed.getTime()) ? -1 : parsed.getMonth()
}

// Aggregates a year of real transactions into 12 monthly income/expense
// buckets. Nothing is invented: months without activity stay at zero.
const buildMonthlyFlows = (transactions: Transaction[]): MonthlyFlow[] => {
  const flows: MonthlyFlow[] = Array.from({ length: 12 }, () => ({
    income: 0,
    expenses: 0,
  }))

  for (const transaction of transactions) {
    const monthIndex = parseMonthIndex(transaction.transactionDate)
    if (monthIndex < 0 || monthIndex > 11) {
      continue
    }

    if (transaction.type === TransactionType.Income) {
      flows[monthIndex].income += transaction.amount
    } else if (transaction.type === TransactionType.Expense) {
      flows[monthIndex].expenses += transaction.amount
    }
  }

  return flows
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
    TransactionTypeValue | undefined
  >(undefined)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true)
  const [transactionsError, setTransactionsError] = useState<string>('')
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
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, dashboardLoadErrorMessage))
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

      const categories = await summaryService.getCategorySummary(categoryParams)
      setCategorySummary(categories)
    } catch (caughtError) {
      setCategoryError(
        getApiErrorMessage(caughtError, dashboardLoadErrorMessage),
      )
    } finally {
      setCategoryLoading(false)
    }
  }, [selectedCategoryType, selectedMonth, selectedYear])

  const loadYearTransactions = useCallback(async (): Promise<void> => {
    setTransactionsLoading(true)
    setTransactionsError('')

    try {
      const yearTransactions = await transactionService.getTransactions({
        year: selectedYear,
      })
      setTransactions(yearTransactions)
    } catch (caughtError) {
      setTransactionsError(
        getApiErrorMessage(caughtError, dashboardLoadErrorMessage),
      )
    } finally {
      setTransactionsLoading(false)
    }
  }, [selectedYear])

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

  useEffect(() => {
    let isActive = true

    void Promise.resolve().then(() => {
      if (isActive) {
        void loadYearTransactions()
      }
    })

    return (): void => {
      isActive = false
    }
  }, [loadYearTransactions])

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
    setTransactionsLoading(true)
    setSelectedYear(Number(event.target.value))
  }

  const handleTransactionCreated = (): void => {
    void Promise.all([
      loadMonthlySummary(),
      loadCategorySummary(),
      loadYearTransactions(),
    ])
  }

  const handleCategoryCreated = (): void => {
    void loadCategorySummary()
  }

  const selectedMonthLabel =
    monthOptions.find((monthOption) => monthOption.value === selectedMonth)
      ?.label ?? 'Selected month'

  const monthlyFlows = useMemo<MonthlyFlow[]>(
    () => buildMonthlyFlows(transactions),
    [transactions],
  )

  // Chart shows the elapsed part of the year (Jan..selected month) so future
  // months are never faked as a drop to zero.
  const chartData = useMemo<LineChartPoint[]>(
    () =>
      monthlyFlows.slice(0, selectedMonth).map((flow, index) => ({
        label: monthShortLabels[index],
        income: flow.income,
        expenses: flow.expenses,
      })),
    [monthlyFlows, selectedMonth],
  )

  const hasChartData = useMemo<boolean>(
    () => chartData.some((point) => point.income > 0 || point.expenses > 0),
    [chartData],
  )

  // Water meters: each recent month shows how much of its income was kept
  // (savings). A month with no income stays an empty tank — never invented.
  const meterItems = useMemo<WaterMeterItem[]>(() => {
    const months = monthlyFlows.slice(0, selectedMonth)
    const startIndex = Math.max(0, months.length - 4)

    return months.slice(startIndex).map((flow, offset) => {
      const monthIndex = startIndex + offset
      const saved = Math.max(0, flow.income - flow.expenses)

      return {
        label: monthShortLabels[monthIndex],
        value: saved,
        max: flow.income > 0 ? flow.income : 1,
        tone: meterTones[monthIndex % meterTones.length],
      }
    })
  }, [monthlyFlows, selectedMonth])

  const recentTransactions = useMemo<Transaction[]>(
    () =>
      transactions
        .filter(
          (transaction) =>
            parseMonthIndex(transaction.transactionDate) === selectedMonth - 1,
        )
        .slice()
        .sort((first, second) =>
          second.transactionDate.localeCompare(first.transactionDate),
        )
        .slice(0, 5),
    [transactions, selectedMonth],
  )

  const topCategories = useMemo<CategorySummaryItem[]>(() => {
    const list = categorySummary?.categories ?? []
    return list
      .slice()
      .sort((first, second) => second.total - first.total)
      .slice(0, 5)
  }, [categorySummary])

  const maxCategoryTotal = topCategories.length > 0 ? topCategories[0].total : 0

  const balance = summary?.balance ?? 0
  const totalIncome = summary?.totalIncome ?? 0
  const totalExpense = summary?.totalExpense ?? 0
  const transactionsCount = summary?.transactionsCount ?? 0
  const isHealthy = balance >= 0
  const hasSummary = !loading && !error && summary !== null

  const savedPercent = totalIncome > 0 ? (balance / totalIncome) * 100 : 0
  const savedPercentLabel =
    totalIncome > 0 ? `${Math.round(savedPercent)}%` : '0%'

  const heroSituation = ((): string => {
    if (error) {
      return error
    }
    if (!hasSummary) {
      return 'Loading this month’s position...'
    }
    if (!isHealthy) {
      return 'You spent more than you earned this month. A gentle review can bring it back to calm.'
    }
    if (totalIncome <= 0) {
      return 'No income recorded yet this month. Add your movements to see the picture.'
    }
    return `You kept ${savedPercentLabel} of what came in this month.`
  })()

  const periodSelector: ReactNode = (
    <div className="grid grid-cols-2 gap-3 sm:w-72">
      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-text-muted">
          Month
        </span>
        <select
          className={selectClassName}
          onChange={handleMonthChange}
          value={selectedMonth}
        >
          {monthOptions.map((monthOption) => (
            <option key={monthOption.value} value={monthOption.value}>
              {monthOption.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-brand-text-muted">
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
  )

  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
        {/* 1. Header */}
        <PageHeader
          action={periodSelector}
          description="See the monthly trend first. Then review what needs your attention."
          eyebrow={`${selectedMonthLabel} overview`}
          title="Your money is moving with calm direction."
        />

        {/* 2. Month context */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-3 py-1 font-semibold text-brand-text-strong">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-primary" />
            {selectedMonthLabel} {selectedYear}
          </span>
          <span className="font-medium text-brand-text-muted">
            {transactionsCount}{' '}
            {transactionsCount === 1 ? 'transaction' : 'transactions'} this
            month
          </span>
        </div>

        {/* 3. Hero: balance + line chart (protagonist) */}
        <section className="dashboard-hero relative overflow-hidden rounded-[28px] border border-white/10 p-6 shadow-[0_28px_84px_rgba(0,0,0,0.30)] sm:rounded-[34px] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                Current balance
              </p>

              {loading ? (
                <div className="mt-3 h-11 w-48 animate-pulse rounded-2xl bg-white/10" />
              ) : (
                <p className="mt-2 break-words text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {error ? '—' : formatCurrency(balance)}
                </p>
              )}

              <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
                {heroSituation}
              </p>

              {hasSummary ? (
                <div className="mt-5">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                      isHealthy
                        ? 'border-emerald-300/25 bg-emerald-400/15 text-emerald-50'
                        : 'border-amber-300/30 bg-amber-400/15 text-amber-50'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${
                        isHealthy ? 'bg-emerald-300' : 'bg-amber-300'
                      }`}
                    />
                    {isHealthy
                      ? 'Calm financial health'
                      : 'Attention needed this month'}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="min-w-0 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 sm:p-5">
              {transactionsLoading ? (
                <div className="h-[180px] w-full animate-pulse rounded-2xl bg-white/10" />
              ) : transactionsError ? (
                <div className="flex h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-4 text-center">
                  <p className="text-sm font-semibold text-white/80">
                    Trend unavailable
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    {transactionsError}
                  </p>
                </div>
              ) : hasChartData ? (
                <>
                  <StewardlyLineChart
                    data={chartData}
                    height={180}
                    showLegend={false}
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-full bg-brand-primary"
                      />
                      Income
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/70">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-full bg-brand-gold"
                      />
                      Expenses
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-4 text-center">
                  <p className="text-sm font-semibold text-white/80">
                    No trend to show yet
                  </p>
                  <p className="mt-1 max-w-[240px] text-xs leading-5 text-white/55">
                    Add transactions to see your income and expenses take shape.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. Water meters */}
        <SectionCard title="Monthly savings flow">
          {transactionsLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div
                  className="h-28 animate-pulse rounded-[18px] bg-brand-surface-muted"
                  key={item}
                />
              ))}
            </div>
          ) : hasChartData ? (
            <WaterMeterGroup items={meterItems} />
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-border-strong bg-brand-surface-muted/50 p-6 text-center">
              <p className="text-sm font-semibold text-brand-text-strong">
                No monthly flow yet
              </p>
              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-brand-text-muted">
                Once you register income and expenses, each month fills up like
                calm water.
              </p>
            </div>
          )}
        </SectionCard>

        {/* 5. Income / Expenses / Saved */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            helper="Money received"
            label="Income"
            tone="income"
            value={loading || error ? '—' : formatCurrency(totalIncome)}
          />
          <MetricCard
            helper="Money spent"
            label="Expenses"
            tone="expense"
            value={loading || error ? '—' : formatCurrency(totalExpense)}
          />
          <MetricCard
            helper={isHealthy ? 'Kept from income' : 'Spending over income'}
            label="Saved"
            tone={isHealthy ? 'gold' : 'expense'}
            value={
              loading || error
                ? '—'
                : isHealthy
                  ? savedPercentLabel
                  : `${Math.round(savedPercent)}%`
            }
          />
        </div>

        {/* 6. Quick actions */}
        <SectionCard title="Quick actions">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              description="Record income or expense"
              icon={plusIcon}
              onClick={handleOpenTransactionModal}
              title="New transaction"
              tone="primary"
            />
            <QuickActionCard
              description="Organize your money"
              icon={tagIcon}
              onClick={handleOpenCategoryModal}
              title="New category"
              tone="gold"
            />
            <QuickActionCard
              description="Coming soon"
              disabled
              icon={calendarIcon}
              title="New commitment"
              tone="sky"
            />
          </div>
        </SectionCard>

        {/* 7 (mobile) / 8 (desktop) — commitments preview, category pressure,
            recent activity. Order is swapped between breakpoints to honor both
            the mobile-required order and the desktop hierarchy. */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Category pressure */}
          <div className="order-2 lg:order-1">
            <SectionCard>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold tracking-tight text-brand-text-strong">
                    Category pressure
                  </h3>
                  <p className="mt-1 text-xs font-medium text-brand-text-muted">
                    Where your money concentrates this month.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categoryFilterOptions.map((option) => (
                    <FilterChip
                      active={selectedCategoryType === option.value}
                      key={option.label}
                      onClick={() => setSelectedCategoryType(option.value)}
                    >
                      {option.label}
                    </FilterChip>
                  ))}
                </div>
              </div>

              {categoryLoading ? (
                <div className="flex flex-col gap-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      className="h-16 animate-pulse rounded-2xl bg-brand-surface-muted"
                      key={item}
                    />
                  ))}
                </div>
              ) : categoryError ? (
                <div className="rounded-2xl border border-brand-border bg-brand-error-soft p-5">
                  <p className="text-sm font-semibold text-brand-error">
                    Category summary unavailable
                  </p>
                  <p className="mt-1 text-sm text-brand-error">
                    {categoryError}
                  </p>
                </div>
              ) : topCategories.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {topCategories.map((category) => {
                    const pressure =
                      maxCategoryTotal > 0
                        ? Math.round((category.total / maxCategoryTotal) * 100)
                        : 0

                    return (
                      <FinancialRow
                        amount={formatCurrency(category.total)}
                        iconLabel={category.categoryName.slice(0, 2)}
                        key={category.categoryId}
                        subtitle={`${category.transactionsCount} ${
                          category.transactionsCount === 1
                            ? 'transaction'
                            : 'transactions'
                        }`}
                        title={category.categoryName}
                        tone="neutral"
                      >
                        <div
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-surface-muted"
                        >
                          <div
                            className="h-full rounded-full bg-brand-primary transition-[width] duration-500"
                            style={{ width: `${pressure}%` }}
                          />
                        </div>
                      </FinancialRow>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-brand-border-strong bg-brand-surface-muted/50 p-6 text-center">
                  <p className="text-sm font-semibold text-brand-text-strong">
                    No category movement yet
                  </p>
                  <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-brand-text-muted">
                    Add your first transaction to see where your money goes.
                  </p>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Upcoming commitments preview (planned feature) */}
          <div className="order-1 lg:order-2">
            <SectionCard title="Upcoming commitments">
              <div className="rounded-2xl border border-dashed border-brand-border-strong bg-brand-surface-muted/50 p-6 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-sky/40 bg-brand-sky-soft px-3 py-1 text-xs font-bold text-brand-sky-strong">
                  Planned feature
                </span>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-brand-text-muted">
                  Commitments are being prepared. Soon you will be able to plan
                  bills, due dates and recurring responsibilities.
                </p>
              </div>
            </SectionCard>
          </div>

          {/* Recent activity (real transactions from the selected month) */}
          <div className="order-3 lg:order-3">
            <SectionCard title="Recent activity">
              {transactionsLoading ? (
                <div className="flex flex-col gap-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      className="h-16 animate-pulse rounded-2xl bg-brand-surface-muted"
                      key={item}
                    />
                  ))}
                </div>
              ) : transactionsError ? (
                <div className="rounded-2xl border border-brand-border bg-brand-error-soft p-5">
                  <p className="text-sm font-semibold text-brand-error">
                    Recent activity unavailable
                  </p>
                  <p className="mt-1 text-sm text-brand-error">
                    {transactionsError}
                  </p>
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {recentTransactions.map((transaction) => {
                    const isIncome = transaction.type === TransactionType.Income

                    return (
                      <FinancialRow
                        amount={`${isIncome ? '+' : '-'}${formatCurrency(
                          transaction.amount,
                        )}`}
                        iconLabel={isIncome ? 'In' : 'Ex'}
                        key={transaction.id}
                        subtitle={`${
                          transaction.categoryName ?? 'Uncategorized'
                        } · ${transaction.transactionDate.slice(0, 10)}`}
                        title={transaction.description}
                        tone={isIncome ? 'income' : 'expense'}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-brand-border-strong bg-brand-surface-muted/50 p-6 text-center">
                  <p className="text-sm font-semibold text-brand-text-strong">
                    No activity this month
                  </p>
                  <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-brand-text-muted">
                    New transactions for {selectedMonthLabel} will appear here.
                  </p>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>

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
