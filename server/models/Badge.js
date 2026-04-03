const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name:         { type: String, required: true, unique: true },
  description:  { type: String, required: true },
  icon:         { type: String, required: true },        // emoji string e.g. '🚀'
  triggerType:  { type: String, enum: ['auto','mentor','admin','faculty'], required: true },
  triggerRule: {
    type:       { type: String },    // 'first_log', 'streak', 'skill_builder', 'mentor_commend', 'milestone_approved', 'final_review'
    threshold:  { type: Number },    // for streak: 4, for skill_builder: 5, for total_logs: 10
  },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
