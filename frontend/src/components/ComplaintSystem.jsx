import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Clock, Plus, Filter, Wrench, ShieldAlert, ChevronDown, MapPin, Hash } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ComplaintSystem() {
  const { user, token } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Plumbing',
    hostelBlock: user?.hostelBlock || '',
    roomNumber: user?.roomNumber || ''
  });

  const categories = ['Plumbing', 'Electrical', 'Cleaning', 'Wi-Fi', 'Other'];

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/complaints`, config);
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/complaints`, formData, config);
      setShowForm(false);
      setFormData({ ...formData, title: '', description: '' });
      fetchComplaints();
    } catch (err) {
      console.error('Error submitting complaint:', err);
    }
  };

  const updateStatus = async (complaintId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/complaints/${complaintId}`, { status }, config);
      fetchComplaints();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#fffbeb', text: '#92400e', border: '#fef3c7' };
      case 'In Progress': return { bg: '#eff6ff', text: '#1e40af', border: '#dbeafe' };
      case 'Resolved': return { bg: '#ecfdf5', text: '#065f46', border: '#d1fae5' };
      default: return { bg: 'var(--bg-accent)', text: 'var(--text-secondary)', border: 'var(--border-subtle)' };
    }
  };

  return (
    <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Service Requests</h3>
        {user?.role !== 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? <Plus size={18} style={{ transform: 'rotate(45deg)' }} /> : <Plus size={18} />}
            {showForm ? 'Cancel Request' : 'New Service Request'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="card animate-up">
          <h4 style={{ marginBottom: '1.5rem' }}>Lodge a Complaint</h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Issue Title</label>
                <input type="text" name="title" className="input-field" placeholder="Brief summary" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Category</label>
                <select name="category" className="input-field" value={formData.category} onChange={handleInputChange}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>Details</label>
              <textarea name="description" className="input-field" placeholder="Provide more context..." value={formData.description} onChange={handleInputChange} required style={{ minHeight: '100px', resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
               <button type="submit" className="btn btn-primary">Submit Request</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {complaints.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
             <Wrench size={48} style={{ margin: '0 auto 1rem', opacity: 0.1 }} />
             <p>No service requests found.</p>
          </div>
        ) : (
          complaints.map(complaint => {
            const status = getStatusColor(complaint.status);
            return (
              <div key={complaint._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '100px', background: 'var(--bg-accent)', color: 'var(--text-secondary)', fontWeight: '700' }}>{complaint.category.toUpperCase()}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12}/> Block {complaint.hostelBlock}, Room {complaint.roomNumber}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{complaint.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{complaint.description}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                  <span style={{ 
                    padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800',
                    background: status.bg, color: status.text, border: `1px solid ${status.border}`
                  }}>
                    {complaint.status.toUpperCase()}
                  </span>
                  {user?.role === 'admin' && complaint.status !== 'Resolved' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {complaint.status === 'Pending' && (
                        <button onClick={() => updateStatus(complaint._id, 'In Progress')} className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#eff6ff', color: '#1e40af', border: '1px solid #dbeafe' }}>In Progress</button>
                      )}
                      <button onClick={() => updateStatus(complaint._id, 'Resolved')} className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #d1fae5' }}>Mark Resolved</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
