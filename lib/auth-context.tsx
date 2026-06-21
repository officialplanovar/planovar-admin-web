"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getSession, logout as doLogout, type AdminUser } from "./auth";

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Client-side guard for the admin area. Verifies an ADMIN session on mount and
 * redirects to /login if absent. (Auth uses a bearer token in localStorage, so
 * gating happens in the client, not in proxy.ts.)
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getSession().then((u) => {
      if (!active) return;
      if (!u || u.role !== "ADMIN") {
        router.replace("/login");
        return;
      }
      setUser(u);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [router]);

  const logout = async () => {
    await doLogout();
    setUser(null);
    router.replace("/login");
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-page-bg">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300"
          style={{ borderTopColor: "#5B50F0" }}
        />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
