import React, { useContext, useState, useRef, useEffect } from 'react';
import { Home, LogOut, MessageSquare, MessageCircle, AlertCircle, User as UserIcon, Shield, Mail, MapPin, Hash, Utensils, Bell, X, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import NotificationContext from './context/NotificationContext';
import CommunityFeed from './components/CommunityFeed';
import ComplaintSystem from './components/ComplaintSystem';
import ChatSystem from './components/ChatSystem';
import MessMenu from './components/MessMenu';
import './index.css';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { notifications, unreadCount, markAllRead, dismissNotification, clearAll } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBellClick = () => {
    setShowNotifications(v => !v);
    if (!showNotifications) markAllRead();
  };

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon size={20} /> },
    { id: 'mess', label: 'Mess Menu', icon: <Utensils size={20} /> },
    { id: 'community', label: 'Community Hub', icon: <MessageSquare size={20} /> },
    { id: 'chat', label: 'Global Chat', icon: <MessageCircle size={20} /> },
    { id: 'complaints', label: 'Complaints', icon: <AlertCircle size={20} /> },
  ];

  const getNotifColor = (type) => type === 'complaint' ? '#ffb86c' : '#8be9fd';
  const getNotifIcon = (type) => type === 'complaint' ? '🔧' : '💬';

  const formatNotifTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

        return (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #667eea, #764ba2)' }} />

              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: '700',
                color: 'white',
                boxShadow: '0 10px 25px rgba(118, 75, 162, 0.4)',
                flexShrink: 0
              }}>
                {initials}
              </div>

              <div>
                <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '8px', letterSpacing: '-0.5px' }}>{user?.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(102, 126, 234, 0.1)', color: '#667eea', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <Shield size={14} /> {user?.role || 'student'}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={16} /> {user?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>

              {/* Account Information */}
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserIcon size={18} color="#764ba2" /> Account Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                    <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '500' }}>{user?.name}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                    <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '500' }}>{user?.email}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registration Number</label>
                    <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '500' }}>{user?.registrationNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Hostel Information (Hidden for Admins) */}
              {user?.role !== 'admin' && (
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Home size={18} color="#667eea" /> Hostel Allocation
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hostel Block</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={18} color="rgba(255,255,255,0.5)" />
                        <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '500' }}>{user?.hostelBlock || 'Not Assigned'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Room Number</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Hash size={18} color="rgba(255,255,255,0.5)" />
                        <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '500' }}>{user?.roomNumber || 'Not Assigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      case 'community':
        return <CommunityFeed />;
      case 'mess':
        return <MessMenu />;
      case 'chat':
        return null; // Handled directly in main render
      case 'complaints':
        return <ComplaintSystem />;
      default:
        return null;
    }
  };

  return (
    <div className="login-container" style={{ alignItems: 'flex-start', padding: '2rem' }}>
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>

      <div style={{ display: 'flex', gap: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto', zIndex: 10 }}>
        {/* Navigation Sidebar */}
        <div className="glass-card" style={{ width: '280px', padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
          <div className="card-header" style={{ marginBottom: '2rem', textAlign: 'left', alignItems: 'flex-start' }}>
            {/* Logo + Bell Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
              <div className="logo-icon">
                <Home size={28} />
              </div>
              {/* Notification Bell */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  onClick={handleBellClick}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'all 0.2s' }}
                  title="Notifications"
                >
                  <Bell size={18} color={unreadCount > 0 ? '#ffb86c' : 'rgba(255,255,255,0.6)'} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ff5555', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(15,23,42,0.8)' }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, width: '300px', background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 1000, overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>Notifications</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {notifications.length > 0 && (
                          <button onClick={clearAll} title="Clear all" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}>
                            <CheckCheck size={16} />
                          </button>
                        )}
                        <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    {/* Notification List */}
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px', alignItems: 'flex-start', background: n.read ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{getNotifIcon(n.type)}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0, lineHeight: '1.4', wordBreak: 'break-word' }}>{n.message}</p>
                              {n.remark && <p style={{ color: getNotifColor(n.type), fontSize: '0.78rem', margin: '4px 0 0', fontStyle: 'italic' }}>"{n.remark}"</p>}
                              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{formatNotifTime(n.createdAt)}</span>
                            </div>
                            <button onClick={() => dismissNotification(n.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                              <X size={13} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <h1 style={{ fontSize: '1.5rem' }}>Nexus</h1>
            <p style={{ fontSize: '0.9rem' }}>Hostel Management</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                className={activeTab === item.id ? '' : 'nav-hover'}
              >
                {item.icon}
                <span style={{ fontWeight: activeTab === item.id ? '600' : '400' }}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div style={{ marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={handleLogout}
              className="login-btn"
              style={{
                background: 'rgba(255, 50, 50, 0.1)',
                color: '#ff8a8a',
                border: '1px solid rgba(255, 50, 50, 0.2)',
                padding: '10px'
              }}
            >
              <LogOut size={18} style={{marginRight: '8px'}} /> Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {activeTab === 'chat' ? (
            <div className="fade-in" style={{ flex: 1, display: 'flex', width: '100%', minHeight: '85vh', background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <ChatSystem />
            </div>
          ) : (
            <div className="glass-card fade-in" style={{ padding: '2rem', minHeight: '85vh', display: 'flex', flexDirection: 'column', maxWidth: 'none' }}>
              <div style={{ marginBottom: '2rem', flexShrink: 0 }}>
                <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>
                  {navItems.find(i => i.id === activeTab)?.label}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {activeTab === 'profile' ? `Welcome back, ${user?.name}!` :
                   activeTab === 'mess' ? 'View the weekly schedule for hostel meals.' :
                   activeTab === 'community' ? 'Connect anonymously with your fellow residents.' :
                   'Lodge and track maintenance requests.'}
                </p>
              </div>
              {renderContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
