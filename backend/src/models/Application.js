const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Job Reference
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  // Applicant Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Resume Information
  resume: {
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Additional Information
  coverLetter: {
    type: String,
    maxlength: 2000
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  portfolioUrl: {
    type: String,
    trim: true
  },
  currentCompany: {
    type: String,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  expectedSalary: {
    type: String,
    trim: true
  },
  noticePeriod: {
    type: String,
    trim: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interview-scheduled', 'rejected', 'hired'],
    default: 'pending'
  },
  
  // Recruiter Notes (Internal)
  notes: [{
    content: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Source tracking
  source: {
    type: String,
    enum: ['direct', 'linkedin', 'indeed', 'referral', 'other'],
    default: 'direct'
  },
  
  // IP Address for security
  ipAddress: {
    type: String
  },
  
  // Pre-Screening Interview
  interview: {
    // Interview link and status
    token: {
      type: String,
      unique: true,
      sparse: true // Allows null values to not be unique
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'expired', 'rejected'],
      default: 'pending'
    },
    deadline: Date, // 72 hours from application
    
    // Questions
    questions: [{
      questionNumber: Number,
      questionType: {
        type: String,
        enum: ['multiple-choice', 'short-answer', 'scenario', 'technical', 'behavioral']
      },
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard']
      },
      questionText: String, // Max 50 words
      options: [String], // For multiple choice
      correctAnswer: String, // For multiple choice (stored for reference)
      maxScore: {
        type: Number,
        default: 10
      }
    }],
    
    // Answers
    answers: [{
      questionNumber: Number,
      answer: String, // Max 200 words for short answer
      submittedAt: Date,
      aiScore: Number, // Individual score (0-10)
      aiFeedback: String, // AI's evaluation
      strengths: [String],
      weaknesses: [String]
    }],
    
    // Overall Results
    overallScore: Number, // 0-100%
    totalAnswered: Number,
    passed: Boolean,
    aiSummary: String, // Overall AI evaluation
    
    // Timestamps
    generatedAt: Date,
    startedAt: Date,
    completedAt: Date,
    expiredAt: Date,
    reminderSent: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
applicationSchema.index({ job: 1, email: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });

// Prevent duplicate applications for same job
applicationSchema.index({ job: 1, email: 1 }, { unique: true });

// Virtual for full name
applicationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Update lastUpdated on save
applicationSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
