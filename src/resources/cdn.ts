import type { Api, ApiResponse } from '../Api'

export type CdnFileStatus = 'pending' | 'processing' | 'ready' | 'failed'

export interface CdnFile {
  fileId: string
  originalName: string
  mimeType: string
  sizeBytes: number
  duration: number | null
  status: CdnFileStatus
  hlsUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface CdnFilesResponse {
  success: boolean
  data: {
    files: CdnFile[]
    total: number
    page: number
    limit: number
  }
}

export interface CdnFileResponse {
  success: boolean
  data: CdnFile
}

export interface CdnUploadResponse {
  success: boolean
  data: {
    fileId: string
    status: CdnFileStatus
  }
}

export interface CdnListParams {
  page?: number
  limit?: number
}

export interface CdnResource {
  listFiles(params?: CdnListParams): Promise<ApiResponse<CdnFilesResponse>>
  getFile(fileId: string): Promise<ApiResponse<CdnFileResponse>>
  uploadFile(file: File, onProgress?: (pct: number) => void): Promise<ApiResponse<CdnUploadResponse>>
  deleteFile(fileId: string): Promise<ApiResponse<{ success: boolean }>>
}

const endpoint = '/cdn' as const

export const createCdnResource = (api: Api): CdnResource => ({
  listFiles: (params = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return api.get<CdnFilesResponse>(`${endpoint}/files${qs ? `?${qs}` : ''}`)
  },

  getFile: (fileId) => api.get<CdnFileResponse>(`${endpoint}/files/${fileId}`),

  uploadFile: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<CdnUploadResponse>(`${endpoint}/upload`, form)
  },

  deleteFile: (fileId) => api.delete<{ success: boolean }>(`${endpoint}/files/${fileId}`),
})

export default createCdnResource
