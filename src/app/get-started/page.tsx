"use client";

import Link from "next/link";
import { Github, ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

export default function GetStartedPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    // Redirect to GitHub OAuth
    window.location.href = "/api/auth/signin/github";
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Redirect to Google OAuth
    window.location.href = "/api/auth/signin/google";
  };

  return (
    <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wide">Back to Home</span>
        </Link>

        {/* Get Started Card */}
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-brutalist-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm mx-auto mb-4">
              <span className="text-primary-foreground font-black text-2xl">D</span>
            </div>
            <h1 className="text-section mb-2">Get Started</h1>
            <p className="text-subtitle">Choose your preferred sign-in method</p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            {/* GitHub Button */}
            <button
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg border-4 border-primary hover:bg-primary/90 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-6 h-6" />
              <span className="font-black uppercase tracking-wide">
                {isLoading ? "Loading..." : "Continue with GitHub"}
              </span>
            </button>

            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-background text-foreground px-6 py-4 rounded-lg border-4 border-primary hover:bg-muted transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FcGoogle className="w-6 h-6" />
              <span className="font-black uppercase tracking-wide">
                {isLoading ? "Loading..." : "Continue with Google"}
              </span>
            </button>
          </div>

          {/* Info Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-accent hover:text-accent/80 transition-colors font-bold">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-accent hover:text-accent/80 transition-colors font-bold">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
