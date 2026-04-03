const Badge = require('../models/Badge');
const BadgeAward = require('../models/BadgeAward');
const ProgressLog = require('../models/ProgressLog');
const User = require('../models/User');
const { createNotification } = require('./notificationService');
const { sendBadgeEmail } = require('./emailService');

const awardBadge = async (studentId, triggerRuleType, triggerRuleThreshold = null, awardedById = null, refLogId = null) => {
  // Build query
  const query = { 'triggerRule.type': triggerRuleType, isActive: true };
  if (triggerRuleThreshold !== null && triggerRuleThreshold !== undefined) {
    query['triggerRule.threshold'] = triggerRuleThreshold;
  }

  // If we just ask for 'streak' without threshold, we might get any streak badge. So threshold should be used.
  const badge = await Badge.findOne(query);
  if (!badge) return null;

  try {
    const rawResult = await BadgeAward.findOneAndUpdate(
      { studentId, badgeId: badge._id },
      { $setOnInsert: { studentId, badgeId: badge._id, awardedBy: awardedById, refLogId } },
      { upsert: true, new: true, rawResult: true }
    );

    if (rawResult && rawResult.lastErrorObject && rawResult.lastErrorObject.upserted) {
      const award = rawResult.value;
      const student = await User.findById(studentId);

      // Create Notification
      await createNotification({
        userId: studentId,
        type: 'badge_awarded',
        title: `Badge Earned: ${badge.name}`,
        message: `Congratulations! You've earned the ${badge.name} badge.`,
        refId: award._id,
        refModel: 'BadgeAward',
      });

      // Send Email
      if (student && student.email) {
        await sendBadgeEmail(student.email, student.name, badge.name, badge.icon);
      }

      return award;
    }
  } catch (error) {
    // Duplicate errors are fine, meaning already awarded.
    if (error.code !== 11000) {
      console.error('Error awarding badge:', error);
    }
  }

  return null;
};

const checkFirstLog = async (studentId) => {
  const count = await ProgressLog.countDocuments({ studentId, status: { $ne: 'draft' } });
  if (count === 1) {
    await awardBadge(studentId, 'first_log');
  }
};

const checkStreak = async (studentId, threshold) => {
  const logs = await ProgressLog.find({ studentId, status: { $ne: 'draft' } })
    .sort({ weekNumber: -1 })
    .limit(threshold);
  
  if (logs.length === threshold) {
    let isConsecutive = true;
    for (let i = 0; i < logs.length - 1; i++) {
      if (logs[i].weekNumber - logs[i+1].weekNumber !== 1) {
        isConsecutive = false;
        break;
      }
    }
    if (isConsecutive) {
      await awardBadge(studentId, 'streak', threshold);
    }
  }
};

const checkSkillBuilder = async (studentId, threshold) => {
  const logs = await ProgressLog.find({ studentId, status: { $ne: 'draft' } });
  // Aggregate all unique skills
  const skillsSet = new Set();
  logs.forEach(log => {
    if (log.skillsLearned && Array.isArray(log.skillsLearned)) {
      log.skillsLearned.forEach(skill => skillsSet.add(skill.toLowerCase().trim()));
    }
  });

  if (skillsSet.size >= threshold) {
    await awardBadge(studentId, 'skill_builder', threshold);
  }
};

const checkAndAwardAutomatic = async (studentId) => {
  await checkFirstLog(studentId);
  
  // Query DB to see what auto badges exist so we can dynamically check
  const autoBadges = await Badge.find({ triggerType: 'auto', isActive: true });
  
  for (const badge of autoBadges) {
    const { type, threshold } = badge.triggerRule || {};
    if (type === 'streak' && threshold) {
      await checkStreak(studentId, threshold);
    } else if (type === 'skill_builder' && threshold) {
      await checkSkillBuilder(studentId, threshold);
    }
  }
};

module.exports = {
  awardBadge,
  checkAndAwardAutomatic,
  checkFirstLog,
  checkStreak,
  checkSkillBuilder
};
