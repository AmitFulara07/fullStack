const Badge = require('../models/Badge');
const BadgeAward = require('../models/BadgeAward');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.find().sort({ createdAt: -1 });
  res.status(200).json(badges);
});

exports.createBadge = asyncHandler(async (req, res) => {
  const badge = new Badge(req.body);
  await badge.save();
  res.status(201).json(badge);
});

exports.getMyBadges = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  
  // Get all active badges
  const allBadges = await Badge.find({ isActive: true });
  
  // Get student's awards
  const awards = await BadgeAward.find({ studentId })
    .populate('awardedBy', 'name')
    .populate('badgeId');
  
  // Format response
  const result = allBadges.map(badge => {
    const award = awards.find(a => a.badgeId && a.badgeId._id.toString() === badge._id.toString());
    return {
      badge,
      earned: !!award,
      award: award || null
    };
  });
  
  res.status(200).json(result);
});

exports.getBadgeHistory = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const history = await BadgeAward.find({ studentId })
    .populate('badgeId')
    .populate('awardedBy', 'name')
    .sort({ awardedAt: -1 });
    
  res.status(200).json(history);
});
