const { ActivityLog } = require('../models');

const logActivity = async ({ user, action, target, targetId, type = 'system', metadata = {} }) => {
  try {
    await ActivityLog.create({
      user: user?._id,
      userName: user?.name || 'System',
      action,
      target,
      targetId,
      type,
      metadata,
    });
  } catch (error) {
    console.error('Activity log error:', error.message);
  }
};

module.exports = logActivity;
