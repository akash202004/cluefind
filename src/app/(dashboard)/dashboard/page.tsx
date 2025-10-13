"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [resumeContent, setResumeContent] = useState("");
  const [githubId, setGithubId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [active, setActive] = useState<
    "overview" | "edit-profile" | "resume" | "github" | "skills" | "projects" | "social" | "ai"
  >("overview");
  const [fading, setFading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/get-started");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    const applyHash = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash === "#edit-profile") setActive("edit-profile");
      else if (hash === "#resume") setActive("resume");
      else if (hash === "#github") setActive("github");
      else if (hash === "#skills") setActive("skills");
      else if (hash === "#projects") setActive("projects");
      else if (hash === "#social") setActive("social");
      else if (hash === "#ai") setActive("ai");
      else setActive("overview");
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    setFading(true);
    const t = setTimeout(() => setFading(false), 150);
    return () => clearTimeout(t);
  }, [active]);

  const resolveProfileId = async (): Promise<string> => {
    const resp = await fetch("/api/users/" + user!.googleId, { method: "GET" });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.error || "Failed to fetch user");
    return json.data.profile.id;
  };

  // Load existing profile data for parent-managed fields
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const profileId = await resolveProfileId();
        const resp = await fetch(`/api/profiles/${profileId}`);
        const json = await resp.json();
        if (!resp.ok) throw new Error(json.error || "Failed to load profile");
        setResumeContent(json.data.resumeContent || "");
        setGithubId(json.data.githubId || "");
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveResume = async () => {
    if (!resumeContent.trim()) return;
    setSubmitting(true);
    try {
      const profileId = await resolveProfileId();
      const saveResp = await fetch(`/api/profiles/${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeContent }),
      });
      const saveData = await saveResp.json();
      if (!saveResp.ok) throw new Error(saveData.error || "Failed to save");
      toast.success("Resume content saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save resume");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveGithub = async () => {
    if (!githubId.trim()) return;
    setSubmitting(true);
    try {
      const profileId = await resolveProfileId();
      const saveResp = await fetch(`/api/profiles/${profileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubId }),
      });
      const saveData = await saveResp.json();
      if (!saveResp.ok) throw new Error(saveData.error || "Failed to save");
      toast.success("GitHub username saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save GitHub");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Page Header with unified submit */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section mb-1">Dashboard</h1>
          {active === "overview" && <p className="text-subtitle">Overview</p>}
          {active === "edit-profile" && <InlineEditProfile />}
          {active === "resume" && (
            <p className="text-subtitle">Add Resume Content</p>
          )}
          {active === "github" && <p className="text-subtitle">Connect GitHub</p>}
          {active === "skills" && <p className="text-subtitle">Skills</p>}
          {active === "projects" && (
            <p className="text-subtitle">Projects Show Off</p>
          )}
          {active === "social" && <p className="text-subtitle">Social Links</p>}
          {active === "ai" && <p className="text-subtitle">AI Review</p>}
        </div>
      </div>

      {/* Main panel - one component at a time, with fade */}
      <div className={`transition-opacity duration-150 ${fading ? "opacity-0" : "opacity-100"}`}>
        {active === "overview" && <OverviewPanel />}
        {active === "resume" && (
          <ResumePanel
            resumeContent={resumeContent}
            setResumeContent={setResumeContent}
            onSave={handleSaveResume}
            submitting={submitting}
          />
        )}
        {active === "github" && (
          <GithubPanel 
            githubId={githubId} 
            setGithubId={setGithubId}
            onSave={handleSaveGithub}
            submitting={submitting}
          />
        )}
        {active === "skills" && <SkillsPanel resolveProfileId={resolveProfileId} />}
        {active === "projects" && <ProjectsPanel resolveProfileId={resolveProfileId} />}
        {active === "social" && <SocialLinksPanel resolveProfileId={resolveProfileId} />}
        {active === "ai" && <AIReviewPanel />}
      </div>
    </div>
  );
}

function OverviewPanel() {
  return (
    <div className="space-y-6">
      <div className="card-brutalist">
        <h2 className="text-xl font-black uppercase tracking-wide mb-4">
          Dashboard Overview
        </h2>
        <p className="text-body mb-6">
          Complete your profile by filling out each section. Use the left sidebar to navigate between sections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-brutalist">
          <h3 className="text-lg font-black uppercase tracking-wide mb-3">
            Add Resume Content
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Paste your resume text content here. This will be stored in your profile.
          </p>
          <a href="#resume" className="btn-outline text-sm">
            Go to Resume Form
          </a>
        </div>

        <div className="card-brutalist">
          <h3 className="text-lg font-black uppercase tracking-wide mb-3">
            Connect GitHub
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your GitHub username to showcase your repositories.
          </p>
          <a href="#github" className="btn-outline text-sm">
            Go to GitHub Form
          </a>
        </div>

        <div className="card-brutalist">
          <h3 className="text-lg font-black uppercase tracking-wide mb-3">
            Skills
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your technical skills and expertise areas.
          </p>
          <a href="#skills" className="btn-outline text-sm">
            Go to Skills Form
          </a>
        </div>

        <div className="card-brutalist">
          <h3 className="text-lg font-black uppercase tracking-wide mb-3">
            Projects Show Off
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Showcase your best projects and work samples.
          </p>
          <a href="#projects" className="btn-outline text-sm">
            Go to Projects Form
          </a>
        </div>

        <div className="card-brutalist">
          <h3 className="text-lg font-black uppercase tracking-wide mb-3">
            Social Links
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your social media profiles and professional links.
          </p>
          <a href="#social" className="btn-outline text-sm">
            Go to Social Links Form
          </a>
        </div>

        <div className="card-brutalist">
          <h3 className="text-lg font-black uppercase tracking-wide mb-3">
            AI Review
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get AI-powered feedback on your profile and portfolio.
          </p>
          <a href="#ai" className="btn-outline text-sm">
            Go to AI Review
          </a>
        </div>
      </div>
    </div>
  );
}

function ResumePanel({
  resumeContent,
  setResumeContent,
  onSave,
  submitting,
}: {
  resumeContent: string;
  setResumeContent: (v: string) => void;
  onSave: () => void;
  submitting: boolean;
}) {
  return (
    <div className="card-brutalist">
      <h3 className="text-lg font-black uppercase tracking-wide mb-4">
        Resume Content
      </h3>
      <div className="space-y-4">
        <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
          Paste your resume text
        </label>
        <textarea
          value={resumeContent}
          onChange={(e) => setResumeContent(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={12}
          className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <p className="text-sm text-muted-foreground">
          We store this text directly in Neon.
        </p>
        <button
          onClick={onSave}
          disabled={!resumeContent.trim() || submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save Resume Content"}
        </button>
      </div>
    </div>
  );
}

function GithubPanel({
  githubId,
  setGithubId,
  onSave,
  submitting,
}: {
  githubId: string;
  setGithubId: (v: string) => void;
  onSave: () => void;
  submitting: boolean;
}) {
  return (
    <div className="card-brutalist">
      <h3 className="text-lg font-black uppercase tracking-wide mb-4">
        GitHub Username
      </h3>
      <div className="space-y-4">
        <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
          Enter your GitHub handle
        </label>
        <input
          type="text"
          placeholder="your-github-username"
          value={githubId}
          onChange={(e) => setGithubId(e.target.value)}
          className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
        />
        <button
          onClick={onSave}
          disabled={!githubId.trim() || submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save GitHub Username"}
        </button>
      </div>
    </div>
  );
}

function SkillsPanel({ resolveProfileId }: { resolveProfileId: () => Promise<string> }) {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profileId = await resolveProfileId();
        const resp = await fetch(`/api/profiles/${profileId}`);
        const json = await resp.json();
        if (resp.ok) {
          setSkills(json.data.skills || []);
        }
      } catch (_) {}
    };
    load();
  }, [resolveProfileId]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSaveSkills = async () => {
    if (skills.length === 0) return;
    setSubmitting(true);
    try {
      const profileId = await resolveProfileId();
      const saveResp = await fetch(`/api/profiles/${profileId}/skills`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      const saveData = await saveResp.json();
      if (!saveResp.ok) throw new Error(saveData.error || "Failed to save");
      toast.success("Skills saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save skills");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-brutalist">
      <h3 className="text-lg font-black uppercase tracking-wide mb-4">
        Skills
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
            Add New Skill
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., React, Python, AWS"
              className="flex-1 px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button onClick={addSkill} className="btn-primary">
              Add
            </button>
          </div>
        </div>
        
        {skills.length > 0 && (
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
              Your Skills ({skills.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-lg flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-primary-foreground hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={handleSaveSkills}
          disabled={skills.length === 0 || submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save Skills"}
        </button>
      </div>
    </div>
  );
}

function ProjectsPanel({ resolveProfileId }: { resolveProfileId: () => Promise<string> }) {
  const [projects, setProjects] = useState<Array<{title: string, description: string, url: string}>>([]);
  const [newProject, setNewProject] = useState({title: "", description: "", url: ""});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profileId = await resolveProfileId();
        const resp = await fetch(`/api/profiles/${profileId}`);
        const json = await resp.json();
        if (resp.ok && Array.isArray(json.data.projects)) {
          setProjects(json.data.projects);
        }
      } catch (_) {}
    };
    load();
  }, [resolveProfileId]);

  const addProject = () => {
    if (newProject.title.trim() && newProject.description.trim()) {
      setProjects([...projects, {...newProject}]);
      setNewProject({title: "", description: "", url: ""});
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSaveProjects = async () => {
    if (projects.length === 0) return;
    setSubmitting(true);
    try {
      const profileId = await resolveProfileId();
      const saveResp = await fetch(`/api/profiles/${profileId}/projects`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      const saveData = await saveResp.json();
      if (!saveResp.ok) throw new Error(saveData.error || "Failed to save");
      toast.success("Projects saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save projects");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-brutalist">
      <h3 className="text-lg font-black uppercase tracking-wide mb-4">
        Projects Show Off
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              placeholder="My Awesome Project"
              className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
              Project URL
            </label>
            <input
              type="url"
              value={newProject.url}
              onChange={(e) => setNewProject({...newProject, url: e.target.value})}
              placeholder="https://github.com/username/project"
              className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
            Description
          </label>
          <textarea
            value={newProject.description}
            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
            placeholder="Describe your project..."
            rows={3}
            className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        <button onClick={addProject} className="btn-primary">
          Add Project
        </button>
        
        {projects.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wide text-foreground">
              Your Projects ({projects.length})
            </label>
            {projects.map((project, index) => (
              <div key={index} className="border-4 border-primary rounded-lg p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{project.title}</h4>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm">
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={handleSaveProjects}
          disabled={projects.length === 0 || submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save Projects"}
        </button>
      </div>
    </div>
  );
}

function SocialLinksPanel({ resolveProfileId }: { resolveProfileId: () => Promise<string> }) {
  const [links, setLinks] = useState<Array<{platform: string, url: string}>>([]);
  const [newLink, setNewLink] = useState({platform: "", url: ""});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const profileId = await resolveProfileId();
        const resp = await fetch(`/api/profiles/${profileId}`);
        const json = await resp.json();
        if (resp.ok && Array.isArray(json.data.socialLinks)) {
          setLinks(json.data.socialLinks);
        }
      } catch (_) {}
    };
    load();
  }, [resolveProfileId]);

  const platforms = ["LinkedIn", "Twitter", "Instagram", "Portfolio", "Blog", "Other"];

  const addLink = () => {
    if (newLink.platform && newLink.url) {
      setLinks([...links, {...newLink}]);
      setNewLink({platform: "", url: ""});
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSaveSocialLinks = async () => {
    if (links.length === 0) return;
    setSubmitting(true);
    try {
      const profileId = await resolveProfileId();
      const saveResp = await fetch(`/api/profiles/${profileId}/social-links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socialLinks: links }),
      });
      const saveData = await saveResp.json();
      if (!saveResp.ok) throw new Error(saveData.error || "Failed to save");
      toast.success("Social links saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save social links");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-brutalist">
      <h3 className="text-lg font-black uppercase tracking-wide mb-4">
        Social Links
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
              Platform
            </label>
            <select
              value={newLink.platform}
              onChange={(e) => setNewLink({...newLink, platform: e.target.value})}
              className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground"
            >
              <option value="">Select Platform</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">
              URL
            </label>
            <input
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({...newLink, url: e.target.value})}
              placeholder="https://..."
              className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        
        <button onClick={addLink} className="btn-primary">
          Add Link
        </button>
        
        {links.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-bold uppercase tracking-wide text-foreground">
              Your Social Links ({links.length})
            </label>
            {links.map((link, index) => (
              <div key={index} className="border-4 border-primary rounded-lg p-4 bg-muted/30 flex justify-between items-center">
                <div>
                  <span className="font-bold">{link.platform}</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-2">
                    {link.url}
                  </a>
                </div>
                <button
                  onClick={() => removeLink(index)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={handleSaveSocialLinks}
          disabled={links.length === 0 || submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save Social Links"}
        </button>
      </div>
    </div>
  );
}

function AIReviewPanel() {
  return (
    <div className="card-brutalist">
      <h3 className="text-lg font-black uppercase tracking-wide mb-4">
        AI Review
      </h3>
      <p className="text-body mb-6">
        Get AI-powered feedback on your profile and portfolio. This feature will analyze your content and provide suggestions for improvement.
      </p>
      <div className="bg-muted/30 border-4 border-primary rounded-lg p-6 text-center">
        <p className="text-muted-foreground mb-4">
          AI Review feature coming soon...
        </p>
        <button className="btn-outline" disabled>
          Generate AI Review
        </button>
      </div>
    </div>
  );
}

function InlineEditProfile() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.googleId) return;
      try {
        const resp = await fetch(`/api/users/${user.googleId}`);
        const json = await resp.json();
        if (resp.ok) {
          setBio(json.data.bio || "");
          setImageUrl(json.data.image || undefined);
        }
      } catch (_) {}
    };
    load();
  }, [user?.googleId]);

  const handleUpload = async (file: File) => {
    const form = new FormData();
    form.append("image", file);
    if (user?.id) form.append("userId", user.id);
    const resp = await fetch("/api/upload/profile-image", { method: "POST", body: form });
    const json = await resp.json();
    if (!resp.ok) throw new Error(json.error || "Upload failed");
    setImageUrl(json.imageUrl);
  };

  const handleSave = async () => {
    if (!user?.googleId) return;
    setSaving(true);
    try {
      const resp = await fetch(`/api/users/${user.googleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: bio || undefined, image: imageUrl ?? null }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || "Save failed");
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-brutalist">
      <h3 className="text-lg font-black uppercase tracking-wide mb-4">Edit Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-32 h-32 bg-accent rounded-full border-4 border-primary shadow-brutalist-lg mx-auto mb-4 overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <label className="btn-outline cursor-pointer">
            Upload New Photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
          </label>
        </div>
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide text-foreground mb-2">Bio</label>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-3 border-4 border-primary rounded-lg bg-background text-foreground" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}
