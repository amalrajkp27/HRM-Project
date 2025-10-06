# API Key Troubleshooting Guide

## Current Issue: API_KEY_INVALID

Your API key format is correct (starts with AIza), but Google is rejecting it.

## Steps to Fix:

### Option 1: Enable the Generative Language API

1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure you're signed in with the same Google account
3. Click "ENABLE" button
4. Wait 1-2 minutes for activation
5. Try again in your app

### Option 2: Create a New API Key with Proper Settings

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API key in new project" (recommended)
4. Copy the new key
5. Replace in your .env file:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
6. Server will auto-restart

### Option 3: Check API Key Restrictions

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key in the list
3. Click on it
4. Under "API restrictions":
   - Select "Don't restrict key" (for testing)
   - OR select "Restrict key" and add "Generative Language API"
5. Click "Save"
6. Wait 1-2 minutes
7. Try again

### Option 4: Verify Billing (if using Google Cloud Console)

If you created the key through Google Cloud Console (not AI Studio):
1. Go to: https://console.cloud.google.com/billing
2. Make sure billing is enabled (free tier is fine)
3. Gemini API requires billing to be enabled (but has free tier)

## How to Test:

After making changes:
1. Wait 1-2 minutes for Google to propagate changes
2. Go to: http://localhost:3000/job-postings
3. Click "Create New Job"
4. Fill in Job Title and Experience Level
5. Click "🤖 Generate with AI"
6. Check your terminal for logs

## Expected Success Logs:

When it works, you'll see:
```
🤖 ===== AI GENERATION DEBUG =====
📝 Job Position: Senior Software Engineer
⏱️  Experience: Senior
🏢 Department: IT
📍 Location: Remote

📤 RAW AI RESPONSE:
{
  "jobDescription": "We are seeking...",
  ...
}

✅ PARSED JSON CONTENT:
{
  "jobDescription": "...",
  "responsibilities": "...",
  ...
}
================================
```

## Current Error in Terminal:

```
API key not valid. Please pass a valid API key.
```

This means Google's API is rejecting the key - not a code issue!

## Quick Test Command:

Test your API key directly:
```bash
curl -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

If this returns an error, the API key is definitely not working.

## Most Common Solution:

Go to https://aistudio.google.com/app/apikey and create a NEW API key.
Make sure you see "API key created" confirmation.
Copy it immediately and paste in .env file.
