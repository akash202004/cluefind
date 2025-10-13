"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  googleId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasProfile: boolean | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  hasProfile: null,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const profileCheckRef = useRef<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);

        if (userData?.googleId) {
          checkProfile(userData.googleId);
        } else {
          setHasProfile(false);
        }
      } else {
        setUser(null);
        setHasProfile(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const checkProfile = async (googleId: string) => {
    // Prevent duplicate checks for the same user
    if (profileCheckRef.current === googleId) {
      return;
    }

    profileCheckRef.current = googleId;

    try {
      // Check if user has completed onboarding in our Prisma database
      const response = await fetch("/api/users/check-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setHasProfile(result.onboardingComplete);
    } catch (error) {
      console.error("Profile check error:", error);
      setHasProfile(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.googleId) {
      // Reset the ref to force a fresh check
      profileCheckRef.current = null;
      await checkProfile(user.googleId);
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setHasProfile(false);
      profileCheckRef.current = null;
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, hasProfile, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
