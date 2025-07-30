import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Key, Shield, Database, CheckCircle } from 'lucide-react';

const UserInfo: React.FC = () => {
    const {
        getUsername,
        getEmail,
        getJiraToken,
        getSessionToken,
        getUserData,
        isAuthenticated
    } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                Not authenticated
            </div>
        );
    }

    const username = getUsername();
    const email = getEmail();
    const jiraToken = getJiraToken();
    const sessionToken = getSessionToken();
    const userData = getUserData();

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">User Information</h3>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div className="group hover:scale-105 transition-all duration-300">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="p-2 bg-blue-500 rounded-lg">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <label className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Username</label>
                                    </div>
                                    <p className="text-gray-900 font-bold text-lg">{username || 'Not available'}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group hover:scale-105 transition-all duration-300">
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="p-2 bg-emerald-500 rounded-lg">
                                            <Mail className="w-4 h-4 text-white" />
                                        </div>
                                        <label className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Email</label>
                                    </div>
                                    <p className="text-gray-900 font-bold text-lg break-all">{email || 'Not available'}</p>
                                </div>
                            </div>

                            {/* JIRA Token */}
                            <div className="group hover:scale-105 transition-all duration-300">
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="p-2 bg-amber-500 rounded-lg">
                                            <Key className="w-4 h-4 text-white" />
                                        </div>
                                        <label className="text-sm font-semibold text-amber-700 uppercase tracking-wide">JIRA Token</label>
                                    </div>
                                    <p className="text-gray-900 font-mono text-sm bg-white/50 p-3 rounded-lg border">
                                        {jiraToken ? `${jiraToken.substring(0, 20)}...` : 'Not available'}
                                    </p>
                                </div>
                            </div>

                            {/* Session Token */}
                            <div className="group hover:scale-105 transition-all duration-300">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="p-2 bg-purple-500 rounded-lg">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        <label className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Session Token</label>
                                    </div>
                                    <p className="text-gray-900 font-mono text-sm bg-white/50 p-3 rounded-lg border">
                                        {sessionToken ? `${sessionToken.substring(0, 20)}...` : 'Not available'}
                                    </p>
                                </div>
                            </div>

                            {/* User Data */}
                            <div className="md:col-span-2 group hover:scale-[1.02] transition-all duration-300">
                                <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="p-2 bg-slate-600 rounded-lg">
                                            <Database className="w-4 h-4 text-white" />
                                        </div>
                                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">User Data (JSON)</label>
                                    </div>
                                    <div className="bg-white/70 rounded-lg border p-4 overflow-hidden">
                                        <pre className="text-slate-800 text-sm overflow-x-auto font-mono leading-relaxed">
                                            {JSON.stringify(userData, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Authentication Status */}
                            <div className="md:col-span-2 group hover:scale-[1.02] transition-all duration-300">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-center space-x-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-3 bg-green-500 rounded-full shadow-lg">
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-green-700 uppercase tracking-wide block">Authentication Status</label>
                                                <p className="text-green-800 font-bold text-xl">
                                                    Authenticated Successfully
                                                </p>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                                                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
