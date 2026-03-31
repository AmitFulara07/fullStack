const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  actorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action:     { type: String, required: true },
  targetId:   mongoose.Schema.Types.ObjectId,
  targetModel: String,
  metadata:   Object,
  ip:         String,
  timestamp:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
