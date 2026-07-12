const { body } = require('express-validator');
const { VENDOR_STATUS, VENDOR_RISK } = require('../config/constants');

exports.createVendor = [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('category').trim().notEmpty(),
  body('status').optional().isIn(VENDOR_STATUS),
  body('risk').optional().isIn(VENDOR_RISK),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
];

exports.updateVendor = exports.createVendor;
