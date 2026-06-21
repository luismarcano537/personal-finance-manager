import { apiClient } from '../api/apiClient'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/category'

export function getCategories(): Promise<Category[]> {
  return apiClient
    .get<Category[]>('/categories')
    .then((response) => response.data)
}

export function getCategoryById(id: string): Promise<Category> {
  return apiClient
    .get<Category>(`/categories/${id}`)
    .then((response) => response.data)
}

export function createCategory(
  request: CreateCategoryRequest,
): Promise<Category> {
  return apiClient
    .post<Category>('/categories', request)
    .then((response) => response.data)
}

export function updateCategory(
  id: string,
  request: UpdateCategoryRequest,
): Promise<Category> {
  return apiClient
    .put<Category>(`/categories/${id}`, request)
    .then((response) => response.data)
}

export function deleteCategory(id: string): Promise<void> {
  return apiClient.delete<void>(`/categories/${id}`).then(() => undefined)
}

export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}
