import { ApiResource } from '../ApiResource'
import type { AuthUser } from './AuthResource'

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

export class UserResource extends ApiResource<User> {
  protected readonly endpoint = '/users'

  // GET /api/users/:id
  public async getById(id: number) {
    return this.show(id)
  }

  // GET /api/users/username/:username
  public async getByUsername(username: string) {
    return this.get<UserResponse>(`username/${username}`)
  }

  // PATCH /api/users/me
  public async updateProfile(data: UpdateProfileData) {
    return this.api.patch<UserResponse>(`${this.endpoint}/me`, data)
  }

  // DELETE /api/users/me
  public async deleteAccount() {
    return this.api.delete<{ success: boolean; message: string }>(`${this.endpoint}/me`)
  }

  // ============================================
  // Admin methods
  // ============================================

  // PATCH /api/admin/users/:id/role
  public async updateRole(id: number, role: GlobalRole) {
    return this.api.patch<UserResponse>(`/api/admin/users/${id}/role`, { role })
  }

  // POST /api/admin/users/:id/disable
  public async disable(id: number) {
    return this.api.post<{ success: boolean; data: null }>(`/api/admin/users/${id}/disable`)
  }
}

// Singleton instance
export const userResource = new UserResource()
export default userResource
