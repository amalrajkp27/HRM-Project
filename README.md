# Human Resource Management System (HRM)

A comprehensive full-stack Human Resource Management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Future Features](#future-features)

## 🎯 Project Overview

This HRM system is designed to streamline and automate human resource management processes within organizations. The application provides a centralized platform for managing employees, tracking attendance, handling leave requests, processing payroll, and generating reports.

## ✨ Features

### Currently Implemented

- **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin, HR Manager, Employee, Department Head)
  - Secure password hashing with bcrypt
  - Protected routes and authorization middleware

- **User Management**
  - User profile management
  - Role assignment
  - User status management (active/inactive)

- **Job Posting Module** ✨ 
  - Job posting creation form with comprehensive fields
  - Job listings with filtering capabilities
  - Filter by Department, Status, and Employment Type
  - Search functionality for job titles
  - Job cards displaying key information
  - Action buttons: View Details, View Applicants, Edit, Delete
  - Tab-based interface (List View / Create New)
  - Responsive design with professional UI
  - Status badges (Active/Closed/Draft)
  - Form validation for required fields
  - Draft and Publish options
  - Full CRUD operations with MongoDB backend
  - **AI-Powered Job Description Generator** 🤖
    - Generate comprehensive job descriptions with 7 required fields
    - Powered by Google Gemini AI (gemini-2.0-flash-exp model)
    - Auto-fills: Job Description, Responsibilities, Requirements, Skills, Benefits
    - Beautiful gradient UI with floating animation
    - Real-time generation with loading states
    - Fallback mode if AI service is unavailable
    - Smart validation and error handling
    - Toast notifications for user feedback
  - **Multi-Platform Job Sharing** 🚀
    - Share to multiple platforms at once (LinkedIn, Twitter, Facebook, WhatsApp, Email, Telegram)
    - Multi-select checkbox interface
    - Opens all selected platforms simultaneously
    - Pre-filled content for each platform
    - Copy link to clipboard
    - Beautiful modal UI with platform icons
    - Public job view page (no authentication required)
    - Mobile responsive design
  - **Google for Jobs Integration** 🔍
    - Structured data (JSON-LD) for Google indexing
    - Jobs appear in Google search results automatically
    - SEO meta tags for better visibility
    - Open Graph and Twitter Card support
    - Zero cost, massive reach
    - Automatic generation for all jobs

- **Application Tracking System (ATS)** 🎯 ✨ NEW
  - **Candidate Application Portal**
    - Professional application form with resume upload
    - Support for PDF, DOC, DOCX formats (max 5MB)
    - Personal information collection (name, email, phone)
    - Professional details (current company, experience, salary expectations)
    - Cover letter support (up to 2000 characters)
    - LinkedIn and portfolio URL fields
    - Notice period selection
    - Real-time form validation
    - Duplicate application prevention
    - Mobile-responsive design
  - **Resume Management**
    - Cloud storage integration with Cloudinary
    - Secure file upload with validation
    - Direct resume download/view
    - File metadata tracking (size, type, upload date)
  - **Applicant Dashboard for Recruiters**
    - View all applications across all jobs
    - Filter by job position
    - Filter by application status
    - Real-time statistics dashboard
    - Application count by status
    - Recent applications feed
  - **Application Management**
    - Detailed applicant profiles
    - 6-stage application workflow:
      - Pending → Reviewing → Shortlisted → Interview Scheduled → Rejected/Hired
    - Status update with one click
    - 5-star rating system for candidates
    - Internal notes system for recruiters
    - Application timeline tracking
    - Bulk actions support
  - **Advanced Features**
    - Email validation and duplicate detection
    - IP address tracking for security
    - Application source tracking (direct, LinkedIn, Indeed, referral)
    - Automatic applicant count updates
    - Application deadline enforcement
    - MongoDB indexing for fast queries
    - RESTful API with comprehensive endpoints
  - **Email Notification System** 📧 ✨ NEW
    - Automated email notifications to candidates
    - Professional HTML email templates
    - Status-based email triggers:
      - Application received confirmation
      - Application under review notification
      - Shortlisted congratulations email
      - Interview scheduled notification
      - Rejection notification (professional & respectful)
      - Job offer congratulations email
    - Support for multiple email services (Gmail, SendGrid, Custom SMTP)
    - Non-blocking email sending (doesn't delay API responses)
    - Customizable company branding in emails

### 🚀 Upcoming Features

- **Employee Management**
  - Complete employee profiles
  - Employee onboarding/offboarding
  - Document management
  - Performance tracking

- **Leave Management**
  - Leave application system
  - Approval workflow
  - Leave balance tracking
  - Leave calendar

- **Attendance Management**
  - Clock in/out system
  - Attendance tracking
  - Timesheet management
  - Overtime calculation

- **Payroll Management**
  - Salary structure
  - Payslip generation
  - Tax calculations
  - Bonus and deductions

- **Department Management**
  - Department creation and management
  - Team organization
  - Department hierarchy

- **Reports & Analytics**
  - Employee reports
  - Attendance reports
  - Leave reports
  - Payroll reports
  - Dashboard analytics

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **React Icons** - Icon library
- **Context API** - State management

## 📁 Project Structure

```
hrm_project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection configuration
│   │   │   └── constants.js         # Application constants and enums
│   │   ├── controllers/
│   │   │   └── authController.js    # Authentication logic
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification & authorization
│   │   │   └── errorHandler.js      # Global error handling
│   │   ├── models/
│   │   │   └── User.js              # User schema and model
│   │   ├── routes/
│   │   │   └── authRoutes.js        # Authentication routes
│   │   ├── services/                # Business logic layer (future)
│   │   └── utils/
│   │       └── generateToken.js     # JWT token generation utility
│   ├── server.js                    # Application entry point
│   └── package.json                 # Backend dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html               # HTML template
│   ├── src/
│   │   ├── assets/                  # Images, fonts, etc.
│   │   ├── components/
│   │   │   └── PrivateRoute.js      # Protected route component
│   │   ├── context/
│   │   │   └── AuthContext.js       # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── JobPosting.js        # Job posting module ✨ NEW
│   │   │   ├── NotFound.js          # 404 page
│   │   │   ├── Auth.css             # Auth pages styling
│   │   │   ├── Dashboard.css        # Dashboard styling
│   │   │   ├── JobPosting.css       # Job posting styling ✨ NEW
│   │   │   └── NotFound.css         # 404 page styling
│   │   ├── services/
│   │   │   └── api.js               # API service with axios
│   │   ├── utils/                   # Utility functions
│   │   ├── App.js                   # Root component
│   │   ├── App.css                  # Global styles
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Base styles
│   ├── .env                         # Frontend environment variables
│   └── package.json                 # Frontend dependencies
│
├── .env                             # Backend environment variables
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── package.json                     # Root package.json with scripts
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

### Installation

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd /Users/instavc/hrm_project
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   Or install separately:
   ```bash
   # Install backend dependencies
   npm run install-backend

   # Install frontend dependencies
   npm run install-frontend
   ```

## ⚙️ Environment Configuration

### Backend Environment Variables

Edit the `.env` file in the root directory and configure the following:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
# IMPORTANT: Replace with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/hrm_database
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrm_database

# JWT Configuration
# IMPORTANT: Change this secret in production
JWT_SECRET=your_secure_secret_key_here

# AI Configuration (for Job Description Generator)
GEMINI_API_KEY=your_gemini_api_key_here
# Get your free API key at: https://makersuite.google.com/app/apikey

# Cloud Storage Configuration (for Resume Upload)
# Get these from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (for Application Notifications)
# Choose email service: 'gmail', 'sendgrid', or 'smtp'
EMAIL_SERVICE=gmail

# Gmail Configuration (Recommended for testing)
# 1. Enable 2-Factor Authentication on your Gmail account
# 2. Generate App Password at: https://myaccount.google.com/apppasswords
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password

# SendGrid Configuration (Alternative - for production)
# Get API key at: https://app.sendgrid.com/settings/api_keys
# SENDGRID_API_KEY=your-sendgrid-api-key

# Custom SMTP Configuration (Alternative)
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-smtp-username
# SMTP_PASSWORD=your-smtp-password

# Email Sender Details
FROM_EMAIL=your-email@gmail.com
FROM_NAME=HRM Recruitment Team

# Company Details (appears in emails)
COMPANY_NAME=Your Company Name

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

The frontend `.env` file is already created in `frontend/.env`:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api
```

### 🔐 Setting Up MongoDB

**Option 1: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use: `MONGODB_URI=mongodb://localhost:27017/hrm_database`

**Option 2: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace in `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrm_database`

### 📧 Setting Up Email Notifications

The application sends automated emails to candidates when their application status changes. Here's how to set it up:

#### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication:**
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "HRM Application"
   - Click "Generate"
   - Copy the 16-digit password (remove spaces)

3. **Update .env file:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # Your 16-digit app password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=HRM Recruitment Team
   COMPANY_NAME=Your Company Name
   ```

#### Option 2: SendGrid (Recommended for Production)

1. **Create SendGrid Account:**
   - Sign up at https://sendgrid.com (free tier: 100 emails/day)
   - Verify your email address

2. **Generate API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Choose "Full Access" or "Restricted Access" (with Mail Send permission)
   - Copy the API key

3. **Update .env file:**
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=your-verified-email@yourdomain.com
   FROM_NAME=HRM Recruitment Team
   COMPANY_NAME=Your Company Name
   ```

#### Option 3: Custom SMTP

For other email providers (Outlook, Yahoo, custom domain):

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
FROM_EMAIL=your-email@example.com
FROM_NAME=HRM Recruitment Team
COMPANY_NAME=Your Company Name
```

#### Email Templates

The system automatically sends these emails:
- ✅ **Application Received** - Sent immediately when candidate applies
- 👀 **Under Review** - When recruiter changes status to "Reviewing"
- 🎉 **Shortlisted** - When candidate is shortlisted
- 📅 **Interview Scheduled** - When interview is scheduled
- 📧 **Rejected** - Professional rejection notification
- 🎊 **Job Offer** - Congratulations on being hired

All emails are professionally designed with HTML templates and your company branding.

#### Testing Email Functionality

After configuring your email credentials, test the system:

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Watch for detailed email logs in the terminal:**
   ```
   🎯 Triggering confirmation email for: John Doe (john@example.com)
   
   📧 ===== EMAIL SENDING STARTED =====
   📬 To: john@example.com
   📝 Subject: Application Received - Software Engineer
   🔧 Email Service: gmail
   👤 From: "HRM Recruitment Team" <your-email@gmail.com>
   ⏳ Sending email...
   ✅ EMAIL SENT SUCCESSFULLY!
   📨 Message ID: <unique-message-id>
   📧 ===== EMAIL SENDING COMPLETED =====
   ```

3. **Test scenarios:**
   - Submit a job application → Check for confirmation email
   - Change application status to "Reviewing" → Check for review email
   - Change status to "Shortlisted" → Check for shortlist email
   - Change status to "Interview Scheduled" → Check for interview email
   - Change status to "Hired" or "Rejected" → Check for final email

4. **Email logs indicate:**
   - ✅ **Green checkmarks** = Email sent successfully
   - ❌ **Red X marks** = Email failed (check error details)
   - 📧 **Detailed info** = Recipient, subject, service used
   - 📨 **Message ID** = Unique identifier for tracking

5. **Common issues:**
   - If email fails with "Invalid login" → Check App Password is correct
   - If no logs appear → Email credentials missing in `.env`
   - Emails in spam folder → Normal for testing, mark as "Not Spam"

#### Email Delivery Notes

- Emails are sent **asynchronously** (non-blocking) - API responds immediately
- Failed emails are logged but don't stop the application
- Check backend terminal for real-time email status
- For production, consider using SendGrid for better deliverability

## 🏃 Running the Application

### Running Backend and Frontend Separately (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Quick Start Scripts

```bash
# Install all dependencies
npm run install-all

# Run backend only
npm run backend

# Run frontend only
npm run frontend
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee" // optional: admin, hr_manager, employee, department_head
}

Response:
{
  "_id": "...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "_id": "...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "_id": "...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "employee",
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### Health Check
```http
GET /health

Response:
{
  "status": "OK",
  "message": "Server is running"
}
```

### Job Posting Endpoints

#### Create Job
```http
POST /api/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobTitle": "Senior Software Engineer",
  "department": "IT",
  "location": "San Francisco, CA",
  "employmentType": "Full-time",
  "experienceLevel": "Senior",
  "salaryRange": "$120,000 - $150,000",
  "jobDescription": "We are seeking...",
  "responsibilities": "- Lead development...",
  "requirements": "- 5+ years experience...",
  "skills": "React, Node.js, MongoDB",
  "benefits": "Health insurance, 401k...",
  "applicationDeadline": "2024-12-31"
}
```

#### Get All Jobs
```http
GET /api/jobs
Authorization: Bearer {token}
```

#### Get Public Job (No Auth Required)
```http
GET /api/jobs/public/:id
```

#### Update Job
```http
PUT /api/jobs/:id
Authorization: Bearer {token}
```

#### Delete Job
```http
DELETE /api/jobs/:id
Authorization: Bearer {token}
```

### Application Endpoints

#### Submit Application (Public - No Auth Required)
```http
POST /api/applications/apply/:jobId
Content-Type: multipart/form-data

Form Data:
- firstName: string
- lastName: string
- email: string
- phone: string
- resume: file (PDF, DOC, DOCX - max 5MB)
- coverLetter: string (optional)
- linkedinUrl: string (optional)
- portfolioUrl: string (optional)
- currentCompany: string (optional)
- yearsOfExperience: number (optional)
- expectedSalary: string (optional)
- noticePeriod: string (optional)

Response:
{
  "success": true,
  "message": "Application submitted successfully!",
  "data": {
    "applicationId": "...",
    "appliedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get All Applications
```http
GET /api/applications
Authorization: Bearer {token}
Query Parameters:
- status: pending|reviewing|shortlisted|interview-scheduled|rejected|hired
- jobId: string
- page: number
- limit: number
```

#### Get Applications by Job
```http
GET /api/applications/job/:jobId
Authorization: Bearer {token}
```

#### Get Application by ID
```http
GET /api/applications/:id
Authorization: Bearer {token}
```

#### Update Application Status
```http
PUT /api/applications/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "shortlisted"
}
```

#### Rate Application
```http
PUT /api/applications/:id/rating
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5
}
```

#### Add Note to Application
```http
POST /api/applications/:id/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Great candidate, schedule interview"
}
```

#### Get Application Statistics
```http
GET /api/applications/stats/overview
Authorization: Bearer {token}
```

### AI Endpoints

#### Generate Job Description
```http
POST /api/ai/generate-job-description
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobPosition": "Software Engineer",
  "experience": "Mid-level",
  "department": "IT",
  "location": "Remote",
  "employmentType": "Full-time",
  "salaryRange": "$80,000 - $100,000"
}
```

## 👥 User Roles

The system supports four user roles with different access levels:

1. **Admin** (`admin`)
   - Full system access
   - Manage all users and configurations
   - Access all reports and analytics

2. **HR Manager** (`hr_manager`)
   - Manage employees
   - Handle leave requests
   - Process payroll
   - Generate reports

3. **Department Head** (`department_head`)
   - Manage department employees
   - Approve leave requests
   - View department reports

4. **Employee** (`employee`)
   - View own profile
   - Apply for leave
   - View payslips
   - Mark attendance

## 🎨 Frontend Features

### Design Highlights
- Modern, clean UI with gradient backgrounds
- Responsive design (mobile-friendly)
- Toast notifications for user feedback
- Protected routes with authentication
- Context API for state management
- Role-based navigation and access

### Pages
- **Login Page** - User authentication
- **Register Page** - New user registration
- **Dashboard** - Main application hub with feature cards
- **404 Page** - Not found page

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes with middleware
- Role-based authorization
- Input validation
- Error handling middleware
- CORS configuration
- Environment variable management

## 📝 Architecture & Design Patterns

### Backend Architecture
- **MVC Pattern** - Separation of concerns
- **Middleware Pattern** - Request/response processing
- **Repository Pattern** - Data access layer (via Mongoose models)
- **Error Handling** - Centralized error handling

### Frontend Architecture
- **Component-Based** - Reusable React components
- **Context API** - Global state management
- **Service Layer** - API calls abstraction
- **Protected Routes** - Authentication guards

## 🔄 Development Workflow

### Adding New Features

1. **Backend:**
   - Create model in `backend/src/models/`
   - Create controller in `backend/src/controllers/`
   - Create routes in `backend/src/routes/`
   - Add routes to `backend/server.js`

2. **Frontend:**
   - Create components in `frontend/src/components/`
   - Create pages in `frontend/src/pages/`
   - Add API services in `frontend/src/services/`
   - Update routes in `frontend/src/App.js`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access (for Atlas)

2. **Port Already in Use**
   - Backend: Change `PORT` in `.env`
   - Frontend: Set port with `PORT=3001 npm start`

3. **CORS Issues**
   - Verify `FRONTEND_URL` in backend `.env`
   - Check CORS configuration in `server.js`

4. **JWT Token Errors**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check token expiration (default: 30 days)

5. **Email Not Sending**
   - **Check backend terminal logs** for detailed error messages
   - **"Invalid login" error:**
     - Verify you're using Gmail **App Password**, not regular password
     - Ensure 2-Factor Authentication is enabled on Gmail
     - Generate a new App Password if needed
   - **No email logs appearing:**
     - Check `.env` file has all email variables set
     - Restart backend server after updating `.env`
     - Verify `EMAIL_SERVICE=gmail` is set
   - **Emails going to spam:**
     - Normal for testing with Gmail
     - Ask recipients to mark as "Not Spam"
     - For production, use SendGrid with verified domain
   - **"Connection timeout" error:**
     - Check your internet connection
     - Verify firewall isn't blocking SMTP (port 587)
     - Try using SendGrid instead of Gmail

6. **Resume Upload Issues**
   - Verify Cloudinary credentials in `.env`
   - Check file size is under 5MB
   - Ensure file format is PDF, DOC, DOCX, or ODT

## 📦 Dependencies

### Backend Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - CORS middleware
- `multer` - File upload handling
- `cloudinary` - Cloud storage for resumes
- `nodemailer` - Email sending (supports Gmail, SendGrid, SMTP)
- `@google/generative-ai` - AI-powered job description generation

### Frontend Dependencies
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-toastify` - Notifications
- `react-icons` - Icons

## 🚀 Next Steps

After setting up the project, you can start implementing features in this order:

1. ✅ Authentication System (Completed)
2. ✅ Job Posting Module (Completed)
3. ✅ Application Tracking System (Completed)
4. ✅ Resume Upload & Cloud Storage (Completed)
5. ✅ Email Notification System (Completed)
6. ✅ AI Job Description Generator (Completed)
7. 📝 Employee Management Module
8. 📅 Leave Management System
9. ⏰ Attendance Tracking
10. 💰 Payroll Management
11. 🏢 Department Management
12. 📊 Reports & Analytics
13. 📱 Responsive Design Enhancements

## 📝 Change Log

### Latest Updates

#### Email Notification System 📧 (Added: October 2024)

**Major Feature Implementation:**
- ✅ Automated email notifications for application status changes
- ✅ 6 professional HTML email templates
- ✅ Support for Gmail, SendGrid, and custom SMTP
- ✅ Non-blocking asynchronous email sending
- ✅ Detailed logging for debugging and monitoring

**Email Templates:**
- Application Received (confirmation)
- Under Review (status update)
- Shortlisted (congratulations)
- Interview Scheduled (notification)
- Rejected (professional & respectful)
- Job Offer (congratulations & welcome)

**Implementation:**
- ✅ Created `emailService.js` with template engine
- ✅ Integrated with `applicationController.js`
- ✅ Added detailed logging for email tracking
- ✅ Environment configuration for multiple providers
- ✅ Error handling and graceful failures

**Technical Details:**
- Uses `nodemailer` for email delivery
- HTML emails with inline CSS and gradients
- Mobile-responsive email design
- Company branding customization
- Message ID tracking for delivery confirmation

**Files Created/Modified:**
- `backend/src/services/emailService.js` (NEW)
- `backend/src/controllers/applicationController.js` (Updated)
- `.env` (Added email configuration)
- `EMAIL_SETUP_GUIDE.md` (NEW - Setup instructions)
- `EMAIL_FEATURE_IMPLEMENTATION.md` (NEW - Technical documentation)

---

#### Google for Jobs Integration 🔍 (Added: October 2024)

**Major Feature Implementation:**
- ✅ Structured data (JSON-LD) for Google indexing
- ✅ SEO meta tags for better visibility
- ✅ Automatic generation for all jobs
- ✅ Zero cost, massive reach

**Implementation:**
- ✅ Updated `PublicJobView.js`:
  - Added `react-helmet` for document head management
  - Created `generateStructuredData()` function
  - Generates Schema.org JobPosting structured data
  - Parses salary range automatically
  - Maps experience level to months
  - Includes all job details (title, description, location, salary, etc.)
- ✅ Added SEO meta tags:
  - Page title optimization
  - Meta description
  - Open Graph tags (for Facebook, LinkedIn sharing)
  - Twitter Card tags
- ✅ Installed `react-helmet` package

**Features:**
- **Structured Data Fields:**
  - Job title
  - Full description (includes responsibilities, requirements, skills, benefits)
  - Salary range (min/max)
  - Location
  - Employment type (FULL_TIME, PART_TIME, etc.)
  - Experience requirements (in months)
  - Application deadline
  - Company information
  - Job identifier
- **SEO Enhancements:**
  - Optimized page titles
  - Meta descriptions (160 chars)
  - Open Graph tags for social sharing
  - Twitter Card support
- **Automatic:**
  - Generated for every public job page
  - No manual configuration needed
  - Updates automatically with job data

**How It Works:**
1. Job is posted in HRM
2. Public page available at `/jobs/public/:jobId`
3. Google crawls page and reads structured data
4. Job appears in Google search results
5. Shows in Google Jobs widget
6. Candidates can find and apply

**Benefits:**
- **FREE** - No cost ever
- **Massive Reach** - Millions of Google users
- **Automatic** - No manual posting
- **Professional** - Appears in Google Jobs widget
- **SEO Boost** - Better search rankings

**Next Steps (User Action Required):**
1. Verify site with Google Search Console (10 min)
2. Submit sitemap (optional)
3. Request indexing for faster results (optional)
4. Wait 7-14 days for Google to index
5. Jobs will appear in Google search!

**Files Modified:**
- `frontend/src/pages/PublicJobView.js` (Added structured data)
- `frontend/package.json` (Added react-helmet dependency)

**Documentation Created:**
- `GOOGLE_FOR_JOBS_SETUP.md` (Complete setup guide)

---

#### Multi-Platform Job Sharing 🚀 (Added: October 2024)

**Major Feature Implementation:**
- ✅ Share job postings to multiple platforms simultaneously
- ✅ Beautiful multi-select modal interface
- ✅ Public job view page for shared links
- ✅ Pre-filled content for each platform
- ✅ Mobile responsive design

**Frontend Implementation:**
- ✅ Created `ShareModal.js` component:
  - Multi-select checkbox interface for 6 platforms
  - LinkedIn, Twitter, Facebook, WhatsApp, Email, Telegram support
  - Platform-specific share URLs with pre-filled content
  - Copy link to clipboard functionality
  - Select All / Deselect All options
  - Shows selected count
  - Opens all selected platforms in separate tabs
- ✅ Created `ShareModal.css`:
  - Beautiful gradient header (purple to violet)
  - Platform cards with hover effects
  - Selected state styling
  - Platform-specific colors
  - Responsive grid layout
  - Mobile-optimized design
- ✅ Created `PublicJobView.js`:
  - Public job details page (no authentication required)
  - Beautiful gradient header
  - Job highlights (salary, deadline)
  - Apply button (prominent CTA)
  - All job details displayed professionally
  - Loading and error states
- ✅ Created `PublicJobView.css`:
  - Gradient background
  - Professional card layout
  - Responsive design
  - Mobile-optimized
- ✅ Updated `JobPosting.js`:
  - Added Share button to job cards
  - Integrated ShareModal component
  - Share handler function
- ✅ Updated `JobPosting.css`:
  - Added share button styling with gradient
  - Hover effects
- ✅ Updated `App.js`:
  - Added public route: `/jobs/public/:jobId`
  - No authentication required for public view

**Features:**
- Share to 6 platforms:
  1. **LinkedIn** - Professional network
  2. **Twitter/X** - Social media
  3. **Facebook** - Wide reach
  4. **WhatsApp** - Direct messaging
  5. **Email** - Traditional method
  6. **Telegram** - Messaging app
- Multi-select interface (checkboxes)
- Opens all selected platforms at once
- Platform-specific content formatting:
  - LinkedIn: Professional format with URL
  - Twitter: 280-char optimized with hashtags
  - Facebook: Shareable link
  - WhatsApp: Formatted message with emojis
  - Email: Full details with subject and body
  - Telegram: Share URL with text
- Copy link functionality
- Public job view with:
  - No authentication required
  - Beautiful professional layout
  - All job details visible
  - Apply button (CTA)
  - Mobile responsive
  - Loading states
  - Error handling

**UI/UX Enhancements:**
- Gradient modal header
- Platform cards with icons and colors
- Selected state with visual feedback
- Hover effects on cards
- Select All / Deselect All buttons
- Selected count indicator
- Copy button with toast notification
- Professional public job view
- Mobile-optimized layouts

**Technical Details:**
- Uses Web Share API concepts
- Opens platforms in new tabs (100ms delay between each)
- Prevents popup blockers with sequential opening
- URL encoding for special characters
- Platform-specific URL formats
- Public route accessible without auth
- Mock data for now (will connect to API later)

**Files Created:**
- `frontend/src/components/ShareModal.js` (NEW)
- `frontend/src/components/ShareModal.css` (NEW)
- `frontend/src/pages/PublicJobView.js` (NEW)
- `frontend/src/pages/PublicJobView.css` (NEW)

**Files Modified:**
- `frontend/src/pages/JobPosting.js` (Added share functionality)
- `frontend/src/pages/JobPosting.css` (Added share button styling)
- `frontend/src/App.js` (Added public route)

**How to Use:**
1. Navigate to Job Postings page
2. Click "🚀 Share" button on any job card
3. Modal opens with platform options
4. Select multiple platforms (checkboxes)
5. Click "🚀 Share to Selected (X)" button
6. All selected platforms open in new tabs
7. User completes sharing on each platform

**Public Job View:**
- URL format: `/jobs/public/{jobId}`
- No authentication required
- Professional layout
- Apply button
- All job details visible
- Mobile responsive

**Benefits:**
- Share to multiple platforms in seconds
- Wider reach for job postings
- Professional appearance
- Better candidate pool
- Time-saving for HR teams
- Competitive advantage

**Future Enhancements:**
- Backend API for real job data
- Share analytics tracking
- Indeed API integration
- Glassdoor API integration
- Auto-post scheduling
- Employee advocacy features

---

#### AI-Powered Job Description Generator 🤖 (Added: October 2024)

**Major Feature Implementation:**
- ✅ Integrated Google Gemini AI for intelligent job description generation
- ✅ Backend AI service with comprehensive error handling
- ✅ Frontend AI generation UI with beautiful gradient design
- ✅ Real-time generation with loading states and animations
- ✅ Smart auto-fill functionality for form fields

**Backend Implementation:**
- ✅ Installed `@google/generative-ai` package
- ✅ Created `backend/src/services/aiService.js`:
  - `generateJobDescription()` function using Gemini Pro model
  - Structured JSON prompt for consistent output
  - Fallback mode when AI service is unavailable
  - Error handling and response validation
- ✅ Created `backend/src/routes/aiRoutes.js`:
  - POST `/api/ai/generate-job-description` endpoint
  - Protected route (requires authentication)
  - Input validation (job position & experience required)
  - Comprehensive error responses
- ✅ Updated `backend/server.js` to include AI routes
- ✅ Added `GEMINI_API_KEY` to environment configuration

**Frontend Implementation:**
- ✅ Updated `JobPosting.js`:
  - Added `generating` state for loading management
  - Created `handleGenerateWithAI()` function
  - API integration with error handling
  - Auto-fill form fields with AI-generated content
  - Toast notifications for success/error states
- ✅ Added AI Generation UI section:
  - Beautiful gradient card (purple to violet)
  - Floating robot emoji animation
  - Clear call-to-action button
  - Disabled state when required fields are empty
  - Loading spinner during generation
  - Helpful hint messages
- ✅ Updated `JobPosting.css`:
  - `.ai-generate-section` with gradient styling
  - Floating animation for AI icon
  - Pulse animation for generating badge
  - Spinner animation for loading state
  - Responsive design for mobile devices

**Features:**
- Requires 7 fields for comprehensive AI generation:
  1. Job Title
  2. Department
  3. Location
  4. Employment Type
  5. Experience Level
  6. Salary Range
  7. Application Deadline
- Generates 5 comprehensive fields automatically:
  1. Job Description (2-3 paragraphs)
  2. Responsibilities (5-7 bullet points)
  3. Requirements (5-7 qualifications)
  4. Skills (8-10 skills, comma-separated)
  5. Benefits (5-6 benefits)
- Smart validation before generation
- Real-time feedback with toast notifications
- Graceful fallback if AI service fails
- Professional, role-specific content

**UI/UX Enhancements:**
- Gradient card with shadow effects
- Floating robot emoji (3s animation loop)
- Loading spinner during generation
- "✨ AI is generating..." badge on form section
- Disabled button state with visual feedback
- Hover effects on AI button
- Mobile-responsive layout
- Toast notifications for user feedback

**Technical Details:**
- Uses Google Gemini 2.0 Flash Experimental model (latest, free tier available)
- Model: `gemini-2.0-flash-exp` (supports newest API keys from AI Studio)
- Structured JSON prompts for consistent output
- Response cleaning (removes markdown code blocks)
- JSON parsing with validation
- Error handling at multiple levels
- Rate limiting ready (can be added)
- Secure API key management via .env
- Debug logging for development (shows AI responses in terminal)

**Files Modified/Created:**
- `backend/src/services/aiService.js` (NEW)
- `backend/src/routes/aiRoutes.js` (NEW)
- `backend/server.js` (Updated - added AI routes)
- `backend/.env` (Updated - added GEMINI_API_KEY)
- `backend/package.json` (Updated - added @google/generative-ai)
- `frontend/src/pages/JobPosting.js` (Updated - added AI generation)
- `frontend/src/pages/JobPosting.css` (Updated - added AI styling)

**How to Use:**
1. Get your API key from: https://aistudio.google.com/app/apikey
2. Add to `backend/.env`: `GEMINI_API_KEY=your_key_here`
3. Navigate to Job Postings → Create New Job
4. Fill in ALL Basic Info fields (required for AI generation):
   - Job Title
   - Department
   - Location
   - Employment Type
   - Experience Level
   - Salary Range
   - Application Deadline
5. Click "🤖 Generate with AI" button
6. Wait 3-5 seconds for AI to generate content
7. Review and edit the auto-filled fields as needed
8. Submit the job posting

**Viewing Debug Logs:**
- Check your backend terminal (where you ran `npm run dev`)
- You'll see detailed logs showing:
  - All input parameters (Job Position, Department, Location, Employment Type, Experience Level, Salary Range, Application Deadline)
  - Raw AI response from Gemini (with markdown formatting)
  - Parsed JSON content (clean, structured data)
  - Perfect for debugging and understanding AI output!

**Cost & Limits:**
- Google Gemini API: Free tier available
- 60 requests per minute (free tier)
- Perfect for development and small-scale production

**Competitive Advantage:**
- Saves 15-20 minutes per job posting
- Ensures professional, consistent quality
- Reduces HR workload significantly
- More engaging than competitors' manual forms

**Troubleshooting:**
- **Error: "API key not valid"**
  - Make sure you're using the latest API key from https://aistudio.google.com/app/apikey
  - Verify the key is added to `backend/.env` as `GEMINI_API_KEY=your_key_here`
  - Restart backend server after updating .env
  - Note: Code uses `gemini-2.0-flash-exp` model (compatible with new API keys)
- **Error: "AI service unavailable"**
  - Check your internet connection
  - Verify API key has no extra spaces or quotes
  - Check backend terminal for detailed error messages
  - System will use fallback template if AI fails

---

#### Job Posting Module (Added: October 2024)

**Frontend Implementation:**
- ✅ Created `JobPosting.js` component with dual-tab interface
- ✅ Created `JobPosting.css` with responsive styling
- ✅ Added route `/job-postings` in App.js
- ✅ Updated Dashboard with clickable Job Postings card
- ✅ Implemented sample data with 3 job postings

**Features:**
- Job listing view with filtering (Department, Status, Employment Type)
- Search functionality for job titles
- Job creation form with comprehensive fields:
  - Basic Info: Title, Department, Location, Type, Experience, Salary, Deadline
  - Job Details: Description, Responsibilities, Requirements, Skills, Benefits
- Action buttons: View Details, View Applicants, Edit, Delete
- Status badges: Active, Closed, Draft
- Form validation for required fields
- Draft and Publish options

**UI/UX:**
- Professional gradient header
- Tab-based navigation
- Responsive grid layout
- Color-coded action buttons
- Hover effects on cards
- Mobile-responsive design

**Pending:**
- Backend API integration
- Database schema for job postings
- CRUD operations implementation
- Applicant management system

**Files Modified:**
- `frontend/src/pages/JobPosting.js` (NEW)
- `frontend/src/pages/JobPosting.css` (NEW)
- `frontend/src/App.js` (Updated - added route)
- `frontend/src/pages/Dashboard.js` (Updated - added card)
- `frontend/src/pages/Dashboard.css` (Updated - added badge)

**Access:**
- Navigate to Dashboard → Click "Job Postings" card
- Direct URL: `http://localhost:3000/job-postings`

---

## 📄 License

ISC

## 🚀 Deployment Guide

### Backend Deployment (Render)

1. **Push your code to GitHub**
2. **Go to [Render](https://render.com) and create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` or `node server.js`
   - **Environment:** Node

5. **Add Environment Variables in Render:**
   - Go to Environment tab
   - Add all variables from your `.env` file:
     - `NODE_ENV=production`
     - `MONGODB_URI=your_mongodb_atlas_connection_string`
     - `JWT_SECRET=your_secure_secret`
     - `GEMINI_API_KEY=your_gemini_key`
     - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
     - `CLOUDINARY_API_KEY=your_api_key`
     - `CLOUDINARY_API_SECRET=your_api_secret`
     - `EMAIL_SERVICE=gmail` (or sendgrid)
     - `EMAIL_USER=your_email@gmail.com`
     - `EMAIL_PASSWORD=your_app_password`
     - `FROM_EMAIL=your_email@gmail.com`
     - `FROM_NAME=HRM Recruitment Team`
     - `COMPANY_NAME=Your Company Name`
     - `FRONTEND_URL=https://your-frontend-url.vercel.app`

6. **Deploy!** Render will automatically deploy your backend

### Frontend Deployment (Vercel)

1. **Go to [Vercel](https://vercel.com) and import your project**
2. **Configure the project:**
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)

3. **Add Environment Variable:**
   - Go to Settings → Environment Variables
   - Add: `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`

4. **Deploy!** Vercel will automatically deploy your frontend

### Important Deployment Notes

- **MongoDB Atlas:** Ensure your IP whitelist includes `0.0.0.0/0` for cloud deployments
- **CORS:** Update `FRONTEND_URL` in backend `.env` to your Vercel URL
- **Email Service:** For production, consider using SendGrid instead of Gmail
- **SSL/HTTPS:** Both Render and Vercel provide free SSL certificates

## 👨‍💻 Author

Your Name

---

**Note:** This is a development setup. For production deployment, ensure you:
- Use strong JWT secrets
- Enable HTTPS
- Set up proper database backups
- Configure production environment variables
- Implement rate limiting
- Add input sanitization
- Set up monitoring and logging
- Use professional email service (SendGrid) for production
- Monitor email delivery rates and bounce rates

---

## 📋 Quick Reference

### Email Configuration Quick Check

✅ **Is email working?** Check these:

1. **Environment Variables Set?**
   ```bash
   # Check your .env file has:
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=HRM Recruitment Team
   COMPANY_NAME=Your Company Name
   ```

2. **Gmail App Password Generated?**
   - Enable 2FA: https://myaccount.google.com/security
   - Generate App Password: https://myaccount.google.com/apppasswords

3. **Backend Running?**
   ```bash
   cd backend
   npm run dev
   ```

4. **Check Logs?**
   - Look for `📧 ===== EMAIL SENDING STARTED =====` in terminal
   - Green ✅ = Success
   - Red ❌ = Failed (check error message)

5. **Test Email?**
   - Submit a job application
   - Check candidate's email inbox (and spam folder)

### Email Log Examples

**Success:**
```
🎯 Triggering confirmation email for: John Doe (john@example.com)
📧 ===== EMAIL SENDING STARTED =====
✅ EMAIL SENT SUCCESSFULLY!
```

**Failure:**
```
❌ ===== EMAIL SENDING FAILED =====
❌ Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

### Common Email Errors & Fixes

| Error | Fix |
|-------|-----|
| "Invalid login" | Use App Password, not regular password |
| "Connection timeout" | Check internet, firewall, or use SendGrid |
| No logs appearing | Check `.env` has email variables, restart backend |
| Emails in spam | Normal for testing, mark as "Not Spam" |

### Key Files for Email Feature

- **Service:** `backend/src/services/emailService.js`
- **Controller:** `backend/src/controllers/applicationController.js`
- **Config:** `.env` (root directory)
- **Setup Guide:** `EMAIL_SETUP_GUIDE.md`
- **Documentation:** `EMAIL_FEATURE_IMPLEMENTATION.md`

---

