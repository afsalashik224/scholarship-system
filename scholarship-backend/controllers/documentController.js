const path        = require('path');
const fs          = require('fs');
const multer      = require('multer');
const Document    = require('../models/Document');
const Application = require('../models/Application');

// ── Multer storage config ────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext    = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// ── POST /api/documents/upload  (student) ───────────────
const uploadDocument = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'No file uploaded' });

    const { applicationId, label } = req.body;
    if (!applicationId)
      return res.status(400).json({ message: 'applicationId is required' });

    // Confirm the application belongs to this student
    const application = await Application.findById(applicationId);
    if (!application)
      return res.status(404).json({ message: 'Application not found' });

    if (
      req.user.role === 'student' &&
      application.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied — not your application' });
    }

    const document = await Document.create({
      application:  applicationId,
      uploadedBy:   req.user._id,
      label:        label || 'other',
      filename:     req.file.filename,
      originalName: req.file.originalname,
      mimetype:     req.file.mimetype,
      size:         req.file.size,
      path:         req.file.path,
    });

    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/documents/:applicationId ───────────────────
const getDocumentsByApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application)
      return res.status(404).json({ message: 'Application not found' });

    // Students can only view docs for their own application
    if (
      req.user.role === 'student' &&
      application.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const documents = await Document.find({ application: req.params.applicationId })
      .populate('uploadedBy', 'name role');

    res.json({ count: documents.length, documents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/documents/:id  (student deletes own doc) ─
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: 'Document not found' });

    if (
      req.user.role === 'student' &&
      document.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove file from disk
    if (fs.existsSync(document.path)) fs.unlinkSync(document.path);

    await document.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { upload, uploadDocument, getDocumentsByApplication, deleteDocument };
