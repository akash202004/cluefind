import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">DevSync</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
              How it Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Showcase Your
            <span className="text-blue-600 block">Developer Portfolio</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create a stunning portfolio, get verified skill endorsements from colleagues, 
            and let AI help optimize your professional presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signin">Start Building Your Portfolio</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Stand Out
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help developers showcase their skills and get recognized
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Builder</CardTitle>
              <CardDescription>
                Create stunning portfolio pages with drag-and-drop project showcases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Dynamic project galleries</li>
                <li>• Custom domain support</li>
                <li>• Mobile-responsive design</li>
                <li>• SEO optimization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Endorsements</CardTitle>
              <CardDescription>
                Get verified endorsements from colleagues who've worked with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AI-powered verification</li>
                <li>• Project-based endorsements</li>
                <li>• Credibility scoring</li>
                <li>• Social proof system</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Reviews</CardTitle>
              <CardDescription>
                Get brutally honest but constructive feedback on your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Portfolio optimization</li>
                <li>• Skill gap analysis</li>
                <li>• Career recommendations</li>
                <li>• Performance insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track your profile performance and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Profile view tracking</li>
                <li>• Endorsement analytics</li>
                <li>• Performance insights</li>
                <li>• Growth metrics</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Domains</CardTitle>
              <CardDescription>
                Use your own domain for a professional portfolio presence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Custom domain setup</li>
                <li>• SSL certificates</li>
                <li>• DNS management</li>
                <li>• Brand consistency</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Developer Community</CardTitle>
              <CardDescription>
                Connect with other developers and build your professional network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Skill-based discovery</li>
                <li>• Collaboration opportunities</li>
                <li>• Mentorship matching</li>
                <li>• Industry insights</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Developer Portfolio?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of developers who are already showcasing their skills and getting recognized
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signin">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <span className="text-xl font-bold">DevSync</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for developer portfolios and skill endorsements.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-white">Demo</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="https://github.com" className="hover:text-white">GitHub</Link></li>
                <li><Link href="https://linkedin.com" className="hover:text-white">LinkedIn</Link></li>
                <li><Link href="https://twitter.com" className="hover:text-white">Twitter</Link></li>
                <li><Link href="/discord" className="hover:text-white">Discord</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DevSync. All rights reserved.</p>
            <p className="mt-2">
              Built with ❤️ by{" "}
              <Link href="https://github.com/yourusername" className="hover:text-white">
                Your Name
              </Link>
              {" "}|
              <Link href="https://linkedin.com/in/yourprofile" className="hover:text-white ml-1">
                LinkedIn Profile
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}