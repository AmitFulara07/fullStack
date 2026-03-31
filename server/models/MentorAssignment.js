const mongoose = require('mongoose');
const { Schema } = mongoose;

const MentorAssignmentSchema = new Schema({
  studentId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  projectId:    { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedBy:   { type: Schema.Types.ObjectId, ref: 'User', required: true },   // admin's _id
  assignedAt:   { type: Date, default: Date.now },
  status:       { type: String, enum: ['pending','active','reassigned','inactive','completed'], default: 'active' },
  note:         { type: String },
  reassignedAt: Date,
}, { timestamps: true });

// One active assignment per student per project
MentorAssignmentSchema.index(
  { studentId: 1, projectId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);

module.exports = mongoose.model('MentorAssignment', MentorAssignmentSchema);
