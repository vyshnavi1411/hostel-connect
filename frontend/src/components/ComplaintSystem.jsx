import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Clock, Plus, Filter } from 'lucide-react';
import AuthContext from '../context/AuthContext';

export default function ComplaintSystem() {
  const { user, token } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    hostelBlock: user?.hostelBlock || '',
    roomNumber: user?.roomNumber || ''
  });

  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Wi-Fi', 'Other'];
  const statuses = ['Pending', 'In Progress', 'Resolved'];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.get('http://localhost:5000/api/complaints', config);
      setComplaints(res.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post('http://localhost:5000/api/complaints', formData, config);
      setShowForm(false);
      setFormData({ ...formData, title: '', description: '' });
      fetchComplaints();
    } catch (err) {
      console.error('Error submitting complaint:', err);
    }
  };

  const updateStatus = async (complaintId, status) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`http://localhost:5000/api/complaints/${complaintId}`, { status }, config);
      fetchComplaints();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={16} color="#ffb86c" />;
      case 'In Progress': return <Plus size={16} color="#8be9fd" />;
      case 'Resolved': return <CheckCircle size={16} color="#50fa7b" />;
      default: return null;
    }
  };

  return (
    <div className="complaint-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#fff' }}>{user?.role === 'admin' ? 'Management Dashboard' : 'My Complaints'}</h2>
        {user?.role !== 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="login-btn" style={{ maxWidth: '180px', margin: 0 }}>
            <AlertTriangle size={18} style={{ marginRight: '8px' }} /> Lodge Complaint
          </button>
        )}
      </div>

      {showForm && (
        <div className="glass-card fade-in" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#fff' }}>New Maintenance Request</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Title</label>
                <input name="title" className="login-input" placeholder="Short summary" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Category</label>
                <select name="category" className="login-input" value={formData.category} onChange={handleInputChange} style={{ color: '#fff' }}>
                  {categories.map(c => <option key={c} value={c} style={{background: '#222'}}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Detailed Description</label>
              <textarea name="description" className="login-input" placeholder="Explain the issue..." value={formData.description} onChange={handleInputChange} required style={{ minHeight: '80px' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="login-btn" style={{ margin: 0 }}>Submit Request</button>
              <button type="button" onClick={() => setShowForm(false)} className="login-btn" style={{ margin: 0, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="complaints-list">
        {complaints.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            No complaints found.
          </div>
        ) : (
          complaints.map(complaint => (
            <div key={complaint._id} className="glass-card fade-in" style={{ marginBottom: '1rem', padding: '1.5rem', borderLeft: `4px solid ${complaint.status === 'Resolved' ? '#50fa7b' : complaint.status === 'In Progress' ? '#8be9fd' : '#ffb86c'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>{complaint.category}</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>{complaint.hostelBlock} - Room {complaint.roomNumber}</span>
                  </div>
                  <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>{complaint.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{complaint.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {getStatusIcon(complaint.status)} {complaint.status}
                  </div>
                  {user?.role === 'admin' && complaint.status !== 'Resolved' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {complaint.status === 'Pending' && (
                        <button onClick={() => updateStatus(complaint._id, 'In Progress')} style={{ fontSize: '0.8rem', background: 'rgba(139, 233, 253, 0.2)', border: '1px solid #8be9fd', color: '#8be9fd', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Start Work</button>
                      )}
                      <button onClick={() => updateStatus(complaint._id, 'Resolved')} style={{ fontSize: '0.8rem', background: 'rgba(80, 250, 123, 0.2)', border: '1px solid #50fa7b', color: '#50fa7b', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Resolve</button>
                    </div>
                  )}
                  {user?.role === 'admin' && (
                     <div style={{marginTop: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)'}}>
                        Reported by: {complaint.user?.name}
                     </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
