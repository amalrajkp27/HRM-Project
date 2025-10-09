import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './Applicants.css';

const Applicants = () => {
  const navigate = useNavigate();
  const { jobId } = useParams(); // Optional: filter by specific job
  const [searchParams] = useSearchParams();
  
  // Tab state - check URL parameter for initial tab
  const initialTab = searchParams.get('tab') || 'applications';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [applications, setApplications] = useState([]);
  const [autoFetchedCandidates, setAutoFetchedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [stats, setStats] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
      fetchStats();
    } else if (activeTab === 'auto-fetched') {
      fetchAutoFetchedCandidates();
    }
  }, [jobId, filterStatus, activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const endpoint = jobId 
        ? `/applications/job/${jobId}${filterStatus ? `?status=${filterStatus}` : ''}`
        : `/applications${filterStatus ? `?status=${filterStatus}` : ''}`;
      
      const response = await api.get(endpoint);
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Use job-specific stats if viewing a specific job, otherwise use overview stats
      const endpoint = jobId 
        ? `/applications/stats/job/${jobId}`
        : '/applications/stats/overview';
      
      const response = await api.get(endpoint);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch auto-fetched candidates
  const fetchAutoFetchedCandidates = async () => {
    setLoading(true);
    try {
      const endpoint = jobId 
        ? `/auto-fetch/jobs/${jobId}/candidates`
        : '/auto-fetch/candidates';
      
      const response = await api.get(endpoint);
      if (response.data.success) {
        setAutoFetchedCandidates(response.data.candidates || []);
      }
    } catch (error) {
      console.error('Error fetching auto-fetched candidates:', error);
      if (error.response?.status !== 404) {
        toast.error('Failed to load auto-fetched candidates');
      }
      setAutoFetchedCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await api.put(`/applications/${applicationId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success('Status updated successfully');
        // Refresh both applications list AND stats counts
        fetchApplications();
        fetchStats();
        if (selectedApplication && selectedApplication._id === applicationId) {
          setSelectedApplication(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleRating = async (applicationId, rating) => {
    try {
      const response = await api.put(`/applications/${applicationId}/rating`, {
        rating
      });

      if (response.data.success) {
        toast.success('Rating updated successfully');
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error('Failed to update rating');
    }
  };

  const handleViewDetails = async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}`);
      if (response.data.success) {
        setSelectedApplication(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error('Failed to load application details');
    }
  };

  const handleViewResume = (applicationId) => {
    // Use our backend proxy endpoint that serves PDF with inline headers
    const proxyUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/applications/${applicationId}/view-resume`;
    setResumeUrl(proxyUrl);
    setShowResumeModal(true);
  };

  const handleCloseResumeModal = () => {
    setShowResumeModal(false);
    setResumeUrl('');
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      reviewing: 'status-reviewing',
      shortlisted: 'status-shortlisted',
      'interview-scheduled': 'status-interview',
      rejected: 'status-rejected',
      hired: 'status-hired'
    };
    return statusClasses[status] || 'status-pending';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      reviewing: 'Reviewing',
      shortlisted: 'Shortlisted',
      'interview-scheduled': 'Interview Scheduled',
      rejected: 'Rejected',
      hired: 'Hired'
    };
    return labels[status] || status;
  };

  return (
    <div className="applicants-container">
      {/* Header */}
      <div className="applicants-header">
        <div className="header-content">
          <button onClick={() => navigate('/job-postings')} className="back-btn">
            ← Back to Jobs
          </button>
          <h1>Applications</h1>
          <p className="subtitle">Manage and review job applications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="applicants-tabs">
        <button
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          📝 Applications ({applications.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'auto-fetched' ? 'active' : ''}`}
          onClick={() => setActiveTab('auto-fetched')}
        >
          🤖 Auto-Fetched ({autoFetchedCandidates.length})
        </button>
      </div>

      {/* Stats Cards - Only show for applications tab AND when there are applications */}
      {activeTab === 'applications' && stats && applications.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>
          {stats.byStatus.map((stat) => (
            <div key={stat._id} className="stat-card">
              <div className="stat-icon">
                {stat._id === 'pending' && '⏳'}
                {stat._id === 'reviewing' && '👀'}
                {stat._id === 'shortlisted' && '⭐'}
                {stat._id === 'interview-scheduled' && '📅'}
                {stat._id === 'rejected' && '❌'}
                {stat._id === 'hired' && '✅'}
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.count}</div>
                <div className="stat-label">{getStatusLabel(stat._id)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'applications' ? (
        <>
          {/* Filters */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Filter by Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview-scheduled">Interview Scheduled</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>
          </div>

          {/* Applications List */}
          <div className="applications-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <h3>📭 No Applications Yet</h3>
            <p>Applications will appear here once candidates start applying.</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application._id} className="application-card">
                <div className="application-card-header">
                  <div className="applicant-info">
                    <div className="applicant-avatar">
                      {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3>{application.firstName} {application.lastName}</h3>
                      <p className="applicant-email">{application.email}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(application.status)}`}>
                    {getStatusLabel(application.status)}
                  </span>
                </div>

                <div className="application-details">
                  <div className="detail-row">
                    <span className="detail-label">Job:</span>
                    <span className="detail-value">{application.job?.jobTitle}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{application.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">
                      {application.yearsOfExperience ? `${application.yearsOfExperience} years` : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Applied:</span>
                    <span className="detail-value">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="rating-section">
                  <span className="rating-label">Rating:</span>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${application.rating >= star ? 'filled' : ''}`}
                        onClick={() => handleRating(application._id, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="application-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewDetails(application._id)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleViewResume(application._id)}
                    title="View Resume"
                  >
                    👁️ View Resume
                  </button>
                  <select
                    className="status-select"
                    value={application.status}
                    onChange={(e) => handleStatusChange(application._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview-scheduled">Interview</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        </>
      ) : (
        /* Auto-Fetched Candidates Tab */
        <div className="auto-fetched-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading candidates...</p>
            </div>
          ) : autoFetchedCandidates.length === 0 ? (
            <div className="empty-state">
              <h3>🤖 No Auto-Fetched Candidates Yet</h3>
              <p>Click "Auto-Fetch" button on a job card to automatically find candidates from GitHub.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/job-postings')}
              >
                Go to Jobs
              </button>
            </div>
          ) : (
            <div className="candidates-grid">
              {autoFetchedCandidates.map((candidate) => (
                <div key={candidate._id} className="candidate-card">
                  <div className="candidate-header">
                    <div className="candidate-info">
                      <div className="candidate-avatar">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <h3>{candidate.name}</h3>
                        <p className="candidate-email">{candidate.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="ai-score-badge">
                      <span className="score">{candidate.aiScore || 0}/100</span>
                      <span className="label">AI Match</span>
                    </div>
                  </div>

                  <div className="candidate-details">
                    <div className="detail-row">
                      <span className="detail-label">Source:</span>
                      <span className="detail-value">{candidate.source}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{candidate.location || 'Not specified'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Company:</span>
                      <span className="detail-value">{candidate.currentCompany || 'Not specified'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Skills:</span>
                      <span className="detail-value skills-list">
                        {candidate.skills && candidate.skills.length > 0 
                          ? candidate.skills.slice(0, 5).join(', ') 
                          : 'Not specified'}
                      </span>
                    </div>
                    {candidate.githubStats && (
                      <div className="detail-row">
                        <span className="detail-label">GitHub:</span>
                        <span className="detail-value">
                          {candidate.githubStats.publicRepos} repos, {candidate.githubStats.followers} followers
                        </span>
                      </div>
                    )}
                  </div>

                  {candidate.matchAnalysis && (
                    <div className="match-analysis">
                      <strong>Match Analysis:</strong>
                      <p>{candidate.matchAnalysis}</p>
                    </div>
                  )}

                  {candidate.strengths && candidate.strengths.length > 0 && (
                    <div className="candidate-strengths">
                      <strong>✅ Strengths:</strong>
                      <ul>
                        {candidate.strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="candidate-actions">
                    {candidate.profileUrl && (
                      <a
                        href={candidate.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        View GitHub Profile
                      </a>
                    )}
                    {candidate.email && !candidate.contacted && (
                      <button
                        className="btn btn-primary btn-sm"
                        title="Send outreach email (coming soon)"
                      >
                        📧 Contact
                      </button>
                    )}
                    {candidate.contacted && (
                      <span className="contacted-badge">✅ Contacted</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button className="close-btn" onClick={() => setSelectedApplication(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>👤 Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Name:</span>
                    <span className="value">
                      {selectedApplication.firstName} {selectedApplication.lastName}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <span className="value">{selectedApplication.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Phone:</span>
                    <span className="value">{selectedApplication.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Applied:</span>
                    <span className="value">
                      {new Date(selectedApplication.appliedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>💼 Professional Information</h3>
                <div className="detail-grid">
                  {selectedApplication.currentCompany && (
                    <div className="detail-item">
                      <span className="label">Current Company:</span>
                      <span className="value">{selectedApplication.currentCompany}</span>
                    </div>
                  )}
                  {selectedApplication.yearsOfExperience && (
                    <div className="detail-item">
                      <span className="label">Experience:</span>
                      <span className="value">{selectedApplication.yearsOfExperience} years</span>
                    </div>
                  )}
                  {selectedApplication.expectedSalary && (
                    <div className="detail-item">
                      <span className="label">Expected Salary:</span>
                      <span className="value">{selectedApplication.expectedSalary}</span>
                    </div>
                  )}
                  {selectedApplication.noticePeriod && (
                    <div className="detail-item">
                      <span className="label">Notice Period:</span>
                      <span className="value">{selectedApplication.noticePeriod}</span>
                    </div>
                  )}
                </div>
              </div>

              {(selectedApplication.linkedinUrl || selectedApplication.portfolioUrl) && (
                <div className="detail-section">
                  <h3>🔗 Links</h3>
                  <div className="detail-grid">
                    {selectedApplication.linkedinUrl && (
                      <div className="detail-item">
                        <span className="label">LinkedIn:</span>
                        <a href={selectedApplication.linkedinUrl} target="_blank" rel="noopener noreferrer" className="link-value">
                          View Profile
                        </a>
                      </div>
                    )}
                    {selectedApplication.portfolioUrl && (
                      <div className="detail-item">
                        <span className="label">Portfolio:</span>
                        <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer" className="link-value">
                          View Portfolio
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedApplication.coverLetter && (
                <div className="detail-section">
                  <h3>✍️ Cover Letter</h3>
                  <p className="cover-letter-text">{selectedApplication.coverLetter}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>📄 Resume</h3>
                <div className="resume-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewResume(selectedApplication._id)}
                  >
                    👁️ View Resume
                  </button>
                  <a
                    href={selectedApplication.resume.fileUrl}
                    download={selectedApplication.resume.fileName}
                    className="btn btn-outline"
                  >
                    📥 Download Resume
                  </a>
                </div>
                <p className="resume-filename">
                  📎 {selectedApplication.resume.fileName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      {showResumeModal && (
        <div className="modal-overlay" onClick={handleCloseResumeModal}>
          <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📄 Resume Viewer</h2>
              <div className="modal-header-actions">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open in New Tab
                </a>
                <button className="close-btn" onClick={handleCloseResumeModal}>
                  ✕
                </button>
              </div>
            </div>
            <div className="resume-viewer">
              <iframe
                src={resumeUrl}
                type="application/pdf"
                className="resume-iframe"
                title="Resume PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
