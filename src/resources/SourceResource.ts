import { ApiResource } from '../ApiResource'
import type { MediaSource } from './PlaylistResource'

export interface MediaSearchResult {
  source: MediaSource
  sourceId: string
  title: string
  artist: string
  duration: number
  thumbnail: string | null
  permalink?: string // SoundCloud only
}

export interface YouTubeSearchResponse {
  success: boolean
  data: {
    results: MediaSearchResult[]
  }
}

export interface YouTubeVideoResponse {
  success: boolean
  data: {
    video: MediaSearchResult
  }
}

export interface SoundCloudSearchResponse {
  success: boolean
  data: {
    results: MediaSearchResult[]
  }
}

export interface SoundCloudTrackResponse {
  success: boolean
  data: {
    track: MediaSearchResult
  }
}

export class SourceResource extends ApiResource<MediaSearchResult> {
  protected readonly endpoint = '/sources'

  // ============================================
  // YouTube
  // ============================================

  // GET /api/sources/youtube/search?q=...&limit=...
  public async searchYouTube(query: string, limit = 10) {
    return this.api.get<YouTubeSearchResponse>(`${this.endpoint}/youtube/search`, {
      params: { q: query, limit }
    })
  }

  // GET /api/sources/youtube/videos/:videoId
  public async getYouTubeVideo(videoId: string) {
    return this.api.get<YouTubeVideoResponse>(`${this.endpoint}/youtube/videos/${videoId}`)
  }

  // ============================================
  // SoundCloud
  // ============================================

  // GET /api/sources/soundcloud/search?q=...&limit=...
  public async searchSoundCloud(query: string, limit = 10) {
    return this.api.get<SoundCloudSearchResponse>(`${this.endpoint}/soundcloud/search`, {
      params: { q: query, limit }
    })
  }

  // GET /api/sources/soundcloud/tracks/:trackId
  public async getSoundCloudTrack(trackId: string) {
    return this.api.get<SoundCloudTrackResponse>(`${this.endpoint}/soundcloud/tracks/${trackId}`)
  }

  // GET /api/sources/soundcloud/resolve?url=...
  public async resolveSoundCloudUrl(url: string) {
    return this.api.get<SoundCloudTrackResponse>(`${this.endpoint}/soundcloud/resolve`, {
      params: { url }
    })
  }

  // ============================================
  // Combined search (helper)
  // ============================================

  // Search both YouTube and SoundCloud
  public async searchAll(query: string, limit = 10) {
    const [youtube, soundcloud] = await Promise.allSettled([
      this.searchYouTube(query, limit),
      this.searchSoundCloud(query, limit)
    ])

    const results: MediaSearchResult[] = []

    if (youtube.status === 'fulfilled' && youtube.value.data?.data?.results) {
      results.push(...youtube.value.data.data.results)
    }

    if (soundcloud.status === 'fulfilled' && soundcloud.value.data?.data?.results) {
      results.push(...soundcloud.value.data.data.results)
    }

    return results
  }
}

// Singleton instance
export const sourceResource = new SourceResource()
export default sourceResource
