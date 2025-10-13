"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" toastOptions={{
        style: { border: "4px solid black", fontWeight: 700 },
        success: { style: { background: "#D1FAE5" } },
        error: { style: { background: "#FECACA" } }
      }} />
    </AuthProvider>
  );
}
