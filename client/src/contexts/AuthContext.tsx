import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, User, SignupRequest, LoginRequest } from '../services/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
    signup: (userData: SignupRequest) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    loading: boolean;
    isAuthenticated: boolean;
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
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (savedToken && savedUser) {
                try {
                    // Validate token
                    await authAPI.validateToken();
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                } catch (error) {
                    console.error('Token validation failed:', error);
                    localStorage.removeItem('token');
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
            const { token: newToken, username, email } = response.data;

            const userData: User = { username: username!, email: email! };

            setToken(newToken!);
            setUser(userData);

            localStorage.setItem('token', newToken!);
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
            if (token) {
                await authAPI.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!token && !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
