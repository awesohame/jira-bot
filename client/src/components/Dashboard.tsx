import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">JIRA Bot Dashboard</h1>
                            <p className="text-primary-100">Manage your RICEFW tickets</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-white font-medium">Welcome back!</p>
                                <p className="text-primary-100 text-sm">{user?.username}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
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
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {user?.username?.charAt(0).toUpperCase()}
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
                                <p className="text-gray-900 font-medium">{user?.username}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-gray-900 font-medium">{user?.email}</p>
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
                            <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 group">
                                <div className="text-2xl mb-2">📊</div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Analytics</span>
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
                                <div className="text-2xl mb-2">📋</div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Reports</span>
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
            </main>
        </div>
    );
};

export default Dashboard;
