const Badge = require('../models/Badge');

const defaultBadges = [
  { name: 'First Log', icon: '🚀', triggerType: 'auto', triggerRule: { type: 'first_log' }, description: 'Submitted your first progress log' },
  { name: '4-Week Streak', icon: '🔥', triggerType: 'auto', triggerRule: { type: 'streak', threshold: 4 }, description: 'Submitted logs on time for 4 consecutive weeks' },
  { name: '10-Log Streak', icon: '📦', triggerType: 'auto', triggerRule: { type: 'streak', threshold: 10 }, description: 'Submitted 10 logs without missing a week' },
  { name: 'Skill Builder', icon: '💡', triggerType: 'auto', triggerRule: { type: 'skill_builder', threshold: 5 }, description: 'Logged 5 or more distinct skills across your logs' },
  { name: 'Milestone Approved', icon: '✅', triggerType: 'mentor', triggerRule: { type: 'milestone_approved' }, description: 'A project phase milestone was approved by your mentor' },
  { name: 'Mentor Commended', icon: '⭐', triggerType: 'mentor', triggerRule: { type: 'mentor_commend' }, description: 'Your mentor gave your log a special commendation' },
  { name: 'Final Review', icon: '🏆', triggerType: 'admin', triggerRule: { type: 'final_review' }, description: 'Completed the final project review phase' },
];

const seedBadges = async () => {
  try {
    const count = await Badge.countDocuments();
    if (count === 0) {
      await Badge.insertMany(defaultBadges);
      console.log('✅ Default badges seeded');
    } else {
      console.log(`ℹ️ Badges already seeded (${count} found)`);
    }
  } catch (error) {
    console.error('Error seeding badges:', error);
  }
};

module.exports = seedBadges;
