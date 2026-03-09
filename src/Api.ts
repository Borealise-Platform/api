import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Logger } from './Logger'

export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  /** Set to false to suppress all log output. Defaults to true. */
  logging?: boolean
}

export interface ApiResponse<T = unknown> {
  data: T
  status: number
  headers: Record<string, string>
}

export interface BackendErrorResponse {
  success: false
  error: string
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
  private readonly axios: AxiosInstance
  private readonly logger: Logger
  private readonly config: ApiConfig

  public constructor(config: ApiConfig) {
    this.config = config
    this.logger = new Logger('Api')

    if (config.logging === false) {
      this.logger.disable()
    }

    this.axios = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    })

    this.setupInterceptors()
    this.logger.success(`initialized (baseURL: ${config.baseURL})`)
  }

  private setupInterceptors(): void {
    this.axios.interceptors.request.use(
      (config) => {
        this.logger.debug(`→ ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        this.logger.error('Request error', error)
        return Promise.reject(error)
      }
    )

    this.axios.interceptors.response.use(
      (response) => {
        this.logger.debug(`← ${response.status} ${response.config.url}`)
        return response
      },
      (error: AxiosError) => {
        const apiError = this.parseError(error)
        const status = apiError.status ?? apiError.code ?? 'ERR'
        this.logger.error(`← ${status} ${error.config?.url}: ${apiError.message}`)
        return Promise.reject(apiError)
      }
    )
  }

  private parseError(error: AxiosError): ApiError {
    if (error.response) {
      const responseData = error.response.data as BackendErrorResponse | { message?: string } | undefined

      let message: string
      let backendResponse: BackendErrorResponse | undefined

      if (responseData && 'error' in responseData && responseData.error) {
        message = responseData.error
        backendResponse = responseData as BackendErrorResponse
      } else if (responseData && 'message' in responseData && responseData.message) {
        message = responseData.message
      } else {
        message = error.message
      }

      return new ApiError(message, error.response.status, error.code, backendResponse)
    }

    if (error.request) {
      return new ApiError('No response received from server', undefined, 'NETWORK_ERROR')
    }

    return new ApiError(error.message, undefined, error.code)
  }

  public setAuthToken(token: string | null): void {
    if (token) {
      this.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      this.logger.debug('Auth token set')
    } else {
      delete this.axios.defaults.headers.common['Authorization']
      this.logger.debug('Auth token cleared')
    }
  }

  public setHeader(key: string, value: string): void {
    this.axios.defaults.headers.common[key] = value
  }

  public removeHeader(key: string): void {
    delete this.axios.defaults.headers.common[key]
  }

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axios.get<T>(url, config)
    return this.wrapResponse(response)
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axios.post<T>(url, data, config)
    return this.wrapResponse(response)
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axios.put<T>(url, data, config)
    return this.wrapResponse(response)
  }

  public async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axios.patch<T>(url, data, config)
    return this.wrapResponse(response)
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axios.delete<T>(url, config)
    return this.wrapResponse(response)
  }

  private wrapResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>
    }
  }

  public get axiosInstance(): AxiosInstance {
    return this.axios
  }
}

export const createApi = (config: ApiConfig): Api => new Api(config)

export default Api
