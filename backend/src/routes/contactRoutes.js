const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const contactController = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('subject').optional().trim(),
  ],
  validate,
  contactController.submitContact
);

module.exports = router;
