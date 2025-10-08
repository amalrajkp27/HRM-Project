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
import JobPosting from './pages/JobPosting';
import PublicJobView from './pages/PublicJobView';
import Applicants from './pages/Applicants';
import Interview from './pages/Interview';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/job-postings"
              element={
                <PrivateRoute>
                  <JobPosting />
                </PrivateRoute>
              }
            />
            <Route
              path="/applicants"
              element={
                <PrivateRoute>
                  <Applicants />
                </PrivateRoute>
              }
            />
            <Route
              path="/applicants/job/:jobId"
              element={
                <PrivateRoute>
                  <Applicants />
                </PrivateRoute>
              }
            />
            {/* Public routes - no authentication required */}
            <Route path="/jobs/public/:jobId" element={<PublicJobView />} />
            <Route path="/interview/:token" element={<Interview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

