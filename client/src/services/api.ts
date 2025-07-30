import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface User {
    username: string;
    email: string;
    jiraToken?: string;  // The user's JIRA token they provided during signup
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    token: string;  // User's JIRA token
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    success: boolean;
    username?: string;
    email?: string;
    token?: string;  // This is the session authentication token from backend
    jiraToken?: string;  // User's JIRA token returned from backend
}

// Jira Project interfaces
export interface JiraProject {
    id: string;
    key: string;
    name: string;
    self: string;
    avatarUrls: {
        '48x48': string;
        '24x24': string;
        '16x16': string;
        '32x32': string;
    };
    projectTypeKey: string;
    simplified: boolean;
    style: string;
    isPrivate: boolean;
    entityId?: string;
    uuid?: string;
}

export interface JiraProjectResponse {
    self: string;
    maxResults: number;
    startAt: number;
    total: number;
    isLast: boolean;
    values: JiraProject[];
}

export interface JiraProjectRequest {
    atlassianDomain: string;
    email?: string;
    apiToken?: string;
    searchQuery?: string;
    maxResults?: number;
    startAt?: number;
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const sessionToken = localStorage.getItem('sessionToken');
        if (sessionToken) {
            config.headers.Authorization = `Bearer ${sessionToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    signup: (userData: SignupRequest): Promise<AxiosResponse<AuthResponse>> =>
        api.post('/auth/signup', userData),
    login: (credentials: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
        api.post('/auth/login', credentials),
    logout: (): Promise<AxiosResponse<AuthResponse>> =>
        api.post('/auth/logout'),
    validateToken: (): Promise<AxiosResponse<AuthResponse>> =>
        api.get('/auth/validate'),
    getCurrentUser: (): Promise<AxiosResponse<User>> =>
        api.get('/auth/me'),
};

export const projectAPI = {
    searchProjects: (request: JiraProjectRequest): Promise<AxiosResponse<JiraProjectResponse>> =>
        api.post('/projects/search', request),
};

export default api;
