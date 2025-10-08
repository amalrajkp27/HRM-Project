/**
 * Quick Test Script for Gemini API
 * Run with: node test-gemini-api.js
 */

const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('\n🔍 ===== GEMINI API DIAGNOSTIC TEST =====\n');

// Check if .env exists
const envPath = './.env';
if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: .env file not found in backend folder!');
  console.log('📁 Please create .env file in backend/ directory with your GEMINI_API_KEY');
  process.exit(1);
}

// Load .env
require('dotenv').config({ path: envPath });

// Check if API key is set
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in .env file!');
  console.log('📝 Add this line to backend/.env:');
  console.log('   GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}

console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
console.log('📏 Key length:', apiKey.length, 'characters');

// Test API connection
async function testGeminiAPI() {
  try {
    console.log('\n🤖 Testing Gemini API connection...\n');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different models
    const modelsToTest = [
      'gemini-2.0-flash-exp',
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];
    
    for (const modelName of modelsToTest) {
      try {
        console.log(`\n🔬 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Say hello in one word');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS with ${modelName}`);
        console.log(`📤 Response: ${text}`);
        console.log(`\n✨ RECOMMENDED: Use model "${modelName}" in your code\n`);
        
        // Exit after first successful model
        break;
        
      } catch (modelError) {
        console.log(`❌ FAILED with ${modelName}`);
        console.log(`   Error: ${modelError.message}`);
        
        // Check for specific errors
        if (modelError.message.includes('429') || modelError.message.includes('RESOURCE_EXHAUSTED')) {
          console.log(`\n⚠️  QUOTA EXCEEDED! You've hit the free tier limit (50 requests/day)`);
          console.log(`   Solutions:`);
          console.log(`   1. Wait until midnight UTC for quota reset`);
          console.log(`   2. Get a new API key from a different Google account`);
          console.log(`   3. Enable billing in Google Cloud Console\n`);
          break;
        }
        
        if (modelError.message.includes('400') || modelError.message.includes('API_KEY_INVALID')) {
          console.log(`\n⚠️  INVALID API KEY!`);
          console.log(`   Get a new key from: https://aistudio.google.com/app/apikey\n`);
          break;
        }
      }
    }
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:');
    console.error(error.message);
    console.error('\n📋 Full Error:');
    console.error(error);
  }
}

// Run test
testGeminiAPI().then(() => {
  console.log('\n===== TEST COMPLETE =====\n');
}).catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});

