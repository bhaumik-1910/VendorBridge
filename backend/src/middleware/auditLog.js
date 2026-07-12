const { AuditLog } = require('../models');

const auditLog = (action, resource) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode >= 400) return;
    try {
      await AuditLog.create({
        user: req.user?._id,
        action,
        resource,
        resourceId: req.params.id || req.body?.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'success',
      });
    } catch (e) {
      console.error('Audit log error:', e.message);
    }
  });
  next();
};

module.exports = auditLog;
