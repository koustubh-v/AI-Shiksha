import api from '../lib/api';

export interface PlatformStats {
    label: string;
    value: string;
    change: string;
    icon: string;
    gradient: string;
    iconColor: string;
}

export interface UserGrowthData {
    month: string;
    students: number;
    teachers: number;
}

export interface RevenueData {
    month: string;
    revenue: number;
}

export interface PendingAction {
    title: string;
    priority: 'high' | 'medium' | 'low';
    href: string;
    type?: string;
    teacher?: string;
    user?: string;
    course?: string;
    amount?: string;
    status?: string;
}

export const adminService = {
    getStats: async () => {
        const response = await api.get<PlatformStats[]>('/admin/stats');
        return response.data;
    },
    getUserGrowth: async () => {
        const response = await api.get<UserGrowthData[]>('/admin/analytics/user-growth');
        return response.data;
    },
    getRevenue: async () => {
        const response = await api.get<RevenueData[]>('/admin/analytics/revenue');
        return response.data;
    },
    getPendingActions: async () => {
        const response = await api.get<PendingAction[]>('/admin/pending-actions');
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getCourses: async () => {
        const response = await api.get('/courses/admin/all');
        return response.data;
    }
};
