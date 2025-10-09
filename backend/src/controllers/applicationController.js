const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendApplicationReceivedEmail, sendApplicationStatusEmail } = require('../services/emailService');
const { generateInterviewToken, generateInterviewQuestions } = require('../services/interviewService');

/**
 * @desc    Submit a job application
 * @route   POST /api/applications/apply/:jobId
 * @access  Public
 */
const submitApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      coverLetter,
      linkedinUrl,
      portfolioUrl,
      currentCompany,
      yearsOfExperience,
      expectedSalary,
      noticePeriod,
      source
    } = req.body;

    // Validate job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if application deadline has passed
    if (new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({ job: jobId, email });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position'
      });
    }

    // Validate resume file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    // Upload resume to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      'hrm-resumes'
    );

    // Create application
    const application = await Application.create({
      job: jobId,
      firstName,
      lastName,
      email,
      phone,
      resume: {
        fileName: req.file.originalname,
        fileUrl: uploadResult.secure_url,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      },
      coverLetter,
      linkedinUrl,
      portfolioUrl,
      currentCompany,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
      expectedSalary,
      noticePeriod,
      source: source || 'direct',
      ipAddress: req.ip || req.connection.remoteAddress
    });

    // Update job applicant count
    job.applicants = (job.applicants || 0) + 1;
    await job.save();

    // Generate interview questions (non-blocking)
    console.log('\n🎯 Generating interview questions...');
    generateInterviewQuestions({
      jobTitle: job.jobTitle,
      experienceLevel: job.experienceLevel,
      department: job.department,
      jobDescription: job.jobDescription,
      skills: job.skills
    }).then(async questions => {
      try {
        // Generate unique token
        const interviewToken = generateInterviewToken();
        
        // Calculate deadline (72 hours from now)
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + 72);

        // Update application with interview
        application.interview = {
          token: interviewToken,
          status: 'pending',
          deadline: deadline,
          questions: questions,
          answers: [],
          generatedAt: new Date()
        };

        await application.save();
        
        const interviewLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/interview/${interviewToken}`;
        console.log('✅ Interview generated:', interviewLink);

        // Send confirmation email with interview link
        console.log(`🎯 Triggering confirmation email for: ${firstName} ${lastName} (${email})`);
        sendApplicationReceivedEmail(
          email,
          `${firstName} ${lastName}`,
          job.jobTitle,
          process.env.COMPANY_NAME || 'Our Company',
          interviewLink,
          deadline
        ).then(result => {
          if (result.success) {
            console.log('✅ Confirmation email queued successfully');
          } else {
            console.error('❌ Confirmation email failed:', result.error);
          }
        }).catch(err => console.error('❌ Email sending error:', err));

      } catch (error) {
        console.error('❌ Error saving interview:', error);
      }
    }).catch(err => {
      console.error('❌ Error generating questions:', err);
      // Still send confirmation email without interview link
      console.log(`🎯 Sending fallback confirmation email for: ${firstName} ${lastName} (${email})`);
      sendApplicationReceivedEmail(
        email,
        `${firstName} ${lastName}`,
        job.jobTitle,
        process.env.COMPANY_NAME || 'Our Company'
      ).catch(err2 => console.error('❌ Email sending error:', err2));
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will review your application and get back to you soon.',
      data: {
        applicationId: application._id,
        appliedAt: application.appliedAt
      }
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    
    // Handle duplicate application error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
};

/**
 * @desc    Get all applications for a specific job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Recruiter only)
 */
const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, sortBy = '-appliedAt' } = req.query;

    // Build query
    const query = { job: jobId };
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .sort(sortBy)
      .populate('job', 'jobTitle department');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

/**
 * @desc    Get all applications (for recruiter dashboard)
 * @route   GET /api/applications
 * @access  Private (Recruiter only)
 */
const getAllApplications = async (req, res) => {
  try {
    const { status, jobId, sortBy = '-appliedAt', page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (jobId) query.job = jobId;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('job', 'jobTitle department location employmentType');

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: applications
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

/**
 * @desc    Get single application by ID
 * @route   GET /api/applications/:id
 * @access  Private (Recruiter only)
 */
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'jobTitle department location employmentType salaryRange')
      .populate('notes.addedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (Recruiter only)
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'interview-scheduled', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('job', 'jobTitle');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Send status update email to candidate (non-blocking)
    // Only send email for status changes that matter to candidates
    const emailStatuses = ['reviewing', 'shortlisted', 'interview-scheduled', 'rejected', 'hired'];
    if (emailStatuses.includes(status)) {
      console.log(`\n🎯 Triggering status update email: ${status} for ${application.firstName} ${application.lastName}`);
      sendApplicationStatusEmail(
        application.email,
        `${application.firstName} ${application.lastName}`,
        application.job.jobTitle,
        status,
        process.env.COMPANY_NAME || 'Our Company'
      ).then(result => {
        if (result.success) {
          console.log(`✅ Status update email (${status}) queued successfully`);
        } else {
          console.error(`❌ Status update email (${status}) failed:`, result.error);
        }
      }).catch(err => console.error('❌ Email sending error:', err));
    } else {
      console.log(`ℹ️ No email sent for status: ${status} (not in email trigger list)`);
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
};

/**
 * @desc    Add note to application
 * @route   POST /api/applications/:id/notes
 * @access  Private (Recruiter only)
 */
const addApplicationNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.notes.push({
      content,
      addedBy: req.user._id
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: application
    });

  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
};

/**
 * @desc    Rate application
 * @route   PUT /api/applications/:id/rating
 * @access  Private (Recruiter only)
 */
const rateApplication = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application rated successfully',
      data: application
    });

  } catch (error) {
    console.error('Error rating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate application'
    });
  }
};

/**
 * @desc    Delete application
 * @route   DELETE /api/applications/:id
 * @access  Private (Recruiter only)
 */
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete application'
    });
  }
};

/**
 * @desc    Get application statistics
 * @route   GET /api/applications/stats/overview
 * @access  Private (Recruiter only)
 */
const getApplicationStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    
    const statusCounts = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentApplications = await Application.find()
      .sort('-appliedAt')
      .limit(5)
      .populate('job', 'jobTitle department');

    res.status(200).json({
      success: true,
      data: {
        total: totalApplications,
        byStatus: statusCounts,
        recent: recentApplications
      }
    });

  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application statistics'
    });
  }
};

/**
 * @desc    Get application statistics for a specific job
 * @route   GET /api/applications/stats/job/:jobId
 * @access  Private (Recruiter only)
 */
const getJobApplicationStats = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get total applications for this job
    const totalApplications = await Application.countDocuments({ job: jobId });
    
    // Get status counts for this job
    const statusCounts = await Application.aggregate([
      {
        $match: { job: new mongoose.Types.ObjectId(jobId) }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent applications for this job
    const recentApplications = await Application.find({ job: jobId })
      .sort('-appliedAt')
      .limit(5)
      .populate('job', 'jobTitle department');

    res.status(200).json({
      success: true,
      data: {
        total: totalApplications,
        byStatus: statusCounts,
        recent: recentApplications
      }
    });

  } catch (error) {
    console.error('Error fetching job application stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job application statistics'
    });
  }
};

/**
 * @desc    Get resume download URL for an application
 * @route   GET /api/applications/:id/resume
 * @access  Private (Recruiter only)
 */
const getResumeUrl = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (!application.resume || !application.resume.fileUrl) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for this application'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resumeUrl: application.resume.fileUrl,
        fileName: application.resume.fileName,
        fileType: application.resume.fileType,
        fileSize: application.resume.fileSize
      }
    });

  } catch (error) {
    console.error('Error fetching resume URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume URL'
    });
  }
};

// Proxy resume file for inline viewing
const viewResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application || !application.resume || !application.resume.fileUrl) {
      return res.status(404).send('Resume not found');
    }

    const axios = require('axios');
    
    // Fetch the PDF from Cloudinary
    const response = await axios.get(application.resume.fileUrl, {
      responseType: 'arraybuffer'
    });

    // Set headers for inline viewing instead of download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.send(Buffer.from(response.data));

  } catch (error) {
    console.error('Error proxying resume:', error);
    res.status(500).send('Error loading resume');
  }
};

module.exports = {
  submitApplication,
  getApplicationsByJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  addApplicationNote,
  rateApplication,
  deleteApplication,
  getApplicationStats,
  getJobApplicationStats,
  getResumeUrl,
  viewResume
};
