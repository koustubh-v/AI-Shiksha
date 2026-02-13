import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:3000";

export interface AdminInstructor {
    id: string;
    name: string;
    email: string;
    courses: number;
    students: number;
    revenue: number;
    rating: number;
    status: string;
    avatar?: string;
}

export const useAdminInstructors = () => {
    const { token } = useAuth();

    const { data: instructors = [], isLoading, error } = useQuery({
        queryKey: ["admin-instructors"],
        queryFn: async () => {
            const { data } = await axios.get<AdminInstructor[]>(`${API_URL}/instructors/admin/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
        enabled: !!token,
    });

    return { instructors, isLoading, error };
};
