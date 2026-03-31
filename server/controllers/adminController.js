const MentorAssignment = require('../models/MentorAssignment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const Project = require('../models/Project');

exports.assignMentor = async (req, res) => {
  const { studentId, mentorId, projectId, note } = req.body;

  const assignment = new MentorAssignment({
    studentId,
    mentorId,
    projectId,
    assignedBy: req.user.id,
    note
  });
  await assignment.save();

  // Create Notifications
  await Notification.create([
    { userId: studentId, type: 'mentor_assigned', title: 'Mentor Assigned', message: 'A mentor has been assigned to your project.', refId: assignment._id, refModel: 'MentorAssignment' },
    { userId: mentorId, type: 'mentor_assigned', title: 'New Student Assignment', message: 'You have been assigned to a new student.', refId: assignment._id, refModel: 'MentorAssignment' }
  ]);

  // Create Audit Log
  await AuditLog.create({ actorId: req.user.id, action: 'MENTOR_ASSIGNED', targetId: assignment._id, targetModel: 'MentorAssignment' });

  res.status(201).json(assignment);
};

exports.reassignMentor = async (req, res) => {
  const { newMentorId, reason } = req.body;
  const assignment = await MentorAssignment.findById(req.params.id);
  
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  
  assignment.status = 'reassigned';
  assignment.reassignedAt = new Date();
  await assignment.save();

  const newAssignment = new MentorAssignment({
    studentId: assignment.studentId,
    mentorId: newMentorId,
    projectId: assignment.projectId,
    assignedBy: req.user.id,
    note: reason
  });
  await newAssignment.save();

  await Notification.create({ userId: assignment.studentId, type: 'mentor_assigned', title: 'Mentor Reassigned', message: 'Your mentor assignment has been updated.', refId: newAssignment._id, refModel: 'MentorAssignment' });

  res.json(newAssignment);
};

exports.getAssignableStudents = async (req, res) => {
  const students = await User.aggregate([
    { $match: { role: 'student', isActive: true } },
    {
      $lookup: {
        from: 'mentorassignments',
        let: { stuId: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [ { $eq: ['$studentId', '$$stuId'] }, { $eq: ['$status', 'active'] } ] } } }
        ],
        as: 'activeAssignment'
      }
    },
    {
      $addFields: {
        hasActiveMentor: { $gt: [{ $size: '$activeAssignment' }, 0] },
        currentMentorId: { $arrayElemAt: ['$activeAssignment.mentorId', 0] }
      }
    },
    { $project: { password: 0 } }
  ]);
  
  await User.populate(students, { path: 'currentMentorId', select: 'name email' });
  res.json(students);
};

exports.getAvailableMentors = async (req, res) => {
  const mentors = await User.aggregate([
    { $match: { role: 'mentor', isActive: true } },
    {
      $lookup: {
        from: 'mentorassignments',
        let: { mId: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [ { $eq: ['$mentorId', '$$mId'] }, { $eq: ['$status', 'active'] } ] } } }
        ],
        as: 'activeAssignments'
      }
    },
    {
      $addFields: {
        activeStudentCount: { $size: '$activeAssignments' }
      }
    },
    { $project: { password: 0, activeAssignments: 0 } }
  ]);
  res.json(mentors);
};
