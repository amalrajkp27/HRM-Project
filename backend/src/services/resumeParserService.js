const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Switch between Gemini and Ollama based on environment variable
const USE_OLLAMA = process.env.USE_OLLAMA === 'true' || process.env.OLLAMA_BASE_URL;

let genAI;

if (USE_OLLAMA) {
  console.log('🦙 Resume Parser using Ollama AI');
  const { OllamaAI } = require('./ollamaService');
  genAI = new OllamaAI(process.env.OLLAMA_BASE_URL);
} else {
  console.log('🤖 Resume Parser using Google Gemini AI');
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Extract text from PDF file
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from DOCX file
 * @param {Buffer} buffer - DOCX file buffer
 * @returns {Promise<string>} Extracted text
 */
const extractTextFromDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Parse resume text using Google Gemini AI
 * @param {string} resumeText - Extracted resume text
 * @returns {Promise<Object>} Parsed resume data
 */
const parseResumeWithAI = async (resumeText) => {
  try {
    // Get the AI model (Ollama or Gemini based on configuration)
    const modelName = USE_OLLAMA 
      ? (process.env.OLLAMA_MODEL || 'llama2')
      : 'gemini-2.0-flash-exp';
    
    const model = genAI.getGenerativeModel({ model: modelName });

    // Create detailed prompt for resume parsing
    const prompt = `You are an expert resume parser. Extract the following information from this resume text and return it as JSON.

Resume Text:
${resumeText}

Extract and return ONLY valid JSON in this exact format (no markdown, no extra text):

{
  "firstName": "extracted first name or empty string",
  "lastName": "extracted last name or empty string",
  "email": "extracted email or empty string",
  "phone": "extracted phone number or empty string",
  "currentCompany": "most recent/current company name or empty string",
  "yearsOfExperience": "total years as number or empty string",
  "linkedinUrl": "LinkedIn profile URL or empty string",
  "portfolioUrl": "portfolio/website URL or empty string",
  "skills": ["skill1", "skill2", "skill3"],
  "summary": "brief professional summary or empty string"
}

Rules:
- Return empty strings for fields you cannot find with confidence
- For yearsOfExperience, calculate total years from work history (just the number)
- Extract only valid URLs for linkedinUrl and portfolioUrl
- If LinkedIn URL doesn't start with http, add https://
- Include top 10-15 most relevant skills mentioned in the resume
- Keep phone numbers in their original format
- For name extraction, look at the top of the resume
- For currentCompany, find the most recent job (usually at the top of experience section)
- Return ONLY the JSON object, nothing else
- Be conservative - if you're not sure, return empty string rather than guessing`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 🔍 DEBUG: Log AI response
    console.log('\n🤖 ===== RESUME PARSING DEBUG =====');
    console.log('📄 Resume Text Length:', resumeText.length, 'characters');
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
    const parsedData = JSON.parse(cleanedText);

    // 🔍 DEBUG: Log parsed content
    console.log('✅ PARSED JSON CONTENT:');
    console.log(JSON.stringify(parsedData, null, 2));
    console.log('\n================================\n');

    // Validate response structure
    if (!parsedData.hasOwnProperty('firstName') || 
        !parsedData.hasOwnProperty('lastName') || 
        !parsedData.hasOwnProperty('email')) {
      throw new Error('Invalid response structure from AI');
    }

    // Clean up and normalize URLs
    if (parsedData.linkedinUrl && !parsedData.linkedinUrl.startsWith('http')) {
      parsedData.linkedinUrl = 'https://' + parsedData.linkedinUrl;
    }
    if (parsedData.portfolioUrl && !parsedData.portfolioUrl.startsWith('http')) {
      parsedData.portfolioUrl = 'https://' + parsedData.portfolioUrl;
    }

    return {
      success: true,
      data: parsedData
    };

  } catch (error) {
    console.error('AI Resume Parsing Error:', error);
    throw new Error('Failed to parse resume with AI: ' + error.message);
  }
};

/**
 * Main function to parse resume file
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} Parsed resume data
 */
const parseResume = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('\n📄 ===== RESUME PARSING STARTED =====');
    console.log('File name:', file.originalname);
    console.log('File type:', file.mimetype);
    console.log('File size:', file.size, 'bytes');

    let resumeText = '';

    // Extract text based on file type
    if (file.mimetype === 'application/pdf') {
      console.log('📑 Extracting text from PDF...');
      resumeText = await extractTextFromPDF(file.buffer);
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      console.log('📝 Extracting text from DOCX/DOC...');
      resumeText = await extractTextFromDOCX(file.buffer);
    } else {
      throw new Error('Unsupported file type. Please upload PDF, DOC, or DOCX');
    }

    // Validate extracted text
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error('Could not extract sufficient text from resume. Please ensure the file is not corrupted or image-based.');
    }

    console.log('✅ Text extracted successfully:', resumeText.length, 'characters');
    console.log('📤 Sending to AI for parsing...');

    // Parse with AI
    const result = await parseResumeWithAI(resumeText);

    console.log('✅ Resume parsing completed successfully');
    console.log('=====================================\n');

    return result;

  } catch (error) {
    console.error('❌ Resume parsing failed:', error.message);
    console.log('=====================================\n');
    throw error;
  }
};

module.exports = {
  parseResume,
  extractTextFromPDF,
  extractTextFromDOCX,
  parseResumeWithAI
};
