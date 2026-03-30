const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    scholarship: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Scholarship',
      required: true,
    },
    statement: {
      type:     String,
      required: [true, 'Personal statement is required'],
      minlength:[20, 'Statement must be at least 20 characters'],
    },
    status: {
      type:    String,
      enum:    ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
    },
    adminRemarks: {
      type:    String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      default: null,
    },
    reviewedAt: {
      type:    Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent a student from applying to the same scholarship twice
applicationSchema.index({ student: 1, scholarship: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
