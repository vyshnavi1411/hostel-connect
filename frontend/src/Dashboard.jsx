import React, { useContext, useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, LogOut, MessageSquare, MessageCircle, AlertCircle, 
  User as UserIcon, Shield, Mail, MapPin, Hash, Utensils, Bell, X, 
  CheckCheck, ChevronRight, Lock, Sun, Moon, Search, Settings, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from './context/AuthContext';
import NotificationContext from './context/NotificationContext';
import CommunityFeed from './components/CommunityFeed';
import ComplaintSystem from './components/ComplaintSystem';
import ChatSystem from './components/ChatSystem';
import MessMenu from './components/MessMenu';
import ConstellationBackground from './components/ConstellationBackground';
import './index.css';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { notifications, unreadCount, markAllRead, clearAll } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '' });
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [quote, setQuote] = useState('');

  // Theme Management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quotes = [
    "Your home away from home. ✨",
    "Making hostel life easier, one click at a time. 🚀",
    "Stay connected, stay ahead. 🌟",
    "Where every resident is a family member. 🏠",
    "Building a smarter community together. 🤝"
  ];

  useEffect(() => {
    if (user) {
      const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(selectedQuote);
      
      let i = 0;
      setTypedText('');
      const timer = setInterval(() => {
        setTypedText(selectedQuote.substring(0, i));
        i++;
        if (i > selectedQuote.length) clearInterval(timer);
      }, 40);
      return () => clearInterval(timer);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoadingDashboard(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/posts`);
      setTrendingPosts(res.data.slice(0, 3));
      setLoadingDashboard(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoadingDashboard(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg({ text: '', type: '' });
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/change-password`, pwdData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPwdMsg({ text: 'Password updated successfully!', type: 'success' });
      setPwdData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwdMsg({ text: err.response?.data?.message || 'Failed to update password', type: 'error' });
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'mess', label: 'Mess Menu', icon: <Utensils size={20} /> },
    { id: 'community', label: 'Community Feed', icon: <MessageSquare size={20} /> },
    { id: 'chat', label: 'Global Chat', icon: <MessageCircle size={20} /> },
    { id: 'complaints', label: 'Service Requests', icon: <AlertCircle size={20} /> },
  ];

  const renderDashboard = () => {
    return (
      <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Welcome Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ minHeight: '100px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '4px' }}>
              Hey, {user?.name.split(' ')[0]}! ✨
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', minHeight: '24px' }}>
              <p style={{ 
                color: 'var(--brand-primary)', 
                fontSize: '1rem', 
                fontWeight: '500',
                borderRight: '2px solid var(--brand-primary)',
                paddingRight: '4px',
                animation: 'blink 0.7s infinite'
              }}>
                {typedText}
              </p>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>Here's what's happening in your hostel today.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></div>
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Mess is Open</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          {/* Trending Updates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Trending in Hostel</h3>
              <button onClick={() => setActiveTab('community')} className="btn btn-ghost" style={{ fontSize: '0.875rem', color: 'var(--brand-primary)' }}>View All</button>
            </div>
            
            {loadingDashboard ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>Loading updates...</div>
            ) : trendingPosts.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent updates.</div>
            ) : (
              trendingPosts.map(post => (
                <div key={post._id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserIcon size={16} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{post.user?.role === 'admin' ? post.user.name : 'Resident'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
                </div>
              ))
            )}
          </div>

          {/* Quick Info / Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Hostel Events</h3>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Night Canteen Closure', date: 'Today, 11:30 PM', type: 'Alert' },
                { title: 'Hostel A Block Meeting', date: 'Tomorrow, 5:00 PM', type: 'Event' },
                { title: 'New Menu Feedback', date: 'Due in 2 days', type: 'Task' }
              ].map((event, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', paddingBottom: i === 2 ? 0 : '1rem', borderBottom: i === 2 ? 'none' : '1px solid var(--border-subtle)' }}>
                  <div style={{ 
                    padding: '8px', borderRadius: '8px', 
                    background: event.type === 'Alert' ? '#fef2f2' : event.type === 'Event' ? '#eff6ff' : '#f0fdf4',
                    color: event.type === 'Alert' ? '#ef4444' : event.type === 'Event' ? '#3b82f6' : '#22c55e',
                    height: 'fit-content'
                  }}>
                    {event.type === 'Alert' ? <AlertCircle size={18}/> : event.type === 'Event' ? <Bell size={18}/> : <CheckCheck size={18}/>}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '2px' }}>{event.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.date}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderAccount = () => {
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    return (
      <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header Profile Section */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2.5rem' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'var(--brand-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: '800', boxShadow: '0 10px 25px var(--brand-glow)'
          }}>
            {initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '2rem' }}>{user?.name}</h2>
              <span className="badge badge-blue">{user?.role}</span>
            </div>
            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16}/> {user?.email}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16}/> Block {user?.hostelBlock || 'N/A'}, Room {user?.roomNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {[
                { label: 'Full Name', value: user?.name },
                { label: 'Primary Email', value: user?.email },
                { label: 'Hostel Block', value: user?.hostelBlock || 'Unassigned' },
                { label: 'Room Number', value: user?.roomNumber || 'Unassigned' }
              ].map((item, idx) => (
                <div key={idx}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>{item.label.toUpperCase()}</p>
                  <p style={{ fontWeight: '500' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Security Settings</h3>
              {!showPwdForm && <button onClick={() => setShowPwdForm(true)} className="btn btn-ghost" style={{ fontSize: '0.875rem', color: 'var(--brand-primary)' }}>Change Password</button>}
            </div>
            
            {showPwdForm ? (
              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Current Password</label>
                  <input 
                    type="password" className="input-field" placeholder="••••••••" 
                    value={pwdData.currentPassword} onChange={(e) => setPwdData({...pwdData, currentPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>New Password</label>
                  <input 
                    type="password" className="input-field" placeholder="••••••••" 
                    value={pwdData.newPassword} onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})}
                  />
                </div>
                {pwdMsg.text && <p style={{ fontSize: '0.85rem', color: pwdMsg.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>{pwdMsg.text}</p>}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update Password</button>
                  <button type="button" onClick={() => { setShowPwdForm(false); setPwdMsg({text: '', type: ''}); }} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-secondary)' }}>
                <Lock size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.9rem' }}>Secure your account by regularly updating your password.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      <ConstellationBackground />
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--brand-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.05em' }}>HostelConnect</h1>
        </div>

        <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="btn btn-ghost"
              style={{
                justifyContent: 'flex-start', padding: '0.75rem 1rem', borderRadius: '12px',
                background: activeTab === item.id ? 'var(--brand-glow)' : 'transparent',
                color: activeTab === item.id ? 'var(--brand-primary)' : 'var(--text-secondary)'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeTab === item.id && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-primary)' }} />}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', color: 'var(--danger)', gap: '12px' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleTheme} className="theme-toggle">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="theme-toggle" style={{ position: 'relative' }}>
                <Bell size={20} />
                {unreadCount > 0 && <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--bg-secondary)' }} />}
              </button>
              {showNotifications && (
                <div className="card animate-up" style={{ position: 'absolute', top: '120%', right: 0, width: '320px', padding: '0', zIndex: 1000, overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '700' }}>Notifications</span>
                    <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>Clear all</button>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', background: n.read ? 'transparent' : 'var(--brand-glow)' }}>
                          <p style={{ fontSize: '0.85rem' }}>{n.message}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleTimeString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div ref={profileMenuRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="theme-toggle"
                style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <UserIcon size={20} />
              </button>

              {showProfileMenu && (
                <div className="card animate-up" style={{ position: 'absolute', top: '120%', right: 0, width: '220px', padding: '0.5rem', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('account'); setShowProfileMenu(false); }}
                    className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                  >
                    <LayoutDashboard size={16} /> My Profile
                  </button>
                  <button 
                    onClick={() => { setActiveTab('account'); setShowPwdForm(true); setShowProfileMenu(false); }}
                    className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                  >
                    <Lock size={16} /> Security Settings
                  </button>
                  <div style={{ margin: '0.5rem 0', borderTop: '1px solid var(--border-subtle)' }} />
                  <button 
                    onClick={handleLogout}
                    className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'var(--danger)' }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content-area">
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{navItems.find(i => i.id === activeTab)?.label}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              {activeTab === 'overview' ? 'Welcome to your professional hostel management dashboard.' : `Manage your ${navItems.find(i => i.id === activeTab)?.label.toLowerCase()}.`}
            </p>
          </div>

          {activeTab === 'overview' && renderDashboard()}
          {activeTab === 'account' && renderAccount()}
          {activeTab === 'mess' && <MessMenu />}
          {activeTab === 'community' && <CommunityFeed />}
          {activeTab === 'chat' && (
            <div className="card" style={{ height: 'calc(100vh - 350px)', padding: '0', overflow: 'hidden' }}>
              <ChatSystem />
            </div>
          )}
          {activeTab === 'complaints' && <ComplaintSystem />}
        </main>
      </div>
    </div>
  );
}
