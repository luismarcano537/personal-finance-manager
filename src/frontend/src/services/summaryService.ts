import { apiClient } from '../api/apiClient'
import type {
  CategorySummary,
  CategorySummaryParams,
  MonthlySummary,
  MonthlySummaryParams,
} from '../types/summary'

export function getMonthlySummary(
  params: MonthlySummaryParams,
): Promise<MonthlySummary> {
  return apiClient
    .get<MonthlySummary>('/summary/monthly', { params })
    .then((response) => response.data)
}

export function getCategorySummary(
  params: CategorySummaryParams,
): Promise<CategorySummary> {
  return apiClient
    .get<CategorySummary>('/summary/categories', { params })
    .then((response) => response.data)
}

export const summaryService = {
  getMonthlySummary,
  getCategorySummary,
}
