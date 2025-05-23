import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: string;
}

function App() {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [chatId, setChatId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketStatus, setSocketStatus] = useState('Отключено');
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Функция для подключения к чату
  const connectToChat = async () => {
    if (!token || !userId || !chatId) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      // Get the protocol and host
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = 'localhost:8080';
      
      // Загрузить сообщения из чата
      const response = await axios.get(`${protocol}//${host}/chats/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.messages) {
        setMessages(response.data.messages);
      }
      
      // Подключиться через WebSocket
      const ws = new WebSocket(`${wsProtocol}//${host}/ws/?token=${token}`);
      
      ws.onopen = () => {
        setSocketStatus('Подключено');
        setIsConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message' && data.message && data.message.chatId === chatId) {
            setMessages(prev => [...prev, data.message]);
          }
        } catch (error) {
          console.error('Ошибка при разборе сообщения:', error);
        }
      };
      
      ws.onclose = () => {
        setSocketStatus('Отключено');
        setIsConnected(false);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket ошибка:', error);
        setSocketStatus('Ошибка соединения');
        setIsConnected(false);
      };
      
      socketRef.current = ws;
      
    } catch (error) {
      console.error('Ошибка при подключении к чату:', error);
      alert('Ошибка при подключении к чату. Проверьте токен и ID.');
    }
  };

  // Функция для отправки сообщения
  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;
    
    try {
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      const host = 'localhost:8080';
      
      await axios.post(`${protocol}//${host}/chats/${chatId}/messages`, 
        { content: newMessage },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      alert('Не удалось отправить сообщение');
    }
  };

  // Функция для отключения от чата
  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    setSocketStatus('Отключено');
    setMessages([]);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">GeoChat Тестовый Клиент</h1>
      
      {!isConnected ? (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Подключение к чату</h5>
            <div className="mb-3">
              <label htmlFor="token" className="form-label">Access Token</label>
              <input
                type="text"
                className="form-control"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Введите ваш JWT токен"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="userId" className="form-label">ID пользователя</label>
              <input
                type="text"
                className="form-control"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Введите ID пользователя"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="chatId" className="form-label">ID чата</label>
              <input
                type="text"
                className="form-control"
                id="chatId"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Введите ID чата"
              />
            </div>
            <button 
              className="btn btn-primary w-100" 
              onClick={connectToChat}
            >
              Подключиться
            </button>
          </div>
        </div>
      ) : (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <strong>Чат ID: {chatId}</strong>
              <div className="small text-muted">Статус: {socketStatus}</div>
            </div>
            <button className="btn btn-sm btn-danger" onClick={disconnect}>
              Отключиться
            </button>
          </div>
          <div className="card-body chat-messages-container">
            {messages.length === 0 ? (
              <div className="text-center text-muted my-5">Нет сообщений</div>
            ) : (
              <div>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message mb-3 ${message.senderId === userId ? 'message-sent' : 'message-received'}`}
                  >
                    <div className={`message-bubble p-2 rounded ${message.senderId === userId ? 'bg-primary text-white ms-auto' : 'bg-light'}`} style={{ maxWidth: '75%', display: 'inline-block' }}>
                      <div className="small text-muted mb-1">
                        {message.senderId === userId ? 'Вы' : `ID: ${message.senderId.substring(0, 8)}...`}
                      </div>
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
          <div className="card-footer">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Введите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!isConnected}
                >
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
