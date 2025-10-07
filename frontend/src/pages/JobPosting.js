import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import ShareModal from '../components/ShareModal';
import './JobPosting.css';

const JobPosting = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
  const [generating, setGenerating] = useState(false); // AI generation state
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [submitting, setSubmitting] = useState(false); // Submitting state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [jobToShare, setJobToShare] = useState(null);
  const [jobPostings, setJobPostings] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    location: '',
    employmentType: '',
    experienceLevel: '',
    salaryRange: '',
    jobDescription: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    benefits: '',
    applicationDeadline: '',
  });

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch all jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      if (response.data.success) {
        setJobPostings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job postings');
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // AI Generate Job Description
  const handleGenerateWithAI = async () => {
    // Validate required fields for AI generation
    const requiredFields = {
      jobTitle: 'Job Title',
      department: 'Department',
      location: 'Location',
      employmentType: 'Employment Type',
      experienceLevel: 'Experience Level',
      salaryRange: 'Salary Range',
      applicationDeadline: 'Application Deadline'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setGenerating(true);

    try {
      const response = await api.post('/ai/generate-job-description', {
        jobPosition: formData.jobTitle,
        experience: formData.experienceLevel,
        department: formData.department,
        location: formData.location,
        employmentType: formData.employmentType,
        salaryRange: formData.salaryRange,
        applicationDeadline: formData.applicationDeadline
      });

      if (response.data.success) {
        // Auto-fill form fields with AI-generated content
        setFormData({
          ...formData,
          jobDescription: response.data.data.jobDescription,
          responsibilities: response.data.data.responsibilities,
          requirements: response.data.data.requirements,
          skills: response.data.data.skills,
          benefits: response.data.data.benefits
        });

        toast.success('🤖 Job description generated successfully!');
        
        if (response.data.warning) {
          toast.info(response.data.warning);
        }
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate job description');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields = {
      jobTitle: 'Job Title',
      department: 'Department',
      location: 'Location',
      employmentType: 'Employment Type',
      experienceLevel: 'Experience Level',
      salaryRange: 'Salary Range',
      jobDescription: 'Job Description',
      responsibilities: 'Responsibilities',
      requirements: 'Requirements',
      skills: 'Skills',
      applicationDeadline: 'Application Deadline'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/jobs', formData);
      
      if (response.data.success) {
        toast.success('✅ Job posted successfully!');
        
        // Reset form
        setFormData({
          jobTitle: '',
          department: '',
          location: '',
          employmentType: '',
          experienceLevel: '',
          salaryRange: '',
          jobDescription: '',
          responsibilities: '',
          requirements: '',
          skills: '',
          benefits: '',
          applicationDeadline: '',
        });

        // Refresh job list
        await fetchJobs();

        // Switch to list tab
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error.response?.data?.message || 'Failed to create job posting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (jobId) => {
    // Find the job to edit
    const jobToEdit = jobPostings.find(job => job._id === jobId);
    if (jobToEdit) {
      // Populate form with job data
      setFormData({
        jobTitle: jobToEdit.jobTitle,
        department: jobToEdit.department,
        location: jobToEdit.location,
        employmentType: jobToEdit.employmentType,
        experienceLevel: jobToEdit.experienceLevel,
        salaryRange: jobToEdit.salaryRange,
        jobDescription: jobToEdit.jobDescription,
        responsibilities: jobToEdit.responsibilities,
        requirements: jobToEdit.requirements,
        skills: jobToEdit.skills,
        benefits: jobToEdit.benefits || '',
        applicationDeadline: new Date(jobToEdit.applicationDeadline).toISOString().split('T')[0],
      });
      
      // Switch to create tab (which will act as edit mode)
      setActiveTab('create');
      toast.info('Edit mode: Update the form and click "Publish Job Posting"');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      const response = await api.delete(`/jobs/${jobId}`);
      
      if (response.data.success) {
        toast.success('✅ Job deleted successfully!');
        
        // Refresh job list
        await fetchJobs();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job posting');
    }
  };

  const handleShare = (job) => {
    setJobToShare(job);
    setShareModalOpen(true);
  };

  const handleViewDetails = (jobId) => {
    // Navigate to public job view
    window.open(`/jobs/public/${jobId}`, '_blank');
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/applicants/job/${jobId}`);
  };

  return (
    <div className="job-posting-container">
      {/* Header */}
      <div className="job-posting-header">
        <div className="header-content">
          <button onClick={() => navigate('/')} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Job Postings</h1>
          <p className="subtitle">Manage and create job postings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="job-posting-tabs">
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          All Job Postings
        </button>
        <button
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create New Job
        </button>
      </div>

      {/* Content */}
      <div className="job-posting-content">
        {activeTab === 'list' ? (
          // Job Postings List View
          <div className="jobs-list-section">
            {/* Filters */}
            <div className="filters-section">
              <div className="filter-group">
                <label>Department</label>
                <select>
                  <option value="">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select>
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Employment Type</label>
                <select>
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="filter-group">
                <input
                  type="text"
                  placeholder="Search job title..."
                  className="search-input"
                />
              </div>
            </div>

            {/* Job Cards */}
            <div className="jobs-grid">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading job postings...</p>
                </div>
              ) : jobPostings.length === 0 ? (
                <div className="empty-state">
                  <h3>📭 No Job Postings Yet</h3>
                  <p>Click "Create New Job" to post your first job!</p>
                </div>
              ) : (
                jobPostings.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <h3>{job.jobTitle}</h3>
                      <p className="job-department">{job.department}</p>
                    </div>
                    <span className={`status-badge ${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="job-card-details">
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{job.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{job.employmentType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{job.experienceLevel}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Salary:</span>
                      <span className="detail-value">{job.salaryRange}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Posted:</span>
                      <span className="detail-value">{job.postedDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Applicants:</span>
                      <span className="detail-value applicants-count">{job.applicants}</span>
                    </div>
                  </div>

                  <div className="job-card-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleViewDetails(job._id)}
                    >
                      View Details
                    </button>
                    <button
                      className="action-btn applicants-btn"
                      onClick={() => handleViewApplicants(job._id)}
                    >
                      View Applicants
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(job._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="action-btn share-btn"
                      onClick={() => handleShare(job)}
                    >
                      🚀 Share
                    </button>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        ) : (
          // Create Job Posting Form
          <div className="create-job-section">
            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-section">
                <h2>Basic Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="jobTitle">Job Title *</label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">Department *</label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="location">Location *</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., New York, Remote"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="employmentType">Employment Type *</label>
                    <select
                      id="employmentType"
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="experienceLevel">Experience Level *</label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="Entry-level">Entry-level</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="salaryRange">Salary Range *</label>
                    <input
                      type="text"
                      id="salaryRange"
                      name="salaryRange"
                      value={formData.salaryRange}
                      onChange={handleChange}
                      placeholder="e.g., $60,000 - $90,000"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="applicationDeadline">Application Deadline *</label>
                  <input
                    type="date"
                    id="applicationDeadline"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* AI Generation Section */}
              <div className="ai-generate-section">
                <div className="ai-generate-card">
                  <div className="ai-icon">🤖</div>
                  <div className="ai-content">
                    <h3>Generate Job Description with AI</h3>
                    <p>Save time! Let AI create a professional job description based on all the information you entered above.</p>
                    <button
                      type="button"
                      className="btn btn-ai"
                      onClick={handleGenerateWithAI}
                      disabled={generating}
                    >
                      {generating ? (
                        <>
                          <span className="spinner-small"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          🤖 Generate with AI
                        </>
                      )}
                    </button>
                    <p className="ai-hint">
                      ⚠️ Please fill in all Basic Info fields above before generating
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Job Details {generating && <span className="generating-badge">✨ AI is generating...</span>}</h2>

                <div className="form-group">
                  <label htmlFor="jobDescription">Job Description *</label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Provide a detailed description of the job role..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="responsibilities">Key Responsibilities *</label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    rows="5"
                    placeholder="List the main responsibilities (one per line)..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="requirements">Requirements & Qualifications *</label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows="5"
                    placeholder="List the required qualifications (one per line)..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skills">Required Skills *</label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows="4"
                    placeholder="List required skills (comma-separated)..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="benefits">Benefits & Perks</label>
                  <textarea
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows="4"
                    placeholder="List benefits and perks (one per line)..."
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>
                  Cancel
                </button>
                <button type="button" className="btn btn-outline">
                  Save as Draft
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? '📤 Publishing...' : '📤 Publish Job Posting'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        jobData={jobToShare}
      />
    </div>
  );
};

export default JobPosting;
