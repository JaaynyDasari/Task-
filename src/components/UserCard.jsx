import React from 'react';
import './UserCard.css';

const UserCard = ({ user }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    const colors = {
      'Admin': '#e74c3c',
      'Manager': '#f39c12',
      'Developer': '#3498db',
      'Designer': '#9b59b6',
      'Analyst': '#1abc9c',
      'User': '#95a5a6'
    };
    return colors[role] || '#95a5a6';
  };

  return (
    <div className="user-card">
      <div className="user-avatar">
        <span>{getInitials(user.name)}</span>
      </div>
      
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        
        <div className="user-details">
          <div className="user-role">
            <span 
              className="role-badge"
              style={{ backgroundColor: getRoleColor(user.role) }}
            >
              {user.role}
            </span>
          </div>
          
          <div className="user-department">
            <span className="department-label">Department:</span>
            <span className="department-value">{user.department}</span>
          </div>
          
          <div className="user-join-date">
            <span className="join-date-label">Joined:</span>
            <span className="join-date-value">{formatDate(user.joinDate)}</span>
          </div>
          
          <div className="user-status">
            <span className={`status-indicator ${user.isActive ? 'active' : 'inactive'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;