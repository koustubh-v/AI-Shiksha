import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface AdminStats {
    platformStats: {
        label: string;
        value: string;
        change: string;
        icon: string;
        gradient: string;
        iconColor: string;
    }[];
    userGrowth: {
        month: string;
        students: number;
        teachers: number;
    }[];
    pendingActions: {
        title: string;
        priority: 'high' | 'medium' | 'low';
        href: string;
    }[];
}

export function useAdminDashboard() {
    const [stats, setStats] = useState<AdminStats['platformStats'] | null>(null);
    const [userGrowth, setUserGrowth] = useState<AdminStats['userGrowth'] | null>(null);
    const [pendingActions, setPendingActions] = useState<AdminStats['pendingActions'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, growthRes, actionsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/analytics/user-growth'),
                    api.get('/admin/pending-actions')
                ]);

                setStats(statsRes.data);
                setUserGrowth(growthRes.data);
                setPendingActions(actionsRes.data);
            } catch (err) {
                console.error('Failed to fetch admin dashboard data', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return { stats, userGrowth, pendingActions, isLoading };
}
