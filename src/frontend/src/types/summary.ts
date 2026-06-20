export const TransactionType = {
  Income: 1,
  Expense: 2,
}

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType]

export type MonthlySummary = {
  month: number
  year: number
  totalIncome: number
  totalExpense: number
  balance: number
  transactionsCount: number
}

export type CategorySummaryItem = {
  categoryId: string
  categoryName: string
  total: number
  transactionsCount: number
}

export type CategorySummary = {
  month: number
  year: number
  type: TransactionType | null
  categories: CategorySummaryItem[]
}

export type MonthlySummaryParams = {
  month: number
  year: number
}

export type CategorySummaryParams = MonthlySummaryParams & {
  type?: TransactionType
}
