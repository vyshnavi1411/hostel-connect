import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Coffee, Edit2, Save, X, Utensils, Pizza, Sun, Moon, Star, Calendar, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function MessMenu() {
  const { user } = useContext(AuthContext);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const todayObj = new Date();
  const todayIndex = todayObj.getDay() === 0 ? 6 : todayObj.getDay() - 1;
  const todayName = DAYS[todayIndex];
  const tz = todayObj.getTimezoneOffset();
  const todayDateStr = new Date(todayObj.getTime() - (tz*60*1000)).toISOString().split('T')[0];

  const [activeDay, setActiveDay] = useState(todayName);
  const [viewMode, setViewMode] = useState('today'); 
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const [feedbackStats, setFeedbackStats] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [ratingLoading, setRatingLoading] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchMenu();
    fetchFeedback();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${API_URL}/mess-menu`, config);
      setMenu(res.data);
      setEditForm(res.data);
    } catch (error) {
      console.error('Error fetching mess menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/mess-menu/feedback/${todayDateStr}`, config);
      setFeedbackStats(res.data.stats || {});
      setUserRatings(res.data.userRatings || {});
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const submitRating = async (mealType, rating, comment = commentText) => {
    try {
      setRatingLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${API_URL}/mess-menu/feedback`, { date: todayDateStr, mealType, rating, comment }, config);
      await fetchFeedback();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/mess-menu`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      setMenu(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating mess menu:', error);
    }
  };

  const handleChange = (day, meal, value) => {
    setEditForm(prev => ({ ...prev, [day]: { ...prev[day], [meal]: value } }));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading schedule...</div>;
  }

  const getMealCards = (day) => {
    const isWeekend = day === 'saturday' || day === 'sunday';
    return [
      { key: 'breakfast', label: 'Breakfast', icon: <Coffee size={20} />, color: '#f59e0b', time: isWeekend ? '08:00 - 10:00' : '07:30 - 09:30' },
      { key: 'lunch', label: 'Lunch', icon: <Sun size={20} />, color: '#3b82f6', time: '11:30 - 14:30' },
      { key: 'snacks', label: 'Evening Snacks', icon: <Pizza size={20} />, color: '#ec4899', time: '17:00 - 18:00' },
      { key: 'dinner', label: 'Dinner', icon: <Moon size={20} />, color: '#8b5cf6', time: '19:30 - 21:30' }
    ];
  };

  const renderMeal = (meal, day, isToday) => {
    const dayData = (isEditing ? editForm : menu)?.[day] || {};
    const stats = feedbackStats[meal.key] || { average: 0, count: 0 };
    const myRating = userRatings[meal.key]?.rating || 0;

    return (
      <div key={meal.key} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid ${meal.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: meal.color }}>{meal.icon}</div>
            <h4 style={{ fontSize: '1.1rem' }}>{meal.label}</h4>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {meal.time}
          </div>
        </div>

        {isEditing ? (
          <textarea
            className="input-field" style={{ minHeight: '100px', resize: 'none' }}
            value={dayData[meal.key] || ''}
            onChange={(e) => handleChange(day, meal.key, e.target.value)}
          />
        ) : (
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {dayData[meal.key] || 'No items listed for this session.'}
            </p>
          </div>
        )}

        {isToday && !isEditing && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <Star 
                  key={s} size={16} cursor="pointer"
                  fill={myRating >= s ? meal.color : 'none'}
                  color={myRating >= s ? meal.color : 'var(--text-muted)'}
                  onClick={() => user?.role !== 'admin' && submitRating(meal.key, s)}
                />
              ))}
            </div>
            {stats.count > 0 && <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{stats.average} ({stats.count} ratings)</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-accent)', padding: '4px', borderRadius: '12px' }}>
          <button onClick={() => setViewMode('today')} className="btn" style={{ background: viewMode === 'today' ? 'var(--bg-secondary)' : 'transparent', color: viewMode === 'today' ? 'var(--brand-primary)' : 'var(--text-secondary)', boxShadow: viewMode === 'today' ? 'var(--card-shadow)' : 'none' }}>Today</button>
          <button onClick={() => setViewMode('week')} className="btn" style={{ background: viewMode === 'week' ? 'var(--bg-secondary)' : 'transparent', color: viewMode === 'week' ? 'var(--brand-primary)' : 'var(--text-secondary)', boxShadow: viewMode === 'week' ? 'var(--card-shadow)' : 'none' }}>Full Week</button>
        </div>

        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            {isEditing ? (
              <button onClick={handleSave} className="btn btn-primary"><Save size={18}/> Publish Menu</button>
            ) : (
              <button onClick={() => { setViewMode('week'); setIsEditing(true); }} className="btn btn-ghost"><Edit2 size={18}/> Manage Menu</button>
            )}
          </div>
        )}
      </div>

      {viewMode === 'week' && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {DAYS.map(day => (
            <button
              key={day} onClick={() => setActiveDay(day)}
              className="btn btn-ghost"
              style={{
                textTransform: 'capitalize', whiteSpace: 'nowrap',
                background: activeDay === day ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                color: activeDay === day ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {getMealCards(viewMode === 'today' ? todayName : activeDay).map(meal => renderMeal(meal, viewMode === 'today' ? todayName : activeDay, viewMode === 'today'))}
      </div>
    </div>
  );
}
