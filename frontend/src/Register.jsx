import { useState, useContext, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, Building, Hash, Shield, ArrowRight, Sun, Moon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import './index.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    hostelBlock: 'A',
    roomNumber: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ position: 'fixed', top: '2rem', right: '2rem' }}>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="card animate-up" style={{ width: '100%', maxWidth: '520px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '56px', height: '56px', background: 'var(--brand-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto 1.5rem' }}>
            <Shield size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>HostelConnect</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your official resident profile</p>
        </div>

        {error && <div className="card" style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
             <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input type="text" name="name" className="input-field" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required style={{ paddingLeft: '40px' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input type="email" name="email" className="input-field" placeholder="john@email.com" value={formData.email} onChange={handleInputChange} required style={{ paddingLeft: '40px' }} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Security Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input type="password" name="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Hostel Block</label>
              <div style={{ position: 'relative' }}>
                <Building style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <select name="hostelBlock" className="input-field" value={formData.hostelBlock} onChange={handleInputChange} style={{ paddingLeft: '40px', appearance: 'none' }}>
                  {['A', 'B', 'C', 'D'].map(b => <option key={b} value={b}>Block {b}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Room Number</label>
              <div style={{ position: 'relative' }}>
                <Hash style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input type="text" name="roomNumber" className="input-field" placeholder="101" value={formData.roomNumber} onChange={handleInputChange} required style={{ paddingLeft: '40px' }} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '1rem' }}>
            {isLoading ? 'Creating account...' : 'Complete Registration'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: '600', textDecoration: 'none' }}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
