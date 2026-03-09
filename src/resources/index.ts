import { createApi, type Api, type ApiConfig } from '../Api'
import { createAuthResource, type AuthResource } from './auth'
import { createUserResource, type UserResource } from './user'
import { createRoomResource, type RoomResource } from './room'
import { createChatResource, type ChatResource } from './chat'
import { createPlaylistResource, type PlaylistResource } from './playlist'
import { createSourceResource, type SourceResource } from './source'
import { createShopResource, type ShopResource } from './shop'
import { createSubscriptionResource, type SubscriptionResource } from './subscription'
import { createFriendResource, type FriendResource } from './friend'

export interface ApiClient {
  auth: AuthResource
  user: UserResource
  room: RoomResource
  chat: ChatResource
  playlist: PlaylistResource
  source: SourceResource
  shop: ShopResource
  subscription: SubscriptionResource
  friend: FriendResource
}

export const createApiClient = (config: ApiConfig): ApiClient => {
  const api = createApi(config)

  return {
    auth: createAuthResource(api),
    user: createUserResource(api),
    room: createRoomResource(api),
    chat: createChatResource(api),
    playlist: createPlaylistResource(api),
    source: createSourceResource(api),
    shop: createShopResource(api),
    subscription: createSubscriptionResource(api),
    friend: createFriendResource(api),
  }
}

export { createApi, type Api, type ApiConfig } from '../Api'
export { createAuthResource, type AuthResource } from './auth'
export { createUserResource, type UserResource } from './user'
export { createRoomResource, type RoomResource } from './room'
export { createChatResource, type ChatResource } from './chat'
export { createPlaylistResource, type PlaylistResource } from './playlist'
export { createSourceResource, type SourceResource } from './source'
export { createShopResource, type ShopResource } from './shop'
export { createSubscriptionResource, type SubscriptionResource } from './subscription'
export { createFriendResource, type FriendResource } from './friend'
