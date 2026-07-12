const { Notification } = require('../models');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const getNotifications = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = { user: userId };
  if (query.read !== undefined) filter.read = query.read === 'true';

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: userId, read: false }),
  ]);

  return { notifications, unreadCount, pagination: buildPaginationMeta(total, page, limit) };
};

const markAsRead = async (id, userId) =>
  Notification.findOneAndUpdate({ _id: id, user: userId }, { read: true }, { new: true });

const markAllRead = async (userId) =>
  Notification.updateMany({ user: userId, read: false }, { read: true });

module.exports = { getNotifications, markAsRead, markAllRead };
