const AutoFetchedCandidate = require('../models/AutoFetchedCandidate');
const Job = require('../models/Job');
const githubService = require('../services/githubCandidateService');

/**
 * Auto-fetch candidates for a job
 * @route POST /api/auto-fetch/jobs/:jobId/fetch
 */
const autoFetchCandidates = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    console.log('🤖 ===== AUTO-FETCH CANDIDATES STARTED =====');
    console.log('📋 Job ID:', jobId);
    console.log('👤 Requested by:', req.user?.email || 'Unknown');

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }

    console.log('✅ Job found:', job.jobTitle);

    // Delete old candidates for this job to get fresh data every time
    const deleteResult = await AutoFetchedCandidate.deleteMany({ job: jobId });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} old candidates for fresh fetch`);

    // Step 1: Search GitHub
    let candidates = [];
    try {
      const githubCandidates = await githubService.searchGitHubCandidates({
        jobTitle: job.jobTitle,
        location: job.location,
        skills: job.skills,
        experienceLevel: job.experienceLevel,
        jobDescription: job.jobDescription
      });
      candidates = [...candidates, ...githubCandidates];
      console.log(`✅ GitHub: Found ${githubCandidates.length} candidates`);
    } catch (error) {
      console.error('❌ GitHub search failed:', error.message);
      // Continue even if GitHub fails
    }

    if (candidates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No candidates found. Try adjusting job location or skills.',
        totalFound: 0
      });
    }

    // Step 2: Score with AI
    let scoredCandidates = [];
    try {
      scoredCandidates = await githubService.scoreCandidatesWithAI(candidates, {
        jobTitle: job.jobTitle,
        location: job.location,
        skills: job.skills,
        experienceLevel: job.experienceLevel,
        jobDescription: job.jobDescription
      });
    } catch (error) {
      console.error('❌ AI scoring failed:', error.message);
      // Use unscored candidates as fallback
      scoredCandidates = candidates.map(c => ({
        ...c,
        aiScore: 50,
        matchAnalysis: 'AI scoring unavailable',
        strengths: [],
        concerns: []
      }));
    }

    // Step 3: Save to database (fresh data - old candidates already deleted)
    const savedCandidates = [];
    let skippedCount = 0;

    for (const candidate of scoredCandidates) {
      try {
        // Create new record (no need to check for duplicates since we deleted old data)
        const newCandidate = new AutoFetchedCandidate({
          ...candidate,
          job: jobId,
          fetchedAt: new Date(),
          lastUpdated: new Date()
        });
        await newCandidate.save();
        savedCandidates.push(newCandidate);
        console.log(`✅ Saved: ${candidate.name} (Score: ${candidate.aiScore})`);

      } catch (error) {
        console.error(`❌ Error saving ${candidate.name}:`, error.message);
        skippedCount++;
      }
    }

    console.log('🎉 ===== AUTO-FETCH COMPLETED =====');
    console.log(`📊 Total candidates found: ${candidates.length}`);
    console.log(`💾 Saved to database: ${savedCandidates.length}`);
    console.log(`⏭️  Skipped (duplicates/errors): ${skippedCount}`);
    console.log('=====================================');

    res.json({
      success: true,
      message: 'Candidates fetched successfully',
      totalFound: candidates.length,
      totalSaved: savedCandidates.length,
      skipped: skippedCount,
      cached: false,
      candidates: savedCandidates.sort((a, b) => b.aiScore - a.aiScore).slice(0, 20) // Return top 20
    });

  } catch (error) {
    console.error('❌ Auto-fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching candidates',
      error: error.message
    });
  }
};

/**
 * Get auto-fetched candidates for a job
 * @route GET /api/auto-fetch/jobs/:jobId/candidates
 */
const getAutoFetchedCandidates = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { limit = 100, minScore = 0 } = req.query;

    console.log('📥 Fetching auto-fetched candidates for job:', jobId);

    const candidates = await AutoFetchedCandidate.find({ 
      job: jobId,
      aiScore: { $gte: parseInt(minScore) }
    })
      .sort({ aiScore: -1 }) // Highest score first
      .limit(parseInt(limit));

    console.log(`✅ Found ${candidates.length} candidates`);

    res.json({
      success: true,
      count: candidates.length,
      candidates
    });

  } catch (error) {
    console.error('❌ Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving candidates',
      error: error.message
    });
  }
};

/**
 * Get all auto-fetched candidates (across all jobs)
 * @route GET /api/auto-fetch/candidates
 */
const getAllAutoFetchedCandidates = async (req, res) => {
  try {
    const { limit = 100, minScore = 0 } = req.query;

    console.log('📥 Fetching all auto-fetched candidates');

    const candidates = await AutoFetchedCandidate.find({ 
      aiScore: { $gte: parseInt(minScore) }
    })
      .populate('job', 'jobTitle location')
      .sort({ fetchedAt: -1, aiScore: -1 }) // Most recent and highest scores first
      .limit(parseInt(limit));

    console.log(`✅ Found ${candidates.length} candidates across all jobs`);

    res.json({
      success: true,
      count: candidates.length,
      candidates
    });

  } catch (error) {
    console.error('❌ Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving candidates',
      error: error.message
    });
  }
};

/**
 * Send outreach email to a candidate
 * @route POST /api/auto-fetch/candidates/:id/send-outreach
 */
const sendOutreachEmail = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { customMessage } = req.body;

    const candidate = await AutoFetchedCandidate.findById(candidateId).populate('job');
    if (!candidate) {
      return res.status(404).json({ 
        success: false,
        message: 'Candidate not found' 
      });
    }

    if (!candidate.email) {
      return res.status(400).json({ 
        success: false,
        message: 'No email available for this candidate' 
      });
    }

    // TODO: Implement email sending when ready
    // For now, just mark as contacted
    candidate.contacted = true;
    candidate.outreachEmailSent = true;
    candidate.outreachEmailSentAt = new Date();
    candidate.status = 'contacted';
    candidate.outreachMessage = customMessage || 'Default outreach message';
    await candidate.save();

    console.log(`✅ Outreach recorded for ${candidate.name}`);

    res.json({
      success: true,
      message: 'Outreach email recorded (email sending not yet implemented)',
      candidate
    });

  } catch (error) {
    console.error('❌ Error sending outreach email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: error.message
    });
  }
};

/**
 * Delete auto-fetched candidates for a job
 * @route DELETE /api/auto-fetch/jobs/:jobId/candidates
 */
const deleteJobCandidates = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const result = await AutoFetchedCandidate.deleteMany({ job: jobId });

    console.log(`✅ Deleted ${result.deletedCount} candidates for job ${jobId}`);

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} candidates`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('❌ Error deleting candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting candidates',
      error: error.message
    });
  }
};

module.exports = {
  autoFetchCandidates,
  getAutoFetchedCandidates,
  getAllAutoFetchedCandidates,
  sendOutreachEmail,
  deleteJobCandidates
};

