import type { Api, ApiResponse } from '../Api'
import type { AuthUser } from './auth'
import type { AccountViolation } from './admin'

export interface User extends AuthUser {}

/**
 * Public user profile — never contains private fields (email, flags, etc.)
 */
export interface PublicUser {
  id: number
  username: string
  displayName: string | null
  avatarId: string
  bio: string | null
  globalRole: string
  xp: number
  level: number
  subscriptionType?: string | null
  subscriptionMonths?: number | null
  currentRoomSlug?: string | null
  createdAt?: string
  friendsCount: number
}

/**
 * A friend entry as shown on a public profile.
 */
export interface PublicProfileFriend {
  id: number
  username: string
  displayName: string | null
  avatarId: string
  level: number
}

export interface UpdateProfileData {
  displayName?: string
  bio?: string
}

export type GlobalRole = 'user' | 'moderator' | 'admin' | 'owner'

export interface UserResponse {
  success: boolean
  data: {
    user: PublicUser
    friends: PublicProfileFriend[]
  }
}

export interface MyViolation {
  id: number
  adminUsername: string
  reason: string
  revoked: boolean
  revokedAt: string | null
  createdAt: string
}

export interface MyViolationsResponse {
  success: boolean
  data: {
    violations: MyViolation[]
    permanentBan: boolean
  }
}

export interface UserResource {
  getById(id: number): Promise<ApiResponse<UserResponse>>
  getByUsername(username: string): Promise<ApiResponse<UserResponse>>
  updateProfile(data: UpdateProfileData): Promise<ApiResponse<UserResponse>>
  deleteAccount(): Promise<ApiResponse<{ success: boolean; message: string }>>
  updateRole(id: number, role: GlobalRole): Promise<ApiResponse<UserResponse>>
  disable(id: number): Promise<ApiResponse<{ success: boolean; data: null }>>
  getMyViolations(): Promise<ApiResponse<MyViolationsResponse>>
}

const endpoint = '/users' as const

export const createUserResource = (api: Api): UserResource => ({
  getById: (id) => api.get<UserResponse>(`${endpoint}/${id}`),
  getByUsername: (username) => api.get<UserResponse>(`${endpoint}/username/${username}`),
  updateProfile: (data) => api.patch<UserResponse>(`${endpoint}/me`, data),
  deleteAccount: () => api.delete<{ success: boolean; message: string }>(`${endpoint}/me`),
  updateRole: (id, role) => api.patch<UserResponse>(`/api/admin/users/${id}/role`, { role }),
  disable: (id) => api.post<{ success: boolean; data: null }>(`/api/admin/users/${id}/disable`),
  getMyViolations: () => api.get<MyViolationsResponse>(`${endpoint}/me/violations`),
})

export default createUserResource
