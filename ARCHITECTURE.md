# HRM Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         HRM SYSTEM                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────┐            ┌──────────────────────┐    │
│  │   FRONTEND        │            │      BACKEND         │    │
│  │   (React)         │◄──────────►│    (Express.js)      │    │
│  │   Port: 3000      │   HTTP/    │    Port: 5000        │    │
│  └───────────────────┘   REST API └──────────────────────┘    │
│                                              │                  │
│                                              │                  │
│                                    ┌─────────▼──────────┐      │
│                                    │    MongoDB         │      │
│                                    │    Database        │      │
│                                    └────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture (React)

```
frontend/
│
├── Public Layer
│   └── index.html (Entry point)
│
├── Application Layer (App.js)
│   ├── Router Configuration
│   ├── Global State (Context)
│   └── Toast Notifications
│
├── Context Layer
│   └── AuthContext
│       ├── User State
│       ├── Login/Logout Functions
│       └── Token Management
│
├── Service Layer
│   └── API Service (Axios)
│       ├── HTTP Interceptors
│       ├── Token Injection
│       └── API Endpoints
│
├── Component Layer
│   ├── PrivateRoute (Auth Guard)
│   └── Future Components
│
└── Page Layer
    ├── Login
    ├── Register
    ├── Dashboard
    └── NotFound
```

## Backend Architecture (Node.js + Express)

```
backend/
│
├── Entry Point (server.js)
│   ├── Express App Initialization
│   ├── Middleware Registration
│   ├── Database Connection
│   └── Route Registration
│
├── Configuration Layer
│   ├── database.js (MongoDB Connection)
│   └── constants.js (App Constants)
│
├── Middleware Layer
│   ├── auth.js
│   │   ├── protect (JWT Verification)
│   │   └── authorize (Role-Based Access)
│   └── errorHandler.js
│       └── Global Error Handling
│
├── Route Layer
│   └── authRoutes.js
│       ├── POST /register
│       ├── POST /login
│       └── GET /me
│
├── Controller Layer
│   └── authController.js
│       ├── Business Logic
│       ├── Request Validation
│       └── Response Formatting
│
├── Model Layer
│   └── User.js
│       ├── Schema Definition
│       ├── Validation Rules
│       └── Instance Methods
│
└── Utility Layer
    └── generateToken.js
        └── JWT Token Generation
```

## Request Flow

### User Registration Flow

```
┌──────────┐      ┌──────────┐      ┌────────────┐      ┌──────────┐
│  Client  │─────►│  Route   │─────►│ Controller │─────►│  Model   │
│(Register)│      │(/register)│      │(register)  │      │  (User)  │
└──────────┘      └──────────┘      └────────────┘      └──────────┘
     │                                     │                    │
     │                                     │                    │
     │              ┌──────────┐           │                    │
     │              │ Generate │◄──────────┘                    │
     │              │   JWT    │                                │
     │              └──────────┘                                │
     │                    │                                     │
     │                    ▼                                     │
     │◄──────────────────────────────────────────────────────-─┘
     │              Response with Token
```

### Protected Route Flow

```
┌──────────┐      ┌────────────┐      ┌────────────┐      ┌──────────┐
│  Client  │─────►│   Auth     │─────►│   Route    │─────►│Controller│
│(+ Token) │      │ Middleware │      │            │      │          │
└──────────┘      └────────────┘      └────────────┘      └──────────┘
                        │
                        ├── Verify JWT
                        ├── Check User
                        └── Attach User to Request
```

## Data Flow

### Authentication Flow

```
1. User Submits Credentials
   ↓
2. Frontend sends to /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Token sent to Frontend
   ↓
6. Token stored in localStorage
   ↓
7. Token attached to all subsequent requests
```

### State Management Flow (Frontend)

```
┌────────────────┐
│  AuthContext   │
│  (Provider)    │
└────────┬───────┘
         │
    ┌────┴────┐
    │  State  │
    │  • user │
    │  • loading│
    └────┬────┘
         │
    ┌────┴────────────┐
    │   Functions     │
    │  • login()      │
    │  • logout()     │
    └────┬────────────┘
         │
         ↓
  ┌──────────────┐
  │  Components  │
  │  (Consumers) │
  └──────────────┘
```

## Database Schema

### User Collection

```javascript
User {
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum),
  phone: String,
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                 │
├─────────────────────────────────────────┤
│                                         │
│  1. Password Hashing (bcrypt)           │
│     ↓                                   │
│  2. JWT Token Generation                │
│     ↓                                   │
│  3. Token Verification Middleware       │
│     ↓                                   │
│  4. Role-Based Authorization            │
│     ↓                                   │
│  5. CORS Configuration                  │
│     ↓                                   │
│  6. Environment Variables               │
│                                         │
└─────────────────────────────────────────┘
```

## Module Structure

### Current Modules

1. **Authentication Module** ✅
   - User Registration
   - User Login
   - Token Management
   - Protected Routes

### Planned Modules

2. **Employee Management Module** 📋
   - CRUD Operations
   - Employee Profiles
   - Document Management

3. **Leave Management Module** 📋
   - Leave Applications
   - Approval Workflow
   - Leave Balance

4. **Attendance Module** 📋
   - Clock In/Out
   - Attendance Records
   - Reports

5. **Payroll Module** 📋
   - Salary Management
   - Payslip Generation
   - Tax Calculations

6. **Department Module** 📋
   - Department CRUD
   - Team Management
   - Hierarchy

7. **Reports Module** 📋
   - Analytics Dashboard
   - Custom Reports
   - Export Functionality

## API Structure

```
/api
│
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   └── GET    /me
│
├── /employees (Future)
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   └── DELETE /:id
│
├── /leaves (Future)
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   └── PATCH  /:id/approve
│
└── /attendance (Future)
    ├── GET    /
    ├── POST   /clock-in
    └── POST   /clock-out
```

## Technology Stack Details

### Backend Stack
```
Node.js (Runtime)
    ↓
Express.js (Framework)
    ↓
Mongoose (ODM)
    ↓
MongoDB (Database)

Additional:
- JWT (Authentication)
- bcryptjs (Encryption)
- cors (CORS Handling)
- dotenv (Environment Config)
```

### Frontend Stack
```
React (UI Library)
    ↓
React Router (Routing)
    ↓
Context API (State)
    ↓
Axios (HTTP Client)

Additional:
- React Toastify (Notifications)
- React Icons (Icons)
```

## Deployment Architecture (Future)

```
┌──────────────────────────────────────────────────┐
│                  Production                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  Frontend (Vercel/Netlify)                      │
│       ↓                                          │
│  Backend (Heroku/AWS/DigitalOcean)              │
│       ↓                                          │
│  Database (MongoDB Atlas)                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Error Handling Flow

```
Error Occurs
    ↓
Controller catches error
    ↓
Error passed to errorHandler middleware
    ↓
Error formatted based on type
    ↓
JSON response sent to client
    ↓
Frontend displays toast notification
```

## Middleware Chain

```
Request
    ↓
express.json() (Parse JSON)
    ↓
cors() (CORS Headers)
    ↓
protect() (JWT Verification) [if protected route]
    ↓
authorize() (Role Check) [if role-based route]
    ↓
Route Handler (Controller)
    ↓
errorHandler() (Error Handling)
    ↓
Response
```

---

This architecture is designed to be:
- **Scalable**: Easy to add new modules
- **Maintainable**: Clear separation of concerns
- **Secure**: Multiple security layers
- **Testable**: Modular structure
- **Extensible**: Ready for new features

