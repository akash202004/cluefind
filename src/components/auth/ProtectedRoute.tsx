"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: boolean;
  requireProfile?: boolean;
}

const ProtectedRoute = ({ children, requireAuth, requireProfile = false }: ProtectedRouteProps) => {
  const { session, loading: authLoading, hasProfile } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (authLoading) {
      setIsReady(false);
    } else {
      // Add a small delay to prevent rapid state changes
      setTimeout(() => setIsReady(true), 100);
    }
  }, [authLoading]);

  // Don't render anything until we're ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required and there's no session, redirect to get started
  if (requireAuth && !session) {
    router.push("/get-started");
    return null;
  }

  // If profile is required and user doesn't have one, redirect to onboarding
  if (requireProfile && hasProfile === false) {
    router.push("/onboarding");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
