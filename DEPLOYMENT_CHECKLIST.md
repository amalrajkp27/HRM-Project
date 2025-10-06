# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] Have GitHub account
- [ ] Have MongoDB connection string
- [ ] Have JWT secret
- [ ] Have Gemini API key
- [ ] Code is working on localhost

---

## 📦 Part 1: GitHub (5 minutes)

- [ ] **Step 1.1:** Create GitHub account (if needed)
- [ ] **Step 1.2:** Create new repository "hrm-application" (PUBLIC)
- [ ] **Step 1.3:** Run: `git init`
- [ ] **Step 1.4:** Run: `git add .`
- [ ] **Step 1.5:** Run: `git commit -m "Initial commit"`
- [ ] **Step 1.6:** Run: `git remote add origin [YOUR_REPO_URL]`
- [ ] **Step 1.7:** Run: `git push -u origin main`
- [ ] **Step 1.8:** Verify code is on GitHub

---

## 🖥️ Part 2: Backend on Render (10 minutes)

- [ ] **Step 2.1:** Go to https://render.com
- [ ] **Step 2.2:** Sign up with GitHub
- [ ] **Step 2.3:** Click "New +" → "Web Service"
- [ ] **Step 2.4:** Connect your repository
- [ ] **Step 2.5:** Configure:
  - [ ] Name: `hrm-backend`
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `node server.js`
  - [ ] Instance Type: `Free`
- [ ] **Step 2.6:** Add environment variables:
  - [ ] `PORT` = `5001`
  - [ ] `NODE_ENV` = `production`
  - [ ] `MONGODB_URI` = [your MongoDB connection string]
  - [ ] `JWT_SECRET` = [your JWT secret]
  - [ ] `GEMINI_API_KEY` = [your Gemini API key]
- [ ] **Step 2.7:** Click "Create Web Service"
- [ ] **Step 2.8:** Wait for deployment (5-10 min)
- [ ] **Step 2.9:** Copy your backend URL
- [ ] **Step 2.10:** Test: Visit `https://YOUR-BACKEND-URL.onrender.com/health`
- [ ] **Step 2.11:** Verify you see: `{"status":"OK",...}`

---

## 🌐 Part 3: Frontend on Vercel (5 minutes)

- [ ] **Step 3.1:** Go to https://vercel.com
- [ ] **Step 3.2:** Sign up with GitHub
- [ ] **Step 3.3:** Click "Add New..." → "Project"
- [ ] **Step 3.4:** Import your repository
- [ ] **Step 3.5:** Configure:
  - [ ] Framework: `Create React App`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] **Step 3.6:** Add environment variable:
  - [ ] `REACT_APP_API_URL` = `https://YOUR-BACKEND-URL.onrender.com/api`
- [ ] **Step 3.7:** Click "Deploy"
- [ ] **Step 3.8:** Wait for deployment (2-3 min)
- [ ] **Step 3.9:** Copy your frontend URL
- [ ] **Step 3.10:** Visit your app
- [ ] **Step 3.11:** Test login/register

---

## 🔧 Part 4: Post-Deployment (5 minutes)

- [ ] **Step 4.1:** Update CORS in `backend/server.js`
- [ ] **Step 4.2:** Add Vercel URL to allowed origins
- [ ] **Step 4.3:** Commit and push changes
- [ ] **Step 4.4:** Wait for auto-deployment
- [ ] **Step 4.5:** Test all features:
  - [ ] Register new user
  - [ ] Login
  - [ ] Create job posting
  - [ ] AI generation
  - [ ] Share feature
  - [ ] Public job view

---

## 📊 Part 5: MongoDB Setup

- [ ] **Step 5.1:** Go to MongoDB Atlas
- [ ] **Step 5.2:** Network Access → Add IP: `0.0.0.0/0`
- [ ] **Step 5.3:** Database Access → Verify user permissions
- [ ] **Step 5.4:** Test connection from deployed backend

---

## 🔍 Part 6: Google Search Console (Optional)

- [ ] **Step 6.1:** Go to https://search.google.com/search-console/
- [ ] **Step 6.2:** Add property (your Vercel URL)
- [ ] **Step 6.3:** Verify ownership
- [ ] **Step 6.4:** Submit sitemap (if available)
- [ ] **Step 6.5:** Wait 7-14 days for indexing

---

## ✅ Final Verification

- [ ] Frontend is accessible
- [ ] Backend is responding
- [ ] Can register new user
- [ ] Can login
- [ ] Can create job posting
- [ ] AI generation works
- [ ] Share feature works
- [ ] Public job pages work
- [ ] All features functional

---

## 🎉 Deployment Complete!

**Your URLs:**
- Frontend: `https://hrm-application.vercel.app`
- Backend: `https://hrm-backend.onrender.com`

**Next Steps:**
- Share your app with users
- Monitor performance
- Add more features
- Submit to Google for indexing

---

## 📝 Notes

**Important URLs:**
- GitHub: https://github.com/YOUR_USERNAME/hrm-application
- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://cloud.mongodb.com

**Support:**
- If you get stuck, refer to DEPLOYMENT_GUIDE.md
- Check troubleshooting section
- Ask for help if needed!

---

**Total Time:** ~30 minutes  
**Total Cost:** $0  
**Status:** Production Ready! 🚀
