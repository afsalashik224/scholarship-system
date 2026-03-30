const express = require('express');
const router  = express.Router();
const {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
} = require('../controllers/scholarshipController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes require login
router.use(protect);

// GET  /api/scholarships      — student + admin
router.get('/', getAllScholarships);

// GET  /api/scholarships/:id  — student + admin
router.get('/:id', getScholarshipById);

// POST /api/scholarships      — admin only
router.post('/', adminOnly, createScholarship);

// PUT  /api/scholarships/:id  — admin only
router.put('/:id', adminOnly, updateScholarship);

// DEL  /api/scholarships/:id  — admin only
router.delete('/:id', adminOnly, deleteScholarship);

module.exports = router;
