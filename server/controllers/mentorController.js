const MentorAssignment = require('../models/MentorAssignment');
const ProgressLog = require('../models/ProgressLog');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const Project = require('../models/Project');

exports.getAssignedStudents = async (req, res) => {
  const assignments = await MentorAssignment.find({ mentorId: req.user.id, status: 'active' })
    .populate('studentId', 'name email batch department')
    .populate('projectId', 'title currentPhase status');

  res.json(assignments);
};

exports.getStudentLogs = async (req, res) => {
  const { studentId } = req.params;
  
  // Verify assignment
  const assignment = await MentorAssignment.findOne({ mentorId: req.user.id, studentId, status: 'active' });
  if (!assignment) return res.status(403).json({ message: 'Not assigned to this student' });

  const logs = await ProgressLog.find({ studentId, status: { $ne: 'draft' } })
    .sort({ weekNumber: -1 })
    .populate('projectId', 'title');
    
  res.json(logs);
};

exports.reviewLog = async (req, res) => {
  const { logId } = req.params;
  const { comment, rating, status, commend } = req.body;

  const log = await ProgressLog.findById(logId);
  if (!log) return res.status(404).json({ message: 'Log not found' });

  const assignment = await MentorAssignment.findOne({ mentorId: req.user.id, studentId: log.studentId, status: 'active' });
  if (!assignment) return res.status(403).json({ message: 'Not authorized to review this log' });

  const feedback = new Feedback({
    logId,
    mentorId: req.user.id,
    studentId: log.studentId,
    comment,
    rating,
    status,
    commend
  });
  await feedback.save();

  log.status = status;
  log.reviewedAt = new Date();
  await log.save();

  // Create notifications
  await Notification.create({
    userId: log.studentId,
    type: 'feedback_received',
    title: `Log ${status === 'approved' ? 'Approved' : 'Reviewed'}`,
    message: `Your progress log for week ${log.weekNumber} has been reviewed.`,
    refId: log._id,
    refModel: 'ProgressLog'
  });

  // (Optional) Call badge service if commend === true here during Phase 5
  res.status(201).json(feedback);
};

exports.getFeedbackByLog = async (req, res) => {
  const { logId } = req.params;
  const feedbackList = await Feedback.find({ logId }).populate('mentorId', 'name profileImage bio');
  res.json(feedbackList);
};
