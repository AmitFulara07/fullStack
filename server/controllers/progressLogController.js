const ProgressLog = require('../models/ProgressLog');
const { cloudinary } = require('../config/cloudinary');
const Project = require('../models/Project');

exports.createLog = async (req, res) => {
  const { projectId, weekNumber, title, workDone, skillsLearned, challenges, plannedNext, evidenceLinks, status } = req.body;

  const attachments = req.files ? req.files.map(file => ({
    url: file.path,
    filename: file.originalname,
    fileType: file.mimetype,
    publicId: file.filename // multer-storage-cloudinary stores public_id in filename
  })) : [];

  const logData = {
    studentId: req.user.id,
    projectId,
    weekNumber,
    title,
    workDone,
    skillsLearned: skillsLearned ? (Array.isArray(skillsLearned) ? skillsLearned : JSON.parse(skillsLearned)) : [],
    challenges,
    plannedNext,
    evidenceLinks: evidenceLinks ? (Array.isArray(evidenceLinks) ? evidenceLinks : JSON.parse(evidenceLinks)) : [],
    attachments,
    status: status || 'draft'
  };

  if (logData.status === 'submitted') {
    logData.submittedAt = new Date();
  }

  const log = new ProgressLog(logData);
  await log.save();

  res.status(201).json(log);
};

exports.updateLog = async (req, res) => {
  const log = await ProgressLog.findById(req.params.id);

  if (!log) return res.status(404).json({ message: 'Log not found' });
  if (log.studentId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  if (!['draft', 'revision_requested'].includes(log.status)) {
    return res.status(400).json({ message: 'Cannot edit a log in this status' });
  }

  const { title, workDone, skillsLearned, challenges, plannedNext, evidenceLinks, status } = req.body;

  log.title = title || log.title;
  log.workDone = workDone || log.workDone;
  log.challenges = challenges !== undefined ? challenges : log.challenges;
  log.plannedNext = plannedNext !== undefined ? plannedNext : log.plannedNext;
  
  if (skillsLearned) {
    log.skillsLearned = Array.isArray(skillsLearned) ? skillsLearned : JSON.parse(skillsLearned);
  }
  if (evidenceLinks) {
    log.evidenceLinks = Array.isArray(evidenceLinks) ? evidenceLinks : JSON.parse(evidenceLinks);
  }

  if (req.files && req.files.length > 0) {
    const newAttachments = req.files.map(file => ({
      url: file.path,
      filename: file.originalname,
      fileType: file.mimetype,
      publicId: file.filename
    }));
    log.attachments = [...log.attachments, ...newAttachments];
  }

  if (status) {
    log.status = status;
    if (status === 'submitted') {
      log.submittedAt = new Date();
      if (log.status === 'revision_requested') {
        log.version += 1;
      }
    }
  }

  await log.save();
  res.json(log);
};

exports.getMyLogs = async (req, res) => {
  const { status, projectId } = req.query;
  const query = { studentId: req.user.id };
  
  if (status) query.status = status;
  if (projectId) query.projectId = projectId;

  const logs = await ProgressLog.find(query)
    .sort({ weekNumber: -1 })
    .populate('projectId', 'title currentPhase');
    
  res.json(logs);
};

exports.getLogById = async (req, res) => {
  const log = await ProgressLog.findById(req.params.id)
    .populate('studentId', 'name email batch')
    .populate('projectId', 'title currentPhase');

  if (!log) return res.status(404).json({ message: 'Log not found' });
  
  // Basic access control: 
  if (req.user.role === 'student' && log.studentId._id.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  res.json(log);
};

exports.deleteLog = async (req, res) => {
  const log = await ProgressLog.findById(req.params.id);

  if (!log) return res.status(404).json({ message: 'Log not found' });
  if (log.studentId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  if (log.status !== 'draft') {
    return res.status(400).json({ message: 'Only draft logs can be deleted' });
  }

  // Delete files from Cloudinary
  if (log.attachments && log.attachments.length > 0) {
    for (const file of log.attachments) {
      if (file.publicId) {
        await cloudinary.uploader.destroy(file.publicId);
      }
    }
  }

  await log.deleteOne();
  res.json({ message: 'Log removed' });
};
