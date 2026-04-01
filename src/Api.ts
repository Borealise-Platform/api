import ky, { HTTPError, Options, TimeoutError } from 'ky'
import { URL, URLSearchParams } from 'node:url'
import { Logger } from './Logger'

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

interface HttpResponseLike {
  status: number
  headers: {
    get(name: string): string | null
    entries(): IterableIterator<[string, string]>
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

export class Api {
  private readonly client
  private readonly logger: Logger
  private readonly config: ApiConfig
  private readonly defaultHeaders: Record<string, string>

  public constructor(config: ApiConfig) {
    this.config = config
    this.logger = new Logger('Api')

    if (config.logging === false) {
      this.logger.disable()
    }

    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers
    }

    this.client = ky.create({
      timeout: config.timeout ?? 30000,
      credentials: config.withCredentials ? 'include' : 'same-origin',
      retry: 0,
      throwHttpErrors: true
    })

    this.logger.success(`initialized (baseURL: ${config.baseURL})`)
  }

  private resolveUrl(url: string): string {
    return new URL(url, this.config.baseURL).toString()
  }

  private parseQueryParams(params?: ApiQueryParams): URLSearchParams | undefined {
    if (!params) {
      return undefined
    }

    if (params instanceof URLSearchParams) {
      return params
    }

    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue
      }

      searchParams.set(key, String(value))
    }

    return searchParams
  }

  private async parseError(error: unknown): Promise<ApiError> {
    if (error instanceof HTTPError) {
      const response = error.response
      const responseData = await this.tryParseErrorResponse(response)
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

      return new ApiError(message, response.status, `HTTP_${response.status}`, backendResponse)
    }

    if (error instanceof TimeoutError) {
      return new ApiError('Request timed out', undefined, 'TIMEOUT_ERROR')
    }

    if (error instanceof Error) {
      return new ApiError(error.message, undefined, 'NETWORK_ERROR')
    }

    return new ApiError('Unknown request error', undefined, 'UNKNOWN_ERROR')
  }

  private async tryParseErrorResponse(response: HttpResponseLike): Promise<BackendErrorResponse | { message?: string } | string | undefined> {
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const parsed = (await response.json()) as BackendErrorResponse | { message?: string }
      return parsed
    }

    const text = await response.text()
    return text || undefined
  }

  public setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`
      this.logger.debug('Auth token set')
    } else {
      delete this.defaultHeaders['Authorization']
      this.logger.debug('Auth token cleared')
    }
  }

  public setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value
  }

  public removeHeader(key: string): void {
    delete this.defaultHeaders[key]
  }

  private buildOptions(config?: ApiRequestConfig): Options {
    const headers = {
      ...this.defaultHeaders,
      ...config?.headers
    }

    return {
      headers,
      searchParams: this.parseQueryParams(config?.params),
      timeout: config?.timeout,
      credentials: config?.credentials
    }
  }

  private async request<T = unknown>(method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    const requestUrl = this.resolveUrl(url)
    this.logger.debug(`→ ${method.toUpperCase()} ${url}`)

    try {
      const options = this.buildOptions(config)
      if (data !== undefined) {
        options.json = data
      }

      const response = await this.client(requestUrl, {
        ...options,
        method
      })

      this.logger.debug(`← ${response.status} ${url}`)
      return await this.wrapResponse<T>(response)
    } catch (error: unknown) {
      const apiError = await this.parseError(error)
      const status = apiError.status ?? apiError.code ?? 'ERR'
      this.logger.error(`← ${status} ${url}: ${apiError.message}`)
      throw apiError
    }
  }

  public async get<T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('get', url, undefined, config)
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('post', url, data, config)
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('put', url, data, config)
  }

  public async patch<T = unknown>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('patch', url, data, config)
  }

  public async delete<T = unknown>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('delete', url, undefined, config)
  }

  private async wrapResponse<T>(response: HttpResponseLike): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type') ?? ''
    let data: T

    if (response.status === 204) {
      data = undefined as T
    } else if (contentType.includes('application/json')) {
      data = (await response.json()) as T
    } else {
      data = (await response.text()) as T
    }

    return {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    }
  }
}

export const createApi = (config: ApiConfig): Api => new Api(config)

export default Api
