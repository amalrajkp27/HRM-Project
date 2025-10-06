# 📚 Detailed File Guide - HRM Project

This document provides a comprehensive explanation of **every file** in the HRM project, including their purpose, use cases, and detailed function explanations.

---

## 📑 Table of Contents

1. [Root Configuration Files](#root-configuration-files)
2. [Backend Files](#backend-files)
3. [Frontend Files](#frontend-files)
4. [Documentation Files](#documentation-files)

---

# Root Configuration Files

## 1. `package.json` (Root)

**Location**: `/package.json`

### Purpose
Root-level package.json that provides convenient scripts to manage both backend and frontend from a single location.

### Use Cases
- Install dependencies for both backend and frontend at once
- Quick access to start scripts
- Centralized project metadata

### Contents Explanation
```json
{
  "name": "hrm_project",           // Project name
  "version": "1.0.0",               // Version number
  "description": "...",             // Project description
  "scripts": {
    "backend": "cd backend && npm run dev",        // Start backend in dev mode
    "frontend": "cd frontend && npm start",        // Start frontend
    "install-backend": "cd backend && npm install", // Install backend deps
    "install-frontend": "cd frontend && npm install", // Install frontend deps
    "install-all": "npm run install-backend && npm run install-frontend" // Install all
  }
}
```

### How to Use
```bash
# Install all dependencies
npm run install-all

# Run backend only
npm run backend

# Run frontend only
npm run frontend
```

---

## 2. `.env` (Environment Variables)

**Location**: `/.env`

### Purpose
Stores sensitive configuration data and environment-specific variables for the backend server.

### Use Cases
- Database connection strings
- API keys and secrets
- Environment-specific configurations
- Port configurations

### Variables Explained
```env
# Server Configuration
NODE_ENV=development          # Environment: development/production
PORT=5000                     # Server port number

# Database Configuration
MONGODB_URI=mongodb://...     # MongoDB connection string
                              # CRITICAL: Update this with your actual MongoDB URI

# JWT Configuration
JWT_SECRET=your_secret_key    # Secret key for signing JWT tokens
                              # CRITICAL: Change this in production

# Frontend URL
FRONTEND_URL=http://localhost:3000  # Frontend URL for CORS
```

### Security Notes
- ⚠️ **NEVER commit this file to Git** (already in .gitignore)
- ⚠️ Change `JWT_SECRET` before production deployment
- ⚠️ Use strong, random secrets in production

---

## 3. `.env.example`

**Location**: `/.env.example`

### Purpose
Template file showing what environment variables are needed without exposing actual secrets.

### Use Cases
- Onboarding new developers
- Documenting required environment variables
- Safe to commit to version control

### How to Use
```bash
# Copy example to create your own .env
cp .env.example .env
# Then edit .env with your actual values
```

---

## 4. `.gitignore`

**Location**: `/.gitignore`

### Purpose
Tells Git which files and directories to ignore and not track in version control.

### Use Cases
- Prevent committing sensitive data (`.env` files)
- Exclude generated files (`node_modules`, `build`)
- Ignore system files (`.DS_Store`)
- Keep repository clean

### Categories Explained
```gitignore
# Dependencies - Don't commit installed packages
node_modules/

# Environment - Don't commit secrets
.env
.env.local

# Builds - Don't commit generated files
build/
dist/

# Logs - Don't commit log files
*.log

# OS files - Don't commit system files
.DS_Store
Thumbs.db

# IDE files - Don't commit editor configs
.vscode/
.idea/
```

---

## 5. `index.js`

**Location**: `/index.js`

### Purpose
Placeholder file with helpful comments. Not actually used by the application.

### Use Cases
- Quick reference for developers
- Shows where actual entry points are

### Content
Just contains comments pointing to actual server files:
- Backend: `backend/server.js`
- Frontend: `frontend/src/index.js`

---

# Backend Files

## Backend Configuration Files

### 1. `backend/package.json`

**Location**: `/backend/package.json`

### Purpose
Defines backend dependencies, scripts, and metadata.

### Dependencies Explained

#### Production Dependencies
```json
{
  "express": "^4.18.2",        // Web framework for Node.js
  "mongoose": "^8.0.3",        // MongoDB object modeling tool
  "dotenv": "^16.3.1",         // Loads environment variables from .env
  "bcryptjs": "^2.4.3",        // Password hashing library
  "jsonwebtoken": "^9.0.2",   // JWT token generation/verification
  "cors": "^2.8.5"            // Enable Cross-Origin Resource Sharing
}
```

#### Dev Dependencies
```json
{
  "nodemon": "^3.0.2"          // Auto-restart server on file changes
}
```

### Scripts Explained
```json
{
  "start": "node server.js",    // Production mode (no auto-restart)
  "dev": "nodemon server.js"    // Development mode (auto-restart)
}
```

### Use Cases
- `npm start` - Run in production
- `npm run dev` - Run in development with hot reload

---

### 2. `backend/server.js`

**Location**: `/backend/server.js`

### Purpose
**Main entry point** for the backend application. Initializes Express server, connects to database, and configures middleware.

### Use Cases
- Starting the backend server
- Central configuration point
- Route registration
- Middleware setup

### Code Breakdown

#### 1. Import Dependencies
```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
```
**Purpose**: Load required packages and custom modules

#### 2. Load Environment Variables
```javascript
dotenv.config();
```
**Purpose**: Reads `.env` file and makes variables available via `process.env`

#### 3. Connect to Database
```javascript
connectDB();
```
**Purpose**: Establishes connection to MongoDB database

#### 4. Create Express App
```javascript
const app = express();
```
**Purpose**: Creates an Express application instance

#### 5. Configure Middleware
```javascript
app.use(express.json());                    // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cors());                            // Enable CORS for frontend access
```
**Purpose**: 
- `express.json()` - Allows server to accept JSON in request body
- `express.urlencoded()` - Allows server to accept form data
- `cors()` - Allows frontend (different port) to access backend

#### 6. Register Routes
```javascript
app.use('/api/auth', require('./src/routes/authRoutes'));
```
**Purpose**: All routes starting with `/api/auth` are handled by authRoutes

#### 7. Health Check Endpoint
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});
```
**Purpose**: Simple endpoint to check if server is running
**Use Case**: Monitoring, deployment health checks

#### 8. Error Handler
```javascript
app.use(errorHandler);
```
**Purpose**: Catches all errors and sends formatted responses

#### 9. Start Server
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
**Purpose**: Starts server on specified port

### Flow Diagram
```
Start
  ↓
Load .env variables
  ↓
Connect to MongoDB
  ↓
Create Express app
  ↓
Apply middleware (JSON, CORS)
  ↓
Register routes (/api/auth)
  ↓
Apply error handler
  ↓
Start listening on port 5000
```

---

## Backend Config Files

### 3. `backend/src/config/database.js`

**Location**: `/backend/src/config/database.js`

### Purpose
Handles MongoDB database connection using Mongoose.

### Use Cases
- Connect to MongoDB on server startup
- Handle connection errors
- Configure Mongoose options

### Function Explanation

#### `connectDB()` Function
```javascript
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,      // Use new URL parser
      useUnifiedTopology: true,   // Use new Server Discover/Monitoring engine
    });

    // Log success message with host info
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error and exit process
    console.error(`Error: ${error.message}`);
    process.exit(1);  // Exit with failure code
  }
};
```

**Parameters**: None

**Returns**: Nothing (async function)

**What it does**:
1. Reads MongoDB URI from environment variables
2. Attempts to connect using Mongoose
3. Logs success message if connected
4. Exits process if connection fails

**Example Output**:
```
MongoDB Connected: cluster0.mongodb.net
```

### Use Cases
- Called once when server starts
- Automatically reconnects if connection drops
- Validates connection before server accepts requests

---

### 4. `backend/src/config/constants.js`

**Location**: `/backend/src/config/constants.js`

### Purpose
Centralizes all application constants and enums in one place for easy maintenance.

### Use Cases
- Consistent values across application
- Easy to update values in one place
- Type safety and validation

### Constants Explained

#### 1. User Roles
```javascript
USER_ROLES: {
  ADMIN: 'admin',              // Full system access
  HR_MANAGER: 'hr_manager',    // HR operations
  EMPLOYEE: 'employee',        // Basic access
  DEPARTMENT_HEAD: 'department_head',  // Department management
}
```
**Use Case**: Used in User model, authorization middleware
**Example**: `if (user.role === USER_ROLES.ADMIN) { ... }`

#### 2. Leave Status
```javascript
LEAVE_STATUS: {
  PENDING: 'pending',          // Awaiting approval
  APPROVED: 'approved',        // Approved by manager
  REJECTED: 'rejected',        // Rejected by manager
}
```
**Use Case**: Future leave management feature

#### 3. Employment Status
```javascript
EMPLOYMENT_STATUS: {
  ACTIVE: 'active',            // Currently employed
  INACTIVE: 'inactive',        // Temporarily inactive
  TERMINATED: 'terminated',    // No longer employed
  ON_LEAVE: 'on_leave',       // On extended leave
}
```
**Use Case**: Employee management feature

#### 4. Department Types
```javascript
DEPARTMENT_TYPES: {
  IT: 'IT',
  HR: 'HR',
  FINANCE: 'Finance',
  MARKETING: 'Marketing',
  SALES: 'Sales',
  OPERATIONS: 'Operations',
}
```
**Use Case**: Department management feature

### Benefits
- **Consistency**: Same values used throughout app
- **Maintainability**: Update in one place
- **Autocomplete**: IDE can suggest values
- **Type Safety**: Prevents typos

---

## Backend Models

### 5. `backend/src/models/User.js`

**Location**: `/backend/src/models/User.js`

### Purpose
Defines the User schema for MongoDB and includes methods for password handling.

### Use Cases
- User registration
- User authentication
- User profile management
- Role-based access control

### Schema Structure

#### Schema Definition
```javascript
const userSchema = new mongoose.Schema({
  // ... fields
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});
```

#### Field Explanations

##### 1. Basic Information
```javascript
firstName: {
  type: String,
  required: [true, 'Please add first name'],  // Validation with error message
  trim: true,                                  // Removes whitespace
}
```
**Purpose**: Store user's first name
**Validation**: Required field, automatically trimmed

```javascript
lastName: {
  type: String,
  required: [true, 'Please add last name'],
  trim: true,
}
```
**Purpose**: Store user's last name

```javascript
email: {
  type: String,
  required: [true, 'Please add an email'],
  unique: true,              // Ensures no duplicate emails
  lowercase: true,           // Converts to lowercase
  match: [/^\w+.../, '...'], // Validates email format with regex
}
```
**Purpose**: Store unique email address
**Validation**: Required, unique, valid email format

```javascript
password: {
  type: String,
  required: [true, 'Please add a password'],
  minlength: 6,              // Minimum 6 characters
  select: false,             // Don't include in queries by default
}
```
**Purpose**: Store hashed password
**Security**: 
- Never retrieved unless explicitly requested
- Automatically hashed before saving

##### 2. Role and Permissions
```javascript
role: {
  type: String,
  enum: ['admin', 'hr_manager', 'employee', 'department_head'],
  default: 'employee',       // New users are employees by default
}
```
**Purpose**: User's role for access control
**Values**: Only accepts specified roles

##### 3. Contact Information
```javascript
phone: {
  type: String,
  trim: true,
}
```
**Optional field** for phone number

##### 4. Personal Information
```javascript
dateOfBirth: {
  type: Date,
}
```
**Optional field** for birthdate

##### 5. Address (Subdocument)
```javascript
address: {
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
}
```
**Purpose**: Store complete address
**Structure**: Nested object within user document

##### 6. Profile Settings
```javascript
avatar: {
  type: String,
  default: '',               // Empty string if no avatar
}
```
**Purpose**: URL to profile picture

```javascript
isActive: {
  type: Boolean,
  default: true,             // Users active by default
}
```
**Purpose**: Enable/disable user accounts

### Middleware (Pre-save Hook)

#### Password Hashing
```javascript
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    next();
  }

  // Generate salt (random data added to password)
  const salt = await bcrypt.genSalt(10);
  
  // Hash password with salt
  this.password = await bcrypt.hash(this.password, salt);
});
```

**What it does**:
1. Runs automatically before saving user to database
2. Checks if password field was modified
3. If modified, generates a salt (10 rounds)
4. Hashes password with salt using bcrypt
5. Replaces plain password with hashed version

**Example**:
```
Plain password: "mypassword123"
          ↓
Salt: "$2a$10$N9qo8uLOickgx2ZMRZoMye"
          ↓
Hashed: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

### Instance Methods

#### `matchPassword(enteredPassword)`
```javascript
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**Purpose**: Compare entered password with stored hashed password

**Parameters**:
- `enteredPassword` (String): Password entered by user during login

**Returns**: Boolean
- `true` if passwords match
- `false` if passwords don't match

**Usage Example**:
```javascript
const user = await User.findOne({ email: 'john@example.com' }).select('+password');
const isMatch = await user.matchPassword('userEnteredPassword');
if (isMatch) {
  // Password correct, log user in
} else {
  // Password incorrect, show error
}
```

### Model Export
```javascript
module.exports = mongoose.model('User', userSchema);
```
**Creates a model** named 'User' that can perform database operations

### Usage Examples

#### Create New User
```javascript
const user = await User.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',  // Will be automatically hashed
  role: 'employee'
});
```

#### Find User by Email
```javascript
const user = await User.findOne({ email: 'john@example.com' });
```

#### Update User
```javascript
const user = await User.findByIdAndUpdate(userId, {
  firstName: 'Jane'
}, { new: true });
```

---

## Backend Controllers

### 6. `backend/src/controllers/authController.js`

**Location**: `/backend/src/controllers/authController.js`

### Purpose
Contains business logic for authentication operations (register, login, get current user).

### Use Cases
- User registration
- User login
- Retrieve authenticated user information

### Functions Explained

#### 1. `register(req, res)` Function

```javascript
const register = async (req, res) => {
  try {
    // Extract data from request body
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,              // Will be hashed by pre-save hook
      role: role || 'employee',  // Default to employee if not specified
    });

    // Send response with user data and token
    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),  // Generate JWT token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Route**: `POST /api/auth/register`

**Access**: Public (anyone can register)

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"  // Optional
}
```

**Response** (Success - 201):
```json
{
  "_id": "65abc123...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (Error - 400):
```json
{
  "message": "User already exists"
}
```

**Flow**:
1. Extract user data from request
2. Check if email already exists
3. If exists, return error
4. If new, create user (password auto-hashed)
5. Generate JWT token
6. Return user data + token

---

#### 2. `login(req, res)` Function

```javascript
const login = async (req, res) => {
  try {
    // Extract credentials
    const { email, password } = req.body;

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Login successful
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // Invalid credentials
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Route**: `POST /api/auth/login`

**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (Success - 200):
```json
{
  "_id": "65abc123...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "employee",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (Error - 401):
```json
{
  "message": "Invalid email or password"
}
```

**Flow**:
1. Extract email and password
2. Find user by email (include password field)
3. Check if user exists
4. Compare entered password with stored hash
5. If match, generate token and return user data
6. If no match, return error

**Security Note**: 
- Uses `.select('+password')` because password is excluded by default
- Uses `matchPassword()` method to compare hashed passwords
- Returns same error message whether email or password is wrong (security best practice)

---

#### 3. `getMe(req, res)` Function

```javascript
const getMe = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Route**: `GET /api/auth/me`

**Access**: Private (requires authentication)

**Headers Required**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (Success - 200):
```json
{
  "_id": "65abc123...",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "employee",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Flow**:
1. `protect` middleware runs first (validates JWT)
2. Middleware attaches user to `req.user`
3. Controller fetches full user data from database
4. Returns user data

**Use Cases**:
- Get current logged-in user details
- Refresh user data after login
- Check user permissions

---

### Module Export
```javascript
module.exports = {
  register,
  login,
  getMe,
};
```

Exports all three functions for use in routes.

---

## Backend Middleware

### 7. `backend/src/middleware/auth.js`

**Location**: `/backend/src/middleware/auth.js`

### Purpose
Provides authentication and authorization middleware to protect routes.

### Use Cases
- Verify JWT tokens
- Protect routes from unauthorized access
- Role-based access control

### Functions Explained

#### 1. `protect` Middleware

```javascript
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      // Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      token = req.headers.authorization.split(' ')[1];

      // Verify token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // decoded contains: { id: "user_id", iat: timestamp, exp: timestamp }

      // Get user from database using ID from token
      req.user = await User.findById(decoded.id).select('-password');
      // Attach user to request object (without password)

      next();  // Continue to next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // No token provided
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
```

**Purpose**: Verify JWT token and attach user to request

**How It Works**:
1. Checks for Authorization header
2. Extracts token from "Bearer TOKEN" format
3. Verifies token signature using JWT_SECRET
4. Decodes token to get user ID
5. Fetches user from database
6. Attaches user to `req.user`
7. Calls `next()` to continue

**Usage Example**:
```javascript
// In routes
router.get('/protected', protect, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

**Token Format**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWJjMTIzIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Error Responses**:
- No token: `401 - Not authorized, no token`
- Invalid token: `401 - Not authorized, token failed`
- Expired token: `401 - Not authorized, token failed`

---

#### 2. `authorize(...roles)` Middleware

```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
```

**Purpose**: Restrict routes to specific user roles

**Parameters**:
- `...roles` - Variable number of allowed roles

**How It Works**:
1. Returns a middleware function
2. Checks if user's role is in allowed roles array
3. If authorized, calls `next()`
4. If not, returns 403 Forbidden error

**Usage Examples**:

```javascript
// Only admins can access
router.delete('/users/:id', 
  protect,  // Must be authenticated
  authorize('admin'),  // Must be admin
  deleteUser
);

// Admins or HR managers can access
router.get('/employees', 
  protect,
  authorize('admin', 'hr_manager'),
  getEmployees
);

// Multiple roles
router.post('/leave',
  protect,
  authorize('employee', 'admin', 'hr_manager'),
  createLeave
);
```

**Response** (Unauthorized - 403):
```json
{
  "message": "User role 'employee' is not authorized to access this route"
}
```

**Important Notes**:
- Must use `protect` middleware before `authorize`
- `protect` sets `req.user` which `authorize` needs
- Returns 403 (Forbidden) not 401 (Unauthorized)
  - 401 = Not logged in
  - 403 = Logged in but insufficient permissions

---

### Module Export
```javascript
module.exports = { protect, authorize };
```

### Complete Usage Example

```javascript
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Public route - no middleware
router.post('/register', register);

// Protected route - authentication required
router.get('/profile', protect, getProfile);

// Admin only route
router.delete('/user/:id', protect, authorize('admin'), deleteUser);

// Multiple roles allowed
router.get('/reports', 
  protect, 
  authorize('admin', 'hr_manager', 'department_head'),
  getReports
);
```

---

### 8. `backend/src/middleware/errorHandler.js`

**Location**: `/backend/src/middleware/errorHandler.js`

### Purpose
Centralized error handling middleware that catches all errors and sends formatted responses.

### Use Cases
- Handle Mongoose validation errors
- Handle MongoDB duplicate key errors
- Handle invalid ObjectId errors
- Format error messages consistently
- Hide stack traces in production

### Function Explanation

```javascript
const errorHandler = (err, req, res, next) => {
  // Set status code (default to 500 if not set)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Handle Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message);
    statusCode = 400;
  }

  // Send error response
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
```

**Parameters**:
- `err` - Error object
- `req` - Request object
- `res` - Response object
- `next` - Next middleware function

### Error Types Handled

#### 1. CastError (Invalid ObjectId)
```javascript
if (err.name === 'CastError') {
  message = 'Resource not found';
  statusCode = 404;
}
```

**When it occurs**: Invalid MongoDB ObjectId format

**Example**:
```javascript
// Request: GET /api/users/invalid_id
// MongoDB expects: 507f1f77bcf86cd799439011
// Response: 404 - Resource not found
```

#### 2. Duplicate Key Error (Code 11000)
```javascript
if (err.code === 11000) {
  message = 'Duplicate field value entered';
  statusCode = 400;
}
```

**When it occurs**: Trying to insert duplicate value in unique field

**Example**:
```javascript
// Trying to register with existing email
// Response: 400 - Duplicate field value entered
```

#### 3. Validation Error
```javascript
if (err.name === 'ValidationError') {
  message = Object.values(err.errors).map((val) => val.message);
  statusCode = 400;
}
```

**When it occurs**: Mongoose schema validation fails

**Example**:
```javascript
// Missing required field
// Response: 400 - ["Please add first name", "Please add email"]
```

### Response Format

**Development Mode**:
```json
{
  "message": "Error message",
  "stack": "Error: message\n    at Function.Module..."
}
```

**Production Mode**:
```json
{
  "message": "Error message",
  "stack": null
}
```

### Usage in Express

```javascript
// In server.js
app.use('/api/routes', someRoutes);

// Error handler MUST be last middleware
app.use(errorHandler);
```

### How Errors Reach This Middleware

**Method 1: Throw Error**
```javascript
if (!user) {
  throw new Error('User not found');
}
```

**Method 2: Pass to next()**
```javascript
try {
  // code
} catch (error) {
  next(error);  // Passes error to errorHandler
}
```

**Method 3: Express catches async errors**
```javascript
const asyncHandler = require('express-async-handler');

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // If error occurs, automatically caught and sent to errorHandler
});
```

---

## Backend Routes

### 9. `backend/src/routes/authRoutes.js`

**Location**: `/backend/src/routes/authRoutes.js`

### Purpose
Defines all authentication-related API routes and maps them to controller functions.

### Use Cases
- User registration endpoint
- User login endpoint
- Get current user endpoint

### Code Explanation

```javascript
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/me', protect, getMe);

module.exports = router;
```

### Routes Breakdown

#### 1. Register Route
```javascript
router.post('/register', register);
```

**Full URL**: `POST /api/auth/register`

**Middleware**: None (public)

**Controller**: `register`

**Purpose**: Create new user account

**Request**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

#### 2. Login Route
```javascript
router.post('/login', login);
```

**Full URL**: `POST /api/auth/login`

**Middleware**: None (public)

**Controller**: `login`

**Purpose**: Authenticate user and return token

**Request**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

#### 3. Get Me Route
```javascript
router.get('/me', protect, getMe);
```

**Full URL**: `GET /api/auth/me`

**Middleware**: `protect` (requires JWT token)

**Controller**: `getMe`

**Purpose**: Get current authenticated user's data

**Headers Required**:
```
Authorization: Bearer {token}
```

---

### How Routes are Registered

In `server.js`:
```javascript
app.use('/api/auth', require('./src/routes/authRoutes'));
```

This means:
- `/register` becomes `/api/auth/register`
- `/login` becomes `/api/auth/login`
- `/me` becomes `/api/auth/me`

---

## Backend Utilities

### 10. `backend/src/utils/generateToken.js`

**Location**: `/backend/src/utils/generateToken.js`

### Purpose
Utility function to generate JWT (JSON Web Token) for authentication.

### Use Cases
- Generate token after successful registration
- Generate token after successful login
- Create session tokens

### Function Explanation

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },                        // Payload: user ID
    process.env.JWT_SECRET,        // Secret key
    { expiresIn: '30d' }          // Token expires in 30 days
  );
};

module.exports = generateToken;
```

**Parameters**:
- `id` (String) - User's MongoDB ObjectId

**Returns**: String (JWT token)

### How It Works

#### 1. Payload
```javascript
{ id }
```
The data encoded in the token (user's ID)

#### 2. Secret
```javascript
process.env.JWT_SECRET
```
Secret key used to sign the token (from .env file)

#### 3. Options
```javascript
{ expiresIn: '30d' }
```
Token automatically expires after 30 days

### Token Structure

A JWT has three parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWJjMTIzIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│                                      │                                    │
│         Header                       │         Payload                    │         Signature
```

**Header** (Base64):
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (Base64):
```json
{
  "id": "65abc123",
  "iat": 1616239022,
  "exp": 1618831022
}
```

**Signature**:
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Usage Examples

**In Controller**:
```javascript
const generateToken = require('../utils/generateToken');

// After successful login
const token = generateToken(user._id);

res.json({
  _id: user._id,
  email: user.email,
  token: token
});
```

**In Client**:
```javascript
// Store token
localStorage.setItem('token', token);

// Use in requests
axios.get('/api/auth/me', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### Security Considerations

- Token can be decoded by anyone (don't store sensitive data)
- Token can't be modified without secret key
- Token expires automatically
- If secret changes, all tokens become invalid
- Keep JWT_SECRET secure and never commit it

---

# Frontend Files

## Frontend Configuration

### 11. `frontend/package.json`

**Location**: `/frontend/package.json`

### Purpose
Defines frontend dependencies, scripts, and React configuration.

### Dependencies Explained

#### Production Dependencies
```json
{
  "react": "^18.2.0",              // React library
  "react-dom": "^18.2.0",          // React DOM rendering
  "react-router-dom": "^6.20.0",  // Client-side routing
  "axios": "^1.6.2",               // HTTP client for API calls
  "react-icons": "^4.12.0",        // Icon library
  "react-toastify": "^9.1.3"      // Toast notifications
}
```

#### Dev Dependencies
```json
{
  "react-scripts": "5.0.1"         // Build tools, webpack config
}
```

### Scripts
```json
{
  "start": "react-scripts start",   // Development server (port 3000)
  "build": "react-scripts build",   // Production build
  "test": "react-scripts test",     // Run tests
  "eject": "react-scripts eject"    // Eject from Create React App
}
```

---

### 12. `frontend/.env`

**Location**: `/frontend/.env`

### Purpose
Frontend environment variables (different from backend .env).

### Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Important**: 
- React environment variables MUST start with `REACT_APP_`
- Available in code as `process.env.REACT_APP_API_URL`
- Different from backend's `.env`

### Usage
```javascript
const API_URL = process.env.REACT_APP_API_URL;
axios.get(`${API_URL}/auth/me`);
```

---

## Frontend Public Files

### 13. `frontend/public/index.html`

**Location**: `/frontend/public/index.html`

### Purpose
HTML template file that serves as the entry point for the React application.

### Code Explanation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Human Resource Management System" />
    <title>HRM System</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!-- React app mounts here -->
  </body>
</html>
```

**Key Elements**:

1. **Viewport Meta Tag**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```
Makes app responsive on mobile devices

2. **Root Div**:
```html
<div id="root"></div>
```
React renders entire app inside this div

3. **Noscript**:
```html
<noscript>You need to enable JavaScript to run this app.</noscript>
```
Shows message if JavaScript is disabled

### How React Connects

In `src/index.js`:
```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## Frontend Entry Files

### 14. `frontend/src/index.js`

**Location**: `/frontend/src/index.js`

### Purpose
Entry point for React application. Renders root component into DOM.

### Code Explanation

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**What happens**:
1. Finds `<div id="root">` in index.html
2. Creates React root
3. Renders `<App />` component inside `<React.StrictMode>`

**React.StrictMode**:
- Development mode helper
- Highlights potential problems
- Doesn't render any UI
- Doesn't affect production build

---

### 15. `frontend/src/index.css`

**Location**: `/frontend/src/index.css`

### Purpose
Base/global styles for the entire application.

### Code Explanation

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

**Explanation**:
- Removes default body margin
- Sets system font stack (uses OS native fonts)
- Enables font smoothing for better readability
- Sets monospace font for code elements

---

### 16. `frontend/src/App.js`

**Location**: `/frontend/src/App.js`

### Purpose
**Root component** of the application. Sets up routing, global state, and layout.

### Code Breakdown

#### 1. Imports
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
```

#### 2. App Component
```javascript
function App() {
  return (
    <Router>                          {/* Enables client-side routing */}
      <AuthProvider>                  {/* Provides authentication state */}
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected route */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Toast notifications container */}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}
```

### Component Structure

```
<Router>                    ← Enables routing
  └── <AuthProvider>        ← Provides auth state to all children
        └── <Routes>        ← Defines all routes
              ├── Public routes (Login, Register)
              ├── Protected routes (Dashboard)
              └── 404 route (NotFound)
```

### Routes Explained

#### Public Routes
```javascript
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```
- Accessible without authentication
- Users who are already logged in should be redirected away

#### Protected Routes
```javascript
<Route
  path="/"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
```
- Requires authentication
- `PrivateRoute` checks if user is logged in
- If not logged in, redirects to `/login`

#### Catch-all Route
```javascript
<Route path="*" element={<NotFound />} />
```
- Matches any undefined route
- Shows 404 page

### Toast Container
```javascript
<ToastContainer position="top-right" autoClose={3000} />
```
**Purpose**: Shows notification toasts

**Options**:
- `position="top-right"` - Where toasts appear
- `autoClose={3000}` - Auto-close after 3 seconds

**Usage in other components**:
```javascript
import { toast } from 'react-toastify';

toast.success('Login successful!');
toast.error('Invalid credentials');
toast.info('Profile updated');
```

---

### 17. `frontend/src/App.css`

**Location**: `/frontend/src/App.css`

### Purpose
Global styles and reusable CSS classes for the entire application.

### Sections Breakdown

#### 1. Reset & Base Styles
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;  /* Padding/border included in width */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...;
  -webkit-font-smoothing: antialiased;
  background: #f5f5f5;
}
```
**Purpose**: Reset browser defaults, set base font

#### 2. Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```
**Purpose**: Centered content wrapper with max width

**Usage**:
```jsx
<div className="container">
  <h1>Page Content</h1>
</div>
```

#### 3. Buttons
```css
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}
```
**Purpose**: Reusable button styles

**Usage**:
```jsx
<button className="btn btn-primary">Submit</button>
<button className="btn btn-secondary">Cancel</button>
```

#### 4. Forms
```css
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #334155;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
}
```
**Purpose**: Consistent form styling

**Usage**:
```jsx
<div className="form-group">
  <label htmlFor="email">Email</label>
  <input type="email" id="email" name="email" />
</div>
```

#### 5. Cards
```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```
**Purpose**: Card-style containers with hover effect

#### 6. Loading Spinner
```css
.spinner {
  border: 4px solid #f3f4f6;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```
**Purpose**: Loading indicator

**Usage**:
```jsx
{loading && <div className="spinner"></div>}
```

---

## Frontend Context

### 18. `frontend/src/context/AuthContext.js`

**Location**: `/frontend/src/context/AuthContext.js`

### Purpose
Manages global authentication state using React Context API.

### Use Cases
- Store logged-in user data
- Provide login/logout functions
- Persist authentication across page reloads
- Share auth state with all components

### Code Breakdown

#### 1. Create Context
```javascript
export const AuthContext = createContext();
```
Creates a context object

#### 2. AuthProvider Component
```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### State Variables

#### `user`
```javascript
const [user, setUser] = useState(null);
```
**Type**: Object | null

**Structure**:
```javascript
{
  _id: "65abc123...",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  role: "employee"
}
```

**Purpose**: Stores current logged-in user data

#### `loading`
```javascript
const [loading, setLoading] = useState(true);
```
**Type**: Boolean

**Purpose**: Indicates if auth state is being initialized

### Functions

#### `login(userData, token)`
```javascript
const login = (userData, token) => {
  // Store token in localStorage
  localStorage.setItem('token', token);
  
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Set default Authorization header for all axios requests
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Update state
  setUser(userData);
};
```

**Parameters**:
- `userData` (Object) - User information
- `token` (String) - JWT token

**Purpose**: Logs user in and persists session

**Usage**:
```javascript
const { login } = useContext(AuthContext);

// After successful API login
const response = await authAPI.login(credentials);
const { token, ...userData } = response.data;
login(userData, token);
```

#### `logout()`
```javascript
const logout = () => {
  // Remove from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Remove Authorization header
  delete axios.defaults.headers.common['Authorization'];
  
  // Clear state
  setUser(null);
};
```

**Purpose**: Logs user out and clears session

**Usage**:
```javascript
const { logout } = useContext(AuthContext);

// On logout button click
const handleLogout = () => {
  logout();
  navigate('/login');
};
```

### useEffect Hook
```javascript
useEffect(() => {
  // Check localStorage for existing session
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (token && userData) {
    // Restore user session
    setUser(JSON.parse(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  setLoading(false);
}, []);
```

**Purpose**: Restore authentication state on page reload

**Flow**:
1. Component mounts
2. Check localStorage for token and user data
3. If found, restore user state and set auth header
4. Set loading to false

### Usage in Components

**Wrap App with Provider**:
```javascript
// In App.js
<AuthProvider>
  <Routes>
    {/* routes */}
  </Routes>
</AuthProvider>
```

**Use Context in Components**:
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Frontend Services

### 19. `frontend/src/services/api.js`

**Location**: `/frontend/src/services/api.js`

### Purpose
Centralized API service that handles all HTTP requests to the backend.

### Use Cases
- Make API calls to backend
- Automatically attach JWT tokens
- Handle request/response interceptors
- Centralize API configuration

### Code Breakdown

#### 1. Create Axios Instance
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Purpose**: Create configured axios instance

**baseURL**: All requests will be relative to this URL
- `api.get('/auth/me')` → `http://localhost:5000/api/auth/me`

#### 2. Request Interceptor
```javascript
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Add token to Authorization header if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**Purpose**: Automatically attach JWT token to every request

**How it works**:
1. Intercepts every request before sending
2. Gets token from localStorage
3. Adds Authorization header if token exists
4. Proceeds with request

**Result**:
```javascript
// You write:
api.get('/auth/me');

// Actually sends:
GET /api/auth/me
Headers: {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Auth API Endpoints
```javascript
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};
```

**Purpose**: Pre-configured API methods

**Usage Examples**:

**Login**:
```javascript
import { authAPI } from '../services/api';

const credentials = {
  email: 'john@example.com',
  password: 'password123'
};

try {
  const response = await authAPI.login(credentials);
  console.log(response.data);  // { _id, email, token, ... }
} catch (error) {
  console.error(error.response.data.message);
}
```

**Register**:
```javascript
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123'
};

const response = await authAPI.register(userData);
```

**Get Current User**:
```javascript
// Token automatically attached by interceptor
const response = await authAPI.getMe();
console.log(response.data);  // { _id, firstName, lastName, ... }
```

#### 4. Default Export
```javascript
export default api;
```

**Purpose**: Export axios instance for custom requests

**Usage**:
```javascript
import api from '../services/api';

// Custom requests
const employees = await api.get('/employees');
const leave = await api.post('/leave', leaveData);
```

### Complete Example

```javascript
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Call API
      const response = await authAPI.login(formData);
      
      // Extract token and user data
      const { token, ...userData } = response.data;
      
      // Update context
      login(userData, token);
      
      // Redirect
      navigate('/');
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  return (/* JSX */);
}
```

---

## Frontend Components

### 20. `frontend/src/components/PrivateRoute.js`

**Location**: `/frontend/src/components/PrivateRoute.js`

### Purpose
**Protected route wrapper** that redirects unauthenticated users to login page.

### Use Cases
- Protect routes that require authentication
- Redirect unauthorized users
- Show loading state during auth check

### Code Explanation

```javascript
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Show loading spinner while checking auth
  if (loading) {
    return <div className="spinner"></div>;
  }

  // If user exists, render children; otherwise redirect to login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
```

### How It Works

#### 1. Get Auth State
```javascript
const { user, loading } = useContext(AuthContext);
```
Gets current authentication state from context

#### 2. Handle Loading
```javascript
if (loading) {
  return <div className="spinner"></div>;
}
```
Shows spinner while checking localStorage for token

#### 3. Conditional Render
```javascript
return user ? children : <Navigate to="/login" />;
```
- If `user` exists → render protected content
- If `user` is null → redirect to `/login`

### Usage in Routes

```javascript
// In App.js
<Route
  path="/"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/employees"
  element={
    <PrivateRoute>
      <Employees />
    </PrivateRoute>
  }
/>
```

### Flow Diagram

```
User navigates to /dashboard
        ↓
PrivateRoute checks loading
        ↓
    loading = true? → Show spinner
        ↓
    loading = false
        ↓
    user exists?
    ↙        ↘
  YES         NO
   ↓           ↓
Render     Redirect
Dashboard  to /login
```

### Real-World Scenarios

**Scenario 1: Logged-in user**
```
User: Logged in
Action: Navigate to /dashboard
Result: Dashboard renders
```

**Scenario 2: Not logged-in user**
```
User: Not logged in
Action: Navigate to /dashboard
Result: Redirected to /login
```

**Scenario 3: Page reload**
```
User: Was logged in, page reloads
Action: Navigate to /dashboard
Result: 
  1. Shows spinner (loading=true)
  2. Checks localStorage
  3. Restores user
  4. Renders dashboard
```

---

[Continuing in next part due to length...]

Would you like me to continue with the remaining frontend pages (Login, Register, Dashboard, NotFound) and their CSS files? Each page file is quite detailed with function-by-function explanations.

