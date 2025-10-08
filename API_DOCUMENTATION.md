# 🔌 HRM System - Complete API Documentation

## 📍 Base URL

### Development:
```
http://localhost:5000/api
```
or
```
http://localhost:5001/api
```

### Production:
```
https://your-backend-url.com/api
```

---

## 🔐 Authentication

Most endpoints require authentication using JWT (JSON Web Token).

### How to Authenticate:
1. Register or login to get a token
2. Include token in request headers:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN_HERE
   ```

### Token Format:
```javascript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

---

## 📚 API Endpoints Overview

| Category | Endpoints | Public | Protected |
|----------|-----------|--------|-----------|
| **Authentication** | 3 | 2 | 1 |
| **Jobs** | 6 | 1 | 5 |
| **Applications** | 10 | 2 | 8 |
| **AI Features** | 3 | 0 | 3 |
| **Health Check** | 1 | 1 | 0 |
| **Total** | **23** | **6** | **17** |

---

## 🔓 PUBLIC ENDPOINTS (No Authentication Required)

### 1. Authentication Routes

#### 📝 Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "recruiter"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "recruiter"
  }
}
```

---

#### 🔑 Login User
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "recruiter"
  }
}
```

---

### 2. Job Routes (Public)

#### 👁️ Get Public Job Details
```
GET /api/jobs/public/:id
```

**Parameters:**
- `id` - Job ID

**Example:**
```
GET /api/jobs/public/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "jobTitle": "Senior Software Engineer",
    "department": "Engineering",
    "location": "San Francisco, CA",
    "employmentType": "Full-time",
    "experienceLevel": "Senior (5+ years)",
    "salaryRange": "$120,000 - $160,000",
    "jobDescription": "We are seeking...",
    "responsibilities": "- Lead development...",
    "requirements": "- 5+ years experience...",
    "skills": "JavaScript, React, Node.js",
    "benefits": "- Health insurance...",
    "applicationDeadline": "2025-12-31",
    "status": "active",
    "postedBy": "507f1f77bcf86cd799439011",
    "createdAt": "2025-10-01T00:00:00.000Z"
  }
}
```

---

### 3. Application Routes (Public)

#### 🤖 Parse Resume (NEW!)
```
POST /api/applications/parse-resume
```

**Content-Type:** `multipart/form-data`

**Request Body:**
```
resume: [file] (PDF, DOC, or DOCX, max 5MB)
```

**Example (using curl):**
```bash
curl -X POST http://localhost:5000/api/applications/parse-resume \
  -F "resume=@/path/to/resume.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "currentCompany": "Google Inc.",
    "yearsOfExperience": "7",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "portfolioUrl": "https://johndoe.dev",
    "skills": ["JavaScript", "React", "Node.js", "Python", "AWS"],
    "summary": "Senior Software Engineer with 7 years of experience"
  }
}
```

---

#### 📤 Submit Job Application
```
POST /api/applications/apply/:jobId
```

**Content-Type:** `multipart/form-data`

**Parameters:**
- `jobId` - Job ID to apply for

**Request Body:**
```
firstName: John
lastName: Doe
email: john.doe@example.com
phone: +1 (555) 123-4567
resume: [file]
coverLetter: I am excited to apply...
linkedinUrl: https://linkedin.com/in/johndoe
portfolioUrl: https://johndoe.dev
currentCompany: Google Inc.
yearsOfExperience: 7
expectedSalary: $140,000 - $160,000
noticePeriod: 2 weeks
source: direct
```

**Example (using JavaScript):**
```javascript
const formData = new FormData();
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('email', 'john.doe@example.com');
formData.append('phone', '+1 (555) 123-4567');
formData.append('resume', fileInput.files[0]);
formData.append('coverLetter', 'I am excited...');
// ... other fields

fetch('http://localhost:5000/api/applications/apply/507f1f77bcf86cd799439011', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully! You will receive a confirmation email shortly.",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "job": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "status": "pending",
    "appliedAt": "2025-10-07T00:00:00.000Z"
  }
}
```

---

## 🔒 PROTECTED ENDPOINTS (Authentication Required)

**Note:** All protected endpoints require the `Authorization` header with a valid JWT token.

---

### 4. Authentication Routes (Protected)

#### 👤 Get Current User
```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "recruiter",
    "createdAt": "2025-10-01T00:00:00.000Z"
  }
}
```

---

### 5. Job Routes (Protected)

#### ➕ Create New Job
```
POST /api/jobs
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "department": "Engineering",
  "location": "San Francisco, CA",
  "employmentType": "Full-time",
  "experienceLevel": "Senior (5+ years)",
  "salaryRange": "$120,000 - $160,000",
  "jobDescription": "We are seeking a talented engineer...",
  "responsibilities": "- Lead development\n- Mentor team\n- Code reviews",
  "requirements": "- 5+ years experience\n- Strong JavaScript skills",
  "skills": "JavaScript, React, Node.js, AWS",
  "benefits": "- Health insurance\n- 401k\n- Remote work",
  "applicationDeadline": "2025-12-31",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "jobTitle": "Senior Software Engineer",
    "status": "active",
    "postedBy": "507f1f77bcf86cd799439010",
    "createdAt": "2025-10-07T00:00:00.000Z"
  }
}
```

---

#### 📋 Get All Jobs
```
GET /api/jobs
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters (optional):**
- `status` - Filter by status (active, closed, draft)
- `department` - Filter by department
- `location` - Filter by location

**Example:**
```
GET /api/jobs?status=active&department=Engineering
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "jobTitle": "Senior Software Engineer",
      "department": "Engineering",
      "status": "active",
      "applicants": 12,
      "createdAt": "2025-10-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 🔍 Get Job by ID
```
GET /api/jobs/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `id` - Job ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "jobTitle": "Senior Software Engineer",
    "department": "Engineering",
    "location": "San Francisco, CA",
    "status": "active",
    "applicants": 12
  }
}
```

---

#### ✏️ Update Job
```
PUT /api/jobs/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Parameters:**
- `id` - Job ID

**Request Body:** (any fields to update)
```json
{
  "jobTitle": "Lead Software Engineer",
  "salaryRange": "$130,000 - $170,000",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "jobTitle": "Lead Software Engineer",
    "salaryRange": "$130,000 - $170,000"
  }
}
```

---

#### 🗑️ Delete Job
```
DELETE /api/jobs/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `id` - Job ID

**Response:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

#### 📊 Get Job Statistics
```
GET /api/jobs/stats
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 25,
    "activeJobs": 18,
    "closedJobs": 5,
    "draftJobs": 2,
    "byDepartment": [
      { "_id": "Engineering", "count": 10 },
      { "_id": "Marketing", "count": 5 }
    ],
    "byLocation": [
      { "_id": "San Francisco, CA", "count": 8 },
      { "_id": "Remote", "count": 7 }
    ]
  }
}
```

---

### 6. Application Routes (Protected)

#### 📥 Get All Applications
```
GET /api/applications
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters (optional):**
- `status` - Filter by status (pending, reviewing, shortlisted, etc.)

**Example:**
```
GET /api/applications?status=pending
```

**Response:**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "job": {
        "_id": "507f1f77bcf86cd799439011",
        "jobTitle": "Senior Software Engineer"
      },
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "status": "pending",
      "appliedAt": "2025-10-07T00:00:00.000Z"
    }
  ]
}
```

---

#### 📊 Get Application Statistics (Overview)
```
GET /api/applications/stats/overview
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": [
      { "_id": "pending", "count": 45 },
      { "_id": "reviewing", "count": 30 },
      { "_id": "shortlisted", "count": 25 },
      { "_id": "interview-scheduled", "count": 20 },
      { "_id": "hired", "count": 15 },
      { "_id": "rejected", "count": 15 }
    ],
    "recent": [...]
  }
}
```

---

#### 📊 Get Application Statistics for Specific Job (NEW!)
```
GET /api/applications/stats/job/:jobId
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `jobId` - Job ID

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 12,
    "byStatus": [
      { "_id": "pending", "count": 5 },
      { "_id": "reviewing", "count": 3 },
      { "_id": "shortlisted", "count": 2 },
      { "_id": "hired", "count": 2 }
    ],
    "recent": [...]
  }
}
```

---

#### 📋 Get Applications by Job
```
GET /api/applications/job/:jobId
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `jobId` - Job ID

**Query Parameters (optional):**
- `status` - Filter by status

**Example:**
```
GET /api/applications/job/507f1f77bcf86cd799439011?status=shortlisted
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [...]
}
```

---

#### 🔍 Get Application by ID
```
GET /api/applications/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `id` - Application ID

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "jobTitle": "Senior Software Engineer"
    },
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "resumeUrl": "https://cloudinary.com/...",
    "coverLetter": "I am excited...",
    "status": "pending",
    "rating": 0,
    "notes": [],
    "appliedAt": "2025-10-07T00:00:00.000Z"
  }
}
```

---

#### ✏️ Update Application Status
```
PUT /api/applications/:id/status
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Parameters:**
- `id` - Application ID

**Request Body:**
```json
{
  "status": "shortlisted"
}
```

**Valid Status Values:**
- `pending`
- `reviewing`
- `shortlisted`
- `interview-scheduled`
- `rejected`
- `hired`

**Response:**
```json
{
  "success": true,
  "message": "Application status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "shortlisted"
  }
}
```

---

#### 📝 Add Note to Application
```
POST /api/applications/:id/notes
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Parameters:**
- `id` - Application ID

**Request Body:**
```json
{
  "note": "Great technical skills, proceed to next round"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "notes": [
      {
        "note": "Great technical skills, proceed to next round",
        "addedBy": "507f1f77bcf86cd799439010",
        "addedAt": "2025-10-07T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### ⭐ Rate Application
```
PUT /api/applications/:id/rating
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Parameters:**
- `id` - Application ID

**Request Body:**
```json
{
  "rating": 4
}
```

**Valid Rating Values:** 1-5

**Response:**
```json
{
  "success": true,
  "message": "Application rated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "rating": 4
  }
}
```

---

#### 🗑️ Delete Application
```
DELETE /api/applications/:id
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Parameters:**
- `id` - Application ID

**Response:**
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

---

### 7. AI Routes (Protected)

#### 🤖 Generate Job Description with AI
```
POST /api/ai/generate-job-description
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobPosition": "Senior Software Engineer",
  "experience": "Senior (5+ years)",
  "department": "Engineering",
  "location": "San Francisco, CA",
  "employmentType": "Full-time",
  "salaryRange": "$120,000 - $160,000",
  "applicationDeadline": "2025-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job description generated successfully",
  "data": {
    "jobDescription": "We are seeking a talented Senior Software Engineer...",
    "responsibilities": "- Lead development of scalable applications\n- Mentor junior engineers\n- Conduct code reviews",
    "requirements": "- 5+ years of software development experience\n- Strong proficiency in JavaScript\n- Experience with React and Node.js",
    "skills": "JavaScript, React, Node.js, AWS, Docker, Kubernetes, MongoDB, PostgreSQL",
    "benefits": "- Competitive salary: $120,000 - $160,000\n- Health insurance\n- 401k matching\n- Remote work options"
  }
}
```

---

#### 🎯 Find Best Candidates with AI (NEW!)
```
GET /api/matching/find-best/:jobId
```

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**URL Parameters:**
- `jobId` (required): The ID of the job to analyze candidates for

**Query Parameters:**
- `topN` (optional): Number of top candidates to return (default: 3, max: 10)

**Example Request:**
```bash
# Using cURL
curl -X GET "http://localhost:5001/api/matching/find-best/67039c8e9f1234567890abcd?topN=3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Using Axios
const response = await api.get(`/matching/find-best/${jobId}?topN=3`);
```

**Response:**
```json
{
  "success": true,
  "message": "Found top 3 candidates",
  "count": 3,
  "data": [
    {
      "applicationId": "67039d1e9f1234567890def0",
      "candidate": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "company": "Tech Corp",
        "experience": "5",
        "appliedAt": "2024-10-07T10:30:00.000Z"
      },
      "analysis": {
        "matchScore": 92,
        "overallAssessment": "Exceptional candidate with strong technical background and proven track record",
        "strengths": [
          "10+ years of experience in React and Node.js development",
          "Led multiple successful large-scale projects",
          "Strong problem-solving and leadership skills"
        ],
        "skillsMatched": ["React", "Node.js", "MongoDB", "AWS", "Docker"],
        "skillsMissing": ["GraphQL"],
        "experienceMatch": "Exceeds requirement",
        "keyHighlights": [
          "Built scalable systems handling 1M+ concurrent users",
          "Mentored 15+ junior developers"
        ],
        "concerns": [
          "GraphQL experience not mentioned in resume"
        ],
        "recommendation": "Strong hire",
        "reasoning": "Candidate significantly exceeds all job requirements with a proven track record of success in similar roles. The missing GraphQL skill can be easily learned given their strong technical foundation."
      }
    },
    {
      "applicationId": "67039d1e9f1234567890def1",
      "candidate": {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1234567891",
        "company": "Startup Inc",
        "experience": "4",
        "appliedAt": "2024-10-07T11:15:00.000Z"
      },
      "analysis": {
        "matchScore": 85,
        "overallAssessment": "Strong candidate with relevant experience and excellent growth potential",
        "strengths": [
          "Solid full-stack development experience",
          "Quick learner with adaptability",
          "Strong communication skills"
        ],
        "skillsMatched": ["React", "Node.js", "MongoDB"],
        "skillsMissing": ["AWS", "Docker", "GraphQL"],
        "experienceMatch": "Meets requirement",
        "keyHighlights": [
          "Contributed to 3 successful product launches",
          "Active open-source contributor"
        ],
        "concerns": [
          "Limited cloud infrastructure experience",
          "Missing some DevOps skills"
        ],
        "recommendation": "Good fit",
        "reasoning": "Candidate meets core requirements and shows strong potential. Missing skills are learnable with proper onboarding and mentorship."
      }
    },
    {
      "applicationId": "67039d1e9f1234567890def2",
      "candidate": {
        "name": "Bob Johnson",
        "email": "bob@example.com",
        "phone": "+1234567892",
        "company": "Enterprise Co",
        "experience": "3",
        "appliedAt": "2024-10-07T12:00:00.000Z"
      },
      "analysis": {
        "matchScore": 72,
        "overallAssessment": "Promising candidate with foundational skills but needs development",
        "strengths": [
          "Strong JavaScript fundamentals",
          "Eager to learn and grow",
          "Good team player"
        ],
        "skillsMatched": ["React", "Node.js"],
        "skillsMissing": ["MongoDB", "AWS", "Docker", "GraphQL"],
        "experienceMatch": "Below requirement",
        "keyHighlights": [
          "Completed multiple online certifications",
          "Built personal projects demonstrating skills"
        ],
        "concerns": [
          "Limited professional experience",
          "Missing several required skills",
          "No experience with cloud platforms"
        ],
        "recommendation": "Consider with reservations",
        "reasoning": "Candidate shows potential but lacks the depth of experience and breadth of skills required for this senior role. May be better suited for a mid-level position with mentorship."
      }
    }
  ]
}
```

**Error Responses:**
```json
// Job not found
{
  "success": false,
  "message": "Job not found"
}

// No applications
{
  "success": false,
  "message": "No applications found for this job"
}

// Analysis failed
{
  "success": false,
  "message": "Unable to analyze candidates. Please ensure resumes are properly uploaded."
}
```

**Features:**
- 🤖 AI-powered analysis using Google Gemini
- 📊 Match score calculation (0-100%)
- ✨ Identifies key strengths and weaknesses
- 🎯 Skills matching against job requirements
- 💡 Hiring recommendations
- 📈 Experience level assessment
- 🔍 Detailed reasoning for each candidate
- 🏆 Automatic ranking by match score

**Processing Time:**
- 1-3 candidates: ~30-45 seconds
- 4-6 candidates: ~60-90 seconds
- 7-10 candidates: ~2-3 minutes

**Cost:** 100% FREE (uses Gemini AI free tier)

---

### 8. Health Check (Public)

#### ❤️ Server Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 📊 Response Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## 🔒 Authentication Flow

### 1. Register or Login
```javascript
// Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "recruiter"
}

// Response includes token
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Store Token
```javascript
// Store in localStorage
localStorage.setItem('token', response.token);
```

### 3. Use Token in Requests
```javascript
// Add to all protected endpoint requests
fetch('http://localhost:5000/api/jobs', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 📝 Example Usage

### JavaScript (Fetch API)

#### Get All Jobs:
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/jobs', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### Create Job:
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/jobs', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    experienceLevel: 'Senior (5+ years)',
    salaryRange: '$120,000 - $160,000',
    applicationDeadline: '2025-12-31',
    status: 'active'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### Submit Application with Resume:
```javascript
const formData = new FormData();
formData.append('firstName', 'John');
formData.append('lastName', 'Doe');
formData.append('email', 'john.doe@example.com');
formData.append('phone', '+1 (555) 123-4567');
formData.append('resume', fileInput.files[0]);

fetch('http://localhost:5000/api/applications/apply/507f1f77bcf86cd799439011', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

---

### cURL Examples

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

#### Get All Jobs:
```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Parse Resume:
```bash
curl -X POST http://localhost:5000/api/applications/parse-resume \
  -F "resume=@/path/to/resume.pdf"
```

---

### Axios Examples

#### Setup Axios with Interceptor:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Use API:
```javascript
import api from './api';

// Get all jobs
const jobs = await api.get('/jobs');

// Create job
const newJob = await api.post('/jobs', {
  jobTitle: 'Senior Software Engineer',
  department: 'Engineering',
  // ... other fields
});

// Parse resume
const formData = new FormData();
formData.append('resume', file);
const parsed = await api.post('/applications/parse-resume', formData);
```

---

## 🎯 Quick Reference

### Most Used Endpoints:

| Action | Method | Endpoint | Auth |
|--------|--------|----------|------|
| Login | POST | `/api/auth/login` | No |
| Get Jobs | GET | `/api/jobs` | Yes |
| Create Job | POST | `/api/jobs` | Yes |
| View Public Job | GET | `/api/jobs/public/:id` | No |
| Parse Resume | POST | `/api/applications/parse-resume` | No |
| Submit Application | POST | `/api/applications/apply/:jobId` | No |
| Get Applications | GET | `/api/applications` | Yes |
| Update Status | PUT | `/api/applications/:id/status` | Yes |
| Generate Job Desc | POST | `/api/ai/generate-job-description` | Yes |

---

## 🔧 Environment Variables

Make sure these are set in your `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=HRM System
```

---

## 📚 Additional Resources

- **Main README:** `README.md`
- **Resume Parsing Guide:** `RESUME_PARSING_FEATURE_COMPLETE.md`
- **Quick Start:** `RESUME_PARSING_QUICK_START.md`
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`

---

## 🆘 Troubleshooting

### Common Issues:

**401 Unauthorized:**
- Check if token is valid
- Token may have expired
- Login again to get new token

**404 Not Found:**
- Verify endpoint URL is correct
- Check if resource ID exists

**500 Internal Server Error:**
- Check backend logs
- Verify environment variables are set
- Check database connection

---

## 📞 Support

For issues or questions:
1. Check backend console logs
2. Review this documentation
3. Check related documentation files
4. Verify environment variables

---

**Last Updated:** October 7, 2025  
**API Version:** 1.0.0  
**Total Endpoints:** 23
