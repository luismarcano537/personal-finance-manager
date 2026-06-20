import {
  TransactionType,
  type CategorySummaryItem,
  type TransactionType as TransactionTypeValue,
} from '../../types/summary'

type CategorySummaryListProps = {
  categories: CategorySummaryItem[]
  isLoading: boolean
  error: string
  selectedType: TransactionTypeValue | undefined
  onTypeChange: (type: TransactionTypeValue | undefined) => void
}

type FilterOption = {
  label: string
  value: TransactionTypeValue | undefined
}

const filterOptions: FilterOption[] = [
  { label: 'All', value: undefined },
  { label: 'Income', value: TransactionType.Income },
  { label: 'Expense', value: TransactionType.Expense },
]

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value)

const getFilterButtonClasses = (isSelected: boolean): string =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#3BAA72] focus:ring-offset-2 focus:ring-offset-white',
    isSelected
      ? 'bg-[#3BAA72] text-white shadow-sm'
      : 'text-[#374151] hover:bg-[#EAF7F0] hover:text-[#2F855A]',
  ].join(' ')

function CategorySummaryList({
  categories,
  isLoading,
  error,
  selectedType,
  onTypeChange,
}: CategorySummaryListProps) {
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
            Categories
          </p>
          <h3 className="mt-2 text-2xl font-bold text-[#1F2933]">
            Summary by category
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
            Review this month's category totals with a clear view of activity
            and value.
          </p>
        </div>

        <div className="inline-flex w-full rounded-full border border-[#E5E7EB] bg-white p-1 shadow-sm sm:w-auto">
          {filterOptions.map((option) => {
            const isSelected = selectedType === option.value

            return (
              <button
                className={getFilterButtonClasses(isSelected)}
                key={option.label}
                onClick={() => onTypeChange(option.value)}
                type="button"
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_45px_rgba(31,41,51,0.07)]">
          <div className="flex items-center gap-4">
            <span className="h-10 w-10 animate-pulse rounded-2xl bg-[#EAF7F0]" />
            <div className="min-w-0 flex-1">
              <div className="h-3 w-32 animate-pulse rounded-full bg-[#E5E7EB]" />
              <div className="mt-3 h-3 w-full max-w-md animate-pulse rounded-full bg-[#F1F5F2]" />
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-5 rounded-3xl border border-[#E5E7EB] bg-[#FEF2F2] p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#DC2626]">
            Category summary unavailable
          </p>
          <p className="mt-2 text-sm leading-6 text-[#DC2626]">{error}</p>
        </div>
      ) : null}

      {!isLoading && !error && categories.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center shadow-sm">
          <p className="text-base font-semibold text-[#1F2933]">
            No category activity yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
            There is no income or expense data for the current month yet. Once
            transactions are registered, categories will appear here.
          </p>
        </div>
      ) : null}

      {!isLoading && !error && categories.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_18px_45px_rgba(31,41,51,0.07)]">
          <ul className="divide-y divide-[#E5E7EB]">
            {categories.map((category) => (
              <li
                className="grid gap-4 p-5 transition hover:bg-[#F8FAF7] sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:p-6"
                key={category.categoryId}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="h-11 w-2 shrink-0 rounded-full bg-[#CF9F57]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-[#1F2933]">
                      {category.categoryName}
                    </p>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      {category.transactionsCount}{' '}
                      {category.transactionsCount === 1
                        ? 'transaction'
                        : 'transactions'}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#6B7280] sm:text-right">
                  Total
                </p>
                <p className="break-words text-xl font-bold text-[#1F2933] sm:min-w-32 sm:text-right">
                  {formatCurrency(category.total)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

export default CategorySummaryList
