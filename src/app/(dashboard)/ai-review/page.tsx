import { Brain, Sparkles, AlertTriangle, CheckCircle, Clock, Star } from "lucide-react";

export default function AIReviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section mb-2">AI Portfolio Review</h1>
          <p className="text-subtitle">Get brutally honest feedback on your portfolio</p>
        </div>
        <button className="btn-primary">
          <Brain className="w-4 h-4 mr-2" />
          Generate New Review
        </button>
      </div>

      {/* Review Status */}
      <div className="card-brutalist">
        <div className="flex items-center gap-4 mb-6">
          <div className="icon-box-purple">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wide">Current Review Status</h2>
            <p className="text-subtitle">Last updated 2 days ago</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border-4 border-primary rounded-lg bg-muted/50">
            <div className="text-3xl font-black text-feature-green mb-2">8.5</div>
            <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Overall Score</div>
          </div>
          <div className="text-center p-4 border-4 border-primary rounded-lg bg-muted/50">
            <div className="text-3xl font-black text-feature-blue mb-2">12</div>
            <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Recommendations</div>
          </div>
          <div className="text-center p-4 border-4 border-primary rounded-lg bg-muted/50">
            <div className="text-3xl font-black text-feature-yellow mb-2">3</div>
            <div className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Critical Issues</div>
          </div>
        </div>
      </div>

      {/* Review Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="card-brutalist">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-box-green">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-wide">Strengths</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                title: "Clean Code Architecture",
                description: "Your projects demonstrate excellent code organization and follow best practices.",
                impact: "High"
              },
              {
                title: "Modern Tech Stack",
                description: "You're using current technologies that employers value highly.",
                impact: "High"
              },
              {
                title: "Good Documentation",
                description: "Your README files are comprehensive and well-written.",
                impact: "Medium"
              }
            ].map((strength, index) => (
              <div key={index} className="border-2 border-feature-green rounded-lg p-4 bg-feature-green/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-lg uppercase tracking-wide">{strength.title}</h3>
                  <span className="px-2 py-1 bg-feature-green text-primary-foreground text-xs font-bold uppercase tracking-wide rounded">
                    {strength.impact}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{strength.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="card-brutalist">
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-box-red">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-wide">Areas for Improvement</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                title: "Missing Test Coverage",
                description: "Your projects lack comprehensive test suites, which is crucial for production code.",
                impact: "Critical",
                priority: "High"
              },
              {
                title: "Performance Optimization",
                description: "Some components could benefit from better performance optimization techniques.",
                impact: "Medium",
                priority: "Medium"
              },
              {
                title: "Accessibility Issues",
                description: "Your UI components need better accessibility features for inclusive design.",
                impact: "Medium",
                priority: "High"
              }
            ].map((improvement, index) => (
              <div key={index} className="border-2 border-feature-red rounded-lg p-4 bg-feature-red/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-lg uppercase tracking-wide">{improvement.title}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wide rounded ${
                      improvement.priority === 'High' ? 'bg-feature-red text-primary-foreground' :
                      improvement.priority === 'Medium' ? 'bg-feature-yellow text-primary' :
                      'bg-feature-green text-primary-foreground'
                    }`}>
                      {improvement.priority}
                    </span>
                    <span className="px-2 py-1 bg-feature-red text-primary-foreground text-xs font-bold uppercase tracking-wide rounded">
                      {improvement.impact}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{improvement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Recommendations */}
      <div className="card-brutalist">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-box-blue">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wide">Detailed Recommendations</h2>
        </div>
        
        <div className="space-y-6">
          {[
            {
              category: "Testing",
              recommendations: [
                "Add unit tests for all utility functions",
                "Implement integration tests for API endpoints",
                "Set up end-to-end testing with Playwright",
                "Achieve at least 80% code coverage"
              ]
            },
            {
              category: "Performance",
              recommendations: [
                "Implement code splitting for better loading times",
                "Add image optimization for better Core Web Vitals",
                "Use React.memo for expensive components",
                "Implement proper caching strategies"
              ]
            },
            {
              category: "Accessibility",
              recommendations: [
                "Add proper ARIA labels to all interactive elements",
                "Ensure keyboard navigation works correctly",
                "Implement proper focus management",
                "Test with screen readers"
              ]
            }
          ].map((section, index) => (
            <div key={index} className="border-4 border-primary rounded-lg p-6 bg-muted/30">
              <h3 className="text-lg font-black uppercase tracking-wide mb-4">{section.category}</h3>
              <ul className="space-y-2">
                {section.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="card-brutalist">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-box-yellow">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wide">30-Day Action Plan</h2>
        </div>
        
        <div className="space-y-4">
          {[
            {
              week: "Week 1",
              tasks: ["Set up testing framework", "Write tests for 2 projects", "Fix critical accessibility issues"],
              status: "in-progress"
            },
            {
              week: "Week 2", 
              tasks: ["Implement performance optimizations", "Add proper error handling", "Update documentation"],
              status: "pending"
            },
            {
              week: "Week 3",
              tasks: ["Complete test coverage", "Optimize images and assets", "Add monitoring"],
              status: "pending"
            },
            {
              week: "Week 4",
              tasks: ["Final review and polish", "Deploy improvements", "Schedule next review"],
              status: "pending"
            }
          ].map((week, index) => (
            <div key={index} className="border-4 border-primary rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-lg uppercase tracking-wide">{week.week}</h3>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded ${
                  week.status === 'in-progress' ? 'bg-feature-yellow text-primary' :
                  week.status === 'completed' ? 'bg-feature-green text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {week.status}
                </span>
              </div>
              <ul className="space-y-1">
                {week.tasks.map((task, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Generate New Review */}
      <div className="card-brutalist text-center">
        <div className="icon-box-purple mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-wide mb-4">Ready for Your Next Review?</h2>
        <p className="text-body mb-6 max-w-2xl mx-auto">
          Our AI analyzes your portfolio improvements and provides updated feedback based on your latest changes.
        </p>
        <button className="btn-primary">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate New AI Review
        </button>
      </div>
    </div>
  );
}
