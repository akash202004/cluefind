import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, githubData } = await request.json();

    if (!resumeContent || !githubData) {
      return NextResponse.json(
        { error: "Resume content and GitHub data are required" },
        { status: 400 }
      );
    }

    // Generate AI-powered profile content
    const profileSummary = await aiService.generateProfileSummary({
      resume: resumeContent,
      github: githubData
    });

    // Extract skills from resume and GitHub data
    const skills = extractSkills(resumeContent, githubData.topLanguages);
    
    // Generate project descriptions from GitHub repos
    const projectDescriptions = await Promise.all(
      githubData.repositories.slice(0, 5).map(async (repo: any) => {
        const description = await aiService.generateProjectDescription({
          title: repo.name,
          description: repo.description,
          technologies: [repo.language].filter(Boolean),
          url: repo.url
        });
        return {
          ...repo,
          aiDescription: description
        };
      })
    );

    // Generate skill recommendations
    const skillRecommendations = await aiService.generateSkillRecommendations({
      currentSkills: skills,
      githubLanguages: githubData.topLanguages,
      experience: githubData.stats.accountAge
    });

    return NextResponse.json({
      profileSummary,
      skills,
      projects: projectDescriptions,
      skillRecommendations,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error generating profile:", error);
    return NextResponse.json(
      { error: "Failed to generate profile" },
      { status: 500 }
    );
  }
}

function extractSkills(resumeContent: string, githubLanguages: string[]): string[] {
  // Simple skill extraction - in production, you'd want more sophisticated parsing
  const commonSkills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'GraphQL', 'REST', 'HTML', 'CSS',
    'Tailwind CSS', 'Bootstrap', 'SASS', 'Webpack', 'Vite'
  ];

  const extractedSkills: string[] = [];
  
  // Extract skills from resume content
  commonSkills.forEach(skill => {
    if (resumeContent.toLowerCase().includes(skill.toLowerCase())) {
      extractedSkills.push(skill);
    }
  });

  // Add GitHub languages
  githubLanguages.forEach(lang => {
    if (!extractedSkills.includes(lang)) {
      extractedSkills.push(lang);
    }
  });

  return [...new Set(extractedSkills)]; // Remove duplicates
}
