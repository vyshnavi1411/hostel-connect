import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import AuthContext from './context/AuthContext';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Redirect Route Component (If logged in, don't show login page)
const RedirectRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={
        <RedirectRoute>
          <Login />
        </RedirectRoute>
      } />
      <Route path="/register" element={
        <RedirectRoute>
          <Register />
        </RedirectRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
