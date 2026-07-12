const { ApiResponse } = require('../utils/ApiResponse');
const config = require('../config');

const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return ApiResponse.error(res, 'Validation error', 422, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiResponse.error(res, `${field} already exists`, 409);
  }

  if (err.name === 'CastError') {
    return ApiResponse.error(res, 'Invalid ID format', 400);
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Session expired. Please sign in again.', 401);
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ApiResponse.error(res, 'File is too large. Maximum size is 10MB.', 413);
    }
    return ApiResponse.error(res, err.message || 'Upload failed', 400);
  }

  // Never expose raw SMTP / mail transport errors to clients
  const msg = err.message || '';
  if (
    err.code === 'EAUTH'
    || err.code === 'ESOCKET'
    || /535|smtp|gsmtp|invalid login|badcredentials/i.test(msg)
  ) {
    console.error('[Email transport error]', msg);
    return ApiResponse.error(
      res,
      'Email could not be sent. SMTP is not configured correctly — check server logs or disable SMTP for local development.',
      503
    );
  }

  const statusCode = err.statusCode || 500;
  const safeMessage = statusCode >= 500 && config.env === 'production'
    ? 'Internal server error'
    : (err.message || 'Internal server error');
  return ApiResponse.error(res, safeMessage, statusCode, err.errors || null);
};

const notFound = (req, res) => {
  ApiResponse.error(res, `Route not found: ${req.originalUrl}`, 404);
};

module.exports = { errorHandler, notFound };
