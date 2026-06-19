import { apiClient } from '../api/apiClient'
import type { Summary } from '../types/summary'

export function getSummary() {
  return apiClient.get<Summary>('/summary').then((response) => response.data)
}
