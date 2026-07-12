const { ApiResponse } = require('../utils/ApiResponse');
const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getNotifications(req.user._id, req.query);
    ApiResponse.success(res, data);
  } catch (e) { next(e); }
};

exports.markRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    ApiResponse.success(res, { notification });
  } catch (e) { next(e); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await notificationService.markAllRead(req.user._id);
    ApiResponse.success(res, null, 'All notifications marked as read');
  } catch (e) { next(e); }
};
