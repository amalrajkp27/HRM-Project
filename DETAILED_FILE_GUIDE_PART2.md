# 📚 Detailed File Guide - Part 2 (Frontend Pages)

This is a continuation of DETAILED_FILE_GUIDE.md covering all frontend pages and their styling.

---

## Frontend Pages

### 21. `frontend/src/pages/Login.js`

**Location**: `/frontend/src/pages/Login.js`

### Purpose
Login page component that handles user authentication.

### Use Cases
- User login with email and password
- Navigate to dashboard after successful login
- Show error messages for failed login
- Link to registration page

### Code Breakdown

#### 1. Imports and State
```javascript
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // ...
```

**State Variables**:

1. `formData` - Stores email and password
   ```javascript
   { email: '', password: '' }
   ```

2. `loading` - Button loading state
   ```javascript
   false | true
   ```

**Hooks Used**:
- `useState` - Local state management
- `useContext` - Access AuthContext
- `useNavigate` - Programmatic navigation
- `Link` - Navigate to register page

---

#### 2. handleChange Function
```javascript
const handleChange = (e) => {
  setFormData({
    ...formData,                    // Keep existing values
    [e.target.name]: e.target.value // Update changed field
  });
};
```

**Purpose**: Update form state when user types

**How it works**:
- `e.target.name` - Input's name attribute (email/password)
- `e.target.value` - Current input value
- Spread operator keeps other fields unchanged

**Example**:
```javascript
// User types in email field
// Before: { email: '', password: '' }
// After:  { email: 'j', password: '' }
```

---

#### 3. handleSubmit Function
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();  // Prevent page reload
  setLoading(true);    // Show loading state

  try {
    // Call login API
    const response = await authAPI.login(formData);
    
    // Extract token and user data
    const { token, ...userData } = response.data;
    
    // Update global auth state
    login(userData, token);
    
    // Show success message
    toast.success('Login successful!');
    
    // Redirect to dashboard
    navigate('/');
  } catch (error) {
    // Show error message
    toast.error(error.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);  // Hide loading state
  }
};
```

**Purpose**: Handle form submission

**Flow**:
```
1. User clicks Submit
   ↓
2. Prevent default form submission
   ↓
3. Set loading = true (disable button)
   ↓
4. Call login API with credentials
   ↓
5a. Success:                    5b. Error:
    - Extract token                 - Show error toast
    - Update AuthContext            - Keep on login page
    - Show success toast
    - Navigate to dashboard
   ↓
6. Set loading = false
```

**Error Handling**:
- Network error: Shows "Login failed"
- Invalid credentials: Shows server message
- Token missing: Shows "Login failed"

---

#### 4. JSX Structure
```javascript
return (
  <div className="auth-container">
    <div className="auth-card">
      <h1>Welcome Back</h1>
      <p className="auth-subtitle">Login to your HRM account</p>
      
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        
        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {/* Link to Register */}
      <p className="auth-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  </div>
);
```

**Key Elements**:

1. **Controlled Inputs**:
   ```javascript
   value={formData.email}  // React controls value
   onChange={handleChange}  // Updates state on change
   ```

2. **Required Validation**:
   ```javascript
   required  // HTML5 validation
   ```

3. **Conditional Button Text**:
   ```javascript
   {loading ? 'Logging in...' : 'Login'}
   ```

4. **Disabled State**:
   ```javascript
   disabled={loading}  // Prevents multiple submissions
   ```

### Complete Flow Example

**User Login Process**:
```
1. User enters: john@example.com / password123
   ↓
2. State updates: { email: 'john@example.com', password: 'password123' }
   ↓
3. User clicks Login button
   ↓
4. handleSubmit fires:
   - setLoading(true)
   - Button shows "Logging in..."
   - Button disabled
   ↓
5. API call: POST /api/auth/login
   ↓
6. Backend validates:
   - Finds user
   - Compares passwords
   - Generates token
   ↓
7. Response: { _id, firstName, lastName, email, role, token }
   ↓
8. Frontend:
   - Stores token in localStorage
   - Updates AuthContext
   - Shows success toast
   - Navigates to /
   ↓
9. User sees dashboard
```

---

### 22. `frontend/src/pages/Register.js`

**Location**: `/frontend/src/pages/Register.js`

### Purpose
Registration page for creating new user accounts.

### Use Cases
- New user registration
- Form validation (matching passwords)
- Auto-login after registration
- Navigate to dashboard after success

### Code Breakdown

#### 1. State Management
```javascript
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});
const [loading, setLoading] = useState(false);
const { login } = useContext(AuthContext);
const navigate = useNavigate();
```

**formData Structure**:
```javascript
{
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''  // Not sent to backend
}
```

---

#### 2. handleSubmit Function
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    toast.error('Passwords do not match');
    return;  // Stop submission
  }

  setLoading(true);

  try {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = formData;
    
    // Call register API
    const response = await authAPI.register(registerData);
    
    // Extract token and user data
    const { token, ...userData } = response.data;
    
    // Auto-login after registration
    login(userData, token);
    
    toast.success('Registration successful!');
    navigate('/');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};
```

**Key Features**:

1. **Password Validation**:
   ```javascript
   if (formData.password !== formData.confirmPassword) {
     toast.error('Passwords do not match');
     return;
   }
   ```
   Checks passwords match before API call

2. **Exclude confirmPassword**:
   ```javascript
   const { confirmPassword, ...registerData } = formData;
   ```
   Backend doesn't need confirmPassword

3. **Auto-login**:
   ```javascript
   login(userData, token);
   ```
   No need to login again after registration

---

#### 3. JSX Structure
```javascript
return (
  <div className="auth-container">
    <div className="auth-card">
      <h1>Create Account</h1>
      <p className="auth-subtitle">Register for HRM System</p>
      
      <form onSubmit={handleSubmit}>
        {/* Name Fields (Side by Side) */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="First name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Last name"
            />
          </div>
        </div>
        
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        
        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            placeholder="Enter password"
          />
        </div>
        
        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm password"
          />
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      {/* Link to Login */}
      <p className="auth-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  </div>
);
```

**Special Features**:

1. **form-row** (Grid Layout):
   ```jsx
   <div className="form-row">
     <div className="form-group">First Name</div>
     <div className="form-group">Last Name</div>
   </div>
   ```
   Displays fields side-by-side on desktop

2. **Password Minimum Length**:
   ```jsx
   minLength="6"
   ```
   HTML5 validation for password length

### Registration Flow

```
1. User fills form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Confirm: password123
   ↓
2. User clicks Register
   ↓
3. Frontend validates:
   - All fields filled? ✓
   - Password length ≥ 6? ✓
   - Passwords match? ✓
   ↓
4. API call: POST /api/auth/register
   Body: { firstName, lastName, email, password }
   ↓
5. Backend:
   - Checks email not taken
   - Hashes password
   - Creates user
   - Generates token
   ↓
6. Response: { _id, firstName, lastName, email, role, token }
   ↓
7. Frontend:
   - Stores token
   - Updates AuthContext
   - Shows success toast
   - Navigates to dashboard
   ↓
8. User logged in and sees dashboard
```

---

### 23. `frontend/src/pages/Dashboard.js`

**Location**: `/frontend/src/pages/Dashboard.js`

### Purpose
Main dashboard page showing navigation and feature cards.

### Use Cases
- Display user information
- Show available features
- Provide logout functionality
- Navigate to feature modules

### Code Breakdown

#### 1. Component Setup
```javascript
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // ...
```

**Purpose**: Get user data and navigation function

---

#### 2. handleLogout Function
```javascript
const handleLogout = () => {
  logout();           // Clear auth state
  navigate('/login'); // Redirect to login
};
```

**What it does**:
1. Calls `logout()` from AuthContext
   - Removes token from localStorage
   - Removes user from localStorage
   - Clears axios Authorization header
   - Sets user state to null
2. Navigates to login page

---

#### 3. JSX Structure

##### Navbar
```javascript
<nav className="navbar">
  <div className="navbar-content">
    <h2>HRM System</h2>
    
    <div className="navbar-right">
      {/* User Name */}
      <span className="user-name">
        {user?.firstName} {user?.lastName}
      </span>
      
      {/* User Role Badge */}
      <span className="user-role">{user?.role}</span>
      
      {/* Logout Button */}
      <button onClick={handleLogout} className="btn btn-secondary">
        Logout
      </button>
    </div>
  </div>
</nav>
```

**Key Features**:

1. **Optional Chaining**:
   ```javascript
   {user?.firstName}
   ```
   Safely access properties (no error if user is null)

2. **Role Display**:
   ```javascript
   <span className="user-role">{user?.role}</span>
   ```
   Shows: admin, hr_manager, employee, or department_head

---

##### Content Area
```javascript
<div className="dashboard-content">
  <div className="container">
    <h1>Welcome to HRM Dashboard</h1>
    <p className="welcome-text">
      This is the main dashboard. Features will be implemented here.
    </p>
    
    {/* Feature Cards Grid */}
    <div className="dashboard-grid">
      {/* Employee Management Card */}
      <div className="card dashboard-card">
        <h3>Employee Management</h3>
        <p>Manage employee records, profiles, and information</p>
        <span className="coming-soon">Coming Soon</span>
      </div>
      
      {/* Leave Management Card */}
      <div className="card dashboard-card">
        <h3>Leave Management</h3>
        <p>Handle leave requests, approvals, and tracking</p>
        <span className="coming-soon">Coming Soon</span>
      </div>
      
      {/* Attendance Card */}
      <div className="card dashboard-card">
        <h3>Attendance</h3>
        <p>Track employee attendance and working hours</p>
        <span className="coming-soon">Coming Soon</span>
      </div>
      
      {/* Payroll Card */}
      <div className="card dashboard-card">
        <h3>Payroll</h3>
        <p>Manage salary, bonuses, and payroll processing</p>
        <span className="coming-soon">Coming Soon</span>
      </div>
      
      {/* Department Card */}
      <div className="card dashboard-card">
        <h3>Department Management</h3>
        <p>Organize departments and team structures</p>
        <span className="coming-soon">Coming Soon</span>
      </div>
      
      {/* Reports Card */}
      <div className="card dashboard-card">
        <h3>Reports</h3>
        <p>Generate various HR reports and analytics</p>
        <span className="coming-soon">Coming Soon</span>
      </div>
    </div>
  </div>
</div>
```

**Dashboard Grid**:
- Responsive grid layout
- 6 feature cards
- Hover effects
- "Coming Soon" badges

### Future Enhancement

When implementing features, cards will become clickable:

```javascript
<div 
  className="card dashboard-card" 
  onClick={() => navigate('/employees')}
  style={{ cursor: 'pointer' }}
>
  <h3>Employee Management</h3>
  <p>Manage employee records, profiles, and information</p>
</div>
```

---

### 24. `frontend/src/pages/NotFound.js`

**Location**: `/frontend/src/pages/NotFound.js`

### Purpose
404 error page for undefined routes.

### Use Cases
- Show user-friendly 404 page
- Provide link back to dashboard
- Handle invalid URLs

### Code Structure

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      {/* Large 404 */}
      <h1>404</h1>
      
      {/* Error Message */}
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      
      {/* Link to Dashboard */}
      <Link to="/" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
```

**Features**:
- Large 404 number
- Clear error message
- Link to navigate back
- Centered layout

### When It Appears

**Route Configuration**:
```javascript
// In App.js
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
  <Route path="*" element={<NotFound />} />  {/* Catch-all */}
</Routes>
```

**Examples**:
- `/invalid-url` → 404 page
- `/employees/123/edit` → 404 page (not implemented yet)
- `/xyz` → 404 page

---

## Frontend Styling Files

### 25. `frontend/src/pages/Auth.css`

**Location**: `/frontend/src/pages/Auth.css`

### Purpose
Styles for Login and Register pages.

### Styles Breakdown

#### 1. Container
```css
.auth-container {
  min-height: 100vh;              /* Full viewport height */
  display: flex;
  align-items: center;             /* Vertical center */
  justify-content: center;         /* Horizontal center */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
```
**Purpose**: 
- Full-screen gradient background
- Center the card vertically and horizontally
- Purple gradient (professional look)

#### 2. Auth Card
```css
.auth-card {
  background: white;
  border-radius: 16px;            /* Rounded corners */
  padding: 40px;
  width: 100%;
  max-width: 450px;               /* Limit card width */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);  /* Floating effect */
}
```
**Purpose**: White card that "floats" on gradient background

#### 3. Typography
```css
.auth-card h1 {
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 28px;
}

.auth-subtitle {
  color: #64748b;
  margin-bottom: 32px;
  font-size: 16px;
}
```
**Purpose**: Styled headings and subtitle

#### 4. Form Row (Two Columns)
```css
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Two equal columns */
  gap: 16px;                       /* Space between columns */
}
```
**Purpose**: Display First Name and Last Name side-by-side

**Usage**:
```html
<div class="form-row">
  <div class="form-group">First Name</div>
  <div class="form-group">Last Name</div>
</div>
```

**Result**:
```
┌──────────────┬──────────────┐
│ First Name   │  Last Name   │
└──────────────┴──────────────┘
```

#### 5. Responsive Design
```css
@media (max-width: 768px) {
  .auth-card {
    padding: 24px;               /* Less padding on mobile */
  }
  
  .form-row {
    grid-template-columns: 1fr;  /* Stack on mobile */
  }
}
```
**Purpose**: Mobile-friendly layout

**Mobile Result**:
```
┌──────────────┐
│ First Name   │
├──────────────┤
│  Last Name   │
└──────────────┘
```

---

### 26. `frontend/src/pages/Dashboard.css`

**Location**: `/frontend/src/pages/Dashboard.css`

### Purpose
Styles for Dashboard page including navbar and feature cards.

### Styles Breakdown

#### 1. Dashboard Container
```css
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;  /* Light gray background */
}
```

#### 2. Navbar
```css
.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```
**Purpose**: Fixed-width navbar with logo and user info

#### 3. User Info
```css
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
}

.user-role {
  padding: 4px 12px;
  background: #e0e7ff;           /* Light purple */
  color: #4f46e5;                /* Dark purple */
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;    /* employee → Employee */
}
```
**Purpose**: 
- Display user name and role badge
- Role badge has colored background

**Visual**:
```
┌────────────────────────────────────────────┐
│ HRM System    [John Doe] [employee] Logout │
└────────────────────────────────────────────┘
```

#### 4. Dashboard Grid
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
```
**Purpose**: Responsive grid that automatically adjusts columns

**Behavior**:
- Desktop (1200px+): 3 columns
- Tablet (900px): 2 columns
- Mobile (600px): 1 column

#### 5. Dashboard Cards
```css
.dashboard-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);   /* Lift up on hover */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```
**Purpose**: Interactive cards with hover effect

#### 6. Coming Soon Badge
```css
.coming-soon {
  display: inline-block;
  margin-top: 16px;
  padding: 6px 12px;
  background: #fef3c7;            /* Light yellow */
  color: #92400e;                 /* Dark brown */
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
```
**Purpose**: Indicates features not yet implemented

---

### 27. `frontend/src/pages/NotFound.css`

**Location**: `/frontend/src/pages/NotFound.css`

### Purpose
Styles for 404 error page.

### Styles Breakdown

```css
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.not-found h1 {
  font-size: 120px;               /* Large 404 */
  color: #4f46e5;                 /* Purple */
  margin: 0;
  font-weight: bold;
}

.not-found h2 {
  font-size: 32px;
  color: #1e293b;
  margin: 16px 0;
}

.not-found p {
  color: #64748b;
  font-size: 18px;
  margin-bottom: 32px;
}
```

**Visual Structure**:
```
        404
   Page Not Found
The page you are looking for does not exist.
    [Go to Dashboard]
```

---

# Documentation Files

## 28-34. Documentation Files Explained

### 28. `README.md`
**Purpose**: Complete project documentation
**Contents**: Setup, features, API docs, architecture overview
**Audience**: Developers, project managers

### 29. `SETUP_INSTRUCTIONS.md`
**Purpose**: Quick setup guide
**Contents**: Step-by-step installation and configuration
**Audience**: New developers joining project

### 30. `QUICK_START_CHECKLIST.md`
**Purpose**: Interactive setup checklist
**Contents**: Checkbox-style guide for setup
**Audience**: Developers setting up for first time

### 31. `ARCHITECTURE.md`
**Purpose**: System architecture documentation
**Contents**: Design patterns, diagrams, technical details
**Audience**: Technical architects, senior developers

### 32. `FEATURES_ROADMAP.md`
**Purpose**: Feature planning document
**Contents**: All features to implement with priorities
**Audience**: Project managers, developers

### 33. `PROJECT_SUMMARY.md`
**Purpose**: Quick reference guide
**Contents**: Summary of project, commands, structure
**Audience**: All team members

### 34. `PROJECT_FILES_SUMMARY.txt`
**Purpose**: Visual project overview
**Contents**: ASCII art tree structure, statistics
**Audience**: Quick reference for all

---

# Summary of All Files

## Backend Files Summary

| File | Lines | Purpose | Key Functions |
|------|-------|---------|---------------|
| server.js | ~40 | Server entry point | App initialization, middleware setup |
| config/database.js | ~20 | DB connection | connectDB() |
| config/constants.js | ~35 | App constants | Role/status enums |
| models/User.js | ~80 | User schema | matchPassword(), pre-save hook |
| controllers/authController.js | ~90 | Auth logic | register(), login(), getMe() |
| middleware/auth.js | ~50 | Auth middleware | protect(), authorize() |
| middleware/errorHandler.js | ~30 | Error handling | errorHandler() |
| routes/authRoutes.js | ~10 | Route definitions | Register routes |
| utils/generateToken.js | ~10 | Token generation | generateToken() |

**Total Backend Code**: ~365 lines

---

## Frontend Files Summary

| File | Lines | Purpose | Key Functions/Components |
|------|-------|---------|--------------------------|
| index.js | ~15 | React entry point | ReactDOM.render() |
| App.js | ~50 | Root component | Route configuration |
| context/AuthContext.js | ~60 | Auth state management | login(), logout() |
| services/api.js | ~40 | API service | authAPI methods |
| components/PrivateRoute.js | ~20 | Protected routes | Conditional rendering |
| pages/Login.js | ~100 | Login page | handleSubmit(), handleChange() |
| pages/Register.js | ~120 | Register page | Password validation |
| pages/Dashboard.js | ~80 | Dashboard | Feature cards display |
| pages/NotFound.js | ~20 | 404 page | Simple error display |
| App.css | ~100 | Global styles | Reusable classes |
| Auth.css | ~50 | Auth page styles | Card, gradient |
| Dashboard.css | ~100 | Dashboard styles | Navbar, grid |
| NotFound.css | ~30 | 404 styles | Centered layout |

**Total Frontend Code**: ~785 lines

---

## File Relationships Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                 FRONTEND (React)                         │
├─────────────────────────────────────────────────────────┤
│  index.html → index.js → App.js                         │
│                ↓                                         │
│      ┌─────────────────┐                                │
│      │  AuthContext    │ (Global State)                 │
│      └─────────────────┘                                │
│             ↓                                            │
│  ┌──────────────────────────┐                          │
│  │  Pages                   │                          │
│  │  - Login                 │                          │
│  │  - Register              │                          │
│  │  - Dashboard             │                          │
│  │  - NotFound              │                          │
│  └──────────────────────────┘                          │
│             ↓                                            │
│  ┌──────────────────────────┐                          │
│  │  api.js (Services)       │                          │
│  └──────────────────────────┘                          │
└───────────────────┬─────────────────────────────────────┘
                    │ HTTP/JSON
                    │
┌───────────────────▼─────────────────────────────────────┐
│              BACKEND (Express)                           │
├─────────────────────────────────────────────────────────┤
│  server.js (Entry)                                      │
│      ↓                                                   │
│  ┌──────────────────────┐                              │
│  │  Middleware          │                              │
│  │  - express.json()    │                              │
│  │  - cors()            │                              │
│  │  - protect           │                              │
│  │  - errorHandler      │                              │
│  └──────────────────────┘                              │
│      ↓                                                   │
│  ┌──────────────────────┐                              │
│  │  Routes              │                              │
│  │  - authRoutes        │                              │
│  └──────────────────────┘                              │
│      ↓                                                   │
│  ┌──────────────────────┐                              │
│  │  Controllers         │                              │
│  │  - authController    │                              │
│  └──────────────────────┘                              │
│      ↓                                                   │
│  ┌──────────────────────┐                              │
│  │  Models              │                              │
│  │  - User              │                              │
│  └──────────────────────┘                              │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│                 MongoDB Database                         │
│  Collections: users                                      │
└─────────────────────────────────────────────────────────┘
```

---

# Function Reference Quick Guide

## Backend Functions

### Authentication
```javascript
// Register user
register(req, res) → Creates user, returns token

// Login user
login(req, res) → Validates credentials, returns token

// Get current user
getMe(req, res) → Returns authenticated user data
```

### Middleware
```javascript
// Protect routes
protect(req, res, next) → Verifies JWT token

// Role-based access
authorize(...roles)(req, res, next) → Checks user role

// Handle errors
errorHandler(err, req, res, next) → Formats error responses
```

### Utilities
```javascript
// Generate JWT
generateToken(id) → Returns JWT token

// Connect database
connectDB() → Connects to MongoDB
```

### User Model Methods
```javascript
// Compare passwords
user.matchPassword(password) → Returns boolean

// Pre-save hook (automatic)
userSchema.pre('save') → Hashes password before saving
```

---

## Frontend Functions

### AuthContext
```javascript
// Login user
login(userData, token) → Stores auth data, updates state

// Logout user
logout() → Clears auth data, removes token
```

### API Service
```javascript
// Auth APIs
authAPI.login(credentials) → POST /api/auth/login
authAPI.register(userData) → POST /api/auth/register
authAPI.getMe() → GET /api/auth/me
```

### Component Functions
```javascript
// Handle form changes
handleChange(e) → Updates form state

// Handle form submission
handleSubmit(e) → Calls API, handles response

// Handle logout
handleLogout() → Clears auth, redirects
```

---

# Common Patterns

## Authentication Pattern
```javascript
// 1. Login
const response = await authAPI.login(credentials);
const { token, ...userData } = response.data;
login(userData, token);

// 2. Make authenticated request
const response = await api.get('/protected-route');
// Token automatically attached by interceptor

// 3. Logout
logout();
navigate('/login');
```

## Form Handling Pattern
```javascript
// 1. State
const [formData, setFormData] = useState({ field: '' });

// 2. Handle change
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// 3. Handle submit
const handleSubmit = async (e) => {
  e.preventDefault();
  await api.post('/endpoint', formData);
};

// 4. JSX
<input name="field" value={formData.field} onChange={handleChange} />
```

## Protected Route Pattern
```javascript
// 1. Wrap route
<Route path="/" element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />

// 2. PrivateRoute checks auth
return user ? children : <Navigate to="/login" />;
```

---

# This concludes the detailed file guide!

Every file has been explained with:
- Purpose
- Use cases
- Code breakdowns
- Function explanations
- Usage examples
- Visual diagrams

Use this guide as a reference when:
- Understanding the codebase
- Adding new features
- Debugging issues
- Onboarding new developers

For quick start, see: `QUICK_START_CHECKLIST.md`
For architecture, see: `ARCHITECTURE.md`
For features to implement, see: `FEATURES_ROADMAP.md`

