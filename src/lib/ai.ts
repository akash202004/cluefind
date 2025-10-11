import OpenAI from 'openai';
import { generateText } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
  async generateProfileSummary(userData: any): Promise<string> {
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `Generate a professional 2-3 sentence summary for a developer with:
        Skills: ${userData.skills?.join(', ') || 'Not specified'}
        Experience: ${userData.experience || 'Not specified'}
        Projects: ${userData.projects?.length || 0} projects
        Bio: ${userData.bio || 'Not provided'}
        
        Make it engaging and highlight key strengths.`,
      maxTokens: 150,
    });
    return text;
  },

  async generateProjectDescription(projectData: any): Promise<string> {
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `Create a compelling project description for:
        Title: ${projectData.title}
        Technologies: ${projectData.technologies?.join(', ') || 'Not specified'}
        Features: ${projectData.features?.join(', ') || 'Not specified'}
        
        Make it professional, highlight technical achievements, and explain the value.
        Keep it under 200 words.`,
      maxTokens: 200,
    });
    return text;
  },

  async generateSkillRecommendations(userProfile: any): Promise<string[]> {
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `Based on this developer's profile:
        Current skills: ${userProfile.skills?.join(', ') || 'Not specified'}
        Experience level: ${userProfile.experience || 'Not specified'}
        Projects: ${userProfile.projects?.map((p: any) => p.technologies).flat().join(', ') || 'Not specified'}
        
        Recommend 5 new skills they should learn to advance their career.
        Consider current market trends and their existing skill set.
        Return only the skill names, one per line.`,
      maxTokens: 100,
    });
    
    return text.split('\n').filter(skill => skill.trim()).slice(0, 5);
  },

  async generateBrutalReview(userProfile: any): Promise<string> {
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `You are a brutally honest senior developer reviewing portfolios. 
        Be harsh but constructive. Roast them based on their actual data.
        
        User Profile:
        - Experience: ${userProfile.experience || 'Not specified'}
        - Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
        - Projects: ${userProfile.projects?.length || 0} projects
        - GitHub commits: ${userProfile.githubCommits || 'Not specified'}
        - Years of experience: ${userProfile.yearsExperience || 'Not specified'}
        
        Generate a brutally honest but helpful review. Be specific and use their actual data.`,
      temperature: 0.9,
      maxTokens: 300,
    });
    return text;
  },

  async optimizeBlogPost(content: string): Promise<any> {
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `Optimize this blog post for SEO and readability:
        
        ${content}
        
        Provide a JSON response with:
        1. seoDescription (150-160 chars)
        2. tags (array of 5 relevant tags)
        3. readabilityImprovements (array of suggestions)
        4. suggestedInternalLinks (array of 3-5 links)`,
      maxTokens: 400,
    });
    
    try {
      return JSON.parse(text);
    } catch {
      return {
        seoDescription: content.substring(0, 160),
        tags: ['development', 'programming', 'tech'],
        readabilityImprovements: ['Improve readability'],
        suggestedInternalLinks: []
      };
    }
  },
};
