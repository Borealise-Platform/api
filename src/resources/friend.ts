import type { Api, ApiResponse } from '../Api'

export type FriendshipStatus =
  | 'none'
  | 'pending_sent'
  | 'pending_received'
  | 'accepted'
  | 'blocked_by_me'
  | 'blocked_by_them'

export interface FriendEntry {
  id: number
  userId: number
  username: string
  displayName: string | null
  avatarId: string
  level: number
  status: 'pending' | 'accepted' | 'blocked'
  isSender: boolean
}

export interface FriendList {
  friends: FriendEntry[]
  pendingReceived: FriendEntry[]
  pendingSent: FriendEntry[]
}

export interface FriendListResponse {
  success: boolean
  data: FriendList
}

export interface FriendStatusResponse {
  success: boolean
  data: {
    status: FriendshipStatus
    friendshipId: number | null
  }
}

export interface FriendActionResponse {
  success: boolean
  data: {
    status: FriendshipStatus
  } | null
}

export interface FriendResource {
  list(): Promise<ApiResponse<FriendListResponse>>
  getStatus(targetUserId: number): Promise<ApiResponse<FriendStatusResponse>>
  sendRequest(targetUserId: number): Promise<ApiResponse<FriendActionResponse>>
  acceptRequest(friendshipId: number): Promise<ApiResponse<FriendActionResponse>>
  remove(friendshipId: number): Promise<ApiResponse<FriendActionResponse>>
  block(targetUserId: number): Promise<ApiResponse<FriendActionResponse>>
  unblock(targetUserId: number): Promise<ApiResponse<FriendActionResponse>>
}

const endpoint = '/friends' as const

export const createFriendResource = (api: Api): FriendResource => ({
  list: () => api.get<FriendListResponse>(endpoint),
  getStatus: (targetUserId) => api.get<FriendStatusResponse>(`${endpoint}/status/${targetUserId}`),
  sendRequest: (targetUserId) => api.post<FriendActionResponse>(`${endpoint}/${targetUserId}`),
  acceptRequest: (friendshipId) => api.patch<FriendActionResponse>(`${endpoint}/${friendshipId}/accept`),
  remove: (friendshipId) => api.delete<FriendActionResponse>(`${endpoint}/${friendshipId}`),
  block: (targetUserId) => api.post<FriendActionResponse>(`${endpoint}/${targetUserId}/block`),
  unblock: (targetUserId) => api.delete<FriendActionResponse>(`${endpoint}/${targetUserId}/block`),
})

export default createFriendResource
