import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ApplicationForm from '../components/ApplicationForm';
import './PublicJobView.css';

const PublicJobView = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch from public API (no auth required)
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/jobs/public/${jobId}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setJob(data.data);
        } else {
          setError(data.message || 'Job not found');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="public-job-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="public-job-container">
        <div className="error-message">
          <h2>❌ Job Not Found</h2>
          <p>The job posting you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Generate structured data for Google for Jobs
  const generateStructuredData = () => {
    // Parse salary range
    const salaryMatch = job.salaryRange.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
    const minSalary = salaryMatch ? parseInt(salaryMatch[1].replace(/,/g, '')) : 0;
    const maxSalary = salaryMatch ? parseInt(salaryMatch[2].replace(/,/g, '')) : 0;

    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.jobTitle,
      "description": `${job.jobDescription}\n\nResponsibilities:\n${job.responsibilities}\n\nRequirements:\n${job.requirements}\n\nSkills: ${job.skills}\n\nBenefits:\n${job.benefits}`,
      "identifier": {
        "@type": "PropertyValue",
        "name": "HRM Job ID",
        "value": job.id
      },
      "datePosted": new Date().toISOString().split('T')[0],
      "validThrough": new Date(job.applicationDeadline).toISOString().split('T')[0],
      "employmentType": job.employmentType.toUpperCase().replace('-', '_'),
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Your Company Name",
        "sameAs": window.location.origin,
        "logo": `${window.location.origin}/logo.png`
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location,
          "addressCountry": "US"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": minSalary,
          "maxValue": maxSalary,
          "unitText": "YEAR"
        }
      },
      "experienceRequirements": {
        "@type": "OccupationalExperienceRequirements",
        "monthsOfExperience": job.experienceLevel === 'Entry-level' ? 0 : 
                              job.experienceLevel === 'Mid-level' ? 36 : 
                              job.experienceLevel === 'Senior' ? 60 : 
                              job.experienceLevel === 'Lead' ? 96 : 120
      },
      "skills": job.skills
    };
  };

  return (
    <>
      {/* Google for Jobs Structured Data */}
      <Helmet>
        <title>{job.jobTitle} - {job.department} | Job Opening</title>
        <meta name="description" content={job.jobDescription.substring(0, 160)} />
        <meta property="og:title" content={`${job.jobTitle} - ${job.department}`} />
        <meta property="og:description" content={job.jobDescription.substring(0, 200)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${job.jobTitle} - ${job.department}`} />
        <meta name="twitter:description" content={job.jobDescription.substring(0, 200)} />
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <div className="public-job-container">
        <div className="public-job-content">
          {/* Header */}
          <div className="job-header">
          <div className="company-logo">
            <div className="logo-placeholder">🏢</div>
          </div>
          <div className="job-title-section">
            <h1>{job.jobTitle}</h1>
            <div className="job-meta-tags">
              <span className="meta-tag">🏢 {job.department}</span>
              <span className="meta-tag">📍 {job.location}</span>
              <span className="meta-tag">💼 {job.employmentType}</span>
              <span className="meta-tag">⏱️ {job.experienceLevel}</span>
            </div>
          </div>
        </div>

        {/* Salary & Deadline */}
        <div className="job-highlights">
          <div className="highlight-card">
            <div className="highlight-icon">💰</div>
            <div className="highlight-content">
              <div className="highlight-label">Salary Range</div>
              <div className="highlight-value">{job.salaryRange}</div>
            </div>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">📅</div>
            <div className="highlight-content">
              <div className="highlight-label">Application Deadline</div>
              <div className="highlight-value">{new Date(job.applicationDeadline).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="apply-section">
          <button 
            className="apply-btn" 
            onClick={() => {
              console.log('Apply button clicked!');
              setShowApplicationForm(true);
            }}
          >
            🚀 Apply for this Position
          </button>
          <p className="apply-hint">Click to submit your application</p>
        </div>

        {/* Job Description */}
        <div className="job-section">
          <h2>📝 Job Description</h2>
          <p className="job-description-text">{job.jobDescription}</p>
        </div>

        {/* Responsibilities */}
        <div className="job-section">
          <h2>🎯 Responsibilities</h2>
          <div className="job-list">
            {job.responsibilities.split('\n').map((item, index) => (
              <div key={index} className="list-item">{item}</div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="job-section">
          <h2>✅ Requirements</h2>
          <div className="job-list">
            {job.requirements.split('\n').map((item, index) => (
              <div key={index} className="list-item">{item}</div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="job-section">
          <h2>🛠️ Required Skills</h2>
          <div className="skills-tags">
            {job.skills.split(',').map((skill, index) => (
              <span key={index} className="skill-tag">{skill.trim()}</span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="job-section">
          <h2>🎁 Benefits & Perks</h2>
          <div className="job-list">
            {job.benefits.split('\n').map((item, index) => (
              <div key={index} className="list-item">{item}</div>
            ))}
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="apply-section footer-apply">
          <button 
            className="apply-btn" 
            onClick={() => {
              console.log('Footer Apply button clicked!');
              setShowApplicationForm(true);
            }}
          >
            🚀 Apply Now
          </button>
          <p className="apply-hint">Don't miss this opportunity!</p>
        </div>

        {/* Footer */}
        <div className="job-footer">
          <p>Posted via HRM Application</p>
          <p className="footer-note">This is a public job posting. Apply through the button above.</p>
        </div>
      </div>
    </div>

    {/* Application Form Modal */}
    {showApplicationForm && (
      <>
        {console.log('Rendering ApplicationForm modal', { jobId, jobTitle: job.jobTitle })}
        <ApplicationForm
          jobId={jobId}
          jobTitle={job.jobTitle}
          onClose={() => {
            console.log('Closing application form');
            setShowApplicationForm(false);
          }}
          onSuccess={() => {
            console.log('Application submitted successfully');
          }}
        />
      </>
    )}
    </>
  );
};

export default PublicJobView;
