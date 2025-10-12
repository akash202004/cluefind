import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Calendar,
  ExternalLink,
  Heart,
  Share2,
  Star,
  Code,
  Database,
  Palette,
  Globe
} from "lucide-react";

// Mock data - replace with actual database queries
const mockUser = {
  id: "1",
  username: "johndoe",
  name: "John Doe",
  title: "Full Stack Developer",
  bio: "Passionate developer with 5+ years of experience building scalable web applications. I love creating user-friendly interfaces and robust backend systems.",
  location: "San Francisco, CA",
  email: "john@example.com",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  avatar: "/api/placeholder/150/150",
  joinedAt: "2023-01-15",
  skills: [
    { name: "React", level: 95, endorsements: 12 },
    { name: "Node.js", level: 90, endorsements: 8 },
    { name: "TypeScript", level: 88, endorsements: 15 },
    { name: "PostgreSQL", level: 85, endorsements: 6 },
    { name: "Python", level: 80, endorsements: 4 },
    { name: "AWS", level: 75, endorsements: 3 }
  ],
  projects: [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, inventory management, and admin dashboard.",
      image: "/api/placeholder/400/300",
      tech: ["React", "Node.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
      github: "https://github.com/johndoe/ecommerce",
      live: "https://ecommerce-demo.com",
      featured: true
    },
    {
      id: "2", 
      title: "Task Management App",
      description: "Collaborative task management tool with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "/api/placeholder/400/300",
      tech: ["Next.js", "TypeScript", "Prisma", "Socket.io", "Tailwind CSS"],
      github: "https://github.com/johndoe/taskapp",
      live: "https://taskapp-demo.com",
      featured: true
    },
    {
      id: "3",
      title: "Weather Dashboard",
      description: "Real-time weather dashboard with location-based forecasts and interactive charts.",
      image: "/api/placeholder/400/300", 
      tech: ["Vue.js", "Express", "MongoDB", "Chart.js"],
      github: "https://github.com/johndoe/weather",
      live: "https://weather-demo.com",
      featured: false
    }
  ],
  endorsements: [
    {
      id: "1",
      from: "Sarah Chen",
      fromTitle: "Senior Frontend Developer",
      fromAvatar: "/api/placeholder/40/40",
      skill: "React",
      message: "John is an exceptional React developer. His code is clean, well-structured, and he always delivers on time. Highly recommend!",
      rating: 5,
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      from: "Mike Wilson",
      fromTitle: "Backend Lead",
      fromAvatar: "/api/placeholder/40/40",
      skill: "Node.js",
      message: "Outstanding backend developer with deep knowledge of Node.js and system architecture. Great to work with!",
      rating: 5,
      createdAt: "2024-01-10"
    }
  ],
  stats: {
    vouches: 23,
    rating: 4.8
  }
};

interface PortfolioPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;
  
  // In a real app, fetch user data from database
  if (username !== "johndoe") {
    notFound();
  }

  const user = mockUser;

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
          
          <div className="flex items-center gap-4">
            <button className="btn-outline p-2">
              <Heart className="w-5 h-5" />
            </button>
            <button className="btn-outline p-2">
              <Share2 className="w-5 h-5" />
            </button>
            <Link href="/signin" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="w-32 h-32 bg-accent rounded-full border-4 border-primary shadow-brutalist-lg mx-auto mb-6"></div>
          <h1 className="text-hero mb-4">{user.name}</h1>
          <p className="text-section text-accent mb-4">{user.title}</p>
          <p className="text-body max-w-2xl mx-auto mb-6">{user.bio}</p>
          
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span className="font-bold uppercase text-sm tracking-wide">{user.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span className="font-bold uppercase text-sm tracking-wide">Joined {new Date(user.joinedAt).getFullYear()}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Link href={user.github} className="btn-outline p-3">
              <Github className="w-6 h-6" />
            </Link>
            <Link href={user.linkedin} className="btn-outline p-3">
              <Linkedin className="w-6 h-6" />
            </Link>
            <Link href={`mailto:${user.email}`} className="btn-outline p-3">
              <Mail className="w-6 h-6" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="stat-box bg-accent text-accent-foreground">
              <div className="text-2xl font-black mb-1">{user.stats.vouches}</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Vouches</div>
            </div>
            <div className="stat-box bg-feature-purple text-primary-foreground">
              <div className="text-2xl font-black mb-1">{user.stats.rating}</div>
              <div className="text-sm uppercase tracking-wide opacity-90">Rating</div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className="text-section mb-8 text-center">Skills & Vouches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.skills.map((skill, index) => (
              <div key={index} className="card-brutalist">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black uppercase tracking-wide">{skill.name}</h3>
                  <span className="text-sm font-bold text-muted-foreground">{skill.endorsements} vouches</span>
                </div>
                <div className="progress-bar mb-2">
                  <div className="progress-fill bg-feature-blue" style={{width: `${skill.level}%`}}></div>
                </div>
                <div className="text-sm text-muted-foreground">{skill.level}% proficiency</div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-12">
          <h2 className="text-section mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {user.projects.filter(p => p.featured).map((project) => (
              <div key={project.id} className="card-brutalist">
                <div className="w-full h-48 bg-muted border-4 border-primary rounded-lg mb-6"></div>
                <h3 className="text-xl font-black uppercase tracking-wide mb-3">{project.title}</h3>
                <p className="text-body mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wide rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <Link href={project.github} className="btn-outline flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    Code
                  </Link>
                  <Link href={project.live} className="btn-primary flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vouches Section */}
        <section className="mb-12">
          <h2 className="text-section mb-8 text-center">Vouches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.endorsements.map((vouch) => (
              <div key={vouch.id} className="card-brutalist">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent rounded-full border-4 border-primary shadow-brutalist-sm"></div>
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-wide">{vouch.from}</h3>
                    <p className="text-sm text-muted-foreground">{vouch.fromTitle}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(vouch.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-feature-yellow text-feature-yellow" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-body mb-3">&quot;{vouch.message}&quot;</p>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-feature-blue text-primary-foreground text-sm font-bold uppercase tracking-wide rounded">
                    {vouch.skill}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(vouch.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
export const revalidate = 3600; // Revalidate every hour
