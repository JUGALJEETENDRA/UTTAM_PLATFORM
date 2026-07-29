"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sha256 } from "@/lib/crypto";

interface AuthContextType {
  isAuthenticated: boolean;
  status: "authenticated" | "unauthenticated" | "loading";
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  status: "loading",
  login: async () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");
  const router = useRouter();

  useEffect(() => {
    const sessionExpiry = localStorage.getItem('faculty_session_expiry');
    if (sessionExpiry) {
      const expirationTime = parseInt(sessionExpiry, 10);
      if (Date.now() < expirationTime) {
        setIsAuthenticated(true);
        setStatus("authenticated");
        return;
      } else {
        // Expired
        localStorage.removeItem('faculty_session_expiry');
      }
    }
    
    // Clear old auth if exists
    localStorage.removeItem('faculty_session');
    setIsAuthenticated(false);
    setStatus("unauthenticated");
  }, []);

  const login = async (password: string): Promise<boolean> => {
    const storedHash = process.env.NEXT_PUBLIC_FACULTY_PASSWORD_HASH?.trim();
    if (!storedHash) return false;

    const inputHash = await sha256(password.trim());
    if (inputHash === storedHash) {
      const expirationTime = Date.now() + 6 * 60 * 60 * 1000;
      localStorage.setItem('faculty_session_expiry', expirationTime.toString());
      setIsAuthenticated(true);
      setStatus("authenticated");
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('faculty_session_expiry');
    localStorage.removeItem('faculty_session');
    setIsAuthenticated(false);
    setStatus("unauthenticated");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => useContext(AuthContext);
