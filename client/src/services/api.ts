import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface User {
    username: string;
    email: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    token: string;
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
    token?: string;
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
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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

export default api;
