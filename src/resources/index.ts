import { createApi, type Api, type ApiConfig } from '../Api'
import { createAuthResource, type AuthResource, type AuthUser } from './auth'
import { createUserResource, type UserResource, type User, type UpdateProfileData, type GlobalRole, type UserResponse } from './user'
import { createRoomResource, type RoomResource, type RoomRole, type Room, type RoomMember, type CreateRoomData, type UpdateRoomData, type RoomResponse, type RoomsResponse, type RoomStaffResponse, type FeaturedRoomsResponse, type RoomUserState, type RoomBan, type RoomBansResponse, type RoomMute, type RoomMutesResponse, type ModerateUserData, type BanResponse, type MuteResponse, type BoothDJ, type BoothMedia, type WaitlistUser, type BoothState, type JoinMuteInfo, type JoinRoomResponse, type WaitlistResponse, type BoothResponse, type VoteResponse, type GrabResponse, type PlayHistoryItem, type PaginationMeta, type RoomHistoryResponse } from './room'
import { createChatResource, type ChatResource, type ChatMessage, type SendMessageData, type ChatMessagesResponse, type ChatMessageResponse } from './chat'
import { createPlaylistResource, type PlaylistResource, type MediaSource as PlaylistMediaSource, type MediaItem, type Playlist, type PlaylistsResponse, type PlaylistResponse, type MediaItemResponse, type AddMediaData, type ShuffleResponse, type ImportPlaylistData, type ImportResult, type ImportPlaylistResponse } from './playlist'
import { createSourceResource, type SourceResource, type MediaSource, type MediaSearchResult, type YouTubeSearchResponse, type YouTubeVideoResponse, type SoundCloudSearchResponse, type SoundCloudTrackResponse } from './source'
import { createShopResource, type ShopResource, type AvatarUnlockType, type AvatarCatalogItem, type AvatarCatalogResponse, type EquipAvatarData } from './shop'
import { createSubscriptionResource, type SubscriptionResource, type SubscriptionPlan, type SubscriptionStatus, type CreateIntentResponse, type PortalResponse } from './subscription'
import { createFriendResource, type FriendResource, type FriendshipStatus, type FriendEntry, type FriendList, type FriendListResponse, type FriendStatusResponse, type FriendActionResponse } from './friend'

export interface ApiClient {
  api: Api
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
    api,
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
export { createAuthResource, type AuthResource, type AuthUser } from './auth'
export { createUserResource, type UserResource, type User, type UpdateProfileData, type GlobalRole, type UserResponse } from './user'
export { createRoomResource, type RoomResource, type RoomRole, type Room, type RoomMember, type CreateRoomData, type UpdateRoomData, type RoomResponse, type RoomsResponse, type RoomStaffResponse, type FeaturedRoomsResponse, type RoomUserState, type RoomBan, type RoomBansResponse, type RoomMute, type RoomMutesResponse, type ModerateUserData, type BanResponse, type MuteResponse, type BoothDJ, type BoothMedia, type WaitlistUser, type BoothState, type JoinMuteInfo, type JoinRoomResponse, type WaitlistResponse, type BoothResponse, type VoteResponse, type GrabResponse, type PlayHistoryItem, type PaginationMeta, type RoomHistoryResponse } from './room'
export { createChatResource, type ChatResource, type ChatMessage, type SendMessageData, type ChatMessagesResponse, type ChatMessageResponse } from './chat'
export { createPlaylistResource, type PlaylistResource, type MediaItem, type Playlist, type PlaylistsResponse, type PlaylistResponse, type MediaItemResponse, type AddMediaData, type ShuffleResponse, type ImportPlaylistData, type ImportResult, type ImportPlaylistResponse } from './playlist'
export { createSourceResource, type SourceResource, type MediaSource, type MediaSearchResult, type YouTubeSearchResponse, type YouTubeVideoResponse, type SoundCloudSearchResponse, type SoundCloudTrackResponse } from './source'
export { createShopResource, type ShopResource, type AvatarUnlockType, type AvatarCatalogItem, type AvatarCatalogResponse, type EquipAvatarData } from './shop'
export { createSubscriptionResource, type SubscriptionResource, type SubscriptionPlan, type SubscriptionStatus, type CreateIntentResponse, type PortalResponse } from './subscription'
export { createFriendResource, type FriendResource, type FriendshipStatus, type FriendEntry, type FriendList, type FriendListResponse, type FriendStatusResponse, type FriendActionResponse } from './friend'
