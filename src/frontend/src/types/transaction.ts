export const TransactionType = {
  Income: 1,
  Expense: 2,
}

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType]

export type Transaction = {
  id: string
  categoryId: string
  categoryName?: string
  type: TransactionType
  amount: number
  description: string
  transactionDate: string
  createdAt?: string
  updatedAt?: string | null
  isActive?: boolean
}

export type CreateTransactionRequest = {
  categoryId: string
  type: TransactionType
  amount: number
  description: string
  transactionDate: string
}

export type UpdateTransactionRequest = {
  categoryId: string
  type: TransactionType
  amount: number
  description: string
  transactionDate: string
}

export type TransactionFilters = {
  month?: number
  year?: number
  type?: TransactionType
  categoryId?: string
}
