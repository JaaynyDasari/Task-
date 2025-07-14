import React from 'react';
import './Profile.css';

const Profile = ({ onLogout }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Welcome, {currentUser.name}!</h1>
        <p>This is your personal profile page.</p>
        <p>Your role is: {currentUser.role}</p>
        <button onClick={onLogout} className="profile-logout-button">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;