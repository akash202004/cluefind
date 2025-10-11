import Link from "next/link";
import { 
  Eye, 
  Heart, 
  Share2, 
  TrendingUp, 
  Users, 
  Star,
  Plus,
  ExternalLink
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section mb-2">Dashboard</h1>
          <p className="text-subtitle">Welcome back! Here's your portfolio overview.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/projects/new" className="btn-outline">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
          <Link href="/dashboard/profile/edit" className="btn-primary">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-box">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-blue">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Views</span>
          </div>
          <div className="text-3xl font-black mb-1">2,847</div>
          <div className="text-sm text-muted-foreground">+12% this week</div>
        </div>

        <div className="stat-box bg-accent text-accent-foreground">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-green">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">Likes</span>
          </div>
          <div className="text-3xl font-black mb-1">156</div>
          <div className="text-sm opacity-90">+8% this week</div>
        </div>

        <div className="stat-box bg-feature-purple text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-purple">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">Endorsements</span>
          </div>
          <div className="text-3xl font-black mb-1">23</div>
          <div className="text-sm opacity-90">+3 this month</div>
        </div>

        <div className="stat-box bg-feature-green text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-green">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide opacity-90">Rating</span>
          </div>
          <div className="text-3xl font-black mb-1">4.8</div>
          <div className="text-sm opacity-90">Based on 23 reviews</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="card-brutalist">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase tracking-wide">Recent Projects</h2>
              <Link href="/dashboard/projects" className="text-sm font-bold uppercase tracking-wide text-accent hover:text-accent/80 transition-colors">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  title: "E-Commerce Platform",
                  description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL",
                  tech: ["React", "Node.js", "PostgreSQL", "Tailwind"],
                  views: 342,
                  likes: 28,
                  status: "published"
                },
                {
                  title: "Task Management App",
                  description: "Collaborative task management tool with real-time updates",
                  tech: ["Next.js", "TypeScript", "Prisma", "Socket.io"],
                  views: 189,
                  likes: 15,
                  status: "published"
                },
                {
                  title: "Portfolio Website",
                  description: "Personal portfolio website with dark mode and animations",
                  tech: ["Next.js", "Tailwind", "Framer Motion"],
                  views: 156,
                  likes: 12,
                  status: "draft"
                }
              ].map((project, index) => (
                <div key={index} className="border-4 border-primary rounded-lg p-4 bg-muted/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-black text-lg uppercase tracking-wide mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      project.status === 'published' ? 'bg-feature-green text-primary-foreground' : 'bg-feature-yellow text-primary'
                    }`}>
                      {project.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-bold">{project.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="font-bold">{project.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-outline p-2">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="btn-outline p-2">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Endorsements */}
          <div className="card-brutalist">
            <h3 className="text-lg font-black uppercase tracking-wide mb-4">Recent Endorsements</h3>
            <div className="space-y-3">
              {[
                { name: "Sarah Chen", skill: "React", message: "Excellent frontend developer" },
                { name: "Mike Wilson", skill: "Node.js", message: "Great backend skills" },
                { name: "Alex Kim", skill: "TypeScript", message: "Clean, maintainable code" }
              ].map((endorsement, index) => (
                <div key={index} className="border-2 border-primary rounded-lg p-3 bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-accent rounded-full border-2 border-primary"></div>
                    <span className="font-bold text-sm">{endorsement.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Endorsed for <span className="font-bold text-accent">{endorsement.skill}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">"{endorsement.message}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Chart Placeholder */}
          <div className="card-brutalist">
            <h3 className="text-lg font-black uppercase tracking-wide mb-4">Analytics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">Profile Views</span>
                  <span className="text-sm font-black">+12%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-feature-blue" style={{width: '75%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">Project Views</span>
                  <span className="text-sm font-black">+8%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-feature-green" style={{width: '60%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">Endorsements</span>
                  <span className="text-sm font-black">+15%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-feature-purple" style={{width: '85%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
