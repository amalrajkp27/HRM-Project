/**
 * Ollama AI Service
 * Provides a unified interface for interacting with self-hosted Ollama models
 * Compatible with the previous Gemini AI implementation
 */

const axios = require('axios');

// Get Ollama configuration from environment
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://13.204.94.103:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2'; // Default model

/**
 * Generate content using Ollama
 * @param {string} prompt - The prompt to send to the model
 * @param {Object} options - Optional configuration
 * @returns {Promise<string>} Generated text response
 */
async function generateContent(prompt, options = {}) {
  try {
    console.log(`🤖 Calling Ollama at ${OLLAMA_BASE_URL}`);
    console.log(`📝 Model: ${options.model || OLLAMA_MODEL}`);
    
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: options.model || OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        ...options.modelOptions
      }
    }, {
      timeout: 120000, // 2 minute timeout for long generations
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.response) {
      console.log(`✅ Ollama response received (${response.data.response.length} chars)`);
      return response.data.response;
    } else {
      throw new Error('Invalid response format from Ollama');
    }

  } catch (error) {
    console.error('❌ Ollama API Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Cannot connect to Ollama server at ${OLLAMA_BASE_URL}. Is Ollama running?`);
    }
    
    if (error.response) {
      throw new Error(`Ollama API error: ${error.response.status} - ${error.response.data?.error || error.message}`);
    }
    
    throw error;
  }
}

/**
 * Generate content with chat format (better for conversational prompts)
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Optional configuration
 * @returns {Promise<string>} Generated text response
 */
async function generateChatContent(messages, options = {}) {
  try {
    console.log(`🤖 Calling Ollama Chat at ${OLLAMA_BASE_URL}`);
    console.log(`📝 Model: ${options.model || OLLAMA_MODEL}`);
    console.log(`💬 Messages: ${messages.length}`);
    
    const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
      model: options.model || OLLAMA_MODEL,
      messages: messages,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        ...options.modelOptions
      }
    }, {
      timeout: 120000, // 2 minute timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.message) {
      console.log(`✅ Ollama chat response received`);
      return response.data.message.content;
    } else {
      throw new Error('Invalid response format from Ollama');
    }

  } catch (error) {
    console.error('❌ Ollama Chat API Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Cannot connect to Ollama server at ${OLLAMA_BASE_URL}. Is Ollama running?`);
    }
    
    if (error.response) {
      throw new Error(`Ollama API error: ${error.response.status} - ${error.response.data?.error || error.message}`);
    }
    
    throw error;
  }
}

/**
 * Check if Ollama server is available
 * @returns {Promise<boolean>} True if server is reachable
 */
async function checkHealth() {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
      timeout: 5000
    });
    
    console.log(`✅ Ollama server is healthy at ${OLLAMA_BASE_URL}`);
    console.log(`📦 Available models:`, response.data.models?.map(m => m.name).join(', '));
    return true;
  } catch (error) {
    console.error(`❌ Ollama server health check failed: ${error.message}`);
    return false;
  }
}

/**
 * List available models on Ollama server
 * @returns {Promise<Array>} List of available models
 */
async function listModels() {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
      timeout: 5000
    });
    
    return response.data.models || [];
  } catch (error) {
    console.error('❌ Failed to list Ollama models:', error.message);
    return [];
  }
}

/**
 * Gemini-compatible wrapper for backward compatibility
 * Mimics the Gemini API interface
 */
class OllamaGenerativeModel {
  constructor(modelName) {
    this.modelName = modelName || OLLAMA_MODEL;
  }

  async generateContent(prompt) {
    const text = await generateContent(prompt, { model: this.modelName });
    
    // Return in Gemini-compatible format
    return {
      response: {
        text: () => text
      }
    };
  }
}

/**
 * Gemini-compatible AI wrapper
 */
class OllamaAI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || OLLAMA_BASE_URL;
  }

  getGenerativeModel(config) {
    const modelName = config.model || OLLAMA_MODEL;
    return new OllamaGenerativeModel(modelName);
  }
}

module.exports = {
  generateContent,
  generateChatContent,
  checkHealth,
  listModels,
  OllamaAI,
  OllamaGenerativeModel,
  OLLAMA_BASE_URL,
  OLLAMA_MODEL
};

