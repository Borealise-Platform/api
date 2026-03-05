import { ApiResource } from '../ApiResource'

export type RoomRole = 'user' | 'resident_dj' | 'bouncer' | 'manager' | 'cohost' | 'host'

export interface Room {
  id: number
  slug: string
  name: string
  description: string | null
  welcomeMessage: string | null
  hostId: number
  minChatLevel: number
  isPrivate: boolean
  isNsfw: boolean
  waitlistLocked: boolean
  waitlistCycleEnabled: boolean
  population: number
  totalPlays: number
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface RoomMember {
  id: number
  roomId: number
  userId: number
  role: RoomRole
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    username: string
    displayName: string | null
    avatarId: string
    level: number
  }
}

export interface CreateRoomData {
  slug: string
  name: string
  description?: string
  welcomeMessage?: string
  isPrivate?: boolean
  isNsfw?: boolean
}

export interface UpdateRoomData {
  name?: string
  description?: string
  welcomeMessage?: string
  minChatLevel?: number
  isPrivate?: boolean
  isNsfw?: boolean
  waitlistLocked?: boolean
  waitlistCycleEnabled?: boolean
}

export interface RoomResponse {
  success: boolean
  data: {
    room: Room
  }
}

export interface RoomsResponse {
  success: boolean
  data: {
    rooms: Room[]
  }
}

export interface RoomStaffResponse {
  success: boolean
  data: {
    staff: RoomMember[]
  }
}

export interface FeaturedRoomsResponse {
  success: boolean
  data: {
    rooms: Room[]
  }
}

export interface RoomUserState {
  userId: number
  username: string
  displayName: string | null
  avatarId: string
  level: number
  xp: number
  bio: string | null
  globalRole: string
  flags?: number | null
  role: RoomRole
  subscriptionType?: string | null
  subscriptionMonths?: number
  joinedAt: number
}

export interface RoomBan {
  id: number
  userId: number
  modById: number
  reason: string | null
  duration: number | null
  expiresAt: string | null
  createdAt: string
  username: string
  displayName: string | null
}

export interface RoomBansResponse {
  success: boolean
  data: {
    bans: RoomBan[]
  }
}

export interface ModerateUserData {
  reason?: string
  duration?: number
}

export interface BanResponse {
  success: boolean
  data: {
    userId: number
    bannedUntil: string | null
    permanent: boolean
  }
}

export interface MuteResponse {
  success: boolean
  data: {
    userId: number
    mutedUntil: string | undefined
    duration: number
  }
}

// Booth/DJ types
export interface BoothDJ {
  userId: number
  username: string
  displayName: string | null
  avatarId: string
  role: RoomRole
  level?: number
  xp?: number
  globalRole?: string
}

export interface BoothMedia {
  id: number
  source: 'youtube' | 'soundcloud'
  sourceId: string
  title: string
  artist: string | null
  duration: number
  thumbnail: string | null
  elapsed: number
}

export interface WaitlistUser {
  id: number
  username: string
  displayName: string | null
}

export interface BoothState {
  dj: BoothDJ | null
  media: BoothMedia | null
  waitlist: number[]
  votes: {
    woots: number
    mehs: number
    grabs: number
  }
}

export interface JoinRoomResponse {
  success: boolean
  data: {
    room: {
      id: number
      slug: string
      name: string
      waitlistLocked: boolean
      waitlistCycleEnabled: boolean
    }
    role: RoomRole
    users: RoomUserState[]
    booth: BoothState
  }
}

export interface WaitlistResponse {
  success: boolean
  data: {
    waitlist: WaitlistUser[]
    locked: boolean
  }
}

export interface BoothResponse {
  success: boolean
  data: BoothState
}

export interface VoteResponse {
  success: boolean
  data: {
    vote: 'woot' | 'meh'
    votes: {
      woots: number
      mehs: number
      grabs: number
    }
  }
}

export interface GrabResponse {
  success: boolean
  data: {
    playlistId: number
    message: string
  }
}

export interface PlayHistoryItem {
  id: number
  userId: number
  username: string
  displayName: string | null
  avatarId: string
  media: {
    id: number
    source: 'youtube' | 'soundcloud'
    sourceId: string
    title: string
    artist: string | null
    duration: number
    thumbnail: string | null
  }
  woots: number
  mehs: number
  grabs: number
  skipped: boolean
  startedAt: string
  endedAt: string | null
}

export interface RoomHistoryResponse {
  success: boolean
  data: {
    history: PlayHistoryItem[]
    total: number
  }
}

export class RoomResource extends ApiResource<Room> {
  protected readonly endpoint = '/rooms'

  // GET /api/rooms - List all rooms
  public async list() {
    return this.get<RoomsResponse>('')
  }

  // GET /api/rooms/featured - Get featured rooms
  public async featured() {
    return this.get<FeaturedRoomsResponse>('featured')
  }

  // GET /api/rooms/:slug - Get room by slug
  public async getBySlug(slug: string) {
    return this.get<RoomResponse>(slug)
  }

  // POST /api/rooms - Create a new room
  public async create(data: CreateRoomData) {
    return this.post<RoomResponse>('', data)
  }

  // PATCH /api/rooms/:slug - Update room
  public async updateRoom(slug: string, data: UpdateRoomData) {
    return this.api.patch<RoomResponse>(`${this.endpoint}/${slug}`, data)
  }

  // DELETE /api/rooms/:slug - Delete room
  public async deleteRoom(slug: string) {
    return this.api.delete<{ success: boolean }>(`${this.endpoint}/${slug}`)
  }

  // GET /api/rooms/:slug/staff - Get room staff
  public async getStaff(slug: string) {
    return this.get<RoomStaffResponse>(`${slug}/staff`)
  }

  // ============================================
  // Moderation methods
  // ============================================

  // GET /api/rooms/:slug/bans
  public async getBans(slug: string) {
    return this.get<RoomBansResponse>(`${slug}/bans`)
  }

  // PATCH /api/rooms/:slug/users/:userId/role
  public async updateUserRole(slug: string, userId: number, role: RoomRole) {
    return this.api.patch<{ success: boolean; data: { userId: number; role: RoomRole } }>(
      `${this.endpoint}/${slug}/users/${userId}/role`,
      { role },
    )
  }

  // POST /api/rooms/:slug/users/:userId/ban
  public async ban(slug: string, userId: number, data?: ModerateUserData) {
    return this.api.post<BanResponse>(`${this.endpoint}/${slug}/users/${userId}/ban`, data || {})
  }

  // DELETE /api/rooms/:slug/users/:userId/ban
  public async unban(slug: string, userId: number) {
    return this.api.delete<{ success: boolean; data: { userId: number } }>(
      `${this.endpoint}/${slug}/users/${userId}/ban`,
    )
  }

  // POST /api/rooms/:slug/users/:userId/mute
  public async mute(slug: string, userId: number, data?: ModerateUserData) {
    return this.api.post<MuteResponse>(`${this.endpoint}/${slug}/users/${userId}/mute`, data || {})
  }

  // DELETE /api/rooms/:slug/users/:userId/mute
  public async unmute(slug: string, userId: number) {
    return this.api.delete<{ success: boolean; data: { userId: number } }>(
      `${this.endpoint}/${slug}/users/${userId}/mute`,
    )
  }

  // POST /api/rooms/:slug/users/:userId/kick
  public async kick(slug: string, userId: number) {
    return this.api.post<{ success: boolean; data: { userId: number } }>(
      `${this.endpoint}/${slug}/users/${userId}/kick`,
    )
  }

  // POST /api/rooms/:slug/join - Join a room (session-based)
  public async join(slug: string) {
    return this.post<JoinRoomResponse>(`${slug}/join`)
  }

  // POST /api/rooms/:slug/leave - Leave a room
  public async leave(slug: string) {
    return this.post<{ success: boolean }>(`${slug}/leave`)
  }

  // ============================================
  // Waitlist methods
  // ============================================

  // GET /api/rooms/:slug/waitlist
  public async getWaitlist(slug: string) {
    return this.get<WaitlistResponse>(`${slug}/waitlist`)
  }

  // POST /api/rooms/:slug/waitlist/join
  public async joinWaitlist(slug: string) {
    return this.post<{ success: boolean; data: { position: number } }>(`${slug}/waitlist/join`)
  }

  // POST /api/rooms/:slug/waitlist/leave
  public async leaveWaitlist(slug: string) {
    return this.post<{ success: boolean }>(`${slug}/waitlist/leave`)
  }

  // PATCH /api/rooms/:slug/waitlist - Move user in waitlist
  public async moveInWaitlist(slug: string, userId: number, position: number) {
    return this.api.patch<{ success: boolean; data: { waitlist: WaitlistUser[] } }>(`${this.endpoint}/${slug}/waitlist`, { userId, position })
  }

  // DELETE /api/rooms/:slug/waitlist/:userId - Remove user from waitlist
  public async removeFromWaitlist(slug: string, userId: number) {
    return this.api.delete<{ success: boolean }>(`${this.endpoint}/${slug}/waitlist/${userId}`)
  }

  // POST /api/rooms/:slug/waitlist/lock
  public async lockWaitlist(slug: string) {
    return this.post<{ success: boolean; data: { locked: boolean } }>(`${slug}/waitlist/lock`)
  }

  // POST /api/rooms/:slug/waitlist/unlock
  public async unlockWaitlist(slug: string) {
    return this.post<{ success: boolean; data: { locked: boolean } }>(`${slug}/waitlist/unlock`)
  }

  // ============================================
  // Booth methods
  // ============================================

  // GET /api/rooms/:slug/booth
  public async getBooth(slug: string) {
    return this.get<BoothResponse>(`${slug}/booth`)
  }

  // POST /api/rooms/:slug/booth/skip
  public async skipTrack(slug: string, options?: { stayInBooth?: boolean }) {
    return this.post<{ success: boolean; data?: { stayedInBooth: boolean } }>(`${slug}/booth/skip`, options || {})
  }

  // POST /api/rooms/:slug/booth/vote
  public async vote(slug: string, type: 'woot' | 'meh') {
    return this.post<VoteResponse>(`${slug}/booth/vote`, { type })
  }

  // POST /api/rooms/:slug/booth/grab
  public async grabTrack(slug: string, playlistId?: number) {
    return this.post<GrabResponse>(`${slug}/booth/grab`, playlistId ? { playlistId } : {})
  }

  // ============================================
  // History methods
  // ============================================

  // GET /api/rooms/:slug/history
  public async getHistory(slug: string, limit = 50, offset = 0) {
    return this.get<RoomHistoryResponse>(`${slug}/history?limit=${limit}&offset=${offset}`)
  }
}

// Singleton instance
export const roomResource = new RoomResource()
export default roomResource
