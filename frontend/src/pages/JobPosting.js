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
  const [editingJobId, setEditingJobId] = useState(null); // Track which job is being edited
  
  // AI Candidate Matching State
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingJobId, setAnalyzingJobId] = useState(null);
  const [bestCandidates, setBestCandidates] = useState(null);
  const [showBestCandidates, setShowBestCandidates] = useState(false);
  
  // Auto-Fetch Candidates State
  const [autoFetching, setAutoFetching] = useState(false);
  const [autoFetchingJobId, setAutoFetchingJobId] = useState(null);
  
  console.log('JobPosting Component State:', { 
    analyzing, 
    analyzingJobId, 
    bestCandidates: !!bestCandidates, 
    showBestCandidates,
    activeTab
  });
  
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
    // Reset modal state on mount to prevent blocking
    setShowBestCandidates(false);
    setBestCandidates(null);
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
      let response;
      
      // Check if we're editing or creating
      if (editingJobId) {
        // Update existing job
        response = await api.put(`/jobs/${editingJobId}`, formData);
        toast.success('✅ Job updated successfully!');
      } else {
        // Create new job
        response = await api.post('/jobs', formData);
        toast.success('✅ Job posted successfully!');
      }
      
      if (response.data.success) {
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

        // Clear editing state
        setEditingJobId(null);

        // Refresh job list
        await fetchJobs();

        // Switch to list tab
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error(error.response?.data?.message || `Failed to ${editingJobId ? 'update' : 'create'} job posting`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (jobId) => {
    // Find the job to edit
    const jobToEdit = jobPostings.find(job => job._id === jobId);
    if (jobToEdit) {
      // Set editing mode
      setEditingJobId(jobId);
      
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
      toast.info('✏️ Edit mode: Update the form and click "Update Job Posting"');
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

  // AI Candidate Matching Handler
  const handleFindBestCandidates = async (job) => {
    setAnalyzing(true);
    setAnalyzingJobId(job._id);
    
    try {
      toast.info(`🤖 Analyzing ${job.applicants} candidates... This may take 1-2 minutes.`);
      
      const response = await api.get(`/matching/find-best/${job._id}?topN=3`);
      
      if (response.data.success) {
        setBestCandidates({
          jobTitle: job.jobTitle,
          candidates: response.data.data
        });
        setShowBestCandidates(true);
        toast.success(`✨ Found top ${response.data.count} candidates!`);
      }
    } catch (error) {
      console.error('Error finding best candidates:', error);
      if (error.response?.status === 404) {
        toast.error(error.response.data.message || 'No applications found for this job');
      } else {
        toast.error('Failed to analyze candidates. Please try again.');
      }
    } finally {
      setAnalyzing(false);
      setAnalyzingJobId(null);
    }
  };

  // Auto-Fetch Candidates from GitHub
  const handleAutoFetchCandidates = async (job) => {
    setAutoFetching(true);
    setAutoFetchingJobId(job._id);
    
    try {
      toast.info(`🔍 Searching GitHub for ${job.jobTitle} candidates... This may take 30-60 seconds.`);
      
      const response = await api.post(`/auto-fetch/jobs/${job._id}/fetch`);
      
      if (response.data.success) {
        const { totalSaved } = response.data;
        toast.success(`🎉 Successfully fetched ${totalSaved} fresh candidates from GitHub!`);
        
        // Navigate to Applicants page with auto-fetched tab
        navigate(`/applicants/job/${job._id}?tab=auto-fetched`);
      }
    } catch (error) {
      console.error('Error auto-fetching candidates:', error);
      if (error.response?.status === 404) {
        toast.error(error.response.data.message || 'No candidates found. Try adjusting job location or skills.');
      } else if (error.response?.status === 401) {
        toast.error('GitHub API authentication failed. Please check configuration.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch candidates. Please try again.');
      }
    } finally {
      setAutoFetching(false);
      setAutoFetchingJobId(null);
    }
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
                      className="action-btn auto-fetch-btn"
                      onClick={() => handleAutoFetchCandidates(job)}
                      disabled={autoFetching && autoFetchingJobId === job._id}
                      title="Auto-fetch candidates from GitHub"
                    >
                      {autoFetching && autoFetchingJobId === job._id ? (
                        <>🔄 Fetching...</>
                      ) : (
                        <>🤖 Auto-Fetch</>
                      )}
                    </button>
                    {console.log('Job applicants:', job.jobTitle, job.applicants)}
                    {job.applicants > 0 && (
                      <button
                        className="action-btn ai-match-btn"
                        onClick={() => handleFindBestCandidates(job)}
                        disabled={analyzing && analyzingJobId === job._id}
                      >
                        {analyzing && analyzingJobId === job._id ? (
                          <>⏳ Analyzing...</>
                        ) : (
                          <>🎯 Find Best 3</>
                        )}
                      </button>
                    )}
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
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setActiveTab('list');
                    setEditingJobId(null); // Clear editing mode
                    setFormData({ // Reset form
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
                  }}
                >
                  {editingJobId ? 'Cancel Edit' : 'Cancel'}
                </button>
                <button type="button" className="btn btn-outline">
                  Save as Draft
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting 
                    ? (editingJobId ? '💾 Updating...' : '📤 Publishing...') 
                    : (editingJobId ? '💾 Update Job Posting' : '📤 Publish Job Posting')
                  }
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

      {/* Best Candidates Modal */}
      {showBestCandidates && bestCandidates && (
        <div className="modal-overlay" onClick={() => setShowBestCandidates(false)}>
          <div className="best-candidates-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏆 Top 3 Best Candidates</h2>
              <p className="modal-subtitle">For: {bestCandidates.jobTitle}</p>
              <button 
                className="modal-close-btn"
                onClick={() => setShowBestCandidates(false)}
              >
                ✕
              </button>
            </div>

            <div className="candidates-list">
              {bestCandidates.candidates.map((item, index) => (
                <div key={item.applicationId} className="candidate-result-card">
                  <div className="candidate-rank">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    <span className="rank-number">#{index + 1}</span>
                  </div>

                  <div className="candidate-info-section">
                    <h3>{item.candidate.name}</h3>
                    <p className="candidate-meta">
                      {item.candidate.company} • {item.candidate.experience} years
                    </p>
                  </div>

                  <div className="match-score-section">
                    <div className="score-circle">
                      <span className="score-number">{item.analysis.matchScore}%</span>
                      <span className="score-label">Match</span>
                    </div>
                    <div className="score-bar-container">
                      <div 
                        className="score-bar-fill" 
                        style={{width: `${item.analysis.matchScore}%`}}
                      />
                    </div>
                  </div>

                  <div className="analysis-details">
                    <div className="detail-section">
                      <h4>✨ Key Strengths</h4>
                      <ul>
                        {item.analysis.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>

                    {item.analysis.skillsMatched.length > 0 && (
                      <div className="detail-section">
                        <h4>🎯 Skills Match</h4>
                        <div className="skills-tags">
                          {item.analysis.skillsMatched.map((skill, i) => (
                            <span key={i} className="skill-tag matched">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.analysis.skillsMissing.length > 0 && (
                      <div className="detail-section">
                        <h4>⚠️ Missing Skills</h4>
                        <div className="skills-tags">
                          {item.analysis.skillsMissing.map((skill, i) => (
                            <span key={i} className="skill-tag missing">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="detail-section">
                      <h4>💡 Recommendation</h4>
                      <p className="recommendation-text">{item.analysis.recommendation}</p>
                      <p className="reasoning-text">{item.analysis.reasoning}</p>
                    </div>
                  </div>

                  <div className="candidate-actions">
                    <button 
                      className="btn-action primary"
                      onClick={() => {
                        setShowBestCandidates(false);
                        navigate(`/applicants`);
                      }}
                    >
                      View Full Profile
                    </button>
                    <button 
                      className="btn-action secondary"
                      onClick={() => {
                        window.location.href = `mailto:${item.candidate.email}`;
                      }}
                    >
                      Contact Candidate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-close-modal"
                onClick={() => setShowBestCandidates(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPosting;
