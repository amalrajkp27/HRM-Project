# 🚀 Vercel Frontend Deployment Guide

## ✅ Complete Configuration for Vercel

### 📋 **Quick Reference**

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Create React App |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install` |
| **Node Version** | 18.x (or latest LTS) |

---

## 🔧 **Step-by-Step Deployment**

### Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your GitHub repository
4. If not connected, authorize Vercel to access your GitHub

---

### Step 3: Configure Project Settings

#### **Framework Preset**
- Select: **Create React App**
- Vercel will auto-detect this

#### **Root Directory**
⚠️ **IMPORTANT:** Set this to `frontend`

Click **"Edit"** next to Root Directory and enter:
```
frontend
```

#### **Build Settings**
These should auto-populate, but verify:

- **Build Command:**
  ```bash
  npm run build
  ```

- **Output Directory:**
  ```
  build
  ```

- **Install Command:**
  ```bash
  npm install
  ```

---

### Step 4: Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` | Production |

**Example:**
```
Name: REACT_APP_API_URL
Value: https://hrm-backend-abc123.onrender.com/api
```

⚠️ **Important:** Replace `your-backend-url` with your actual Render backend URL!

---

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Vercel will show you the deployment URL

---

## 🔍 **Troubleshooting Common Issues**

### ❌ **Error: "No Output Directory named 'build' found"**

**Cause:** Root Directory not set to `frontend`

**Fix:**
1. Go to Project Settings → General
2. Find **"Root Directory"**
3. Click **"Edit"**
4. Enter: `frontend`
5. Click **"Save"**
6. Redeploy from Deployments tab

---

### ❌ **Error: "Build failed with exit code 1"**

**Possible Causes & Fixes:**

#### 1. **Missing dependencies**
```bash
# Locally test the build
cd frontend
npm install
npm run build
```

If it fails locally, fix the errors first.

#### 2. **Node version mismatch**
Add to `frontend/package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 3. **Environment variable missing**
Make sure `REACT_APP_API_URL` is set in Vercel Environment Variables.

---

### ❌ **Error: "Module not found"**

**Fix:** Check all imports in your React files are correct:
```javascript
// ✅ Correct
import Dashboard from './pages/Dashboard';

// ❌ Wrong
import Dashboard from './Pages/Dashboard'; // Case sensitive!
```

---

### ❌ **Blank page after deployment**

**Causes:**
1. API URL not set correctly
2. CORS issues
3. Console errors

**Fix:**
1. Open browser console (F12)
2. Check for errors
3. Verify `REACT_APP_API_URL` is correct
4. Check backend CORS allows your Vercel domain

---

## 🔄 **Redeploying After Changes**

### Method 1: Automatic (Recommended)
- Push to GitHub → Vercel auto-deploys
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Method 2: Manual
1. Go to Vercel Dashboard
2. Click your project
3. Go to **"Deployments"** tab
4. Click **"Redeploy"** on latest deployment

---

## ⚙️ **Advanced Configuration**

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

### Build & Development Settings

If you need custom settings, add `vercel.json` in **root directory** (not frontend):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

⚠️ **Note:** Usually not needed if Root Directory is set correctly!

---

## 🔐 **Security Best Practices**

### 1. Environment Variables
- ✅ Use environment variables for API URLs
- ❌ Never hardcode URLs in code
- ✅ Different URLs for development/production

### 2. CORS Configuration
Update your backend `.env`:
```env
FRONTEND_URL=https://your-app.vercel.app
```

Update backend `server.js`:
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
```

### 3. API Keys
- ❌ Never expose API keys in frontend
- ✅ All sensitive operations on backend
- ✅ Use environment variables

---

## 📊 **Vercel Dashboard Features**

### Analytics
- View page views
- Performance metrics
- User locations

### Logs
- Real-time deployment logs
- Runtime logs
- Error tracking

### Preview Deployments
- Every branch gets a preview URL
- Test before merging to main

---

## 🎯 **Complete Deployment Checklist**

### Before Deployment:
- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] All features tested locally

### Vercel Configuration:
- [ ] Root Directory set to `frontend`
- [ ] Framework Preset: Create React App
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `build`
- [ ] Environment Variable `REACT_APP_API_URL` added

### After Deployment:
- [ ] Deployment successful (green checkmark)
- [ ] Visit deployment URL
- [ ] Test login/register
- [ ] Test job posting
- [ ] Test application submission
- [ ] Check browser console for errors
- [ ] Test on mobile device

### Backend Configuration:
- [ ] Update `FRONTEND_URL` in Render
- [ ] Restart backend service
- [ ] Test CORS is working

---

## 🆘 **Getting Help**

### Check Deployment Logs
1. Go to Vercel Dashboard
2. Click your project
3. Click **"Deployments"**
4. Click on failed deployment
5. Read the build logs

### Common Log Messages

**"Error: Cannot find module 'react-scripts'"**
```bash
# Fix: Add to package.json devDependencies
"devDependencies": {
  "react-scripts": "5.0.1"
}
```

**"Error: ENOENT: no such file or directory"**
- Check file paths are correct
- Check case sensitivity (Mac vs Linux)

**"Error: Failed to compile"**
- Check for syntax errors
- Run `npm run build` locally first

---

## 📝 **Environment Variables Reference**

### Development (.env.local)
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Production (Vercel Dashboard)
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

### Accessing in Code
```javascript
const API_URL = process.env.REACT_APP_API_URL;

// Example usage
axios.get(`${API_URL}/jobs`);
```

---

## 🚀 **Performance Optimization**

### 1. Build Optimization
Already configured in `package.json`:
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

This automatically:
- Minifies JavaScript
- Optimizes images
- Creates production build
- Generates source maps

### 2. Caching
Vercel automatically:
- Caches static assets
- Uses CDN for fast delivery
- Enables gzip compression

### 3. Code Splitting
React automatically splits code by routes.

---

## 📱 **Testing Your Deployment**

### 1. Basic Functionality
```
✅ Homepage loads
✅ Login works
✅ Register works
✅ Dashboard loads
✅ Job posting works
✅ Application submission works
✅ Email notifications work
```

### 2. API Connection
Open browser console and check:
```javascript
// Should show your Render URL
console.log(process.env.REACT_APP_API_URL);
```

### 3. Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action (login, etc.)
4. Check requests go to correct backend URL

---

## 🎉 **Success!**

Your frontend should now be live at:
```
https://your-project-name.vercel.app
```

### Next Steps:
1. ✅ Custom domain (optional)
2. ✅ Enable analytics
3. ✅ Set up monitoring
4. ✅ Share with users!

---

## 📞 **Support**

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Community:** https://github.com/vercel/vercel/discussions

---

**Last Updated:** October 7, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
