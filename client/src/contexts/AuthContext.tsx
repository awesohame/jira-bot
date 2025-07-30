import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, User, SignupRequest, LoginRequest } from '../services/api';

interface AuthContextType {
    user: User | null;
    sessionToken: string | null;  // Backend session token for authentication
    login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
    signup: (userData: SignupRequest) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    loading: boolean;
    isAuthenticated: boolean;
    // Helper methods for easier access
    getUsername: () => string | null;
    getEmail: () => string | null;
    getJiraToken: () => string | null;  // User's JIRA token
    getSessionToken: () => string | null;  // Backend session token
    getUserData: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [sessionToken, setSessionToken] = useState<string | null>(localStorage.getItem('sessionToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedSessionToken = localStorage.getItem('sessionToken');
            const savedUser = localStorage.getItem('user');

            if (savedSessionToken && savedUser) {
                try {
                    // Validate token
                    await authAPI.validateToken();
                    setSessionToken(savedSessionToken);
                    setUser(JSON.parse(savedUser));
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('sessionToken');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequest): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await authAPI.login(credentials);
            const { token: newSessionToken, username, email, jiraToken } = response.data;

            const userData: User = {
                username: username!,
                email: email!,
                jiraToken: jiraToken!
            };

            setSessionToken(newSessionToken!);
            setUser(userData);

            localStorage.setItem('sessionToken', newSessionToken!);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true, message: response.data.message };
        } catch (error: any) {
            console.error('Login failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (userData: SignupRequest): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await authAPI.signup(userData);

            // If signup successful and token provided, automatically log the user in
            if (response.data.success && response.data.token && response.data.username && response.data.email) {
                const { token: newSessionToken, username, email, jiraToken } = response.data;

                const userInfo: User = {
                    username: username!,
                    email: email!,
                    jiraToken: jiraToken!
                };

                setSessionToken(newSessionToken!);
                setUser(userInfo);

                localStorage.setItem('sessionToken', newSessionToken!);
                localStorage.setItem('user', JSON.stringify(userInfo));
            }

            return { success: true, message: response.data.message };
        } catch (error: any) {
            console.error('Signup failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = async (): Promise<void> => {
        try {
            if (sessionToken) {
                await authAPI.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setSessionToken(null);
            setUser(null);
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('user');
        }
    };

    // Helper methods for easier access to user data
    const getUsername = (): string | null => user?.username || null;
    const getEmail = (): string | null => user?.email || null;
    const getJiraToken = (): string | null => user?.jiraToken || null;
    const getSessionToken = (): string | null => sessionToken;
    const getUserData = (): User | null => user;

    const value: AuthContextType = {
        user,
        sessionToken,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!sessionToken && !!user,
        getUsername,
        getEmail,
        getJiraToken,
        getSessionToken,
        getUserData,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
