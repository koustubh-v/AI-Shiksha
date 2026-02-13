import api from './api';
import { UserRole } from '../contexts/AuthContext';

export interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatar?: string;
    };
}

export const authService = {
    async login(email: string, password: string) {
        const response = await api.post<LoginResponse>('/auth/login', { email, password });
        return response.data;
    },

    async signup(email: string, password: string, name: string, role: UserRole) {
        const response = await api.post('/auth/register', { email, password, name, role });
        return response.data;
    },

    async getProfile() {
        const response = await api.get('/auth/profile');
        return response.data;
    },
};
