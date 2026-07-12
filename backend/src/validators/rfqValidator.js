const { body } = require('express-validator');
const { RFQ_STATUS } = require('../config/constants');

exports.createRFQ = [
  body('title').trim().notEmpty(),
  body('quantity').isInt({ min: 1 }),
  body('deadline').isISO8601(),
  body('unit').optional().trim(),
  body('budget').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(RFQ_STATUS),
  body('vendors').optional().isArray(),
];

exports.updateRFQ = exports.createRFQ;
