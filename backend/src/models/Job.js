const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Information
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
    trim: true
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'],
    trim: true
  },
  salaryRange: {
    type: String,
    required: [true, 'Salary range is required'],
    trim: true
  },
  
  // Detailed Information
  jobDescription: {
    type: String,
    required: [true, 'Job description is required']
  },
  responsibilities: {
    type: String,
    required: [true, 'Responsibilities are required']
  },
  requirements: {
    type: String,
    required: [true, 'Requirements are required']
  },
  skills: {
    type: String,
    required: [true, 'Skills are required']
  },
  benefits: {
    type: String,
    default: ''
  },
  
  // Application Information
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'on-hold'],
    default: 'active'
  },
  
  // Metadata
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  
  // AI Generation Flag
  isAIGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ department: 1 });
jobSchema.index({ location: 1 });

// Virtual for formatted deadline
jobSchema.virtual('formattedDeadline').get(function() {
  return this.applicationDeadline.toLocaleDateString();
});

// Method to check if job is expired
jobSchema.methods.isExpired = function() {
  return new Date() > this.applicationDeadline;
};

// Method to increment views
jobSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
