const express = require('express');
const {
  getInterview,
  submitInterview,
  getInterviewStatus
} = require('../controllers/interviewController');

const router = express.Router();

// Public routes (no authentication required)
router.get('/:token', getInterview);
router.post('/:token/submit', submitInterview);
router.get('/:token/status', getInterviewStatus);

module.exports = router;

