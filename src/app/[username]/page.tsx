import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import type { Metadata } from "next";

interface PortfolioPageProps {
  params: Promise<{
    username: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await db.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      bio: true,
      image: true,
    },
  });

  if (!user) {
    return {
      title: "User Not Found - DevSync",
      description: "The requested user profile could not be found.",
    };
  }

  return {
    title: `${user.name || user.username} - DevSync Portfolio`,
    description: user.bio || `View ${user.name || user.username}'s developer portfolio on DevSync`,
    openGraph: {
      title: `${user.name || user.username} - DevSync Portfolio`,
      description: user.bio || `View ${user.name || user.username}'s developer portfolio on DevSync`,
      images: user.image ? [user.image] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${user.name || user.username} - DevSync Portfolio`,
      description: user.bio || `View ${user.name || user.username}'s developer portfolio on DevSync`,
      images: user.image ? [user.image] : [],
    },
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      profile: {
        select: {
          skills: true,
          githubId: true,
          socialLinks: true,
        },
      },
    },
  });

  if (!user || !user.profile) {
    notFound();
  }

  const skills: string[] = user.profile.skills || [];
  const socialLinks = Array.isArray(user.profile.socialLinks)
    ? (user.profile.socialLinks as Array<{ platform: string; url: string }>)
    : [];
  const githubUrl = user.profile.githubId
    ? `https://github.com/${user.profile.githubId}`
    : undefined;

  return (
    <div className="min-h-screen bg-background dot-grid-bg">
      {/* Header */}
      <header className="border-b-4 border-primary bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm">
              <span className="text-primary-foreground font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black uppercase tracking-tight">DevSync</span>
          </Link>
          <div />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="w-32 h-32 bg-accent rounded-full border-4 border-primary shadow-brutalist-lg mx-auto mb-6 overflow-hidden">
            {user.image ? (
              <Image 
                src={user.image} 
                alt={user.name || user.username} 
                width={128}
                height={128}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-4xl font-black text-muted-foreground">
                  {(user.name || user.username).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h1 className="text-hero mb-4">{user.name || user.username}</h1>
          <p className="text-body max-w-2xl mx-auto mb-6">{user.bio || ""}</p>
          
          

          <div className="flex items-center justify-center gap-4 mb-8">
            {githubUrl && (
              <Link href={githubUrl} className="btn-outline p-3">
                <Github className="w-6 h-6" />
              </Link>
            )}
            {socialLinks.map((link, idx) => (
              <Link key={idx} href={link.url} className="btn-outline p-3">
                {link.platform.toLowerCase().includes("linkedin") ? (
                  <Linkedin className="w-6 h-6" />
                ) : link.platform.toLowerCase().includes("mail") || link.platform.toLowerCase().includes("email") ? (
                  <Mail className="w-6 h-6" />
                ) : (
                  <ExternalLink className="w-6 h-6" />
                )}
              </Link>
            ))}
          </div>

          {/* Stats placeholder */}
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="stat-box bg-accent text-accent-foreground">
              <div className="text-2xl font-black mb-1">—</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Vouches</div>
            </div>
            <div className="stat-box bg-feature-purple text-primary-foreground">
              <div className="text-2xl font-black mb-1">—</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Rating</div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className="text-section mb-8 text-center">Skills</h2>
          {skills.length === 0 ? (
            <p className="text-center text-muted-foreground">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wide rounded">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Social links Section */}
        <section className="mb-12">
          <h2 className="text-section mb-8 text-center">Social Links</h2>
          {socialLinks.length === 0 && !githubUrl ? (
            <p className="text-center text-muted-foreground">No social links yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {githubUrl && (
                <Link href={githubUrl} className="btn-outline p-2"><Github className="w-5 h-5" /></Link>
              )}
              {socialLinks.map((link, idx) => (
                <Link key={idx} href={link.url} className="btn-outline p-2">
                  {link.platform}
                </Link>
              ))}
            </div>
          )}
        </section>

        
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-primary bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center border-4 border-primary shadow-brutalist-sm">
                  <span className="text-primary-foreground font-black text-sm">D</span>
                </div>
                <span className="text-xl font-black uppercase tracking-tight">DevSync</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The modern developer portfolio platform with AI-powered insights and verified endorsements.
              </p>
            </div>
            
            <div>
              <h3 className="font-black uppercase text-sm tracking-wide mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-black uppercase text-sm tracking-wide mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-black uppercase text-sm tracking-wide mb-4">Connect</h3>
              <div className="flex items-center gap-4">
                <Link href="https://github.com" className="btn-outline p-2">
                  <Github className="w-5 h-5" />
                </Link>
                <Link href="https://linkedin.com" className="btn-outline p-2">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="mailto:hello@devsync.com" className="btn-outline p-2">
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t-4 border-primary mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 DevSync. Built with ❤️ by{" "}
              <Link href="https://github.com/yourusername" className="text-accent hover:text-accent/80 transition-colors">
                Your Name
              </Link>
              . Connect on{" "}
              <Link href="https://linkedin.com/in/yourprofile" className="text-accent hover:text-accent/80 transition-colors">
                LinkedIn
              </Link>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 300;

