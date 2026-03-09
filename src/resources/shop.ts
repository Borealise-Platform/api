import type { Api, ApiResponse } from '../Api'

export type AvatarUnlockType = 'free' | 'level' | 'subscription'

export interface AvatarCatalogItem {
  id: string
  unlockType: AvatarUnlockType
  requiredLevel: number | null
  unlocked: boolean
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

export interface ShopResource {
  getAvatarCatalog(): Promise<ApiResponse<AvatarCatalogResponse>>
  unlockAvatar(avatarId: string): Promise<ApiResponse<{ success: boolean; data: { avatarId: string; unlocked: boolean } }>>
  equipAvatar(avatarId: string): Promise<ApiResponse<{ success: boolean; data: { avatarId: string } }>>
}

const endpoint = '/shop' as const

export const createShopResource = (api: Api): ShopResource => ({
  getAvatarCatalog: () => api.get<AvatarCatalogResponse>(`${endpoint}/avatars`),
  unlockAvatar: (avatarId) => api.post<{ success: boolean; data: { avatarId: string; unlocked: boolean } }>(
    `${endpoint}/avatars/${avatarId}/unlock`
  ),
  equipAvatar: (avatarId) => api.patch<{ success: boolean; data: { avatarId: string } }>(
    `${endpoint}/avatars/equip`, { avatarId }
  ),
})

export default createShopResource
