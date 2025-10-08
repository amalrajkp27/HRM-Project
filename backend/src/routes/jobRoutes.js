const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); 
const {
  
  createJob,
  getAllJobs,
  getJobById,
  getPublicJobById,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');

// Public routes (no auth required)
router.get('/public/:id', getPublicJobById);

// Protected routes (auth required)
router.use(protect); // All routes below require authentication

router.route('/')
  .post(createJob)
  .get(getAllJobs);

router.get('/stats', getJobStats);

router.route('/:id')
  .get(getJobById)
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;
