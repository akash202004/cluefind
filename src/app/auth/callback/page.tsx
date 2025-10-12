"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ClientOnly from "@/components/ui/ClientOnly";

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle OAuth code exchange
        const code = searchParams.get('code');
        
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            setError('Authentication failed');
            return;
          }
        }

        // Get session after code exchange
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Authentication failed');
          return;
        }

        if (data.session) {
          // Check if user has completed onboarding in our database
          try {
            const response = await fetch('/api/users/check-onboarding', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ googleId: data.session.user.id }),
            });

            const result = await response.json();

            if (result.onboardingComplete) {
              // User has completed onboarding, redirect to dashboard
              router.push('/dashboard');
            } else {
              // User needs to complete onboarding
              router.push('/onboarding');
            }
          } catch (err) {
            console.error('Error checking onboarding:', err);
            // If check fails, assume new user needs onboarding
            router.push('/onboarding');
          }
        } else {
          // No session, redirect back to get started
          router.push('/get-started');
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