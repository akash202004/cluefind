import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { aiService } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { profileImage, username, resumeContent, githubUsername } = await request.json();

    if (!profileImage || !username || !resumeContent || !githubUsername) {
      return NextResponse.json(
        { error: "All onboarding data is required" },
        { status: 400 }
      );
    }

    // Fetch GitHub data
    const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DevSync-App'
      }
    });

    if (!githubResponse.ok) {
      return NextResponse.json(
        { error: "Invalid GitHub username" },
        { status: 400 }
      );
    }

    const githubData = await githubResponse.json();

    // Generate AI profile content
    const profileSummary = await aiService.generateProfileSummary({
      resume: resumeContent,
      github: githubData
    });

    // Extract skills from resume
    const skills = extractSkillsFromResume(resumeContent);

    // Create user profile
    const user = await prisma.user.create({
      data: {
        username,
        image: profileImage,
        bio: profileSummary,
        githubUrl: githubData.html_url,
        name: githubData.name || username,
        email: `temp-${username}@devsync.com`, // Temporary email
        location: extractLocationFromResume(resumeContent),
      }
    });

    // Create skills
    await Promise.all(
      skills.map(skill => 
        prisma.skill.create({
          data: {
            name: skill,
            category: categorizeSkill(skill),
            level: "Intermediate", // Default level
            yearsOfExperience: 1, // Default experience
            userId: user.id
          }
        })
      )
    );

    // Generate initial AI review
    const aiReview = await aiService.generateBrutalReview({
      skills,
      githubData,
      resumeContent
    });

    await prisma.aIReview.create({
      data: {
        userId: user.id,
        reviewType: "initial",
        score: Math.floor(Math.random() * 3) + 7, // Random score 7-9
        feedback: aiReview,
        suggestions: [
          "Add more detailed project descriptions",
          "Include test coverage in your projects",
          "Optimize your GitHub profile README"
        ]
      }
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      username: user.username,
      message: "Onboarding completed successfully"
    });

  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

function extractSkillsFromResume(resumeContent: string): string[] {
  const commonSkills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'AWS', 'Docker',
    'Kubernetes', 'Git', 'GraphQL', 'REST', 'HTML', 'CSS',
    'Tailwind CSS', 'Bootstrap', 'SASS', 'Webpack', 'Vite'
  ];

  const extractedSkills: string[] = [];
  
  commonSkills.forEach(skill => {
    if (resumeContent.toLowerCase().includes(skill.toLowerCase())) {
      extractedSkills.push(skill);
    }
  });

  return [...new Set(extractedSkills)];
}

function extractLocationFromResume(resumeContent: string): string | null {
  // Simple location extraction
  const locationMatch = resumeContent.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/);
  return locationMatch ? locationMatch[0] : null;
}

function categorizeSkill(skill: string): string {
  const categories: { [key: string]: string[] } = {
    'Frontend': ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'SASS'],
    'Backend': ['Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET'],
    'Database': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
    'DevOps': ['AWS', 'Docker', 'Kubernetes'],
    'Tools': ['Git', 'Webpack', 'Vite']
  };

  for (const [category, skills] of Object.entries(categories)) {
    if (skills.includes(skill)) {
      return category;
    }
  }

  return 'Other';
}
