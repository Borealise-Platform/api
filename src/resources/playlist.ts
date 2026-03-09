import type { Api, ApiResponse } from '../Api'

export type MediaSource = 'youtube' | 'soundcloud'

export interface MediaItem {
  id: number
  playlistId: number
  source: MediaSource
  sourceId: string
  title: string
  artist: string | null
  duration: number
  thumbnail: string | null
  position: number
  createdAt: string
  updatedAt: string
}

export interface Playlist {
  id: number
  userId: number
  name: string
  isActive: boolean
  itemCount?: number
  items?: MediaItem[]
  createdAt: string
  updatedAt: string
}

export interface PlaylistsResponse {
  success: boolean
  data: {
    playlists: Playlist[]
  }
}

export interface PlaylistResponse {
  success: boolean
  data: {
    playlist: Playlist
  }
}

export interface MediaItemResponse {
  success: boolean
  data: {
    item: MediaItem
  }
}

export interface AddMediaData {
  source: MediaSource
  sourceId: string
}

export interface ShuffleResponse {
  success: boolean
  data: {
    shuffled: boolean
    items?: MediaItem[]
  }
}

export interface ImportPlaylistData {
  source?: MediaSource
  url: string
}

export interface ImportResult {
  imported: number
  skipped: number
  failed: number
  errors: string[]
  reachedLimit: boolean
}

export interface ImportPlaylistResponse {
  success: boolean
  data: ImportResult
}

export interface PlaylistResource {
  getAll(): Promise<ApiResponse<PlaylistsResponse>>
  getById(playlistId: number): Promise<ApiResponse<PlaylistResponse>>
  create(name: string): Promise<ApiResponse<PlaylistResponse>>
  rename(playlistId: number, name: string): Promise<ApiResponse<PlaylistResponse>>
  remove(playlistId: number): Promise<ApiResponse<{ success: boolean }>>
  activate(playlistId: number): Promise<ApiResponse<PlaylistResponse>>
  shuffle(playlistId: number): Promise<ApiResponse<ShuffleResponse>>
  addItem(playlistId: number, data: AddMediaData): Promise<ApiResponse<MediaItemResponse>>
  removeItem(playlistId: number, itemId: number): Promise<ApiResponse<{ success: boolean }>>
  moveItem(playlistId: number, itemId: number, position: number): Promise<ApiResponse<MediaItemResponse>>
  importPlaylist(playlistId: number, data: ImportPlaylistData): Promise<ApiResponse<ImportPlaylistResponse>>
}

const endpoint = '/playlists' as const

export const createPlaylistResource = (api: Api): PlaylistResource => ({
  getAll: () => api.get<PlaylistsResponse>(endpoint),
  getById: (playlistId) => api.get<PlaylistResponse>(`${endpoint}/${playlistId}`),
  create: (name) => api.post<PlaylistResponse>(endpoint, { name }),
  rename: (playlistId, name) => api.patch<PlaylistResponse>(`${endpoint}/${playlistId}`, { name }),
  remove: (playlistId) => api.delete<{ success: boolean }>(`${endpoint}/${playlistId}`),
  activate: (playlistId) => api.post<PlaylistResponse>(`${endpoint}/${playlistId}/activate`),
  shuffle: (playlistId) => api.post<ShuffleResponse>(`${endpoint}/${playlistId}/shuffle`),
  addItem: (playlistId, data) => api.post<MediaItemResponse>(`${endpoint}/${playlistId}/items`, data),
  removeItem: (playlistId, itemId) => api.delete<{ success: boolean }>(`${endpoint}/${playlistId}/items/${itemId}`),
  moveItem: (playlistId, itemId, position) => api.patch<MediaItemResponse>(`${endpoint}/${playlistId}/items/${itemId}/move`, { position }),
  importPlaylist: (playlistId, data) => api.post<ImportPlaylistResponse>(`${endpoint}/${playlistId}/import`, data),
})

export default createPlaylistResource
