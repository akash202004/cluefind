"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ClientOnly from "@/components/ui/ClientOnly";

function AuthCallbackContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle OAuth code exchange
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('OAuth error:', error);
          setError('Authentication failed');
          return;
        }
        
        if (code) {
          // Call our API route to handle the OAuth callback
          const response = await fetch(`/api/auth/callback?code=${code}`);
          
          if (response.ok) {
            // The API route will handle the redirect
            // This page should not be reached in normal flow
            router.push('/dashboard');
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Authentication failed');
          }
        } else {
          setError('No authorization code received');
        }
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError('An error occurred during authentication');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (loading) {
    return (
      <ClientOnly>
        <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Completing sign in...</p>
          </div>
        </div>
      </ClientOnly>
    );
  }

  if (error) {
    return (
      <ClientOnly>
        <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center">
          <div className="card-brutalist text-center max-w-md">
            <div className="w-16 h-16 bg-feature-red rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-lg mx-auto mb-6">
              <span className="text-primary-foreground font-black text-2xl">!</span>
            </div>
            
            <h1 className="text-hero mb-4">Authentication Error</h1>
            <p className="text-body mb-8">{error}</p>

            <button
              onClick={() => router.push('/get-started')}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return null;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <ClientOnly>
        <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ClientOnly>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}