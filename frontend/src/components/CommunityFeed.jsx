import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MessageSquare, ThumbsUp, Send, User as UserIcon, Clock, Filter, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CommunityFeed() {
  const { token, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(false);
      const res = await axios.get(`${API_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${API_URL}/posts`, { content: newPost, isAnonymous }, config);
      setPosts([res.data, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${API_URL}/posts/${postId}/like`, {}, config);
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data } : post));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div className="animate-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Create Post Card */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Share with the Community</h3>
        <form onSubmit={handlePostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            className="input-field"
            placeholder="What's on your mind? Posts are anonymous for residents..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            style={{ minHeight: '120px', resize: 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input 
                type="checkbox" 
                checked={isAnonymous} 
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
              />
              Post anonymously
            </label>
            <button type="submit" disabled={!newPost.trim()} className="btn btn-primary">
              <Send size={18} /> Post Update
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {posts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
             <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.1 }} />
             <p>No community updates yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserIcon size={20} color="var(--text-secondary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{post.user?.role === 'admin' ? post.user.name : 'Anonymous Resident'}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {post.user?.role === 'admin' && <span className="badge badge-blue">Official</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{post.content}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button 
                  onClick={() => handleLike(post._id)}
                  className="btn btn-ghost"
                  style={{ padding: '4px 12px', fontSize: '0.85rem', gap: '6px', color: post.likes?.some(l => l.user === user?.id) ? 'var(--brand-primary)' : 'inherit' }}
                >
                  <ThumbsUp size={16} /> {post.likes?.length || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
