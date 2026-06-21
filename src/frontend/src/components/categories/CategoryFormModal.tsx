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
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-[#1F2933]/35 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-3xl border border-[#CF9F57]/45 bg-white shadow-[0_28px_80px_rgba(207,159,87,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-6 py-5 sm:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
              Category
            </p>
            <h2
              className="mt-2 text-2xl font-bold text-[#1F2933]"
              id="category-form-title"
            >
              {isEditMode ? 'Edit category' : 'Create category'}
            </h2>
          </div>

          <button
            aria-label="Close category form"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-xl leading-none text-[#6B7280] transition hover:border-[#D1D5DB] hover:bg-[#F8FAF7] hover:text-[#1F2933] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={handleClose}
            type="button"
          >
            x
          </button>
        </div>

        <form className="space-y-5 px-6 py-6 sm:px-8" onSubmit={handleSubmit}>
          {error ? (
            <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEF2F2] px-4 py-3">
              <p className="text-sm font-medium text-[#DC2626]">{error}</p>
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-[#1F2933]">Name</span>
            <input
              className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#1F2933] outline-none transition placeholder:text-[#6B7280] focus:border-[#3BAA72] focus:ring-4 focus:ring-[#EAF7F0] disabled:cursor-not-allowed disabled:bg-[#F1F5F2]"
              disabled={isSaving}
              onChange={(event) => setName(event.target.value)}
              placeholder="Groceries, Salary, Utilities"
              type="text"
              value={name}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#1F2933]">Type</span>
            <select
              className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#1F2933] outline-none transition focus:border-[#3BAA72] focus:ring-4 focus:ring-[#EAF7F0] disabled:cursor-not-allowed disabled:bg-[#F1F5F2]"
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
              className="rounded-2xl border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-semibold text-[#374151] transition hover:bg-[#F8FAF7] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-2xl bg-[#3BAA72] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,170,114,0.22)] transition hover:bg-[#2F855A] disabled:cursor-not-allowed disabled:opacity-70"
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
