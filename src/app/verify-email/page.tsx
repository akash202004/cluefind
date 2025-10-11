"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    // Verify the email token
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now sign in.');
          // Redirect to sign in after 3 seconds
          setTimeout(() => {
            router.push('/signin');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Email verification failed. The link may be expired or invalid.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-brutalist-lg text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
              <h1 className="text-section mb-2">Verifying Email</h1>
              <p className="text-subtitle">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-section mb-2 text-green-600">Email Verified!</h1>
              <p className="text-subtitle mb-6">{message}</p>
              <Link href="/signin" className="btn-primary">
                Continue to Sign In
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-section mb-2 text-red-600">Verification Failed</h1>
              <p className="text-subtitle mb-6">{message}</p>
              <div className="space-y-3">
                <Link href="/signup" className="btn-primary w-full">
                  Sign Up Again
                </Link>
                <Link href="/signin" className="btn-outline w-full">
                  Try Signing In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
