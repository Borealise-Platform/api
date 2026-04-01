import ky, { Options } from 'ky'
import { URL, URLSearchParams } from 'node:url'
import { Logger } from '../Logger'
import { parseApiError } from './errors'
import type { Api, ApiConfig, ApiQueryParams, ApiRequestConfig, ApiResponse } from './types'

interface HttpResponseLike {
  status: number
  headers: {
    get(name: string): string | null
    entries(): IterableIterator<[string, string]>
  }
  json(): Promise<unknown>
  text(): Promise<string>
}

const resolveUrl = (baseURL: string, url: string): string => new URL(url, baseURL).toString()

const parseQueryParams = (params?: ApiQueryParams): URLSearchParams | undefined => {
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

const wrapResponse = async <T>(response: HttpResponseLike): Promise<ApiResponse<T>> => {
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

const buildOptions = (defaultHeaders: Record<string, string>, config?: ApiRequestConfig): Options => ({
  headers: {
    ...defaultHeaders,
    ...config?.headers
  },
  searchParams: parseQueryParams(config?.params),
  timeout: config?.timeout,
  credentials: config?.credentials
})

export const createApi = (config: ApiConfig): Api => {
  const logger = new Logger('Api')

  if (config.logging === false) {
    logger.disable()
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers
  }

  const client = ky.create({
    timeout: config.timeout ?? 30000,
    credentials: config.withCredentials ? 'include' : 'same-origin',
    retry: 0,
    throwHttpErrors: true
  })

  const request = async <T = unknown>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: unknown,
    requestConfig?: ApiRequestConfig
  ): Promise<ApiResponse<T>> => {
    logger.debug(`→ ${method.toUpperCase()} ${url}`)

    try {
      const options = buildOptions(defaultHeaders, requestConfig)
      if (data !== undefined) {
        options.json = data
      }

      const response = await client(resolveUrl(config.baseURL, url), {
        ...options,
        method
      })

      logger.debug(`← ${response.status} ${url}`)
      return wrapResponse<T>(response)
    } catch (error: unknown) {
      const apiError = await parseApiError(error)
      const status = apiError.status ?? apiError.code ?? 'ERR'
      logger.error(`← ${status} ${url}: ${apiError.message}`)
      throw apiError
    }
  }

  return {
    setAuthToken: (token: string | null): void => {
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`
        logger.debug('Auth token set')
      } else {
        delete defaultHeaders['Authorization']
        logger.debug('Auth token cleared')
      }
    },
    setHeader: (key: string, value: string): void => {
      defaultHeaders[key] = value
    },
    removeHeader: (key: string): void => {
      delete defaultHeaders[key]
    },
    get: <T = unknown>(url: string, requestConfig?: ApiRequestConfig): Promise<ApiResponse<T>> =>
      request<T>('get', url, undefined, requestConfig),
    post: <T = unknown>(url: string, data?: unknown, requestConfig?: ApiRequestConfig): Promise<ApiResponse<T>> =>
      request<T>('post', url, data, requestConfig),
    put: <T = unknown>(url: string, data?: unknown, requestConfig?: ApiRequestConfig): Promise<ApiResponse<T>> =>
      request<T>('put', url, data, requestConfig),
    patch: <T = unknown>(url: string, data?: unknown, requestConfig?: ApiRequestConfig): Promise<ApiResponse<T>> =>
      request<T>('patch', url, data, requestConfig),
    delete: <T = unknown>(url: string, requestConfig?: ApiRequestConfig): Promise<ApiResponse<T>> =>
      request<T>('delete', url, undefined, requestConfig)
  }
}
