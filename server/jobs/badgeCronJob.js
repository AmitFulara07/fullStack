const cron = require('node-cron');
const User = require('../models/User');
const ProgressLog = require('../models/ProgressLog');
const Project = require('../models/Project');
const MentorAssignment = require('../models/MentorAssignment');
const { checkAndAwardAutomatic } = require('../services/badgeService');
const { createNotification } = require('../services/notificationService');
const { sendDeadlineReminderEmail } = require('../services/emailService');

const runCronJob = async () => {
  console.log(`[${new Date().toISOString()}] Cron job started: Checking auto badges and at-risk students`);
  try {
    const students = await User.find({ role: 'student', isActive: true });
    
    for (const student of students) {
      // 1. Check auto badges
      await checkAndAwardAutomatic(student._id);
      
      // 2. Check at-risk (no log in last 7 days for active active projects)
      // First, get the student's active project
      const project = await Project.findOne({ studentId: student._id, status: 'active' });
      if (project) {
        // Find their most recent log
        const lastLog = await ProgressLog.findOne({ studentId: student._id, projectId: project._id })
          .sort({ submittedAt: -1, createdAt: -1 });
        
        let shouldAlert = false;
        if (!lastLog) {
          // Check if project was created > 7 days ago
          const projectAgeMs = new Date() - new Date(project.createdAt);
          if (projectAgeMs > 7 * 24 * 60 * 60 * 1000) {
            shouldAlert = true;
          }
        } else {
          const checkDate = lastLog.submittedAt || lastLog.createdAt;
          const daysSinceLog = (new Date() - new Date(checkDate)) / (1000 * 60 * 60 * 24);
          if (daysSinceLog > 7) {
            shouldAlert = true;
          }
        }

        if (shouldAlert) {
          // Create Notification for student
          await createNotification({
            userId: student._id,
            type: 'deadline_reminder',
            title: 'Action Required: Submit Progress Log',
            message: 'You have not submitted a progress log in over 7 days. Please update your progress.',
            refId: project._id,
            refModel: 'Project'
          });
          
          if (student.email) {
             const deadline = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toDateString(); // 48hrs from now
             await sendDeadlineReminderEmail(student.email, student.name, project.title, deadline);
          }

          // Create Notification for mentor
          const assignment = await MentorAssignment.findOne({ studentId: student._id, projectId: project._id, status: 'active' });
          if (assignment) {
            await createNotification({
              userId: assignment.mentorId,
              type: 'at_risk_alert',
              title: `At-Risk Alert: ${student.name}`,
              message: `Student ${student.name} has not submitted a log in over 7 days.`,
              refId: assignment._id,
              refModel: 'MentorAssignment'
            });
          }

          // Create Notification for faculty
          if (project.facultyId) {
             await createNotification({
               userId: project.facultyId,
               type: 'at_risk_alert',
               title: `At-Risk Alert: ${student.name}`,
               message: `Student ${student.name} has not submitted a log in over 7 days.`,
               refId: project._id,
               refModel: 'Project'
             });
          }
        }
      }
    }
    console.log(`[${new Date().toISOString()}] Cron job completed successfully.`);
  } catch (error) {
    console.error('Error running cron job:', error);
  }
};

const initCronJob = () => {
  // Schedule to run at midnight every day
  cron.schedule('0 0 * * *', async () => {
    await runCronJob();
  });
};

module.exports = { initCronJob, runCronJob };
