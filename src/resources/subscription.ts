import type { Api, ApiResponse } from '../Api'

export type SubscriptionPlan = 'monthly' | 'yearly'

export interface SubscriptionStatus {
  plan: 'none' | 'monthly' | 'yearly'
  active: boolean
  expiresAt: string | null
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
}

export interface CreateIntentResponse {
  success: boolean
  data: {
    subscriptionId: string
    clientSecret: string
  }
}

export interface PortalResponse {
  success: boolean
  data: { url: string }
}

export interface SubscriptionResource {
  getStatus(): Promise<ApiResponse<{ success: boolean; data: SubscriptionStatus }>>
  createIntent(plan: SubscriptionPlan): Promise<ApiResponse<CreateIntentResponse>>
  cancelIntent(subscriptionId: string): Promise<ApiResponse<{ success: boolean }>>
  createPortal(): Promise<ApiResponse<PortalResponse>>
}

const endpoint = '/subscriptions' as const

export const createSubscriptionResource = (api: Api): SubscriptionResource => ({
  getStatus: () => api.get<{ success: boolean; data: SubscriptionStatus }>(`${endpoint}/status`),
  createIntent: (plan) => api.post<CreateIntentResponse>(`${endpoint}/create-intent`, { plan }),
  cancelIntent: (subscriptionId) => api.post<{ success: boolean }>(`${endpoint}/cancel-intent`, { subscriptionId }),
  createPortal: () => api.post<PortalResponse>(`${endpoint}/portal`),
})

export default createSubscriptionResource
