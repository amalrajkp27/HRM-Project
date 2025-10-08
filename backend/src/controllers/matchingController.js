const { findBestCandidates } = require('../services/aiMatchingService');

/**
 * @desc    Find best candidates for a job using AI
 * @route   GET /api/matching/find-best/:jobId
 * @access  Private (Recruiter only)
 */
const findBest = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { topN = 3 } = req.query; // Allow customization via query param

    console.log(`\n🎯 Find Best Candidates Request`);
    console.log(`Job ID: ${jobId}`);
    console.log(`Top N: ${topN}`);
    console.log(`Requested by: ${req.user?.email || 'Unknown'}`);

    // Validate topN
    const numCandidates = parseInt(topN);
    if (isNaN(numCandidates) || numCandidates < 1 || numCandidates > 10) {
      return res.status(400).json({
        success: false,
        message: 'topN must be a number between 1 and 10'
      });
    }

    // Find best candidates
    const bestCandidates = await findBestCandidates(jobId, numCandidates);

    res.status(200).json({
      success: true,
      message: `Found top ${bestCandidates.length} candidates`,
      count: bestCandidates.length,
      data: bestCandidates
    });

  } catch (error) {
    console.error('❌ Find Best Candidates Error:', error);
    
    // Send appropriate error response
    if (error.message === 'Job not found') {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (error.message === 'No applications found for this job') {
      return res.status(404).json({
        success: false,
        message: 'No applications found for this job'
      });
    }
    
    if (error.message === 'No candidates could be analyzed successfully') {
      return res.status(500).json({
        success: false,
        message: 'Unable to analyze candidates. Please ensure resumes are properly uploaded.'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to find best candidates',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  findBest
};
