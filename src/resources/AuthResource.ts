import { ApiResource } from '../ApiResource'

export interface AuthUser {
  id: number
  email?: string
  username: string
  displayName: string | null
  avatarId: string
  bio: string | null
  globalRole: string
  xp: number
  level: number
  flags?: number | null
  subscriptionType?: string | null
  subscriptionMonths?: number
  subscriptionExpiresAt?: string | null
  emailVerified?: boolean
  createdAt?: string
}

export interface LoginCredentials {
  login: string  // Email or username
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  displayName?: string
  token: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  data: {
    user: AuthUser
    accessToken: string
    refreshToken: string
    expiresAt: string
  }
}

export interface RefreshResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    expiresAt: string
  }
}

export interface MeResponse {
  success: boolean
  data: {
    user: AuthUser
  }
}

export class AuthResource extends ApiResource<AuthUser> {
  protected readonly endpoint = '/auth'

  // POST /api/auth/login
  public async login(credentials: LoginCredentials) {
    return this.post<AuthResponse>('login', credentials)
  }

  // POST /api/auth/register
  public async register(data: RegisterData) {
    return this.post<AuthResponse>('register', data)
  }

  // POST /api/auth/refresh
  public async refresh(refreshToken: string) {
    return this.post<RefreshResponse>('refresh', { refreshToken })
  }

  // POST /api/auth/logout
  public async logout() {
    return this.post<{ success: boolean; message: string }>('logout')
  }

  // GET /api/auth/me
  public async me() {
    return this.get<MeResponse>('me')
  }
}

// Singleton instance
export const authResource = new AuthResource()
export default authResource
