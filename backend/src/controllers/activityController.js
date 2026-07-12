const { ApiResponse } = require('../utils/ApiResponse');
const activityService = require('../services/activityService');

exports.getActivityLogs = async (req, res, next) => {
  try {
    const data = await activityService.getActivityLogs(req.query);
    ApiResponse.paginated(res, data.logs, data.pagination);
  } catch (e) { next(e); }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const data = await activityService.getAuditLogs(req.query);
    ApiResponse.paginated(res, data.logs, data.pagination);
  } catch (e) { next(e); }
};
