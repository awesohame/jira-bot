import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';

const Dashboard: React.FC = () => {
    const { logout, getUsername, getEmail } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const username = getUsername();
    const email = getEmail();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="bg-white/80 backdrop-blur-sm shadow-xl border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                JIRA Bot Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your RICEFW tickets and projects</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-gray-900 font-semibold">Welcome back, {username}!</p>
                                <p className="text-gray-500 text-sm">{email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Profile Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">
                                    {username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
                                <p className="text-gray-600">Account information</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Username</label>
                                <p className="text-gray-900 font-medium">{username}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-gray-900 font-medium">{email}</p>
                            </div>
                        </div>
                    </div>

                    {/* RICEFW Management Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">RICEFW Management</h2>
                            <p className="text-gray-600">Manage your JIRA RICEFW tickets</p>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200">
                                View All Tickets
                            </button>
                            <button className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200">
                                Create New Ticket
                            </button>
                            <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200">
                                View Statistics
                            </button>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Actions</h2>
                            <p className="text-gray-600">Shortcuts to common tasks</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate('/projects')}
                                className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 group"
                            >
                                <div className="text-2xl mb-2">�</div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Projects</span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition duration-200 group">
                                <div className="text-2xl mb-2">🎫</div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">New Ticket</span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-200 group">
                                <div className="text-2xl mb-2">⚙️</div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Settings</span>
                            </button>
                            <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition duration-200 group">
                                <div className="text-2xl mb-2">�</div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Analytics</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">0</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <span className="text-yellow-600 font-bold">0</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-bold">0</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 font-bold">0</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Overdue</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Information Section */}
                <div className="mt-8">
                    <UserInfo />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
