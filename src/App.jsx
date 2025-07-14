import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Profile from './components/Profile'; // Import Profile
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // State to hold user role
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setIsAuthenticated(true);
      setUserRole(user.role);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setUserRole(user.role);

    // --- ROLE-BASED REDIRECTION ---
    if (user.role === 'Admin') {
      navigate('/dashboard');
    } else {
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        {/* Protected Admin Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated && userRole === 'Admin' ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        
        {/* Protected User Profile Route */}
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        
        {/* Default Route Logic */}
        <Route 
          path="/" 
          element={<Navigate to={!isAuthenticated ? "/login" : userRole === 'Admin' ? "/dashboard" : "/profile"} />} 
        />
      </Routes>
    </div>
  );
}

// NOTE: You need to wrap App in BrowserRouter in main.jsx.
// The useNavigate hook can only be used in a component that is a descendant of a <Router>.
// The default setup in main.jsx does this, so it should work.

export default App;