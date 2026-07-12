const { body } = require('express-validator');

exports.submitQuotation = [
  body('rfq').notEmpty().withMessage('RFQ ID required'),
  body('price').isFloat({ min: 0 }),
  body('deliveryDays').isInt({ min: 1 }),
  body('notes').optional().trim(),
  body('lineItems').optional().isArray(),
];
