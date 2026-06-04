"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  status: "authenticated" | "unauthenticated" | "loading";
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  status: "loading",
  login: () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('faculty_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
      setStatus("authenticated");
    } else {
      setIsAuthenticated(false);
      setStatus("unauthenticated");
    }
  }, []);

  const login = (password: string) => {
    const correctPassword = process.env.NEXT_PUBLIC_FACULTY_PASSWORD?.trim() || "admin123";
    if (password === correctPassword) {
      localStorage.setItem('faculty_session', 'authenticated');
      setIsAuthenticated(true);
      setStatus("authenticated");
      return true;
    }
    return false;
  };

  const logout = () => {
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
