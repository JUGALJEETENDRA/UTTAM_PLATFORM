"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { fetchGAS } from "@/lib/apiClient";
import { jwtDecode } from "jwt-decode";

export interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

interface AuthContextType {
  data: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  data: null,
  status: "unauthenticated",
  login: () => {},
  logout: () => {},
});

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const AuthProviderInner = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");

  useEffect(() => {
    // Check local storage for session
    const storedSession = localStorage.getItem("user_session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const handleLoginSuccess = async (tokenResponse: any) => {
    setStatus("loading");
    try {
      // Decode the JWT if it's a credential response
      // But we are using useGoogleLogin, which returns access_token. Let's fetch user info.
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const userInfo = await userInfoResponse.json();

      // Send to GAS to record login
      const gasUser = await fetchGAS("login", {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      });

      const newSession: Session = {
        user: {
          id: gasUser.id || userInfo.sub,
          name: gasUser.name || userInfo.name,
          email: gasUser.email || userInfo.email,
          image: gasUser.image || userInfo.picture,
          role: gasUser.role || "student",
        }
      };

      localStorage.setItem("user_session", JSON.stringify(newSession));
      setSession(newSession);
      setStatus("authenticated");
    } catch (err) {
      console.error("Login error", err);
      setStatus("unauthenticated");
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: (error) => console.log('Login Failed:', error)
  });

  const logout = () => {
    localStorage.removeItem("user_session");
    setSession(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ data: session, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </GoogleOAuthProvider>
  );
};

// Replace next-auth's useSession hook
export const useSession = () => useContext(AuthContext);
