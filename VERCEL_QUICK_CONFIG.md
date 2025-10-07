# ⚡ Vercel Deployment - Quick Config

## 🎯 **Copy-Paste Configuration**

### Vercel Project Settings

```
Root Directory:        frontend
Framework Preset:      Create React App
Build Command:         npm run build
Output Directory:      build
Install Command:       npm install
Node Version:          18.x
```

---

## 🔧 **Environment Variables**

Add in Vercel Dashboard → Settings → Environment Variables:

```
Name:  REACT_APP_API_URL
Value: https://your-backend-url.onrender.com/api
```

**Example:**
```
REACT_APP_API_URL=https://hrm-backend-abc123.onrender.com/api
```

---

## 📝 **package.json Check**

Your `frontend/package.json` should have:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "devDependencies": {
    "react-scripts": "5.0.1"
  }
}
```

✅ **Already configured correctly!**

---

## 🚨 **Common Fixes**

### If build fails:

1. **Check Root Directory:**
   - Must be set to `frontend`
   - Not `./frontend` or `/frontend`
   - Just: `frontend`

2. **Test build locally:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Check Environment Variable:**
   - Name must start with `REACT_APP_`
   - Value must be your backend URL
   - Must end with `/api`

---

## ✅ **Deployment Steps**

1. Push code to GitHub
2. Import to Vercel
3. Set Root Directory to `frontend`
4. Add environment variable
5. Deploy!

---

## 🔗 **After Deployment**

Update backend `.env` on Render:

```env
FRONTEND_URL=https://your-app.vercel.app
```

Then restart backend service.

---

## 📞 **Need Help?**

Check full guide: `VERCEL_DEPLOYMENT_GUIDE.md`
