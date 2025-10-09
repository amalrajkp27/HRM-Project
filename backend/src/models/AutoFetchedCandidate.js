const mongoose = require('mongoose');

const autoFetchedCandidateSchema = new mongoose.Schema({
  // Reference
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  // Source Information
  source: {
    type: String,
    enum: ['github', 'stackoverflow', 'ziprecruiter', 'angellist', 'internal'],
    required: true
  },
  sourceId: {
    type: String, // External ID from source platform
    required: true
  },
  sourceUrl: String, // Link to original profile
  
  // Personal Information
  name: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  location: String,
  
  // Professional Information
  currentCompany: String,
  currentRole: String,
  yearsOfExperience: Number,
  skills: [String],
  bio: String,
  
  // Portfolio/Social
  githubUrl: String,
  linkedinUrl: String,
  portfolioUrl: String,
  stackOverflowUrl: String,
  
  // GitHub-specific (if from GitHub)
  githubStats: {
    publicRepos: Number,
    followers: Number,
    contributions: Number,
    topLanguages: [String]
  },
  
  // Stack Overflow-specific
  stackOverflowStats: {
    reputation: Number,
    badges: Number,
    answers: Number,
    topTags: [String]
  },
  
  // Resume (if available)
  resume: {
    fileUrl: String,
    fileName: String,
    uploadedAt: Date
  },
  
  // AI Analysis
  aiScore: {
    type: Number,
    min: 0,
    max: 100
  },
  matchAnalysis: String, // AI explanation of the match
  strengths: [String], // What makes them a good fit
  concerns: [String], // Potential gaps or issues
  
  // Outreach Tracking
  contacted: {
    type: Boolean,
    default: false
  },
  outreachEmailSent: {
    type: Boolean,
    default: false
  },
  outreachEmailSentAt: Date,
  outreachMessage: String,
  responseReceived: {
    type: Boolean,
    default: false
  },
  responseReceivedAt: Date,
  
  // Status
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'not_interested', 'converted'],
    default: 'new'
  },
  
  // Conversion
  convertedToApplication: {
    type: Boolean,
    default: false
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  
  // Metadata
  fetchedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
autoFetchedCandidateSchema.index({ job: 1, source: 1 });
autoFetchedCandidateSchema.index({ job: 1, aiScore: -1 }); // For sorting by score
autoFetchedCandidateSchema.index({ email: 1 }); // For duplicate detection
autoFetchedCandidateSchema.index({ sourceId: 1, source: 1 }, { unique: true }); // Prevent duplicate fetches

module.exports = mongoose.model('AutoFetchedCandidate', autoFetchedCandidateSchema);

