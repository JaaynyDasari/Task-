import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedDepartment, selectedRole]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    if (selectedRole) {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedRole('');
  };

  const departments = [...new Set(users.map(user => user.department))];
  const roles = [...new Set(users.map(user => user.role))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>User Dashboard</h1>
            <p>Welcome back, {currentUser.name}</p>
          </div>
          <button onClick={onLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-controls">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <div className="filters">
            <FilterDropdown
              label="Department"
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              options={departments}
            />
            
            <FilterDropdown
              label="Role"
              value={selectedRole}
              onChange={setSelectedRole}
              options={roles}
            />
            
            <button onClick={clearFilters} className="clear-filters-button">
              Clear Filters
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <span className="stat-number">{users.length}</span>
          </div>
          <div className="stat-card">
            <h3>Filtered Results</h3>
            <span className="stat-number">{filteredUsers.length}</span>
          </div>
          <div className="stat-card">
            <h3>Departments</h3>
            <span className="stat-number">{departments.length}</span>
          </div>
        </div>

        <div className="users-section">
          {filteredUsers.length === 0 ? (
            <div className="no-results">
              <h3>No users found</h3>
              <p>
                {searchTerm || selectedDepartment || selectedRole
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No users available in the system.'}
              </p>
            </div>
          ) : (
            <div className="users-grid">
              {filteredUsers.map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;