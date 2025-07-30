import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface JiraIssue {
    id: string;
    key: string;
    self: string;
    summary: string;
    status: {
        self: string;
        description: string;
        iconUrl: string;
        name: string;
        id: string;
        statusCategory: {
            self: string;
            id: number;
            key: string;
            colorName: string;
            name: string;
        };
    };
    priority: {
        self: string;
        iconUrl: string;
        name: string;
        id: string;
    };
    assignee?: {
        self: string;
        accountId: string;
        emailAddress: string;
        avatarUrls: {
            '48x48': string;
            '24x24': string;
            '16x16': string;
            '32x32': string;
        };
        displayName: string;
        active: boolean;
        timeZone: string;
        accountType: string;
    };
    created: string;
    updated: string;
    issueType: {
        self: string;
        id: string;
        description: string;
        iconUrl: string;
        name: string;
        subtask: boolean;
        avatarId: number;
        hierarchyLevel: number;
    };
}

interface ProjectIssuesResponse {
    issues: JiraIssue[];
    total: number;
}

const ProjectDetails: React.FC = () => {
    const { projectKey } = useParams<{ projectKey: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [issues, setIssues] = useState<JiraIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchProjectIssues = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('sessionToken');

                const response = await fetch(`http://localhost:8080/api/projects/${projectKey}/issues`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch issues: ${response.statusText}`);
                }

                const data: ProjectIssuesResponse = await response.json();
                setIssues(data.issues);
            } catch (err) {
                console.log('Error fetching project issues:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch issues');
            } finally {
                setLoading(false);
            }
        };

        if (projectKey) {
            fetchProjectIssues();
            console.log(issues)
        }
    }, [projectKey, isAuthenticated, navigate]);

    const getStatusColor = (statusCategory: string) => {
        switch (statusCategory.toLowerCase()) {
            case 'new':
            case 'indeterminate':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'done':
                return 'bg-green-100 text-green-800 border border-green-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'highest':
            case 'critical':
                return 'text-red-600';
            case 'high':
                return 'text-orange-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-green-600';
            case 'lowest':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/30 p-8">
                    <div className="flex items-center space-x-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-lg font-medium text-gray-700">Loading project issues...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
                        <h3 className="font-semibold">Error loading project issues</h3>
                        <p>{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/projects')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Project {projectKey}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {issues.length} issue{issues.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/projects')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                            Back to Projects
                        </button>
                    </div>
                </div>

                {/* Issues List */}
                <div className="space-y-4">
                    {issues.map((issue) => (
                        <div
                            key={issue.id}
                            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <img
                                            src={issue.issueType.iconUrl}
                                            alt={issue.issueType.name}
                                            className="w-5 h-5"
                                        />
                                        <span className="font-mono text-sm text-blue-600 font-semibold">
                                            {issue.key}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(issue.status.statusCategory.key)}`}>
                                            {issue.status.name}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {issue.summary}
                                    </h3>
                                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={issue.priority.iconUrl}
                                                alt={issue.priority.name}
                                                className="w-4 h-4"
                                            />
                                            <span className={getPriorityColor(issue.priority.name)}>
                                                {issue.priority.name}
                                            </span>
                                        </div>
                                        {issue.assignee && (
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={issue.assignee.avatarUrls['24x24']}
                                                    alt={issue.assignee.displayName}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span>{issue.assignee.displayName}</span>
                                            </div>
                                        )}
                                        <span>
                                            Created: {new Date(issue.created).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        // Extract the JIRA base URL from the issue's self URL and construct browse URL
                                        try {
                                            const url = new URL(issue.self);
                                            const baseUrl = `${url.protocol}//${url.host}`;
                                            const issueUrl = `${baseUrl}/browse/${issue.key}`;
                                            window.open(issueUrl, '_blank');
                                        } catch (error) {
                                            console.error('Error constructing issue URL:', error);
                                            // Fallback URL
                                            window.open(`https://infectus07.atlassian.net/browse/${issue.key}`, '_blank');
                                        }
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                >
                                    View Issue
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {issues.length === 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-12 text-center">
                        <div className="text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Issues Found</h3>
                            <p className="text-gray-600">This project doesn't have any issues yet.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
