import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface InstructorStats {
    stats: {
        label: string;
        value: string;
        change?: string;
        icon: string;
        gradient: string;
        iconColor: string;
    }[];
    topCourses: {
        title: string;
        students: number;
        slug?: string;
        rating: number;
    }[];
    recentStudents: {
        name: string;
        email: string;
        avatar_url?: string;
        course: string;
        enrolled_at: string;
    }[];
}

export function useInstructorDashboard() {
    const [data, setData] = useState<InstructorStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/instructors/dashboard/stats');
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
