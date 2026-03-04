import { ApiResource } from '../ApiResource'

export type FriendshipStatus =
  | 'none'
  | 'pending_sent'
  | 'pending_received'
  | 'accepted'
  | 'blocked_by_me'
  | 'blocked_by_them'

export interface FriendEntry {
  id: number          // friendship row id
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

export class FriendResource extends ApiResource<FriendEntry> {
  protected readonly endpoint = '/api/friends'

  // GET /api/friends
  public async list() {
    return this.api.get<FriendListResponse>(this.endpoint)
  }

  // GET /api/friends/status/:targetUserId
  public async getStatus(targetUserId: number) {
    return this.api.get<FriendStatusResponse>(`${this.endpoint}/status/${targetUserId}`)
  }

  // POST /api/friends/:targetUserId — send or auto-accept request
  public async sendRequest(targetUserId: number) {
    return this.api.post<FriendActionResponse>(`${this.endpoint}/${targetUserId}`)
  }

  // PATCH /api/friends/:friendshipId/accept
  public async acceptRequest(friendshipId: number) {
    return this.api.patch<FriendActionResponse>(`${this.endpoint}/${friendshipId}/accept`)
  }

  // DELETE /api/friends/:friendshipId — decline / cancel / unfriend
  public async remove(friendshipId: number) {
    return this.api.delete<FriendActionResponse>(`${this.endpoint}/${friendshipId}`)
  }

  // POST /api/friends/:targetUserId/block
  public async block(targetUserId: number) {
    return this.api.post<FriendActionResponse>(`${this.endpoint}/${targetUserId}/block`)
  }

  // DELETE /api/friends/:targetUserId/block
  public async unblock(targetUserId: number) {
    return this.api.delete<FriendActionResponse>(`${this.endpoint}/${targetUserId}/block`)
  }
}

export const friendResource = new FriendResource()
export default friendResource
