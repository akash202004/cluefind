"use client";

import Link from "next/link";
import { 
  Plus,
  ExternalLink,
  Github,
  FileText,
  User,
  LogOut
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          router.push("/get-started");
          return;
        }
        
        if (!session) {
          router.push("/get-started");
          return;
        }
        
        setSession(session);
      } catch (error) {
        console.error("Session error:", error);
        router.push("/get-started");
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push("/get-started");
        } else if (session) {
          setSession(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/get-started");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section mb-2">Dashboard</h1>
          <p className="text-subtitle">Welcome back, {session.user?.name || session.user?.email || 'User'}! Manage your portfolio.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/profile/edit" className="btn-primary">
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Link>
          <button 
            onClick={handleSignOut}
            className="btn-outline"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-box">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-blue">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Repositories</span>
          </div>
          <div className="text-3xl font-black mb-1">12</div>
          <div className="text-sm text-muted-foreground">Public repos</div>
        </div>

        <div className="stat-box bg-accent text-accent-foreground">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-green">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">Skills</span>
          </div>
          <div className="text-3xl font-black mb-1">8</div>
          <div className="text-sm opacity-90">Technologies</div>
        </div>

        <div className="stat-box bg-feature-purple text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-purple">
              <User className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">Vouches</span>
          </div>
          <div className="text-3xl font-black mb-1">5</div>
          <div className="text-sm opacity-90">From colleagues</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Repositories */}
        <div className="card-brutalist">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black uppercase tracking-wide">Recent Repositories</h2>
            <Link href="/dashboard/repos" className="text-sm font-bold uppercase tracking-wide text-accent hover:text-accent/80 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              {
                title: "devsync-portfolio",
                description: "Modern developer portfolio platform with AI features",
                tech: ["Next.js", "TypeScript", "Prisma", "Tailwind"],
                stars: 23,
                language: "TypeScript"
              },
              {
                title: "task-manager",
                description: "Collaborative task management tool",
                tech: ["React", "Node.js", "MongoDB"],
                stars: 15,
                language: "JavaScript"
              },
              {
                title: "weather-app",
                description: "Real-time weather dashboard",
                tech: ["Vue.js", "Express", "Chart.js"],
                stars: 8,
                language: "JavaScript"
              }
            ].map((repo, index) => (
              <div key={index} className="border-4 border-primary rounded-lg p-4 bg-muted/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-black text-lg uppercase tracking-wide mb-1">{repo.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{repo.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {repo.tech.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{repo.language}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">{repo.stars}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-bold">{repo.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-outline p-2">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Vouches */}
          <div className="card-brutalist">
            <h3 className="text-lg font-black uppercase tracking-wide mb-4">Recent Vouches</h3>
            <div className="space-y-3">
              {[
                { name: "Sarah Chen", skill: "React", message: "Excellent frontend developer" },
                { name: "Mike Wilson", skill: "Node.js", message: "Great backend skills" },
                { name: "Alex Kim", skill: "TypeScript", message: "Clean, maintainable code" }
              ].map((vouch, index) => (
                <div key={index} className="border-2 border-primary rounded-lg p-3 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-accent rounded-full border-2 border-primary"></div>
                    <span className="font-bold text-sm">{vouch.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Vouched for <span className="font-bold text-accent">{vouch.skill}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">&quot;{vouch.message}&quot;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-brutalist">
            <h3 className="text-lg font-black uppercase tracking-wide mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/ai-review" className="btn-outline w-full text-left">
                <FileText className="w-4 h-4 mr-2" />
                Get AI Review
              </Link>
              <Link href="/dashboard/profile/edit" className="btn-outline w-full text-left">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
              <Link href="/leaderboard" className="btn-outline w-full text-left">
                <Github className="w-4 h-4 mr-2" />
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
