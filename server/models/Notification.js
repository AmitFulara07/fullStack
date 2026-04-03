const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['badge_awarded','feedback_received','log_approved','log_revision','mentor_assigned','deadline_reminder','announcement','at_risk_alert'], required: true },
  title:     { type: String, required: true },
  message:   { type: String, required: true },
  refId:     mongoose.Schema.Types.ObjectId,
  refModel:  String,
  isRead:    { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
