const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');

// ── POST /api/applications  (student) ───────────────────
const applyForScholarship = async (req, res) => {
  try {
    const { scholarshipId, statement } = req.body;

    if (!scholarshipId || !statement)
      return res.status(400).json({ message: 'scholarshipId and statement are required' });

    // Check scholarship exists and is active
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship || !scholarship.isActive)
      return res.status(404).json({ message: 'Scholarship not found or no longer active' });

    // Check deadline has not passed
    if (new Date(scholarship.deadline) < new Date())
      return res.status(400).json({ message: 'Application deadline has passed' });

    // Prevent duplicate application
    const existing = await Application.findOne({
      student: req.user._id,
      scholarship: scholarshipId,
    });
    if (existing)
      return res.status(400).json({ message: 'You have already applied for this scholarship' });

    const application = await Application.create({
      student:     req.user._id,
      scholarship: scholarshipId,
      statement,
    });

    await application.populate([
      { path: 'student',     select: 'name email' },
      { path: 'scholarship', select: 'title deadline' },
    ]);

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/applications/mine  (student) ───────────────
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('scholarship', 'title category deadline isActive')
      .sort({ createdAt: -1 });
    res.json({ count: applications.length, applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/applications/:id  (student or admin) ───────
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('student',     'name email studentId course year')
      .populate('scholarship', 'title description eligibility deadline category')
      .populate('reviewedBy',  'name email');

    if (!application)
      return res.status(404).json({ message: 'Application not found' });

    // Students can only see their own application
    if (
      req.user.role === 'student' &&
      application.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/applications  (admin) ──────────────────────
const getAllApplications = async (req, res) => {
  try {
    const { status, scholarshipId } = req.query;
    const filter = {};
    if (status)        filter.status       = status;
    if (scholarshipId) filter.scholarship  = scholarshipId;

    const applications = await Application.find(filter)
      .populate('student',     'name email studentId course')
      .populate('scholarship', 'title category deadline')
      .sort({ createdAt: -1 });

    res.json({ count: applications.length, applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/applications/:id/status  (admin) ───────────
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const VALID = ['pending', 'under_review', 'approved', 'rejected'];

    if (!status || !VALID.includes(status))
      return res.status(400).json({ message: `status must be one of: ${VALID.join(', ')}` });

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminRemarks: adminRemarks || '',
        reviewedBy:   req.user._id,
        reviewedAt:   new Date(),
      },
      { new: true }
    )
      .populate('student',     'name email')
      .populate('scholarship', 'title')
      .populate('reviewedBy',  'name');

    if (!application)
      return res.status(404).json({ message: 'Application not found' });

    res.json({ message: `Application ${status}`, application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  applyForScholarship,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
};
