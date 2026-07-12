const { Notification } = require('../models');

const createNotification = async ({ userId, title, message, type = 'info', link, metadata }) => {
  return Notification.create({ user: userId, title, message, type, link, metadata });
};

const notifyUsers = async (userIds, payload) => {
  const docs = userIds.map((userId) => ({ user: userId, ...payload }));
  return Notification.insertMany(docs);
};

module.exports = { createNotification, notifyUsers };
