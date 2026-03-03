import { ApiResource } from '../ApiResource'

export type SubscriptionPlan = 'monthly' | 'yearly'

export interface SubscriptionStatus {
  plan: 'none' | 'monthly' | 'yearly'
  active: boolean
  expiresAt: string | null
  cancelAtPeriodEnd: boolean
  currentPeriodEnd: string | null
}

export interface CheckoutResponse {
  success: boolean
  data: { url: string }
}

export interface PortalResponse {
  success: boolean
  data: { url: string }
}

export class SubscriptionResource extends ApiResource {
  protected readonly endpoint = '/subscriptions'

  // GET /api/subscriptions/status
  public async getStatus() {
    return this.api.get<{ success: boolean; data: SubscriptionStatus }>(`${this.endpoint}/status`)
  }

  // POST /api/subscriptions/checkout
  public async createCheckout(plan: SubscriptionPlan) {
    return this.api.post<CheckoutResponse>(`${this.endpoint}/checkout`, { plan })
  }

  // POST /api/subscriptions/portal
  public async createPortal() {
    return this.api.post<PortalResponse>(`${this.endpoint}/portal`)
  }
}

// Singleton instance
export const subscriptionResource = new SubscriptionResource()
export default subscriptionResource
