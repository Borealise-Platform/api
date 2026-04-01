import { HTTPError, TimeoutError } from 'ky'
import type { BackendErrorResponse } from './types'

interface HttpResponseLike {
  status: number
  headers: {
    get(name: string): string | null
  }
  json(): Promise<unknown>
  text(): Promise<string>
}

export class ApiError extends Error {
  public readonly status?: number
  public readonly code?: string
  public readonly response?: BackendErrorResponse

  constructor(message: string, status?: number, code?: string, response?: BackendErrorResponse) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.response = response
  }
}

const tryParseErrorResponse = async (response: HttpResponseLike): Promise<BackendErrorResponse | { message?: string } | string | undefined> => {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return (await response.json()) as BackendErrorResponse | { message?: string }
  }

  const text = await response.text()
  return text || undefined
}

export const parseApiError = async (error: unknown): Promise<ApiError> => {
  if (error instanceof HTTPError) {
    const responseData = await tryParseErrorResponse(error.response)
    const isObjectResponse = typeof responseData === 'object' && responseData !== null

    let message: string
    let backendResponse: BackendErrorResponse | undefined

    if (isObjectResponse && 'error' in responseData && responseData.error) {
      message = responseData.error
      backendResponse = responseData as BackendErrorResponse
    } else if (isObjectResponse && 'message' in responseData && responseData.message) {
      message = responseData.message
    } else if (typeof responseData === 'string' && responseData) {
      message = responseData
    } else {
      message = error.message
    }

    return new ApiError(message, error.response.status, `HTTP_${error.response.status}`, backendResponse)
  }

  if (error instanceof TimeoutError) {
    return new ApiError('Request timed out', undefined, 'TIMEOUT_ERROR')
  }

  if (error instanceof Error) {
    return new ApiError(error.message, undefined, 'NETWORK_ERROR')
  }

  return new ApiError('Unknown request error', undefined, 'UNKNOWN_ERROR')
}
