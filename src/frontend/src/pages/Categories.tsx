import { useEffect, useState } from 'react'
import { categoryService } from '../services/categoryService'
import { CategoryType, type Category } from '../types/category'

type CategoryTypeView = {
  label: string
  badgeClassName: string
  accentClassName: string
}

const getCategoryTypeView = (type: Category['type']): CategoryTypeView => {
  if (type === CategoryType.Income) {
    return {
      accentClassName: 'bg-[#3BAA72]',
      badgeClassName: 'bg-[#EAF7F0] text-[#2F855A]',
      label: 'Income',
    }
  }

  return {
    accentClassName: 'bg-[#CF9F57]',
    badgeClassName: 'bg-[#FBF4E8] text-[#8A642E]',
    label: 'Expense',
  }
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function loadCategories(): Promise<void> {
      setIsLoading(true)
      setError('')

      try {
        const loadedCategories = await categoryService.getCategories()
        setCategories(loadedCategories)
      } catch {
        setError('Could not load categories. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCategories()
  }, [])

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_24px_70px_rgba(31,41,51,0.08)]">
        <div className="border-b border-[#E5E7EB] bg-[#EAF7F0] px-5 py-6 sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-normal text-[#2F855A]">
            Category management
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#1F2933] sm:text-4xl">
            Categories
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#374151] sm:text-base">
            Review the income and expense categories used to organize your
            financial activity.
          </p>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
          {isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((item) => (
                <div
                  className="rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.07)]"
                  key={item}
                >
                  <div className="flex items-center gap-4">
                    <span className="h-12 w-2 shrink-0 animate-pulse rounded-full bg-[#EAF7F0]" />
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-40 animate-pulse rounded-full bg-[#E5E7EB]" />
                      <div className="mt-3 h-3 w-28 animate-pulse rounded-full bg-[#F1F5F2]" />
                    </div>
                    <div className="hidden h-8 w-20 animate-pulse rounded-full bg-[#FBF4E8] sm:block" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-3xl border border-[#E5E7EB] bg-[#FEF2F2] p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#DC2626]">
                Categories unavailable
              </p>
              <p className="mt-2 text-sm leading-6 text-[#DC2626]">{error}</p>
            </div>
          ) : null}

          {!isLoading && !error && categories.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#D1D5DB] bg-white p-8 text-center shadow-sm">
              <p className="text-base font-semibold text-[#1F2933]">
                No categories yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
                Categories will appear here once they are available for your
                account.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && categories.length > 0 ? (
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_18px_45px_rgba(31,41,51,0.07)]">
              <ul className="divide-y divide-[#E5E7EB]">
                {categories.map((category) => {
                  const typeView = getCategoryTypeView(category.type)

                  return (
                    <li
                      className="flex flex-col gap-4 p-5 transition hover:bg-[#F8FAF7] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                      key={category.id}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span
                          aria-hidden="true"
                          className={`h-12 w-2 shrink-0 rounded-full ${typeView.accentClassName}`}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-[#1F2933]">
                            {category.name}
                          </p>
                          <p className="mt-1 text-sm text-[#6B7280]">
                            Category type
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${typeView.badgeClassName}`}
                      >
                        {typeView.label}
                      </span>
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

export default Categories
