import { useEffect, useState } from 'react'
import { transactionService } from '../services/transactionService'
import {
  TransactionType,
  type Transaction,
} from '../types/transaction'

type TransactionTypeView = {
  label: string
  badgeClassName: string
  amountClassName: string
  accentClassName: string
}

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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let isActive = true

    void transactionService
      .getTransactions()
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
  }, [])

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_24px_70px_rgba(31,41,51,0.08)]">
        <div className="border-b border-[#E5E7EB] bg-[#EAF7F0] px-5 py-6 sm:px-8 lg:px-10">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
              Transaction activity
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#1F2933] sm:text-4xl">
              Transactions
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#374151] sm:text-base">
              Review posted income and expenses with category, date, type, and
              amount details.
            </p>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
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
                No transactions yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
                Your income and expense records will appear here once they are
                available for your account.
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
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Transactions
