import Link from "next/link";
import { ArrowRight, Brain, Zap, Target, Calendar, TrendingUp, CheckCircle2 } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-4 border-primary rounded-lg font-bold uppercase text-sm tracking-wide shadow-brutalist-sm mb-6">
            <Zap className="w-5 h-5" />
            <span>How It Works</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            One Platform. Two Perspectives.
          </h1>
          <p className="text-subtitle max-w-2xl mx-auto">
            Whether you are a developer showcasing your craft or a recruiter
            discovering great talent, Cluefind brings clarity, credibility, and
            speed to the process.
          </p>
        </div>
      </section>

      {/* Features overview (implemented) */}
      <section className="bg-muted py-12 md:py-16 border-y-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard icon={<Target className="w-7 h-7 text-primary" />} title="Profile from GitHub" description="Connect GitHub and generate your developer profile with repos and data." />
            <FeatureCard icon={<Brain className="w-7 h-7 text-primary" />} title="AI Review" description="Get actionable feedback on your profile and projects with the AI reviewer." />
            <FeatureCard icon={<TrendingUp className="w-7 h-7 text-primary" />} title="Leaderboard" description="Discover top profiles and see who’s trending in the community." />
          </div>
        </div>
      </section>

      {/* For Developers */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-section mb-3">For Developers</h2>
              <p className="text-body mb-6 max-w-xl">
                Turn your experience into a compelling narrative. Show real projects, real
                impact, and real endorsements—optimized for credibility.
              </p>

              <ol className="space-y-4">
                <StepItem number={1} title="Connect GitHub" description="Import your repos and base profile details to kickstart your page." />
                <StepItem number={2} title="Generate and edit profile" description="We create a starting profile; you can refine bio, skills, and links." />
                <StepItem number={3} title="Add projects and details" description="Attach selected repos or projects and add concise context and outcomes." />
                <StepItem number={4} title="Run AI review" description="Use the AI reviewer to improve clarity, structure, and impact." />
                <StepItem number={5} title="Upload media (optional)" description="Add a profile image and resume to round out your presence." />
                <StepItem number={6} title="Share your profile" description="Your profile is live at your username URL for easy sharing." />
              </ol>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/get-started" className="btn-primary inline-flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/leaderboard" className="btn-secondary inline-flex items-center gap-2">
                  Explore Community
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <HighlightCard icon={<TrendingUp className="w-6 h-6" />} title="Project showcases" subtitle="Highlight what matters from your repos/projects." items={[
                "Link repos and add context",
                "Live demo and repo links",
                "Tech stack and role",
              ]} />
              <HighlightCard icon={<Brain className="w-6 h-6" />} title="AI portfolio review" subtitle="Actionable suggestions, not vague scores." items={[
                "Clarity and structure feedback",
                "Impact and outcomes suggestions",
                "Tone and brevity guidance",
              ]} />
            </div>
          </div>
        </div>
      </section>

      {/* For Recruiters */}
      <section className="bg-muted py-16 md:py-20 border-t-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
            <div className="order-2 lg:order-1 grid gap-4">
              <HighlightCard icon={<Target className="w-6 h-6" />} title="Skimmable profiles" subtitle="Straight to projects and impact." items={[
                "Project overviews and links",
                "Tech stack visibility",
                "Public profile URLs",
              ]} />
              <HighlightCard icon={<Calendar className="w-6 h-6" />} title="Review faster" subtitle="Consistent structure across profiles." items={[
                "Quick project summaries",
                "GitHub activity and repos",
                "Minimal fluff design",
              ]} />
              <HighlightCard icon={<Zap className="w-6 h-6" />} title="Browse talent" subtitle="Use the leaderboard to discover profiles." items={[
                "Leaderboard discovery",
                "Open profiles in new tabs",
                "Share with hiring team",
              ]} />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-section mb-3">For Recruiters</h2>
              <p className="text-body mb-6 max-w-xl">
                Evaluate real engineering skill quickly. Review projects, repos, and
                GitHub-linked activity to make confident decisions.
              </p>

              <ol className="space-y-4">
                <StepItem number={1} title="Browse the leaderboard" description="Find active and notable profiles to start your search." />
                <StepItem number={2} title="Open a public profile" description="Skim projects, tech stack, and linked repos in one place." />
                <StepItem number={3} title="Check GitHub activity" description="Review recent activity and repo links connected to the profile." />
                <StepItem number={4} title="Share with your team" description="Copy the profile URL to discuss candidates quickly." />
              </ol>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/get-started" className="btn-primary inline-flex items-center gap-2">
                  Start Hiring Faster
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/leaderboard" className="btn-secondary inline-flex items-center gap-2">
                  Browse Talent
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-card border-4 border-primary rounded-lg p-10 shadow-brutalist-lg">
            <h3 className="text-3xl md:text-4xl font-black mb-3">Ready to try Cluefind?</h3>
            <p className="text-subtitle mb-6">Create a profile in minutes and start collecting real signals.</p>
            <Link href="/get-started" className="btn-primary inline-flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="card-feature">
      <div className="icon-box-blue">
        {icon}
      </div>
      <h3 className="text-lg font-black uppercase mb-2">{title}</h3>
      <p className="text-body">{description}</p>
    </div>
  );
}

function StepItem({ number, title, description }: { number: number; title: string; description: string; }) {
  return (
    <li className="bg-card border-4 border-primary rounded-lg p-4 shadow-brutalist-sm">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent text-accent-foreground border-4 border-primary flex items-center justify-center font-black">
          {number}
        </div>
        <div>
          <div className="font-black uppercase mb-1">{title}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </li>
  );
}

function HighlightCard({ icon, title, subtitle, items }: { icon: React.ReactNode; title: string; subtitle: string; items: string[]; }) {
  return (
    <div className="bg-card border-4 border-primary rounded-lg p-5 shadow-brutalist">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-muted border-4 border-primary flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="font-black uppercase">{title}</div>
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


