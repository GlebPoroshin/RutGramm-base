import React, { createContext, useState, useEffect, useContext } from 'react';
import { chatService, Chat, Message, WebSocketService, SendMessageRequest } from '../api/chat.service';
import { useAuth } from './AuthContext';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  wsStatus: string;
  loadChats: () => Promise<void>;
  setCurrentChat: (chatId: string) => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  createChat: (name: string, memberIds: string[]) => Promise<Chat>;
  searchMessages: (chatId: string, query: string) => Promise<Message[]>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [wsStatus, setWsStatus] = useState<string>('disconnected');
  const [wsService] = useState<WebSocketService>(new WebSocketService());

  useEffect(() => {
    if (isAuthenticated) {
      loadChats();
      
      // Setup WebSocket
      wsService.connect();
      
      wsService.onStatusChange((status) => {
        setWsStatus(status);
      });
      
      wsService.onMessage((message) => {
        // Add new message to the list if it belongs to the current chat
        if (currentChat && message.chatId === currentChat.id) {
          setMessages(prev => [...prev, message]);
        }
        
        // Update last message in chat list
        setChats(prev => prev.map(chat => {
          if (chat.id === message.chatId) {
            return {
              ...chat,
              lastMessage: message,
              unreadCount: (chat.unreadCount || 0) + 1
            };
          }
          return chat;
        }));
      });
      
      return () => {
        wsService.disconnect();
      };
    }
  }, [isAuthenticated]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const chatList = await chatService.getUserChats();
      setChats(chatList);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentChat = async (chatId: string) => {
    try {
      setLoading(true);
      const chat = await chatService.getChat(chatId);
      setCurrentChatState(chat);
      
      // Load messages for this chat
      await loadMessages(chatId);
    } catch (error) {
      console.error('Failed to load chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      setLoading(true);
      const messageList = await chatService.getMessages(chatId);
      setMessages(messageList);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat) return;
    
    try {
      const messageData: SendMessageRequest = {
        content
      };
      
      await chatService.sendMessage(currentChat.id, messageData);
      
      // Message will be added via WebSocket
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const createChat = async (name: string, memberIds: string[]): Promise<Chat> => {
    try {
      setLoading(true);
      const newChat = await chatService.createChat({
        name,
        type: memberIds.length > 1 ? 'group' : 'direct',
        memberIds
      });
      
      // Update the chat list
      setChats(prev => [...prev, newChat]);
      
      return newChat;
    } catch (error) {
      console.error('Failed to create chat:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchMessages = async (chatId: string, query: string): Promise<Message[]> => {
    try {
      return await chatService.searchMessages({
        chatId,
        query
      });
    } catch (error) {
      console.error('Failed to search messages:', error);
      throw error;
    }
  };

  const value = {
    chats,
    currentChat,
    messages,
    loading,
    wsStatus,
    loadChats,
    setCurrentChat,
    loadMessages,
    sendMessage,
    createChat,
    searchMessages
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 