import { ApiResource } from '../ApiResource'

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

export class PlaylistResource extends ApiResource<Playlist> {
  protected readonly endpoint = '/playlists'

  // GET /api/playlists - Get all user's playlists
  public async getAll() {
    return this.api.get<PlaylistsResponse>(this.endpoint)
  }

  // GET /api/playlists/:id - Get playlist with items
  public async getById(playlistId: number) {
    return this.api.get<PlaylistResponse>(`${this.endpoint}/${playlistId}`)
  }

  // POST /api/playlists - Create playlist
  public async create(name: string) {
    return this.api.post<PlaylistResponse>(this.endpoint, { name })
  }

  // PATCH /api/playlists/:id - Update playlist
  public async rename(playlistId: number, name: string) {
    return this.api.patch<PlaylistResponse>(`${this.endpoint}/${playlistId}`, { name })
  }

  // DELETE /api/playlists/:id - Delete playlist
  public async remove(playlistId: number) {
    return this.api.delete<{ success: boolean }>(`${this.endpoint}/${playlistId}`)
  }

  // POST /api/playlists/:id/activate - Activate playlist
  public async activate(playlistId: number) {
    return this.api.post<PlaylistResponse>(`${this.endpoint}/${playlistId}/activate`)
  }

  // POST /api/playlists/:id/shuffle - Shuffle playlist
  public async shuffle(playlistId: number) {
    return this.api.post<ShuffleResponse>(`${this.endpoint}/${playlistId}/shuffle`)
  }

  // POST /api/playlists/:id/items - Add item to playlist
  public async addItem(playlistId: number, data: AddMediaData) {
    return this.api.post<MediaItemResponse>(`${this.endpoint}/${playlistId}/items`, data)
  }

  // DELETE /api/playlists/:id/items/:itemId - Remove item from playlist
  public async removeItem(playlistId: number, itemId: number) {
    return this.api.delete<{ success: boolean }>(`${this.endpoint}/${playlistId}/items/${itemId}`)
  }

  // PATCH /api/playlists/:id/items/:itemId/move - Move item in playlist
  public async moveItem(playlistId: number, itemId: number, position: number) {
    return this.api.patch<MediaItemResponse>(`${this.endpoint}/${playlistId}/items/${itemId}/move`, { position })
  }

  // POST /api/playlists/:id/import - Import from YouTube/SoundCloud playlist
  public async importPlaylist(playlistId: number, data: ImportPlaylistData) {
    return this.api.post<ImportPlaylistResponse>(`${this.endpoint}/${playlistId}/import`, data)
  }
}

// Singleton instance
export const playlistResource = new PlaylistResource()
export default playlistResource
