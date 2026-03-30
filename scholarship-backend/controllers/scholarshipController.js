const Scholarship = require('../models/Scholarship');

// ── GET /api/scholarships ────────────────────────────────
// Public-ish: any logged-in user can list active scholarships
const getAllScholarships = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { isActive: true };
    const scholarships = await Scholarship.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ count: scholarships.length, scholarships });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/scholarships/:id ────────────────────────────
const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id)
      .populate('createdBy', 'name email');
    if (!scholarship)
      return res.status(404).json({ message: 'Scholarship not found' });
    res.json({ scholarship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/scholarships  (admin only) ─────────────────
const createScholarship = async (req, res) => {
  try {
    const { title, description, eligibility, deadline, category } = req.body;

    if (!title || !description || !eligibility || !deadline)
      return res.status(400).json({ message: 'title, description, eligibility and deadline are required' });

    const scholarship = await Scholarship.create({
      title, description, eligibility, deadline, category,
      createdBy: req.user._id,
    });
    res.status(201).json({ scholarship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/scholarships/:id  (admin only) ──────────────
const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!scholarship)
      return res.status(404).json({ message: 'Scholarship not found' });
    res.json({ scholarship });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/scholarships/:id  (admin only) ───────────
const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship)
      return res.status(404).json({ message: 'Scholarship not found' });
    res.json({ message: 'Scholarship deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
};
