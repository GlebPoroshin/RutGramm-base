import api from './axios';

export interface Chat {
  id: string;
  name: string;
  type: string;
  avatarUrl?: string;
  createdAt: string;
  lastMessage?: Message;
  unreadCount?: number;
  members: ChatMember[];
}

export interface ChatMember {
  userId: string;
  role: string;
  joinedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  sentAt: string;
  readBy?: string[];
}

export interface CreateChatRequest {
  name: string;
  type: string;
  memberIds: string[];
  avatarUrl?: string;
}

export interface UpdateChatRequest {
  name?: string;
  avatarUrl?: string;
}

export interface AddMemberRequest {
  userIds: string[];
}

export interface SendMessageRequest {
  content: string;
  attachments?: string[];
}

export interface GetMessagesRequest {
  limit?: number;
  offset?: number;
  before?: string;
  after?: string;
}

export interface MarkAsReadRequest {
  messageIds: string[];
}

export interface SearchMessagesRequest {
  chatId: string;
  query: string;
  limit?: number;
  offset?: number;
}

export const chatService = {
  getUserChats: async (): Promise<Chat[]> => {
    const response = await api.get('/chats/');
    return response.data.chats;
  },

  getChat: async (chatId: string): Promise<Chat> => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  },

  createChat: async (data: CreateChatRequest): Promise<Chat> => {
    const response = await api.post('/chats/', data);
    return response.data;
  },

  updateChat: async (chatId: string, data: UpdateChatRequest): Promise<Chat> => {
    const response = await api.put(`/chats/${chatId}`, data);
    return response.data;
  },

  deleteChat: async (chatId: string): Promise<void> => {
    await api.delete(`/chats/${chatId}`);
  },

  addMember: async (chatId: string, data: AddMemberRequest): Promise<void> => {
    await api.post(`/chats/${chatId}/members`, data);
  },

  removeMember: async (chatId: string, userId: string): Promise<void> => {
    await api.delete(`/chats/${chatId}/members/${userId}`);
  },

  getMessages: async (chatId: string, params: GetMessagesRequest = {}): Promise<Message[]> => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.before) queryParams.append('before', params.before);
    if (params.after) queryParams.append('after', params.after);
    
    const response = await api.get(`/chats/${chatId}/messages?${queryParams.toString()}`);
    return response.data.messages;
  },

  sendMessage: async (chatId: string, data: SendMessageRequest): Promise<Message> => {
    const response = await api.post(`/chats/${chatId}/messages`, data);
    return response.data;
  },

  markAsRead: async (data: MarkAsReadRequest): Promise<void> => {
    await api.post('/chats/messages/read', data);
  },

  searchMessages: async (params: SearchMessagesRequest): Promise<Message[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('chat_id', params.chatId);
    queryParams.append('query', params.query);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    
    const response = await api.get(`/chats/messages/search?${queryParams.toString()}`);
    return response.data.messages;
  }
};

// WebSocket connection for real-time chat
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private statusCallbacks: ((status: string) => void)[] = [];

  constructor() {}

  connect(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Use the same protocol (ws or wss) as the current page
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = 'localhost:8080'; // Use your API hostname
    
    this.socket = new WebSocket(`${protocol}//${host}/ws/?token=${token}`);

    this.socket.onopen = () => {
      this.notifyStatus('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          this.notifyMessage(data.message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      this.notifyStatus('disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.notifyStatus('error');
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  onMessage(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  onStatusChange(callback: (status: string) => void): void {
    this.statusCallbacks.push(callback);
  }

  private notifyMessage(message: Message): void {
    this.messageCallbacks.forEach(callback => callback(message));
  }

  private notifyStatus(status: string): void {
    this.statusCallbacks.forEach(callback => callback(status));
  }
} 