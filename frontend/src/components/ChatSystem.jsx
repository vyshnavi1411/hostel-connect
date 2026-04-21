import React, { useState, useEffect, useContext, useRef } from 'react';
import { Send, Clock } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

export default function ChatSystem() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();

    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Clean up on unmount
    return () => newSocket.close();
  }, [API_URL, SOCKET_URL]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !socket || !user) return;

    // Emit message to server
    // We use user.id (from backend auth) or user._id (if available)
    socket.emit('sendMessage', {
      userId: user.id || user._id,
      text: newMessage
    });

    setNewMessage('');
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString([], options);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '2rem' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const currentUserId = user?.id || user?._id;
            const messageUserId = msg.user?._id || msg.user?.id || msg.user;
            const isCurrentUser = messageUserId === currentUserId;
            return (
              <div 
                key={msg._id || index} 
                style={{ 
                  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                {!isCurrentUser && (
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px', marginLeft: '6px', fontWeight: '500' }}>
                    {msg.user?.name || 'Unknown User'} 
                    {msg.user?.role === 'admin' && <span style={{ color: '#ffb84d', marginLeft: '6px', fontSize: '0.7rem' }}>ADMIN</span>}
                  </span>
                )}
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '20px',
                  borderBottomRightRadius: isCurrentUser ? '4px' : '20px',
                  borderBottomLeftRadius: !isCurrentUser ? '4px' : '20px',
                  background: isCurrentUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  boxShadow: isCurrentUser ? '0 4px 15px rgba(118, 75, 162, 0.3)' : '0 4px 15px rgba(0,0,0,0.05)',
                  border: isCurrentUser ? 'none' : '1px solid rgba(255,255,255,0.05)'
                }}>
                  <p style={{ margin: 0, wordBreak: 'break-word', lineHeight: '1.5', fontSize: '0.95rem' }}>{msg.text}</p>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  {msg.createdAt ? formatTime(msg.createdAt) : formatTime(new Date())}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message to everyone..."
          style={{
            flex: 1,
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            outline: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
            e.target.style.background = 'rgba(255,255,255,0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
            e.target.style.background = 'rgba(255,255,255,0.05)';
          }}
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          style={{ 
            padding: '0 24px', 
            borderRadius: '16px', 
            border: 'none', 
            background: newMessage.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)', 
            color: newMessage.trim() ? '#fff' : 'rgba(255,255,255,0.3)', 
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: newMessage.trim() ? '0 4px 15px rgba(118, 75, 162, 0.4)' : 'none'
          }}
          className={newMessage.trim() ? 'nav-hover' : ''}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
