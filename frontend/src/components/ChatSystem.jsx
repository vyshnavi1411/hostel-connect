import React, { useState, useEffect, useContext, useRef } from 'react';
import { Send, Clock, MessageSquare, Users, Shield } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function ChatSystem() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [socket, setSocket] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user) return;
    socket.emit('sendMessage', { 
      userId: user.id || user._id, 
      text: newMessage,
      isAnonymous: isAnonymous
    });
    setNewMessage('');
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare size={18} color="var(--brand-primary)" />
          <h3 style={{ fontSize: '1rem' }}>Global Chat</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          Live Chat
        </div>
      </div>

      {/* Messages */}
      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-accent)' }}>
        {messages.map((msg, index) => {
          const isMe = (msg.user?._id || msg.user?.id || msg.user) === (user?.id || user?._id);
          return (
            <div key={msg._id || index} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              {!isMe && (
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', marginLeft: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {msg.user?.name || 'Resident'}
                  {msg.user?.role === 'admin' && <Shield size={10} color="var(--brand-primary)" />}
                </div>
              )}
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '14px',
                background: isMe ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                color: isMe ? '#fff' : 'var(--text-primary)',
                fontSize: '0.9rem',
                boxShadow: 'var(--card-shadow)',
                borderBottomRightRadius: isMe ? '2px' : '14px',
                borderBottomLeftRadius: !isMe ? '2px' : '14px'
              }}>
                {msg.text}
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {formatTime(msg.createdAt || new Date())}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem', marginBottom: '8px' }}>
          <input
            type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            className="input-field" placeholder="Send a message..."
            style={{ flex: 1, padding: '0.625rem 1.25rem' }}
          />
          <button type="submit" disabled={!newMessage.trim()} className="btn btn-primary" style={{ padding: '0 1rem' }}>
            <Send size={18} />
          </button>
        </form>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <input 
            type="checkbox" 
            checked={isAnonymous} 
            onChange={(e) => setIsAnonymous(e.target.checked)}
            style={{ width: '14px', height: '14px', accentColor: 'var(--brand-primary)' }}
          />
          Chat anonymously
        </label>
      </div>
    </div>
  );
}
