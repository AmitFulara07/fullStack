const { getUserNotifications, markAsRead } = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

exports.getNotifications = asyncHandler(async (req, res) => {
  const result = await getUserNotifications(req.user.id);
  res.status(200).json(result);
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await markAsRead(req.params.id, req.user.id);
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  res.status(200).json(notification);
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.user.id, isRead: false },
    { $set: { isRead: true } }
  );
  res.status(200).json({ message: 'All notifications marked as read' });
});
