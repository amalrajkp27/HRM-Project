const { Octokit } = require('octokit');
const aiService = require('./aiService');

// Initialize GitHub API client
const getOctokit = () => {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    throw new Error('GITHUB_PERSONAL_ACCESS_TOKEN not found in environment variables');
  }
  return new Octokit({ auth: token });
};

/**
 * Search GitHub for candidates based on job requirements
 */
const searchGitHubCandidates = async (jobDetails) => {
  try {
    console.log('🔍 ===== GITHUB CANDIDATE SEARCH =====');
    console.log('📋 Job:', jobDetails.jobTitle);
    console.log('📍 Location:', jobDetails.location);
    console.log('🛠️  Skills:', jobDetails.skills);

    const octokit = getOctokit();

    // Parse skills (expecting comma-separated string)
    const skillsArray = jobDetails.skills
      ? jobDetails.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    // Build GitHub search query
    // Example: "location:Hyderabad language:TypeScript language:JavaScript"
    let query = '';
    
    // Add location
    if (jobDetails.location) {
      query += `location:${jobDetails.location} `;
    }
    
    // Add skills as languages/keywords (limit to top 3 for better results)
    skillsArray.slice(0, 3).forEach(skill => {
      // Clean skill name for GitHub query
      const cleanSkill = skill.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      if (cleanSkill) {
        query += `${cleanSkill} `;
      }
    });

    // If query is empty, use job title
    if (!query.trim()) {
      query = jobDetails.jobTitle || 'developer';
    }

    console.log('🔎 GitHub Query:', query.trim());

    // Search users on GitHub
    const searchResponse = await octokit.rest.search.users({
      q: query.trim(),
      per_page: 30, // Fetch up to 30 users
      sort: 'followers', // Sort by most followed (indicates active developers)
      order: 'desc'
    });

    console.log(`✅ Found ${searchResponse.data.items.length} GitHub users`);

    if (searchResponse.data.items.length === 0) {
      console.log('⚠️  No candidates found on GitHub with current search criteria');
      return [];
    }

    // Fetch detailed information for each user
    const candidates = [];
    
    for (const user of searchResponse.data.items.slice(0, 20)) { // Limit to 20 for MVP
      try {
        console.log(`📥 Fetching details for: ${user.login}`);

        // Get user details
        const userDetails = await octokit.rest.users.getByUsername({
          username: user.login
        });

        // Get user's repositories to extract skills
        const repos = await octokit.rest.repos.listForUser({
          username: user.login,
          per_page: 10,
          sort: 'updated',
          direction: 'desc'
        });

        // Extract languages from repos
        const languages = new Set();
        for (const repo of repos.data) {
          if (repo.language) {
            languages.add(repo.language);
          }
        }

        // Create candidate object
        const candidate = {
          source: 'github',
          sourceId: user.login,
          sourceUrl: userDetails.data.html_url,
          
          name: userDetails.data.name || user.login,
          email: userDetails.data.email || null,
          location: userDetails.data.location || null,
          bio: userDetails.data.bio || null,
          
          currentCompany: userDetails.data.company || null,
          skills: Array.from(languages),
          
          githubUrl: userDetails.data.html_url,
          portfolioUrl: userDetails.data.blog || null,
          
          githubStats: {
            publicRepos: userDetails.data.public_repos,
            followers: userDetails.data.followers,
            contributions: repos.data.length, // Approximate
            topLanguages: Array.from(languages).slice(0, 5)
          }
        };

        candidates.push(candidate);
        console.log(`✅ Added: ${candidate.name} (${candidate.skills.join(', ')})`);

      } catch (error) {
        console.error(`❌ Error fetching details for ${user.login}:`, error.message);
        continue;
      }
    }

    console.log(`✅ Successfully extracted ${candidates.length} candidate profiles`);
    console.log('=====================================');
    return candidates;

  } catch (error) {
    console.error('❌ GitHub search error:', error);
    if (error.status === 401) {
      throw new Error('GitHub authentication failed. Please check your GITHUB_PERSONAL_ACCESS_TOKEN.');
    } else if (error.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`GitHub API error: ${error.message}`);
  }
};

/**
 * Score candidates using AI
 */
const scoreCandidatesWithAI = async (candidates, jobDetails) => {
  try {
    console.log('🤖 ===== AI CANDIDATE SCORING =====');
    console.log(`📊 Scoring ${candidates.length} candidates...`);
    
    const scoredCandidates = [];

    for (const candidate of candidates) {
      try {
        // Build prompt for AI
        const prompt = `You are an expert recruiter. Analyze how well this candidate matches the job requirements.

JOB REQUIREMENTS:
- Position: ${jobDetails.jobTitle}
- Location: ${jobDetails.location || 'Any'}
- Required Skills: ${jobDetails.skills}
- Experience Level: ${jobDetails.experienceLevel || 'Any'}
- Description: ${jobDetails.jobDescription || 'N/A'}

CANDIDATE PROFILE:
- Name: ${candidate.name}
- Location: ${candidate.location || 'Not specified'}
- Skills: ${candidate.skills.join(', ') || 'None listed'}
- Bio: ${candidate.bio || 'Not specified'}
- Company: ${candidate.currentCompany || 'Not specified'}
- GitHub Stats: ${candidate.githubStats.publicRepos} repos, ${candidate.githubStats.followers} followers

TASK:
Provide a JSON response with:
1. "score": A number from 0-100 indicating match quality (be realistic - most candidates score 60-80)
2. "matchAnalysis": A 2-3 sentence explanation of why this candidate is or isn't a good match
3. "strengths": Array of 2-3 key strengths that match the job
4. "concerns": Array of 1-2 potential concerns or gaps (can be empty if excellent match)

Return ONLY valid JSON, no other text.`;

        // Call AI
        const aiResponse = await aiService.callAI(prompt);
        
        // Parse AI response
        let analysis;
        try {
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (parseError) {
          console.error('❌ AI response parsing error:', parseError);
          // Fallback scoring based on skills match
          const skillsMatch = candidate.skills.some(skill => 
            jobDetails.skills.toLowerCase().includes(skill.toLowerCase())
          );
          analysis = {
            score: skillsMatch ? 60 : 40,
            matchAnalysis: 'Basic profile match. Manual review recommended.',
            strengths: candidate.skills.slice(0, 2).map(s => `Experience with ${s}`),
            concerns: ['Requires detailed review']
          };
        }

        // Add AI analysis to candidate
        scoredCandidates.push({
          ...candidate,
          aiScore: Math.min(100, Math.max(0, analysis.score || 50)),
          matchAnalysis: analysis.matchAnalysis || 'No analysis available',
          strengths: analysis.strengths || [],
          concerns: analysis.concerns || []
        });

        console.log(`✅ ${candidate.name}: ${analysis.score}/100`);

      } catch (error) {
        console.error(`❌ Error scoring ${candidate.name}:`, error.message);
        // Add with default score
        scoredCandidates.push({
          ...candidate,
          aiScore: 50,
          matchAnalysis: 'Manual review required - AI scoring unavailable',
          strengths: candidate.skills.slice(0, 2).map(s => `Knowledge of ${s}`),
          concerns: ['AI analysis unavailable']
        });
      }
    }

    // Sort by score (highest first)
    scoredCandidates.sort((a, b) => b.aiScore - a.aiScore);

    console.log('✅ All candidates scored and sorted');
    console.log('Top 3 scores:', scoredCandidates.slice(0, 3).map(c => `${c.name}: ${c.aiScore}`).join(', '));
    console.log('=====================================');
    
    return scoredCandidates;

  } catch (error) {
    console.error('❌ AI scoring error:', error);
    // Return candidates without AI scores as fallback
    return candidates.map(c => ({
      ...c,
      aiScore: 50,
      matchAnalysis: 'AI scoring temporarily unavailable',
      strengths: c.skills.slice(0, 2),
      concerns: []
    }));
  }
};

module.exports = {
  searchGitHubCandidates,
  scoreCandidatesWithAI
};

