const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  autoFetchCandidates,
  getAutoFetchedCandidates,
  getAllAutoFetchedCandidates,
  sendOutreachEmail,
  deleteJobCandidates
} = require('../controllers/autoFetchController');

// All routes are protected (require authentication)
router.use(protect);

// POST /api/auto-fetch/jobs/:jobId/fetch - Trigger auto-fetch for a specific job
router.post('/jobs/:jobId/fetch', autoFetchCandidates);

// GET /api/auto-fetch/jobs/:jobId/candidates - Get fetched candidates for a specific job
router.get('/jobs/:jobId/candidates', getAutoFetchedCandidates);

// GET /api/auto-fetch/candidates - Get all auto-fetched candidates (across all jobs)
router.get('/candidates', getAllAutoFetchedCandidates);

// POST /api/auto-fetch/candidates/:id/send-outreach - Send outreach email to a candidate
router.post('/candidates/:id/send-outreach', sendOutreachEmail);

// DELETE /api/auto-fetch/jobs/:jobId/candidates - Delete all auto-fetched candidates for a job
router.delete('/jobs/:jobId/candidates', deleteJobCandidates);

module.exports = router;

