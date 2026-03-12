import type { Api, ApiResponse } from '../Api'
import type { GlobalRole } from './user'

export interface AdminUserEntry {
  id: number
  username: string
  displayName: string | null
  email?: string
  avatarId: string
  globalRole: GlobalRole
  disabled: boolean
  emailVerified: boolean
  xp: number
  createdAt: string
}

export interface AdminUsersResponse {
  success: boolean
  data: {
    users: AdminUserEntry[]
    total: number
  }
}

export interface AdminStatsRoom {
  slug: string
  name: string
  population: number
}

export interface AdminStatsResponse {
  success: boolean
  data: {
    activeRooms: number
    totalOnlineUsers: number
    rooms: AdminStatsRoom[]
  }
}

export interface AdminListUsersParams {
  search?: string
  role?: GlobalRole | ''
  disabled?: boolean
  page?: number
  limit?: number
  sortBy?: 'id' | 'username' | 'createdAt'
  sortDir?: 'asc' | 'desc'
}

export interface AdminResource {
  listUsers(params?: AdminListUsersParams): Promise<ApiResponse<AdminUsersResponse>>
  enableUser(id: number): Promise<ApiResponse<{ success: boolean; data: null }>>
  disableUser(id: number): Promise<ApiResponse<{ success: boolean; data: null }>>
  updateRole(id: number, role: GlobalRole): Promise<ApiResponse<{ success: boolean; data: null }>>
  broadcast(message: string): Promise<ApiResponse<{ success: boolean; data: { sent_to_rooms: number } }>>
  setMaintenance(active: boolean, message?: string, endsAt?: number | null): Promise<ApiResponse<{ success: boolean; data: { active: boolean } }>>
  getStats(): Promise<ApiResponse<AdminStatsResponse>>
}

const endpoint = '/admin' as const

export const createAdminResource = (api: Api): AdminResource => ({
  listUsers: (params = {}) => {
    const query = new URLSearchParams()
    if (params.search) query.set('search', params.search)
    if (params.role) query.set('role', params.role)
    if (params.disabled !== undefined) query.set('disabled', String(params.disabled))
    if (params.page) query.set('page', String(params.page))
    if (params.limit) query.set('limit', String(params.limit))
    if (params.sortBy) query.set('sortBy', params.sortBy)
    if (params.sortDir) query.set('sortDir', params.sortDir)
    const qs = query.toString()
    return api.get<AdminUsersResponse>(`${endpoint}/users${qs ? `?${qs}` : ''}`)
  },
  enableUser: (id) => api.post<{ success: boolean; data: null }>(`${endpoint}/users/${id}/enable`),
  disableUser: (id) => api.post<{ success: boolean; data: null }>(`${endpoint}/users/${id}/disable`),
  updateRole: (id, role) => api.patch<{ success: boolean; data: null }>(`${endpoint}/users/${id}/role`, { role }),
  broadcast: (message) => api.post<{ success: boolean; data: { sent_to_rooms: number } }>(`${endpoint}/broadcast`, { message }),
  setMaintenance: (active, message, endsAt) =>
    api.post<{ success: boolean; data: { active: boolean } }>(`${endpoint}/maintenance`, { active, message, endsAt }),
  getStats: () => api.get<AdminStatsResponse>(`${endpoint}/stats`),
})

export default createAdminResource
