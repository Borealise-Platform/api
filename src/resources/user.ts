import type { Api, ApiResponse } from '../Api'
import type { AuthUser } from './auth'

export interface User extends AuthUser {}

export interface UpdateProfileData {
  displayName?: string
  bio?: string
}

export type GlobalRole = 'user' | 'moderator' | 'admin' | 'owner'

export interface UserResponse {
  success: boolean
  data: {
    user: User
  }
}

export interface UserResource {
  getById(id: number): Promise<ApiResponse<UserResponse>>
  getByUsername(username: string): Promise<ApiResponse<UserResponse>>
  updateProfile(data: UpdateProfileData): Promise<ApiResponse<UserResponse>>
  deleteAccount(): Promise<ApiResponse<{ success: boolean; message: string }>>
  updateRole(id: number, role: GlobalRole): Promise<ApiResponse<UserResponse>>
  disable(id: number): Promise<ApiResponse<{ success: boolean; data: null }>>
}

const endpoint = '/users' as const

export const createUserResource = (api: Api): UserResource => ({
  getById: (id) => api.get<UserResponse>(`${endpoint}/${id}`),
  getByUsername: (username) => api.get<UserResponse>(`${endpoint}/username/${username}`),
  updateProfile: (data) => api.patch<UserResponse>(`${endpoint}/me`, data),
  deleteAccount: () => api.delete<{ success: boolean; message: string }>(`${endpoint}/me`),
  updateRole: (id, role) => api.patch<UserResponse>(`/api/admin/users/${id}/role`, { role }),
  disable: (id) => api.post<{ success: boolean; data: null }>(`/api/admin/users/${id}/disable`),
})

export default createUserResource
