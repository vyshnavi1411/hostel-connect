import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('userConnected', { id: user.id || user._id, name: user.name, role: user.role });
      // Join Global room by default for background message receiving
      newSocket.emit('joinRoom', 'Global');
    });

    // Handle incoming messages in the background (optional: could add notification logic here)
    newSocket.on('receiveMessage', (message) => {
      const currentUserId = user.id || user._id;
      const messageUserId = message.user?._id || message.user?.id || message.user;
      
      // If it's a DM and we're the recipient, show a notification
      if (message.recipient === currentUserId) {
         setNotifications(prev => [{
          id: `dm-${Date.now()}`,
          type: 'message',
          message: `New message from ${message.user?.name || 'Someone'}`,
          read: false,
          createdAt: new Date()
        }, ...prev].slice(0, 50));
      }
    });

    // Complaint status changed by admin
    newSocket.on('complaintStatusChanged', (data) => {
      const currentUserId = user.id || user._id;
      if (data.userId === currentUserId) {
        setNotifications(prev => [{
          id: `complaint-${Date.now()}`,
          type: 'complaint',
          message: `Your complaint "${data.title}" is now ${data.status}.`,
          remark: data.adminRemarks || null,
          read: false,
          createdAt: new Date()
        }, ...prev].slice(0, 50)); // cap at 50
      }
    });

    return () => newSocket.disconnect();
  }, [user, SOCKET_URL]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, dismissNotification, clearAll, socket }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
