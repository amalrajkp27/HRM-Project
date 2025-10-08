# 🚀 API Quick Reference Card

## 📍 Base URL
```
Development: http://localhost:5000/api
Production:  https://your-backend-url.com/api
```

---

## 🔓 PUBLIC ENDPOINTS (No Auth)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login user |
| `/jobs/public/:id` | GET | View public job details |
| `/applications/parse-resume` | POST | Parse resume with AI ✨ |
| `/applications/apply/:jobId` | POST | Submit job application |
| `/health` | GET | Server health check |

---

## 🔒 PROTECTED ENDPOINTS (Auth Required)

### 👤 Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/me` | GET | Get current user |

### 💼 Jobs
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/jobs` | GET | Get all jobs |
| `/jobs` | POST | Create new job |
| `/jobs/:id` | GET | Get job by ID |
| `/jobs/:id` | PUT | Update job |
| `/jobs/:id` | DELETE | Delete job |
| `/jobs/stats` | GET | Get job statistics |

### 📋 Applications
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/applications` | GET | Get all applications |
| `/applications/stats/overview` | GET | Get all stats |
| `/applications/stats/job/:jobId` | GET | Get job-specific stats ✨ |
| `/applications/job/:jobId` | GET | Get applications by job |
| `/applications/:id` | GET | Get application by ID |
| `/applications/:id/status` | PUT | Update status |
| `/applications/:id/notes` | POST | Add note |
| `/applications/:id/rating` | PUT | Rate application |
| `/applications/:id` | DELETE | Delete application |

### 🤖 AI Features
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ai/generate-job-description` | POST | Generate job description |

---

## 🔑 Authentication Header

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
}
```

---

## 📝 Quick Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get All Jobs
```bash
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Parse Resume
```bash
curl -X POST http://localhost:5000/api/applications/parse-resume \
  -F "resume=@resume.pdf"
```

### Submit Application
```bash
curl -X POST http://localhost:5000/api/applications/apply/JOB_ID \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "email=john@example.com" \
  -F "phone=+1555123456" \
  -F "resume=@resume.pdf"
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## 🎯 Application Status Values

- `pending`
- `reviewing`
- `shortlisted`
- `interview-scheduled`
- `rejected`
- `hired`

---

## 🆕 New Features

### Resume Parsing (AI-Powered) ✨
```javascript
POST /api/applications/parse-resume
Content-Type: multipart/form-data

Body: resume file (PDF/DOC/DOCX, max 5MB)

Returns: {
  firstName, lastName, email, phone,
  currentCompany, yearsOfExperience,
  linkedinUrl, portfolioUrl, skills
}
```

### Job-Specific Stats ✨
```javascript
GET /api/applications/stats/job/:jobId
Authorization: Bearer TOKEN

Returns: Stats for specific job only
```

---

## 📚 Full Documentation

See `API_DOCUMENTATION.md` for complete details.

---

**Total Endpoints:** 22 (6 public, 16 protected)
