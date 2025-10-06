import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h2>HRM System</h2>
          <div className="navbar-right">
            <span className="user-name">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="user-role">{user?.role}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="dashboard-content">
        <div className="container">
          <h1>Welcome to HRM Dashboard</h1>
          <p className="welcome-text">
            This is the main dashboard. Features will be implemented here.
          </p>
          
          <div className="dashboard-grid">
            <div className="card dashboard-card" onClick={() => navigate('/job-postings')}>
              <h3>Job Postings</h3>
              <p>Create and manage job postings, view applicants</p>
              <span className="active-badge">Active</span>
            </div>
            
            <div className="card dashboard-card">
              <h3>Employee Management</h3>
              <p>Manage employee records, profiles, and information</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
            
            <div className="card dashboard-card">
              <h3>Leave Management</h3>
              <p>Handle leave requests, approvals, and tracking</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
            
            <div className="card dashboard-card">
              <h3>Attendance</h3>
              <p>Track employee attendance and working hours</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
            
            <div className="card dashboard-card">
              <h3>Payroll</h3>
              <p>Manage salary, bonuses, and payroll processing</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
            
            <div className="card dashboard-card">
              <h3>Department Management</h3>
              <p>Organize departments and team structures</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
            
            <div className="card dashboard-card">
              <h3>Reports</h3>
              <p>Generate various HR reports and analytics</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

