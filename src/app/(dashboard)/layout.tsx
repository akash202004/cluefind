"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, FileText, Brain, LogOut, User, Link2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
        window.location.hash = href.split("#")[1] || "";
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </a>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { signOut, user, loading } = useAuth();
  const [active, setActive] = useState<string>("dashboard");

  // Redirect recruiters to leaderboard
  useEffect(() => {
    if (!loading && user?.role === "RECRUITER") {
      router.push("/leaderboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const updateActive = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash === "#view-profile") setActive("view-profile");
      else if (hash === "#edit-profile") setActive("edit-profile");
      else if (hash === "#resume") setActive("resume");
      else if (hash === "#github") setActive("github");
      else if (hash === "#skills") setActive("skills");
      else if (hash === "#projects") setActive("projects");
      else if (hash === "#social") setActive("social");
      else if (hash === "#ai") setActive("ai");
      else setActive("dashboard");
    };
    updateActive();
    window.addEventListener("hashchange", updateActive);
    return () => window.removeEventListener("hashchange", updateActive);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/get-started");
  };

  // Don't render dashboard for recruiters
  if (user?.role === "RECRUITER") {
    return null;
  }

  return (
    <ProtectedRoute requireAuth={true} requireProfile={true}>
      <div className="min-h-screen bg-background dot-grid-bg">
        {/* Header */}
        <header className="border-b-4 border-primary bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm">
                <span className="text-primary-foreground font-black text-xl">
                  D
                </span>
              </div>
              <span className="text-2xl font-black uppercase tracking-tight">
                Cluefind
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/leaderboard" className="btn-outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Leaderboard
              </Link>
              <button onClick={handleSignOut} className="btn-outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-card border-r-4 border-primary min-h-screen p-6">
            <nav className="space-y-2">
              <NavLink
                href="/dashboard"
                active={active === "dashboard"}
                onClick={() => setActive("dashboard")}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Dashboard
                </span>
              </NavLink>

              <NavLink
                href="/dashboard#view-profile"
                active={active === "view-profile"}
                onClick={() => setActive("view-profile")}
              >
                <User className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  View Profile
                </span>
              </NavLink>

              <NavLink
                href="/dashboard#edit-profile"
                active={active === "edit-profile"}
                onClick={() => setActive("edit-profile")}
              >
                <User className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Edit Profile
                </span>
              </NavLink>

              <NavLink
                href="/dashboard#resume"
                active={active === "resume"}
                onClick={() => setActive("resume")}
              >
                <FileText className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Add Resume Content
                </span>
              </NavLink>

              <NavLink
                href="/dashboard#github"
                active={active === "github"}
                onClick={() => setActive("github")}
              >
                <Link2 className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Connect GitHub
                </span>
              </NavLink>

              <NavLink
                href="/dashboard#skills"
                active={active === "skills"}
                onClick={() => setActive("skills")}
              >
                <User className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Skills
                </span>
              </NavLink>

              <NavLink
                href="/dashboard#projects"
                active={active === "projects"}
                onClick={() => setActive("projects")}
              >
                <FileText className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Projects Show Off
                </span>
              </NavLink>

              <NavLink
                href="/dashboard#social"
                active={active === "social"}
                onClick={() => setActive("social")}
              >
                <Link2 className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Social Links
                </span>
              </NavLink>

              <NavLink
                href="/dashboard#ai"
                active={active === "ai"}
                onClick={() => setActive("ai")}
              >
                <Brain className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  AI Review
                </span>
              </NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
