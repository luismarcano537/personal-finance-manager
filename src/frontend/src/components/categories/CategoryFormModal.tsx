import { useState, type FormEvent } from 'react'
import { categoryService } from '../../services/categoryService'
import {
  CategoryType,
  type Category,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
} from '../../types/category'

type CategoryFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  category?: Category | null
}

type CategoryTypeFieldValue = CategoryType | ''

function CategoryFormModal({
  category = null,
  isOpen,
  onClose,
  onSuccess,
}: CategoryFormModalProps) {
  const [name, setName] = useState<string>(category?.name ?? '')
  const [type, setType] = useState<CategoryTypeFieldValue>(
    category?.type ?? '',
  )
  const [error, setError] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const isEditMode = category !== null

  if (!isOpen) {
    return null
  }

  const handleClose = (): void => {
    if (isSaving) {
      return
    }

    onClose()
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault()

    if (isSaving) {
      return
    }

    const trimmedName = name.trim()

    if (trimmedName.length === 0) {
      setError('Enter a category name before saving.')
      return
    }

    if (type === '') {
      setError('Choose whether this category is income or expense.')
      return
    }

    setIsSaving(true)
    setError('')

    const request: CreateCategoryRequest | UpdateCategoryRequest = {
      name: trimmedName,
      type,
    }

    try {
      if (category !== null) {
        await categoryService.updateCategory(category.id, request)
      } else {
        await categoryService.createCategory(request)
      }

      onSuccess()
      onClose()
    } catch {
      setError('Could not save category. Please check the details and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      aria-labelledby="category-form-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-brand-text-strong/35 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-3xl border border-brand-gold/45 bg-white shadow-[0_28px_80px_rgba(207,159,87,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-brand-border px-6 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-brand-primary-dark">
              Category
            </p>
            <h2
              className="mt-2 text-2xl font-bold text-brand-text-strong"
              id="category-form-title"
            >
              {isEditMode ? 'Edit category' : 'Create category'}
            </h2>
          </div>

          <button
            aria-label="Close category form"
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

          <label className="block">
            <span className="text-sm font-semibold text-brand-text-strong">Name</span>
            <input
              className="mt-2 w-full rounded-2xl border border-brand-border-strong bg-white px-4 py-3 text-sm text-brand-text-strong outline-none transition placeholder:text-brand-text-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-soft disabled:cursor-not-allowed disabled:bg-brand-surface-muted"
              disabled={isSaving}
              onChange={(event) => setName(event.target.value)}
              placeholder="Groceries, Salary, Utilities"
              type="text"
              value={name}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-brand-text-strong">Type</span>
            <select
              className="mt-2 w-full rounded-2xl border border-brand-border-strong bg-white px-4 py-3 text-sm text-brand-text-strong outline-none transition focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-soft disabled:cursor-not-allowed disabled:bg-brand-surface-muted"
              disabled={isSaving}
              onChange={(event) => {
                if (event.target.value === '') {
                  setType('')
                  return
                }

                const selectedValue = Number(event.target.value)
                setType(
                  selectedValue === CategoryType.Income
                    ? CategoryType.Income
                    : CategoryType.Expense,
                )
              }}
              value={type}
            >
              <option value="">Select a type</option>
              <option value={CategoryType.Income}>Income</option>
              <option value={CategoryType.Expense}>Expense</option>
            </select>
          </label>

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
              {isSaving ? 'Saving...' : 'Save category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryFormModal
