const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProgressLogSchema = new Schema({
  studentId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId:     { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  weekNumber:    { type: Number, required: true },
  title:         { type: String, required: true },
  workDone:      { type: String, required: true },       // rich text / markdown
  skillsLearned: [{ type: String }],                     // tags array
  challenges:    { type: String },
  plannedNext:   { type: String },
  evidenceLinks: [{ type: String }],                     // GitHub, deployment URLs
  attachments: [{
    url:         String,
    filename:    String,
    fileType:    String,
    publicId:    String,                                 // Cloudinary public_id for deletion
  }],
  status:        { type: String, enum: ['draft','submitted','reviewed','approved','revision_requested'], default: 'draft' },
  submittedAt:   Date,
  reviewedAt:    Date,
  version:       { type: Number, default: 1 },
  integrityStatus: {
    score: { type: String, enum: ['clean', 'suspicious', 'flagged'], default: 'clean' },
    flags: [{ type: String }],
  },
}, { timestamps: true });

// Unique: one log per student per week per project
ProgressLogSchema.index({ studentId: 1, weekNumber: 1, projectId: 1 }, { unique: true });

module.exports = mongoose.model('ProgressLog', ProgressLogSchema);
