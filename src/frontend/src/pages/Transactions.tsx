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
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

const categoriesLoadErrorMessage =
  'Unable to load categories. Please try again.'
const transactionsLoadErrorMessage =
  'Unable to load transactions. Please try again.'
const transactionDeleteErrorMessage =
  'Unable to delete transaction. Please try again.'

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
  'mt-2 w-full rounded-2xl border border-brand-border-strong bg-white px-4 py-3 text-sm font-semibold text-brand-text outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-soft disabled:cursor-not-allowed disabled:bg-brand-surface-muted disabled:text-brand-text-muted'

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
      accentClassName: 'bg-brand-primary',
      amountClassName: 'text-brand-primary-dark',
      badgeClassName: 'bg-brand-primary-soft text-brand-primary-dark',
      label: 'Income',
    }
  }

  return {
    accentClassName: 'bg-brand-gold',
    amountClassName: 'text-brand-error',
    badgeClassName: 'bg-brand-error-soft text-brand-error',
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
      .catch((caughtError: unknown) => {
        if (!isActive) {
          return
        }

        setError(getApiErrorMessage(caughtError, transactionsLoadErrorMessage))
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
      .catch((caughtError: unknown) => {
        if (!isActive) {
          return
        }

        setCategories([])
        setCategoryId(undefined)
        setCategoryError(getApiErrorMessage(caughtError, categoriesLoadErrorMessage))
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
    } catch (caughtError) {
      setDeleteTransactionError(
        getApiErrorMessage(caughtError, transactionDeleteErrorMessage),
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
      <div className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_24px_70px_rgba(31,41,51,0.08)]">
        <div className="border-b border-brand-border bg-brand-primary-soft px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-normal text-brand-primary-dark">
                Transaction activity
              </p>
              <h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">
                Transactions
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-text sm:text-base">
                Review posted income and expenses with category, date, type,
                and amount details.
              </p>
            </div>

            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,170,114,0.22)] transition hover:bg-brand-primary-dark sm:w-auto"
              onClick={handleOpenCreateModal}
              type="button"
            >
              New transaction
            </button>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
          <div className="mb-6 rounded-3xl border border-brand-border bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.06)]">
            <div className="flex flex-col gap-2 border-b border-brand-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-text-strong">
                  Filters
                </p>
                <p className="mt-1 text-sm text-brand-text-muted">
                  Showing {selectedMonthLabel} {year}
                </p>
              </div>
              {isLoading ? (
                <span className="inline-flex w-fit items-center rounded-full bg-brand-primary-soft px-3 py-1 text-xs font-semibold text-brand-primary-dark">
                  Updating
                </span>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="block">
                <span className="text-sm font-semibold text-brand-text">
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
                <span className="text-sm font-semibold text-brand-text">
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
                <span className="text-sm font-semibold text-brand-text">
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
                <span className="text-sm font-semibold text-brand-text">
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
              <p className="mt-4 rounded-2xl bg-brand-gold-soft px-4 py-3 text-sm font-medium text-[#8A642E]">
                Category filtering is temporarily unavailable.
              </p>
            ) : null}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div
                  className="rounded-3xl border border-brand-border bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.07)]"
                  key={item}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="h-14 w-2 shrink-0 animate-pulse rounded-full bg-brand-primary-soft" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-44 animate-pulse rounded-full bg-brand-border" />
                        <div className="mt-3 h-3 w-32 animate-pulse rounded-full bg-brand-surface-muted" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-20 animate-pulse rounded-full bg-brand-gold-soft" />
                      <div className="h-5 w-24 animate-pulse rounded-full bg-brand-border" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-3xl border border-brand-border bg-brand-error-soft p-6 shadow-sm">
              <p className="text-sm font-semibold text-brand-error">
                Transactions unavailable
              </p>
              <p className="mt-2 text-sm leading-6 text-brand-error">{error}</p>
            </div>
          ) : null}

          {!isLoading && !error && transactions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-border-strong bg-white p-8 text-center shadow-sm">
              <p className="text-base font-semibold text-brand-text-strong">
                No transactions found
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-text-muted">
                There are no transactions for the selected period and filters.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && transactions.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_18px_45px_rgba(31,41,51,0.07)]">
              <ul className="divide-y divide-brand-border">
                {transactions.map((transaction) => {
                  const typeView = getTransactionTypeView(transaction.type)
                  const categoryName =
                    transaction.categoryName ?? 'Uncategorized'

                  return (
                    <li
                      className="flex flex-col gap-5 p-5 transition hover:bg-brand-background lg:flex-row lg:items-center lg:justify-between lg:p-6"
                      key={transaction.id}
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <span
                          aria-hidden="true"
                          className={`mt-1 h-16 w-2 shrink-0 rounded-full ${typeView.accentClassName}`}
                        />
                        <div className="min-w-0">
                          <p className="break-words text-base font-semibold text-brand-text-strong">
                            {transaction.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-brand-text-muted">
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
                          className="rounded-2xl border border-brand-border-strong bg-white px-4 py-2 text-sm font-semibold text-brand-text transition hover:border-brand-gold/60 hover:bg-brand-gold-soft hover:text-brand-text-strong"
                          onClick={() => handleOpenEditModal(transaction)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-2xl border border-brand-error/25 bg-white px-4 py-2 text-sm font-semibold text-brand-error transition hover:bg-brand-error-soft disabled:cursor-not-allowed disabled:opacity-60"
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
