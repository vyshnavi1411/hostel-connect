import React, { useContext, useState } from 'react';
import { Home, LogOut, MessageSquare, MessageCircle, AlertCircle, User as UserIcon } from 'lucide-react';
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
        return (
          <div className="fade-in" style={{ margin: '2rem 0', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', display: 'block', marginBottom: '4px'}}>Full Name</label>
                <p style={{color: '#fff', fontWeight: '500'}}>{user?.name}</p>
              </div>
              <div>
                <label style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', display: 'block', marginBottom: '4px'}}>Email Address</label>
                <p style={{color: '#fff', fontWeight: '500'}}>{user?.email}</p>
              </div>
              <div>
                <label style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', display: 'block', marginBottom: '4px'}}>Hostel Role</label>
                <p style={{color: '#fff', fontWeight: '500', textTransform: 'capitalize'}}>{user?.role || 'student'}</p>
              </div>
              <div>
                <label style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', display: 'block', marginBottom: '4px'}}>Hostel Block</label>
                <p style={{color: '#fff', fontWeight: '500'}}>{user?.hostelBlock || 'N/A'}</p>
              </div>
              <div>
                <label style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', display: 'block', marginBottom: '4px'}}>Room Number</label>
                <p style={{color: '#fff', fontWeight: '500'}}>{user?.roomNumber || 'N/A'}</p>
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
