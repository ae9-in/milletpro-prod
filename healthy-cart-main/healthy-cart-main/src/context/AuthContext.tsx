import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, clearStoredToken, getStoredToken, setStoredToken } from "@/lib/api";
import type { ApiUser } from "@/lib/api";

type AuthResult = { error: Error | null };

type AuthContextType = {
  user: ApiUser | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

type AuthResponse = {
  token: string;
  user: ApiUser;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch<{ user: ApiUser }>("/auth/me", { auth: true })
      .then((response) => {
        setUser(response.user);
      })
      .catch(() => {
        clearStoredToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const signUp = async (email: string, password: string, fullName: string): Promise<AuthResult> => {
    try {
      const response = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName }),
      });

      setStoredToken(response.token);
      setUser(response.user);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error("Registration failed.") };
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setStoredToken(response.token);
      setUser(response.user);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error("Login failed.") };
    }
  };

  const signOut = async () => {
    clearStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: Boolean(user?.isAdmin), signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
