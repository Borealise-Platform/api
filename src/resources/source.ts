import type { Api, ApiResponse } from '../Api'

export type MediaSource = 'youtube' | 'soundcloud'

export interface MediaSearchResult {
  source: MediaSource
  sourceId: string
  title: string
  artist: string
  duration: number
  thumbnail: string | null
  permalink?: string
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

export interface SourceResource {
  searchYouTube(query: string, limit?: number): Promise<ApiResponse<YouTubeSearchResponse>>
  getYouTubeVideo(videoId: string): Promise<ApiResponse<YouTubeVideoResponse>>
  searchSoundCloud(query: string, limit?: number): Promise<ApiResponse<SoundCloudSearchResponse>>
  getSoundCloudTrack(trackId: string): Promise<ApiResponse<SoundCloudTrackResponse>>
  resolveSoundCloudUrl(url: string): Promise<ApiResponse<SoundCloudTrackResponse>>
  searchAll(query: string, limit?: number): Promise<MediaSearchResult[]>
}

const endpoint = '/sources' as const

export const createSourceResource = (api: Api): SourceResource => ({
  searchYouTube: (query, limit = 10) => api.get<YouTubeSearchResponse>(`${endpoint}/youtube/search`, {
    params: { q: query, limit }
  }),
  getYouTubeVideo: (videoId) => api.get<YouTubeVideoResponse>(`${endpoint}/youtube/videos/${videoId}`),
  searchSoundCloud: (query, limit = 10) => api.get<SoundCloudSearchResponse>(`${endpoint}/soundcloud/search`, {
    params: { q: query, limit }
  }),
  getSoundCloudTrack: (trackId) => api.get<SoundCloudTrackResponse>(`${endpoint}/soundcloud/tracks/${trackId}`),
  resolveSoundCloudUrl: (url) => api.get<SoundCloudTrackResponse>(`${endpoint}/soundcloud/resolve`, { params: { url } }),
  searchAll: async (query, limit = 10) => {
    const [youtube, soundcloud] = await Promise.allSettled([
      api.get<YouTubeSearchResponse>(`${endpoint}/youtube/search`, { params: { q: query, limit } }),
      api.get<SoundCloudSearchResponse>(`${endpoint}/soundcloud/search`, { params: { q: query, limit } })
    ])

    const results: MediaSearchResult[] = []

    if (youtube.status === 'fulfilled' && youtube.value.data?.data?.results) {
      results.push(...youtube.value.data.data.results)
    }

    if (soundcloud.status === 'fulfilled' && soundcloud.value.data?.data?.results) {
      results.push(...soundcloud.value.data.data.results)
    }

    return results
  },
})

export default createSourceResource
