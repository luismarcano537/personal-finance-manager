export const CategoryType = {
  Income: 1,
  Expense: 2,
}

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType]

export type Category = {
  id: string
  name: string
  type: CategoryType
  createdAt?: string
  updatedAt?: string | null
  isActive?: boolean
}

export type CreateCategoryRequest = {
  name: string
  type: CategoryType
}

export type UpdateCategoryRequest = {
  name: string
  type: CategoryType
}
