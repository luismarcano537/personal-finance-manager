import { type ChangeEvent, useEffect, useState } from 'react'
import DeleteTransactionConfirmModal from '../components/transactions/DeleteTransactionConfirmModal'
import TransactionFormModal from '../components/transactions/TransactionFormModal'
import { categoryService } from '../services/categoryService'
import { transactionService } from '../services/transactionService'
import type { Category } from '../types/category'
import {
  TransactionType,
  type Transaction,
  type TransactionFilters,
} from '../types/transaction'

type TransactionTypeView = {
  label: string
  badgeClassName: string
  amountClassName: string
  accentClassName: string
}

type MonthOption = {
  label: string
  value: number
}

type TypeFilterValue = 'all' | 'income' | 'expense'

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
  'mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#3BAA72] focus:ring-4 focus:ring-[#EAF7F0] disabled:cursor-not-allowed disabled:bg-[#F1F5F2] disabled:text-[#6B7280]'

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value)

const formatTransactionDate = (value: string): string => {
  const transactionDate = new Date(value)

  if (Number.isNaN(transactionDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(transactionDate)
}

const getTransactionTypeView = (
  type: Transaction['type'],
): TransactionTypeView => {
  if (type === TransactionType.Income) {
    return {
      accentClassName: 'bg-[#3BAA72]',
      amountClassName: 'text-[#2F855A]',
      badgeClassName: 'bg-[#EAF7F0] text-[#2F855A]',
      label: 'Income',
    }
  }

  return {
    accentClassName: 'bg-[#CF9F57]',
    amountClassName: 'text-[#DC2626]',
    badgeClassName: 'bg-[#FEF2F2] text-[#DC2626]',
    label: 'Expense',
  }
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [categoryError, setCategoryError] = useState<string>('')
  const [month, setMonth] = useState<number>(currentMonth)
  const [year, setYear] = useState<number>(currentYear)
  const [type, setType] = useState<TransactionType | undefined>(undefined)
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [isTransactionModalOpen, setIsTransactionModalOpen] =
    useState<boolean>(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null)
  const [isDeletingTransaction, setIsDeletingTransaction] =
    useState<boolean>(false)
  const [deleteTransactionError, setDeleteTransactionError] =
    useState<string>('')
  const [refreshKey, setRefreshKey] = useState<number>(0)

  useEffect(() => {
    let isActive = true
    const filters: TransactionFilters = {
      categoryId,
      month,
      type,
      year,
    }

    void transactionService
      .getTransactions(filters)
      .then((loadedTransactions) => {
        if (!isActive) {
          return
        }

        setTransactions(loadedTransactions)
        setError('')
      })
      .catch(() => {
        if (!isActive) {
          return
        }

        setError('Could not load transactions. Please try again later.')
      })
      .finally(() => {
        if (!isActive) {
          return
        }

        setIsLoading(false)
      })

    return (): void => {
      isActive = false
    }
  }, [categoryId, month, refreshKey, type, year])

  useEffect(() => {
    let isActive = true

    void categoryService
      .getCategories()
      .then((loadedCategories) => {
        if (!isActive) {
          return
        }

        setCategories(loadedCategories)
        setCategoryError('')
      })
      .catch(() => {
        if (!isActive) {
          return
        }

        setCategories([])
        setCategoryId(undefined)
        setCategoryError('Categories unavailable')
      })
      .finally(() => {
        if (!isActive) {
          return
        }

        setIsCategoryLoading(false)
      })

    return (): void => {
      isActive = false
    }
  }, [])

  const handleMonthChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    setIsLoading(true)
    setMonth(Number(event.target.value))
  }

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setIsLoading(true)
    setYear(Number(event.target.value))
  }

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedType = event.target.value as TypeFilterValue

    setIsLoading(true)

    if (selectedType === 'income') {
      setType(TransactionType.Income)
      return
    }

    if (selectedType === 'expense') {
      setType(TransactionType.Expense)
      return
    }

    setType(undefined)
  }

  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const selectedCategoryId = event.target.value

    setIsLoading(true)
    setCategoryId(
      selectedCategoryId.length > 0 ? selectedCategoryId : undefined,
    )
  }

  const handleOpenCreateModal = (): void => {
    setSelectedTransaction(null)
    setIsTransactionModalOpen(true)
  }

  const handleOpenEditModal = (transaction: Transaction): void => {
    setSelectedTransaction(transaction)
    setIsTransactionModalOpen(true)
  }

  const handleCloseTransactionModal = (): void => {
    setIsTransactionModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleTransactionSaved = (): void => {
    setIsLoading(true)
    setRefreshKey((currentRefreshKey) => currentRefreshKey + 1)
  }

  const handleOpenDeleteModal = (transaction: Transaction): void => {
    setTransactionToDelete(transaction)
    setDeleteTransactionError('')
  }

  const handleCloseDeleteModal = (): void => {
    if (isDeletingTransaction) {
      return
    }

    setTransactionToDelete(null)
    setDeleteTransactionError('')
  }

  const handleConfirmDeleteTransaction = async (): Promise<void> => {
    if (transactionToDelete === null || isDeletingTransaction) {
      return
    }

    setIsDeletingTransaction(true)
    setDeleteTransactionError('')

    try {
      await transactionService.deleteTransaction(transactionToDelete.id)
      setTransactionToDelete(null)
      setIsLoading(true)
      setRefreshKey((currentRefreshKey) => currentRefreshKey + 1)
    } catch {
      setDeleteTransactionError(
        'Could not delete this transaction. Please try again.',
      )
    } finally {
      setIsDeletingTransaction(false)
    }
  }

  const typeFilterValue: TypeFilterValue =
    type === TransactionType.Income
      ? 'income'
      : type === TransactionType.Expense
        ? 'expense'
        : 'all'

  const selectedMonthLabel =
    monthOptions.find((monthOption) => monthOption.value === month)?.label ??
    'selected month'

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_24px_70px_rgba(31,41,51,0.08)]">
        <div className="border-b border-[#E5E7EB] bg-[#EAF7F0] px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
                Transaction activity
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#1F2933] sm:text-4xl">
                Transactions
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#374151] sm:text-base">
                Review posted income and expenses with category, date, type,
                and amount details.
              </p>
            </div>

            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#3BAA72] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,170,114,0.22)] transition hover:bg-[#2F855A] sm:w-auto"
              onClick={handleOpenCreateModal}
              type="button"
            >
              New transaction
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
          <div className="mb-6 rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.06)]">
            <div className="flex flex-col gap-2 border-b border-[#E5E7EB] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1F2933]">
                  Filters
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Showing {selectedMonthLabel} {year}
                </p>
              </div>
              {isLoading ? (
                <span className="inline-flex w-fit items-center rounded-full bg-[#EAF7F0] px-3 py-1 text-xs font-semibold text-[#2F855A]">
                  Updating
                </span>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="text-sm font-semibold text-[#374151]">
                  Month
                </span>
                <select
                  className={selectClassName}
                  onChange={handleMonthChange}
                  value={month}
                >
                  {monthOptions.map((monthOption) => (
                    <option key={monthOption.value} value={monthOption.value}>
                      {monthOption.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#374151]">
                  Year
                </span>
                <select
                  className={selectClassName}
                  onChange={handleYearChange}
                  value={year}
                >
                  {yearOptions.map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#374151]">
                  Type
                </span>
                <select
                  className={selectClassName}
                  onChange={handleTypeChange}
                  value={typeFilterValue}
                >
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-[#374151]">
                  Category
                </span>
                <select
                  className={selectClassName}
                  disabled={isCategoryLoading || categoryError.length > 0}
                  onChange={handleCategoryChange}
                  value={categoryId ?? ''}
                >
                  {categoryError.length > 0 ? (
                    <option value="">Categories unavailable</option>
                  ) : (
                    <option value="">
                      {isCategoryLoading
                        ? 'Loading categories'
                        : 'All categories'}
                    </option>
                  )}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {categoryError.length > 0 ? (
              <p className="mt-4 rounded-2xl bg-[#FBF4E8] px-4 py-3 text-sm font-medium text-[#8A642E]">
                Category filtering is temporarily unavailable.
              </p>
            ) : null}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div
                  className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.07)]"
                  key={item}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="h-14 w-2 shrink-0 animate-pulse rounded-full bg-[#EAF7F0]" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-44 animate-pulse rounded-full bg-[#E5E7EB]" />
                        <div className="mt-3 h-3 w-32 animate-pulse rounded-full bg-[#F1F5F2]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-20 animate-pulse rounded-full bg-[#FBF4E8]" />
                      <div className="h-5 w-24 animate-pulse rounded-full bg-[#E5E7EB]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-3xl border border-[#E5E7EB] bg-[#FEF2F2] p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#DC2626]">
                Transactions unavailable
              </p>
              <p className="mt-2 text-sm leading-6 text-[#DC2626]">{error}</p>
            </div>
          ) : null}

          {!isLoading && !error && transactions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center shadow-sm">
              <p className="text-base font-semibold text-[#1F2933]">
                No transactions found
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
                There are no transactions for the selected period and filters.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && transactions.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_18px_45px_rgba(31,41,51,0.07)]">
              <ul className="divide-y divide-[#E5E7EB]">
                {transactions.map((transaction) => {
                  const typeView = getTransactionTypeView(transaction.type)
                  const categoryName =
                    transaction.categoryName ?? 'Uncategorized'

                  return (
                    <li
                      className="flex flex-col gap-5 p-5 transition hover:bg-[#F8FAF7] lg:flex-row lg:items-center lg:justify-between lg:p-6"
                      key={transaction.id}
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <span
                          aria-hidden="true"
                          className={`mt-1 h-16 w-2 shrink-0 rounded-full ${typeView.accentClassName}`}
                        />
                        <div className="min-w-0">
                          <p className="break-words text-base font-semibold text-[#1F2933]">
                            {transaction.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6B7280]">
                            <span>
                              {formatTransactionDate(
                                transaction.transactionDate,
                              )}
                            </span>
                            <span>{categoryName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${typeView.badgeClassName}`}
                        >
                          {typeView.label}
                        </span>
                        <p
                          className={`text-lg font-bold ${typeView.amountClassName}`}
                        >
                          {formatCurrency(transaction.amount)}
                        </p>
                        <button
                          className="rounded-2xl border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#374151] transition hover:border-[#CF9F57]/60 hover:bg-[#FBF4E8] hover:text-[#1F2933]"
                          onClick={() => handleOpenEditModal(transaction)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-2xl border border-[#DC2626]/25 bg-white px-4 py-2 text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-60"
                          onClick={() => handleOpenDeleteModal(transaction)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <TransactionFormModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        onSuccess={handleTransactionSaved}
        transaction={selectedTransaction}
      />

      <DeleteTransactionConfirmModal
        error={deleteTransactionError}
        formatCurrency={formatCurrency}
        formatTransactionDate={formatTransactionDate}
        isDeleting={isDeletingTransaction}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteTransaction}
        transaction={transactionToDelete}
      />
    </section>
  )
}

export default Transactions
