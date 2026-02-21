import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface AdminCourse {
    id: string;
    title: string;
    slug?: string;
    description?: string;
    thumbnail?: string;
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED';
    price: number;
    students: number;
    lessons: number;
    rating: number;
    lastUpdated: string;
    instructor: string;
    level: string;
    revenue: number;
}

export const useAdminCourses = () => {
    const { token } = useAuth();

    const { data: courses = [], isLoading, error, refetch } = useQuery({
        queryKey: ["admin-courses"],
        queryFn: async () => {
            const { data } = await axios.get<AdminCourse[]>(`${API_URL}/courses/admin/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
        enabled: !!token,
    });

    return { courses, isLoading, error, mutate: refetch };
};
