// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import http from "../config/api";

export type Role = "HR" | "LEAD" | "CANDIDATE";

export interface AuthUser {
  id: number;
  email: string;
  name?: string | null;
  role: Role;
  photoUrl?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  registerCandidate: (
    email: string,
    password: string,
    name?: string
  ) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

   async function login(email: string, password: string): Promise<AuthUser> {
    try {
      const res = await http.post("/auth/login", { email, password });
      const data = res.data;

      const authUser = data.user as AuthUser;
      setToken(data.token);
      setUser(authUser);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(authUser));
      return authUser;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Login failed";
      throw new Error(msg);
    }
  }

  
  async function registerCandidate(
    email: string,
    password: string,
    name?: string
  ): Promise<AuthUser> {
    try {
      // 注意：这里的路径要跟你后端 routes 对上
      // 如果后端是 router.post("/register-candidate") 就改成 "/auth/register-candidate"
      const res = await http.post("/auth/register", { email, password, name });
      const data = res.data;

      const authUser = data.user as AuthUser;
      setToken(data.token);
      setUser(authUser);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(authUser));
      return authUser;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Register failed";
      throw new Error(msg);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    registerCandidate,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
