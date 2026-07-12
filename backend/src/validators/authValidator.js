const { body } = require('express-validator');
const { ROLES } = require('../config/constants');

exports.signup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('company').optional().trim(),
  body('role').optional().isIn(Object.values(ROLES)),
];

exports.login = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.forgotPassword = [body('email').isEmail().normalizeEmail()];
exports.resetPassword = [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
];
exports.changePassword = [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
];
