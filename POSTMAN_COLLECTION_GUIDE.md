# 📮 Postman Collection Guide - HRM System API

## 🎯 Overview

This guide helps you test all API endpoints using Postman or any API testing tool.

---

## 🚀 Quick Setup

### 1. Create Environment Variables in Postman

**Environment Name:** HRM Development

| Variable | Value | Description |
|----------|-------|-------------|
| `baseUrl` | `http://localhost:5000/api` | API base URL |
| `token` | (empty initially) | JWT token (auto-set after login) |
| `jobId` | (empty initially) | Test job ID |
| `applicationId` | (empty initially) | Test application ID |

---

## 📁 Collection Structure

```
HRM System API
├── 🔓 Public
│   ├── Register User
│   ├── Login User
│   ├── Get Public Job
│   ├── Parse Resume (AI)
│   ├── Submit Application
│   └── Health Check
│
├── 🔒 Authentication
│   └── Get Current User
│
├── 💼 Jobs
│   ├── Create Job
│   ├── Get All Jobs
│   ├── Get Job by ID
│   ├── Update Job
│   ├── Delete Job
│   └── Get Job Stats
│
├── 📋 Applications
│   ├── Get All Applications
│   ├── Get All Stats
│   ├── Get Job-Specific Stats
│   ├── Get Applications by Job
│   ├── Get Application by ID
│   ├── Update Application Status
│   ├── Add Note to Application
│   ├── Rate Application
│   └── Delete Application
│
└── 🤖 AI Features
    └── Generate Job Description
```

---

## 🔓 PUBLIC ENDPOINTS

### 1. Register User

**Request:**
```
POST {{baseUrl}}/auth/register
Content-Type: application/json

Body (raw JSON):
{
  "name": "Test Recruiter",
  "email": "recruiter@test.com",
  "password": "Test123456",
  "role": "recruiter"
}
```

**Tests (Postman):**
```javascript
// Save token to environment
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

---

### 2. Login User

**Request:**
```
POST {{baseUrl}}/auth/login
Content-Type: application/json

Body (raw JSON):
{
  "email": "recruiter@test.com",
  "password": "Test123456"
}
```

**Tests (Postman):**
```javascript
// Save token to environment
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
    console.log("Token saved:", response.token);
}
```

---

### 3. Get Public Job

**Request:**
```
GET {{baseUrl}}/jobs/public/{{jobId}}
```

**Note:** Replace `{{jobId}}` with actual job ID

---

### 4. Parse Resume (AI) ✨

**Request:**
```
POST {{baseUrl}}/applications/parse-resume
Content-Type: multipart/form-data

Body (form-data):
Key: resume
Type: File
Value: [Select PDF/DOC/DOCX file]
```

**Tests (Postman):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    console.log("Parsed Data:", response.data);
}
```

---

### 5. Submit Application

**Request:**
```
POST {{baseUrl}}/applications/apply/{{jobId}}
Content-Type: multipart/form-data

Body (form-data):
firstName: John
lastName: Doe
email: john.doe@test.com
phone: +1 (555) 123-4567
resume: [File]
coverLetter: I am excited to apply...
linkedinUrl: https://linkedin.com/in/johndoe
portfolioUrl: https://johndoe.dev
currentCompany: Google Inc.
yearsOfExperience: 7
expectedSalary: $140,000 - $160,000
noticePeriod: 2 weeks
source: direct
```

**Tests (Postman):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("applicationId", response.data._id);
    console.log("Application ID saved:", response.data._id);
}
```

---

### 6. Health Check

**Request:**
```
GET {{baseUrl}}/../health
```

---

## 🔒 PROTECTED ENDPOINTS

**Note:** All protected endpoints require Authorization header.

### Authorization Header Setup (Postman):

**For each protected request, add:**
```
Authorization: Bearer {{token}}
```

**Or use Postman Collection Authorization:**
1. Click on collection name
2. Go to "Authorization" tab
3. Type: Bearer Token
4. Token: {{token}}
5. This applies to all requests in collection

---

### 7. Get Current User

**Request:**
```
GET {{baseUrl}}/auth/me
Authorization: Bearer {{token}}
```

---

### 8. Create Job

**Request:**
```
POST {{baseUrl}}/jobs
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "jobTitle": "Senior Software Engineer",
  "department": "Engineering",
  "location": "San Francisco, CA",
  "employmentType": "Full-time",
  "experienceLevel": "Senior (5+ years)",
  "salaryRange": "$120,000 - $160,000",
  "jobDescription": "We are seeking a talented Senior Software Engineer to join our team...",
  "responsibilities": "- Lead development of scalable applications\n- Mentor junior engineers\n- Conduct code reviews\n- Collaborate with product team",
  "requirements": "- 5+ years of software development experience\n- Strong proficiency in JavaScript\n- Experience with React and Node.js\n- Excellent communication skills",
  "skills": "JavaScript, React, Node.js, AWS, Docker, Kubernetes, MongoDB",
  "benefits": "- Competitive salary\n- Health insurance\n- 401k matching\n- Remote work options\n- Professional development budget",
  "applicationDeadline": "2025-12-31",
  "status": "active"
}
```

**Tests (Postman):**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("jobId", response.data._id);
    console.log("Job ID saved:", response.data._id);
}
```

---

### 9. Get All Jobs

**Request:**
```
GET {{baseUrl}}/jobs
Authorization: Bearer {{token}}
```

**With Query Parameters:**
```
GET {{baseUrl}}/jobs?status=active&department=Engineering
```

---

### 10. Get Job by ID

**Request:**
```
GET {{baseUrl}}/jobs/{{jobId}}
Authorization: Bearer {{token}}
```

---

### 11. Update Job

**Request:**
```
PUT {{baseUrl}}/jobs/{{jobId}}
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "jobTitle": "Lead Software Engineer",
  "salaryRange": "$130,000 - $170,000"
}
```

---

### 12. Delete Job

**Request:**
```
DELETE {{baseUrl}}/jobs/{{jobId}}
Authorization: Bearer {{token}}
```

---

### 13. Get Job Stats

**Request:**
```
GET {{baseUrl}}/jobs/stats
Authorization: Bearer {{token}}
```

---

### 14. Get All Applications

**Request:**
```
GET {{baseUrl}}/applications
Authorization: Bearer {{token}}
```

**With Filter:**
```
GET {{baseUrl}}/applications?status=pending
```

---

### 15. Get All Application Stats

**Request:**
```
GET {{baseUrl}}/applications/stats/overview
Authorization: Bearer {{token}}
```

---

### 16. Get Job-Specific Stats ✨

**Request:**
```
GET {{baseUrl}}/applications/stats/job/{{jobId}}
Authorization: Bearer {{token}}
```

---

### 17. Get Applications by Job

**Request:**
```
GET {{baseUrl}}/applications/job/{{jobId}}
Authorization: Bearer {{token}}
```

**With Filter:**
```
GET {{baseUrl}}/applications/job/{{jobId}}?status=shortlisted
```

---

### 18. Get Application by ID

**Request:**
```
GET {{baseUrl}}/applications/{{applicationId}}
Authorization: Bearer {{token}}
```

---

### 19. Update Application Status

**Request:**
```
PUT {{baseUrl}}/applications/{{applicationId}}/status
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
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

---

### 20. Add Note to Application

**Request:**
```
POST {{baseUrl}}/applications/{{applicationId}}/notes
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "note": "Great technical skills, strong React experience. Proceed to technical interview."
}
```

---

### 21. Rate Application

**Request:**
```
PUT {{baseUrl}}/applications/{{applicationId}}/rating
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "rating": 4
}
```

**Valid Ratings:** 1-5

---

### 22. Delete Application

**Request:**
```
DELETE {{baseUrl}}/applications/{{applicationId}}
Authorization: Bearer {{token}}
```

---

### 23. Generate Job Description (AI)

**Request:**
```
POST {{baseUrl}}/ai/generate-job-description
Authorization: Bearer {{token}}
Content-Type: application/json

Body (raw JSON):
{
  "jobPosition": "Senior Product Manager",
  "experience": "Senior (5+ years)",
  "department": "Product",
  "location": "New York, NY",
  "employmentType": "Full-time",
  "salaryRange": "$130,000 - $170,000",
  "applicationDeadline": "2025-12-31"
}
```

---

## 🧪 Testing Workflow

### Complete Test Flow:

```
1. Register User
   ↓ (token saved)
2. Login User
   ↓ (token refreshed)
3. Get Current User
   ↓ (verify auth works)
4. Create Job
   ↓ (jobId saved)
5. Get All Jobs
   ↓ (verify job created)
6. Get Public Job
   ↓ (verify public access)
7. Parse Resume
   ↓ (test AI parsing)
8. Submit Application
   ↓ (applicationId saved)
9. Get Applications by Job
   ↓ (verify application)
10. Update Application Status
    ↓ (change to "shortlisted")
11. Add Note
    ↓ (add recruiter note)
12. Rate Application
    ↓ (rate 4/5)
13. Get Application Stats
    ↓ (verify counts)
14. Generate Job Description
    ↓ (test AI feature)
```

---

## 🎯 Postman Collection Variables

### Collection Variables (Set these):

```javascript
{
  "baseUrl": "http://localhost:5000/api",
  "token": "",
  "jobId": "",
  "applicationId": ""
}
```

### Pre-request Script (Collection Level):

```javascript
// Automatically add token to all requests
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: 'Authorization',
        value: 'Bearer ' + pm.environment.get("token")
    });
}
```

---

## 📊 Common Test Scripts

### Save Response Data:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    
    // Save token
    if (response.token) {
        pm.environment.set("token", response.token);
    }
    
    // Save IDs
    if (response.data && response.data._id) {
        pm.environment.set("lastId", response.data._id);
    }
}
```

### Verify Response:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success flag", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
});

pm.test("Response has data", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.exist;
});
```

---

## 🔧 Troubleshooting

### 401 Unauthorized:
```javascript
// Re-run login request to get fresh token
// Check if token is set in environment variables
console.log("Current token:", pm.environment.get("token"));
```

### 404 Not Found:
```javascript
// Verify IDs are set correctly
console.log("Job ID:", pm.environment.get("jobId"));
console.log("Application ID:", pm.environment.get("applicationId"));
```

### 500 Server Error:
- Check backend console logs
- Verify request body format
- Check if all required fields are provided

---

## 📥 Import Ready Postman Collection

Save this as `HRM_API.postman_collection.json`:

```json
{
  "info": {
    "name": "HRM System API",
    "description": "Complete API collection for HRM System with AI features",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    },
    {
      "key": "jobId",
      "value": ""
    },
    {
      "key": "applicationId",
      "value": ""
    }
  ]
}
```

---

## 🎉 Quick Start

1. **Install Postman** (if not already installed)
2. **Create New Collection** named "HRM System API"
3. **Add Environment** with variables above
4. **Start with Login** to get token
5. **Test endpoints** in order
6. **Use saved variables** ({{token}}, {{jobId}}, etc.)

---

## 📚 Additional Resources

- **Full API Docs:** `API_DOCUMENTATION.md`
- **Quick Reference:** `API_QUICK_REFERENCE.md`
- **Resume Parsing:** `RESUME_PARSING_FEATURE_COMPLETE.md`

---

**Happy Testing!** 🚀
