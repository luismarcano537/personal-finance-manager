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

function CategorySummaryList({
  categories,
  isLoading,
  error,
  selectedType,
  onTypeChange,
}: CategorySummaryListProps) {
  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-400">
            Categories
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            Summary by category
          </h3>
        </div>

        <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-1">
          {filterOptions.map((option) => {
            const isSelected = selectedType === option.value

            return (
              <button
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
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
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300 shadow-xl">
          Loading category summary...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="mt-4 rounded-lg border border-red-900/70 bg-red-950/30 p-6 text-sm text-red-200 shadow-xl">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && categories.length === 0 ? (
        <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300 shadow-xl">
          No categories found for this period.
        </div>
      ) : null}

      {!isLoading && !error && categories.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
          <ul className="divide-y divide-slate-800">
            {categories.map((category) => (
              <li
                className="grid gap-4 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                key={category.categoryId}
              >
                <div>
                  <p className="text-base font-semibold text-white">
                    {category.categoryName}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {category.transactionsCount}{' '}
                    {category.transactionsCount === 1
                      ? 'transaction'
                      : 'transactions'}
                  </p>
                </div>

                <p className="text-sm font-medium text-slate-300 sm:text-right">
                  Total
                </p>
                <p className="break-words text-xl font-bold text-white sm:min-w-32 sm:text-right">
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
