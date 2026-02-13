import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role: string;
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

export const useCreateUser = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: CreateUserData) => {
            const { data } = await axios.post(`${API_URL}/users`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};

export const useDeleteUser = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: string) => {
            await axios.delete(`${API_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};
