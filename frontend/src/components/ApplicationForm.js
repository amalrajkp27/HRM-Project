import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './ApplicationForm.css';

const ApplicationForm = ({ jobId, jobTitle, onClose, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coverLetter: '',
    linkedinUrl: '',
    portfolioUrl: '',
    currentCompany: '',
    yearsOfExperience: '',
    expectedSalary: '',
    noticePeriod: '',
    source: 'direct'
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, or DOCX file');
      e.target.value = '';
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      e.target.value = '';
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append resume file
      submitData.append('resume', resumeFile);

      // Get API URL
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      // Submit application
      const response = await fetch(`${API_URL}/applications/apply/${jobId}`, {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('🎉 ' + data.message);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          coverLetter: '',
          linkedinUrl: '',
          portfolioUrl: '',
          currentCompany: '',
          yearsOfExperience: '',
          expectedSalary: '',
          noticePeriod: '',
          source: 'direct'
        });
        setResumeFile(null);
        setResumeFileName('');

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }

        // Close form after 2 seconds
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 2000);

      } else {
        toast.error(data.message || 'Failed to submit application');
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="application-form-overlay">
      <div className="application-form-container">
        <div className="application-form-header">
          <h2>Apply for {jobTitle}</h2>
          <button className="close-btn" onClick={onClose} disabled={submitting}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3>📋 Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="form-section">
            <h3>📄 Resume/CV *</h3>
            <div className="form-group">
              <label htmlFor="resume" className="file-upload-label">
                <div className="file-upload-box">
                  {resumeFileName ? (
                    <>
                      <span className="file-icon">📎</span>
                      <span className="file-name">{resumeFileName}</span>
                      <span className="file-change">Click to change</span>
                    </>
                  ) : (
                    <>
                      <span className="upload-icon">☁️</span>
                      <span className="upload-text">Click to upload or drag and drop</span>
                      <span className="upload-hint">PDF, DOC, or DOCX (Max 5MB)</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Professional Information */}
          <div className="form-section">
            <h3>💼 Professional Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="currentCompany">Current Company</label>
                <input
                  type="text"
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                />
              </div>

              <div className="form-group">
                <label htmlFor="yearsOfExperience">Years of Experience</label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="5"
                  min="0"
                  max="50"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expectedSalary">Expected Salary</label>
                <input
                  type="text"
                  id="expectedSalary"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="$80,000 - $100,000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="noticePeriod">Notice Period</label>
                <select
                  id="noticePeriod"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                >
                  <option value="">Select notice period</option>
                  <option value="Immediate">Immediate</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="3 months">3 months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="form-section">
            <h3>🔗 Professional Links</h3>
            
            <div className="form-group">
              <label htmlFor="linkedinUrl">LinkedIn Profile</label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolioUrl">Portfolio/Website</label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="https://johndoe.com"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="form-section">
            <h3>✍️ Cover Letter (Optional)</h3>
            <div className="form-group">
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us why you're a great fit for this position..."
                maxLength="2000"
              />
              <span className="char-count">
                {formData.coverLetter.length}/2000 characters
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-small"></span>
                  Submitting...
                </>
              ) : (
                <>
                  🚀 Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
