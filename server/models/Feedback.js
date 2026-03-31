const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  logId:       { type: Schema.Types.ObjectId, ref: 'ProgressLog', required: true },
  mentorId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  studentId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment:     { type: String, required: true },
  rating:      { type: Number, min: 1, max: 5 },
  status:      { type: String, enum: ['approved','revision_requested'], required: true },
  commend:     { type: Boolean, default: false },   // triggers Mentor Commend badge
  reviewedAt:  { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
