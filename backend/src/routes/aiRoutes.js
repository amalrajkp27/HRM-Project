const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const aiService = require('../services/aiService');

// @desc    Generate job description using AI
// @route   POST /api/ai/generate-job-description
// @access  Private
router.post('/generate-job-description', protect, async (req, res) => {
  try {
    const { 
      jobPosition, 
      experience, 
      department, 
      location,
      employmentType,
      salaryRange,
      applicationDeadline
    } = req.body;

    // Validate required fields
    if (!jobPosition || !experience || !department || !location || 
        !employmentType || !salaryRange || !applicationDeadline) {
      return res.status(400).json({ 
        message: 'All fields are required: jobPosition, experience, department, location, employmentType, salaryRange, applicationDeadline' 
      });
    }

    // Validate job position length
    if (jobPosition.length < 2 || jobPosition.length > 100) {
      return res.status(400).json({ 
        message: 'Job position must be between 2 and 100 characters' 
      });
    }

    // Generate job description using AI
    const result = await aiService.generateJobDescription(
      jobPosition,
      experience,
      department,
      location,
      employmentType,
      salaryRange,
      applicationDeadline
    );

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Job description generated successfully',
        data: result.data
      });
    } else {
      // Return fallback data if AI generation failed
      res.status(200).json({
        success: true,
        message: 'Job description generated (fallback mode)',
        data: result.data,
        warning: 'AI service unavailable, using template'
      });
    }

  } catch (error) {
    console.error('Generate Job Description Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate job description',
      error: error.message 
    });
  }
});

module.exports = router;
