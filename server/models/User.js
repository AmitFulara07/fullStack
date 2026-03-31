const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6 },
  role:         { type: String, enum: ['admin','faculty','student','mentor'], required: true },
  department:   { type: String },
  batch:        { type: String },           // e.g. "CSE-2024" — for students
  profileImage: { type: String },           // Cloudinary URL
  isActive:     { type: Boolean, default: true },
  bio:          { type: String },           // for mentors: short intro
  organisation: { type: String },           // for alumni mentors
  mentorType:   { type: String, enum: ['senior','alumni','faculty'], default: null },
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
