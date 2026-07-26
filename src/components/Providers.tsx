"use client";

import { useEffect, useState } from "react";
import { AuthProvider } from "./AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UttamLoader } from "./ui/UttamLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "placeholder-client-id";
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Signature UTTAM loading duration (2.5 seconds)
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <UttamLoader isLoading={initialLoading} />
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
