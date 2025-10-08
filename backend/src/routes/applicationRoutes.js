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
  getJobApplicationStats,
  getResumeUrl
} = require('../controllers/applicationController');
const { parseResumeFile } = require('../controllers/resumeParserController');

// Public routes
router.post('/parse-resume', upload.single('resume'), parseResumeFile);
router.post('/apply/:jobId', upload.single('resume'), submitApplication);

// Protected routes (require authentication)
router.use(protect);

router.get('/', getAllApplications);
router.get('/stats/overview', getApplicationStats);
router.get('/stats/job/:jobId', getJobApplicationStats);
router.get('/job/:jobId', getApplicationsByJob);
router.get('/:id', getApplicationById);
router.get('/:id/resume', getResumeUrl); // Get resume download URL
router.put('/:id/status', updateApplicationStatus);
router.post('/:id/notes', addApplicationNote);
router.put('/:id/rating', rateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
