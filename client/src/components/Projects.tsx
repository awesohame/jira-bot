import React, { useState } from 'react';
import { projectAPI, JiraProject, JiraProjectRequest, JiraProjectResponse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ProjectCard from './ProjectCard';

const Projects: React.FC = () => {
    const [projects, setProjects] = useState<JiraProject[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [atlassianDomain, setAtlassianDomain] = useState('');
    const { getUserData, isAuthenticated } = useAuth();

    const user = getUserData();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!atlassianDomain.trim()) {
            setError('Please enter your Atlassian domain');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const request: JiraProjectRequest = {
                atlassianDomain: atlassianDomain.trim(),
                searchQuery: searchQuery.trim() || undefined,
                maxResults: 50,
                startAt: 0
            };

            const response = await projectAPI.searchProjects(request);
            const projectData: JiraProjectResponse = response.data;

            setProjects(projectData.values || []);
        } catch (err: any) {
            console.error('Error fetching projects:', err);
            setError(err.response?.data || 'Failed to fetch projects. Please check your credentials and domain.');
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        if (atlassianDomain.trim()) {
            handleSearch({ preventDefault: () => { } } as React.FormEvent);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
                    Please log in to view projects
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
                        <span className="text-2xl">🚀</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
                        JIRA Projects
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover and manage your JIRA projects with ease. Search across your Atlassian workspace and get instant access to all your project data.
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="domain" className="block text-sm font-semibold text-gray-700">
                                    Atlassian Domain *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="domain"
                                        value={atlassianDomain}
                                        onChange={(e) => setAtlassianDomain(e.target.value)}
                                        placeholder="your-company"
                                        required
                                        className="w-full px-4 py-4 pr-32 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                    />
                                    <span className="absolute right-4 top-4 text-gray-500 text-sm font-medium">
                                        .atlassian.net
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="search" className="block text-sm font-semibold text-gray-700">
                                    Search Projects
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Project name or key..."
                                        className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Searching Projects...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        Search Projects
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Searching as: <span className="font-semibold text-gray-900 ml-1">{user?.email}</span>
                        {user?.jiraToken && (
                            <span className="ml-3 flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-green-600 font-medium">JIRA token configured</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Projects Grid */}
                {projects.length > 0 && (
                    <div className="mb-8">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                🎯 Found {projects.length} project{projects.length !== 1 ? 's' : ''}
                            </h2>
                            <p className="text-gray-600">Click on any project to view in JIRA or copy its key to clipboard</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && projects.length === 0 && atlassianDomain && (
                    <div className="text-center py-16">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-white/30 max-w-md mx-auto">
                            <div className="text-6xl mb-6">�</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">No projects found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchQuery
                                    ? `No projects found matching "${searchQuery}" in ${atlassianDomain}.atlassian.net`
                                    : `No projects found in ${atlassianDomain}.atlassian.net`
                                }
                            </p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p>• Check your domain spelling</p>
                                <p>• Verify your JIRA token permissions</p>
                                <p>• Try a different search term</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-white/30 max-w-md mx-auto">
                            <div className="animate-pulse">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mx-auto mb-6 animate-bounce"></div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Searching Projects</h3>
                                <p className="text-gray-600">Please wait while we fetch your JIRA projects...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
