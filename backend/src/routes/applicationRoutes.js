const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  submitApplication,
  getApplicationsByJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  addApplicationNote,
  rateApplication,
  deleteApplication,
  getApplicationStats,
  getJobApplicationStats
} = require('../controllers/applicationController');

// Public routes
router.post('/apply/:jobId', upload.single('resume'), submitApplication);

// Protected routes (require authentication)
router.use(protect);

router.get('/', getAllApplications);
router.get('/stats/overview', getApplicationStats);
router.get('/stats/job/:jobId', getJobApplicationStats);
router.get('/job/:jobId', getApplicationsByJob);
router.get('/:id', getApplicationById);
router.put('/:id/status', updateApplicationStatus);
router.post('/:id/notes', addApplicationNote);
router.put('/:id/rating', rateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
