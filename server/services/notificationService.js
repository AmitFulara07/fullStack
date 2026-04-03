const Notification = require('../models/Notification');

exports.createNotification = async ({ userId, type, title, message, refId, refModel }) => {
  const notification = new Notification({
    userId,
    type,
    title,
    message,
    refId,
    refModel
  });
  await notification.save();
  return notification;
};

exports.getUserNotifications = async (userId) => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);
  
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });
  
  return { notifications, unreadCount };
};

exports.markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
};
