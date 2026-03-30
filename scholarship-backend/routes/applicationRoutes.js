const express = require('express');
const router  = express.Router();
const {
  applyForScholarship,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, adminOnly, studentOnly } = require('../middleware/authMiddleware');

// All routes require login
router.use(protect);

// POST /api/applications            — student submits application
router.post('/', studentOnly, applyForScholarship);

// GET  /api/applications/mine       — student views their own
router.get('/mine', studentOnly, getMyApplications);

// GET  /api/applications            — admin views all (with optional ?status=&scholarshipId=)
router.get('/', adminOnly, getAllApplications);

// GET  /api/applications/:id        — student (own) or admin
router.get('/:id', getApplicationById);

// PUT  /api/applications/:id/status — admin approves/rejects
router.put('/:id/status', adminOnly, updateApplicationStatus);

module.exports = router;
