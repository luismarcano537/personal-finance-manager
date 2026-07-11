import { categoryService } from '../../services/categoryService'
import type { Category } from '../../types/category'
import { useState } from 'react'

type DeleteCategoryConfirmModalProps = {
  category: Category
  onClose: () => void
  onSuccess: () => void
}

function DeleteCategoryConfirmModal({
  category,
  onClose,
  onSuccess,
}: DeleteCategoryConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleClose = (): void => {
    if (isDeleting) {
      return
    }

    onClose()
  }

  const handleDelete = async (): Promise<void> => {
    if (isDeleting) {
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      await categoryService.deleteCategory(category.id)
      onSuccess()
    } catch {
      setError('Could not delete this category. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      aria-labelledby="delete-category-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-brand-text-strong/35 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-3xl border border-brand-border bg-white shadow-[0_28px_80px_rgba(220,38,38,0.14)]">
        <div className="border-b border-brand-border px-6 py-5 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-error">
            Destructive action
          </p>
          <h2
            className="mt-2 text-2xl font-bold text-brand-text-strong"
            id="delete-category-title"
          >
            Delete category?
          </h2>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8">
          {error ? (
            <div className="rounded-2xl border border-brand-error/20 bg-brand-error-soft px-4 py-3">
              <p className="text-sm font-medium text-brand-error">{error}</p>
            </div>
          ) : null}

          <div className="rounded-2xl border border-brand-border bg-brand-background px-4 py-4">
            <p className="text-sm leading-6 text-brand-text">
              The category{' '}
              <span className="font-semibold text-brand-text-strong">
                {category.name}
              </span>{' '}
              will be removed or deactivated from your active category list.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              className="rounded-2xl border border-brand-border-strong bg-white px-5 py-3 text-sm font-semibold text-brand-text transition hover:bg-brand-background disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeleting}
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-2xl bg-brand-error px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.22)] transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isDeleting}
              onClick={handleDelete}
              type="button"
            >
              {isDeleting ? 'Deleting...' : 'Delete category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteCategoryConfirmModal
