import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
  async generateProfileSummary(userData: any): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Generate a professional 2-3 sentence summary for a developer based on their resume:
        
        Resume Content: ${userData.resume || 'Not provided'}
        
        Make it engaging and highlight key strengths.`
        }
      ],
      max_tokens: 150,
    });
    return completion.choices[0]?.message?.content || 'Professional developer with strong technical skills.';
  },

  async generateProjectDescription(projectData: any): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Create a compelling project description for:
        Title: ${projectData.title}
        Technologies: ${projectData.technologies?.join(', ') || 'Not specified'}
        Features: ${projectData.features?.join(', ') || 'Not specified'}
        
        Make it professional, highlight technical achievements, and explain the value.
        Keep it under 200 words.`
        }
      ],
      max_tokens: 200,
    });
    return completion.choices[0]?.message?.content || 'A well-designed project showcasing technical expertise.';
  },

  async generateSkillRecommendations(userProfile: any): Promise<string[]> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Based on this developer's profile:
        Current skills: ${userProfile.skills?.join(', ') || 'Not specified'}
        Experience level: ${userProfile.experience || 'Not specified'}
        Projects: ${userProfile.projects?.map((p: any) => p.technologies).flat().join(', ') || 'Not specified'}
        
        Recommend 5 new skills they should learn to advance their career.
        Consider current market trends and their existing skill set.
        Return only the skill names, one per line.`
        }
      ],
      max_tokens: 100,
    });
    
    const text = completion.choices[0]?.message?.content || '';
    return text.split('\n').filter(skill => skill.trim()).slice(0, 5);
  },

  async generateBrutalReview(userProfile: any): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `You are a brutally honest senior developer reviewing portfolios. 
        Be harsh but constructive. Roast them based on their actual data.
        
        User Profile:
        - Experience: ${userProfile.experience || 'Not specified'}
        - Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
        - Projects: ${userProfile.projects?.length || 0} projects
        - GitHub commits: ${userProfile.githubCommits || 'Not specified'}
        - Years of experience: ${userProfile.yearsExperience || 'Not specified'}
        
        Generate a brutally honest but helpful review. Be specific and use their actual data.`
        }
      ],
      temperature: 0.9,
      max_tokens: 300,
    });
    return completion.choices[0]?.message?.content || 'Your portfolio needs improvement. Focus on showcasing real projects and technical depth.';
  },

  async optimizeBlogPost(content: string): Promise<any> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Optimize this blog post for SEO and readability:
        
        ${content}
        
        Provide a JSON response with:
        1. seoDescription (150-160 chars)
        2. tags (array of 5 relevant tags)
        3. readabilityImprovements (array of suggestions)
        4. suggestedInternalLinks (array of 3-5 links)`
        }
      ],
      max_tokens: 400,
    });
    
    const text = completion.choices[0]?.message?.content || '';
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
