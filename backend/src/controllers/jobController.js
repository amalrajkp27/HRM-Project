const Job = require('../models/Job');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      department,
      location,
      employmentType,
      experienceLevel,
      salaryRange,
      jobDescription,
      responsibilities,
      requirements,
      skills,
      benefits,
      applicationDeadline,
      isAIGenerated
    } = req.body;

    // Validate required fields
    if (!jobTitle || !department || !location || !employmentType || 
        !experienceLevel || !salaryRange || !jobDescription || 
        !responsibilities || !requirements || !skills || !applicationDeadline) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Create job
    const job = await Job.create({
      jobTitle,
      department,
      location,
      employmentType,
      experienceLevel,
      salaryRange,
      jobDescription,
      responsibilities,
      requirements,
      skills,
      benefits: benefits || '',
      applicationDeadline,
      isAIGenerated: isAIGenerated || false,
      postedBy: req.user._id,
      status: 'active'
    });

    console.log('✅ Job created successfully:', job._id);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      data: job
    });

  } catch (error) {
    console.error('❌ Error creating job:', error);
    res.status(500).json({ 
      message: 'Error creating job posting',
      error: error.message 
    });
  }
};

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs
// @access  Private
const getAllJobs = async (req, res) => {
  try {
    const { status, department, location, search } = req.query;

    // Build query
    let query = { postedBy: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    if (location && location !== 'all') {
      query.location = location;
    }

    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { jobDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch jobs
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email');

    // Add applicant count to each job
    const Application = require('../models/Application');
    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicants: applicantCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithApplicants.length,
      data: jobsWithApplicants
    });

  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ 
      message: 'Error fetching jobs',
      error: error.message 
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      });
    }

    // Check if user owns this job
    if (job.postedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to access this job' 
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('❌ Error fetching job:', error);
    res.status(500).json({ 
      message: 'Error fetching job',
      error: error.message 
    });
  }
};

// @desc    Get public job by ID (no auth required)
// @route   GET /api/jobs/public/:id
// @access  Public
const getPublicJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name');

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      });
    }

    // Only show active jobs publicly
    if (job.status !== 'active') {
      return res.status(404).json({ 
        message: 'Job is no longer available' 
      });
    }

    // Increment views
    await job.incrementViews();

    res.status(200).json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('❌ Error fetching public job:', error);
    res.status(500).json({ 
      message: 'Error fetching job',
      error: error.message 
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      });
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to update this job' 
      });
    }

    // Update job
    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('✅ Job updated successfully:', job._id);

    res.status(200).json({
      success: true,
      message: 'Job updated successfully!',
      data: job
    });

  } catch (error) {
    console.error('❌ Error updating job:', error);
    res.status(500).json({ 
      message: 'Error updating job',
      error: error.message 
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        message: 'Job not found' 
      });
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this job' 
      });
    }

    await job.deleteOne();

    console.log('✅ Job deleted successfully:', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully!'
    });

  } catch (error) {
    console.error('❌ Error deleting job:', error);
    res.status(500).json({ 
      message: 'Error deleting job',
      error: error.message 
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Private
const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { postedBy: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalApplications: { $sum: '$applications' }
        }
      }
    ]);

    const totalJobs = await Job.countDocuments({ postedBy: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        stats
      }
    });

  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics',
      error: error.message 
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getPublicJobById,
  updateJob,
  deleteJob,
  getJobStats
};
