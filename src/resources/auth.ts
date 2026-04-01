import type { Api, ApiResponse } from '../Api'

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
  login: string
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

export interface AuthResource {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>>
  register(data: RegisterData): Promise<ApiResponse<AuthResponse>>
  refresh(refreshToken?: string): Promise<ApiResponse<RefreshResponse>>
  logout(): Promise<ApiResponse<{ success: boolean; message: string }>>
  me(): Promise<ApiResponse<MeResponse>>
  forgotPassword(email: string): Promise<ApiResponse<{ success: boolean }>>
  resetPassword(token: string, password: string): Promise<ApiResponse<{ success: boolean }>>
}

const endpoint = '/auth' as const

export const createAuthResource = (api: Api): AuthResource => ({
  login: (credentials) => api.post<AuthResponse>(`${endpoint}/login`, credentials),
  register: (data) => api.post<AuthResponse>(`${endpoint}/register`, data),
  refresh: (refreshToken) => api.post<RefreshResponse>(`${endpoint}/refresh`, refreshToken ? { refreshToken } : {}),
  logout: () => api.post<{ success: boolean; message: string }>(`${endpoint}/logout`),
  me: () => api.get<MeResponse>(`${endpoint}/me`),
  forgotPassword: (email) => api.post<{ success: boolean }>(`${endpoint}/forgot-password`, { email }),
  resetPassword: (token, password) => api.post<{ success: boolean }>(`${endpoint}/reset-password`, { token, password }),
})

export default createAuthResource
