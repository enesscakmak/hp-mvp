import { api } from './api';

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export const authService = {
    register: async (data: RegisterRequest): Promise<string> => {
        const response = await api.post<string>('/auth/register', data);
        return response;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<User>('/users/me');
        return response;
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    }
};
