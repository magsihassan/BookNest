import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Role = "admin" | "user";
type User = { id: number; role: Role } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(!!token); // if token exists, we need to validate

  const backend = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const validate = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${backend}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("me failed");
        const data = await res.json(); // { id, role }
        setUser({ id: data.id, role: data.role });
      } catch {
        // invalid token
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, [token, backend]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${backend}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;

      const data = await res.json(); // expect { token } (we’ll call /me next)
      if (!data.token) return false;

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setLoading(true); // trigger /me
      // Wait for /me to set user (optional: you can just return true here)
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
