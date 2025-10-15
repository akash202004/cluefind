"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  Brain,
  LogOut,
  User,
  Link2,
  Menu,
  X,
} from "lucide-react";
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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-3 transition-all cursor-pointer font-bold uppercase text-xs tracking-wide shadow-brutalist-sm ${
        active
          ? "bg-primary text-primary-foreground border-black"
          : "bg-background text-foreground border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
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
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

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
        <header className="border-b-4 border-primary bg-background sticky top-0 z-50 shadow-brutalist-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden btn-outline p-2.5 shadow-brutalist-sm"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm">
                  <span className="text-primary-foreground font-black text-xl">
                    D
                  </span>
                </div>
                <span className="text-xl font-black uppercase tracking-tight">
                  Cluefind
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user?.username && (
                <Link
                  href={`/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-sm font-bold uppercase tracking-wide shadow-brutalist-sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
              )}
              <Link
                href="/leaderboard"
                className="btn-outline text-sm font-bold uppercase tracking-wide shadow-brutalist-sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Search Developers
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-outline text-sm font-bold uppercase tracking-wide shadow-brutalist-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>

            {/* Mobile buttons */}
            <div className="md:hidden flex items-center gap-2">
              {user?.username && (
                <Link
                  href={`/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline p-2 shadow-brutalist-sm"
                  title="View Profile"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}
              <Link
                href="/leaderboard"
                className="btn-outline p-2 shadow-brutalist-sm"
                title="Search Developers"
              >
                <BarChart3 className="w-4 h-4" />
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-outline p-2 shadow-brutalist-sm"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Overlay for mobile */}
          {mobileOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
          )}
          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r p-4 transform transition-transform duration-200 md:static md:translate-x-0 md:min-h-screen ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Mobile header inside sidebar */}
            <div className="flex items-center justify-between mb-4 md:hidden pb-3 border-b-2 border-primary">
              <span className="font-bold uppercase tracking-wide text-sm">
                Menu
              </span>
              <button
                className="btn-outline p-2 shadow-brutalist-sm"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-3">
              <NavLink
                href="/dashboard"
                active={active === "dashboard"}
                onClick={() => {
                  setActive("dashboard");
                  setMobileOpen(false);
                }}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-bold text-xs">Dashboard</span>
              </NavLink>

              <NavLink
                href="/dashboard#view-profile"
                active={active === "view-profile"}
                onClick={() => {
                  setActive("view-profile");
                  setMobileOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                <span className="font-bold text-xs">View Profile</span>
              </NavLink>

              <NavLink
                href="/dashboard#edit-profile"
                active={active === "edit-profile"}
                onClick={() => {
                  setActive("edit-profile");
                  setMobileOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                <span className="font-bold text-xs">Edit Profile</span>
              </NavLink>

              <NavLink
                href="/dashboard#resume"
                active={active === "resume"}
                onClick={() => {
                  setActive("resume");
                  setMobileOpen(false);
                }}
              >
                <FileText className="w-4 h-4" />
                <span className="font-bold text-xs">Add Resume Content</span>
              </NavLink>

              <NavLink
                href="/dashboard#github"
                active={active === "github"}
                onClick={() => {
                  setActive("github");
                  setMobileOpen(false);
                }}
              >
                <Link2 className="w-4 h-4" />
                <span className="font-bold text-xs">Connect GitHub</span>
              </NavLink>

              <NavLink
                href="/dashboard#skills"
                active={active === "skills"}
                onClick={() => {
                  setActive("skills");
                  setMobileOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                <span className="font-bold text-xs">Skills</span>
              </NavLink>

              <NavLink
                href="/dashboard#projects"
                active={active === "projects"}
                onClick={() => {
                  setActive("projects");
                  setMobileOpen(false);
                }}
              >
                <FileText className="w-4 h-4" />
                <span className="font-bold text-xs">Projects Show Off</span>
              </NavLink>

              <NavLink
                href="/dashboard#social"
                active={active === "social"}
                onClick={() => {
                  setActive("social");
                  setMobileOpen(false);
                }}
              >
                <Link2 className="w-4 h-4" />
                <span className="font-bold text-xs">Social Links</span>
              </NavLink>

              <NavLink
                href="/dashboard#ai"
                active={active === "ai"}
                onClick={() => {
                  setActive("ai");
                  setMobileOpen(false);
                }}
              >
                <Brain className="w-4 h-4" />
                <span className="font-bold text-xs">AI Resume Review</span>
              </NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
