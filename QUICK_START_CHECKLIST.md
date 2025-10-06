# 🚀 Quick Start Checklist

Follow this checklist to get your HRM application up and running in minutes!

## ☑️ Pre-Setup Checklist

- [ ] Node.js installed (v14 or higher)
  - Check: `node --version`
- [ ] npm installed
  - Check: `npm --version`
- [ ] MongoDB installed or MongoDB Atlas account created
  - Local: Check MongoDB is running
  - Atlas: Have connection string ready

## 📦 Step 1: Install Dependencies (5 minutes)

```bash
# Navigate to project
cd /Users/instavc/hrm_project

# Install all dependencies
npm run install-all
```

**Checklist:**
- [ ] Backend dependencies installed (backend/node_modules exists)
- [ ] Frontend dependencies installed (frontend/node_modules exists)
- [ ] No installation errors

## ⚙️ Step 2: Configure Environment (2 minutes)

### Backend Configuration

**File**: `.env` (in project root)

- [ ] Open `.env` file
- [ ] Update `MONGODB_URI` with your MongoDB connection string
- [ ] Update `JWT_SECRET` with a secure random string (optional but recommended)

**Example MongoDB URIs:**

Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/hrm_database
```

MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrm_database
```

### Frontend Configuration

**File**: `frontend/.env`

- [ ] Verify `REACT_APP_API_URL=http://localhost:5000/api` exists
- [ ] No changes needed if running locally

## 🏃 Step 3: Start the Application (2 minutes)

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

**Verify:**
- [ ] Server starts without errors
- [ ] See message: "Server is running on port 5000"
- [ ] See message: "MongoDB Connected: ..."
- [ ] Visit: http://localhost:5000/health
  - Should show: `{"status":"OK","message":"Server is running"}`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm start
```

**Verify:**
- [ ] React app compiles successfully
- [ ] Browser opens automatically to http://localhost:3000
- [ ] Login page displays correctly

## ✅ Step 4: Test the Application (3 minutes)

### Test User Registration

1. [ ] Go to http://localhost:3000
2. [ ] Click "Register here" link
3. [ ] Fill in the registration form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
4. [ ] Click "Register" button
5. [ ] Verify success toast notification appears
6. [ ] Verify redirected to Dashboard

### Test Dashboard

1. [ ] Verify user name appears in navbar
2. [ ] Verify user role displayed (should be "employee")
3. [ ] Verify 6 feature cards displayed:
   - Employee Management
   - Leave Management
   - Attendance
   - Payroll
   - Department Management
   - Reports
4. [ ] All cards show "Coming Soon" badge

### Test Logout

1. [ ] Click "Logout" button in navbar
2. [ ] Verify redirected to login page
3. [ ] Verify user logged out

### Test Login

1. [ ] On login page, enter:
   - Email: test@example.com
   - Password: test123
2. [ ] Click "Login" button
3. [ ] Verify success toast notification
4. [ ] Verify redirected to Dashboard
5. [ ] Verify user information displayed

### Test Protected Routes

1. [ ] While logged in, note the current URL
2. [ ] Click "Logout"
3. [ ] Try to visit dashboard URL directly: http://localhost:3000/
4. [ ] Verify redirected back to login page
5. [ ] Log in again
6. [ ] Verify can access dashboard

## 🧪 Step 5: API Testing (Optional)

### Test with cURL or Postman

**Health Check:**
```bash
curl http://localhost:5000/health
```
Expected: `{"status":"OK","message":"Server is running"}`

**Register API:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "API",
    "lastName": "Test",
    "email": "api@test.com",
    "password": "test123"
  }'
```
Expected: User object with token

**Login API:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "password": "test123"
  }'
```
Expected: User object with token

- [ ] Health check returns OK
- [ ] Register API works
- [ ] Login API works

## 🔍 Step 6: Verify MongoDB Data (Optional)

### Using MongoDB Compass or CLI

**Check Database:**
- [ ] Database `hrm_database` created
- [ ] Collection `users` exists
- [ ] Test user document exists in users collection
- [ ] Password is hashed (not plain text)

### MongoDB Shell Commands:
```bash
# Connect to MongoDB
mongosh

# Switch to hrm database
use hrm_database

# List all users
db.users.find()

# Count users
db.users.countDocuments()
```

## 📋 Troubleshooting Checklist

### Backend Issues

**MongoDB Connection Error:**
- [ ] MongoDB service is running
- [ ] Connection string is correct in `.env`
- [ ] Network access allowed (MongoDB Atlas)
- [ ] Whitelist IP address (MongoDB Atlas)

**Port 5000 Already in Use:**
- [ ] Change `PORT=5001` in `.env`
- [ ] Update `REACT_APP_API_URL` in `frontend/.env` accordingly

**JWT Error:**
- [ ] `JWT_SECRET` is set in `.env`
- [ ] `.env` file is in project root, not in backend folder

### Frontend Issues

**Port 3000 Already in Use:**
- [ ] Close other React apps
- [ ] Or start with different port: `PORT=3001 npm start`

**Cannot Connect to Backend:**
- [ ] Backend is running on port 5000
- [ ] Check browser console for errors
- [ ] Verify `REACT_APP_API_URL` in `frontend/.env`

**Page Not Loading:**
- [ ] Clear browser cache
- [ ] Hard refresh (Ctrl/Cmd + Shift + R)
- [ ] Try incognito/private window

### General Issues

**Dependencies Installation Failed:**
- [ ] Delete `node_modules` folders
- [ ] Delete `package-lock.json` files
- [ ] Run `npm install` again
- [ ] Check Node.js version

**Module Not Found Errors:**
- [ ] Run `npm install` in both backend and frontend
- [ ] Restart the servers

## 🎉 Success Criteria

You've successfully set up the HRM application if:

✅ Backend server running without errors
✅ Frontend app running without errors
✅ MongoDB connected successfully
✅ Can register new user
✅ Can login with credentials
✅ Can view dashboard after login
✅ Can logout successfully
✅ Protected routes working
✅ Toast notifications appearing
✅ No console errors

## 📚 Next Steps After Setup

1. [ ] Read `README.md` for detailed documentation
2. [ ] Review `ARCHITECTURE.md` to understand the system
3. [ ] Check `FEATURES_ROADMAP.md` for upcoming features
4. [ ] Start implementing Employee Management module
5. [ ] Customize the UI/branding as needed

## 🔧 Development Workflow

### Daily Development Routine

1. [ ] Start MongoDB (if local)
2. [ ] Start backend: `cd backend && npm run dev`
3. [ ] Start frontend: `cd frontend && npm start`
4. [ ] Make changes
5. [ ] Test changes
6. [ ] Commit to git

### Before Committing Code

- [ ] Test all functionality
- [ ] Check for console errors
- [ ] Check for linting errors
- [ ] Update documentation if needed
- [ ] Write descriptive commit message

## 📊 Project Status

- ✅ Project structure created
- ✅ Backend setup complete
- ✅ Frontend setup complete
- ✅ Authentication working
- ✅ Database connected
- ✅ Basic UI implemented
- 📋 Ready for feature development

## 🎯 Your Current Position

You are here: **Phase 1 Complete ✅**

Next: **Phase 2 - Employee Management**

Progress: █████░░░░░░░░░░░░░░░ 25%

## 💡 Pro Tips

1. Keep both terminals (backend & frontend) visible
2. Watch for errors in real-time
3. Use MongoDB Compass for visual database management
4. Install React Developer Tools browser extension
5. Use Postman for API testing
6. Keep `.env` files private (never commit to git)
7. Backup your database regularly

## 📝 Notes Section

Use this space to track your setup experience:

**Setup Date:** ___________

**Issues Encountered:**
- 
- 

**Solutions Applied:**
- 
- 

**Customizations Made:**
- 
- 

**MongoDB Connection Type:**
- [ ] Local MongoDB
- [ ] MongoDB Atlas

---

## ✨ Congratulations!

If you've checked all the boxes above, your HRM application is successfully set up and ready for feature development!

Need help? Refer to:
- `README.md` - Complete documentation
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `ARCHITECTURE.md` - System architecture
- `FEATURES_ROADMAP.md` - Features to implement

Happy Coding! 🚀

