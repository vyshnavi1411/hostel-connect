import { useState, useContext } from 'react';
import { Mail, Lock, User, Hash, DoorClosed, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import './index.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    hostelBlock: '',
    roomNumber: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(formData);
    
    setIsLoading(false);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>

      <div className="glass-card fade-in">
        <div className="card-header">
          <div className="logo-icon">
            <UserPlus size={28} />
          </div>
          <h1>Create Account</h1>
          <p>Join HostelConnect to manage your stay.</p>
        </div>

        {error && <div className="error-message shake">{error}</div>}

        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input 
                type="text" 
                name="name"
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <div className="input-group" style={{flex: 1}}>
              <label>Hostel Block</label>
              <div className="input-wrapper">
                <DoorClosed className="input-icon" size={20} />
                <input 
                  type="text" 
                  name="hostelBlock"
                  placeholder="A" 
                  value={formData.hostelBlock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group" style={{flex: 1}}>
              <label>Room Number</label>
              <div className="input-wrapper">
                <Hash className="input-icon" size={20} />
                <input 
                  type="text" 
                  name="roomNumber"
                  placeholder="101" 
                  value={formData.roomNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="card-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
