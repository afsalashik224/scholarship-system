const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },
    description: {
      type:     String,
      required: [true, 'Description is required'],
    },
    eligibility: {
      type:     String,
      required: [true, 'Eligibility criteria is required'],
    },
    deadline: {
      type:     Date,
      required: [true, 'Application deadline is required'],
    },
    category: {
      type:    String,
      enum:    ['merit', 'need-based', 'sports', 'research', 'other'],
      default: 'other',
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
    createdBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);
