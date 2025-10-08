# 🔍 AI Job Description - "Service Unavailable" Troubleshooting

## Problem
When clicking **"🤖 Generate with AI"** button, you're getting:
- ❌ "AI service not available, using default template"
- ❌ Generic template content instead of AI-generated content

---

## 🎯 Root Causes & Solutions

### **1. API Quota Exceeded (Most Likely)**

**Cause:** Google Gemini AI free tier has a limit of **50 requests per day**. You've been extensively testing:
- AI Resume Parsing (multiple times)
- AI Candidate Matching (10+ resumes analyzed)
- AI Job Description Generation

**How to Check:**
```bash
# Look for this error in backend logs
grep -i "quota\|429\|rate limit" backend/logs
```

**Solutions:**

#### Option A: Wait for Quota Reset
- Gemini API quota resets at **midnight UTC**
- Current time: Check https://time.is/UTC
- Wait until quota resets (free)

#### Option B: Get a New API Key
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with a **different Google account**
3. Click "Create API Key"
4. Update `backend/.env`:
   ```env
   GEMINI_API_KEY=YOUR_NEW_KEY_HERE
   ```
5. Restart backend: `npm start`

#### Option C: Use Paid Tier (Recommended for Production)
- Enable billing in Google Cloud Console
- Pay-as-you-go: $0.00025 per request (very cheap)
- Much higher quota: 1000+ requests/day

---

### **2. Wrong Model Name**

**Cause:** Gemini AI models change over time. The code uses `gemini-2.0-flash-exp` which might be deprecated.

**How to Check:**
```bash
# Try with a different model
cd backend/src/services
grep "gemini-2.0-flash-exp" aiService.js
```

**Solution:** Update to stable model:

```javascript
// In backend/src/services/aiService.js line 28
// OLD:
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// NEW (try one of these):
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
// OR
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
```

---

### **3. API Key Invalid or Expired**

**Cause:** API key might be invalid, expired, or from wrong project.

**How to Check:**
```bash
# Test API key directly
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

**Expected Response:**
- ✅ 200 OK with generated text = Key is valid
- ❌ 400 "API_KEY_INVALID" = Key is wrong
- ❌ 429 "RESOURCE_EXHAUSTED" = Quota exceeded

**Solution:**
1. Get new key: https://aistudio.google.com/app/apikey
2. Update `.env`
3. Restart backend

---

### **4. Network/Firewall Issues**

**Cause:** Firewall blocking Google AI API.

**How to Check:**
```bash
# Test connectivity
curl -I https://generativelanguage.googleapis.com/
```

**Solution:**
- Check firewall settings
- Try different network (mobile hotspot)
- Check corporate VPN/proxy

---

## 🧪 Quick Diagnostic Steps

### Step 1: Check Backend Console
Look for these error messages when you click "Generate with AI":

```bash
# Common errors:
"AI Service Error: 429" → Quota exceeded
"AI Service Error: 400" → Invalid API key
"AI Service Error: ENOTFOUND" → Network issue
"Generate Job Description Error" → Check full error message
```

### Step 2: Test API Key Directly
```bash
# Replace YOUR_KEY with actual key from .env
export GEMINI_KEY="YOUR_ACTUAL_KEY_HERE"

curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Generate a job description for a Software Engineer"
      }]
    }]
  }'
```

### Step 3: Check Current Quota Usage
1. Go to: https://console.cloud.google.com/
2. Select your project
3. Go to "APIs & Services" → "Dashboard"
4. Check "Generative Language API" usage

---

## 🔧 Temporary Workaround

While waiting for quota reset, you can:

### Option 1: Use the Template (Already Working)
The system automatically falls back to a template when AI fails. The template is:
- ✅ Professional and well-structured
- ✅ Based on your input (job title, department, etc.)
- ❌ Less customized than AI-generated content

### Option 2: Manual Entry
Simply fill in the fields manually:
- Job Description
- Responsibilities  
- Requirements
- Skills
- Benefits

### Option 3: Copy from Similar Jobs
1. Find a similar job posting online
2. Adapt it to your needs
3. Paste into the form

---

## 📊 Understanding Gemini API Limits

### Free Tier (Current):
- **15 requests per minute**
- **50 requests per day**
- Resets at midnight UTC
- No cost

### Paid Tier:
- **60 requests per minute**
- **1,500 requests per day**
- Pay per request: ~$0.00025
- For 100 job descriptions/day = **$0.025/day** (very cheap!)

---

## ✅ Best Practices

### 1. **Cache Generated Content**
Don't regenerate multiple times for the same job:
```javascript
// Save AI-generated content immediately
// Don't click "Generate" button multiple times
```

### 2. **Use AI Strategically**
Reserve AI generation for:
- ✅ New, unique job postings
- ✅ Important senior-level positions
- ❌ Don't regenerate if you just want minor tweaks

### 3. **Monitor Quota Usage**
```bash
# Add to backend logging
console.log(`AI API calls today: ${callCount}/50`);
```

### 4. **Consider Paid Tier for Production**
- Only $0.025 per 100 job descriptions
- Much more reliable
- Higher rate limits
- Worth it for production use

---

## 🚀 Quick Fix (Recommended)

**Most likely cause: Quota exceeded from testing AI candidate matching**

**Solution:**
1. **Wait 4-6 hours** (until midnight UTC)
2. **OR** Get new API key from different Google account
3. **OR** Enable billing (costs almost nothing)

To check when quota resets:
```bash
# Current UTC time
date -u
# Quota resets at: 00:00 UTC (midnight)
```

---

## 📞 Need Help?

If none of these solutions work, check:
1. ✅ Backend is running (`http://localhost:5001/health`)
2. ✅ `.env` file exists in `backend/` directory
3. ✅ `GEMINI_API_KEY` is set (not empty)
4. ✅ Backend console shows "✅ .env file loaded"
5. ✅ No red error messages in backend console

**Debug command:**
```bash
# Check if .env is loaded
cd backend
cat .env | grep GEMINI_API_KEY
# Should show: GEMINI_API_KEY=AIza...

# Restart backend with debug
npm start
# Watch for errors when clicking "Generate with AI"
```

---

## 🎯 Summary

**Problem:** AI job description generation showing "service unavailable"

**Most Likely Cause:** 🔴 **Gemini API quota exceeded (50 requests/day)**

**Quick Solution:** 
1. Wait for quota reset (midnight UTC)
2. OR get new API key from different account
3. OR enable billing (very cheap: ~$0.025 per 100 descriptions)

**Temporary Workaround:** ✅ Use the template (already working automatically)

