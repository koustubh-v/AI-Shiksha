import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:3000";

export interface AdminCourse {
    id: string;
    title: string;
    thumbnail: string;
    status: string;
    students: number;
    rating: number;
    lessons: number;
    price: number;
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
