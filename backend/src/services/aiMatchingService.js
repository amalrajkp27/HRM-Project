const axios = require('axios');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { cloudinary } = require('../config/cloudinary');

// Switch between Gemini and Ollama based on environment variable
const USE_OLLAMA = process.env.USE_OLLAMA === 'true' || process.env.OLLAMA_BASE_URL;

let genAI;

if (USE_OLLAMA) {
  console.log('🦙 AI Matching using Ollama AI');
  const { OllamaAI } = require('./ollamaService');
  genAI = new OllamaAI(process.env.OLLAMA_BASE_URL);
} else {
  console.log('🤖 AI Matching using Google Gemini AI');
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Download resume from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {Promise<Buffer>} Resume file buffer
 */
const downloadResume = async (url) => {
  try {
    // First attempt: Try direct download
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500 // Accept any status < 500
    });
    
    // If we get 401, try to generate a signed URL
    if (response.status === 401) {
      console.log('⚠️  401 error, attempting with signed URL...');
      
      // Extract public_id and version from URL
      // URL format: https://res.cloudinary.com/{cloud}/raw/upload/v{version}/{folder}/{file}.{ext}
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1 && urlParts.length > uploadIndex + 1) {
        // Get everything after "upload/" including version
        let pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
        
        // Extract version number
        const versionMatch = pathAfterUpload.match(/^v(\d+)\//);
        const version = versionMatch ? versionMatch[1] : null;
        
        // Remove the version number (vXXXXXXXXXX/) to get the path
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
        
        // Remove file extension to get public_id
        const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
        
        console.log('📝 Extracted public_id:', publicId);
        console.log('📝 Extracted version:', version);
        
        // Generate signed URL using Cloudinary SDK with the original version
        const signedUrl = cloudinary.url(publicId, {
          resource_type: 'raw',
          type: 'upload',
          sign_url: true,
          secure: true,
          version: version // Use the original version number
        });
        
        console.log('🔐 Trying signed URL:', signedUrl);
        const signedResponse = await axios.get(signedUrl, {
          responseType: 'arraybuffer',
          timeout: 30000
        });
        
        return Buffer.from(signedResponse.data);
      }
    }
    
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error downloading resume:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw new Error('Failed to download resume from Cloudinary');
  }
};

/**
 * Extract text from resume buffer
 * @param {Buffer} buffer - Resume file buffer
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Extracted text
 */
const extractResumeText = async (buffer, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    throw new Error('Unsupported file type');
  } catch (error) {
    console.error('Error extracting text:', error.message);
    throw new Error('Failed to extract text from resume');
  }
};

/**
 * Analyze candidate with Gemini AI
 * @param {Object} jobDetails - Job requirements and details
 * @param {string} resumeText - Candidate's resume text
 * @param {Object} candidateData - Candidate's basic info
 * @returns {Promise<Object>} AI analysis result
 */
const analyzeCandidate = async (jobDetails, resumeText, candidateData) => {
  try {
    // Get the AI model (Ollama or Gemini based on configuration)
    const modelName = USE_OLLAMA 
      ? (process.env.OLLAMA_MODEL || 'llama2')
      : 'gemini-2.0-flash-exp';
    
    const model = genAI.getGenerativeModel({ model: modelName });

    // Limit resume text to save tokens (first 3000 chars usually enough)
    const limitedResumeText = resumeText.substring(0, 3000);

    // Parse required skills from job details
    const requiredSkills = jobDetails.skills.split(',').map(s => s.trim().toLowerCase());
    
    const prompt = `You are an EXPERT technical recruiter with 15+ years of experience in talent acquisition. Your job is to perform a PRECISE, DATA-DRIVEN analysis of how well this candidate matches the job requirements.

=== JOB REQUIREMENTS ===
Position: ${jobDetails.jobTitle}
Experience Level Required: ${jobDetails.experienceLevel}
Required Skills: ${jobDetails.skills}
Must-Have Requirements:
${jobDetails.requirements}

Key Responsibilities:
${jobDetails.responsibilities}

=== CANDIDATE PROFILE ===
Name: ${candidateData.firstName} ${candidateData.lastName}
Current Company: ${candidateData.currentCompany || 'Not specified'}
Years of Experience: ${candidateData.yearsOfExperience || 'Not specified'}

=== CANDIDATE'S RESUME ===
${limitedResumeText}

=== ANALYSIS INSTRUCTIONS ===

**CRITICAL**: You MUST be STRICT and ACCURATE in your scoring. This is a PRODUCTION system used for real hiring decisions.

**SCORING METHODOLOGY** (Total: 100 points):

1. **SKILLS MATCH (50 points)**: 
   - Count EXACT matches of required skills in resume
   - Each required skill found = points proportional to total
   - Similar/related skills = partial credit
   - Missing critical skills = major deduction
   - Required skills: ${requiredSkills.join(', ')}

2. **EXPERIENCE LEVEL (25 points)**:
   - Required: ${jobDetails.experienceLevel}
   - Exact match = 25 points
   - 1-2 years difference = 15 points  
   - 3+ years difference = 5 points
   - Completely mismatched = 0 points

3. **REQUIREMENTS MATCH (15 points)**:
   - How many job requirements does candidate meet?
   - Each requirement met = proportional points

4. **ROLE RELEVANCE (10 points)**:
   - Is their experience directly relevant to this role?
   - Have they done similar work before?

**SCORING EXAMPLES**:
- 90-100%: Perfect match, all skills + experience + requirements met
- 75-89%: Strong match, most skills + experience aligned
- 60-74%: Good match, core skills present, some gaps
- 45-59%: Moderate match, significant gaps but potential
- 30-44%: Weak match, missing many requirements
- 0-29%: Poor match, not qualified for this role

**OUTPUT FORMAT** (Return ONLY valid JSON, no markdown, no extra text):

{
  "matchScore": <number 0-100, BE PRECISE>,
  "overallAssessment": "<1-2 sentences explaining the score>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "skillsMatched": ["<exact skill names from resume>"],
  "skillsMissing": ["<required skills NOT found in resume>"],
  "experienceMatch": "<Exceeds/Meets/Below> requirement",
  "keyHighlights": ["<specific achievement or project>", "<quantifiable result>"],
  "concerns": ["<specific gap or concern>"],
  "recommendation": "<Strong hire|Good fit|Consider with reservations|Not recommended>",
  "reasoning": "<2-3 sentences explaining WHY this score, citing specific evidence from resume>"
}

**IMPORTANT**: 
- Be HARSH if skills are missing
- A Flutter developer MUST have Flutter experience for 90%+ score
- Don't give high scores just to be nice
- Base EVERYTHING on actual resume content
- If you can't find a required skill, it's MISSING`;

    console.log(`\n🤖 Analyzing candidate: ${candidateData.firstName} ${candidateData.lastName}`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response (remove markdown if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const analysis = JSON.parse(cleanedText);

    console.log(`✅ Analysis complete: ${analysis.matchScore}% match`);

    return analysis;

  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    
    // Return fallback analysis if AI fails
    return {
      matchScore: 50,
      overallAssessment: 'Unable to perform detailed analysis',
      strengths: ['Resume uploaded', 'Application submitted'],
      skillsMatched: [],
      skillsMissing: [],
      experienceMatch: 'Unable to determine',
      keyHighlights: ['Manual review recommended'],
      concerns: ['AI analysis failed - please review manually'],
      recommendation: 'Manual review required',
      reasoning: 'Automated analysis encountered an error. Please review this candidate manually.'
    };
  }
};

/**
 * Find best candidates for a job
 * @param {string} jobId - Job ID
 * @param {number} topN - Number of top candidates to return (default 3)
 * @returns {Promise<Array>} Top N candidates with analysis
 */
const findBestCandidates = async (jobId, topN = 3) => {
  try {
    console.log(`\n🎯 ===== FINDING BEST CANDIDATES =====`);
    console.log(`Job ID: ${jobId}`);
    console.log(`Looking for top ${topN} candidates`);

    // 1. Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    console.log(`📋 Job: ${job.jobTitle}`);

    // 2. Get all applications for this job
    const applications = await Application.find({ job: jobId });
    
    if (applications.length === 0) {
      throw new Error('No applications found for this job');
    }

    console.log(`📊 Found ${applications.length} applications to analyze`);

    // 3. Analyze each candidate
    const analyzedCandidates = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      
      try {
        console.log(`\n[${i + 1}/${applications.length}] Processing: ${app.firstName} ${app.lastName}`);

        // Check if resume URL exists (stored in resume.fileUrl)
        const resumeUrl = app.resume?.fileUrl || app.resumeUrl;
        if (!resumeUrl) {
          console.log(`⚠️  No resume URL found, skipping...`);
          failCount++;
          continue;
        }

        // Download resume from Cloudinary
        console.log(`📥 Downloading resume from: ${resumeUrl}`);
        const resumeBuffer = await downloadResume(resumeUrl);

        // Extract text from resume
        console.log(`📝 Extracting text from resume...`);
        const resumeMimeType = app.resume?.fileType || app.resumeMimeType || 'application/pdf';
        const resumeText = await extractResumeText(
          resumeBuffer,
          resumeMimeType
        );

        if (!resumeText || resumeText.length < 100) {
          console.log(`⚠️  Insufficient text extracted, skipping...`);
          failCount++;
          continue;
        }

        console.log(`✅ Extracted ${resumeText.length} characters`);

        // Analyze with AI
        const analysis = await analyzeCandidate(
          {
            jobTitle: job.jobTitle,
            experienceLevel: job.experienceLevel,
            skills: job.skills,
            requirements: job.requirements,
            responsibilities: job.responsibilities
          },
          resumeText,
          {
            firstName: app.firstName,
            lastName: app.lastName,
            yearsOfExperience: app.yearsOfExperience,
            currentCompany: app.currentCompany
          }
        );

        analyzedCandidates.push({
          applicationId: app._id,
          candidate: {
            name: `${app.firstName} ${app.lastName}`,
            email: app.email,
            phone: app.phone,
            company: app.currentCompany || 'Not specified',
            experience: app.yearsOfExperience || 'Not specified',
            appliedAt: app.appliedAt
          },
          analysis
        });

        successCount++;

      } catch (error) {
        console.error(`❌ Error analyzing ${app.firstName} ${app.lastName}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n📊 Analysis Summary:`);
    console.log(`✅ Successfully analyzed: ${successCount}`);
    console.log(`❌ Failed to analyze: ${failCount}`);

    if (analyzedCandidates.length === 0) {
      throw new Error('No candidates could be analyzed successfully');
    }

    // 4. Sort by match score (highest first)
    analyzedCandidates.sort((a, b) => b.analysis.matchScore - a.analysis.matchScore);

    // 5. Return top N candidates
    const topCandidates = analyzedCandidates.slice(0, topN);

    console.log(`\n🏆 Top ${topCandidates.length} Candidates:`);
    topCandidates.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.candidate.name} - ${candidate.analysis.matchScore}% match`);
    });

    console.log(`\n===== ANALYSIS COMPLETE =====\n`);

    return topCandidates;

  } catch (error) {
    console.error('Error finding best candidates:', error);
    throw error;
  }
};

module.exports = {
  findBestCandidates,
  analyzeCandidate,
  downloadResume,
  extractResumeText
};
