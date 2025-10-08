const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { findBest } = require('../controllers/matchingController');

// Protected routes (require authentication)
router.get('/find-best/:jobId', protect, findBest);

module.exports = router;
