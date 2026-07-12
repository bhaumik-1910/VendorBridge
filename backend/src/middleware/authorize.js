const { ApiResponse } = require('../utils/ApiResponse');

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return ApiResponse.error(res, 'Not authorized', 401);
  }
  if (!roles.includes(req.user.role)) {
    return ApiResponse.error(res, 'You do not have permission to perform this action', 403);
  }
  next();
};

module.exports = authorize;
