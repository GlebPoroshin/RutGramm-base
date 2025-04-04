import React, { useState } from 'react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import NewChatModal from '../components/chat/NewChatModal';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useChat } from '../contexts/ChatContext';

const ChatsPage: React.FC = () => {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const { setCurrentChat } = useChat();
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  if (loading) {
    return <div className="d-flex justify-content-center my-5">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);
  };

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-md-4 col-lg-3 p-0 border-end">
          <div className="d-flex flex-column h-100">
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">GeoChat</h4>
                {user && <div className="text-muted small">Hello, {user.firstName}</div>}
              </div>
              <div>
                <button className="btn btn-primary me-2" onClick={() => setShowNewChatModal(true)}>
                  New Chat
                </button>
                <button className="btn btn-outline-danger" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
            <div className="p-3 flex-grow-1 overflow-auto">
              <ChatList onSelectChat={handleSelectChat} />
            </div>
          </div>
        </div>
        <div className="col-md-8 col-lg-9 p-0">
          <ChatWindow />
        </div>
      </div>

      {showNewChatModal && (
        <NewChatModal 
          show={showNewChatModal} 
          onClose={() => setShowNewChatModal(false)} 
        />
      )}
    </div>
  );
};

export default ChatsPage; 