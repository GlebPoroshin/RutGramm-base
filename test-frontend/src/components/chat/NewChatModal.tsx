import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../api/user.service';
import { User } from '../../api/user.service';

interface NewChatModalProps {
  show: boolean;
  onClose: () => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ show, onClose }) => {
  const { createChat } = useChat();
  const { userId } = useAuth();
  const [chatName, setChatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  if (!show) {
    return null;
  }

  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    
    try {
      setSearching(true);
      const results = await userService.searchUsers(searchQuery);
      // Filter out current user and already selected users
      const filteredResults = results.filter(
        user => user.id !== userId && !selectedUsers.some(selected => selected.id === user.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Failed to search users:', error);
      setError('Failed to search users. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const addUserToSelection = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchResults(searchResults.filter(result => result.id !== user.id));
  };

  const removeUserFromSelection = (user: User) => {
    setSelectedUsers(selectedUsers.filter(selected => selected.id !== user.id));
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      setError('Please select at least one user for the chat');
      return;
    }

    try {
      const memberIds = selectedUsers.map(user => user.id);
      const name = chatName.trim() || generateDefaultChatName();
      
      await createChat(name, memberIds);
      onClose();
    } catch (error) {
      console.error('Failed to create chat:', error);
      setError('Failed to create chat. Please try again.');
    }
  };

  const generateDefaultChatName = () => {
    if (selectedUsers.length === 1) {
      return `${selectedUsers[0].firstName} ${selectedUsers[0].lastName}`;
    } else {
      return selectedUsers.map(user => user.firstName).join(', ');
    }
  };

  return (
    <div className="modal d-block" tabIndex={-1} style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Chat</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="mb-3">
              <label htmlFor="chatName" className="form-label">Chat Name (Optional for direct chats)</label>
              <input
                type="text"
                className="form-control"
                id="chatName"
                value={chatName}
                onChange={e => setChatName(e.target.value)}
                placeholder="Enter chat name"
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Add Users</label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                  Search
                </button>
              </div>
              
              {searching && <div className="text-center my-2">Searching...</div>}
              
              {searchResults.length > 0 && (
                <div className="list-group mb-3">
                  {searchResults.map(user => (
                    <button
                      key={user.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      onClick={() => addUserToSelection(user)}
                    >
                      <div>
                        <span>{user.firstName} {user.lastName}</span>
                        {user.nickname && <span className="text-muted ms-2">@{user.nickname}</span>}
                      </div>
                      <span className="badge bg-primary rounded-pill">+</span>
                    </button>
                  ))}
                </div>
              )}
              
              {selectedUsers.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Selected Users:</label>
                  <div className="list-group">
                    {selectedUsers.map(user => (
                      <div
                        key={user.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <span>{user.firstName} {user.lastName}</span>
                          {user.nickname && <span className="text-muted ms-2">@{user.nickname}</span>}
                        </div>
                        <button className="btn btn-sm btn-danger" onClick={() => removeUserFromSelection(user)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleCreateChat}
              disabled={selectedUsers.length === 0}
            >
              Create Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal; 