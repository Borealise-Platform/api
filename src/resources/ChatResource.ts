import { ApiResource } from '../ApiResource'
import type { RoomRole } from './RoomResource'

export interface ChatMessage {
  id: string
  room_id: number
  user_id?: number
  username?: string
  display_name?: string | null
  role?: RoomRole
  global_role?: string | null
  subscription_type?: string | null
  subscription_months?: number
  content: string
  timestamp: number
  type?: 'user' | 'system'
  deleted?: boolean
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

export class ChatResource extends ApiResource<ChatMessage> {
  protected readonly endpoint = '/rooms'

  // POST /api/rooms/:slug/chat - Send a chat message
  public async sendMessage(slug: string, data: SendMessageData) {
    return this.api.post<ChatMessageResponse>(`${this.endpoint}/${slug}/chat`, data)
  }

  // GET /api/rooms/:slug/chat - Get chat history
  public async getMessages(slug: string, before?: string, limit = 50) {
    const params: Record<string, unknown> = { limit }
    if (before) {
      params.before = before
    }
    return this.api.get<ChatMessagesResponse>(`${this.endpoint}/${slug}/chat`, { params })
  }

  // DELETE /api/rooms/:slug/chat/:messageId - Delete a chat message (moderation)
  public async deleteMessage(slug: string, messageId: string) {
    return this.api.delete<{ success: boolean; data: null }>(`${this.endpoint}/${slug}/chat/${messageId}`)
  }
}

// Singleton instance
export const chatResource = new ChatResource()
export default chatResource
