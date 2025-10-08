// Switch between Gemini and Ollama based on environment variable
const USE_OLLAMA = process.env.USE_OLLAMA === 'true' || process.env.OLLAMA_BASE_URL;

let genAI;

if (USE_OLLAMA) {
  console.log('🦙 Using Ollama AI Service');
  const { OllamaAI } = require('./ollamaService');
  genAI = new OllamaAI(process.env.OLLAMA_BASE_URL);
} else {
  console.log('🤖 Using Google Gemini AI Service');
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Generate comprehensive job description using Google Gemini AI
 * @param {string} jobPosition - Job title/position
 * @param {string} experience - Required experience level
 * @param {string} department - Department name
 * @param {string} location - Job location
 * @param {string} employmentType - Employment type (Full-time, Part-time, etc.)
 * @param {string} salaryRange - Salary range
 * @param {string} applicationDeadline - Application deadline
 * @returns {Object} Generated job description with all fields
 */
const generateJobDescription = async (
  jobPosition, 
  experience, 
  department = '', 
  location = '', 
  employmentType = '',
  salaryRange = '',
  applicationDeadline = ''
) => {
  try {
    // Get the AI model (Ollama or Gemini based on configuration)
    const modelName = USE_OLLAMA 
      ? (process.env.OLLAMA_MODEL || 'llama2')
      : 'gemini-2.0-flash-exp';
    
    const model = genAI.getGenerativeModel({ model: modelName });

    // Create detailed prompt
    const prompt = `You are an expert HR professional. Generate a comprehensive, professional job description for the following position:

Job Position: ${jobPosition}
Department: ${department}
Location: ${location}
Employment Type: ${employmentType}
Experience Level: ${experience}
Salary Range: ${salaryRange}
Application Deadline: ${applicationDeadline}

Please provide a complete job description in the following JSON format (return ONLY valid JSON, no markdown or extra text):

{
  "jobDescription": "A detailed 2-3 paragraph description of the role, responsibilities, and what the company is looking for. Make it engaging and professional.",
  "responsibilities": "5-7 key responsibilities as a single string with each point on a new line, starting with a bullet point or dash",
  "requirements": "5-7 requirements and qualifications as a single string with each point on a new line, starting with a bullet point or dash",
  "skills": "8-10 required technical and soft skills, comma-separated as a single string",
  "benefits": "5-6 benefits and perks as a single string with each point on a new line, starting with a bullet point or dash"
}

Important:
- Make the content specific to the ${jobPosition} role in the ${department} department
- Adjust complexity and expectations based on ${experience} experience level
- Consider the ${employmentType} nature of the position
- Mention the ${location} location context when relevant (remote benefits, local market, etc.)
- Ensure the salary range ${salaryRange} is competitive and mentioned appropriately
- Create urgency with the application deadline: ${applicationDeadline}
- Use professional, engaging language
- Be specific and detailed
- Return ONLY the JSON object, no additional text or markdown`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 🔍 DEBUG: Log AI response
    console.log('\n🤖 ===== AI GENERATION DEBUG =====');
    console.log('📝 Job Position:', jobPosition);
    console.log('🏢 Department:', department);
    console.log('📍 Location:', location);
    console.log('💼 Employment Type:', employmentType);
    console.log('⏱️  Experience Level:', experience);
    console.log('💰 Salary Range:', salaryRange);
    console.log('📅 Application Deadline:', applicationDeadline);
    console.log('\n📤 RAW AI RESPONSE:');
    console.log(text);
    console.log('\n================================\n');

    // Clean the response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Parse JSON response
    const generatedContent = JSON.parse(cleanedText);

    // 🔍 DEBUG: Log parsed content
    console.log('✅ PARSED JSON CONTENT:');
    console.log(JSON.stringify(generatedContent, null, 2));
    console.log('\n================================\n');

    // Validate response structure
    if (!generatedContent.jobDescription || !generatedContent.responsibilities || 
        !generatedContent.requirements || !generatedContent.skills || 
        !generatedContent.benefits) {
      throw new Error('Invalid response structure from AI');
    }

    return {
      success: true,
      data: generatedContent
    };

  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Return fallback response if AI fails
    return {
      success: false,
      error: error.message,
      data: {
        jobDescription: `We are seeking a talented ${jobPosition} to join our ${department} team in ${location}. This ${employmentType} position requires ${experience} level experience and offers an opportunity to work on challenging projects in a dynamic environment. The salary range for this role is ${salaryRange}. Applications are being accepted until ${applicationDeadline}.`,
        responsibilities: `- Lead and manage ${department} projects related to ${jobPosition}\n- Collaborate with cross-functional teams across the organization\n- Ensure quality and timely delivery of work\n- Mentor and guide team members\n- Contribute to strategic planning and decision-making\n- Drive innovation and continuous improvement\n- Maintain high standards of professional excellence`,
        requirements: `- ${experience} level experience in ${jobPosition} or related field\n- Strong technical and analytical skills relevant to ${department}\n- Excellent communication and interpersonal abilities\n- Bachelor's degree in relevant field (or equivalent experience)\n- Proven track record of success in similar roles\n- Ability to work ${employmentType} schedule\n- ${location === 'Remote' ? 'Strong self-motivation for remote work' : 'Ability to work on-site in ' + location}`,
        skills: 'Leadership, Communication, Problem-solving, Technical expertise, Team collaboration, Project management, Time management, Adaptability, Strategic thinking, Innovation',
        benefits: `- Competitive salary: ${salaryRange}\n- Comprehensive health insurance coverage\n- ${employmentType === 'Full-time' ? 'Full benefits package' : 'Pro-rated benefits'}\n- ${location === 'Remote' ? 'Remote work flexibility' : 'On-site perks and amenities'}\n- Professional development opportunities\n- Paid time off and holidays\n- Performance bonuses and incentives`
      }
    };
  }
};

module.exports = {
  generateJobDescription
};
