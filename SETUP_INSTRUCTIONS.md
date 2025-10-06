# Quick Setup Instructions

Follow these steps to get your HRM application running:

## Step 1: Install Dependencies

```bash
# From the project root directory
npm run install-all
```

This will install all dependencies for both backend and frontend.

## Step 2: Configure MongoDB Connection

Edit the `.env` file in the root directory and add your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string_here
```

### MongoDB Connection Options:

**Option A: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/hrm_database
```

**Option B: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrm_database?retryWrites=true&w=majority
```

To get MongoDB Atlas connection string:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

## Step 3: Update JWT Secret (Optional but Recommended)

In the `.env` file, change the JWT secret to something secure:

```env
JWT_SECRET=your_unique_secret_key_here
```

## Step 4: Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Step 6: Test the Application

1. Go to http://localhost:3000
2. Click "Register here" to create a new account
3. Fill in the registration form
4. After registration, you'll be automatically logged in
5. You'll see the dashboard with upcoming feature cards

## Troubleshooting

### Backend won't start
- Make sure MongoDB is running and accessible
- Check your MongoDB connection string
- Verify all dependencies are installed: `cd backend && npm install`

### Frontend won't start
- Verify all dependencies are installed: `cd frontend && npm install`
- Check if port 3000 is already in use

### Can't connect to backend
- Make sure backend is running on port 5000
- Check `frontend/.env` has correct API URL

## Next Steps

After successful setup, you can start implementing features:

1. Employee Management
2. Leave Management
3. Attendance System
4. Payroll Management
5. Department Management
6. Reports & Analytics

Refer to `README.md` for detailed documentation.

