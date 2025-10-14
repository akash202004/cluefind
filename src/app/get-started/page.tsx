"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function GetStartedPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, hasProfile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      if (user.role === 'RECRUITER') {
        router.push("/leaderboard");
      } else if (hasProfile === true) {
        router.push("/dashboard");
      } else if (hasProfile === false) {
        router.push("/onboarding");
      }
    }
  }, [user, hasProfile, authLoading, router]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/google");
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Failed to get auth URL");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError(
        error.message ||
          "Failed to sign in with Google. Please check your Google OAuth configuration."
      );
      setLoading(false);
    }
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wide">
            Back to Home
          </span>
        </Link>

        <div className="card-brutalist text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-lg mx-auto mb-6">
            <span className="text-primary-foreground font-black text-2xl">
              D
            </span>
          </div>

          <h1 className="text-hero mb-4">Get Started</h1>
          <p className="text-body mb-8">
            Sign in with Google to create your developer portfolio
          </p>

          {error && (
            <div className="text-center text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2 relative top-px" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="mt-6 text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
