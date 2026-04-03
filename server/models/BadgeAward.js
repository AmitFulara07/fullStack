const mongoose = require('mongoose');

const BadgeAwardSchema = new mongoose.Schema({
  studentId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
  awardedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },    // null = auto
  refLogId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ProgressLog', default: null },
  note:        String,
  awardedAt:   { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent duplicate awards — each badge earned only once per student
BadgeAwardSchema.index({ studentId: 1, badgeId: 1 }, { unique: true });

module.exports = mongoose.model('BadgeAward', BadgeAwardSchema);
