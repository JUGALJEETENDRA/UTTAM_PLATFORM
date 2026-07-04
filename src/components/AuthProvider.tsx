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
    const session = localStorage.getItem('faculty_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
      setStatus("authenticated");
    } else {
      setIsAuthenticated(false);
      setStatus("unauthenticated");
    }
  }, []);

  /**
   * Validates the supplied password by hashing it client-side with SHA-256
   * and comparing the result against the hash stored in the env var.
   * The plaintext password is NEVER stored in the bundle — only its hash is.
   *
   * To update the password:
   *   1. Pick a new password string.
   *   2. Run: node -e "require('crypto').createHash('sha256').update('NEW_PASS').digest('hex')"
   *   3. Set NEXT_PUBLIC_FACULTY_PASSWORD_HASH to the output in .env.local.
   *   4. Rebuild.
   */
  const login = async (password: string): Promise<boolean> => {
    const storedHash = process.env.NEXT_PUBLIC_FACULTY_PASSWORD_HASH?.trim();
    if (!storedHash) return false;

    const inputHash = await sha256(password.trim());
    if (inputHash === storedHash) {
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
