import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>JIRA Bot Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.username}!</span>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="dashboard-card">
                    <h2>User Profile</h2>
                    <div className="profile-info">
                        <p><strong>Username:</strong> {user?.username}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h2>RICEFW Management</h2>
                    <p>Manage your JIRA RICEFW tickets here.</p>
                    <div className="action-buttons">
                        <button className="action-button">View Tickets</button>
                        <button className="action-button">Create Ticket</button>
                        <button className="action-button">Statistics</button>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions">
                        <button className="quick-action-button">
                            📊 View Analytics
                        </button>
                        <button className="quick-action-button">
                            🎫 New Ticket
                        </button>
                        <button className="quick-action-button">
                            ⚙️ Settings
                        </button>
                        <button className="quick-action-button">
                            📋 Reports
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
