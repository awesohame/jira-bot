import React from 'react';
import { JiraProject } from '../services/api';

interface ProjectCardProps {
    project: JiraProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    console.log(project)
    
    const getProjectTypeIcon = (projectType: string) => {
        switch (projectType) {
            case 'software':
                return '💻';
            case 'service_desk':
                return '🎫';
            case 'business':
                return '📊';
            default:
                return '📋';
        }
    };

    const getStyleBadge = (style: string) => {
        const styleColors = {
            'next-gen': 'bg-blue-100 text-blue-800 border border-blue-200',
            'classic': 'bg-amber-100 text-amber-800 border border-amber-200',
        };

        return styleColors[style as keyof typeof styleColors] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    const handleViewInJira = () => {
        try {
            // project.self looks like: https://infectus07.atlassian.net/rest/api/2/project/MTP
            const url = new URL(project.self);
            const baseUrl = `${url.protocol}//${url.host}`;
            const webUrl = `${baseUrl}/browse/${project.key}`;
            console.log('Opening JIRA URL:', webUrl);
            window.open(webUrl, '_blank');
        } catch (error) {
            console.error('Error constructing JIRA URL:', error);
            // Fallback to project self URL if URL construction fails
            window.open(project.self, '_blank');
        }
    };

    return (
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/30 hover:border-blue-200 transform hover:-translate-y-1">
            <div className="p-6">
                {/* Header with avatar and basic info */}
                <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0">
                        {project.avatarUrls?.['48x48'] ? (
                            <img
                                src={project.avatarUrls['48x48']}
                                alt={`${project.name} avatar`}
                                className="w-14 h-14 rounded-xl border-2 border-gray-100 shadow-sm"
                            />
                        ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {project.key.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200" title={project.name}>
                            {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block mt-1">
                            {project.key}
                        </p>
                    </div>

                    <div className="text-3xl group-hover:scale-110 transition-transform duration-200" title={`${project.projectTypeKey} project`}>
                        {getProjectTypeIcon(project.projectTypeKey)}
                    </div>
                </div>

                {/* Project details */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                            </svg>
                            Type
                        </span>
                        <span className="text-sm text-gray-900 capitalize font-medium">
                            {project.projectTypeKey.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            Style
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStyleBadge(project.style)}`}>
                            {project.style}
                        </span>
                    </div>

                    {project.simplified !== undefined && (
                        <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                            <span className="text-sm font-semibold text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Simplified
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.simplified
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}>
                                {project.simplified ? 'Yes' : 'No'}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            Privacy
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.isPrivate
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                            }`}>
                            {project.isPrivate ? 'Private' : 'Public'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex space-x-3">
                        <button
                            onClick={handleViewInJira}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                            View in JIRA
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(project.key);
                                // Optional: Show a brief success message
                            }}
                            className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center"
                            title="Copy project key"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
