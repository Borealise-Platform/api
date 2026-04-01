export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
  /** Set to false to suppress all log output. Defaults to true. */
  logging?: boolean
}

export interface ApiResponse<T = unknown> {
  data: T
  status: number
  headers: Record<string, string>
}

export type ApiQueryParams =
  | URLSearchParams
  | Record<string, unknown>

export interface ApiRequestConfig {
  headers?: Record<string, string>
  params?: ApiQueryParams
  timeout?: number
  credentials?: 'omit' | 'same-origin' | 'include'
}

export interface BackendErrorResponse {
  success: false
  error: string
}

export interface Api {
  setAuthToken(token: string | null): void
  setHeader(key: string, value: string): void
  removeHeader(key: string): void
  get<T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  post<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  put<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  patch<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>>
  delete<T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>
}
