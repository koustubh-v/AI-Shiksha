import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:3000";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
    avatar_url?: string;
}

export const useUsers = (role?: string) => {
    const { token } = useAuth();

    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ["users", role],
        queryFn: async () => {
            const { data } = await axios.get<User[]>(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
                params: role ? { role } : {},
            });
            return data;
        },
        enabled: !!token,
    });

    return { users, isLoading, error };
};
