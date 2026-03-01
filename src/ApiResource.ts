import { Api, ApiResponse, ApiError } from './Api'
import { Logger } from './Logger'
import { AxiosRequestConfig } from 'axios'

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    lastPage: number
  }
}

export interface ResourceOptions {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

export abstract class ApiResource<T = unknown> {
  private _logger: Logger | null = null

  protected abstract readonly endpoint: string

  protected get api(): Api {
    return Api.getInstance()
  }

  protected get logger(): Logger {
    if (!this._logger) {
      this._logger = Logger.create(this.constructor.name)
    }
    return this._logger
  }

  protected buildUrl(path?: string | number): string {
    if (path !== undefined) {
      return `${this.endpoint}/${path}`
    }
    return this.endpoint
  }

  protected buildConfig(options?: ResourceOptions): AxiosRequestConfig {
    return {
      params: options?.params,
      headers: options?.headers
    }
  }

  public async index(options?: ResourceOptions): Promise<ApiResponse<T[]>> {
    this.logger.debug('index')
    return this.api.get<T[]>(this.endpoint, this.buildConfig(options))
  }

  public async paginate(page = 1, perPage = 15, options?: ResourceOptions): Promise<ApiResponse<PaginatedResponse<T>>> {
    this.logger.debug(`paginate (page: ${page}, perPage: ${perPage})`)
    return this.api.get<PaginatedResponse<T>>(this.endpoint, {
      ...this.buildConfig(options),
      params: { page, per_page: perPage, ...options?.params }
    })
  }

  public async show(id: string | number, options?: ResourceOptions): Promise<ApiResponse<T>> {
    this.logger.debug(`show (id: ${id})`)
    return this.api.get<T>(this.buildUrl(id), this.buildConfig(options))
  }

  public async store(data: Partial<T>, options?: ResourceOptions): Promise<ApiResponse<T>> {
    this.logger.debug('store')
    return this.api.post<T>(this.endpoint, data, this.buildConfig(options))
  }

  public async update(id: string | number, data: Partial<T>, options?: ResourceOptions): Promise<ApiResponse<T>> {
    this.logger.debug(`update (id: ${id})`)
    return this.api.put<T>(this.buildUrl(id), data, this.buildConfig(options))
  }

  public async patch(id: string | number, data: Partial<T>, options?: ResourceOptions): Promise<ApiResponse<T>> {
    this.logger.debug(`patch (id: ${id})`)
    return this.api.patch<T>(this.buildUrl(id), data, this.buildConfig(options))
  }

  public async destroy(id: string | number, options?: ResourceOptions): Promise<ApiResponse<void>> {
    this.logger.debug(`destroy (id: ${id})`)
    return this.api.delete<void>(this.buildUrl(id), this.buildConfig(options))
  }

  protected async get<R = T>(path: string, options?: ResourceOptions): Promise<ApiResponse<R>> {
    return this.api.get<R>(`${this.endpoint}/${path}`, this.buildConfig(options))
  }

  protected async post<R = T>(path: string, data?: unknown, options?: ResourceOptions): Promise<ApiResponse<R>> {
    return this.api.post<R>(`${this.endpoint}/${path}`, data, this.buildConfig(options))
  }

  protected async put<R = T>(path: string, data?: unknown, options?: ResourceOptions): Promise<ApiResponse<R>> {
    return this.api.put<R>(`${this.endpoint}/${path}`, data, this.buildConfig(options))
  }

  protected async delete<R = void>(path: string, options?: ResourceOptions): Promise<ApiResponse<R>> {
    return this.api.delete<R>(`${this.endpoint}/${path}`, this.buildConfig(options))
  }
}

export { ApiError }
export default ApiResource
