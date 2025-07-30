import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// RICEFW Categories
const RICEFW_CATEGORIES = [
    'Report',
    'Interface',
    'Conversion',
    'Enhancement',
    'Form',
    'Workflow'
] as const;

type RicefwCategory = typeof RICEFW_CATEGORIES[number] | 'Uncategorized';

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
    labels?: string[];
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
    const [filteredIssues, setFilteredIssues] = useState<JiraIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Chat state
    const [chatMessages, setChatMessages] = useState<{ text: string; sender: 'user' | 'bot'; timestamp: Date }[]>([
        { text: "Hello! I'm here to help you manage RICEFW categories for your JIRA issues. You can ask me to categorize issues using natural language.", sender: 'bot', timestamp: new Date() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    
    // Filter state
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        assignee: '',
        ricefwCategory: '',
        issueType: '',
        searchText: ''
    });

    // Create Issue Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createForm, setCreateForm] = useState({
        summary: '',
        description: '',
        issueType: 'Task',
        priority: 'Medium',
        ricefwCategory: 'Uncategorized',
        labels: ''
    });

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
                setFilteredIssues(data.issues);
            } catch (err) {
                console.log('Error fetching project issues:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch issues');
            } finally {
                setLoading(false);
            }
        };

        if (projectKey) {
            fetchProjectIssues();
        }
    }, [projectKey, isAuthenticated, navigate]);

    // Filter effect
    useEffect(() => {
        let filtered = [...issues];

        if (filters.status) {
            filtered = filtered.filter(issue => issue.status.name === filters.status);
        }
        if (filters.priority) {
            filtered = filtered.filter(issue => issue.priority.name === filters.priority);
        }
        if (filters.assignee) {
            filtered = filtered.filter(issue => 
                issue.assignee?.displayName.toLowerCase().includes(filters.assignee.toLowerCase())
            );
        }
        if (filters.ricefwCategory) {
            if (filters.ricefwCategory === 'Uncategorized') {
                filtered = filtered.filter(issue => getRicefwCategory(issue.labels) === 'Uncategorized');
            } else {
                filtered = filtered.filter(issue => issue.labels?.includes(filters.ricefwCategory));
            }
        }
        if (filters.issueType) {
            filtered = filtered.filter(issue => issue.issueType.name === filters.issueType);
        }
        if (filters.searchText) {
            filtered = filtered.filter(issue => 
                issue.summary.toLowerCase().includes(filters.searchText.toLowerCase()) ||
                issue.key.toLowerCase().includes(filters.searchText.toLowerCase())
            );
        }

        setFilteredIssues(filtered);
    }, [issues, filters]);

    // Chat functions
    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = { text: chatInput, sender: 'user' as const, timestamp: new Date() };
        setChatMessages(prev => [...prev, userMessage]);
        setIsChatLoading(true);
        setChatInput('');

        // Simulate AI response (in future, this will call actual AI service)
        setTimeout(() => {
            const botMessage = { 
                text: "I understand you want to categorize issues. While I'm getting smarter, for now you can use the dropdown menus on the right to categorize issues manually. Soon I'll be able to process natural language requests like 'Mark all enhancement issues as Enhancement category'!", 
                sender: 'bot' as const, 
                timestamp: new Date() 
            };
            setChatMessages(prev => [...prev, botMessage]);
            setIsChatLoading(false);
        }, 1000);
    };

    // Get unique filter options
    const getUniqueStatuses = () => [...new Set(issues.map(issue => issue.status.name))];
    const getUniquePriorities = () => [...new Set(issues.map(issue => issue.priority.name))];
    const getUniqueAssignees = () => [...new Set(issues.map(issue => issue.assignee?.displayName).filter(Boolean))];
    const getUniqueIssueTypes = () => [...new Set(issues.map(issue => issue.issueType.name))];

    // Create Issue function
    const handleCreateIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const token = localStorage.getItem('sessionToken');
            
            // Prepare labels array
            const labelsArray = [];
            if (createForm.ricefwCategory !== 'Uncategorized') {
                labelsArray.push(createForm.ricefwCategory);
            }
            if (createForm.labels.trim()) {
                const additionalLabels = createForm.labels.split(',').map(label => label.trim()).filter(Boolean);
                labelsArray.push(...additionalLabels);
            }

            const requestBody = {
                projectKey: projectKey,
                summary: createForm.summary,
                description: createForm.description,
                issueTypeName: createForm.issueType,
                priorityName: createForm.priority,
                labels: labelsArray
            };

            const response = await fetch(`http://localhost:8080/api/projects/${projectKey}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Failed to create issue: ${response.statusText}`);
            }

            const newIssue = await response.json();
            
            // Add the new issue to the beginning of the issues list
            setIssues(prev => [newIssue, ...prev]);
            
            // Reset form and close modal
            setCreateForm({
                summary: '',
                description: '',
                issueType: 'Task',
                priority: 'Medium',
                ricefwCategory: 'Uncategorized',
                labels: ''
            });
            setIsCreateModalOpen(false);
            
            alert('Issue created successfully!');
        } catch (err) {
            console.error('Error creating issue:', err);
            alert(`Failed to create issue: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsCreating(false);
        }
    };

    // Helper function to determine RICEFW category from issue labels
    const getRicefwCategory = (labels?: string[]): RicefwCategory => {
        if (!labels || labels.length === 0) return 'Uncategorized';

        for (const label of labels) {
            if (RICEFW_CATEGORIES.includes(label as any)) {
                return label as RicefwCategory;
            }
        }
        return 'Uncategorized';
    };

    // Function to update issue labels
    const updateIssueCategory = async (issueKey: string, category: string) => {
        try {
            const token = localStorage.getItem('sessionToken');

            const response = await fetch(`http://localhost:8080/api/projects/issues/${issueKey}/labels`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ricefwCategory: category }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update category: ${response.statusText}`);
            }

            // Update the local state to reflect the change
            const updatedIssues = issues.map(issue => {
                if (issue.key === issueKey) {
                    // Preserve existing non-RICEFW labels
                    const currentLabels = issue.labels || [];
                    const ricefwCategories = ['Report', 'Interface', 'Conversion', 'Enhancement', 'Form', 'Workflow'];

                    // Remove any existing RICEFW labels
                    const nonRicefwLabels = currentLabels.filter(label => !ricefwCategories.includes(label));

                    // Add the new RICEFW category if it's not "Uncategorized"
                    const newLabels = category === 'Uncategorized'
                        ? nonRicefwLabels
                        : [...nonRicefwLabels, category];

                    return {
                        ...issue,
                        labels: newLabels
                    };
                }
                return issue;
            });
            setIssues(updatedIssues);

        } catch (err) {
            console.error('Error updating issue category:', err);
            alert(`Failed to update category: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

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
                                {issues.length} total issue{issues.length !== 1 ? 's' : ''} • {filteredIssues.length} filtered
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

                {/* Main Content: Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left Side: Chatbot Interface */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 h-[calc(100vh-200px)] flex flex-col">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">RICEFW Assistant</h3>
                                        <p className="text-xs text-gray-500">AI-powered issue categorization</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {chatMessages.map((message, index) => (
                                    <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-lg ${
                                            message.sender === 'user' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-100 text-gray-900'
                                        }`}>
                                            <p className="text-sm">{message.text}</p>
                                            <span className="text-xs opacity-70 block mt-1">
                                                {message.timestamp.toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask me to categorize issues... (e.g., 'Mark all bug issues as Enhancement')"
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isChatLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isChatLoading || !chatInput.trim()}
                                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Issues List with Filters */}
                    <div className="lg:col-span-3">
                        {/* Filters and Create Issue Button */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-4 mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Create Issue</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search by key or summary..."
                                        value={filters.searchText}
                                        onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Statuses</option>
                                        {getUniqueStatuses().map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Priority Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        value={filters.priority}
                                        onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Priorities</option>
                                        {getUniquePriorities().map(priority => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* RICEFW Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">RICEFW Category</label>
                                    <select
                                        value={filters.ricefwCategory}
                                        onChange={(e) => setFilters(prev => ({ ...prev, ricefwCategory: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Uncategorized">Uncategorized</option>
                                        {RICEFW_CATEGORIES.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Issue Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                                    <select
                                        value={filters.issueType}
                                        onChange={(e) => setFilters(prev => ({ ...prev, issueType: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Types</option>
                                        {getUniqueIssueTypes().map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Assignee Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                                    <input
                                        type="text"
                                        placeholder="Filter by assignee..."
                                        value={filters.assignee}
                                        onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setFilters({
                                        status: '',
                                        priority: '',
                                        assignee: '',
                                        ricefwCategory: '',
                                        issueType: '',
                                        searchText: ''
                                    })}
                                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>

                        {/* Issues List */}
                        <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                            {filteredIssues.map((issue) => (
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

                                            {/* RICEFW Category Dropdown */}
                                            <div className="mt-4 flex items-center space-x-3">
                                                <span className="text-sm font-medium text-gray-700">RICEFW Category:</span>
                                                <select
                                                    value={getRicefwCategory(issue.labels)}
                                                    onChange={(e) => updateIssueCategory(issue.key, e.target.value)}
                                                    className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="Uncategorized">Uncategorized</option>
                                                    {RICEFW_CATEGORIES.map((category) => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>

                                                {/* Display current category as a badge */}
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRicefwCategory(issue.labels) === 'Uncategorized'
                                                        ? 'bg-gray-100 text-gray-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {getRicefwCategory(issue.labels)}
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

                        {filteredIssues.length === 0 && issues.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-12 text-center">
                                <div className="text-gray-500">
                                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Issues Match Filters</h3>
                                    <p className="text-gray-600">Try adjusting your filters to see more issues.</p>
                                </div>
                            </div>
                        )}

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

                {/* Create Issue Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Create New Issue</h2>
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Modal Form */}
                                <form onSubmit={handleCreateIssue} className="space-y-4">
                                    {/* Summary */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Summary <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={createForm.summary}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, summary: e.target.value }))}
                                            placeholder="Brief description of the issue"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            rows={4}
                                            value={createForm.description}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Detailed description of the issue"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Two Column Layout for Dropdowns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Issue Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                                            <select
                                                value={createForm.issueType}
                                                onChange={(e) => setCreateForm(prev => ({ ...prev, issueType: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="Task">Task</option>
                                                <option value="Story">Story</option>
                                                <option value="Bug">Bug</option>
                                                <option value="Epic">Epic</option>
                                                <option value="Sub-task">Sub-task</option>
                                                {getUniqueIssueTypes().map(type => (
                                                    !['Task', 'Story', 'Bug', 'Epic', 'Sub-task'].includes(type) && (
                                                        <option key={type} value={type}>{type}</option>
                                                    )
                                                ))}
                                            </select>
                                        </div>

                                        {/* Priority */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                            <select
                                                value={createForm.priority}
                                                onChange={(e) => setCreateForm(prev => ({ ...prev, priority: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="Highest">Highest</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                                <option value="Lowest">Lowest</option>
                                                {getUniquePriorities().map(priority => (
                                                    !['Highest', 'High', 'Medium', 'Low', 'Lowest'].includes(priority) && (
                                                        <option key={priority} value={priority}>{priority}</option>
                                                    )
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* RICEFW Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">RICEFW Category</label>
                                        <select
                                            value={createForm.ricefwCategory}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, ricefwCategory: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Uncategorized">Uncategorized</option>
                                            {RICEFW_CATEGORIES.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Additional Labels */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Labels</label>
                                        <input
                                            type="text"
                                            value={createForm.labels}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, labels: e.target.value }))}
                                            placeholder="Comma-separated labels (e.g., urgent, backend, api)"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            RICEFW category will be added automatically if selected above
                                        </p>
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                                            disabled={isCreating}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isCreating || !createForm.summary.trim()}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-300 rounded-md transition-colors duration-200 flex items-center space-x-2"
                                        >
                                            {isCreating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Creating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    <span>Create Issue</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
