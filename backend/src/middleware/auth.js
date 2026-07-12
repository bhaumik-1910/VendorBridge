const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ApiResponse } = require('../utils/ApiResponse');
const config = require('../config');

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : req.cookies?.accessToken || req.query?.token;

    if (!token) {
      return ApiResponse.error(res, 'Not authorized. Please login.', 401);
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user || !user.isActive || user.isDeleted) {
      return ApiResponse.error(res, 'User not found or inactive', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Not authorized. Invalid token.', 401);
  }
};

module.exports = protect;
