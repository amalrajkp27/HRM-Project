import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, jobData }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [shareUrl, setShareUrl] = useState('');

  // Generate share URL (will be replaced with actual public URL)
  React.useEffect(() => {
    if (jobData) {
      // For now, using localhost. In production, use your domain
      const url = `${window.location.origin}/jobs/public/${jobData.id || 'preview'}`;
      setShareUrl(url);
    }
  }, [jobData]);

  // Available platforms with their share URLs
  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      color: '#0077B5',
      getUrl: (url, job) => {
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      }
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: '🐦',
      color: '#1DA1F2',
      getUrl: (url, job) => {
        const text = `🚀 We're Hiring: ${job.jobTitle}\n📍 ${job.location} | 💼 ${job.employmentType}\n⏱️ ${job.experienceLevel} | 💰 ${job.salaryRange}\n\nApply now:`;
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      color: '#1877F2',
      getUrl: (url, job) => {
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      getUrl: (url, job) => {
        const text = `🚀 *We're Hiring: ${job.jobTitle}*\n\n📍 Location: ${job.location}\n💼 Type: ${job.employmentType}\n⏱️ Experience: ${job.experienceLevel}\n💰 Salary: ${job.salaryRange}\n\nApply now: ${url}`;
        return `https://wa.me/?text=${encodeURIComponent(text)}`;
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      color: '#EA4335',
      getUrl: (url, job) => {
        const subject = `Job Opening: ${job.jobTitle} - ${job.department}`;
        const body = `Hi,\n\nWe have an exciting job opportunity:\n\n🚀 Position: ${job.jobTitle}\n🏢 Department: ${job.department}\n📍 Location: ${job.location}\n💼 Type: ${job.employmentType}\n⏱️ Experience: ${job.experienceLevel}\n💰 Salary: ${job.salaryRange}\n📅 Deadline: ${job.applicationDeadline}\n\nView full details and apply: ${url}\n\nBest regards`;
        return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      color: '#0088CC',
      getUrl: (url, job) => {
        const text = `🚀 We're Hiring: ${job.jobTitle}\n📍 ${job.location} | 💼 ${job.employmentType}\n⏱️ ${job.experienceLevel} | 💰 ${job.salaryRange}\n\nApply: ${url}`;
        return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      }
    }
  ];

  // Toggle platform selection
  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  // Select all platforms
  const selectAll = () => {
    setSelectedPlatforms(platforms.map(p => p.id));
  };

  // Deselect all platforms
  const deselectAll = () => {
    setSelectedPlatforms([]);
  };

  // Share to selected platforms
  const handleShare = () => {
    if (selectedPlatforms.length === 0) {
      toast.warning('Please select at least one platform to share');
      return;
    }

    // Open each selected platform in a new tab
    selectedPlatforms.forEach((platformId, index) => {
      const platform = platforms.find(p => p.id === platformId);
      if (platform) {
        const url = platform.getUrl(shareUrl, jobData);
        
        // Small delay between opening tabs to avoid popup blockers
        setTimeout(() => {
          window.open(url, '_blank', 'noopener,noreferrer');
        }, index * 100);
      }
    });

    toast.success(`🎉 Opening ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}!`);
    
    // Track analytics (will be implemented later)
    // trackShare(jobData.id, selectedPlatforms);
  };

  // Copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('✅ Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h2>Share Job Posting</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="share-modal-body">
          {/* Job Info */}
          <div className="job-info-preview">
            <h3>{jobData?.jobTitle || 'Job Title'}</h3>
            <div className="job-meta">
              <span>🏢 {jobData?.department || 'Department'}</span>
              <span>📍 {jobData?.location || 'Location'}</span>
              <span>💰 {jobData?.salaryRange || 'Salary'}</span>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="platform-selection">
            <div className="selection-header">
              <h4>Select Platforms to Share</h4>
              <div className="selection-actions">
                <button className="text-btn" onClick={selectAll}>Select All</button>
                <span>|</span>
                <button className="text-btn" onClick={deselectAll}>Deselect All</button>
              </div>
            </div>

            <div className="platforms-grid">
              {platforms.map(platform => (
                <div
                  key={platform.id}
                  className={`platform-card ${selectedPlatforms.includes(platform.id) ? 'selected' : ''}`}
                  onClick={() => togglePlatform(platform.id)}
                  style={{ '--platform-color': platform.color }}
                >
                  <div className="platform-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => {}}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="platform-icon">{platform.icon}</div>
                  <div className="platform-name">{platform.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Share URL */}
          <div className="share-url-section">
            <label>Share Link</label>
            <div className="url-input-group">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="url-input"
              />
              <button className="copy-btn" onClick={copyLink}>
                📋 Copy
              </button>
            </div>
          </div>

          {/* Selected Count */}
          {selectedPlatforms.length > 0 && (
            <div className="selected-count">
              ✓ {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        <div className="share-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleShare}
            disabled={selectedPlatforms.length === 0}
          >
            🚀 Share to Selected ({selectedPlatforms.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
