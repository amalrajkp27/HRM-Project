#!/bin/bash

# Setup script for Ollama AI integration
# This script helps configure the backend to use Ollama instead of Gemini

echo "🦙 ================================"
echo "🦙 Ollama AI Setup Script"
echo "🦙 ================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ Error: backend/.env file not found!${NC}"
    echo "Please create backend/.env file first."
    exit 1
fi

echo -e "${GREEN}✅ Found backend/.env file${NC}"
echo ""

# Ask for Ollama server URL
echo "📝 Enter your Ollama server URL:"
echo "   (Default: http://13.204.94.103:11434)"
read -p "URL: " ollama_url
ollama_url=${ollama_url:-http://13.204.94.103:11434}

# Test connection
echo ""
echo "🔍 Testing connection to Ollama server..."
if curl -s -f "${ollama_url}/api/tags" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Successfully connected to Ollama server!${NC}"
    
    # List available models
    echo ""
    echo "📦 Available models on your Ollama server:"
    models=$(curl -s "${ollama_url}/api/tags" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    if [ -z "$models" ]; then
        echo -e "${YELLOW}⚠️  No models found. You may need to pull models first.${NC}"
        echo "   Run on your Ollama server: ollama pull llama2"
    else
        echo "$models" | while read model; do
            echo "   - $model"
        done
    fi
else
    echo -e "${RED}❌ Cannot connect to Ollama server at: ${ollama_url}${NC}"
    echo "   Please check:"
    echo "   1. Is the URL correct?"
    echo "   2. Is Ollama server running?"
    echo "   3. Is port 11434 accessible?"
    echo ""
    read -p "Continue anyway? (y/n): " continue_setup
    if [ "$continue_setup" != "y" ]; then
        exit 1
    fi
fi

# Ask for model
echo ""
echo "📝 Enter model name to use:"
echo "   Recommended: llama2, mistral, codellama"
read -p "Model (default: llama2): " ollama_model
ollama_model=${ollama_model:-llama2}

# Backup existing .env
echo ""
echo "💾 Creating backup of backend/.env..."
cp backend/.env backend/.env.backup
echo -e "${GREEN}✅ Backup created: backend/.env.backup${NC}"

# Update .env file
echo ""
echo "📝 Updating backend/.env..."

# Check if Ollama config already exists
if grep -q "OLLAMA_BASE_URL" backend/.env; then
    # Update existing
    sed -i.bak "s|^OLLAMA_BASE_URL=.*|OLLAMA_BASE_URL=${ollama_url}|" backend/.env
    sed -i.bak "s|^OLLAMA_MODEL=.*|OLLAMA_MODEL=${ollama_model}|" backend/.env
    sed -i.bak "s|^USE_OLLAMA=.*|USE_OLLAMA=true|" backend/.env
    rm backend/.env.bak 2>/dev/null
else
    # Add new config
    echo "" >> backend/.env
    echo "# Ollama AI Configuration" >> backend/.env
    echo "USE_OLLAMA=true" >> backend/.env
    echo "OLLAMA_BASE_URL=${ollama_url}" >> backend/.env
    echo "OLLAMA_MODEL=${ollama_model}" >> backend/.env
fi

echo -e "${GREEN}✅ Configuration updated!${NC}"

# Show current config
echo ""
echo "📋 Current Ollama Configuration:"
echo "   USE_OLLAMA=true"
echo "   OLLAMA_BASE_URL=${ollama_url}"
echo "   OLLAMA_MODEL=${ollama_model}"

# Ask to restart backend
echo ""
read -p "🔄 Restart backend server now? (y/n): " restart_backend
if [ "$restart_backend" == "y" ]; then
    echo ""
    echo "🛑 Stopping existing backend..."
    lsof -ti:5001 | xargs kill -9 2>/dev/null
    sleep 2
    
    echo "🚀 Starting backend with Ollama..."
    cd backend
    npm start &
    
    echo ""
    echo -e "${GREEN}✅ Backend starting...${NC}"
    echo "   Check logs for: '🦙 Using Ollama AI Service'"
else
    echo ""
    echo "⚠️  Remember to restart backend manually:"
    echo "   cd backend && npm start"
fi

echo ""
echo "🎉 ================================"
echo "🎉 Ollama Setup Complete!"
echo "🎉 ================================"
echo ""
echo "📖 Next steps:"
echo "   1. Check backend logs for '🦙 Using Ollama AI Service'"
echo "   2. Test job description generation"
echo "   3. Test resume parsing"
echo "   4. Test candidate matching"
echo ""
echo "📄 For more info, see: OLLAMA_MIGRATION_GUIDE.md"
echo ""

