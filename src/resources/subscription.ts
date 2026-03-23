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

export interface CreateGiftCheckoutResponse {
  success: boolean
  data: {
    checkoutUrl: string
    sessionId: string
  }
}

export interface GiftHistoryEntry {
  giftItemId: number
  purchaseId: number
  status: string
  startsAt: string
  endsAt: string
  createdAt: string
  isAnonymous: boolean
  recipientUsername: string | null
  purchaserUsername: string | null
}

export interface GiftsHistoryResponse {
  success: boolean
  data: {
    purchased: GiftHistoryEntry[]
    received: GiftHistoryEntry[]
    failedPurchases: Array<{
      purchaseId: number
      recipientUsername: string
      quantity: number
      createdAt: string
    }>
    supporterBadge: {
      tier: 'none' | 'bronze' | 'silver' | 'gold'
      giftedCount: number
      nextTierAt: number | null
    }
  }
}

export interface SubscriptionResource {
  getStatus(): Promise<ApiResponse<{ success: boolean; data: SubscriptionStatus }>>
  createIntent(plan: SubscriptionPlan): Promise<ApiResponse<CreateIntentResponse>>
  cancelIntent(subscriptionId: string): Promise<ApiResponse<{ success: boolean }>>
  createPortal(): Promise<ApiResponse<PortalResponse>>
  createGiftCheckout(recipientUsername: string, quantity: 1 | 5 | 10 | 20, isAnonymous?: boolean): Promise<ApiResponse<CreateGiftCheckoutResponse>>
  getGiftsHistory(): Promise<ApiResponse<GiftsHistoryResponse>>
  retryGiftAssignment(purchaseId: number, recipientUsername?: string): Promise<ApiResponse<{ success: boolean; data: { ok: true } }>>
}

const endpoint = '/subscriptions' as const

export const createSubscriptionResource = (api: Api): SubscriptionResource => ({
  getStatus: () => api.get<{ success: boolean; data: SubscriptionStatus }>(`${endpoint}/status`),
  createIntent: (plan) => api.post<CreateIntentResponse>(`${endpoint}/create-intent`, { plan }),
  cancelIntent: (subscriptionId) => api.post<{ success: boolean }>(`${endpoint}/cancel-intent`, { subscriptionId }),
  createPortal: () => api.post<PortalResponse>(`${endpoint}/portal`),
  createGiftCheckout: (recipientUsername, quantity, isAnonymous = false) => api.post<CreateGiftCheckoutResponse>(`${endpoint}/create-gift-checkout`, {
    recipientUsername,
    quantity,
    isAnonymous,
  }),
  getGiftsHistory: () => api.get<GiftsHistoryResponse>(`${endpoint}/gifts-history`),
  retryGiftAssignment: (purchaseId, recipientUsername) => api.post<{ success: boolean; data: { ok: true } }>(`${endpoint}/retry-gift-assignment`, {
    purchaseId,
    recipientUsername,
  }),
})

export default createSubscriptionResource
