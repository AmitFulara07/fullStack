const mongoose = require('mongoose');
const { Schema } = mongoose;

const CodeFingerprintSchema = new Schema({
  studentId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  logId:      { type: Schema.Types.ObjectId, ref: 'ProgressLog', required: true },
  repoUrl:    { type: String, required: true },
  batch:      { type: String },
  files: [{
    path:        { type: String },
    fingerprint: { type: String },
    language:    { type: String },
  }],
  totalFiles:  { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now },
}, { timestamps: true });

CodeFingerprintSchema.index({ studentId: 1, logId: 1 });
CodeFingerprintSchema.index({ batch: 1 });

module.exports = mongoose.model('CodeFingerprint', CodeFingerprintSchema);
