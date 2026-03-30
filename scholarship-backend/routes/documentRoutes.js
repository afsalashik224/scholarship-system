const express  = require('express');
const router   = express.Router();
const {
  upload,
  uploadDocument,
  getDocumentsByApplication,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// All routes require login
router.use(protect);

// POST /api/documents/upload                  — student uploads file
// Body (form-data): applicationId, label, document (file field)
router.post('/upload', upload.single('document'), uploadDocument);

// GET  /api/documents/:applicationId          — student (own) or admin
router.get('/:applicationId', getDocumentsByApplication);

// DELETE /api/documents/file/:id              — student deletes their own doc
router.delete('/file/:id', deleteDocument);

module.exports = router;
