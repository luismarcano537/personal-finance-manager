import { useEffect, useState } from 'react'
import DeleteCategoryConfirmModal from '../components/categories/DeleteCategoryConfirmModal'
import CategoryFormModal from '../components/categories/CategoryFormModal'
import { categoryService } from '../services/categoryService'
import { CategoryType, type Category } from '../types/category'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

const categoriesLoadErrorMessage =
  'Unable to load categories. Please try again.'

type CategoryTypeView = {
  label: string
  badgeClassName: string
  accentClassName: string
}

const getCategoryTypeView = (type: Category['type']): CategoryTypeView => {
  if (type === CategoryType.Income) {
    return {
      accentClassName: 'bg-brand-primary',
      badgeClassName: 'bg-brand-primary-soft text-brand-primary-dark',
      label: 'Income',
    }
  }

  return {
    accentClassName: 'bg-brand-gold',
    badgeClassName: 'bg-brand-gold-soft text-[#8A642E]',
    label: 'Expense',
  }
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  )

  async function loadCategories(): Promise<void> {
    try {
      const loadedCategories = await categoryService.getCategories()
      setCategories(loadedCategories)
      setError('')
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, categoriesLoadErrorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    void categoryService
      .getCategories()
      .then((loadedCategories) => {
        if (!isActive) {
          return
        }

        setCategories(loadedCategories)
        setError('')
      })
      .catch((caughtError: unknown) => {
        if (!isActive) {
          return
        }

        setError(getApiErrorMessage(caughtError, categoriesLoadErrorMessage))
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

  const handleOpenCreateModal = (): void => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (category: Category): void => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (category: Category): void => {
    setCategoryToDelete(category)
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleCloseDeleteModal = (): void => {
    setCategoryToDelete(null)
  }

  const handleModalSuccess = (): void => {
    setIsLoading(true)
    setError('')
    void loadCategories()
  }

  const handleDeleteSuccess = (): void => {
    setCategoryToDelete(null)
    setIsLoading(true)
    setError('')
    void loadCategories()
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_24px_70px_rgba(31,41,51,0.08)]">
          <div className="border-b border-brand-border bg-brand-primary-soft px-5 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-brand-primary-dark">
                  Category management
                </p>
                <h2 className="mt-3 text-3xl font-bold text-brand-text-strong sm:text-4xl">
                  Categories
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-text sm:text-base">
                  Review the income and expense categories used to organize your
                  financial activity.
                </p>
              </div>

              <button
                className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(59,170,114,0.22)] transition hover:bg-brand-primary-dark sm:w-auto"
                onClick={handleOpenCreateModal}
                type="button"
              >
                New category
              </button>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8 lg:px-10">
            {isLoading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((item) => (
                  <div
                    className="rounded-3xl border border-brand-border bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.07)]"
                    key={item}
                  >
                    <div className="flex items-center gap-4">
                      <span className="h-12 w-2 shrink-0 animate-pulse rounded-full bg-brand-primary-soft" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-40 animate-pulse rounded-full bg-brand-border" />
                        <div className="mt-3 h-3 w-28 animate-pulse rounded-full bg-brand-surface-muted" />
                      </div>
                      <div className="hidden h-8 w-20 animate-pulse rounded-full bg-brand-gold-soft sm:block" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {!isLoading && error ? (
              <div className="rounded-3xl border border-brand-border bg-brand-error-soft p-6 shadow-sm">
                <p className="text-sm font-semibold text-brand-error">
                  Categories unavailable
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-error">
                  {error}
                </p>
              </div>
            ) : null}

            {!isLoading && !error && categories.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-brand-border-strong bg-white p-8 text-center shadow-sm">
                <p className="text-base font-semibold text-brand-text-strong">
                  No categories yet
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-brand-text-muted">
                  Categories will appear here once they are available for your
                  account.
                </p>
              </div>
            ) : null}

            {!isLoading && !error && categories.length > 0 ? (
              <div className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_18px_45px_rgba(31,41,51,0.07)]">
                <ul className="divide-y divide-brand-border">
                  {categories.map((category) => {
                    const typeView = getCategoryTypeView(category.type)

                    return (
                      <li
                        className="flex flex-col gap-4 p-5 transition hover:bg-brand-background sm:flex-row sm:items-center sm:justify-between sm:p-6"
                        key={category.id}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <span
                            aria-hidden="true"
                            className={`h-12 w-2 shrink-0 rounded-full ${typeView.accentClassName}`}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-brand-text-strong">
                              {category.name}
                            </p>
                            <p className="mt-1 text-sm text-brand-text-muted">
                              Category type
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${typeView.badgeClassName}`}
                          >
                            {typeView.label}
                          </span>
                          <button
                            className="rounded-2xl border border-brand-border-strong bg-white px-4 py-2 text-sm font-semibold text-brand-text transition hover:border-brand-gold hover:bg-brand-gold-soft hover:text-brand-text-strong"
                            onClick={() => handleOpenEditModal(category)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-2xl border border-brand-error/25 bg-white px-4 py-2 text-sm font-semibold text-brand-error transition hover:bg-brand-error-soft"
                            onClick={() => handleOpenDeleteModal(category)}
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
      </section>

      {isModalOpen ? (
        <CategoryFormModal
          category={selectedCategory}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      ) : null}

      {categoryToDelete !== null ? (
        <DeleteCategoryConfirmModal
          category={categoryToDelete}
          onClose={handleCloseDeleteModal}
          onSuccess={handleDeleteSuccess}
        />
      ) : null}
    </>
  )
}

export default Categories
