import React, { useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Chat } from '../../api/chat.service';

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
  const { chats, loadChats, loading } = useChat();

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && chats.length === 0) {
    return <div className="d-flex justify-content-center my-5">Loading chats...</div>;
  }

  return (
    <div className="chat-list">
      <h3 className="mb-3">Chats</h3>
      {chats.length === 0 ? (
        <div className="text-center my-5">No chats found. Create one to start messaging!</div>
      ) : (
        <div className="list-group">
          {chats.map((chat: Chat) => (
            <button
              key={chat.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="d-flex align-items-center">
                <div className="chat-avatar me-3">
                  {chat.avatarUrl ? (
                    <img src={chat.avatarUrl} alt={chat.name} className="rounded-circle" width="40" height="40" />
                  ) : (
                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="chat-info">
                  <div className="chat-name">{chat.name}</div>
                  <div className="chat-last-message text-muted small">
                    {chat.lastMessage ? chat.lastMessage.content.substring(0, 20) + (chat.lastMessage.content.length > 20 ? '...' : '') : 'No messages yet'}
                  </div>
                </div>
              </div>
              <div className="chat-meta small text-end">
                <div className="chat-time text-muted">
                  {chat.lastMessage ? formatDate(chat.lastMessage.sentAt) : formatDate(chat.createdAt)}
                </div>
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <div className="badge bg-primary rounded-pill">{chat.unreadCount}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList; 