import React, { useState } from 'react';

interface ChatMessage {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatInterfaceProps {
    // Props to receive data from ProjectDetails
    issues: any[];
    filteredIssues: any[];
    filters: {
        status: string;
        priority: string;
        assignee: string;
        ricefwCategory: string;
        issueType: string;
        searchText: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        status: string;
        priority: string;
        assignee: string;
        ricefwCategory: string;
        issueType: string;
        searchText: string;
    }>>;
    projectKey: string | undefined;
    updateIssueCategory?: (issueKey: string, category: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    issues,
    filteredIssues,
    filters,
    setFilters,
    projectKey,
    updateIssueCategory
}) => {
    // Chat state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { text: "Hello! I'm here to help you manage RICEFW categories for your JIRA issues. You can ask me to categorize issues using natural language.", sender: 'bot', timestamp: new Date() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Chat functions
    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = { text: chatInput, sender: 'user' as const, timestamp: new Date() };
        setChatMessages(prev => [...prev, userMessage]);
        setIsChatLoading(true);
        setChatInput('');

        // Simulate AI response with access to project data
        setTimeout(() => {
            let responseText = "I understand you want to categorize issues. While I'm getting smarter, for now you can use the dropdown menus on the right to categorize issues manually.";

            // Add some context based on current data
            if (issues.length > 0) {
                responseText += ` I can see you have ${issues.length} issues in project ${projectKey}.`;
                if (filteredIssues.length !== issues.length) {
                    responseText += ` Currently showing ${filteredIssues.length} filtered issues.`;
                }
            }

            responseText += " Soon I'll be able to process natural language requests like 'Mark all enhancement issues as Enhancement category'!";

            const botMessage = {
                text: responseText,
                sender: 'bot' as const,
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, botMessage]);
            setIsChatLoading(false);
        }, 1000);
    };

    return (
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
                        <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user'
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
    );
};

export default ChatInterface;
