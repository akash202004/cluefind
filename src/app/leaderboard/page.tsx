"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Heart,
  TrendingUp,
  Github,
  Linkedin,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import StudentCard from "@/components/ui/StudentCard";
import toast from "react-hot-toast";

interface Student {
  id: string;
  username: string;
  name: string;
  bio?: string;
  image?: string;
  skills: string[];
  vouchCount: number;
  repoCount: number;
}

interface LeaderboardData {
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function LeaderboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  // Search function
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        // Only exit search mode if we're currently in it
        if (isSearchMode) {
          setSearchResults([]);
          setIsSearchMode(false);
        }
        return;
      }

      // Only set search mode if not already in it
      if (!isSearchMode) {
        setIsSearchMode(true);
      }

      setSearchLoading(true);
      try {
        const response = await fetch(
          `/api/profiles?search=${encodeURIComponent(query)}&limit=50`
        );
        const data = await response.json();

        if (response.ok && data.success) {
          // Transform profiles to student format
          const transformedResults = (data.data || []).map((profile: any) => ({
            id: profile.id,
            username: profile.user?.username || "",
            name: profile.user?.name || "",
            bio: profile.user?.bio || "",
            image: profile.user?.image || "",
            skills: profile.skills || [],
            vouchCount: profile.vouchCount || 0,
            repoCount: profile.repoCount || 0,
          }));
          setSearchResults(transformedResults);
        } else {
          toast.error("Failed to search students");
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Search failed");
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [isSearchMode]
  );

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/leaderboard?page=${page}&limit=${pageSize}`
      );
      const result = await response.json();

      if (response.ok && result.success) {
        setData({
          students: result.data,
          pagination: result.pagination,
        });
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorForRank = (index: number) => {
    const colors = [
      "bg-feature-yellow",
      "bg-feature-blue",
      "bg-feature-purple",
      "bg-feature-green",
      "bg-feature-red",
    ];
    return colors[index % colors.length] || "bg-muted";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm">
              <span className="text-primary-foreground font-black text-xl">
                C
              </span>
            </div>
            <span className="text-2xl font-black uppercase tracking-tight">
              Cluefind
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-3">
            {/* Common link */}
            <Link
              href="/how-it-works"
              className="font-bold uppercase text-sm hover:text-accent transition-colors"
            >
              How it Works
            </Link>

            {/* Auth-aware actions */}
            {authLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : user ? (
              <>
                {user.role !== "RECRUITER" && (
                  <Link
                    href="/dashboard"
                    className="btn-outline text-sm px-4 py-2"
                  >
                    Dashboard
                  </Link>
                )}
                {user.username && user.role !== "RECRUITER" && (
                  <Link
                    href={`/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-sm px-4 py-2"
                  >
                    My Profile
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/get-started"
                  className="btn-outline text-sm px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Header Section with Back Button and Title */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/"
              className="btn-outline text-sm px-4 py-2 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Centered Page Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-4 border-primary rounded-lg font-bold uppercase text-sm tracking-wide shadow-brutalist-sm mb-4">
              <Trophy className="w-5 h-5" />
              <span>Top Developers</span>
            </div>
            <h1 className="text-section mb-3">Leaderboard</h1>
            <p className="text-subtitle">
              Discover standout profiles. Sign in to view your dashboard or
              start building your profile.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name, skills, bio, projects, or technologies..."
            className="w-full"
            value={searchQuery}
          />
        </div>

        {/* Search Results or Leaderboard */}
        {isSearchMode ? (
          <div className="space-y-4">
            {searchLoading && (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-muted-foreground font-black uppercase tracking-wide text-lg">
                  Searching students...
                </p>
              </div>
            )}

            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <div className="card-brutalist text-center py-16 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-muted border-4 border-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="text-muted-foreground font-black text-xl mb-4">
                  No students found for &quot;{searchQuery}&quot;
                </p>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Try searching with different keywords, skills, or check your
                  spelling.
                </p>
                <button
                  onClick={() => {
                    setIsSearchMode(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="btn-outline px-6 py-3"
                >
                  Back to Leaderboard
                </button>
              </div>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-background border-3 border-primary rounded-lg p-6 shadow-brutalist">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-wide text-primary mb-2">
                      Search Results
                    </h3>
                    <p className="text-muted-foreground font-bold">
                      Found {searchResults.length} students matching &quot;
                      {searchQuery}&quot;
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsSearchMode(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="btn-outline px-6 py-3"
                  >
                    Back to Leaderboard
                  </button>
                </div>
                <div className="max-w-5xl mx-auto space-y-6">
                  {searchResults.map((student) => (
                    <StudentCard key={student.id} student={student} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Leaderboard List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <p className="text-muted-foreground font-black uppercase tracking-wide text-xl">
                  Loading leaderboard...
                </p>
              </div>
            ) : data?.students && data.students.length > 0 ? (
              <div className="max-w-5xl mx-auto space-y-6">
                {data.students.map((student, index) => {
                  const rank = (page - 1) * pageSize + index + 1;
                  return (
                    <div
                      key={student.id}
                      className={`card-brutalist hover:translate-x-0 hover:translate-y-0 hover:shadow-brutalist-lg transition-all p-6 ${
                        rank === 1
                          ? "bg-gradient-to-r from-accent/10 to-transparent border-accent"
                          : ""
                      } ${rank <= 3 ? "border-4" : "border-3"}`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Rank */}
                        <div className="flex items-center gap-6">
                          <div
                            className={`w-20 h-20 flex items-center justify-center border-4 border-primary rounded-xl shadow-brutalist font-black text-2xl ${
                              rank === 1
                                ? "bg-feature-yellow shadow-lg scale-110"
                                : rank === 2
                                ? "bg-feature-blue shadow-md scale-105"
                                : rank === 3
                                ? "bg-feature-purple shadow-md scale-105"
                                : "bg-muted"
                            }`}
                          >
                            {rank === 1 && (
                              <Trophy className="w-10 h-10 text-primary" />
                            )}
                            {rank === 2 && (
                              <Trophy className="w-8 h-8 text-primary" />
                            )}
                            {rank === 3 && (
                              <Trophy className="w-8 h-8 text-primary" />
                            )}
                            {rank > 3 && `#${rank}`}
                          </div>

                          {/* Avatar */}
                          <div
                            className={`w-20 h-20 flex items-center justify-center border-4 border-primary rounded-xl shadow-brutalist font-black text-xl overflow-hidden ${getColorForRank(
                              index
                            )}`}
                          >
                            {student.image ? (
                              <Image
                                src={student.image}
                                alt={student.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getInitials(student.name)
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/${student.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-black uppercase hover:text-accent transition-colors block mb-2"
                          >
                            {student.name}
                          </Link>
                          <p className="text-base text-muted-foreground font-bold mb-2">
                            @{student.username}
                          </p>
                          {student.bio && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                              {student.bio}
                            </p>
                          )}
                          {student.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {student.skills.slice(0, 6).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-2 bg-muted border-2 border-primary rounded-lg text-xs font-black uppercase tracking-wide shadow-brutalist-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                  {skill}
                                </span>
                              ))}
                              {student.skills.length > 6 && (
                                <span className="px-3 py-2 text-xs font-bold text-muted-foreground bg-background border-2 border-muted rounded-lg">
                                  +{student.skills.length - 6} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Vouches */}
                        <div className="flex items-center gap-4">
                          <div className="stat-box bg-primary text-primary-foreground p-4 min-w-[120px]">
                            <div className="flex items-center gap-3 justify-center">
                              <Heart className="w-8 h-8 fill-accent text-accent" />
                              <span className="text-3xl font-black">
                                {student.vouchCount}
                              </span>
                            </div>
                            <div className="text-xs uppercase tracking-wide opacity-90 mt-2 text-center">
                              Vouches
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                          <Link
                            href={`/${student.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline text-sm px-4 py-3 whitespace-nowrap"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted border-4 border-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">👥</span>
                </div>
                <p className="text-muted-foreground font-black text-xl">
                  No student profiles found.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Be the first to create your profile!
                </p>
              </div>
            )}

            {/* Pagination */}
            {data && data.pagination.totalPages > 0 && (
              <div className="flex flex-col items-center gap-6 mt-16">
                {/* Rows per page selector */}
                <div className="flex items-center gap-4 bg-background border-3 border-primary rounded-lg p-4 shadow-brutalist-sm">
                  <span className="text-sm font-black uppercase tracking-wide">
                    Rows per page
                  </span>
                  <select
                    className="px-4 py-2 border-3 border-primary rounded-lg bg-background font-bold uppercase text-sm tracking-wide shadow-brutalist-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    value={pageSize}
                    onChange={(e) => {
                      const next = parseInt(e.target.value);
                      setPageSize(next);
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  {typeof data.pagination.total === "number" && (
                    <div className="px-3 py-1 bg-accent border-2 border-primary rounded text-xs font-black uppercase tracking-wide">
                      Total: {data.pagination.total}
                    </div>
                  )}
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutalist-sm px-6 py-3"
                  >
                    Previous
                  </button>

                  <div className="px-6 py-3 bg-primary text-primary-foreground border-3 border-primary rounded-lg font-black uppercase text-sm tracking-wide shadow-brutalist-sm">
                    Page {page} of {data.pagination.totalPages}
                  </div>

                  <button
                    onClick={() =>
                      setPage((p) =>
                        Math.min(data.pagination.totalPages, p + 1)
                      )
                    }
                    disabled={page === data.pagination.totalPages}
                    className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutalist-sm px-6 py-3"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 border-t-4 border-primary mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center border-4 border-background shadow-brutalist-sm">
                  <span className="text-primary font-black text-xl">D</span>
                </div>
                <span className="text-2xl font-black uppercase tracking-tight">
                  Cluefind
                </span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                The ultimate platform for developer portfolios and skill
                endorsements.
              </p>
            </div>
            <div>
              <h3 className="font-black uppercase mb-4 text-sm tracking-wide">
                Product
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="/#features"
                    className="hover:text-accent transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className="hover:text-accent transition-colors"
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#demo"
                    className="hover:text-accent transition-colors"
                  >
                    Demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="hover:text-accent transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-black uppercase mb-4 text-sm tracking-wide">
                Company
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-accent transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-accent transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-accent transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-accent transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-black uppercase mb-4 text-sm tracking-wide">
                Connect
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link
                    href="https://github.com"
                    className="hover:text-accent transition-colors inline-flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://linkedin.com"
                    className="hover:text-accent transition-colors inline-flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://twitter.com"
                    className="hover:text-accent transition-colors"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discord"
                    className="hover:text-accent transition-colors"
                  >
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-4 border-background pt-8 text-center text-sm">
            <p className="mb-2 opacity-80">
              &copy; 2024 Cluefind. All rights reserved.
            </p>
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
  );
}
