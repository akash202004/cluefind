import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wide">Back to Home</span>
        </Link>

        {/* Error Card */}
        <div className="bg-card border-4 border-feature-red rounded-lg p-8 shadow-brutalist-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-feature-red rounded-lg flex items-center justify-center border-4 border-feature-red shadow-brutalist-sm mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-section mb-2">Authentication Error</h1>
            <p className="text-subtitle">Something went wrong during sign in</p>
          </div>

          {/* Error Message */}
          <div className="bg-muted border-2 border-feature-red rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              There was an error processing your authentication. This could be due to:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
              <li>Invalid or expired authentication code</li>
              <li>Network connectivity issues</li>
              <li>OAuth provider configuration problems</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link 
              href="/get-started" 
              className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg border-4 border-primary hover:bg-primary/90 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3"
            >
              <span className="font-black uppercase tracking-wide">Try Again</span>
            </Link>
            
            <Link 
              href="/" 
              className="w-full bg-background text-foreground px-6 py-4 rounded-lg border-4 border-primary hover:bg-muted transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3"
            >
              <span className="font-black uppercase tracking-wide">Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
