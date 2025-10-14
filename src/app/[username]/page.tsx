import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import VouchButton from "@/components/portfolio/VouchButton";
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
      email: true,
      image: true,
      bio: true,
      profile: {
        select: {
          skills: true,
          githubId: true,
          socialLinks: true,
          projects: true,
          id: true,
          _count: { select: { vouches: true } },
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
  // Projects are stored as Json? in Profile; normalize to an array shape
  const rawProjects = user.profile.projects as unknown;
  const projects: Array<{
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    tags?: string[];
  }> = Array.isArray(rawProjects) ? (rawProjects as any) : [];
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
            {user.email && (
              <a href={`mailto:${user.email}`} className="btn-secondary px-4 py-2 inline-flex items-center gap-2 text-sm font-bold uppercase">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            )}
          </div>

          {/* Vouches */}
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className="stat-box bg-accent text-accent-foreground">
              <div className="text-2xl font-black mb-1">{user.profile?._count?.vouches ?? 0}</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Vouches</div>
            </div>
            {user.profile?.id && (
              <VouchButton profileId={user.profile.id} />
            )}
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

        {/* Projects Section (moved above Social Links) */}
        <section className="mb-12">
          <h2 className="text-section mb-8 text-center">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground">No projects added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <div key={idx} className="card-brutalist h-full flex flex-col">
                  {project.image ? (
                    <div className="w-full h-40 border-4 border-primary rounded mb-4 overflow-hidden">
                      <Image src={project.image} alt={project.title || `Project ${idx+1}`} width={600} height={300} className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                  <h3 className="text-lg font-black uppercase tracking-wide mb-2">
                    {project.title || `Project ${idx + 1}`}
                  </h3>
                  {project.description ? (
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  ) : null}
                  {project.tags && project.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-muted border-2 border-primary rounded text-xs font-bold uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-auto">
                    {project.url ? (
                      <Link href={project.url} className="btn-outline inline-flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" /> View Project
                      </Link>
                    ) : null}
                  </div>
                </div>
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

      {/* Footer removed on public username page */}
    </div>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 300;

