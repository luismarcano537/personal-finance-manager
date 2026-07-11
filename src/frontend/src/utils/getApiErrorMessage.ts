import { isAxiosError } from 'axios'

type ApiErrorBody = {
  message?: unknown
  errors?: unknown
}

const technicalMessagePatterns: RegExp[] = [
  /axioserror/i,
  /network error/i,
  /stack trace/i,
  /\btraceid\b/i,
  /\bnpgsql\b/i,
  /\bentityframework\b/i,
  /\binner exception\b/i,
  /\bsystem\./i,
  /\bat\s+\S+\s*\(/i,
  /^(bad request|unauthorized|forbidden|not found|conflict|internal server error)$/i,
]

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isSafeMessage = (value: string): boolean => {
  const trimmedValue = value.trim()

  if (trimmedValue.length === 0) {
    return false
  }

  return !technicalMessagePatterns.some((pattern) => pattern.test(trimmedValue))
}

const getSafeString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmedValue = value.trim()

  return isSafeMessage(trimmedValue) ? trimmedValue : null
}

const hasValidationErrors = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  if (isRecord(value)) {
    return Object.keys(value).length > 0
  }

  return false
}

const getValidationErrorMessage = (value: unknown): string | null => {
  if (!hasValidationErrors(value)) {
    return null
  }

  return 'Please review the information provided and try again.'
}

const getStatusMessage = (
  status: number | undefined,
  fallbackMessage: string,
): string | null => {
  if (status === undefined) {
    return null
  }

  if (status === 401) {
    const fallback = fallbackMessage.toLowerCase()
    const isLoginFallback =
      fallback.includes('sign in') ||
      fallback.includes('login') ||
      fallback.includes('email') ||
      fallback.includes('password')

    return isLoginFallback
      ? fallbackMessage
      : 'Your session has expired. Please sign in again.'
  }

  if (status === 403) {
    return 'You do not have permission to perform this action.'
  }

  if (status === 404) {
    return 'The requested resource was not found.'
  }

  if (status === 409) {
    return 'This action conflicts with existing information.'
  }

  return null
}

const getApiErrorBody = (data: unknown): ApiErrorBody | null => {
  if (!isRecord(data)) {
    return null
  }

  return {
    errors: data.errors,
    message: data.message,
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!isAxiosError(error)) {
    return fallbackMessage
  }

  const response = error.response
  const body = getApiErrorBody(response?.data)
  const message = getSafeString(body?.message)

  if (message !== null) {
    return message
  }

  const validationMessage = getValidationErrorMessage(body?.errors)

  if (validationMessage !== null) {
    return validationMessage
  }

  const statusMessage = getStatusMessage(response?.status, fallbackMessage)

  if (statusMessage !== null) {
    return statusMessage
  }

  return fallbackMessage
}
