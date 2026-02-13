import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface StudentStats {
    stats: {
        label: string;
        value: string;
        icon: string;
        gradient: string;
        iconColor: string;
    }[];
    inProgressCourses: {
        id: string;
        title: string;
        instructor: string;
        progress: number;
        image: string;
    }[];
    upcomingDeadlines: {
        title: string;
        course: string;
        dueIn: string;
    }[];
}

export function useStudentDashboard() {
    const [data, setData] = useState<StudentStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/users/dashboard/stats');
                setData(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard stats');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data, isLoading, error };
}
