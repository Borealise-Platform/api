import type { Api, ApiResponse } from '../Api'
import type { RoomRole } from './room'

export interface ChatMessage {
  id: string
  room_id: number
  user_id?: number
  username?: string
  display_name?: string | null
  avatar_id?: string | null
  role?: RoomRole
  global_role?: string | null
  subscription_type?: string | null
  subscription_months?: number
  content: string
  timestamp: number
  type?: 'user' | 'system'
  edited_at?: number | null
  edited_by?: number | null
  deleted?: boolean
  deleted_at?: number | null
  deleted_by?: number | null
}

export interface SendMessageData {
  content: string
}

export interface ChatMessagesResponse {
  success: boolean
  data: {
    messages: ChatMessage[]
  }
}

export interface ChatMessageResponse {
  success: boolean
  data: {
    message: ChatMessage
  }
}

export interface GifSearchItem {
  id: string
  title: string
  url: string
  preview_url: string | null
  width: number | null
  height: number | null
}

export interface GifSearchResponse {
  success: boolean
  data: {
    gifs: GifSearchItem[]
  }
}

export interface ChatResource {
  sendMessage(slug: string, data: SendMessageData): Promise<ApiResponse<ChatMessageResponse>>
  getMessages(slug: string, before?: string, limit?: number): Promise<ApiResponse<ChatMessagesResponse>>
  editMessage(slug: string, messageId: string, data: SendMessageData): Promise<ApiResponse<ChatMessageResponse>>
  deleteMessage(slug: string, messageId: string): Promise<ApiResponse<{ success: boolean; data: null }>>
  searchGifs(query: string, limit?: number): Promise<ApiResponse<GifSearchResponse>>
}

const endpoint = '/rooms' as const

export const createChatResource = (api: Api): ChatResource => ({
  sendMessage: (slug, data) => api.post<ChatMessageResponse>(`${endpoint}/${slug}/chat`, data),
  getMessages: (slug, before, limit = 50) => {
    const params: Record<string, unknown> = { limit }
    if (before) {
      params.before = before
    }
    return api.get<ChatMessagesResponse>(`${endpoint}/${slug}/chat`, { params })
  },
  editMessage: (slug, messageId, data) => api.patch<ChatMessageResponse>(`${endpoint}/${slug}/chat/${messageId}`, data),
  deleteMessage: (slug, messageId) => api.delete<{ success: boolean; data: null }>(`${endpoint}/${slug}/chat/${messageId}`),
  searchGifs: (query, limit = 20) => api.post<GifSearchResponse>('/chat/gif/search', { query, limit }),
})

export default createChatResource
