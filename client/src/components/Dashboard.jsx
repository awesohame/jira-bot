import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            JIRA Bot Dashboard
                        </h1>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/projects"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                View Projects
                            </Link>
                            <span className="text-gray-700 font-medium">Welcome, {user?.username}!</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-xl transition-all duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                👤
                            </div>
                            User Profile
                        </h2>
                        <div className="space-y-3">
                            <p className="text-gray-700"><span className="font-semibold">Username:</span> {user?.username}</p>
                            <p className="text-gray-700"><span className="font-semibold">Email:</span> {user?.email}</p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-xl transition-all duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                🎫
                            </div>
                            RICEFW Management
                        </h2>
                        <p className="text-gray-600 mb-4">Manage your JIRA RICEFW tickets here.</p>
                        <div className="space-y-2">
                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                                View Tickets
                            </button>
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                                Create Ticket
                            </button>
                            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                                Statistics
                            </button>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 hover:shadow-xl transition-all duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                ⚡
                            </div>
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm flex flex-col items-center">
                                <span className="text-lg mb-1">📊</span>
                                Analytics
                            </button>
                            <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm flex flex-col items-center">
                                <span className="text-lg mb-1">🎫</span>
                                New Ticket
                            </button>
                            <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm flex flex-col items-center">
                                <span className="text-lg mb-1">⚙️</span>
                                Settings
                            </button>
                            <button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm flex flex-col items-center">
                                <span className="text-lg mb-1">📋</span>
                                Reports
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
