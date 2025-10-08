# 🦙 Ollama AI Migration Guide

## Overview
You've successfully migrated from Google Gemini AI to **Ollama** (self-hosted LLM). This gives you:
- ✅ **No API quotas** - unlimited requests
- ✅ **No costs** - completely free
- ✅ **Better privacy** - data doesn't leave your infrastructure
- ✅ **Faster responses** - local/dedicated server

---

## 🔧 Configuration

### **Step 1: Update `.env` File**

Add these lines to `backend/.env`:

```env
# Ollama Configuration (Self-hosted AI)
USE_OLLAMA=true
OLLAMA_BASE_URL=http://13.204.94.103:11434
OLLAMA_MODEL=llama2

# Optional: Keep Gemini as fallback (comment out if not needed)
# GEMINI_API_KEY=your_gemini_key_here
```

### **Step 2: Choose Your Model**

Ollama supports many models. Update `OLLAMA_MODEL` based on your needs:

| Model | Best For | Size | Speed |
|-------|----------|------|-------|
| **llama2** | General purpose, balanced | ~4GB | Fast |
| **llama2:13b** | Better quality, slower | ~7GB | Medium |
| **mistral** | Fast, efficient | ~4GB | Very Fast |
| **codellama** | Technical content | ~4GB | Fast |
| **neural-chat** | Conversational | ~4GB | Fast |
| **gemma:7b** | Google's open model | ~5GB | Fast |

**Recommended for HRM:**
- `llama2` - Good balance for job descriptions and resume parsing
- `mistral` - Faster responses, good quality
- `llama2:13b` - Best quality if you have the resources

### **Step 3: Verify Ollama Server**

Make sure your Ollama server is running:

```bash
# Test connection
curl http://13.204.94.103:11434/api/tags

# Should return a list of available models
```

### **Step 4: Restart Backend**

```bash
cd backend
npm start
```

You should see:
```
🦙 Using Ollama AI Service
🦙 Resume Parser using Ollama AI
🦙 AI Matching using Ollama AI
✅ .env file loaded
🚀 Server is running on 0.0.0.0:5001
```

---

## ✅ What's Changed

### **All AI Features Now Use Ollama:**

1. ✅ **Job Description Generation** - Uses Ollama instead of Gemini
2. ✅ **Resume Parsing** - Extracts data from resumes via Ollama
3. ✅ **Candidate Matching** - AI ranking uses Ollama

### **Backward Compatible:**

The code automatically detects which AI service to use:
- If `OLLAMA_BASE_URL` is set → Uses Ollama 🦙
- If `OLLAMA_BASE_URL` is NOT set → Uses Gemini 🤖

This means you can easily switch back if needed!

---

## 🧪 Testing

### **Test 1: Job Description Generation**

1. Go to http://localhost:3000
2. Login → Job Postings → Create New Job
3. Fill in basic info:
   - Job Title: "Backend Developer"
   - Department: "Engineering"
   - Location: "Remote"
   - Employment Type: "Full-time"
   - Experience Level: "Mid-level"
   - Salary Range: "$80k-$120k"
   - Application Deadline: (any date)
4. Click **"🤖 Generate with AI"**
5. Check backend console for: `🦙 Calling Ollama at http://13.204.94.103:11434`
6. Should see: "✅ Job description generated successfully!"

### **Test 2: Resume Parsing**

1. Go to any public job page
2. Click "Apply Now"
3. Upload a resume (PDF or DOCX)
4. Check backend console for: `🦙 Resume Parser using Ollama AI`
5. Form fields should auto-fill

### **Test 3: Candidate Matching**

1. Go to Job Postings
2. Find a job with applicants
3. Click **"🎯 Find Best 3"**
4. Check backend console for: `🦙 AI Matching using Ollama AI`
5. Should see top 3 candidates ranked

---

## 🔍 Troubleshooting

### **Issue: "Cannot connect to Ollama server"**

**Check:**
```bash
# Is Ollama server running?
curl http://13.204.94.103:11434/api/tags

# If connection refused:
# - Verify the IP address is correct
# - Check if firewall is blocking port 11434
# - Ensure Ollama server is running
```

**Fix:**
```bash
# If you need to start Ollama locally:
ollama serve

# Or check your server's status
ssh user@13.204.94.103
systemctl status ollama  # if using systemd
```

### **Issue: "Model not found"**

**Check available models:**
```bash
curl http://13.204.94.103:11434/api/tags
```

**Pull a new model:**
```bash
# On your Ollama server
ollama pull llama2
ollama pull mistral
ollama pull codellama
```

### **Issue: Slow responses**

**Ollama** can be slower than Gemini depending on your server specs.

**Solutions:**
1. Use a faster model: `mistral` or `llama2:7b`
2. Upgrade server CPU/RAM
3. Use GPU acceleration if available
4. Reduce prompt length (already optimized in code)

---

## 📊 Performance Comparison

| Feature | Gemini (Cloud) | Ollama (Self-hosted) |
|---------|----------------|----------------------|
| **Cost** | $0.00025/request (after free tier) | $0 (free) |
| **Quota** | 50/day (free), 1500/day (paid) | ∞ unlimited |
| **Speed** | ~2-5 seconds | ~5-15 seconds |
| **Privacy** | Data sent to Google | Data stays on your server |
| **Quality** | Excellent | Very Good |
| **Setup** | Easy (API key) | Moderate (server needed) |

---

## 🔄 Switching Back to Gemini

If you need to switch back:

```bash
# Edit backend/.env
# Comment out or remove:
# USE_OLLAMA=true
# OLLAMA_BASE_URL=http://13.204.94.103:11434

# Uncomment:
GEMINI_API_KEY=your_gemini_key_here

# Restart backend
npm start
```

The code will automatically detect and use Gemini.

---

## 🚀 Advanced Configuration

### **Use Different Models for Different Features**

You can customize which model to use for each feature:

```env
# In backend/.env
OLLAMA_BASE_URL=http://13.204.94.103:11434

# Default model for all features
OLLAMA_MODEL=llama2

# Feature-specific models (optional)
OLLAMA_JOB_DESCRIPTION_MODEL=mistral
OLLAMA_RESUME_PARSER_MODEL=llama2
OLLAMA_MATCHING_MODEL=llama2:13b
```

Then update each service file to read the specific env variable.

### **Health Check Endpoint**

Add this to test Ollama connectivity:

```javascript
// In backend/server.js
app.get('/health/ollama', async (req, res) => {
  const { checkHealth } = require('./src/services/ollamaService');
  const isHealthy = await checkHealth();
  res.json({ 
    ollama: isHealthy ? 'connected' : 'disconnected',
    url: process.env.OLLAMA_BASE_URL 
  });
});
```

Test: `curl http://localhost:5001/health/ollama`

---

## 📝 Code Changes Summary

### **Files Modified:**

1. ✅ `backend/src/services/ollamaService.js` - **NEW** - Ollama API wrapper
2. ✅ `backend/src/services/aiService.js` - Auto-switch between Gemini/Ollama
3. ✅ `backend/src/services/resumeParserService.js` - Auto-switch between Gemini/Ollama
4. ✅ `backend/src/services/aiMatchingService.js` - Auto-switch between Gemini/Ollama

### **Environment Variables Added:**

```env
USE_OLLAMA=true                          # Enable Ollama
OLLAMA_BASE_URL=http://13.204.94.103:11434  # Ollama server URL
OLLAMA_MODEL=llama2                      # Default model
```

### **No Frontend Changes Needed:**

The frontend doesn't know or care which AI service is used - it just calls the same APIs!

---

## 🎯 Benefits Achieved

### **Before (Gemini):**
- ❌ 50 requests/day limit
- ❌ Quota errors
- ❌ Costs after free tier
- ⏳ Wait for quota reset

### **After (Ollama):**
- ✅ Unlimited requests
- ✅ No quota errors
- ✅ Completely free
- ✅ Better privacy
- ✅ No external dependencies

---

## 📞 Support

If you encounter issues:

1. **Check Ollama server status:**
   ```bash
   curl http://13.204.94.103:11434/api/tags
   ```

2. **Check backend logs:**
   ```bash
   # Should see:
   🦙 Using Ollama AI Service
   🦙 Calling Ollama at http://13.204.94.103:11434
   ✅ Ollama response received
   ```

3. **Test with curl:**
   ```bash
   curl -X POST http://13.204.94.103:11434/api/generate \
     -d '{"model":"llama2","prompt":"Hello","stream":false}'
   ```

4. **Fallback to Gemini temporarily:**
   ```bash
   # Comment out in .env:
   # USE_OLLAMA=true
   # Restart backend
   ```

---

## ✨ Summary

You've successfully migrated to Ollama! 🎉

- **No more quota limits** - Generate unlimited job descriptions
- **No more costs** - Completely free forever
- **Better privacy** - Data stays on your infrastructure
- **Easy to switch back** - Just toggle `USE_OLLAMA=true/false`

Enjoy your AI-powered HRM system without limitations! 🚀

