"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  BarChart3,
  FileText,
  Users,
  Brain,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/get-started");
  };

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
                DevSync
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <button className="btn-outline p-2">
                <Menu className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-accent rounded-full border-4 border-primary shadow-brutalist-sm"></div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-card border-r-4 border-primary min-h-screen p-6">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Dashboard
                </span>
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Profile
                </span>
              </Link>

              <Link
                href="/dashboard/projects"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Projects
                </span>
              </Link>

              <Link
                href="/dashboard/endorsements"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Endorsements
                </span>
              </Link>

              <Link
                href="/dashboard/ai-review"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <Brain className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  AI Review
                </span>
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Settings
                </span>
              </Link>

              <div className="border-t-4 border-primary my-4"></div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-bold uppercase text-sm tracking-wide">
                  Sign Out
                </span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
