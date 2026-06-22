import { apiClient } from '../api/apiClient'
import type {
  CreateTransactionRequest,
  Transaction,
  TransactionFilters,
  UpdateTransactionRequest,
} from '../types/transaction'

export function getTransactions(
  filters?: TransactionFilters,
): Promise<Transaction[]> {
  return apiClient
    .get<Transaction[]>('/transactions', { params: filters })
    .then((response) => response.data)
}

export function getTransactionById(id: string): Promise<Transaction> {
  return apiClient
    .get<Transaction>(`/transactions/${id}`)
    .then((response) => response.data)
}

export function createTransaction(
  request: CreateTransactionRequest,
): Promise<Transaction> {
  return apiClient
    .post<Transaction>('/transactions', request)
    .then((response) => response.data)
}

export function updateTransaction(
  id: string,
  request: UpdateTransactionRequest,
): Promise<Transaction> {
  return apiClient
    .put<Transaction>(`/transactions/${id}`, request)
    .then((response) => response.data)
}

export function deleteTransaction(id: string): Promise<void> {
  return apiClient.delete<void>(`/transactions/${id}`).then(() => undefined)
}

export const transactionService = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
}
