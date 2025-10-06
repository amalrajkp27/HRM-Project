# Environment Variables Setup Guide

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
# REPLACE THIS WITH YOUR ACTUAL MONGODB CONNECTION STRING
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrm_db

# JWT Configuration
# CHANGE THIS SECRET IN PRODUCTION - Use a long, random string
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# AI Configuration (Google Gemini)
# Get your free API key from: https://aistudio.google.com/app/api-keys
GEMINI_API_KEY=your_gemini_api_key_here
```

## How to Get Google Gemini API Key

1. Go to: https://aistudio.google.com/app/api-keys
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Paste it in the `GEMINI_API_KEY` field above
6. Restart your backend server

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Important Notes

- Never commit `.env` files to Git
- Always use `.env.example` for templates
- Change all secrets in production
- Keep API keys secure
- Restart servers after changing .env files

## Verification

After setting up, verify:

```bash
# Check backend .env exists
ls backend/.env

# Check if API key is set (should show your key)
cat backend/.env | grep GEMINI_API_KEY

# Test backend health
curl http://localhost:5001/health
```

Should return: `{"status":"OK","message":"Server is running"}`
