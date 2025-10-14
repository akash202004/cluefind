"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Heart, TrendingUp, Github, Linkedin, ArrowLeft } from "lucide-react";

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
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?page=${page}&limit=20`);
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
              <span className="text-primary-foreground font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black uppercase tracking-tight">DevSync</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/#features" className="font-bold uppercase text-sm hover:text-accent transition-colors">
              Features
            </Link>
            <Link href="/leaderboard" className="font-bold uppercase text-sm text-accent">
              Leaderboard
            </Link>
            <button className="btn-outline text-sm px-4 py-2">
              Sign In
            </button>
            <button className="btn-secondary text-sm px-4 py-2">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-8 font-bold uppercase text-sm hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-4 border-primary rounded-lg font-bold uppercase text-sm tracking-wide shadow-brutalist-sm mb-6">
            <Trophy className="w-5 h-5" />
            <span>Top Developers</span>
          </div>
          <h1 className="text-section mb-4">
            Leaderboard
          </h1>
          <p className="text-subtitle">
            The best developers ranked by community vouches
          </p>
        </div>

        {/* Stats Overview removed per request */}

        {/* Leaderboard List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        ) : data?.students && data.students.length > 0 ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {data.students.map((student, index) => {
              const rank = (page - 1) * 20 + index + 1;
              return (
                <div 
                  key={student.id} 
                  className={`card-brutalist hover:translate-x-0 hover:translate-y-0 hover:shadow-brutalist-lg transition-all ${
                    rank === 1 ? "bg-accent/10" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 flex items-center justify-center border-4 border-primary rounded-lg shadow-brutalist-sm font-black text-2xl ${
                        rank === 1 ? "bg-feature-yellow" :
                        rank === 2 ? "bg-feature-blue" :
                        rank === 3 ? "bg-feature-purple" :
                        "bg-muted"
                      }`}>
                        {rank === 1 && <Trophy className="w-8 h-8" />}
                        {rank !== 1 && `#${rank}`}
                      </div>

                      {/* Avatar */}
                      <div className={`w-16 h-16 flex items-center justify-center border-4 border-primary rounded-lg shadow-brutalist-sm font-black text-xl overflow-hidden ${getColorForRank(index)}`}>
                        {student.image ? (
                          <Image
                            src={student.image}
                            alt={student.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(student.name)
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <Link 
                        href={`/${student.username}`} 
                        className="text-xl font-black uppercase hover:text-accent transition-colors"
                      >
                        {student.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">@{student.username}</p>
                      {student.bio && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{student.bio}</p>
                      )}
                      {student.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {student.skills.slice(0, 5).map((skill) => (
                            <span 
                              key={skill} 
                              className="px-3 py-1 bg-muted border-2 border-primary rounded text-xs font-bold uppercase"
                            >
                              {skill}
                            </span>
                          ))}
                          {student.skills.length > 5 && (
                            <span className="px-3 py-1 text-xs font-bold text-muted-foreground">
                              +{student.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Vouches */}
                    <div className="flex items-center gap-2">
                      <div className="stat-box bg-primary text-primary-foreground">
                        <div className="flex items-center gap-2">
                          <Heart className="w-6 h-6 fill-accent text-accent" />
                          <span className="text-2xl font-black">{student.vouchCount}</span>
                        </div>
                        <div className="text-xs uppercase tracking-wide opacity-80 mt-1">Vouches</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link 
                        href={`/${student.username}`}
                        className="btn-outline text-xs px-3 py-2"
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
          <div className="text-center py-12">
            <p className="text-muted-foreground">No student profiles found.</p>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm font-bold">
              Page {page} of {data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
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
                <span className="text-2xl font-black uppercase tracking-tight">DevSync</span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                The ultimate platform for developer portfolios and skill endorsements.
              </p>
            </div>
            <div>
              <h3 className="font-black uppercase mb-4 text-sm tracking-wide">Product</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/#features" className="hover:text-accent transition-colors">Features</Link></li>
                <li><Link href="/leaderboard" className="hover:text-accent transition-colors">Leaderboard</Link></li>
                <li><Link href="/#demo" className="hover:text-accent transition-colors">Demo</Link></li>
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
            <p className="mb-2 opacity-80">&copy; 2024 DevSync. All rights reserved.</p>
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

