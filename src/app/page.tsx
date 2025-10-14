"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Users, Zap, Target, Calendar, TrendingUp, Github, Linkedin, ArrowRight, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ClientOnly from "@/components/ui/ClientOnly";

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading, hasProfile } = useAuth();

  // Redirect authenticated users with completed onboarding to dashboard
  useEffect(() => {
    if (authLoading) return;

    if (user && hasProfile === true) {
      router.push("/dashboard");
      return;
    }
  }, [user, hasProfile, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <ClientOnly>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </ClientOnly>
    );
  }

  // Don't render landing page if user should be redirected
  if (user && hasProfile === true) {
    return null;
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-background dot-grid-bg">
      {/* Header */}
      <header className="border-b-4 border-primary bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm">
              <span className="text-primary-foreground font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black uppercase tracking-tight">Cluefind</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              // Authenticated user navigation
              <>
                <Link href="/dashboard" className="font-bold uppercase text-sm hover:text-accent transition-colors">
                  Dashboard
                </Link>
                <Link href="/leaderboard" className="font-bold uppercase text-sm hover:text-accent transition-colors">
                  Leaderboard
                </Link>
                {user.username && (
                  <Link href={`/${user.username}`} className="font-bold uppercase text-sm hover:text-accent transition-colors">
                    My Profile
                  </Link>
                )}
              </>
            ) : (
              // Guest user navigation
              <>
                <Link href="#how-it-works" className="font-bold uppercase text-sm hover:text-accent transition-colors">
                  How it Works
                </Link>
                <Link href="/leaderboard" className="font-bold uppercase text-sm hover:text-accent transition-colors">
                  Leaderboard
                </Link>
                <Link href="/get-started" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
        {/* Decorative Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-feature-blue border-4 border-primary rounded-lg shadow-brutalist animate-float hidden lg:block" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-feature-red border-4 border-primary rounded-lg shadow-brutalist-lg transform rotate-12 animate-tilt hidden lg:block" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-feature-yellow border-4 border-primary rounded-lg shadow-brutalist transform rotate-45 hidden md:block" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-4 border-primary rounded-lg font-bold uppercase text-sm tracking-wide shadow-brutalist-sm mb-8 animate-slide-in-up">
            <Zap className="w-5 h-5" />
            <span>Developer Revolution</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-hero mb-6 animate-slide-in-up">
            Build Your
            <span className="block text-accent">Developer</span>
            <span className="block">Portfolio</span>
          </h1>

          {/* Subtitle */}
          <p className="text-subtitle mb-6 animate-slide-in-up" style={{animationDelay: "0.1s"}}>
            No more generic portfolios. No more missed opportunities. Just pure professional impact.
          </p>

          <p className="text-body max-w-2xl mx-auto mb-12 animate-slide-in-up" style={{animationDelay: "0.2s"}}>
            Transform your developer presence with AI-powered portfolio optimization, verified skill endorsements, and zero-nonsense design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-in-up" style={{animationDelay: "0.3s"}}>
            {user ? (
              // Authenticated user CTAs
              <>
                <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {user.username && (
                  <Link href={`/${user.username}`} className="btn-secondary inline-flex items-center gap-2">
                    View My Profile
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </>
            ) : (
              // Guest user CTAs
              <>
                <Link href="/get-started" className="btn-primary inline-flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="btn-secondary inline-flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 justify-center animate-slide-in-up" style={{animationDelay: "0.4s"}}>
            <div className="stat-box">
              <div className="text-3xl md:text-4xl font-black mb-1">10K+</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Developers</div>
            </div>
            <div className="stat-box bg-accent text-accent-foreground">
              <div className="text-3xl md:text-4xl font-black mb-1">1M+</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Projects</div>
            </div>
            <div className="stat-box bg-feature-green text-primary-foreground">
              <div className="text-3xl md:text-4xl font-black mb-1">99.9%</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-section mb-4">
              Brutal Features
            </h2>
            <p className="text-subtitle">
              Everything you need. Nothing you don&apos;t.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Portfolio Builder */}
            <div className="card-feature">
              <div className="icon-box-purple">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase mb-3">Portfolio Builder</h3>
              <p className="text-body">
                Create stunning portfolio pages with drag-and-drop project showcases and zero-nonsense design.
              </p>
            </div>

            {/* Skill Endorsements */}
            <div className="card-feature">
              <div className="icon-box-blue">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase mb-3">Skill Endorsements</h3>
              <p className="text-body">
                Get verified endorsements from colleagues who&apos;ve actually worked with you on real projects.
              </p>
            </div>

            {/* AI Portfolio Review */}
            <div className="card-feature">
              <div className="icon-box-yellow">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase mb-3">AI Portfolio Review</h3>
              <p className="text-body">
                Get brutally honest but constructive feedback on your portfolio with AI-powered insights.
              </p>
            </div>

            {/* Analytics Dashboard */}
            <div className="card-feature">
              <div className="icon-box-green">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase mb-3">Analytics Dashboard</h3>
              <p className="text-body">
                Track your profile performance with detailed analytics and actionable insights.
              </p>
            </div>

            {/* Custom Domains */}
            <div className="card-feature">
              <div className="icon-box-red">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase mb-3">Custom Domains</h3>
              <p className="text-body">
                Use your own domain for a professional portfolio presence that stands out.
              </p>
            </div>

            {/* Developer Network */}
            <div className="card-feature">
              <div className="icon-box-indigo">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase mb-3">Developer Network</h3>
              <p className="text-body">
                Connect with other developers and build your professional network with skill-based discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20 border-y-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-card border-4 border-primary rounded-lg p-12 shadow-brutalist-lg relative">
            {/* Decorative corner accent */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent border-4 border-primary rounded-lg shadow-brutalist-sm transform rotate-12 hidden md:block" />
            
            <h2 className="text-section mb-6 text-foreground">
              Ready to Build Your Portfolio?
            </h2>
            <p className="text-subtitle mb-8 text-muted-foreground">
              Stop missing opportunities. Start showcasing your skills.
            </p>
            <Link href="/get-started" className="btn-secondary inline-flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 border-t-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center border-4 border-background shadow-brutalist-sm">
                  <span className="text-primary font-black text-xl">D</span>
                </div>
                <span className="text-2xl font-black uppercase tracking-tight">Cluefind</span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                The ultimate platform for developer portfolios and skill endorsements.
              </p>
            </div>
            <div>
              <h3 className="font-black uppercase mb-4 text-sm tracking-wide">Product</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="#features" className="hover:text-accent transition-colors">Features</Link></li>
                <li><Link href="/leaderboard" className="hover:text-accent transition-colors">Leaderboard</Link></li>
                <li><Link href="#demo" className="hover:text-accent transition-colors">Demo</Link></li>
                <li><Link href="/api" className="hover:text-accent transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black uppercase mb-4 text-sm tracking-wide">Company</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/about" className="hover:text-accent transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-accent transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-black uppercase mb-4 text-sm tracking-wide">Connect</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link href="https://github.com" className="hover:text-accent transition-colors inline-flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="https://linkedin.com" className="hover:text-accent transition-colors inline-flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Link>
                </li>
                <li><Link href="https://twitter.com" className="hover:text-accent transition-colors">Twitter</Link></li>
                <li><Link href="/discord" className="hover:text-accent transition-colors">Discord</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t-4 border-background pt-8 text-center text-sm">
            <p className="mb-2 opacity-80">&copy; 2024 Cluefind. All rights reserved.</p>
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <span className="opacity-80">Built with 💪 by</span>
              <Link 
                href="https://github.com/yourusername" 
                className="font-bold hover:text-accent transition-colors inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                Your Name
              </Link>
              <span className="opacity-80">|</span>
              <Link 
                href="https://linkedin.com/in/yourprofile" 
                className="font-bold hover:text-accent transition-colors inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn Profile
              </Link>
            </p>
          </div>
        </div>
      </footer>
      </div>
    </ClientOnly>
  );
}