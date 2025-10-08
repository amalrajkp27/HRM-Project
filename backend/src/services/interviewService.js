const crypto = require('crypto');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Switch between Gemini and Ollama based on environment variable
const USE_OLLAMA = process.env.USE_OLLAMA === 'true' || process.env.OLLAMA_BASE_URL;

let genAI;

if (USE_OLLAMA) {
  console.log('🦙 Interview Service using Ollama AI');
  const { OllamaAI } = require('./ollamaService');
  genAI = new OllamaAI(process.env.OLLAMA_BASE_URL);
} else {
  console.log('🤖 Interview Service using Google Gemini AI');
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Generate unique token for interview link
 * @returns {string} Unique token
 */
const generateInterviewToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate 5 interview questions using AI based on job details
 * @param {Object} jobDetails - Job title, description, experience level
 * @returns {Promise<Array>} Array of 5 questions
 */
const generateInterviewQuestions = async (jobDetails) => {
  try {
    console.log('🎯 ===== GENERATING INTERVIEW QUESTIONS =====');
    console.log('📋 Job:', jobDetails.jobTitle);
    console.log('🎓 Experience:', jobDetails.experienceLevel);

    // Get the AI model
    const modelName = USE_OLLAMA
      ? (process.env.OLLAMA_MODEL || 'llama2')
      : 'gemini-2.0-flash-exp';

    const model = genAI.getGenerativeModel({ model: modelName });

    // Determine difficulty levels based on experience
    const experienceLevel = jobDetails.experienceLevel?.toLowerCase() || 'entry-level';
    let difficultyGuidance = '';
    
    if (experienceLevel.includes('entry') || experienceLevel.includes('intern') || experienceLevel.includes('fresher')) {
      difficultyGuidance = `
**DIFFICULTY LEVEL: ENTRY-LEVEL/BEGINNER**
- Questions should be VERY SIMPLE and focus on BASIC concepts
- Suitable for someone with little to no professional experience
- Test basic knowledge, not complex problem-solving
- Examples: "What is X?", "Which of these is...?", "What does Y stand for?"
- Avoid advanced scenarios, complex algorithms, or deep technical details
- All 5 questions should be EASY to MEDIUM at most`;
    } else if (experienceLevel.includes('mid') || experienceLevel.includes('intermediate') || experienceLevel.includes('2-5 years')) {
      difficultyGuidance = `
**DIFFICULTY LEVEL: MID-LEVEL**
- Questions should test PRACTICAL experience and understanding
- Suitable for someone with 2-5 years of professional experience
- Mix of concepts, best practices, and problem-solving
- Questions: 2 Easy, 2 Medium, 1 Hard
- Test understanding of workflows, tools, and practical scenarios`;
    } else if (experienceLevel.includes('senior') || experienceLevel.includes('lead') || experienceLevel.includes('expert') || experienceLevel.includes('5+')) {
      difficultyGuidance = `
**DIFFICULTY LEVEL: SENIOR/EXPERT**
- Questions should test DEEP expertise and complex scenarios
- Suitable for someone with 5+ years of professional experience
- Focus on architecture, design patterns, best practices, optimization
- Questions: 1 Easy, 2 Medium, 2 Hard
- Test strategic thinking, system design, and advanced concepts`;
    } else {
      difficultyGuidance = `
**DIFFICULTY LEVEL: GENERAL**
- Questions should be balanced for general candidates
- Questions: 2 Easy, 2 Medium, 1 Hard
- Mix of basic concepts and practical applications`;
    }

    // Create detailed prompt for question generation
    const prompt = `You are an expert HR interviewer. Generate 5 pre-screening interview questions for this job:

**Job Title:** ${jobDetails.jobTitle}
**Experience Level:** ${jobDetails.experienceLevel}
**Department:** ${jobDetails.department || 'N/A'}
**Job Description:** ${jobDetails.jobDescription?.substring(0, 500) || 'N/A'}
**Required Skills:** ${jobDetails.skills || 'N/A'}

${difficultyGuidance}

**REQUIREMENTS:**
1. Generate EXACTLY 5 questions
2. Each question MUST be max 50 words
3. ALL questions MUST be multiple-choice (NOT short-answer, NOT essay, NOT scenario-text)
4. Each question MUST have exactly 4 options labeled A, B, C, D
5. Provide the correct answer as a single letter (A, B, C, or D)
6. Questions MUST match the difficulty level specified above

**OUTPUT FORMAT (JSON ONLY):**
{
  "questions": [
    {
      "questionNumber": 1,
      "questionType": "multiple-choice",
      "difficulty": "easy",
      "questionText": "Question here (max 50 words)?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A"
    },
    {
      "questionNumber": 2,
      "questionType": "multiple-choice",
      "difficulty": "medium",
      "questionText": "Question here (max 50 words)?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "B"
    },
    {
      "questionNumber": 3,
      "questionType": "multiple-choice",
      "difficulty": "medium",
      "questionText": "Question here (max 50 words)?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "C"
    },
    {
      "questionNumber": 4,
      "questionType": "multiple-choice",
      "difficulty": "medium",
      "questionText": "Question here (max 50 words)?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "A"
    },
    {
      "questionNumber": 5,
      "questionType": "multiple-choice",
      "difficulty": "easy",
      "questionText": "Question here (max 50 words)?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswer": "D"
    }
  ]
}

**CRITICAL REQUIREMENTS - DO NOT VIOLATE:**
1. ✅ ALL 5 questions MUST be "multiple-choice" type (NOT "short-answer", NOT "scenario", NOT "technical", NOT "behavioral")
2. ✅ Each question MUST have exactly 4 options: ["A) ...", "B) ...", "C) ...", "D) ..."]
3. ✅ correctAnswer MUST be ONLY one letter: "A", "B", "C", or "D"
4. ✅ questionType field MUST be exactly "multiple-choice" for ALL 5 questions
5. ✅ difficulty MUST be one of: "easy", "medium", "hard"
6. ✅ Match the experience level difficulty specified above

**EXAMPLE FOR ENTRY-LEVEL:**
{
  "questionNumber": 1,
  "questionType": "multiple-choice",
  "difficulty": "easy",
  "questionText": "What is Flutter primarily used for?",
  "options": ["A) Web development", "B) Mobile app development", "C) Database management", "D) Server hosting"],
  "correctAnswer": "B"
}

Return ONLY valid JSON matching the format above. NO markdown, NO explanations, NO extra text.`;

    console.log('🤖 Calling AI to generate questions...');
    const result = await model.generateContent(prompt);
    const responseText = result.response ? result.response.text() : result.text();

    console.log('📤 RAW AI RESPONSE:');
    console.log(responseText.substring(0, 500) + '...');

    // Extract JSON from response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    if (!parsedResponse.questions || parsedResponse.questions.length !== 5) {
      throw new Error('AI did not generate exactly 5 questions');
    }

    console.log('✅ Successfully generated 5 questions');
    console.log('================================');

    return parsedResponse.questions;

  } catch (error) {
    console.error('❌ Error generating questions:', error.message);
    
    // Fallback: Return template questions based on experience level
    console.log('⚠️  Using fallback template questions');
    return generateFallbackQuestions(jobDetails);
  }
};

/**
 * Fallback questions if AI fails
 * @param {Object} jobDetails
 * @returns {Array} Template questions
 */
const generateFallbackQuestions = (jobDetails) => {
  return [
    {
      questionNumber: 1,
      questionType: 'multiple-choice',
      difficulty: 'easy',
      questionText: `What interests you most about the ${jobDetails.jobTitle} position?`,
      options: [
        'A) Career growth opportunities',
        'B) Work-life balance',
        'C) Technical challenges',
        'D) Company culture'
      ],
      correctAnswer: 'A',
      maxScore: 10
    },
    {
      questionNumber: 2,
      questionType: 'short-answer',
      difficulty: 'medium',
      questionText: `Describe your relevant experience for ${jobDetails.jobTitle}. (Max 200 words)`,
      options: [],
      correctAnswer: '',
      maxScore: 10
    },
    {
      questionNumber: 3,
      questionType: 'scenario',
      difficulty: 'hard',
      questionText: `You face a tight deadline but lack resources. How do you prioritize and deliver quality work?`,
      options: [],
      correctAnswer: '',
      maxScore: 10
    },
    {
      questionNumber: 4,
      questionType: 'technical',
      difficulty: 'medium',
      questionText: `What tools or technologies are you most proficient in for this role?`,
      options: [],
      correctAnswer: '',
      maxScore: 10
    },
    {
      questionNumber: 5,
      questionType: 'behavioral',
      difficulty: 'easy',
      questionText: `Describe a time when you successfully worked in a team. What was your contribution?`,
      options: [],
      correctAnswer: '',
      maxScore: 10
    }
  ];
};

/**
 * Score a single answer using AI
 * @param {Object} question - The question object
 * @param {string} answer - Candidate's answer
 * @param {Object} jobContext - Job details for context
 * @returns {Promise<Object>} Score and feedback
 */
const scoreAnswer = async (question, answer, jobContext) => {
  try {
    // For multiple choice, simple comparison
    if (question.questionType === 'multiple-choice') {
      const answerLetter = answer.trim().toUpperCase().charAt(0);
      const correct = answerLetter === question.correctAnswer;
      
      return {
        aiScore: correct ? 10 : 0,
        aiFeedback: correct ? 'Correct answer!' : `Incorrect. The correct answer was ${question.correctAnswer}.`,
        strengths: correct ? ['Good knowledge'] : [],
        weaknesses: correct ? [] : ['Review this topic']
      };
    }

    // For open-ended questions, use AI
    const modelName = USE_OLLAMA
      ? (process.env.OLLAMA_MODEL || 'llama2')
      : 'gemini-2.0-flash-exp';

    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are an expert HR evaluator. Score this interview answer:

**Job:** ${jobContext.jobTitle} (${jobContext.experienceLevel})
**Question (${question.difficulty}):** ${question.questionText}
**Candidate's Answer:** ${answer}

**SCORING CRITERIA:**
- Relevance to question (0-3 points)
- Depth of knowledge (0-3 points)
- Communication clarity (0-2 points)
- Practical examples (0-2 points)

**OUTPUT FORMAT (JSON ONLY):**
{
  "score": <number 0-10>,
  "feedback": "<brief evaluation in 1-2 sentences>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>"]
}

Return ONLY valid JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response ? result.response.text() : result.text();

    let jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in AI scoring response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      aiScore: Math.min(10, Math.max(0, parsed.score)), // Clamp between 0-10
      aiFeedback: parsed.feedback || 'Answer evaluated.',
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || []
    };

  } catch (error) {
    console.error('❌ Error scoring answer:', error.message);
    
    // Fallback scoring
    const wordCount = answer.split(/\s+/).length;
    let fallbackScore = 5; // Default middle score
    
    if (wordCount < 10) fallbackScore = 3;
    else if (wordCount > 50) fallbackScore = 7;
    
    return {
      aiScore: fallbackScore,
      aiFeedback: 'Answer reviewed.',
      strengths: [],
      weaknesses: []
    };
  }
};

/**
 * Calculate overall interview score and generate summary
 * @param {Array} answers - Array of scored answers
 * @param {number} totalQuestions - Total questions
 * @returns {Object} Overall score, passed status, summary
 */
const calculateOverallScore = (answers, totalQuestions = 5) => {
  const totalAnswered = answers.length;
  
  // Auto-reject if less than 5 answers (all questions must be answered)
  if (totalAnswered < 5) {
    return {
      overallScore: 0,
      passed: false,
      aiSummary: `Interview incomplete. All ${totalQuestions} questions must be answered.`
    };
  }

  // Count correct answers (for multiple choice, score is either 0 or 10)
  const correctAnswers = answers.filter(ans => ans.aiScore === 10).length;
  
  // Calculate percentage
  const overallScore = Math.round((correctAnswers / totalQuestions) * 100);

  // Pass threshold: Must get at least 3 out of 5 correct (60%)
  const passed = correctAnswers >= 3;

  // Generate summary
  let aiSummary = `Answered ${correctAnswers}/${totalQuestions} questions correctly. `;
  
  if (passed) {
    if (correctAnswers === 5) {
      aiSummary += 'Perfect score! Excellent candidate for next round.';
    } else if (correctAnswers === 4) {
      aiSummary += 'Very good performance. Strong candidate for interview.';
    } else {
      aiSummary += 'Meets minimum requirements. Eligible for next round.';
    }
  } else {
    aiSummary += `Minimum 3 correct answers required to pass. Does not meet pre-screening requirements.`;
  }

  return {
    overallScore,
    totalAnswered,
    correctAnswers,
    passed,
    aiSummary
  };
};

module.exports = {
  generateInterviewToken,
  generateInterviewQuestions,
  scoreAnswer,
  calculateOverallScore
};

