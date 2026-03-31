const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title:         { type: String, required: true },
  description:   { type: String },
  studentId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  facultyId:     { type: Schema.Types.ObjectId, ref: 'User' },
  batch:         { type: String },
  department:    { type: String },
  currentPhase:  { type: String, enum: ['ideation','design','development','testing','final_review'], default: 'ideation' },
  phases: [{
    name:       String,
    deadline:   Date,
    isComplete: { type: Boolean, default: false }
  }],
  status:        { type: String, enum: ['active','completed','archived'], default: 'active' },
  techStack:     [String],
  repoUrl:       String,
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
