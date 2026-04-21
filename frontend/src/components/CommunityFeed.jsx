import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Send, Heart, User, MessageSquare } from 'lucide-react';
import AuthContext from '../context/AuthContext';

export default function CommunityFeed() {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.post('http://localhost:5000/api/posts', { content, isAnonymous }, config);
      setPosts([res.data, ...posts]);
      setContent('');
      setLoading(false);
    } catch (err) {
      console.error('Error creating post:', err);
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, config);
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data } : post));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div className="feed-container fade-in">
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#fff' }}>Share with the Community</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="login-input"
            placeholder="What's on your mind? (Hostel life, mess reviews, etc.)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ minHeight: '100px', resize: 'vertical', marginBottom: '1rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Post Anonymously
            </label>
            <button type="submit" className="login-btn" style={{ maxWidth: '120px', margin: 0 }} disabled={loading}>
              <Send size={18} style={{ marginRight: '8px' }} /> {loading ? '...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      <div className="posts-list">
        {posts.map(post => (
          <div key={post._id} className="glass-card fade-in" style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ background: post.isAnonymous ? 'rgba(255,255,255,0.1)' : 'rgba(100,200,255,0.2)', padding: '8px', borderRadius: '50%', marginRight: '12px' }}>
                <User size={20} color={post.isAnonymous ? '#ccc' : '#64ccff'} />
              </div>
              <div>
                <h4 style={{ color: '#fff' }}>{post.user.name}</h4>
                <small style={{ color: 'rgba(255,255,255,0.5)' }}>{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{post.content}</p>
            <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <button 
                onClick={() => handleLike(post._id)}
                style={{ background: 'none', border: 'none', color: post.likes?.length > 0 ? '#ff4b4b' : 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Heart size={18} fill={post.likes?.length > 0 ? '#ff4b4b' : 'none'} /> {post.likes?.length || 0}
              </button>
              <div style={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={18} /> {post.comments?.length || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
