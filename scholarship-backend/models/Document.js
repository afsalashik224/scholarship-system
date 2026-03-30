const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    application: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Application',
      required: true,
    },
    uploadedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    label: {
      type:    String,
      enum:    ['id_proof', 'marksheet', 'income_certificate', 'recommendation_letter', 'other'],
      default: 'other',
    },
    filename:     { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype:     { type: String, required: true },
    size:         { type: Number, required: true },   // bytes
    path:         { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
