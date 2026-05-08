import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Coffee, Edit2, Save, X, Utensils, Pizza, Sun, Moon, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Compute the Monday date string for a given week offset (0 = current week)
function getMondayStr(weekOffset = 0) {
  const now = new Date();
  now.setDate(now.getDate() + weekOffset * 7);
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  const tz = monday.getTimezoneOffset();
  return new Date(monday.getTime() - tz * 60000).toISOString().split('T')[0];
}

export default function MessMenu() {
  const { user } = useContext(AuthContext);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dates
  const todayObj = new Date();
  const todayIndex = todayObj.getDay() === 0 ? 6 : todayObj.getDay() - 1;
  const todayName = DAYS[todayIndex];
  // Local ISO date string yyyy-mm-dd
  const tz = todayObj.getTimezoneOffset();
  const todayDateStr = new Date(todayObj.getTime() - (tz*60*1000)).toISOString().split('T')[0];

  const [activeDay, setActiveDay] = useState(todayName);
  const [viewMode, setViewMode] = useState('today'); // 'today' | 'week'

  
  // Admin Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Feedback State
  const [feedbackStats, setFeedbackStats] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [ratingLoading, setRatingLoading] = useState(false);
  // Track which meal's comment box is open
  const [openComment, setOpenComment] = useState(null);
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

  const submitRating = async (mealType, rating, comment = commentText, shouldClose = true) => {
    try {
      setRatingLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(`${API_URL}/mess-menu/feedback`, {
        date: todayDateStr,
        mealType,
        rating,
        comment
      }, config);
      
      if (shouldClose) {
        setOpenComment(null);
        setCommentText('');
      }
      await fetchFeedback(); // Refresh stats
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating.');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/mess-menu`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenu(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating mess menu:', error);
      alert('Failed to update menu.');
    }
  };

  const handleChange = (day, meal, value) => {
    setEditForm(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value
      }
    }));
  };

  const handleSpecialToggle = (day, mealKey) => {
    setEditForm(prev => {
      const dayData = prev[day] || {};
      const specialMeals = dayData.specialMeals || [];
      const isSpecial = specialMeals.includes(mealKey);
      return {
        ...prev,
        [day]: {
          ...dayData,
          specialMeals: isSpecial 
            ? specialMeals.filter(m => m !== mealKey)
            : [...specialMeals, mealKey]
        }
      };
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#667eea', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  const getMealCards = (day) => {
    const isWeekend = day === 'saturday' || day === 'sunday';
    return [
      { key: 'breakfast', label: 'Breakfast', icon: <Coffee size={24} color="#f6d365" />, time: isWeekend ? '08:00 AM - 10:00 AM' : '07:30 AM - 09:30 AM', gradient: 'linear-gradient(135deg, rgba(246, 211, 101, 0.1) 0%, rgba(253, 160, 133, 0.1) 100%)' },
      { key: 'lunch', label: 'Lunch', icon: <Sun size={24} color="#4facfe" />, time: '11:30 AM - 03:00 PM', gradient: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)' },
      { key: 'snacks', label: 'Snacks', icon: <Pizza size={24} color="#ff0844" />, time: '05:00 PM - 06:00 PM', gradient: 'linear-gradient(135deg, rgba(255, 8, 68, 0.1) 0%, rgba(255, 177, 153, 0.1) 100%)' },
      { key: 'dinner', label: 'Dinner', icon: <Moon size={24} color="#667eea" />, time: '07:30 PM - 09:30 PM', gradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }
    ];
  };

  const currentData = isEditing ? editForm : menu;
  
  // Separate renderer for a single meal card
  const renderMealCard = (meal, day, isTodayHighlight = false) => {
    const dayData = currentData?.[day] || {};
    const isEditingThisCard = isEditing && !isTodayHighlight;
    const stats = feedbackStats[meal.key] || { average: 0, count: 0 };
    const myFeedback = userRatings[meal.key] || { rating: 0 };
    
    const specialMeals = dayData.specialMeals || [];
    const isSpecialMeal = specialMeals.includes(meal.key);
    
    return (
      <div 
        key={meal.key}
        style={{ 
          background: isTodayHighlight ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.15)', 
          borderRadius: '20px', 
          padding: '1.5rem',
          border: isSpecialMeal 
            ? '1px solid rgba(246, 211, 101, 0.6)' 
            : (isTodayHighlight ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255,255,255,0.05)'),
          boxShadow: isSpecialMeal ? '0 0 15px rgba(246, 211, 101, 0.2)' : 'none',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          if(!isEditingThisCard) {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
          }
        }}
        onMouseLeave={(e) => {
          if(!isEditingThisCard) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: meal.gradient }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: meal.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {meal.icon}
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {meal.label} {isSpecialMeal && <span style={{ fontSize: '0.8rem', padding: '2px 6px', background: 'rgba(246, 211, 101, 0.2)', color: '#f6d365', borderRadius: '4px' }}>Special</span>}
              </h3>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '500' }}>{meal.time}</span>
            </div>
          </div>
        </div>

        {isEditingThisCard ? (
          <div>
            <textarea
              value={dayData[meal.key] || ''}
              onChange={(e) => handleChange(day, meal.key, e.target.value)}
              placeholder={`Enter ${meal.label.toLowerCase()} items...`}
              style={{
                width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '12px', color: '#fff', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit'
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', marginTop: '10px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isSpecialMeal} 
                onChange={() => handleSpecialToggle(day, meal.key)}
                style={{ marginRight: '8px' }}
              />
              Mark as Special Meal ⭐
            </label>
          </div>
        ) : (
          <div style={{ minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {dayData[meal.key] ? (
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {dayData[meal.key]}
                </p>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                  No menu specified.
                </p>
              )}
            </div>
            
            {/* Rating Section - ONLY in Today's Highlight */}
            {isTodayHighlight && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        size={20} 
                        style={{ cursor: user?.role === 'admin' ? 'default' : 'pointer' }}
                        color={myFeedback.rating >= star ? '#f6d365' : 'rgba(255,255,255,0.2)'}
                        fill={myFeedback.rating >= star ? '#f6d365' : 'none'}
                        onClick={(e) => {
                          e.stopPropagation();
                          if(user?.role !== 'admin') {
                            setOpenComment(meal.key);
                            // Set the comment text to existing one if any
                            setCommentText(myFeedback.comment || '');
                            submitRating(meal.key, star, myFeedback.comment || '', false); 
                          }
                        }}
                      />
                    ))}
                  </div>
                  {user?.role === 'admin' && (
                    <span style={{ fontSize: '0.9rem', color: '#f6d365', fontWeight: '500' }}>
                      {stats.average > 0 ? `${stats.average} ⭐ (${stats.count})` : 'No ratings'}
                    </span>
                  )}
                </div>
                
                {/* Optional Comment Box */}
                {openComment === meal.key && user?.role !== 'admin' && (
                  <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Add a comment</span>
                      <X 
                        size={16} 
                        style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }} 
                        onClick={() => { setOpenComment(null); setCommentText(''); }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="Type your feedback..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem' }}
                      />
                      <button 
                        onClick={() => submitRating(meal.key, myFeedback.rating, commentText, true)}
                        disabled={ratingLoading}
                        style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}
                      >
                        {ratingLoading ? '...' : 'Send'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {viewMode === 'today' ? (
        <div>
          {/* TODAY'S MENU HIGHLIGHT */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', margin: 0 }}>
              <Calendar color="#667eea" size={28} /> 
              Today's Menu ({todayName.charAt(0).toUpperCase() + todayName.slice(1)})
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={() => setViewMode('week')}
                className="login-btn" 
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', gap: '8px', fontSize: '0.9rem' }}
              >
                <Calendar size={18} /> View Weekly Schedule
              </button>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => { setViewMode('week'); setIsEditing(true); }}
                  className="login-btn" 
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', gap: '8px', fontSize: '0.9rem' }}
                >
                  <Edit2 size={18} /> Edit Menu
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {getMealCards(todayName).map(meal => renderMealCard(meal, todayName, true))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* WEEKLY MENU / ADMIN EDITOR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setViewMode('today')}
                className="login-btn" 
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', gap: '8px', fontSize: '0.9rem' }}
              >
                Back to Today
              </button>
              <h2 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Weekly Schedule</h2>
            </div>
            
            {user?.role === 'admin' && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                {isEditing ? (
                  <>
                    <button onClick={() => { setIsEditing(false); setEditForm(menu); }} className="login-btn" style={{ background: 'rgba(255, 50, 50, 0.1)', color: '#ff8a8a', padding: '10px 16px', border: '1px solid rgba(255, 50, 50, 0.2)', display: 'flex', gap: '8px' }}><X size={18} /> Cancel</button>
                    <button onClick={handleSave} className="login-btn" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '10px 16px', display: 'flex', gap: '8px' }}><Save size={18} /> Save Menu</button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="login-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', gap: '8px' }}><Edit2 size={18} /> Edit Menu</button>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '5px', maxWidth: '100%', scrollbarWidth: 'none' }}>
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                style={{
                  padding: '10px 20px', borderRadius: '12px', border: '1px solid',
                  borderColor: activeDay === day ? 'rgba(102, 126, 234, 0.5)' : 'rgba(255,255,255,0.05)',
                  background: activeDay === day ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.05)',
                  color: activeDay === day ? '#fff' : 'rgba(255,255,255,0.6)',
                  fontWeight: activeDay === day ? '600' : '400', cursor: 'pointer',
                  textTransform: 'capitalize', transition: 'all 0.3s ease', whiteSpace: 'nowrap'
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {getMealCards(activeDay).map(meal => renderMealCard(meal, activeDay, false))}
          </div>
        </div>
      )}
    </div>
  );
}
