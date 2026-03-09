import type { Api, ApiResponse } from '../Api'

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

export interface RoomMute {
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

export interface RoomMutesResponse {
  success: boolean
  data: {
    mutes: RoomMute[]
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

export interface JoinMuteInfo {
  expiresAt: string | null
  remainingSeconds: number | null
  reason: string | null
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
    mute: JoinMuteInfo | null
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

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface RoomHistoryResponse {
  success: boolean
  data: {
    history: PlayHistoryItem[]
    pagination: PaginationMeta
  }
}

export interface RoomResource {
  list(): Promise<ApiResponse<RoomsResponse>>
  featured(): Promise<ApiResponse<FeaturedRoomsResponse>>
  getBySlug(slug: string): Promise<ApiResponse<RoomResponse>>
  create(data: CreateRoomData): Promise<ApiResponse<RoomResponse>>
  updateRoom(slug: string, data: UpdateRoomData): Promise<ApiResponse<RoomResponse>>
  deleteRoom(slug: string): Promise<ApiResponse<{ success: boolean }>>
  getStaff(slug: string): Promise<ApiResponse<RoomStaffResponse>>
  getBans(slug: string): Promise<ApiResponse<RoomBansResponse>>
  getMutes(slug: string): Promise<ApiResponse<RoomMutesResponse>>
  updateUserRole(slug: string, userId: number, role: RoomRole): Promise<ApiResponse<{ success: boolean; data: { userId: number; role: RoomRole } }>>
  ban(slug: string, userId: number, data?: ModerateUserData): Promise<ApiResponse<BanResponse>>
  unban(slug: string, userId: number): Promise<ApiResponse<{ success: boolean; data: { userId: number } }>>
  mute(slug: string, userId: number, data?: ModerateUserData): Promise<ApiResponse<MuteResponse>>
  unmute(slug: string, userId: number): Promise<ApiResponse<{ success: boolean; data: { userId: number } }>>
  kick(slug: string, userId: number): Promise<ApiResponse<{ success: boolean; data: { userId: number } }>>
  join(slug: string): Promise<ApiResponse<JoinRoomResponse>>
  leave(slug: string): Promise<ApiResponse<{ success: boolean }>>
  getWaitlist(slug: string): Promise<ApiResponse<WaitlistResponse>>
  joinWaitlist(slug: string): Promise<ApiResponse<{ success: boolean; data: { position: number } }>>
  leaveWaitlist(slug: string): Promise<ApiResponse<{ success: boolean }>>
  moveInWaitlist(slug: string, userId: number, position: number): Promise<ApiResponse<{ success: boolean; data: { waitlist: WaitlistUser[] } }>>
  removeFromWaitlist(slug: string, userId: number): Promise<ApiResponse<{ success: boolean }>>
  lockWaitlist(slug: string): Promise<ApiResponse<{ success: boolean; data: { locked: boolean } }>>
  unlockWaitlist(slug: string): Promise<ApiResponse<{ success: boolean; data: { locked: boolean } }>>
  getBooth(slug: string): Promise<ApiResponse<BoothResponse>>
  skipTrack(slug: string, options?: { stayInBooth?: boolean }): Promise<ApiResponse<{ success: boolean; data?: { stayedInBooth: boolean } }>>
  vote(slug: string, type: 'woot' | 'meh'): Promise<ApiResponse<VoteResponse>>
  grabTrack(slug: string, playlistId?: number): Promise<ApiResponse<GrabResponse>>
  getHistory(slug: string, page?: number, limit?: number): Promise<ApiResponse<RoomHistoryResponse>>
}

const endpoint = '/rooms' as const

export const createRoomResource = (api: Api): RoomResource => ({
  list: () => api.get<RoomsResponse>(endpoint),
  featured: () => api.get<FeaturedRoomsResponse>(`${endpoint}/featured`),
  getBySlug: (slug) => api.get<RoomResponse>(`${endpoint}/${slug}`),
  create: (data) => api.post<RoomResponse>(endpoint, data),
  updateRoom: (slug, data) => api.patch<RoomResponse>(`${endpoint}/${slug}`, data),
  deleteRoom: (slug) => api.delete<{ success: boolean }>(`${endpoint}/${slug}`),
  getStaff: (slug) => api.get<RoomStaffResponse>(`${endpoint}/${slug}/staff`),
  getBans: (slug) => api.get<RoomBansResponse>(`${endpoint}/${slug}/bans`),
  getMutes: (slug) => api.get<RoomMutesResponse>(`${endpoint}/${slug}/mutes`),
  updateUserRole: (slug, userId, role) => api.patch<{ success: boolean; data: { userId: number; role: RoomRole } }>(
    `${endpoint}/${slug}/users/${userId}/role`, { role }
  ),
  ban: (slug, userId, data) => api.post<BanResponse>(`${endpoint}/${slug}/users/${userId}/ban`, data || {}),
  unban: (slug, userId) => api.delete<{ success: boolean; data: { userId: number } }>(`${endpoint}/${slug}/users/${userId}/ban`),
  mute: (slug, userId, data) => api.post<MuteResponse>(`${endpoint}/${slug}/users/${userId}/mute`, data || {}),
  unmute: (slug, userId) => api.delete<{ success: boolean; data: { userId: number } }>(`${endpoint}/${slug}/users/${userId}/mute`),
  kick: (slug, userId) => api.post<{ success: boolean; data: { userId: number } }>(`${endpoint}/${slug}/users/${userId}/kick`),
  join: (slug) => api.post<JoinRoomResponse>(`${endpoint}/${slug}/join`),
  leave: (slug) => api.post<{ success: boolean }>(`${endpoint}/${slug}/leave`),
  getWaitlist: (slug) => api.get<WaitlistResponse>(`${endpoint}/${slug}/waitlist`),
  joinWaitlist: (slug) => api.post<{ success: boolean; data: { position: number } }>(`${endpoint}/${slug}/waitlist/join`),
  leaveWaitlist: (slug) => api.post<{ success: boolean }>(`${endpoint}/${slug}/waitlist/leave`),
  moveInWaitlist: (slug, userId, position) => api.patch<{ success: boolean; data: { waitlist: WaitlistUser[] } }>(
    `${endpoint}/${slug}/waitlist`, { userId, position }
  ),
  removeFromWaitlist: (slug, userId) => api.delete<{ success: boolean }>(`${endpoint}/${slug}/waitlist/${userId}`),
  lockWaitlist: (slug) => api.post<{ success: boolean; data: { locked: boolean } }>(`${endpoint}/${slug}/waitlist/lock`),
  unlockWaitlist: (slug) => api.post<{ success: boolean; data: { locked: boolean } }>(`${endpoint}/${slug}/waitlist/unlock`),
  getBooth: (slug) => api.get<BoothResponse>(`${endpoint}/${slug}/booth`),
  skipTrack: (slug, options) => api.post<{ success: boolean; data?: { stayedInBooth: boolean } }>(
    `${endpoint}/${slug}/booth/skip`, options || {}
  ),
  vote: (slug, type) => api.post<VoteResponse>(`${endpoint}/${slug}/booth/vote`, { type }),
  grabTrack: (slug, playlistId) => api.post<GrabResponse>(`${endpoint}/${slug}/booth/grab`, playlistId ? { playlistId } : {}),
  getHistory: (slug, page = 1, limit = 20) => api.get<RoomHistoryResponse>(`${endpoint}/${slug}/history`, { params: { page, limit } }),
})

export default createRoomResource
