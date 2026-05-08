import { useState, useContext, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Shield, Sun, Moon, GraduationCap, User, Eye, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import ConstellationBackground from './components/ConstellationBackground';
import './index.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', background: 'var(--bg-main)', overflow: 'hidden' }}>
      <ConstellationBackground />
      
      {/* Left Side: Informational Banner */}
      <div style={{ 
        flex: '1.2', 
        position: 'relative', 
        display: window.innerWidth < 1024 ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('/Users/vyshu/.gemini/antigravity/brain/1813a670-c177-4a98-9be0-971e95be7466/hostel_life_banner_1778231411209.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff'
      }}>
        <div className="animate-up" style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#ff4d4d', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>Did you know?</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '500', lineHeight: '1.4', opacity: 0.95 }}>
            HostelConnect reduces maintenance response times by <span style={{ color: '#f37021', fontWeight: '800' }}>65%</span>, making student life smoother and more connected than ever before.
          </p>
          <div style={{ marginTop: '3rem', display: 'flex', gap: '8px' }}>
            <div style={{ width: '40px', height: '6px', borderRadius: '3px', background: '#f37021' }}></div>
            <div style={{ width: '12px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.3)' }}></div>
            <div style={{ width: '12px', height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.3)' }}></div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(10px)',
        zIndex: 1
      }}>
        <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Branding Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
          <img 
            src="https://www.lpu.in/images/logo/logo.png" 
            alt="LPU Logo" 
            style={{ height: '70px', filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none' }} 
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={40} color="#f37021" />
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '12px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: 1 }}>HostelConnect</h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>University Management</p>
            </div>
          </div>
        </div>

        <div className="card animate-up" style={{ width: '100%', maxWidth: '440px', padding: '3.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Log in</h2>
            
            <div style={{ position: 'relative', width: '100%' }}>
              <select className="input-field" style={{ paddingRight: '40px', appearance: 'none', background: 'var(--bg-accent)' }}>
                <option>Main Campus</option>
                <option>Block A Office</option>
                <option>Hostel Support</option>
              </select>
              <ChevronDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            </div>
          </div>

          {error && <div style={{ background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#dc2626', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" className="input-field" placeholder="Registration ID / Email" 
                  value={email} onChange={(e) => setEmail(e.target.value)} required 
                />
                <User style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              </div>
            </div>

            <div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" className="input-field" placeholder="Password" 
                  value={password} onChange={(e) => setPassword(e.target.value)} required 
                />
                <Eye style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn" style={{ 
              width: '100%', 
              padding: '1rem', 
              fontSize: '1rem', 
              background: '#f37021', 
              color: '#fff',
              boxShadow: '0 10px 15px -3px rgba(243, 112, 33, 0.3)'
            }}>
              {isLoading ? 'Verifying...' : 'Login'}
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <Link to="#" style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', textDecoration: 'none' }}>Forgot your password?</Link>
            </div>
          </form>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <Mail size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Student Mail</span>
        </div>
      </div>
    </div>
  );
}
