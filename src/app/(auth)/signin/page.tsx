import Link from "next/link";
import { Github, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background dot-grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wide">Back to Home</span>
        </Link>

        {/* Sign In Card */}
        <div className="bg-card border-4 border-primary rounded-lg p-8 shadow-brutalist-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm mx-auto mb-4">
              <span className="text-primary-foreground font-black text-2xl">D</span>
            </div>
            <h1 className="text-section mb-2">Welcome Back</h1>
            <p className="text-subtitle">Sign in to your DevSync account</p>
          </div>

          {/* GitHub OAuth Button */}
          <Link href="/onboarding" className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg border-4 border-primary hover:bg-primary/90 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center justify-center gap-3 mb-6">
            <Github className="w-5 h-5" />
            <span className="font-black uppercase tracking-wide">Continue with GitHub</span>
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground font-bold uppercase tracking-wide">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Email Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                placeholder="Enter your email"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                  fontWeight: "700",
                  fontSize: "16px"
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                placeholder="Enter your password"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                  fontWeight: "700",
                  fontSize: "16px"
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-2 border-primary rounded bg-background"
                />
                <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Remember me
                </span>
              </label>
              <Link href="/forgot-password" className="text-sm font-bold uppercase tracking-wide text-accent hover:text-accent/80 transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground px-6 py-4 rounded-lg border-4 border-primary hover:bg-accent/90 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            >
              <span className="font-black uppercase tracking-wide">Sign In</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold uppercase tracking-wide text-accent hover:text-accent/80 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
