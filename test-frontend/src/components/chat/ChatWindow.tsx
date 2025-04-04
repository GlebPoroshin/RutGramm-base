import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Message } from '../../api/chat.service';
import { useAuth } from '../../contexts/AuthContext';

const ChatWindow: React.FC = () => {
  const { currentChat, messages, loading, sendMessage, wsStatus } = useChat();
  const { userId } = useAuth();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() === '') return;

    sendMessage(messageText);
    setMessageText('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentChat) {
    return (
      <div className="chat-window d-flex justify-content-center align-items-center h-100">
        <div className="text-center text-muted">
          <h4>Select a chat to start messaging</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window d-flex flex-column h-100">
      <div className="chat-header p-3 border-bottom">
        <div className="d-flex align-items-center">
          <div className="me-3">
            {currentChat.avatarUrl ? (
              <img src={currentChat.avatarUrl} alt={currentChat.name} className="rounded-circle" width="40" height="40" />
            ) : (
              <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                {currentChat.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h5 className="mb-0">{currentChat.name}</h5>
            <div className="small text-muted">
              {wsStatus === 'connected' ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      <div className="chat-messages p-3 flex-grow-1 overflow-auto">
        {loading ? (
          <div className="d-flex justify-content-center my-5">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center my-5 text-muted">No messages yet. Start the conversation!</div>
        ) : (
          <div>
            {messages.map((message: Message) => (
              <div 
                key={message.id} 
                className={`message mb-3 ${message.senderId === userId ? 'message-sent' : 'message-received'}`}
              >
                <div className={`message-bubble p-2 rounded ${message.senderId === userId ? 'bg-primary text-white ms-auto' : 'bg-light'}`} style={{ maxWidth: '75%', display: 'inline-block' }}>
                  {message.content}
                  <div className={`message-time small ${message.senderId === userId ? 'text-white-50' : 'text-muted'} text-end`}>
                    {formatTime(message.sentAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="chat-input p-3 border-top">
        <form onSubmit={handleSendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 