const { validationResult } = require('express-validator');
const { ApiResponse } = require('../utils/ApiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  next();
};

module.exports = validate;
