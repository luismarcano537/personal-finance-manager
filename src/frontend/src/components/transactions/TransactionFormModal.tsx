import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { categoryService } from '../../services/categoryService'
import { transactionService } from '../../services/transactionService'
import type { Category } from '../../types/category'
import {
  TransactionType,
  type CreateTransactionRequest,
  type Transaction,
  type UpdateTransactionRequest,
} from '../../types/transaction'

type TransactionFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  transaction?: Transaction | null
}

type TransactionTypeFieldValue = TransactionType | ''

const inputClassName =
  'mt-2 w-full rounded-2xl border border-brand-border-strong bg-white px-4 py-3 text-sm text-brand-text-strong outline-none transition placeholder:text-brand-text-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-soft disabled:cursor-not-allowed disabled:bg-brand-surface-muted'

const getTodayInputValue = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getDateInputValue = (value: string): string => {
  if (value.length >= 10) {
    return value.slice(0, 10)
  }

  return value
}

const getUtcDateTimeValue = (value: string): string => `${value}T00:00:00.000Z`

function TransactionFormModal({
  isOpen,
  onClose,
  onSuccess,
  transaction = null,
}: TransactionFormModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <TransactionFormModalContent
      key={transaction?.id ?? 'create'}
      onClose={onClose}
      onSuccess={onSuccess}
      transaction={transaction}
    />
  )
}

type TransactionFormModalContentProps = {
  onClose: () => void
  onSuccess: () => void
  transaction: Transaction | null
}

function TransactionFormModalContent({
  onClose,
  onSuccess,
  transaction,
}: TransactionFormModalContentProps) {
  const [amount, setAmount] = useState<string>(
    transaction?.amount.toString() ?? '',
  )
  const [description, setDescription] = useState<string>(
    transaction?.description ?? '',
  )
  const [transactionDate, setTransactionDate] = useState<string>(
    transaction !== null
      ? getDateInputValue(transaction.transactionDate)
      : getTodayInputValue(),
  )
  const [type, setType] = useState<TransactionTypeFieldValue>(
    transaction?.type ?? TransactionType.Expense,
  )
  const [categoryId, setCategoryId] = useState<string>(
    transaction?.categoryId ?? '',
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(true)
  const [categoryError, setCategoryError] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const isEditMode = transaction !== null

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
        setCategoryId('')
        setCategoryError('Could not load categories. Please try again later.')
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

  const filteredCategories = useMemo((): Category[] => {
    if (type === '') {
      return []
    }

    return categories.filter((category) => category.type === type)
  }, [categories, type])

  const handleClose = (): void => {
    if (isSaving) {
      return
    }

    onClose()
  }

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const selectedValue = Number(event.target.value)
    const nextType: TransactionTypeFieldValue =
      selectedValue === TransactionType.Income
        ? TransactionType.Income
        : selectedValue === TransactionType.Expense
          ? TransactionType.Expense
          : ''

    if (categoryId.length > 0 && nextType !== '') {
      const selectedCategory = categories.find(
        (category) => category.id === categoryId,
      )

      if (
        selectedCategory !== undefined &&
        selectedCategory.type !== nextType
      ) {
        setCategoryId('')
      }
    }

    if (nextType === '') {
      setCategoryId('')
    }

    setType(nextType)
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()

    if (isSaving) {
      return
    }

    const parsedAmount = Number(amount)
    const trimmedDescription = description.trim()

    if (amount.trim().length === 0) {
      setError('Enter an amount before saving.')
      return
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }

    if (trimmedDescription.length === 0) {
      setError('Enter a description before saving.')
      return
    }

    if (transactionDate.length === 0) {
      setError('Choose a transaction date.')
      return
    }

    if (type === '') {
      setError('Choose whether this transaction is income or expense.')
      return
    }

    if (categoryId.length === 0) {
      setError('Choose a category before saving.')
      return
    }

    setIsSaving(true)
    setError('')

    const request: CreateTransactionRequest | UpdateTransactionRequest = {
      amount: parsedAmount,
      categoryId,
      description: trimmedDescription,
      transactionDate: getUtcDateTimeValue(transactionDate),
      type,
    }

    try {
      if (transaction !== null) {
        await transactionService.updateTransaction(transaction.id, request)
      } else {
        await transactionService.createTransaction(request)
      }

      onSuccess()
      onClose()
    } catch {
      setError(
        'Could not save transaction. Please check the details and try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      aria-labelledby="transaction-form-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-brand-text-strong/35 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-2xl rounded-3xl border border-brand-gold/45 bg-white shadow-[0_28px_80px_rgba(207,159,87,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-brand-border px-6 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-brand-primary-dark">
              Transaction
            </p>
            <h2
              className="mt-2 text-2xl font-bold text-brand-text-strong"
              id="transaction-form-title"
            >
              {isEditMode ? 'Edit transaction' : 'Create transaction'}
            </h2>
          </div>

          <button
            aria-label="Close transaction form"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-border bg-white text-xl leading-none text-brand-text-muted transition hover:border-brand-border-strong hover:bg-brand-background hover:text-brand-text-strong disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={handleClose}
            type="button"
          >
            x
          </button>
        </div>

        <form className="space-y-5 px-6 py-6 sm:px-8" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-2xl border border-brand-error/20 bg-brand-error-soft px-4 py-3">
              <p className="text-sm font-medium text-brand-error">{error}</p>
            </div>
          ) : null}

          {categoryError ? (
            <div className="rounded-2xl border border-brand-gold/25 bg-brand-gold-soft px-4 py-3">
              <p className="text-sm font-medium text-[#8A642E]">
                {categoryError}
              </p>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-brand-text-strong">
                Amount
              </span>
              <input
                className={inputClassName}
                disabled={isSaving}
                min="0"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                step="0.01"
                type="number"
                value={amount}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-brand-text-strong">
                Date
              </span>
              <input
                className={inputClassName}
                disabled={isSaving}
                onChange={(event) => setTransactionDate(event.target.value)}
                type="date"
                value={transactionDate}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-brand-text-strong">
              Description
            </span>
            <input
              className={inputClassName}
              disabled={isSaving}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Salary, groceries, rent"
              type="text"
              value={description}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-brand-text-strong">
                Type
              </span>
              <select
                className={inputClassName}
                disabled={isSaving}
                onChange={handleTypeChange}
                value={type}
              >
                <option value="">Select a type</option>
                <option value={TransactionType.Income}>Income</option>
                <option value={TransactionType.Expense}>Expense</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-brand-text-strong">
                Category
              </span>
              <select
                className={inputClassName}
                disabled={
                  isSaving || isCategoryLoading || categoryError.length > 0
                }
                onChange={(event) => setCategoryId(event.target.value)}
                value={categoryId}
              >
                <option value="">
                  {isCategoryLoading ? 'Loading categories' : 'Select category'}
                </option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {!isCategoryLoading &&
              !categoryError &&
              type !== '' &&
              filteredCategories.length === 0 ? (
                <p className="mt-2 text-sm text-brand-text-muted">
                  No categories available for this type.
                </p>
              ) : null}
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              className="rounded-2xl border border-brand-border-strong bg-white px-5 py-3 text-sm font-semibold text-brand-text transition hover:bg-brand-background disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-2xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,170,114,0.22)] transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? 'Saving...' : 'Save transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionFormModal
