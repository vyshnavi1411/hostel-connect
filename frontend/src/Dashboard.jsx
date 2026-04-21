import React, { useContext, useState } from 'react';
import { Home, LogOut, MessageSquare, MessageCircle, AlertCircle, User as UserIcon, Shield, Mail, MapPin, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import CommunityFeed from './components/CommunityFeed';
import ComplaintSystem from './components/ComplaintSystem';
import ChatSystem from './components/ChatSystem';
import './index.css';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon size={20} /> },
    { id: 'community', label: 'Community Hub', icon: <MessageSquare size={20} /> },
    { id: 'chat', label: 'Global Chat', icon: <MessageCircle size={20} /> },
    { id: 'complaints', label: 'Complaints', icon: <AlertCircle size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        // Generate initials for avatar
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
                </div>
              </div>

              {/* Hostel Information */}
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

            </div>
          </div>
        );
      case 'community':
        return <CommunityFeed />;
      case 'chat':
        return <ChatSystem />;
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
            <div className="logo-icon" style={{ marginBottom: '1rem' }}>
              <Home size={28} />
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
        <div style={{ flex: 1 }}>
          <div className="glass-card fade-in" style={{ padding: '2rem', minHeight: '85vh', display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
            <div style={{ marginBottom: '2rem', flexShrink: 0 }}>
              <h2 style={{ color: '#fff', fontSize: '1.8rem' }}>
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                {activeTab === 'profile' ? `Welcome back, ${user?.name}!` : 
                 activeTab === 'community' ? 'Connect anonymously with your fellow residents.' : 
                 activeTab === 'chat' ? 'Real-time global chat with everyone in the hostel.' :
                 'Lodge and track maintenance requests.'}
              </p>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
