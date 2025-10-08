const { parseResume } = require('../services/resumeParserService');

/**
 * @desc    Parse resume file and extract information
 * @route   POST /api/applications/parse-resume
 * @access  Public
 */
const parseResumeFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    const file = req.file;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload PDF, DOC, or DOCX file'
      });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB'
      });
    }

    console.log('\n🚀 Resume parsing request received');
    console.log('📄 File:', file.originalname);
    console.log('📊 Size:', (file.size / 1024).toFixed(2), 'KB');

    // Parse the resume
    const result = await parseResume(file);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Resume parsed successfully',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to parse resume',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Resume parsing controller error:', error);
    
    // Send user-friendly error message
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume. Please try again or fill the form manually.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  parseResumeFile
};
