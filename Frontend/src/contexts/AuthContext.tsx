import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/api";

export type UserRole = "student" | "teacher" | "admin" | "super_admin" | "franchise_admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  bio?: string;
  franchise_id?: string | null;
  franchise?: {
    id: string;
    name: string;
    lms_name?: string;
    logo_url?: string | null;
    primary_color?: string;
  } | null;
}

const TOKEN_KEY = "lms_token";
const TOKEN_EXPIRY_KEY = "lms_token_expiry";

function readToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (expiry && Date.now() > parseInt(expiry, 10)) {
    clearToken();
    return null;
  }

  return token;
}

function saveToken(token: string, rememberMe: boolean) {
  localStorage.setItem(TOKEN_KEY, token);
  if (rememberMe) {
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } else {
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
  }
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(readToken);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = readToken();
      if (storedToken) {
        try {
          // Verify token and get user profile
          const response = await api.get("/auth/profile");
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          void error;
          clearToken();
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    try {
      // Clear any stale token before a fresh login
      clearToken();

      const response = await api.post("/auth/login", { email, password, rememberMe });
      const { access_token, user } = response.data;

      saveToken(access_token, rememberMe);
      setToken(access_token);
      setUser(user);
      return true;
    } catch (error) {
      void error;
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearToken();
    window.location.href = "/login"; // Force redirect to clear any state
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<boolean> => {
    try {
      const backendRole = role === 'teacher' ? 'INSTRUCTOR' : role.toUpperCase();

      const response = await api.post("/auth/register", {
        email,
        password,
        name,
        role: backendRole
      });

      if (response.data) {
        // Auto-login after signup (no remember me on fresh sign-up)
        return await login(email, password, false);
      }
      return true;
    } catch (error) {
      void error;
      throw error;
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
