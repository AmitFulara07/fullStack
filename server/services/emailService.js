const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMailWrapper = async (options) => {
  try {
    if (process.env.NODE_ENV !== 'test') { // Skip sending in test mode if necessary
      await transporter.sendMail(options);
    }
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

exports.sendBadgeEmail = async (to, studentName, badgeName, badgeIcon) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Congratulations ${studentName}!</h2>
      <p>You have been awarded a new badge on RBACS.</p>
      <div style="padding: 15px; border: 1px solid #ddd; display: inline-block; border-radius: 8px;">
        <span style="font-size: 24px;">${badgeIcon}</span>
        <strong>${badgeName}</strong>
      </div>
      <p>Keep up the great work!</p>
    </div>
  `;
  await sendMailWrapper({ from: process.env.EMAIL_USER, to, subject: `You earned a new badge: ${badgeName}`, html });
};

exports.sendFeedbackEmail = async (to, studentName, mentorName, weekNumber, status) => {
  const html = `
    <div style="font-family: sans-serif;">
      <h2>Log Reviewed: Week ${weekNumber}</h2>
      <p>Hi ${studentName},</p>
      <p>Your mentor <strong>${mentorName}</strong> has reviewed your progress log.</p>
      <p>Status: <strong>${status}</strong></p>
      <p>Please check your dashboard to see their feedback.</p>
    </div>
  `;
  await sendMailWrapper({ from: process.env.EMAIL_USER, to, subject: `Your progress log was reviewed (Week ${weekNumber})`, html });
};

exports.sendDeadlineReminderEmail = async (to, studentName, projectTitle, deadline) => {
  const html = `
    <div style="font-family: sans-serif;">
      <h2>Action Required: Project "${projectTitle}"</h2>
      <p>Hi ${studentName},</p>
      <p>This is a reminder that you have an upcoming deadline on <strong>${deadline}</strong>.</p>
      <p>Please ensure you submit your progress log on time.</p>
    </div>
  `;
  await sendMailWrapper({ from: process.env.EMAIL_USER, to, subject: `Reminder: Upcoming log deadline for ${projectTitle}`, html });
};
