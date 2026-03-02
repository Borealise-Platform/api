import { ApiResource } from '../ApiResource'

export type AvatarUnlockType = 'free' | 'level' | 'subscription'

export interface AvatarCatalogItem {
  id: string
  unlockType: AvatarUnlockType
  requiredLevel: number | null
  /** Whether the user has unlocked (or has free access to) this avatar */
  unlocked: boolean
  /** Whether the user currently meets the requirement to unlock it */
  eligible: boolean
}

export interface AvatarCatalogResponse {
  success: boolean
  data: {
    avatars: AvatarCatalogItem[]
    level: number
    xp: number
  }
}

export interface EquipAvatarData {
  avatarId: string
}

export class ShopResource extends ApiResource {
  protected readonly endpoint = '/shop'

  // GET /api/shop/avatars
  public async getAvatarCatalog() {
    return this.api.get<AvatarCatalogResponse>(`${this.endpoint}/avatars`)
  }

  // POST /api/shop/avatars/:avatarId/unlock
  public async unlockAvatar(avatarId: string) {
    return this.api.post<{ success: boolean; data: { avatarId: string; unlocked: boolean } }>(`${this.endpoint}/avatars/${avatarId}/unlock`)
  }

  // PATCH /api/shop/avatars/equip
  public async equipAvatar(avatarId: string) {
    return this.api.patch<{ success: boolean; data: { avatarId: string } }>(`${this.endpoint}/avatars/equip`, { avatarId } satisfies EquipAvatarData)
  }
}

// Singleton instance
export const shopResource = new ShopResource()
export default shopResource
