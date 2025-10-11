import { User, MapPin, Calendar, Github, Linkedin, Mail, Save, Upload } from "lucide-react";

export default function EditProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section mb-2">Edit Profile</h1>
          <p className="text-subtitle">Update your portfolio information</p>
        </div>
        <button className="btn-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <div className="card-brutalist">
          <h2 className="text-lg font-black uppercase tracking-wide mb-4">Profile Picture</h2>
          <div className="text-center">
            <div className="w-32 h-32 bg-accent rounded-full border-4 border-primary shadow-brutalist-lg mx-auto mb-4"></div>
            <button className="btn-outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Photo
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-brutalist">
            <h2 className="text-lg font-black uppercase tracking-wide mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue="johndoe"
                  className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  defaultValue="Full Stack Developer"
                  className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue="San Francisco, CA"
                  className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                Bio
              </label>
              <textarea
                rows={4}
                defaultValue="Passionate developer with 5+ years of experience building scalable web applications. I love creating user-friendly interfaces and robust backend systems."
                className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 resize-none"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                  fontWeight: "700",
                  fontSize: "16px"
                }}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="card-brutalist">
            <h2 className="text-lg font-black uppercase tracking-wide mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="john@example.com"
                  className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                    fontWeight: "700",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    defaultValue="https://github.com/johndoe"
                    className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                      fontWeight: "700",
                      fontSize: "16px"
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    defaultValue="https://linkedin.com/in/johndoe"
                    className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, \"SF Mono\", Consolas, \"Liberation Mono\", Menlo, monospace",
                      fontWeight: "700",
                      fontSize: "16px"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card-brutalist">
            <h2 className="text-lg font-black uppercase tracking-wide mb-6">Skills</h2>
            
            <div className="space-y-4">
              {[
                { name: "React", level: 95 },
                { name: "Node.js", level: 90 },
                { name: "TypeScript", level: 88 },
                { name: "PostgreSQL", level: 85 },
                { name: "Python", level: 80 },
                { name: "AWS", level: 75 }
              ].map((skill, index) => (
                <div key={index} className="border-4 border-primary rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold uppercase tracking-wide">{skill.name}</span>
                    <span className="text-sm font-black">{skill.level}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill bg-feature-blue" style={{width: `${skill.level}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn-outline mt-4">
              <User className="w-4 h-4 mr-2" />
              Add New Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
